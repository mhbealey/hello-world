import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const trade = await prisma.trade.update({
      where: { id: parseInt(id) },
      data: body,
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
