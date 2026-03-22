/**
 * Seeds the production Turso database with initial data.
 * Run during build: creates profile + seed recommendations if tables are empty.
 * Safe to re-run: skips if data already exists.
 */
import { config } from "dotenv";
config({ path: ".env" });
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken || url.startsWith("file:")) {
  console.log("Skipping Turso seed (no remote database configured)");
  process.exit(0);
}

const client = createClient({ url, authToken });

async function queryOne(sql: string): Promise<number> {
  const result = await client.execute(sql);
  return Number(result.rows[0]?.[0] ?? 0);
}

async function main() {
  console.log("Checking if seed data is needed...");

  const profileCount = await queryOne(`SELECT COUNT(*) FROM "UserProfile"`);
  if (profileCount > 0) {
    console.log("  ✓ UserProfile exists, skipping seed");

    // Still check for recommendations
    const recCount = await queryOne(`SELECT COUNT(*) FROM "Recommendation" WHERE status = 'active'`);
    if (recCount > 0) {
      console.log(`  ✓ ${recCount} active recommendations exist`);
      return;
    }
    console.log("  ! No active recommendations — seeding recommendations only");
  } else {
    console.log("  ! No user profile — seeding full dataset");

    // Create user profile
    await client.execute({
      sql: `INSERT INTO "UserProfile" ("investing_style", "risk_tolerance", "instruments", "portfolio_size_range", "portfolio_balance", "portfolio_balance_updated_at", "archetype", "risk_score", "asset_classes", "updated_at") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["growth", 3, '["stocks","etfs","options"]', "25k-100k", 62500, new Date().toISOString(), "Steady Growth Seeker", 7, '["stocks","etfs"]', new Date().toISOString()],
    });
    console.log("  ✓ Created UserProfile");

    // Mark onboarding complete
    await client.execute({
      sql: `INSERT OR REPLACE INTO "AppSettings" ("key", "value") VALUES (?, ?)`,
      args: ["onboarding_complete", "true"],
    });

    // Set other defaults
    const defaults = [
      ["daily_api_cap", "20"],
      ["monthly_budget", "15.00"],
      ["last_refresh", "null"],
    ];
    for (const [key, value] of defaults) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO "AppSettings" ("key", "value") VALUES (?, ?)`,
        args: [key, value],
      });
    }
    console.log("  ✓ AppSettings initialized");
  }

  // Seed recommendations
  const now = new Date().toISOString();
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();
  const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString();

  const recs = [
    {
      ticker: "NVDA", company_name: "NVIDIA Corporation", ai_score: 8.7, benchmark_score: 82,
      rating: "strong_buy", confidence: 0.82, asset_class: "stock",
      thesis: "AI infrastructure spending accelerating into 2026; dominant GPU market position with expanding margins.",
      bull_case: JSON.stringify({ headline: "AI Supercycle", points: ["Data center revenue +80% YoY", "Blackwell ramp ahead of schedule", "Enterprise AI adoption still early innings"] }),
      bear_case: JSON.stringify({ headline: "Valuation Risk", points: ["P/E of 45x leaves little room for error", "Custom chips from hyperscalers could erode share", "China export restrictions tightening"] }),
      key_metrics: JSON.stringify({ pe: 45.2, pe_sector_avg: 32.1, ps: 28.5, ev_ebitda: 38.7, debt_equity: 0.41, revenue_growth: 0.80, margins: { gross: 0.75, operating: 0.62, net: 0.55 } }),
      factor_scores: JSON.stringify({ technical: { score: 8.5, inputs: ["Above 50/200 DMA", "RSI 62"], reasoning: "Strong uptrend with healthy momentum" }, fundamental: { score: 9.0, inputs: ["Revenue growth 80%", "Expanding margins"], reasoning: "Best-in-class fundamentals in semis" }, sentiment: { score: 8.0, inputs: ["42 buy ratings", "Avg PT $165"], reasoning: "Overwhelmingly bullish consensus" }, momentum: { score: 9.0, inputs: ["+45% 3M", "+120% 1Y"], reasoning: "Outperforming SPX by wide margin" }, earnings: { score: 8.5, inputs: ["Beat 4 consecutive Qs", "Raised guidance"], reasoning: "Consistent beats with upward revisions" }, governance: { score: 7.5, inputs: ["Jensen Huang founder-CEO", "Board stable"], reasoning: "Strong founder leadership" }, macro: { score: 6.5, inputs: ["AI capex cycle", "Rate-neutral demand"], reasoning: "AI spending continues regardless of macro" } }),
      factor_details: "{}",
      governance_score: 7.5,
      governance_details: JSON.stringify({ board_stability: "Stable", ceo_tenure: "30+ years", insider_alignment: "High" }),
      position_size_pct: 0.04, order_type: "limit", entry_price: 142.50, stop_loss: 132.00, take_profit: 165.00,
      time_sensitivity: "this_week",
      full_analysis: "NVIDIA remains the undisputed leader in AI accelerator hardware. The Blackwell architecture ramp is progressing ahead of internal targets, with hyperscaler demand far exceeding supply. Revenue growth of 80% YoY is unprecedented for a company of this scale. While the P/E of 45x appears elevated, it's justified by the growth trajectory and expanding margins. Key risk is geopolitical: further China restrictions could impact ~15% of revenue.",
      catalysts: JSON.stringify([{ date: "2026-04-23", event: "Q1 Earnings", description: "Expected beat on Blackwell revenue recognition" }]),
      comparable_companies: JSON.stringify([{ ticker: "AMD", ai_score: 6.8, brief: "Competitive but behind on AI" }, { ticker: "AVGO", ai_score: 7.5, brief: "Networking beneficiary of AI buildout" }]),
      expires_at: nextWeek,
    },
    {
      ticker: "AAPL", company_name: "Apple Inc.", ai_score: 7.2, benchmark_score: 68,
      rating: "buy", confidence: 0.68, asset_class: "stock",
      thesis: "iPhone 17 cycle with on-device AI features driving upgrade demand; Services margin expansion continues.",
      bull_case: JSON.stringify({ headline: "AI iPhone Cycle", points: ["iPhone 17 with Apple Intelligence driving upgrades", "Services revenue approaching $100B run rate", "Share buyback machine returning $90B/year"] }),
      bear_case: JSON.stringify({ headline: "Growth Plateau", points: ["Hardware revenue growth <5%", "China market share declining", "Regulatory pressure on App Store fees"] }),
      key_metrics: JSON.stringify({ pe: 31.5, pe_sector_avg: 28.0, ps: 8.2, ev_ebitda: 25.3, debt_equity: 1.8, revenue_growth: 0.06, margins: { gross: 0.46, operating: 0.31, net: 0.26 } }),
      factor_scores: JSON.stringify({ technical: { score: 7.0, inputs: ["Trading near 52-week high", "RSI 58"], reasoning: "Healthy uptrend, not overbought" }, fundamental: { score: 7.5, inputs: ["Steady margins", "Cash generation machine"], reasoning: "Premium quality but modest growth" }, sentiment: { score: 7.0, inputs: ["35 buy ratings", "Avg PT $245"], reasoning: "Consensus positive but priced in" }, momentum: { score: 6.5, inputs: ["+8% 3M", "+22% 1Y"], reasoning: "In line with market, not leading" }, earnings: { score: 7.5, inputs: ["Beat 3 of 4 Qs", "Stable guidance"], reasoning: "Reliable but no upside surprises" }, governance: { score: 8.0, inputs: ["Tim Cook tenure", "Stable board"], reasoning: "Strong leadership continuity" }, macro: { score: 7.0, inputs: ["Rate sensitivity low", "Pricing power"], reasoning: "Well-positioned in current cycle" } }),
      factor_details: "{}",
      governance_score: 8.0,
      governance_details: JSON.stringify({ board_stability: "Excellent", ceo_tenure: "13 years", insider_alignment: "High" }),
      position_size_pct: 0.05, order_type: "limit", entry_price: 228.00, stop_loss: 215.00, take_profit: 252.00,
      time_sensitivity: "monitor",
      full_analysis: "Apple continues to execute on its dual strategy of hardware + services. The iPhone 17 cycle represents the first true 'AI phone' with on-device Apple Intelligence capabilities that could drive a meaningful upgrade cycle. Services revenue is the key growth driver with margins above 70%. The buyback program provides a floor for the stock.",
      catalysts: JSON.stringify([{ date: "2026-05-01", event: "Q2 Earnings", description: "First full quarter of iPhone 17 sales data" }]),
      comparable_companies: JSON.stringify([{ ticker: "MSFT", ai_score: 7.0, brief: "Similar quality, different growth profile" }]),
      expires_at: twoWeeks,
    },
    {
      ticker: "AMZN", company_name: "Amazon.com Inc.", ai_score: 8.1, benchmark_score: 76,
      rating: "buy", confidence: 0.75, asset_class: "stock",
      thesis: "AWS re-acceleration on AI workloads + retail margin expansion creating dual growth engines.",
      bull_case: JSON.stringify({ headline: "AI Cloud Leader", points: ["AWS growth re-accelerating to 20%+", "Retail operating margin approaching 6%", "Advertising segment now $50B+ run rate"] }),
      bear_case: JSON.stringify({ headline: "Capex Concerns", points: ["$75B capex plan for AI infrastructure", "Retail competition from Temu/Shein", "Antitrust scrutiny intensifying"] }),
      key_metrics: JSON.stringify({ pe: 38.2, pe_sector_avg: 25.0, ps: 3.2, ev_ebitda: 20.5, debt_equity: 0.6, revenue_growth: 0.12, margins: { gross: 0.48, operating: 0.10, net: 0.08 } }),
      factor_scores: JSON.stringify({ technical: { score: 8.0, inputs: ["Breakout from consolidation", "RSI 65"], reasoning: "Bullish breakout with volume confirmation" }, fundamental: { score: 8.5, inputs: ["Margin expansion story", "Diversified revenue"], reasoning: "Best margin trajectory in big tech" }, sentiment: { score: 7.5, inputs: ["40 buy ratings", "Avg PT $230"], reasoning: "Strong consensus with upside" }, momentum: { score: 8.0, inputs: ["+18% 3M", "+35% 1Y"], reasoning: "Outperforming peers on margin story" }, earnings: { score: 8.5, inputs: ["Beat 4 consecutive Qs", "Raised guidance twice"], reasoning: "Consistent operational improvement" }, governance: { score: 7.5, inputs: ["Andy Jassy settled", "Board experienced"], reasoning: "Stable leadership after transition" }, macro: { score: 7.0, inputs: ["Consumer mixed", "AWS resilient"], reasoning: "Cloud demand offsets retail cyclicality" } }),
      factor_details: "{}",
      governance_score: 7.5,
      governance_details: JSON.stringify({ board_stability: "Good", ceo_tenure: "5 years", insider_alignment: "Moderate" }),
      position_size_pct: 0.04, order_type: "limit", entry_price: 205.00, stop_loss: 190.00, take_profit: 232.00,
      time_sensitivity: "this_week",
      full_analysis: "Amazon is in the middle of a margin expansion story that the market is only beginning to price in. AWS re-acceleration driven by AI workloads, combined with retail efficiency gains and the high-margin advertising business, creates a compelling growth + profitability narrative.",
      catalysts: JSON.stringify([{ date: "2026-04-24", event: "Q1 Earnings", description: "AWS growth rate and AI revenue disclosure" }]),
      comparable_companies: JSON.stringify([{ ticker: "MSFT", ai_score: 7.0, brief: "Cloud competitor, different margin profile" }, { ticker: "GOOGL", ai_score: 7.3, brief: "Ad competitor, similar AI investment" }]),
      expires_at: nextWeek,
    },
    {
      ticker: "META", company_name: "Meta Platforms Inc.", ai_score: 7.6, benchmark_score: 72,
      rating: "buy", confidence: 0.71, asset_class: "stock",
      thesis: "AI-driven ad targeting improvements boosting ARPU; Reality Labs losses narrowing with Quest momentum.",
      bull_case: JSON.stringify({ headline: "AI Ad Powerhouse", points: ["Advantage+ AI driving 30% better ad ROI", "Reels monetization closing gap with Stories", "WhatsApp business messaging untapped"] }),
      bear_case: JSON.stringify({ headline: "Reality Labs Drag", points: ["$15B+ annual Reality Labs losses", "Regulatory pressure in EU", "TikTok competition for younger demographics"] }),
      key_metrics: JSON.stringify({ pe: 24.8, pe_sector_avg: 28.0, ps: 9.5, ev_ebitda: 17.2, debt_equity: 0.3, revenue_growth: 0.22, margins: { gross: 0.81, operating: 0.41, net: 0.34 } }),
      factor_scores: JSON.stringify({ technical: { score: 7.5, inputs: ["Above all MAs", "RSI 61"], reasoning: "Constructive uptrend" }, fundamental: { score: 8.0, inputs: ["Cheap for growth rate", "81% gross margins"], reasoning: "Undervalued relative to peers" }, sentiment: { score: 7.0, inputs: ["32 buy ratings", "Avg PT $620"], reasoning: "Positive but metaverse skepticism lingers" }, momentum: { score: 7.5, inputs: ["+12% 3M", "+28% 1Y"], reasoning: "Solid momentum" }, earnings: { score: 8.0, inputs: ["Beat 4/4 Qs", "Revenue acceleration"], reasoning: "Consistent execution" }, governance: { score: 6.0, inputs: ["Zuckerberg dual-class control", "Board limited power"], reasoning: "Governance discount warranted" }, macro: { score: 7.0, inputs: ["Ad market recovering", "SMB spending stable"], reasoning: "Advertising resilient in current conditions" } }),
      factor_details: "{}",
      governance_score: 6.0,
      governance_details: JSON.stringify({ board_stability: "Stable but controlled", ceo_tenure: "20+ years", insider_alignment: "Dual-class concern" }),
      position_size_pct: 0.03, order_type: "limit", entry_price: 575.00, stop_loss: 545.00, take_profit: 625.00,
      time_sensitivity: "this_week",
      full_analysis: "Meta has transformed from a social media company into an AI-first advertising platform. The Advantage+ suite is delivering measurably better ROI for advertisers, driving ARPU growth across all regions. Reality Labs remains a drag but losses are narrowing. At 24.8x earnings with 22% revenue growth, Meta is arguably the cheapest mega-cap tech stock.",
      catalysts: JSON.stringify([{ date: "2026-04-23", event: "Q1 Earnings", description: "Ad revenue growth and Reality Labs loss trajectory" }]),
      comparable_companies: JSON.stringify([{ ticker: "GOOGL", ai_score: 7.3, brief: "Digital ad competitor" }, { ticker: "SNAP", ai_score: 5.5, brief: "Social media peer, weaker execution" }]),
      expires_at: nextWeek,
    },
    {
      ticker: "TSLA", company_name: "Tesla Inc.", ai_score: 6.5, benchmark_score: 55,
      rating: "hold", confidence: 0.55, asset_class: "stock",
      thesis: "Robotaxi and FSD optionality priced in; near-term delivery growth slowing as competition intensifies.",
      bull_case: JSON.stringify({ headline: "Autonomy + Energy", points: ["FSD supervised showing rapid improvement", "Energy storage revenue doubling", "Robotaxi launch could redefine TAM"] }),
      bear_case: JSON.stringify({ headline: "Execution Risk", points: ["Auto margins compressed to ~17%", "China competition from BYD intensifying", "Brand damage from CEO political activity"] }),
      key_metrics: JSON.stringify({ pe: 68.5, pe_sector_avg: 15.0, ps: 11.2, ev_ebitda: 52.3, debt_equity: 0.1, revenue_growth: 0.08, margins: { gross: 0.17, operating: 0.08, net: 0.07 } }),
      factor_scores: JSON.stringify({ technical: { score: 6.0, inputs: ["Choppy, range-bound", "RSI 48"], reasoning: "No clear trend direction" }, fundamental: { score: 5.0, inputs: ["68x P/E extreme for auto", "Margins declining"], reasoning: "Valuation assumes future optionality" }, sentiment: { score: 6.5, inputs: ["Split analyst consensus", "PT range $85-$400"], reasoning: "Extremely polarized" }, momentum: { score: 5.5, inputs: ["-2% 3M", "+15% 1Y"], reasoning: "Underperforming market recently" }, earnings: { score: 6.0, inputs: ["Mixed recent results", "Margins declining"], reasoning: "Execution concerns" }, governance: { score: 4.5, inputs: ["CEO distraction risk", "Board independence concerns"], reasoning: "Governance discount significant" }, macro: { score: 5.5, inputs: ["EV subsidies uncertain", "Rate sensitive purchases"], reasoning: "Consumer financing costs matter for auto" } }),
      factor_details: "{}",
      governance_score: 4.5,
      governance_details: JSON.stringify({ board_stability: "Concerns", ceo_tenure: "20+ years", insider_alignment: "Complex — CEO multi-company" }),
      position_size_pct: 0.02, order_type: "limit", entry_price: 265.00, stop_loss: 240.00, take_profit: 310.00,
      time_sensitivity: "monitor",
      full_analysis: "Tesla is at a crossroads: the core auto business faces intensifying competition and margin pressure, while the optionality in FSD, robotaxi, and energy storage remains enormous but unproven at scale. At 68x earnings, the stock prices in significant future value creation. Hold for existing positions; new entries should wait for a clearer catalyst.",
      catalysts: JSON.stringify([{ date: "2026-04-22", event: "Q1 Earnings", description: "Delivery numbers and margin trajectory" }, { date: "2026-06-01", event: "Robotaxi Update", description: "Austin launch timeline" }]),
      comparable_companies: JSON.stringify([{ ticker: "RIVN", ai_score: 4.5, brief: "EV pure-play, pre-profit" }, { ticker: "BYD", ai_score: 7.0, brief: "China EV leader, better margins" }]),
      expires_at: twoWeeks,
    },
  ];

  for (const rec of recs) {
    await client.execute({
      sql: `INSERT INTO "Recommendation" ("ticker", "company_name", "asset_class", "ai_score", "benchmark_score", "rating", "confidence", "thesis", "bull_case", "bear_case", "key_metrics", "factor_scores", "factor_details", "governance_score", "governance_details", "position_size_pct", "order_type", "entry_price", "stop_loss", "take_profit", "time_sensitivity", "full_analysis", "catalysts", "comparable_companies", "status", "version", "generated_at", "expires_at") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 1, ?, ?)`,
      args: [rec.ticker, rec.company_name, rec.asset_class, rec.ai_score, rec.benchmark_score, rec.rating, rec.confidence, rec.thesis, rec.bull_case, rec.bear_case, rec.key_metrics, rec.factor_scores, rec.factor_details, rec.governance_score, rec.governance_details, rec.position_size_pct, rec.order_type, rec.entry_price, rec.stop_loss, rec.take_profit, rec.time_sensitivity, rec.full_analysis, rec.catalysts, rec.comparable_companies, now, rec.expires_at],
    });
    console.log(`  ✓ Recommendation: ${rec.ticker} (${rec.rating}, score ${rec.ai_score})`);
  }

  // Seed sample trades if none exist
  const tradeCount = await queryOne(`SELECT COUNT(*) FROM "Trade"`);
  if (tradeCount === 0) {
    const trades = [
      { ticker: "MSFT", action: "buy", shares: 15, entry_price: 420.50, stop_loss: 400.00, take_profit: 460.00, order_type: "limit", status: "open", source: "ai_recommendation" },
      { ticker: "GOOGL", action: "buy", shares: 25, entry_price: 172.30, stop_loss: 160.00, take_profit: 195.00, order_type: "market", status: "open", source: "manual" },
    ];
    for (const t of trades) {
      await client.execute({
        sql: `INSERT INTO "Trade" ("ticker", "action", "shares", "entry_price", "stop_loss", "take_profit", "order_type", "status", "source") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [t.ticker, t.action, t.shares, t.entry_price, t.stop_loss, t.take_profit, t.order_type, t.status, t.source],
      });
    }
    console.log("  ✓ Seeded 2 sample trades");
  }

  // Seed watchlist if empty
  const watchlistCount = await queryOne(`SELECT COUNT(*) FROM "WatchlistItem"`);
  if (watchlistCount === 0) {
    const items = [
      { ticker: "TSLA", name: "Tesla Inc." },
      { ticker: "PLTR", name: "Palantir Technologies" },
      { ticker: "AMD", name: "Advanced Micro Devices" },
    ];
    for (const item of items) {
      await client.execute({
        sql: `INSERT INTO "WatchlistItem" ("ticker", "company_name") VALUES (?, ?)`,
        args: [item.ticker, item.name],
      });
    }
    console.log("  ✓ Seeded 3 watchlist items");
  }

  console.log("Seed complete!");
}

main().catch((e) => {
  console.error("Seed error:", e);
  // Don't fail the build if seeding fails
  process.exit(0);
});
