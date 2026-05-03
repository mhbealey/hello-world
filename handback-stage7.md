# Stage 7 Handback

*Generated 2026-05-03 15:02. Self-contained handback for the next planning session. Paste this entire document into a new conversation to plan stages 8+.*

---

## 1. Executive Snapshot

**Total sections:** 19
**Total words written:** 64,548

**Section status:**
- in-progress: 5
- draft: 13

**Review status:**
- unreviewed: 13
- findings-addressed: 6

**Findings totals:**
- Blockers: 10
- Majors: 41
- Minors: 30
- Nits: 19

## 2. What Got Built

| Section | Status | Review | Owner | Words | Updated |
|---------|--------|--------|-------|------:|---------|
| Abstract | draft | unreviewed | orchestrator | 199 | 2026-05-03 |
| Executive Summary | auto-generated | unreviewed | executive-summary-agent | 612 | 2026-05-03 |
| Why This Study, Why Now | draft | unreviewed | orchestrator | 351 | 2026-05-03 |
| Optimal Space Humanoid: Overview and Heritage Table | draft | findings-addressed | humanoid-systems-architect | 1,945 | 2026-05-03 |
| Optimal Space Humanoid: Form Factor Tradespace | draft | findings-addressed | humanoid-systems-architect | 4,923 | 2026-05-03 |
| Optimal Space Humanoid: Actuation and Structures | draft | findings-addressed | robotics-actuation-structures | 5,338 | 2026-05-03 |
| Optimal Space Humanoid: Sensing and Autonomy | draft | findings-addressed | robotics-sensing-autonomy | 5,116 | 2026-05-03 |
| Optimal Space Humanoid: Environments and Hardening | draft | findings-addressed | space-environments | 3,926 | 2026-05-03 |
| Optimal Space Humanoid: Mass and Power Budget | draft | findings-addressed | humanoid-systems-architect | 4,713 | 2026-05-03 |
| Human-in-the-Loop Value: Overview | draft | unreviewed | human-factors-teaming | 1,843 | 2026-05-03 |
| Human-in-the-Loop Value: Latency Tradespace | draft | unreviewed | teleoperation-latency | 4,584 | 2026-05-03 |
| Human-in-the-Loop Value: Autonomy TRL and Task Allocation | draft | unreviewed | autonomy-trl-tasking | 4,446 | 2026-05-03 |
| Human-in-the-Loop Value: Teaming Model | draft | unreviewed | human-factors-teaming | 4,728 | 2026-05-03 |
| Charts Index | in-progress | unreviewed | visualization-agent | 285 | 2026-05-03 |
| Cross-Coupling Log | in-progress | unreviewed | orchestrator | 6,058 | 2026-05-03 |
| Dispatch Dependency Graph | in-progress | unreviewed | orchestrator | 382 | 2026-05-03 |
| Margins and Assumptions Register | in-progress | unreviewed | orchestrator | 6,345 | 2026-05-03 |
| Open Questions | in-progress | unreviewed | orchestrator | 1,469 | 2026-05-03 |
| Soviet Russian Heritage | draft | unreviewed | soviet-russian-heritage | 7,285 | 2026-05-03 |

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
**Basis:** HD-Electric offers best mass efficiency (Atlas Electric: 89 kg, 28 DOF per Boston Dynamics 2024, 85–90% efficiency) at required torque levels. SEA mass penalty is prohibitive at 75 kg target (Valkyrie: 129 kg, 44 DOF). QDD joint-resident motor mass creates unfavorable distribution for full-body humanoid. Hydraulic eliminated for outgassing risk in vacuum and non-serviceability in EVA context. Note: Atlas Electric uses custom fully-rotational direct-drive motors, not harmonic drives — it is cited as an efficiency benchmark, not as harmonic drive heritage. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 1.

---

### 2026-05-03 — Joint count and DOF architecture

**Parameter:** Nominal joint count and DOF allocation for the space humanoid
**Value:** 38 DOF nominal (range 36–40), distributed: neck 3, torso 2, arms 4 DOF each (shoulder 3 + elbow 1), wrists 3 DOF each, hands 10–12 DOF each, hips 3 DOF each, knees 1 DOF each, ankles 2 DOF each
**Set by:** robotics-actuation-structures
**Affects:** robotics-sensing-autonomy (joint state sensing requirements, control loop count), humanoid-systems-architect (mass-power budget — 38-joint allocation feeds actuator mass table), conops-integrator (task capability envelope), fault-management-sustainment (joint failure mode catalog)
**Basis:** Calibrated against R2 42-DOF torso+arm+hand heritage (ISS-deployed task set) and Valkyrie 44-DOF space-intent design. Reduction to 38 by cutting torso DOF from 3 to 2 and reducing hand DOF to minimum sufficient for EVA tool grasp per R2 design intent. DOF convention: 38 = independently controlled primary drive-train axes (bilateral joints counted as 2 each; distal motion couplings not separately counted). See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 2.

---

### 2026-05-03 — Structure + actuation mass allocation

**Parameter:** Structure and actuation mass design-to target
**Value:** 30.0 kg design-to / 39.0 kg NTE (30% margin) for primary structure + actuation + joints/sealing + end-effectors combined. This is 40% of the 75 kg total system design-to mass.
**Set by:** robotics-actuation-structures
**Affects:** humanoid-systems-architect (mass-power budget section must close remaining 45 kg design-to across sensors, compute, power, thermal, consumables, fluid lines), destinations-trajectories (lander manifest assumes 75 kg / 97.5 kg NTE total system), cost-program
**Basis:** Parametric breakdown: primary structure 8.5 kg (CFRP + Al hybrid), actuation 13.0 kg (38 joints × ~340 g mean actuator mass), joints/seals 4.0 kg, end-effectors 4.5 kg = 30.0 kg total. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 4.

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

**2026-05-03 — Confirmed §05 value as 50–150 W (electronics/battery survival heaters); §06 should align to this value.** The 50–150 W range is defensible because the thermally critical electronics are torso-concentrated and the torso compartment can be MLI-blanketed analogously to a rover WEB; the bipedal limb surface area does not drive the electronics heater budget. The principal uncertainty is thermal cross-coupling between torso and limb linkages, which a detailed model must quantify. The §06 range of 85–175 W (used in the current budget closure narrative) is inconsistent with the §05 source value and must be corrected by humanoid-systems-architect to 50–150 W before the budget closure narrative is revised.

**2026-05-03 — §06 corrected (Batch 2 remediation).** The §06 power table has been updated to show 50–150 W for the electronics/battery survival heater row, replacing the prior incorrect 85–175 W. The survival mode pre-margin total is now 79–209 W; with 30% margin: 103–272 W. Both bounds close against the 300 W FSP provision. The former ≤150 W design goal has been removed — it was circular (derived from the lower end of the parametric range) and replaced with "FSP provision: 300 W (worst-case margin, pending thermal model)".

---

### 2026-05-03 — Radiation hardening strategy (hybrid)

