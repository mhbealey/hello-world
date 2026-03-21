"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PillSelector } from "@/components/ui/pill-selector";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";
import { Sparkline } from "@/components/charts/sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { PORTFOLIO } from "@/constants/content";
import { formatCurrency, formatPercent, getGainLossColor, getGainLossArrow } from "@/lib/utils/format";
import { isMarketOpen } from "@/lib/utils/market-hours";

const timeframes = ["1D", "1W", "1M", "3M", "YTD", "1Y", "ALL"].map((t) => ({ label: t, value: t }));

export default function PortfolioPage() {
  const { showToast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("1M");
  const [expandedTrade, setExpandedTrade] = useState<number | null>(null);
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [showCloseTrade, setShowCloseTrade] = useState<number | null>(null);
  const [tradeForm, setTradeForm] = useState({ ticker: "", action: "buy", shares: "", price: "", stopLoss: "", takeProfit: "", notes: "" });
  const [closeForm, setCloseForm] = useState({ exit_price: "", shares_to_close: "" });

  const market = isMarketOpen();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) setData(await res.json());
    } catch {
      showToast("Failed to load portfolio", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleAddTrade() {
    const res = await fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticker: tradeForm.ticker.toUpperCase(),
        action: tradeForm.action,
        shares: parseFloat(tradeForm.shares),
        entry_price: parseFloat(tradeForm.price),
        stop_loss: tradeForm.stopLoss ? parseFloat(tradeForm.stopLoss) : undefined,
        take_profit: tradeForm.takeProfit ? parseFloat(tradeForm.takeProfit) : undefined,
        order_type: "market",
        source: "manual",
        notes: tradeForm.notes || undefined,
      }),
    });
    if (res.ok) {
      showToast("Trade logged! View in portfolio.", "success");
      setShowAddTrade(false);
      setTradeForm({ ticker: "", action: "buy", shares: "", price: "", stopLoss: "", takeProfit: "", notes: "" });
      fetchData();
    } else {
      showToast("Failed to add trade", "error");
    }
  }

  async function handleCloseTrade(tradeId: number) {
    const res = await fetch(`/api/trades/${tradeId}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exit_price: parseFloat(closeForm.exit_price),
        exit_date: new Date().toISOString(),
        shares_to_close: closeForm.shares_to_close ? parseFloat(closeForm.shares_to_close) : undefined,
      }),
    });
    if (res.ok) {
      showToast("Trade closed.", "success");
      setShowCloseTrade(null);
      fetchData();
    } else {
      showToast("Failed to close trade", "error");
    }
  }

  if (loading) {
    return (
      <div className="p-[16px]">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-[200px] w-full mb-4" />
        <Skeleton className="h-20 w-full mb-2" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const colorblind = false; // TODO: read from settings

  return (
    <div className="p-[16px]">
      {/* Hero */}
      <div className="mb-4">
        <p className="text-[28px] font-bold text-text-primary tabular-nums">
          {formatCurrency(data?.total_value || 0)}
        </p>
        <div className="flex items-center gap-2">
          <span className={`text-[16px] font-medium tabular-nums ${getGainLossColor(data?.daily_pnl || 0, colorblind)}`}>
            {getGainLossArrow(data?.daily_pnl || 0)} {formatCurrency(Math.abs(data?.daily_pnl || 0))} / {formatPercent(data?.daily_pnl_pct || 0)}
          </span>
          {!market.open && (
            <Badge color="amber" size="sm">{PORTFOLIO.afterHours}</Badge>
          )}
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="bg-bg-surface rounded-[12px] h-[160px] mb-3 flex items-center justify-center">
        <span className="text-[14px] text-text-tertiary">Chart loading...</span>
      </div>
      <PillSelector options={timeframes} selected={timeframe} onChange={(v) => setTimeframe(v as string)} />

      {/* Holdings */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-semibold text-text-primary">{PORTFOLIO.holdingsHeader}</h2>
          <button onClick={() => setShowAddTrade(true)} className="min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Plus className="h-5 w-5 text-accent-blue" />
          </button>
        </div>

        {(!data?.holdings || data.holdings.length === 0) ? (
          <p className="text-[14px] text-text-secondary py-4">{PORTFOLIO.emptyHoldings}</p>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {data.holdings.map((trade: Record<string, unknown>) => (
              <Card key={trade.id as number} onClick={() => setExpandedTrade(expandedTrade === (trade.id as number) ? null : trade.id as number)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-input flex items-center justify-center text-[14px] font-mono font-medium text-text-primary">
                      {(trade.ticker as string).charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-mono font-medium text-text-primary">{trade.ticker as string}</p>
                      <p className="text-[12px] text-text-secondary">{trade.shares as number} shares @ {formatCurrency(trade.entry_price as number)}</p>
                    </div>
                  </div>
                  <Sparkline data={[100, 102, 99, 103, 105, 104, 107]} width={60} height={20} />
                </div>

                {expandedTrade === (trade.id as number) && (
                  <div className="mt-3 pt-3 border-t border-border-default space-y-2">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-text-secondary">Stop-Loss</span>
                      <span className="text-text-primary tabular-nums">{trade.stop_loss ? formatCurrency(trade.stop_loss as number) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-text-secondary">Take-Profit</span>
                      <span className="text-text-primary tabular-nums">{trade.take_profit ? formatCurrency(trade.take_profit as number) : "—"}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); setShowCloseTrade(trade.id as number); setCloseForm({ exit_price: "", shares_to_close: "" }); }}>
                        {PORTFOLIO.closeTrade}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Watchlist */}
      <div className="mt-6">
        <h2 className="text-[18px] font-semibold text-text-primary mb-3">{PORTFOLIO.watchlistHeader}</h2>
        {(!data?.watchlist || data.watchlist.length === 0) ? (
          <p className="text-[14px] text-text-secondary">{PORTFOLIO.emptyWatchlist}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {data.watchlist.map((item: Record<string, unknown>) => (
              <div key={item.id as number} className="border border-dashed border-border-default rounded-[12px] p-3 flex items-center justify-between">
                <div>
                  <span className="text-[14px] font-mono font-medium text-text-primary">{item.ticker as string}</span>
                  <span className="text-[12px] text-text-secondary ml-2">{item.company_name as string}</span>
                </div>
                <Sparkline data={[50, 52, 51, 53, 55]} width={50} height={16} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics */}
      {data?.analytics && (
        <div className="mt-6">
          <h2 className="text-[18px] font-semibold text-text-primary mb-3">{PORTFOLIO.analyticsHeader}</h2>
          <Card>
            <div className="space-y-2">
              <AnalyticRow label="Win Rate" value={`${(data.analytics.win_rate * 100).toFixed(0)}% (${data.analytics.win_count} of ${data.analytics.total_count})`} />
              <AnalyticRow label="Avg Return" value={formatPercent(data.analytics.avg_return)} />
              {data.analytics.best_trade && <AnalyticRow label="Best Trade" value={`${data.analytics.best_trade.ticker} ${formatPercent(data.analytics.best_trade.return_pct)}`} />}
              {data.analytics.worst_trade && <AnalyticRow label="Worst Trade" value={`${data.analytics.worst_trade.ticker} ${formatPercent(data.analytics.worst_trade.return_pct)}`} />}
              <AnalyticRow label="Win Streak" value={`${data.analytics.current_streak} wins`} />
              <AnalyticRow label="Avg Hold Time" value={`${data.analytics.avg_hold_days} days`} />
              <AnalyticRow label="AI Avg Return" value={formatPercent(data.analytics.ai_avg_return)} />
              <AnalyticRow label="Manual Avg Return" value={formatPercent(data.analytics.manual_avg_return)} />
            </div>
          </Card>
        </div>
      )}

      {/* Add Trade Bottom Sheet */}
      <BottomSheet open={showAddTrade} onClose={() => setShowAddTrade(false)} title="Add Trade">
        <div className="space-y-3">
          <Input label="Ticker" value={tradeForm.ticker} onChange={(v) => setTradeForm({ ...tradeForm, ticker: v })} placeholder="AAPL" />
          <PillSelector
            options={[{ label: "Buy", value: "buy" }, { label: "Sell", value: "sell" }]}
            selected={tradeForm.action}
            onChange={(v) => setTradeForm({ ...tradeForm, action: v as string })}
          />
          <Input label="Shares" type="number" value={tradeForm.shares} onChange={(v) => setTradeForm({ ...tradeForm, shares: v })} />
          <Input label="Price" dollar value={tradeForm.price} onChange={(v) => setTradeForm({ ...tradeForm, price: v })} />
          <Input label="Stop-Loss (optional)" dollar value={tradeForm.stopLoss} onChange={(v) => setTradeForm({ ...tradeForm, stopLoss: v })} />
          <Input label="Take-Profit (optional)" dollar value={tradeForm.takeProfit} onChange={(v) => setTradeForm({ ...tradeForm, takeProfit: v })} />
          <Button fullWidth onClick={handleAddTrade} disabled={!tradeForm.ticker || !tradeForm.shares || !tradeForm.price}>
            Save Trade
          </Button>
        </div>
      </BottomSheet>

      {/* Close Trade Bottom Sheet */}
      <BottomSheet open={showCloseTrade !== null} onClose={() => setShowCloseTrade(null)} title="Close Trade">
        <div className="space-y-3">
          <Input label="Exit Price" dollar value={closeForm.exit_price} onChange={(v) => setCloseForm({ ...closeForm, exit_price: v })} />
          <Input label="Shares to Close (leave blank for all)" type="number" value={closeForm.shares_to_close} onChange={(v) => setCloseForm({ ...closeForm, shares_to_close: v })} />
          <Button fullWidth onClick={() => showCloseTrade && handleCloseTrade(showCloseTrade)} disabled={!closeForm.exit_price}>
            Close Trade
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

function AnalyticRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-text-secondary">{label}</span>
      <span className="text-[14px] text-text-primary font-medium tabular-nums">{value}</span>
    </div>
  );
}
