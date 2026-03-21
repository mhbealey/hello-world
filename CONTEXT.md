# AlphaEdge — Project Context

## What is this?
A personal mobile trading companion app. AI-powered stock analysis via Claude API, execution guidance for Fidelity trades, and portfolio analytics.

## Tech Stack
- Next.js 14+ (App Router)
- Tailwind CSS (dark-mode-first)
- Turso (libSQL) + Prisma
- Claude API (Sonnet) for stock analysis
- yahoo-finance2 + Finnhub for market data
- Lightweight Charts for financial charts
- Deployed on Vercel

## Current Status
- [x] Prompt 0: Documentation
- [x] Prompt 1: Project Setup
- [x] Prompt 2: Database & Data Layer
- [ ] Prompt 3: Design System & Shell
- [ ] Prompt 4: Onboarding
- [ ] Prompt 5: AI Recommendation Engine
- [ ] Prompt 6: Home Screen & Recommendation Feed
- [ ] Prompt 7: Trade Execution Wizard
- [ ] Prompt 8: Portfolio Dashboard
- [ ] Prompt 9: Settings Screen
- [ ] Prompt 10: Alerts & Notifications
- [ ] Prompt 11: Search & On-Demand Analysis
- [ ] Prompt 12: Polish & Animations
- [ ] Prompt 13: PWA & Offline
- [ ] Prompt 14: Testing & Accessibility
- [ ] Prompt 15: Deployment

## Build Log
- Prompt 0: Created CONTEXT.md, CHANGELOG.md, design-tokens.md, content.md, interactions.md
- Prompt 1: Next.js 15 project init, Tailwind v4 dark theme, project structure, env vars, content constants
- Prompt 2: Prisma 7 + libSQL adapter, all 7 models + ApiUsage, query helpers, Zod schemas, DataProvider (Yahoo+Finnhub), utilities, demo seed data
