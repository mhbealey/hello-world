import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";

export default async function RootPage() {
  let onboardingComplete = false;
  try {
    const setting = await prisma.appSettings.findUnique({
      where: { key: "onboarding_complete" },
    });
    onboardingComplete = setting?.value === "true";
  } catch {
    // DB not available, default to onboarding
  }

  if (!onboardingComplete) {
    redirect("/onboarding");
  }
  redirect("/home");
}
