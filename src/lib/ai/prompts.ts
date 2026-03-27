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

interface MarketScanCandidate {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number | null;
  fiftyTwoWeekChangePercent: number;
  analystRating?: string;
  sources: string[];
}

export type { MarketDataItem };

/**
 * Prompt for the full market scan pipeline.
 * Claude receives pre-screened candidates from across the ENTIRE market
 * and selects the best opportunities to recommend.
 */
export function buildMarketScanPrompt(
  profile: ProfileContext,
  holdings: HoldingContext[],
  candidates: MarketScanCandidate[]
): { system: string; user: string } {
  const holdingsStr = holdings.length > 0
    ? holdings.map((h) => `${h.ticker}: ${h.shares} shares @ $${h.avg_cost}`).join(", ")
    : "None";

  const system = `You are an elite stock analyst at a quantitative hedge fund. You have been given pre-screened candidates from across the ENTIRE US equity market — these stocks were surfaced by automated screeners scanning day gainers, losers, most active, undervalued growth, small-cap movers, most shorted, and more.

Your job: analyze ALL candidates and select the BEST opportunities for this user. Return 8-15 actionable recommendations ranked by conviction.

User profile:
- Style: ${profile.investing_style} investor (archetype: ${profile.archetype})
- Risk tolerance: ${profile.risk_tolerance}/4
- Portfolio: $${profile.portfolio_balance.toLocaleString()}
- Current holdings: ${holdingsStr}
- Instruments: ${profile.instruments.join(", ") || "stocks"}

Selection criteria:
- Prioritize stocks matching the user's investing style
- Diversify across sectors — don't cluster in one industry
- Consider risk/reward asymmetry
- Flag any stocks the user already holds for position updates
- Include a mix of conviction levels (some high-confidence, some speculative)

For each recommendation return JSON with these fields ONLY:
- ticker, company_name, ai_score (1-10), rating (strong_buy/buy/hold/sell/strong_sell)
- confidence (0-1), thesis (one specific sentence — not generic)
- entry_price, stop_loss, take_profit, position_size_pct (0.01-0.10)
- time_sensitivity (act_today/this_week/monitor)

Return ONLY valid JSON: {"recommendations": [...]}`;

  const candidateLines = candidates.map((c) => {
    const parts = [
      `${c.ticker} (${c.name})`,
      `$${c.price.toFixed(2)}`,
      `${c.changePercent >= 0 ? "+" : ""}${c.changePercent.toFixed(1)}%`,
      c.marketCap > 0 ? `MCap:${formatMarketCap(c.marketCap)}` : null,
      c.pe != null ? `P/E:${c.pe.toFixed(1)}` : null,
      c.fiftyTwoWeekChangePercent ? `52W:${c.fiftyTwoWeekChangePercent > 0 ? "+" : ""}${c.fiftyTwoWeekChangePercent.toFixed(0)}%` : null,
      c.analystRating ? `Analyst:${c.analystRating}` : null,
      c.sources.length > 1 ? `[${c.sources.length} screeners]` : `[${c.sources[0]}]`,
    ].filter(Boolean).join(" | ");
    return parts;
  }).join("\n");

  const user = `Analyze these ${candidates.length} candidates surfaced from a full market scan and select the best 8-15:\n\n${candidateLines}`;

  return { system, user };
}

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `${(cap / 1e12).toFixed(1)}T`;
  if (cap >= 1e9) return `${(cap / 1e9).toFixed(1)}B`;
  if (cap >= 1e6) return `${(cap / 1e6).toFixed(0)}M`;
  return `${cap}`;
}

/**
 * Original prompt for scoring a specific list of tickers.
 */
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
