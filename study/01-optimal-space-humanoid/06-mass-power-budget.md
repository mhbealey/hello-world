---
title: "Optimal Space Humanoid: Mass and Power Budget"
status: draft
review-status: findings-addressed
owner: humanoid-systems-architect
last-updated: 2026-05-03
---

# Section 01-06 — Optimal Space Humanoid: Mass and Power Budget

This section is the integration and closure deliverable for Question (a). It rolls up the parametric inputs from Sections 01-02 through 01-05 into a single consistent mass budget and power budget. No new design decisions are made here. Where a number deviates from a subsection's direct output, the derivation is shown and the deviation is flagged. The study position — 75 kg design-to, 97.5 kg not-to-exceed, 500 W steady-state, 800 W peak — was established in Section 01-02 and locked in §A2 and §A3 of the margins register. This section determines whether it closes.

---

## 1. Mass Budget

### Battery Sizing Derivation

The battery sizing is derived here before the budget table because it is the single largest mass item not directly inherited from a prior subsection.

**Mission requirement:** a 4-hour EVA sortie at 500 W steady-state draw = 2,000 Wh = 2.0 kWh design capacity. This is the minimum energy for a single full sortie without recharge; the operational model assumes the robot returns to base for recharge between sorties.

**Heritage comparators:**
- Figure 02 (commercial): ~2.25 kWh battery (manufacturer-claimed; flagged unverified in §01-01) at 70 kg system mass.
- Optimus Gen 2 (commercial): ~2.3 kWh (derived from 8 hr runtime at estimated 300 W average draw; not directly published).
- Lunokhod 1 (USSR, 1970): ~1 kWh total electrical energy storage per daylight cycle. Lunokhod operated a 140 W solar array with a small buffer battery; it did not operate through lunar night on battery alone — the RHU (radioisotope heating unit) provided thermal survival only \cite{huntress2011soviet}. The Lunokhod figure is not comparable: it was a solar-primary system with no multi-hour battery-only sortie requirement.

**Energy density baseline:** Space-qualified lithium-ion cells achieve 150–180 Wh/kg at cell level, with demonstrated heritage on ISS hardware and small spacecraft (e.g., ISS battery replacement project using lithium-ion at ~160 Wh/kg, 2017–2019). Commercial cells achieve 250–300 Wh/kg at cell level; the 40–50% penalty for space qualification reflects radiation testing, lot screening, vibration qualification, and conservative temperature derating. This study uses **160 Wh/kg as the design-to energy density**, with 150 Wh/kg as the conservative floor for the not-to-exceed calculation.

**Battery cell mass:** 2,000 Wh ÷ 160 Wh/kg = **12.5 kg** design-to. At 150 Wh/kg (NTE floor): 13.3 kg.

**Note on depth of discharge:** This derivation assumes 100% usable DoD, which is aggressive for cold-temperature Li-ion operation. At start-of-sortie when the battery has warmed only partially from the base charging station, available capacity may be 75–85% of rated at temperature. If a 20% DoD reserve must be carried for cold-temperature margin, required capacity grows from 2.0 kWh to 2.5 kWh and cell mass grows to 15.6 kg at 160 Wh/kg, consuming ~19% of the growth allowance. This is tracked as part of §A13.

**BMS and battery housing:** Battery management system electronics, cell interconnects, structural housing with MLI blanket, and thermal management interface. Heritage from space battery programs: approximately 18–22% overhead on cell mass. Using 20%: 2.5 kg.

**Main power harness:** Power distribution cabling from battery through the body to all joint motor controllers, compute boards, heaters, and sensor hubs. A bipedal humanoid body with 38 actuated joints requires a multi-trunk power bus architecture. Heritage analog is the Valkyrie power harness (internal architecture not published) and R2 (38 processors, extensive internal cabling). Parametric estimate: 2.5% of total system mass for the main power harness = 75 kg × 0.025 = **1.9 kg design-to**.

**Power system total (battery cells + BMS/housing + harness): 12.5 + 2.5 + 1.9 = 16.9 kg design-to.**

