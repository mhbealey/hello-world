---
name: space-environments
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-04
---

## Domain overlay: lunar-surface

**Primary driver: Lunar dust.** Apollo lessons, LADEE results, CLPS lander observations. Particle size distribution: bimodal peak ~1–10 µm and ~0.1–1 µm. Highly charged (electrostatic adhesion). Abrasive (glass-like shards from impact gardening). Set requirements for joint sealing, thermal radiator coatings, optical sensor protection as first priority.

**Thermal forcing function: Lunar night.** 14 Earth days at ~−170°C surface temperature, no solar power. The humanoid either survives standby (survival heaters, ~70–200 W, mass penalty) or stows in heated habitat (operational constraint). Coordinate with `conops-integrator` on stow/wake cycle. See §A10 in assumption registry.

**Radiation:** GCR ~30 rad/year at unshielded lunar surface. Surface neutron albedo adds ~10–20% to silicon TID. SPE worst-case (August 1972 class) is ~100 krad(Si) at unshielded; behind 5 mm Al shielding ~1 krad(Si). Mission-lifetime TID target: ≤20–30 krad(Si)/yr design-to. See §A11, §A12.

**Far side note:** Surface radiation is not different from near side. Comms relay infrastructure (Queqiao-2) is in a cislunar frozen orbit — flag relay geometry constraints to `far-side-base-architect` and `teleoperation-latency`.

**Artifact path:** `cycles/cycle-<NN>/environments-hardening.md`

**Heritage anchors:** Apollo thermal control data (AS-306 TM), LADEE instrument data (NMS), Luna/Lunokhod joint degradation records, MER/MSL dust accumulation on solar panels, Curiosity wheel wear (abrasion analog).
