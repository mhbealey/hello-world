export { scoreColor } from "@/lib/format";

/** Get freshness indicator based on days since update */
export function freshnessIndicator(daysSinceUpdate: number): {
  color: string;
  label: string;
} {
  if (daysSinceUpdate < 7) {
    return { color: "bg-success", label: "Current" };
  }
  if (daysSinceUpdate <= 30) {
    return { color: "bg-warning", label: `Updated ${daysSinceUpdate} days ago` };
  }
  return { color: "bg-danger", label: "Stale" };
}

/** Get LP deadline urgency style */
export function lpDeadlineStyle(daysRemaining: number): {
  className: string;
  label: string;
} {
  if (daysRemaining < 0) {
    return {
      className: "bg-danger text-white",
      label: `LP Review OVERDUE by ${Math.abs(daysRemaining)} days`,
    };
  }
  if (daysRemaining === 0) {
    return { className: "bg-danger text-white", label: "LP Review TODAY" };
  }
  if (daysRemaining <= 7) {
    return {
      className: "text-danger font-semibold",
      label: `LP Review in ${daysRemaining} days`,
    };
  }
  if (daysRemaining <= 14) {
    return {
      className: "text-warning",
      label: `LP Review in ${daysRemaining} days`,
    };
  }
  return {
    className: "text-textSecondary",
    label: `LP Review in ${daysRemaining} days`,
  };
}
