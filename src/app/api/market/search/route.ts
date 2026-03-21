import { NextRequest, NextResponse } from "next/server";
import { getDataProvider } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q");
    if (!query) return NextResponse.json([]);

    const provider = getDataProvider();
    const results = await provider.searchTicker(query);
    return NextResponse.json(results);
  } catch (e) {
    console.error("GET /api/market/search error:", e);
    return NextResponse.json([]);
  }
}
