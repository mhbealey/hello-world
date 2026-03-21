import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken || url.startsWith("file:")) {
  console.log("Skipping Turso schema push (no remote database configured)");
  process.exit(0);
}

const client = createClient({ url, authToken });

const createStatements = [
  `CREATE TABLE IF NOT EXISTS "UserProfile" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "investing_style" TEXT NOT NULL,
    "risk_tolerance" INTEGER NOT NULL,
    "instruments" TEXT NOT NULL,
    "portfolio_size_range" TEXT NOT NULL,
    "portfolio_balance" REAL NOT NULL,
    "portfolio_balance_updated_at" DATETIME NOT NULL,
    "archetype" TEXT NOT NULL,
    "risk_score" REAL NOT NULL,
    "asset_classes" TEXT NOT NULL DEFAULT '["stocks"]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "Recommendation" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "ticker" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "asset_class" TEXT NOT NULL DEFAULT 'stock',
    "ai_score" REAL NOT NULL,
    "benchmark_score" INTEGER NOT NULL DEFAULT 50,
    "previous_ai_score" REAL,
    "score_change_reason" TEXT,
    "rating" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "thesis" TEXT NOT NULL,
    "bull_case" TEXT NOT NULL,
    "bear_case" TEXT NOT NULL,
    "key_metrics" TEXT NOT NULL,
    "factor_scores" TEXT NOT NULL,
    "factor_details" TEXT NOT NULL,
    "governance_score" REAL,
    "governance_details" TEXT,
    "position_size_pct" REAL NOT NULL,
    "order_type" TEXT NOT NULL,
    "entry_price" REAL NOT NULL,
    "stop_loss" REAL NOT NULL,
    "take_profit" REAL NOT NULL,
    "time_sensitivity" TEXT NOT NULL,
    "full_analysis" TEXT NOT NULL,
    "catalysts" TEXT NOT NULL,
    "comparable_companies" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "skipped_outcome_pct" REAL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "generated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL,
    "bundle_id" INTEGER
  )`,
  `CREATE INDEX IF NOT EXISTS "Recommendation_ticker_status_idx" ON "Recommendation"("ticker", "status")`,
  `CREATE INDEX IF NOT EXISTS "Recommendation_generated_at_idx" ON "Recommendation"("generated_at")`,
  `CREATE INDEX IF NOT EXISTS "Recommendation_asset_class_status_idx" ON "Recommendation"("asset_class", "status")`,
  `CREATE INDEX IF NOT EXISTS "Recommendation_benchmark_score_idx" ON "Recommendation"("benchmark_score")`,
  `CREATE INDEX IF NOT EXISTS "Recommendation_bundle_id_idx" ON "Recommendation"("bundle_id")`,
  `CREATE TABLE IF NOT EXISTS "Trade" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "recommendation_id" INTEGER,
    "parent_trade_id" INTEGER,
    "ticker" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "shares" REAL NOT NULL,
    "entry_price" REAL NOT NULL,
    "stop_loss" REAL,
    "take_profit" REAL,
    "order_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "exit_price" REAL,
    "exit_date" DATETIME,
    "return_pct" REAL,
    "return_dollars" REAL,
    "planned_rr_ratio" REAL,
    "actual_rr_ratio" REAL,
    "notes" TEXT,
    "source" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("recommendation_id") REFERENCES "Recommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("parent_trade_id") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "Trade_ticker_status_idx" ON "Trade"("ticker", "status")`,
  `CREATE INDEX IF NOT EXISTS "Trade_created_at_idx" ON "Trade"("created_at")`,
  `CREATE TABLE IF NOT EXISTS "WatchlistItem" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "ticker" TEXT NOT NULL UNIQUE,
    "company_name" TEXT NOT NULL,
    "asset_class" TEXT NOT NULL DEFAULT 'stock',
    "added_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS "WatchlistItem_ticker_idx" ON "WatchlistItem"("ticker")`,
  `CREATE TABLE IF NOT EXISTS "PortfolioSnapshot" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "total_value" REAL NOT NULL,
    "daily_pnl" REAL NOT NULL,
    "daily_pnl_pct" REAL NOT NULL,
    "holdings_summary" TEXT NOT NULL,
    "sp500_value" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PortfolioSnapshot_date_key" ON "PortfolioSnapshot"("date")`,
  `CREATE INDEX IF NOT EXISTS "PortfolioSnapshot_date_idx" ON "PortfolioSnapshot"("date")`,
  `CREATE TABLE IF NOT EXISTS "WizardState" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "recommendation_id" INTEGER NOT NULL,
    "current_step" INTEGER NOT NULL,
    "step_data" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    FOREIGN KEY ("recommendation_id") REFERENCES "Recommendation"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "AppSettings" (
    "key" TEXT PRIMARY KEY,
    "value" TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "ApiUsage" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "call_count" INTEGER NOT NULL,
    "estimated_cost" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "ApiUsage_date_idx" ON "ApiUsage"("date")`,
  `CREATE TABLE IF NOT EXISTS "BundlePortfolio" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "strategy" TEXT NOT NULL,
    "asset_filters" TEXT NOT NULL,
    "total_score" REAL NOT NULL,
    "allocation" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "generated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "BundlePortfolio_status_size_idx" ON "BundlePortfolio"("status", "size")`,
];

// ALTER TABLE statements for migrating existing tables
// SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we catch errors
const alterStatements = [
  `ALTER TABLE "UserProfile" ADD COLUMN "asset_classes" TEXT NOT NULL DEFAULT '["stocks"]'`,
  `ALTER TABLE "Recommendation" ADD COLUMN "asset_class" TEXT NOT NULL DEFAULT 'stock'`,
  `ALTER TABLE "Recommendation" ADD COLUMN "benchmark_score" INTEGER NOT NULL DEFAULT 50`,
  `ALTER TABLE "Recommendation" ADD COLUMN "governance_score" REAL`,
  `ALTER TABLE "Recommendation" ADD COLUMN "governance_details" TEXT`,
  `ALTER TABLE "Recommendation" ADD COLUMN "bundle_id" INTEGER`,
  `ALTER TABLE "WatchlistItem" ADD COLUMN "asset_class" TEXT NOT NULL DEFAULT 'stock'`,
];

async function main() {
  console.log("Pushing schema to Turso...");

  // Create tables
  for (const sql of createStatements) {
    const name = sql.match(/"(\w+)"/)?.[1];
    await client.execute(sql);
    console.log(`  ✓ ${name}`);
  }

  // Migrate existing tables (add new columns)
  for (const sql of alterStatements) {
    try {
      await client.execute(sql);
      const col = sql.match(/ADD COLUMN "(\w+)"/)?.[1];
      console.log(`  ✓ Added column: ${col}`);
    } catch (e) {
      // Column already exists — expected for fresh installs
      const col = sql.match(/ADD COLUMN "(\w+)"/)?.[1];
      console.log(`  - Column ${col} already exists`);
    }
  }

  console.log("Schema push complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
