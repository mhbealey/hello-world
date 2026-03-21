import { freshnessIndicator } from "@/lib/utils/score";

interface FreshnessDotProps {
  daysSinceUpdate: number;
  showLabel?: boolean;
  className?: string;
}

export function FreshnessDot({
  daysSinceUpdate,
  showLabel = true,
  className = "",
}: FreshnessDotProps) {
  const { color, label } = freshnessIndicator(daysSinceUpdate);

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      {showLabel && (
        <span className="text-xs text-textTertiary">{label}</span>
      )}
    </span>
  );
}
