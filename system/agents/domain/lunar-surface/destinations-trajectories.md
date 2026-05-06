---
name: destinations-trajectories
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**This study is surface-stationary.** The destination is fixed: a permanent base on the lunar far side. Trajectory analysis is about getting there and back, not about stationkeeping.

**Target site options (open question — TBD by study):**
- Lunar south pole (ice availability, Artemis baseline): near-side comms, solar-powered except at shadowed craters
- Lunar far-side equatorial (science priority, isolation): requires relay for all communications, uniform thermal environment

**Launch manifest (per crewed mission):**
- Crew transport: Starship HLS-class or smaller crewed lander (~3–4 crew)
- Cargo manifest: humanoid units (75 kg each + packaging ~150 kg), consumables (boot covers §A15, spare ORUs), science equipment
- Key constraint: each lander mission is ~$1–5B → minimize number of missions → maximize per-mission payload utilization

**Trajectory context:**
- Translunar injection: 3-day transit, negligible for architecture purposes
- Lunar orbit insertion: standard staging; lander descent profile varies by site latitude
- No significant atmospheric entry (vacuum descent)
- Surface operations: no mobility requirements on the humanoid beyond local terrain traversal

**Orbital mechanics for this study:**
- Queqiao-2 relay orbit (§A17): confirmed 119.25° retrograde frozen orbit around Earth-Moon L2 — provides far-side coverage but with geometry-dependent link margin
- No stationkeeping required for surface assets
- Crew rotation cadence: input from human-factors-teaming, drives launch frequency

**What this agent does NOT own in this study:**
- Trajectory optimization (not primary path — surface operations dominate)
- Destination selection (TBD, flag for founder decision before cycle 2)
- Launch vehicle selection (inputs from cost-program and availability assumptions)
