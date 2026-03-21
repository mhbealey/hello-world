interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-[8px] ${className}`}
      aria-hidden="true"
    />
  );
}
