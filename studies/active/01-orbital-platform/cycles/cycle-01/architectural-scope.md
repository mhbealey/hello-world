---
title: "Architectural Scope — Orbital Industrial Spaceport, Cycle 1"
study_id: 01-orbital-platform
cycle: 1
agent: integrator-systems-architect
status: draft
last-updated: 2026-05-06
word_count: ~950
---

# Architectural Scope: Orbital Industrial Spaceport

## Study Definition

This study asks: what is the viable architecture for a kilometer-scale orbital industrial spaceport in LEO? "Viable" means technically feasible with near-term technology, commercially funded, and operationally sustainable at industrial throughput.

**What it is:**
- A permanent orbital platform at ~400 km altitude (§A2, locked)
- Designed for industrial operations: propellant logistics, in-space manufacturing, crew transit
- Commercial ownership and operation; government as anchor customer
- Kilometer-scale structure: 1 km longest dimension at full build-out

**What it is not:**
- A science station (ISS is the precedent for that)
- A tourism hotel (different design requirements)
- A lunar or deep-space platform (different transportation and latency regime)
- A government program (economics must work commercially)

---

## Locked Architectural Decisions (Cycle 1)

The following decisions are locked in `cross_coupling.yaml` and are not to be revisited without explicit cross-coupling DB override and justification:

| Parameter | Value | Justification |
|-----------|-------|--------------|
| `structural_concept` | modular-truss-and-node | ISS flight heritage; incremental funding; TRL 9 |
| `target_altitude_km` | 400 | ISS heritage orbit; launcher accessibility |
| `phase1_mass_t` | 500 | ISS baseline + 20% for industrial function |
| `primary_power_kw` | 500 | ISS ×2–3 for industrial loads |

---

## Configuration Tradespace (Cycle 1 Summary)

Four configurations were evaluated:

**1. Modular truss-and-node (selected)**
- ISS-heritage truss backbone with node attachments at intervals
- Modules plug into nodes: habitation, manufacturing, docking, power
- Advantage: incremental funding; proven assembly techniques; expandable
- Risk: thermal management along truss at kilometer scale; stiffness for large manipulators
- **Selected.** Justification in `cross_coupling.yaml structural_concept`.

**2. Distributed constellation**
- Multiple free-flying platforms in proximity formation, tethered or formation-flying
- Advantage: no single-point structural failure; each platform independently operable
- Risk: traffic complexity at rendezvous zone; relative navigation load at scale; no heritage at this proximity distance
- **Rejected.** Traffic management complexity is the primary gap to solve, not amplify.

**3. Monolithic hub-and-spoke**
- Large central pressurized hub, radial arms extending to industrial modules
- Advantage: short internal transit times; centralized life support
- Risk: launch manifest dependency (must launch large hub first); single launch failure blocks entire program
- **Deferred.** May be revisited for Phase 2 hub design within the truss architecture.

**4. Tether-linked clusters**
- Multiple modules linked by tethers; gravity gradient provides passive attitude stability
- Advantage: reduced attitude control propellant; modular separation possible
- Risk: tether dynamics at kilometer scale unvalidated; debris entanglement risk; no ISS heritage
- **Rejected.** Physics risk too high at concept phase; revisit if tether dynamics modeling shows clear advantage post-2028.

---

## Mass and Power Budget (Concept Phase, 30% Margins Applied)

**Phase 1 (IOC ~2031, first crew aboard):**

| Subsystem | Mass (design-to) | Mass (not-to-exceed) | Notes |
|-----------|-----------------|---------------------|-------|
| Anchor node + pressurized modules | 150 t | 195 t | ISS module heritage |
| Truss structure (Phase 1 segment) | 80 t | 104 t | 30 kg/m × ~1 km fraction |
| Solar arrays (500 kW) | 50 t | 65 t | ISS SARJ ~14 t per wing; scaled |
| Thermal rejection | 20 t | 26 t | ISS radiators ~13 t; scaled |
| Attitude control (CMGs) | 10 t | 13 t | 4× ISS-class CMGs |
| Docking systems (4 ports) | 8 t | 10 t | ISS CBM/IDA heritage |
| Robotics (2× Canadarm-class) | 5 t | 7 t | Canadarm2 1.5 t each |
| Margins and residuals | 77 t | — | 30% concept margin applied |
| **Phase 1 total** | **400 t design-to** | **500 t not-to-exceed** | |

**Power allocation (Phase 1, 500 kW total):**
- Life support and crew systems: 50 kW
- Propellant depot operations: 100 kW
- Manufacturing module (stub): 150 kW
- Thermal management: 80 kW
- Robotics and external systems: 60 kW
- Reserve/margin (20%): 100 kW (held)

---

## Open Questions for Cycle 2

1. **Inclination decision (founder decision required):** 51.6° (ISS heritage, international access) vs. 28.5° (Cape Canaveral direct, higher payload mass)
2. **Truss node interface standard:** Who controls the standard? Proprietary vs. open commercial standard? This is the critical commercial partnership decision.
3. **Manufacturing module product selection:** Pharmaceuticals (highest TRL) vs. fiber optics vs. exotic alloys — product line selection determines module design.
4. **Propellant depot cryogenic management:** Long-duration cryogenic storage in LEO at scale has no heritage; requires technology development plan from technology-roadmap-trl.

---

*Agent: integrator-systems-architect | Cycle 1 | 2026-05-06*
