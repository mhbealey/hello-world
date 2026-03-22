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
import { RefreshCw } from "lucide-react";

const ratingFilters = [
  { label: "All", value: "all" },
  { label: "Strong Buy", value: "strong_buy" },
  { label: "Buy", value: "buy" },
  { label: "Hold", value: "hold" },
];
const sortOptions = [
  { label: "By Score", value: "score" },
  { label: "By Confidence", value: "confidence" },
  { label: "By Urgency", value: "time_sensitivity" },
];

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recs, setRecs] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fullAnalysis, setFullAnalysis] = useState<any>(null);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const market = isMarketOpen();

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({ sort: sortBy });
      if (ratingFilter !== "all") params.set("rating", ratingFilter);

      const [recsRes, alertsRes] = await Promise.all([
        fetch(`/api/recommendations?${params}`),
        fetch("/api/alerts"),
      ]);

      if (recsRes.ok) setRecs(await recsRes.json());
      if (alertsRes.ok) setAlerts(await alertsRes.json());
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [sortBy, ratingFilter, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/recommendations/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to refresh", "error");
      } else {
        showToast(`${data.count} recommendations updated`, "success");
        await fetchData();
      }
    } catch {
      showToast("Failed to refresh recommendations", "error");
    } finally {
      setRefreshing(false);
    }
  }

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
    <div className="px-4 pt-2 pb-4">
      {/* Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="flex flex-col gap-2 mb-5">
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
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">{getGreeting()}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${market.open ? "bg-gain-green animate-[pulse-glow_2s_ease-in-out_infinite]" : "bg-text-tertiary"}`} />
          <span className="text-sm text-text-secondary">
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
          options={ratingFilters}
          selected={ratingFilter}
          onChange={(v) => setRatingFilter(v as string)}
        />
        <PillSelector
          options={sortOptions}
          selected={sortBy}
          onChange={(v) => setSortBy(v as string)}
        />
      </div>

      {/* Refresh */}
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="w-full flex items-center justify-center gap-2 text-sm text-accent-blue mb-5 min-h-[44px] disabled:opacity-40 transition-opacity active:opacity-70"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
        {refreshing ? "Refreshing…" : "Refresh Recommendations"}
      </button>

      {/* Recommendation Feed */}
      {loading ? (
        <SkeletonCardList count={3} />
      ) : recs.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-6 w-6 text-accent-blue" />
          </div>
          <p className="text-base text-text-secondary mb-1">No recommendations yet</p>
          <p className="text-sm text-text-tertiary">{RECOMMENDATIONS.emptyFirst}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {recs.map((rec, i) => (
            <div
              key={rec.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-[fadeIn_400ms_cubic-bezier(0.16,1,0.3,1)_backwards]"
            >
              <RecommendationCard
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
                  showToast(`${rec.ticker} added to watchlist`, "success");
                }}
                onViewAnalysis={() => setFullAnalysis(rec)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
