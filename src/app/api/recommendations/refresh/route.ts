import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { ensureProfile } from "@/lib/db/ensure-profile";
import { generateRecommendations } from "@/lib/ai/generate";

const DEFAULT_TICKERS = ["AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "META", "TSLA"];

export async function POST() {
  const startTime = Date.now();
  console.log("[REFRESH] Starting recommendation refresh...");

  try {
    // Auto-create profile if needed
    await ensureProfile();

    // Get watchlist tickers
    const watchlist = await prisma.watchlistItem.findMany();
    const watchlistTickers = watchlist.map((w) => w.ticker).filter((t) => !t.includes("SPY") && !t.includes("QQQ"));

    // Combine with defaults, deduplicate, limit to 7 (keeps pipeline under 60s)
    const tickers = [...new Set([...watchlistTickers, ...DEFAULT_TICKERS])].slice(0, 7);
    console.log(`[REFRESH] Tickers: ${tickers.join(", ")} (${tickers.length} total)`);

    const result = await generateRecommendations(tickers);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (result.error) {
      console.warn(`[REFRESH] Error after ${elapsed}s: ${result.error}`);
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

    console.log(`[REFRESH] Success: ${result.recommendations.length} recommendations in ${elapsed}s`);
    return NextResponse.json({ success: true, count: result.recommendations.length });
  } catch (e) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[REFRESH] FAILED after ${elapsed}s:`, message);

    if (message.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json(
        { error: "AI service not configured. Set ANTHROPIC_API_KEY in Vercel environment variables." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `Refresh failed: ${message.slice(0, 200)}` },
      { status: 500 }
    );
  }
}
