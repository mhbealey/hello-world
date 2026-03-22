import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { profileFormSchema } from "@/lib/types/schemas";
import { computeArchetype, computeRiskScore } from "@/lib/utils/archetype";

export async function GET() {
  try {
    const profile = await prisma.userProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (e) {
    console.error("GET /api/profile error:", e);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = profileFormSchema.parse(body);

    const archetype = computeArchetype({
      style: parsed.investing_style,
      riskTolerance: parsed.risk_tolerance,
      instruments: parsed.instruments,
    });
    const riskScore = computeRiskScore(parsed.risk_tolerance, parsed.instruments);

    const existing = await prisma.userProfile.findFirst();
    const data = {
      investing_style: parsed.investing_style,
      risk_tolerance: parsed.risk_tolerance,
      instruments: JSON.stringify(parsed.instruments),
      portfolio_size_range: parsed.portfolio_size_range,
      portfolio_balance: parsed.portfolio_balance,
      portfolio_balance_updated_at: new Date(),
      archetype: archetype.name,
      risk_score: riskScore,
    };

    if (existing) {
      await prisma.userProfile.update({ where: { id: existing.id }, data });
    } else {
      await prisma.userProfile.create({ data });
    }

    await prisma.appSettings.upsert({
      where: { key: "onboarding_complete" },
      update: { value: "true" },
      create: { key: "onboarding_complete", value: "true" },
    });

    return NextResponse.json({ success: true, archetype: archetype.name, riskScore });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("POST /api/profile error:", message);
    return NextResponse.json({ error: `Failed to save profile: ${message.slice(0, 200)}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existing = await prisma.userProfile.findFirst();
    if (!existing) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.investing_style) data.investing_style = body.investing_style;
    if (body.risk_tolerance) data.risk_tolerance = body.risk_tolerance;
    if (body.instruments) data.instruments = JSON.stringify(body.instruments);
    if (body.portfolio_size_range) data.portfolio_size_range = body.portfolio_size_range;
    if (body.portfolio_balance) {
      data.portfolio_balance = body.portfolio_balance;
      data.portfolio_balance_updated_at = new Date();
    }

    if (body.investing_style || body.risk_tolerance || body.instruments) {
      let instruments = body.instruments;
      if (!instruments) {
        try { instruments = JSON.parse(existing.instruments); }
        catch { instruments = []; }
      }
      const archetype = computeArchetype({
        style: body.investing_style || existing.investing_style,
        riskTolerance: body.risk_tolerance || existing.risk_tolerance,
        instruments,
      });
      data.archetype = archetype.name;
      data.risk_score = computeRiskScore(
        body.risk_tolerance || existing.risk_tolerance,
        instruments
      );
    }

    const updated = await prisma.userProfile.update({
      where: { id: existing.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /api/profile error:", e);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
