---
title: Reliability and Margins Review Findings
status: findings-complete
owner: reliability-margins-reviewer
last-updated: 2026-05-03
---

# Reliability and Margins Review Findings

## Summary

| Severity | Count |
|----------|-------|
| Blocker  | 2     |
| Major    | 11    |
| Minor    | 8     |
| Nit      | 4     |

---

## Findings

### RM-001 — BLOCKER — 06-mass-power-budget.md — Lunar night power budget goal is circular and the stated closure is misleading

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Blocker
**Number/claim:** "Lower bound closes (148 W vs. 150 W goal); upper bound does NOT close (304 W)" — the table presents a "Mode design goal" of ≤150 W for lunar night survival, then states closure is conditional on the lower bound of the thermal estimate resolving correctly.
**Problem:** The 150 W goal is drawn directly from the lower end of the 70–200 W parametric thermal range in §A10. The power budget table therefore compares a pre-margin survival estimate (114–234 W design-to) to a goal that is itself derived from one end of the same uncertainty range. This is circular: the "goal" carries no independent grounding, and closure is guaranteed at the lower bound by construction rather than by analysis. The table's "closes / does not close" status treats an unvalidated parametric lower bound as a confirmed requirement. Meanwhile, the real risk — FSP demand may reach 300 W per humanoid with margin — is documented only in the prose note, not in the table closure row.
**Required action:** Remove the 150 W figure as a "Mode design goal" in the power budget table. Separate the fixed hibernation electronics draw (IMU 2 W + Tier 1 5 W + comms 2 W = 9 W, independently derivable with no thermal uncertainty) from the thermal reservation (70–200 W, TRL 2, thermally-model-dependent). The table's survival mode status row should read: "Fixed electronics draw closes (9 W, trivially); thermal reservation is open-range pending thermal model (see §A10); conservatively provision 300 W with margin per humanoid for FSP planning until TRL 5 thermal model is available." This is not a budget that can be declared closed for the survival mode.

---

### RM-002 — BLOCKER — 06-mass-power-budget.md — Locomotion actuation 260 W design-to relies on an invented 0.55 multiplier with no heritage validation

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Blocker
**Number/claim:** "The study uses 260 W based on an additional 0.55 factor for normal vs. vigorous gait — a parametric assumption with no direct heritage validation for this platform."
**Problem:** The derivation chain is: Valkyrie 1,800 W × (75/129) × 0.85 efficiency ≈ 890 W → ×0.65 locomotion fraction ≈ 580 W → ×0.55 normal-gait factor = 260 W. The file explicitly states the 0.55 factor "has no direct heritage validation." The power budget then applies 30% margin to this figure, arrives at a locomotion mode total of 616 W, and declares closure against the 800 W cap. If the normal-gait factor is 0.75 rather than 0.55 — a more conservative but equally unsupported assumption — the locomotion actuation line is ~435 W, the design-to total is ~649 W, and the 30%-margin total is ~844 W, which exceeds the 800 W cap. Budget closure is contingent on an invented multiplier.
**Required action:** Add the 0.55 gait factor to the assumption register as a new entry (§A14). State explicitly in the budget table note: "Power budget closure against the 800 W cap is conditional on the gait power validation simulation (referenced in §03, Section 5, item 3) confirming that normal walking draws ≤0.55× vigorous-gait power for this platform at 75 kg in 1/6 g on prepared regolith paths. Until that simulation closes, the locomotion mode power budget closure should be read as conditional." The budget section closure statement ("Yes, with two qualifications") must be revised to add this as a third qualification.

---

