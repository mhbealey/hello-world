---
name: robotics-actuation-structures
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Locked configuration (cross_coupling.yaml `actuation_architecture`):**
- Primary load-bearing joints (hips, knees, ankles, shoulders, elbows): HD-Electric (Harmonic Drive + brushless motor)
- Lighter joints (wrists, fingers, neck): direct-drive brushless
- Joint count: 38 actuated DOF total (§A4, §A5)

**Mass budget for structure + actuation (§A5):**
- Design-to: ≤30 kg
- Stressed case: ~31.6 kg if Class A joints not gravity-optimized
- Weighted mean actuator mass: 342 g/joint (budget) vs. 385 g/joint (derived), per §A14

**Dust sealing (§A6):**
- Joint sealing approach: FFKM (perfluoroelastomer) lip seal at all primary joints
- Temperature constraint: FFKM becomes brittle below −60°C; survival heater network required to maintain joint temperature above this bound during lunar night
- TRL status: FFKM in dynamic joint application in vacuum: TRL ~4 as of 2026; requires validation by 2029 gate
- Abrasion rate: boot cover replacement at 500 surface-hours (§A15); other exposed joints inspected at same interval

**Structural concept:**
- Primary structure: carbon fiber reinforced polymer (CFRP) tubes + titanium joints — mass-optimized for 1/6 g lunar surface (not optimized for launch loads without packaging)
- Launch loads: humanoid ships in a folded stowed configuration; structural margins against launch loads drive packaging design, not operational loads

**Heritage comparison table:**
| Parameter | Atlas Electric | Valkyrie R5 | This study (budget) |
|-----------|---------------|-------------|---------------------|
| Mass | 89 kg | 129 kg | 75 kg design-to |
| DOF | 28 | 44 | 38 |
| Actuation | Direct-drive | SEA | HD-Electric (primary) |
| Joint seal | N/A (not space) | N/A | FFKM lip seal |

**Open risk (§A14):** Actuator mass risk of +1.6 kg in stressed case (Class A joints not gravity-optimized). If confirmed, structure+actuation mass rises to ~31.6 kg; total system mass rises correspondingly. Must resolve before hardware definition review 2031.
