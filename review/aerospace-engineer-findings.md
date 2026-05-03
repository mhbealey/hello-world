---
title: Aerospace Engineer Review Findings
status: findings-complete
owner: aerospace-engineer-reviewer
last-updated: 2026-05-03
---

# Aerospace Engineer Review Findings

## Summary

| Severity | Count |
|----------|-------|
| Blocker  | 3     |
| Major    | 10    |
| Minor    | 5     |
| Nit      | 3     |

---

## Findings

### AE-001 — BLOCKER — 03-actuation-structures.md — DOF table total is wrong by ~13–15 DOF

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Blocker
**Issue:** The joint allocation table uses "each" language throughout (e.g., "Each arm: 4 DOF," "Each hip: 3 DOF," "Each hand: 10–12 DOF") but then reports a total of "~36–40." Summing the bilateral entries correctly: neck 3, torso 2, arms 2×4=8, wrists 2×3=6, hands 2×(10–12)=20–24, hips 2×3=6, knees 2×1=2, ankles 2×2=4, yields **51–55 DOF total**, not 36–40. The error is ~13–15 DOF — roughly a 30% undercount. The subsequent text states "the design-to DOF count is 38 nominal" and sizes actuation mass at 38×~340 g, creating an internal contradiction: either the nominal is 38 (in which case several "each" rows need halving, which makes no physical sense), or the nominal is 51–55 (in which case the actuation mass allocation of 13 kg is severely undersized). The mass budget carries the 38-joint number; if the actual count is 51+, actuation mass at 340 g/joint grows to ~17–19 kg, breaking the 30 kg structure+actuation allocation.
**Evidence:** Sum of table entries: neck(3) + torso(2) + 2×arm(4) + 2×wrist(3) + 2×hand(10–12) + 2×hip(3) + 2×knee(1) + 2×ankle(2) = 51–55. The "38 nominal" claim in the text matches the body-without-full-hands count (31 body + 7 DOF of hand — inconsistent with the 10–12 DOF/hand entries). Comparable systems: Valkyrie at 44 DOF has no finger joints; R2 at 42 DOF has 12 DOF hands (7-segment fingers × 2 hands with limited independent DOF) — these totals are closer to 44–55 for a fully articulated system.
**Required action:** Reconcile the table entries and the total. Either (a) restate the "each" rows as bilateral totals and recount, or (b) accept that the nominal DOF is 50+ and revise the actuation mass allocation upward accordingly. The mass-power budget (Section 01-06) must be re-run with the corrected joint count before the budget closes.

---

### AE-002 — BLOCKER — 06-mass-power-budget.md — Thermal radiator sizing violates Stefan-Boltzmann law

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Blocker
**Issue:** Section 01-06 states: "Radiator sized to reject ~300 W at end-of-mission emissivity (ε = 0.70 EOL per §05); at 50°C panel temperature, required radiator area ~0.3 m² at ~10 kg/m² = ~3.0 kg." The physics does not close. Applying the Stefan-Boltzmann equation Q = ε·σ·A·(T_panel⁴ − T_sink⁴) with ε=0.70, A=0.3 m², T_panel=323 K (50°C): even with an ideal 4 K sky as the sole sink, the maximum rejection is approximately 130 W. To reject 300 W with 0.3 m² at ε=0.70 and T_panel=50°C, the implied sink temperature is imaginary (T_sink⁴ is negative in the solved equation). The area required for 300 W rejection with a realistic effective sink temperature (~4 K sky but ~200–243 K effective accounting for ground view factor from a body-mounted panel) is approximately 0.7–1.5 m² — 2.3–5× larger than stated. During the lunar day, the equatorial surface reaches ~390 K (117°C), which is above the panel temperature; a horizontally oriented radiator in that environment absorbs heat rather than rejecting it. The 3 kg thermal mass line item in the budget is therefore substantially undersized if the robot must reject 300+ W during active lunar-day operations.
**Evidence:** Stefan-Boltzmann: Q = 0.70 × 5.67×10⁻⁸ × 0.3 × (323⁴ − T_sink⁴). Solving for T_sink when Q=300: T_sink⁴ = 323⁴ − 300/(0.70 × 5.67×10⁻⁸ × 0.3) = 1.09×10¹⁰ − 2.52×10¹⁰ = −1.43×10¹⁰. No real solution exists. At T_sink=4 K: Q = 0.70 × 5.67×10⁻⁸ × 0.3 × 323⁴ = 129 W. At a realistic effective sink of 243 K (vertical radiator with ~85% sky, 15% lunar-day ground view): Q = 100 W. Area required for 300 W at 243 K effective: 0.7–1.5 m² depending on geometry.
**Required action:** Redo the radiator sizing with explicit sink temperature assumptions, view-factor analysis for the robot's body geometry during lunar-day operation, and proper Stefan-Boltzmann arithmetic. The thermal management mass line item (currently 3.0 kg in §01-06) is likely undersized by a factor of 2–4×, which threatens the mass budget closure. Coordinate with space-environments agent on radiator orientation options and the thermal model required before PDR.

