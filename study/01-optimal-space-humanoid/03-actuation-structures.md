---
title: "Optimal Space Humanoid: Actuation and Structures"
status: draft
owner: robotics-actuation-structures
last-updated: 2026-05-03
---

# Section 01-03 — Optimal Space Humanoid: Actuation and Structures

This section takes positions on actuation type, structural materials, joint architecture, and dust mitigation strategy for the bipedal space humanoid. It designs to the constraints passed by the form factor tradespace in Section 01-02: 75 kg design-to mass (97.5 kg not-to-exceed), 800 W peak power, all four end-effectors capable of dual grasp modes, and all joints accessible to EVA-gloved hands. Sizing is parametric against heritage data. No detailed mechanical engineering is performed.

---

## 1. Actuation Type Trade

### Four Candidates

**Series Elastic Actuation (SEA).** NASA Valkyrie/R5 is the primary heritage \cite{radford2015valkyrie, paine2015valkyrieActuator}. A compliant spring element is placed in series between the motor/gearbox and the joint output, providing force control, shock absorption, and safe human-robot contact. Valkyrie uses SEA throughout its 44-DOF architecture; the design papers document torque bandwidths of approximately 50 Hz and per-joint power draws in the 20–100 W range depending on joint size \cite{paine2015valkyrieActuator}. SEA's primary liabilities are mass and complexity: the spring element, its sensors, and the additional housing add roughly 30–40% mass per joint relative to a rigid transmission equivalent. Valkyrie at 129 kg for 44 DOF is the direct evidence of this penalty. Spring elements are also potential dust trap surfaces, and the compliance that makes SEA attractive for human-contact safety creates control challenges under the rapid load transients expected on lunar regolith.

**Quasi-Direct Drive (QDD).** Unitree H1/G1 heritage \cite{unitree2023h1, unitree2024g1}. High-torque-density motors (peak ~189 N·m/kg for Unitree M107) with low-ratio transmissions (often 1:6 to 1:10) achieve backdrivability without compliance elements. QDD joints are mechanically simple — fewer parts, less mass per joint, fewer seal interfaces. Liabilities: high motor mass (large-diameter motors sit at the joint), lower force bandwidth than SEA at equivalent torque, and poor efficiency at high reduction ratios when fine position control is required. For a 75 kg platform with tight mass margins, placing large brushless motors at each of the primary load-bearing joints (hips, knees, ankles, shoulders) creates a mass distribution problem: joint mass dominates structural mass in QDD designs.

**High-Ratio Harmonic Drive Electric (HD-Electric).** Boston Dynamics Atlas Electric is the primary heritage \cite{bostondynamics2024atlas, bostondynamics2024electricera}. Atlas transitioned from hydraulic to electric actuation specifically to exploit planetary roller-screw linear actuators paired with high-density NdFeB (neodymium) motors. Harmonic drive transmissions achieve ratios of 50:1 to 160:1 in a compact, zero-backlash package. Electrical-to-mechanical efficiency of 85–90% is documented for Atlas \cite{bostondynamics2024atlas}. Mass efficiency is the highest of the three electric options: a compact motor plus harmonic drive can deliver joint torques that would require a much larger QDD motor, keeping joint-resident mass low and allowing structural mass to dominate. The liability is backdrivability: harmonic drives are mechanically stiff and do not back-drive under external loads, requiring active torque sensing and impedance control to achieve safe contact behavior.

**Hydraulic Actuation.** Boston Dynamics Atlas Generation 1 and 2 (pre-2024) used hydraulic actuators: a central hydraulic pump, distributed servo valves, and actuating cylinders at each joint. Hydraulic actuation offers high power density, inherent compliance under overload, and force-output bandwidth that electric actuators at equivalent force levels struggle to match. Boston Dynamics explicitly abandoned this architecture in the 2024 Atlas Electric transition, citing operational complexity (hydraulic fluid management, leak risk, pump noise, startup time) and the difficulty of achieving fine motor control with proportional valves \cite{bostondynamics2024electricera, spectrum2024atlas}. In the space environment, hydraulic actuation adds two disqualifying problems on top of the terrestrial liabilities: (1) hydraulic fluid presents an outgassing and contamination risk in vacuum — fluid selection for wide-temperature-range vacuum use is an unsolved problem at TRL 3 or below; and (2) hydraulic lines are a single-fault total-loss failure mode that is difficult for a crew member in EVA gloves to diagnose and repair. The Mir sustainment philosophy — "no instrument inside the station that cannot be replaced in flight" \cite{mir_wikipedia} — argues directly against fluid-line architectures at a far side base. Hydraulic actuation is eliminated from further consideration.

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

