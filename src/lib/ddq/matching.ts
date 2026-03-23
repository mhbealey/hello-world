/**
 * DDQ Matching Engine — Maps investor DDQ responses to vehicle types via Claude.
 *
 * Instead of pgvector embeddings (requires PostgreSQL), we use Claude itself
 * as the matching engine. Claude has deep knowledge of alternative investments
 * and can intelligently score vehicle suitability based on the full DDQ profile.
 *
 * Flow:
 * 1. Collect DDQ responses from the investor
 * 2. Load all vehicle types from DB
 * 3. Send investor profile + vehicle types to Claude
 * 4. Claude returns scored matches with reasoning
 * 5. Store matches in VehicleMatch table
 */

import { prisma } from "@/lib/db/client";
import { callClaude } from "@/lib/ai/client";
import { z } from "zod";

// ── Schema for Claude's match response ──

const vehicleMatchSchema = z.object({
  vehicle_slug: z.string(),
  match_score: z.number().min(0).max(100),
  risk_alignment: z.number().min(0).max(100),
  return_alignment: z.number().min(0).max(100),
  liquidity_alignment: z.number().min(0).max(100),
  tax_alignment: z.number().min(0).max(100),
  suitability: z.enum(["excellent", "good", "moderate", "poor"]),
  reasons: z.array(z.string()),
  commentary: z.string(),
});

const matchResponseSchema = z.object({
  matches: z.array(vehicleMatchSchema),
  profile_summary: z.string(),
  portfolio_suggestion: z.string(),
});

type MatchResponse = z.infer<typeof matchResponseSchema>;

// ── Build the investor profile from DDQ responses ──

interface InvestorProfile {
  responses: Array<{
    question: string;
    category: string;
    answer: string;
  }>;
  investing_style: string;
  risk_tolerance: number;
  portfolio_balance: number;
  archetype: string;
}

async function buildInvestorProfile(profileId: number): Promise<InvestorProfile | null> {
  const [userProfile, ddqResponses] = await Promise.all([
    prisma.userProfile.findFirst(),
    prisma.dDQResponse.findMany({
      where: { profile_id: profileId },
      include: {
        question: {
          include: { category: true },
        },
      },
    }),
  ]);

  if (!userProfile) return null;

  return {
    responses: ddqResponses.map((r) => ({
      question: r.question.question_text,
      category: r.question.category.name,
      answer: r.answer,
    })),
    investing_style: userProfile.investing_style,
    risk_tolerance: userProfile.risk_tolerance,
    portfolio_balance: userProfile.portfolio_balance,
    archetype: userProfile.archetype,
  };
}

// ── Build the vehicle type descriptions for Claude ──

interface VehicleSummary {
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  min_investment: number;
  accreditation: string;
  lockup_years: number;
  liquidity: string;
  target_irr: string;
  target_yield: string | null;
  risk_level: string;
  correlation_sp500: number | null;
  fees: string;
  tax_form: string;
  ubti_risk: boolean;
  key_risks: string[];
  key_benefits: string[];
}

async function loadVehicleSummaries(): Promise<VehicleSummary[]> {
  const vehicles = await prisma.vehicleType.findMany();

  return vehicles.map((v) => ({
    slug: v.slug,
    name: v.name,
    category: v.category,
    subcategory: v.subcategory,
    description: v.description,
    min_investment: v.min_investment_typical,
    accreditation: v.accreditation_requirement,
    lockup_years: v.typical_lockup_years,
    liquidity: v.liquidity_profile,
    target_irr: v.target_return_irr_low && v.target_return_irr_high
      ? `${v.target_return_irr_low}-${v.target_return_irr_high}%`
      : "N/A",
    target_yield: v.target_yield ? `${v.target_yield}%` : null,
    risk_level: v.risk_level,
    correlation_sp500: v.correlation_to_sp500,
    fees: formatFees(v.fee_management, v.fee_performance, v.fee_other),
    tax_form: v.tax_form,
    ubti_risk: v.ubti_risk,
    key_risks: safeParseArray(v.key_risks),
    key_benefits: safeParseArray(v.key_benefits),
  }));
}

