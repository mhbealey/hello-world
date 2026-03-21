"use client";

import { TopBar } from "./top-bar";
import { BottomNav } from "./bottom-nav";
import { ToastProvider } from "@/components/ui/toast";

interface DashboardShellProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardShell({ title, children }: DashboardShellProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg">
        <TopBar title={title} />
        <main className="px-4 pb-24 pt-4">{children}</main>
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
