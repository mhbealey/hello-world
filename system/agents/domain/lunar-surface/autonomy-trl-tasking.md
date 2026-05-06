---
name: autonomy-trl-tasking
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Autonomy domain:** Lunar surface bipedal manipulation and locomotion. The specific autonomy problem is: a 75 kg humanoid must perform EVA-support tasks (tool handling, equipment transport, panel operation) with an Earth-to-robot round-trip latency of 2.56–2.92 s, making real-time teleoperation infeasible for fine manipulation.

**TRL curve (program assumption §A1):**
- ~2029: TRL 6 in space-relevant environments (high-fidelity lunar surface analog)
- ~2035: TRL 7+ (demonstration in LEO or on-orbit analog)
- ~2038–2040: TRL 8 (qualified through IOC demonstration)

**Go/no-go gates:**
- 2029 gate: if TRL 6 missed, deployment timeline slips proportionally; teaming model reverts toward higher human-in-the-loop ratios
- 2035 gate: if TRL 7 missed, IOC date slips; supervisor ratio at IOC increases from 1:2–3 toward 1:1

**Autonomy task taxonomy for this study:**
- Level 1 (fully autonomous): Terrain traversal on prepared paths, routine equipment status checks
- Level 2 (supervised autonomy): Tool pickup, panel operation, equipment connection
- Level 3 (operator-guided): Novel contingency response, high-consequence manipulation

**Architecture constraint (§A8, §A9):** Foundation models operate at supervisory layer only (task planning, exception handling). Primary task execution uses classical motion planning + learned primitives. No full end-to-end neural control in flight software until TRL demonstrates sufficient OOD robustness.

**Heritage anchors:**
- Mars 2020 Perseverance: onboard planning for terrain traversal, limited manipulation (sample collection)
- DARPA Robotics Challenge 2015: dexterous manipulation in degraded comms (20-second delay imposed) — Lunokhod control analogy
- Boston Dynamics Atlas: high-dynamic locomotion heritage, TRL 4 for space environments
- Lunokhod 1 & 2: operational precedent for latency-driven command sequences (8-second delay, pre-programmed macro sequences)

**Key open question:** What is the minimum viable autonomy level for the 2035 IOC case? A conservative estimate (TRL 7 but not 8) implies supervisor ratio stays at 1:2 rather than advancing to 1:3. Flag this in the assumption registry under §A1 sensitivity bounds.
