import { describe, it, expect } from "vitest";
import { content } from "../content";

describe("content", () => {
  it("has all screen titles", () => {
    expect(content.screenTitles.home).toBe("Home");
    expect(content.screenTitles.risk).toBe("Risk Scenarios");
    expect(content.screenTitles.actions).toBe("Recommended Actions");
    expect(content.screenTitles.ai).toBe("AI Posture");
    expect(content.screenTitles.funds).toBe("Funds");
  });

  it("has empty state messages", () => {
    expect(content.emptyStates.noFunds.message).toContain("No funds");
    expect(content.emptyStates.noRisks.cta).toBe("Start Assessment");
    expect(content.emptyStates.noActions.cta).toBeUndefined();
  });

  it("has toast formatters", () => {
    expect(content.toasts.resolved("AI Policy")).toBe("AI Policy resolved");
    expect(content.toasts.undone("AI Policy")).toBe("AI Policy restored");
    expect(content.toasts.advisorBooked("10 AM")).toBe("Call scheduled for 10 AM");
  });

  it("has error messages", () => {
    expect(content.errors.chatError).toContain("AI assistant");
    expect(content.errors.authFailure).toContain("log in");
  });
});