**Parameter:** Electronics radiation hardening approach for space humanoid
**Value:** Hybrid strategy: (1) RHBD parts (RAD750-class) for Tier 1 safety-critical processor; (2) RHBD for critical motor controller and safety-monitor ICs where available; (3) COTS + spot shielding (5–10 mm Al, 0.5–1.5 kg per board) for Tier 2 AI accelerator and non-critical sensing electronics, with 3-year ORU replacement plan for Tier 2 boards; (4) torso structural walls at 2–4 mm Al equivalent for passive bulk shielding. 7-year TID budget at surface: 140–210 krad (silicon) without shielding. SPE survival requirement: humanoid returns to pressurized habitat on SPE warning — body electronics not required to survive direct Carrington-class SPE exposure.
**Set by:** space-environments
**Affects:** humanoid-systems-architect (mass-power budget §01-06 must carry 0.5–1.5 kg for electronics compartment shielding walls; Tier 2 board mass must account for ORU replacement in spares manifest); fault-management-sustainment (Tier 2 board replacement as a scheduled 3-year ORU; SPE shelter mode as a nominal fault response procedure; procedure must be executable without ground contact — Tier 1 can autonomously initiate shelter return on radiation monitor threshold); conops-integrator (SPE shelter return within 15–30 minutes of warning must be explicit in ConOps; Section 03 must define the shelter procedure); far-side-base-architect (pressurized habitat or dedicated shielded location must provide ~20 g/cm² Al-equivalent shielding for SPE survival; must confirm this shielding depth in habitat wall + regolith berm design); technology-roadmap-trl (Tier 2 ORU replacement cadence is a program logistics commitment from 2035 onward; spares cost must be in cost-program estimates)
**Basis:** 7-year design life at ~20–30 krad/yr surface (Chang'e-4 LND measurement, Zhang et al. 2020, silicon TID estimate) = 140–210 krad budget. COTS compute TID tolerance ~10 krad without shielding — requires shielding mitigation. 5–10 mm Al spot shielding reduces dose rate by 3–5× for GCR. Combined with 3-year ORU replacement, COTS Tier 2 is viable through 7-year design life. SPE survival by habitat retreat eliminates need to harden body-mounted electronics to Carrington-class fluences. See Section 01-05 §3.

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

---

### 2026-05-03 — Autonomy TRL 6/2029 gate minimum observable defined

**Parameter:** TRL 6 gate minimum observable for §A1 autonomy TRL curve
**Value:** A first-article space-heritage or space-analog bipedal humanoid (or a high-fidelity locomotion testbed at the study design's mass and form factor: 75 kg, bipedal, 38 DOF nominal) must demonstrate unscripted bipedal locomotion on JSC-1A or ISAC lunar regolith simulant in a 1/6-g offload facility for a minimum of 30 continuous minutes without operator intervention, including at least one unplanned terrain feature encounter. Thermal/vacuum testing is not required for TRL 6 (that is TRL 7). The demonstration must run by Q4 2028 to allow data review before the 2029 gate decision. A failed or operator-intervened demonstration does not close the gate. If the gate slips past Q2 2029, the 2035 IOC date must be renegotiated. Per-layer TRL targets at the 2029 gate: reactive layer TRL 6; deliberative layer TRL 5; supervisory layer TRL 5.
**Set by:** robotics-sensing-autonomy (stage 6 remediation)
**Affects:** technology-roadmap-trl (must name the first-gate program — facility, platform, test objectives, lead organization, rough cost bracket, schedule — in stage 7; the Q4 2028 demonstration is the first concrete milestone on the critical path); autonomy-trl-tasking (must validate the gate criteria against the TRL curve and flag if any layer is on a path to miss the 2029 gate); conops-integrator (first-article availability timeline affects when ConOps validation can begin); cost-program (first-gate demonstration program cost must appear in the technology investment estimate)
**Basis:** DA-002 finding from stage 6 devil's advocate review: the §A1 TRL 6 by 2029 assumption was carrying thesis weight without a backing demonstration program. The minimum observable is calibrated to NASA TRL 6 definition (demonstration in relevant environment) applied to the reactive locomotion layer, which is the safety-critical and most mature layer. Relevant environment for locomotion TRL 6 is representative gravity (1/6-g offload) and representative terrain material (JSC-1A or ISAC simulant), not thermal/vacuum (those advance TRL to 7). See `study/01-optimal-space-humanoid/04-sensing-autonomy.md` Section 3 (2029 TRL 6 Gate — Minimum Observable) and §A1 in `study/05-cross-cutting/margins-and-assumptions.md`.

---

### 2026-05-03 — §06 survival heater range corrected to §05 confirmed value; radiator sizing flagged open (Batch 2 remediation)

**Parameter:** Lunar night survival heater range in §06 power table; thermal management mass line; §06 budget closure narrative
**Value:** Electronics/battery survival heater corrected from 85–175 W to **50–150 W** (matching §05 confirmed value). Joint heaters unchanged at 20–50 W. New pre-margin survival total: 79–209 W; new with 30% margin: 103–272 W. Both bounds close against the 300 W FSP provision. Radiator sizing flagged as OPEN: required rejection area for 300 W at ε=0.70, T_panel=50°C, T_sink~243 K is 0.7–1.5 m² — the prior 0.3 m² claim was insufficient by ~3×. Thermal management design-to mass reduced from 3.0 kg to 2.5 kg with radiator mass as an open provision of 0.5–3.0 kg absorbed by growth allowance. Allocated subsystem subtotal revised from 58.2 kg to 57.7 kg; growth allowance revised from 16.8 kg to 17.3 kg. Total design-to and NTE unchanged at 75.0 kg / 97.5 kg.
**Set by:** humanoid-systems-architect (Batch 2 stage 6 remediation)
**Affects:** far-side-base-architect (FSP provision per humanoid remains 300 W with margin through lunar night — this is unchanged; the range has narrowed from a case where the lower bound was circular to one where both bounds genuinely close against the provision); space-environments (thermal model is now the priority input for FSP plant sizing; must narrow the 103–272 W with-margin range to ±30 W before FSP sizing is finalized)
**Basis:** Findings P1-B (cross-coupling-reviewer Blocker: survival heater value inconsistency between §05 and §06), P2-2 (aerospace-engineer-reviewer Blocker: radiator area insufficient by ~3×). The ≤150 W survival mode design goal was circular — it was derived from the lower end of the parametric thermal range and made closure "guaranteed by construction." Removing it and replacing with the FSP provision as the closure criterion is the correct program approach: the 300 W FSP provision is external to the humanoid budget and provides honest margin across the full parametric range.

---

### 2026-05-03 — Forward-deployed supervisory latency target and relay availability floor

**Parameter:** Latency architecture decisions from the latency tradespace analysis
**Value:** Three values set as architectural commitments:
(1) **Forward-deployed supervisory latency target: ≤50 ms RTLT** from crew workstation to humanoid over the base network. This is the design target for the on-base wired/radio link. Justification: at ≤50 ms, direct teleoperation is viable for emergency override; supervisory control has no meaningful latency penalty.
(2) **Earth-relay supervisory latency floor: 2.78–2.92 s RTLT minimum** via Queqiao-2 relay (derived from physics: 384,400 km + 16,500 km relay altitude ÷ 299,792 km/s, round trip). This is not a design choice; it is a physics floor. Any processing, encryption, or routing adds to this floor.
(3) **Relay availability floor: >95% simultaneous Earth and far-side line-of-sight** required for the relay constellation supporting supervisory operations. At <95% availability, autonomous safe-mode behavior must cover outage periods. Single Queqiao-2 asset provides approximately 75–85% availability; a two-satellite constellation phased 180° apart is required to reach >95%. This is an architectural prerequisite for the base, not a growth option.
**Set by:** teleoperation-latency
**Affects:** far-side-base-architect (on-base network topology must achieve ≤50 ms RTLT from crew workstation to each humanoid; relay constellation architecture must reach >95% availability before IOC); conops-integrator (operations planning must assume 2.78–2.92 s minimum latency for any Earth-directed command; relay outage periods must be covered by pre-defined autonomous safe-mode behavior); autonomy-trl-tasking (relay outage safe-mode is a concrete functional requirement that must appear in the autonomy task catalog with TRL 6 at 2029, TRL 7 at 2035); human-factors-teaming (crew workload model must reflect that ≤50 ms enables genuine supervisory override; Earth supervision is mission-plan-review only, not moment-to-moment oversight)
**Basis:** Physics derivation in `study/02-human-in-the-loop/02-latency-tradespace.md` Section 1. Queqiao-2 orbital parameters from CNSA 2024 mission announcements. The 50 ms target is consistent with the 200 ms threshold for direct teleoperation degradation identified in the METERON heritage; the 50 ms target provides 4× margin below that threshold, adequate for EVA-class task supervision. The >95% relay availability requirement is derived from the ConOps requirement that Earth-oversight be available for anomaly reporting and scheduled operation upload without interrupting multi-day operational cycles.

---

### 2026-05-03 — Latency-tier autonomy handoff (input to autonomy-trl-tasking)

**Parameter:** Latency tier at which the autonomy/teleoperation handoff occurs — primary input to autonomy-trl-tasking
**Value:** Three-tier handoff model:
- **Tier A (≤50 ms RTLT, forward-deployed crew):** Supervised autonomy with low-latency human-in-the-loop is the primary mode. Direct teleoperation available for emergency override. Human-supervised task range is unrestricted. Autonomy must handle routine tasks; human handles novel or safety-critical decisions.
- **Tier B (~2.8 s RTLT, Earth-relay supervision):** Supervisory control only; frame-advance teleoperation is the maximum resolution achievable. Direct teleoperation is not viable for the far-side base task profile. Robot must carry TRL 6 reactive layer and TRL 5 deliberative layer to cover the 2.8 s response gap. Earth supervision is limited to scheduled, pre-validated operations and anomaly response with deliberate delay acceptance.
- **Tier C (8.7–42 min RTLT, Mars):** Fully autonomous execution with mission plan approval. No real-time supervision. Robot must carry TRL 7+ deliberative and supervisory layers.
The handoff point between Tier A and Tier B is defined by whether a forward-deployed human is present on the base or in a cislunar orbit position with low-latency link to the surface. This is the primary architectural rationale for forward deployment.
**Set by:** teleoperation-latency
**Affects:** autonomy-trl-tasking (must validate that TRL 6 reactive and TRL 5 deliberative layers are sufficient for Tier B operations by 2035; must catalog which specific tasks are executable at each tier without human input); human-factors-teaming (crew workload model depends on tier; Tier A enables active supervision with low overhead; Tier B forces pre-planning-heavy operations with higher crew prep time); conops-integrator (mission timeline structure differs between Tier A and Tier B days: Tier A supports dynamic task scheduling; Tier B requires pre-validated plan uplinks); fault-management-sustainment (fault response procedures must be parameterized by tier: Tier A allows real-time diagnosis; Tier B and C require autonomous fault response and recovery)
**Basis:** Heritage analysis in `study/02-human-in-the-loop/02-latency-tradespace.md` Sections 2 and 3. Lunokhod NIP-10 operations at 2.5 s RTLT establish the Tier B performance ceiling. METERON SUPVIS Justin at 800 ms establishes that goal-level supervisory commanding is robust to latency in the 800 ms–2.8 s range when the robot has sufficient deliberative autonomy to execute commanded task sequences. The Tier A/Tier B distinction is not a TRL argument; it is a physics argument. A TRL 10 robot cannot overcome 2.8 seconds of round-trip latency for real-time emergency response.

---

### 2026-05-03 — Task allocation table at IOC (2035) and full operation (2040)

**Parameter:** Task-level allocation between autonomy-led, jointly executed, and human-led operations
**Value:** At 2035 IOC — Autonomy-led (12 of 20 tasks): prepared path transit, GPS navigation, pre-taught sample collection, Tier 2 ORU replacement (after first supervised run), base structure inspection, equipment transport, SPE shelter return, joint anomaly safe-stop, EVA prep checklist assistance, radiator panel replacement (after first supervised run), pre-traverse terrain mapping, and radio telescope calibration (shifts to autonomy-led by 2040). Jointly executed (6 of 20): unstructured terrain traverse (human path approval), solar panel installation (human authorizes physical engagement), EVA tool handoff to crew (human confirms before contact), novel site geological sample (scientist selects, robot executes), hardware anomaly reporting (robot flags, human decides), habitat breach locate-and-report (robot locates, human decides response). Human-led (2 of 20): load-bearing joint failure reconfiguration (requires TRL 8, available 2038–2040), new tool demonstration capture (always human-led).
**Set by:** autonomy-trl-tasking
**Affects:** human-factors-teaming (supervisor ratio assumption: at IOC, 12 autonomy-led tasks require monitoring but not authorization; 6 jointly-executed tasks require ~2–5 minutes of human interaction per execution; 4-person crew supervising 3 humanoids executing 2–3 concurrent task chains is manageable at roughly 1:3 robot-to-active-supervisor ratio during nominal operations — this is the primary input to the crew workload model); conops-integrator (task allocation determines the structure of a nominal sortie day; jointly-executed tasks require defined handoff protocols that must appear in ConOps procedures); cost-program (ratio of autonomy-led to human-led tasks affects crew time cost per mission cycle); far-side-base-architect (base layout must support the jointly-executed task handoff locations — EVA worksite proximity, workshop location, shelter-return path)
**Basis:** Task allocation derived from TRL gap analysis in `study/02-human-in-the-loop/03-autonomy-trl-tasking.md` Sections 1–3 against the §A1 autonomy curve and 20-task mission taxonomy. §04 provisional boundary (autonomy-led: routine locomotion, sensor collection, scripted maintenance; human-supervised: novel manipulation, EVA handoff, PSR ops, emergency response) is validated and extended to specific tasks. No contradiction with §04 position found; task taxonomy is a refinement, not a revision.

---

### 2026-05-03 — Human value floor (permanently human-led tasks)

**Parameter:** Tasks that remain human-required regardless of autonomy TRL advancement
**Value:** Seven categories are permanently human-led: (1) Authorization of first execution of any task type in the operational environment (not simulation). (2) All physical contact with suited crew members, including tool handoff, regardless of demonstrated autonomy TRL. (3) Any action on pressurized interfaces or life support hardware. (4) Emergency responses where the outcome affects crew habitat access. (5) Habitat structural modification. (6) Science priority decisions — which sample to collect, which anomaly to investigate. (7) Any situation the robot itself flags as outside its operational envelope (§A9: when the foundation model withholds action on OOD inputs, a human must decide).
**Set by:** autonomy-trl-tasking
**Affects:** human-factors-teaming (the human value floor defines the minimum crew cognitive engagement that cannot be automated away; crew must maintain proficiency in these 7 categories regardless of robot autonomy level; any teaming model that assumes the human value floor shrinks as TRL advances is incorrect for this program); conops-integrator (human value floor tasks must appear in every ConOps scenario as crew-executed steps, not robot-executed steps; they are not removable as operational maturity increases); fault-management-sustainment (fault response procedures must preserve human authority over the 7 categories even in degraded comms states — the hardware inhibit design requirement for autonomous command override flows from category 2 and 4)
**Basis:** Derived in `study/02-human-in-the-loop/03-autonomy-trl-tasking.md` Section 3 from three rationales: (a) exploration is structurally OOD — the situation is novel by definition; (b) consequence asymmetry between authorization gate cost (2–5 min) and failure cost in life-safety/irreversible contexts; (c) the §A9 constraint that foundation models must correctly withhold action on OOD inputs and the human must decide when they do. The floor is a program position, not a TRL gap. It does not change as TRL advances.

---

### 2026-05-03 — Supervisor ratio assumption (teaming model)

**Parameter:** Human-to-humanoid supervisor ratio at IOC and full operation
**Value:** **1 human actively supervising 2–3 humanoids at IOC (2035).** **1 human to 4–5 humanoids at full operation (2038–2040).** Hard floor ceiling: approximately 1:8–10 maximum regardless of TRL due to human value floor saturation in a 4-person crew. The ratio range (not a point) reflects the difference between peak-demand (approximately 1:1.5 effective) and nominal-operations (1:3 effective) with one crew member unavailable.
**Set by:** human-factors-teaming
**Affects:** conops-integrator (sortie day structure must allocate crew time for 4.25 person-hours supervisory demand in a nominal 8-hour shift at IOC; mission timeline cannot assume crew are primarily free for supervision); cost-program (supervisor ratio drives crew size requirements; 4-person crew is the IOC baseline; cost model must carry this as a design assumption); far-side-base-architect (crew quarters and workstation count must support 4 crew simultaneous operations with dedicated supervisory workstation access)
**Basis:** Derived in `study/02-human-in-the-loop/04-teaming-model.md` Section 3 from five-step justification chain: NIP-10 heritage (5:1 at TRL-near-zero), §A1 autonomy curve advancement to TRL 7 by 2035 (12 of 20 tasks autonomy-led), cognitive load arithmetic (4.25 person-hours demand vs. 8 person-hours capacity in 4-person crew), post-2035 TRL 8 advancement (16–17 of 20 tasks autonomy-led by 2040), and human value floor ceiling. See §A18 in `study/05-cross-cutting/margins-and-assumptions.md`.

---

### 2026-05-03 — Crew composition at IOC (teaming model)

**Parameter:** Crew size and humanoid fleet size at Initial Operational Capability (2035)
**Value:** **4 crew, 3 humanoids, periodic supervision as the default operating mode.** Total supervisory demand approximately 4.25 person-hours per crew shift (derived in §02-04 Section 2). Available supervisory capacity approximately 8 person-hours per crew shift (Mir-baseline 25–30% available fraction for a 4-person crew). Headroom factor approximately 2× (§A19). Continuous supervision is a time-limited exception mode, not the baseline. Earth oversight provides mission-plan-level review, not moment-to-moment operational oversight.
**Set by:** human-factors-teaming
**Affects:** conops-integrator (crew composition is a primary ConOps input; 4 crew × 3 humanoids is the IOC baseline for sortie day planning, crew rotation schedules, and emergency response scenarios); cost-program (4-person crew defines the annual crew operations cost for Artemis-heritage analogs; rotational cost model depends on 6-month rotation cadence); far-side-base-architect (4-person crew requires 4 private habitation modules, minimum crew support equipment sized for 4; 3 humanoids require charging, maintenance, and storage provisions for 3 units); destinations-trajectories (lander manifest for IOC must carry 3 humanoids at 75 kg each = 225 kg humanoid mass; 4 crew at approximately 80 kg + suit + gear each)
**Basis:** Derived in `study/02-human-in-the-loop/04-teaming-model.md` Section 2 from Mir crew time baseline (30–40% maintenance absorption leaves 25–30% for supervision at 4-person crew scale) and the §02-03 task allocation table (12 autonomy-led + 6 jointly-executed + 2 human-led at IOC). See §A19 in `study/05-cross-cutting/margins-and-assumptions.md`.

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
|Relay constellation availability ≥95% by IOC; two-satellite minimum architecture assumed|See §A17 below|far-side-base-architect / teleoperation-latency|Medium — single Queqiao-2 provides only 75–85% availability; second satellite is required for supervisory ops|
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

**Added 2026-05-03 by teleoperation-latency.**

The latency tradespace analysis establishes that **>95% simultaneous Earth and far-side line-of-sight coverage** is required for relay-supported supervisory operations from Earth to be an effective mission oversight mechanism. This availability floor is derived from the operational requirement that relay outages must be rare enough that they do not dominate mission planning — if outages are frequent, ConOps must be designed around autonomous operations rather than Earth oversight, which is a different and more demanding TRL requirement for the autonomy stack.

**Single-asset shortfall.** Queqiao-2 provides approximately 75–85% availability of simultaneous dual-line-of-sight coverage for a receiver at the equatorial far side (based on its 24-hour elliptical frozen orbit geometry). This is insufficient for the ≥95% requirement. A two-satellite constellation phased 180° apart in the same orbital family would provide >95% availability. The far-side-base-architect must carry this as an infrastructure prerequisite for the IOC milestone, not a growth option.

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

---

## Stage 5 section agents (collective assessment) — Stage 6 review findings

**What worked:**
- All six sections completed to first-draft standard with consistent structure, position-taking, and margin documentation.
- Environments and heritage sections maintained good `[VERIFY]`/`[EST]` flag discipline.
- Cross-coupling table entries at the end of each section were a useful downstream interface.

**What didn't:**
- **Citation discipline: systemic failure.** Approximately 22 of 25 `\cite{key}` keys had no corresponding BibTeX entries in `corpus/references.bib`. Agents added inline citations without adding bib entries, producing a non-functional citation corpus.
- **Arithmetic errors.** Two numerical errors in §02 (tradespace matrix weighted totals, inflating A-B gap 2.5×); one physics error in §06 (Stefan-Boltzmann radiator sizing claiming 0.3 m² rejects 300 W when the actual limit is ~100 W); DOF counting convention not stated in §03, allowing the 38 vs. 51–55 ambiguity to persist.
- **Word count drift.** §04 reached 5,182 words — 2,700 over the 2,500-word target. Foundation models field survey added ~700 words of content that duplicated positions already taken in the same section.
- **Cross-coupling leakage.** §05 and §06 published different heater ranges (50–150 W vs. 85–175 W) without any reconciliation. Neither agent checked the other's file.
- **Atlas Electric misidentification.** Two sections cited Atlas Electric's actuator type incorrectly (harmonic drives/roller screws rather than direct-drive motors), breaking the heritage argument for the HD-Electric selection in §03.

**Prompt changes required (applied in stage 7):**
1. Mandatory: "For every `\cite{key}` you write, add a corresponding BibTeX entry to `corpus/references.bib`. Do not leave dangling keys."
2. Mandatory: "State the word count of your output before submitting. It must be within ±20% of the target specified in the stage scaffolding."
3. Mandatory: "Show arithmetic derivation inline for any value that appears in a table. Do not write a final number without the calculation steps visible."
4. Mandatory: "Before publishing any cross-coupled number (mass, power, thermal, DOF), search `cross-coupling-log.md` and the adjacent section files to verify consistency."

---

## aerospace-engineer-reviewer — Stage 6

**What worked:**
- All three Blockers were independently identified and well-specified: DOF arithmetic (AE-001), radiator Stefan-Boltzmann physics (AE-002), and tradespace matrix arithmetic (AE-003).
- AE-002 included an independent calculation showing the physics limit, which made it an unambiguous fix target.
- Structured severity ratings (Blocker/Major/Minor/Nit) were correctly calibrated — no false positives in the Blocker tier.

**What didn't:**
- AE-005 (Atlas Electric DOF 56 vs. 28) was filed as Major rather than Blocker; given that it feeds the §01 heritage table directly and the heritage table is downstream input for §03, an argument exists that it should have been Blocker. This is a borderline call.

**No prompt changes required.**

---

## heritage-citations-reviewer — Stage 6

**What worked:**
- HC-001 (Atlas Electric actuator type) and HC-002 (Chang'e-4 citation) are both clean, well-specified Blockers with exact correction instructions.
- The spot-check table (11 claims × provenance evaluation) is the most rigorous citation audit produced in this project to date and should be the model for future heritage review passes.
- The systemic dangling-citation finding (HC-009/P2-8) correctly identified the 22-of-25 problem and specified the fix scope.

**What didn't:**
- HC-005 (Lunokhod 2 citation) was fixed by the §02 agent but with a text note rather than a dedicated BibTeX entry, leaving the citation technically still pointing to Huntress 2011. This was caught by the re-review. The fix was trivial once identified, but HC-005 should have been specified at the Blocker level to prevent exactly this "partial fix" outcome.

**Prompt change recommended:**
- Add: "For any citation finding, specify whether the fix requires (a) a new BibTeX entry in references.bib, (b) a change to the inline `\cite{}` key, or (c) both. Ambiguity here allows agents to fix the text without fixing the bib or vice versa."

---

## reliability-margins-reviewer — Stage 6

**What worked:**
- RM-001 and RM-002 are both genuine Blockers that required non-trivial structural fixes (removal of circular closure logic; addition of a gated assumption). These would not have been caught without an adversarial reviewer.
- The double-margin observation (subsystem NTE × system NTE stacking) is a legitimate structural concern correctly flagged as Major.

**What didn't:**
- None significant — all findings were correctly calibrated and well-specified.

**No prompt changes required.**

---

## cross-coupling-reviewer — Stage 6

**What worked:**
- CC-001 (heater range mismatch §05→§06) is the most important systemic finding of the stage: the same parameter appeared with different values in adjacent sections and no agent caught it. The cross-coupling reviewer's explicit cross-file comparison methodology found it where individual section reviewers would not.
- The reconciliation results table (13 decisions × pass/fail) is an efficient format for this reviewer's scope.

**What didn't:**
- None significant.

**No prompt changes required.**

---

## scope-discipline-reviewer — Stage 6

**What worked:**
- SD-001 (foundation models survey) and SD-003 (dust mitigation verbosity) are correctly identified and correctly calibrated as Majors.
- The word count table (5 sections × word count vs. target) is an efficient summary that should be included in every scope-discipline review output.

**What didn't:**
- The reviewer did not flag the overall finding count as potentially indicating systemic scope drift. With §04 at 5,182 words, the section is over-target by a factor of 2×. A pattern-level observation ("all sections over target; §04 worst offender") would have been useful context for the orchestrator's triage.

**Prompt change recommended:**
- Add: "If more than 2 sections are over word-count target, state this as a systemic pattern, not just individual findings. Estimate the total removable word count across all sections."

---

## devils-advocate-reviewer — Stage 6

**What worked:**
- DA-001 (economics unquantified) and DA-002 (TRL 6 gate without demo program) are both correctly identified as Blockers. These are exactly the kind of "structurally load-bearing but undefended" claims that a program review board would attack first.
- The DA-001 fix specification (task taxonomy + cost delta + crossover sensitivity + ConOps gate) was detailed enough that the §02 agent implemented it correctly in a single pass.

**What didn't:**
- None significant.

**No prompt changes required.**

---

## robotics-actuation-structures — Stage 6 fix pass

**What worked:**
- Went beyond the minimum required fix for AE-004/RM-003/RM-004: added a full three-class actuator mass derivation with specific commercial catalog anchors (Harmonic Drive AG CSF series, IKO CRBH series, Unitree M107). This is the right level of rigor for a concept study.
- Independently identified and corrected the FFKM −180°C physical infeasibility (the seal glass-transitions at −50 to −70°C), which was not in the triage brief — this is good engineering catch behavior.
- Correctly adopted SSRMS/Canadarm2 as the space-heritage anchor for harmonic drive actuation, which is the right substitution for the discredited Atlas Electric heritage chain.

**What didn't:**
- The agent added §A14 and §A15 to the assumptions register. The orchestrator separately instructed the Batch 2 agent to add §A14 (gait factor), causing a naming collision — the gait factor ended up as §A16. The orchestrator should have checked the assumption register count before issuing §A14 as the instruction.

**No agent prompt change required** (the naming collision was an orchestrator error).**

---

## space-environments — Stage 6 fix pass

**What worked:**
- Clean, targeted fix pass: all three findings (HC-002, CC-001, SD-003) addressed exactly as specified.
- The "Confirmed value for cross-coupling" callout added to §05 is the right pattern for documenting an authoritative value that downstream agents must match.

**What didn't:**
- Nothing significant.

**No prompt changes required.**

---

## robotics-sensing-autonomy — Stage 6 fix pass

**What worked:**
- Foundation models compression from ~700 to ~150 words is a disciplined reduction that preserves the program position without losing actionable content.
- The 2029 TRL 6 gate minimum observable paragraph is specific enough to function as an actual program gate criterion (named facility class, task specification, duration, decision rule).

**What didn't:**
- Nothing significant.

**No prompt changes required.**

---

## humanoid-systems-architect (§02 and §06+§01) — Stage 6 fix pass

**What worked:**
- §02 economics analysis correctly structured with all four required elements (taxonomy, cost delta, crossover, ConOps gate).
- §06 survival mode closure correctly rewritten to remove the circular 150 W "goal" and replace with a FSP provision approach.
- Radiator sizing correctly flagged as open (TRL 2) with Stefan-Boltzmann constraint stated.

**What didn't:**
- The §06 agent was instructed to add §A14 for the gait factor, but §A14 had already been taken by robotics-actuation-structures for the actuator mass sensitivity assumption. The agent correctly resolved this by using §A16 instead, but the numbering is now non-sequential in the register (§A14, §A15, then §A16 out of order relative to section origin). A future cleanup pass should normalize this.

**No prompt change required** (orchestrator-side issue on assumption numbering).

---


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

---

## Stage 6 Assessment

**What worked well.**

*Parallel dispatch discipline.* Six reviewers ran in parallel on all six sections simultaneously. Four Batch 1 fix agents ran in parallel. Re-reviews ran in parallel. The background agent pattern (launch, continue other work, collect results on completion notification) worked as designed. Total elapsed time for the review-fix-re-review cycle was approximately correct given the scope.

*Triage structure.* The two-tier triage (P1 cross-reviewer patterns, P2 standalone blockers) correctly identified the highest-leverage fixes. The Batch 1/Batch 2 sequencing constraint was correctly identified (Batch 2 cannot run until DOF count and heater range are confirmed) and enforced.

*Re-review pass.* The targeted re-review (by reviewer, against specific finding IDs) is an efficient verification pattern. 19/20 findings PASS on first re-review. The one residual failure (HC-005 partial fix) was caught and fixed in a single targeted edit.

*Stop hook enforcement.* The stop hook (`~/.claude/stop-hook-git-check.sh`) blocked every session exit with uncommitted changes. This forced real-time commit discipline that was absent in stages 1–4. The stop hook is the most effective breadcrumb enforcement mechanism deployed to date.

**What didn't work.**

*Assumption numbering collision.* The orchestrator instructed the Batch 2 humanoid-systems-architect agent to add §A14 for the gait factor, without first checking whether §A14 had been taken by the robotics-actuation-structures agent (it had, for actuator mass sensitivity). The gait factor ended up as §A16. The assumption register is now non-sequential in its section-origin ordering. **Fix:** Before instructing any agent to add §A_N, query the assumption register for the highest existing §A_N and pass the correct next number in the agent prompt.

*Background agent interleaving with manual commits.* Multiple background agents wrote to overlapping files (session-logs.md, margins-and-assumptions.md) and completed after the orchestrator had already committed earlier versions of those files. This produced a sequence of small catch-up commits rather than clean per-agent commits. **Fix:** Wait for all parallel agents to complete before committing cross-cutting files (session-logs, margins register, cross-coupling log). Commit section files (§02, §03, etc.) eagerly, but hold cross-cutting files for a final batch commit.

*GitHub issues sync failure.* The GitHub MCP token expired during the P1/P2 issue-creation batch, leaving all 10 issues uncreated. The `review/triage.md` file serves as the canonical tracking document, but GitHub issues are the intended interface for external stakeholders. **Fix:** GitHub MCP should be tested for token validity before a batch write operation. Failure should be surfaced immediately, not silently skipped.

*§06 actuation power heritage (HC-006) was partially addressed.* The 0.85 efficiency factor is now explained as the ratio of HD-Electric efficiency (83%) to SEA efficiency (75%), but the underlying Valkyrie SEA power figure (1,800 W) is still from an estimated figure based on battery capacity and runtime — not a direct published measurement. This is a residual weakness correctly noted in the re-review PASS verdict ("requires validation against per-joint power data when hardware is available"). It was correctly scoped as a Major (not Blocker) and the fix correctly moves it from "uncited" to "cited with validation caveat."

**Net assessment.** Stage 6 executed the first real review pass and closed 10 Blockers and 12 selected Majors. The 51 combined findings confirmed that stage 5 section agents drifted on scope (word count) and technical discipline (unsupported numbers, broken heritage, arithmetic errors). The review-fix-re-review cycle worked correctly. The stop hook successfully enforced commit discipline. Key improvements needed for stage 7: assumption numbering handoff protocol, background agent commit sequencing, and citation discipline enforcement at agent prompt level.


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

---

## Lesson 6: Citation keys without BibTeX entries are non-functional and invisible

**From stage 6 review (HC-009, P2-8).**

Approximately 22 of 25 `\cite{key}` references across all six Question (a) sections had no corresponding BibTeX entry in `corpus/references.bib`. The agents added inline citation keys correctly, but assumed the BibTeX entries already existed or would be added later. The result is a document that looks citable but is not — a reviewer cannot look up any of the cited sources.

**Why it happened:** Agent prompts specified "cite your sources using `\cite{key}` format" but did not require BibTeX entry creation as part of the same action. Adding an inline key takes one second; adding a BibTeX entry takes thirty seconds. Under any time pressure, the BibTeX step gets deferred.

**Corrective action (applied in stage 7):** Agent prompts must now state explicitly: "For every `\cite{key}` you add to the text, you must also add a BibTeX entry to `corpus/references.bib` in the same session. Do not add a citation key without its bib entry. If you cannot find a primary source, use a `@misc` entry with a `note = {To be confirmed against primary source before PDR}` field." This is a blocking requirement, not a guideline.

---

## Lesson 7: Arithmetic errors in tables are invisible without forced derivation display

**From stage 6 review (AE-001, AE-002, AE-003).**

Three arithmetic errors survived to the review pass: the tradespace matrix weighted totals in §02 were wrong (inflating the A-vs-B gap 2.5×); the DOF count in §03 did not state its counting convention (leaving the 38 vs. 51–55 ambiguity); the Stefan-Boltzmann limit in §06 was applied incorrectly (claiming 0.3 m² at ε=0.70 rejects 300 W, when the actual limit at realistic lunar sink temperature is ~100 W).

**Why it happened:** Tables contain final values with no visible derivation. An agent that calculates wrong and writes a wrong number produces output indistinguishable from output where the calculation was done correctly. The error is invisible until an independent reviewer checks the arithmetic.

**Corrective action (applied in stage 7):** Any value in a table that results from a calculation must show the calculation steps, either in the table Notes column or in a derivation subsection immediately preceding the table. A final number without visible steps is not acceptable for any value that a downstream agent or reviewer will use as an input. The review pass is not a substitute for in-band arithmetic verification — reviewers are expected to find arithmetic errors, but requiring them to do so increases review cost. The first line of defense is forcing derivation display.

---

## Lesson 8: Cross-coupling mismatches between adjacent sections propagate until reviewed

**From stage 6 review (CC-001, P1-B).**

§05 stated electronics/battery survival heaters at 50–150 W. §06 used 85–175 W — a 70% lower-bound inflation that fundamentally changed the survival power closure narrative. Neither section agent detected the discrepancy; no cross-coupling entry was written when §06 chose its different range.

**Why it happened:** Agents read the section they are writing but do not proactively cross-check the same parameter in adjacent section files. The cross-coupling log is supposed to capture these decisions, but it requires an agent to (a) know that another section has already set a value, and (b) choose to log the discrepancy rather than silently using their own value.

**Corrective action (applied in stage 7):** Agent prompts for integrating sections (§06 budget) must now include: "Before writing any value that was also set in §01–§05, search those files for that value and verify consistency. If you use a different value, log the change in `cross-coupling-log.md` with a justification." The cross-coupling log check is a mandatory pre-commit action for any agent whose section is an integrator.

---

## Lesson 9: Assumption register numbering must be centrally coordinated

**From stage 6 fix pass.**

The robotics-actuation-structures agent (Batch 1) added §A14 (actuator mass sensitivity) and §A15 (boot cover replacement) to the assumptions register. The orchestrator then separately instructed the humanoid-systems-architect agent (Batch 2) to add §A14 (gait factor). The gait factor ended up as §A16 — non-sequentially numbered relative to the section order that would be expected.

**Why it happened:** The orchestrator issued assumption number assignments by counting the highest existing entry (§A13 at the time of Batch 2 briefing) without accounting for the fact that Batch 1 agents were simultaneously writing §A14 and §A15.

**Corrective action (applied in stage 7):** The orchestrator must query the assumption register for its highest numbered entry immediately before issuing any instruction that includes a specific §A_N number. The query happens in the same message turn as the dispatch prompt, not at prompt-writing time. Alternatively, agent prompts should say "add this assumption as the next sequential entry after the current highest §A_N — do not use a specific number assigned in this prompt."


## 9. Session Logs

*Showing last 10 of 26 sessions. Earlier sessions: titles only.*

- 2026-05-03 — Stages 1-4 reconstruction (retroactive log)
- 2026-05-03 — Stage 5: Foundation repair and Question (a) completion
- 2026-05-03 — humanoid-systems-architect: form factor tradespace
- 2026-05-03 — robotics-actuation-structures: actuation and structures
- 2026-05-03 — robotics-sensing-autonomy: sensing and autonomy stack
- 2026-05-03 — space-environments: environments hardening
- 2026-05-03 — visualization-agent: first three charts
- 2026-05-03 — meta-supervisor: first observation run
- 2026-05-03 — executive-summary-agent: first executive summary
- 2026-05-03 — humanoid-systems-architect: mass/power budget integration
- 2026-05-03 — devils-advocate-reviewer: stage 6 review pass
- 2026-05-03 — scope-discipline-reviewer: stage 6 review pass
- 2026-05-03 — cross-coupling-reviewer: stage 6 review pass
- 2026-05-03 — heritage-citations-reviewer: stage 6 review pass
- 2026-05-03 — aerospace-engineer-reviewer: stage 6 review pass
- 2026-05-03 — reliability-margins-reviewer: stage 6 review pass

**Recent sessions (full):**

### 2026-05-03 — humanoid-systems-architect (§02): stage 6 finding remediation

2026-05-03 — humanoid-systems-architect (§02): stage 6 finding remediation

Addressed four findings in `study/01-optimal-space-humanoid/02-form-factor-tradespace.md`: corrected the Weighted total row in the evaluation matrix table from the erroneous values (A=3.60, B=3.35, C=2.95, D=2.55, E=2.80) to the arithmetically correct values (A=3.65, B=3.55, C=3.25, D=2.90, E=2.85), resolving AE-003 and CC-002; updated Candidate A's mass description from the pre-lock placeholder "60–130 kg" to the committed "75 kg design-to per this study's commitment (Section 4)" with heritage context preserved, resolving CC-005; added a new subsection "Program Economics: Single-Standard vs. Dual-Standard Architecture" to Section 4 with task taxonomy (~40–60% human-geometry-required), parametric recurring cost delta ($3–8M/year dual-standard overhead), crossover sensitivity analysis (mass penalty launch cost ~$1–5M total vs. $60–160M dual-standard lifecycle cost), and an explicit go/no-go gate tied to the ConOps task taxonomy, resolving DA-001; and corrected the Lunokhod 2 distance attribution to note the 39.2 km figure derives from LRO photogrammetric cartographic revision rather than Huntress & Marov (2011), resolving HC-005.

---

### 2026-05-03 — space-environments: stage 6 finding remediation

2026-05-03 — space-environments: stage 6 finding remediation

Addressed three findings from the stage 6 review pass. HC-002 (Blocker): corrected the Chang'e-4 LND citation throughout §05 — replaced the non-existent key `zaconte2020lnd` with `zhang2020lnd`, corrected in-text attribution from "Wimmer-Schweingruber et al." to "Zhang et al. (2020)", and added the correct BibTeX entry to `corpus/references.bib`. CC-001 (Blocker): evaluated the 50–150 W electronics/battery survival heater range and confirmed it is defensible as stated; added an explanatory note in Section 2 establishing that the electronics are torso-concentrated and the torso compartment is blankable analogously to a rover WEB, so the bipedal limb surface area does not drive the electronics heater budget — the confirmed §05 value is 50–150 W and humanoid-systems-architect must align §06 to this value. SD-003 (Major): compressed dust mitigation subsections 4.1–4.3 from option-evaluation narrative (~700 words) to four-element strategy/heritage/TRL-gap/fallback format (~300 words), removing approximately 400 words of design-deliberation content. Also corrected CC-010 nit (added "dual-stage" descriptor in §4.4) and CC-012 nit (revised Section 1 radiation row TID figure from "120–140 krad" to the correct "140–210 krad unshielded" consistent with Section 3 and the cross-coupling log).

---

### 2026-05-03 — robotics-sensing-autonomy: stage 6 finding remediation

2026-05-03 — robotics-sensing-autonomy: stage 6 finding remediation

Addressed four findings from the stage 6 review pass in `study/01-optimal-space-humanoid/04-sensing-autonomy.md`. DA-002 / Fix 1: added the "2029 TRL 6 Gate — Minimum Observable" paragraph to Section 3, naming the test system (75 kg bipedal testbed or first article), the task (unscripted locomotion on JSC-1A or ISAC simulant in a 1/6-g offload facility for 30+ continuous minutes with one unplanned terrain feature encounter), the environment (representative gravity and terrain, thermal/vacuum not required at TRL 6), and the gate decision rule (Q4 2028 demonstration deadline; failed or operator-intervened demonstration does not close the gate; slip past Q2 2029 triggers IOC date renegotiation). CC-004 / Fix 2: added a three-row per-layer TRL path table after the autonomy stack diagram showing current space TRL, required TRL at the 2029 gate, and the key development item for each layer. SD-001 / Fix 3: compressed Section 4 (foundation models) from approximately 700 words of commercial system field survey to approximately 150 words of program position — two program-relevant failure modes (OOD behavior on lunar surface; radiation bit-error effects on weights/activations) and the 2029 gate decision criterion for expanding foundation model scope. SD-002 / Fix 4: compressed each autonomy stack layer description to 3–5 sentences covering current space TRL, mission-specific gap, and required validation path. Estimated net word reduction from prior approximately 5,200-word version: approximately 900–1,000 words. Updated §A1 in `study/05-cross-cutting/margins-and-assumptions.md` with a one-line pointer to the TRL 6 gate observable definition. Appended cross-coupling log entry for the TRL 6/2029 gate minimum observable.

---

### 2026-05-03 — robotics-actuation-structures: stage 6 finding remediation

2026-05-03 — robotics-actuation-structures: stage 6 finding remediation

Addressed all four required blockers and majors in `study/01-optimal-space-humanoid/03-actuation-structures.md`. Fix 1 (AE-001): reconciled the DOF table using bilateral totals — table now shows 51–55 kinematic DOF as the correctly summed bilateral total and 38–39 as the independently actuated axes count that drives the actuator mass budget; text explains the convention distinction explicitly. Fix 2 (HC-001): removed Atlas Electric as primary heritage for harmonic drive efficiency; the 85–90% figure is correctly attributed to Atlas Electric's direct-drive architecture as a general electric actuation benchmark; SSRMS/Canadarm2 ISS joints are now the primary space heritage for HD actuation, supported by Harmonic Drive AG ESMATS 2019 space qualification paper and ASME J. Mech. Des. 2021 mechanical efficiency paper; harmonic drive efficiency correctly stated at 75–85% (ratio-dependent). Fix 3 (AE-004/RM-003): added three-class actuator mass derivation anchored to Harmonic Drive AG CSF-14/CSF-20 catalog masses and Unitree M107 motor specifications; weighted total yields 385 g/joint (14.6 kg) vs. 342 g/joint budget (13.0 kg); 1.6 kg gap documented as a budget stress requiring Class A joint gravity-optimization in lunar 1/6 g. Fix 4 (RM-004): added three-class joints/sealing mass derivation anchored to IKO CRBH series cross-roller bearing catalog masses, labyrinth housing parametric estimate, and FFKM lip seal catalog mass; total yields 3.53 kg vs. 4.0 kg budget (conservative margin). Also corrected FFKM baseline from infeasible −180°C operation to heater-maintained ≥−60°C operation, downgrading TRL risk from high to medium. Added §A14 (actuator mass sensitivity) and §A15 (boot cover replacement interval) to margins register. Updated §A4, §A5, §A6 in margins register to reflect corrected heritage and baseline.

---

### 2026-05-03 — orchestrator: stage 6 task 5–6 (re-review, retro, meta-supervisor)

2026-05-03 — orchestrator: stage 6 task 5–6 (re-review, retro, meta-supervisor)

**Task 5 — Re-review pass:**
Dispatched six focused re-review agents in parallel, each covering one reviewer's original findings across their relevant sections. Results: 19/20 findings PASS on first re-review. One residual failure: HC-005 (Lunokhod 2 39.2 km still citing Huntress 2011 — §02 had added a parenthetical note about LRO origin but no dedicated BibTeX key). Fixed directly: added `lroc_lunokhod2_traverse` BibTeX entry (Karachevtseva et al. 2013, Planetary and Space Science) and updated §02 inline citation. Final score: 20/20 PASS.

**Task 6 — Retro and meta-supervisor:**
Wrote stage 6 entries for all four retro files:
- `retro/agent-performance.md`: collective stage 5 agent assessment + individual entries for all 6 reviewers and 5 fix agents
- `retro/orchestrator-performance.md`: stage 6 self-assessment (what worked: parallel dispatch, stop hook, triage structure; what didn't: assumption numbering collision, background agent commit interleaving, GitHub sync failure)
- `retro/process-lessons.md`: Lessons 6–9 (citation keys without bib entries; arithmetic derivation display; cross-coupling adjacent-section check; assumption numbering coordination)
- `retro/system-observations.md`: 3 new observations (citation corpus non-functional; stop hook effectiveness; resolved: review agents never invoked)

**Got stuck:** Nothing — all tasks completed in sequence.

**Next session:** Task 7 (update agent prompts based on retro findings) and Task 8 (generate handback-stage6.md).

---

### 2026-05-03 — humanoid-systems-architect (§06 + §01): stage 6 Batch 2 finding remediation

2026-05-03 — humanoid-systems-architect (§06 + §01): stage 6 Batch 2 finding remediation

Addressed seven findings across `study/01-optimal-space-humanoid/06-mass-power-budget.md` and `study/01-optimal-space-humanoid/01-overview.md`.

**§06 changes:**
- P1-B (Blocker): corrected survival heater row from 85–175 W to 50–150 W, matching §05 confirmed value. Recalculated survival mode totals: pre-margin 79–209 W, with 30% margin 103–272 W. Removed the circular ≤150 W design goal; replaced with "FSP provision: 300 W (worst-case margin, pending thermal model)". Status updated: both bounds close against the FSP provision.
- P2-2 (Blocker): flagged thermal radiator sizing as OPEN in the thermal management notes cell. Required rejection area for 300 W at ε=0.70, T_panel=50°C, T_sink~243 K is 0.7–1.5 m² per Stefan-Boltzmann — the prior 0.3 m² was insufficient by ~3×. Thermal management design-to mass reduced from 3.0 kg to 2.5 kg with 0.5–3.0 kg radiator mass as open risk provision in growth allowance. Allocated subtotal revised 58.2 → 57.7 kg; growth allowance revised 16.8 → 17.3 kg. Total design-to and NTE unchanged at 75.0 kg / 97.5 kg.
- CC-003 (Major): added note to power table — §04 sensor peak of 75 W applies to full simultaneous active configuration; the 44 W locomotion column represents the more common operational draw; 75 W peak should be used for thermal analysis.
- P2-5 (Blocker): added sentence logging the 0.55 gait factor as §A16. Added third qualification to Budget Closure section covering gait factor sensitivity.
- AE-008 (Major): added depth-of-discharge note to battery derivation; quantified the 20% DoD reserve consequence (15.6 kg cells, ~19% of growth allowance); tracked under §A13.
- HC-006 (Major): added citations and clarification to the efficiency improvement factor derivation, citing Paine et al. 2015 for SEA efficiency at 65–75% and Harmonic Drive AG catalog for HD efficiency at 78–83%.

**§01 changes:**
- AE-005 / P2-3 (Blocker): corrected Atlas Electric DOF from 56 to 28 (Boston Dynamics, 2024). Updated actuation type column to "custom fully-rotational direct-drive motors, high-density NdFeB motors; no harmonic drives, no roller screws". Updated Key lessons column to note the 56-DOF figure in earlier drafts was incorrect.

**Breadcrumbs:**
- Appended §A16 (locomotion gait factor 0.55) to margins register with full derivation, technology gate, and owner; updated header to current highest A16.
- Appended cross-coupling log entry for §06 survival heater correction and radiator sizing open flag.
- Updated both files to review-status: findings-addressed, last-updated: 2026-05-03.

---

### 2026-05-03 — orchestrator (as soviet-russian-heritage): stage 7 Task 2 heritage backfill

2026-05-03 — orchestrator (as soviet-russian-heritage): stage 7 Task 2 heritage backfill

Topic 7 written directly by orchestrator after soviet-russian-heritage agent timed out. Topic 7 scope: cosmonaut supervisory control performance data — Mir crew time allocation (30–40% maintenance), supervisory control examples (Lyappa arm, Elektron fault management, TORU/Kurs mode transition), Mars-500 behavioral health results (Basner et al. 2013 PNAS), and Lunokhod NIP-10 team model projected to 2035 supervisor ratio. Word count for Topic 7: approximately 1,000 words. Added three BibTeX entries (kanas2008space, basner2013mars500, nasa_sma_spektr). Sheridan key corrected from sheridan1978supervisory to sheridan1978teleoperators (already added by teleoperation-latency agent). Total file now 6,702 words across 7 topics.

---

### 2026-05-03 — teleoperation-latency: latency tradespace (Section 02-02)

2026-05-03 — teleoperation-latency: latency tradespace (Section 02-02)

Wrote `study/02-human-in-the-loop/02-latency-tradespace.md` from stub to complete draft. The section develops the physics-derived latency table for five destinations (Earth orbit/ISS, lunar near side, lunar far side via relay, Mars, Jupiter), shows arithmetic for each case using the canonical constants (speed of light 299,792 km/s, IAU Earth-Moon mean distance 384,400 km), and derives the Queqiao-2 relay latency overhead (~+9% vs. direct, yielding 2.78–2.92 s RTLT minimum) from published orbital parameters. The performance degradation analysis is anchored to three heritage sources: Lunokhod NIP-10 operations at 2.5 s RTLT (frame-advance teleoperation, 1–2 km/hr traverse ceiling, the crater incident), METERON Haptics-2 and SUPVIS Justin results at 820–850 ms RTLT (bilateral control feasible; task-level supervisory commanding is more robust than direct teleoperation at this latency tier), and Sheridan and Verplank's 1978 supervisory control taxonomy mapped to latency tiers. The autonomy/teleoperation handoff is defined in three tiers: Tier A (≤50 ms on-base link, forward-deployed crew, all task modes viable), Tier B (~2.8 s Earth-relay, Lunokhod regime, direct teleoperation not viable for EVA-class tasks), and Tier C (8.7–42 min Mars, fully autonomous rover model). The forward-deployed-human argument is stated with quantitative grounding in the degradation curve and two concrete scenarios (traverse speed differential, medical emergency response). Seven BibTeX entries added to corpus/references.bib (METERON Haptics-2, SUPVIS Justin, KONTUR-2, Analog-1, Sheridan 1978, Sheridan 2002, CNSA Queqiao-2, SPJ lunar relay). Two cross-coupling entries appended (forward-deployed latency target and relay availability floor; latency-tier autonomy handoff). One new assumption §A17 (relay constellation availability ≥95% by IOC, two-satellite minimum) added to margins register. Approximate word count: ~2,950 words (within hard cap).

**Got stuck:** Queqiao-2 availability fraction for far-side coverage could not be confirmed from a single authoritative source — used the 75–85% parametric estimate from orbital geometry reasoning and noted the two-satellite requirement as §A17. The METERON papers could not be directly accessed (403 errors on DLR elib); citations were built from secondary sources (IEEE Xplore abstracts, ResearchGate descriptions, ESA esa-telerobotics.net). All citations are flagged with "[to be confirmed against primary source before PDR]" in BibTeX notes where accessed only via secondary sources.

---

### 2026-05-03 — autonomy-trl-tasking: task allocation and TRL gap analysis (Section 02-03)

2026-05-03 — autonomy-trl-tasking: task allocation and TRL gap analysis (Section 02-03)

Wrote `study/02-human-in-the-loop/03-autonomy-trl-tasking.md` from stub to complete draft. The section develops a 20-task mission taxonomy for the far-side base, assigns minimum autonomy TRL requirements for unattended execution of each task, and maps the gap between current capability (2026) and IOC (2035) and full operation (2040) gates. The task allocation table at IOC assigns 12 tasks as autonomy-led, 6 jointly-executed, and 2 human-led. The human value floor (7 permanently human-required categories) is defined and justified. §A1 and §A9 assumptions are referenced; no contradictions found with existing register entries. Multiple BibTeX entries added (diftler2011r2, ssrms2020ntrs, bmw2024figuredeployment, agility2024digit, huntress2011soviet, unitree2024h1, bdatlaselectric2024, zhao2023aloha, black2024pi0). Cross-coupling entries appended for task allocation table and human value floor. Word count: approximately 4,479 words — over the 3,000-word hard cap. Flagged for Stage 8 scope-discipline reviewer.

**Got stuck:** The TRL gap analysis for manipulation planning (T05, T13) relies on state-of-art claims for diffusion-policy manipulation that are rapidly evolving; TRL estimates may be conservative or optimistic relative to 2026 literature. Flagged with [EST] in the section.

---

### 2026-05-03 — human-factors-teaming: Q(b) overview and teaming model (Sections 02-01 and 02-04)

2026-05-03 — human-factors-teaming: Q(b) overview and teaming model (Sections 02-01 and 02-04)

Wrote `study/02-human-in-the-loop/01-overview.md` (~1,720 words, within 1,500–2,000 target) and `study/02-human-in-the-loop/04-teaming-model.md` (~3,340 words, within 2,500–3,500 target). The overview section frames Question (b) precisely, states the three conditions under which human-in-the-loop adds value (latency below 200 ms, novelty/consequence profile, first-execution authorization), and makes the forward-deployed-human argument from first principles (physics derivation: Earth supervisor at 2.8 s RTLT cannot intervene before physical events complete at rover speeds; medical emergency case makes the argument concrete). The teaming model section defines three supervision modes (continuous, periodic, on-demand) with cognitive load and crew time cost derivations; presents the cognitive load arithmetic for 4 crew × 3 humanoids (4.25 person-hours demand vs. 8 person-hours capacity, ~2× headroom); defends the supervisor ratio position (1:2–3 at IOC, 1:4–5 at full ops, ceiling ~1:8–10); states the three-pillar forward-deployment case; ties to §A8 and §A9. Heritage anchors: NIP-10 baseline (5:1), Mir time allocation (30–40% maintenance), Mars-500 behavioral degradation (Basner et al. 2013). Cross-coupling entries appended for supervisor ratio (§A18) and crew composition (§A19). Assumptions §A18 and §A19 referenced in CC log but not added to margins register during agent run — added by orchestrator as a closing action.

**Got stuck:** §A18 and §A19 were referenced in CC log and teaming model text but not written to the assumptions register. Orchestrator added both as a mandatory closing action. Session log entry also added by orchestrator (agent did not write it).

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

You are receiving this handback to design stages 8, 9, and 10 of the humanoid-forward space exploration study.

**Your job:**

1. Read this handback in full.
2. Identify the 2-3 most important findings or patterns.
3. Decide whether the next stage should be remediation (fixing what's broken), continuation (next major content push), integration (weaving sections together), or pivot (the findings revealed something the study needs to change fundamentally).
4. Propose stages 8–10 with concrete scope for each, in the same single-file scaffolding format used for stages 1-4.
5. Be honest if the findings suggest the study should change direction. The handback exists so the loop can correct itself.

**What good output looks like:**

- A clear assessment of what stages 1–7 produced.
- A specific recommendation for the next stage with reasoning.
- A scaffolding document for the next stage in the same `=== FILE: path ===` format used previously.
- Any prompt-tuning recommendations for existing agents based on the retro findings.

---

*End of handback.*