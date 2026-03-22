import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inline server-side env vars at build time so they're available
  // in Vercel's serverless runtime (which doesn't deploy .env files)
  env: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
    ANTHROPIC_KEY_REV: process.env.ANTHROPIC_KEY_REV,
  },
};

export default nextConfig;
