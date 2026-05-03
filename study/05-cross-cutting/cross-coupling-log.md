---
title: Cross-Coupling Log
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Cross-Coupling Log

This file records architectural decisions, parameter values, and positions that downstream agents depend on. When a number or position is set here, all agents listed under "Affects" must be notified and must update their artifacts if the decision changes their scope.

## Format

```
## YYYY-MM-DD — Parameter name
**Parameter:** what was decided
**Value:** the specific value, range, or position
**Set by:** which agent or process set it
**Affects:** list of agents whose work depends on this
**Basis:** why this value was chosen
```

---

## 2026-05-03 — Autonomy TRL curve

**Parameter:** Humanoid autonomy TRL trajectory (study assumption)
**Value:** TRL 6 (space-relevant environments) by ~2029 → TRL 7+ (space-relevant) by ~2035 → TRL 8 (qualified, operational environment) by ~2038-2040
**Set by:** orchestrator (resolution of stage 4 contradiction between two incompatible registry entries)
**Affects:** autonomy-trl-tasking, human-factors-teaming, conops-integrator, technology-roadmap-trl, cost-program, far-side-base-architect (deployment timeline)
**Basis:** Study assumption with explicit go/no-go gates at each milestone. Not a forecast. See §A1 in `study/05-cross-cutting/margins-and-assumptions.md` for full text. If the 2029 gate is missed, the deployment timeline slips proportionally; if the 2035 gate is missed, the teaming model defaults to higher human-in-the-loop ratios.

---

## 2026-05-03 — Form factor position

**Parameter:** Space humanoid primary form factor
**Value:** Full bipedal humanoid — two legs, two arms, two dexterous hands, anthropomorphic geometry, standing height 1.5–1.9 m, design-to mass 75 kg, not-to-exceed mass 97.5 kg (30% margin)
**Set by:** humanoid-systems-architect
**Affects:** robotics-actuation-structures, robotics-sensing-autonomy, space-environments, humanoid-systems-architect (budget), conops-integrator
**Basis:** Tradespace of five candidates weighted against seven criteria; bipedal form scores highest (3.65/5.00) driven by human tool and environment compatibility (C1, weight 0.25) — the lunar far side base is built for humans, and maintaining dual tool and infrastructure standards for a non-human-geometry robot over a 20-year permanent base lifetime is more costly than the locomotion and mass penalties of the bipedal form. Centaur is the close second (3.55); it becomes the correct answer if the base infrastructure is designed for robots before crew arrival, which the current program timeline does not support. Four end-effectors (feet and hands) must support both bipedal surface locomotion and handrail-grasp zero-g mobility as first-class modes — this requirement flows directly from the FEDOR/Skybot F-850 negative lesson.

---

## 2026-05-03 — Actuation architecture

**Parameter:** Primary joint actuation type for the space humanoid
**Value:** High-ratio harmonic drive electric (HD-Electric) for load-bearing joints (hips, knees, ankles, shoulders, elbows); hybrid QDD-class for low-torque fine-control joints (wrists, fingers, ankle fine-axis). Hydraulic actuation eliminated. SEA retained as fallback if harmonic flexspline cryogenic validation fails by 2029 gate.
**Set by:** robotics-actuation-structures
**Affects:** space-environments (thermal architecture for joint heaters; seal material development), humanoid-systems-architect (mass-power budget — actuator mass fraction and peak power validation), technology-roadmap-trl (harmonic flexspline cryogenic TRL gap must close by 2029), fault-management-sustainment (ORU replacement strategy for actuator modules), cost-program (actuator unit cost heritage)
**Basis:** HD-Electric offers best mass efficiency (Atlas Electric: 89 kg, 56 DOF, 85–90% efficiency) at required torque levels. SEA mass penalty is prohibitive at 75 kg target (Valkyrie: 129 kg, 44 DOF). QDD joint-resident motor mass creates unfavorable distribution for full-body humanoid. Hydraulic eliminated for outgassing risk in vacuum and non-serviceability in EVA context. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 1.

---

## 2026-05-03 — Joint count and DOF architecture

