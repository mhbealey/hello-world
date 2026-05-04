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
Long assumptions (multi-sentence, with go/no-go gates or cascading consequences): add a one-line summary pointer in the table and a numbered subsection `### AN. Title` below, containing the full text. Use the next available number (current highest: A19).

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
|Actuation type: HD-Electric primary (SSRMS heritage; Atlas Electric is direct-drive benchmark, not HD heritage)|See §A4 below|robotics-actuation-structures|Medium — harmonic flexspline cryogenic TRL is open|
|Structure + actuation mass ≤30 kg design-to; stressed to ~31.6 kg if Class A joints not gravity-optimized|See §A5 below|robotics-actuation-structures|Medium — Class A joint mass sensitivity documented in §A14|
|Joint dust seal: FFKM lip seal at ≥−60°C (heater-maintained); TRL 4 for dynamic joint application in vacuum|See §A6 below|robotics-actuation-structures / space-environments|Medium — dynamic joint sealing in vacuum at −60°C requires validation by 2029; heater network is hard design requirement|
|Sensor suite mass ~2.1 kg, power 37–75 W peak|See §A7 below                               |robotics-sensing-autonomy|Low-medium — sensors are not mass/power driver; TRL gaps are in qualification, not sizing|
|Compute architecture: two-tier RH supervisor + commercial AI accelerator|See §A8 below|robotics-sensing-autonomy|High — no rad-hard AI equivalent exists at TRL > 4; watchdog architecture is the 2035 solution|
|Foundation models used at supervisory layer only (not primary task executor)|See §A9 below|robotics-sensing-autonomy|Medium — if VLA generalization to OOD environments advances faster than expected, this assumption is conservative; if it does not advance, it is the correct constraint|
|Lunar night FSP power reservation: 70–200 W per humanoid unit|See §A10 below|space-environments|Medium — wide parametric range; detailed thermal model required by 2031|
|Radiation hardening: hybrid RHBD + spot shielding + ORU replacement|See §A11 below|space-environments|Medium — Tier 2 ORU replacement strategy requires 3-year cadence and base workshop capability|
|Lunar surface TID: 20–30 krad(Si)/yr at unshielded surface|See §A12 below|space-environments|Medium — LND measurement anchors dose equivalent; silicon TID conversion is spectrum-dependent and requires validation|
|Battery energy density: 160 Wh/kg design-to (space-qualified Li-ion)|See §A13 below|humanoid-systems-architect|Medium-high — drives power system mass (largest single mass line item at 16.9 kg); technology gate at 2032 hardware definition review|
|Actuator mass weighted mean 342 g/joint (budget) vs. 385 g/joint (derived); 1.6 kg overrun risk if Class A not gravity-optimized|See §A14 below|robotics-actuation-structures|Medium — 5% structure+actuation overrun in stressed case; must confirm in Phase A|
|Boot cover replacement interval: 500 surface-hours (parametric, no heritage)|See §A15 below|robotics-actuation-structures / far-side-base-architect|Low-medium — ~7 pairs/year/humanoid consumables; accelerated abrasion test required before ConOps interval treated as credible|
|Locomotion power gait factor: 0.55 (normal gait vs. vigorous locomotion); no direct heritage validation|See §A16 below|humanoid-systems-architect / robotics-actuation-structures|Medium — 800 W cap holds unless gait factor ≥0.84; current margin erodes if factor is 0.75|
|Relay constellation availability ≥95% by IOC; two-satellite minimum architecture assumed|See §A17 below|far-side-base-architect / teleoperation-latency|Medium — single Queqiao-2 provides only 75–85% availability (HIGH uncertainty: estimated for planned 62.4° orbit; confirmed orbit is 119.25° retrograde; actual availability requires geometry analysis)|
|Supervisor ratio: 1:2–3 humanoids per active supervisor at IOC (2035); 1:4–5 at full operation (2040); hard ceiling ~1:8–10|See §A18 below|human-factors-teaming|High — drives crew size, ConOps structure, and cost model; if autonomy TRL curve misses 2035 gate, ratio reverts toward 1:1 until TRL advances|
|Crew composition at IOC: 4 crew, 3 humanoids, periodic supervision as default mode; headroom factor ~2×|See §A19 below|human-factors-teaming|High — primary ConOps and cost input; if maintenance demand exceeds Mir baseline or autonomy TRL misses 2035 gate, crew size must increase|

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

