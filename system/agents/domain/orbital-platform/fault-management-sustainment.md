---
name: fault-management-sustainment
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform

**Primary failure modes for an orbital spaceport:**

1. **Debris impact (highest consequence):** At 1 km scale, the cross-sectional area is ~10× ISS. Trackable debris avoidance maneuvers increase proportionally. Untrackable small debris (1–10 cm) creates penetration risk in pressurized modules. Whipple shield is mandatory; module isolation capability (hatches to seal off impacted section) is a design requirement.

2. **Pressure loss (most operationally complex):** Slow leak requires module isolation; rapid decompression requires emergency shelter protocol. ISS protocol: shelter in most-shielded module, await rescue. Spaceport protocol must account for 12 crew dispersed across 1 km — emergency shelter locations must be within 3 minutes of any occupied area.

3. **Power system failure:** At 500 kW design, partial power failure must not cascade. Solar array sections must fail gracefully; manufacturing operations (highest power consumer) shed first; life support and comms last. Battery backup: ≥8 hours on minimal load (ISS standard).

4. **Docking system failure:** Failed docking mechanism traps visiting vehicle at port. Mitigation: redundant docking ports, EVA-capable interface for emergency extraction, visiting vehicle self-rescue capability (SpaceX Dragon autonomous undock).

5. **Attitude control failure:** Loss of ADCS sends platform into slow tumble; solar arrays lose pointing; power drops within 90 minutes. Mitigation: redundant CMGs (ISS has 4 CMGs with graceful degradation), visiting vehicle can provide emergency attitude control via thruster (ISS Soyuz has done this).

**Maintenance architecture:**
- On-orbit repair: all replaceable components are ORU (Orbital Replacement Unit) designed; crew-replaceable in EVA or IVA
- EVA cadence: planned maintenance EVAs 1–2 per month per 8-crew; each EVA is 6 hours max (NASA limit); EVA budget drives crew size
- Robotic maintenance: Canadarm-class robotic arm handles large ORU swaps (solar arrays, radiator panels); crew supervision required
- Return-to-Earth maintenance: not feasible for large modules; design for on-orbit repair only

**Fault detection:**
- Automated health monitoring: all critical systems telemetry to crew displays and Earth; automated anomaly detection
- Ground monitoring: 24/7 Mission Control equivalent (commercial version); authority to command but not override crew safety decisions
- ISS-heritage: every ISS anomaly response procedure is a starting template; adapt for larger platform and commercial crew

**Heritage:**
- ISS Zarya module ADCS anomaly (1999): CMG failure, attitude control via Soyuz thrusters — proves vehicle-assisted attitude control
- ISS Progress collision avoidance: demonstrates operational deconfliction protocols
- Mir fire (1997): crew survived chemical fire through isolation and manual CO₂ scrubbing — the correct lesson is not "fires don't happen" but "crew must be trained to respond"
- STS-27: undetected thermal protection damage; on-orbit inspection protocols derived from this

**LOC analysis:** Primary LOC scenario is rapid decompression during EVA or docking. Mitigation: buddy system, emergency suit donning < 45 s (ISS standard), rescue vehicle permanently docked. LOC target: < 1 in 1,000 crew-years of operations (ISS is approximately this rate including accepted risk from debris).