**Parameter:** Nominal joint count and DOF allocation for the space humanoid
**Value:** 38 DOF nominal (range 36–40), distributed: neck 3, torso 2, arms 4 DOF each (shoulder 3 + elbow 1), wrists 3 DOF each, hands 10–12 DOF each, hips 3 DOF each, knees 1 DOF each, ankles 2 DOF each
**Set by:** robotics-actuation-structures
**Affects:** robotics-sensing-autonomy (joint state sensing requirements, control loop count), humanoid-systems-architect (mass-power budget — 38-joint allocation feeds actuator mass table), conops-integrator (task capability envelope), fault-management-sustainment (joint failure mode catalog)
**Basis:** Calibrated against R2 42-DOF torso+arm+hand heritage (ISS-deployed task set) and Valkyrie 44-DOF space-intent design. Reduction to 38 by cutting torso DOF from 3 to 2 and reducing hand DOF to minimum sufficient for EVA tool grasp per R2 design intent. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 2.

---

## 2026-05-03 — Structure + actuation mass allocation

**Parameter:** Structure and actuation mass design-to target
**Value:** 30.0 kg design-to / 39.0 kg NTE (30% margin) for primary structure + actuation + joints/sealing + end-effectors combined. This is 40% of the 75 kg total system design-to mass.
**Set by:** robotics-actuation-structures
**Affects:** humanoid-systems-architect (mass-power budget section must close remaining 45 kg design-to across sensors, compute, power, thermal, consumables, fluid lines), destinations-trajectories (lander manifest assumes 75 kg / 97.5 kg NTE total system), cost-program
**Basis:** Parametric breakdown: primary structure 8.5 kg (CFRP + Al hybrid), actuation 13.0 kg (38 joints × ~340 g mean actuator mass), joints/seals 4.0 kg, end-effectors 4.5 kg = 30.0 kg total. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 4.

---

## 2026-05-03 — Dust mitigation primary strategy

**Parameter:** Primary dust mitigation approach for joint architecture
**Value:** Dual-stage labyrinth + single elastomeric lip seal (perfluoroelastomer, FFKM-class) for all load-bearing joints; disposable Vectran/Zylon boot covers for foot/ankle assemblies at 500-hour parametric replacement interval
**Set by:** robotics-actuation-structures
**Affects:** space-environments (FFKM cryogenic validation program; TRL 3 → TRL 5 required by 2029 gate), fault-management-sustainment (boot cover consumables manifest and replacement procedure), far-side-base-architect (consumables resupply manifest for boot covers), technology-roadmap-trl (seal material development on critical path)
**Basis:** Labyrinth seals have TRL 7–8 in terrestrial contaminated industrial environments. FFKM elastomers have ISS heritage in fluid line connectors at −60°C to +200°C; extension to −180°C is a development item at TRL 4. Active gas purge rejected (continuous supply dependency). Graceful degradation rejected (permanent base multi-year horizon). See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 3.

---

## 2026-05-03 — Sensor suite mass and power allocation

**Parameter:** Sensor suite mass and power envelope for the space humanoid
**Value:** ~2.1 kg design-to mass, 37–75 W peak power (10–30 W average accounting for LIDAR duty cycling). Includes: stereo HDR camera + ToF depth (head), wrist cameras, IMU (3-unit redundant), wrist F/T sensors, fingertip tactile arrays, solid-state LIDAR.
**Set by:** robotics-sensing-autonomy
**Affects:** humanoid-systems-architect (mass-power budget section 01-06 must close sensors + compute at ~3.9 kg and ~60–150 W peak against the 45 kg / 800 W envelopes remaining after structure+actuation), space-environments (radiation qualification program for LIDAR SPAD arrays and MEMS IMUs), technology-roadmap-trl (HDR camera outdoor qualification, tactile flexible substrate TRL gap are on critical path to 2029 gate)
**Basis:** Parametric sizing from commercial humanoid sensor suite heritage (Digit: 4× Intel RealSense + LIDAR + MEMS IMU; Valkyrie: MultiSense SL stereo head + F/T sensors; R2: 350+ sensors including wrist-mounted F/T and fingertip tactile). Space-specific modifications: HDR cameras for extreme contrast outdoor conditions; spot-shielded MEMS IMUs for radiation TID; solid-state LIDAR with duty cycling for power management. See `study/01-optimal-space-humanoid/04-sensing-autonomy.md` Section 1.

---

## 2026-05-03 — Onboard compute architecture (two-tier)