**Updated 2026-05-03 to address HC-001 (Atlas Electric misidentification as harmonic drive heritage).**

The actuation section (`study/01-optimal-space-humanoid/03-actuation-structures.md`) selects **high-ratio harmonic drive electric actuation** for the primary load-bearing joints (hips, knees, ankles, shoulders, elbows), with a hybrid QDD-class approach for low-torque fine-control joints (wrists, fingers). This choice is driven by mass efficiency: HD-Electric achieves the highest torque density of the electric options considered for the joint torque requirements of a 75 kg bipedal humanoid, and the harmonic drive transmission architecture is space-qualified through SSRMS/Canadarm2 heritage on ISS.

**Heritage basis (corrected).** The primary space-heritage citation for harmonic drive actuation is the SSRMS (Canadarm2) joints — seven joints using harmonic drive transmissions with brushless DC motors, space-qualified through continuous ISS service. Harmonic Drive AG CSD/CSF series transmission efficiency is 75–85% at rated load (ratio-dependent), per published technical literature (Schulke et al., ESMATS 2019; ASME J. Mech. Des. 2021). The 2024 Boston Dynamics Atlas Electric achieves 85–90% system-level electrical-to-mechanical efficiency — this is correctly cited as a benchmark for advanced electric actuation generally, but Atlas Electric uses custom fully-rotational direct-drive motors, not harmonic drives. Atlas Electric is not heritage for the HD transmission architecture selected here.

SEA was rejected as the primary architecture on mass grounds — Valkyrie's 129 kg for 44 DOF with SEA throughout is 72% above the 75 kg design-to target.

**Fallback gate:** If the harmonic drive flexspline cryogenic fatigue validation program does not reach TRL 5 by the 2029 program gate, the architecture reverts to selective SEA at major limb joints. This fallback adds an estimated 10–20 kg and requires a mass budget renegotiation with the destinations-trajectories agent.

Owner: robotics-actuation-structures. Risk if wrong: medium — if cryogenic flexspline fatigue life is unacceptable, the fallback is SEA and the mass budget breaks; if the peak power model fails to close, joint heater power (required to maintain joints above −60°C during cold soak) may push the power budget past the §A3 ceiling.

### A5. Structure + actuation mass ≤30 kg design-to (≤39 kg NTE)

**Updated 2026-05-03 to address AE-001 (DOF count reconciliation) and integrate §A14 actuator mass sensitivity.**

The actuation section sets a parametric mass allocation of **30.0 kg design-to / 39.0 kg NTE** for the combined structure and actuation subsystem (primary structure, actuation, joints/sealing, end-effectors). This is 40% of the 75 kg total system design-to mass. The allocation is broken down as: primary structure 8.5 kg (CFRP limb links + Al 7075 nodes), actuation 13.0 kg (38 independently actuated joints at weighted mean ~342 g/joint), joints/seals 4.0 kg, end-effectors 4.5 kg.

**DOF count convention (reconciled 2026-05-03).** The humanoid has 51–55 total kinematic DOF when bilateral joint entries are correctly summed. The 38-joint actuator budget counts independently actuated axes only: hands have 10–12 kinematic DOF each but only 4 independent actuators each (one per finger ray; remaining DOF tendon-coupled). Both counts are correct and measure different things. The 38 number drives the actuator mass budget. See §A14 for the actuator mass derivation and Class A joint sensitivity.

**NTE clarification.** Subsystem NTE values (e.g., 39.0 kg for structure+actuation) are computed as design-to × 1.30 for internal subsystem tracking only — not additive inputs to the system NTE. The system NTE of 97.5 kg is computed once from the 75.0 kg system design-to per NASA-STD-5001. Downstream agents must use system-level figures.

The 8.5 kg structural mass assumes CFRP limb construction. If space-qualification or impact-resistance requirements force a return to aluminum-only limb construction, structural mass increases by approximately 2.5–3.5 kg, breaking the 30 kg budget.

