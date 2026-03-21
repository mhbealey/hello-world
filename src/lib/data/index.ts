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
      console.warn(`Yahoo failed for ${context}, falling back to Finnhub:`, e);
      try {
        return await fallback();
      } catch (e2) {
        console.error(`Finnhub also failed for ${context}:`, e2);
        throw e2;
      }
    }
  }

  async getQuote(ticker: string) {
    return this.withFallback(
      () => this.yahoo.getQuote(ticker),
      () => this.finnhub.getQuote(ticker),
      `getQuote(${ticker})`
    );
  }

  async getHistoricalPrices(ticker: string, range: string) {
    return this.withFallback(
      () => this.yahoo.getHistoricalPrices(ticker, range),
      () => this.finnhub.getHistoricalPrices(ticker, range),
      `getHistoricalPrices(${ticker})`
    );
  }

  async getFundamentals(ticker: string) {
    return this.withFallback(
      () => this.yahoo.getFundamentals(ticker),
      () => this.finnhub.getFundamentals(ticker),
      `getFundamentals(${ticker})`
    );
  }

  async getAnalystRatings(ticker: string) {
    return this.withFallback(
      () => this.yahoo.getAnalystRatings(ticker),
      () => this.finnhub.getAnalystRatings(ticker),
      `getAnalystRatings(${ticker})`
    );
  }

  async getEarningsCalendar(ticker: string) {
    return this.withFallback(
      () => this.yahoo.getEarningsCalendar(ticker),
      () => this.finnhub.getEarningsCalendar(ticker),
      `getEarningsCalendar(${ticker})`
    );
  }

  async getCompanyInfo(ticker: string) {
    return this.withFallback(
      () => this.yahoo.getCompanyInfo(ticker),
      () => this.finnhub.getCompanyInfo(ticker),
      `getCompanyInfo(${ticker})`
    );
  }

  async searchTicker(query: string) {
    return this.withFallback(
      () => this.yahoo.searchTicker(query),
      () => this.finnhub.searchTicker(query),
      `searchTicker(${query})`
    );
  }
}

export type { DataProvider } from "./provider";
