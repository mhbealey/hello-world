import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { generateBundle } from "@/lib/ai/generate";
import { bundleFilterSchema } from "@/lib/types/schemas";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "active";
    const size = searchParams.get("size");

    const where: Record<string, unknown> = {};
    if (status !== "all") where.status = status;
    if (size) where.size = parseInt(size);

    const bundles = await prisma.bundlePortfolio.findMany({
      where,
      orderBy: { generated_at: "desc" },
    });

    return NextResponse.json(bundles.map((b) => {
      let allocation = [];
      let asset_filters = {};
      try { allocation = JSON.parse(b.allocation); } catch { /* use default */ }
      try { asset_filters = JSON.parse(b.asset_filters); } catch { /* use default */ }
      return { ...b, allocation, asset_filters };
    }));
  } catch (e) {
    console.error("GET /api/bundles error:", e);
    return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bundleFilterSchema.parse(body);

    const result = await generateBundle(
      parseInt(parsed.size),
      parsed.strategy,
      {
        asset_classes: parsed.asset_classes,
        min_score: parsed.min_score,
        sectors: parsed.sectors,
      }
    );

    if (result.error) {
      const errorMessages: Record<string, string> = {
        daily_cap: "Daily analysis limit reached.",
        no_profile: "Complete onboarding first.",
        no_market_data: "Couldn't fetch market data.",
        validation_failed: "AI response was invalid. Try again.",
      };
      const msg = result.error.startsWith("cooldown_")
        ? `Try again in ${result.error.split("_")[1] || "a few"} minutes.`
        : errorMessages[result.error] || "Failed to generate bundle.";

      return NextResponse.json({ error: msg }, { status: 429 });
    }

    return NextResponse.json({ success: true, bundle: result.bundle });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("POST /api/bundles error:", message);

    if (message.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json(
        { error: "AI service not configured. Set ANTHROPIC_API_KEY in environment variables." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Failed to generate bundle" }, { status: 500 });
  }
}