Owner: robotics-actuation-structures. Risk if wrong: medium — Class A joint mass overrun (see §A14) or structural material change would push structure+actuation above 30 kg design-to; either case requires system-level budget renegotiation.

### A6. Joint dust seal: FFKM lip seal at ≥−60°C (heater-maintained); TRL 4 for dynamic joint application

**Updated 2026-05-03 to address AE-010 (FFKM at −180°C is infeasible due to polymer glass transition) and correct the baseline design.**

The actuation section specifies **perfluoroelastomer (FFKM/Kalrez-class) lip seals** as the elastomeric element in the dual-stage labyrinth + lip seal dust mitigation architecture. Standard FFKM compounds are space-qualified for −60°C to +200°C service (ISS heritage in fluid line connectors).

**Baseline design (corrected from prior description).** FFKM compounds glass-transition at approximately −50°C to −70°C and cannot provide dynamic sealing below those temperatures. The prior description of "FFKM seals at −180°C" was physically infeasible. The corrected baseline is: the joint heater network maintains seal zones above −60°C throughout all operational modes including lunar night hibernation. The FFKM seal is always operated within its qualified temperature range. The heater network is a hard design requirement — joints must not reach −60°C regardless of seal architecture. This requirement is carried in the thermal architecture and power budget.

The remaining development item is **dynamic cyclic joint sealing performance of FFKM at −60°C in vacuum with PFPE-lubricated bearing surfaces**. FFKM is qualified at −60°C for static service (ISS fluid line connectors); dynamic joint sealing at this temperature in vacuum has not been demonstrated in a space robot joint context. TRL: 4 (material qualified at this temperature; dynamic joint application in vacuum is a development item). Target: TRL 5 by 2029 program gate.

If dynamic sealing validation fails, the fallback is an all-labyrinth seal architecture (no elastomeric element), which reduces particle rejection effectiveness. The all-labyrinth fallback is viable for multi-year service if the labyrinth geometry exclusion rate is validated by test in a representative lunar regolith environment.

Owner: robotics-actuation-structures (definition), space-environments (execution and validation). Risk if wrong: medium — all-labyrinth fallback is available; risk is lower than the prior description implied because the −60°C dynamic sealing challenge is a development item within an existing qualified material range, not a new materials science problem.

### A7. Sensor suite mass ~2.1 kg design-to, 37–75 W peak power

The sensing section (`study/01-optimal-space-humanoid/04-sensing-autonomy.md`) allocates **~2.1 kg design-to mass** and **37–75 W peak power (10–30 W average with LIDAR duty cycling)** for the full sensor suite. This includes: stereo HDR camera pair + ToF depth unit (head-mounted), two wrist cameras, three-unit redundant MEMS IMU set with spot shielding, two wrist F/T sensors, fingertip tactile arrays, and one solid-state LIDAR.

Sensor mass (~2.8% of 75 kg total) and peak power (~9% of 800 W peak) are modest within system margins. The sensor allocation is not the mass or power driver; TRL gaps in space qualification are the primary risk vector in this subsystem. Key gaps: HDR camera outdoor lunar illumination performance at TRL 4–5; MEMS IMU TID tolerance with spot shielding at TRL 4–5; LIDAR SPAD array radiation hardening at TRL 4; flexible tactile substrate vacuum/thermal cycling at TRL 3–4.

Owner: robotics-sensing-autonomy. Risk if wrong: low-medium — sensors are not mass or power constrained; if space qualification drives mass or power overruns, the impact at system level is small. TRL gap in tactile arrays is the highest-consequence failure mode (reduces manipulation safety margin).

### A8. Compute architecture: two-tier RH supervisor + commercial AI accelerator (watchdog)

The sensing/autonomy section establishes a **two-tier compute architecture**: Tier 1 is a radiation-hardened supervisor processor (RAD750-class, 5–10 W, always-on) running safety-critical deterministic control loops; Tier 2 is a commercial AI inference accelerator (Jetson AGX Orin-class, 15–60 W) running perception pipelines and VLA model inference under Tier 1 watchdog supervision. Total compute mass ~1.8 kg including spot shielding.

