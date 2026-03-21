import { NextResponse } from "next/server";
import { closeTrade } from "@/lib/db/queries";
import { closeTradeSchema } from "@/lib/types/schemas";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = closeTradeSchema.parse(body);

    const result = await closeTrade(parseInt(id), {
      exit_price: parsed.exit_price,
      exit_date: new Date(parsed.exit_date),
      shares_to_close: parsed.shares_to_close,
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("POST /api/trades/[id]/close error:", e);
    return NextResponse.json({ error: "Failed to close trade" }, { status: 500 });
  }
}
