import { callClaude } from "./client";
import { buildRecommendationPrompt, buildSingleStockPrompt, buildBundlePrompt, buildMarketScanPrompt } from "./prompts";
import type { MarketDataItem } from "./prompts";
import { claudeResponseSchema, bundleResponseSchema } from "@/lib/types/schemas";
import type { RecommendationItem, BundleResponse } from "@/lib/types/schemas";
import { prisma } from "@/lib/db/client";
import { getDataProvider } from "@/lib/data";
import { scanMarket, scanMarketFallback } from "@/lib/data/screener";
import { getAllTickers } from "@/lib/data/universe";

const COST_PER_CALL = 0.02;
const MIN_REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

async function checkRateLimits(): Promise<{ allowed: boolean; reason?: string }> {
  const [capSetting, lastRefresh] = await Promise.all([
    prisma.appSettings.findUnique({ where: { key: "daily_api_cap" } }),
    prisma.appSettings.findUnique({ where: { key: "last_refresh" } }),
  ]);

  const dailyCap = parseInt(capSetting?.value || "20");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const usage = await prisma.apiUsage.findFirst({ where: { date: today } });
  if (usage && usage.call_count >= dailyCap) {
    return { allowed: false, reason: "daily_cap" };
  }

  if (lastRefresh?.value && lastRefresh.value !== "null") {
    const parsed = new Date(lastRefresh.value);
    if (!isNaN(parsed.getTime())) {
      const elapsed = Date.now() - parsed.getTime();
      if (elapsed < MIN_REFRESH_INTERVAL_MS) {
        const minutesLeft = Math.ceil((MIN_REFRESH_INTERVAL_MS - elapsed) / 60000);
        return { allowed: false, reason: `cooldown_${minutesLeft}` };
      }
    }
  }

  return { allowed: true };
}

async function fetchMarketData(tickers: string[]): Promise<MarketDataItem[]> {
  const provider = getDataProvider();

  const settled = await Promise.allSettled(
    tickers.map(async (ticker) => {
      const [quote, fundamentals] = await Promise.all([
        provider.getQuote(ticker),
        provider.getFundamentals(ticker),
      ]);

      return {
        ticker,
        price: quote?.price || 0,
        change_pct: quote?.changePercent || 0,
        fundamentals,
        assetClass: "stock",
      } satisfies MarketDataItem;
    })
  );

  const results: MarketDataItem[] = [];
  for (let i = 0; i < settled.length; i++) {
    const s = settled[i];
    if (s.status === "fulfilled") {
      results.push(s.value);
    } else {
      console.error(`Failed to fetch ${tickers[i]}:`, s.reason);
    }
  }
  return results;
}

function parseClaudeResponse(text: string): RecommendationItem[] | null {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(cleaned);
    const validated = claudeResponseSchema.parse(parsed);
    return validated.recommendations;
  } catch (e) {
    console.error("Failed to parse Claude response:", e);
    return null;
  }
}

function parseBundleResponse(text: string): BundleResponse | null {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(cleaned);
    return bundleResponseSchema.parse(parsed);
  } catch (e) {
    console.error("Failed to parse bundle response:", e);
    return null;
  }
}

async function trackUsage(cost: number) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const existing = await prisma.apiUsage.findFirst({ where: { date: today } });
  if (existing) {
    await prisma.apiUsage.update({
      where: { id: existing.id },
      data: {
        call_count: existing.call_count + 1,
        estimated_cost: existing.estimated_cost + cost,
      },
    });
  } else {
    await prisma.apiUsage.create({
      data: { date: today, call_count: 1, estimated_cost: cost },
    });
  }
}

async function saveRecommendations(recs: RecommendationItem[]) {
  const now = new Date();

  const existingRecs = await prisma.recommendation.findMany({
    where: { ticker: { in: recs.map((r) => r.ticker) }, status: "active" },
    orderBy: { generated_at: "desc" },
  });
  const existingByTicker = new Map(existingRecs.map((r) => [r.ticker, r]));

  await Promise.all(
    recs.map(async (rec) => {
      const existing = existingByTicker.get(rec.ticker);

      const expiresAt = new Date(now);
      if (rec.time_sensitivity === "act_today") {
        expiresAt.setHours(16, 0, 0, 0);
      } else if (rec.time_sensitivity === "this_week") {
        const daysUntilFriday = (5 - expiresAt.getDay() + 7) % 7 || 7;
        expiresAt.setDate(expiresAt.getDate() + daysUntilFriday);
        expiresAt.setHours(16, 0, 0, 0);
      } else {
        expiresAt.setDate(expiresAt.getDate() + 14);
      }

      if (existing) {
        await prisma.recommendation.update({
          where: { id: existing.id },
          data: { status: "expired" },
        });
      }

      const benchmarkScore = Math.round(((rec.ai_score - 1) / 9) * 98 + 1);

      await prisma.recommendation.create({
        data: {
          ticker: rec.ticker,
          company_name: rec.company_name,
          asset_class: "stock",
          ai_score: rec.ai_score,
          benchmark_score: benchmarkScore,
          previous_ai_score: existing?.ai_score ?? null,
          score_change_reason: existing
            ? `Score changed from ${existing.ai_score} to ${rec.ai_score}`
            : null,
          rating: rec.rating,
          confidence: rec.confidence,
          thesis: rec.thesis,
          bull_case: "{}",
          bear_case: "{}",
          key_metrics: "{}",
          factor_scores: "{}",
          factor_details: "{}",
          position_size_pct: rec.position_size_pct,
          order_type: "limit",
          entry_price: rec.entry_price,
          stop_loss: rec.stop_loss,
          take_profit: rec.take_profit,
          time_sensitivity: rec.time_sensitivity,
          full_analysis: rec.thesis,
          catalysts: "[]",
          comparable_companies: "[]",
          status: "active",
          version: existing ? existing.version + 1 : 1,
          generated_at: now,
          expires_at: expiresAt,
        },
      });
    })
  );
}

