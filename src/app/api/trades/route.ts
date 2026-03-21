import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { tradeFormSchema } from "@/lib/types/schemas";

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({ orderBy: { created_at: "desc" } });
    return NextResponse.json(trades);
  } catch (e) {
    console.error("GET /api/trades error:", e);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = tradeFormSchema.parse(body);

    const plannedRr = parsed.stop_loss && parsed.take_profit
      ? Math.abs(parsed.take_profit - parsed.entry_price) / Math.abs(parsed.entry_price - parsed.stop_loss)
      : null;

    const trade = await prisma.trade.create({
      data: {
        ticker: parsed.ticker,
        action: parsed.action,
        shares: parsed.shares,
        entry_price: parsed.entry_price,
        stop_loss: parsed.stop_loss ?? null,
        take_profit: parsed.take_profit ?? null,
        order_type: parsed.order_type,
        status: "open",
        source: parsed.source,
        planned_rr_ratio: plannedRr,
        notes: parsed.notes ?? null,
        recommendation_id: parsed.recommendation_id ?? null,
      },
    });

    // Clear wizard state if from wizard
    if (parsed.recommendation_id) {
      await prisma.wizardState.deleteMany({
        where: { recommendation_id: parsed.recommendation_id },
      });
      await prisma.recommendation.updateMany({
        where: { id: parsed.recommendation_id },
        data: { status: "executed" },
      });
    }

    return NextResponse.json(trade, { status: 201 });
  } catch (e) {
    console.error("POST /api/trades error:", e);
    return NextResponse.json({ error: "Failed to create trade" }, { status: 500 });
  }
}