---

### AE-003 — BLOCKER — 02-form-factor-tradespace.md — Evaluation matrix "weighted total" row contains arithmetic errors that inflate the A-vs-B gap

**Section:** `study/01-optimal-space-humanoid/02-form-factor-tradespace.md`
**Severity:** Blocker
**Issue:** The evaluation matrix table's "Weighted total" row (line 120) states scores of A=3.60, B=3.35, C=2.95, D=2.55, E=2.80. The document itself then provides a "Raw weighted totals" recalculation section that gives A=3.65, B=3.55, C=3.25, D=2.90, E=2.85 — which are the correct arithmetic results. The table row is wrong in all five values. The practical consequence is that the table implies an A-versus-B gap of 0.25, whereas the actual gap is 0.10. The document's own Section 4 text then correctly quotes 3.65 and acknowledges the narrow gap ("the bipedal form wins primarily on C1"), but the table — which is what a reader or downstream agent will likely reference — overstates the margin for the winning form factor by 2.5×. In a study that must be transparent about the closeness of this call (the centaur is the legitimate second choice), an error that makes the winning candidate look 2.5× more dominant than it is undermines analytical credibility.
**Evidence:** Recomputed from table scores and weights: A = 5(0.25)+3(0.20)+2(0.15)+3(0.15)+4(0.10)+4(0.10)+5(0.05) = 1.25+0.60+0.30+0.45+0.40+0.40+0.25 = 3.65. Table claims 3.60. B = 4(0.25)+4(0.20)+4(0.15)+3(0.15)+2(0.10)+3(0.10)+4(0.05) = 1.00+0.80+0.60+0.45+0.20+0.30+0.20 = 3.55. Table claims 3.35. All other candidates similarly incorrect in the table row.
**Required action:** Correct the "Weighted total" row in the evaluation matrix to match the values already correctly computed in the "Raw weighted totals" subsection. Verify that the Section 4 discussion text is updated to acknowledge that the A-B gap is 0.10 (not 0.25), which it currently does implicitly but should state explicitly so the table and text are consistent.

---

### AE-004 — MAJOR — 03-actuation-structures.md — 340 g/joint actuator mass claim is unsupported and likely undersized for primary load-bearing joints

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Major
**Issue:** Section 01-03 states actuation mass at "~38 joints at mean ~340 g actuator mass" and cites "HD-Electric actuator mass density from Atlas Electric heritage scales favorably vs. SEA." No citation is provided for the 340 g mean, and no breakdown distinguishes small finger joints (~50–100 g feasible) from large hip/knee joints (~500–900 g needed). Hip and knee joints on a 75 kg bipedal robot must produce 150–250 N·m of peak torque. A Harmonic Drive AG CSF-20 flexspline assembly (rated ~200 N·m peak torque) alone masses approximately 500 g — and still requires a brushless motor, encoder, and housing. The 340 g mean can only be achieved if the hand and wrist joints (which can be very light) numerically dominate, but the mass-critical joints are the 12 locomotion joints, not the ~20 hand/wrist joints. If the 12 locomotion joints average 700 g and the 26 upper-body/hand joints average 150 g, the weighted mean is 700×(12/38) + 150×(26/38) = 221+103 = 324 g — close to the claim, but the 700 g assumption for locomotion joints is itself unverified. The Atlas Electric heritage cited does not publish actuator-level mass breakdown; the full-system 89 kg for 56 DOF (full system per-joint: ~1590 g/DOF) cannot directly validate a 340 g/actuator claim.
**Evidence:** Harmonic Drive AG datasheet: CSF-14 (100 N·m) ~200 g unit; CSF-20 (200 N·m) ~500 g unit; CSF-25 (360 N·m) ~900 g unit. Adding a brushless motor in the 50–150 N·m torque class: ~150–300 g for the motor alone. Hip joint requiring 150 N·m during locomotion: CSF-14 + motor ≈ 350–500 g minimum, not including encoder and housing. This is already at or above the claimed 340 g mean for a single major joint.
**Required action:** Provide a joint-by-joint mass allocation that distinguishes between small (wrist, finger, neck) joints and large (hip, knee, ankle, shoulder) joints. Cite Harmonic Drive AG or equivalent catalog data for the specific flexspline sizes required at each joint class. If the mean drops below 340 g only because finger joints are very light, the locomotion-critical joint mass must be explicitly broken out and the locomotion actuation sub-budget verified.

