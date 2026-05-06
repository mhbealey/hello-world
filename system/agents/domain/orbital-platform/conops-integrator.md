---
name: conops-integrator
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform

**Mission lifecycle:** Phased build-out from first module launch through industrial-capacity operation. Phase 1: anchor node + power + docking ports (first crewed mission enabled). Phase 2: truss expansion + manufacturing modules. Phase 3: full industrial throughput (propellant depot, crew transit hub, in-space manufacturing at scale).

**Cyclic forcing function:** 90-minute LEO orbital period. This drives:
- 16 sunrise/sunset cycles per 24-hour day → thermal cycling on all external surfaces
- Communication windows: continuous if relay constellation present; otherwise ~10-min windows per pass over ground stations
- Traffic docking windows: approach/departure constrained by relative orbital mechanics; planning horizon is orbit-period granular

**Steady-state operational concept (Phase 1, IOC ~2035):**
- Crew: 8–12 resident crew (rotating 6-month tours) + visiting crews during docking events
- Work shifts: 3 overlapping 8-hour shifts to maintain 24/7 ops; aligned to UTC, not local orbital time
- Traffic tempo: 2–4 visiting vehicles per month at IOC; scaling to 20+ per month at full ops
- Robotic operations: Canadarm-class remote manipulators for module berthing; autonomous docking for unmanned resupply

**Sample operational day (Phase 1):**
- 0000–0800 UTC: Night crew — system monitoring, scheduled maintenance windows, 2 planned EVAs (thermal environment favorable on night-side passes)
- 0800–1600 UTC: Day crew — visiting vehicle docking procedures, cargo transfer operations, manufacturing module operations, crew exercise/medical
- 1600–0000 UTC: Swing crew — traffic deconfliction planning for next 48 hours, non-time-critical experiments, training with remote supervisors on Earth

**Docking/rendezvous ConOps:**
- Standard: automated approach (GPS relative nav + LIDAR) to 10 m hold point; crew authorization; final docking under crew supervision
- High-traffic periods: staggered arrival windows at 90-min (one-orbit) intervals to avoid traffic conflicts
- Emergency: expedited approach corridor reserved; flight crew cleared off affected modules

**Critical dependencies:**
- Relay comms constellation: continuous voice+data coverage required for 24/7 ops (ISS relies on TDRS; commercial equivalents needed)
- Reboost cadence: atmospheric drag at 400 km requires propellant resupply every 90 days (TBD by mass and drag model)
- EVA constraints: EVA windows limited by radiation (SAA avoidance) and thermal cycling; max 2 EVAs per week per crew pair

**Heritage:**
- ISS 24/7 operations concept: primary analog for shift structure, communication protocols, visiting vehicle management
- Mir Salyut-era crew rotations: short-handover turnarounds; parallel crew overlap proven effective
- Commercial aircraft operations: traffic sequencing mental model for spaceport context