Note: this is the largest single subsystem mass item. It is also the most commercially conservative — if a next-generation space-qualified cell achieves 200 Wh/kg by the 2035 deployment window (feasible given commercial cell development trends), the battery mass drops to 10.0 kg and total system design-to mass improves by 2.5 kg. Conversely, if deeper depth-of-discharge margins (80% vs. 100% assumed here) or capacity degradation reserve must be carried, capacity must grow by ~25%, adding ~3.1 kg to the cell mass. The budget is sensitive to this assumption and it is flagged as §A13 (see Section 5).

### Mass Budget Table

All values are design-to. Sources are cited to the subsection that established the figure. The 30% margin per NASA-STD-5001 applies at the total system level; subsystem allocations carry their own parametric uncertainty within the system margin.

| Subsystem | Design-to mass (kg) | Source / basis | Notes |
|---|---|---|---|
| Primary structure (torso spine, limb links, hip/shoulder yoke, pelvis) | 8.5 | §03, Section 4 | CFRP limb links + Al 7075 structural nodes; 8.5 kg = ~11% of 75 kg system mass. If CFRP space-qualification fails and aluminum-only construction is required, this line grows by 2.5–3.5 kg (§A5 consequence). |
| Actuation (38 joints: NdFeB motors + harmonic drives + QDD wrist/hand motors + encoders) | 13.0 | §03, Section 4 | Dominant actuation mass item; 38 joints × ~342 g mean actuator assembly mass (HD-Electric primary at load-bearing joints, QDD at wrists/hands). Atlas Electric heritage anchor. §03 DOF convention: 38 = independently controlled primary drive-train axes; bilateral joints counted as 2 each; distal motion couplings not separately counted. |
| Joints and sealing (labyrinth housings, FFKM lip seals, cross-roller bearings, joint covers) | 4.0 | §03, Section 4 | 38 joints × ~105 g mean; labyrinth geometry adds housing mass vs. bare bearings. Excludes foot cover consumables (carried under consumables/misc below). |
| End-effectors (2 dexterous hands + 2 feet including handrail-capture jaws) | 4.5 | §03, Section 4 | Hands: ~1.8 kg each (R2 hand mass heritage); feet: ~0.45 kg each including spring-loaded handrail jaw (+0.3–0.5 kg per foot per §03). |
| Sensor suite (stereo HDR head cameras + ToF depth, 2× wrist cameras, 3× IMU, 2× wrist F/T, fingertip tactile arrays, solid-state LIDAR) | 2.1 | §04, Section 1, Table | IMU spot shielding (~50 g per unit) included in this total. LIDAR at 0.5 kg is the single largest sensor. Sensor mass is 2.8% of system design-to — not a budget driver. |
| Compute (Tier 1 RH supervisor processor + Tier 2 AI accelerator + spot shielding for Tier 2 + rad-tolerant memory) | 1.8 | §04, Section 2, Table | 0.8 kg of this total is spot shielding for the Tier 2 Jetson-class board. The compute mass is tight and assumes no additional shielding beyond what §04 allocated. |
| Electronics vault + torso structural radiation shielding (2–4 mm Al equivalent torso walls) | 1.0 | §05, Section 3, Option 3 | Separate from the Tier 2 board spot shielding above (carried in compute line). Torso structural wall shielding provides passive bulk attenuation; §05 estimates 0.5–1.5 kg for this element. Using midpoint. |
| Thermal management (torso + battery MLI blankets, resistive survival heater elements, heat pipes, waste-heat radiator panel, joint-region spot MLI) | 2.5 | §05, Section 2; parametric derivation | MLI blankets ~0.8 kg; heater elements ~0.2 kg; heat pipes ~0.8 kg; radiator panel: OPEN (TRL 2, pending detailed thermal model). Required rejection area for 300 W at ε=0.70 is 0.7–1.5 m² at realistic lunar sink temperature (Stefan-Boltzmann limit at T_panel=50°C, T_sink~243 K); 0.3 m² claimed in earlier draft is insufficient by ~3×. Radiator mass provision raised to 1.5–4 kg until model closes; mass growth allowance absorbs this range. Thermal radiator is flagged as an open mass risk item. |
| Power system (battery cells + BMS/housing + main power harness) | 16.9 | This section (derived above) | Battery: 12.5 kg cells at 160 Wh/kg for 2.0 kWh; BMS+housing: 2.5 kg; harness: 1.9 kg. Battery cell mass assumes space-qualified Li-ion; commercial Li-ion cell mass would be 8.0 kg at 250 Wh/kg — see §A13 for technology gate. |
| Signal cabling, connectors, and brackets | 2.5 | Parametric: ~3.3% of total design-to pre-margin | Covers all signal harness (joint encoders, sensors, compute buses), power connector assemblies, cable routing brackets. Standard parametric estimate for complex robotic system at 3–5% of mass. |
| Consumables and mission-specific items (N₂ purge canister, optical sensor covers, boot covers × 2) | 0.9 | §05, Sections 4.3, 4.1; §03, Section 3 | N₂ canister: 0.3 kg; optical covers (6 apertures × ~25 g): 0.15 kg; boot covers (2 pairs, 0.2 kg each): 0.45 kg. These are the robot's deployed consumables, not base logistics resupply. |
| **Allocated subsystem subtotal** | **57.7** | Sum of above | This is the sum of all individually allocated subsystems. Growth allowance (below) covers unallocated reserve within the design-to. Note: radiator mass open; provision 0.5–3.0 kg above thermal management baseline within growth allowance; if full 3.0 kg radiator is required, growth allowance reduces to ~15 kg. |
| System growth allowance (unallocated reserve at design-to level) | 17.3 | 75 kg design-to target minus allocated subtotal | 17.3 kg = 30% of allocated subtotal. This is consistent with concept-phase MGA practice (AIAA S-120, which recommends 20–30% MGA at system level for TRL 3–5 hardware at concept phase). The large fraction reflects the number of subsystems below TRL 5 in the current design. |
| **Total dry mass (design-to)** | **75.0** | | Sum of allocated subsystems + growth allowance. This is the §A2 design-to commitment. |
| **Not-to-exceed (30% system margin per NASA-STD-5001)** | **97.5** | §A2; margins register | 75.0 kg × 1.30 = 97.5 kg. This is the hard NTE that destinations-trajectories uses for lander manifest planning. |

