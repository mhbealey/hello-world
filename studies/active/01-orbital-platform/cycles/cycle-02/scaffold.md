---
title: "Cycle 2 Scaffold — Orbital Industrial Spaceport"
study_id: 01-orbital-platform
cycle: 2
status: founder-approved
founder_approved: true
founder_approved_date: 2026-05-07
last-updated: 2026-05-07
---

# Cycle 2 Scaffold: Analysis Phase

## Cycle 2 Mission

Cycle 1 established the heritage baseline, locked four architectural decisions, and seeded 12 assumptions. Cycle 2 produces deep analysis for all four study questions, with agents working in parallel.

## Locked Inputs from Cycle 1

The following are locked and must not be re-opened in Cycle 2 without cross_coupling.yaml override:

| param_id | Value |
|----------|-------|
| `structural_concept` | modular-truss-and-node |
| `target_altitude_km` | 400 |
| `phase1_mass_t` | 500 |
| `primary_power_kw` | 500 |

## Open Inputs Requiring Founder Decision Before Cycle 2 Launch

1. **Inclination:** 51.6° (ISS heritage) vs. 28.5° (Cape direct). This affects: launch vehicle selection, international partnership scope, crew composition. **Decision needed before agents can set `orbital_inclination` in cross_coupling.yaml.**
2. **Truss interface standard strategy:** Proprietary (one commercial operator owns it) vs. open (industry-defined). Determines commercial partnership structure. **Decision needed before robotics-actuation-structures can finalize node design.**
3. **Primary manufacturing product line:** Determines manufacturing module design. Options: pharmaceuticals (highest commercial TRL), ZBLAN fiber optics (proven microgravity advantage), exotic alloys (high uncertainty). **Decision needed before cost-program can estimate manufacturing revenue.**

## Cycle 2 Agent Dispatch Plan

**Parallel batch (all can start simultaneously after founder decisions):**

| Agent | Output | Output path | Word budget |
|-------|--------|-------------|-------------|
| integrator-systems-architect | Architecture analysis — configuration detail, mass/power budget closure, truss node interface options | `01-question-a/architecture-analysis.md` | 3,000 |
| destinations-trajectories | Orbital mechanics detail, rendezvous corridors, launch manifest | `01-question-a/trajectories.md` | 2,000 |
| conops-integrator | Operations concept — traffic management, shift structure, docking ConOps | `02-question-b/operations-analysis.md` | 3,000 |
| teleoperation-latency | Latency analysis, comms architecture, autonomy tier confirmation | `02-question-b/comms-latency.md` | 2,000 |
| cost-program | Phased cost estimate, revenue model, commercial case | `03-question-c/economics-analysis.md` | 3,000 |
| human-factors-teaming | Crew model, supervisor ratios, commercial crew requirements | `03-question-c/crew-model.md` | 2,500 |
| technology-roadmap-trl | TRL roadmap, demonstration sequence, long-poles | `04-question-d/roadmap-analysis.md` | 3,000 |
| autonomy-trl-tasking | Autonomy capability assessment, task taxonomy, gap analysis | `04-question-d/autonomy-gaps.md` | 2,000 |

**Sequential (after parallel batch):**

| Agent | Depends on | Output | Output path |
|-------|-----------|--------|-------------|
| fault-management-sustainment | integrator-systems-architect, conops-integrator | FMEA top-20, maintenance concept | `05-cross-cutting/fault-management.md` |
| space-environments | destinations-trajectories | LEO environment analysis, design margins | `05-cross-cutting/environments.md` |
| heritage-research-agent | All parallel outputs | Heritage verification pass, citation check | `05-cross-cutting/heritage-verification.md` |

## Cycle 2 Gates

Before any agent declares completion:
1. Word count ≤ hard cap (per agent word budget above)
2. All cross-coupling references verified against current `cross_coupling.yaml`
3. All assumptions in text traceable to §A<N> in `assumption_registry.yaml`
4. Any new load-bearing decision added to `cross_coupling.yaml` via `python -m system.tools.cross_coupling_db set`
5. Session log entry appended to `retro/session-logs.yaml`

## Cycle 2 Handback Word Budget: 8,000 words

*Scaffold created: 2026-05-06 | Ready to launch after founder decisions on inclination, interface standard, manufacturing product.*
