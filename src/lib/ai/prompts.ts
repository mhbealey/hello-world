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
  sector?: string;
  current_pnl_pct?: number;
}

interface MarketDataContext {
  ticker: string;
  price: number;
  fundamentals: string;
  analystRatings: string;
  historicalPrices: string;
  earnings: string;
  assetClass?: string;
  edgarFinancials?: string;
}

interface MacroContext {
  summary: string;
}

const OUTPUT_SCHEMA = `{
  "recommendations": [
    {
      "ticker": "AAPL",
      "company_name": "Apple Inc.",
      "asset_class": "stock",
      "ai_score": 7.8,
      "rating": "buy",
      "confidence": 0.72,
      "thesis": "One-line thesis here",
      "bull_case": { "headline": "Bull headline", "points": ["Point 1", "Point 2", "Point 3"] },
      "bear_case": { "headline": "Bear headline", "points": ["Point 1", "Point 2", "Point 3"] },
      "key_metrics": { "pe": 28.5, "pe_sector_avg": 31.2, "ps": 7.8, "ev_ebitda": 22.1, "debt_equity": 1.8, "revenue_growth": 0.08, "margins": { "gross": 0.45, "operating": 0.30, "net": 0.25 } },
      "factor_scores": {
        "technical": { "score": 7.5, "inputs": ["input1", "input2"], "reasoning": "explanation" },
        "fundamental": { "score": 8.0, "inputs": ["input1"], "reasoning": "explanation" },
        "sentiment": { "score": 7.0, "inputs": ["input1"], "reasoning": "explanation" },
        "momentum": { "score": 8.5, "inputs": ["input1"], "reasoning": "explanation" },
        "earnings": { "score": 7.0, "inputs": ["input1"], "reasoning": "explanation" },
        "governance": { "score": 7.5, "inputs": ["board_stability", "ceo_tenure"], "reasoning": "explanation" },
        "macro": { "score": 7.0, "inputs": ["rate_sensitivity", "cycle_positioning"], "reasoning": "explanation" }
      },
      "governance_details": {
        "board_changes": "Summary of recent board changes and impact",
        "ceo_changes": "CEO tenure, recent changes, succession risk",
        "ma_activity": "Recent or pending M&A, impact on valuation"
      },
      "entry_price": 185.50,
      "stop_loss": 178.00,
      "take_profit": 198.00,
      "order_type": "limit",
      "position_size_pct": 0.04,
      "time_sensitivity": "this_week",
      "holding_period": "2-4 weeks",
      "catalysts": [{ "date": "2026-04-15", "event": "Earnings Report", "description": "Q2 results" }],
      "comparable_companies": [{ "ticker": "MSFT", "ai_score": 7.2, "brief": "Similar profile" }],
      "full_analysis": "Multi-paragraph analysis..."
    }
  ]
}`;

export function buildRecommendationPrompt(
  profile: ProfileContext,
  holdings: HoldingContext[],
  tickers: string[],
  marketData: MarketDataContext[],
  macro?: MacroContext
): { system: string; user: string } {
  const holdingsSummary = holdings.length > 0
    ? holdings.map((h) => `${h.ticker}: ${h.shares} shares @ $${h.avg_cost}, sector: ${h.sector || "Unknown"}, P&L: ${h.current_pnl_pct?.toFixed(1) || "N/A"}%`).join("\n")
    : "No current holdings";

  const macroSection = macro?.summary
    ? `\n${macro.summary}\n`
    : "";

  const system = `You are AlphaEdge, a senior equity research analyst AI. Your job is to analyze assets and produce structured, scored investment recommendations for a self-directed retail investor.

## User Profile
- Archetype: ${profile.archetype}
- Investing Style: ${profile.investing_style}
- Risk Tolerance: ${profile.risk_tolerance}/4
- Experience: Trades ${profile.instruments.join(", ")}
- Portfolio Size: $${profile.portfolio_balance.toLocaleString()}

## Current Holdings
${holdingsSummary}
${macroSection}
## Instructions
Analyze the following assets and return a JSON array of recommendations. For each asset:

1. Compute an AI Score (1.0-10.0) based on SEVEN weighted factors:
   - Technical (12%): Moving averages, RSI, MACD, volume trends, support/resistance levels
   - Fundamental (22%): P/E vs sector, revenue growth, margins, debt ratios, FCF yield, book value. USE THE SEC FILING DATA PROVIDED — it contains real audited financials.
   - Sentiment (8%): Analyst consensus, price target distance, recent rating changes, short interest
   - Momentum (13%): Price performance vs benchmark over 1W/1M/3M, relative strength
   - Earnings (13%): EPS beat history, upcoming earnings proximity, guidance quality, revision trends
   - Governance (17%): Board composition & recent changes, CEO tenure & transitions, M&A activity & integration risk
   - Macro Alignment (15%): How well the asset is positioned given the CURRENT MACRO ENVIRONMENT above. Consider: rate sensitivity, sector cyclicality, inflation exposure, credit conditions, and economic cycle positioning.

2. Each factor score must be 1.0-10.0 with explicit reasoning and data inputs.

3. The overall AI Score is the weighted average, adjusted for the user's style:
   - Growth: weight Momentum, Earnings, and Macro higher
   - Value: weight Fundamental and Macro higher
   - Momentum: weight Technical and Momentum higher
   - Income: weight Fundamental, Sentiment, and Macro higher

4. For the Governance factor, specifically evaluate:
   - **Board Changes**: New directors, departures, activist involvement, committee restructuring
   - **CEO Changes**: Tenure length, recent transitions, track record of current CEO, succession planning
   - **M&A Activity**: Recent acquisitions/divestitures, pending deals, integration risks, strategic rationale
   - Score governance higher (7-10) for: stable experienced board, long-tenured successful CEO, strategic accretive M&A
   - Score governance lower (1-4) for: frequent turnover, activist battles, overpaid acquisitions, CEO departure without succession

5. For the Macro Alignment factor, evaluate:
   - How the current interest rate environment affects the company (rate-sensitive sectors, floating vs fixed debt)
   - Whether the company benefits or suffers in the current inflation/growth regime
   - Credit spread impact on the company's borrowing costs and sector
   - VIX/volatility regime implications for entry timing
   - Score macro higher (7-10) for: well-positioned for current cycle, low rate sensitivity when rates are high, strong pricing power in inflation
   - Score macro lower (1-4) for: wrong side of the cycle, high rate sensitivity in tight monetary policy, commodity cost pressure

6. Flag if the user already holds this stock. Avoid recommending stocks creating >25% single-sector concentration.

7. Express confidence as probability (0.0-1.0) the asset outperforms over the holding period.

8. All price targets, stop-losses, and position sizing must be specific numbers.

9. For non-stock assets (ETFs, bonds, REITs, commodities), adjust factor weights appropriately:
   - Bonds/debt: emphasize credit quality, yield, duration risk, and macro alignment over technical/momentum
   - REITs/real estate: emphasize FFO, occupancy, cap rates, location quality, and rate sensitivity
   - Commodities: emphasize supply/demand, inventory levels, seasonal patterns, and macro cycle
   - Set the "asset_class" field to the correct type

10. When SEC filing data is provided, cross-reference it against market-reported fundamentals. Flag any significant discrepancies.

## Output Format
Return ONLY valid JSON matching this exact schema. No markdown, no preamble, no explanation outside the JSON:

${OUTPUT_SCHEMA}`;

  const marketDataStr = marketData.map((d) => {
    let entry = `--- ${d.ticker} (Current: $${d.price}) [${d.assetClass || "stock"}] ---\nFundamentals: ${d.fundamentals}\nAnalyst Ratings: ${d.analystRatings}\nPrice History: ${d.historicalPrices}\nEarnings: ${d.earnings}`;
    if (d.edgarFinancials) {
      entry += `\n\nSEC Filing Data:\n${d.edgarFinancials}`;
    }
    return entry;
  }).join("\n\n");

  const user = `Analyze these ${tickers.length} assets and provide scored recommendations:\n\nTickers: ${tickers.join(", ")}\n\n${marketDataStr}`;

  return { system, user };
}