**Notes on budget closure:** The budget closes — the sum of estimated subsystem masses (57.7 kg) is meaningfully below the 75 kg design-to target, leaving 17.3 kg of unallocated system growth allowance (30% of allocated subtotal). The power system (16.9 kg, 22% of total) is the largest single allocated subsystem. The structure + actuation block totals 30.0 kg as established in §03. Sensors and compute together total 3.9 kg, consistent with the §04 prediction that these are not the mass driver.

The 30% unallocated growth allowance is deliberate and should not be interpreted as slack to be consumed in early design phases. At this concept level, no subsystem mass estimate has been backed by a detailed parts list; all are parametric from heritage analogs. History shows that the gap between concept-phase parametric estimates and first-article hardware mass is consistently in the 20–30% range — which is why NASA-STD-5001 requires the 30% system-level margin on top of the design-to. The 17.3 kg unallocated reserve within the design-to represents the expectation that detailed design will consume some portion of it before the system-level margin is invoked.

---

## 2. Power Budget

Three operating modes are characterized. Power values are design-to (pre-margin). Margin of 30% per NASA-STD-5001 is applied to each mode total to yield the budgeted draw.

The full locomotion + manipulation mode is the peak-draw scenario; it must close within 800 W with margin, which means ≤615 W design-to. Stationary manipulation must close within 500 W with margin (≤385 W design-to). Lunar night survival must close within the FSP provision of 300 W with margin.

