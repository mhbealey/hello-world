import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const items = await prisma.watchlistItem.findMany({ orderBy: { added_at: "desc" } });
    return NextResponse.json(items);
  } catch (e) {
    console.error("GET /api/watchlist error:", e);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const { ticker, company_name } = await request.json();
    const item = await prisma.watchlistItem.create({
      data: { ticker, company_name: company_name || ticker },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error("POST /api/watchlist error:", e);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.watchlistItem.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/watchlist error:", e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
