import { describe, it, expect } from "vitest";
import {
  dailyReturns,
  mean,
  stdDev,
  downsideDev,
  sharpeRatio,
  sortinoRatio,
  maxDrawdown,
  winRate,
  profitFactor,
  correlation,
  annualizedVolatility,
  annualizedReturn,
  computeRiskAnalytics,
} from "../risk";

describe("dailyReturns", () => {
  it("computes returns from prices", () => {
    const prices = [100, 105, 102, 110];
    const returns = dailyReturns(prices);
    expect(returns).toHaveLength(3);
    expect(returns[0]).toBeCloseTo(0.05, 5);
    expect(returns[1]).toBeCloseTo(-0.02857, 4);
    expect(returns[2]).toBeCloseTo(0.07843, 4);
  });

  it("handles empty/single price", () => {
    expect(dailyReturns([])).toEqual([]);
    expect(dailyReturns([100])).toEqual([]);
  });

  it("handles zero price gracefully", () => {
    const returns = dailyReturns([0, 100]);
    expect(returns[0]).toBe(0);
  });
});

describe("mean", () => {
  it("computes arithmetic mean", () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
    expect(mean([10])).toBe(10);
  });

  it("returns 0 for empty array", () => {
    expect(mean([])).toBe(0);
  });
});

describe("stdDev", () => {
  it("computes population standard deviation", () => {
    const result = stdDev([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(result).toBeCloseTo(2.0, 1);
  });

  it("returns 0 for < 2 values", () => {
    expect(stdDev([])).toBe(0);
    expect(stdDev([5])).toBe(0);
  });
});

describe("downsideDev", () => {
  it("only considers negative returns", () => {
    const returns = [0.05, -0.03, 0.02, -0.01, 0.04];
    const dd = downsideDev(returns);
    expect(dd).toBeGreaterThan(0);
  });

  it("returns 0 when all returns are positive", () => {
    expect(downsideDev([0.01, 0.02, 0.03])).toBe(0);
  });
});

describe("sharpeRatio", () => {
  it("returns null for insufficient data", () => {
    expect(sharpeRatio([0.01, 0.02])).toBeNull();
  });

  it("returns a number for valid data", () => {
    const returns = Array.from({ length: 50 }, () => 0.001 + Math.random() * 0.01 - 0.005);
    const result = sharpeRatio(returns, 0.05);
    expect(result).not.toBeNull();
    expect(typeof result).toBe("number");
  });

  it("returns null for zero volatility", () => {
    const returns = Array(20).fill(0.05 / 252); // Exactly the risk-free rate daily
    expect(sharpeRatio(returns, 0.05)).toBeNull();
  });
});

describe("sortinoRatio", () => {
  it("returns null for insufficient data", () => {
    expect(sortinoRatio([0.01])).toBeNull();
  });

  it("returns a number for valid data", () => {
    const returns = [0.01, -0.005, 0.008, -0.003, 0.012, -0.001, 0.007];
    const result = sortinoRatio(returns);
    expect(result).not.toBeNull();
  });
});

describe("maxDrawdown", () => {
  it("computes worst peak-to-trough decline", () => {
    // Peak at 120, trough at 90 => -25%
    const values = [100, 110, 120, 100, 90, 95, 105];
    expect(maxDrawdown(values)).toBeCloseTo(-0.25, 5);
  });

  it("returns 0 for monotonically increasing series", () => {
    expect(maxDrawdown([100, 110, 120, 130])).toBe(0);
  });

  it("returns 0 for insufficient data", () => {
    expect(maxDrawdown([100])).toBe(0);
    expect(maxDrawdown([])).toBe(0);
  });
});

describe("winRate", () => {
  it("computes percentage of positive returns", () => {
    expect(winRate([0.05, -0.03, 0.02, -0.01, 0.04])).toBeCloseTo(0.6, 5);
  });

  it("returns 0 for empty array", () => {
    expect(winRate([])).toBe(0);
  });

  it("returns 1 when all positive", () => {
    expect(winRate([0.01, 0.02, 0.03])).toBe(1);
  });
});

describe("profitFactor", () => {
  it("computes gross profit / gross loss", () => {
    const returns = [0.10, -0.05, 0.08, -0.03];
    // Gross profit: 0.18, Gross loss: 0.08
    expect(profitFactor(returns)).toBeCloseTo(2.25, 5);
  });

  it("returns null when no losses", () => {
    expect(profitFactor([0.01, 0.02])).toBeNull();
  });
});

describe("correlation", () => {
  it("returns 1 for perfectly correlated series", () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const b = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    expect(correlation(a, b)).toBeCloseTo(1.0, 5);
  });

  it("returns -1 for perfectly inversely correlated series", () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const b = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
    expect(correlation(a, b)).toBeCloseTo(-1.0, 5);
  });

  it("returns null for insufficient data", () => {
    expect(correlation([1, 2], [3, 4])).toBeNull();
  });

  it("handles different length series", () => {
    const a = [1, 2, 3, 4, 5, 6, 7];
    const b = [2, 4, 6, 8, 10];
    const result = correlation(a, b);
    expect(result).not.toBeNull();
    expect(result).toBeCloseTo(1.0, 5);
  });
});

describe("annualizedVolatility", () => {
  it("scales daily vol by sqrt(252)", () => {
    // Daily vol of ~1% should annualize to ~15.87%
    const returns = Array.from({ length: 100 }, (_, i) => (i % 2 === 0 ? 0.01 : -0.01));
    const vol = annualizedVolatility(returns);
    expect(vol).toBeGreaterThan(0.1);
    expect(vol).toBeLessThan(0.2);
  });
});

describe("annualizedReturn", () => {
  it("computes annualized return from daily returns", () => {
    // 252 days of 0.04% daily = ~10.6% annualized
    const returns = Array(252).fill(0.0004);
    const result = annualizedReturn(returns);
    expect(result).toBeCloseTo(0.106, 1);
  });

  it("returns 0 for empty array", () => {
    expect(annualizedReturn([])).toBe(0);
  });
});

describe("computeRiskAnalytics", () => {
  it("returns full analytics object from prices", () => {
    const prices = Array.from({ length: 100 }, (_, i) => 100 + i * 0.5 + Math.sin(i) * 3);
    const analytics = computeRiskAnalytics(prices);

    expect(analytics).toHaveProperty("sharpe");
    expect(analytics).toHaveProperty("sortino");
    expect(analytics).toHaveProperty("maxDrawdown");
    expect(analytics).toHaveProperty("annualizedReturn");
    expect(analytics).toHaveProperty("annualizedVolatility");
    expect(analytics).toHaveProperty("winRate");
    expect(analytics).toHaveProperty("profitFactor");
    expect(analytics.maxDrawdown).toBeLessThanOrEqual(0);
    expect(analytics.winRate).toBeGreaterThanOrEqual(0);
    expect(analytics.winRate).toBeLessThanOrEqual(1);
  });
});
