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
}

const OUTPUT_SCHEMA = `{
  "recommendations": [
    {
      "ticker": "AAPL",
      "company_name": "Apple Inc.",
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
        "earnings": { "score": 7.0, "inputs": ["input1"], "reasoning": "explanation" }
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
  marketData: MarketDataContext[]
): { system: string; user: string } {
  const holdingsSummary = holdings.length > 0
    ? holdings.map((h) => `${h.ticker}: ${h.shares} shares @ $${h.avg_cost}, sector: ${h.sector || "Unknown"}, P&L: ${h.current_pnl_pct?.toFixed(1) || "N/A"}%`).join("\n")
    : "No current holdings";

  const system = `You are AlphaEdge, a senior equity research analyst AI. Your job is to analyze stocks and produce structured, scored investment recommendations for a self-directed retail investor.

## User Profile
- Archetype: ${profile.archetype}
- Investing Style: ${profile.investing_style}
- Risk Tolerance: ${profile.risk_tolerance}/4
- Experience: Trades ${profile.instruments.join(", ")}
- Portfolio Size: $${profile.portfolio_balance.toLocaleString()}

## Current Holdings
${holdingsSummary}

## Instructions
Analyze the following stocks and return a JSON array of recommendations. For each stock:

1. Compute an AI Score (1.0-10.0) based on five equally-weighted factors:
   - Technical (moving averages, RSI, MACD, volume trends)
   - Fundamental (P/E vs sector, revenue growth, margins, debt ratios)
   - Sentiment (analyst consensus, price target distance, recent rating changes)
   - Momentum (price performance vs benchmark over 1W/1M/3M)
   - Earnings (EPS beat history, upcoming earnings proximity, guidance quality)

2. Each factor score must be 1.0-10.0 with explicit reasoning.

3. The overall AI Score is the weighted average, adjusted for the user's style:
   - Growth: weight Momentum and Earnings higher
   - Value: weight Fundamental higher
   - Momentum: weight Technical and Momentum higher
   - Income: weight Fundamental and Sentiment higher

4. Flag if the user already holds this stock. Avoid recommending stocks creating >25% single-sector concentration.

5. Express confidence as probability (0.0-1.0) the stock outperforms over the holding period.

6. All price targets, stop-losses, and position sizing must be specific numbers.

## Output Format
Return ONLY valid JSON matching this exact schema. No markdown, no preamble, no explanation outside the JSON:

${OUTPUT_SCHEMA}`;

  const marketDataStr = marketData.map((d) => (
    `--- ${d.ticker} (Current: $${d.price}) ---\nFundamentals: ${d.fundamentals}\nAnalyst Ratings: ${d.analystRatings}\nPrice History: ${d.historicalPrices}\nEarnings: ${d.earnings}`
  )).join("\n\n");

  const user = `Analyze these ${tickers.length} stocks and provide scored recommendations:\n\nTickers: ${tickers.join(", ")}\n\n${marketDataStr}`;

  return { system, user };
}

export function buildSingleStockPrompt(
  profile: ProfileContext,
  holdings: HoldingContext[],
  ticker: string,
  marketData: MarketDataContext
): { system: string; user: string } {
  return buildRecommendationPrompt(profile, holdings, [ticker], [marketData]);
}
