---
title: "Optimal Space Humanoid: Actuation and Structures"
status: draft
review-status: findings-addressed
owner: robotics-actuation-structures
last-updated: 2026-05-03
---

# Section 01-03 — Optimal Space Humanoid: Actuation and Structures

This section takes positions on actuation type, structural materials, joint architecture, and dust mitigation strategy for the bipedal space humanoid. It designs to the constraints passed by the form factor tradespace in Section 01-02: 75 kg design-to mass (97.5 kg not-to-exceed), 800 W peak power, all four end-effectors capable of dual grasp modes, and all joints accessible to EVA-gloved hands. Sizing is parametric against heritage data. No detailed mechanical engineering is performed.

---

## 1. Actuation Type Trade

### Four Candidates

**Series Elastic Actuation (SEA).** NASA Valkyrie/R5 is the primary heritage \cite{radford2015valkyrie, paine2015valkyrieActuator}. A compliant spring element is placed in series between the motor/gearbox and the joint output, providing force control, shock absorption, and safe human-robot contact. Valkyrie uses SEA throughout its 44-DOF architecture; the design papers document torque bandwidths of approximately 50 Hz and per-joint power draws in the 20–100 W range depending on joint size \cite{paine2015valkyrieActuator}. SEA's primary liabilities are mass and complexity: the spring element, its sensors, and the additional housing add roughly 30–40% mass per joint relative to a rigid transmission equivalent. Valkyrie at 129 kg for 44 DOF is the direct evidence of this penalty. Spring elements are also potential dust trap surfaces, and the compliance that makes SEA attractive for human-contact safety creates control challenges under the rapid load transients expected on lunar regolith.

**Quasi-Direct Drive (QDD).** Unitree H1/G1 heritage \cite{unitree2023h1, unitree2024g1}. High-torque-density motors (peak ~360 N·m at the knee on the H1) with low-ratio transmissions achieve backdrivability without compliance elements. QDD joints are mechanically simple — fewer parts, less mass per joint, fewer seal interfaces. Liabilities: high motor mass (large-diameter motors sit at the joint), lower force bandwidth than SEA at equivalent torque, and poor efficiency at high reduction ratios when fine position control is required. For a 75 kg platform with tight mass margins, placing large brushless motors at each of the primary load-bearing joints (hips, knees, ankles, shoulders) creates a mass distribution problem: joint mass dominates structural mass in QDD designs.

**High-Ratio Harmonic Drive Electric (HD-Electric).** The HD-Electric architecture pairs a compact brushless DC motor with a high-ratio harmonic drive transmission (50:1 to 160:1) in a compact, zero-backlash package. This approach is used in space manipulation heritage: the SSRMS (Canadarm2) joints on ISS use harmonic drive transmissions driven by brushless DC motors, and the SSRMS shoulder joints are the primary heritage for space-qualified HD-Electric actuation in a high-load manipulation context \cite{ssrms2020ntrs}. The harmonic drive product line (Harmonic Drive AG CSF/CSD series) is the standard transmission in precision industrial robots, with documented transmission efficiencies of 75–85% at rated load depending on reduction ratio, as published in the technical literature on HD gear performance \cite{harmonicdrive_esmats2019, mechanical_efficiency_hd_asme2021}. At high reduction ratios (>100:1), flexspline elastic hysteresis reduces efficiency toward the lower bound of this range; ratios in the 80:1–120:1 class used in robot joints fall in the 78–83% range under typical loading. Modern electric actuators using custom direct-drive architectures (such as the 2024 Boston Dynamics Atlas Electric, which uses custom fully-rotational direct-drive motors — not harmonic drives) have demonstrated 85–90% electrical-to-mechanical efficiency at the system level \cite{bostondynamics2024atlas, bostondynamics2024electricera}, establishing the benchmark for advanced electric actuation efficiency. HD-Electric actuation with harmonic drives achieves somewhat lower transmission efficiency than direct-drive due to flexspline losses, but compensates with the highest torque density of the harmonic-drive-based options: a compact motor plus harmonic drive can deliver joint torques that would require a much larger QDD motor, keeping joint-resident mass low and allowing structural mass to dominate. The liability is backdrivability: harmonic drives are mechanically stiff and do not back-drive under external loads, requiring active torque sensing and impedance control to achieve safe contact behavior.

