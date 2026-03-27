import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { runDDQMatching } from "@/lib/ddq/matching";

export async function POST() {
  try {
    const profile = await prisma.userProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 });
    }

    const result = await runDDQMatching(profile.id);

    if (result.error) {
      const messages: Record<string, string> = {
        no_profile: "Complete onboarding first.",
        no_vehicles: "Vehicle knowledge base not loaded. Contact support.",
        validation_failed: "AI matching failed. Try again.",
      };
      return NextResponse.json(
        { error: messages[result.error] || "Matching failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      matchCount: result.matches.length,
      topMatches: result.matches.filter((m) => m.match_score >= 65).length,
      profileSummary: result.profileSummary,
      portfolioSuggestion: result.portfolioSuggestion,
    });
  } catch (e) {
    console.error("POST /api/ddq/match error:", e);
    return NextResponse.json({ error: "Matching failed" }, { status: 500 });
  }
}
