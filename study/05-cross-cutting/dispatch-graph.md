---
title: Dispatch Dependency Graph
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Dispatch Dependency Graph

Which agents depend on which others' outputs. Used by the orchestrator to plan parallel dispatch. Update this file when new dependency relationships are identified.

## Question (a) — Optimal Space Humanoid

**Parallel-safe (no inter-dependencies, can run simultaneously):**
- `robotics-actuation-structures` (03-actuation-structures.md)
- `robotics-sensing-autonomy` (04-sensing-autonomy.md)
- `space-environments` (05-environments-hardening.md)
- `soviet-russian-heritage` (consultant, no owned section in §01)

**Sequential after those three:**
- `humanoid-systems-architect` (06-mass-power-budget.md) — integrates outputs from actuation, sensing, and environments into the mass/power closure

## Question (b) — Human-in-the-Loop Value

**Parallel-safe:**
- `teleoperation-latency` (02-latency-tradespace.md) — latency curves are independent of teaming model
- `autonomy-trl-tasking` (03-autonomy-trl-tasking.md) — TRL analysis is independent of teaming model

**Sequential after those two:**
- `human-factors-teaming` (01-overview.md, 04-teaming-model.md) — integrator; depends on latency numbers from teleoperation-latency and TRL positions from autonomy-trl-tasking

## Question (c) — Workflow / ConOps

**Sequential (depends on all of Question (a) and (b)):**
- `conops-integrator` (01-overview.md, 02-mission-timeline.md) — timeline depends on humanoid capability profile from (a) and teaming model from (b)
- `fault-management-sustainment` (03-fault-sustainment.md) — depends on ConOps baseline from conops-integrator

## Question (d) — Build and Deploy

**Parallel-safe:**
- `destinations-trajectories` (02-destinations.md) — trajectory analysis and lander manifest; depends on humanoid mass from (a) but not on (b) or (c)
- `far-side-base-architect` (03-far-side-testbed.md) — base architecture; depends on humanoid profile from (a) and power budget

**Sequential after those two:**
- `technology-roadmap-trl` (01-technology-roadmap.md) — roadmap depends on TRL gaps identified across all prior sections
- `cost-program` (04-cost-program.md) — depends on everything: humanoid mass/power, destinations manifest, base architecture, roadmap

## Reviewers

All six reviewers (`aerospace-engineer`, `heritage-citations`, `reliability-margins`, `scope-discipline`, `cross-coupling`, `devils-advocate`) run in **parallel** on any draft-complete section. Reviews are independent — no inter-reviewer dependencies.

## Cross-cutting agents

- `soviet-russian-heritage` — parallel consultant for any section; no owned sections in Questions (a)-(d)
- `visualization-agent` — parallel-safe at any time; reads section files, produces PNGs
- `executive-summary-agent` — parallel-safe after any major content update
- `meta-supervisor` — runs at end of each work session; reads but does not write study content