export function buildSingleStockPrompt(
  profile: ProfileContext,
  holdings: HoldingContext[],
  ticker: string,
  marketData: MarketDataContext,
  macro?: MacroContext
): { system: string; user: string } {
  return buildRecommendationPrompt(profile, holdings, [ticker], [marketData], macro);
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
  candidates: MarketDataContext[]
): { system: string; user: string } {
  const holdingsSummary = holdings.length > 0
    ? holdings.map((h) => `${h.ticker}: ${h.shares} shares @ $${h.avg_cost}`).join("\n")
    : "No current holdings";

  const filterDesc = [
    filters.asset_classes?.length ? `Asset classes: ${filters.asset_classes.join(", ")}` : null,
    filters.min_score ? `Minimum benchmark score: ${filters.min_score}` : null,
    filters.sectors?.length ? `Sectors: ${filters.sectors.join(", ")}` : null,
    filters.strategy ? `Strategy: ${filters.strategy}` : null,
  ].filter(Boolean).join("\n");

  const system = `You are AlphaEdge, a portfolio construction AI. Build an optimally diversified portfolio bundle.

## User Profile
- Style: ${profile.investing_style}
- Risk Tolerance: ${profile.risk_tolerance}/4
- Portfolio Size: $${profile.portfolio_balance.toLocaleString()}

## Current Holdings
${holdingsSummary}

## Filters
${filterDesc || "No specific filters"}

## Instructions
Select exactly ${bundleSize} assets for a diversified portfolio bundle. For each:
1. Score each asset using the 6-factor model (technical, fundamental, sentiment, momentum, earnings, governance)
2. Assign a weight_pct (0.0-1.0) that sums to 1.0 across all selections
3. Optimize for:
   - Diversification across sectors and asset classes
   - Risk-adjusted returns appropriate for the user's risk tolerance
   - Correlation minimization between holdings
   - The specified strategy and filters

Return ONLY valid JSON:
{
  "bundle_name": "Descriptive name",
  "strategy": "${filters.strategy || "balanced"}",
  "total_score": 72,
  "rationale": "2-3 sentence explanation of portfolio construction logic",
  "allocations": [
    {
      "ticker": "AAPL",
      "company_name": "Apple Inc.",
      "asset_class": "stock",
      "weight_pct": 0.20,
      "benchmark_score": 78,
      "ai_score": 7.8,
      "factor_scores": {
        "technical": 7.5,
        "fundamental": 8.0,
        "sentiment": 7.0,
        "momentum": 8.5,
        "earnings": 7.0,
        "governance": 7.5
      },
      "thesis": "Brief thesis",
      "entry_price": 185.50,
      "stop_loss": 178.00,
      "take_profit": 198.00
    }
  ]
}`;

  const marketDataStr = candidates.map((d) => (
    `--- ${d.ticker} ($${d.price}) [${d.assetClass || "stock"}] ---\nFundamentals: ${d.fundamentals}\nAnalyst: ${d.analystRatings}\nEarnings: ${d.earnings}`
  )).join("\n\n");

  const user = `Build a ${bundleSize}-asset portfolio bundle from these candidates:\n\n${marketDataStr}`;

  return { system, user };
}
