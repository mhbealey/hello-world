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

const YAHOO_TIMEOUT_MS = 8_000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let yahooFinance: any = null;

async function getYF() {
  if (!yahooFinance) {
    const mod = await import("yahoo-finance2");
    yahooFinance = mod.default;
  }
  return yahooFinance;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withTimeout(promise: Promise<any>, label: string): Promise<any> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${YAHOO_TIMEOUT_MS}ms`)), YAHOO_TIMEOUT_MS)
    ),
  ]);
}

export class YahooFinanceProvider implements DataProvider {
  async getQuote(ticker: string): Promise<Quote | null> {
    try {
      const yf = await getYF();
      const q = await withTimeout(yf.quote(ticker), `quote(${ticker})`);
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
      const result = await withTimeout(yf.chart(ticker, { period1: period }), `chart(${ticker})`);
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
      const yf = await getYF();
      const q = await withTimeout(yf.quoteSummary(ticker, {
        modules: ["defaultKeyStatistics", "financialData", "summaryProfile"],
      }), `fundamentals(${ticker})`);
      const stats = q.defaultKeyStatistics;
      const fin = q.financialData;
      return {
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
        sector: q.summaryProfile?.sector ?? null,
        industry: q.summaryProfile?.industry ?? null,
      };
    } catch (e) {
      console.error(`Yahoo getFundamentals failed for ${ticker}:`, e);
      return null;
    }
  }

  async getAnalystRatings(ticker: string): Promise<AnalystData | null> {
    try {
      const yf = await getYF();
      const q = await withTimeout(yf.quoteSummary(ticker, {
        modules: ["recommendationTrend", "financialData"],
      }), `analystRatings(${ticker})`);
      const trend = q.recommendationTrend?.trend?.[0];
      const fin = q.financialData;
      return {
        buy: (trend?.strongBuy ?? 0) + (trend?.buy ?? 0),
        hold: trend?.hold ?? 0,
        sell: (trend?.sell ?? 0) + (trend?.strongSell ?? 0),
        targetMean: fin?.targetMeanPrice ?? null,
        targetHigh: fin?.targetHighPrice ?? null,
        targetLow: fin?.targetLowPrice ?? null,
      };
    } catch (e) {
      console.error(`Yahoo getAnalystRatings failed for ${ticker}:`, e);
      return null;
    }
  }

  async getEarningsCalendar(ticker: string): Promise<EarningsDate[]> {
    try {
      const yf = await getYF();
      const q = await withTimeout(yf.quoteSummary(ticker, { modules: ["calendarEvents"] }), `earnings(${ticker})`);
      const earnings = q.calendarEvents?.earnings;
      if (!earnings?.earningsDate) return [];
      return earnings.earningsDate.map((d: Date) => ({
        date: new Date(d).toISOString().split("T")[0],
        estimate: earnings.earningsAverage ?? null,
        actual: null,
      }));
    } catch (e) {
      console.error(`Yahoo getEarningsCalendar failed for ${ticker}:`, e);
      return [];
    }
  }

  async getCompanyInfo(ticker: string): Promise<CompanyInfo | null> {
    try {
      const yf = await getYF();
      const q = await withTimeout(yf.quoteSummary(ticker, {
        modules: ["summaryProfile", "price"],
      }), `companyInfo(${ticker})`);
      const profile = q.summaryProfile;
      const price = q.price;
      return {
        name: price?.longName ?? price?.shortName ?? ticker,
        sector: profile?.sector ?? "Unknown",
        industry: profile?.industry ?? "Unknown",
        description: profile?.longBusinessSummary ?? "",
        marketCap: price?.marketCap ?? 0,
        employees: profile?.fullTimeEmployees ?? null,
      };
    } catch (e) {
      console.error(`Yahoo getCompanyInfo failed for ${ticker}:`, e);
      return null;
    }
  }

  async searchTicker(query: string): Promise<SearchResult[]> {
    try {
      const yf = await getYF();
      const results = await withTimeout(yf.search(query), `search(${query})`);
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
