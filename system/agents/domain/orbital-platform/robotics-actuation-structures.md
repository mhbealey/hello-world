---
name: robotics-actuation-structures
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform

**Structural concept (from integrator-systems-architect overlay):** Modular truss-and-node. The structural agent's primary task is defining the truss node interface standard — this is what enables all future expansion and is the architectural decision with the longest legacy.

**Truss interface standard (open decision, must lock by cycle 2):**
- Node diameter and interface type: standardized docking interface for module attachment
- Structural load capacity: each node must support ≥10 t module mass (ISS module heritage)
- Utility pass-through: power, data, thermal fluid loops routed through truss nodes
- No candidate selected yet; Axiom, Starlab, and other commercial programs are developing competing standards

**Manipulator systems:**
- Primary: Canadarm2-class remote manipulator (17 m reach, 116,000 kg payload capacity) — ISS flight heritage TRL 9
- Secondary: Smaller manipulators (SPDM/Dextre-class) for fine manipulation and ORU handling
- Spaceport-scale requirement: 1 km structure requires multiple manipulator stations, or a "mobile" manipulator that can traverse the truss (Canadarm2 walks along ISS truss; this scales)
- EVA restraint: Foot restraints and handrails on all external surfaces reachable by crew; NASA EVA standards apply

**Actuation in microgravity:**
- No gravity loads; dynamic loads from crew motion, docking impacts, and thruster firings dominate
- Docking mechanism: soft-capture → hard-capture sequence; ISS CBM (Common Berthing Mechanism) and IDA (International Docking Adapter) are the heritage references
- Thermal actuators: solar array rotation drives, radiator deployment — all flight-proven in ISS configuration

**Environmental hardening for LEO:**
- Atomic oxygen erosion: polymer seals on all joint bearings require AO-resistant coating or shielded routing
- Thermal cycling: 16 cycles/day at ±120°C; bearing materials must be validated for 60,000+ cycles
- Radiation: electronics in joint controllers must be rad-hard or shielded; TID budget 10 krad(Si)/year
- Outgassing: all lubricants and materials must have low vapor pressure for vacuum environment

**Mass budget for structure + manipulators (concept phase):**
- Truss structure: ~30 kg/m (ISS truss heritage) → 1 km truss = 30 t truss mass
- Node assemblies: ~2 t per node × 20 nodes = 40 t
- Manipulator systems: 2× Canadarm-class at 1,500 kg each + small arms = ~5 t total
- Concept-phase margin (30%): total structure + actuation ≤ 100 t design-to for phase 1 (1/5 of full build-out)

**Heritage comparison:**
| System | Mass | Heritage |
|--------|------|---------|
| ISS S-truss | 14 t (central truss) | Flight heritage |
| Canadarm2 | 1,497 kg | Flight heritage, TRL 9 |
| Dextre (SPDM) | 1,560 kg | Flight heritage, TRL 9 |
| Axiom truss node | TBD | Development phase |
