---
title: "ADR-012: Rename humanoid-systems-architect to integrator-systems-architect"
status: Accepted
date: 2026-05-06
---

# ADR-012: Rename humanoid-systems-architect → integrator-systems-architect

## Status

Accepted

## Context

The base agent previously named `humanoid-systems-architect.md` was written specifically for bipedal humanoid robotics in the lunar pathfinder study. Its name, scope statement, and most of its body content were domain-specific.

With the base/overlay split (ADR-007), this agent's base file must be domain-neutral. A base agent named "humanoid-systems-architect" cannot credibly serve as the platform architect for an orbital spaceport.

## Decision

Rename to `integrator-systems-architect.md`. Rewrite the base file to be domain-neutral: it owns "top-level configuration of the primary platform under study — form factor, mass and power budget, subsystem integration" without specifying what the platform is.

Domain-specific content (bipedal humanoid, 75 kg design-to, Valkyrie/Atlas heritage, 38 DOF) moves to `system/agents/domain/lunar-surface/integrator-systems-architect.md`.

**Impact on tests:** `test_list_agents_returns_non_empty` references `integrator-systems-architect` by new name. Verified passing.

## Consequences

**Positive:**
- Agent library correctly reflects domain-neutral methodology
- Orbital-platform overlay can describe a 500 t space station without inheriting humanoid constraints
- Naming convention now consistent: all base agent names describe the analytical function, not the study subject

**Negative:**
- One-time breaking change: any external reference to `humanoid-systems-architect` is broken
- `humanoid-systems-architect.md` must be deleted from the repository (pending push fix)

## Migration

`system/agents/base/humanoid-systems-architect.md` → deleted (file replaced by `integrator-systems-architect.md`). Old file must be removed via `mcp__github__delete_file` or manual deletion once push access is restored.
