---
title: Hosting & Deployment Strategy — Private Space Program Analytical Infrastructure
author: Leke (Dev)
date: 2026-05-06
status: recommendation-pending-approval
---

# Hosting & Deployment Strategy

## Executive Summary

This system is not a web application. It is a Python-based AI orchestration pipeline that runs locally via Claude Code, produces structured YAML/Markdown outputs, and publishes a static HTML study site. The hosting strategy therefore has two distinct components:

1. **Orchestration runtime** — stays local (Claude Code on operator machine). No server needed.
2. **Study site publishing** — static HTML output deployed to a CDN. Recommend Vercel (already configured and live).

Total additional monthly hosting cost to reach production-ready state: **$0–$20/month**.

---

## What the system actually runs on

Before recommending hosting, it is worth being precise about what needs to run where.

**What runs locally (Claude Code on operator machine):**
- All agent orchestration — `system/orchestration/dispatch.py`, `handback.py`, `new_study.py`
- All gate enforcement — `system/tools/gates.py`
- All Python tooling — cross-coupling DB, assumption registry, site builder
- The Anthropic API calls (via `ANTHROPIC_API_KEY`)

**What produces a deployable artifact:**
- `system/tools/build_site.py` renders study markdown → static HTML site
- Output goes to `studies/archive/<study-id>/site/`
- This is what external audiences see

**What is already deployed:**
- The repo's About section shows `hello-world-gilt-ten.vercel.app` — Vercel is already wired up and producing preview deployments (311 deployments visible in the GitHub screenshots)

**What is in `.env.example` but not currently used by the orchestration system:**
- `FINNHUB_API_KEY` and `TURSO_DATABASE_URL` — these are AlphaEdge trading app remnants that were deleted in the v1.0 restructure. They are not needed and should be removed from `.env.example` to avoid confusion.

---

## Recommendation: Three-tier hosting architecture

### Tier 1 — Orchestration Runtime: Local / Claude Code (no change)
**Cost: $0**

The orchestration system runs inside Claude Code sessions on the operator's machine. This is the correct architecture — it is not a service, it is a tool. Running it on a server would add complexity, latency, and cost with no benefit. The Anthropic API is the only external dependency and it is already handled by Claude Code's runtime.

**No action needed here.** The system is correctly designed for local execution.

---

### Tier 2 — Study Site: Vercel (already live, needs configuration)
**Cost: $0 on Hobby plan, $20/month on Pro if custom domain + team features needed**

Vercel is already connected to the repo and producing deployments. The static site output from `build_site.py` is exactly what Vercel is designed to serve — no server, no database, instant global CDN.

**What needs to be done:**

1. **Configure the build output path.** Vercel currently deploys from the repo root. It should be pointed at `studies/archive/lunar-humanoid-pathfinder/site/` for the current study, and updated to `studies/archive/01-orbital-platform/site/` when the spaceport study completes.

2. **Add a custom domain** (optional, ~$10-15/year for domain registration). For the demonstration event Michael described, having a clean URL (`studies.spaceprogramname.com`) is more professional than `hello-world-gilt-ten.vercel.app`.

3. **Set up production vs preview environments.** Vercel already creates preview deployments on every push. The production deployment should be locked to the `main` branch only — no study content should go live until it passes all gates and is merged.

**Vercel configuration file needed** (`vercel.json` in repo root):
```json
{
  "outputDirectory": "studies/archive/lunar-humanoid-pathfinder/site",
  "buildCommand": "python system/tools/build_site.py --study lunar-humanoid-pathfinder",
  "installCommand": "pip install -e .",
  "framework": null
}
```

This replaces the current default Vercel configuration and ensures the correct study site is served.

---

### Tier 3 — CI/CD: GitHub Actions (already configured, needs one fix)
**Cost: $0 (free tier covers this workload)**

The `.github/workflows/ci.yaml` is already set up with three jobs: Tests, Schema Validation, and Lint. These run on every push and pull request.

**One fix needed:** The schema validation job currently fails on the pre-existing `assumption_registry.yaml` error in the archived study. This causes every CI run to show a red check. Two options:

Option A — Fix the archived file (add an empty `entries: []` field to `assumption_registry.yaml`). Clean solution, one line change.

Option B — Add `--exclude studies/archive/` flag to the validate command. Keeps archived content truly read-only.

Recommend **Option A** — it fixes a real schema error and keeps the validator clean.

---

## What is not needed

**No VPS/cloud server** (AWS EC2, DigitalOcean, etc.) — the orchestration system runs locally. A server adds cost and complexity with no benefit for this architecture.

**No database hosting** (PlanetScale, Supabase, etc.) — the cross-coupling DB and assumption registry are YAML files in the repo. This is the correct choice per ADR-003 (YAML over SQLite). No external database needed.

**No container orchestration** (Docker, Kubernetes) — premature for this stage. The system is a Python CLI tool, not a microservice.

**No separate API hosting** — there is no API surface in this system. Agents communicate via files, not HTTP.

---

## Cost summary

| Component | Current State | Recommended State | Monthly Cost |
|-----------|--------------|-------------------|-------------|
| Orchestration runtime | Local / Claude Code | No change | $0 |
| Study site | Vercel (live, misconfigured) | Vercel (configured correctly) | $0–$20 |
| CI/CD | GitHub Actions (running) | GitHub Actions (one fix) | $0 |
| Domain (optional) | None | Custom domain for demo event | ~$1/month |
| **Total** | | | **$0–$21/month** |

The Anthropic API cost for running study cycles is separate and depends on usage — approximately $5–15 per full study cycle based on the lunar pathfinder usage pattern.

---

## Immediate action items (in priority order)

1. **Fix `assumption_registry.yaml`** — add `entries: []` to clear the CI red check. One line, five minutes.
2. **Add `vercel.json`** — point Vercel at the correct study site output directory.
3. **Remove AlphaEdge keys from `.env.example`** — `FINNHUB_API_KEY` and `TURSO_DATABASE_URL` are dead remnants. Remove to avoid confusion for future operators.
4. **Custom domain** — defer until demonstration event timeline is confirmed. Not needed for development cycles.

---

## Notes for the demonstration event

Michael described a demonstration event for 8–15 senior aerospace and finance people using the Looking Glass holographic display and the executive summary. For that event, the study site needs to be:

- Publicly accessible at a clean URL (custom domain recommended)
- Serving the completed spaceport study, not the lunar pathfinder
- Fast and reliable (Vercel CDN handles this automatically)

No additional infrastructure is needed beyond what is described above. The static site Vercel serves will handle any realistic traffic from a small private event without issue.

---

*Recommendation ready for founder approval. Awaiting go-ahead to implement Vercel configuration and CI fix.*