### RM-003 — MAJOR — 03-actuation-structures.md §4 — Actuation mass 13.0 kg lacks a concrete per-joint heritage anchor

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Major
**Number/claim:** "Actuation (motors, harmonic drives, QDD wrist/hand motors) | 13.0 | 16.9 | ~38 joints at mean ~340 g actuator assembly mass; HD-Electric actuator mass density from Atlas Electric heritage scales favorably vs. SEA"
**Problem:** The 340 g mean actuator mass per joint is the critical number determining whether the 30 kg structure+actuation constraint closes. Atlas Electric (89 kg, 56 joints) is cited, but Atlas does not publish per-joint actuator breakdown data. Harmonic Drive AG CSD/CSF series is mentioned in the notes but no specific product, bore size, or published mass is cited. "Scales favorably vs. SEA" is a directional assertion without a data point. The 13.0 kg figure — the second-largest allocated mass item — is therefore a bare number.
**Required action:** Provide a specific heritage anchor: either (a) a named Harmonic Drive AG product with published mass at the relevant bore/torque class scaled across the joint distribution, or (b) a published actuator assembly mass from Atlas Electric or a comparable HD-Electric robot. If no published source exists, state explicitly that 340 g/joint is a parametric estimate, add it to the assumption register, and note the budget consequence if mean actuator mass is 450 g (actuation line becomes ~17.1 kg, pushing structure+actuation total to ~32.1 kg design-to, above the 30 kg constraint).

---

### RM-004 — MAJOR — 03-actuation-structures.md §4 — Joints/sealing 4.0 kg (105 g/joint) has no comparable heritage for sealed space joints

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Major
**Number/claim:** "Joints, bearings, sealing hardware | 4.0 | 5.2 | Labyrinth housings, elastomeric seals, cross-roller bearings; 38 joints × ~105 g mean"
**Problem:** 105 g per joint for a novel space-qualified sealed joint assembly (labyrinth geometry + FFKM lip seal + cross-roller bearing + housing) has no published comparable. Cross-roller bearings are catalog items with published mass, but the labyrinth housing is bespoke. No space mechanism with this seal architecture has been built, so there is no heritage data point. The figure's precision (exactly 4.0 kg = 38 × 105.26 g) is implausible for a design at this level of maturity.
**Required action:** Decompose the 105 g/joint estimate: estimate cross-roller bearing mass from catalog data at relevant bore diameters (e.g., IKO CRBH series), add a housing mass estimate with stated wall thickness and material, add the FFKM seal mass (known from catalog data for elastomeric O-rings or lip seals at relevant bore sizes), and sum. Show the calculation. If the total exceeds 105 g for the primary joints (hip, knee, shoulder are larger and heavier than wrist or finger joints), average across the size distribution. Add the resulting range as an assumption register entry.

---

### RM-005 — MAJOR — 03-actuation-structures.md §4 — End-effector mass 4.5 kg has an internal foot-mass inconsistency

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Major
**Number/claim:** "End-effectors | 4.5 | 5.9 | Hands: ~1.8 kg each (R2 hand heritage); feet: ~0.45 kg each including handrail jaw"
**Problem:** Section 2 of the same file states "approximately 0.3–0.5 kg per foot" for the handrail-capture jaw add-on. If 0.3–0.5 kg is the jaw add-on alone, the foot total (foot structure + jaw) must be larger than 0.45 kg, making the end-effector subtotal (3.6 + 0.9 = 4.5 kg) underestimated. If 0.45 kg is the complete foot end-effector including the jaw, then the jaw is most of the foot mass and the foot structure itself has near-zero mass — implausible. The two numbers coexist without reconciliation. Additionally, the R2 hand heritage for 1.8 kg is stated without citing a specific R2 mass measurement — R2 factsheets publish general specifications but not hand-level mass breakdowns.
**Required action:** Clarify whether 0.45 kg is the jaw add-on or the complete foot. Provide a cited R2 hand mass figure or state the derivation (e.g., "R2 hand system estimated at ~2.2 kg per side from the 42-DOF torso at ~68 kg with a ~6% hand fraction"). If R2 hand mass is not published, flag it as an unverified parametric estimate.

---

