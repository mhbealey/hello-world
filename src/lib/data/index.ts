import type { DataProvider } from "./provider";
import { YahooFinanceProvider } from "./yahoo";
import { FinnhubProvider } from "./finnhub";

let provider: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (!provider) {
    provider = new DataProviderWithFallback();
  }
  return provider;
}

class DataProviderWithFallback implements DataProvider {
  private yahoo = new YahooFinanceProvider();
  private finnhub = new FinnhubProvider();

  private async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      const result = await primary();
      if (result === null || (Array.isArray(result) && result.length === 0)) {
        throw new Error("Empty result from primary");
      }
      return result;
    } catch (e) {
      console.warn(`Primary failed for ${context}, trying fallback:`, e instanceof Error ? e.message : e);
      try {
        return await fallback();
      } catch (e2) {
        console.error(`Fallback also failed for ${context}:`, e2 instanceof Error ? e2.message : e2);
        throw e2;
      }
    }
  }

  // Finnhub first (lightweight HTTP, serverless-friendly), Yahoo fallback
  async getQuote(ticker: string) {
    return this.withFallback(
      () => this.finnhub.getQuote(ticker),
      () => this.yahoo.getQuote(ticker),
      `getQuote(${ticker})`
    );
  }

  async getHistoricalPrices(ticker: string, range: string) {
    return this.withFallback(
      () => this.finnhub.getHistoricalPrices(ticker, range),
      () => this.yahoo.getHistoricalPrices(ticker, range),
      `getHistoricalPrices(${ticker})`
    );
  }

  async getFundamentals(ticker: string) {
    return this.withFallback(
      () => this.finnhub.getFundamentals(ticker),
      () => this.yahoo.getFundamentals(ticker),
      `getFundamentals(${ticker})`
    );
  }

  async getAnalystRatings(ticker: string) {
    return this.withFallback(
      () => this.finnhub.getAnalystRatings(ticker),
      () => this.yahoo.getAnalystRatings(ticker),
      `getAnalystRatings(${ticker})`
    );
  }

  async getEarningsCalendar(ticker: string) {
    return this.withFallback(
      () => this.finnhub.getEarningsCalendar(ticker),
      () => this.yahoo.getEarningsCalendar(ticker),
      `getEarningsCalendar(${ticker})`
    );
  }

  async getCompanyInfo(ticker: string) {
    return this.withFallback(
      () => this.finnhub.getCompanyInfo(ticker),
      () => this.yahoo.getCompanyInfo(ticker),
      `getCompanyInfo(${ticker})`
    );
  }

  async searchTicker(query: string) {
    return this.withFallback(
      () => this.finnhub.searchTicker(query),
      () => this.yahoo.searchTicker(query),
      `searchTicker(${query})`
    );
  }
}

export type { DataProvider } from "./provider";
