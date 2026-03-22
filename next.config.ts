import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel injects env vars from project settings into process.env at both
  // build time and runtime. This explicit `env` block ensures they're also
  // available in the client-side bundle (for any that need it) and provides
  // a clear manifest of which env vars the app depends on.
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