### RM-006 — MAJOR — 06-mass-power-budget.md — Signal cabling 2.5 kg (3.3%) uses the low end of a stated 3–5% range without justification

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Major
**Number/claim:** "Signal cabling, connectors, and brackets | 2.5 | Parametric: ~3.3% of total design-to pre-margin | Standard parametric estimate for complex robotic system at 3–5% of mass."
**Problem:** The "standard parametric estimate" range is 3–5%; the budget uses 3.3% (the low end) without explanation. The upper end of the range (5% of 75 kg = 3.75 kg) is 50% higher than the budgeted figure. Additionally, "standard parametric estimate for complex robotic system" is asserted without a citation. The separate "main power harness" line at 1.9 kg (2.5%) partially overlaps in scope — the signal cabling notes include "power connector assemblies" which may also appear in the power harness line.
**Required action:** (a) Justify the choice of 3.3% over the mid or upper range (e.g., the power harness is separately accounted, so the signal-only harness is lower fraction), or place the design-to at the midpoint (4%, = 3.0 kg) and document the budget consequence. (b) Cite a heritage source for the 3–5% parametric range. (c) Clarify the boundary with the main power harness line to confirm no double-counting or gaps.

---

### RM-007 — MAJOR — 06-mass-power-budget.md — Thermal radiator sizing arithmetic appears inconsistent with the Stefan-Boltzmann equation

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Major
**Number/claim:** "Radiator sized to reject ~300 W at end-of-mission emissivity (ε = 0.70 EOL per §05); at 50°C panel temperature, required radiator area ~0.3 m² at ~10 kg/m² = ~3.0 kg."
**Problem:** Applying the Stefan-Boltzmann equation for a radiator at 50°C (323 K) against a lunar daytime environment at ~40°C (313 K) with ε = 0.70: net heat flux = 0.70 × 5.67×10⁻⁸ × (323⁴ − 313⁴) ≈ 0.70 × 5.67×10⁻⁸ × 1.27×10⁹ ≈ 50 W/m². To reject 300 W: area = 300 / 50 = 6.0 m², not 0.3 m². The 0.3 m² claim would require a net flux of 1,000 W/m², which is inconsistent with the stated temperature conditions. The derivation is not shown, so it is unclear what environmental temperature assumption was used. If 0 K was assumed (deep space), the net flux at 323 K would be ~0.70 × 5.67×10⁻⁸ × 323⁴ ≈ 681 W/m², giving area = 300 / 681 ≈ 0.44 m² — closer to 0.3 m² but still inconsistent, and using 0 K for the lunar daytime environment is non-conservative. The 10 kg/m² areal density is also unsourced.
**Required action:** Show the complete Stefan-Boltzmann calculation: state the assumed lunar environment radiation temperature T_lunar (for daytime vs. nighttime case), compute net radiative flux in W/m², compute required area, and multiply by the stated areal density. Cite a source for 10 kg/m² radiator areal density (e.g., a space radiator reference from a published heat rejection system). If the 0.3 m² figure is wrong, revise the thermal management mass line and assess impact on the 75 kg design-to closure.

---

### RM-008 — MAJOR — 06-mass-power-budget.md — Power harness 1.9 kg and signal cabling 2.5 kg together lack heritage; boundary between them is potentially overlapping

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Major
**Number/claim:** Power harness: "Parametric estimate: 2.5% of total system mass for the main power harness = 75 kg × 0.025 = 1.9 kg design-to." Signal cabling notes: "Covers all signal harness (joint encoders, sensors, compute buses), power connector assemblies, cable routing brackets."
**Problem:** Both lines are parametric fractions without cited heritage. "Power connector assemblies" appears in the signal cabling notes but belongs conceptually to the power harness scope. If power connectors are in both lines, the combined 4.4 kg may include double-counted items. Neither the 2.5% power harness fraction nor the 3.3% signal harness fraction is traceable to a published space mechanism or robotic system harness mass breakdown.
**Required action:** Define explicitly what each line covers and confirm non-overlap. Provide at least one heritage data point for the combined harness fraction (~5.8% of system mass): a published data point from Valkyrie, R2, a satellite harness study, or a SAWE paper on robotic system cabling mass fractions. If no published source exists, flag both lines as parametric estimates and add a combined harness uncertainty statement to §A5 or a new assumption entry.

---