| Consumer | Full locomotion + manipulation (W) | Stationary manipulation (W) | Lunar night survival (W) |
|---|---|---|---|
| Actuation — locomotion joints (hips, knees, ankles, 12 joints) | 260 | 0 | 0 |
| Actuation — manipulation joints (shoulders, elbows, wrists, torso, neck, 26 joints) | 75 | 215 | 0 |
| Sensor suite — LIDAR (active during locomotion; standby during stationary) | 20 | 5 | 0 |
| Sensor suite — cameras and F/T (full during manipulation; reduced during locomotion) | 20 | 25 | 0 |
| Sensor suite — IMU keep-alive (always active) | 4 | 4 | 2 |
| Compute — Tier 1 RH supervisor (always on, minimum monitoring; full during operation) | 8 | 8 | 5 |
| Compute — Tier 2 AI accelerator (full inference during all active operations; off during hibernation) | 50 | 45 | 0 |
| Thermal — survival heaters (electronics + battery compartments; off during active ops) | 0 | 0 | 50–150 |
| Thermal — joint heaters (HD-Electric lubrication floor; off during active ops) | 0 | 0 | 20–50 |
| Thermal — active cooling / heat transport (heat pipes; required during active ops) | 25 | 20 | 0 |
| Communications (relay link active during operations; standby beacon only during hibernation) | 12 | 10 | 2 |
| **Total (design-to, pre-margin)** | **474** | **332** | **79–209** |
| **Margin (30% per NASA-STD-5001)** | **142** | **100** | **24–63** |
| **Total with margin** | **616** | **432** | **103–272** |
| **Mode design goal** | ≤800 W | ≤500 W | FSP provision: 300 W (worst-case margin, pending thermal model) |
| **Status** | Closes (616 W vs. 800 W cap) | Closes (432 W vs. 500 W cap) | Lower bound closes with margin (103 W well within 300 W FSP provision); upper bound (272 W) also within 300 W FSP provision — budget closes across full uncertainty range against FSP provision, but thermal model must tighten the range before FSP sizing is finalized. |

**Note on sensor suite peak power:** §04 states sensor suite peak = 75 W (full active configuration). The locomotion column above shows 44 W (LIDAR 20 W + cameras/F/T 20 W + IMU 4 W) because LIDAR runs at 20 W and cameras/F/T at 20 W during locomotion. Full 75 W peak occurs if LIDAR and all cameras/F/T are simultaneously at maximum power during combined locomotion + manipulation — a transient peak, not a continuous draw. Design-to column assumes the sensor modes listed above; the §04 peak of 75 W should be used for thermal analysis rather than the steady-state operational draw shown here.

**Actuation power notes:** The 260 W locomotion actuation design-to is based on the following reasoning. Atlas Electric (89 kg, electric, custom fully-rotational direct-drive motors) is the closest commercial heritage for electric bipedal locomotion power. Published figures for Atlas Electric total system power draw are not available; the estimate used in §A3 derives from Valkyrie at ~1,800 W for 129 kg, scaled by mass ratio and efficiency improvement (75/129 × 0.85 efficiency factor ≈ 0.495, giving ~890 W total), then allocating ~65% of that to locomotion actuation = ~580 W. However, this is a worst-case figure at vigorous locomotion. For normal 1.0 m/s walking on prepared paths, actuation demand is substantially lower. The study uses 260 W based on an additional 0.55 factor for normal vs. vigorous gait — a parametric assumption with no direct heritage validation for this platform. This is acknowledged as a budget stress point.

The 0.55 gait factor is logged as §A14 in the margins register. Budget locomotion power closure is conditional on this factor pending the task-level simulation in §03 Section 5 item 3.

The efficiency improvement factor of 0.85 applied to the Valkyrie-to-space-humanoid scaling is a parametric estimate for HD-Electric efficiency gain relative to Valkyrie's SEA actuators. SEA efficiency at the Valkyrie joint level has been measured at approximately 65–75% mechanical efficiency including the spring element (Paine et al., 2015, \cite{paine2015valkyrieActuator}). HD-Electric harmonic drive efficiency at 80:1–120:1 gear ratio is 78–83% per Harmonic Drive AG CSF/CSD product data (\cite{harmonicdrive_ag_catalog}). The 0.85 factor in this derivation represents the ratio of HD-Electric efficiency to SEA efficiency, estimated at 83%/75% ≈ 1.11 → correction factor of 0.85 on total power is approximation. This is a reasonable parametric estimate but is flagged as requiring validation against per-joint power data when hardware is available.