function formatFees(mgmt: number | null, perf: number | null, other: string | null): string {
  const parts: string[] = [];
  if (mgmt != null) parts.push(`${(mgmt * 100).toFixed(1)}% mgmt`);
  if (perf != null) parts.push(`${(perf * 100).toFixed(0)}% perf`);
  if (other) parts.push(other);
  return parts.join(" + ") || "Varies";
}

function safeParseArray(json: string): string[] {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

// ── Build the matching prompt ──

function buildMatchPrompt(
  profile: InvestorProfile,
  vehicles: VehicleSummary[]
): { system: string; user: string } {
  const system = `You are an institutional alternative investment allocator. Given an investor's DDQ (Due Diligence Questionnaire) profile, score every vehicle type for suitability.

SCORING RULES:
- match_score (0-100): Overall fit. 90+ = perfect match, 70-89 = good, 50-69 = moderate, <50 = poor
- risk_alignment: How well the vehicle's risk matches the investor's tolerance
- return_alignment: How well target returns match the investor's goals
- liquidity_alignment: How well liquidity/lockup matches the investor's needs
- tax_alignment: How well the tax treatment suits the investor's situation
- suitability: "excellent" (80+), "good" (65-79), "moderate" (50-64), "poor" (<50)

HARD FILTERS (must result in score 0):
- If investor is "retail" and vehicle requires "accredited" or "qualified_purchaser" → score 0
- If investor is "accredited" and vehicle requires "qualified_purchaser" → score 0
- If investor's min investment budget is below the vehicle's minimum → score 0

MATCHING PRIORITIES:
1. Accreditation eligibility (binary gate)
2. Minimum investment vs available capital
3. Liquidity needs vs lockup period
4. Risk tolerance vs vehicle risk level
5. Return expectations vs target returns
6. Tax situation compatibility
7. Strategy alignment with investor goals
8. ESG/impact preferences if stated

Return ONLY valid JSON matching this schema:
{
  "matches": [
    {
      "vehicle_slug": "...",
      "match_score": 85,
      "risk_alignment": 90,
      "return_alignment": 80,
      "liquidity_alignment": 75,
      "tax_alignment": 85,
      "suitability": "excellent",
      "reasons": ["Matches growth orientation", "Lockup within tolerance", ...],
      "commentary": "One paragraph personalized analysis"
    }
  ],
  "profile_summary": "One paragraph summarizing the investor's profile",
  "portfolio_suggestion": "One paragraph suggesting an allocation strategy across top matches"
}

Score ALL vehicles. Include even poor matches (with low scores and clear reasons).
Sort by match_score descending.`;

  // Build the investor profile section
  const profileLines: string[] = [
    `Investing style: ${profile.investing_style}`,
    `Risk tolerance: ${profile.risk_tolerance}/4`,
    `Portfolio balance: $${profile.portfolio_balance.toLocaleString()}`,
    `Archetype: ${profile.archetype}`,
    "",
    "DDQ Responses:",
  ];

  for (const r of profile.responses) {
    profileLines.push(`  [${r.category}] ${r.question}: ${r.answer}`);
  }

  // Build the vehicle catalog
  const vehicleLines = vehicles.map((v) => {
    const parts = [
      `${v.slug}: ${v.name} (${v.category}/${v.subcategory})`,
      `  ${v.description}`,
      `  Min: $${v.min_investment.toLocaleString()} | Accred: ${v.accreditation} | Lockup: ${v.lockup_years}yr | Liquidity: ${v.liquidity}`,
      `  Returns: ${v.target_irr}${v.target_yield ? ` | Yield: ${v.target_yield}` : ""} | Risk: ${v.risk_level} | Corr: ${v.correlation_sp500 ?? "N/A"}`,
      `  Fees: ${v.fees} | Tax: ${v.tax_form} | UBTI: ${v.ubti_risk ? "Yes" : "No"}`,
    ];
    return parts.join("\n");
  }).join("\n\n");

  const user = `INVESTOR PROFILE:\n${profileLines.join("\n")}\n\nVEHICLE CATALOG (${vehicles.length} types):\n${vehicleLines}`;

  return { system, user };
}

// ── Parse and validate Claude's response ──

function parseMatchResponse(text: string): MatchResponse | null {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(cleaned);
    return matchResponseSchema.parse(parsed);
  } catch (e) {
    console.error("Failed to parse match response:", e);
    return null;
  }
}