/**
 * Full market scan → AI scoring pipeline.
 *
 * 1. Runs every Yahoo Finance screener to pull candidates from the entire market
 * 2. Pre-ranks by composite interest score (volume, momentum, multi-screener appearance)
 * 3. Sends top candidates to Claude for deep analysis
 * 4. Stores scored recommendations
 */
export async function generateMarketScan(): Promise<{
  recommendations: RecommendationItem[];
  scannedCount: number;
  error?: string;
}> {
  const rateCheck = await checkRateLimits();
  if (!rateCheck.allowed) {
    return { recommendations: [], scannedCount: 0, error: rateCheck.reason };
  }

  const profile = await prisma.userProfile.findFirst();
  if (!profile) {
    return { recommendations: [], scannedCount: 0, error: "no_profile" };
  }

  // Step 1: Scan the entire market via screeners
  let candidates = await scanMarket(30);

  // If screeners failed, fall back to static universe + trending
  if (candidates.length === 0) {
    console.warn("Screeners returned 0 results, falling back to static universe");
    const fallbackTickers = getAllTickers().slice(0, 50);
    candidates = await scanMarketFallback(fallbackTickers);
  }

  if (candidates.length === 0) {
    return { recommendations: [], scannedCount: 0, error: "no_market_data" };
  }

  const scannedCount = candidates.length;

  // Step 2: Include watchlist tickers that might not be in screener results
  const watchlist = await prisma.watchlistItem.findMany();
  const watchlistTickers = watchlist
    .map((w) => w.ticker)
    .filter((t) => !candidates.some((c) => c.ticker === t));

  // Fetch data for watchlist tickers not already in candidates
  if (watchlistTickers.length > 0) {
    const watchlistResults = await scanMarketFallback(watchlistTickers);
    candidates = [...candidates, ...watchlistResults];
  }

  // Step 3: Build market data for Claude
  const openTrades = await prisma.trade.findMany({ where: { status: "open" } });
  const holdings = openTrades.map((t) => ({
    ticker: t.ticker, shares: t.shares, avg_cost: t.entry_price,
  }));

  let instruments: string[];
  try { instruments = JSON.parse(profile.instruments); }
  catch { instruments = []; }

  // Step 4: Send to Claude for scoring
  const { system, user } = buildMarketScanPrompt(
    {
      archetype: profile.archetype,
      investing_style: profile.investing_style,
      risk_tolerance: profile.risk_tolerance,
      instruments,
      portfolio_balance: profile.portfolio_balance,
    },
    holdings,
    candidates.map((c) => ({
      ticker: c.ticker,
      name: c.name,
      price: c.price,
      changePercent: c.changePercent,
      volume: c.volume,
      marketCap: c.marketCap,
      pe: c.pe,
      fiftyTwoWeekChangePercent: c.fiftyTwoWeekChangePercent,
      analystRating: c.analystRating,
      sources: c.sources,
    }))
  );

  const rawResponse = await callClaude(system, user, 4096);
  const recs = parseClaudeResponse(rawResponse);

  if (!recs) {
    return { recommendations: [], scannedCount, error: "validation_failed" };
  }

  // Step 5: Save to DB
  await saveRecommendations(recs);

  await Promise.all([
    trackUsage(COST_PER_CALL),
    prisma.appSettings.upsert({
      where: { key: "last_refresh" },
      update: { value: new Date().toISOString() },
      create: { key: "last_refresh", value: new Date().toISOString() },
    }),
  ]);

  return { recommendations: recs, scannedCount };
}

/**
 * Legacy: score a specific list of tickers (used by watchlist, manual analysis).
 */
