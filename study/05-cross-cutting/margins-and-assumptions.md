---
title: Margins and Assumptions Register
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Margins and Assumptions Register

This file tracks all margins applied and assumptions made across the study, in one place, for review.

## How to add an assumption

Short assumptions (one sentence, fits in a table row): add directly to the Assumptions table.
Long assumptions (multi-sentence, with go/no-go gates or cascading consequences): add a one-line summary pointer in the table and a numbered subsection `### AN. Title` below, containing the full text. Use the next available number (current highest: A6).

Before adding: search this file for contradicting entries. If a contradiction exists, resolve it before adding — do not leave two rows with incompatible values for the same quantity.

## Margins

|Quantity             |Margin|Standard / Source                          |Notes                                      |
|---------------------|------|-------------------------------------------|-------------------------------------------|
|Mass (concept phase) |30%   |AIAA / NASA-STD-5001 concept-phase practice|Applied at humanoid-systems-architect level|
|Power (concept phase)|30%   |AIAA / NASA-STD-5001 concept-phase practice|Applied at humanoid-systems-architect level|
|Cost (concept phase) |±50%  |NASA cost-estimating practice              |Reflected as range in cost-program         |
|Schedule             |±30%  |NASA schedule-estimating practice          |Reflected in technology-roadmap-trl        |

## Assumptions

|Assumption                                 |Source / Justification                          |Owner                    |Risk if wrong                         |
|-------------------------------------------|------------------------------------------------|-------------------------|--------------------------------------|
|Humanoid autonomy maturity curve           |See §A1 below                                   |autonomy-trl-tasking     |High — drives teaming model and roadmap|
|Fission surface power available by 2030s   |NASA FSP program current status                 |far-side-base-architect  |Medium — solar+battery fallback exists|
|Starship HLS or equivalent operational     |Artemis program baseline                        |destinations-trajectories|Medium — alternatives exist           |
|Far side relay infrastructure expandable   |Queqiao-2 operational, future relays in planning|far-side-base-architect  |Medium — drives comms architecture    |
|Space humanoid design-to mass: 75 kg       |See §A2 below                                   |humanoid-systems-architect|High — drives lander manifest and form factor|
|Space humanoid peak power: ≤800 W          |See §A3 below                                   |humanoid-systems-architect|Medium — drives power architecture and thermal|
|Actuation type: HD-Electric primary        |See §A4 below                                   |robotics-actuation-structures|Medium — harmonic flexspline cryogenic TRL is open|
|Structure + actuation mass ≤30 kg design-to|See §A5 below                                   |robotics-actuation-structures|Medium — CFRP construction required; risk if space-qual drives material change|
|Joint dust seal: FFKM lip seal to −180°C   |See §A6 below                                   |robotics-actuation-structures / space-environments|High — material at TRL 3–4 for cryogenic range; must reach TRL 5 by 2029|

### A1. Humanoid autonomy maturity curve

This study assumes humanoid autonomy reaches **TRL 6 in space-relevant environments by approximately 2029**, advancing to **TRL 7+ in space-relevant environments by approximately 2035**, advancing to **TRL 8 (qualified through demonstration in operational environment) by approximately 2038-2040** — coincident with the lunar far side base initial operational capability.

This is a study assumption, not a forecast. The study's purpose is to work out the architectural and operational consequences if this curve holds. The assumption is treated as a **program commitment with explicit go/no-go gates at each TRL milestone**: if the 2029 gate is missed, the deployment timeline slips proportionally; if the 2035 gate is missed, the human-humanoid teaming model defaults to higher human-in-the-loop ratios.

Owner: autonomy-trl-tasking. Risk if wrong: high — drives the entire teaming model and the build-and-deploy roadmap.

### A2. Space humanoid design-to mass: 75 kg (not-to-exceed 97.5 kg with 30% margin)

The form factor tradespace analysis in `study/01-optimal-space-humanoid/02-form-factor-tradespace.md` sets a parametric mass target of **75 kg design-to** for the bipedal space humanoid in surface EVA-support configuration. The heritage bracket is: Optimus Gen 2 at 57 kg (commercial, not space-qualified), Atlas Electric at 89 kg (commercial, not space-qualified), and Valkyrie R5 at 129 kg (space-intent, never flown). The 75 kg target sits within the commercial bracket and well below Valkyrie's cautionary upper bound.

With the 30% concept-phase mass margin required by NASA-STD-5001, the **not-to-exceed mass is 97.5 kg**. If space-qualification requirements (radiation shielding, vacuum seals, dust protection) push the design toward the Valkyrie mass class, this assumption must be revisited and the destinations-trajectories agent must be notified to re-run the lander manifest calculus.

