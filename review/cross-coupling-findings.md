---
title: Cross-Coupling Consistency Review Findings
status: findings-complete
owner: cross-coupling-reviewer
last-updated: 2026-05-03
---

# Cross-Coupling Consistency Review Findings

Review of 13 locked decisions against six section files. Sections reviewed:
- `01-overview.md` (heritage table; no numeric design commitments)
- `02-form-factor-tradespace.md` (form factor position; mass/power baseline set)
- `03-actuation-structures.md` (actuation, DOF, structure mass, dust strategy)
- `04-sensing-autonomy.md` (sensor suite, compute architecture, autonomy TRL)
- `05-environments-hardening.md` (thermal, radiation, dust system-level)
- `06-mass-power-budget.md` (integration and closure)

Cross-coupling log reviewed: 13 entries dated 2026-05-03.

---

## Summary

| Severity | Count |
|----------|-------|
| Blocker  | 1     |
| Major    | 4     |
| Minor    | 5     |
| Nit      | 3     |

---

## Reconciliation Results

| Parameter | Source section / log value | Downstream section | Downstream value | Match? |
|-----------|---------------------------|-------------------|-----------------|--------|
| Mass design-to | 75 kg (cross-coupling log; §02 Section 6) | `06-mass-power-budget.md` table total | 75.0 kg | YES |
| Mass design-to | 75 kg | `01-overview.md` open question 1 | "≤100 kg … preliminary working assumption" | NO — pre-lock placeholder not updated; see CC-006 |
| Mass NTE | 97.5 kg (cross-coupling log) | `02-form-factor-tradespace.md` Section 6 | 97.5 kg | YES |
| Mass NTE | 97.5 kg | `06-mass-power-budget.md` NTE row | 97.5 kg | YES |
| Structure + actuation design-to | 30.0 kg (cross-coupling log) | `03-actuation-structures.md` Section 4 table total | 30.0 kg | YES |
| Structure + actuation design-to | 30.0 kg | `06-mass-power-budget.md` (8.5 + 13.0 + 4.0 + 4.5 = 30.0) | 30.0 kg (sum) | YES |
| Structure + actuation NTE | 39.0 kg (cross-coupling log) | `03-actuation-structures.md` Section 4 table | 39.0 kg | YES |
| Structure + actuation NTE | 39.0 kg | `06-mass-power-budget.md` — no subsystem NTE subtotal row | Not stated | MINOR — see CC-008 |
| Sensor suite mass | ~2.1 kg (cross-coupling log / §04 summary table) | `06-mass-power-budget.md` sensors row | 2.1 kg | YES |
| Sensor suite power peak | 37–75 W peak (cross-coupling log) | `06-mass-power-budget.md` sensor rows sum to ~44 W peak | ~44 W stated; 75 W peak not acknowledged | MAJOR — see CC-003 |
| Compute mass | ~1.8 kg (cross-coupling log / §04 table) | `06-mass-power-budget.md` compute row | 1.8 kg | YES |
| Compute power range | 22–75 W peak (cross-coupling log) | `06-mass-power-budget.md` compute rows (Tier 1: 8 W + Tier 2: 50 W = 58 W) | 58 W point value; range not stated | MINOR — see CC-009 |
| DOF nominal | 38 (cross-coupling log) | `03-actuation-structures.md` Section 2 table design-to | 38 nominal | YES |
| DOF nominal | 38 (cross-coupling log) | `06-mass-power-budget.md` actuation row note | "38 joints × ~342 g mean" | YES |
| Actuation type | HD-Electric primary (cross-coupling log) | `06-mass-power-budget.md` actuation row | "NdFeB motors + harmonic drives + QDD wrists" — HD-Electric confirmed | YES |
| Actuation type | HD-Electric primary | `04-sensing-autonomy.md` power estimates | Actuation type not referenced; power figures are internally consistent with HD-Electric | MINOR — see CC-009 note |
| Battery: 2.0 kWh / 160 Wh/kg / 12.5 kg cells | Cross-coupling log (§A13) | `06-mass-power-budget.md` battery derivation | 2.0 kWh, 160 Wh/kg, 12.5 kg cells | YES |
| Lunar night power | 70–200 W total = 50–150 W electronics + 20–50 W joints (cross-coupling log / §05 Section 2) | `06-mass-power-budget.md` thermal rows | 85–175 W survival heaters + 20–50 W joint heaters = 105–225 W pre-margin | NO — BLOCKER; see CC-001 |
| Autonomy TRL curve | TRL 6/2029, TRL 7+/2035, TRL 8/2038–2040 | `04-sensing-autonomy.md` top-of-section preamble | Correctly restated verbatim | YES |
| Autonomy TRL curve — layer compatibility | TRL 6 by 2029 requires current space TRLs to advance | `04-sensing-autonomy.md` autonomy stack diagram | Reactive space TRL 3–4; Deliberative 2–3; Supervisory 2–3 — no forward projection to 2029 gate | MAJOR — see CC-004 |
| Tradespace score bipedal | 3.65 (arithmetic in §02; cross-coupling log) | `02-form-factor-tradespace.md` matrix table "Weighted total" row | 3.60 | NO — MAJOR; see CC-002 |
| Candidate A mass range | 75 kg design-to (cross-coupling log) | `02-form-factor-tradespace.md` Candidate A description | "60–130 kg" | MAJOR — see CC-005 |
| Dust strategy descriptor | "Dual-stage labyrinth + single FFKM lip seal" | `05-environments-hardening.md` Section 4.4 reference | "joint labyrinth + FFKM lip seal" — "dual-stage" omitted | NIT — see CC-010 |
| N₂ purge canister mass | 0.2–0.5 kg (cross-coupling log) | `06-mass-power-budget.md` consumables row | 0.3 kg (within range) | YES |
| 7-year TID budget unshielded | 140–210 krad (cross-coupling log) | `05-environments-hardening.md` Section 3 | 140–210 krad | YES |
| TID figure in §05 requirements table | — | `05-environments-hardening.md` Section 1 requirements table | "120–140 krad with shielding mitigation needed" — inconsistent with unshielded budget | NIT — see CC-012 |

