import { callClaude } from "./client";
import { buildRecommendationPrompt, buildSingleStockPrompt, buildBundlePrompt } from "./prompts";
import { claudeResponseSchema, bundleResponseSchema } from "@/lib/types/schemas";
import type { RecommendationItem, BundleResponse } from "@/lib/types/schemas";
import { computeBenchmarkScore, type FactorScores } from "./scoring";
import { prisma } from "@/lib/db/client";
import { getDataProvider, buildMacroContext, buildEdgarContext } from "@/lib/data";

const COST_PER_CALL = 0.02;
const MIN_REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

async function checkRateLimits(): Promise<{ allowed: boolean; reason?: string }> {
  const capSetting = await prisma.appSettings.findUnique({ where: { key: "daily_api_cap" } });
  const dailyCap = parseInt(capSetting?.value || "20");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const usage = await prisma.apiUsage.findFirst({ where: { date: today } });
  if (usage && usage.call_count >= dailyCap) {
    return { allowed: false, reason: "daily_cap" };
  }

  const lastRefresh = await prisma.appSettings.findUnique({ where: { key: "last_refresh" } });
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

function inferAssetClass(ticker: string, fundamentals: { sector?: string | null } | null): string {
  const upper = ticker.toUpperCase();
  // Common ETFs
  if (["SPY", "QQQ", "IWM", "DIA", "VTI", "VOO", "VEA", "VWO", "BND", "AGG", "TLT", "GLD", "SLV", "XLF", "XLK", "XLE", "XLV", "ARKK"].includes(upper)) return "etf";
  // Bond ETFs
  if (["BND", "AGG", "TLT", "IEF", "SHY", "LQD", "HYG", "TIP", "VCIT", "VCSH"].includes(upper)) return "bond";
  // REIT tickers
  if (["O", "VNQ", "AMT", "PLD", "CCI", "SPG", "EQIX", "PSA", "DLR", "WELL"].includes(upper)) return "reit";
  // Commodity ETFs
  if (["GLD", "SLV", "USO", "UNG", "DBA", "DBC", "PDBC", "CORN", "WEAT"].includes(upper)) return "commodity";
  // Crypto
  if (["BTC", "ETH", "MSTR", "COIN", "GBTC", "ETHE", "BITO", "MARA", "RIOT", "HUT"].includes(upper)) return "crypto";
  // Check sector for REITs
  if (fundamentals?.sector === "Real Estate") return "reit";
  return "stock";
}

async function fetchMarketData(tickers: string[]) {
  const provider = getDataProvider();
  const results = [];
  const skipped: string[] = [];

  for (const ticker of tickers) {
    try {
      const [quote, fundamentals, analysts, earnings, edgarData] = await Promise.all([
        provider.getQuote(ticker),
        provider.getFundamentals(ticker),
        provider.getAnalystRatings(ticker),
        provider.getEarningsCalendar(ticker),
        buildEdgarContext(ticker).catch(() => null),
      ]);

      const assetClass = inferAssetClass(ticker, fundamentals);

      results.push({
        ticker,
        price: quote?.price ?? 0,
        fundamentals: JSON.stringify(fundamentals || {}),
        analystRatings: JSON.stringify(analysts || {}),
        historicalPrices: "See price data",
        earnings: JSON.stringify(earnings || []),
        assetClass,
        edgarFinancials: edgarData ?? undefined,
      });
    } catch (e) {
      console.error(`Failed to fetch market data for ${ticker}:`, e);
      skipped.push(ticker);
    }
  }

  if (skipped.length > 0) {
    console.warn(`Skipped tickers due to data fetch failures: ${skipped.join(", ")}`);
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

function extractFactorScores(rec: RecommendationItem): FactorScores {
  return {
    technical: rec.factor_scores.technical.score,
    fundamental: rec.factor_scores.fundamental.score,
    sentiment: rec.factor_scores.sentiment.score,
    momentum: rec.factor_scores.momentum.score,
    earnings: rec.factor_scores.earnings.score,
    governance: rec.factor_scores.governance?.score ?? 5,
    macro: rec.factor_scores.macro?.score ?? 5,
  };
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

  const openTrades = await prisma.trade.findMany({ where: { status: "open" } });

  // Fetch market data and macro context in parallel
  const [marketData, macroContext] = await Promise.all([
    fetchMarketData(tickers),
    buildMacroContext().catch(() => ""),
  ]);

  if (marketData.length === 0) {
    return { recommendations: [], error: "no_market_data" };
  }

  // Build holdings with sector data from market data when available
  const holdings = openTrades.map((t) => {
    const md = marketData.find((m) => m.ticker === t.ticker);
    let sector: string | undefined;
    if (md) {
      try {
        const f = JSON.parse(md.fundamentals);
        sector = f.sector || undefined;
      } catch { /* ignore */ }
    }
    return { ticker: t.ticker, shares: t.shares, avg_cost: t.entry_price, sector };
  });

  let instruments: string[];
  try { instruments = JSON.parse(profile.instruments); }
  catch { instruments = []; }

  const macro = macroContext ? { summary: macroContext } : undefined;

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
    marketData,
    macro
  );

  let rawResponse = await callClaude(system, user);
  let recs = parseClaudeResponse(rawResponse);

  if (!recs) {
    console.warn("First Claude response invalid, retrying...");
    rawResponse = await callClaude(
      system,
      user + "\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY valid JSON matching the exact schema. No markdown."
    );
    recs = parseClaudeResponse(rawResponse);
  }

  if (!recs) {
    return { recommendations: [], error: "validation_failed" };
  }

  // Save recommendations to DB with benchmark scores
  const now = new Date();
  for (const rec of recs) {
    const existing = await prisma.recommendation.findFirst({
      where: { ticker: rec.ticker, status: "active" },
      orderBy: { generated_at: "desc" },
    });

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

    const factors = extractFactorScores(rec);
    const benchmarkScore = computeBenchmarkScore(factors, profile.investing_style);
    const governanceScore = factors.governance;

    await prisma.recommendation.create({
      data: {
        ticker: rec.ticker,
        company_name: rec.company_name,
        asset_class: rec.asset_class || "stock",
        ai_score: rec.ai_score,
        benchmark_score: benchmarkScore,
        previous_ai_score: existing?.ai_score ?? null,
        score_change_reason: existing
          ? `Score changed from ${existing.ai_score} to ${rec.ai_score}`
          : null,
        rating: rec.rating,
        confidence: rec.confidence,
        thesis: rec.thesis,
        bull_case: JSON.stringify(rec.bull_case),
        bear_case: JSON.stringify(rec.bear_case),
        key_metrics: JSON.stringify(rec.key_metrics),
        factor_scores: JSON.stringify(rec.factor_scores),
        factor_details: JSON.stringify({}),
        governance_score: governanceScore,
        governance_details: JSON.stringify(rec.governance_details || {}),
        position_size_pct: rec.position_size_pct,
        order_type: rec.order_type,
        entry_price: rec.entry_price,
        stop_loss: rec.stop_loss,
        take_profit: rec.take_profit,
        time_sensitivity: rec.time_sensitivity,
        full_analysis: rec.full_analysis,
        catalysts: JSON.stringify(rec.catalysts),
        comparable_companies: JSON.stringify(rec.comparable_companies),
        status: "active",
        version: existing ? existing.version + 1 : 1,
        generated_at: now,
        expires_at: expiresAt,
      },
    });
  }

  await trackUsage(COST_PER_CALL);

  await prisma.appSettings.upsert({
    where: { key: "last_refresh" },
    update: { value: now.toISOString() },
    create: { key: "last_refresh", value: now.toISOString() },
  });

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
  const [quote, fundamentals, analysts, earnings, edgarData, macroContext] = await Promise.all([
    provider.getQuote(ticker),
    provider.getFundamentals(ticker),
    provider.getAnalystRatings(ticker),
    provider.getEarningsCalendar(ticker),
    buildEdgarContext(ticker).catch(() => null),
    buildMacroContext().catch(() => ""),
  ]);

  if (!quote) return { recommendation: null, error: "no_market_data" };

  let instruments: string[];
  try { instruments = JSON.parse(profile.instruments); }
  catch { instruments = []; }

  const marketData = {
    ticker,
    price: quote.price,
    fundamentals: JSON.stringify(fundamentals || {}),
    analystRatings: JSON.stringify(analysts || {}),
    historicalPrices: "See price data",
    earnings: JSON.stringify(earnings || []),
    edgarFinancials: edgarData ?? undefined,
  };

  const macro = macroContext ? { summary: macroContext } : undefined;

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
    marketData,
    macro
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

  // Build candidate list: watchlist + popular tickers for the strategy
  const watchlist = await prisma.watchlistItem.findMany();
  const watchlistTickers = watchlist.map((w) => w.ticker);

  const strategyTickers: Record<string, string[]> = {
    growth: ["NVDA", "AMZN", "MSFT", "GOOGL", "META", "TSLA", "CRM", "AMD", "NFLX", "SHOP"],
    value: ["BRK-B", "JPM", "JNJ", "PG", "KO", "PFE", "CVX", "VZ", "IBM", "T"],
    balanced: ["AAPL", "MSFT", "GOOGL", "JPM", "JNJ", "PG", "AMZN", "V", "UNH", "HD"],
    income: ["VZ", "T", "PFE", "KO", "PG", "XOM", "CVX", "ABBV", "MO", "O"],
    aggressive: ["NVDA", "TSLA", "AMD", "COIN", "MSTR", "PLTR", "SOFI", "RIVN", "MARA", "SQ"],
  };

  const defaults = strategyTickers[strategy] || strategyTickers.balanced;
  const candidateTickers = [...new Set([...watchlistTickers, ...defaults])].slice(0, Math.max(bundleSize * 3, 15));

  const marketData = await fetchMarketData(candidateTickers);
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

  let rawResponse = await callClaude(system, user);
  let bundle = parseBundleResponse(rawResponse);

  if (!bundle) {
    console.warn("First bundle response invalid, retrying...");
    rawResponse = await callClaude(
      system,
      user + "\n\nIMPORTANT: Return ONLY valid JSON. No markdown."
    );
    bundle = parseBundleResponse(rawResponse);
  }

  if (!bundle) {
    return { bundle: null, error: "validation_failed" };
  }

  // Save bundle to DB
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
