type BadgeColor = "green" | "amber" | "red" | "blue";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  color: BadgeColor;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  green: "bg-gain-green/15 text-gain-green",
  amber: "bg-warning-amber/15 text-warning-amber",
  red: "bg-loss-red/15 text-loss-red",
  blue: "bg-accent-blue/15 text-accent-blue",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[12px]",
  md: "px-3 py-1 text-[14px]",
};

export function Badge({ color, size = "sm", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