This architecture is required because no radiation-hardened AI inference processor equivalent to commercial AI accelerators (Jetson AGX Orin: 275 TOPS INT8 / ~137 TOPS FP16, 15–60 W) exists at TRL > 4 as of 2026. The Tier 2 watchdog approach accepts commercial component SEU/latchup susceptibility as a managed risk: Tier 1 monitors Tier 2 output validity and issues power-cycle resets on detected anomalies. Spot-shielding (5–10 mm Al/Ta laminate, ~0.8 kg) reduces latchup rate by 2–3 orders of magnitude for SPE proton events; GCR HZE ion shielding effectiveness is more limited at the relevant energies.

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

The environments section uses **20–30 krad(Si)/yr as the GCR-dominated total ionizing dose rate at the unshielded lunar far side surface**. The anchor is the Chang'e-4 LND measurement of ~60 µSv/hr dose equivalent (Zhang et al., Science Advances 2020), which translates to approximately 0.53 Gy/yr dose equivalent. The conversion from biologically-weighted dose equivalent to silicon TID depends on the GCR energy spectrum and particle composition; the 20–30 krad(Si)/yr estimate uses an approximate conversion factor for the GCR spectrum at 1 AU without magnetospheric shielding. This conversion has not been independently validated against a silicon TID measurement on the lunar surface.

**Validation required.** If the actual silicon TID rate is significantly higher (e.g., >30 krad/yr), the Tier 2 ORU replacement interval must shorten below 3 years, and the cost estimate for Tier 2 replacement boards increases proportionally. If the conversion factor is 2× the nominal estimate, the 7-year unshielded budget becomes 280–420 krad and Tier 2 shielded lifetime may shorten to 18 months or less. The 7-year TID budget calculation must be repeated against validated silicon TID measurements before PDR.

Owner: space-environments. Risk if wrong: medium — if TID rate is 2× the estimate, Tier 2 boards require replacement every 18 months instead of 3 years; this doubles the spares cost and doubles the crew time for Tier 2 board replacement maintenance. Technology-roadmap-trl must track when a silicon TID measurement at the lunar surface becomes available (from a future lander instrument or from Artemis surface operations data).

### A13. Battery energy density: 160 Wh/kg design-to (space-qualified Li-ion)

The mass-power budget section sizes the power system on **space-qualified lithium-ion cells at 160 Wh/kg design-to**, with 150 Wh/kg as the conservative NTE floor. This represents approximately a 35% penalty relative to state-of-the-art commercial cells (250+ Wh/kg), reflecting radiation screening, vibration qualification, temperature derating, and lot acceptance testing required for space qualification. The heritage anchor is the ISS battery replacement project (2017–2019, lithium-ion at ~155–160 Wh/kg at cell level per NTRS documentation).

At 160 Wh/kg, a 2.0 kWh (4-hour EVA sortie at 500 W steady-state) battery requires **12.5 kg of cells**. Total power system (cells + BMS/housing + harness) = **16.9 kg**, which is the largest single allocated mass line item in the budget (22% of design-to).

**Technology gate:** If space-qualified cells achieve 200 Wh/kg by the 2032 hardware definition review, battery cell mass reduces to 10.0 kg, recovering 2.5 kg in the mass budget. Conversely, if operational practice requires a 25% depth-of-discharge reserve (due to cold-temperature capacity derating before warm-up completion at start of sortie), the required cell capacity grows to 2.5 kWh and cell mass grows to 15.6 kg at 160 Wh/kg, consuming ~19% of the 17.3 kg growth allowance. The battery energy density assumption is the single most tractable lever for improving the mass budget without design changes elsewhere.

Owner: humanoid-systems-architect. Risk if wrong: medium-high — battery mass drives §A2 (design-to mass target); if cells remain at commercial space-qualified levels and operational reserves must be increased, power system mass grows and may consume the growth allowance, forcing a budget renegotiation.

### A14. Actuator mass sensitivity: 342 g/joint budget vs. 385 g/joint derived; Class A joint gravity-optimization required

**Added 2026-05-03 to address AE-004 / RM-003 findings.**

The 38-joint actuator mass budget (13.0 kg design-to) uses a three-class weighted parametric derivation. No single published space-qualified actuator assembly at the combined torque class and mass target of this program exists; the derivation uses commercial catalog masses as bounds.

