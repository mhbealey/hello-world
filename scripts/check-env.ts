/**
 * Build-time environment variable validation.
 * Runs during deployment to surface missing config in the build log.
 */
import { config } from "dotenv";
// Load .env.production first (has API keys), then .env (has local overrides)
config({ path: ".env.production" });
config({ path: ".env" });

const required: [string, string][] = [
  ["TURSO_DATABASE_URL", "Database connection — app will not function without this"],
  ["TURSO_AUTH_TOKEN", "Database auth — app will not function without this"],
];

const recommended: [string, string][] = [
  ["ANTHROPIC_API_KEY", "Claude AI — needed for recommendation generation (also accepts ANTHROPIC_KEY_REV)"],
  ["FINNHUB_API_KEY", "Finnhub market data — Yahoo Finance used as fallback"],
  ["FRED_API_KEY", "FRED macro data — macro context will be empty without this"],
];

console.log("\n=== Environment Check ===");

let hasErrors = false;

for (const [key, desc] of required) {
  if (process.env[key]) {
    console.log(`  ✓ ${key} — set`);
  } else {
    console.error(`  ✗ ${key} — MISSING — ${desc}`);
    hasErrors = true;
  }
}

for (const [key, desc] of recommended) {
  if (key === "ANTHROPIC_API_KEY") {
    if (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_KEY_REV) {
      console.log(`  ✓ ${key} — set`);
    } else {
      console.warn(`  ⚠ ${key} — MISSING — ${desc}`);
    }
  } else if (process.env[key]) {
    console.log(`  ✓ ${key} — set`);
  } else {
    console.warn(`  ⚠ ${key} — MISSING — ${desc}`);
  }
}

console.log("=========================\n");

if (hasErrors) {
  console.error("Required environment variables are missing! Build may produce a broken deployment.");
  // Don't fail the build — let it deploy so health check can report status
}
