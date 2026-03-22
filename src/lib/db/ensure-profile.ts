import { prisma } from "./client";

/**
 * Ensures a default user profile exists.
 * Called from API routes that need a profile.
 * Returns true if a profile exists (or was just created).
 */
let checked = false;

export async function ensureProfile(): Promise<boolean> {
  if (checked) return true;

  try {
    const existing = await prisma.userProfile.findFirst();
    if (existing) {
      checked = true;
      return true;
    }

    // Auto-create a default profile
    console.log("[AUTO-SEED] Creating default user profile...");
    await prisma.userProfile.create({
      data: {
        investing_style: "growth",
        risk_tolerance: 3,
        instruments: JSON.stringify(["stocks", "etfs", "options"]),
        portfolio_size_range: "25k-100k",
        portfolio_balance: 62500,
        portfolio_balance_updated_at: new Date(),
        archetype: "Steady Growth Seeker",
        risk_score: 7,
      },
    });

    await prisma.appSettings.upsert({
      where: { key: "onboarding_complete" },
      update: { value: "true" },
      create: { key: "onboarding_complete", value: "true" },
    });

    console.log("[AUTO-SEED] Default profile created — user can customize via Settings");
    checked = true;
    return true;
  } catch (e) {
    console.error("[AUTO-SEED] Failed to ensure profile:", e);
    return false;
  }
}
