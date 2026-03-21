"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layouts";
import { Card, CardTitle, ScoreRing, Badge, ProgressBar, EmptyState } from "@/components/ui";
import { formatDollars, formatMOIC, formatIRR, formatPct, formatDelta } from "@/lib/format";
import { content } from "@/lib/utils/content";
import { MOCK_FUNDS } from "@/lib/mock-data";
import type { OddStatus } from "@/types";

function oddBadge(status: OddStatus) {
  switch (status) {
    case "complete":
      return <Badge label="ODD Complete" variant="low" />;
    case "in_progress":
      return <Badge label="ODD In Progress" variant="medium" />;
    case "not_started":
      return <Badge label="ODD Not Started" variant="neutral" />;
  }
}

export default function FundsPage() {
  const funds = MOCK_FUNDS;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <DashboardShell title="Funds">
      <div className="space-y-3">
        {funds.length === 0 && (
          <EmptyState message={content.emptyStates.noFunds.message} cta={content.emptyStates.noFunds.cta} />
        )}
        {funds.map((fund) => {
          const expanded = expandedId === fund.id;
          return (
            <Card
              key={fund.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setExpandedId(expanded ? null : fund.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-text">
                    {fund.name}
                  </p>
                  <p className="text-xs text-textTertiary">
                    Vintage {fund.vintage}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {oddBadge(fund.odd_status)}
                  {fund.cyber_score !== null && (
                    <ScoreRing
                      score={fund.cyber_score}
                      size={44}
                      strokeWidth={4}
                    />
                  )}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-textTertiary">AUM</p>
                  <p className="text-sm font-medium text-text">
                    {formatDollars(fund.aum_cents)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-textTertiary">MOIC</p>
                  <p className="text-sm font-medium text-text">
                    {formatMOIC(fund.moic)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-textTertiary">IRR</p>
                  <p className="text-sm font-medium text-text">
                    {formatIRR(fund.irr)}
                  </p>
                </div>
              </div>

              {/* Deployed */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-textTertiary">
                  <span>Deployed</span>
                  <span>{formatPct(fund.deployed_pct)}</span>
                </div>
                <ProgressBar
                  className="mt-1"
                  value={fund.deployed_pct}
                  color="bg-accent"
                />
              </div>

              {expanded && (
                <div className="mt-3 animate-fade-in space-y-4 border-t border-border pt-3">
                  {/* Score delta */}
                  {fund.cyber_score !== null && fund.prior_cyber_score !== null && (
                    <p className="text-xs text-success">
                      Cyber score {formatDelta(fund.cyber_score, fund.prior_cyber_score)} from prior
                    </p>
                  )}

                  {/* Milestones */}
                  <div>
                    <CardTitle>Fund Lifecycle</CardTitle>
                    <div className="mt-2 space-y-2">
                      {fund.milestones.map((ms) => (
                        <div
                          key={ms.id}
                          className="flex items-start gap-3 rounded-md bg-surfaceDim px-3 py-2"
                        >
                          <span
                            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${ms.completed ? "bg-success" : "bg-textMuted"}`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-text">
                                {ms.phase}
                              </p>
                              <p className="text-xs text-textTertiary">
                                {ms.year_range}
                              </p>
                            </div>
                            {ms.cyber_overlay && (
                              <p className="mt-0.5 text-xs text-textTertiary">
                                {ms.cyber_overlay}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fund Actions */}
                  {fund.fund_actions.length > 0 && (
                    <div>
                      <CardTitle>Priority Actions</CardTitle>
                      <div className="mt-2 space-y-1">
                        {fund.fund_actions.map((fa) => (
                          <div
                            key={fa.id}
                            className="flex items-center justify-between rounded-md bg-surfaceDim px-3 py-2"
                          >
                            <span className="text-sm text-text">
                              {fa.text}
                            </span>
                            {fa.target_date && (
                              <span className="text-xs text-textTertiary">
                                {fa.target_date}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {fund.exit_companies > 0 && (
                    <p className="text-xs text-textTertiary">
                      {fund.exit_companies} exit companies
                    </p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}