---

## Findings

### CC-001 — BLOCKER — `05-environments-hardening.md` → `06-mass-power-budget.md` — Lunar night survival heater power range does not match source

**Sections involved:** `05-environments-hardening.md` Section 2 (source) → `06-mass-power-budget.md` Section 2 power table (downstream)
**Severity:** Blocker
**Parameter:** Electronics/battery survival heater power during lunar night hibernation

**Source value (§05 Section 2 and cross-coupling log):**
Electronics/battery survival heaters: **50–150 W**; joint heaters: **20–50 W**; total: **70–200 W**

**Downstream value (§06 power table, lunar night survival column):**
Survival heaters (electronics + battery): **85–175 W**; joint heaters: **20–50 W**; row total pre-margin: **114–234 W**; with 30% margin: **148–304 W**

**The problem:** The survival heater range in §06 (85–175 W) does not match the source value in §05 and the cross-coupling log (50–150 W). The lower bound has shifted from 50 W to 85 W (+70%) and the upper bound from 150 W to 175 W (+17%). No explanation for this change appears in §06.

This mismatch is a Blocker because the budget closure assessment depends critically on which numbers are used. If the §05 values (50–150 W heaters + 20–50 W joints) are correct, the pre-margin hibernation total is approximately 79–209 W (adding ~9 W of non-thermal always-on loads), giving a with-margin total of approximately 103–272 W. The lower-bound closure is then 103 W vs. 150 W — comfortably inside the goal, not "barely closes at 148 W" as §06 states. Conversely, if §06's 85–175 W heater range is correct, the §05 and cross-coupling log entries are wrong and must be updated. The closure status — and the severity of the upper-bound non-closure — differs materially between the two number sets.

