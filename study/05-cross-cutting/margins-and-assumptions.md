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
Long assumptions (multi-sentence, with go/no-go gates or cascading consequences): add a one-line summary pointer in the table and a numbered subsection `### AN. Title` below, containing the full text. Use the next available number (current highest: A13).

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
|Sensor suite mass ~2.1 kg, power 37–75 W peak|See §A7 below                               |robotics-sensing-autonomy|Low-medium — sensors are not mass/power driver; TRL gaps are in qualification, not sizing|
|Compute architecture: two-tier RH supervisor + commercial AI accelerator|See §A8 below|robotics-sensing-autonomy|High — no rad-hard AI equivalent exists at TRL > 4; watchdog architecture is the 2035 solution|
|Foundation models used at supervisory layer only (not primary task executor)|See §A9 below|robotics-sensing-autonomy|Medium — if VLA generalization to OOD environments advances faster than expected, this assumption is conservative; if it does not advance, it is the correct constraint|
|Lunar night FSP power reservation: 70–200 W per humanoid unit|See §A10 below|space-environments|Medium — wide parametric range; detailed thermal model required by 2031|
|Radiation hardening: hybrid RHBD + spot shielding + ORU replacement|See §A11 below|space-environments|Medium — Tier 2 ORU replacement strategy requires 3-year cadence and base workshop capability|
|Lunar surface TID: 20–30 krad(Si)/yr at unshielded surface|See §A12 below|space-environments|Medium — LND measurement anchors dose equivalent; silicon TID conversion is spectrum-dependent and requires validation|
|Battery energy density: 160 Wh/kg design-to (space-qualified Li-ion)|See §A13 below|humanoid-systems-architect|Medium-high — drives power system mass (largest single mass line item at 16.9 kg); technology gate at 2032 hardware definition review|

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

### A7. Sensor suite mass ~2.1 kg design-to, 37–75 W peak power

The sensing section (`study/01-optimal-space-humanoid/04-sensing-autonomy.md`) allocates **~2.1 kg design-to mass** and **37–75 W peak power (10–30 W average with LIDAR duty cycling)** for the full sensor suite. This includes: stereo HDR camera pair + ToF depth unit (head-mounted), two wrist cameras, three-unit redundant MEMS IMU set with spot shielding, two wrist F/T sensors, fingertip tactile arrays, and one solid-state LIDAR.

Sensor mass (~2.8% of 75 kg total) and peak power (~9% of 800 W peak) are modest within system margins. The sensor allocation is not the mass or power driver; TRL gaps in space qualification are the primary risk vector in this subsystem. Key gaps: HDR camera outdoor lunar illumination performance at TRL 4–5; MEMS IMU TID tolerance with spot shielding at TRL 4–5; LIDAR SPAD array radiation hardening at TRL 4; flexible tactile substrate vacuum/thermal cycling at TRL 3–4.

Owner: robotics-sensing-autonomy. Risk if wrong: low-medium — sensors are not mass or power constrained; if space qualification drives mass or power overruns, the impact at system level is small. TRL gap in tactile arrays is the highest-consequence failure mode (reduces manipulation safety margin).

### A8. Compute architecture: two-tier RH supervisor + commercial AI accelerator (watchdog)

The sensing/autonomy section establishes a **two-tier compute architecture**: Tier 1 is a radiation-hardened supervisor processor (RAD750-class, 5–10 W, always-on) running safety-critical deterministic control loops; Tier 2 is a commercial AI inference accelerator (Jetson AGX Orin-class, 15–60 W) running perception pipelines and VLA model inference under Tier 1 watchdog supervision. Total compute mass ~1.8 kg including spot shielding.

This architecture is required because no radiation-hardened AI inference processor equivalent to commercial AI accelerators (Jetson AGX Orin: 275 TOPS, 15–60 W) exists at TRL > 4 as of 2026. The Tier 2 watchdog approach accepts commercial component SEU/latchup susceptibility as a managed risk: Tier 1 monitors Tier 2 output validity and issues power-cycle resets on detected anomalies. Spot shielding (5–10 mm Al/Ta laminate, ~0.8 kg) reduces latchup rate by 2–3 orders of magnitude.

