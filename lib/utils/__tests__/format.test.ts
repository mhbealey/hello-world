import { describe, it, expect } from "vitest";
import { formatALE, formatDollars, formatPct, formatMOIC, formatIRR } from "../format";

describe("formatALE", () => {
  it("formats millions", () => {
    expect(formatALE(4_680_000_000)).toBe("$47M");
  });

  it("formats billions", () => {
    expect(formatALE(120_000_000_000)).toBe("$1.2B");
  });
});

describe("formatDollars", () => {
  it("formats billions", () => {
    expect(formatDollars(120_000_000_000)).toBe("$1.2B");
  });
});

describe("formatPct", () => {
  it("formats percentage", () => {
    expect(formatPct(91)).toBe("91%");
  });
});

describe("formatMOIC", () => {
  it("formats MOIC", () => {
    expect(formatMOIC(1.82)).toBe("1.82x");
  });

  it("returns dash for null", () => {
    expect(formatMOIC(null)).toBe("—");
  });
});

describe("formatIRR", () => {
  it("formats IRR", () => {
    expect(formatIRR(18.6)).toBe("18.6%");
  });

  it("returns dash for null", () => {
    expect(formatIRR(null)).toBe("—");
  });
});
