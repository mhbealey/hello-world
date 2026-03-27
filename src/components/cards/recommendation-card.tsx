"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/charts/sparkline";
import { RECOMMENDATIONS } from "@/constants/content";
import { formatCurrency, getScoreColor } from "@/lib/utils/format";
import { ChevronDown, Eye, TrendingUp, TrendingDown, Shield } from "lucide-react";

interface Recommendation {
  id: number;
  ticker: string;
  company_name: string;
  ai_score: number;
  previous_ai_score: number | null;
  rating: string;
  confidence: number;
  thesis: string;
  bull_case: string;
  bear_case: string;
  key_metrics: string;
  factor_scores: string;
  position_size_pct: number;
  order_type: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  time_sensitivity: string;
  has_existing_position?: boolean;
  existing_position_details?: { shares: number; avg_cost: number } | null;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onStartTrade: () => void;
  onWatch: () => void;
  onViewAnalysis: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  colorblindMode?: boolean;
  portfolioBalance?: number;
}

const ratingLabels: Record<string, string> = {
  strong_buy: "Strong Buy", buy: "Buy", hold: "Hold", sell: "Sell", strong_sell: "Strong Sell",
};
const ratingColors: Record<string, "green" | "amber" | "red" | "blue"> = {
  strong_buy: "green", buy: "green", hold: "amber", sell: "red", strong_sell: "red",
};
const timeBadges: Record<string, { label: string; color: "red" | "amber" | "green" }> = {
  act_today: { label: "Act Today", color: "red" },
  this_week: { label: "This Week", color: "amber" },
  monitor: { label: "Monitor", color: "green" },
};

