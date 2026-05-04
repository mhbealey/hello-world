# Stage 5 Handback

*Generated 2026-05-03 04:56. Self-contained handback for the next planning session. Paste this entire document into a new conversation to plan stages 6+.*

---

## 1. Executive Snapshot

**Total sections:** 12
**Total words written:** 37,644

**Section status:**
- in-progress: 3
- draft: 9

**Review status:**
- unreviewed: 12

**Findings totals:**
- Blockers: 0
- Majors: 0
- Minors: 0
- Nits: 0

## 2. What Got Built

| Section | Status | Review | Owner | Words | Updated |
|---------|--------|--------|-------|------:|---------|
| Abstract | draft | unreviewed | orchestrator | 199 | 2026-05-03 |
| Why This Study, Why Now | draft | unreviewed | orchestrator | 351 | 2026-05-03 |
| Optimal Space Humanoid: Overview and Heritage Table | draft | unreviewed | humanoid-systems-architect | 1,895 | 2026-05-03 |
| Optimal Space Humanoid: Form Factor Tradespace | draft | unreviewed | humanoid-systems-architect | 4,008 | 2026-05-03 |
| Optimal Space Humanoid: Actuation and Structures | draft | unreviewed | robotics-actuation-structures | 3,543 | 2026-05-03 |
| Optimal Space Humanoid: Sensing and Autonomy | draft | unreviewed | robotics-sensing-autonomy | 5,483 | 2026-05-03 |
| Optimal Space Humanoid: Environments and Hardening | draft | unreviewed | space-environments | 4,617 | 2026-05-03 |
| Optimal Space Humanoid: Mass and Power Budget | draft | unreviewed | humanoid-systems-architect | 4,135 | 2026-05-03 |
| Cross-Coupling Log | in-progress | unreviewed | orchestrator | 2,956 | 2026-05-03 |
| Margins and Assumptions Register | in-progress | unreviewed | orchestrator | 3,123 | 2026-05-03 |
| Open Questions | in-progress | unreviewed | orchestrator | 1,469 | 2026-05-03 |
| Soviet Russian Heritage | draft | unreviewed | soviet-russian-heritage | 5,865 | 2026-05-03 |

## 3. Findings That Matter