### RM-009 — MAJOR — 05-environments-hardening.md — Radiator emissivity margin description is mathematically inverted

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Major
**Number/claim:** "Size radiators to maintain required heat rejection at ε = 0.70 (end-of-mission degraded), providing 18–24% emissivity margin above the 0.85 beginning-of-life value."
**Problem:** 0.70 is below 0.85, not above it. The phrase "emissivity margin above the 0.85 BOL value" is the inverse of what is being described. What is being described is: size to work at ε = 0.70, which accommodates a degradation of (0.85 − 0.70) / 0.85 = 17.6% from BOL. Calling this "margin above" the BOL value is incorrect. Furthermore, the stated range "18–24%" cannot be derived from the single EOL value (0.70) alone — only one number (17.6%) can be computed from the stated BOL/EOL pair.
**Required action:** Replace with: "Radiators are sized to maintain required heat rejection at end-of-mission emissivity ε = 0.70, which accommodates an ~18% emissivity degradation from the ε = 0.85 BOL coating specification. The degradation basis is [cite §05's Mars solar panel analogy]. Remove the claim of "18–24% margin above the 0.85 BOL value" — this characterization is mathematically inverted and misleading.

---

### RM-010 — MAJOR — 05-environments-hardening.md — Silicon TID conversion from LND measurement is a major unstated assumption driving the entire radiation strategy

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Major
**Number/claim:** "At the lunar surface, the GCR-dominated spectrum delivers approximately 20–30 krad (silicon) per year at the surface without shielding, based on modeling studies \cite{schwadron2014radiation} [VERIFY]"
**Problem:** The Chang'e-4 LND measurement (60 µSv/hr = 0.53 Gy/yr) is biologically-weighted dose equivalent, not silicon TID. The conversion factor from dose-equivalent to silicon krad is spectrum-dependent and can range from approximately 10:1 to 50:1 depending on the GCR particle composition and energy spectrum at 1 AU. The [VERIFY] flag acknowledges this, but the 20–30 krad(Si)/yr figure is used in §A12 as the working value, driving the 7-year TID budget (140–210 krad), which in turn justifies the hybrid radiation strategy and the 3-year Tier 2 ORU replacement cycle. If the conversion is 2× higher (40–60 krad/yr), the 7-year budget becomes 280–420 krad, the Tier 2 lifetime drops to ~18 months (not 3 years), and the ORU replacement strategy and spares budget are materially different. This is a Major finding because the uncertainty is not bounded in the assumption register.
**Required action:** Add an explicit uncertainty bound to §A12 in the assumption register: "If the silicon TID conversion factor is 2× the nominal estimate, annual unshielded dose becomes 40–60 krad(Si)/yr and the 7-year unshielded budget becomes 280–420 krad. Under these conditions, Tier 2 shielded lifetime may shorten to 18 months or less, requiring a revised ORU replacement cadence and spares budget." The [VERIFY] flag should also carry a named responsible agent (space-environments) and a gate date (before PDR).

---

### RM-011 — MAJOR — 04-sensing-autonomy.md — SEU/latchup rate "1–10 events per day" lacks derivation; shielding reduction "2–3 orders of magnitude" is physically implausible for GCR HZE ions

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Major
**Number/claim:** "Single-event latchup in commercial CMOS at the lunar far side is expected at a rate of approximately 1-10 events per day without shielding, based on Perseverance's radiation environment data scaled to humanoid operating temperature." And: "Spot-shielding (5-10 mm aluminum, ~0.5-1.0 kg mass penalty per compute board) reduces latchup rate by 2-3 orders of magnitude."
**Problem:** (a) "Scaled to humanoid operating temperature" is not how SEL rate is derived: SEL rate depends on particle LET spectrum and device LET threshold, not on device temperature (temperature affects the holding current threshold but not the primary event rate). The derivation methodology is physically incorrect. (b) 2–3 orders of magnitude SEL reduction from 5–10 mm aluminum is achievable for SPE proton events (low energy, stopped by aluminum), but GCR heavy ions dominate SEL in CMOS and have energies >100 MeV/nucleon where aluminum shielding provides minimal attenuation — the shielding improvement for GCR SEL is far less than 100×. Both claims are unsupported and the shielding claim is likely to be overly optimistic by 1–2 orders of magnitude for the dominant SEL driver.
**Required action:** (a) Replace "scaled to humanoid operating temperature" with the correct physics: state a LET threshold for the Jetson class CMOS, reference a GCR heavy-ion fluence model at lunar surface (e.g., CREME96 or ISO 15390), and compute an approximate SEL rate per day. (b) Revise the shielding reduction claim to distinguish SPE proton events (where aluminum is effective, 2–3 orders of magnitude achievable) from GCR HZE ions (where aluminum shielding provides <10× reduction at the relevant energies). State which regime dominates SEL for this device class.

