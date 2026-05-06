---
name: conops-integrator
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Mission lifecycle:** Launch → translunar transit (3 days) → lunar orbit insertion → powered descent and landing → surface commissioning → steady-state operations → crew rotation → eventual replacement cadence.

**Humanoid operational cycle:**
- **Active phase (lunar day, ~14 Earth days):** EVA-support sorties, tool operations, equipment maintenance, site preparation. Supervisor ratio 1:2–3 per §A18.
- **Lunar night (14 Earth days, −170°C):** Hibernation mode (survival heaters ~70–200 W per unit) or stow in heated habitat. Coordinate with `space-environments` on thermal assumptions. Production work stops.
- **Annual cadence:** ~13 lunar days per Earth year; net productive time ~50% of calendar year.

**Task allocation model:**
- Humanoid-autonomous tasks: terrain traversal on established paths, routine status checks, repetitive equipment connections (after human demonstration)
- Supervised-autonomy tasks: tool handling, panel operations, equipment transport in varying terrain
- Human-in-the-loop tasks: first-time operations, novel contingencies, high-consequence manipulation (within §A18 supervisor ratio ceiling of 1:8–10 absolute maximum)

**EVA ConOps structure:**
- Pre-sortie (30 min): mission plan review, tool staging, systems check by crew supervisor
- Sortie (4–6 hours active): humanoid operates autonomously or supervised; crew monitors from habitat
- Post-sortie (30 min): data download, fault review, boot-cover inspection (§A15), recharge
- Fault contingency: "limp mode" locomotion to habitat if joint fails; crew supervises ingress

**Critical dependencies:**
- Relay availability ≥95% for IOC (§A17): if relay drops, sortie must pause until contact restored
- Far-side base habitat: humanoid does not operate without crew oversight; base habitat capacity determines max humanoid fleet size
- Supply cadence: boot cover replacement every 500 surface hours (§A15); consumable manifest input to destinations-trajectories

**Heritage:** Lunokhod operational cycle (8-hour active sessions, conserve power between sessions) is the closest analog. Apollo EVA time-and-motion studies for task duration estimates.
