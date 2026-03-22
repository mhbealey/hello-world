import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const profile = await prisma.userProfile.findFirst();
    const openTrades = await prisma.trade.findMany({ where: { status: "open" } });
    const closedTrades = await prisma.trade.findMany({ where: { status: "closed" }, orderBy: { created_at: "desc" } });
    const watchlist = await prisma.watchlistItem.findMany({ orderBy: { added_at: "desc" } });
    const activeRecs = await prisma.recommendation.findMany({ where: { status: "active" }, orderBy: { ai_score: "desc" } });
    const latestSnapshot = await prisma.portfolioSnapshot.findFirst({ orderBy: { date: "desc" } });
    const prevSnapshot = await prisma.portfolioSnapshot.findFirst({ orderBy: { date: "desc" }, skip: 1 });

    const totalValue = latestSnapshot?.total_value ?? profile?.portfolio_balance ?? 0;
    const dailyPnl = latestSnapshot?.daily_pnl ?? 0;
    const dailyPnlPct = latestSnapshot?.daily_pnl_pct ?? 0;

    // Compute analytics from closed trades
    let analytics = null;
    if (closedTrades.length >= 3) {
      const wins = closedTrades.filter((t) => (t.return_pct ?? 0) > 0);
      const sorted = [...closedTrades].sort((a, b) => (b.return_pct || 0) - (a.return_pct || 0));
      const avgReturn = closedTrades.reduce((s, t) => s + (t.return_pct ?? 0), 0) / closedTrades.length;

      const aiTrades = closedTrades.filter((t) => t.source === "ai_recommendation");
      const manualTrades = closedTrades.filter((t) => t.source === "manual");
      const avgAiReturn = aiTrades.length ? aiTrades.reduce((s, t) => s + (t.return_pct ?? 0), 0) / aiTrades.length : 0;
      const avgManualReturn = manualTrades.length ? manualTrades.reduce((s, t) => s + (t.return_pct ?? 0), 0) / manualTrades.length : 0;

      let streak = 0;
      for (const t of closedTrades) {
        if ((t.return_pct ?? 0) > 0) streak++;
        else break;
      }

      const tradesWithExit = closedTrades.filter((t) => t.exit_date);
      const avgHold = tradesWithExit.length > 0
        ? tradesWithExit.reduce((s, t) => s + (t.exit_date!.getTime() - t.created_at.getTime()) / 86400000, 0) / tradesWithExit.length
        : 0;

      analytics = {
        win_rate: wins.length / closedTrades.length,
        win_count: wins.length,
        total_count: closedTrades.length,
        avg_return: avgReturn,
        best_trade: sorted[0] ? { ticker: sorted[0].ticker, return_pct: sorted[0].return_pct } : null,
        worst_trade: sorted[sorted.length - 1] ? { ticker: sorted[sorted.length - 1].ticker, return_pct: sorted[sorted.length - 1].return_pct } : null,
        current_streak: streak,
        avg_hold_days: Math.round(avgHold),
        avg_planned_rr: closedTrades.filter((t) => t.planned_rr_ratio).reduce((s, t) => s + (t.planned_rr_ratio ?? 0), 0) / (closedTrades.filter((t) => t.planned_rr_ratio).length || 1),
        avg_actual_rr: closedTrades.filter((t) => t.actual_rr_ratio).reduce((s, t) => s + (t.actual_rr_ratio ?? 0), 0) / (closedTrades.filter((t) => t.actual_rr_ratio).length || 1),
        ai_avg_return: avgAiReturn,
        manual_avg_return: avgManualReturn,
      };
    }

    return NextResponse.json({
      total_value: totalValue,
      daily_pnl: dailyPnl,
      daily_pnl_pct: dailyPnlPct,
      holdings: openTrades,
      closed_trades: closedTrades,
      watchlist,
      active_recommendations: activeRecs,
      analytics,
    });
  } catch (e) {
    console.error("GET /api/portfolio error:", e);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}