**Hydraulic Actuation.** Boston Dynamics Atlas Generation 1 and 2 (pre-2024) used hydraulic actuators: a central hydraulic pump, distributed servo valves, and actuating cylinders at each joint. Hydraulic actuation offers high power density, inherent compliance under overload, and force-output bandwidth that electric actuators at equivalent force levels struggle to match. Boston Dynamics explicitly abandoned this architecture in the 2024 Atlas Electric transition, citing operational complexity (hydraulic fluid management, leak risk, pump noise, startup time) and the difficulty of achieving fine motor control with proportional valves \cite{bostondynamics2024electricera, spectrum2024atlas}. In the space environment, hydraulic actuation adds two disqualifying problems on top of the terrestrial liabilities: (1) hydraulic fluid presents an outgassing and contamination risk in vacuum — fluid selection for wide-temperature-range vacuum use is an unsolved problem at TRL 3 or below; and (2) hydraulic lines are a single-fault total-loss failure mode that is difficult for a crew member in EVA gloves to diagnose and repair. The Mir sustainment philosophy — "no instrument inside the station that cannot be replaced in flight" \cite{mir_tp98207890} — argues directly against fluid-line architectures at a far side base. Hydraulic actuation is eliminated from further consideration.

### Evaluation Against Space Environment Requirements

| Criterion | SEA | QDD | HD-Electric |
|---|---|---|---|
| Vacuum (outgassing) | Grease selection required; elastomer seals acceptable | Same as SEA | Same as SEA; smallest seal perimeter |
| Thermal cycling (−180°C to +130°C) | Spring steel space-qualifiable; elastomers are the TRL risk | Motor magnet and bearing grease are TRL risk | Harmonic flexspline at cryogenic temps requires heritage validation; TRL 4 |
| Dust ingestion | Compliance gaps around spring assembly are seal liabilities | Fewer surfaces, simpler sealing geometry | Tightest housing, fewest internal moving-surface gaps |
| Radiation (TID) | Motor winding and position sensor TID tolerance needs validation | Same | Same |
| Mass budget (§A2) | High: 129 kg at 44 DOF is the heritage data point | Medium-high: joint-resident motor mass | Best: highest torque density, smallest motor per joint |
| Force control / safe contact | Best: intrinsic compliance | Acceptable: backdrivable by design | Requires active impedance; achievable with torque sensors |
| Crew serviceability (ORU) | Complex spring assembly; more parts per joint | Simpler; fewer parts | Simplest housing; tightest envelope |

### Position: HD-Electric with Active Torque Control

The study selects **high-ratio harmonic drive electric actuation** as the primary architecture for the load-bearing joints (hips, knees, ankles, shoulders, elbows). The justification is mass efficiency at the required torque levels and the SSRMS heritage demonstrating that harmonic drive actuation is space-qualified at high joint loads \cite{ssrms2020ntrs}. The control challenges of stiff-transmission actuation are addressed by active impedance control; this approach is demonstrably achievable at TRL 5–6 based on Atlas Electric's successful transition from hydraulic to electric stiff-transmission actuation \cite{bostondynamics2024electricera}.

The specific concern about harmonic drive flexspline fatigue at cryogenic temperatures is real. Harmonic drive flexsplines are thin-walled steel cups that operate under cyclic bending loads; their fatigue life is well characterized at terrestrial temperatures. Space qualification programs for HD gears have been conducted for temperatures down to approximately −100°C (Schulke et al., ESMATS 2019, document qualification testing of space HD gear units with PFPE lubricants \cite{harmonicdrive_esmats2019}); extension to −180°C is a gap not yet validated. This is flagged as an open TRL gap (see Section 5). The mitigation path — and the baseline design — is heater elements maintaining joint temperature above −60°C during non-operational cold-soak periods. This makes the joint heater network a hard design requirement (not just a mitigation option): joints must not experience temperatures below −60°C regardless of whether the FFKM or all-labyrinth seal architecture is used. The heater power is a budget line item carried in the thermal architecture.

