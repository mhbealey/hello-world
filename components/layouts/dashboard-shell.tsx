"use client";

import { useCallback } from "react";
import { TopBar } from "./top-bar";
import { BottomNav } from "./bottom-nav";
import { ToastProvider } from "@/components/ui/toast";
import { usePullToRefresh } from "@/lib/hooks/usePullToRefresh";

interface DashboardShellProps {
  title: string;
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
}

export function DashboardShell({ title, children, onRefresh }: DashboardShellProps) {
  const defaultRefresh = useCallback(async () => {
    // Default: simulate refresh with a short delay
    await new Promise((r) => setTimeout(r, 500));
  }, []);

  const { refreshing, handlers } = usePullToRefresh({
    onRefresh: onRefresh ?? defaultRefresh,
  });

  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg">
        <TopBar title={title} />
        <main
          className="px-4 pb-24 pt-4"
          {...handlers}
        >
          {refreshing && (
            <div className="mb-3 flex justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          )}
          {children}
        </main>
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
