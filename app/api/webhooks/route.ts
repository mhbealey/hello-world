import { NextResponse } from "next/server";
import { webhookSchema } from "@/types/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = webhookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    const { type, payload } = parsed.data;

    switch (type) {
      case "assessment.completed":
        console.log("Assessment completed:", payload);
        break;
      case "policy.overdue":
        console.log("Policy overdue:", payload);
        break;
      case "advisor.confirmed":
        console.log("Advisor confirmed:", payload);
        break;
      default:
        console.log("Unknown webhook type:", type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