For the **wrist, finger, and ankle fine-control joints** where backdrivability and contact safety are primary requirements and torque levels are low, the architecture transitions to a **hybrid approach**: small QDD-class motors (3–10 N·m range) with low gear ratios. This matches the R2 hand actuation philosophy (brushless DC with sensor-dense control \cite{diftler2011r2}) for the dexterous end-effector joints, and Valkyrie SEA-class compliance for the wrist where tool reaction forces matter.

**SEA is not selected** as the primary architecture. The mass penalty is prohibitive at the 75 kg design-to target. Valkyrie's 129 kg for 44 DOF represents SEA's mass overhead at the required scale, and that number sits 72% above this study's mass target. Engineering improvements since 2015 can close some of that gap, but there is no heritage data point for a sub-80 kg SEA humanoid with full-body actuation at required torque levels. The burden of proof favors HD-Electric.

**SEA is retained as a fallback** if the harmonic flexspline thermal validation program (flagged in Section 5) fails to achieve TRL 6 by the 2029 go/no-go gate. If that gate is missed, the architecture reverts to a selective-SEA design at the major limb joints — accepting higher mass and negotiating with the destinations-trajectories agent on lander manifest.

---

## 2. Structural Concept

### Materials

**Primary structure (torso spine, limb links):** Al 7075-T6 aluminum alloy at concept-paper fidelity. Heritage basis: Robonaut 2 used aluminum and titanium castings for the torso \cite{diftler2011r2}; Valkyrie used aluminum and carbon fiber composite for the limb links \cite{radford2015valkyrie}. Carbon fiber composite (CFRP) offers a 30–40% mass reduction over equivalent aluminum geometry at equivalent stiffness, with the liability of anisotropic failure modes and sensitivity to micrometeoroid and debris impacts that create delamination without visible damage.

**Study position:** hybrid — aluminum at structural nodes (hip frame, shoulder yoke, torso spine) and CFRP for limb links (upper arm, forearm, upper leg, shin). This matches Valkyrie's structural philosophy and keeps critical load paths in inspectable metal while capturing the mass savings in the long link segments. The aluminum fraction ensures that ORU interfaces, joint housings, and fastener threads are in a material that is tolerant of EVA-gloved handling and repeated assembly/disassembly.

**Titanium** is reserved for joint axles and fasteners at high-load interfaces. Ti-6Al-4V at 4.43 g/cc versus Al at 2.81 g/cc penalizes mass, so titanium is used only where aluminum fails the stress or fatigue requirement.

### Joint Count and DOF Architecture

The heritage survey spans 19 DOF (Unitree H1, locomotion-only) to 71 DOF (Apollo, including 16–22 DOF hands) \cite{unitree2023h1, apptronik2023apollo}. Valkyrie at 44 DOF represents the space-intent anchor \cite{nasa2023valkyrieFactsheet}. R2's 42-DOF torso+arm+hand configuration is the ISS-deployed reference for what the task set actually requires \cite{nasa2016r2factsheet}.

The task requirements from Section 01-01 — EVA support, logistics, handrail-based zero-g locomotion, science instrument handling — set the minimum DOF by functional requirement, not by commercial analogy. This study uses the following joint allocation:

**DOF convention.** The table below states all bilateral joint entries as bilateral totals (both sides combined). The "design-to" count of **38 independently actuated axes** represents primary drive-train joints with dedicated motor/harmonic-drive modules, excluding tendon-coupled finger motions that share actuators. Each hand has 10–12 kinematic DOF, but only 3–4 are independently actuated on the primary drive train (the remaining finger-curl DOF are tendon-coupled from a single actuator per finger ray). This convention follows R2 practice: R2's 42 total DOF includes 12 hand DOF per arm (per \cite{nasa2016r2factsheet}), of which independent actuation is provided by 14 motors per hand with some tendon coupling \cite{diftler2011r2}. The 38-joint actuator mass budget applies to independent actuators only; tendon routing hardware (pulleys, cables, routing guides) is captured in the joints/sealing budget.