Owner: humanoid-systems-architect. Risk if wrong: high — mass directly drives lander payload allocation, launch cost, and number of units that can be deployed per mission. Must be reconciled with destinations-trajectories before the budget section is baselined.

### A3. Space humanoid power budget: ≤500 W steady-state, ≤800 W peak

The form factor tradespace analysis sets parametric power targets of **500 W steady-state locomotion** and **800 W peak (manipulation under load)** for the bipedal space humanoid. These values are derived from heritage scaling: Valkyrie is estimated at approximately 1,800 W for a 129 kg platform; scaling by mass ratio (75/129 ≈ 0.58) and applying a 15% efficiency improvement credit for next-generation electric actuators over Valkyrie's 2015-era SEA technology yields approximately 900 W scaled, suggesting 800 W peak is achievable with engineering discipline. The 500 W steady-state figure is aggressive and is flagged as requiring validation by the actuation subsystem design.

With the 30% concept-phase power margin required by NASA-STD-5001, the **power-system-level allocation is 650 W steady-state / 1,040 W peak**. All subsystem power allocations must be compatible with a shared far-side base power plant running fission surface power.

Owner: humanoid-systems-architect. Risk if wrong: medium — power directly drives the battery/energy-storage mass (and therefore the total system mass assumption in §A2) and the thermal rejection requirement.

### A4. Primary actuation type: HD-Electric for load-bearing joints

The actuation section (`study/01-optimal-space-humanoid/03-actuation-structures.md`) selects **high-ratio harmonic drive electric actuation** for the primary load-bearing joints (hips, knees, ankles, shoulders, elbows), with a hybrid QDD-class approach for low-torque fine-control joints (wrists, fingers). This choice is driven by mass efficiency: HD-Electric achieves 85–90% electrical-to-mechanical efficiency and the highest torque density of the three electric options considered. SEA was rejected as the primary architecture on mass grounds — Valkyrie's 129 kg for 44 DOF with SEA throughout is 72% above the 75 kg design-to target.

**Fallback gate:** If the harmonic drive flexspline cryogenic fatigue validation program does not reach TRL 5 by the 2029 program gate, the architecture reverts to selective SEA at major limb joints. This fallback adds an estimated 10–20 kg and requires a mass budget renegotiation with the destinations-trajectories agent.

Owner: robotics-actuation-structures. Risk if wrong: medium — if cryogenic flexspline fatigue life is unacceptable, the fallback is SEA and the mass budget breaks; if the peak power model fails to close, joint heater power (required to maintain joints above −80°C during cold soak) may push the power budget past the §A3 ceiling.

### A5. Structure + actuation mass ≤30 kg design-to (≤39 kg NTE)

The actuation section sets a parametric mass allocation of **30.0 kg design-to / 39.0 kg NTE** for the combined structure and actuation subsystem (primary structure, actuation, joints/sealing, end-effectors). This is 40% of the 75 kg total system design-to mass. The allocation is broken down as: primary structure 8.5 kg (CFRP limb links + Al 7075 nodes), actuation 13.0 kg (38 joints × ~340 g mean actuator mass), joints/seals 4.0 kg, end-effectors 4.5 kg.

The 8.5 kg structural mass assumes CFRP limb construction. If space-qualification or impact-resistance requirements force a return to aluminum-only limb construction, structural mass increases by approximately 2.5–3.5 kg, breaking the 30 kg budget. This would force a renegotiation at the total system level.

Owner: robotics-actuation-structures. Risk if wrong: medium — structural material change or actuator mass overrun would require either total system mass increase (impacts §A2 and lander manifest) or reduction in another subsystem allocation.

### A6. Joint dust seal: FFKM lip seal at −180°C (TRL 3–4; must reach TRL 5 by 2029)

The actuation section specifies **perfluoroelastomer (FFKM/Kalrez-class) lip seals** as the elastomeric element in the dual-stage labyrinth + lip seal dust mitigation architecture. Standard FFKM compounds are space-qualified for −60°C to +200°C service (ISS heritage in fluid line connectors). The lunar far side surface reaches −180°C. Adaptation of FFKM compounds for the −180°C lower bound under cyclic joint loads in vacuum is a development item at **TRL 3–4**.

If this adaptation fails to reach TRL 5 (component validation in relevant environment) by the 2029 program gate, the fallback is an all-labyrinth seal architecture (no elastomeric element), which reduces particle rejection effectiveness and increases bearing surface contamination rates. The all-labyrinth fallback is viable for a shorter mission duration but has not been assessed for multi-year permanent base service life.

Owner: robotics-actuation-structures (definition), space-environments (execution and validation). Risk if wrong: high for permanent base dust tolerance; a failed seal at a primary joint could require ORU replacement on a compressed schedule and degrades the robot's operational availability.

[Each agent appends to this register as work progresses. Orchestrator reviews at major checkpoints.]
