---
name: technology-roadmap-trl
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Program schedule (IOC 2035–2040 baseline):**
```
2024–2026  TRL 4: Lab demonstrations of key subsystems (dust sealing, autonomy, actuators)
2026–2029  TRL 5: System-level prototype in relevant environment (lunar analog / vacuum chamber)
2029       GATE: TRL 6 in space-relevant environment (go/no-go for continued development)
2029–2032  TRL 6→7: Engineering development model, reliability testing
2032–2033  Hardware Definition Review (HDR): locks design for flight qualification
2033–2035  TRL 7: Demonstration in space environment (LEO or Lunar Gateway)
2035       IOC: First operational humanoid unit on lunar surface
2035–2040  Expansion: fleet growth, autonomy advancement, supervisor ratio improvement
2040       Full operations: 1:4–5 supervisor ratio, sustained surface ops
```

**Critical technology gaps (prioritized):**
1. **Dynamic joint sealing in vacuum+dust (§A6):** FFKM lip seal at TRL 4 for this application; 2029 gate requires TRL 6 → needs vacuum chamber + dust injection test campaign by 2027
2. **Space-grade AI compute (§A8):** No rad-hard AI accelerator at TRL > 4 as of 2026; watchdog architecture is the current solution; TRL 7 commercial compute behind shielding needs 3-year ORU plan
3. **Bipedal locomotion in 1/6 g (§A1):** Ground testing in partial-gravity simulator (parabolic flight or drop tower) required; TRL 3 as of 2026 for space-relevant environment
4. **Far-side relay constellation (§A17):** Queqiao-2 alone is insufficient for IOC; second relay required by 2033 for 95% availability

**Program structure:**
- Phase A (now–2029): Technology development, TRL advancement, risk reduction
- Phase B (2029–2032): Preliminary design, breadboard → brassboard
- Phase C/D (2032–2035): Flight qualification, system integration, launch

**Go/no-go discipline:** The 2029 TRL 6 gate applies to all of: (1) dust sealing, (2) power system (battery TID tolerance), (3) compute watchdog, (4) basic locomotion. If any one fails the gate, the timeline slips. Do not paper over a gate miss with heroic schedule compression.