---

### AE-005 — MAJOR — 06-mass-power-budget.md — Lunar night survival power "closes" with 2 W margin — this is not budget closure

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Major
**Issue:** The power budget table states that the lunar night survival mode with margin is 148 W against a 150 W goal, and declares "Status: Lower bound closes (148 W vs. 150 W goal)." A 2 W margin — 1.3% of the target — does not constitute budget closure at concept phase. The 30% margin requirement per NASA-STD-5001 was already applied to compute the 148 W figure; any additional uncertainty in individual line items (Tier 1 processor quiescent draw, communications beacon power, minor heater inefficiencies) eats this immediately. Further, the lower bound of the thermal uncertainty range (85 W survival heaters) is the optimistic end of a 3× range (85–175 W). Using the midpoint heater estimate shifts the pre-margin total to ~175 W and the margin-included figure to ~228 W, well above the 150 W goal. The document correctly notes the upper bound does not close (304 W vs. 150 W goal) but frames the lower-bound closure as acceptable. That framing should be rejected: a number that is within rounding error of the goal at the most optimistic heater assumption, and that blows past the goal by 2× at the central estimate, is not closed.
**Evidence:** Lower bound calculation: IMU(2) + Tier1(5) + heaters_electronics(85) + heaters_joints(20) + comms(2) = 114 W pre-margin; 114 × 1.30 = 148.2 W. The 2 W margin is less than the expected uncertainty in Tier 1 quiescent draw alone. Central estimate heaters (midpoint: 130 W electronics + 35 W joints): 2+5+130+35+2 = 174 W pre-margin; 174 × 1.30 = 226 W with margin — 51% over goal.
**Required action:** Revise the budget closure assessment: the lunar night survival power budget does NOT close at concept phase. The goal should be stated as ≤230 W (or revised based on the thermal model range) rather than ≤150 W until the thermal model reduces the uncertainty range below ±30 W. The far-side-base-architect must be notified that the FSP reservation per hibernating humanoid should be provisioned at 300 W until the thermal model closes, not 150 W.

---

### AE-006 — MAJOR — 06-mass-power-budget.md — Locomotion-only power mode not shown; §A3 steady-state spec is unverified

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Major
**Issue:** The margins register (§A3) specifies "500 W steady-state locomotion" as the power budget baseline. Section 01-06 does not include a pure locomotion mode in its power table; it shows "full locomotion + manipulation" and "stationary manipulation." The derivation note in the actuation section acknowledges the 260 W locomotion joint figure is based on Valkyrie scaling with a 0.55 "normal vs. vigorous gait" factor — but this factor is explicitly described as having "no direct heritage validation for this platform." Adding non-actuation consumers to 260 W (LIDAR ~20 W, cameras ~10 W, IMU ~4 W, Tier 1 ~8 W, Tier 2 ~40 W, cooling ~20 W, comms ~12 W = ~114 W overhead) gives a pure-locomotion total of ~374 W pre-margin and ~486 W with 30% margin — barely under the 500 W steady-state goal, with no slack. This critical mode is absent from the budget table, making it impossible to verify §A3 from the presented data.
**Evidence:** §A3 (margins register) states "500 W steady-state locomotion." Power table in §01-06 has no locomotion-only row. Derivation note in §01-06 actuation power section: "The study uses 260 W based on an additional 0.55 factor for normal vs. vigorous gait — a parametric assumption with no direct heritage validation for this platform. This is acknowledged as a budget stress point."
**Required action:** Add a pure locomotion mode row to the power budget table, showing all consumers active during locomotion with manipulation joints at zero or standby. Verify that the total with margin closes under 500 W. If it does not close, §A3 must be revised and the implications flagged to the far-side-base-architect.

---

