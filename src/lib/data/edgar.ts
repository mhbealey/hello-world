/**
 * SEC EDGAR client for structured financial data
 *
 * Uses the free EDGAR XBRL Company Facts API to get real financial filings data.
 * No API key required — just a proper User-Agent header (SEC requirement).
 *
 * Rate limit: 10 requests/second per SEC fair access policy.
 */

const EDGAR_BASE = "https://data.sec.gov";
const USER_AGENT = "AlphaEdge/1.0 (personal trading companion)";

// Simple rate limiter: track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 120; // ~8 req/s to stay safely under 10/s

async function edgarFetch(url: string): Promise<Response> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_REQUEST_INTERVAL_MS - elapsed));
  }
  lastRequestTime = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout
  try {
    return await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache filings for 24h
    });
  } finally {
    clearTimeout(timeout);
  }
}

// In-memory cache for CIK lookups
const cikCache = new Map<string, string>();

export interface EdgarFiling {
  accessionNumber: string;
  filingDate: string;
  form: string;
  primaryDocument: string;
}

export interface EdgarFinancials {
  ticker: string;
  cik: string;
  companyName: string;
  // Income statement
  revenue: FinancialSeries[];
  netIncome: FinancialSeries[];
  eps: FinancialSeries[];
  // Balance sheet
  totalAssets: FinancialSeries[];
  totalLiabilities: FinancialSeries[];
  stockholdersEquity: FinancialSeries[];
  cashAndEquivalents: FinancialSeries[];
  // Cash flow
  operatingCashFlow: FinancialSeries[];
  capitalExpenditure: FinancialSeries[];
  freeCashFlow: FinancialSeries[];
  // Shares
  sharesOutstanding: FinancialSeries[];
}

export interface FinancialSeries {
  period: string; // "CY2024Q3" or "CY2024"
  value: number;
  filingDate: string;
  form: string; // "10-K" or "10-Q"
}

/**
 * Look up a company's CIK number from ticker.
 * Uses SEC's company_tickers.json endpoint.
 */
async function tickerToCik(ticker: string): Promise<string | null> {
  const upper = ticker.toUpperCase();
  if (cikCache.has(upper)) return cikCache.get(upper)!;

  try {
    const res = await edgarFetch(`${EDGAR_BASE}/submissions/company_tickers.json`);
    if (!res.ok) return null;

    const data = await res.json();
    // Format: { "0": { "cik_str": 320193, "ticker": "AAPL", "title": "Apple Inc." }, ... }
    for (const key of Object.keys(data)) {
      const entry = data[key];
      if (entry.ticker?.toUpperCase() === upper) {
        const cik = String(entry.cik_str).padStart(10, "0");
        cikCache.set(upper, cik);
        return cik;
      }
    }
    return null;
  } catch (e) {
    console.error(`EDGAR CIK lookup failed for ${ticker}:`, e);
    return null;
  }
}

/**
 * Extract a specific XBRL fact series from company facts
 */
function extractFacts(
  companyFacts: Record<string, unknown>,
  taxonomy: string, // "us-gaap" or "dei"
  concept: string
): FinancialSeries[] {
  try {
    const taxData = (companyFacts as Record<string, Record<string, unknown>>)[taxonomy];
    if (!taxData) return [];

    const conceptData = taxData[concept] as Record<string, unknown> | undefined;
    if (!conceptData) return [];

    const units = conceptData.units as Record<string, Array<Record<string, unknown>>> | undefined;
    if (!units) return [];

    // Try USD first, then shares, then pure
    const unitData = units.USD || units.shares || units["USD/shares"] || units.pure;
    if (!unitData) return [];

    return unitData
      .filter((u) => u.form === "10-K" || u.form === "10-Q")
      .filter((u) => u.fp && u.fy) // Must have fiscal period and year
      .map((u) => ({
        period: `CY${u.fy}${u.fp === "FY" ? "" : u.fp}`,
        value: u.val as number,
        filingDate: u.filed as string,
        form: u.form as string,
      }))
      .sort((a, b) => a.filingDate.localeCompare(b.filingDate));
  } catch {
    return [];
  }
}

/**
 * Fetch structured financials for a company from EDGAR XBRL.
 */
export async function getEdgarFinancials(ticker: string): Promise<EdgarFinancials | null> {
  const cik = await tickerToCik(ticker);
  if (!cik) {
    console.warn(`No CIK found for ${ticker}`);
    return null;
  }

  try {
    const res = await edgarFetch(`${EDGAR_BASE}/api/xbrl/companyfacts/CIK${cik}.json`);
    if (!res.ok) {
      console.error(`EDGAR company facts failed for ${ticker} (CIK ${cik}): ${res.status}`);
      return null;
    }

    const data = await res.json();
    const facts = data.facts || {};

    return {
      ticker,
      cik,
      companyName: data.entityName || ticker,
      // Income statement
      revenue: extractFacts(facts, "us-gaap", "Revenues")
        .concat(extractFacts(facts, "us-gaap", "RevenueFromContractWithCustomerExcludingAssessedTax")),
      netIncome: extractFacts(facts, "us-gaap", "NetIncomeLoss"),
      eps: extractFacts(facts, "us-gaap", "EarningsPerShareDiluted"),
      // Balance sheet
      totalAssets: extractFacts(facts, "us-gaap", "Assets"),
      totalLiabilities: extractFacts(facts, "us-gaap", "Liabilities"),
      stockholdersEquity: extractFacts(facts, "us-gaap", "StockholdersEquity"),
      cashAndEquivalents: extractFacts(facts, "us-gaap", "CashAndCashEquivalentsAtCarryingValue"),
      // Cash flow
      operatingCashFlow: extractFacts(facts, "us-gaap", "NetCashProvidedByOperatingActivities"),
      capitalExpenditure: extractFacts(facts, "us-gaap", "PaymentsToAcquirePropertyPlantAndEquipment"),
      freeCashFlow: [], // Derived: operatingCashFlow - capitalExpenditure
      // Shares
      sharesOutstanding: extractFacts(facts, "dei", "EntityCommonStockSharesOutstanding"),
    };
  } catch (e) {
    console.error(`EDGAR financials fetch failed for ${ticker}:`, e);
    return null;
  }
}

