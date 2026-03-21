import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({ orderBy: { created_at: "desc" } });
    const headers = "Ticker,Action,Shares,Entry Price,Exit Price,Return %,Return $,Status,Source,Date\n";
    const rows = trades.map((t) =>
      `${t.ticker},${t.action},${t.shares},${t.entry_price},${t.exit_price || ""},${t.return_pct?.toFixed(2) || ""},${t.return_dollars?.toFixed(2) || ""},${t.status},${t.source},${t.created_at.toISOString()}`
    ).join("\n");

    return new NextResponse(headers + rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=alphaedge-trades.csv",
      },
    });
  } catch (e) {
    console.error("GET /api/export/csv error:", e);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
