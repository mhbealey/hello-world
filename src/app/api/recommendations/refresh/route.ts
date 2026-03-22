import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { generateRecommendations } from "@/lib/ai/generate";

const DEFAULT_TICKERS = ["AAPL", "NVDA", "MSFT"];

export async function POST() {
  const start = Date.now();
  const log = (msg: string) => console.log(`[refresh +${Date.now() - start}ms] ${msg}`);

  try {
    log("Starting recommendation refresh");

    // Get watchlist tickers
    const watchlist = await prisma.watchlistItem.findMany();
    log(`Fetched ${watchlist.length} watchlist items`);

    const watchlistTickers = watchlist.map((w) => w.ticker).filter((t) => !t.includes("SPY") && !t.includes("QQQ"));

    // Combine with defaults, deduplicate, limit to 5
    const tickers = [...new Set([...watchlistTickers, ...DEFAULT_TICKERS])].slice(0, 5);
    log(`Processing tickers: ${tickers.join(", ")}`);

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

    // Surface the actual error for debugging
    const debugInfo = message.slice(0, 200);

    return NextResponse.json(
      { error: `Refresh failed: ${debugInfo}` },
      { status: 500 }
    );
  }
}