### AE-007 — MAJOR — 06-mass-power-budget.md / 03-actuation-structures.md — Actuation power derivation uses SEA heritage to justify HD-Electric budget with unexplained 15% efficiency credit

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Major
**Issue:** The locomotion actuation budget (260 W design-to) derives entirely from Valkyrie SEA power data scaled by mass ratio and a 15% efficiency improvement credit. Valkyrie uses series-elastic actuators; the selected architecture is HD-Electric with active impedance control. These are fundamentally different mechanical systems with different loss pathways. SEA stores and releases energy in the compliance element; HD-Electric transmits through a cycloidal flexspline. The 15% efficiency improvement for HD-Electric over SEA is asserted without citation. Atlas Electric's efficiency is cited as 85–90% electrical-to-mechanical — but Valkyrie's SEA efficiency is not published in the references cited. Without both numbers, the delta cannot be computed. Additionally, the 0.55 "normal vs. vigorous gait" factor applied after the mass scaling has no cited precedent for this robot class. The combined effect of the mass-ratio scaling, the 15% credit, and the 0.55 gait factor produces the final 260 W number through a three-step derivation chain where each step introduces unvalidated assumptions.
**Evidence:** Section 01-06 actuation power note: "scales by mass ratio (75/129) and applying a 15% efficiency improvement credit for next-generation electric actuators over Valkyrie's 2015-era SEA technology." No citation provided for the 15% claim. "The study uses 260 W based on an additional 0.55 factor for normal vs. vigorous gait — a parametric assumption with no direct heritage validation for this platform."
**Required action:** Either (a) provide a citation for HD-Electric vs. SEA efficiency differential, or (b) validate the 260 W estimate against measured power draw data from a comparable commercial HD-electric biped (Unitree G1 or H1 locomotion power during walking is publicly available in some research publications). Document the uncertainty range on the 260 W number explicitly; it should carry at least ±50% uncertainty until validated.

---

### AE-008 — MAJOR — 01-overview.md — Atlas Electric DOF reported as 56; Boston Dynamics claims 28 DOF

**Section:** `study/01-optimal-space-humanoid/01-overview.md`
**Severity:** Major
**Issue:** The heritage table lists Atlas Electric with "DOF (total): 56." Boston Dynamics' published specifications for Atlas Electric (2024) describe 28 degrees of freedom. The 56 figure may conflate articulated DOF with the number of actuators or may reference an earlier Atlas hydraulic variant's specification. This error propagates into the actuation section: Section 01-03 references "Atlas Electric heritage" for HD-Electric efficiency and actuator mass scaling. If the robot has 28 DOF rather than 56, then the per-joint actuator mass implied by Atlas heritage doubles (89 kg / 28 joints full-system = 3.2 kg/joint full-system basis vs. the 1.6 kg/joint from the 56-DOF figure), which makes the study's 340 g/joint claim even harder to justify from Atlas heritage.
**Evidence:** The review brief itself notes: "Atlas Electric is 89 kg for 28 DOF — that's ~3.2 kg/joint." The Boston Dynamics Atlas Electric product page (2024) describes 28 degrees of freedom. The section's "56 DOF" entry is inconsistent with primary source data.
**Required action:** Correct the heritage table entry to 28 DOF for Atlas Electric. Revisit the actuation section's heritage anchors: the per-joint mass scaling from Atlas at 28 DOF vs. 56 DOF changes the supporting argument for the 340 g/joint figure.

---

### AE-009 — MAJOR — 04-sensing-autonomy.md — TRL applied to "terrestrial sensor market" rather than to a specific system/application

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Major
**Issue:** The sensing section states: "High-dynamic-range machine vision cameras with space-qualified lenses exist at TRL 5-6 in the terrestrial sensor market." TRL is a property of a specific system developed for a specific application, not a property of a commercial market or product class. TRL 5-6 means "component/subsystem validated in relevant environment" or "system/subsystem model or prototype demonstrated in a relevant environment" — these are achievements of a development program, not characterizations of what commercial customers can buy off the shelf. The phrasing implies there exist camera units that have completed TRL 5–6 milestones for the lunar outdoor illumination application, which is not what the section means. The same misuse appears in the sensor summary table's TRL column for HDR cameras: "6-7" with a separate "Space TRL gap" column listing "TRL 4-5." It is unclear whether the 6-7 refers to terrestrial use (which would be more accurately labeled as COTS commercial readiness level, not NASA TRL) or the specific application.
**Evidence:** Section text: "High-dynamic-range machine vision cameras with space-qualified lenses exist at TRL 5-6 in the terrestrial sensor market; the qualification delta for vacuum and radiation is a development item." Table column heading "TRL (terrestrial)" with value "6-7" for HDR cameras. NASA TRL definitions apply to specific applications, not product categories.
**Required action:** Replace "TRL 5-6 in the terrestrial sensor market" with a specific claim about what application the camera has been qualified for at TRL 5-6 (e.g., "industrial machine vision in high-contrast environments at TRL 7-8; lunar outdoor illumination application is TRL 3-4 pending a qualification program"). Revise the sensor table to avoid the TRL(terrestrial)/space-TRL dual-column confusion — either use a single application-specific TRL with a narrative on the space gap, or clearly define what "terrestrial TRL" means in the column header.