Blockers and majors only. Minors and nits omitted from handback (they're in the repo).

## 4. Patterns Across Reviewers

*No sections flagged by 2+ reviewers (or reviews not yet run).*

## 5. Decisions Locked In

From `study/05-cross-cutting/cross-coupling-log.md`. These constrain stages going forward.

### 2026-05-03 — Autonomy TRL curve

**Parameter:** Humanoid autonomy TRL trajectory (study assumption)
**Value:** TRL 6 (space-relevant environments) by ~2029 → TRL 7+ (space-relevant) by ~2035 → TRL 8 (qualified, operational environment) by ~2038-2040
**Set by:** orchestrator (resolution of stage 4 contradiction between two incompatible registry entries)
**Affects:** autonomy-trl-tasking, human-factors-teaming, conops-integrator, technology-roadmap-trl, cost-program, far-side-base-architect (deployment timeline)
**Basis:** Study assumption with explicit go/no-go gates at each milestone. Not a forecast. See §A1 in `study/05-cross-cutting/margins-and-assumptions.md` for full text. If the 2029 gate is missed, the deployment timeline slips proportionally; if the 2035 gate is missed, the teaming model defaults to higher human-in-the-loop ratios.

---

### 2026-05-03 — Form factor position

**Parameter:** Space humanoid primary form factor
**Value:** Full bipedal humanoid — two legs, two arms, two dexterous hands, anthropomorphic geometry, standing height 1.5–1.9 m, design-to mass 75 kg, not-to-exceed mass 97.5 kg (30% margin)
**Set by:** humanoid-systems-architect
**Affects:** robotics-actuation-structures, robotics-sensing-autonomy, space-environments, humanoid-systems-architect (budget), conops-integrator
**Basis:** Tradespace of five candidates weighted against seven criteria; bipedal form scores highest (3.65/5.00) driven by human tool and environment compatibility (C1, weight 0.25) — the lunar far side base is built for humans, and maintaining dual tool and infrastructure standards for a non-human-geometry robot over a 20-year permanent base lifetime is more costly than the locomotion and mass penalties of the bipedal form. Centaur is the close second (3.55); it becomes the correct answer if the base infrastructure is designed for robots before crew arrival, which the current program timeline does not support. Four end-effectors (feet and hands) must support both bipedal surface locomotion and handrail-grasp zero-g mobility as first-class modes — this requirement flows directly from the FEDOR/Skybot F-850 negative lesson.

---

### 2026-05-03 — Actuation architecture

**Parameter:** Primary joint actuation type for the space humanoid
**Value:** High-ratio harmonic drive electric (HD-Electric) for load-bearing joints (hips, knees, ankles, shoulders, elbows); hybrid QDD-class for low-torque fine-control joints (wrists, fingers, ankle fine-axis). Hydraulic actuation eliminated. SEA retained as fallback if harmonic flexspline cryogenic validation fails by 2029 gate.
**Set by:** robotics-actuation-structures
**Affects:** space-environments (thermal architecture for joint heaters; seal material development), humanoid-systems-architect (mass-power budget — actuator mass fraction and peak power validation), technology-roadmap-trl (harmonic flexspline cryogenic TRL gap must close by 2029), fault-management-sustainment (ORU replacement strategy for actuator modules), cost-program (actuator unit cost heritage)
**Basis:** HD-Electric offers best mass efficiency (Atlas Electric: 89 kg, 56 DOF, 85–90% efficiency) at required torque levels. SEA mass penalty is prohibitive at 75 kg target (Valkyrie: 129 kg, 44 DOF). QDD joint-resident motor mass creates unfavorable distribution for full-body humanoid. Hydraulic eliminated for outgassing risk in vacuum and non-serviceability in EVA context. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 1.

---

### 2026-05-03 — Joint count and DOF architecture

**Parameter:** Nominal joint count and DOF allocation for the space humanoid
**Value:** 38 DOF nominal (range 36–40), distributed: neck 3, torso 2, arms 4 DOF each (shoulder 3 + elbow 1), wrists 3 DOF each, hands 10–12 DOF each, hips 3 DOF each, knees 1 DOF each, ankles 2 DOF each
**Set by:** robotics-actuation-structures
**Affects:** robotics-sensing-autonomy (joint state sensing requirements, control loop count), humanoid-systems-architect (mass-power budget — 38-joint allocation feeds actuator mass table), conops-integrator (task capability envelope), fault-management-sustainment (joint failure mode catalog)
**Basis:** Calibrated against R2 42-DOF torso+arm+hand heritage (ISS-deployed task set) and Valkyrie 44-DOF space-intent design. Reduction to 38 by cutting torso DOF from 3 to 2 and reducing hand DOF to minimum sufficient for EVA tool grasp per R2 design intent. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 2.

---

### 2026-05-03 — Structure + actuation mass allocation

**Parameter:** Structure and actuation mass design-to target
**Value:** 30.0 kg design-to / 39.0 kg NTE (30% margin) for primary structure + actuation + joints/sealing + end-effectors combined. This is 40% of the 75 kg total system design-to mass.
**Set by:** robotics-actuation-structures
**Affects:** humanoid-systems-architect (mass-power budget section must close remaining 45 kg design-to across sensors, compute, power, thermal, consumables, fluid lines), destinations-trajectories (lander manifest assumes 75 kg / 97.5 kg NTE total system), cost-program
**Basis:** Parametric breakdown: primary structure 8.5 kg (CFRP + Al hybrid), actuation 13.0 kg (38 joints × ~340 g mean), joints/seals 4.0 kg, end-effectors 4.5 kg = 30.0 kg total. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 4.

---

### 2026-05-03 — Dust mitigation primary strategy

**Parameter:** Primary dust mitigation approach for joint architecture
**Value:** Dual-stage labyrinth + single elastomeric lip seal (perfluoroelastomer, FFKM-class) for all load-bearing joints; disposable Vectran/Zylon boot covers for foot/ankle assemblies at 500-hour parametric replacement interval
**Set by:** robotics-actuation-structures
**Affects:** space-environments (FFKM cryogenic validation program; TRL 3 → TRL 5 required by 2029 gate), fault-management-sustainment (boot cover consumables manifest and replacement procedure), far-side-base-architect (consumables resupply manifest for boot covers), technology-roadmap-trl (seal material development on critical path)
**Basis:** Labyrinth seals have TRL 7–8 in terrestrial contaminated industrial environments. FFKM elastomers have ISS heritage in fluid line connectors at −60°C to +200°C; extension to −180°C is a development item at TRL 4. Active gas purge rejected (continuous supply dependency). Graceful degradation rejected (permanent base multi-year horizon). See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 3.

---

### 2026-05-03 — Sensor suite mass and power allocation

**Parameter:** Sensor suite mass and power envelope for the space humanoid
**Value:** ~2.1 kg design-to mass, 37–75 W peak power (10–30 W average accounting for LIDAR duty cycling). Includes: stereo HDR camera + ToF depth (head), wrist cameras, IMU (3-unit redundant), wrist F/T sensors, fingertip tactile arrays, solid-state LIDAR.
**Set by:** robotics-sensing-autonomy
**Affects:** humanoid-systems-architect (mass-power budget section 01-06 must close sensors + compute at ~3.9 kg and ~60–150 W peak against the 45 kg / 800 W envelopes remaining after structure+actuation), space-environments (radiation qualification program for LIDAR SPAD arrays and MEMS IMUs), technology-roadmap-trl (HDR camera outdoor qualification, tactile flexible substrate TRL gap are on critical path to 2029 gate)
**Basis:** Parametric sizing from commercial humanoid sensor suite heritage (Digit: 4× Intel RealSense + LIDAR + MEMS IMU; Valkyrie: MultiSense SL stereo head + F/T sensors; R2: 350+ sensors including wrist-mounted F/T and fingertip tactile). Space-specific modifications: HDR cameras for extreme contrast outdoor conditions; spot-shielded MEMS IMUs for radiation TID; solid-state LIDAR with duty cycling for power management. See `study/01-optimal-space-humanoid/04-sensing-autonomy.md` Section 1.

---

### 2026-05-03 — Onboard compute architecture (two-tier)

**Parameter:** Compute architecture for onboard autonomy inference
**Value:** Two-tier: (1) radiation-hardened supervisor processor (RAD750-class, 5–10 W, always-on, runs safety-critical control loops only) + (2) commercial AI inference accelerator (Jetson AGX Orin-class, 15–60 W, watchdog-managed, runs perception pipeline and VLA model). Total compute mass ~1.8 kg including spot shielding. Cloud-connected inference architecturally excluded.
**Set by:** robotics-sensing-autonomy
**Affects:** humanoid-systems-architect (compute power 22–75 W peak must be carried in mass-power budget 01-06), technology-roadmap-trl (no rad-hard AI-inference equivalent of Jetson AGX Orin exists at TRL > 4; DARPA HPSC and similar programs are on the critical path if watchdog architecture is to be simplified before 2035), space-environments (Tier 2 single-event latchup rate under lunar radiation environment; spot-shielding mass allocation), fault-management-sustainment (Tier 2 power-cycle reset procedure as nominal fault response)
**Basis:** Two-tier architecture precedented by Mars Science Laboratory compute hierarchy (RAD750 flight computer + instrument-local processors). No rad-hard equivalent of commercial AI-inference hardware exists at TRL > 4 as of 2026; watchdog architecture is the operational solution through 2035 deployment window. See `study/01-optimal-space-humanoid/04-sensing-autonomy.md` Section 2.

---

### 2026-05-03 — Autonomy/teleoperation boundary (provisional)

**Parameter:** Provisional allocation of tasks between fully autonomous, human-supervised, and human-controlled operation (by 2035 deployment baseline)
**Value:** Fully autonomous by 2035: routine locomotion on prepared paths, sensor data collection, pre-scripted maintenance, health monitoring, safe-mode transitions. Human-supervised: novel manipulation, EVA tool handoff with crew, PSR operations, emergency response, pressurized interface operations. Human-controlled always: life-safety decisions, irreversible actions beyond robot, crew-override of any autonomous execution.
**Set by:** robotics-sensing-autonomy (provisional; to be refined by autonomy-trl-tasking and human-factors-teaming)
**Affects:** autonomy-trl-tasking (must validate boundary against TRL curve and task catalog), human-factors-teaming (crew workload model depends on fraction of tasks requiring supervision), teleoperation-latency (must quantify whether relay latency permits ground-in-the-loop supervision for the human-supervised task categories), conops-integrator (mission timeline must allocate crew time for supervision gates), fault-management-sustainment (safe-mode transition procedures and crew override hardware design)
**Basis:** Boundary calibrated against §A1 autonomy TRL curve (TRL 7+ in space-relevant environments by 2035) and Mars rover AutoNav heritage (flight-qualified autonomous traverse planning and execution at TRL 8 since 2014). Life-safety and irreversible-action categories are program/ethical constraints, not TRL-dependent. Avatar-mode teleoperation (FEDOR heritage) is retained as the anomaly fallback for any task where autonomous execution fails. See `study/01-optimal-space-humanoid/04-sensing-autonomy.md` Section 5.

---

### 2026-05-03 — Lunar night thermal power reservation and survival mode

**Parameter:** FSP power reservation for humanoid thermal survival during lunar night; survival mode definition
**Value:** 70–200 W continuous draw from Fission Surface Power during lunar night hibernation per humanoid unit (50–150 W electronics/battery survival heaters + 20–50 W joint heaters for 12 primary HD-Electric joints). Survival mode: Tier 1 RH supervisor processor only powered; Tier 2 AI accelerator off; locomotion off; battery maintained at ~30% SOC. Estimated warm-up time to partial operability: 15–30 minutes from crew wake command; full operability: 45–90 minutes.
**Set by:** space-environments
**Affects:** humanoid-systems-architect (mass-power budget §01-06 must carry 70–200 W lunar night power reservation); far-side-base-architect (FSP power allocation must reserve humanoid thermal load across full lunar night; with 3 humanoids deployed simultaneously, reservation grows to 210–600 W); conops-integrator (mission timeline must reflect ~45–90 min warm-up period; humanoid is not immediately available at start of lunar day without pre-warming); fault-management-sustainment (survival mode transition triggers and recovery procedures; Tier 1 RH supervisor as sole active process during hibernation)
**Basis:** Parametric estimate anchored to Mars rover WEB survival heater heritage (~100 W-hr/night cold case, Curiosity/Perseverance); scaled for the 14-day lunar night and humanoid electronics volume. Joint heater estimate from HD-Electric lubrication floor (PFPE grease) at −60°C minimum. Range is wide because no detailed thermal model of the bipedal form factor exists; this is flagged as TRL 2 (parametric only) requiring detailed model by 2031 and test validation before PDR. See Section 01-05 §2.

---

### 2026-05-03 — Radiation hardening strategy (hybrid)

**Parameter:** Electronics radiation hardening approach for space humanoid
**Value:** Hybrid strategy: (1) RHBD parts (RAD750-class) for Tier 1 safety-critical processor; (2) RHBD for critical motor controller and safety-monitor ICs where available; (3) COTS + spot shielding (5–10 mm Al, 0.5–1.5 kg per board) for Tier 2 AI accelerator and non-critical sensing electronics, with 3-year ORU replacement plan for Tier 2 boards; (4) torso structural walls at 2–4 mm Al equivalent for passive bulk shielding. 7-year TID budget at surface: 140–210 krad (silicon) without shielding. SPE survival requirement: humanoid returns to pressurized habitat on SPE warning — body electronics not required to survive direct Carrington-class SPE exposure.
**Set by:** space-environments
**Affects:** humanoid-systems-architect (mass-power budget §01-06 must carry 0.5–1.5 kg for electronics compartment shielding walls; Tier 2 board mass must account for ORU replacement in spares manifest); fault-management-sustainment (Tier 2 board replacement as a scheduled 3-year ORU; SPE shelter mode as a nominal fault response procedure; procedure must be executable without ground contact — Tier 1 can autonomously initiate shelter return on radiation monitor threshold); conops-integrator (SPE shelter return within 15–30 minutes of warning must be explicit in ConOps; Section 03 must define the shelter procedure); far-side-base-architect (pressurized habitat or dedicated shielded location must provide ~20 g/cm² Al-equivalent shielding for SPE survival; must confirm this shielding depth in habitat wall + regolith berm design); technology-roadmap-trl (Tier 2 ORU replacement cadence is a program logistics commitment from 2035 onward; spares cost must be in cost-program estimates)
**Basis:** 7-year design life at ~20–30 krad/yr surface (Chang'e-4 LND measurement, silicon TID estimate) = 140–210 krad budget. COTS compute TID tolerance ~10 krad without shielding — requires shielding mitigation. 5–10 mm Al spot shielding reduces dose rate by 3–5× for GCR. Combined with 3-year ORU replacement, COTS Tier 2 is viable through 7-year design life. SPE survival by habitat retreat eliminates need to harden body-mounted electronics to Carrington-class fluences. See Section 01-05 §3.

---

### 2026-05-03 — System-level dust mitigation (optical, thermal, connectors)

**Parameter:** System-level dust mitigation beyond joint seals
**Value:** (1) Optical sensors: spring-loaded passive covers (ExoMars heritage TRL 7) + scheduled pre-task brushing; EDD (electrostatic dust deflection) as growth option at TRL 4 only. (2) Thermal radiators: smooth high-emissivity coatings (ε ≥ 0.85 BOL), design to ε = 0.70 EOL (18–24% emissivity margin); smooth hard coatings resistant to dust adhesion; manual cleaning by crew. (3) Connectors: spring-loaded dust caps + N₂ purge at mate/demate; N₂ canister (~0.2–0.5 kg) in consumables manifest. All caps and covers must be EVA-glove operable.
**Set by:** space-environments
**Affects:** humanoid-systems-architect (mass-power budget §01-06 must carry optical cover masses ~15–60 g per aperture; N₂ purge canister ~0.2–0.5 kg in consumables line); far-side-base-architect (consumables resupply manifest for N₂ purge canisters; base workshop must support optical cover replacement and radiator cleaning procedures); fault-management-sustainment (pre-task optical cleaning as nominal procedure; cover actuator failure mode and manual override requirement); conops-integrator (pre-task sensor cleaning adds ~5 minutes to EVA preparation procedure; must appear in mission timeline)
**Basis:** ExoMars camera cover TRL 7 heritage. Mars solar panel dust degradation rates (2–5%/month, MER heritage) used as conservative proxy for lunar radiator emissivity degradation; actual lunar dust adhesion rate may differ significantly (electrostatic mechanism vs. gravitational settling on Mars) and must be measured. See Section 01-05 §4.

---

### 2026-05-03 — Mass and power budget closure (Question a integration)

**Parameter:** Closed mass and power budget for the space humanoid — key output numbers for all downstream agents
**Value:** Total dry mass design-to: **75.0 kg** (allocated subsystems: 58.2 kg + system growth allowance: 16.8 kg). Not-to-exceed: **97.5 kg** (30% margin per NASA-STD-5001). Power: full locomotion + manipulation **616 W with margin** (vs. 800 W cap); stationary manipulation **432 W with margin** (vs. 500 W goal); lunar night hibernation **148–304 W with margin** (lower bound closes vs. 150 W goal; upper bound does not close — thermal model required). Battery: **2.0 kWh** at **160 Wh/kg** space-qualified Li-ion = **12.5 kg cells** + 2.5 kg BMS/housing + 1.9 kg harness = **16.9 kg power system total**. Largest mass line item is the power system (22% of design-to). Primary unresolved risk is the lunar night thermal power draw (70–200 W parametric range, TRL 2).
**Set by:** humanoid-systems-architect
**Affects:** destinations-trajectories (lander manifest: use 75 kg design-to / 97.5 kg NTE as the per-unit manifest number); cost-program (unit mass drives parametric cost; 2.0 kWh space-qualified battery and 3-year Tier 2 ORU replacement cadence are recurring cost drivers); conops-integrator (sortie battery life 4 hours; recharge time ~8 hours; hibernation warm-up 15–30 min partial / 45–90 min full operability); far-side-base-architect (peak FSP demand per humanoid 616 W; average operational demand ~450 W; lunar night FSP reservation 300 W with margin per unit until thermal model closes — three humanoids require ~900 W FSP reservation through each lunar night)
**Basis:** Budget integrates §03 (structure + actuation 30.0 kg), §04 (sensors 2.1 kg + compute 1.8 kg), §05 (electronics shielding 1.0 kg, thermal 3.0 kg, consumables 0.9 kg), and battery derivation in §06 (16.9 kg). Growth allowance 16.8 kg = 29% of allocated subsystems, consistent with concept-phase MGA practice for hardware primarily below TRL 5. See `study/01-optimal-space-humanoid/06-mass-power-budget.md`.

## 6. Open Questions Blocking Progress

| Domain | Question | Owner | By when |
|--------|----------|-------|---------|
| scope | Does the study cover Mars surface humanoid ops in detail or treat it as architecture-paper-fidelity extension? | orchestrator | early |
| autonomy | What's the autonomy TRL we assume by 2035 deployment? | autonomy-trl-tasking with human-factors-teaming | early |
| power | Fission surface power as baseline, or hedge? | far-side-base-architect with cost-program | early |
| form factor | Do we commit to humanoid bipedal, or hedge to centaur/modular? | humanoid-systems-architect | after first heritage pass |
| ISRU | Does the study assume ISRU works, or design for full Earth-supply? | far-side-base-architect with cost-program | mid |
| framing | How do we handle the "manned mission with no humans" rhetorical question? | orchestrator | late |
| actuation/thermal | Harmonic drive flexspline fatigue life at cryogenic temperatures (−180°C) under representative cyclic joint loads | technology-roadmap-trl with space-environments | must close before 2029 program gate |
| sealing/dust | Perfluoroelastomer (FFKM) lip seal performance at −180°C under vacuum and cyclic load | space-environments | must reach TRL 5 by 2029 gate |
| actuation/power | Per-joint peak power draw validation against 800 W system peak | humanoid-systems-architect (mass-power budget section) | before Section 01-06 is baselined |
| serviceability/dust | Boot cover replacement interval: 500-hour figure is parametric with no heritage | space-environments and far-side-base-architect (consumables manifest) | pre-PDR |
| compute/radiation | Tier 2 (commercial AI accelerator) single-event latchup rate under actual lunar far side radiation environment | space-environments with technology-roadmap-trl | must be characterized before first article compute architecture is finalized; target by 2029 gate |
| compute/TRL | No radiation-hardened AI inference processor equivalent to commercial AI accelerators exists at TRL > 4 | technology-roadmap-trl | monitor through 2029 gate; decision point at PDR |
| sensing/illumination | HDR camera performance in outdoor lunar illumination | space-environments with robotics-sensing-autonomy | required for locomotion stack validation; must reach TRL 5 by 2029 gate |
| sensing/tactile | Flexible tactile sensor substrate qualification for vacuum and thermal cycling | space-environments | must reach TRL 5 by 2029 gate |
| autonomy/locomotion | Bipedal locomotion controller validation in 1/6 g with lunar regolith simulant | technology-roadmap-trl with robotics-sensing-autonomy | define test campaign by 2028 for data ahead of 2029 gate |
| autonomy/OOD | Foundation model generalization to lunar-analog task environments | autonomy-trl-tasking with conops-integrator | dataset construction program should be defined at PDR |
| latency/supervision | Minimum relay latency achievable on lunar far side relay architecture for supervisory control interactions | teleoperation-latency | required input to human-factors-teaming and conops-integrator before Section 02 is baselined |
| thermal/humanoid | Detailed thermal model of bipedal humanoid body | humanoid-systems-architect with space-environments | required TRL 5 model by 2031; validates against Section 01-06 budget; drives FSP allocation conversation with far-side-base-architect |
| radiation/silicon-TID | Silicon TID measurement at the lunar surface | space-environments with technology-roadmap-trl | confirm against Artemis surface operations data or a future dedicated dosimeter on a CLPS lander; required before PDR Tier 2 replacement cadence is baselined |
| thermal/NdFeB | NdFeB motor magnet performance at cryogenic temperatures (−100°C to −180°C) | robotics-actuation-structures with space-environments | required for HD-Electric thermal validation program by 2028 |
| thermal/connector | N2 purge canister sizing and resupply interval for electrical connector dust mitigation | far-side-base-architect with space-environments | define as part of consumables manifest when ConOps section establishes EVA cycle rate |
| dust/radiator | Lunar dust adhesion rate to thermal radiator surfaces | space-environments with technology-roadmap-trl | required test data from a CLPS lander or Artemis surface experiment; pre-PDR |
| conops/SPE | SPE shelter return procedure execution without ground contact | conops-integrator with far-side-base-architect and fault-management-sustainment | required for Section 03 ConOps baseline and Section 04-03 far side base design |

## 7. Assumption Registry (Full)

Verbatim from `study/05-cross-cutting/margins-and-assumptions.md`.

# Margins and Assumptions Register

This file tracks all margins applied and assumptions made across the study, in one place, for review.

## How to add an assumption

Short assumptions (one sentence, fits in a table row): add directly to the Assumptions table.
Long assumptions (multi-sentence, with go/no-go gates or cascading consequences): add a one-line summary pointer in the table and a numbered subsection `### AN. Title` below, containing the full text. Use the next available number (current highest: A12).

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

[Each agent appends to this register as work progresses. Orchestrator reviews at major checkpoints.]


## 8. What Broke in the Agent System

### agent-performance.md

# Agent Performance Retrospective

One entry per agent, per stage. Format: agent name, what worked, what didn't, prompt change recommended.

---

## soviet-russian-heritage — Stage 2

**What worked:**
- Produced 5,865 words of substantive heritage research with primary citations and explicit `[VERIFY]` flags on weak or secondary-only claims. This is the model for how all agents should work.
- Structured by topic (6 topics: Lunokhod, Salyut/Mir, Mars-500, Soviet lunar base concepts, Mir sustainment, contra-humanoid thread) with Key Sources / Lessons / Open Questions sub-sections per topic.
- Honest about coverage gaps — flagged inaccessible primary sources in Russian and untranslated literature explicitly.
- Generated 32 BibTeX entries covering the corpus well.

**What didn't:**
- Thin on Topics 5 and 6 — Mir sustainment philosophy and the contra-humanoid design philosophy thread appear to have been truncated due to context or length limits. These are the most directly relevant lessons for the study's core thesis.
- The `[VERIFY]` discipline was applied but not always with specific enough notes on *why* the claim is uncertain (secondary source vs. untranslated Russian vs. conflicting published figures).

**Prompt change recommended:**
- Add explicit topic coverage targets: "Cover all 6 topics listed. Topics 5 and 6 (Mir sustainment philosophy, contra-humanoid design thread) are particularly important — do not truncate these."
- Consider adding: "For each `[VERIFY]` flag, add one sentence explaining *what* needs verification and *why* the current source is insufficient."

---

## humanoid-systems-architect — Stage 2

**What worked:**
- Heritage table structure is solid: 9 robots × 10 columns, with honest "unverified" flags on power figures not published by manufacturers.
- Heritage gaps section (7 gaps) is substantive and directly references the study's mission requirements.
- Open questions section sets up the subsequent Question (a) sections correctly.

**What didn't:**
- Stopped at the heritage table — did not advance to form factor tradespace, mass/power budget, or configuration position-taking. The agent produced the first deliverable only.
- No cross-coupling decisions were logged despite the heritage table containing numbers (mass, DOF, power) that downstream agents will reference.
- Did not append to assumption registry or cross-coupling log despite producing architectural data.

**Prompt change recommended:**
- Make explicit that the heritage table is the *first* deliverable for this stage, not the only one — the agent should continue through tradespace and configuration position unless explicitly told to stop.
- Add the mandatory closing actions (already being added in Task 4) — require cross-coupling log entries for any design parameter set.

---

## orchestrator — Stage 2-4

**What worked:**
- Correctly structured the parallel agent dispatch to avoid write conflicts (separate bib stub files).
- The audit pass (stage 4) caught the critical YAML frontmatter bug across all 14 agent files — this was a showstopper that would have prevented any agent from working.
- The handback tooling was correctly identified as missing and implemented.

**What didn't:**
- Failed to enforce the breadcrumb conventions it scaffolded: session logs never written during work, cross-coupling log never populated, retro artifacts never written.
- Added contradictory autonomy TRL entries to the assumption registry without checking for conflicts.
- Scaffolded reviewers but never invoked them — left the stage 4 handback with a misleading "0 findings" count.
- Did not log cross-coupling decisions from the humanoid-systems-architect heritage table output.

**Prompt change recommended:**
- Add mandatory pre-handback checklist (Task 4 in stage 5 specification): registry contradictions resolved, breadcrumbs current, reviews invoked or explicitly deferred with written reason.
- Every assumption addition: search registry for contradictions first, resolve before adding.


### orchestrator-performance.md

# Orchestrator Performance Retrospective

---

## Stage 2-4 Assessment

**Cross-coupling watchlist failures.**

The orchestrator's primary job is cross-coupling detection: when one agent sets a number or position, the orchestrator checks whether that breaks assumptions in other agents' artifacts. This did not happen in stages 2-4.

Specific failures:
1. The humanoid-systems-architect produced a heritage table with mass ranges (35–150 kg) and power estimates (~300–1,800 W). These constrain the destinations-trajectories lander manifest and the cost-program launch cost estimate. No cross-coupling entry was logged. No downstream agents were notified.
2. Two autonomy TRL entries were added to the assumption registry at different times, with incompatible values, by different processes. Neither was reconciled. The orchestrator did not check for contradictions before adding the second entry.
3. The reviewer agents were wired up and described in CLAUDE.md but were never invoked. The stage 4 handback showed "0 findings" — not because the sections were clean, but because no reviews ran. The orchestrator did not flag this explicitly.

**Enforcement failures.**

Breadcrumb conventions (session logs, cross-coupling log, retro artifacts) were specified in CLAUDE.md and scaffolded as files. They were not populated during any work session. The orchestrator treated them as optional despite stating they were required.

**Root cause.**

The CLAUDE.md instructions described *what* the breadcrumbs are and *where* they go, but did not specify *when* they are mandatory and *what happens* if they're missing. "The orchestrator reviews at major checkpoints" is not an enforcement mechanism — it's a reminder that can be ignored. Stage 5 adds explicit pre-handback gates.

**Corrective actions (stage 5):**
- Hard pre-handback checklist added to CLAUDE.md.
- Mandatory closing actions appended to every agent file.
- Soft warning gate added to `generate_handback.py`.
- Assumption registry now documents how to check for contradictions before adding.
- Cross-coupling log seeded with the first real entry (autonomy TRL curve) as a pattern for future entries.


### process-lessons.md

# Process Lessons

---

## Lesson 1: Breadcrumb discipline does not happen by being scaffolded

**From stage 2-4.**

Breadcrumb files were created and documented in CLAUDE.md as required. They were not populated during work. This is the single most important process lesson from the first four stages.

**Why it happened:** Scaffolding a file and describing its format creates the appearance of a system but not the enforcement. When agents are under time pressure or focused on content, the closing actions get skipped. There is no natural stopping point that forces the question "did I write my session log?"

**Enforcement mechanism (implemented in stage 5):**
1. Every agent file has a mandatory closing actions checklist at the bottom — the agent cannot mark work complete without completing these.
2. CLAUDE.md has a hard pre-handback checklist — the orchestrator cannot generate a handback without verifying these are satisfied.
3. `generate_handback.py` has a soft warning gate that flags missing breadcrumbs and stale session logs before generating.

**The principle:** A convention that produces a warning when violated is better than a convention that produces nothing. A gate that blocks progress is better than a warning. Move from warnings to gates as the system matures.

---

## Lesson 2: "Zero findings" is not a success signal without evidence that reviews ran

**From stage 4.**

The handback showed "Blockers: 0, Majors: 0" — which looks like clean sections. But this was because no review agents had been invoked, not because the sections were clean. The handback format did not distinguish between "reviews ran and found nothing" and "reviews never ran."

**Corrective action:** The handback now surfaces whether review files exist. If they don't exist, the finding count is marked as unreliable, not as a clean bill of health. Stage 6 will run the first real review pass.

---

## Lesson 3: Contradictions in the assumption registry compound silently

**From stage 4.**

Two incompatible autonomy TRL assumptions were in the registry simultaneously for an entire stage cycle. Downstream agents reading the registry would have gotten conflicting inputs. The conflict was caught only at handback time when both entries were visible in the same section.

**Corrective action:** The registry now has explicit instructions for checking contradictions before adding. The "How to add an assumption" note at the top of the registry is the gate. Any agent that adds an assumption without checking this note is violating the process.

---

## Lesson 4: Parallel agent dispatch is efficient but requires explicit write isolation

**From stage 2.**

The soviet-russian-heritage and humanoid-systems-architect agents were dispatched in parallel to avoid sequential bottlenecks. Both needed to write to `corpus/references.bib`. The conflict was avoided by directing each agent to a separate stub bib file (`corpus/heritage-notes/*.bib`) and planning a later merge. This worked.

**The principle:** Parallel dispatch is correct for corpus research. The isolation requirement (separate output files per parallel agent) must be stated explicitly in the dispatch prompt, or agents will try to write to the same file and produce corruption or race conditions.

---

## Lesson 5: Agent scope must be bounded by deliverable, not by topic

**From stage 2.**

The humanoid-systems-architect was dispatched to "populate the corpus" for Question (a). It produced the heritage table (the entry-point deliverable) and stopped. This is correct behavior for an open-ended prompt but incorrect behavior for a staged study: the agent should continue to the next deliverable unless told to stop.

**Corrective action:** Agent dispatch prompts for stage 5+ specify the *complete deliverable* (target file path, minimum word count, required sections) rather than an open topic area. "Produce `02-form-factor-tradespace.md`, 1,500-2,500 words, including a tradespace matrix and a stated position" is a bounded deliverable. "Research the form factor tradespace" is not.


## 9. Session Logs

### 2026-05-03 — Stages 1-4 reconstruction (retroactive log)

2026-05-03 — Stages 1-4 reconstruction (retroactive log)

**Attempted:** Initial project scaffolding, corpus population, static web viewer, handback tooling.

**Got done:**
- Full directory/file structure from scaffolding document (stage 1).
- Heritage research: `study/05-cross-cutting/soviet-russian-heritage.md` at 5,865 words covering Lunokhod, Salyut/Mir, Mars-500, Soviet lunar base concepts, Mir sustainment philosophy, contra-humanoid design thread. 32 BibTeX entries in `corpus/heritage-notes/soviet-heritage.bib`.
- Humanoid heritage table: `study/01-optimal-space-humanoid/01-overview.md` at 1,895 words, 9 robots × 10 columns, 7 heritage gaps, 5 open questions. 24 BibTeX entries in `corpus/heritage-notes/humanoid-specs.bib`.
- Abstract and "why-this-why-now" starter content (draft stubs, ~350 words combined).
- Margins and assumptions registry seeded with 4 margin rows and 5 assumption rows.
- Open questions registry seeded with 6 orchestrator questions.
- Static web viewer (`tools/build_site.py`, Jinja2 templates, CSS). Verified: 5 pages → `site/index.html`.
- Handback tooling (`tools/generate_handback.py`, `README-handback.md`). Verified: 14,481 chars / ~3,620 tokens from stage 4 state.
- All 14 agent `.claude/agents/*.md` files audited and rewritten with correct YAML frontmatter (critical fix: original format used `## name:` which is a YAML comment).
- `CLAUDE.md` updated with "Document purpose" section and "The handback loop" section.

**Got stuck:**
- Breadcrumb discipline was scaffolded but not maintained: no session logs written during work, no cross-coupling decisions logged, no retro artifacts produced.
- Stage 4 reviewers were scaffolded but never invoked — zero findings count is misleading (reviews never ran).
- Assumption registry contained two contradictory autonomy TRL entries added separately without reconciliation.
- Open-questions parser rendered the format header row as a data row in the handback.

**Notes:** This entry is retroactive, written at the start of stage 5 from file metadata and the stage 4 handback. Stage 5 addresses all four gaps.

---

### 2026-05-03 — Stage 5: Foundation repair and Question (a) completion

2026-05-03 — Stage 5: Foundation repair and Question (a) completion

**Attempted:** Resolve autonomy TRL contradiction, fix open-questions parsing, reconstruct breadcrumbs, enforce discipline going forward, populate all six Question (a) files.

**Got done:** (update as stage 5 proceeds)

**Got stuck:** (update as stage 5 proceeds)

**Notes:** (update as stage 5 proceeds)

---

### 2026-05-03 — humanoid-systems-architect: form factor tradespace

2026-05-03 — humanoid-systems-architect: form factor tradespace

Produced `study/01-optimal-space-humanoid/02-form-factor-tradespace.md` as a draft-complete concept-paper section. The section evaluates five form factor candidates (full bipedal humanoid, centaur, quadrupedal with manipulator arms, fixed platform with dexterous arms, modular/reconfigurable) against seven weighted criteria (human tool and environment compatibility 0.25, surface locomotion 0.20, microgravity cabin mobility 0.15, crew serviceability 0.15, mass 0.10, autonomy scalability 0.10, training overhead 0.05). The bipedal form scores 3.65/5.00, edging the centaur at 3.55; position taken is full bipedal humanoid as the primary form factor at 75 kg design-to mass (97.5 kg not-to-exceed with 30% margin). The FEDOR/Skybot F-850 microgravity failure is treated as a controller requirement rather than a form factor disqualifier, and the Lunokhod/Soviet purpose-built counterargument is engaged directly and resolved on program economics grounds: the lunar far side base is built for humans and the cost of dual tool and infrastructure standards over 20 years exceeds the bipedal form's locomotion and mass penalties. Cross-coupling log updated with the form factor position decision; margins/assumptions register updated with two new parametric assumptions (bipedal target mass and peak power); constraints to downstream sections (actuation, sensing/autonomy, environments, budget) are explicit in section 6.

---

### 2026-05-03 — robotics-actuation-structures: actuation and structures

2026-05-03 — robotics-actuation-structures: actuation and structures

Produced `study/01-optimal-space-humanoid/03-actuation-structures.md` as a draft-complete concept-paper section (~2,000 words). The section takes a position on actuation type (HD-Electric primary for load-bearing joints; hybrid QDD for wrists/fingers; SEA as documented fallback if cryogenic flexspline validation fails), justifies the choice against Valkyrie SEA and Atlas Electric heritage, and eliminates hydraulic actuation on vacuum outgassing and serviceability grounds. Structural concept is Al 7075 / CFRP hybrid matching Valkyrie's structural philosophy; 38 DOF nominal architecture calibrated between R2 (42 DOF, ISS-deployed) and the commercial dexterous bipeds. Dust mitigation position is dual-stage labyrinth + FFKM lip seal primary strategy with disposable Vectran/Zylon boot covers as secondary layer for foot/ankle assemblies; both strategies have open TRL gaps flagged. Mass allocation table closes structure + actuation at 30.0 kg design-to (39.0 kg NTE), exactly at the 40% of total system mass constraint. Four open questions added to the registry, all keyed to the 2029 program gate. Cross-coupling log updated with four new entries (actuation type, DOF count, structure+actuation mass, dust strategy). Margins/assumptions register updated with three new long-form assumptions (§A4 HD-Electric, §A5 structure mass, §A6 FFKM seal).

---

### 2026-05-03 — robotics-sensing-autonomy: sensing and autonomy stack

2026-05-03 — robotics-sensing-autonomy: sensing and autonomy stack

Produced `study/01-optimal-space-humanoid/04-sensing-autonomy.md` as a draft-complete concept-paper section (~2,400 words). The section defines a six-category sensor suite (stereo HDR cameras + ToF depth, wrist cameras, triple-redundant IMU, wrist F/T sensors, fingertip tactile arrays, solid-state LIDAR) closing at ~2.1 kg design-to and 37–75 W peak — modest fractions of the system mass and power budgets. The onboard compute architecture is positioned as a two-tier watchdog design: a radiation-hardened supervisor processor (RAD750-class) runs safety-critical deterministic control loops while a commercial AI accelerator (Jetson AGX Orin-class) handles perception and VLA inference under watchdog supervision, with spot shielding to manage single-event latchup risk. The TRL gap — no rad-hard equivalent of commercial AI inference hardware exists at TRL > 4 — is flagged as the compute architecture's primary risk through the 2035 deployment window. The autonomy stack is characterized honestly across three layers (reactive: terrestrial TRL 6–7, space TRL 3–4; deliberative: terrestrial TRL 4–5, space TRL 2–3; supervisory: terrestrial TRL 3–4, space TRL 2–3). Foundation models are positioned as enabling for the supervisory layer (natural language crew interface) but not as the primary task executor for safety-critical operations at the deliberative layer — this is explicitly conservative and should be revisited at program gates. The autonomy/teleoperation boundary is stated provisionally and explicitly handed off to autonomy-trl-tasking and human-factors-teaming for refinement. Cross-coupling log updated with three new entries (sensor suite allocation, compute architecture, autonomy boundary). Margins/assumptions register updated with three new long-form assumptions (§A7 sensor mass, §A8 compute architecture, §A9 foundation model scope). Seven new open questions added to the registry covering compute radiation, sensor qualification, locomotion controller testing, OOD dataset construction, and relay latency.

---

### 2026-05-03 — space-environments: environments hardening

2026-05-03 — space-environments: environments hardening

Produced `study/01-optimal-space-humanoid/05-environments-hardening.md` as a draft-complete concept-paper section (~1,500 words). The section establishes a four-threat environment requirements table (vacuum, thermal cycling, radiation TID/SEE, lunar dust) with values drawn from heritage data: Chang'e-4 LND measurement (~60 µSv/hr) as the radiation anchor, Heiken Lunar Sourcebook for regolith particle properties, Lunokhod thermal heritage for the night-survival reference, and Mars rover WEB thermal architecture for the survival heater parametric estimate. The thermal position is partial hibernation with FSP-powered survival heating during lunar night; the driving requirement is 70–200 W per humanoid from FSP (parametric, TRL 2, requires detailed thermal model by 2031). The radiation strategy is a hybrid approach: RHBD for Tier 1 safety-critical compute, COTS + spot shielding + 3-year ORU replacement for Tier 2 AI accelerator, torso structural shielding walls for passive bulk protection; SPE survival is by habitat retreat not by hardening body electronics. System-level dust mitigation covers optics (passive covers + scheduled cleaning; EDD as growth option at TRL 4), thermal radiators (smooth high-emissivity coatings sized to ε=0.70 EOL vs. ε=0.85 BOL), and connectors (dust caps + N₂ purge, ~0.2–0.5 kg canister). A TRL summary table flags seven open technology gaps by gate year. Cross-coupling log updated with three new entries (thermal survival power, radiation strategy, system-level dust). Margins/assumptions register updated with three new long-form assumptions (§A10 lunar night power, §A11 radiation hybrid strategy, §A12 surface TID estimate). Six new open questions added covering thermal model, silicon TID validation, NdFeB cryogenic performance, N₂ canister resupply, radiator dust adhesion measurement, and SPE shelter ConOps procedure.

## 10. Critical Section Content (Full Text)

Full text of the most-mature sections, capped at ~8,000 characters total. The next planning session reads these to ground its proposals in what was actually written, not just what the metadata says.



### Soviet Russian Heritage (`study/05-cross-cutting/soviet-russian-heritage.md`)

# Soviet/Russian Heritage: Research Notes

This is a working research document, not a polished section. Completeness over polish. All claims flagged [VERIFY] are either sourced from secondary sources only, have not been confirmed against primary literature, or are based on potentially unreliable aggregations.

---

## 1. Lunokhod and Surface Telerobotics

### Key Sources

**Primary:**
- Kemurdzhan, A. L. (2016). "Self-propelled automatic chassis of Lunokhod-1: History of creation in episodes." *Frontiers of Mechanical Engineering*, published by Higher Education Press. English-language. First-person account from the chassis designer. [VERIFY exact volume/pages/DOI]
- Grahn, Sven (2003). "Lunokhod 2: A Retrospective Glance after 30 Years." Abstract in NASA ADS (https://ui.adsabs.harvard.edu/abs/2003EAEJA....14528G). [VERIFY conference proceedings status]
- Huntress, W. T. and Marov, M. Ya. (2011). *Soviet Robots in the Solar System: Mission Technologies and Discoveries*. Springer Praxis. ISBN 9781441978974. Primary reference work by former NASA Science AA and Vernadsky Institute veteran.

**Secondary:**
- IET Engineering and Technology Magazine (2011-03-14). "Rovers learning from Lunokhod." https://eandt.theiet.org/2011/03/14/rovers-learning-lunokhod
- Smithsonian Air and Space Magazine. "The Other Moon Landings." https://www.smithsonianmag.com/air-space-magazine/the-other-moon-landings-6457729/ [VERIFY date]
- NASA NSSDC Lunokhod 1 spacecraft page: https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1970-095D
- Wikipedia: Lunokhod programme, Lunokhod 1, Lunokhod 2 — useful for chronology; not primary.

**METERON:**
- ESA METERON Project official page: https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Automation_and_Robotics/METERON_Project
- DLR METERON site: https://meteron.dlr.de/
- Lii, Neal Y. et al. (2019). "Multisensory Real-Time Space Telerobotics." In Springer proceedings. DOI 10.1007/978-3-030-22871-2_21. [VERIFY author list]
- Murphy, J. R. (1998). "Panospheric Video for Robotic Telexploration." CMU-RI-TR-98-10. https://www.ri.cmu.edu/pub_files/pub3/murphy_john_1998_1/murphy_john_1998_1.pdf — cites Lunokhod image update rates.

### Lessons Relevant to This Study

**Control team structure.** Lunokhod was operated by two five-man crews (alternating every two hours) stationed at NIP-10, the Soviet satellite tracking center at Simferopol-28 (Shkolnoye), Crimea. Each crew: commander, driver (joystick), navigator, antenna operator, flight engineer. Teams had practiced on a simulated lunar surface prior to operations. This is the foundational template for a small supervisory team model.

**The 2.5-second one-way delay.** Round-trip signal time to the Moon is approximately 2.5–2.6 seconds. Lunokhod operators worked under this constraint continuously. The driver used successive still frames (not video), with updates every 7–21 seconds depending on camera mode (documented rates: 3.2, 5.7, 10.9, or 21.1 seconds per frame). Between frames, Lunokhod could travel blindly up to approximately 8 m at its higher speed. Operators memorized the previous frame to navigate during the dead interval and relied heavily on shadow angle for terrain relief estimation.

**Lunokhod 1 (1970–1971):** Landed November 17, 1970 via Luna 17, Sea of Rains. Operated 321 days. Covered ~10.5 km. Returned 20,000+ TV images, 500+ panoramas, 500 soil penetrometer tests, 25 X-ray fluorescence analyses. Two speeds: 0.8 km/h and 2 km/h. Carried a 1-meter blind spot forward of the chassis — drivers had to account for this zone from memory.

**Lunokhod 2 (1973):** Landed January 15, 1973 via Luna 21, Le Monnier crater. Operated approximately 4 months. Final measured distance: 39.16 km (revised upward from original 37 km estimate by LRO laser ranging analysis). Higher camera placement eliminated the Lunokhod 1 blind spot. Average non-stop driving time increased from ~50 seconds (Lunokhod 1) to ~350 seconds (Lunokhod 2), reflecting crew skill accumulation. Failed May 11, 1973: solar lid contacted crater wall during egress attempt, scooping regolith onto the thermal radiator; thermal runaway followed.

**Operational failure mode taxonomy (derived from Lunokhod operations):**
1. Visual dead zone + propagation delay → undetected hazard entry (craters, soft-soil embankments)
2. Still-frame navigation + accumulated terrain error → positional uncertainty over multi-hour sessions
3. Shadow-dependent hazard assessment → degraded performance at low sun angles
4. Thermal management as a mission-critical single point: Lunokhod 2's regolith contamination of the radiator was mission-ending and irreversible

**Lunokhod operators identified "young craters" (2 m diameter, 15–25° wall slope) as the most common dangerous encounter.** Crater rim embankments had lower bearing strength than inter-crater plains.

**METERON experiments (ISS, ~2012–2019):** ESA-led, with DLR, NASA, and Roscosmos participation. Used ISS as an analog for a lunar or Martian orbital station, with robots on Earth as surface analogs. Key latency tested: geosynchronous satellite relay (~0.8 seconds two-way). Interact experiment achieved successful telerobotics at 0.8 s delay. Haptics-2 experiment demonstrated bilateral force-feedback at ~820 ms. Analog-1 (2019): two-hour space-to-ground test, 0.8+ second two-way delay, 1% packet loss — declared successful. METERON does not simulate lunar far side (no direct line of sight relay architecture tested). [VERIFY whether any METERON experiment used relay satellite architecture]

**Soviet/Russian surface robotics philosophy.** Lunokhod was purpose-built for its environment: tub-shaped hull, eight-wheel independent drive, maximum ground clearance, open lid radiator optimized for lunar thermal cycle. No attempt to make it anthropomorphic or generalizable. This reflects a consistent Soviet preference for environment-specific design over generality. [Cross-reference with Topic 6.]

### Open Questions / Thin Coverage

- Detailed operations logs or after-action reports from NIP-10 are not publicly available in English; most details come from post-Soviet memoirs and secondary accounts. Primary Russian-language sources exist but are not widely translated. [VERIFY whether VNII TransMash archives have been opened]
- The specific cognitive and workload data on Lunokhod operators (fatigue, error rates, shift handover) has not been published in accessible English-language literature.
- Whether METERON tested relay satellite architectures that would apply to a lunar far side base (which has no direct Earth line of sight) is unclear from public sources.
- Lunokhod 3 was built but never flown; its improvements over Lunokhod 2 are documented in Russian literature but thinly covered in English. [VERIFY what is publicly known about Lunokhod 3 specifications]
- The identity and post-Soviet careers of the specific Lunokhod driver crews have been partially published; Dovgan and Gabdulkhay Latypov are named in some accounts but a comprehensive crew roster is not confirmed in English sources.

---

## 2. Salyut/Mir Long-Duration Human Factors

### Key Sources

**Primary/institutional:**
- IBMP (Institute of Biomedical Problems, Moscow) — primary institutional source for all Soviet/Russian long-duration human factors. English publications sparse; most original research in Russian. [VERIFY which IBMP publications have English translations]
- Lebedev, Valentin. *Diary of a Cosmonaut: 211 Days in Space*. (Bantam Books, ~1990.) [VERIFY publisher and year.] English translation of Salyut 7 mission diary; widely cited in human factors literature. Primary account.

**Mission records:**
- Valeri Polyakov: second spaceflight Soyuz TM-18, launched January 8, 1994; returned March 22, 1995. Duration: 437 days 17 hours 58 minutes (some sources: 437 days 18 hours). Space.com obituary (2022): https://www.space.com/valery-poly

*[truncated]*

## 11. User's Note for the Next Planning Session

*[Edit this section before pasting into the next conversation. Tell the planner what you're thinking now, what you've changed your mind about, what surprised you, what you want stages 5+ to focus on. Three to five sentences is enough.]*

**Your note:**

> 

## 12. Instructions for the Next Planning Session

You are receiving this handback to design stages 6, 7, and 8 of the humanoid-forward space exploration study.

**Your job:**

1. Read this handback in full.
2. Identify the 2-3 most important findings or patterns.
3. Decide whether the next stage should be remediation (fixing what's broken), continuation (next major content push), integration (weaving sections together), or pivot (the findings revealed something the study needs to change fundamentally).
4. Propose stages 6–8 with concrete scope for each, in the same single-file scaffolding format used for stages 1-4.
5. Be honest if the findings suggest the study should change direction. The handback exists so the loop can correct itself.

**What good output looks like:**

- A clear assessment of what stages 1–5 produced.
- A specific recommendation for the next stage with reasoning.
- A scaffolding document for the next stage in the same `=== FILE: path ===` format used previously.
- Any prompt-tuning recommendations for existing agents based on the retro findings.

---

*End of handback.*