# Changelog

## Prompt 1 — Project Scaffolding
- feat(0a): create project documentation files
- feat(0b): define content for all UI states
- feat(0c): define interaction specifications
- feat(1a): initialize project with strict typescript and pinned dependencies
- feat(1b): folder structure with placeholders and absolute imports
- feat(1c): complete tailwind theme with light and dark mode
- feat(1d): typed environment configuration with validation
- feat(1e): testing infrastructure with vitest and playwright

## Prompt 2 — Database Schema
- feat(2a): organizations and users tables with RLS
- feat(2b): funds, milestones, and assessments tables
- feat(2c): risks, actions, steps, and link tables
- feat(2d): resolution tracking and audit log tables
- feat(2e): controls, policies, IR, and framework tables
- feat(2f): AI governance tables
- feat(2g): advisor requests and notifications tables
- feat(2h): complete seed data matching prototype
- feat(2i): TypeScript types and Zod validation schemas
- feat(2j): optimized database query functions

## Prompt 3 — Authentication
- feat(3a-3b): Supabase client/server/middleware helpers with auth guard
- feat(3c-3e): login, signup pages and auth layout
- feat(3f-3h): dashboard auth guard, callback route, useUser hook

## Prompt 4 — UI Components & Screens
- feat(4a-4b): shared UI components and format utilities
- feat(4c): dashboard shell with TopBar, BottomNav, safe-area support
- feat(4d): Home screen with KPI tiles, score ring, frameworks
- feat(4e): Risk Scenarios screen with expandable cards
- feat(4f): Recommended Actions with step tracking and resolve
- feat(4g): AI Posture screen with frameworks, tools, use cases
- feat(4h): Funds screen with milestones and lifecycle
- fix(4i): auth pages use correct Tailwind design tokens

## Prompt 5 — API Routes, Chat & Hooks
- feat(5a): Anthropic client and chat API with Zod validation
- feat(5b-5d): advisor, export, and webhook API routes
- feat(5e): chat screen with streaming UI and thinking indicator
- feat(5f): useResolution, useAdvisor, useNavSource hooks
- feat(5g): score, color, content utilities with unit tests
