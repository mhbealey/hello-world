"use client";

interface TopBarProps {
  title: string;
  orgName?: string;
}

export function TopBar({ title, orgName = "Crestview Partners" }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <div>
          <p className="text-xs text-textTertiary">{orgName}</p>
          <h1 className="text-base font-semibold text-text">{title}</h1>
        </div>
      </div>
    </header>
  );
}
