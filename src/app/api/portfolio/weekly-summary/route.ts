import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);

    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: { date: { gte: weekAgo } },
      orderBy: { date: "asc" },
    });

    const closedThisWeek = await prisma.trade.findMany({
      where: { status: "closed", exit_date: { gte: weekAgo } },
    });

    if (snapshots.length < 2) {
      return NextResponse.json(null);
    }

    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];
    const pnl = last.total_value - first.total_value;
    const pnlPct = first.total_value > 0 ? (pnl / first.total_value) * 100 : 0;
    const wins = closedThisWeek.filter((t) => (t.return_pct ?? 0) > 0);
    const winRate = closedThisWeek.length ? (wins.length / closedThisWeek.length * 100) : 0;

    const spFirst = first.sp500_value;
    const spLast = last.sp500_value;
    const spPct = spFirst ? ((spLast - spFirst) / spFirst) * 100 : 0;
    const beatSp = pnlPct - spPct;

    return NextResponse.json({
      pnl,
      pnl_pct: pnlPct,
      trades_closed: closedThisWeek.length,
      win_rate: winRate,
      sp_comparison: beatSp,
    });
  } catch (e) {
    console.error("GET /api/portfolio/weekly-summary error:", e);
    return NextResponse.json(null);
  }
}
