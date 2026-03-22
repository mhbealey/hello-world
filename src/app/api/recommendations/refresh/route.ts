import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { generateRecommendations } from "@/lib/ai/generate";

// Ticker pools by investing style — diverse picks, not just mega-cap blue chips
const STYLE_TICKERS: Record<string, string[]> = {
  growth: ["NVDA", "AMZN", "CRM", "AMD", "SHOP", "NFLX", "PLTR", "UBER", "DDOG", "NET"],
  value: ["BRK-B", "JPM", "JNJ", "PG", "KO", "CVX", "PFE", "VZ", "IBM", "T"],
  momentum: ["NVDA", "META", "AVGO", "COIN", "PLTR", "ANET", "CRWD", "AXON", "DECK", "VST"],
  income: ["VZ", "T", "PFE", "KO", "PG", "XOM", "ABBV", "MO", "O", "SCHD"],
};

// Higher risk tolerance → include more speculative names
const RISK_TICKERS: Record<number, string[]> = {
  1: [], // Conservative — stick to style defaults
  2: ["V", "MA", "UNH"],
  3: ["SQ", "SOFI", "RIVN", "MARA"],
  4: ["MSTR", "COIN", "RIOT", "HUT", "SMCI", "IONQ"],
};

// ETF picks when user has "etfs" in instruments
const ETF_TICKERS = ["QQQ", "ARKK", "XLK", "XLE", "XLF", "VWO", "GLD"];

// Crypto-adjacent when user has "crypto" in instruments
const CRYPTO_TICKERS = ["COIN", "MSTR", "MARA", "RIOT", "BITO"];

function selectTickers(
  profile: { investing_style: string; risk_tolerance: number; instruments: string },
  watchlistTickers: string[],
  existingHoldings: string[]
): string[] {
  const style = profile.investing_style || "growth";
  const risk = profile.risk_tolerance || 2;

  let instruments: string[] = [];
  try { instruments = JSON.parse(profile.instruments); } catch { /* ignore */ }

  // Start with watchlist (user's own picks)
  const candidates = [...watchlistTickers];

  // Add style-appropriate tickers
  const stylePicks = STYLE_TICKERS[style] || STYLE_TICKERS.growth;
  candidates.push(...stylePicks);

  // Add risk-appropriate tickers
  if (RISK_TICKERS[risk]) {
    candidates.push(...RISK_TICKERS[risk]);
  }

  // Add instrument-specific tickers
  if (instruments.includes("etfs")) {
    candidates.push(...ETF_TICKERS);
  }
  if (instruments.includes("crypto")) {
    candidates.push(...CRYPTO_TICKERS);
  }

  // Deduplicate, exclude index ETFs and existing holdings, shuffle, limit
  const excluded = new Set(["SPY", "QQQ", ...existingHoldings]);
  const unique = [...new Set(candidates)].filter((t) => !excluded.has(t));

  // Shuffle to get variety on each refresh
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }

  return unique.slice(0, 5);
}

export async function POST() {
  const start = Date.now();
  const log = (msg: string) => console.log(`[refresh +${Date.now() - start}ms] ${msg}`);

  try {
    log("Starting recommendation refresh");

    const [profile, watchlist, openTrades] = await Promise.all([
      prisma.userProfile.findFirst(),
      prisma.watchlistItem.findMany(),
      prisma.trade.findMany({ where: { status: "open" }, select: { ticker: true } }),
    ]);

    if (!profile) {
      return NextResponse.json({ error: "Complete onboarding first." }, { status: 400 });
    }

    const watchlistTickers = watchlist.map((w) => w.ticker).filter((t) => t !== "SPY" && t !== "QQQ");
    const holdingTickers = openTrades.map((t) => t.ticker);

    const tickers = selectTickers(profile, watchlistTickers, holdingTickers);
    log(`Style=${profile.investing_style} Risk=${profile.risk_tolerance} → tickers: ${tickers.join(", ")}`);

    const result = await generateRecommendations(tickers);
    log(`generateRecommendations returned: ${result.error || `${result.recommendations.length} recs`}`);

    if (result.error) {
      const errorMessages: Record<string, string> = {
        daily_cap: "Daily analysis limit reached. Recommendations refresh tomorrow.",
        no_profile: "Complete onboarding first.",
        no_market_data: "Couldn't fetch market data. Try again later.",
        validation_failed: "AI response was invalid. Showing cached recommendations.",
      };
      const msg = result.error.startsWith("cooldown_")
        ? `Recommendations were just refreshed. Try again in ${result.error.split("_")[1]} minutes.`
        : errorMessages[result.error] || "Failed to generate recommendations.";

      return NextResponse.json({ error: msg, cached: true }, { status: 429 });
    }

    log(`Success! ${result.recommendations.length} recommendations in ${Date.now() - start}ms`);
    return NextResponse.json({ success: true, count: result.recommendations.length });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    log(`ERROR: ${message}`);
    console.error("POST /api/recommendations/refresh error:", message);

    if (message.includes("ANTHROPIC_API_KEY") || message.includes("ANTHROPIC_KEY_REV")) {
      return NextResponse.json(
        { error: "AI service not configured. Set ANTHROPIC_API_KEY in Vercel environment variables." },
        { status: 503 }
      );
    }

    const debugInfo = message.slice(0, 200);
    return NextResponse.json(
      { error: `Refresh failed: ${debugInfo}` },
      { status: 500 }
    );
  }
}
