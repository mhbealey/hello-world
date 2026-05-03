---
title: Cross-Coupling Log
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Cross-Coupling Log

This file records architectural decisions, parameter values, and positions that downstream agents depend on. When a number or position is set here, all agents listed under "Affects" must be notified and must update their artifacts if the decision changes their scope.

## Format

```
## YYYY-MM-DD — Parameter name
**Parameter:** what was decided
**Value:** the specific value, range, or position
**Set by:** which agent or process set it
**Affects:** list of agents whose work depends on this
**Basis:** why this value was chosen
```

---

## 2026-05-03 — Autonomy TRL curve

**Parameter:** Humanoid autonomy TRL trajectory (study assumption)
**Value:** TRL 6 (space-relevant environments) by ~2029 → TRL 7+ (space-relevant) by ~2035 → TRL 8 (qualified, operational environment) by ~2038-2040
**Set by:** orchestrator (resolution of stage 4 contradiction between two incompatible registry entries)
**Affects:** autonomy-trl-tasking, human-factors-teaming, conops-integrator, technology-roadmap-trl, cost-program, far-side-base-architect (deployment timeline)
**Basis:** Study assumption with explicit go/no-go gates at each milestone. Not a forecast. See §A1 in `study/05-cross-cutting/margins-and-assumptions.md` for full text. If the 2029 gate is missed, the deployment timeline slips proportionally; if the 2035 gate is missed, the teaming model defaults to higher human-in-the-loop ratios.
