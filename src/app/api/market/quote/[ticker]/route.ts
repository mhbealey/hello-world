import { NextResponse } from "next/server";
import { getDataProvider } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const provider = getDataProvider();
    const quote = await provider.getQuote(ticker.toUpperCase());
    if (!quote) {
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }
    return NextResponse.json(quote);
  } catch (e) {
    console.error("GET /api/market/quote error:", e);
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}