**Parameter:** Compute architecture for onboard autonomy inference
**Value:** Two-tier: (1) radiation-hardened supervisor processor (RAD750-class, 5–10 W, always-on, runs safety-critical control loops only) + (2) commercial AI inference accelerator (Jetson AGX Orin-class, 15–60 W, watchdog-managed, runs perception pipeline and VLA model). Total compute mass ~1.8 kg including spot shielding. Cloud-connected inference architecturally excluded.
**Set by:** robotics-sensing-autonomy
**Affects:** humanoid-systems-architect (compute power 22–75 W peak must be carried in mass-power budget 01-06), technology-roadmap-trl (no rad-hard AI-inference equivalent of Jetson AGX Orin exists at TRL > 4; DARPA HPSC and similar programs are on the critical path if watchdog architecture is to be simplified before 2035), space-environments (Tier 2 single-event latchup rate under lunar radiation environment; spot-shielding mass allocation), fault-management-sustainment (Tier 2 power-cycle reset procedure as nominal fault response)
**Basis:** Two-tier architecture precedented by Mars Science Laboratory compute hierarchy (RAD750 flight computer + instrument-local processors). No rad-hard equivalent of commercial AI-inference hardware exists at TRL > 4 as of 2026; watchdog architecture is the operational solution through 2035 deployment window. See `study/01-optimal-space-humanoid/04-sensing-autonomy.md` Section 2.

---

## 2026-05-03 — Autonomy/teleoperation boundary (provisional)

**Parameter:** Provisional allocation of tasks between fully autonomous, human-supervised, and human-controlled operation (by 2035 deployment baseline)
**Value:** Fully autonomous by 2035: routine locomotion on prepared paths, sensor data collection, pre-scripted maintenance, health monitoring, safe-mode transitions. Human-supervised: novel manipulation, EVA tool handoff with crew, PSR operations, emergency response, pressurized interface operations. Human-controlled always: life-safety decisions, irreversible actions beyond robot, crew-override of any autonomous execution.
**Set by:** robotics-sensing-autonomy (provisional; to be refined by autonomy-trl-tasking and human-factors-teaming)
**Affects:** autonomy-trl-tasking (must validate boundary against TRL curve and task catalog), human-factors-teaming (crew workload model depends on fraction of tasks requiring supervision), teleoperation-latency (must quantify whether relay latency permits ground-in-the-loop supervision for the human-supervised task categories), conops-integrator (mission timeline must allocate crew time for supervision gates), fault-management-sustainment (safe-mode transition procedures and crew override hardware design)
**Basis:** Boundary calibrated against §A1 autonomy TRL curve (TRL 7+ in space-relevant environments by 2035) and Mars rover AutoNav heritage (flight-qualified autonomous traverse planning and execution at TRL 8 since 2014). Life-safety and irreversible-action categories are program/ethical constraints, not TRL-dependent. Avatar-mode teleoperation (FEDOR heritage) is retained as the anomaly fallback for any task where autonomous execution fails. See `study/01-optimal-space-humanoid/04-sensing-autonomy.md` Section 5.

---

## 2026-05-03 — Lunar night thermal power reservation and survival mode

**Parameter:** FSP power reservation for humanoid thermal survival during lunar night; survival mode definition
**Value:** 70–200 W continuous draw from Fission Surface Power during lunar night hibernation per humanoid unit (50–150 W electronics/battery survival heaters + 20–50 W joint heaters for 12 primary HD-Electric joints). Survival mode: Tier 1 RH supervisor processor only powered; Tier 2 AI accelerator off; locomotion off; battery maintained at ~30% SOC. Estimated warm-up time to partial operability: 15–30 minutes from crew wake command; full operability: 45–90 minutes.
**Set by:** space-environments
**Affects:** humanoid-systems-architect (mass-power budget §01-06 must carry 70–200 W lunar night power reservation); far-side-base-architect (FSP power allocation must reserve humanoid thermal load across full lunar night; with 3 humanoids deployed simultaneously, reservation grows to 210–600 W); conops-integrator (mission timeline must reflect ~45–90 min warm-up period; humanoid is not immediately available at start of lunar day without pre-warming); fault-management-sustainment (survival mode transition triggers and recovery procedures; Tier 1 RH supervisor as sole active process during hibernation)
**Basis:** Parametric estimate anchored to Mars rover WEB survival heater heritage (~100 W-hr/night cold case, Curiosity/Perseverance); scaled for the 14-day lunar night and humanoid electronics volume. Joint heater estimate from HD-Electric lubrication floor (PFPE grease) at −60°C minimum. Range is wide because no detailed thermal model of the bipedal form factor exists; this is flagged as TRL 2 (parametric only) requiring detailed model by 2031 and test validation before PDR. See Section 01-05 §2.