export async function generateRecommendations(
  tickers: string[]
): Promise<{ recommendations: RecommendationItem[]; error?: string }> {
  const rateCheck = await checkRateLimits();
  if (!rateCheck.allowed) {
    return { recommendations: [], error: rateCheck.reason };
  }

  const profile = await prisma.userProfile.findFirst();
  if (!profile) {
    return { recommendations: [], error: "no_profile" };
  }

  const [openTrades, marketData] = await Promise.all([
    prisma.trade.findMany({ where: { status: "open" } }),
    fetchMarketData(tickers),
  ]);

  if (marketData.length === 0) {
    return { recommendations: [], error: "no_market_data" };
  }

  const holdings = openTrades.map((t) => ({
    ticker: t.ticker, shares: t.shares, avg_cost: t.entry_price,
  }));

  let instruments: string[];
  try { instruments = JSON.parse(profile.instruments); }
  catch { instruments = []; }

  const { system, user } = buildRecommendationPrompt(
    {
      archetype: profile.archetype,
      investing_style: profile.investing_style,
      risk_tolerance: profile.risk_tolerance,
      instruments,
      portfolio_balance: profile.portfolio_balance,
    },
    holdings,
    tickers,
    marketData
  );

  const rawResponse = await callClaude(system, user);
  const recs = parseClaudeResponse(rawResponse);

  if (!recs) {
    return { recommendations: [], error: "validation_failed" };
  }

  await saveRecommendations(recs);

  await Promise.all([
    trackUsage(COST_PER_CALL),
    prisma.appSettings.upsert({
      where: { key: "last_refresh" },
      update: { value: new Date().toISOString() },
      create: { key: "last_refresh", value: new Date().toISOString() },
    }),
  ]);

  return { recommendations: recs };
}

export async function generateSingleAnalysis(
  ticker: string
): Promise<{ recommendation: RecommendationItem | null; error?: string }> {
  const rateCheck = await checkRateLimits();
  if (!rateCheck.allowed) {
    return { recommendation: null, error: rateCheck.reason };
  }

  const profile = await prisma.userProfile.findFirst();
  if (!profile) return { recommendation: null, error: "no_profile" };

  const openTrades = await prisma.trade.findMany({ where: { status: "open" } });
  const holdings = openTrades.map((t) => ({
    ticker: t.ticker, shares: t.shares, avg_cost: t.entry_price,
  }));

  const provider = getDataProvider();
  const [quote, fundamentals] = await Promise.all([
    provider.getQuote(ticker),
    provider.getFundamentals(ticker),
  ]);

  if (!quote) return { recommendation: null, error: "no_market_data" };

  let instruments: string[];
  try { instruments = JSON.parse(profile.instruments); }
  catch { instruments = []; }

  const marketData: MarketDataItem = {
    ticker,
    price: quote.price,
    change_pct: quote.changePercent || 0,
    fundamentals,
    assetClass: "stock",
  };

  const { system, user } = buildSingleStockPrompt(
    {
      archetype: profile.archetype,
      investing_style: profile.investing_style,
      risk_tolerance: profile.risk_tolerance,
      instruments,
      portfolio_balance: profile.portfolio_balance,
    },
    holdings,
    ticker,
    marketData
  );

  const rawResponse = await callClaude(system, user);
  const recs = parseClaudeResponse(rawResponse);

  await trackUsage(COST_PER_CALL);

  return { recommendation: recs?.[0] || null };
}

export async function generateBundle(
  bundleSize: number,
  strategy: string,
  filters: {
    asset_classes?: string[];
    min_score?: number;
    sectors?: string[];
  }
): Promise<{ bundle: BundleResponse | null; error?: string }> {
  const rateCheck = await checkRateLimits();
  if (!rateCheck.allowed) {
    return { bundle: null, error: rateCheck.reason };
  }

  const profile = await prisma.userProfile.findFirst();
  if (!profile) return { bundle: null, error: "no_profile" };

  const openTrades = await prisma.trade.findMany({ where: { status: "open" } });
  const holdings = openTrades.map((t) => ({
    ticker: t.ticker, shares: t.shares, avg_cost: t.entry_price,
  }));

  // Use market scan results as candidates instead of hardcoded lists
  let candidates = await scanMarket(Math.max(bundleSize * 3, 20));

  if (candidates.length === 0) {
    // Fallback to static universe
    const fallbackTickers = getAllTickers().slice(0, 30);
    candidates = await scanMarketFallback(fallbackTickers);
  }

  if (candidates.length === 0) {
    return { bundle: null, error: "no_market_data" };
  }

  // Fetch full fundamentals for candidates
  const marketData = await fetchMarketData(candidates.map((c) => c.ticker));
  if (marketData.length === 0) {
    return { bundle: null, error: "no_market_data" };
  }

  let instruments: string[];
  try { instruments = JSON.parse(profile.instruments); }
  catch { instruments = []; }

  const { system, user } = buildBundlePrompt(
    {
      archetype: profile.archetype,
      investing_style: profile.investing_style,
      risk_tolerance: profile.risk_tolerance,
      instruments,
      portfolio_balance: profile.portfolio_balance,
    },
    holdings,
    bundleSize,
    { ...filters, strategy },
    marketData
  );

  const rawResponse = await callClaude(system, user, 4096);
  const bundle = parseBundleResponse(rawResponse);

  if (!bundle) {
    return { bundle: null, error: "validation_failed" };
  }

  await prisma.bundlePortfolio.create({
    data: {
      name: bundle.bundle_name,
      size: bundleSize,
      strategy,
      asset_filters: JSON.stringify(filters),
      total_score: bundle.total_score,
      allocation: JSON.stringify(bundle.allocations),
      rationale: bundle.rationale,
      status: "active",
    },
  });

  await trackUsage(COST_PER_CALL);

  return { bundle };
}
