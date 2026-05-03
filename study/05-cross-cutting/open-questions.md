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
- [compute/radiation] Tier 2 (commercial AI accelerator) single-event latchup rate under actual lunar far side radiation environment — parametrically estimated at 1–10 events/day without shielding based on Perseverance data; spot shielding assumed to reduce rate by 2–3 orders of magnitude, but this has not been validated for Jetson AGX Orin-class silicon geometry — space-environments with technology-roadmap-trl — must be characterized before first article compute architecture is finalized; target by 2029 gate
- [compute/TRL] No radiation-hardened AI inference processor equivalent to commercial AI accelerators exists at TRL > 4 — DARPA HPSC and similar programs are working toward this gap; if a rad-hard AI accelerator at TRL 6 emerges before 2029, the two-tier watchdog architecture can be simplified; if not, watchdog architecture persists through 2035 deployment — technology-roadmap-trl — monitor through 2029 gate; decision point at PDR
- [sensing/illumination] HDR camera performance in outdoor lunar illumination — extreme contrast (full sun to total shadow within single camera FOV), no heritage test data for humanoid stereo vision under representative lunar photometric conditions; structured-light depth disabled in direct sun — space-environments with robotics-sensing-autonomy — required for locomotion stack validation; must reach TRL 5 by 2029 gate
- [sensing/tactile] Flexible tactile sensor substrate qualification for vacuum and thermal cycling — current commercial tactile arrays (SynTouch BioTac-class, Xela Robotics) are at TRL 4–5 terrestrially; flexible PCB and elastomeric substrate materials are not characterized for lunar thermal extremes; this gap directly affects manipulation safety margin (without tactile feedback, robot cannot detect inadvertent contact with crew limbs) — space-environments — must reach TRL 5 by 2029 gate
- [autonomy/locomotion] Bipedal locomotion controller validation in 1/6 g with lunar regolith simulant — reactive layer TRL in space-relevant environment is 3–4; no hardware test has been performed in representative gravity + dust conditions; parabolic flight or gravity offload facility testing required to advance to TRL 5–6; this is on the critical path for the 2029 autonomy gate — technology-roadmap-trl with robotics-sensing-autonomy — define test campaign by 2028 for data ahead of 2029 gate
- [autonomy/OOD] Foundation model generalization to lunar-analog task environments — no lunar-surface training dataset exists for VLA fine-tuning; construction of a demonstration dataset using lunar-analog hardware is a pre-requisite for validating deliberative layer TRL advancement toward the 2035 gate; program must initiate this dataset construction no later than 2028 to enable hardware-in-the-loop validation before first article availability — autonomy-trl-tasking with conops-integrator — dataset construction program should be defined at PDR
- [latency/supervision] Minimum relay latency achievable on lunar far side relay architecture for supervisory control interactions — the autonomy/teleoperation boundary in Section 01-04 depends on this value; Section 02-02 (teleoperation-latency agent) must quantify whether crew-habitat-to-robot supervisory interactions are near-real-time and whether ground supervisory control is feasible within relay latency — teleoperation-latency — required input to human-factors-teaming and conops-integrator before Section 02 is baselined
