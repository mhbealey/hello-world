"use client";

import { scoreColor } from "@/lib/format";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

export function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
  className = "",
  label,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-borderLight"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={scoreColor(score)}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
      <span
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold ${scoreColor(score)}`}
      >
        {score}
      </span>
      {label && (
        <span className="mt-1 text-xs text-textTertiary">{label}</span>
      )}
    </div>
  );
}