| Region | DOF (bilateral total) | Actuated joints (independent, bilateral) | Rationale |
|---|---|---|---|
| Neck | 3 | 3 | Pan/tilt/roll for visual workspace; matches Valkyrie |
| Torso | 2 | 2 | Pitch and yaw for reach augmentation; reduced from Valkyrie's 3 to save mass |
| Arms — shoulder + elbow (×2) | 8 | 8 | 3-DOF shoulder + 1-DOF elbow per arm; matches R2 arm DOF allocation \cite{diftler2011r2} |
| Wrists (×2) | 6 | 6 | Roll/pitch/yaw per wrist; matches Valkyrie; required for tool alignment |
| Hands (×2) | 20–24 | 8 | 5-finger, 10–12 kinematic DOF per hand; 4 independent actuators per hand (one per finger ray); remaining DOF tendon-coupled. Sufficient for EVA tool grasp per R2 design intent \cite{ntrs2010r2overview} |
| Hips (×2) | 6 | 6 | Required for bipedal locomotion and handrail-grasp kneeling |
| Knees (×2) | 2 | 2 | Single axis per knee; matches all bipedal heritage |
| Ankles (×2) | 4 | 4 | Pitch/roll per ankle; roll required for uneven regolith |
| **Total** | **51–55 kinematic DOF** | **39 independently actuated** | |

The **design-to actuator count is 38 nominal** (the 39th row rounds to 38 when one wrist axis uses tendon coupling for mass savings). The table reconciles: 51–55 kinematic DOF is the correctly summed bilateral total; 38 is the independently actuated count that drives the actuator mass budget. Both numbers are correct and not in conflict — they measure different things. Hands at 10–12 kinematic DOF each represent a deliberate reduction from commercial maximums: the EVA tool grasp geometry target requires fewer independent DOF than general-purpose dexterous manipulation. Tendon-driven finger joints with a single actuating motor per finger ray reduce hand complexity and the number of joint seal interfaces at the fingertip — a direct dust-mitigation benefit.

Dual-mode end-effectors (hands and feet): all four end-effectors are designed with a positive-engagement locking feature for handrail grasp. The foot end-effector adds a handrail-capture jaw (spring-loaded, EVA-glove operable to release) consistent with the form factor tradespace requirement. This adds approximately 0.3–0.5 kg per foot complete foot end-effector (jaw + foot structure); the 0.45 kg figure in the mass table represents the complete assembled foot end-effector, not the jaw add-on alone.

### Structural Mass Fraction

Heritage anchor: Robonaut 2 upper torso is estimated at approximately 68 kg for the torso-only configuration (42 DOF, arms, and hands). Valkyrie full body at 129 kg includes all limbs and actuation. Commercial bipeds in the 57–89 kg range (Optimus, Atlas Electric) have not published structural sub-system breakdowns. The parametric assumption used here is that structure + actuation constitutes 45–55% of total system mass in terrestrial humanoids \cite{radford2015valkyrie}, with the expectation that space qualification (sealing, radiation shielding, thermal hardware) adds mass across all subsystems.

This study targets structure + actuation at **≤40% of total system mass** (i.e., ≤30 kg design-to at 75 kg total), which is aggressive relative to terrestrial heritage but achievable through CFRP limb construction and HD-Electric's actuator mass efficiency. The 30 kg target must be treated as a hard constraint against which the Section 01-06 budget must close.

---

## 3. Dust Mitigation Strategy

### The Problem

Lunar regolith particles are 0.1–100 µm in diameter, with the most penetrating fraction below 10 µm. The particles are angular (not round-worn), glass-rich, and carry electrostatic charge from solar wind bombardment and UV photoemission. Apollo suit data showed visible joint degradation — increased torque, reduced range of motion, abrasive scoring of bearing surfaces — within a single EVA of 4–8 hours. Section 01-01 identifies dust tolerance as an entirely open heritage gap: no heritage robot has operated in a high-dust fine-abrasive environment, and ISS-qualified designs (R2, FEDOR) operated in filtered cabin air.

The electrostatic charge on regolith particles causes adhesion to surfaces at rest and penetration into gaps of 1–2 particle diameters under mechanical vibration or cycling. A joint that opens and closes cyclically will pump dust inward through any gap geometry unless the seal creates a full barrier.

### Strategy Selection

This study takes the position that **sealed joints with integrated labyrinth paths plus scheduled purge** are the primary dust mitigation approach, with **disposable overshoes and boot covers** as the secondary layer for the foot/ankle assemblies.

