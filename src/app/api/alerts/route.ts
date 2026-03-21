import { NextResponse } from "next/server";
import { generateAlerts } from "@/lib/alerts";

export async function GET() {
  try {
    const alerts = await generateAlerts();
    return NextResponse.json(alerts);
  } catch (e) {
    console.error("GET /api/alerts error:", e);
    return NextResponse.json([], { status: 200 }); // Return empty on error
  }
}