**Required action:** One of the following three corrections is required, and only one:
1. If §05's 50–150 W is authoritative: correct §06 survival heater row to 50–150 W; revise the with-margin total to ~103–272 W; update the closure narrative ("lower bound comfortably closes at 103 W vs. 150 W goal; upper bound does not close at 272 W").
2. If §06's 85–175 W is authoritative: update §05 Section 2 electronic heater estimate to 85–175 W and update the cross-coupling log §A10 entry to match.
3. If the revision represents a design change: log it in the cross-coupling log as a §A10 update, update §05, and note the basis for the increase.

---

### CC-002 — MAJOR — `02-form-factor-tradespace.md` — Evaluation matrix table scores do not match the step-by-step arithmetic in the same section

**Sections involved:** `02-form-factor-tradespace.md` Section 3
**Severity:** Major
**Parameter:** Weighted tradespace scores for all five candidates

**Table values (matrix "Weighted total" row):** A = 3.60, B = 3.35, C = 2.95, D = 2.55, E = 2.80

**Calculated values (step-by-step arithmetic in the text immediately below the table):**
- A: 1.25 + 0.60 + 0.30 + 0.45 + 0.40 + 0.40 + 0.25 = **3.65**
- B: 1.00 + 0.80 + 0.60 + 0.45 + 0.20 + 0.30 + 0.20 = **3.55**
- C: 0.50 + 1.00 + 0.30 + 0.60 + 0.40 + 0.30 + 0.15 = **3.25**
- D: 0.75 + 0.20 + 0.45 + 0.60 + 0.30 + 0.40 + 0.20 = **2.90**
- E: 1.00 + 0.60 + 0.30 + 0.30 + 0.30 + 0.20 + 0.15 = **2.85**

**Cross-coupling log:** Locked form factor entry states "bipedal form scores highest (3.65/5.00)" and "Centaur is the close second (3.55)" — matching the step-by-step arithmetic, not the table.

**The problem:** The table is wrong. The step-by-step arithmetic and cross-coupling log are internally consistent and should be treated as authoritative. The margin between A (bipedal) and B (centaur) is 0.10 per the correct arithmetic (3.65 − 3.55), but appears to be 0.25 in the erroneous table (3.60 − 3.35). The study's narrative ("The gap is narrow, which is the honest result") is consistent with the arithmetic-calculated 0.10 margin. A reader using the table values would see a 0.25 margin and might characterize the result as more decisive than it is.

**Required action:** Correct the "Weighted total" row in the evaluation matrix table to: A = 3.65, B = 3.55, C = 3.25, D = 2.90, E = 2.85. The step-by-step arithmetic and narrative text require no changes.

---

### CC-003 — MAJOR — `04-sensing-autonomy.md` → `06-mass-power-budget.md` — Sensor peak power (75 W) not acknowledged in integration budget

**Sections involved:** `04-sensing-autonomy.md` Section 1 summary table (source) → `06-mass-power-budget.md` Section 2 power table (downstream)
**Severity:** Major
**Parameter:** Sensor suite peak power draw

**Source value (§04 sensor suite summary table and cross-coupling log):** Total sensor suite: **37–75 W peak** (LIDAR at 20–30 W active + cameras/depth 15–25 W + wrist cameras 3–5 W + IMU 3–5 W + F/T 4–6 W + tactile 2–4 W = 37–75 W)

**Downstream value (§06 power table, sensor rows):**
- LIDAR (active during locomotion): 20 W
- Cameras and F/T (full during manipulation): 25 W
- IMU keep-alive: 4 W
- Peak sensor contribution: ~49 W (full loco+manip mode) — 26 W below the §04-stated 75 W peak

**The problem:** §06 presents point values for sensor power that are below the upper bound of the §04 range. The LIDAR is budgeted at 20 W in §06 but §04 specifies 20–30 W active. The cameras+F/T row at 25 W does not span the full §04 range (cameras 15–25 W + wrist cameras 3–5 W + F/T 4–6 W + tactile 2–4 W = 24–40 W). There is no note in §06 indicating that the 30% margin is the mechanism absorbing the difference between §06's point values and §04's peaks. A reviewer comparing §06 against §04 will see apparently inconsistent numbers with no bridge explanation.

