"use client";

import { X, AlertTriangle, Clock, TrendingDown, TrendingUp, RefreshCw, SplitSquareHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AlertItem } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  stop_loss: TrendingDown,
  take_profit: TrendingUp,
  expiring_rec: Clock,
  stale_balance: RefreshCw,
  unfinished_wizard: AlertTriangle,
  stock_split: SplitSquareHorizontal,
};

const accentMap: Record<string, string> = {
  stop_loss: "border-l-loss-red",
  take_profit: "border-l-gain-green",
  expiring_rec: "border-l-warning-amber",
  stale_balance: "border-l-accent-blue",
  unfinished_wizard: "border-l-accent-blue",
  stock_split: "border-l-warning-amber",
};

interface AlertCardProps {
  alert: AlertItem;
  onDismiss: (id: string) => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function AlertCard({ alert, onDismiss, onAction, actionLabel }: AlertCardProps) {
  const Icon = iconMap[alert.type] || AlertTriangle;
  const accent = accentMap[alert.type] || "border-l-accent-blue";

  return (
    <div className={`bg-bg-surface border border-border-default border-l-4 ${accent} rounded-[12px] p-3`} role="alert">
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-text-secondary shrink-0 mt-0.5" />
        <p className="text-[14px] text-text-primary flex-1">{alert.message}</p>
        <button
          onClick={() => onDismiss(alert.id)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-1"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4 text-text-tertiary" />
        </button>
      </div>
      {onAction && actionLabel && (
        <div className="mt-2 ml-8">
          <Button size="sm" onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
