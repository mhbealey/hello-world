import { describe, it, expect } from "vitest";
import { isMarketOpen } from "../market-hours";

describe("isMarketOpen", () => {
  it("returns an object with open and status", () => {
    const result = isMarketOpen();
    expect(typeof result.open).toBe("boolean");
    expect(["pre_market", "market_open", "after_hours", "market_closed"]).toContain(result.status);
  });

  it("detects market open during trading hours", () => {
    // Wednesday March 18 2026 at 11:00 AM ET = 16:00 UTC
    const wed11am = new Date("2026-03-18T16:00:00Z");
    const result = isMarketOpen(wed11am);
    expect(result.open).toBe(true);
    expect(result.status).toBe("market_open");
  });

  it("detects market closed on weekends", () => {
    // Saturday March 21 2026 at 12:00 PM ET
    const sat = new Date("2026-03-21T17:00:00Z");
    const result = isMarketOpen(sat);
    expect(result.open).toBe(false);
    expect(result.status).toBe("market_closed");
  });

  it("detects pre-market hours", () => {
    // Wednesday March 18 2026 at 8:00 AM ET = 13:00 UTC
    const wed8am = new Date("2026-03-18T13:00:00Z");
    const result = isMarketOpen(wed8am);
    expect(result.open).toBe(false);
    expect(result.status).toBe("pre_market");
  });

  it("detects after hours", () => {
    // Wednesday March 18 2026 at 5:00 PM ET = 22:00 UTC
    const wed5pm = new Date("2026-03-18T22:00:00Z");
    const result = isMarketOpen(wed5pm);
    expect(result.open).toBe(false);
    expect(result.status).toBe("after_hours");
  });

  it("detects Christmas 2026 as closed (observed Friday Dec 25)", () => {
    // Dec 25 2026 is a Friday — holiday
    const xmas = new Date("2026-12-25T17:00:00Z");
    const result = isMarketOpen(xmas);
    expect(result.open).toBe(false);
    expect(result.status).toBe("market_closed");
  });

  it("detects New Year 2027 as closed (observed)", () => {
    // Jan 1 2027 is a Friday — holiday
    const ny = new Date("2027-01-01T17:00:00Z");
    const result = isMarketOpen(ny);
    expect(result.open).toBe(false);
    expect(result.status).toBe("market_closed");
  });

  it("works for 2028 (leap year, different holiday dates)", () => {
    // July 4 2028 is a Tuesday — should be closed
    const jul4 = new Date("2028-07-04T17:00:00Z");
    const result = isMarketOpen(jul4);
    expect(result.open).toBe(false);
    expect(result.status).toBe("market_closed");
  });

  it("handles Good Friday correctly for 2026", () => {
    // Good Friday 2026 is April 3
    const gf = new Date("2026-04-03T17:00:00Z");
    const result = isMarketOpen(gf);
    expect(result.open).toBe(false);
    expect(result.status).toBe("market_closed");
  });
});
