interface ProfileContext {
  archetype: string;
  investing_style: string;
  risk_tolerance: number;
  instruments: string[];
  portfolio_balance: number;
}

interface HoldingContext {
  ticker: string;
  shares: number;
  avg_cost: number;
}

interface MarketDataItem {
  ticker: string;
  price: number;
  change_pct: number;
  fundamentals: {
    pe?: number | null;
    ps?: number | null;
    evEbitda?: number | null;
    debtEquity?: number | null;
    revenueGrowth?: number | null;
    margins?: { gross?: number | null; operating?: number | null; net?: number | null } | null;
    marketCap?: number | null;
    sector?: string | null;
    industry?: string | null;
  } | null;
  assetClass: string;
}

export type { MarketDataItem };

export function buildRecommendationPrompt(
  profile: ProfileContext,
  holdings: HoldingContext[],
  tickers: string[],
  marketData: MarketDataItem[]
): { system: string; user: string } {
  const holdingsStr = holdings.length > 0
    ? holdings.map((h) => `${h.ticker}: ${h.shares} shares @ $${h.avg_cost}`).join(", ")
    : "None";

  const system = `You are a stock analyst. Score stocks and give trade recommendations.

User: ${profile.investing_style} investor, risk ${profile.risk_tolerance}/4, portfolio $${profile.portfolio_balance.toLocaleString()}
Holdings: ${holdingsStr}

For each stock return JSON with these fields ONLY:
- ticker, company_name, ai_score (1-10), rating (strong_buy/buy/hold/sell/strong_sell)
- confidence (0-1), thesis (one sentence)
- entry_price, stop_loss, take_profit, position_size_pct (0.01-0.10)
- time_sensitivity (act_today/this_week/monitor)

Return ONLY valid JSON: {"recommendations": [...]}`;

  const dataStr = marketData.map((d) => {
    const f = d.fundamentals;
    const metrics = f ? [
      f.pe != null ? `P/E:${f.pe.toFixed(1)}` : null,
      f.revenueGrowth != null ? `RevGrowth:${(f.revenueGrowth * 100).toFixed(0)}%` : null,
      f.margins?.net != null ? `NetMargin:${(f.margins.net * 100).toFixed(0)}%` : null,
      f.debtEquity != null ? `D/E:${f.debtEquity.toFixed(1)}` : null,
      f.sector ? `Sector:${f.sector}` : null,
    ].filter(Boolean).join(" | ") : "No data";
    return `${d.ticker} $${d.price} (${d.change_pct >= 0 ? "+" : ""}${d.change_pct.toFixed(1)}%) [${metrics}]`;
  }).join("\n");

  const user = `Score these ${tickers.length} stocks:\n${dataStr}`;

  return { system, user };
}

export function buildSingleStockPrompt(
  profile: ProfileContext,
  holdings: HoldingContext[],
  ticker: string,
  marketData: MarketDataItem
): { system: string; user: string } {
  return buildRecommendationPrompt(profile, holdings, [ticker], [marketData]);
}

export function buildBundlePrompt(
  profile: ProfileContext,
  holdings: HoldingContext[],
  bundleSize: number,
  filters: {
    asset_classes?: string[];
    min_score?: number;
    sectors?: string[];
    strategy?: string;
  },
  candidates: MarketDataItem[]
): { system: string; user: string } {
  const holdingsStr = holdings.length > 0
    ? holdings.map((h) => `${h.ticker}: ${h.shares} shares @ $${h.avg_cost}`).join(", ")
    : "None";

  const system = `You are a portfolio construction AI. Build a diversified ${bundleSize}-stock portfolio.

User: ${profile.investing_style} investor, risk ${profile.risk_tolerance}/4, portfolio $${profile.portfolio_balance.toLocaleString()}
Holdings: ${holdingsStr}
Strategy: ${filters.strategy || "balanced"}

For each pick return: ticker, company_name, weight_pct (sum to 1.0), ai_score (1-10), thesis, entry_price, stop_loss, take_profit.

Return ONLY valid JSON: {"bundle_name": "...", "strategy": "...", "total_score": N, "rationale": "...", "allocations": [...]}`;

  const dataStr = candidates.map((d) => {
    const f = d.fundamentals;
    const metrics = f ? [
      f.pe != null ? `P/E:${f.pe.toFixed(1)}` : null,
      f.revenueGrowth != null ? `RevGrowth:${(f.revenueGrowth * 100).toFixed(0)}%` : null,
      f.margins?.net != null ? `NetMargin:${(f.margins.net * 100).toFixed(0)}%` : null,
      f.sector ? `Sector:${f.sector}` : null,
    ].filter(Boolean).join(" | ") : "No data";
    return `${d.ticker} $${d.price} (${d.change_pct >= 0 ? "+" : ""}${d.change_pct.toFixed(1)}%) [${metrics}]`;
  }).join("\n");

  const user = `Pick ${bundleSize} stocks from:\n${dataStr}`;

  return { system, user };
}
