import { NextResponse } from "next/server";
import { getMacroSnapshot, getMacroTrend, getAvailableSeries } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get("series");

    // If a specific series is requested, return its trend data
    if (seriesId) {
      const trend = await getMacroTrend(seriesId);
      if (!trend) {
        return NextResponse.json(
          { error: "Series not found or unavailable" },
          { status: 404 }
        );
      }
      return NextResponse.json(trend);
    }

    // Otherwise return the full macro snapshot + available series
    const [snapshot, series] = await Promise.all([
      getMacroSnapshot(),
      Promise.resolve(getAvailableSeries()),
    ]);

    // Check if all snapshot values are null (likely missing FRED_API_KEY)
    const hasData = Object.entries(snapshot)
      .filter(([k]) => k !== "fetchedAt")
      .some(([, v]) => v !== null);

    return NextResponse.json({
      snapshot,
      availableSeries: series,
      configured: hasData,
      ...(!hasData && { warning: "FRED_API_KEY not configured — macro data unavailable" }),
    });
  } catch (e) {
    console.error("Macro API error:", e);
    return NextResponse.json(
      { error: "Failed to fetch macro data" },
      { status: 500 }
    );
  }
}
