"use client";

import { useState } from "react";

interface AdvisorSheetProps {
  open: boolean;
  onClose: () => void;
  onBook: (time: string) => Promise<unknown>;
  loading: boolean;
  selectedActionIds: string[];
}

const TIME_SLOTS = [
  "Tomorrow 10:00 AM",
  "Tomorrow 2:00 PM",
  "Wednesday 10:00 AM",
  "Wednesday 2:00 PM",
  "Thursday 10:00 AM",
  "Friday 10:00 AM",
];

export function AdvisorSheet({
  open,
  onClose,
  onBook,
  loading,
  selectedActionIds,
}: AdvisorSheetProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up rounded-t-xl border-t border-border bg-surface safe-area-pb">
        <div className="mx-auto max-w-lg px-4 pb-6 pt-4">
          {/* Handle */}
          <div className="mb-4 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-textMuted" />
          </div>

          <h2 className="text-lg font-semibold text-text">
            Schedule a Call
          </h2>
          <p className="mt-1 text-sm text-textSecondary">
            Book time with your cybersecurity advisor to discuss{" "}
            {selectedActionIds.length > 0
              ? `${selectedActionIds.length} action${selectedActionIds.length > 1 ? "s" : ""}`
              : "your governance posture"}
            .
          </p>

          {/* Time slots */}
          <div className="mt-4 space-y-2">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  selectedTime === time
                    ? "border-accent bg-accentBg text-accent"
                    : "border-border bg-surface text-text hover:bg-surfaceDim"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-textSecondary transition-colors hover:bg-surfaceDim"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedTime && onBook(selectedTime)}
              disabled={!selectedTime || loading}
              className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {loading ? "Scheduling…" : "Schedule a Call"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
