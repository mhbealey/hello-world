"use client";

import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import type { Recommendation } from "@/components/cards/recommendation-card";

interface FullAnalysisProps {
  recommendation: Recommendation;
  onBack: () => void;
}

export function FullAnalysis({ recommendation: rec, onBack }: FullAnalysisProps) {
  const factorScores = typeof rec.factor_scores === "string" ? JSON.parse(rec.factor_scores) : rec.factor_scores;
  const metrics = typeof rec.key_metrics === "string" ? JSON.parse(rec.key_metrics) : rec.key_metrics;
  const comparables = rec.comparable_companies ? (typeof rec.comparable_companies === "string" ? JSON.parse(rec.comparable_companies) : rec.comparable_companies) : [];
  const catalysts = rec.catalysts ? (typeof rec.catalysts === "string" ? JSON.parse(rec.catalysts) : rec.catalysts) : [];

  const factors = [
    { key: "technical", label: "Technical", color: "bg-accent-blue" },
    { key: "fundamental", label: "Fundamental", color: "bg-gain-green" },
    { key: "sentiment", label: "Sentiment", color: "bg-warning-amber" },
    { key: "momentum", label: "Momentum", color: "bg-accent-blue" },
    { key: "earnings", label: "Earnings", color: "bg-score-high" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-bg-base overflow-y-auto">
      <div className="max-w-[390px] mx-auto p-[16px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-[env(safe-area-inset-top,8px)]">
          <button onClick={onBack} className="min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Go back">
            <ArrowLeft className="h-5 w-5 text-text-primary" />
          </button>
          <div>
            <span className="text-[14px] font-mono font-medium text-text-primary">{rec.ticker}</span>
            <span className="text-[14px] text-text-secondary ml-2">{rec.company_name}</span>
          </div>
        </div>

        {/* Factor Scores Chart */}
        <h3 className="text-[18px] font-semibold text-text-primary mb-4">Factor Scores</h3>
        <div className="space-y-3 mb-6">
          {factors.map((f) => {
            const data = factorScores?.[f.key];
            const score = data?.score ?? 0;
            return (
              <div key={f.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[14px] text-text-secondary">{f.label}</span>
                  <span className="text-[14px] font-medium text-text-primary tabular-nums">{score.toFixed(1)}</span>
                </div>
                <div className="h-3 bg-bg-input rounded-full overflow-hidden">
                  <div className={`h-full ${f.color} rounded-full transition-all`} style={{ width: `${(score / 10) * 100}%` }} />
                </div>
                {data?.reasoning && (
                  <p className="text-[12px] text-text-tertiary mt-1">{data.reasoning}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Full Analysis Text */}
        <h3 className="text-[18px] font-semibold text-text-primary mb-3">Why This Score?</h3>
        <p className="text-[14px] text-text-secondary mb-6 whitespace-pre-line">{rec.full_analysis}</p>

        {/* Catalysts */}
        {catalysts?.length > 0 && (
          <>
            <h3 className="text-[18px] font-semibold text-text-primary mb-3">Catalysts</h3>
            <div className="space-y-2 mb-6">
              {catalysts.map((c: { date: string; event: string; description: string }, i: number) => (
                <div key={i} className="flex gap-3 bg-bg-surface rounded-[8px] p-3">
                  <span className="text-[12px] text-text-tertiary whitespace-nowrap">{c.date}</span>
                  <div>
                    <p className="text-[14px] text-text-primary font-medium">{c.event}</p>
                    <p className="text-[12px] text-text-secondary">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Comparable Companies */}
        {comparables?.length > 0 && (
          <>
            <h3 className="text-[18px] font-semibold text-text-primary mb-3">Comparable Companies</h3>
            <div className="flex gap-2 mb-6">
              {comparables.map((c: { ticker: string; ai_score: number; brief: string }) => (
                <div key={c.ticker} className="bg-bg-surface rounded-[12px] p-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-mono font-medium text-text-primary">{c.ticker}</span>
                    <Badge color={c.ai_score >= 7 ? "green" : c.ai_score >= 4 ? "amber" : "red"} size="sm">
                      {c.ai_score.toFixed(1)}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-text-secondary mt-1">{c.brief}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Financial Metrics Table */}
        <h3 className="text-[18px] font-semibold text-text-primary mb-3">Financial Metrics</h3>
        <div className="bg-bg-surface rounded-[12px] p-3 mb-8">
          <table className="w-full">
            <tbody className="divide-y divide-border-default">
              {[
                ["P/E", metrics?.pe],
                ["P/E Sector Avg", metrics?.pe_sector_avg],
                ["P/S", metrics?.ps],
                ["EV/EBITDA", metrics?.ev_ebitda],
                ["Debt/Equity", metrics?.debt_equity],
                ["Revenue Growth", metrics?.revenue_growth ? `${(metrics.revenue_growth * 100).toFixed(1)}%` : null],
                ["Gross Margin", metrics?.margins?.gross ? `${(metrics.margins.gross * 100).toFixed(1)}%` : null],
                ["Operating Margin", metrics?.margins?.operating ? `${(metrics.margins.operating * 100).toFixed(1)}%` : null],
                ["Net Margin", metrics?.margins?.net ? `${(metrics.margins.net * 100).toFixed(1)}%` : null],
                ["Entry Price", formatCurrency(rec.entry_price)],
                ["Stop-Loss", formatCurrency(rec.stop_loss)],
                ["Take-Profit", formatCurrency(rec.take_profit)],
              ].filter(([, v]) => v != null).map(([label, value]) => (
                <tr key={String(label)}>
                  <td className="py-2 text-[14px] text-text-secondary">{String(label)}</td>
                  <td className="py-2 text-[14px] text-text-primary text-right tabular-nums">
                    {typeof value === "number" ? value.toFixed(2) : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
