import { describe, it, expect } from "vitest";
import { isMarketOpen } from "../market-hours";

describe("isMarketOpen", () => {
  it("returns an object with open and status", () => {
    const result = isMarketOpen();
    expect(typeof result.open).toBe("boolean");
    expect(["pre_market", "market_open", "after_hours", "market_closed"]).toContain(result.status);
  });
});
