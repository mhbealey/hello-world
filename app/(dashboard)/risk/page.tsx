"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layouts";
import { Card, CardTitle, Badge, EmptyState } from "@/components/ui";
import { FreshnessDot } from "@/components/shared";
import { formatALE } from "@/lib/format";
import { content } from "@/lib/utils/content";
import { MOCK_RISKS } from "@/lib/mock-data";

export default function RiskPage() {
  const risks = MOCK_RISKS;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <DashboardShell title="Risk Scenarios">
      <div className="space-y-3">
        {risks.length === 0 && (
          <EmptyState message={content.emptyStates.noRisks.message} cta={content.emptyStates.noRisks.cta} />
        )}
        {risks.map((risk) => {
          const expanded = expandedId === risk.id;
          return (
            <Card
              key={risk.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setExpandedId(expanded ? null : risk.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-text line-clamp-2">
                    {risk.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-lg font-semibold text-danger">
                      {formatALE(risk.ale_cents)}
                    </p>
                    {risk.days_since_update !== undefined && (
                      <FreshnessDot daysSinceUpdate={risk.days_since_update} />
                    )}
                  </div>
                </div>
                {risk.addressed && (
                  <Badge label="Addressed" variant="low" className="ml-2" />
                )}
              </div>

              {expanded && (
                <div className="mt-3 animate-fade-in space-y-3 border-t border-border pt-3">
                  {risk.plain_english && (
                    <div>
                      <CardTitle>What this means</CardTitle>
                      <p className="mt-1 text-sm text-textSecondary">
                        {risk.plain_english}
                      </p>
                    </div>
                  )}
                  {risk.recommended_response && (
                    <div>
                      <CardTitle>Recommended Response</CardTitle>
                      <p className="mt-1 text-sm text-textSecondary">
                        {risk.recommended_response}
                      </p>
                    </div>
                  )}
                  {risk.linked_action_ids.length > 0 && (
                    <p className="text-xs text-accent">
                      {risk.linked_action_ids.length} linked action
                      {risk.linked_action_ids.length > 1 ? "s" : ""}
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
