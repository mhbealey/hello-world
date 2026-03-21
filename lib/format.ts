/** Format cents to dollar string, e.g. 468_000_000_00 → "$468M" */
export function formatALE(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000_000) {
    return `$${(dollars / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (dollars >= 1_000_000) {
    return `$${(dollars / 1_000_000).toFixed(0)}M`;
  }
  if (dollars >= 1_000) {
    return `$${(dollars / 1_000).toFixed(0)}K`;
  }
  return `$${dollars.toFixed(0)}`;
}

/** Format cents to full dollar string, e.g. 120000000000 → "$1.2B" */
export function formatDollars(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000_000) {
    const val = dollars / 1_000_000_000;
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}B`;
  }
  if (dollars >= 1_000_000) {
    const val = dollars / 1_000_000;
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`;
  }
  if (dollars >= 1_000) {
    return `$${(dollars / 1_000).toFixed(0)}K`;
  }
  return `$${dollars.toFixed(0)}`;
}

/** Format percentage, e.g. 91 → "91%" */
export function formatPct(value: number): string {
  return `${value}%`;
}

/** Format MOIC, e.g. 1.82 → "1.82x" */
export function formatMOIC(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(2)}x`;
}

/** Format IRR, e.g. 18.6 → "18.6%" */
export function formatIRR(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(1)}%`;
}

/** Format date string to readable format */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Score delta with sign, e.g. +4, -2 */
export function formatDelta(current: number, prior: number | null): string {
  if (prior === null) return "";
  const delta = current - prior;
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `${delta}`;
  return "0";
}

/** Get urgency color class */
export function urgencyColor(
  urgency: "critical" | "high" | "medium" | "low"
): string {
  switch (urgency) {
    case "critical":
      return "text-danger bg-dangerBg";
    case "high":
      return "text-warning bg-warningBg";
    case "medium":
      return "text-accent bg-accentBg";
    case "low":
      return "text-success bg-successBg";
  }
}

/** Get score color based on value */
export function scoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger";
}
