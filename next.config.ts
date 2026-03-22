import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Forward server-side env vars from build time into the runtime bundle.
  // On Vercel, .env.production is loaded at build time but NOT deployed to
  // serverless functions. This config inlines the values so they're available
  // at runtime via process.env.
  env: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_KEY_REV: process.env.ANTHROPIC_KEY_REV,
    FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
    FRED_API_KEY: process.env.FRED_API_KEY,
  },
};

export default nextConfig;