**Technology gate:** If a radiation-hardened AI accelerator at TRL 6 becomes available by the 2029 gate (through DARPA HPSC or similar programs), the Tier 2 watchdog architecture may be simplified or replaced. If not — assessed as the more likely outcome — the two-tier watchdog architecture remains through the 2035 first deployment.

Owner: robotics-sensing-autonomy. Risk if wrong: high — the entire onboard autonomy stack depends on Tier 2 inference capability; if Tier 2 latchup rate under actual lunar radiation exceeds spot-shielding mitigation capacity, inference duty cycle degrades and supervisory autonomy function is impaired.

### A9. Foundation models used at supervisory autonomy layer only; not primary task executor

The sensing/autonomy section takes the position that **foundation models (VLA-class, LLM reasoning) are an enabling technology for the supervisory autonomy layer** — crew-robot natural language interface, goal decomposition, anomaly explanation — **but are not the primary task executor at the deliberative or reactive layers** for safety-critical and novel-environment operations. Deliberative and reactive layers use validated, interpretable architectures (MPC, behavior trees, state machines) supplemented by domain-specific fine-tuned learned models.

This position is calibrated to the current state of VLA model generalization: out-of-distribution performance degrades substantially beyond training data distribution, and lunar surface is maximally out-of-distribution for any existing model. Additionally, radiation-induced bit errors in foundation model weights or activations have not been characterized, and large-model failure modes are not bounded.

This assumption is conservative by design and should be revisited at the 2029 and 2035 program gates as: (1) lunar-analog training datasets are constructed, (2) model uncertainty quantification matures, and (3) radiation-effect characterization data is available.

Owner: robotics-sensing-autonomy. Risk if wrong: medium — if the assumption is too conservative, the architecture under-exploits available foundation model capability; if it is too permissive, autonomous task failures in safety-critical contexts are possible. The conservative direction (supervisory layer only) is the safer failure mode for this program.

### A10. Lunar night FSP power reservation: 70–200 W per humanoid unit

The environments section establishes a **parametric estimate of 70–200 W continuous FSP draw per humanoid during lunar night hibernation**: 50–150 W for electronics compartment and battery survival heaters, plus 20–50 W for joint heaters maintaining HD-Electric lubrication above −60°C at the 12 primary load-bearing joints. This range is derived by analogy to Mars rover WEB thermal heritage (Curiosity/Perseverance: ~100 W survival heating in cold case) scaled for the 14-day lunar night and the humanoid's larger electronics volume and distinct geometry.

**This estimate is TRL 2 (parametric only). A detailed thermal model is required.** The wide range reflects uncertainty in the bipedal form factor's MLI effectiveness (large surface-area-to-volume ratio relative to a compact rover box) and the number of joints requiring active heating. If the upper bound (200 W) is the actual figure and three humanoids are deployed simultaneously, the FSP must reserve 600 W for humanoid thermal maintenance through every lunar night — approximately 6% of a 10 kWe FSP plant. This is material to the FSP sizing conversation and must be reconciled before the base power architecture is finalized.

Owner: space-environments. Risk if wrong: medium — if FSP reservation is underallocated and actual heater demand is higher, either the humanoid thermal budget is underpowered (risks hardware damage below −60°C at joints) or the base power budget must be revised. Must be tightened by detailed thermal model validated by test before PDR.

### A11. Radiation hardening: hybrid RHBD + spot shielding + ORU replacement strategy

The environments section establishes a **hybrid radiation hardening strategy**: RHBD parts for Tier 1 safety-critical processor (TID-qualified >1 Mrad); RHBD where available for critical motor controller and safety-monitor ICs; COTS + 5–10 mm aluminum spot shielding (0.5–1.5 kg per board) for Tier 2 AI accelerator; 3-year ORU replacement cadence for Tier 2 boards; torso structural walls at 2–4 mm Al equivalent for passive bulk shielding. SPE survival is achieved by habitat retreat, not by hardening body-mounted electronics to Carrington-class fluences.

