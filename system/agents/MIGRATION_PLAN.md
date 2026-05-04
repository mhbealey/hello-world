---
title: "Agent Base/Overlay Migration Plan"
status: in-progress
last-updated: 2026-05-04
---

# Agent Base/Overlay Migration Plan

This document identifies which content in `system/agents/base/` is domain-specific (lunar humanoid pathfinder heritage) and should be split into `system/agents/domain/lunar-surface/` overlays.

## Scope

The base agents should be **domain-agnostic**: applicable to any space study (lunar humanoid, orbital platform, deep space transit). Domain-specific priors, paths, and numerical targets go in overlays.

## Inventory

### Priority 1 — Significant domain coupling (must split before next non-lunar study)

**`cad-generation-agent.md`** — 15 domain hits
- Hard-coded paths: `study/01-optimal-space-humanoid/`, `cad/humanoid_model.py`
- Hard-coded geometry: "75 kg class, bipedal, 1.5–1.9 m tall", "Apollo Moon boot heritage"
- Hard-coded aesthetic: "NASA/space-mission, white-and-grey panels"
- Action: Strip to generic "read visual_specs.yaml, run pipeline" base; move all geometry/aesthetic specifics to `domain/lunar-surface/cad-generation-agent.md`

**`space-environments.md`** — 8 domain hits
- "Lunar dust is the primary design driver" — stated as universal truth
- "Lunar night is the thermal forcing function" — lunar-specific
- "Far side note" — study-specific
- Hard-coded artifact path: `study/01-optimal-space-humanoid/05-environments-hardening.md`
- Action: Rewrite base to generic "identify environmental drivers, set requirements". Move lunar-specific priorities to overlay.

**`humanoid-systems-architect.md`** — 8 domain hits
- "integrator for Question (a)" — study-specific framing
- Direct references to humanoid mass/power budget specifics
- Action: Generalize framing; move numerical targets to overlay.

### Priority 2 — Moderate domain coupling (acceptable for v1.0, split before v2.0)

**`destinations-trajectories.md`** — 6 domain hits
- References specific lunar destinations and trajectory assumptions
- Action: Generic base; lunar destination sequence → overlay.

**`conops-integrator.md`** — 5 domain hits
- References "launch through surface ops through return" — lunar-specific sequence
- Action: Generic lifecycle framing in base; specific phases → overlay.

**`heritage-research-agent.md`** — 5 domain hits
- Framing assumes space robotics / Soviet program heritage
- Action: Keep general heritage methodology in base; specific heritage threads (Soviet lunar program) → overlay.

**`robotics-sensing-autonomy.md`** — 5 domain hits
- Sensor requirements tuned to lunar surface (dust, lighting, no GPS)
- Action: Generic sensor architecture in base; lunar constraints → overlay.

**`robotics-actuation-structures.md`** — 5 domain hits
- Joint sealing requirements reference lunar dust specifically
- Action: Generic actuator architecture in base; dust-sealing specifics → overlay.

### Priority 3 — Minor coupling (description-level only, low risk)

**`autonomy-trl-tasking.md`** — 4 hits (description text only)
**`fault-management-sustainment.md`** — 4 hits (description text only)
**`cost-program.md`** — 4 hits (description text only)
**`human-factors-teaming.md`** — 4 hits (description text only)
**`teleoperation-latency.md`** — 4 hits (description text only)
**`technology-roadmap-trl.md`** — 3 hits (description text only)
**`visualization-agent.md`** — 3 hits (description text only)
**`executive-summary-agent.md`** — 1 hit (description only)

These use "humanoid" in the description but their prompts are generic. No split required for v1.0.

## Existing Domain Overlays

The following overlays already exist in `system/agents/domain/lunar-surface/`:
- `lunar-base-architect.md` — far-side base concept owner

Visualization overlays exist for all three domains under `visualization/aesthetic-direction.md`.

## Execution Plan

1. **Before new study init (orbital-platform or deep-space-transit)**: execute Priority 1 splits.
2. **During new-study init**: `new_study.py` will concatenate base + overlay automatically.
3. **Priority 2 splits**: execute at start of first non-lunar study cycle.
4. **Priority 3**: no action required.

## Template for a Domain Overlay

```markdown
---
name: <agent-name>
version: 1.0.0
domain: <domain-name>
last-updated: YYYY-MM-DD
---

## Domain overlay: <domain-name>

<Domain-specific priors, constraints, numerical targets, and paths.
This section is appended after the base agent content by new_study.py.>
```
