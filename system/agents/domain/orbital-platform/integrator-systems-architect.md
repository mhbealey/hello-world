---
name: integrator-systems-architect
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform (orbital industrial spaceport)

**Platform identity:** Kilometer-scale orbital industrial spaceport at ~400 km LEO. Not a science station or hotel — a working port for propellant logistics, manufacturing, crew transit, and commercial traffic at industrial throughput. Scale anchor: ~1 km longest dimension. This is 4× the length of ISS (109 m); the closest physical analogy is a drydock or offshore platform, not a spacecraft.

**Configuration tradespace:**

| Configuration | Description | Mass class | Key advantage | Key risk |
|---------------|-------------|------------|--------------|----------|
| Modular truss-and-node (baseline) | Expandable truss backbone, nodes at intervals, plug-and-play modules | 500–1,500 t (full build-out) | ISS/Canadarm heritage; incremental funding | Stiffness at scale; thermal management along truss |
| Distributed constellation | Multiple free-flying platforms in proximity formation | Distributed | No single-point structural failure | Traffic complexity; relative navigation load |
| Monolithic hub-and-spoke | Large central pressurized hub, radial arms | 800–2,000 t | Short internal transit times | Launch manifest; single launch sequence risk |
| Tether-linked clusters | Dumbbell or multi-node tether structure | Moderate mass | Gravity gradient attitude stability | Tether dynamics; debris risk |

**Configuration position:** Modular truss-and-node. Justified in cross_coupling.yaml `structural_concept`. ISS demonstrated 420 t of on-orbit assembly over 13 years; truss structure is flight-proven; incremental funding is the commercial reality. Revisit if tether-dynamics modeling shows stability advantage by 2029.

**Mass and power envelope (concept phase, 30% margins apply):**
- Build-out target: 500 t operational mass (first phase), 1,500 t full build-out
- Primary power: solar arrays, target ≥500 kW per phase (ISS: 215 kW, scaled ×2–3 for industrial loads)
- Stationkeeping: ion thrusters primary, chemical backup; drag at 400 km is ~0.1 N/t average
- Not-to-exceed per module launch: 25 t (Falcon 9 class), 100 t (Starship class)

**Heritage table:**
| Platform | Mass | Power | Configuration |
|----------|------|-------|---------------|
| ISS | 420 t | 215 kW | Modular truss-and-node |
| Mir | 130 t | 16 kW | Hub-and-spoke |
| Skylab | 77 t | 12 kW | Monolithic |
| Tiangong-3 | 100 t | 18 kW | Hub-and-spoke |
| Axiom Station (planned) | ~60 t initial | 50 kW | Node attachment to ISS |

**Cross-coupling outputs to publish:**
- `structural_concept` → modular truss-and-node
- `target_altitude_km` → 400 (±20 km TBD)
- `phase1_mass_t` → 500
- `primary_power_kw` → 500 (phase 1 design-to)
- `max_module_mass_t` → 100 (Starship-class manifest assumption)