In practice, the 30% system margin (142 W for the full locomotion mode) would absorb the 26 W discrepancy without breaking closure. But this absorption is implicit rather than documented.

**Required action:** Revise §06 sensor rows to state ranges matching §04 (e.g., "LIDAR 20–30 W active; cameras, depth, F/T, tactile 24–40 W combined") and confirm the with-margin totals still close against the 800 W cap. Alternatively, add an explicit note stating: "Sensor point values above represent design-to nominal conditions; §04 peak range (37–75 W) is accommodated within the 30% mode margin."

---

### CC-004 — MAJOR — `04-sensing-autonomy.md` — Autonomy layer TRLs as-stated (space TRL 2–4) are not shown to be compatible with the locked TRL 6 gate by 2029

**Sections involved:** `04-sensing-autonomy.md` Section 3 autonomy stack
**Severity:** Major
**Parameter:** Autonomy stack layer space TRL values vs. locked TRL curve (TRL 6 by 2029)

**Locked value (cross-coupling log):** TRL 6 (space-relevant environments) by ~2029 → TRL 7+ by ~2035 → TRL 8 by ~2038–2040

**Values in §04 autonomy stack diagram (current state as of 2026):**
- Reactive layer: Space TRL **3–4**
- Deliberative layer: Space TRL **2–3**
- Supervisory layer: Space TRL **2–3**

**The problem:** The locked TRL curve commits to TRL 6 in space-relevant environments by 2029 — three years from the document date. The autonomy stack as characterized in §04 is at space TRL 2–4 across all three layers. There is no table, note, or statement in §04 showing which layer(s) must reach TRL 6 by 2029 and what development milestones would achieve this. The section does state, in the reactive layer discussion, that "to reach TRL 6 in space-relevant environments by the 2029 gate, the reactive layer needs: (1) hardware testing in a lunar gravity offload facility … (2) validation … (3) demonstration …" — this is the only forward-looking reconciliation of the gap, and it applies only to the reactive layer.

The cross-coupling log TRL curve entry appears to describe the whole-system autonomy TRL, but if the reactive layer needs to reach TRL 6 by 2029 while the deliberative layer is at TRL 2–3 with a 9-year runway to TRL 7+ by 2035, the section should state this explicitly to avoid the interpretation that the entire three-layer stack must reach TRL 6 by 2029.

**Required action:** §04 Section 3 should add a reconciliation note, preferably as a table column "Required TRL at 2029 gate / 2035 gate" alongside the current-state TRL values, showing which layer must advance to what level to satisfy the locked curve. At minimum, the section should explicitly state that the locked TRL 6 by 2029 gate applies specifically to the reactive layer (the safety-critical, most-mature layer), that the deliberative layer targets TRL 5 by 2029 and TRL 7 by 2035, and that the supervisory layer follows the same 2035 timeline. Without this clarification, downstream agents (autonomy-trl-tasking, human-factors-teaming) will receive inconsistent inputs: the cross-coupling log says TRL 6 by 2029, and §04 shows all layers at TRL 2–4, with no bridge.

---

### CC-005 — MAJOR — `02-form-factor-tradespace.md` — Candidate A description states 60–130 kg, contradicting the locked 75 kg design-to

**Sections involved:** `02-form-factor-tradespace.md` Section 1, Candidate A description
**Severity:** Major
**Parameter:** Mass characterization of Candidate A (Full Bipedal Humanoid) in the candidate description

**Locked value (cross-coupling log):** "design-to mass 75 kg, not-to-exceed mass 97.5 kg (30% margin)"

**Value in §02 Section 1, Candidate A:** "A bilateral, two-legged anthropomorphic robot of human scale (1.5–1.9 m standing height, **60–130 kg**)"

