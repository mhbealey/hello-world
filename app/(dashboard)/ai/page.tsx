"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layouts";
import { Card, CardTitle, Badge, ScoreRing, ProgressBar } from "@/components/ui";
import { formatDelta } from "@/lib/format";
import { MOCK_AI } from "@/lib/mock-data";
import type { AIToolStatus, AIRiskLevel } from "@/types";

function toolStatusBadge(status: AIToolStatus) {
  switch (status) {
    case "approved":
      return <Badge label="Approved" variant="low" />;
    case "under_review":
      return <Badge label="Under Review" variant="medium" />;
    case "not_evaluated":
      return <Badge label="Not Evaluated" variant="neutral" />;
  }
}

function riskBadge(level: AIRiskLevel) {
  switch (level) {
    case "high":
      return <Badge label="High Risk" variant="critical" />;
    case "medium":
      return <Badge label="Medium Risk" variant="high" />;
    case "low":
      return <Badge label="Low Risk" variant="low" />;
    case "unknown":
      return <Badge label="Unknown" variant="neutral" />;
  }
}

export default function AIPage() {
  const data = MOCK_AI;
  const [expandedSection, setExpandedSection] = useState<string | null>("tools");

  function toggleSection(id: string) {
    setExpandedSection(expandedSection === id ? null : id);
  }

  return (
    <DashboardShell title="AI Posture">
      <div className="space-y-3">
        {/* AI Frameworks */}
        <Card>
          <CardTitle>AI Framework Scores</CardTitle>
          <div className="mt-3 grid grid-cols-2 gap-4">
            {data.frameworks.map((fw) => (
              <div key={fw.id} className="flex flex-col items-center">
                <ScoreRing score={fw.score} size={64} strokeWidth={5} />
                <p className="mt-1 text-center text-xs font-medium text-text">
                  {fw.name}
                </p>
                {fw.prior_score !== null && (
                  <p className="text-xs text-success">
                    {formatDelta(fw.score, fw.prior_score)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* AI Tools */}
        <Card
          className="cursor-pointer"
          onClick={() => toggleSection("tools")}
        >
          <CardTitle>
            AI Tools ({data.tools.length})
          </CardTitle>
          {expandedSection === "tools" && (
            <div className="mt-3 animate-fade-in space-y-2">
              {data.tools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between rounded-md bg-surfaceDim px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-text">
                      {tool.name}
                    </p>
                    <p className="text-xs text-textTertiary">
                      {tool.usage_level} usage
                    </p>
                  </div>
                  {toolStatusBadge(tool.status)}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AI Use Cases */}
        <Card
          className="cursor-pointer"
          onClick={() => toggleSection("useCases")}
        >
          <CardTitle>
            Use Cases by Risk ({data.useCases.length})
          </CardTitle>
          {expandedSection === "useCases" && (
            <div className="mt-3 animate-fade-in space-y-2">
              {data.useCases.map((uc) => (
                <div
                  key={uc.id}
                  className="rounded-md border border-borderLight bg-surfaceDim p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text">
                      {uc.area}
                    </p>
                    {riskBadge(uc.risk_level)}
                  </div>
                  {uc.description && (
                    <p className="mt-1 text-xs text-textSecondary">
                      {uc.description}
                    </p>
                  )}
                  {uc.items.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {uc.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start gap-2 text-xs text-textTertiary"
                        >
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-textTertiary" />
                          {item.item_text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Governance Roadmap */}
        <Card
          className="cursor-pointer"
          onClick={() => toggleSection("governance")}
        >
          <CardTitle>
            Governance Roadmap
          </CardTitle>
          {expandedSection === "governance" && (
            <div className="mt-3 animate-fade-in">
              <ProgressBar
                value={data.governanceItems.filter((g) => g.completed).length}
                max={data.governanceItems.length}
                color="bg-accent"
                className="mb-3"
              />
              <div className="space-y-2">
                {data.governanceItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md bg-surfaceDim px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${item.completed ? "bg-success" : "bg-textMuted"}`}
                      />
                      <span
                        className={`text-sm ${item.completed ? "text-textTertiary line-through" : "text-text"}`}
                      >
                        {item.item}
                      </span>
                    </div>
                    {item.target && (
                      <span className="text-xs text-textTertiary">
                        {item.target}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