---

### RM-012 — MAJOR — 06-mass-power-budget.md — Subsystem NTE values in §03 and system-level NTE in §06 create an unacknowledged double-margin

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Major
**Number/claim:** "The 30% margin per NASA-STD-5001 applies at the total system level; subsystem allocations carry their own parametric uncertainty within the system margin." Meanwhile §03, Section 4 presents: "Structure + actuation total | 30.0 | 39.0" where 39.0 is design-to × 1.30.
**Problem:** §03 computes subsystem NTE values by applying 30% to each subsystem design-to. §06 then applies 30% again at the total system level (75 × 1.30 = 97.5 kg). These two applications of 30% margin are not reconciled. If the destinations-trajectories agent uses the §03 structure+actuation NTE (39.0 kg) instead of the §06 system NTE (97.5 kg) as the planning basis, the structure+actuation block carries an implicit 1.30 × 1.30 = 1.69 margin factor. The budget section's statement that margin "applies at the total system level" is inconsistent with the §03 practice of computing subsystem NTEs.
**Required action:** Add a clarifying statement in §06: "Subsystem NTE values in §03 (e.g., 39.0 kg for structure+actuation) are computed as design-to × 1.30 for internal subsystem tracking only. They are not additive inputs to the system NTE. The system NTE of 97.5 kg is computed once from the 75.0 kg system design-to per NASA-STD-5001. Downstream users (destinations-trajectories, far-side-base-architect) must use 75.0 kg design-to / 97.5 kg NTE as the manifest figures, not subsystem NTEs." Also flag this explicitly in the cross-coupling log for the destinations-trajectories agent.

---

### RM-013 — MINOR — 02-form-factor-tradespace.md — Weighted totals in evaluation matrix table disagree with the computed totals stated below

**Section:** `study/01-optimal-space-humanoid/02-form-factor-tradespace.md`
**Severity:** Minor
**Number/claim:** Table "Weighted total" row: "**3.60** | **3.35** | **2.95** | **2.55** | **2.80**" vs. immediately following "Raw weighted totals: A = 3.65, B = 3.55, C = 3.25, D = 2.90, E = 2.85"
**Problem:** The table row and the corrected totals below disagree for all five candidates. The "Raw weighted totals" block exists only to correct the table — the two sets of numbers coexist without reconciliation. Any reader who stops at the summary table sees incorrect scores. The margin between A (bipedal) and B (centaur) narrows from 0.30 (table: 3.60 vs 3.35) to 0.10 (computed: 3.65 vs 3.55), which is a material difference in the strength of the position.
**Required action:** Correct the "Weighted total" row in the evaluation matrix table to match the computed totals: A = 3.65, B = 3.55, C = 3.25, D = 2.90, E = 2.85. Delete the redundant "Raw weighted totals" block. Acknowledge in the surrounding text that the margin between bipedal and centaur is narrow (0.10 points) — the section's prose already does this but should reference the correct numbers.

---

### RM-014 — MINOR — 06-mass-power-budget.md — BMS and battery housing 20% overhead lacks a specific heritage citation

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Minor
**Number/claim:** "Heritage from space battery programs: approximately 18–22% overhead on cell mass. Using 20%: 2.5 kg."
**Problem:** "Space battery programs" is not a citable heritage source. The ISS battery replacement project is cited in §A13 for cell energy density (160 Wh/kg) but the 18–22% overhead fraction is not attributed to that or any other specific program. This matters because the BMS+housing line (2.5 kg) is significant within the power system's 16.9 kg total.
**Required action:** Cite the specific space battery program (ideally the ISS ORU battery replacement, or a published conference paper from the Space Power Workshop or IECEC) that documents the cell mass vs. total assembly mass ratio. If unavailable, decompose the 2.5 kg: BMS electronics (~X g based on published radiation-tolerant BMS IC count), cell interconnects (~Y g for Z cells), structural housing with MLI (~W g based on a stated wall thickness and dimensions). This decomposition makes the number reviewable without a heritage cite.

