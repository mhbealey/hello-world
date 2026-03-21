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
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg-base border-t border-border-default"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-[64px] max-w-[390px] mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex flex-col items-center justify-center gap-1
                min-w-[48px] min-h-[48px] px-3
                transition-colors duration-200
                ${isActive ? "text-accent-blue" : "text-text-secondary"}
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[12px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
