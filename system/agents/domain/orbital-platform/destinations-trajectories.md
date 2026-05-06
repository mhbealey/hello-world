---
name: destinations-trajectories
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform

**This study is orbital-stationary.** The spaceport occupies a fixed orbit; trajectory analysis is about how other vehicles reach it, not how it moves. The platform performs stationkeeping but does not maneuver to new orbits.

**Target orbit (open decision — TBD by cycle 2):**
- **400 km, 51.6° (ISS heritage):** Accessible from US, Europe, Russia, Japan; all current human-rated launchers; existing comms infrastructure (TDRS) trained on this orbit. Drag is manageable. **Preferred.**
- **400 km, 28.5° (Cape Canaveral direct):** Maximum payload to orbit for US launches; limits international access. Appropriate if US-commercial focus dominates.
- **500 km, 51.6°:** Reduces drag (less reboost), increases radiation dose (above ISS heritage). Not recommended without specific justification.

**Inclination decision:** Flag for founder decision before cycle 2. Inclination determines which launch vehicles can reach the platform efficiently; this is a commercial partnership constraint as much as a physics constraint.

**Rendezvous and docking architecture:**
- Visiting vehicle approach: V-bar or R-bar approach; automated to 10 m standoff; final docking with crew authorization
- Approach corridor count: 4 (fore, aft, and 2 radial ports) at IOC; scaling to 12+ docking ports at full build-out
- Traffic management: 90-minute orbital period enforces natural sequencing; approach windows spaced by 1/4 orbit minimum (22.5 min) to avoid collision risk
- Propellant transfer: dedicated docking interface standard TBD — critical commercial standard (no analog today; this is a gap)

**Launch manifest per phase:**
| Phase | Mass to orbit | Launch vehicle assumption | Launches |
|-------|--------------|--------------------------|---------|
| Phase 1 (anchor + power) | 100 t | 4× Falcon Heavy or 1× Starship | 4 or 1 |
| Phase 2 (truss expansion) | 250 t additional | Starship primary | 3 Starship |
| Phase 3 (full build-out) | 1,000 t total | Starship cadence | 8–10 Starship |

**Reboost cadence:**
- At 400 km, 500 t platform: ~50–100 kg propellant/month for reboost (solar cycle dependent)
- Self-supplied from on-station propellant depot — this is a design requirement, not a nice-to-have
- Depot replenishment: Starship-class tanker at ~3-month intervals at IOC

**Orbital mechanics note:** The spaceport itself accretes debris risk over time as a large structure. Station orbit shall include operational procedures for debris avoidance maneuver reservations and module re-entry sequencing at end of life.
