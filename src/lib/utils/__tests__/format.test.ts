import { describe, it, expect } from "vitest";
import { formatCurrency, formatPercent, getGainLossColor, getScoreColor, getGreeting } from "../format";

describe("formatCurrency", () => {
  it("formats positive numbers", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });
  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
  it("formats negative numbers", () => {
    expect(formatCurrency(-500)).toBe("-$500.00");
  });
});

describe("formatPercent", () => {
  it("formats positive with + prefix", () => {
    expect(formatPercent(5.5)).toBe("+5.50%");
  });
  it("formats negative", () => {
    expect(formatPercent(-3.2)).toBe("-3.20%");
  });
  it("formats zero", () => {
    expect(formatPercent(0)).toBe("+0.00%");
  });
});

describe("getGainLossColor", () => {
  it("returns green for positive", () => {
    expect(getGainLossColor(10)).toBe("text-gain-green");
  });
  it("returns red for negative", () => {
    expect(getGainLossColor(-5)).toBe("text-loss-red");
  });
  it("returns colorblind colors when enabled", () => {
    expect(getGainLossColor(10, true)).toBe("text-gain-alt-blue");
    expect(getGainLossColor(-5, true)).toBe("text-loss-alt-orange");
  });
});

describe("getScoreColor", () => {
  it("returns green for high scores", () => {
    expect(getScoreColor(8)).toBe("text-score-high");
  });
  it("returns amber for mid scores", () => {
    expect(getScoreColor(5)).toBe("text-score-mid");
  });
  it("returns red for low scores", () => {
    expect(getScoreColor(2)).toBe("text-score-low");
  });
});

describe("getGreeting", () => {
  it("returns a string", () => {
    expect(typeof getGreeting()).toBe("string");
  });
});
