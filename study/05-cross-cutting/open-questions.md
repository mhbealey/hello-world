---
title: Open Questions
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Open Questions

This file tracks open questions across the study. Each agent appends questions in their domain that need resolution. The orchestrator reviews and prioritizes.

## Format convention

Each entry goes under `## Active Open Questions` using this format:

```
- [domain] question — context — who needs to resolve — by when
```

The `domain` tag must be a real domain label (e.g. `autonomy`, `power`, `form factor`). Do not use `domain` as the literal domain tag — that's a placeholder. Entries with `domain` as the literal tag are treated as format documentation, not real questions, and will be filtered from the handback.

## Active Open Questions

- [scope] Does the study cover Mars surface humanoid ops in detail or treat it as architecture-paper-fidelity extension? — Affects scope of conops-integrator and destinations-trajectories — orchestrator — early
- [autonomy] What's the autonomy TRL we assume by 2035 deployment? — Drives the entire teaming model — autonomy-trl-tasking with human-factors-teaming — early
- [power] Fission surface power as baseline, or hedge? — Drives space-environments and conops-integrator — far-side-base-architect with cost-program — early
- [form factor] Do we commit to humanoid bipedal, or hedge to centaur/modular? — Drives all of section 01 — humanoid-systems-architect — after first heritage pass
- [ISRU] Does the study assume ISRU works, or design for full Earth-supply? — Drives sustainment and cost — far-side-base-architect with cost-program — mid
- [framing] How do we handle the "manned mission with no humans" rhetorical question? — Affects abstract and why-this-why-now — orchestrator — late
- [actuation/thermal] Harmonic drive flexspline fatigue life at cryogenic temperatures (−180°C) under representative cyclic joint loads — no published heritage data; TRL gap in HD-Electric architecture; if validation fails by 2029 gate, fallback is selective SEA with mass budget renegotiation — technology-roadmap-trl with space-environments — must close before 2029 program gate
- [sealing/dust] Perfluoroelastomer (FFKM) lip seal performance at −180°C under vacuum and cyclic load — standard FFKM qualified to −60°C only; cryogenic extension is a development item at TRL 3–4; fallback is all-labyrinth sealing with reduced particle rejection — space-environments — must reach TRL 5 by 2029 gate
- [actuation/power] Per-joint peak power draw validation against 800 W system peak — 38 HD-Electric joints simultaneously at full effort exceeds 800 W; task-level simulation needed to validate that simultaneous full-effort loading does not occur in operational profiles — humanoid-systems-architect (mass-power budget section) — before Section 01-06 is baselined
- [serviceability/dust] Boot cover replacement interval: 500-hour figure is parametric with no heritage — accelerated abrasion testing in lunar regolith simulant (JSC-1A or NU-LHT-2M) under vacuum and thermal cycling required; no identified test facility combines all three conditions — space-environments and far-side-base-architect (consumables manifest) — pre-PDR
