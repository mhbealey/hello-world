import { describe, it, expect } from "vitest";
import { computeArchetype, computeRiskScore } from "../archetype";

describe("computeArchetype", () => {
  it("returns Momentum Rider for growth + high risk + stocks + options", () => {
    const result = computeArchetype({
      style: "growth",
      riskTolerance: 4,
      instruments: ["stocks", "options"],
    });
    expect(result.name).toBe("Momentum Rider");
  });

  it("returns Steady Compounder for income + moderate risk", () => {
    const result = computeArchetype({
      style: "income",
      riskTolerance: 3,
      instruments: ["stocks", "etfs"],
    });
    expect(result.name).toBe("Steady Compounder");
  });

  it("returns fallback for unknown combination", () => {
    const result = computeArchetype({
      style: "unknown_style",
      riskTolerance: 3,
      instruments: ["futures"],
    });
    expect(result.name).toBe("Balanced Investor");
  });
});

describe("computeRiskScore", () => {
  it("scores conservative low", () => {
    expect(computeRiskScore(1, ["stocks"])).toBe(2);
  });
  it("adds for options and crypto", () => {
    expect(computeRiskScore(4, ["stocks", "options", "crypto"])).toBe(10);
  });
  it("caps at 10", () => {
    expect(computeRiskScore(4, ["stocks", "options", "crypto"])).toBeLessThanOrEqual(10);
  });
});
