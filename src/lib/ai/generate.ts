import { callClaude } from "./client";
import { buildRecommendationPrompt, buildSingleStockPrompt } from "./prompts";
import { claudeResponseSchema } from "@/lib/types/schemas";
import type { RecommendationItem } from "@/lib/types/schemas";
import { prisma } from "@/lib/db/client";
import { getDataProvider } from "@/lib/data";

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
    const lastTime = new Date(lastRefresh.value).getTime();
    const elapsed = Date.now() - lastTime;
    if (elapsed < MIN_REFRESH_INTERVAL_MS) {
      const minutesLeft = Math.ceil((MIN_REFRESH_INTERVAL_MS - elapsed) / 60000);
      return { allowed: false, reason: `cooldown_${minutesLeft}` };
    }
  }

  return { allowed: true };
}

async function fetchMarketData(tickers: string[]) {
  const provider = getDataProvider();
  const results = [];

  for (const ticker of tickers) {
    try {
      const [quote, fundamentals, analysts, earnings] = await Promise.all([
        provider.getQuote(ticker),
        provider.getFundamentals(ticker),
        provider.getAnalystRatings(ticker),
        provider.getEarningsCalendar(ticker),
      ]);

      results.push({
        ticker,
        price: quote?.price || 0,
        fundamentals: JSON.stringify(fundamentals || {}),
        analystRatings: JSON.stringify(analysts || {}),
        historicalPrices: "See price data",
        earnings: JSON.stringify(earnings || []),
      });
    } catch (e) {
      console.error(`Failed to fetch market data for ${ticker}:`, e);
    }
  }

  return results;
}

function parseClaudeResponse(text: string): RecommendationItem[] | null {
  try {
    // Strip markdown fences if present
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
  const holdings = openTrades.map((t) => ({
    ticker: t.ticker,
    shares: t.shares,
    avg_cost: t.entry_price,
  }));

  const marketData = await fetchMarketData(tickers);
  if (marketData.length === 0) {
    return { recommendations: [], error: "no_market_data" };
  }

  const { system, user } = buildRecommendationPrompt(
    {
      archetype: profile.archetype,
      investing_style: profile.investing_style,
      risk_tolerance: profile.risk_tolerance,
      instruments: JSON.parse(profile.instruments),
      portfolio_balance: profile.portfolio_balance,
    },
    holdings,
    tickers,
    marketData
  );

  let rawResponse = await callClaude(system, user);
  let recs = parseClaudeResponse(rawResponse);

  // Retry once on validation failure
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

  // Save recommendations to DB
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

    await prisma.recommendation.create({
      data: {
        ticker: rec.ticker,
        company_name: rec.company_name,
        ai_score: rec.ai_score,
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

  // Update usage
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const existingUsage = await prisma.apiUsage.findFirst({ where: { date: today } });
  if (existingUsage) {
    await prisma.apiUsage.update({
      where: { id: existingUsage.id },
      data: {
        call_count: existingUsage.call_count + 1,
        estimated_cost: existingUsage.estimated_cost + COST_PER_CALL,
      },
    });
  } else {
    await prisma.apiUsage.create({
      data: { date: today, call_count: 1, estimated_cost: COST_PER_CALL },
    });
  }

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
  const [quote, fundamentals, analysts, earnings] = await Promise.all([
    provider.getQuote(ticker),
    provider.getFundamentals(ticker),
    provider.getAnalystRatings(ticker),
    provider.getEarningsCalendar(ticker),
  ]);

  if (!quote) return { recommendation: null, error: "no_market_data" };

  const marketData = {
    ticker,
    price: quote.price,
    fundamentals: JSON.stringify(fundamentals || {}),
    analystRatings: JSON.stringify(analysts || {}),
    historicalPrices: "See price data",
    earnings: JSON.stringify(earnings || []),
  };

  const { system, user } = buildSingleStockPrompt(
    {
      archetype: profile.archetype,
      investing_style: profile.investing_style,
      risk_tolerance: profile.risk_tolerance,
      instruments: JSON.parse(profile.instruments),
      portfolio_balance: profile.portfolio_balance,
    },
    holdings,
    ticker,
    marketData
  );

  const rawResponse = await callClaude(system, user);
  const recs = parseClaudeResponse(rawResponse);

  // Track usage
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const existingUsage = await prisma.apiUsage.findFirst({ where: { date: today } });
  if (existingUsage) {
    await prisma.apiUsage.update({
      where: { id: existingUsage.id },
      data: { call_count: existingUsage.call_count + 1, estimated_cost: existingUsage.estimated_cost + COST_PER_CALL },
    });
  } else {
    await prisma.apiUsage.create({ data: { date: today, call_count: 1, estimated_cost: COST_PER_CALL } });
  }

  return { recommendation: recs?.[0] || null };
}
