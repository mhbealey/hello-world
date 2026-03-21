import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { generateRecommendations } from "@/lib/ai/generate";

const DEFAULT_TICKERS = ["AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "META", "TSLA"];

export async function POST() {
  try {
    // Get watchlist tickers
    const watchlist = await prisma.watchlistItem.findMany();
    const watchlistTickers = watchlist.map((w) => w.ticker).filter((t) => !t.includes("SPY") && !t.includes("QQQ"));

    // Combine with defaults, deduplicate, limit to 10
    const tickers = [...new Set([...watchlistTickers, ...DEFAULT_TICKERS])].slice(0, 10);

    const result = await generateRecommendations(tickers);

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

    return NextResponse.json({ success: true, count: result.recommendations.length });
  } catch (e) {
    console.error("POST /api/recommendations/refresh error:", e);
    return NextResponse.json({ error: "Failed to refresh recommendations" }, { status: 500 });
  }
}