**The problem:** The "60–130 kg" figure is the heritage survey range from §01. It was the correct characterization before the tradespace analysis selected and locked the 75 kg design-to. The Section 1 candidate description has not been updated to reflect the locked commitment that appears later in the same document (Section 4: "75 kg design-to, 97.5 kg NTE"; Section 6: "Total system mass target: 75 kg (design-to), 97.5 kg (not-to-exceed)"). The contradiction is internal to §02.

A reader extracting the Candidate A description from Section 1 (as a downstream agent might) will conclude the form factor commitment allows anything from 60 to 130 kg, when the locked decision constrains it to 75 kg / 97.5 kg NTE.

**Required action:** Update the Candidate A description in §02 Section 1 to: "1.5–1.9 m standing height; heritage mass range 57–89 kg for commercial platforms, 75 kg design-to per this study's commitment (Section 4)." This removes the false 60–130 kg range from the candidate description while preserving the heritage context.

---

### CC-006 — MINOR — `01-overview.md` — Open question 1 retains a pre-lock placeholder mass value

**Sections involved:** `01-overview.md` Open Questions section, item 1
**Severity:** Minor
**Parameter:** Design-to mass target stated as "preliminary working assumption: ≤100 kg"

**Locked value:** 75 kg design-to / 97.5 kg NTE (cross-coupling log; §02 Sections 4 and 6)

**Value in §01 Open Questions item 1:**
> "Preliminary working assumption: ≤100 kg in surface configuration, with margin. This assumption must be reconciled with the destinations-trajectories agent."

**The problem:** The working assumption used in §01 (≤100 kg) predates the form factor position decision and has been superseded by the locked 75 kg / 97.5 kg commitment. The open question text implies this constraint is still unresolved, which is incorrect. A reader of §01 who does not proceed to §02 will believe the mass target is ≤100 kg, not 75 kg — a difference of 25 kg that materially affects lander manifest planning.

**Required action:** Update §01 Open Questions item 1 to note resolution: "Resolved in Section 01-02 and locked in the cross-coupling log: 75 kg design-to / 97.5 kg NTE per NASA-STD-5001 30% margin. The ≤100 kg figure used here as a working assumption was superseded."

---

### CC-007 — MINOR — `06-mass-power-budget.md` — Lunar night survival power "goal" of ≤150 W has no traceable locked source

**Sections involved:** `06-mass-power-budget.md` Section 2
**Severity:** Minor
**Parameter:** Stated power goal for lunar night survival mode

