"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/risk", label: "Risk", icon: RiskIcon },
  { href: "/actions", label: "Actions", icon: ActionsIcon },
  { href: "/ai", label: "AI", icon: AIIcon },
  { href: "/funds", label: "Funds", icon: FundsIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface/95 backdrop-blur-sm safe-area-pb">
      <div className="flex h-16 items-stretch">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors ${
                active
                  ? "text-accent"
                  : "text-textTertiary hover:text-textSecondary"
              }`}
            >
              <item.icon active={active} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={active ? "text-accent" : "text-current"}>
      <path d="M3 10L10 3L17 10V17H12V13H8V17H3V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
    </svg>
  );
}

function RiskIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={active ? "text-accent" : "text-current"}>
      <path d="M10 3L17 17H3L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <line x1="10" y1="8" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ActionsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={active ? "text-accent" : "text-current"}>
      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M7 9L9 11L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AIIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={active ? "text-accent" : "text-current"}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="3" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="14.5" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3" y1="10" x2="5.5" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14.5" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FundsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={active ? "text-accent" : "text-current"}>
      <rect x="3" y="6" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M6 6V5C6 3.89543 6.89543 3 8 3H12C13.1046 3 14 3.89543 14 5V6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