The study selects **high-ratio harmonic drive electric actuation** as the primary architecture for the load-bearing joints (hips, knees, ankles, shoulders, elbows). The justification is mass efficiency at the required torque levels and the Atlas Electric heritage demonstrating that the control challenges of stiff-transmission actuation are solvable with active impedance control at TRL 5–6 \cite{bostondynamics2024electricera}.

The specific concern about harmonic drive flexspline fatigue at cryogenic temperatures is real. Harmonic drive flexsplines are thin-walled steel cups that operate under cyclic bending loads; their fatigue life is well characterized at terrestrial temperatures but not at −180°C. This is flagged as an open TRL gap (see Section 5). The mitigation path is heater elements maintaining joint temperature above −80°C during non-operational cold-soak periods — a power budget line item that must be carried in the thermal architecture.

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

| Region | DOF | Rationale |
|---|---|---|
| Neck | 3 | Pan/tilt/roll for visual workspace; matches Valkyrie |
| Torso | 2 | Pitch and yaw for reach augmentation; reduced from Valkyrie's 3 to save mass |
| Each arm (shoulder + elbow) | 4 | 3-DOF shoulder + 1-DOF elbow; matches R2 arm DOF allocation \cite{diftler2011r2} |
| Each wrist | 3 | Roll/pitch/yaw; matches Valkyrie; required for tool alignment |
| Each hand | 10–12 | 5-finger with reduced DOF vs. commercial (Figure 02: 16 DOF/hand); sufficient for EVA tool grasp |
| Each hip | 3 | Required for bipedal locomotion and handrail-grasp kneeling |
| Each knee | 1 | Single axis; matches all bipedal heritage |
| Each ankle | 2 | Pitch/roll; roll required for uneven regolith |
| **Total** | **~36–40** | |

