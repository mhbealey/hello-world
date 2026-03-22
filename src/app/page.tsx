import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";

export default async function RootPage() {
  let onboardingComplete = false;
  try {
    // Check if profile exists — if so, skip onboarding regardless of setting
    const profileExists = await prisma.userProfile.findFirst();
    if (profileExists) {
      onboardingComplete = true;
    } else {
      const setting = await prisma.appSettings.findUnique({
        where: { key: "onboarding_complete" },
      });
      onboardingComplete = setting?.value === "true";
    }
  } catch {
    // DB not available — try home page, let API calls handle errors
    onboardingComplete = true;
  }

  if (!onboardingComplete) {
    redirect("/onboarding");
  }
  redirect("/home");
}
