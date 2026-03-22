import type { DataProvider } from "./provider";
import type {
  Quote,
  PriceBar,
  Fundamentals,
  AnalystData,
  EarningsDate,
  CompanyInfo,
  SearchResult,
} from "@/lib/types";

// Dynamic import for yahoo-finance2 to avoid bundling on the client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let yahooFinance: any = null;

async function getYF() {
  if (!yahooFinance) {
    const mod = await import("yahoo-finance2");
    yahooFinance = mod.default;
  }
  return yahooFinance;
}

// Per-call timeout wrapper
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

const CALL_TIMEOUT = 8_000; // 8 seconds per Yahoo call

// Cache quoteSummary results to avoid redundant calls for the same ticker
const summaryCache = new Map<string, { data: Record<string, unknown>; ts: number }>();
const CACHE_TTL = 60_000; // 1 minute

async function getCachedSummary(ticker: string, modules: string[]): Promise<Record<string, unknown>> {
  const key = `${ticker}:${modules.sort().join(",")}`;
  const cached = summaryCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }
  const yf = await getYF();
  const data = await withTimeout(
    yf.quoteSummary(ticker, { modules }),
    CALL_TIMEOUT,
    `quoteSummary(${ticker})`
  ) as Record<string, unknown>;
  summaryCache.set(key, { data, ts: Date.now() });
  return data;
}

// All-in-one bulk fetch: single quoteSummary call per ticker with all modules
const ALL_MODULES = [
  "defaultKeyStatistics",
  "financialData",
  "summaryProfile",
  "recommendationTrend",
  "calendarEvents",
  "price",
];

export interface BulkTickerData {
  quote: Quote | null;
  fundamentals: Fundamentals | null;
  analysts: AnalystData | null;
  earnings: EarningsDate[];
}

export async function fetchBulkYahooData(tickers: string[]): Promise<Map<string, BulkTickerData>> {
  const results = new Map<string, BulkTickerData>();
  const yf = await getYF();

  const settled = await Promise.allSettled(
    tickers.map(async (ticker) => {
      // Single API call per ticker with all modules
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q: any = await withTimeout(
        yf.quoteSummary(ticker, { modules: ALL_MODULES }),
        CALL_TIMEOUT,
        `bulk(${ticker})`
      );

      const stats = q.defaultKeyStatistics;
      const fin = q.financialData;
      const profile = q.summaryProfile;
      const trend = q.recommendationTrend?.trend?.[0];
      const cal = q.calendarEvents?.earnings;
      const price = q.price;

      const data: BulkTickerData = {
        quote: {
          ticker,
          price: price?.regularMarketPrice ?? 0,
          change: price?.regularMarketChange ?? 0,
          changePercent: price?.regularMarketChangePercent ?? 0,
          volume: price?.regularMarketVolume ?? 0,
          previousClose: price?.regularMarketPreviousClose ?? 0,
          open: price?.regularMarketOpen ?? 0,
          high: price?.regularMarketDayHigh ?? 0,
          low: price?.regularMarketDayLow ?? 0,
        },
        fundamentals: {
          pe: stats?.trailingPE ?? stats?.forwardPE ?? null,
          ps: stats?.priceToSalesTrailing12Months ?? null,
          evEbitda: stats?.enterpriseToEbitda ?? null,
          debtEquity: fin?.debtToEquity ?? null,
          revenueGrowth: fin?.revenueGrowth ?? null,
          margins: {
            gross: fin?.grossMargins ?? null,
            operating: fin?.operatingMargins ?? null,
            net: fin?.profitMargins ?? null,
          },
          marketCap: stats?.enterpriseValue ?? null,
          sector: profile?.sector ?? null,
          industry: profile?.industry ?? null,
        },
        analysts: {
          buy: (trend?.strongBuy ?? 0) + (trend?.buy ?? 0),
          hold: trend?.hold ?? 0,
          sell: (trend?.sell ?? 0) + (trend?.strongSell ?? 0),
          targetMean: fin?.targetMeanPrice ?? null,
          targetHigh: fin?.targetHighPrice ?? null,
          targetLow: fin?.targetLowPrice ?? null,
        },
        earnings: cal?.earningsDate
          ? cal.earningsDate.map((d: Date) => ({
              date: new Date(d).toISOString().split("T")[0],
              estimate: cal.earningsAverage ?? null,
              actual: null,
            }))
          : [],
      };

      return { ticker, data };
    })
  );

  for (const result of settled) {
    if (result.status === "fulfilled") {
      results.set(result.value.ticker, result.value.data);
    }
  }

  return results;
}

export class YahooFinanceProvider implements DataProvider {
  async getQuote(ticker: string): Promise<Quote | null> {
    try {
      const yf = await getYF();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q: any = await withTimeout(yf.quote(ticker), CALL_TIMEOUT, `quote(${ticker})`);
      return {
        ticker,
        price: q.regularMarketPrice ?? 0,
        change: q.regularMarketChange ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
        volume: q.regularMarketVolume ?? 0,
        previousClose: q.regularMarketPreviousClose ?? 0,
        open: q.regularMarketOpen ?? 0,
        high: q.regularMarketDayHigh ?? 0,
        low: q.regularMarketDayLow ?? 0,
      };
    } catch (e) {
      console.error(`Yahoo getQuote failed for ${ticker}:`, e);
      return null;
    }
  }

