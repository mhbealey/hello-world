import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rec = await prisma.recommendation.findUnique({
      where: { id: parseInt(id) },
    });
    if (!rec) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get version history for same ticker
    const history = await prisma.recommendation.findMany({
      where: { ticker: rec.ticker },
      orderBy: { generated_at: "desc" },
      select: {
        id: true,
        ai_score: true,
        rating: true,
        generated_at: true,
        version: true,
        score_change_reason: true,
      },
    });

    return NextResponse.json({ ...rec, version_history: history });
  } catch (e) {
    console.error("GET /api/recommendations/[id] error:", e);
    return NextResponse.json({ error: "Failed to fetch recommendation" }, { status: 500 });
  }
}