The 215 W manipulation actuation for stationary heavy manipulation covers tasks such as torqueing bolts to EVA-gloved-human torques (up to 50 N·m wrist output), carrying equipment at reach (up to 20 kg in 1/6 g = ~33 N gravity load, amplified by lever arms), and bimanual EVA tool operations. The 38-joint power allocation open question flagged in §03 (Section 5, item 3) directly bears on this: not all joints are simultaneously loaded at maximum torque, but the task-level simulation to validate this assumption has not been run. Until that simulation closes, the stationary manipulation actuation figure carries the full 30% margin.

**Thermal hibernation note:** The lunar night survival power range (79–209 W pre-margin; 103–272 W with margin) reflects the wide uncertainty in the thermal model for the bipedal form factor. The confirmed §05 electronics/battery survival heater range is 50–150 W; joint heaters add 20–50 W; total pre-margin range is 79–209 W. Both bounds close against the 300 W FSP provision. The thermal model is the priority input for FSP sizing — the current uncertainty spans 103–272 W, a 2.6× range that must be narrowed to ±30 W before the FSP plant is sized. Until that model is validated, the far-side-base-architect must provision 300 W per humanoid with margin.

---

## 3. Budget Closure Assessment

**Does the budget close?** Yes, with **three** qualifications. The mass budget closes with 17.3 kg of unallocated system growth allowance within the 75 kg design-to, and the 97.5 kg NTE accommodates an additional 30% system-level margin beyond that. The power budget closes for the full locomotion + manipulation mode (616 W vs. 800 W cap) and the stationary manipulation mode (432 W vs. 500 W cap). The lunar night hibernation budget closes against the 300 W FSP provision at both bounds (103 W lower, 272 W upper), though the wide 79–209 W pre-margin range requires a detailed thermal model to tighten before FSP plant sizing is finalized.

**Three qualifications:**
1. Mass budget closure conditional on the thermal management radiator mass (currently open; provision 0.5–3.0 kg absorbed in growth allowance). If the full 3.0 kg radiator is required, the growth allowance reduces to ~15 kg but the budget still closes.
2. Lunar night thermal power uncertainty (79–209 W pre-margin, a 2.6× range) means the 300 W FSP provision is set conservatively pending the detailed thermal model. FSP sizing cannot be finalized until the range narrows to ±30 W.
3. Locomotion power budget closure conditional on the §A14 gait factor (0.55), which has no direct heritage validation. If the actual factor is 0.75, locomotion power grows to ~350 W and the full locomotion+manipulation mode total grows to ~665 W, still within the 800 W cap but with reduced margin.

**Top two stress points:** First, the battery/power system subsystem (16.9 kg, 22% of allocated mass) is the largest single mass line item and is sensitive to the energy density assumption. If space-qualified cells remain at 150 Wh/kg rather than the 160 Wh/kg design-to value, the battery mass grows by ~0.8 kg — manageable. If operational depth-of-discharge margins require 25% additional capacity reserve (a credible requirement for cold-temperature operation where Li-ion capacity degrades at the sub-zero temperatures prior to full warm-up), the battery mass grows by ~3.1 kg, consuming 18% of the growth allowance. Second, the lunar night thermal power draw range (103–272 W with margin) spans a 2.6× range; the thermal model must be validated to ±30 W before the FSP plant is sized.

**Margin posture:** The 30% concept-phase margin per NASA-STD-5001 is the minimum appropriate for a system with this TRL profile. Seven technology elements across the subsystems are below TRL 5, including the harmonic drive cryogenic validation (§A4 fallback gate), FFKM lip seal cryogenic extension (§A6), flexible tactile substrate qualification, MEMS IMU radiation tolerance, LIDAR radiation hardening, the Tier 2 compute SEU rate characterization, and the thermal model validation. Program practice for this number of open TRL gaps would typically justify carrying 35–40% margin at the concept phase, not 30%. This study recommends the executing team treat the 30% figure as the minimum acceptable margin and document a plan to tighten it subsystem by subsystem at each program gate, rather than treating it as available headroom for design growth.

---

## 4. Cross-Coupling Summary

This budget produces numbers that downstream study sections directly depend on. The assumptions it rests on, and the consequence of each assumption being wrong, are tabulated below.