**Three-class breakdown:**
- Class A (12 locomotion joints, hips/knees/ankles): 780 g/joint design-to. Anchor: Harmonic Drive AG CSF-20 component set (rated ~230 N·m peak, catalog mass ~460–500 g for transmission alone per Harmonic Drive AG CSF/CSG catalog) plus brushless motor for this torque class (~220 g, comparable to Unitree M107 published motor specifications) plus encoder and housing (~60–100 g). Assembled range: 740–820 g.
- Class B (8 upper-body load joints, shoulders/elbows): 400 g/joint design-to. Anchor: Harmonic Drive AG CSF-14 component set (rated ~50 N·m peak, catalog mass ~200–230 g) plus motor (~120 g) plus encoder and housing. Assembled range: 370–430 g.
- Class C (18 fine-control joints, neck/torso/wrists/hands): 115 g/joint design-to. Small QDD-class motors with minimal gearing; range 80–150 g.

**Weighted derived total:** (12 × 780) + (8 × 400) + (18 × 115) = 9,360 + 3,200 + 2,070 = **14,630 g / 38 joints = 385 g/joint mean, 14.6 kg total.**

The 13.0 kg budget line (342 g/joint) is achievable only if Class A joints are optimized to approximately 680 g. This is physically defensible: the humanoid operates in lunar 1/6 g, and peak locomotion joint torques scale approximately with the gravity ratio. Class A joints designed for lunar-only service need roughly 25% of terrestrial peak torque for normal walking, permitting a lighter motor selection. This gravity-optimization lever must be quantified in Phase A actuation sizing.

**If Class A joints remain at 780 g:** actuation budget grows to 14.6 kg, pushing structure+actuation total to ~31.6 kg design-to — a 5% overrun against the 30.0 kg constraint. This is within concept-phase uncertainty; it does not invalidate the system-level 75 kg budget, but it consumes mass margin.

Space-qualification mass growth (10–20% above terrestrial catalog masses) for radiation screening, vacuum grease, outgassing compliance, and thermal seal validation is included implicitly in the Class A uncertainty range.

Owner: robotics-actuation-structures. Risk if wrong: medium — 5% structure+actuation overrun in the stressed case; must be confirmed or closed in Phase A before mass budget is treated as locked.

### A15. Boot cover replacement interval: 500 surface-hours (parametric, no heritage)

**Added 2026-05-03 to address RM-017 finding.**

The actuation section assumes disposable Vectran/Zylon foot covers are replaced at **500 surface-hours** per pair. This interval is parametric with no heritage in a representative lunar dust environment.

**Consumables manifest consequence.** At 500-hour replacement intervals and a humanoid operating approximately 300 surface-hours per lunar month, annual resupply is approximately 7 pairs of boot covers (~1.4 kg/year/humanoid at ~0.2 kg/pair). For a three-humanoid deployment, annual boot cover resupply is ~4.2 kg. This must appear in the far-side-base-architect's logistics model and the cost-program spares manifest. If the actual wear rate is 2× faster (250-hour interval), annual resupply doubles to ~2.8 kg/humanoid.

**Validation path.** Accelerated abrasion testing in JSC-1A or NU-LHT-2M lunar regolith simulant, combined with vacuum and representative thermal cycling, is required before the replacement interval can be treated as credible for ConOps planning. No identified test facility currently combines all three conditions at representative contact pressures. Test facility definition is a pre-PDR deliverable. Assign to space-environments agent and far-side-base-architect.

Owner: robotics-actuation-structures (interval definition), far-side-base-architect (consumables manifest), space-environments (test program definition). Risk if wrong: low-medium — if wear rate is materially higher, resupply mass and crew servicing time increase; neither is program-threatening at these quantities, but both affect operational availability estimates.

### A16. Locomotion power gait factor: 0.55 (normal gait vs. vigorous locomotion)

**Added 2026-05-03 to address P2-5 / RM-002 findings. Assigned §A16 because §A14 and §A15 were populated by Batch 1 of the Stage 6 remediation pass.**

The locomotion actuation power budget (260 W design-to) is derived from the Valkyrie heritage figure scaled to the space humanoid mass and actuator efficiency, then multiplied by a 0.55 factor for normal gait vs. vigorous locomotion. This factor is a parametric assumption with no direct heritage validation for this platform.

