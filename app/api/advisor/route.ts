import { NextResponse } from "next/server";
import { advisorRequestSchema } from "@/types/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = advisorRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { selected_action_ids, source_context, selected_time } = parsed.data;

    // In production: create advisor_request in Supabase, send notification, create calendar event
    return NextResponse.json({
      id: crypto.randomUUID(),
      status: "confirmed",
      selected_action_ids,
      source_context,
      selected_time,
      message: `Call scheduled for ${selected_time}`,
    });
  } catch (error) {
    console.error("Advisor API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
