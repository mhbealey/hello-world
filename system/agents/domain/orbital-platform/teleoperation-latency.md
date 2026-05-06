---
name: teleoperation-latency
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform

**Latency regime:** LEO-to-ground is Tier 1 (Telepresence). This is the defining architectural difference from the lunar pathfinder study: real-time teleoperation is feasible from Earth, and crew telepresence from within the platform is sub-20 ms.

**Computed latency values:**
- LEO-to-ground (direct link): 5–15 ms one-way (250–750 km slant range); RTLT < 30 ms
- LEO via relay satellite (GEO): +250 ms round-trip (GEO adds ~270 ms one-way); total RTLT ~550–600 ms
- LEO crew-to-platform arm (Canadarm-class): < 5 ms (local network); real-time teleoperation trivially feasible

**Architectural implications:**
1. No "latency-for-autonomy" argument applies here. Autonomy is justified by crew-to-task ratio economics, not by communication delay.
2. Ground-based supervisors can perform real-time dexterous manipulation of platform manipulators — contrast with lunar surface where this was impossible.
3. The forward-deployment justification shifts from latency to: situational awareness, response time for emergencies, and the economics of crew ratio vs. autonomous operations.

**Latency tier model for this study:**
| Tier | RTLT | Mode | Applies to |
|------|------|------|-----------|
| 1 — Telepresence | < 0.5 s | Full real-time control | All LEO ground-to-platform links |
| 2 — Supervised autonomy | 0.5–3 s | Pre-command sequences | GEO-relay links to Earth |
| 3 — High autonomy | > 3 s | Operator sets objectives | Not applicable in LEO |

This platform operates entirely in Tier 1. Autonomy decisions are driven by crew ratio and cost, not latency constraints.

**Comms architecture requirements:**
- Continuous coverage required for 24/7 operations: requires relay constellation (TDRS-class) or commercial (Starlink LEO terminal)
- Bandwidth: video telemetry for remote presence requires ≥100 Mbps sustained; current Starlink on-orbit links can support this
- Redundancy: dual-path (direct ground + relay) to avoid single-point comms loss during docking operations

**Heritage:**
- ISS TDRS relay system: continuous coverage via GEO relays; RTLT ~550 ms via TDRS; acceptable for voice and video but not for real-time fine manipulation
- ISS Robonaut 2: sub-500 ms relay (when direct); crew teleoperation in real time from ISS interior — this is the template
- Starlink Gen 2: LEO-to-LEO or LEO-to-ground terminal; latency < 50 ms; viable for high-bandwidth commercial comms
