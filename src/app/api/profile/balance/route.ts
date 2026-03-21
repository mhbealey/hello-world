import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function PUT(request: Request) {
  try {
    const { portfolio_balance } = await request.json();
    if (!portfolio_balance || portfolio_balance <= 0) {
      return NextResponse.json({ error: "Invalid balance" }, { status: 400 });
    }
    const profile = await prisma.userProfile.findFirst();
    if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

    const updated = await prisma.userProfile.update({
      where: { id: profile.id },
      data: { portfolio_balance, portfolio_balance_updated_at: new Date() },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/profile/balance error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
