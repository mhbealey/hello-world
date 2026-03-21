"use client";

import { useState } from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`
        bg-bg-surface border border-border-default rounded-[12px] p-[16px]
        ${onClick ? "cursor-pointer hover:bg-bg-surface-hover transition-colors duration-200" : ""}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      {children}
    </div>
  );
}

interface ExpandableCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function ExpandableCard({
  header,
  children,
  expanded: controlledExpanded,
  onToggle,
  className = "",
}: ExpandableCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded ?? internalExpanded;
  const toggle = onToggle ?? (() => setInternalExpanded((v) => !v));

  return (
    <div
      className={`
        bg-bg-surface border border-border-default rounded-[12px]
        transition-colors duration-200 hover:bg-bg-surface-hover
        ${className}
      `}
    >
      <div
        className="p-[16px] cursor-pointer min-h-[44px]"
        onClick={toggle}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(); }}
      >
        {header}
      </div>
      <div
        className={`overflow-hidden transition-all duration-250 ease-out ${
          expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-[16px] pb-[16px]">{children}</div>
      </div>
    </div>
  );
}
