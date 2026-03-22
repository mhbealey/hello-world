/**
 * Unified Benchmark Score (1-99)
 *
 * Converts multi-factor analysis into a single actionable score.
 *
 * Factor weights (total = 100%):
 *   Technical    12%
 *   Fundamental  22%
 *   Sentiment     8%
 *   Momentum     13%
 *   Earnings     13%
 *   Governance   17%
 *   Macro        15%
 *
 * Each factor is scored 1-10 internally, then weighted and mapped to 1-99.
 */

export interface FactorScores {
  technical: number;   // 1-10
  fundamental: number; // 1-10
  sentiment: number;   // 1-10
  momentum: number;    // 1-10
  earnings: number;    // 1-10
  governance: number;  // 1-10
  macro: number;       // 1-10
}

interface StyleWeights {
  technical: number;
  fundamental: number;
  sentiment: number;
  momentum: number;
  earnings: number;
  governance: number;
  macro: number;
}

const DEFAULT_WEIGHTS: StyleWeights = {
  technical: 0.12,
  fundamental: 0.22,
  sentiment: 0.08,
  momentum: 0.13,
  earnings: 0.13,
  governance: 0.17,
  macro: 0.15,
};

// Each override + DEFAULT_WEIGHTS merge must sum to 1.00
const STYLE_OVERRIDES: Record<string, Partial<StyleWeights>> = {
  //              tech  fund  sent  mom   earn  gov   macro = 1.00
  growth:   { technical: 0.10, fundamental: 0.17, sentiment: 0.07, momentum: 0.18, earnings: 0.18, governance: 0.13, macro: 0.17 },
  value:    { technical: 0.08, fundamental: 0.28, sentiment: 0.07, momentum: 0.10, earnings: 0.12, governance: 0.18, macro: 0.17 },
  momentum: { technical: 0.22, fundamental: 0.13, sentiment: 0.08, momentum: 0.22, earnings: 0.13, governance: 0.10, macro: 0.12 },
  income:   { technical: 0.07, fundamental: 0.25, sentiment: 0.10, momentum: 0.08, earnings: 0.12, governance: 0.20, macro: 0.18 },
};

function getWeights(investingStyle: string): StyleWeights {
  const overrides = STYLE_OVERRIDES[investingStyle];
  if (!overrides) return DEFAULT_WEIGHTS;
  return { ...DEFAULT_WEIGHTS, ...overrides };
}

/**
 * Compute the 1-99 benchmark score from factor scores
 */
export function computeBenchmarkScore(
  factors: FactorScores,
  investingStyle: string = "growth"
): number {
  const weights = getWeights(investingStyle);

  const weighted =
    factors.technical * weights.technical +
    factors.fundamental * weights.fundamental +
    factors.sentiment * weights.sentiment +
    factors.momentum * weights.momentum +
    factors.earnings * weights.earnings +
    factors.governance * weights.governance +
    factors.macro * weights.macro;

  // Map 1-10 weighted score to 1-99
  // weighted is in range [1, 10], map to [1, 99]
  const score = Math.round(((weighted - 1) / 9) * 98 + 1);
  return Math.max(1, Math.min(99, score));
}

/**
 * Score label for display
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Above Average";
  if (score >= 45) return "Average";
  if (score >= 30) return "Below Average";
  if (score >= 15) return "Weak";
  return "Very Weak";
}

/**
 * Rating derived from benchmark score
 */
export function scoreToRating(score: number): string {
  if (score >= 80) return "strong_buy";
  if (score >= 65) return "buy";
  if (score >= 40) return "hold";
  if (score >= 20) return "sell";
  return "strong_sell";
}

/**
 * Asset class display names
 */
export const ASSET_CLASSES = {
  stock: "Stock",
  etf: "ETF",
  bond: "Bond",
  reit: "REIT",
  commodity: "Commodity",
  business: "Private Business",
  real_estate: "Real Estate",
  crypto: "Cryptocurrency",
} as const;

export type AssetClass = keyof typeof ASSET_CLASSES;

/**
 * Filter config for bundle generation
 */
export interface BundleFilters {
  asset_classes?: AssetClass[];
  min_score?: number;
  max_risk_tolerance?: number;
  sectors?: string[];
  exclude_tickers?: string[];
}