export function RecommendationCard({
  recommendation: rec,
  onStartTrade,
  onWatch,
  onViewAnalysis,
  isExpanded,
  onToggleExpand,
  colorblindMode = false,
  portfolioBalance = 50000,
}: RecommendationCardProps) {
  const bull = (() => { try { const p = JSON.parse(rec.bull_case); return p.headline ? p : null; } catch { return null; } })();
  const bear = (() => { try { const p = JSON.parse(rec.bear_case); return p.headline ? p : null; } catch { return null; } })();
  const metrics = (() => { try { const p = JSON.parse(rec.key_metrics); return Object.keys(p).length > 0 ? p : null; } catch { return null; } })();
  const timeBadge = timeBadges[rec.time_sensitivity] || timeBadges.monitor;
  const suggestedDollars = portfolioBalance * rec.position_size_pct;
  const rr = rec.stop_loss && rec.take_profit
    ? ((rec.take_profit - rec.entry_price) / (rec.entry_price - rec.stop_loss)).toFixed(1)
    : "N/A";

  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden transition-all duration-200 hover:border-border-subtle">
      {/* Card Header */}
      <div
        className="p-4 cursor-pointer active:bg-bg-surface-hover transition-colors"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggleExpand(); }}
      >
        {/* Top row: Ticker + Score */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-mono font-semibold text-text-primary tracking-wide">{rec.ticker}</span>
              <span className="text-[13px] text-text-secondary truncate">{rec.company_name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Badge color={ratingColors[rec.rating] || "amber"} size="sm">
                {ratingLabels[rec.rating] || rec.rating}
              </Badge>
              <Badge color={timeBadge.color} size="sm">
                {timeBadge.label}
              </Badge>
            </div>
          </div>

          {/* Score circle */}
          <div className="flex flex-col items-end gap-0.5 ml-4">
            <div className={`text-xl font-bold tabular-nums ${getScoreColor(rec.ai_score)}`}>
              {rec.ai_score.toFixed(1)}
            </div>
            {rec.previous_ai_score && (
              <span className="text-[11px] text-text-tertiary tabular-nums">
                {rec.ai_score > rec.previous_ai_score ? "↑" : "↓"} {rec.previous_ai_score.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Thesis */}
        <p className="text-[13px] text-text-secondary leading-relaxed italic">{rec.thesis}</p>

        {/* Footer: Confidence + Expand */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-tertiary tabular-nums">
              Confidence {Math.round(rec.confidence * 100)}%
            </span>
            <Sparkline data={[100, 102, 98, 105, 103, 108, 110]} colorblind={colorblindMode} />
          </div>
          <ChevronDown
            className={`h-4 w-4 text-text-tertiary transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>

        {rec.has_existing_position && rec.existing_position_details && (
          <p className="text-xs text-accent-blue mt-2">
            {RECOMMENDATIONS.existingPosition(rec.existing_position_details.shares, formatCurrency(rec.existing_position_details.avg_cost))}
          </p>
        )}

        <p className="text-[11px] text-text-tertiary mt-2">{RECOMMENDATIONS.disclaimer}</p>
      </div>

      {/* Expanded Detail */}
      <div className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 border-t border-border-default pt-4 space-y-4">
          {/* Bull/Bear Cases */}
          {(bull || bear) && (
            <div className="grid grid-cols-2 gap-3">
              {bull && (
                <div className="bg-gain-green/5 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="h-3.5 w-3.5 text-gain-green" />
                    <h4 className="text-[13px] font-medium text-gain-green">{bull.headline}</h4>
                  </div>
                  <ul className="space-y-1">
                    {bull.points?.map((p: string, i: number) => (
                      <li key={i} className="text-xs text-text-secondary leading-relaxed">• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {bear && (
                <div className="bg-loss-red/5 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingDown className="h-3.5 w-3.5 text-loss-red" />
                    <h4 className="text-[13px] font-medium text-loss-red">{bear.headline}</h4>
                  </div>
                  <ul className="space-y-1">
                    {bear.points?.map((p: string, i: number) => (
                      <li key={i} className="text-xs text-text-secondary leading-relaxed">• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Key Metrics */}
          {metrics && (
            <div className="flex flex-wrap gap-1.5">
              {metrics.pe != null && <MetricPill label="P/E" value={metrics.pe.toFixed(1)} context={metrics.pe_sector_avg ? `Sector ${metrics.pe_sector_avg.toFixed(1)}` : undefined} />}
              {metrics.ps != null && <MetricPill label="P/S" value={metrics.ps.toFixed(1)} />}
              {metrics.ev_ebitda != null && <MetricPill label="EV/EBITDA" value={metrics.ev_ebitda.toFixed(1)} />}
            </div>
          )}

          {/* Position Sizing */}
          <div className="flex items-center gap-2 bg-bg-input rounded-xl p-3">
            <Shield className="h-4 w-4 text-text-tertiary shrink-0" />
            <p className="text-[13px] text-text-secondary">
              <span className="text-text-primary font-medium">{(rec.position_size_pct * 100).toFixed(0)}%</span> of portfolio
              <span className="text-text-tertiary"> · ~{formatCurrency(suggestedDollars)}</span>
            </p>
          </div>

          {/* Risk/Reward */}
          <div>
            <p className="text-xs text-text-tertiary mb-2 tabular-nums">Risk/Reward 1:{rr}</p>
            <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
              <div className="bg-loss-red/20 flex-[2]">
                <div className="bg-loss-red h-full rounded-l-full" style={{ width: "100%" }} />
              </div>
              <div className="bg-gain-green/20 flex-[3]">
                <div className="bg-gain-green h-full rounded-r-full" style={{ width: `${Math.min(100, parseFloat(rr || "1") * 100 / 3)}%` }} />
              </div>
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-loss-red tabular-nums">{formatCurrency(rec.stop_loss)}</span>
              <span className="text-[11px] text-text-tertiary tabular-nums">{formatCurrency(rec.entry_price)}</span>
              <span className="text-[11px] text-gain-green tabular-nums">{formatCurrency(rec.take_profit)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={(e) => { e.stopPropagation(); onViewAnalysis(); }}>
              <Eye className="h-4 w-4" /> Analysis
            </Button>
            <Button size="sm" variant="primary" onClick={(e) => { e.stopPropagation(); onStartTrade(); }}>
              {RECOMMENDATIONS.tradePrompt}
            </Button>
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onWatch(); }}>
              {RECOMMENDATIONS.watchPrompt}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricPill({ label, value, context }: { label: string; value: string; context?: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-bg-input rounded-lg px-2.5 py-1 text-xs">
      <span className="text-text-tertiary">{label}</span>
      <span className="text-text-primary font-medium tabular-nums">{value}</span>
      {context && <span className="text-text-tertiary">· {context}</span>}
    </span>
  );
}
