"use client";

import { useState, useRef, useCallback } from "react";

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export function usePullToRefresh({ onRefresh, threshold = 80 }: PullToRefreshOptions) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pullDistance = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (refreshing) return;
    const scrollTop = (e.currentTarget as HTMLElement).scrollTop;
    if (scrollTop <= 0) {
      startY.current = e.touches[0]?.clientY ?? 0;
      setPulling(true);
    }
  }, [refreshing]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling || refreshing) return;
    pullDistance.current = Math.max(0, (e.touches[0]?.clientY ?? 0) - startY.current);
  }, [pulling, refreshing]);

  const onTouchEnd = useCallback(async () => {
    if (!pulling || refreshing) return;
    setPulling(false);
    if (pullDistance.current >= threshold) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    pullDistance.current = 0;
  }, [pulling, refreshing, threshold, onRefresh]);

  return {
    refreshing,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
