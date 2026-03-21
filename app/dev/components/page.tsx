"use client";

import { Card, CardTitle, Badge, ScoreRing, ProgressBar, EmptyState, CardSkeleton, ListSkeleton } from "@/components/ui";
import { FreshnessDot, ErrorBanner, TalkToAdvisor } from "@/components/shared";
import { toast, ToastProvider } from "@/components/ui/toast";

export default function ComponentGallery() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg p-6">
        <h1 className="mb-6 text-2xl font-bold text-text">Component Gallery</h1>

        <div className="mx-auto max-w-md space-y-8">
          {/* Badges */}
          <Section title="Badges">
            <div className="flex flex-wrap gap-2">
              <Badge label="Critical" variant="critical" />
              <Badge label="High" variant="high" />
              <Badge label="Medium" variant="medium" />
              <Badge label="Low" variant="low" />
              <Badge label="Neutral" variant="neutral" />
            </div>
          </Section>

          {/* Score Rings */}
          <Section title="Score Rings">
            <div className="flex gap-6">
              <ScoreRing score={86} label="High" />
              <ScoreRing score={65} label="Medium" />
              <ScoreRing score={35} label="Low" />
            </div>
          </Section>

          {/* Progress Bars */}
          <Section title="Progress Bars">
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs text-textTertiary">Success (91%)</p>
                <ProgressBar value={91} color="bg-success" />
              </div>
              <div>
                <p className="mb-1 text-xs text-textTertiary">Warning (65%)</p>
                <ProgressBar value={65} color="bg-warning" />
              </div>
              <div>
                <p className="mb-1 text-xs text-textTertiary">Accent (42%)</p>
                <ProgressBar value={42} color="bg-accent" />
              </div>
            </div>
          </Section>

          {/* Cards */}
          <Section title="Cards">
            <Card>
              <CardTitle>Sample Card</CardTitle>
              <p className="mt-1 text-xl font-semibold text-text">$46.8M</p>
              <p className="mt-1 text-xs text-textTertiary">Annual Loss Exposure</p>
            </Card>
          </Section>

          {/* Freshness Dots */}
          <Section title="Freshness Indicators">
            <div className="space-y-2">
              <FreshnessDot daysSinceUpdate={2} />
              <FreshnessDot daysSinceUpdate={15} />
              <FreshnessDot daysSinceUpdate={45} />
            </div>
          </Section>

          {/* Empty State */}
          <Section title="Empty State">
            <EmptyState
              message="No risk scenarios have been assessed. Run your first assessment."
              cta="Start Assessment"
              onAction={() => toast("Assessment started")}
            />
          </Section>

          {/* Error Banner */}
          <Section title="Error Banner">
            <ErrorBanner
              message="Unable to load data. Pull down to refresh or try again in a moment."
              onRetry={() => toast("Retrying...")}
            />
          </Section>

          {/* Skeletons */}
          <Section title="Skeletons">
            <div className="space-y-3">
              <CardSkeleton />
              <ListSkeleton rows={2} />
            </div>
          </Section>

          {/* Talk to Advisor */}
          <Section title="Talk to Advisor">
            <TalkToAdvisor onClick={() => toast("Advisor sheet opened")} />
          </Section>

          {/* Toast trigger */}
          <Section title="Toast">
            <div className="flex gap-2">
              <button
                onClick={() => toast("Action resolved")}
                className="rounded-lg bg-text px-3 py-2 text-sm text-surface"
              >
                Success Toast
              </button>
              <button
                onClick={() => toast("Something went wrong", "error")}
                className="rounded-lg bg-danger px-3 py-2 text-sm text-white"
              >
                Error Toast
              </button>
            </div>
          </Section>
        </div>
      </div>
    </ToastProvider>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-textTertiary">
        {title}
      </h2>
      {children}
    </div>
  );
}
