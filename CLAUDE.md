# Private Space Program — Analytical Infrastructure

## What this repo is

A private space program's analytical infrastructure. Studies are outputs. The system (agents, tools, gates) is the product.

Completed study: `studies/archive/lunar-humanoid-pathfinder/` — humanoid-forward architecture for a lunar far side base.
Active study: `studies/active/01-orbital-platform/` — kilometer-scale orbital industrial spaceport.

## System layout

```
system/agents/base/       — domain-neutral agent library (14 agents)
system/agents/domain/     — study-specific overlays (lunar-surface/, orbital-platform/)
system/agents/meta/       — orchestrator support agents
system/agents/reviewers/  — six first-class reviewers
system/agents/compose.py  — merge base + overlay at dispatch time
system/orchestration/     — handback, new_study, sync, schemas
system/tools/             — cross_coupling_db, assumption_registry, render tools, gates
system/state/             — system-wide state (cross_coupling.yaml)

studies/active/           — studies in progress
studies/archive/          — completed studies (read-only)

program/                  — roadmap, milestones, work packages
ops/decisions/            — architecture decision records (ADRs)
ops/handoff/              — handoff packages
```

## Agent system

**Base agents** (`system/agents/base/`) are domain-neutral: teleoperation-latency, integrator-systems-architect, conops-integrator, autonomy-trl-tasking, cost-program, destinations-trajectories, fault-management-sustainment, heritage-research-agent, human-factors-teaming, robotics-actuation-structures, robotics-sensing-autonomy, space-environments, technology-roadmap-trl, visualization-agent.

**Domain overlays** (`system/agents/domain/<domain>/`) add study-specific data, heritage anchors, and locked decisions on top of the base. Overlay frontmatter is stripped at compose time; only the overlay body is appended.

**Compose:** `python -m system.agents.compose <agent> <domain>` — merges base + overlay. `compose_for_domain()` in Python. Agents dispatched without compose receive the base-only prompt.

## Active study: 01-orbital-platform

Cycle 1 complete. Four decisions locked in `studies/active/01-orbital-platform/cross_coupling.yaml`:
- `structural_concept` = modular-truss-and-node
- `target_altitude_km` = 400
- `phase1_mass_t` = 500
- `primary_power_kw` = 500

**Cycle 2 requires founder decisions on:** orbital inclination, interface standard strategy, primary manufacturing product. See `cycles/cycle-02/scaffold.md`.

## Session protocol

**At session start, read:**
1. `studies/active/01-orbital-platform/cycles/cycle-01/handback.md` (most recent handback)
2. `system/retro/system-observations.md`
3. `studies/active/01-orbital-platform/cross_coupling.yaml` (locked decisions)
4. `studies/active/01-orbital-platform/assumption_registry.yaml` (active assumptions)

**At session end, verify:**
1. `last-updated` in frontmatter of every modified file
2. Session log entry in `studies/active/01-orbital-platform/retro/session-logs.yaml`
3. New load-bearing decisions in `cross_coupling.yaml` via `python -m system.tools.cross_coupling_db set`
4. New/changed assumptions in `assumption_registry.yaml`

**Stage handback:** `python system/orchestration/handback.py --stage N --study 01-orbital-platform`

## Working principles

1. Margin everything. Every number gets a margin and a justification.
2. Heritage before invention. First move is heritage lookup. Invented numbers get flagged.
3. Take positions. A study that hedges everything contributes nothing.
4. Boring-but-flown over elegant-but-untested.
5. Flag uncertainty. TBDs go in open-questions files, not papered over.

## Gates

WordCountGate, CitationIntegrityGate, CrossCouplingConsistencyGate, FrontmatterValidator. See `system/tools/gates.py`.

## Dispatch

Parallel by default. Sequential only when one agent's output is a stated input to another's. See `cycles/cycle-02/scaffold.md` for the Cycle 2 dispatch plan.