---

### AE-010 — MAJOR — 03-actuation-structures.md / 05-environments-hardening.md — FFKM at −180°C is TRL 2–3, not TRL 3–4; overstated maturity

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`; `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Major
**Issue:** Both sections and the margins register (§A6) rate FFKM/Kalrez-class lip seal performance at −180°C as TRL 3–4. TRL 3 is "analytical and experimental proof of concept"; TRL 4 is "component-level validation in laboratory environment." The problem is that standard perfluoroelastomers (FFKM) transition to a glass-like state and become brittle at temperatures well below −100°C — this is a fundamental materials-science property of fluoropolymers, not an untested parameter. Kalrez 4079 (Dow's coldest-rated compound) is rated to −42°C. No commercial FFKM formulation is currently qualified or tested near −180°C. Achieving elastomeric performance (i.e., able to deform and seal under compression) at −180°C would require a fundamentally different chemistry — likely a perfluoropolyether-based or silicone-based elastomer — not a compound variation on existing FFKM. The FFKM approach at −180°C is not a development item at TRL 3–4; it is a materials research problem with no demonstrated proof of concept, placing it at TRL 2 at best. Calling it TRL 3–4 overstates maturity and may cause the program to underestimate the risk and timeline.
**Evidence:** Fluoroelastomers (including FFKM) exhibit glass transition temperatures (Tg) of approximately −50°C to −70°C for Kalrez-class materials. Below Tg, the material is rigid, cannot seal, and becomes prone to fracture under load. The −180°C requirement is approximately 110–130°C below the glass transition — this is not a qualification extension challenge, it is a fundamental phase-change problem. PFPE (perfluoropolyether) greases are used at these temperatures (confirmed by Lunokhod and space mechanism heritage), but PFPE elastomers for dynamic sealing at −180°C have no published validation data.
**Required action:** Revise TRL assessment for FFKM seals at −180°C to TRL 2 (concept formulated, no experimental proof). Evaluate whether the design requirement itself should be reconsidered: can the joint architecture maintain seal zone temperature above −60°C (the demonstrated FFKM floor) by design, using the joint heater power already allocated? If yes, the materials challenge disappears and joint heaters become a hard design requirement rather than a mitigation option. The actuation and environments sections should state explicitly which approach is baseline (FFKM + heaters to maintain above −60°C, vs. develop a new compound for −180°C operation).

---

### AE-011 — MAJOR — 06-mass-power-budget.md — Battery 100% depth of discharge assumed; no cold-temperature capacity derate at sortie start

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Major
**Issue:** The battery sizing assumes 2.0 kWh provides a 4-hour sortie at 500 W steady-state, using 100% depth of discharge (DoD). Lithium-ion cells operated at 100% DoD have substantially shorter cycle life than cells operated at 80% DoD (cycle life typically 3–5× longer at 80% DoD vs. 100% DoD for space-qualified Li-ion). Additionally, the sortie begins immediately after the robot exits its charging dock, at which point battery temperature is at or near the 0°C minimum operating temperature; Li-ion capacity at 0°C is typically 70–85% of rated capacity at 20°C. Together, the DoD and cold-temperature effects mean the effective available energy for the first sortie of each day is closer to 1.1–1.4 kWh (70–85% cold-temperature capacity × 80% DoD × 2.0 kWh), supporting a 2.5–3.3 hour sortie, not 4 hours. The document acknowledges the cold-temperature issue in §A13 but sizes the battery at 100% DoD for 2.0 kWh without carrying the cold-temperature capacity reserve. Conversely, if the capacity reserve is added (25% cold reserve per §A13), the cell mass grows from 12.5 kg to 15.6 kg, consuming 18% of the growth allowance.
**Evidence:** Section 01-06: "Mission requirement: a 4-hour EVA sortie at 500 W steady-state draw = 2,000 Wh = 2.0 kWh design capacity." This assumes 100% DoD. §A13: "if operational practice requires a 25% depth-of-discharge reserve (due to cold-temperature capacity derating before warm-up completion at start of sortie), the required cell capacity grows to 2.5 kWh and cell mass grows to 15.6 kg." The cold-temperature effect is acknowledged but not carried in the design-to baseline.
**Required action:** State the DoD assumption explicitly in the battery sizing (e.g., 80% DoD is standard for cycle-life-critical applications). Add the cold-temperature capacity reserve at the design-to level rather than as a footnote sensitivity. The 4-hour sortie baseline should require either (a) the battery warms to operating temperature before the sortie begins (adding to the 45–90 minute warm-up time already cited), or (b) the cell capacity is sized for the cold-start worst case. The power system mass line item should reflect whichever answer is selected.

---

### AE-012 — MAJOR — 01-overview.md — Robonaut 2 upper torso mass "~68 kg estimated, unverified" is inconsistent with published data

**Section:** `study/01-optimal-space-humanoid/01-overview.md`
**Severity:** Major
**Issue:** The heritage table lists R2 mass as "~150 (full config with legs); upper torso ~68 (estimated from published torso-only config, **unverified**)." If the full R2 system with legs is ~150 kg and the legs added ~29 kg (per the 14-DOF, 7-per-leg add-on configuration), the torso-only mass is approximately 120 kg, not 68 kg. The 68 kg estimate appears to reflect only the upper torso and arms, potentially excluding the pelvis, hip structure, and lower spine. The 68 kg figure is used implicitly in Section 01-03 to anchor heritage for hand mass ("Hands: ~1.8 kg each (R2 hand mass heritage)"), but if the R2 arm system (arms + hands only) is within a 68 kg reference that actually covers the full upper body structure, the 1.8 kg/hand figure is taken from an unverified and likely incorrect sub-system attribution. The published NASA R2 fact sheet and Diftler et al. ICRA 2011 paper should provide definitive sub-system masses.
**Evidence:** Published R2 total mass with legs: ~150 kg; leg add-on: ~29 kg per published accounts of the ISS leg upgrade; implied torso+arms+hands mass: ~120 kg. The 68 kg estimate in the table is self-described as "estimated" and "unverified." The 1.8 kg/hand figure in §01-03 cites "R2 hand mass heritage" without a specific value from a primary source.
**Required action:** Verify R2 torso-only mass against the primary source (Diftler 2011 or NASA R2 fact sheet). If the torso+arms+hands mass is ~120 kg (not 68 kg), revise the heritage table entry. Update the "R2 hand mass heritage" anchor in §01-03 with a primary-source citation and verified number. If the R2 hand is heavier than 1.8 kg, the end-effector mass allocation in §01-03/§01-06 must be revised.

---

### AE-013 — MAJOR — 05-environments-hardening.md — Survival heater estimate methodology conflates Mars overnight with 14-day lunar night without correction

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Major
**Issue:** The parametric survival heater estimate derives from "Mars rover WEB draws approximately 100 W-hr overnight in cold conditions," then states that scaling to the humanoid's "smaller electronics volume but longer lunar night" yields 50–150 W continuous. This derivation has a units error and a methodology flaw. The Mars WEB figure of "~100 W-hr overnight" is an energy quantity (Wh), not a power level (W). A Mars night at the equator is approximately 7 hours (half of a ~24.6-hour Martian day); 100 Wh over 7 hours = ~14 W average heater power. A lunar night is 336 hours (14 Earth days). To maintain the same temperature with the same insulation and electronics volume, 14 W × (336/7) = 672 Wh/night, but that is not 672 W — it remains approximately 14 W average if the thermal resistance is unchanged. The section then adds joint heaters (20–50 W) and electronic compartment heaters (50–150 W), for 70–200 W. The disconnect is that the 50–150 W electronics heater range is not derived from the Mars WEB analogy at all — it is a new parametric claim that is not traced to any source. The electronics heater power depends on the thermal resistance between the electronics compartment and the ambient environment, which for a bipedal humanoid body has not been calculated. The wide 3× range (50–150 W) for electronics heaters alone reflects the absence of any thermal model, not a validated parametric range.
**Evidence:** Section text: "A Mars rover WEB draws approximately 100 W-hr overnight in cold conditions; scaled to the humanoid's smaller electronics volume but longer lunar night, the survival heater estimate becomes: Parametric survival heater estimate: 50–150 W continuous draw from FSP during lunar night hibernation." The derivation is not shown. The cross-cutting log (entry 2026-05-03 on thermal) acknowledges this is TRL 2, parametric only.
**Required action:** Show the derivation explicitly, including the assumed thermal resistance of the electronics compartment (in K/W), the assumed electronics dissipation during hibernation (equal to Tier 1 power draw plus comms beacon, approximately 7–10 W), and the resulting temperature differential that the heater must maintain. Flag that the current estimate has no analytical basis beyond analogy. The power budget and the FSP provisional reservation must carry the upper bound (200 W continuous, 300 W with margin) until a first-principles thermal model replaces the analogy.

---

### AE-014 — MINOR — 04-sensing-autonomy.md — LIDAR specific power range is very wide (10–30 W); 3× uncertainty not explained

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Minor
**Issue:** The sensor table lists solid-state LIDAR at 10–30 W (duty cycled) with a note that active power is 20–30 W and duty-cycled average is ~10 W. The 3× range between active (20–30 W) and average (10 W) may be defensible if duty cycle is well characterized, but the table conflates active power and average power in a single cell, creating ambiguity. In the mass-power budget, the LIDAR appears at 20 W (picking the midpoint of the active range without explanation). The duty-cycle assumption driving the average should be stated: what fraction of operations involves outdoor locomotion (requiring LIDAR active) vs. indoor manipulation (LIDAR standby)?
**Required action:** Separate LIDAR active and standby power into distinct table entries. State the assumed duty cycle (e.g., 50% locomotion, 50% manipulation) and carry the resulting weighted average into the budget explicitly.

---

### AE-015 — MINOR — 01-overview.md — Figure 02 "20+ hr runtime" at 2.25 kWh implies ~112 W average, inconsistent with a 70 kg active humanoid

**Section:** `study/01-optimal-space-humanoid/01-overview.md`
**Severity:** Minor
**Issue:** The heritage table records Figure 02 as having a "2.25 kWh battery with 20+ hr runtime" — a figure flagged as "requiring verification." The implied average power draw is 2250 Wh ÷ 20 hr = 112.5 W. A 70 kg humanoid actively walking and manipulating at a BMW factory should draw substantially more than 112 W average; Spot (32 kg) consumes approximately 100 W during active locomotion. Boston Dynamics Atlas's rated total power is unpublished but estimated at several hundred watts during operation. The 112 W average for a 70 kg humanoid performing factory tasks is implausible and contradicts the comparative power figures for similar platforms. If confirmed, it would represent a revolutionary efficiency advance that would require specific callout and scrutiny rather than passing without comment.
**Required action:** Flag this figure more prominently. If the 20+ hr runtime at 2.25 kWh is correct, Figure 02 must be drawing <115 W average — which would be the most power-efficient bipedal humanoid by a factor of ~3× over any comparable platform. Either (a) the runtime or battery capacity figure is wrong, or (b) Figure 02 primarily stands still during its factory deployment (not walking actively). This distinction matters for the study's power budget assumptions.

---

### AE-016 — MINOR — 03-actuation-structures.md — "Labyrinth seals TRL 7–8 in terrestrial contaminated service" — application gap not quantified

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Minor
**Issue:** The dust mitigation section claims labyrinth seals are at "TRL 7–8 in terrestrial contaminated service" (food processing, foundry robots). The electrostatic adhesion mechanism of lunar regolith — charged particles attracted to surfaces and driven into gaps by mechanical cycling — is physically different from the inertial/gravitational particle transport mechanisms that labyrinth seals are designed against in industrial environments. A labyrinth sized for gravitational particle exclusion (geometric blocking of particles above a certain size) will not necessarily perform against electrostatically driven fine particles that can creep along surfaces and into gaps over thousands of cycles. This distinction is not discussed; the TRL 7–8 claim may apply to the labyrinth principle but not to the specific mechanism (electrostatic fine-particle ingestion under vacuum cycling) that is the primary threat.
**Required action:** Qualify the TRL claim: "TRL 7–8 for gravitational/inertial particle environments; TRL 3–4 for electrostatic fine-particle environments similar to lunar regolith." This does not necessarily change the architectural choice (labyrinth seals are still the right first line of defense) but changes the test program requirements.

---

### AE-017 — MINOR — 05-environments-hardening.md — Mars solar panel emissivity degradation rate used as lunar radiator analog without correction for different dust physics

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Minor
**Issue:** Section 4.2 cites Mars lander/rover data (MER Spirit, Phoenix) showing "emissivity degradation rates of 2–5% per month on horizontal solar panels" and uses this to bound lunar radiator degradation. The section itself flags this as "[VERIFY — this figure is for Mars dust under Mars conditions; lunar particle size and settling rate differ]." The Mars dust settlement mechanism is primarily gravitational (Mars has 0.38 g and an atmosphere that keeps small particles airborne and then settles them uniformly); the lunar mechanism is primarily electrostatic adhesion with UV photoemission driving positive charging on sunlit surfaces. These are different physical processes with different size distributions and different adhesion energies. The Mars figure cannot be used as a quantitative proxy without correction; it is at best qualitative confirmation that dust degrades surface properties.
**Required action:** Drop the Mars-to-lunar extrapolation from the quantitative radiator margin statement. The 18–24% emissivity margin (ε BOL 0.85 vs. ε EOL 0.70) may still be appropriate, but it should be justified by electrostatic adhesion estimates or Apollo data on surface property changes, not by Mars dust settling rates.

---

### AE-018 — MINOR — 06-mass-power-budget.md — Signal cabling mass parametric (3.3% of total) has no cited heritage

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Minor
**Issue:** The signal cabling, connectors, and brackets line item (2.5 kg) is stated as "parametric: ~3.3% of total design-to." No heritage is cited for this fraction. For a robot with 38+ actuated joints, each requiring power and encoder signal harness runs from a central electronics bay through the body structure to the joint, plus LIDAR, cameras, IMU, F/T sensors, tactile arrays, and compute interconnects, 2.5 kg is a potentially aggressive lower bound. R2's internal cabling is noted to be extensive (38 processors, 350+ sensors), though its exact harness mass is not published.
**Required action:** Provide a bottom-up estimate or a cited heritage fraction for cabling mass. Robonaut 2 or Valkyrie wiring harness data, if available in the published design papers, should be used. If not available, increase the parametric estimate range to 3–6% of total mass to reflect the high sensor and actuator count and note the uncertainty.

---

### AE-019 — NIT — 02-form-factor-tradespace.md — "Lunokhod counterargument" section states Lunokhod 2 km figure without citing LRO-revised distance

**Section:** `study/01-optimal-space-humanoid/02-form-factor-tradespace.md`
**Severity:** Nit
**Issue:** Section 4 states "Lunokhod 1 and Lunokhod 2 together traversed approximately 48 km." Lunokhod 2's traverse was revised upward from ~37 km to ~39.15 km by LRO high-resolution camera mapping (2010). The section also states "Lunokhod 1 traversed 10.5 km over 11 months" (correct), giving a total of ~49.7 km. "~48 km" is within rounding, but the LRO-revised figure should be cited for precision.
**Required action:** Update to "approximately 50 km (Lunokhod 1: 10.5 km; Lunokhod 2: 39.2 km per LRO photogrammetric revision)."

---

### AE-020 — NIT — 03-actuation-structures.md / 06-mass-power-budget.md — "~340 g" vs. "~342 g" per joint inconsistency between sections

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`; `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Nit
**Issue:** Section 01-03 states "~38 joints at mean ~340 g actuator mass = 13.0 kg." Section 01-06 states "38 joints × ~342 g mean actuator assembly mass." 38 × 342 g = 12,996 g ≈ 13.0 kg. The discrepancy between 340 and 342 is immaterial numerically but indicates the sections were not cross-checked at the final draft stage.
**Required action:** Standardize to one figure in both sections (342 g per joint, since 38 × 342 = 12,996 ≈ 13.0 kg).

---

### AE-021 — NIT — 04-sensing-autonomy.md — Nvidia Jetson AGX Orin: 275 TOPS figure should be qualified (INT8 vs. FP16 precision)

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Nit
**Issue:** Section 2 cites "275 TOPS" for the Jetson AGX Orin. NVIDIA's 275 TOPS figure is for INT8 (8-bit integer) precision. For VLA foundation model inference in FP16 (16-bit floating point) — the precision assumed for the 7B parameter weight discussion — the effective compute is roughly 137 TOPS. For FP32 it is approximately 68 TOPS. The compute capacity for the inference use case described in the section is meaningfully different from the marketing headline figure.
**Required action:** Clarify that 275 TOPS applies to INT8 precision; state the applicable FP16 figure (~137 TOPS) for the VLA inference application described.