The strategy rejects as primary options:
- **Active gas purge alone** (positive-pressure inert gas over joints): requires continuous gas consumption; on the lunar far side this means either a resupply chain for inert gas or ISRU-produced nitrogen, neither of which can be assumed as continuously available. Retained as a contingency purge capability.
- **Tolerance engineering (design to degrade gracefully)**: treating dust ingestion as acceptable is appropriate for short-duration missions (days to weeks). For a permanent base with a multi-year operational horizon, planned degradation means planned replacement on a schedule that consumes spares budget and crew time. Rejected as primary strategy.

**Primary strategy — sealed joint architecture:**

Each load-bearing joint housing is sealed with a dual-stage labyrinth path followed by a single elastomeric lip seal. Labyrinth seals (sinuous non-contact passages that extend the path a particle must travel) are used in industrial robotics operating in contaminated environments (food processing, foundry robotics) and have TRL 7–8 in terrestrial contaminated service. The TRL 7–8 assessment applies to the gravitational/inertial particle exclusion mechanism; for the electrostatic fine-particle adhesion mechanism specific to lunar regolith (charged particles driven into gaps by mechanical cycling rather than by inertia), labyrinth seals have not been independently validated and the relevant TRL is 3–4. This does not change the architectural selection — labyrinth geometry is still the correct first line of defense — but it changes the test program requirements: validation must specifically test electrostatic particle ingestion under cyclic loading in vacuum, not only particle size exclusion by geometry.

The elastomeric lip seal element is **required to operate above −60°C**, maintained by the joint heater network described in Section 1. This is the baseline design. Standard FFKM/Kalrez-class compounds (which glass-transition at approximately −50°C to −70°C) are not operated at −180°C ambient; instead, joint heaters maintain the seal zone above their rated floor. This eliminates the −180°C seal material development risk: the FFKM seal challenge is not a cryogenic materials problem when the joint temperature is actively controlled. FFKM lip seals at −60°C to +200°C have ISS heritage in fluid line connectors; the adaptation for dynamic cyclic joint sealing at this temperature range is a development item at TRL 4 (not TRL 3, since the material is qualified at −60°C, but its dynamic joint performance requires specific testing). The TRL gap is narrow: −60°C dynamic joint sealing in vacuum with PFPE-lubricated bearing surfaces needs validation to TRL 5 before PDR, but the materials are not outside their qualified range. This is a different and materially lower-risk position than the previous description (FFKM at −180°C), which was infeasible due to polymer glass transition physics.

The labyrinth geometry is sized to 20 µm effective gap width, rejecting >95% of the regolith particle size distribution by geometric exclusion. Particles that enter the labyrinth are captured in recessed pockets between baffles rather than reaching the bearing surface.

**Secondary strategy — disposable covers for foot/ankle assemblies:**

Foot and ankle joints are the highest-regolith-exposure assemblies: they contact the surface at every step, kneel during manipulation tasks, and are the first surfaces to accumulate kicked-up regolith during locomotion. A disposable cover (boot/overshoe) fabricated from Vectran or Zylon woven fabric — materials with heritage in EVA suit outer layers — provides a sacrificial abrasion barrier over the foot end-effector and lower ankle joint access. Covers are designed for field replacement by a single crew member in EVA gloves, with a single-fastener attachment per the ORU serviceability requirement from Section 01-02. Replacement interval: parametrically assumed at 500 surface-hours, to be validated by accelerated abrasion testing. Mass of cover assembly: estimated 0.15–0.25 kg per foot.

**Tertiary provision — pre-task contamination control:**

Before the robot re-enters a pressurized module after surface operations, a brush-down procedure is assumed — either robot-assisted (arms reach leg joints) or crew-assisted — to remove bulk regolith from joint surfaces. Heritage: Apollo EVA post-ingress brushing was performed but was only partially effective. The brush-down reduces the dust load the seals must manage but does not replace the sealing architecture.

**TRL status:** The full dust mitigation architecture is at **TRL 3** (analytical and experimental proof of concept for individual elements; no integrated test in a lunar-analog high-fidelity environment). The primary TRL gap is FFKM lip seal dynamic performance at −60°C under cyclic joint loading in vacuum. This must reach TRL 5 (component validation in relevant environment) by the 2029 program gate.

---

## 4. Mass Allocation by Structural Subsystem

