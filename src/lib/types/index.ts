export enum InvestingStyle {
  Growth = "growth",
  Value = "value",
  Momentum = "momentum",
  Income = "income",
}

export enum RiskTolerance {
  SellEverything = 1,
  TrimLosers = 2,
  HoldSteady = 3,
  BuyTheDip = 4,
}

export enum Rating {
  StrongBuy = "strong_buy",
  Buy = "buy",
  Hold = "hold",
  Sell = "sell",
  StrongSell = "strong_sell",
}

export enum TimeSensitivity {
  ActToday = "act_today",
  ThisWeek = "this_week",
  Monitor = "monitor",
}

export enum TradeAction {
  Buy = "buy",
  Sell = "sell",
}

export enum TradeStatus {
  Open = "open",
  Closed = "closed",
  Cancelled = "cancelled",
}

export enum TradeSource {
  AiRecommendation = "ai_recommendation",
  Manual = "manual",
}

export enum OrderType {
  Market = "market",
  Limit = "limit",
  StopLimit = "stop_limit",
}

export enum RecommendationStatus {
  Active = "active",
  Executed = "executed",
  Skipped = "skipped",
  Expired = "expired",
}

export interface Quote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
}

export interface PriceBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Fundamentals {
  pe: number | null;
  ps: number | null;
  evEbitda: number | null;
  debtEquity: number | null;
  revenueGrowth: number | null;
  margins: {
    gross: number | null;
    operating: number | null;
    net: number | null;
  };
  marketCap: number | null;
  sector: string | null;
  industry: string | null;
}

export interface AnalystData {
  buy: number;
  hold: number;
  sell: number;
  targetMean: number | null;
  targetHigh: number | null;
  targetLow: number | null;
}

export interface EarningsDate {
  date: string;
  estimate: number | null;
  actual: number | null;
}

export interface CompanyInfo {
  name: string;
  sector: string;
  industry: string;
  description: string;
  marketCap: number;
  employees: number | null;
}

export interface SearchResult {
  ticker: string;
  name: string;
  type: string;
  exchange: string;
}

export interface MarketStatus {
  open: boolean;
  status: "pre_market" | "market_open" | "after_hours" | "market_closed";
  nextOpen: Date;
}

export interface AlertItem {
  id: string;
  type: "stop_loss" | "take_profit" | "expiring_rec" | "stale_balance" | "unfinished_wizard" | "stock_split";
  ticker?: string;
  triggerPrice?: number;
  currentPrice?: number;
  tradeId?: number;
  recommendationId?: number;
  message: string;
}
