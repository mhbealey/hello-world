import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const range = request.nextUrl.searchParams.get("range") || "1M";
    const now = new Date();
    const rangeMap: Record<string, number> = {
      "1D": 1, "1W": 7, "1M": 30, "3M": 90, "6M": 180, "YTD": Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000), "1Y": 365, "ALL": 9999,
    };
    const days = rangeMap[range] || 30;
    const start = new Date(now.getTime() - days * 86400000);

    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: { date: { gte: start } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(snapshots);
  } catch (e) {
    console.error("GET /api/portfolio/chart error:", e);
    return NextResponse.json([], { status: 200 });
  }
}