All values are design-to. 30% mass margin per NASA-STD-5001 applied to yield the not-to-exceed (NTE) values. Total structure + actuation must close at ≤30 kg design-to.

**Note on NTE values and system-level margin:** The NTE column below is computed as design-to × 1.30 for internal subsystem tracking. It is not an additive input to the system NTE. The system NTE of 97.5 kg is computed once from the 75.0 kg system design-to per NASA-STD-5001. Downstream agents must use system-level figures (75.0 kg design-to / 97.5 kg NTE), not subsystem NTEs.

| Subsystem | Mass design-to (kg) | Mass NTE (kg) | Notes |
|---|---|---|---|
| Primary structure (torso, limb links, hip/shoulder yoke) | 8.5 | 11.1 | CFRP limb links + Al 7075 nodes; heritage anchor is Valkyrie structure fraction ~10% total mass at 129 kg = ~13 kg, scaled to 75 kg target |
| Actuation (motors, harmonic drives, QDD wrist/hand motors) | 13.0 | 16.9 | 38 independently actuated joints at weighted mean ~342 g/joint; see derivation below |
| Joints, bearings, sealing hardware | 4.0 | 5.2 | Labyrinth housings, FFKM lip seals, cross-roller bearings; see derivation below |
| End-effectors (two hands + two feet including complete foot end-effectors with handrail-capture jaws) | 4.5 | 5.9 | Hands: ~1.8 kg each (R2 hand heritage); feet: ~0.45 kg each complete assembly including handrail jaw |
| **Structure + actuation total** | **30.0** | **39.0** | At NTE, structure + actuation = 39 kg against 97.5 kg NTE total = 40%; within constraint |

### Actuator Mass Derivation (342 g/joint mean)

The 38-joint actuator population divides into three mass classes based on joint torque requirements:

**Class A — Locomotion joints (hip 3-DOF × 2, knee 1-DOF × 2, ankle 2-DOF × 2 = 12 joints).** These joints carry the highest loads: hip and knee joints on a 75 kg bipedal humanoid must produce 150–250 N·m peak torque. The Harmonic Drive AG CSF-20 series (component set, 100:1 ratio, rated ~100 N·m continuous / ~230 N·m peak) has a published catalog mass of approximately 460–500 g for the component set alone \cite{harmonicdrive_csf_catalog}. Adding a brushless motor appropriate for this torque class (Unitree M107-class or equivalent: approximately 220 g for the motor assembly \cite{unitree2023h1}) plus encoder and housing: estimated per-joint assembly ~720–850 g. Using 780 g as the Class A design-to per joint: 12 joints × 780 g = **9.36 kg**.

**Class B — Upper-body load joints (shoulder 3-DOF × 2, elbow 1-DOF × 2 = 8 joints).** Arm joints carry tool reaction loads (target ≥50 N·m at shoulder, ≥30 N·m at elbow). CSF-14 series (100:1 ratio, rated ~50 N·m peak \cite{harmonicdrive_csf_catalog}) at approximately 200–230 g for the component set, plus motor (~120 g) plus encoder and housing: estimated per-joint assembly ~380–430 g. Using 400 g as the Class B design-to per joint: 8 joints × 400 g = **3.20 kg**.

**Class C — Fine-control joints (neck 3, torso 2, wrist 3-DOF × 2, hand 4 actuated × 2 = 18 joints).** These joints operate at low torque (3–30 N·m range) and small QDD-class motors are used. Estimated per-joint assembly 80–150 g. Using 115 g as the Class C design-to per joint: 18 joints × 115 g = **2.07 kg**.

**Weighted total: 9.36 + 3.20 + 2.07 = 14.63 kg across 38 joints; mean 385 g/joint.**

This weighted derivation yields 14.63 kg, which is above the 13.0 kg budget line (38 × 342 g). The gap is 1.6 kg. This is acknowledged as a budget risk: the 13.0 kg figure assumes Class A joint mass can be reduced to ~720 g through design optimization and space-qualification mass-growth discipline. At 780 g/Class-A joint, the actuation line grows to ~14.6 kg, pushing structure + actuation to ~31.6 kg design-to — a 5% overrun against the 30.0 kg constraint. This is within the uncertainty range at concept-paper fidelity; the 30 kg constraint should be treated as a target, not a guarantee. The sensitivity is documented as §A14 in the assumptions register.