/**
 * Get recent filings for a company
 */
export async function getRecentFilings(ticker: string, limit: number = 10): Promise<EdgarFiling[]> {
  const cik = await tickerToCik(ticker);
  if (!cik) return [];

  try {
    const res = await edgarFetch(`${EDGAR_BASE}/submissions/CIK${cik}.json`);
    if (!res.ok) return [];

    const data = await res.json();
    const recent = data.filings?.recent;
    if (!recent) return [];

    const filings: EdgarFiling[] = [];
    const len = Math.min(recent.accessionNumber?.length || 0, limit);
    for (let i = 0; i < len; i++) {
      filings.push({
        accessionNumber: recent.accessionNumber[i],
        filingDate: recent.filingDate[i],
        form: recent.form[i],
        primaryDocument: recent.primaryDocument[i],
      });
    }

    return filings;
  } catch (e) {
    console.error(`EDGAR filings fetch failed for ${ticker}:`, e);
    return [];
  }
}

/**
 * Build a financial context string for Claude prompts.
 * Extracts the most recent quarterly and annual data from EDGAR.
 */
export async function buildEdgarContext(ticker: string): Promise<string | null> {
  const fin = await getEdgarFinancials(ticker);
  if (!fin) return null;

  const lines: string[] = [`## SEC Filing Data (${fin.companyName})`];

  // Get latest annual revenue
  const annualRevenue = fin.revenue.filter((r) => r.form === "10-K");
  if (annualRevenue.length >= 2) {
    const latest = annualRevenue[annualRevenue.length - 1];
    const prior = annualRevenue[annualRevenue.length - 2];
    const growth = ((latest.value - prior.value) / prior.value * 100).toFixed(1);
    lines.push(`- Revenue (Annual): $${(latest.value / 1e9).toFixed(2)}B (${latest.period}, ${growth}% YoY)`);
  }

  // Latest quarterly revenue
  const qRevenue = fin.revenue.filter((r) => r.form === "10-Q");
  if (qRevenue.length > 0) {
    const latest = qRevenue[qRevenue.length - 1];
    lines.push(`- Revenue (Quarterly): $${(latest.value / 1e9).toFixed(2)}B (${latest.period})`);
  }

  // Net income trend
  const annualNI = fin.netIncome.filter((r) => r.form === "10-K");
  if (annualNI.length >= 2) {
    const latest = annualNI[annualNI.length - 1];
    const prior = annualNI[annualNI.length - 2];
    const growth = prior.value !== 0 ? ((latest.value - prior.value) / Math.abs(prior.value) * 100).toFixed(1) : "N/A";
    lines.push(`- Net Income (Annual): $${(latest.value / 1e9).toFixed(2)}B (${growth}% YoY)`);
  }

  // EPS
  const eps = fin.eps.filter((r) => r.form === "10-K");
  if (eps.length > 0) {
    const latest = eps[eps.length - 1];
    lines.push(`- EPS (Diluted): $${latest.value.toFixed(2)} (${latest.period})`);
  }

  // Balance sheet
  if (fin.totalAssets.length > 0) {
    const assets = fin.totalAssets[fin.totalAssets.length - 1];
    lines.push(`- Total Assets: $${(assets.value / 1e9).toFixed(2)}B`);
  }
  if (fin.cashAndEquivalents.length > 0) {
    const cash = fin.cashAndEquivalents[fin.cashAndEquivalents.length - 1];
    lines.push(`- Cash & Equivalents: $${(cash.value / 1e9).toFixed(2)}B`);
  }
  if (fin.totalLiabilities.length > 0 && fin.stockholdersEquity.length > 0) {
    const liab = fin.totalLiabilities[fin.totalLiabilities.length - 1];
    const eq = fin.stockholdersEquity[fin.stockholdersEquity.length - 1];
    const debtToEquity = eq.value !== 0 ? (liab.value / eq.value).toFixed(2) : "N/A";
    lines.push(`- Debt-to-Equity: ${debtToEquity}`);
  }

  // Cash flow
  if (fin.operatingCashFlow.length > 0) {
    const ocf = fin.operatingCashFlow[fin.operatingCashFlow.length - 1];
    lines.push(`- Operating Cash Flow: $${(ocf.value / 1e9).toFixed(2)}B`);
  }
  if (fin.operatingCashFlow.length > 0 && fin.capitalExpenditure.length > 0) {
    const ocf = fin.operatingCashFlow[fin.operatingCashFlow.length - 1];
    const capex = fin.capitalExpenditure[fin.capitalExpenditure.length - 1];
    const fcf = ocf.value - capex.value;
    lines.push(`- Free Cash Flow: $${(fcf / 1e9).toFixed(2)}B`);
  }

  if (lines.length <= 1) return null; // No data found
  return lines.join("\n");
}
