"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RecommendationCard } from "@/components/cards/recommendation-card";
import { AlertCard } from "@/components/cards/alert-card";
import { FullAnalysis } from "@/components/cards/full-analysis";
import { SkeletonCardList } from "@/components/cards/skeleton-card";
import { PillSelector } from "@/components/ui/pill-selector";
import { SearchBar } from "@/components/ui/search-bar";
import { useToast } from "@/components/ui/toast";
import { RECOMMENDATIONS } from "@/constants/content";
import { getGreeting } from "@/lib/utils/format";
import { isMarketOpen } from "@/lib/utils/market-hours";
import type { AlertItem } from "@/lib/types";
import type { Recommendation } from "@/components/cards/recommendation-card";

const RATING_FILTERS = [
  { label: "All", value: "all" },
  { label: "Strong Buy", value: "strong_buy" },
  { label: "Buy", value: "buy" },
  { label: "Hold", value: "hold" },
] as const;
const SORT_OPTIONS = [
  { label: "By Score", value: "score" },
  { label: "By Confidence", value: "confidence" },
  { label: "By Urgency", value: "time_sensitivity" },
] as const;

function useHomePageData(sortBy: string, ratingFilter: string) {
  const { showToast } = useToast();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({ sort: sortBy });
      if (ratingFilter !== "all") params.set("rating", ratingFilter);

      const [recsRes, alertsRes] = await Promise.all([
        fetch(`/api/recommendations?${params}`),
        fetch("/api/alerts"),
      ]);

      if (recsRes.ok) {
        const data = await recsRes.json();
        // Guard against stale SW cache returning { error: "offline" } or non-array
        if (Array.isArray(data)) setRecs(data);
      }
      if (alertsRes.ok) {
        const data = await alertsRes.json();
        if (Array.isArray(data)) setAlerts(data);
      }
    } catch {
      // Don't show error toast — stale SW cache may serve old data
    } finally {
      setLoading(false);
    }
  }, [sortBy, ratingFilter, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90_000); // 90s client timeout
      const res = await fetch("/api/recommendations/refresh", {
        method: "POST",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Failed to refresh", "error");
      } else {
        showToast(`Refreshed ${data.count} recommendations`, "success");
        await fetchData();
      }
    } catch (e) {
      const msg = e instanceof DOMException && e.name === "AbortError"
        ? "Refresh timed out — try again or check your API keys"
        : "Failed to refresh recommendations";
      showToast(msg, "error");
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, showToast]);

  return { recs, alerts, loading, refreshing, refresh, fetchData };
}

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [fullAnalysis, setFullAnalysis] = useState<Recommendation | null>(null);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const market = isMarketOpen();
  const { recs, alerts, loading, refreshing, refresh } = useHomePageData(sortBy, ratingFilter);

  async function handleSearch(query: string) {
    const res = await fetch(`/api/market/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return res.json();
  }

  function handleSearchSelect(ticker: string) {
    router.push(`/home?analyze=${ticker}`);
  }

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id));

  if (fullAnalysis) {
    return <FullAnalysis recommendation={fullAnalysis} onBack={() => setFullAnalysis(null)} />;
  }

  return (
    <div className="p-[16px]">
      {/* Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {visibleAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={(id) => setDismissedAlerts((prev) => new Set([...prev, id]))}
            />
          ))}
        </div>
      )}

      {/* Greeting + Market Status */}
      <div className="mb-4">
        <h1 className="text-[22px] font-semibold text-text-primary">{getGreeting()}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-block w-2 h-2 rounded-full ${market.open ? "bg-gain-green" : "bg-text-tertiary"}`} />
          <span className="text-[14px] text-text-secondary">
            {market.status === "market_open" ? "Market Open" :
             market.status === "pre_market" ? "Pre-Market" :
             market.status === "after_hours" ? "After Hours" : "Market Closed"}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar
          placeholder="Analyze any stock…"
          onSearch={handleSearch}
          onSelect={handleSearchSelect}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 mb-4">
        <PillSelector
          options={RATING_FILTERS as unknown as { label: string; value: string }[]}
          selected={ratingFilter}
          onChange={(v) => setRatingFilter(v as string)}
        />
        <PillSelector
          options={SORT_OPTIONS as unknown as { label: string; value: string }[]}
          selected={sortBy}
          onChange={(v) => setSortBy(v as string)}
        />
      </div>

      {/* Pull to refresh button */}
      <button
        onClick={refresh}
        disabled={refreshing}
        className="w-full text-center text-[14px] text-accent-blue mb-4 min-h-[44px] disabled:opacity-50"
      >
        {refreshing ? "Refreshing..." : "↻ Refresh Recommendations"}
      </button>

      {/* Recommendation Feed */}
      {loading ? (
        <SkeletonCardList count={3} />
      ) : recs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[16px] text-text-secondary">{RECOMMENDATIONS.emptyFirst}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {recs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              isExpanded={expandedId === rec.id}
              onToggleExpand={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
              onStartTrade={() => router.push(`/trade?rec=${rec.id}`)}
              onWatch={async () => {
                await fetch("/api/watchlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ticker: rec.ticker, company_name: rec.company_name }),
                });
                showToast(`Added ${rec.ticker} to watchlist`, "success");
              }}
              onViewAnalysis={() => setFullAnalysis(rec)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