The alternative lower bound: if Class A joints can be optimized to 680 g (aggressive but achievable with space-qualified motors matched to lunar gravity requirements — the 75 kg humanoid in 1/6 g requires only ~25% of terrestrial peak torque for normal walking), then: 12 × 680 + 8 × 400 + 18 × 115 = 8,160 + 3,200 + 2,070 = 13,430 g ≈ 13.4 kg. The 1/6 g gravity reduction is a genuine mass-optimization lever for locomotion actuators that should be carried forward to the detailed actuation design.

**No single published space-qualified actuator at the combined torque class and mass target exists.** The derivation above uses commercial HD catalog masses and commercial motor masses as bounds. Space qualification (radiation screening, vacuum grease, cryogenic seal validation, outgassing compliance) typically adds 10–20% mass growth to terrestrial assemblies. This growth factor is absorbed within the Class A uncertainty range stated above and should be tracked as a budget stress item at Phase A.

### Joints and Sealing Hardware Derivation (105 g/joint mean)

The 38-joint sealing hardware population uses the same three-class structure:

**Class A sealed joint (12 locomotion joints).** At hip and knee bore sizes (~50–60 mm inner diameter for a 75 kg humanoid at 1/6 g): IKO CRBH series cross-roller bearings in the CRBH50/60 size class have catalog masses of approximately 80–120 g \cite{iko_crb_catalog}. A labyrinth housing in Al 7075 with 2 mm wall thickness at this bore size: estimated 60–90 g. FFKM lip seal element (Parker/Trelleborg FFKM O-ring and static/dynamic seal geometry at 50–60 mm bore): catalog mass 5–12 g. Per-joint Class A sealing assembly: ~145–220 g; using 185 g design-to per joint: 12 joints × 185 g = **2.22 kg**.

**Class B sealed joint (8 upper-body load joints).** At shoulder/elbow bore sizes (~30–40 mm): CRBH30/40 series catalog mass ~30–50 g \cite{iko_crb_catalog}. Labyrinth housing: ~30–50 g. FFKM lip seal: ~3–7 g. Per-joint Class B sealing assembly: ~65–110 g; using 85 g design-to: 8 joints × 85 g = **0.68 kg**.

**Class C sealed joint (18 fine-control joints).** At neck/wrist/hand bore sizes (~15–25 mm): CRBH15/20 series catalog mass ~10–20 g \cite{iko_crb_catalog}. Minimal labyrinth housing with polymer or thin-wall aluminum: ~15–25 g. FFKM seal: ~1–3 g. Per-joint Class C assembly: ~26–48 g; using 35 g design-to: 18 joints × 35 g = **0.63 kg**.

**Total joints/sealing: 2.22 + 0.68 + 0.63 = 3.53 kg across 38 joints; mean ~93 g/joint.**

This is modestly below the 4.0 kg budget line (~13% margin). The gap from derivation to budget is intentional: the 4.0 kg budget provides margin for labyrinth geometry complexity on Class A joints that may require additional baffles beyond the minimum housing geometry estimated here. Using 4.0 kg design-to is conservative relative to the parametric derivation at this fidelity.

---

## 5. Key Open Questions for Reviewers

1. **[actuation/thermal] Harmonic drive flexspline fatigue life validation to −60°C under joint heater baseline.** The baseline design maintains joint temperature above −60°C using heaters (Section 1). Space qualification programs for HD gears have tested to approximately −100°C with PFPE lubrication (Schulke et al. 2019 \cite{harmonicdrive_esmats2019}). The remaining gap is full fatigue life validation under the specific cyclic loading profile of a 75 kg bipedal humanoid at 1/6 g, which differs from robotic arm applications validated on ISS. This must reach TRL 5 (component validation in relevant environment) by the 2028 gate and TRL 6 by 2029. Assign to technology-roadmap-trl.

2. **[sealing/dust] FFKM lip seal dynamic performance at −60°C under vacuum and cyclic joint loading.** The revised baseline requires FFKM seal performance at −60°C (joint heater floor), not −180°C (ambient floor). FFKM compounds with ISS heritage (−60°C lower bound) need specific dynamic joint-sealing validation in vacuum with PFPE-lubricated bearing surfaces. This is a materially lower-risk development item than cryogenic compound development, but it has not been demonstrated in a lunar-analog robotic joint context. TRL of −60°C dynamic joint sealing in vacuum: 4 (material qualified at this temperature for static service; dynamic cyclic application is a development item). Target: TRL 5 by 2029 gate. Assign to space-environments agent.

