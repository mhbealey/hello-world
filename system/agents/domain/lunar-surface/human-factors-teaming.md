---
name: human-factors-teaming
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Crew composition at IOC (§A19):** 4 crew, 3 humanoids, periodic supervision as default operational mode. Headroom factor ~2× (crew can expand to 8 before efficiency degrades).

**Supervisor ratios (§A18):**
| Phase | Ratio | Rationale |
|-------|-------|-----------|
| IOC 2035 | 1:2–3 humanoids per active supervisor | TRL 7 autonomy, initial operations |
| Full ops 2040 | 1:4–5 | TRL 8, proven task library |
| Absolute ceiling | 1:8–10 | Cognitive overload threshold from ISS and analog research |

**Cognitive load context:** Research on air traffic control (3–5 aircraft), UAV ground operations (4–8 vehicles), and ISS robotic ops (1–2 concurrent) suggests human supervisors degrade in monitoring accuracy above 3–4 autonomous agents. The 1:8–10 ceiling reflects this; the 1:2–3 IOC ratio is deliberately conservative.

**Long-duration lunar factors:**
- Isolation: lunar far side is the most isolated human habitat ever occupied; communication with Earth is relay-dependent and subject to delay
- Circadian disruption: lunar day/night cycle is 29.5 Earth days; crew requires artificial lighting and scheduling
- Monotony risk: repetitive supervision tasks (watching autonomous systems operate) carries monotony-related vigilance degradation; crew rotation and task variety are design requirements
- Maintenance burden: if humanoid maintenance demand exceeds Mir-baseline crew repair time (estimated at ~2 hours/day), crew size must increase

**Commercial crew considerations:** At IOC, crew is specialist (aerospace engineers + roboticists). By 2040 target, operational procedures should support non-specialist commercial occupants performing supervision tasks with 2 weeks of training. This is an architectural requirement on the autonomy UI.

**Heritage:**
- ISS crew productivity data: ~6 hours of useful work per person per day after systems maintenance overhead
- Antarctic station winter-over psychology: analog for isolation, small crew, no evacuation option
- ISS Robonaut 2 deployment: human-robot collaboration lessons (dexterity, communication interfaces)
- Apollo EVA time-and-motion studies: task duration estimates for lunar surface work
