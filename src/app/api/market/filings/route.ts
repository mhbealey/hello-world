import { NextResponse } from "next/server";
import { getEdgarFinancials, getRecentFilings } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json(
        { error: "ticker parameter is required" },
        { status: 400 }
      );
    }

    const [financials, filings] = await Promise.all([
      getEdgarFinancials(ticker),
      getRecentFilings(ticker, 10),
    ]);

    if (!financials && filings.length === 0) {
      return NextResponse.json(
        { error: `No SEC data found for ${ticker}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      financials,
      recentFilings: filings,
    });
  } catch (e) {
    console.error("Filings API error:", e);
    return NextResponse.json(
      { error: "Failed to fetch SEC filing data" },
      { status: 500 }
    );
  }
}
