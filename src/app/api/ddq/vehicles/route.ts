import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const matched = searchParams.get("matched") === "true";

    if (matched) {
      // Return vehicles matched to current profile, sorted by score
      const profile = await prisma.userProfile.findFirst();
      if (!profile) {
        return NextResponse.json({ error: "No profile found" }, { status: 404 });
      }

      const matches = await prisma.vehicleMatch.findMany({
        where: { profile_id: profile.id, status: "active" },
        include: { vehicle_type: true },
        orderBy: { match_score: "desc" },
      });

      return NextResponse.json(
        matches.map((m) => ({
          match_score: m.match_score,
          suitability: m.suitability,
          risk_alignment: m.risk_alignment,
          return_alignment: m.return_alignment,
          liquidity_alignment: m.liquidity_alignment,
          tax_alignment: m.tax_alignment,
          reasons: JSON.parse(m.match_reasons),
          commentary: m.ai_commentary,
          vehicle: {
            id: m.vehicle_type.id,
            name: m.vehicle_type.name,
            slug: m.vehicle_type.slug,
            category: m.vehicle_type.category,
            subcategory: m.vehicle_type.subcategory,
            description: m.vehicle_type.description,
            min_investment: m.vehicle_type.min_investment_typical,
            accreditation: m.vehicle_type.accreditation_requirement,
            lockup_years: m.vehicle_type.typical_lockup_years,
            liquidity: m.vehicle_type.liquidity_profile,
            target_irr_low: m.vehicle_type.target_return_irr_low,
            target_irr_high: m.vehicle_type.target_return_irr_high,
            target_yield: m.vehicle_type.target_yield,
            risk_level: m.vehicle_type.risk_level,
            fees_mgmt: m.vehicle_type.fee_management,
            fees_perf: m.vehicle_type.fee_performance,
            tax_form: m.vehicle_type.tax_form,
            key_risks: JSON.parse(m.vehicle_type.key_risks),
            key_benefits: JSON.parse(m.vehicle_type.key_benefits),
          },
        }))
      );
    }

    // Return all vehicles, optionally filtered by category
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (category) where.category = category;

    const vehicles = await prisma.vehicleType.findMany({
      where,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(
      vehicles.map((v) => ({
        id: v.id,
        name: v.name,
        slug: v.slug,
        category: v.category,
        subcategory: v.subcategory,
        description: v.description,
        min_investment: v.min_investment_typical,
        accreditation: v.accreditation_requirement,
        lockup_years: v.typical_lockup_years,
        liquidity: v.liquidity_profile,
        target_irr_low: v.target_return_irr_low,
        target_irr_high: v.target_return_irr_high,
        target_yield: v.target_yield,
        risk_level: v.risk_level,
        fees_mgmt: v.fee_management,
        fees_perf: v.fee_performance,
        tax_form: v.tax_form,
        key_risks: JSON.parse(v.key_risks),
        key_benefits: JSON.parse(v.key_benefits),
      }))
    );
  } catch (e) {
    console.error("GET /api/ddq/vehicles error:", e);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
