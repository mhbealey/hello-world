# Project Context

**Project:** PE Cybersecurity Governance Platform
**Stack:** Next.js 14 + TypeScript (strict) + Tailwind CSS + shadcn/ui + Supabase
**Deployment:** Vercel
**Status:** Prompt 1 complete — Project scaffolded

## Conventions Established

- Absolute imports via `@/*` path alias
- CSS variables for theming (light/dark mode via `.dark` class)
- Tailwind extended with custom design tokens (colors, radius, shadows, animations)
- System fonts with DM Sans / JetBrains Mono as primaries (Google Fonts loaded via CDN in production)
- Environment validation via Zod (`lib/config.ts`)
- Vitest for unit tests, Playwright for E2E
- `npm run smoke` = typecheck + lint + build

## What Has Been Built

### Prompt 0: Project Foundation
- CONTEXT.md, CHANGELOG.md, docs/ (design-tokens, content, interactions, prototype)

### Prompt 1: Project Scaffolding
- Next.js 14 with App Router, TypeScript strict mode
- All route placeholders: auth (login, signup), dashboard (home, risk, actions, ai, funds, chat), API routes (chat, advisor, export, webhooks, health)
- Component directories: ui, shared, screens, layouts
- Lib directories: supabase, api, utils, hooks
- Tailwind theme with full light/dark mode color system
- Environment config with Zod validation
- Vitest + Playwright testing infrastructure

## File Structure

```
app/(auth)/login/page.tsx
app/(auth)/signup/page.tsx
app/(auth)/layout.tsx
app/(dashboard)/home/page.tsx
app/(dashboard)/risk/page.tsx
app/(dashboard)/actions/page.tsx
app/(dashboard)/ai/page.tsx
app/(dashboard)/funds/page.tsx
app/(dashboard)/chat/page.tsx
app/(dashboard)/layout.tsx
app/api/chat/route.ts
app/api/advisor/route.ts
app/api/export/route.ts
app/api/webhooks/route.ts
app/api/health/route.ts
components/ui/index.ts
components/shared/index.ts
components/screens/index.ts
components/layouts/index.ts
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/middleware.ts
lib/api/anthropic.ts
lib/utils/format.ts
lib/utils/score.ts
lib/utils/color.ts
lib/utils/content.ts
lib/hooks/useResolution.ts
lib/hooks/useNavSource.ts
lib/hooks/useAdvisor.ts
lib/hooks/useToast.ts
lib/config.ts
types/index.ts
dev/components/page.tsx
docs/content.md
docs/design-tokens.md
docs/interactions.md
docs/prototype.jsx
```
