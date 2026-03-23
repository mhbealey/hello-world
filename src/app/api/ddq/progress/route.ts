import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { getDDQProgress } from "@/lib/ddq/matching";

export async function GET() {
  try {
    const profile = await prisma.userProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    const progress = await getDDQProgress(profile.id);
    return NextResponse.json(progress);
  } catch (e) {
    console.error("GET /api/ddq/progress error:", e);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
