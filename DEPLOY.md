# AlphaEdge — Deployment Guide

## Prerequisites

- [Vercel account](https://vercel.com)
- [Turso account](https://turso.tech) (free tier works)
- [Anthropic API key](https://console.anthropic.com)
- [Finnhub API key](https://finnhub.io) (free tier works)

## Step 1: Create Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create alphaedge

# Get connection URL
turso db show alphaedge --url
# → libsql://alphaedge-<your-username>.turso.io

# Create auth token
turso db tokens create alphaedge
# → Save this token
```

## Step 2: Push Schema to Turso

```bash
# Set environment variables locally
export TURSO_DATABASE_URL="libsql://alphaedge-<your-username>.turso.io"
export TURSO_AUTH_TOKEN="<your-token>"

# Push schema to production database
npm run db:push
```

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository (`mhbealey/hello-world`)
3. Select the `claude/general-session-5yXwo` branch
4. Set **Framework Preset** to `Next.js`
5. Add these **Environment Variables**:

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (from Anthropic Console) |
| `TURSO_DATABASE_URL` | `libsql://alphaedge-<username>.turso.io` |
| `TURSO_AUTH_TOKEN` | Token from Step 1 |
| `FINNHUB_API_KEY` | Your Finnhub API key |

6. Click **Deploy**

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Step 4: Verify Deployment

1. Open your Vercel URL
2. You should see the onboarding flow
3. Complete onboarding (select style, risk, instruments, balance)
4. The home screen should load with "Refresh Recommendations" button
5. Click refresh to trigger first Claude API call

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for AI analysis |
| `TURSO_DATABASE_URL` | Yes | Turso database connection URL |
| `TURSO_AUTH_TOKEN` | Yes | Turso authentication token |
| `FINNHUB_API_KEY` | No | Finnhub API for real-time quotes (falls back to Yahoo Finance) |

## Build Command

Vercel auto-detects Next.js. The build command is:

```
prisma generate && next build
```

This is already configured in `package.json` — no custom build command needed.

## Troubleshooting

**Build fails with "Cannot find module prisma"**
- Ensure `prisma` is in `devDependencies` (it is)
- The `postinstall` script runs `prisma generate` automatically

**Database connection errors**
- Verify `TURSO_DATABASE_URL` starts with `libsql://`
- Verify `TURSO_AUTH_TOKEN` is set
- Run `npm run db:push` to create tables

**API routes return 500**
- Check Vercel function logs for detailed errors
- Ensure all env vars are set in Vercel dashboard
- The app gracefully handles missing API keys with fallback data

## Cost Estimates

- **Vercel**: Free tier (hobby) supports this app
- **Turso**: Free tier (500 databases, 9GB storage)
- **Anthropic**: ~$0.02/recommendation refresh. Default cap: 20 calls/day (~$0.40/day max)
- **Finnhub**: Free tier (60 API calls/minute)

## PWA Installation

After deploying, users can install AlphaEdge as a PWA:
- **iOS**: Safari → Share → "Add to Home Screen"
- **Android**: Chrome → Menu → "Install App"
- **Desktop**: Chrome address bar install icon
