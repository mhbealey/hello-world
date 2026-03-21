import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

const ALLOWED_UPDATE_FIELDS = new Set([
  "stop_loss", "take_profit", "notes", "order_type",
]);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_UPDATE_FIELDS.has(key)) sanitized[key] = value;
    }
    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }
    const trade = await prisma.trade.update({
      where: { id: parseInt(id) },
      data: sanitized,
    });
    return NextResponse.json(trade);
  } catch (e) {
    console.error("PUT /api/trades/[id] error:", e);
    return NextResponse.json({ error: "Failed to update trade" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.trade.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/trades/[id] error:", e);
    return NextResponse.json({ error: "Failed to delete trade" }, { status: 500 });
  }
}
