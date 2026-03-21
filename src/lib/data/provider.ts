import type {
  Quote,
  PriceBar,
  Fundamentals,
  AnalystData,
  EarningsDate,
  CompanyInfo,
  SearchResult,
} from "@/lib/types";

export interface DataProvider {
  getQuote(ticker: string): Promise<Quote | null>;
  getHistoricalPrices(ticker: string, range: string): Promise<PriceBar[]>;
  getFundamentals(ticker: string): Promise<Fundamentals | null>;
  getAnalystRatings(ticker: string): Promise<AnalystData | null>;
  getEarningsCalendar(ticker: string): Promise<EarningsDate[]>;
  getCompanyInfo(ticker: string): Promise<CompanyInfo | null>;
  searchTicker(query: string): Promise<SearchResult[]>;
}