  async getHistoricalPrices(ticker: string, range: string): Promise<PriceBar[]> {
    try {
      const yf = await getYF();
      const periodMap: Record<string, string> = {
        "1D": "1d", "1W": "5d", "1M": "1mo", "3M": "3mo",
        "6M": "6mo", "YTD": "ytd", "1Y": "1y", "ALL": "max",
      };
      const period = periodMap[range] || "1mo";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await withTimeout(yf.chart(ticker, { period1: period }), CALL_TIMEOUT, `chart(${ticker})`);
      return (result.quotes || []).map((bar: Record<string, unknown>) => ({
        date: new Date(bar.date as string).toISOString().split("T")[0],
        open: (bar.open as number) ?? 0,
        high: (bar.high as number) ?? 0,
        low: (bar.low as number) ?? 0,
        close: (bar.close as number) ?? 0,
        volume: (bar.volume as number) ?? 0,
      }));
    } catch (e) {
      console.error(`Yahoo getHistoricalPrices failed for ${ticker}:`, e);
      return [];
    }
  }

  async getFundamentals(ticker: string): Promise<Fundamentals | null> {
    try {
      const q = await getCachedSummary(ticker, ["defaultKeyStatistics", "financialData", "summaryProfile"]);
      const stats = (q as Record<string, Record<string, unknown>>).defaultKeyStatistics;
      const fin = (q as Record<string, Record<string, unknown>>).financialData;
      const profile = (q as Record<string, Record<string, unknown>>).summaryProfile;
      return {
        pe: (stats?.trailingPE ?? stats?.forwardPE ?? null) as number | null,
        ps: (stats?.priceToSalesTrailing12Months ?? null) as number | null,
        evEbitda: (stats?.enterpriseToEbitda ?? null) as number | null,
        debtEquity: (fin?.debtToEquity ?? null) as number | null,
        revenueGrowth: (fin?.revenueGrowth ?? null) as number | null,
        margins: {
          gross: (fin?.grossMargins ?? null) as number | null,
          operating: (fin?.operatingMargins ?? null) as number | null,
          net: (fin?.profitMargins ?? null) as number | null,
        },
        marketCap: (stats?.enterpriseValue ?? null) as number | null,
        sector: (profile?.sector ?? null) as string | null,
        industry: (profile?.industry ?? null) as string | null,
      };
    } catch (e) {
      console.error(`Yahoo getFundamentals failed for ${ticker}:`, e);
      return null;
    }
  }

  async getAnalystRatings(ticker: string): Promise<AnalystData | null> {
    try {
      const q = await getCachedSummary(ticker, ["recommendationTrend", "financialData"]);
      const trend = ((q as Record<string, Record<string, unknown>>).recommendationTrend as Record<string, unknown[]>)?.trend?.[0] as Record<string, number> | undefined;
      const fin = (q as Record<string, Record<string, unknown>>).financialData;
      return {
        buy: (trend?.strongBuy ?? 0) + (trend?.buy ?? 0),
        hold: trend?.hold ?? 0,
        sell: (trend?.sell ?? 0) + (trend?.strongSell ?? 0),
        targetMean: (fin?.targetMeanPrice ?? null) as number | null,
        targetHigh: (fin?.targetHighPrice ?? null) as number | null,
        targetLow: (fin?.targetLowPrice ?? null) as number | null,
      };
    } catch (e) {
      console.error(`Yahoo getAnalystRatings failed for ${ticker}:`, e);
      return null;
    }
  }

  async getEarningsCalendar(ticker: string): Promise<EarningsDate[]> {
    try {
      const q = await getCachedSummary(ticker, ["calendarEvents"]);
      const earnings = ((q as Record<string, Record<string, unknown>>).calendarEvents as Record<string, unknown>)?.earnings as Record<string, unknown> | undefined;
      if (!earnings?.earningsDate) return [];
      return (earnings.earningsDate as Date[]).map((d: Date) => ({
        date: new Date(d).toISOString().split("T")[0],
        estimate: (earnings.earningsAverage ?? null) as number | null,
        actual: null,
      }));
    } catch (e) {
      console.error(`Yahoo getEarningsCalendar failed for ${ticker}:`, e);
      return [];
    }
  }

  async getCompanyInfo(ticker: string): Promise<CompanyInfo | null> {
    try {
      const q = await getCachedSummary(ticker, ["summaryProfile", "price"]);
      const profile = (q as Record<string, Record<string, unknown>>).summaryProfile;
      const price = (q as Record<string, Record<string, unknown>>).price;
      return {
        name: (price?.longName ?? price?.shortName ?? ticker) as string,
        sector: (profile?.sector ?? "Unknown") as string,
        industry: (profile?.industry ?? "Unknown") as string,
        description: (profile?.longBusinessSummary ?? "") as string,
        marketCap: (price?.marketCap ?? 0) as number,
        employees: (profile?.fullTimeEmployees ?? null) as number | null,
      };
    } catch (e) {
      console.error(`Yahoo getCompanyInfo failed for ${ticker}:`, e);
      return null;
    }
  }

  async searchTicker(query: string): Promise<SearchResult[]> {
    try {
      const yf = await getYF();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any = await withTimeout(yf.search(query), CALL_TIMEOUT, `search(${query})`);
      return (results.quotes || [])
        .filter((q: Record<string, unknown>) => q.quoteType === "EQUITY")
        .slice(0, 8)
        .map((q: Record<string, unknown>) => ({
          ticker: (q.symbol as string) ?? "",
          name: (q.longname as string) ?? (q.shortname as string) ?? "",
          type: (q.quoteType as string) ?? "",
          exchange: (q.exchange as string) ?? "",
        }));
    } catch (e) {
      console.error(`Yahoo searchTicker failed for ${query}:`, e);
      return [];
    }
  }
}