| Assumption | Reference | Consequence if wrong |
|---|---|---|
| Design-to mass 75 kg | §A2 (margins register) | Lander manifest must be re-run by destinations-trajectories; launch cost per unit changes; number of units per flight changes |
| Not-to-exceed mass 97.5 kg | §A2 | Hard NTE breach requires either design relief (reducing subsystem mass) or accepting higher cost via larger lander payload allocation |
| Power 500 W steady-state / 800 W peak | §A3 | FSP allocation must be renegotiated with far-side-base-architect; if peak is higher, thermal rejection requirement increases |
| Battery 2.0 kWh at 160 Wh/kg (12.5 kg cells) | §A13 (this section) | If energy density is 150 Wh/kg: cells grow to 13.3 kg (+0.8 kg). If capacity reserve +25%: cells grow to 15.6 kg (+3.1 kg). Either case consumes significant growth allowance. |
| Structure + actuation ≤30 kg design-to | §A5 | If CFRP space-qualification fails (aluminum-only: +3 kg) or harmonic drive fallback triggers (SEA: +10–20 kg per §A4), total system mass breaks 75 kg target and lander manifest must be revised |
| HD-Electric actuation mass | §A4 | If SEA fallback at 2029 gate: actuation subsystem grows by 10–20 kg. Growth allowance (17.3 kg) partially absorbs this, but the NTE likely breaks at the upper end. Mass budget must be renegotiated. |
| CFRP limb construction | §A5 | Aluminum substitution adds 2.5–3.5 kg to primary structure. Within growth allowance. |
| Thermal hibernation power 70–200 W | §A10 | If resolved to upper bound: FSP allocation per humanoid increases to ~300 W with margin; three-humanoid base requires ~900 W FSP reservation through every lunar night — material to FSP sizing |
| Thermal radiator sizing — OPEN | This section | Radiator mass 0.5–3.0 kg range is absorbed by growth allowance; Stefan-Boltzmann limit at ε=0.70, T_panel=50°C, T_sink~243 K means required area for 300 W rejection is 0.7–1.5 m² — thermal model must close this before PDR. |
| Locomotion gait power factor 0.55 | §A14 (this section) | If factor is 0.75, locomotion power grows to ~350 W; full locomotion+manipulation mode total grows to ~665 W with margin — still within 800 W cap but margin reduces from 184 W to ~135 W. |
| Tier 2 compute ORU replacement at 3-year intervals | §A11 | If TID is higher than estimated (§A12 risk), replacement interval shortens; spares cost increases; cost-program must be revised |

---

## 5. New Assumption: Battery Energy Density (§A13)

Per the "how to add an assumption" protocol in the margins register, the battery energy density assumption introduced in this section is logged here for transcription to the register.

**§A13. Battery energy density: 160 Wh/kg design-to (150–180 Wh/kg range).**

The power system mass is sized on space-qualified lithium-ion cells at 160 Wh/kg design-to, with 150 Wh/kg as the conservative NTE floor. This represents a ~35% penalty relative to state-of-the-art commercial cells (250+ Wh/kg) to account for radiation screening, vibration qualification, temperature derating, and lot acceptance testing. ISS battery replacement (2017–2019, lithium-ion) achieved ~160 Wh/kg at cell level, establishing this as a credible space-qualified baseline.

**Technology gate:** If space-qualified cells achieve 200 Wh/kg by the 2032 hardware definition review, battery cell mass reduces from 12.5 kg to 10.0 kg and the growth allowance improves by 2.5 kg. If operational requirements dictate carrying a 25% depth-of-discharge reserve (cold-temperature capacity reduction before warm-up completion), required cell energy increases to 2.5 kWh and cell mass grows to 15.6 kg at 160 Wh/kg, consuming ~19% of the 17.3 kg growth allowance. The battery mass is the single most tractable path to improving the mass budget: a 40 Wh/kg improvement in qualified energy density translates directly to 2.5 kg of mass relief without any design change elsewhere.

Owner: humanoid-systems-architect. Risk if wrong: medium-high. Battery mass directly affects §A2 (design-to mass target) and, through mass, affects §A3 (power budget, because heavier battery reduces power available for actuation at fixed NTE). Must be reviewed at the 2029 and 2032 program gates against available qualified cell data.

---

## 6. Inputs Produced for Downstream Study Sections

