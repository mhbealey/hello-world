import { NextResponse } from "next/server";
import { generateMarketScan } from "@/lib/ai/generate";

export async function POST() {
  try {
    const result = await generateMarketScan();

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

    return NextResponse.json({
      success: true,
      count: result.recommendations.length,
      scanned: result.scannedCount,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("POST /api/recommendations/refresh error:", message);

    if (message.includes("TURSO_DATABASE_URL") || message.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json(
        { error: `Server misconfigured: ${message.slice(0, 150)}` },
        { status: 503 }
      );
    }

    if (message.includes("timed out")) {
      return NextResponse.json(
        { error: "Refresh timed out. Try again — data providers may be slow." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: `Refresh failed: ${message.slice(0, 200)}` },
      { status: 500 }
    );
  }
}