The design-to DOF count is **38 nominal**, bracketed between R2/Valkyrie (42–44) and the commercial bipeds with manipulation capability (35 for Figure 02, 30 for Digit). Hands at 10–12 DOF each represent a deliberate reduction from commercial maximums: the EVA tool grasp geometry target (established by R2's design intent \cite{ntrs2010r2overview}) requires fewer independent DOF than general-purpose dexterous manipulation. Tendon-driven finger joints with a single actuating motor per finger reduce hand complexity and the number of joint seal interfaces at the fingertip — a direct dust-mitigation benefit.

Dual-mode end-effectors (hands and feet): all four end-effectors are designed with a positive-engagement locking feature for handrail grasp. The foot end-effector adds a handrail-capture jaw (spring-loaded, EVA-glove operable to release) consistent with the form factor tradespace requirement. This adds approximately 0.3–0.5 kg per foot.

### Structural Mass Fraction

Heritage anchor: Robonaut 2 upper torso is estimated at approximately 68 kg for the torso-only configuration (42 DOF, arms, and hands). Valkyrie full body at 129 kg includes all limbs and actuation. Commercial bipeds in the 57–89 kg range (Optimus, Atlas Electric) have not published structural sub-system breakdowns. The parametric assumption used here is that structure + actuation constitutes 45–55% of total system mass in terrestrial humanoids, with the expectation that space qualification (sealing, radiation shielding, thermal hardware) adds mass across all subsystems.

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

Each load-bearing joint housing is sealed with a dual-stage labyrinth path followed by a single elastomeric lip seal. Labyrinth seals (sinuous non-contact passages that extend the path a particle must travel) are used in industrial robotics operating in contaminated environments (food processing, foundry robotics) and have TRL 7–8 in terrestrial contaminated service. The adaptation challenge for the lunar environment is the elastomeric lip seal material: standard nitrile or silicone elastomers are not rated for the −180°C to +130°C thermal excursion without specialty compounding. Perfluoroelastomers (FFKM/Kalrez-class) are space-qualified in the −60°C to +200°C range and have ISS heritage in fluid line connectors; adaptation to −180°C is a development item at TRL 4. This is an identified risk that must close before PDR.

The labyrinth geometry is sized to 20 µm effective gap width, rejecting >95% of the regolith particle size distribution by geometric exclusion. Particles that enter the labyrinth are captured in recessed pockets between baffles rather than reaching the bearing surface.

**Secondary strategy — disposable covers for foot/ankle assemblies:**

Foot and ankle joints are the highest-regolith-exposure assemblies: they contact the surface at every step, kneel during manipulation tasks, and are the first surfaces to accumulate kicked-up regolith during locomotion. A disposable cover (boot/overshoe) fabricated from Vectran or Zylon woven fabric — materials with heritage in EVA suit outer layers — provides a sacrificial abrasion barrier over the foot end-effector and lower ankle joint access. Covers are designed for field replacement by a single crew member in EVA gloves, with a single-fastener attachment per the ORU serviceability requirement from Section 01-02. Replacement interval: parametrically assumed at 500 surface-hours, to be validated by accelerated abrasion testing. Mass of cover assembly: estimated 0.15–0.25 kg per foot.

**Tertiary provision — pre-task contamination control:**

Before the robot re-enters a pressurized module after surface operations, a brush-down procedure is assumed — either robot-assisted (arms reach leg joints) or crew-assisted — to remove bulk regolith from joint surfaces. Heritage: Apollo EVA post-ingress brushing was performed but was only partially effective. The brush-down reduces the dust load the seals must manage but does not replace the sealing architecture.

**TRL status:** The full dust mitigation architecture is at **TRL 3** (analytical and experimental proof of concept for individual elements; no integrated test in a lunar-analog high-fidelity environment). The primary TRL gap is the perfluoroelastomer lip seal performance at −180°C under cyclic loading in vacuum. This must reach TRL 5 (component validation in relevant environment) by the 2029 program gate.

---

## 4. Mass Allocation by Structural Subsystem

All values are design-to. 30% mass margin per NASA-STD-5001 applied to yield the not-to-exceed (NTE) values. Total structure + actuation must close at ≤30 kg design-to.

| Subsystem | Mass design-to (kg) | Mass NTE (kg) | Notes |
|---|---|---|---|
| Primary structure (torso, limb links, hip/shoulder yoke) | 8.5 | 11.1 | CFRP limb links + Al 7075 nodes; heritage anchor is Valkyrie structure fraction ~10% total mass at 129 kg = ~13 kg, scaled to 75 kg target |
| Actuation (motors, harmonic drives, QDD wrist/hand motors) | 13.0 | 16.9 | Dominant mass item; ~38 joints at mean ~340 g actuator mass; HD-Electric actuator mass density from Atlas Electric heritage scales favorably vs. SEA |
| Joints, bearings, sealing hardware | 4.0 | 5.2 | Labyrinth housings, elastomeric seals, cross-roller bearings; 38 joints × ~105 g mean |
| End-effectors (two hands + two feet including handrail-capture jaws) | 4.5 | 5.9 | Hands: ~1.8 kg each (R2 hand mass heritage, reduced for HD/QDD hybrid vs. tendon); feet: ~0.45 kg each including handrail jaw |
| **Structure + actuation total** | **30.0** | **39.0** | At NTE, structure + actuation = 39 kg against 97.5 kg NTE total = 40%; within constraint |

**Notes on closure:** The 30.0 kg design-to target is tight. It assumes HD-Electric actuators with a mean mass of ~340 g per actuator across 38 joints — this is consistent with commercially available space-qualified brushless motor + harmonic drive assemblies in the 100–300 N·m class (e.g., Harmonic Drive AG CSD/CSF series, which are used in industrial and space applications including the SSRMS joint drives on ISS). The structural mass fraction of 8.5 kg for a full bipedal body structure requires CFRP limb construction; aluminum-only would add approximately 2.5–3.5 kg and break the budget. The margin at system level (30 kg design-to, 39 kg NTE) means there is 9 kg of margin in the structure+actuation subsystem before the total system NTE of 97.5 kg is at risk — but only if the remaining 67.5 kg of the system (sensors, compute, power, thermal, consumables, fluid lines) closes within its allocation.

---

## 5. Key Open Questions for Reviewers

1. **[actuation/thermal] Harmonic drive flexspline fatigue life at cryogenic temperatures.** No published heritage data characterizes harmonic drive CSD/CSF flexspline fatigue at −180°C under representative cyclic joint loads. This is the primary TRL gap in the selected actuation architecture. If the thermal validation program (modeled as reaching TRL 5 by 2028) shows unacceptable life reduction, the architecture must revert to selective SEA at major limb joints with a mass budget renegotiation. Assign to technology-roadmap-trl. Must close before 2029 program gate.

2. **[sealing/dust] Perfluoroelastomer lip seal performance at −180°C under vacuum and cyclic load.** Standard FFKM/Kalrez-class compounds are qualified to −60°C. Extension to lunar surface cold extremes requires compounding development. If this fails, the fallback is all-labyrinth sealing (no elastomeric element), which reduces dust rejection effectiveness. TRL of the compound adaptation: 3. Target: TRL 5 by 2029 gate. Assign to space-environments agent.

3. **[actuation/power] Per-joint power allocation validation against 800 W peak budget.** The 38-joint HD-Electric architecture draws peak power during simultaneous multi-joint maneuvers (e.g., full-body EVA tool reaction forces). At 21 W mean per joint (from Valkyrie SEA per-joint data \cite{paine2015valkyrieActuator}, adjusted for improved efficiency), simultaneous full-effort engagement of 38 joints would exceed 800 W. In practice, not all joints load simultaneously; a task-level simulation must validate the peak draw assumption. The power architecture in Section 01-06 must not treat 800 W as a guaranteed ceiling until this simulation closes. Assign to humanoid-systems-architect for mass-power budget section.

4. **[serviceability/dust] Boot cover replacement interval and accelerated life test protocol.** The 500-hour replacement interval for disposable foot covers is assumed parametrically with no heritage. Accelerated abrasion testing in a lunar regolith simulant (JSC-1A or NU-LHT-2M) must validate material selection and replacement interval before the operational concept can be treated as credible. No existing test facility has been identified that combines vacuum, thermal cycling, and fine regolith abrasion at representative contact pressures. Test facility definition is a pre-PDR deliverable. Assign to space-environments agent and far-side-base-architect (for consumables manifest implications).

---

## References

\cite{radford2015valkyrie} — Valkyrie design paper; SEA architecture, DOF breakdown, and structural mass.
\cite{paine2015valkyrieActuator} — Valkyrie SEA actuator performance; per-joint power data.
\cite{nasa2023valkyrieFactsheet} — Valkyrie fact sheet; mass 129 kg, 44 DOF, battery capacity.
\cite{bostondynamics2024atlas} — Atlas Electric spec sheet; 89 kg, 56 DOF, 85–90% efficiency.
\cite{bostondynamics2024electricera} — Atlas hydraulic-to-electric transition rationale.
\cite{spectrum2024atlas} — Atlas Electric corroboration; autonomy and industrial deployment.
\cite{diftler2011r2} — Robonaut 2 design and ISS deployment; EVA tool compatibility.
\cite{nasa2016r2factsheet} — R2 fact sheet; 42 DOF breakdown, arm mass, sensor count.
\cite{ntrs2010r2overview} — R2 EVA glove geometry design rationale.
\cite{unitree2023h1} — Unitree H1; QDD architecture, peak torque density 189 N·m/kg.
\cite{unitree2024g1} — Unitree G1; mass 35 kg, DOF 23–43 range.
\cite{apptronik2023apollo} — Apollo; 71 DOF, 72.5 kg, Valkyrie lineage.
\cite{mir_wikipedia} — Mir sustainment philosophy; "no instrument that cannot be replaced in flight."
