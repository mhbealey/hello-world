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

const FINNHUB_BASE = "https://finnhub.io/api/v1";

async function finnhubFetch(path: string) {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY not set");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch(`${FINNHUB_BASE}${path}&token=${key}`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Finnhub ${res.status}: ${res.statusText}`);
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export class FinnhubProvider implements DataProvider {
  async getQuote(ticker: string): Promise<Quote | null> {
    try {
      const data = await finnhubFetch(`/quote?symbol=${ticker}`);
      return {
        ticker,
        price: data.c ?? 0,
        change: data.d ?? 0,
        changePercent: data.dp ?? 0,
        volume: 0,
        previousClose: data.pc ?? 0,
        open: data.o ?? 0,
        high: data.h ?? 0,
        low: data.l ?? 0,
      };
    } catch (e) {
      console.error(`Finnhub getQuote failed for ${ticker}:`, e);
      return null;
    }
  }

  async getHistoricalPrices(ticker: string, range: string): Promise<PriceBar[]> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const rangeSeconds: Record<string, number> = {
        "1D": 86400, "1W": 604800, "1M": 2592000, "3M": 7776000,
        "6M": 15552000, "1Y": 31536000, "ALL": 157680000,
      };
      const from = now - (rangeSeconds[range] || 2592000);
      const data = await finnhubFetch(
        `/stock/candle?symbol=${ticker}&resolution=D&from=${from}&to=${now}`
      );
      if (data.s !== "ok" || !data.c) return [];
      return data.c.map((_: unknown, i: number) => ({
        date: new Date(data.t[i] * 1000).toISOString().split("T")[0],
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i],
      }));
    } catch (e) {
      console.error(`Finnhub getHistoricalPrices failed for ${ticker}:`, e);
      return [];
    }
  }

  async getFundamentals(ticker: string): Promise<Fundamentals | null> {
    try {
      const data = await finnhubFetch(`/stock/metric?symbol=${ticker}&metric=all`);
      const m = data.metric || {};
      return {
        pe: m.peBasicExclExtraTTM ?? null,
        ps: m.psTTM ?? null,
        evEbitda: m.evToEbitda ?? null,
        debtEquity: m.totalDebtToEquityQuarterly ?? null,
        revenueGrowth: m.revenueGrowthQuarterlyYoy ?? null,
        margins: {
          gross: m.grossMarginTTM ? m.grossMarginTTM / 100 : null,
          operating: m.operatingMarginTTM ? m.operatingMarginTTM / 100 : null,
          net: m.netProfitMarginTTM ? m.netProfitMarginTTM / 100 : null,
        },
        marketCap: m.marketCapitalization ?? null,
        sector: null,
        industry: null,
      };
    } catch (e) {
      console.error(`Finnhub getFundamentals failed for ${ticker}:`, e);
      return null;
    }
  }

  async getAnalystRatings(ticker: string): Promise<AnalystData | null> {
    try {
      const data = await finnhubFetch(`/stock/recommendation?symbol=${ticker}`);
      if (!data.length) return null;
      const latest = data[0];
      return {
        buy: (latest.strongBuy ?? 0) + (latest.buy ?? 0),
        hold: latest.hold ?? 0,
        sell: (latest.sell ?? 0) + (latest.strongSell ?? 0),
        targetMean: null,
        targetHigh: null,
        targetLow: null,
      };
    } catch (e) {
      console.error(`Finnhub getAnalystRatings failed for ${ticker}:`, e);
      return null;
    }
  }

  async getEarningsCalendar(ticker: string): Promise<EarningsDate[]> {
    try {
      const now = new Date();
      const future = new Date(now.getTime() + 90 * 86400000);
      const from = now.toISOString().split("T")[0];
      const to = future.toISOString().split("T")[0];
      const data = await finnhubFetch(
        `/calendar/earnings?symbol=${ticker}&from=${from}&to=${to}`
      );
      return (data.earningsCalendar || []).map((e: Record<string, unknown>) => ({
        date: (e.date as string) ?? "",
        estimate: (e.epsEstimate as number) ?? null,
        actual: (e.epsActual as number) ?? null,
      }));
    } catch (e) {
      console.error(`Finnhub getEarningsCalendar failed for ${ticker}:`, e);
      return [];
    }
  }

  async getCompanyInfo(ticker: string): Promise<CompanyInfo | null> {
    try {
      const data = await finnhubFetch(`/stock/profile2?symbol=${ticker}`);
      return {
        name: data.name ?? ticker,
        sector: data.finnhubIndustry ?? "Unknown",
        industry: data.finnhubIndustry ?? "Unknown",
        description: "",
        marketCap: data.marketCapitalization ?? 0,
        employees: null,
      };
    } catch (e) {
      console.error(`Finnhub getCompanyInfo failed for ${ticker}:`, e);
      return null;
    }
  }

  async searchTicker(query: string): Promise<SearchResult[]> {
    try {
      const data = await finnhubFetch(`/search?q=${encodeURIComponent(query)}`);
      return (data.result || [])
        .filter((r: Record<string, unknown>) => r.type === "Common Stock")
        .slice(0, 8)
        .map((r: Record<string, unknown>) => ({
          ticker: (r.symbol as string) ?? "",
          name: (r.description as string) ?? "",
          type: (r.type as string) ?? "",
          exchange: (r.displaySymbol as string) ?? "",
        }));
    } catch (e) {
      console.error(`Finnhub searchTicker failed for ${query}:`, e);
      return [];
    }
  }
}
