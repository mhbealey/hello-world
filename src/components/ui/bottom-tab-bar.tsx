"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Crosshair, BarChart3, Settings } from "lucide-react";
import { NAV } from "@/constants/content";

const tabs = [
  { href: "/home", label: NAV.home, icon: Home },
  { href: "/trade", label: NAV.trade, icon: Crosshair },
  { href: "/portfolio", label: NAV.portfolio, icon: BarChart3 },
  { href: "/settings", label: NAV.settings, icon: Settings },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg-base/80 backdrop-blur-xl border-t border-border-subtle"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-[60px] max-w-[390px] mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                relative flex flex-col items-center justify-center gap-0.5
                min-w-[48px] min-h-[48px] px-4
                transition-colors duration-150
                ${isActive ? "text-accent-blue" : "text-text-tertiary"}
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={`h-5 w-5 transition-transform duration-150 ${isActive ? "scale-105" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[11px] ${isActive ? "font-semibold" : "font-medium"}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
