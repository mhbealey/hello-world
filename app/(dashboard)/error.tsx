"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="h-14 border-b border-border bg-surface" />
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <h2 className="text-lg font-semibold text-text">Something went wrong</h2>
        <p className="mt-2 text-sm text-textSecondary">
          {error.message || "Unable to load this page."}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
