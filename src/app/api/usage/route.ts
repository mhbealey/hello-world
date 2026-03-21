import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const monthlyUsage = await prisma.apiUsage.findMany({
      where: { date: { gte: monthStart } },
    });

    const monthlyCost = monthlyUsage.reduce((s, u) => s + u.estimated_cost, 0);
    const todayStr = today.toISOString().split("T")[0];
    const todayUsage = monthlyUsage.find((u) => u.date.toISOString().split("T")[0] === todayStr);

    const budgetSetting = await prisma.appSettings.findUnique({ where: { key: "monthly_budget" } });
    const capSetting = await prisma.appSettings.findUnique({ where: { key: "daily_api_cap" } });

    return NextResponse.json({
      monthly_cost: monthlyCost,
      monthly_budget: parseFloat(budgetSetting?.value || "15"),
      daily_calls: todayUsage?.call_count || 0,
      daily_cap: parseInt(capSetting?.value || "20"),
    });
  } catch (e) {
    console.error("GET /api/usage error:", e);
    return NextResponse.json({ monthly_cost: 0, monthly_budget: 15, daily_calls: 0, daily_cap: 20 });
  }
}
