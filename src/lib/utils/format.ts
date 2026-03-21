export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCompactNumber(value: number): string {
  if (Math.abs(value) >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(2);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getGainLossColor(value: number, colorblind: boolean): string {
  if (value > 0) return colorblind ? "text-gain-alt-blue" : "text-gain-green";
  if (value < 0) return colorblind ? "text-loss-alt-orange" : "text-loss-red";
  return "text-text-secondary";
}

export function getGainLossBg(value: number, colorblind: boolean): string {
  if (value > 0) return colorblind ? "bg-gain-alt-blue" : "bg-gain-green";
  if (value < 0) return colorblind ? "bg-loss-alt-orange" : "bg-loss-red";
  return "bg-text-secondary";
}

export function getGainLossArrow(value: number): string {
  if (value > 0) return "▲";
  if (value < 0) return "▼";
  return "";
}

export function getScoreColor(score: number): string {
  if (score >= 7) return "text-score-high";
  if (score >= 4) return "text-score-mid";
  return "text-score-low";
}

export function getScoreBgColor(score: number): string {
  if (score >= 7) return "bg-score-high";
  if (score >= 4) return "bg-score-mid";
  return "bg-score-low";
}
