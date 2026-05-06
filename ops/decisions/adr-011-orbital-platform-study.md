---
title: "ADR-011: Orbital industrial spaceport as second study domain"
status: Accepted
date: 2026-05-06
---

# ADR-011: Orbital Industrial Spaceport as the second study domain

## Status

Accepted

## Context

The lunar humanoid pathfinder (v0.1, archived) was the first study. The analytical infrastructure proved the concept. The next study should: (a) exercise the base/overlay split with a genuinely different domain, (b) test whether the agent methodology generalizes, (c) produce study content that is commercially relevant to the program.

Three candidates were considered:
1. **Orbital industrial spaceport** — kilometer-scale platform in LEO; ISS heritage; latency regime is Tier 1 (real-time teleoperation); commercial case driven by launch cost reduction
2. **Mars surface base** — next step in the human exploration sequence; similar to lunar study but 3–20 min one-way latency; very long mission duration
3. **Lunar Gateway** — cis-lunar staging platform; smaller scale; government-program focus

## Decision

Orbital industrial spaceport. Designated study ID: `01-orbital-platform`.

**Rationale:**
1. The latency difference from the lunar study is architecturally significant: LEO is Tier 1 (telepresence), lunar is Tier 2 (supervised autonomy). The base agents must handle both correctly; this validates the base/overlay split on a hard case.
2. The commercial case is materially different (revenue model, not cost-only) — exercises cost-program agent in a different mode.
3. ISS heritage is richer and better-documented than lunar heritage for a system-architecture concept study.
4. The "airport in LEO" concept is commercially relevant to the program's near-term investment thesis.

**What was not selected and why:**
- Mars surface: too similar to lunar study in operational structure; latency difference is degree, not kind; far-future timeline reduces commercial relevance
- Lunar Gateway: smaller scale; less distinctive from ISS heritage; government-program structure limits commercial case exploration

## Visual identity

Matte black anodized aluminum, copper accent line. Sugimoto-meets-Ive. Industrial precision, no ornament. Applied to all visualization-agent chart outputs for this study.

## Consequences

15 orbital-platform overlays created in `system/agents/domain/orbital-platform/`. Cycle 1 complete. Study config at `studies/active/01-orbital-platform/study-config.yaml`.
