import { Children, type ReactNode } from "react";

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

/** Wraps children in staggered fade-in animation with per-child delay */
export function StaggerList({ children, className = "space-y-3", delayMs = 50 }: StaggerListProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) => (
        <div
          className="animate-stagger-in opacity-0"
          style={{ animationDelay: `${i * delayMs}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