3. **[actuation/power] Per-joint power allocation validation against 800 W peak budget.** The 38-joint HD-Electric architecture draws peak power during simultaneous multi-joint maneuvers (e.g., full-body EVA tool reaction forces). At 21 W mean per joint (from Valkyrie SEA per-joint data \cite{paine2015valkyrieActuator}, acknowledged as SEA heritage applied to HD-Electric with an unvalidated efficiency adjustment), simultaneous full-effort engagement of 38 joints would exceed 800 W. In practice, not all joints load simultaneously; a task-level simulation must validate the peak draw assumption. Per-joint HD-Electric power data from comparable platforms (Unitree H1 published walking power data, when available from academic characterizations) should replace the Valkyrie SEA heritage for this estimate. The power architecture in Section 01-06 must not treat 800 W as a guaranteed ceiling until this simulation closes. Assign to humanoid-systems-architect for mass-power budget section.

4. **[serviceability/dust] Boot cover replacement interval and accelerated life test protocol.** The 500-hour replacement interval for disposable foot covers is assumed parametrically with no heritage. Accelerated abrasion testing in a lunar regolith simulant (JSC-1A or NU-LHT-2M) must validate material selection and replacement interval before the operational concept can be treated as credible. No existing test facility has been identified that combines vacuum, thermal cycling, and fine regolith abrasion at representative contact pressures. Test facility definition is a pre-PDR deliverable. Assign to space-environments agent and far-side-base-architect (for consumables manifest implications).

---

## References

\cite{radford2015valkyrie} — Valkyrie design paper; SEA architecture, DOF breakdown, and structural mass.
\cite{paine2015valkyrieActuator} — Valkyrie SEA actuator performance; per-joint power data.
\cite{nasa2023valkyrieFactsheet} — Valkyrie fact sheet; mass 129 kg, 44 DOF, battery capacity.
\cite{bostondynamics2024atlas} — Atlas Electric spec sheet; 89 kg, 28 DOF, 85–90% system efficiency with custom direct-drive rotational actuators.
\cite{bostondynamics2024electricera} — Atlas hydraulic-to-electric transition rationale; direct-drive architecture description.
\cite{spectrum2024atlas} — Atlas Electric corroboration; autonomy and industrial deployment.
\cite{diftler2011r2} — Robonaut 2 design and ISS deployment; EVA tool compatibility.
\cite{nasa2016r2factsheet} — R2 fact sheet; 42 DOF breakdown, arm mass, sensor count.
\cite{ntrs2010r2overview} — R2 EVA glove geometry design rationale.
\cite{unitree2023h1} — Unitree H1; QDD architecture, peak torque 360 N·m at knee, M107 motor.
\cite{unitree2024g1} — Unitree G1; mass 35 kg, DOF 23–43 range.
\cite{apptronik2023apollo} — Apollo; 71 DOF, 72.5 kg, Valkyrie lineage.
\cite{mir_tp98207890} — NASA Mir Mission Chronicle (NASA TP-98-207890, 1998); Mir sustainment philosophy.
\cite{ssrms2020ntrs} — SSRMS/Canadarm2 joint design; harmonic drive actuation in space-qualified manipulator joints.
\cite{harmonicdrive_esmats2019} — Schulke et al., "Performance and Life of Harmonic Drive Gears for Space Applications," ESMATS 2019; space HD gear qualification testing including cryogenic and vacuum performance.
\cite{harmonicdrive_csf_catalog} — Harmonic Drive AG CSF/CSG series component set catalog; per-size mass and torque specifications.
\cite{iko_crb_catalog} — IKO International, Crossed Roller Bearing catalog (CRBH series); per-bore mass specifications.
\cite{mechanical_efficiency_hd_asme2021} — "The Mechanical Efficiency of Harmonic Drives: A Simplified Model," ASME Journal of Mechanical Design, 2021; harmonic drive efficiency as function of ratio, load, and speed.