**Basis:** At vigorous gait (sprint/terrain-clearing), the derivation yields ~470 W locomotion actuation. The 0.55 factor reduces this to ~260 W for normal walking pace (≤1.0 m/s on prepared paths), consistent with general expectations from bipedal dynamics but not validated by a task-level simulation of this specific platform in 1/6-g lunar gravity.

**Technology gate:** The task-level gait power simulation referenced in §03 Section 5, item 3, must validate or revise this factor before the 2032 hardware definition review. If the factor is 0.75 rather than 0.55, locomotion power grows to ~350 W; the full locomotion+manipulation mode total grows from 474 W to ~564 W (pre-margin), yielding ~733 W with 30% margin — still within the 800 W cap but with reduced margin (67 W vs. 184 W currently). The 800 W cap is not broken until the gait factor reaches ~0.84, so there is headroom, but the budget's 184 W current margin would erode substantially at a factor of 0.75.

Owner: humanoid-systems-architect (locomotion power), with input from robotics-actuation-structures (gait simulation). Risk if wrong: medium — the 800 W cap is not broken until the gait factor reaches ~0.84, so there is headroom, but the budget's 184 W current margin would erode substantially.

### A17. Relay constellation availability: ≥95% by IOC; two-satellite minimum required

**Added 2026-05-03 by teleoperation-latency. Updated 2026-05-03 (Stage 8 enforcement pass) to incorporate Queqiao-2 confirmed orbit correction and HIGH uncertainty flag.**

The latency tradespace analysis establishes that **>95% simultaneous Earth and far-side line-of-sight coverage** is required for relay-supported supervisory operations from Earth to be an effective mission oversight mechanism. This availability floor is derived from the operational requirement that relay outages must be rare enough that they do not dominate mission planning — if outages are frequent, ConOps must be designed around autonomous operations rather than Earth oversight, which is a different and more demanding TRL requirement for the autonomy stack.

**Single-asset shortfall.** Queqiao-2 provides approximately 75–85% availability of simultaneous dual-line-of-sight coverage for a receiver at the equatorial far side. **Availability estimate uncertainty flag (HIGH): the 75–85% estimate was derived for the planned 62.4° inclination / 200 × 16,000 km orbit. The confirmed operational orbit is ~119.25° retrograde / 254 × 16,941 km — a substantially different geometry. Availability for the confirmed retrograde orbit requires dedicated geometry analysis. Program should not rely on >60% availability until confirmed orbital geometry analysis is complete.** A two-satellite constellation phased 180° apart in a consistent orbital family would provide >95% availability. The far-side-base-architect must carry this as an infrastructure prerequisite for the IOC milestone, not a growth option.

**Outage behavior.** During relay outages under the single-asset scenario, the humanoid must autonomously detect link loss, complete or safely halt current operations, and hold a recoverable posture until link restoration. This is a concrete functional requirement on the autonomy stack with TRL 5 required at 2029 and TRL 7 required at 2035 IOC. It feeds directly to autonomy-trl-tasking.

**Path dependency.** If the relay constellation reaches ≥95% availability before IOC, the study's Earth-oversight model for scheduled operations is validated. If it does not, the ConOps must be revised to treat Earth oversight as advisory-only, with the forward-deployed crew carrying full supervisory authority for all time-critical operations.

Owner: far-side-base-architect (relay infrastructure), teleoperation-latency (availability requirement definition), autonomy-trl-tasking (outage autonomous behavior TRL). Risk if wrong: medium — if the relay constellation is not at ≥95% by IOC, the autonomous safe-mode behavior must cover a higher fraction of operations, increasing the TRL pressure on the autonomy stack at the 2035 gate.

### A18. Supervisor ratio: 1:2–3 humanoids per active supervisor at IOC (2035); 1:4–5 at full operation (2040)

**Added 2026-05-03 by human-factors-teaming (orchestrator completing missing closing action).**

**Position:** 1 human actively supervising 2–3 humanoids at IOC (2035). 1 human to 4–5 humanoids at full operation (2038–2040). Hard ceiling approximately 1:8–10 regardless of TRL due to human value floor saturation in a 4-person crew.

**Derivation (five-step justification chain from §02-04 Section 3):**

