"use client";

import { useState, useCallback } from "react";
import { toast } from "@/components/ui/toast";

interface AdvisorState {
  open: boolean;
  selectedActionIds: string[];
  sourceContext: string;
  loading: boolean;
}

export function useAdvisor() {
  const [state, setState] = useState<AdvisorState>({
    open: false,
    selectedActionIds: [],
    sourceContext: "",
    loading: false,
  });

  const openSheet = useCallback(
    (actionIds: string[] = [], context = "") => {
      setState({
        open: true,
        selectedActionIds: actionIds,
        sourceContext: context,
        loading: false,
      });
    },
    []
  );

  const closeSheet = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const bookCall = useCallback(
    async (selectedTime: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const res = await fetch("/api/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selected_action_ids: state.selectedActionIds,
            source_context: state.sourceContext,
            selected_time: selectedTime,
          }),
        });

        if (!res.ok) throw new Error("Failed to book");

        const data = await res.json();
        toast(`Call scheduled for ${selectedTime}`);
        setState((prev) => ({ ...prev, open: false, loading: false }));
        return data;
      } catch {
        toast("Something went wrong. Please try again.", "error");
        setState((prev) => ({ ...prev, loading: false }));
        return null;
      }
    },
    [state.selectedActionIds, state.sourceContext]
  );

  return {
    ...state,
    openSheet,
    closeSheet,
    bookCall,
  };
}