---

### RM-015 — MINOR — 05-environments-hardening.md — 10% optical degradation figure is extrapolated from Mars solar panels to lunar camera lenses without a correction factor

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Minor
**Number/claim:** "Combined, these can maintain optical performance within 10% of beginning-of-life levels for multi-year service life — parametric assumption based on Mars solar panel degradation data extrapolated to the lunar dust environment [VERIFY with dedicated test data]."
**Problem:** Mars solar panels and lunar camera lenses differ in substrate material, dust particle properties, gravity, and the measure of degradation (solar cell output vs. optical transmission). The analogy is weak in multiple directions. The 10% figure is specific enough to be used for ConOps planning (cleaning interval, replacement schedule), but it has no lunar-specific basis. Lunar dust is more angular and electrostatically adherent than Mars dust; the lunar degradation rate could be substantially higher.
**Required action:** Replace the specific 10% figure with a stated range (e.g., 10–30%) and note the direction of the conservatism: "Lunar dust is expected to adhere more strongly than Mars dust due to angular particle morphology and electrostatic charging, suggesting the lunar degradation rate may exceed the Mars-based estimate. The 10% figure should be treated as an optimistic lower bound. Dedicated lunar simulant optical degradation testing is required before the sensor cleaning interval can be specified in ConOps."

---

### RM-016 — MINOR — 04-sensing-autonomy.md — Wrist camera TRL listed as "8" in sensor table but no wrist camera has been space-qualified in a humanoid

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Minor
**Number/claim:** "Wrist cameras (RGB mono) | 2 | 0.15 | 3-5 | **8** | Vacuum/thermal qual: TRL 5-6"
**Problem:** TRL 8 means "system complete and flight qualified." The "Space TRL gap" column for this row correctly states "Vacuum/thermal qual: TRL 5-6," which implies the technology is not at TRL 8 for the space application. The TRL 8 in the terrestrial column and the TRL 5-6 in the space gap column are internally inconsistent — the relevant TRL for this program is the space TRL (5-6), and citing TRL 8 terrestrial without qualification overstates readiness. Additionally, the 0.15 kg mass estimate (75 g per wrist camera) is stated without citing a specific product.
**Required action:** Revise the terrestrial TRL for wrist cameras from 8 to 6–7 (commercial machine vision cameras are TRL 7–8 as a product class, but the space-humanoid wrist camera application is not yet TRL 8). Cite a specific product to anchor the 75 g per unit mass estimate (e.g., a named FLIR or Basler camera in the relevant mass class).

---

### RM-017 — MINOR — 03-actuation-structures.md — Boot cover 500-hour replacement interval is not in the assumption register

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Minor
**Number/claim:** "Replacement interval: parametrically assumed at 500 surface-hours, to be validated by accelerated abrasion testing."
**Problem:** The 500-hour boot cover replacement interval is acknowledged as parametric with no heritage, but it does not appear in the margins-and-assumptions register (§A1–§A13). This assumption has direct consequences for the consumables manifest and the far-side-base-architect's logistics model. The §06 consumables line carries only "boot covers (2 pairs, 0.2 kg each): 0.45 kg" for initial deployment — it does not carry the ongoing resupply mass implied by a 500-hour replacement cycle on a humanoid logging hundreds of hours per lunar day.
**Required action:** Add §A14 (or next available) to the margins-and-assumptions register for the boot cover replacement interval. Note the consumables manifest consequence: at 500-hour intervals on a humanoid logging ~300 surface-hours per lunar month, annual resupply is approximately 7 pairs of boot covers (~1.4 kg/year/humanoid), which is not reflected in the §06 consumables line.

