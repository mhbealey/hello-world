"use client";

import { DashboardShell } from "@/components/layouts";
import { Card, CardTitle, ScoreRing, ProgressBar, StaggerList } from "@/components/ui";
import { TalkToAdvisor, AdvisorSheet } from "@/components/shared";
import { formatALE, formatPct, formatDelta, formatDate } from "@/lib/format";
import { lpDeadlineStyle } from "@/lib/utils/score";
import { MOCK_HOME } from "@/lib/mock-data";
import { useAdvisor } from "@/lib/hooks/useAdvisor";

export default function HomePage() {
  const data = MOCK_HOME;
  const a = data.assessment;
  const advisor = useAdvisor();
  const lpStyle = a ? lpDeadlineStyle(a.days_to_lp!) : null;

  return (
    <DashboardShell title="Home">
      <StaggerList className="space-y-4">
        {/* Cyber Score + LP Deadline */}
        {a && (
          <Card className="flex items-start gap-4">
            <ScoreRing score={a.score ?? 0} size={72} />
            <div className="flex-1">
              <p className="text-sm font-medium text-text">Cyber Score</p>
              {a.prior_score !== null && (
                <p className="text-xs text-success">
                  {formatDelta(a.score!, a.prior_score)} from prior
                </p>
              )}
              <div className={`mt-2 rounded-md px-2 py-1 ${lpStyle?.className.includes("bg-") ? lpStyle.className : "bg-surfaceDim"}`}>
                <p className={`text-xs ${lpStyle?.className.includes("bg-") ? "text-white" : lpStyle?.className ?? "text-textSecondary"}`}>
                  {lpStyle?.label}
                </p>
                <p className="text-xs text-textTertiary">
                  {formatDate(a.next_lp_review!)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* ALE + Overdue */}
        {a && (
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardTitle>Annual Loss Exposure</CardTitle>
              <p className="mt-1 text-xl font-semibold text-text">
                {formatALE(a.total_ale_cents)}
              </p>
            </Card>
            <Card>
              <CardTitle>Overdue Items</CardTitle>
              <p className={`mt-1 text-xl font-semibold ${a.overdue_count > 0 ? "text-danger" : "text-text"}`}>
                {a.overdue_count}
              </p>
            </Card>
          </div>
        )}

        {/* Top Risks */}
        <Card>
          <CardTitle>Top Risk Scenarios</CardTitle>
          <div className="mt-3 space-y-3">
            {data.topRisks.map((risk) => (
              <div key={risk.id} className="flex items-center justify-between">
                <span className="text-sm text-text">{risk.name}</span>
                <span className="text-sm font-medium text-danger">
                  {formatALE(risk.ale_cents)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Controls Effective */}
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Controls Effective</CardTitle>
            <span className="text-sm font-medium text-text">
              {data.controlStats.passing}/{data.controlStats.total}
            </span>
          </div>
          <ProgressBar
            className="mt-2"
            value={data.controlStats.passing}
            max={data.controlStats.total}
            color="bg-success"
          />
        </Card>

        {/* Policy Coverage */}
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Policy Coverage</CardTitle>
            <span className="text-sm font-medium text-text">
              {data.policyStats.covered}/{data.policyStats.total}
            </span>
          </div>
          <ProgressBar
            className="mt-2"
            value={data.policyStats.covered}
            max={data.policyStats.total}
            color="bg-success"
          />
          {data.policyStats.overdue > 0 && (
            <p className="mt-1 text-xs text-warning">
              {data.policyStats.overdue} overdue for review
            </p>
          )}
        </Card>

        {/* Incident Readiness */}
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Incident Readiness</CardTitle>
            <span className="text-sm font-medium text-text">
              {data.irStats.completed}/{data.irStats.total}
            </span>
          </div>
          <ProgressBar
            className="mt-2"
            value={data.irStats.completed}
            max={data.irStats.total}
            color="bg-warning"
          />
        </Card>

        {/* Framework Effectiveness */}
        <Card>
          <CardTitle>Framework Effectiveness</CardTitle>
          <div className="mt-3 space-y-3">
            {data.frameworkAssessments.map((fw) => (
              <div key={fw.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text">{fw.framework_name}</span>
                  <span className="font-medium text-text">
                    {formatPct(fw.effectiveness_pct)}
                  </span>
                </div>
                <ProgressBar
                  className="mt-1"
                  value={fw.effectiveness_pct}
                  color={
                    fw.effectiveness_pct >= 90
                      ? "bg-success"
                      : fw.effectiveness_pct >= 80
                        ? "bg-warning"
                        : "bg-danger"
                  }
                />
                <p className="mt-0.5 text-xs text-textTertiary">
                  {fw.effective_controls}/{fw.total_controls} controls
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Talk to Advisor */}
        <TalkToAdvisor onClick={() => advisor.openSheet([], "home")} />

        <AdvisorSheet
          open={advisor.open}
          onClose={advisor.closeSheet}
          onBook={advisor.bookCall}
          loading={advisor.loading}
          selectedActionIds={advisor.selectedActionIds}
        />
      </StaggerList>
    </DashboardShell>
  );
}
