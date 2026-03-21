import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const state = await prisma.wizardState.findFirst({
      orderBy: { updated_at: "desc" },
      include: { recommendation: true },
    });
    return NextResponse.json(state);
  } catch (e) {
    console.error("GET /api/wizard error:", e);
    return NextResponse.json(null);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existing = await prisma.wizardState.findFirst();

    if (existing) {
      const updated = await prisma.wizardState.update({
        where: { id: existing.id },
        data: {
          recommendation_id: body.recommendation_id,
          current_step: body.current_step,
          step_data: JSON.stringify(body.step_data),
        },
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.wizardState.create({
      data: {
        recommendation_id: body.recommendation_id,
        current_step: body.current_step,
        step_data: JSON.stringify(body.step_data),
      },
    });
    return NextResponse.json(created);
  } catch (e) {
    console.error("PUT /api/wizard error:", e);
    return NextResponse.json({ error: "Failed to save wizard state" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.wizardState.deleteMany();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/wizard error:", e);
    return NextResponse.json({ error: "Failed to clear wizard" }, { status: 500 });
  }
}
