---
name: autonomy-trl-tasking
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform

**Autonomy domain:** Orbital spaceport operations. The specific autonomy problem is distinct from the lunar pathfinder: latency is not the driver. Autonomy is required here for economic reasons — the crew-to-operation ratio at industrial scale. A platform with 20 visiting vehicles/month, continuous manufacturing operations, and 1 km of external structure cannot be managed by 12 crew without significant automation.

**Task taxonomy for this study:**
| Level | Category | Examples |
|-------|----------|---------|
| 1 — Fully autonomous | Routine station-keeping | Reboost burns, attitude control, thermal louver adjustment, solar array tracking |
| 2 — Supervised autonomy | Docking and approach | Unmanned vehicle automated approach to 10 m; crew authorizes final docking |
| 3 — Supervised autonomy | Robotic arm operations | Manipulator-assisted module berthing with crew in loop at hold points |
| 4 — Operator-guided | EVA support | Crew-directed robotic assist during EVA; no unsupervised EVA-robot interaction |
| 5 — Human-primary | Emergency response | Crew manual override; autonomy reverts to safe mode |

**TRL assessment for spaceport operations (~2026 baseline):**
- Automated docking (CXV/Dragon/Soyuz): TRL 8–9 — flight-proven; SpaceX Dragon docks autonomously today
- Autonomous orbit maintenance: TRL 8–9 — all LEO platforms do this
- Robotic module assembly (Canadarm class): TRL 6–7 — ISS demonstrated; scale-up for kilometer structures is TRL 5
- Traffic deconfliction (multi-vehicle): TRL 4–5 — software exists in ground-based UTM; space application is TRL 4
- Autonomous manufacturing operations in microgravity: TRL 3–5 — domain-dependent

**Key difference from lunar pathfinder:** Most critical autonomy for this spaceport is already at TRL 7–9. The gaps are at the integration and scale level, not the fundamental capability level. Autonomy development is an integration and reliability challenge, not a breakthrough challenge.

**Go/no-go gates:**
- 2029: Traffic management system TRL 6 (software demonstrator with simulated multi-vehicle traffic)
- 2032: Integrated autonomous manufacturing ops TRL 6 (demonstration on ISS or early spaceport phase)
- 2035 IOC: All Level 1–3 autonomy at TRL 7+; Level 4–5 remain human-primary

**Heritage:**
- SpaceX Dragon: fully autonomous docking/undocking since 2020; RTLT-independent
- Northrop Grumman MEV: autonomous rendezvous and docking with non-cooperative satellite — TRL 9
- ISS USOS robotics: Canadarm2 autonomous berthing of HTV/Cygnus with ground authorization
- US air traffic control: traffic deconfliction architecture at scale; conceptual heritage only
