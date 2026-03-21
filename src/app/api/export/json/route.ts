import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const [profile, recommendations, trades, watchlist, snapshots, settings, usage] = await Promise.all([
      prisma.userProfile.findFirst(),
      prisma.recommendation.findMany(),
      prisma.trade.findMany(),
      prisma.watchlistItem.findMany(),
      prisma.portfolioSnapshot.findMany(),
      prisma.appSettings.findMany(),
      prisma.apiUsage.findMany(),
    ]);

    const backup = { profile, recommendations, trades, watchlist, snapshots, settings, usage, exported_at: new Date().toISOString() };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=alphaedge-backup.json",
      },
    });
  } catch (e) {
    console.error("GET /api/export/json error:", e);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
