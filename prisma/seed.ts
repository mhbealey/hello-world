import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create user profile (skip onboarding)
  await prisma.userProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      investing_style: "growth",
      risk_tolerance: 3,
      instruments: JSON.stringify(["stocks", "etfs", "options"]),
      portfolio_size_range: "25k-100k",
      portfolio_balance: 62500,
      portfolio_balance_updated_at: new Date(),
      archetype: "Steady Growth Seeker",
      risk_score: 7,
    },
  });

  // Mark onboarding complete
  await prisma.appSettings.upsert({
    where: { key: "onboarding_complete" },
    update: { value: "true" },
    create: { key: "onboarding_complete", value: "true" },
  });

  // Seed recommendations
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 86400000);

  const recs = [
    {
      ticker: "NVDA",
      company_name: "NVIDIA Corporation",
      ai_score: 8.7,
      rating: "strong_buy",
      confidence: 0.82,
      thesis: "AI infrastructure spending accelerating into 2026; dominant GPU market position with expanding margins.",
      bull_case: JSON.stringify({ headline: "AI Supercycle", points: ["Data center revenue +80% YoY", "Blackwell ramp ahead of schedule", "Enterprise AI adoption still early innings"] }),
      bear_case: JSON.stringify({ headline: "Valuation Risk", points: ["P/E of 45x leaves little room for error", "Custom chips from hyperscalers could erode share", "China export restrictions tightening"] }),
      key_metrics: JSON.stringify({ pe: 45.2, pe_sector_avg: 32.1, ps: 28.5, ev_ebitda: 38.7, debt_equity: 0.41, revenue_growth: 0.80, margins: { gross: 0.75, operating: 0.62, net: 0.55 } }),
      factor_scores: JSON.stringify({ technical: { score: 8.5, inputs: ["Above 50/200 DMA", "RSI 62"], reasoning: "Strong uptrend with healthy momentum" }, fundamental: { score: 9.0, inputs: ["Revenue growth 80%", "Expanding margins"], reasoning: "Best-in-class fundamentals in semis" }, sentiment: { score: 8.0, inputs: ["42 buy ratings", "Avg PT $165"], reasoning: "Overwhelmingly bullish consensus" }, momentum: { score: 9.0, inputs: ["+45% 3M", "+120% 1Y"], reasoning: "Outperforming SPX by wide margin" }, earnings: { score: 8.5, inputs: ["Beat 4 consecutive Qs", "Raised guidance"], reasoning: "Consistent beats with upward revisions" }, governance: { score: 7.5, inputs: ["Jensen Huang founder-CEO", "Board stable"], reasoning: "Strong founder leadership" }, macro: { score: 6.5, inputs: ["AI capex cycle", "Rate-neutral demand"], reasoning: "AI spending continues regardless of macro" } }),
      factor_details: JSON.stringify({}),
      position_size_pct: 0.04,
      order_type: "limit",
      entry_price: 142.50,
      stop_loss: 132.00,
      take_profit: 165.00,
      time_sensitivity: "this_week",
      full_analysis: "NVIDIA remains the undisputed leader in AI accelerator hardware. The Blackwell architecture ramp is progressing ahead of internal targets, with hyperscaler demand far exceeding supply. Revenue growth of 80% YoY is unprecedented for a company of this scale. While the P/E of 45x appears elevated, it's justified by the growth trajectory and expanding margins. Key risk is geopolitical: further China restrictions could impact ~15% of revenue. The technical setup is constructive with price holding above key moving averages and RSI indicating momentum without overbought conditions.",
      catalysts: JSON.stringify([{ date: "2026-04-23", event: "Q1 Earnings", description: "Expected beat on Blackwell revenue recognition" }]),
      comparable_companies: JSON.stringify([{ ticker: "AMD", ai_score: 6.8, brief: "Competitive but behind on AI" }, { ticker: "AVGO", ai_score: 7.5, brief: "Networking beneficiary of AI buildout" }]),
      status: "active",
      version: 1,
      generated_at: now,
      expires_at: nextWeek,
    },
    {
      ticker: "AAPL",
      company_name: "Apple Inc.",
      ai_score: 7.2,
      rating: "buy",
      confidence: 0.68,
      thesis: "iPhone 17 cycle with on-device AI features driving upgrade demand; Services margin expansion continues.",
      bull_case: JSON.stringify({ headline: "AI iPhone Cycle", points: ["iPhone 17 with Apple Intelligence driving upgrades", "Services revenue approaching $100B run rate", "Share buyback machine returning $90B/year"] }),
      bear_case: JSON.stringify({ headline: "Growth Plateau", points: ["Hardware revenue growth <5%", "China market share declining", "Regulatory pressure on App Store fees"] }),
      key_metrics: JSON.stringify({ pe: 31.5, pe_sector_avg: 28.0, ps: 8.2, ev_ebitda: 25.3, debt_equity: 1.8, revenue_growth: 0.06, margins: { gross: 0.46, operating: 0.31, net: 0.26 } }),
      factor_scores: JSON.stringify({ technical: { score: 7.0, inputs: ["Trading near 52-week high", "RSI 58"], reasoning: "Healthy uptrend, not overbought" }, fundamental: { score: 7.5, inputs: ["Steady margins", "Cash generation machine"], reasoning: "Premium quality but modest growth" }, sentiment: { score: 7.0, inputs: ["35 buy ratings", "Avg PT $245"], reasoning: "Consensus positive but priced in" }, momentum: { score: 6.5, inputs: ["+8% 3M", "+22% 1Y"], reasoning: "In line with market, not leading" }, earnings: { score: 7.5, inputs: ["Beat 3 of 4 Qs", "Stable guidance"], reasoning: "Reliable but no upside surprises" }, governance: { score: 8.0, inputs: ["Tim Cook tenure", "Stable board"], reasoning: "Strong leadership continuity" }, macro: { score: 7.0, inputs: ["Rate sensitivity low", "Pricing power"], reasoning: "Well-positioned in current cycle" } }),
      factor_details: JSON.stringify({}),
      position_size_pct: 0.05,
      order_type: "limit",
      entry_price: 228.00,
      stop_loss: 215.00,
      take_profit: 252.00,
      time_sensitivity: "monitor",
      full_analysis: "Apple continues to execute on its dual strategy of hardware + services. The iPhone 17 cycle represents the first true 'AI phone' with on-device Apple Intelligence capabilities that could drive a meaningful upgrade cycle. Services revenue is the key growth driver with margins above 70%. The buyback program provides a floor for the stock. Main concerns are China headwinds and regulatory risk around App Store economics. At 31x earnings, it's fairly valued for a company growing revenue at 6%.",
      catalysts: JSON.stringify([{ date: "2026-05-01", event: "Q2 Earnings", description: "First full quarter of iPhone 17 sales data" }]),
      comparable_companies: JSON.stringify([{ ticker: "MSFT", ai_score: 7.0, brief: "Similar quality, different growth profile" }]),
      status: "active",
      version: 1,
      generated_at: now,
      expires_at: nextWeek,
    },
    {
      ticker: "AMZN",
      company_name: "Amazon.com Inc.",
      ai_score: 8.1,
      rating: "buy",
      confidence: 0.75,
      thesis: "AWS re-acceleration on AI workloads + retail margin expansion creating dual growth engines.",
      bull_case: JSON.stringify({ headline: "AI Cloud Leader", points: ["AWS growth re-accelerating to 20%+", "Retail operating margin approaching 6%", "Advertising segment now $50B+ run rate"] }),
      bear_case: JSON.stringify({ headline: "Capex Concerns", points: ["$75B capex plan for AI infrastructure", "Retail competition from Temu/Shein", "Antitrust scrutiny intensifying"] }),
      key_metrics: JSON.stringify({ pe: 38.2, pe_sector_avg: 25.0, ps: 3.2, ev_ebitda: 20.5, debt_equity: 0.6, revenue_growth: 0.12, margins: { gross: 0.48, operating: 0.10, net: 0.08 } }),
      factor_scores: JSON.stringify({ technical: { score: 8.0, inputs: ["Breakout from consolidation", "RSI 65"], reasoning: "Bullish breakout with volume confirmation" }, fundamental: { score: 8.5, inputs: ["Margin expansion story", "Diversified revenue"], reasoning: "Best margin trajectory in big tech" }, sentiment: { score: 7.5, inputs: ["40 buy ratings", "Avg PT $230"], reasoning: "Strong consensus with upside" }, momentum: { score: 8.0, inputs: ["+18% 3M", "+35% 1Y"], reasoning: "Outperforming peers on margin story" }, earnings: { score: 8.5, inputs: ["Beat 4 consecutive Qs", "Raised guidance twice"], reasoning: "Consistent operational improvement" }, governance: { score: 7.5, inputs: ["Andy Jassy settled", "Board experienced"], reasoning: "Stable leadership after transition" }, macro: { score: 7.0, inputs: ["Consumer mixed", "AWS resilient"], reasoning: "Cloud demand offsets retail cyclicality" } }),
      factor_details: JSON.stringify({}),
      position_size_pct: 0.04,
      order_type: "limit",
      entry_price: 205.00,
      stop_loss: 190.00,
      take_profit: 232.00,
      time_sensitivity: "this_week",
      full_analysis: "Amazon is in the middle of a margin expansion story that the market is only beginning to price in. AWS re-acceleration driven by AI workloads, combined with retail efficiency gains and the high-margin advertising business, creates a compelling growth + profitability narrative. The $75B capex plan is a concern but positions Amazon for the next decade of AI infrastructure. At 38x earnings, it's not cheap, but the margin trajectory justifies a premium multiple.",
      catalysts: JSON.stringify([{ date: "2026-04-24", event: "Q1 Earnings", description: "AWS growth rate and AI revenue disclosure" }]),
      comparable_companies: JSON.stringify([{ ticker: "MSFT", ai_score: 7.0, brief: "Cloud competitor, different margin profile" }, { ticker: "GOOGL", ai_score: 7.3, brief: "Ad competitor, similar AI investment" }]),
      status: "active",
      version: 1,
      generated_at: now,
      expires_at: nextWeek,
    },
  ];

  for (const rec of recs) {
    await prisma.recommendation.create({ data: rec });
  }

  // Seed some open trades
  await prisma.trade.create({
    data: {
      ticker: "MSFT",
      action: "buy",
      shares: 15,
      entry_price: 420.50,
      stop_loss: 400.00,
      take_profit: 460.00,
      order_type: "limit",
      status: "open",
      source: "ai_recommendation",
      planned_rr_ratio: 1.9,
    },
  });

  await prisma.trade.create({
    data: {
      ticker: "GOOGL",
      action: "buy",
      shares: 25,
      entry_price: 172.30,
      stop_loss: 160.00,
      take_profit: 195.00,
      order_type: "market",
      status: "open",
      source: "manual",
      planned_rr_ratio: 1.8,
    },
  });

  // Seed a closed trade for analytics
  await prisma.trade.create({
    data: {
      ticker: "META",
      action: "buy",
      shares: 10,
      entry_price: 510.00,
      exit_price: 555.00,
      stop_loss: 490.00,
      take_profit: 560.00,
      order_type: "limit",
      status: "closed",
      source: "ai_recommendation",
      planned_rr_ratio: 2.5,
      actual_rr_ratio: 2.25,
      return_pct: 8.82,
      return_dollars: 450.00,
      exit_date: new Date(now.getTime() - 3 * 86400000),
    },
  });

  // Seed watchlist
  await prisma.watchlistItem.create({ data: { ticker: "TSLA", company_name: "Tesla Inc." } });
  await prisma.watchlistItem.create({ data: { ticker: "PLTR", company_name: "Palantir Technologies" } });

  // Seed portfolio snapshots for chart
  const baseValue = 62500;
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    const noise = (Math.random() - 0.45) * 800;
    const trend = (30 - i) * 25;
    await prisma.portfolioSnapshot.create({
      data: {
        date,
        total_value: baseValue + trend + noise,
        daily_pnl: noise,
        daily_pnl_pct: (noise / baseValue) * 100,
        holdings_summary: JSON.stringify([{ ticker: "MSFT", value: 6307.5 }, { ticker: "GOOGL", value: 4307.5 }]),
        sp500_value: 5200 + (30 - i) * 8 + (Math.random() - 0.5) * 50,
      },
    });
  }

  console.log("✅ Seed complete: profile, 3 recommendations, 3 trades, 2 watchlist items, 31 snapshots");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
