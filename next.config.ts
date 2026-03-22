import type { NextConfig } from "next";

// Explicitly pass server-side env vars so they survive into Vercel serverless
// function runtime. Next.js 16 loads .env.production at build time but these
// values are NOT automatically available at runtime in serverless functions.
// The `env` config inlines them via DefinePlugin during `next build`.
// These vars are only referenced in server-side code (API routes / lib/)
// so they will not appear in client bundles.
const nextConfig: NextConfig = {
  env: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL || "",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN || "",
    ANTHROPIC_KEY_REV: process.env.ANTHROPIC_KEY_REV || "",
    FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || "",
  },
};

export default nextConfig;