This budget produces the following specific inputs that downstream sections must use:

**To destinations-trajectories:**
- Total humanoid dry mass design-to: **75 kg**; NTE: **97.5 kg**. These are the manifest numbers. If the mass budget renegotiates, destinations-trajectories must re-run the lander manifest calculus and notify cost-program of any launch cost impact.
- Operational configuration (surface EVA-support): one humanoid per deployment slot at 97.5 kg NTE plus mission-specific payload attachment (TBD, not in this budget).

**To cost-program:**
- Unit dry mass: 75 kg design-to, for use in parametric cost models (hardware cost typically correlates with mass for complex one-of-a-kind systems).
- Power system configuration: 2.0 kWh battery at 160 Wh/kg space-qualified cells. Cell cost at space-qualified procurement is typically 5–20× commercial cell cost per kWh; this should be reflected in recurring unit cost estimates.
- Tier 2 compute boards: 3-year ORU replacement cycle per §A11; spares cost = (unit cost of Tier 2 board + shielding assembly) × (7-year life ÷ 3-year interval) = 2–3 replacement sets per humanoid unit per design life.

**To conops-integrator:**
- Sortie battery life: 4 hours at 500 W steady-state. Recharge time to full capacity from a base charging station: parametrically estimated at 2× discharge time at 0.5C charge rate = ~8 hours per sortie (full night recharge is adequate for daily sortie scheduling).
- Lunar night hibernation warm-up time: 15–30 minutes to partial operability (locomotion available); 45–90 minutes to full operability. These intervals must appear in the mission timeline and in the crew alert procedure for start-of-day humanoid activation.
- Stationary manipulation peak draw: 432 W with margin. Combined locomotion + manipulation: 616 W with margin. These set the per-slot demand on the base power distribution system during operations.

**To far-side-base-architect:**
- Peak power demand per humanoid (simultaneous locomotion + manipulation): 616 W with margin.
- Average power demand per humanoid during active operations: estimated 450 W (weighted average of locomotion and manipulation modes, assuming mixed duty cycle). This is the FSP daily allocation per active humanoid.
- Lunar night FSP reservation per humanoid: **70–200 W** (parametric, TRL 2) → conservatively budget **300 W with margin** until thermal model closes. With three simultaneously hibernating humanoids: 900 W FSP reservation minimum, and up to 900 W × 1.3 = 1,170 W if margin is applied at the base level.
- Battery recharge power demand: 2.0 kWh ÷ 8 hours = 250 W per humanoid during scheduled recharge. Multiple humanoids recharging simultaneously must be staggered in the FSP load schedule.

---

## References

\cite{huntress2011soviet} — Huntress and Marov, Soviet Robots in the Solar System, Springer Praxis, 2011. Lunokhod battery and power architecture; RHU thermal survival philosophy.
\cite{radford2015valkyrie} — Radford et al., Valkyrie design paper; SEA architecture, power draw estimate, 1.8 kWh battery heritage for Valkyrie.
\cite{nasa2023valkyrieFactsheet} — Valkyrie R5 fact sheet; 1,800 W estimated power draw basis.
\cite{bostondynamics2024atlas} — Atlas Electric spec sheet; 89 kg platform, custom fully-rotational direct-drive motors, 85–90% efficiency.
\cite{figureai2024figure02} — Figure 02; 2.25 kWh battery (manufacturer-claimed, unverified); commercial Li-ion baseline.
\cite{tesla2023optimus2} — Optimus Gen 2; ~2.3 kWh battery (derived from runtime and estimated power draw).
\cite{nasa_iss_battery} — NASA ISS battery replacement project (2017–2019); lithium-ion ~160 Wh/kg space-qualified heritage. [Cite to be confirmed against primary source before PDR]
\cite{paine2015valkyrieActuator} — Paine et al. (2015), Valkyrie SEA actuator per-joint power data; used for locomotion actuation budget derivation. SEA efficiency measured at approximately 65–75% mechanical efficiency including the spring element.
\cite{harmonicdrive_ag_catalog} — Harmonic Drive AG CSF/CSD product data; HD-Electric efficiency at 80:1–120:1 gear ratio is 78–83%.
