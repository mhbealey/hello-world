import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const settings = await prisma.appSettings.findMany();
    const obj: Record<string, string> = {};
    for (const s of settings) obj[s.key] = s.value;
    return NextResponse.json(obj);
  } catch (e) {
    console.error("GET /api/settings error:", e);
    return NextResponse.json({});
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      await prisma.appSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PUT /api/settings error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
