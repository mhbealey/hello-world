import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * Health check endpoint — reports data pipeline status.
 * GET /api/health
 *
 * Returns which env vars are set, DB connectivity, and data availability.
 * No secrets are exposed — only boolean availability.
 */
export async function GET() {
  const checks: Record<string, unknown> = {};

  // 1. Environment variables
  checks.env = {
    ANTHROPIC_API_KEY: !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_KEY_REV),
    FINNHUB_API_KEY: !!process.env.FINNHUB_API_KEY,
    FRED_API_KEY: !!process.env.FRED_API_KEY,
    TURSO_DATABASE_URL: !!process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  };

  // 2. Database connectivity + data counts
  try {
    const [profileCount, recCount, tradeCount, watchlistCount, settingsCount] =
      await Promise.all([
        prisma.userProfile.count(),
        prisma.recommendation.count({ where: { status: "active" } }),
        prisma.trade.count(),
        prisma.watchlistItem.count(),
        prisma.appSettings.count(),
      ]);

    const onboarding = await prisma.appSettings
      .findUnique({ where: { key: "onboarding_complete" } })
      .catch(() => null);

    const lastRefresh = await prisma.appSettings
      .findUnique({ where: { key: "last_refresh" } })
      .catch(() => null);

    checks.db = {
      connected: true,
      profile_exists: profileCount > 0,
      active_recommendations: recCount,
      total_trades: tradeCount,
      watchlist_items: watchlistCount,
      settings_count: settingsCount,
      onboarding_complete: onboarding?.value === "true",
      last_refresh: lastRefresh?.value || "never",
    };
  } catch (e) {
    checks.db = {
      connected: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  // 3. Data source reachability (quick checks)
  const sourceChecks = await Promise.allSettled([
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=1d&interval=1d", {
      signal: AbortSignal.timeout(5000),
    }).then((r) => ({ yahoo: r.ok })),

    process.env.FRED_API_KEY
      ? fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=DFF&api_key=${process.env.FRED_API_KEY}&file_type=json&limit=1`, {
          signal: AbortSignal.timeout(5000),
        }).then((r) => ({ fred: r.ok }))
      : Promise.resolve({ fred: false }),

    fetch("https://data.sec.gov/submissions/company_tickers.json", {
      headers: { "User-Agent": "AlphaEdge/1.0 (health-check)" },
      signal: AbortSignal.timeout(5000),
    }).then((r) => ({ edgar: r.ok })),
  ]);

  checks.data_sources = {};
  for (const result of sourceChecks) {
    if (result.status === "fulfilled") {
      Object.assign(checks.data_sources as Record<string, unknown>, result.value);
    }
  }

  // 4. Pipeline readiness
  const db = checks.db as Record<string, unknown>;
  const env = checks.env as Record<string, boolean | string>;
  const ready =
    env.ANTHROPIC_API_KEY === true &&
    db.connected === true &&
    db.profile_exists === true &&
    db.onboarding_complete === true;

  checks.pipeline = {
    ready,
    issues: [] as string[],
  };

  if (!env.ANTHROPIC_API_KEY) (checks.pipeline as { issues: string[] }).issues.push("ANTHROPIC_API_KEY not set — AI recommendations will fail");
  if (!env.FINNHUB_API_KEY) (checks.pipeline as { issues: string[] }).issues.push("FINNHUB_API_KEY not set — using Yahoo Finance as fallback");
  if (!env.FRED_API_KEY) (checks.pipeline as { issues: string[] }).issues.push("FRED_API_KEY not set — macro data unavailable");
  if (db.connected && !db.profile_exists) (checks.pipeline as { issues: string[] }).issues.push("No user profile — complete onboarding or run seed");
  if (db.connected && db.active_recommendations === 0) (checks.pipeline as { issues: string[] }).issues.push("No active recommendations — hit refresh or run seed");
  if (!db.connected) (checks.pipeline as { issues: string[] }).issues.push("Database not connected — check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN");

  // Log to deployment logs
  console.log("[HEALTH CHECK]", JSON.stringify(checks, null, 2));

  return NextResponse.json(checks, {
    status: ready ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
