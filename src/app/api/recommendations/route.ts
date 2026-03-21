import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "active";
    const sort = searchParams.get("sort") || "score";
    const rating = searchParams.get("rating");

    const where: Record<string, unknown> = {};
    if (status !== "all") where.status = status;
    if (rating) where.rating = rating;

    const orderBy: Record<string, string> = {};
    if (sort === "confidence") orderBy.confidence = "desc";
    else if (sort === "time_sensitivity") orderBy.time_sensitivity = "asc";
    else orderBy.ai_score = "desc";

    const recommendations = await prisma.recommendation.findMany({ where, orderBy });

    // Enrich with existing position data
    const openTrades = await prisma.trade.findMany({ where: { status: "open" } });
    const enriched = recommendations.map((rec) => {
      const trade = openTrades.find((t) => t.ticker === rec.ticker);
      return {
        ...rec,
        has_existing_position: !!trade,
        existing_position_details: trade
          ? { shares: trade.shares, avg_cost: trade.entry_price }
          : null,
      };
    });

    return NextResponse.json(enriched);
  } catch (e) {
    console.error("GET /api/recommendations error:", e);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
