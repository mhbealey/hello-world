import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const categories = await prisma.dDQCategory.findMany({
      orderBy: { sort_order: "asc" },
      include: {
        _count: { select: { questions: true } },
      },
    });

    return NextResponse.json(categories);
  } catch (e) {
    console.error("GET /api/ddq/categories error:", e);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
