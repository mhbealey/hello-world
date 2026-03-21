import { describe, it, expect } from "vitest";
import { formatCurrency } from "../format";

describe("formatCurrency", () => {
  it("should be defined", () => {
    expect(formatCurrency).toBeDefined();
  });
});
