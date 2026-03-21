import { describe, it, expect } from "vitest";
import { calculatePositionSize, calculateRiskReward, calculatePnl } from "../calculations";

describe("calculatePositionSize", () => {
  it("calculates correct position size", () => {
    const result = calculatePositionSize(50000, 0.02, 100, 95);
    expect(result.shares).toBe(200);
    expect(result.dollarAmount).toBe(20000);
    expect(result.portfolioPct).toBeCloseTo(0.4);
  });
  it("handles small risk per share", () => {
    const result = calculatePositionSize(50000, 0.05, 10, 9.99);
    expect(result.shares).toBeGreaterThan(0);
    expect(result.dollarAmount).toBeGreaterThan(0);
  });
});

describe("calculateRiskReward", () => {
  it("calculates correct R:R ratio", () => {
    const result = calculateRiskReward(100, 95, 115);
    expect(result.ratio).toBeCloseTo(3);
    expect(result.riskDollars).toBe(5);
    expect(result.rewardDollars).toBe(15);
    expect(result.riskPct).toBeCloseTo(5);
    expect(result.rewardPct).toBeCloseTo(15);
  });
});

describe("calculatePnl", () => {
  it("calculates profit correctly", () => {
    const result = calculatePnl(100, 120, 10);
    expect(result.dollars).toBe(200);
    expect(result.percent).toBeCloseTo(20);
  });
  it("calculates loss correctly", () => {
    const result = calculatePnl(100, 80, 10);
    expect(result.dollars).toBe(-200);
    expect(result.percent).toBeCloseTo(-20);
  });
});
