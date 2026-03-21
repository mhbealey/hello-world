import { urgencyColor } from "@/lib/format";

interface BadgeProps {
  label: string;
  variant?: "critical" | "high" | "medium" | "low" | "neutral";
  className?: string;
}

export function Badge({ label, variant = "neutral", className = "" }: BadgeProps) {
  const colorClass =
    variant === "neutral"
      ? "text-textSecondary bg-surfaceDim"
      : urgencyColor(variant);

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}
