/**
 * Risk analytics utilities for portfolio analysis.
 *
 * All return values use standard financial conventions:
 * - Returns are expressed as decimals (0.05 = 5%)
 * - Annualization assumes 252 trading days
 */

const TRADING_DAYS_PER_YEAR = 252;

/**
 * Compute daily returns from a price series.
 */
export function dailyReturns(prices: number[]): number[] {
  if (prices.length < 2) return [];
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] === 0) {
      returns.push(0);
    } else {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
  }
  return returns;
}

/**
 * Arithmetic mean of an array.
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Standard deviation (population).
 */
export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const squaredDiffs = values.map((v) => (v - avg) ** 2);
  return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length);
}

/**
 * Downside deviation — standard deviation of negative returns only.
 * Used in Sortino ratio calculation.
 */
export function downsideDev(returns: number[], threshold: number = 0): number {
  const downsideReturns = returns.filter((r) => r < threshold);
  if (downsideReturns.length === 0) return 0;
  const squaredDiffs = downsideReturns.map((r) => (r - threshold) ** 2);
  return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / returns.length);
}

/**
 * Sharpe Ratio — risk-adjusted return.
 * (annualized return - risk-free rate) / annualized volatility
 *
 * @param returns - Array of daily returns (decimals)
 * @param riskFreeRate - Annual risk-free rate (decimal, default 0.05 = 5%)
 */
export function sharpeRatio(returns: number[], riskFreeRate: number = 0.05): number | null {
  if (returns.length < 5) return null;
  const dailyRf = riskFreeRate / TRADING_DAYS_PER_YEAR;
  const excessReturns = returns.map((r) => r - dailyRf);
  const avgExcess = mean(excessReturns);
  const vol = stdDev(excessReturns);
  if (vol === 0) return null;
  return (avgExcess / vol) * Math.sqrt(TRADING_DAYS_PER_YEAR);
}

/**
 * Sortino Ratio — like Sharpe but only penalizes downside volatility.
 *
 * @param returns - Array of daily returns (decimals)
 * @param riskFreeRate - Annual risk-free rate (decimal)
 */
export function sortinoRatio(returns: number[], riskFreeRate: number = 0.05): number | null {
  if (returns.length < 5) return null;
  const dailyRf = riskFreeRate / TRADING_DAYS_PER_YEAR;
  const excessReturns = returns.map((r) => r - dailyRf);
  const avgExcess = mean(excessReturns);
  const downside = downsideDev(excessReturns);
  if (downside === 0) return null;
  return (avgExcess / downside) * Math.sqrt(TRADING_DAYS_PER_YEAR);
}

/**
 * Maximum drawdown from a price or portfolio value series.
 * Returns the worst peak-to-trough decline as a negative decimal.
 */
export function maxDrawdown(values: number[]): number {
  if (values.length < 2) return 0;
  let peak = values[0];
  let maxDd = 0;
  for (const value of values) {
    if (value > peak) peak = value;
    const dd = (value - peak) / peak;
    if (dd < maxDd) maxDd = dd;
  }
  return maxDd;
}

/**
 * Calmar Ratio — annualized return / |max drawdown|.
 */
export function calmarRatio(values: number[]): number | null {
  if (values.length < 10) return null;
  const totalReturn = (values[values.length - 1] - values[0]) / values[0];
  const periods = values.length / TRADING_DAYS_PER_YEAR;
  const annualizedReturn = Math.pow(1 + totalReturn, 1 / periods) - 1;
  const mdd = Math.abs(maxDrawdown(values));
  if (mdd === 0) return null;
  return annualizedReturn / mdd;
}

/**
 * Win rate — percentage of positive returns.
 */
export function winRate(returns: number[]): number {
  if (returns.length === 0) return 0;
  const wins = returns.filter((r) => r > 0).length;
  return wins / returns.length;
}

/**
 * Profit factor — gross profits / gross losses.
 */
export function profitFactor(returns: number[]): number | null {
  const grossProfit = returns.filter((r) => r > 0).reduce((sum, r) => sum + r, 0);
  const grossLoss = Math.abs(returns.filter((r) => r < 0).reduce((sum, r) => sum + r, 0));
  if (grossLoss === 0) return null;
  return grossProfit / grossLoss;
}

/**
 * Pearson correlation between two return series.
 */
export function correlation(seriesA: number[], seriesB: number[]): number | null {
  const n = Math.min(seriesA.length, seriesB.length);
  if (n < 5) return null;

  const a = seriesA.slice(0, n);
  const b = seriesB.slice(0, n);
  const meanA = mean(a);
  const meanB = mean(b);

  let sumProduct = 0;
  let sumSquareA = 0;
  let sumSquareB = 0;

  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    sumProduct += da * db;
    sumSquareA += da * da;
    sumSquareB += db * db;
  }

  const denom = Math.sqrt(sumSquareA * sumSquareB);
  if (denom === 0) return null;
  return sumProduct / denom;
}

/**
 * Annualized volatility from daily returns.
 */
export function annualizedVolatility(returns: number[]): number {
  return stdDev(returns) * Math.sqrt(TRADING_DAYS_PER_YEAR);
}

/**
 * Annualized return from daily returns.
 */
export function annualizedReturn(returns: number[]): number {
  if (returns.length === 0) return 0;
  const cumReturn = returns.reduce((acc, r) => acc * (1 + r), 1);
  const periods = returns.length / TRADING_DAYS_PER_YEAR;
  return Math.pow(cumReturn, 1 / periods) - 1;
}

/**
 * Full risk analytics summary from a price series.
 */
export function computeRiskAnalytics(
  prices: number[],
  riskFreeRate: number = 0.05
): {
  sharpe: number | null;
  sortino: number | null;
  maxDrawdown: number;
  calmar: number | null;
  annualizedReturn: number;
  annualizedVolatility: number;
  winRate: number;
  profitFactor: number | null;
} {
  const returns = dailyReturns(prices);
  return {
    sharpe: sharpeRatio(returns, riskFreeRate),
    sortino: sortinoRatio(returns, riskFreeRate),
    maxDrawdown: maxDrawdown(prices),
    calmar: calmarRatio(prices),
    annualizedReturn: annualizedReturn(returns),
    annualizedVolatility: annualizedVolatility(returns),
    winRate: winRate(returns),
    profitFactor: profitFactor(returns),
  };
}
