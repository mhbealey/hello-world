"use client";

import { useState, useCallback } from "react";
import { toast } from "@/components/ui/toast";

interface UseResolutionOptions {
  onResolve?: (actionId: string) => void;
  onUndo?: (actionId: string) => void;
}

export function useResolution(options?: UseResolutionOptions) {
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  const resolve = useCallback(
    async (actionId: string, actionTitle: string) => {
      setLoading(actionId);
      // In production: POST to /api and write to Supabase
      setResolvedIds((prev) => new Set(prev).add(actionId));
      toast(`${actionTitle} resolved`);
      options?.onResolve?.(actionId);
      setLoading(null);
    },
    [options]
  );

  const undo = useCallback(
    async (actionId: string, actionTitle: string) => {
      setLoading(actionId);
      setResolvedIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
      toast(`${actionTitle} restored`);
      options?.onUndo?.(actionId);
      setLoading(null);
    },
    [options]
  );

  const isResolved = useCallback(
    (actionId: string) => resolvedIds.has(actionId),
    [resolvedIds]
  );

  return { resolve, undo, isResolved, loading };
}
