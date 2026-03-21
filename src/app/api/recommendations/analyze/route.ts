import { NextResponse } from "next/server";
import { generateSingleAnalysis } from "@/lib/ai/generate";

export async function POST(request: Request) {
  try {
    const { ticker } = await request.json();
    if (!ticker || typeof ticker !== "string") {
      return NextResponse.json({ error: "Ticker required" }, { status: 400 });
    }

    const result = await generateSingleAnalysis(ticker.toUpperCase());

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 429 });
    }
    if (!result.recommendation) {
      return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
    }

    return NextResponse.json(result.recommendation);
  } catch (e) {
    console.error("POST /api/recommendations/analyze error:", e);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
