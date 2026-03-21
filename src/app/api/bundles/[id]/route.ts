import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bundle = await prisma.bundlePortfolio.findUnique({
      where: { id: parseInt(id) },
    });

    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...bundle,
      allocation: JSON.parse(bundle.allocation),
      asset_filters: JSON.parse(bundle.asset_filters),
    });
  } catch (e) {
    console.error("GET /api/bundles/[id] error:", e);
    return NextResponse.json({ error: "Failed to fetch bundle" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.bundlePortfolio.update({
      where: { id: parseInt(id) },
      data: { status: "archived" },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/bundles/[id] error:", e);
    return NextResponse.json({ error: "Failed to archive bundle" }, { status: 500 });
  }
}
