import { NextResponse } from "next/server";
import { exportParamsSchema } from "@/types/schemas";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = exportParamsSchema.safeParse({
      screen: searchParams.get("screen"),
      format: searchParams.get("format") ?? "pdf",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid export parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // In production: fetch data, generate PDF via @react-pdf/renderer, return file
    return NextResponse.json({
      message: `Export for ${parsed.data.screen} screen is being generated`,
      screen: parsed.data.screen,
      format: parsed.data.format,
      status: "generating",
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json(
      { error: "PDF generation failed. Please try again." },
      { status: 500 }
    );
  }
}
