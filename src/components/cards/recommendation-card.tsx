"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/charts/sparkline";
import { RECOMMENDATIONS } from "@/constants/content";
import { formatCurrency, formatPercent, getScoreColor, getScoreBgColor } from "@/lib/utils/format";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";

interface FactorScore {
  score: number;
  inputs: string[];
  reasoning: string;
}

interface BullBearCase {
  headline: string;
  points: string[];
}

interface KeyMetrics {
  pe: number | null;
  pe_sector_avg: number | null;
  ps: number | null;
  ev_ebitda: number | null;
}

export interface Recommendation {
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
  full_analysis?: string;
  comparable_companies?: string;
  catalysts?: string;
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
const timeBadges: Record<string, { emoji: string; label: string; color: "red" | "amber" | "green" }> = {
  act_today: { emoji: "🔴", label: "Act Today", color: "red" },
  this_week: { emoji: "🟡", label: "This Week", color: "amber" },
  monitor: { emoji: "🟢", label: "Monitor", color: "green" },
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
  let bull: BullBearCase = { headline: "", points: [] };
  let bear: BullBearCase = { headline: "", points: [] };
  let metrics: KeyMetrics = { pe: null, pe_sector_avg: null, ps: null, ev_ebitda: null };
  try { bull = JSON.parse(rec.bull_case); } catch { /* use defaults */ }
  try { bear = JSON.parse(rec.bear_case); } catch { /* use defaults */ }
  try { metrics = JSON.parse(rec.key_metrics); } catch { /* use defaults */ }
  const timeBadge = timeBadges[rec.time_sensitivity] || timeBadges.monitor;
  const suggestedDollars = portfolioBalance * rec.position_size_pct;
  const rr = rec.stop_loss && rec.take_profit
    ? ((rec.take_profit - rec.entry_price) / (rec.entry_price - rec.stop_loss)).toFixed(1)
    : "N/A";

  return (
    <div className="bg-bg-surface border border-border-default rounded-[12px] overflow-hidden">
      {/* Layer 1 — Card Header */}
      <div
        className="p-[16px] cursor-pointer hover:bg-bg-surface-hover transition-colors"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggleExpand(); }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-mono font-medium text-text-primary">{rec.ticker}</span>
              <span className="text-[14px] text-text-secondary truncate">{rec.company_name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge color={ratingColors[rec.rating] || "amber"} size="sm">
                {ratingLabels[rec.rating] || rec.rating}
              </Badge>
              <Badge color={timeBadge.color} size="sm">
                {timeBadge.emoji} {timeBadge.label}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 ml-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getScoreBgColor(rec.ai_score)}/20`}>
              <span className={`text-[16px] font-bold tabular-nums ${getScoreColor(rec.ai_score)}`}>
                {rec.ai_score.toFixed(1)}
              </span>
            </div>
            {rec.previous_ai_score && (
              <span className="text-[12px] text-text-tertiary">
                {rec.ai_score > rec.previous_ai_score ? "↑" : "↓"} was {rec.previous_ai_score.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        <p className="text-[14px] text-text-secondary italic mt-2">{rec.thesis}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-text-tertiary">
              {RECOMMENDATIONS.confidenceLabel}: {Math.round(rec.confidence * 100)}%
            </span>
            <Sparkline data={[100, 102, 98, 105, 103, 108, 110]} colorblind={colorblindMode} />
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4 text-text-tertiary" /> : <ChevronDown className="h-4 w-4 text-text-tertiary" />}
        </div>

        {rec.has_existing_position && rec.existing_position_details && (
          <p className="text-[12px] text-accent-blue mt-2">
            {RECOMMENDATIONS.existingPosition(rec.existing_position_details.shares, formatCurrency(rec.existing_position_details.avg_cost))}
          </p>
        )}

        <p className="text-[12px] text-text-tertiary mt-2">{RECOMMENDATIONS.disclaimer}</p>
      </div>

      {/* Layer 2 — Expanded Detail */}
      <div className={`overflow-hidden transition-all duration-250 ease-out ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-[16px] pb-[16px] border-t border-border-default pt-4">
          {/* Bull/Bear Cases */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <h4 className="text-[14px] font-medium text-gain-green mb-1">{bull.headline}</h4>
              <ul className="space-y-1">
                {bull.points?.map((p: string, i: number) => (
                  <li key={i} className="text-[12px] text-text-secondary">• {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[14px] font-medium text-loss-red mb-1">{bear.headline}</h4>
              <ul className="space-y-1">
                {bear.points?.map((p: string, i: number) => (
                  <li key={i} className="text-[12px] text-text-secondary">• {p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="flex flex-wrap gap-2 mb-4">
            {metrics.pe != null && <MetricPill label="P/E" value={metrics.pe.toFixed(1)} context={metrics.pe_sector_avg ? `Sector: ${metrics.pe_sector_avg.toFixed(1)}` : undefined} />}
            {metrics.ps != null && <MetricPill label="P/S" value={metrics.ps.toFixed(1)} />}
            {metrics.ev_ebitda != null && <MetricPill label="EV/EBITDA" value={metrics.ev_ebitda.toFixed(1)} />}
          </div>

          {/* Position Sizing */}
          <div className="bg-bg-input rounded-[8px] p-3 mb-4">
            <p className="text-[14px] text-text-primary">
              Suggested: {(rec.position_size_pct * 100).toFixed(0)}% of portfolio (~{formatCurrency(suggestedDollars)})
            </p>
          </div>

          {/* Risk/Reward */}
          <div className="mb-4">
            <p className="text-[12px] text-text-secondary mb-2">Risk/Reward: 1:{rr}</p>
            <div className="flex gap-1 h-3">
              <div className="bg-loss-red/30 rounded-l-full flex-1 max-w-[40%]">
                <div className="bg-loss-red h-full rounded-l-full" style={{ width: "100%" }} />
              </div>
              <div className="bg-gain-green/30 rounded-r-full flex-1">
                <div className="bg-gain-green h-full rounded-r-full" style={{ width: `${Math.min(100, parseFloat(rr || "1") * 100 / 3)}%` }} />
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[12px] text-loss-red">{formatCurrency(rec.stop_loss)}</span>
              <span className="text-[12px] text-text-secondary">{formatCurrency(rec.entry_price)}</span>
              <span className="text-[12px] text-gain-green">{formatCurrency(rec.take_profit)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button size="sm" onClick={(e) => { e.stopPropagation(); onViewAnalysis(); }}>
              <Eye className="h-4 w-4" /> Full Analysis
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
    <span className="inline-flex items-center gap-1 bg-bg-input rounded-full px-2 py-1 text-[12px]">
      <span className="text-text-secondary">{label}:</span>
      <span className="text-text-primary font-medium tabular-nums">{value}</span>
      {context && <span className="text-text-tertiary">| {context}</span>}
    </span>
  );
}