// ── Main matching function ──

export async function runDDQMatching(profileId: number): Promise<{
  matches: MatchResponse["matches"];
  profileSummary: string;
  portfolioSuggestion: string;
  error?: string;
}> {
  const [investorProfile, vehicles] = await Promise.all([
    buildInvestorProfile(profileId),
    loadVehicleSummaries(),
  ]);

  if (!investorProfile) {
    return { matches: [], profileSummary: "", portfolioSuggestion: "", error: "no_profile" };
  }

  if (vehicles.length === 0) {
    return { matches: [], profileSummary: "", portfolioSuggestion: "", error: "no_vehicles" };
  }

  // If fewer than 5 DDQ responses, we can still match but with lower confidence
  const hasMinimumResponses = investorProfile.responses.length >= 5;

  const { system, user } = buildMatchPrompt(investorProfile, vehicles);

  // Use larger token budget — we're scoring 87+ vehicles
  const rawResponse = await callClaude(system, user, 8192);
  const result = parseMatchResponse(rawResponse);

  if (!result) {
    return { matches: [], profileSummary: "", portfolioSuggestion: "", error: "validation_failed" };
  }

  // Resolve vehicle slugs to IDs and save matches
  const vehiclesBySlug = new Map(
    (await prisma.vehicleType.findMany({ select: { id: true, slug: true } }))
      .map((v) => [v.slug, v.id])
  );

  // Clear old matches for this profile
  await prisma.vehicleMatch.deleteMany({ where: { profile_id: profileId } });

  // Save new matches
  const validMatches = result.matches.filter((m) => vehiclesBySlug.has(m.vehicle_slug));

  await Promise.all(
    validMatches.map((m) =>
      prisma.vehicleMatch.create({
        data: {
          profile_id: profileId,
          vehicle_type_id: vehiclesBySlug.get(m.vehicle_slug)!,
          match_score: m.match_score,
          match_reasons: JSON.stringify(m.reasons),
          risk_alignment: m.risk_alignment,
          return_alignment: m.return_alignment,
          liquidity_alignment: m.liquidity_alignment,
          tax_alignment: m.tax_alignment,
          suitability: m.suitability,
          ai_commentary: m.commentary,
          status: "active",
        },
      })
    )
  );

  // Adjust confidence if limited DDQ data
  const confidence = hasMinimumResponses ? "high" : "preliminary";

  return {
    matches: result.matches,
    profileSummary: result.profile_summary + (confidence === "preliminary"
      ? "\n\nNote: This matching is preliminary. Complete more DDQ questions for higher accuracy."
      : ""),
    portfolioSuggestion: result.portfolio_suggestion,
  };
}

// ── Get existing matches for a profile ──

export async function getExistingMatches(profileId: number) {
  return prisma.vehicleMatch.findMany({
    where: { profile_id: profileId, status: "active" },
    include: { vehicle_type: true },
    orderBy: { match_score: "desc" },
  });
}

// ── Get DDQ completion stats ──

export async function getDDQProgress(profileId: number) {
  const [totalQuestions, answeredQuestions, categories] = await Promise.all([
    prisma.dDQQuestion.count(),
    prisma.dDQResponse.count({ where: { profile_id: profileId } }),
    prisma.dDQCategory.findMany({
      orderBy: { sort_order: "asc" },
      include: {
        questions: {
          include: {
            responses: {
              where: { profile_id: profileId },
            },
          },
        },
      },
    }),
  ]);

  const categoryProgress = categories.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    phase: cat.phase,
    total: cat.questions.length,
    answered: cat.questions.filter((q) => q.responses.length > 0).length,
    complete: cat.questions.every((q) => !q.required || q.responses.length > 0),
  }));

  return {
    total: totalQuestions,
    answered: answeredQuestions,
    percent: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
    categories: categoryProgress,
    onboardingComplete: categoryProgress
      .filter((c) => c.phase === "onboarding")
      .every((c) => c.complete),
  };
}