---

### RM-018 — MINOR — 06-mass-power-budget.md — 100% depth-of-discharge assumption is embedded in a parenthetical, not stated as a design assumption

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Minor
**Number/claim:** "Mission requirement: a 4-hour EVA sortie at 500 W steady-state draw = 2,000 Wh = 2.0 kWh design capacity." Budget stress note: "if deeper depth-of-discharge margins (80% vs. 100% assumed here)..."
**Problem:** The 100% usable depth-of-discharge is identified only in the parenthetical stress note — it is not stated as an explicit design assumption in the main derivation. For space-qualified Li-ion cells in cold environments (the humanoid battery will be at sub-zero temperature at the start of a sortie after overnight hibernation), usable DoD is typically limited to 70–80% by the cell manufacturer to preserve cycle life. Assuming 100% DoD means the battery provides full rated capacity at the first cycle — which may be realistic for peak capacity but not for cold-start conditions or end-of-life. If the operational DoD is 80%, the battery must be 2.5 kWh (not 2.0 kWh) for the same 4-hour sortie, adding ~3.1 kg to the cell mass.
**Required action:** Promote the 100% DoD assumption to explicit status in the main battery sizing derivation, not just the parenthetical. Add a note: "100% usable DoD is assumed for the battery sizing. This requires confirmation against the selected cell's cold-temperature DoD guidance. If DoD is limited to 80%, required cell capacity increases to 2.5 kWh and cell mass increases to ~15.6 kg at 160 Wh/kg, consuming ~19% of the 16.8 kg growth allowance." This point is noted in §A13 but should be present at the point of use in the derivation as well.

---

### RM-019 — MINOR — 06-mass-power-budget.md — Electronics vault mass midpoint selection (1.0 kg of 0.5–1.5 kg range) is unexplained

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Minor
**Number/claim:** "Electronics vault + torso structural radiation shielding | 1.0 | §05, Section 3, Option 3 | §05 estimates 0.5–1.5 kg for this element. Using midpoint."
**Problem:** The 0.5–1.5 kg range represents a 3× uncertainty span. Using the midpoint (1.0 kg) is defensible at concept phase, but the reason for the midpoint rather than a conservatively-placed value (e.g., 1.2 kg) is not stated. This is not a critical finding because the magnitude is small (0.2 kg difference vs. 16.8 kg growth allowance), but the practice of using range midpoints without explanation is a systematic budget discipline issue visible across multiple line items.
**Required action:** Add one sentence: "Midpoint selected because the shielding depth requirement (2–4 mm Al, §05) is itself bounded, limiting the upside risk to ~1.5 kg. Budget consequence of upper bound vs. midpoint: +0.5 kg, absorbed within growth allowance."

---

### RM-020 — NIT — 01-overview.md — Atlas 85–90% efficiency figure used in §03 but cited only there, not at point of first appearance in §01 heritage table

**Section:** `study/01-optimal-space-humanoid/01-overview.md`
**Severity:** Nit
**Number/claim:** Heritage table, Atlas Electric row, "Key lessons" column: "Efficiency figure of 85–90% electrical-to-mechanical is best-in-class but total rated draw is unpublished."
**Problem:** The 85–90% efficiency figure is the primary heritage anchor for the HD-Electric actuation selection in §03. It first appears in the §01 heritage table without a citation. The citation (\cite{bostondynamics2024atlas}) appears in §03 when the number is used for design decisions. A reviewer tracing the heritage chain must search forward from §01 to find the source of a number that first appears in §01.
**Required action:** Add the citation \cite{bostondynamics2024atlas} inline in the Atlas row of the §01 heritage table so the efficiency figure is attributed at its first use.

---