**2026-05-03 — Confirmed §05 value as 50–150 W (electronics/battery survival heaters); §06 should align to this value.** The 50–150 W range is defensible because the thermally critical electronics are torso-concentrated and the torso compartment can be MLI-blanketed analogously to a rover WEB; the bipedal limb surface area does not drive the electronics heater budget. The principal uncertainty is thermal cross-coupling between torso and limb linkages, which a detailed model must quantify. The §06 range of 85–175 W (used in the current budget closure narrative) is inconsistent with the §05 source value and must be corrected by humanoid-systems-architect to 50–150 W before the budget closure narrative is revised.

---

## 2026-05-03 — Radiation hardening strategy (hybrid)

**Parameter:** Electronics radiation hardening approach for space humanoid
**Value:** Hybrid strategy: (1) RHBD parts (RAD750-class) for Tier 1 safety-critical processor; (2) RHBD for critical motor controller and safety-monitor ICs where available; (3) COTS + spot shielding (5–10 mm Al, 0.5–1.5 kg per board) for Tier 2 AI accelerator and non-critical sensing electronics, with 3-year ORU replacement plan for Tier 2 boards; (4) torso structural walls at 2–4 mm Al equivalent for passive bulk shielding. 7-year TID budget at surface: 140–210 krad (silicon) without shielding. SPE survival requirement: humanoid returns to pressurized habitat on SPE warning — body electronics not required to survive direct Carrington-class SPE exposure.
**Set by:** space-environments
**Affects:** humanoid-systems-architect (mass-power budget §01-06 must carry 0.5–1.5 kg for electronics compartment shielding walls; Tier 2 board mass must account for ORU replacement in spares manifest); fault-management-sustainment (Tier 2 board replacement as a scheduled 3-year ORU; SPE shelter mode as a nominal fault response procedure; procedure must be executable without ground contact — Tier 1 can autonomously initiate shelter return on radiation monitor threshold); conops-integrator (SPE shelter return within 15–30 minutes of warning must be explicit in ConOps; Section 03 must define the shelter procedure); far-side-base-architect (pressurized habitat or dedicated shielded location must provide ~20 g/cm² Al-equivalent shielding for SPE survival; must confirm this shielding depth in habitat wall + regolith berm design); technology-roadmap-trl (Tier 2 ORU replacement cadence is a program logistics commitment from 2035 onward; spares cost must be in cost-program estimates)
**Basis:** 7-year design life at ~20–30 krad/yr surface (Chang'e-4 LND measurement, Zhang et al. 2020, silicon TID estimate) = 140–210 krad budget. COTS compute TID tolerance ~10 krad without shielding — requires shielding mitigation. 5–10 mm Al spot shielding reduces dose rate by 3–5× for GCR. Combined with 3-year ORU replacement, COTS Tier 2 is viable through 7-year design life. SPE survival by habitat retreat eliminates need to harden body-mounted electronics to Carrington-class fluences. See Section 01-05 §3.

---

## 2026-05-03 — System-level dust mitigation (optical, thermal, connectors)

**Parameter:** System-level dust mitigation beyond joint seals
**Value:** (1) Optical sensors: spring-loaded passive covers (ExoMars heritage TRL 7) + scheduled pre-task brushing; EDD (electrostatic dust deflection) as growth option at TRL 4 only. (2) Thermal radiators: smooth high-emissivity coatings (ε ≥ 0.85 BOL), design to ε = 0.70 EOL (18–24% emissivity margin); smooth hard coatings resistant to dust adhesion; manual cleaning by crew. (3) Connectors: spring-loaded dust caps + N₂ purge at mate/demate; N₂ canister (~0.2–0.5 kg) in consumables manifest. All caps and covers must be EVA-glove operable.
**Set by:** space-environments
**Affects:** humanoid-systems-architect (mass-power budget §01-06 must carry optical cover masses ~15–60 g per aperture; N₂ purge canister ~0.2–0.5 kg in consumables line); far-side-base-architect (consumables resupply manifest for N₂ purge canisters; base workshop must support optical cover replacement and radiator cleaning procedures); fault-management-sustainment (pre-task optical cleaning as nominal procedure; cover actuator failure mode and manual override requirement); conops-integrator (pre-task sensor cleaning adds ~5 minutes to EVA preparation procedure; must appear in mission timeline)
**Basis:** ExoMars camera cover TRL 7 heritage. Mars solar panel dust degradation rates (2–5%/month, MER heritage) used as conservative proxy for lunar radiator emissivity degradation; actual lunar dust adhesion rate may differ significantly (electrostatic mechanism vs. gravitational settling on Mars) and must be measured. See Section 01-05 §4.

---

## 2026-05-03 — Mass and power budget closure (Question a integration)

**Parameter:** Closed mass and power budget for the space humanoid — key output numbers for all downstream agents
**Value:** Total dry mass design-to: **75.0 kg** (allocated subsystems: 58.2 kg + system growth allowance: 16.8 kg). Not-to-exceed: **97.5 kg** (30% margin per NASA-STD-5001). Power: full locomotion + manipulation **616 W with margin** (vs. 800 W cap); stationary manipulation **432 W with margin** (vs. 500 W goal); lunar night hibernation **148–304 W with margin** (lower bound closes vs. 150 W goal; upper bound does not close — thermal model required). Battery: **2.0 kWh** at **160 Wh/kg** space-qualified Li-ion = **12.5 kg cells** + 2.5 kg BMS/housing + 1.9 kg harness = **16.9 kg power system total**. Largest mass line item is the power system (22% of design-to). Primary unresolved risk is the lunar night thermal power draw (70–200 W parametric range, TRL 2).
**Set by:** humanoid-systems-architect
**Affects:** destinations-trajectories (lander manifest: use 75 kg design-to / 97.5 kg NTE as the per-unit manifest number); cost-program (unit mass drives parametric cost; 2.0 kWh space-qualified battery and 3-year Tier 2 ORU replacement cadence are recurring cost drivers); conops-integrator (sortie battery life 4 hours; recharge time ~8 hours; hibernation warm-up 15–30 min partial / 45–90 min full operability); far-side-base-architect (peak FSP demand per humanoid 616 W; average operational demand ~450 W; lunar night FSP reservation 300 W with margin per unit until thermal model closes — three humanoids require ~900 W FSP reservation through each lunar night)
**Basis:** Budget integrates §03 (structure + actuation 30.0 kg), §04 (sensors 2.1 kg + compute 1.8 kg), §05 (electronics shielding 1.0 kg, thermal 3.0 kg, consumables 0.9 kg), and battery derivation in §06 (16.9 kg). Growth allowance 16.8 kg = 29% of allocated subsystems, consistent with concept-phase MGA practice for hardware primarily below TRL 5. See `study/01-optimal-space-humanoid/06-mass-power-budget.md`.

---

## 2026-05-03 — Autonomy TRL 6/2029 gate minimum observable defined

**Parameter:** TRL 6 gate minimum observable for §A1 autonomy TRL curve
**Value:** A first-article space-heritage or space-analog bipedal humanoid (or a high-fidelity locomotion testbed at the study design's mass and form factor: 75 kg, bipedal, 38 DOF nominal) must demonstrate unscripted bipedal locomotion on JSC-1A or ISAC lunar regolith simulant in a 1/6-g offload facility for a minimum of 30 continuous minutes without operator intervention, including at least one unplanned terrain feature encounter. Thermal/vacuum testing is not required for TRL 6 (that is TRL 7). The demonstration must run by Q4 2028 to allow data review before the 2029 gate decision. A failed or operator-intervened demonstration does not close the gate. If the gate slips past Q2 2029, the 2035 IOC date must be renegotiated. Per-layer TRL targets at the 2029 gate: reactive layer TRL 6; deliberative layer TRL 5; supervisory layer TRL 5.
**Set by:** robotics-sensing-autonomy (stage 6 remediation)
**Affects:** technology-roadmap-trl (must name the first-gate program — facility, platform, test objectives, lead organization, rough cost bracket, schedule — in stage 7; the Q4 2028 demonstration is the first concrete milestone on the critical path); autonomy-trl-tasking (must validate the gate criteria against the TRL curve and flag if any layer is on a path to miss the 2029 gate); conops-integrator (first-article availability timeline affects when ConOps validation can begin); cost-program (first-gate demonstration program cost must appear in the technology investment estimate)
**Basis:** DA-002 finding from stage 6 devil's advocate review: the §A1 TRL 6 by 2029 assumption was carrying thesis weight without a backing demonstration program. The minimum observable is calibrated to NASA TRL 6 definition (demonstration in relevant environment) applied to the reactive locomotion layer, which is the safety-critical and most mature layer. Relevant environment for locomotion TRL 6 is representative gravity (1/6-g offload) and representative terrain material (JSC-1A or ISAC simulant), not thermal/vacuum (those advance TRL to 7). See `study/01-optimal-space-humanoid/04-sensing-autonomy.md` Section 3 (2029 TRL 6 Gate — Minimum Observable) and §A1 in `study/05-cross-cutting/margins-and-assumptions.md`.
