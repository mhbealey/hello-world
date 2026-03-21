"use client";

interface TalkToAdvisorProps {
  onClick: () => void;
  className?: string;
}

export function TalkToAdvisor({ onClick, className = "" }: TalkToAdvisorProps) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V10C14 10.5523 13.5523 11 13 11H5L2 14V3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      Talk to Advisor
    </button>
  );
}
