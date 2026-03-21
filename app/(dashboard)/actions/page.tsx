"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layouts";
import { Card, CardTitle, Badge, ProgressBar, EmptyState } from "@/components/ui";
import { TalkToAdvisor, AdvisorSheet } from "@/components/shared";
import { toast } from "@/components/ui/toast";
import { content } from "@/lib/utils/content";
import { MOCK_ACTIONS, MOCK_RISKS } from "@/lib/mock-data";
import { useAdvisor } from "@/lib/hooks/useAdvisor";
import { useNavSource } from "@/lib/hooks/useNavSource";
import { haptic } from "@/lib/utils/haptics";
import type { ActionWithDetails } from "@/types";

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionWithDetails[]>(MOCK_ACTIONS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const advisor = useAdvisor();
  const { source, sourceId } = useNavSource();

  // Filter to linked actions when drilled in from a risk
  const linkedRisk = source === "risk" && sourceId
    ? MOCK_RISKS.find((r) => r.id === sourceId)
    : null;
  const visibleActions = linkedRisk
    ? actions.filter((a) => linkedRisk.linked_action_ids.includes(a.id))
    : actions;

  function toggleStep(actionId: string, stepIdx: number) {
    haptic("light");
    setActions((prev) =>
      prev.map((a) => {
        if (a.id !== actionId) return a;
        const wasCompleted = stepIdx < a.steps_completed;
        return {
          ...a,
          steps_completed: wasCompleted
            ? a.steps_completed - 1
            : a.steps_completed + 1,
        };
      })
    );
  }

  function resolveAction(actionId: string) {
    const action = actions.find((a) => a.id === actionId);
    if (!action) return;

    haptic("medium");
    setActions((prev) =>
      prev.map((a) =>
        a.id === actionId ? { ...a, is_resolved: !a.is_resolved } : a
      )
    );

    toast(
      action.is_resolved
        ? `${action.title} restored`
        : `${action.title} resolved`
    );
  }

  return (
    <DashboardShell title="Recommended Actions">
      <div className="space-y-3">
        {linkedRisk && (
          <p className="text-xs text-textTertiary">
            Showing actions linked to <span className="font-medium text-text">{linkedRisk.name}</span>
          </p>
        )}
        {visibleActions.length === 0 && (
          <EmptyState message={content.emptyStates.noActions.message} />
        )}
        {visibleActions.map((action) => {
          const expanded = expandedId === action.id;
          return (
            <Card
              key={action.id}
              className={`transition-shadow hover:shadow-md ${action.is_resolved ? "opacity-60" : ""}`}
            >
              <div
                className="cursor-pointer"
                onClick={() =>
                  setExpandedId(expanded ? null : action.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        label={action.urgency}
                        variant={action.urgency}
                      />
                      {action.is_resolved && (
                        <Badge label="Resolved" variant="low" />
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-text line-clamp-2">
                      {action.title}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={action.steps_completed}
                    max={action.steps.length}
                    color="bg-accent"
                  />
                  <p className="mt-1 text-xs text-textTertiary">
                    {action.steps_completed}/{action.steps.length} steps
                  </p>
                </div>
              </div>

              {expanded && (
                <div className="mt-3 animate-fade-in space-y-3 border-t border-border pt-3">
                  {action.why_it_matters && (
                    <div>
                      <CardTitle>Why it matters</CardTitle>
                      <p className="mt-1 text-sm text-textSecondary">
                        {action.why_it_matters}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 text-xs text-textTertiary">
                    {action.cost_range && <span>{action.cost_range}</span>}
                    {action.timeline && <span>{action.timeline}</span>}
                  </div>

                  <div className="space-y-2">
                    <CardTitle>Steps</CardTitle>
                    {action.steps.map((step, idx) => {
                      const checked = idx < action.steps_completed;
                      return (
                        <label
                          key={step.id}
                          className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md px-2 py-1 hover:bg-surfaceDim"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleStep(action.id, idx)}
                            className="h-4 w-4 rounded border-border accent-accent"
                          />
                          <span
                            className={`text-sm ${checked ? "text-textTertiary line-through" : "text-text"}`}
                          >
                            {step.step_text}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resolveAction(action.id);
                    }}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      action.is_resolved
                        ? "border border-border bg-surface text-textSecondary hover:bg-surfaceDim"
                        : "bg-accent text-white hover:bg-accent/90"
                    }`}
                  >
                    {action.is_resolved
                      ? "Undo Resolution"
                      : "Mark as Resolved"}
                  </button>
                </div>
              )}
            </Card>
          );
        })}
        <TalkToAdvisor
          onClick={() => advisor.openSheet(
            actions.filter((a) => !a.is_resolved).map((a) => a.id),
            "actions"
          )}
        />

        <AdvisorSheet
          open={advisor.open}
          onClose={advisor.closeSheet}
          onBook={advisor.bookCall}
          loading={advisor.loading}
          selectedActionIds={advisor.selectedActionIds}
        />
      </div>
    </DashboardShell>
  );
}