Step 1 — NIP-10 heritage baseline: 5 humans per rover at near-zero autonomy and 2.5 s RTLT (Lunokhod NIP-10 model). This is the empirical floor.

Step 2 — §A1 autonomy curve advancement: At TRL 7 deliberative layer (2035 IOC), 12 of 20 tasks are autonomy-led. Per-task supervision demand drops from the NIP-10 continuous-control posture (~1.0 person-hr/robot-hr) to on-demand monitoring (~0.05 person-hr/robot-hr) for those tasks.

Step 3 — Cognitive load arithmetic: 4 crew supervising 3 humanoids generates approximately 4.25 person-hours of supervisory demand per shift against 8 person-hours of available capacity. During any given hour, 2–3 humanoids are in autonomous execution and 0–1 crew members are actively supervising. Peak demand (2 supervisors for 3 humanoids) yields 1:1.5 effective; nominal operations yield 1:3 effective.

Step 4 — Post-2035 TRL advancement: At TRL 8 (2038–2040), 16–17 of 20 tasks are autonomy-led. On-demand supervisory demand per humanoid drops further; 1 human can credibly oversee 4–5 humanoids without saturating supervisory capacity.

Step 5 — Hard ceiling: The human value floor (7 permanently human-required task categories) defines a minimum active engagement per humanoid per shift that cannot be automated. In a 4-person crew with 8–10 humanoids, value-floor tasks would consume essentially all available supervisory capacity, creating the ~1:8–10 ceiling regardless of TRL.

Owner: human-factors-teaming (ratio definition and derivation), conops-integrator (operational validation in sortie day structure), cost-program (crew size requirement). Risk if wrong: medium — if actual supervision demand per humanoid is higher (e.g., Mir-baseline maintenance absorption exceeds 40%), headroom compresses faster and the IOC ratio may be optimistic. Sensitivity is explored in §02-04 Section 2.

---

### A19. Crew composition at IOC: 4 crew, 3 humanoids; headroom factor ≥2×

**Added 2026-05-03 by human-factors-teaming (orchestrator completing missing closing action).**

**Position:** Baseline crew composition at IOC (2035) is 4 crew members and 3 humanoids. The default operating mode is periodic supervision. Total supervisory demand is approximately 4.25 person-hours per crew shift; available supervisory capacity (Mir heritage baseline of 25–30% of crew time available for supervision at 4-person crew scale) is approximately 8 person-hours per shift. Headroom factor: approximately 2×.

**Demand derivation:**
- 12 autonomy-led tasks: ~0.05 person-hr/robot-hr × 3 robots × 8 hr operational window = ~1.2 person-hr/shift
- 6 jointly-executed tasks: ~0.2 person-hr/robot-hr × 3 robots × 5 hr active window = ~3.0 person-hr/shift  
- Total: ~4.2 person-hr/shift (rounded to 4.25 with scheduling overhead)

**Capacity derivation:**
- Mir heritage: 30–40% of crew time absorbed by maintenance (life support, systems, habitat). With maintenance absorption at 35%, a 12-hour crew waking period leaves approximately 65% = 7.8 hours for other activities. For supervisory activities specifically, the fraction available without competing with science, EVA prep, and personal time is 25–30%, or approximately 3 hours per crew member per shift. For 4 crew: 4 × 2 hours ≈ 8 person-hr/shift (conservative estimate).

**Sensitivity:** If maintenance absorption rises to 50% (Mir high-demand periods), available supervisory capacity drops to approximately 5–6 person-hr/shift. Headroom compresses to 1.2–1.4×. The ConOps agent must model this scenario.

Owner: human-factors-teaming (crew composition definition), conops-integrator (shift structure validation), cost-program (crew operations cost baseline), far-side-base-architect (habitation and workstation sizing), destinations-trajectories (lander manifest: 3 humanoids × 75 kg = 225 kg humanoid mass at IOC). Risk if wrong: medium — if maintenance absorption is at the high end of Mir heritage, supervisory headroom is tighter than the 2× baseline; if autonomy-led fraction is lower than §A1 predicts, demand rises. Both risks are captured as sensitivity cases in §02-04.

---

[Each agent appends to this register as work progresses. Orchestrator reviews at major checkpoints.]
