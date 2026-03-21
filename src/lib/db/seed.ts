import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Seed AppSettings
  const settings = [
    { key: "colorblind_mode", value: "false" },
    { key: "last_refresh", value: "null" },
    { key: "onboarding_complete", value: "true" },
    { key: "daily_api_cap", value: "20" },
    { key: "monthly_budget", value: "15.00" },
    { key: "trash_data", value: "null" },
    { key: "trash_expires_at", value: "null" },
    { key: "tooltips_shown", value: "false" },
  ];
  for (const s of settings) {
    await prisma.appSettings.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // Seed UserProfile
  await prisma.userProfile.deleteMany();
  await prisma.userProfile.create({
    data: {
      investing_style: "growth",
      risk_tolerance: 3,
      instruments: JSON.stringify(["stocks", "options"]),
      portfolio_size_range: "25k-100k",
      portfolio_balance: 47832.15,
      portfolio_balance_updated_at: new Date(),
      archetype: "Steady Growth Seeker",
      risk_score: 6.5,
    },
  });

  // Seed Recommendations
  await prisma.recommendation.deleteMany();
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + (5 - weekEnd.getDay()));
  weekEnd.setHours(16, 0, 0, 0);

  const recs = [
    {
      ticker: "AAPL", company_name: "Apple Inc.", ai_score: 8.2,
      rating: "strong_buy", confidence: 0.82, thesis: "Strong momentum into services revenue growth with upcoming product cycle",
      bull_case: JSON.stringify({ headline: "Services and AI integration driving growth", points: ["Services revenue growing 15% YoY", "AI features driving upgrade cycle", "Strong free cash flow supports buybacks"] }),
      bear_case: JSON.stringify({ headline: "Valuation premium and China risk", points: ["P/E above historical average", "China regulatory uncertainty", "Smartphone market saturation"] }),
      key_metrics: JSON.stringify({ pe: 28.5, pe_sector_avg: 31.2, ps: 7.8, ev_ebitda: 22.1, debt_equity: 1.8, revenue_growth: 0.08, margins: { gross: 0.45, operating: 0.30, net: 0.25 } }),
      factor_scores: JSON.stringify({ technical: { score: 8.0, inputs: ["50-day MA above 200-day", "RSI 58"], reasoning: "Bullish trend" }, fundamental: { score: 8.5, inputs: ["P/E below sector avg"], reasoning: "Solid fundamentals" }, sentiment: { score: 7.5, inputs: ["18/24 Buy"], reasoning: "Strong consensus" }, momentum: { score: 8.5, inputs: ["+5% 1M"], reasoning: "Outperforming" }, earnings: { score: 8.5, inputs: ["4/4 beats"], reasoning: "Consistent" } }),
      factor_details: JSON.stringify({}),
      position_size_pct: 0.04, order_type: "limit", entry_price: 185.50, stop_loss: 178.00, take_profit: 198.00,
      time_sensitivity: "this_week", full_analysis: "Apple continues to demonstrate strong execution across its product and services portfolio...",
      catalysts: JSON.stringify([{ date: "2026-04-28", event: "Q2 Earnings", description: "Expected strong services growth" }]),
      comparable_companies: JSON.stringify([{ ticker: "MSFT", ai_score: 7.5, brief: "Similar mega-cap tech" }]),
      status: "active", version: 1, generated_at: now, expires_at: weekEnd,
    },
    {
      ticker: "NVDA", company_name: "NVIDIA Corporation", ai_score: 7.8,
      rating: "buy", confidence: 0.75, thesis: "AI infrastructure spending cycle still early, data center dominance",
      bull_case: JSON.stringify({ headline: "AI capex cycle has years to run", points: ["Data center revenue growing 100%+ YoY", "Next-gen chips maintaining lead", "Expanding software moat with CUDA"] }),
      bear_case: JSON.stringify({ headline: "Valuation and competition risks", points: ["Forward P/E elevated vs history", "AMD and custom silicon gaining share", "Customer concentration risk"] }),
      key_metrics: JSON.stringify({ pe: 45.2, pe_sector_avg: 31.2, ps: 25.1, ev_ebitda: 38.5, debt_equity: 0.4, revenue_growth: 1.22, margins: { gross: 0.74, operating: 0.62, net: 0.55 } }),
      factor_scores: JSON.stringify({ technical: { score: 7.5, inputs: ["Above all MAs"], reasoning: "Strong trend" }, fundamental: { score: 7.0, inputs: ["Premium P/E justified by growth"], reasoning: "Growth priced in" }, sentiment: { score: 8.0, inputs: ["22/28 Buy"], reasoning: "Very bullish consensus" }, momentum: { score: 8.5, inputs: ["+12% 1M"], reasoning: "Leading market" }, earnings: { score: 8.0, inputs: ["Massive beats"], reasoning: "Consistently exceeding" } }),
      factor_details: JSON.stringify({}),
      position_size_pct: 0.03, order_type: "limit", entry_price: 142.30, stop_loss: 132.00, take_profit: 160.00,
      time_sensitivity: "this_week", full_analysis: "NVIDIA remains the primary beneficiary of the AI infrastructure buildout...",
      catalysts: JSON.stringify([{ date: "2026-05-20", event: "Q1 Earnings", description: "Data center guidance key" }]),
      comparable_companies: JSON.stringify([{ ticker: "AMD", ai_score: 6.5, brief: "Competitor but lower margins" }]),
      status: "active", version: 1, generated_at: now, expires_at: weekEnd,
    },
    {
      ticker: "MSFT", company_name: "Microsoft Corporation", ai_score: 7.5,
      rating: "buy", confidence: 0.70, thesis: "Azure growth re-accelerating with AI workloads, Copilot monetization beginning",
      bull_case: JSON.stringify({ headline: "Cloud + AI = durable growth engine", points: ["Azure growing 30%+ with AI contribution", "Copilot driving Office ARPU", "Strong free cash flow and buybacks"] }),
      bear_case: JSON.stringify({ headline: "Capex concerns and competition", points: ["Massive AI infrastructure spending", "Google and Amazon gaining in cloud", "Enterprise spending may slow"] }),
      key_metrics: JSON.stringify({ pe: 32.1, pe_sector_avg: 31.2, ps: 12.5, ev_ebitda: 25.3, debt_equity: 0.3, revenue_growth: 0.16, margins: { gross: 0.70, operating: 0.44, net: 0.36 } }),
      factor_scores: JSON.stringify({ technical: { score: 7.0, inputs: ["Consolidating near highs"], reasoning: "Neutral trend" }, fundamental: { score: 8.0, inputs: ["Fair P/E for growth"], reasoning: "Well-valued" }, sentiment: { score: 7.5, inputs: ["20/26 Buy"], reasoning: "Bullish" }, momentum: { score: 7.0, inputs: ["+3% 1M"], reasoning: "In-line" }, earnings: { score: 8.0, inputs: ["Consistent beats"], reasoning: "Reliable" } }),
      factor_details: JSON.stringify({}),
      position_size_pct: 0.04, order_type: "limit", entry_price: 425.00, stop_loss: 410.00, take_profit: 455.00,
      time_sensitivity: "monitor", full_analysis: "Microsoft's positioning in the AI era continues to strengthen...",
      catalysts: JSON.stringify([{ date: "2026-04-22", event: "Q3 Earnings", description: "Azure growth rate key metric" }]),
      comparable_companies: JSON.stringify([{ ticker: "GOOGL", ai_score: 6.8, brief: "Cloud competitor" }]),
      status: "active", version: 1, generated_at: now, expires_at: new Date(now.getTime() + 14 * 86400000),
    },
    {
      ticker: "GOOGL", company_name: "Alphabet Inc.", ai_score: 6.8,
      rating: "hold", confidence: 0.60, thesis: "Search moat intact but AI disruption risk warrants caution",
      bull_case: JSON.stringify({ headline: "Search dominance and cloud growth", points: ["Search revenue still growing", "Google Cloud profitable and accelerating", "YouTube monetization improving"] }),
      bear_case: JSON.stringify({ headline: "AI threatens core search business", points: ["ChatGPT and AI search gaining share", "Regulatory antitrust headwinds", "Ad market cyclicality"] }),
      key_metrics: JSON.stringify({ pe: 22.5, pe_sector_avg: 31.2, ps: 6.2, ev_ebitda: 16.8, debt_equity: 0.1, revenue_growth: 0.14, margins: { gross: 0.57, operating: 0.32, net: 0.26 } }),
      factor_scores: JSON.stringify({ technical: { score: 6.0, inputs: ["Testing support"], reasoning: "Uncertain" }, fundamental: { score: 7.5, inputs: ["Cheap for big tech"], reasoning: "Value here" }, sentiment: { score: 6.5, inputs: ["14/24 Buy"], reasoning: "Mixed" }, momentum: { score: 6.0, inputs: ["Flat 1M"], reasoning: "No momentum" }, earnings: { score: 8.0, inputs: ["Strong beats"], reasoning: "Good execution" } }),
      factor_details: JSON.stringify({}),
      position_size_pct: 0.03, order_type: "limit", entry_price: 172.00, stop_loss: 164.00, take_profit: 185.00,
      time_sensitivity: "monitor", full_analysis: "Alphabet faces a pivotal moment as AI reshapes the search landscape...",
      catalysts: JSON.stringify([{ date: "2026-04-24", event: "Q1 Earnings", description: "AI search metrics" }]),
      comparable_companies: JSON.stringify([{ ticker: "META", ai_score: 7.0, brief: "Digital ad competitor" }]),
      status: "active", version: 1, generated_at: now, expires_at: new Date(now.getTime() + 14 * 86400000),
    },
    {
      ticker: "AMZN", company_name: "Amazon.com Inc.", ai_score: 7.2,
      rating: "buy", confidence: 0.68, thesis: "AWS re-acceleration and retail margin expansion creating upside",
      bull_case: JSON.stringify({ headline: "Dual growth engines firing", points: ["AWS growth re-accelerating to 20%+", "Retail margins expanding with automation", "Advertising business high-margin growth"] }),
      bear_case: JSON.stringify({ headline: "Spending and competition", points: ["Heavy AI infrastructure investment", "Retail competition from Temu/Shein", "Regulatory scrutiny increasing"] }),
      key_metrics: JSON.stringify({ pe: 35.8, pe_sector_avg: 31.2, ps: 3.2, ev_ebitda: 18.5, debt_equity: 0.6, revenue_growth: 0.12, margins: { gross: 0.48, operating: 0.10, net: 0.08 } }),
      factor_scores: JSON.stringify({ technical: { score: 7.5, inputs: ["Breaking out of range"], reasoning: "Bullish setup" }, fundamental: { score: 7.0, inputs: ["P/E reasonable for growth"], reasoning: "Fair value" }, sentiment: { score: 7.5, inputs: ["20/28 Buy"], reasoning: "Bullish consensus" }, momentum: { score: 7.0, inputs: ["+4% 1M"], reasoning: "Positive" }, earnings: { score: 7.0, inputs: ["Beat last 3/4"], reasoning: "Mostly reliable" } }),
      factor_details: JSON.stringify({}),
      position_size_pct: 0.03, order_type: "limit", entry_price: 195.00, stop_loss: 186.00, take_profit: 212.00,
      time_sensitivity: "this_week", full_analysis: "Amazon's multi-faceted business continues to compound...",
      catalysts: JSON.stringify([{ date: "2026-04-30", event: "Q1 Earnings", description: "AWS growth and margin trajectory" }]),
      comparable_companies: JSON.stringify([{ ticker: "MSFT", ai_score: 7.5, brief: "Cloud competitor" }]),
      status: "active", version: 1, generated_at: now, expires_at: weekEnd,
    },
  ];

  for (const rec of recs) {
    await prisma.recommendation.create({ data: rec });
  }

  // Seed Trades (8 trades: 5 wins, 3 losses)
  await prisma.trade.deleteMany();
  const trades = [
    { ticker: "AAPL", action: "buy", shares: 15, entry_price: 172.50, stop_loss: 165.00, take_profit: 190.00, order_type: "limit", status: "open", source: "ai_recommendation", created_at: new Date(now.getTime() - 10 * 86400000) },
    { ticker: "NVDA", action: "buy", shares: 20, entry_price: 125.00, exit_price: 148.50, exit_date: new Date(now.getTime() - 3 * 86400000), stop_loss: 118.00, take_profit: 150.00, order_type: "limit", status: "closed", return_pct: 18.8, return_dollars: 470.00, planned_rr_ratio: 3.57, actual_rr_ratio: 3.36, source: "ai_recommendation", created_at: new Date(now.getTime() - 20 * 86400000) },
    { ticker: "MSFT", action: "buy", shares: 8, entry_price: 405.00, exit_price: 422.00, exit_date: new Date(now.getTime() - 5 * 86400000), stop_loss: 395.00, take_profit: 430.00, order_type: "limit", status: "closed", return_pct: 4.2, return_dollars: 136.00, planned_rr_ratio: 2.5, actual_rr_ratio: 1.7, source: "ai_recommendation", created_at: new Date(now.getTime() - 18 * 86400000) },
    { ticker: "META", action: "buy", shares: 10, entry_price: 520.00, exit_price: 483.00, exit_date: new Date(now.getTime() - 7 * 86400000), stop_loss: 500.00, take_profit: 560.00, order_type: "market", status: "closed", return_pct: -7.1, return_dollars: -370.00, planned_rr_ratio: 2.0, actual_rr_ratio: -1.85, source: "ai_recommendation", created_at: new Date(now.getTime() - 25 * 86400000) },
    { ticker: "TSLA", action: "buy", shares: 12, entry_price: 245.00, exit_price: 268.00, exit_date: new Date(now.getTime() - 2 * 86400000), stop_loss: 230.00, take_profit: 280.00, order_type: "limit", status: "closed", return_pct: 9.4, return_dollars: 276.00, planned_rr_ratio: 2.33, actual_rr_ratio: 1.53, source: "manual", created_at: new Date(now.getTime() - 15 * 86400000) },
    { ticker: "AMD", action: "buy", shares: 18, entry_price: 165.00, exit_price: 172.50, exit_date: new Date(now.getTime() - 8 * 86400000), stop_loss: 158.00, take_profit: 180.00, order_type: "limit", status: "closed", return_pct: 4.5, return_dollars: 135.00, planned_rr_ratio: 2.14, actual_rr_ratio: 1.07, source: "manual", created_at: new Date(now.getTime() - 22 * 86400000) },
    { ticker: "GOOGL", action: "buy", shares: 15, entry_price: 178.00, exit_price: 170.50, exit_date: new Date(now.getTime() - 4 * 86400000), stop_loss: 170.00, take_profit: 195.00, order_type: "limit", status: "closed", return_pct: -4.2, return_dollars: -112.50, planned_rr_ratio: 2.13, actual_rr_ratio: -0.94, source: "ai_recommendation", created_at: new Date(now.getTime() - 12 * 86400000) },
    { ticker: "AMZN", action: "buy", shares: 10, entry_price: 188.00, exit_price: 191.50, exit_date: new Date(now.getTime() - 1 * 86400000), stop_loss: 182.00, take_profit: 200.00, order_type: "limit", status: "closed", return_pct: 1.9, return_dollars: 35.00, planned_rr_ratio: 2.0, actual_rr_ratio: 0.58, notes: "Took profit early due to market uncertainty", source: "ai_recommendation", created_at: new Date(now.getTime() - 8 * 86400000) },
  ];

  for (const t of trades) {
    await prisma.trade.create({ data: t });
  }

  // Seed Watchlist
  await prisma.watchlistItem.deleteMany();
  for (const item of [
    { ticker: "SPY", company_name: "SPDR S&P 500 ETF" },
    { ticker: "QQQ", company_name: "Invesco QQQ Trust" },
    { ticker: "TSLA", company_name: "Tesla Inc." },
  ]) {
    await prisma.watchlistItem.create({ data: item });
  }

  // Seed 30-day Portfolio Snapshots
  await prisma.portfolioSnapshot.deleteMany();
  let value = 46500;
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(16, 0, 0, 0);

    const change = (Math.random() - 0.45) * 800;
    value += change;
    value = Math.max(44000, Math.min(50000, value));

    const dailyPnl = change;
    const dailyPnlPct = (change / value) * 100;

    await prisma.portfolioSnapshot.create({
      data: {
        date,
        total_value: Math.round(value * 100) / 100,
        daily_pnl: Math.round(dailyPnl * 100) / 100,
        daily_pnl_pct: Math.round(dailyPnlPct * 100) / 100,
        holdings_summary: JSON.stringify([
          { ticker: "AAPL", shares: 15, value: 2782.50, daily_change_pct: 0.5 },
        ]),
        sp500_value: 5200 + (30 - i) * 8 + (Math.random() - 0.5) * 40,
      },
    });
  }

  // Seed WizardState
  await prisma.wizardState.deleteMany();
  const aaplRec = await prisma.recommendation.findFirst({ where: { ticker: "AAPL" } });
  if (aaplRec) {
    await prisma.wizardState.create({
      data: {
        recommendation_id: aaplRec.id,
        current_step: 2,
        step_data: JSON.stringify({ orderType: "limit", limitPrice: 185.50 }),
      },
    });
  }

  console.log("Seed complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