### RM-021 — NIT — 06-mass-power-budget.md — ISS battery citation flagged as unconfirmed; this is the anchor for the largest mass line item

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Nit
**Number/claim:** "\cite{nasa_iss_battery} — NASA ISS battery replacement project (2017–2019); lithium-ion ~160 Wh/kg space-qualified heritage. [Cite to be confirmed against primary source before PDR]"
**Problem:** The 160 Wh/kg design-to energy density — the anchor for the largest single mass line item (12.5 kg battery cells) — rests on an unconfirmed citation. This should be a flag for immediate confirmation, not a PDR-deferred item.
**Required action:** Confirm the citation before the next stage. The ISS Lithium-Ion Battery Orbital Replacement Unit program (GS Yuasa / Aerospace Corporation) has published conference papers at IECEC and the Space Power Workshop that document cell-level energy density. Identify the specific reference, confirm the 160 Wh/kg figure, and update \cite{nasa_iss_battery} to the confirmed source.

---

### RM-022 — NIT — 05-environments-hardening.md — Mars solar panel dust degradation reference direction is not stated relative to lunar case

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Nit
**Number/claim:** "Mars lander and rover data (MER Spirit, Phoenix) document emissivity degradation rates of 2–5% per month... [VERIFY — this figure is for Mars dust under Mars conditions; lunar particle size and settling rate differ]."
**Problem:** The [VERIFY] flag correctly identifies the Mars-to-lunar extrapolation problem, but does not state the expected direction: is the lunar case expected to be worse or better than Mars? A reviewer or the thermal management agent cannot assess conservatism without knowing the expected sign of the correction.
**Required action:** Add one sentence: "Lunar dust particles are more angular and electrostatically adherent than Mars aerosol dust, and lack the beneficially large gravitational settling force that eventually causes some Mars dust to fall away from panels. The lunar emissivity degradation rate is expected to be equal to or worse than the Mars reference; the 2–5%/month figure should be treated as a conservative lower bound for the lunar case."

---

### RM-023 — NIT — 03-actuation-structures.md — 45–55% structure+actuation fraction for terrestrial humanoids is asserted without a citation

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Nit
**Number/claim:** "The parametric assumption used here is that structure + actuation constitutes 45–55% of total system mass in terrestrial humanoids"
**Problem:** This range is cited without a reference. No commercial or research humanoid publishes subsystem mass breakdowns, so this figure is an estimate. The ≤40% space humanoid target is characterized as "aggressive relative to terrestrial heritage" based on this estimate, but without a source the "aggressive" characterization has no anchor.
**Required action:** Either cite a source (robotics systems engineering text, SAWE paper, or a derived estimate from Valkyrie/R2 mass fractions using the structure and actuation information available in published papers) or flag the 45–55% range explicitly as an unverified parametric estimate in the assumption register.

---

## Key Patterns

1. **Invented multipliers used to close the power budget.** The 0.55 gait-normalization factor (RM-002) and the prior 0.65 locomotion-fraction allocation both appear in the single derivation chain that closes the locomotion mode budget against the 800 W cap. Neither factor has a cited heritage basis. The budget should not be declared closed until a task-level actuation simulation validates these multipliers.

2. **Subsystem NTE × system NTE creates an unacknowledged double-margin.** §03 computes per-subsystem NTEs at design-to × 1.30; §06 then applies 30% again at system level. The relationship is never reconciled (RM-012), creating risk that downstream agents use subsystem NTE values incorrectly.

3. **Parametric line items with suspicious precision.** Several parametric estimates close to round numbers that sum to exactly 58.2 kg allocated and exactly 16.8 kg growth allowance (signal cabling = 2.5 kg, joints/sealing = 4.0 kg, consumables = 0.9 kg). The level of precision in parametric concept-phase estimates suggests some values may have been adjusted to make the budget close at 75.0 kg rather than being independently derived.

4. **[VERIFY] flags present but not uniformly acted on.** §05 and §06 contain [VERIFY] annotations, but the silicon TID conversion finding (RM-010) — which drives the radiation strategy — is unresolved and the uncertainty range is not bounded in the assumption register. Each [VERIFY] should carry a named owner and a gate date.

5. **Wide thermal range (70–200 W) dominates power budget risk.** The 3× uncertainty span in the lunar night thermal reservation (§A10) propagates into the single confirmed budget non-closure (RM-001). Until the thermal model reaches TRL 5, the power budget's conditional closure language should be foregrounded in the section closure statement, not deferred to a prose note.
