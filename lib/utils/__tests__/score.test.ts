import { describe, it, expect } from "vitest";
import { freshnessIndicator, lpDeadlineStyle } from "../score";

describe("freshnessIndicator", () => {
  it("returns current for < 7 days", () => {
    const result = freshnessIndicator(3);
    expect(result.label).toBe("Current");
    expect(result.color).toBe("bg-success");
  });

  it("returns warning for 7-30 days", () => {
    const result = freshnessIndicator(15);
    expect(result.label).toBe("Updated 15 days ago");
    expect(result.color).toBe("bg-warning");
  });

  it("returns stale for > 30 days", () => {
    const result = freshnessIndicator(45);
    expect(result.label).toBe("Stale");
    expect(result.color).toBe("bg-danger");
  });
});

describe("lpDeadlineStyle", () => {
  it("returns normal for 14+ days", () => {
    const result = lpDeadlineStyle(42);
    expect(result.className).toContain("text-textSecondary");
  });

  it("returns amber for 7-14 days", () => {
    const result = lpDeadlineStyle(10);
    expect(result.className).toContain("text-warning");
  });

  it("returns red for 1-7 days", () => {
    const result = lpDeadlineStyle(5);
    expect(result.className).toContain("text-danger");
    expect(result.label).toBe("LP Review in 5 days");
  });

  it("returns today style for 0 days", () => {
    const result = lpDeadlineStyle(0);
    expect(result.className).toContain("bg-danger");
    expect(result.label).toBe("LP Review TODAY");
  });

  it("returns overdue for negative days", () => {
    const result = lpDeadlineStyle(-3);
    expect(result.className).toContain("bg-danger");
    expect(result.label).toBe("LP Review OVERDUE by 3 days");
  });
});