**The issue:** §06 Section 2 states: "Lunar night survival must close within 150 W with margin (≤115 W design-to at the lower bound of the 70–200 W thermal range)." The "150 W goal" is referenced multiple times in §06 as the applicable target for the hibernation mode. However, the cross-coupling log does not contain an entry locking 150 W as the lunar night power goal. The 70–200 W range from §A10 is locked; the 150 W figure appears to derive from §A3 (Section 01-02's "≤500 W steady-state" formulation), but §A3 does not explicitly address lunar night power.

The 150 W figure is not wrong — it represents the FSP lower bound that would comfortably accommodate the hibernation load without over-provisioning the power plant. But it is presented as a locked goal when it is actually an assumption that has not been formally committed.

**Required action:** Either (a) add a cross-coupling log entry explicitly locking the lunar night power goal as "≤150 W per humanoid unit (goal, not hard cap; hard cap is FSP allocation per far-side-base-architect's sizing)," or (b) revise §06's framing to "lower bound of the §A10 range: 70–200 W; current budget closes against the lower end of this range, meaning FSP allocation at the lower bound is adequate; upper bound requires FSP over-provisioning per the far-side-base-architect guidance in §06 Section 6."

---

### CC-008 — MINOR — `06-mass-power-budget.md` — Structure+actuation NTE (39.0 kg) not shown in integration table

**Sections involved:** `03-actuation-structures.md` (source) → `06-mass-power-budget.md` (downstream)
**Severity:** Minor
**Parameter:** Subsystem-level NTE for the structure + actuation block

**Source value (§03 Section 4 and cross-coupling log):** Structure + actuation total NTE = 39.0 kg

**Downstream value (§06 mass budget table):** Four constituent rows (primary structure 8.5, actuation 13.0, joints/sealing 4.0, end-effectors 4.5) show design-to values only; no NTE column and no subsystem-level NTE subtotal.

**The problem:** The locked 39.0 kg NTE for this block is not visible in §06. A reader of §06 cannot verify the subsystem constraint is met without summing rows and applying margin mentally. If a future design change causes any of the four rows to grow, it is not immediately apparent when the 39.0 kg subsystem NTE is breached, even before the overall 97.5 kg system NTE is reached.

**Required action:** Add a subtotal row to the §06 mass budget table between the end-effectors row and the sensor suite row: "Structure + actuation block subtotal | 30.0 | 39.0 (30% margin per §A5) | Locked in cross-coupling log; four line-items above." This makes the §A5 constraint traceable within the integration table.

---

### CC-009 — MINOR — `06-mass-power-budget.md` — Compute power point values not cross-referenced to §04 range

**Sections involved:** `04-sensing-autonomy.md` (source) → `06-mass-power-budget.md` (downstream)
**Severity:** Minor
**Parameter:** Compute power values in §06 vs. cross-coupling log range of 22–75 W

**Source value (§04 compute table and cross-coupling log):** Compute total: ~22–75 W (Tier 1: 5–10 W; Tier 2: 15–60 W; Memory: 2–5 W)

**Downstream value (§06 power table):**
- Tier 1 RH supervisor: 8 W (full operation modes)
- Tier 2 AI accelerator: 50 W (full locomotion + manipulation), 45 W (stationary manipulation), 0 W (hibernation)
- Combined compute: 58 W at peak operation

**The problem:** §06 uses point values (8 W, 50 W) drawn from within the §04 ranges. The values are defensible selections (Tier 1 mid-range; Tier 2 high-end for peak mode), but §06 does not state that these are design-to selections from the §04 range, nor does it explain why 50 W was selected for Tier 2 rather than the high-end 60 W. A reader comparing §04 (22–75 W range) to §06 (58 W point value) cannot determine whether the §06 figure is conservative or optimistic within the range.

**Required action:** Add a note to the §06 power table compute rows: "Tier 1: 8 W selected as design-to mid-point of §04 5–10 W range. Tier 2: 50 W selected as high-performance-mode design-to within §04 15–60 W range; peak instantaneous draw of 60 W is absorbed by the 30% mode margin."

---

### CC-010 — NIT — `05-environments-hardening.md` — "Dual-stage" descriptor omitted in §05 cross-reference to joint seal strategy

**Sections involved:** `05-environments-hardening.md` Section 4.4
**Severity:** Nit
**Parameter:** Descriptor of joint seal architecture in cross-reference

**Cross-coupling log value:** "Dual-stage labyrinth + single elastomeric lip seal (perfluoroelastomer, FFKM-class)"

**§03 Section 3 value:** "dual-stage labyrinth path followed by a single elastomeric lip seal" — correct and consistent with log.

**§05 Section 4.4 value:** "The joint labyrinth + FFKM lip seal strategy from Section 01-03" — "dual-stage" omitted.

**Required action:** Change "The joint labyrinth" to "The dual-stage labyrinth" in §05 Section 4.4.

---

### CC-011 — NIT — `06-mass-power-budget.md` — Power table lists 26 manipulation joints; inconsistent with §03 DOF table

**Sections involved:** `06-mass-power-budget.md` Section 2 power table; `03-actuation-structures.md` Section 2 DOF table
**Severity:** Nit
**Parameter:** Manipulation joint count used in power budget table row heading

**§06 power table row label:** "Actuation — manipulation joints (shoulders, elbows, wrists, torso, neck, **26 joints**)"
**Arithmetic check:** 12 locomotion DOF (6 hip + 2 knee + 4 ankle) + 26 manipulation = 38 total — consistent with locked 38 DOF only if hands are counted as 0 individual DOF in this breakdown.

**§03 DOF table:** Neck 3, torso 2, arms 4×2=8, wrists 3×2=6, hands 10–12×2=20–24, hips 6, knees 2, ankles 4 — totaling 56–60 DOF at the element level, reduced to 38 nominal by treating hand finger groups as compound actuator assemblies.

**The problem:** "26 manipulation joints" only works if each hand is counted as one actuator group (not 10–12 finger DOF), reducing manipulation DOF to: neck 3 + torso 2 + arms 8 + wrists 6 + 2 hand assemblies + 0 hips/knees/ankles already in locomotion = 23 or similar. The counting convention is not stated, creating potential confusion for anyone trying to reconcile §06's "26" against §03's element-by-element table.

**Required action:** Add a parenthetical note to the §06 power table row: "26 manipulation joint actuator groups (excludes individual finger DOF; each hand counted as one multi-motor assembly in this power allocation)." This prevents apparent discrepancy with §03 without requiring any numbers to change.

---

### CC-012 — NIT — `05-environments-hardening.md` — Section 1 requirements table states "120–140 krad with shielding" inconsistently with Section 3's unshielded budget

**Sections involved:** `05-environments-hardening.md` Section 1 requirements table vs. Section 3 TID budget
**Severity:** Nit
**Parameter:** 7-year TID budget value

**§05 Section 3 (authoritative):** "7-year TID budget: **140–210 krad** (silicon) without shielding" — consistent with cross-coupling log.

**§05 Section 1 requirements table, radiation row (COTS compute challenge column):** "7-year design life budget = **120–140 krad** with shielding mitigation needed."

**The problem:** The two values within the same section are inconsistent. The Section 3 value (140–210 krad unshielded) and the Section 1 table value (120–140 krad "with shielding mitigation needed") overlap at only the single point of 140 krad. The Section 1 phrasing "with shielding mitigation needed" is ambiguous — it could mean "this is the unshielded budget and shielding is required," not "this is the shielded budget." If it means the unshielded budget is 120–140 krad, it contradicts Section 3's 140–210 krad. The cross-coupling log is unambiguous: 140–210 krad unshielded, 7-year.

**Required action:** Revise the Section 1 requirements table radiation cell to read: "GCR TID unshielded: 140–210 krad over 7-year design life (Section 3); COTS electronics tolerance ~3–30 krad unshielded — shielding and/or ORU replacement required." Remove the "120–140 krad" figure from Section 1 or clearly attribute it to a specific calculation.

---

## Additional Observations

**Budget closure assessment under reconciled numbers (CC-001):** If CC-001 resolves in favor of §05's 50–150 W heater figure, the hibernation mode pre-margin total becomes approximately 79–209 W (heaters 70–200 W + non-thermal always-on loads ~9 W), and the with-margin total approximately 103–272 W. At the lower bound, the budget closes comfortably at 103 W vs. 150 W goal — materially different from §06's narrative of "barely closes at 148 W vs. 150 W." The upper bound still does not close (272 W), but the risk picture changes: the lower bound is no longer a near-miss, only the upper bound is a concern. Downstream agents (far-side-base-architect for FSP sizing, conops-integrator for operational constraints) should be informed that the closure confidence depends on which heater estimate is treated as authoritative.

**Actuation type consistency in §04:** The sensing/autonomy section does not explicitly reference HD-Electric as the actuation type, but its power figures and compute architecture assumptions are internally consistent with HD-Electric. No inconsistency was found; this is a transparency observation only.

**Form factor scoring for Candidates C–E (CC-002 extension):** Correcting the table per CC-002 widens the bipedal margin over other candidates. Candidate B (Centaur) moves from 3.35 (table) to 3.55 (arithmetic), narrowing the A-vs-B gap from 0.25 to 0.10. The study's narrative judgment that "the gap is narrow" is correct and would be undermined by the erroneous table values showing a 0.25 spread. Fixing the table makes the position more honest, not less defensible.
