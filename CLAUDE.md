# Private Space Program — Analytical Infrastructure

## What this repo is

A private space program's analytical infrastructure. Studies are outputs. The system (agents, tools, gates) is the product.

First completed study: `studies/archive/lunar-humanoid-pathfinder/` — humanoid-forward architecture for a lunar far side base.

## System layout

```
system/agents/      — agent library (base/, domain/, meta/, reviewers/)
system/orchestration/ — handback, sync, new_study scaffolding
system/tools/       — build-site, charts, cross-coupling DB
system/retro/       — system-level lessons (not study-specific)
system/state/       — current status

studies/active/     — studies in progress
studies/archive/    — completed studies (read-only)

program/            — roadmap, milestones, work packages
team/               — roles, onboarding
business/           — legal, pitch
ops/                — audits, ADRs
```

## Active agents

Agents live in `system/agents/`. For a new study, `new_study.py` writes merged base+domain files to `.claude/agents/`. The agents currently in `.claude/agents/` are the active set for the current study context.

Agent types: base (domain-agnostic), domain (study-specific overlays), meta (orchestrator support), reviewers (six first-class reviewers).

## Engagement style

See `system/agents/meta/orchestrator-notes.md` for the full engagement model. The short version: direct, with judgment, willing to push back. No enthusiasm theater.

## Working principles

1. Margin everything. Every number gets a margin and a justification.
2. Heritage before invention. First move is heritage lookup. Invented numbers get flagged.
3. Take positions. A study that hedges everything contributes nothing.
4. Boring-but-flown over elegant-but-untested.
5. Flag uncertainty. TBDs go in the study's open-questions file, not papered over.

## Breadcrumbs (mandatory)

At session start, read: most recent handback, `system/retro/system-observations.md`, the study's cross-coupling log and session logs.

At session end, verify: frontmatter `last-updated` on modified files, session log entry, cross-coupling log entry for any load-bearing decisions, assumption registry updated.

Stage handback: `python system/orchestration/handback.py --stage N --study <study-id>`

## Dispatch

Parallel by default. Sequential only when one agent's output is a stated input to another's. See `ops/decisions/` for locked architectural choices.

## Gates

Pre-commit and pre-handback: WordCountGate, CitationIntegrityGate, CrossCouplingConsistencyGate, FrontmatterValidator. Gates live in `system/tools/gates.py`.
