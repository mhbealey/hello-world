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
- [x] Prompt 3: Design System & Shell
- [x] Prompt 4: Onboarding
- [x] Prompt 5: AI Recommendation Engine
- [x] Prompt 6: Home Screen & Recommendation Feed
- [x] Prompt 7: Trade Execution Wizard
- [x] Prompt 8: Portfolio Dashboard
- [x] Prompt 9: Settings Screen
- [x] Prompt 10: Alerts & Notifications
- [x] Prompt 11: Search & On-Demand Analysis
- [x] Prompt 12: Polish & Animations
- [x] Prompt 13: PWA & Offline
- [x] Prompt 14: Testing & Accessibility
- [x] Prompt 15: Deployment

## Build Log
- Prompt 0: Created CONTEXT.md, CHANGELOG.md, design-tokens.md, content.md, interactions.md
- Prompt 1: Next.js 15 project init, Tailwind v4 dark theme, project structure, env vars, content constants
- Prompt 2: Prisma 7 + libSQL adapter, all 7 models + ApiUsage, query helpers, Zod schemas, DataProvider (Yahoo+Finnhub), utilities, demo seed data
- Prompt 3: Button, Card, Badge, Toast, Modal, BottomSheet, Input, Slider, PillSelector, SearchBar, BottomTabBar, Skeleton components
- Prompt 4: 5-step onboarding flow with archetype mapping, profile API
- Prompt 5: Claude API client, prompt builder, recommendation pipeline with rate limiting, alert generation
- Prompt 6: Home screen with recommendation feed (Layer 1/2/3), alerts, filters, search
- Prompt 7: 5-step trade execution wizard with Fidelity handoff, trade/wizard APIs
- Prompt 8: Portfolio dashboard with holdings, watchlist, analytics, manual trade entry, close trade
- Prompt 9: Settings with profile, balance, colorblind toggle, API cost tracker, export/import/clear
- Prompt 10-11: Market quote API, alert system integration, search on-demand analysis
- Prompt 12: Lightweight Charts v5 portfolio chart with crosshair, CSS polish
- Prompt 13: PWA manifest, service worker (cache-first shell, network-first API), offline support
- Prompt 14: Vitest setup, 25 unit tests (format, calculations, archetype, market-hours)
- Prompt 15: Vercel deployment config, env variables documentation