The 7-year design life TID budget at the unshielded surface (140–210 krad, silicon) is reduced by shielding to manageable levels for Tier 1 RHBD parts. For Tier 2 COTS compute, shielding reduces dose rate sufficiently for a 3-year effective lifetime before replacement. The ORU replacement strategy requires the base workshop to have the capability to replace electronics boards, which is a conops and logistics requirement, not merely a design requirement.

Owner: space-environments. Risk if wrong: medium — if Tier 2 SEU/latchup rate under actual lunar radiation exceeds the spot-shielding model prediction, Tier 2 availability degrades faster than planned; the fallback is increased power-cycling frequency (tolerable) or shorter ORU replacement intervals (requires more spares).

### A12. Lunar surface TID: 20–30 krad(Si)/yr at unshielded surface

The environments section uses **20–30 krad(Si)/yr as the GCR-dominated total ionizing dose rate at the unshielded lunar far side surface**. The anchor is the Chang'e-4 LND measurement of ~60 µSv/hr dose equivalent (Wimmer-Schweingruber et al., Science Advances 2020), which translates to approximately 0.53 Gy/yr dose equivalent. The conversion from biologically-weighted dose equivalent to silicon TID depends on the GCR energy spectrum and particle composition; the 20–30 krad(Si)/yr estimate uses an approximate conversion factor for the GCR spectrum at 1 AU without magnetospheric shielding. This conversion has not been independently validated against a silicon TID measurement on the lunar surface.

**Validation required.** If the actual silicon TID rate is significantly higher (e.g., >30 krad/yr), the Tier 2 ORU replacement interval must shorten below 3 years, and the cost estimate for Tier 2 replacement boards increases proportionally. The 7-year TID budget calculation must be repeated against validated silicon TID measurements before PDR.

Owner: space-environments. Risk if wrong: medium — if TID rate is 2× the estimate, Tier 2 boards require replacement every 18 months instead of 3 years; this doubles the spares cost and doubles the crew time for Tier 2 board replacement maintenance. Technology-roadmap-trl must track when a silicon TID measurement at the lunar surface becomes available (from a future lander instrument or from Artemis surface operations data).

### A13. Battery energy density: 160 Wh/kg design-to (space-qualified Li-ion)

The mass-power budget section sizes the power system on **space-qualified lithium-ion cells at 160 Wh/kg design-to**, with 150 Wh/kg as the conservative NTE floor. This represents approximately a 35% penalty relative to state-of-the-art commercial cells (250+ Wh/kg), reflecting radiation screening, vibration qualification, temperature derating, and lot acceptance testing required for space qualification. The heritage anchor is the ISS battery replacement project (2017–2019, lithium-ion at ~160 Wh/kg at cell level).

At 160 Wh/kg, a 2.0 kWh (4-hour EVA sortie at 500 W steady-state) battery requires **12.5 kg of cells**. Total power system (cells + BMS/housing + harness) = **16.9 kg**, which is the largest single allocated mass line item in the budget (22% of design-to).

**Technology gate:** If space-qualified cells achieve 200 Wh/kg by the 2032 hardware definition review, battery cell mass reduces to 10.0 kg, recovering 2.5 kg in the mass budget. Conversely, if operational practice requires a 25% depth-of-discharge reserve (due to cold-temperature capacity derating before warm-up completion at start of sortie), the required cell capacity grows to 2.5 kWh and cell mass grows to 15.6 kg at 160 Wh/kg, consuming ~19% of the 16.8 kg growth allowance. The battery energy density assumption is the single most tractable lever for improving the mass budget without design changes elsewhere.

Owner: humanoid-systems-architect. Risk if wrong: medium-high — battery mass drives §A2 (design-to mass target); if cells remain at commercial space-qualified levels and operational reserves must be increased, power system mass grows and may consume the growth allowance, forcing a budget renegotiation.

[Each agent appends to this register as work progresses. Orchestrator reviews at major checkpoints.]
