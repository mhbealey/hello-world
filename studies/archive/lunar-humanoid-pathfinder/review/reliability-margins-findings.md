---
title: Reliability and Margins Review Findings
status: findings-complete
owner: reliability-margins-reviewer
last-updated: 2026-05-03
stage: 8
---

# Reliability and Margins Review Findings — Stage 8

**Scope:** Question (b) sections — `study/02-human-in-the-loop/01-overview.md`, `02-latency-tradespace.md`, `03-autonomy-trl-tasking.md`, `04-teaming-model.md` — and assumptions register §A15–§A19.

---

## Summary

| Severity | Count |
|----------|-------|
| Blocker  | 1     |
| Major    | 6     |
| Minor    | 5     |
| Nit      | 3     |
| **Total** | **15** |

---

## Findings

### RM-B01 — Blocker — 02-04 — "1 OOD alert per 4-hour sortie" is an invented rate with no derivation, cited source, or uncertainty bound, and it is load-bearing for crew headroom closure

**Severity:** Blocker
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 1 (On-Demand Supervision), and Section 2 (Cognitive Load Analysis)
**Number/claim:** "A conservative estimate of one OOD alert per 4-hour sortie per humanoid (3 humanoids = approximately 3 alerts per shift) × 15 minutes average resolution = 45 minutes of anomaly response per crew shift distributed across the team."
**Problem:** This figure is the denominator that determines whether the supervisory load model closes with the claimed 2× headroom margin. Specifically:

- The on-demand anomaly budget is 0.75 person-hours/shift (3 alerts × 15 min each).
- This feeds directly into the total supervisory demand of 4.25 person-hours/shift.
- The headroom of 3.75 person-hours (88% margin) is the study's primary claim that 4 crew can supervise 3 humanoids.

If the OOD alert rate is 2 per humanoid per 4-hour sortie (6 total per shift) instead of 3 per shift, the anomaly budget grows to 1.5 person-hours. Total demand becomes 5.0 person-hours, and headroom compresses to 3.0 person-hours — still positive but the claim of "roughly a factor of 2" between demand and capacity no longer holds. If each alert takes 30 minutes rather than 15, the entire headroom margin is consumed by anomaly response alone.

No source is provided for either the 1-per-sortie rate or the 15-minute resolution time. The word "conservative" is asserted, not demonstrated. The rate is not bounded with an upper uncertainty. There is no heritage — no prior space robot operation, no terrestrial factory deployment, and no analog study — that characterizes OOD alert frequency at a TRL 7 deliberative-layer autonomy system in a novel environment. The Lunokhod heritage cited throughout the section concerns operator-commanded operations, not autonomous operations that self-generate OOD alerts. This is a fabricated number in the most load-bearing position of the cognitive load arithmetic.

**Required action:**

1. Add a derivation footnote that shows where 1 alert/sortie comes from. If the figure is a parametric estimate with no heritage, state it as such explicitly: "This rate is a parametric assumption with no heritage basis. It is a study planning assumption, not a validated operational rate."
2. Add a sensitivity row to the cognitive load arithmetic table: "If OOD alert rate is 2/sortie/humanoid (6 total/shift) at 30-min mean resolution time, anomaly response budget is 3.0 person-hours. Total demand rises to 5.25 person-hours, and headroom compresses to 2.75 person-hours (52% margin above demand). The claim of 2× headroom holds only if the 1-alert/sortie/15-minute resolution estimate is correct."
3. The headroom factor stated in §A19 ("headroom factor ~2×") must be qualified to reflect this sensitivity. Replace "headroom factor ~2×" with "headroom factor ~2× under the 1-OOD-alert/sortie/humanoid planning assumption; sensitivity analysis required before treating this as a program commitment."
4. Assign the alert rate characterization to a named program activity: terrestrial analog deployments of the humanoid in novel environments, monitored for OOD flag frequency per operating hour, with results feeding the 2029 gate review.

---

### RM-M01 — Major — 02-04 §1 — The 0.6 concurrency factor in the periodic supervision calculation is asserted without derivation or bound

**Severity:** Major
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 2, periodic supervision sub-calculation
**Number/claim:** "For 3 humanoids with overlapping checkpoint schedules (not all running jointly-executed tasks simultaneously): approximately 3 × 0.83 × 0.6 concurrency factor = ~1.5 person-hours."
**Problem:** The 0.6 concurrency factor — meaning, on average, only 60% of the humanoids are simultaneously at a checkpoint gate requiring human attention — directly reduces the periodic supervision load from 2.5 person-hours (3 × 0.83) to 1.5 person-hours. This single factor saves 1.0 person-hour of the total 4.25 person-hour demand. The document's parenthetical explanation ("at any given time, some humanoids will be in autonomy-led phases while others are at checkpoint gates; simultaneous checkpoints from all three robots are rare") is a qualitative assertion, not a derivation.

The concurrency factor depends on the relative duration of autonomous task phases versus checkpoint-gate phases, and on the checkpoint scheduling discipline of the operations team. If two of three humanoids are executing jointly-executed tasks simultaneously (a plausible scenario during a high-density sortie day), the effective concurrency factor rises toward 0.8–0.9, pushing periodic supervision demand to 2.0–2.25 person-hours. The document itself acknowledges the "high-density sortie day" as a stress case that the headroom must absorb — but the stress case is never quantified against the headroom.

**Required action:**

1. Derive the 0.6 factor from first principles or bound it: estimate the fraction of task time at checkpoint gates vs. executing autonomously for each jointly-executed task category. Use the checkpoint interval stated earlier in the same section (15–30 minutes between reviews for prepared-path operations; trigger-based for manipulation). If a typical jointly-executed task has 20% of its time at checkpoint gates and 80% executing autonomously, and tasks are uncorrelated across robots, the probability that any two are simultaneously at a gate is 0.2² = 0.04, and the expected fraction of time with 2+ robots simultaneously at gates is low. Show this calculation.
2. If the 0.6 factor cannot be derived, flag it as a planning assumption and add a sensitivity: "If simultaneous checkpoint density is 0.8 rather than 0.6, periodic supervision demand rises from 1.5 to 2.0 person-hours; total demand rises from 4.25 to 4.75 person-hours; headroom compresses from 3.75 to 3.25 person-hours."
3. Add a cross-reference to the ConOps agent, who must validate the concurrency factor against the actual sortie-day task scheduling structure.

---

### RM-M02 — Major — 02-04 §2 — The 8 person-hours/shift supervisory capacity derivation contains a numerical inconsistency in §A19

**Severity:** Major
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 2; `study/05-cross-cutting/margins-and-assumptions.md`, §A19
**Number/claim:** Section 2 of §02-04 states: "At an 8-hour nominal work shift, 4 crew × 8 hours × 0.25–0.30 available fraction yields approximately 8–10 person-hours per crew shift available for supervisory demand. The conservative estimate is 8 person-hours per crew shift."

§A19 states: "For supervisory activities specifically, the fraction available without competing with science, EVA prep, and personal time is 25–30%, or approximately 3 hours per crew member per shift. For 4 crew: 4 × 2 hours ≈ 8 person-hr/shift."

**Problem:** The two derivations are internally inconsistent:

- §02-04 uses: 4 crew × 8 hours × 0.25–0.30 = 8–9.6 person-hours (rounds to "8–10").
- §A19 uses: 4 crew × 2 hours = 8 person-hours.

At 0.25 fraction of an 8-hour shift, 1 crew member has 2.0 hours of supervisory time. That is consistent with the §A19 "4 × 2 = 8" calculation. But §A19's prose says the available fraction is "25–30%, or approximately 3 hours per crew member per shift." 25–30% of an 8-hour shift is 2.0–2.4 hours, not 3 hours. Three hours corresponds to 37.5% of an 8-hour shift, which is inconsistent with the stated 25–30% fraction and inconsistent with the Mir baseline of 30–40% maintenance absorption (which would leave less than 25% for supervision once exercise and personal time are deducted).

The §A19 document also applies the Mir baseline differently from §02-04: §A19 says "30–40% maintenance absorption... with maintenance absorption at 35%, a 12-hour crew waking period leaves approximately 65% = 7.8 hours for other activities" and then derives 25–30% supervisory fraction from the 12-hour waking period — not the 8-hour work shift. If the base period is 12 hours (waking), 0.25 × 12 = 3 hours per crew member — consistent with §A19's stated "3 hours per crew member" but inconsistent with §02-04's use of an 8-hour shift as the base period.

The result (8 person-hours/shift capacity) may survive either derivation path, but two different base periods (8-hour work shift and 12-hour waking period) are used interchangeably to justify the same number. This is a derivation consistency failure.

**Required action:**

1. Choose a single base period and apply it consistently: either (a) 8-hour nominal work shift, in which case 25–30% supervisory fraction yields 2.0–2.4 hours/crew member and 8–9.6 person-hours/shift for 4 crew, or (b) 12-hour waking period, in which case 25% supervisory fraction yields 3 hours/crew member and 12 person-hours/shift for 4 crew — which is a materially higher and less conservative estimate. The conservative commitment should use (a).
2. Reconcile §A19 prose with its own calculation: change "approximately 3 hours per crew member per shift" to "approximately 2 hours per crew member per 8-hour shift (25% of 8 hours)" to match the arithmetic.
3. State the capacity figure as a range: "8.0–9.6 person-hours/shift (4 crew × 8 hours × 0.25–0.30)" rather than a point estimate of 8 person-hours. Using the conservative lower bound (8.0) is defensible but should be labeled as conservative.

---

### RM-M03 — Major — 02-04 §1 — The periodic supervision 0.2 person-hours/robot-hour cost factor is stated as a derivation but the arithmetic does not reproduce the value

**Severity:** Major
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 1 (Periodic Supervision)
**Number/claim:** "Crew time cost. Approximately 0.2 — one person-hour of supervision per five robot-hours of operation. Derivation: a typical 8-hour operational shift with jointly-executed tasks running involves approximately 4–6 checkpoint interactions, each consuming 5–10 minutes of active crew attention. That totals 20–60 minutes of active supervisory work per 8-hour shift per humanoid, yielding a 0.04–0.125 person-hour per robot-hour ratio; 0.2 is the conservative upper estimate across a high-density task day."
**Problem:** The arithmetic derivation yields 0.04–0.125 person-hours per robot-hour. The document then states "0.2 is the conservative upper estimate" — but 0.2 is above the top of the derived range (0.125), not at its upper end. The document does not explain what additional factor produces the jump from the 0.125 upper bound to 0.2. Furthermore, the periodic supervision demand calculation in Section 2 uses "~0.2 person-hr/robot-hr × 3 robots × 5 hr active window = ~3.0 person-hr/shift" — but this differs from what the summary table calls "~0.2 person-hr/robot-hr" for periodic supervision: applying 0.2 across a full 8-hour shift for 3 robots would yield 0.2 × 8 × 3 = 4.8 person-hours, not 3.0 person-hours. The 3.0 figure uses a 5-hour active window that is not explained or derived anywhere.

**Required action:**

1. Close the gap between the derived upper bound (0.125 person-hours/robot-hour) and the stated conservative value (0.2): either explain what the additional factor is (perhaps scheduling overhead, concurrent alert handling, or checkpoint decision latency) or reduce the stated value to 0.125 and accept a lower demand estimate.
2. Define and defend the "5 hr active window" used in the Section 2 calculation. If jointly-executed tasks run for 5 of 8 operational hours per humanoid, state this explicitly and derive it (e.g., "3 of 20 tasks are jointly-executed and each task runs ~30 minutes, totaling ~2.5 hours per humanoid per shift, but with task setup and transition this grows to ~5 hours"). If the 5-hour window is a round estimate, flag it as such.
3. Revise the summary table to use a value consistent with the arithmetic, or acknowledge that the 0.2 factor is deliberately set above the derived range to provide margin and state by how much.

---

### RM-M04 — Major — 02-04 §3 — The supervisor ratio 1:4–5 post-2035 advancement rests on a "60% reduction in checkpoint demand" claim that is not derived

**Severity:** Major
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 3, Step 4
**Number/claim:** "By 2040, 16–17 of 20 tasks at autonomy-led level reduces the jointly-executed checkpoint demand by approximately 60%, reducing total supervisory demand per shift from 4.25 to approximately 2.5 person-hours. Against the same 8 person-hour capacity, the headroom grows to 5.5 person-hours — sufficient to support a 1:4–5 ratio."
**Problem:** The 60% reduction in checkpoint demand is asserted without a derivation. The figure matters because it is the stated justification for the 2040 supervisor ratio of 1:4–5. If the reduction is only 40% rather than 60%, total demand at 2040 would be approximately 3.1 person-hours rather than 2.5, and the headroom would be approximately 4.9 person-hours — still permitting 4–5 humanoids per supervisor but with less margin than claimed. Additionally, the text says 16–17 of 20 tasks migrate to autonomy-led by 2040, which is a 2–3 task increase from the IOC figure of 12. The task allocation table in §02-03 shows only T16 (calibration) explicitly migrating to autonomy-led by 2040; T05 and T09 are described as potentially lightening but not confirmed as migrating. The 16–17 task claim appears to require T05 and T09 to migrate — which contradicts the task allocation table's "Jointly executed" designation for T05 at 2040.

**Required action:**

1. Derive the 60% checkpoint demand reduction from the task allocation table: identify which tasks shift from jointly-executed to autonomy-led between 2035 and 2040, compute the checkpoint demand reduction from each migration, and sum. If T05 and T09 do not migrate (consistent with the task allocation table), recompute the 2040 demand with only T16 migrating.
2. Reconcile with the task allocation table: the 16–17 tasks autonomy-led claim in §02-04 must match the count in §02-03's "Allocation at Full Operation (2040)" column. As of the current task table, T05, T09, T13, T14, T17 remain jointly-executed or human-led at 2040, leaving only 13–14 autonomy-led tasks. This must be made consistent.
3. If the 1:4–5 ratio rests on a projection that requires autonomy migration the task table does not support, the ratio should be revised or the task table must be updated — whichever is the correct position.

---

### RM-M05 — Major — §A15–§A19 — §A19 periodic supervision demand arithmetic uses a different calculation path from §02-04 and produces a slightly different total

**Severity:** Major
**Section:** `study/05-cross-cutting/margins-and-assumptions.md`, §A19
**Number/claim:** §A19 derives supervisory demand as: "12 autonomy-led tasks: ~0.05 person-hr/robot-hr × 3 robots × 8 hr operational window = ~1.2 person-hr/shift; 6 jointly-executed tasks: ~0.2 person-hr/robot-hr × 3 robots × 5 hr active window = ~3.0 person-hr/shift; Total: ~4.2 person-hr/shift."

§02-04 Section 2 derives: on-demand subtotal 2.0 person-hours; periodic supervision 1.5 person-hours; continuous supervision 0.75 person-hours; total 4.25 person-hours.

**Problem:** The two derivation paths produce different figures (4.2 vs. 4.25 person-hours) via different arithmetic structures and neither is flagged as a simplification of the other.

More substantively: §A19's periodic supervision demand (3.0 person-hours) is derived as 0.2 × 3 robots × 5 hr active window = 3.0 person-hours. But §02-04's periodic supervision demand (1.5 person-hours) applies the 0.6 concurrency factor and derives a different number. The two figures are:
- §A19: 3.0 person-hours (no concurrency factor applied)
- §02-04: 1.5 person-hours (with 0.6 concurrency factor)

These differ by a factor of 2. A cross-cutting assumption register that contains a demand figure twice as large as the section-level analysis creates a risk of downstream agents using the wrong basis. The §A19 derivation drops the concurrency factor correction that §02-04 applies; this is not flagged anywhere.

**Required action:**

1. Reconcile the periodic supervision demand figures between §A19 and §02-04. Choose one derivation path, apply it consistently, and footnote the reconciliation. The concurrency-corrected 1.5 person-hours from §02-04 is the more detailed derivation; §A19 should adopt it with an explicit note that the 0.6 concurrency factor is from §02-04 Section 2.
2. The total demand figure in §A19 (4.2 person-hours) should match §02-04 (4.25 person-hours) or the difference should be explained. If §A19 is intentionally simplified, label it "simplified demand estimate — see §02-04 Section 2 for full derivation."

---

### RM-M06 — Major — 02-03 §2 — T10 SPE shelter return "15–30 minutes" time window is stated without a derivation or source

**Severity:** Major
**Section:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Task T10
**Number/claim:** "Robot must self-initiate shelter return on Tier 1 radiation monitor threshold, within 15–30 minutes; human authorization impractical in time-critical SPE scenario."
**Problem:** The 15–30 minute window is the stated requirement driving the "Must be fully autonomous" classification for T10. This window determines whether the task can be human-led or must be fully autonomous — a classification with direct consequences for the TRL requirements on the reactive layer (TRL 7 required by 2035 for T10). The figure has no derivation or citation. The relevant physics is: SPE onset time varies from minutes (the most intense events, e.g., the 1956 February event) to hours (slower-rising events like the September 2005 event). The dose rate at which human intervention becomes inadequate to prevent unacceptable exposure depends on the SPE spectrum, the shielding configuration, and the acceptable exposure limit. None of these are stated.

A 15–30 minute return requirement is plausible but could be anywhere from 5 minutes (fast-rising hard-spectrum event at high fluence rate) to several hours (slow-rise soft-spectrum event). The classification of T10 as "Must be fully autonomous" changes if the window is, say, 2 hours — in which case human authorization with a Tier B (Earth relay) response would be feasible.

**Required action:**

1. Derive the 15–30 minute window from first principles: state the design SPE (specify a percentile, e.g., "Carrington-class SPE is the bounding case; the 1989 October event is the design requirement at the 99th percentile fluence rate at 1 AU"), state the acceptable total exposure limit (in mSv or rad), and compute the maximum allowable time from onset to shelter arrival given the humanoid's unshielded dose rate during the event. Show the arithmetic.
2. If the 15–30 minute window cannot be derived from available data, flag it as a parametric assumption, add it to the assumption register, and state the sensitivity: "If the allowable response time is >60 minutes, T10 may be classifiable as jointly-executed with Earth relay authorization rather than fully autonomous."
3. This finding cross-couples to §A11 (radiation hardening strategy) and the TRL requirements in §A1. Flag for space-environments agent review.

---

### RM-N01 — Minor — 02-04 §2 — The Mars-500 behavioral torpor finding is cited as a risk but no quantitative degradation bound is stated

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 2, Long-Duration Degradation
**Number/claim:** "Behavioral torpor. Crew sedentariness increased monotonically across the mission... For a supervisory role, reduced spontaneous activity is a leading indicator for reduced alertness and delayed anomaly response."
**Problem:** The Mars-500 finding is relevant and correctly cited, but the section does not bound the performance degradation quantitatively. If behavioral torpor reduces supervisory alertness by, say, 15–20% over a 6-month rotation, the effective supervisory capacity decreases from 8 person-hours to approximately 6.4–6.8 person-hours. This reduces headroom from 3.75 to 2.15–2.55 person-hours — still positive but meaningfully tighter. The finding is cited as a risk without quantifying its consequence on the headline numbers.

**Required action:**

Add a quantitative degradation bound: "The Mars-500 results suggest anomaly response times and task performance scores may degrade by 10–30% over a 6-month rotation for individual crew members with the most pronounced torpor effects \cite{basner2013mars500}. Applying a conservative 20% performance degradation to one of four crew members (25% of supervisory capacity) reduces effective supervisory capacity from 8 to approximately 7.4 person-hours — still above the 4.25 person-hour demand but eroding 16% of the headroom. This degradation should be included in the ConOps sensitivity model." If the Mars-500 data does not support a specific percentage, state the limitation explicitly.

---

### RM-N02 — Minor — 02-04 §1 — Continuous supervision cognitive load "degrades above two hours" is cited to a source that may not contain this specific claim

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 1 (Continuous Supervision)
**Number/claim:** "Empirically, this sustained vigilance is cognitively expensive in the 40–60 minute range and degrades above two hours for highly skilled monitoring tasks \cite{kanas2008space}."
**Problem:** The \cite{kanas2008space} reference — Kanas and Manzey's "Space Psychology and Psychiatry" — is a behavioral health text covering crew psychology, interpersonal dynamics, and workload in space generally. It is plausible that it discusses vigilance degradation, but it is not primarily a human factors performance text. The specific claims — "40–60 minute" cognitive expense and ">2 hours" degradation — are precise figures that require a specific vigilance research citation (e.g., Parasuraman 1979 sustained attention studies, Warm et al. 2008 on vigilance decrement). If these numbers come from Kanas and Manzey's synthesis of vigilance literature, the underlying primary source should be cited.

**Required action:**

Verify that \cite{kanas2008space} contains the specific 40–60 minute and 2-hour degradation figures, and if it cites primary vigilance literature, cite that literature directly. If the figures are standard vigilance research findings (the "vigilance decrement" literature), cite a primary reference such as Warm JS, Parasuraman R, Matthews G (2008) "Vigilance requires hard mental work and is stressful" *Human Factors* 50(3), which documents the temporal profile of vigilance degradation.

---

### RM-N03 — Minor — §A17 — The "75–85% availability" figure for Queqiao-2 is stated without a calculation basis

**Severity:** Minor
**Section:** `study/05-cross-cutting/margins-and-assumptions.md`, §A17; also `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 1
**Number/claim:** "Queqiao-2 provides approximately 75–85% availability of simultaneous dual-line-of-sight coverage for a receiver at the equatorial far side (based on its 24-hour elliptical frozen orbit geometry)."
**Problem:** The 75–85% availability figure appears in both §02-02 and §A17 but is derived differently in each. §02-02 states it is "estimated at 75–85% per orbit for a receiver at the equatorial far side, degrading toward the polar regions" based on "orbital geometry (apoapsis above the lunar limb, providing the elevation angle required for far-side coverage)." This is qualitative reasoning without a geometric calculation. The actual availability depends on the minimum elevation angle from which Queqiao-2 can simultaneously see the far-side receiver and Earth, the orbital geometry at periapsis vs. apoapsis, and the orbital period fraction spent in each geometry. None of this is computed.

The 75–85% range is the basis for the finding that Queqiao-2 alone is insufficient (requiring a second satellite), which is an architectural requirement with cost and schedule consequences (§A17: "the far-side-base-architect must carry this as an infrastructure prerequisite for the IOC milestone, not a growth option"). The figure is consequential enough to require more than an orbital geometry qualitative assertion.

**Required action:**

Add a two-sentence geometric derivation: "Based on Queqiao-2's elliptical frozen orbit (24-hour period, inclination 62.4°, apoapsis ~16,500 km, periapsis ~200–250 km above lunar surface), the satellite spends approximately [X]% of its orbital period above the minimum elevation angle required for simultaneous Earth and far-side equatorial receiver line-of-sight. This geometric argument yields the 75–85% range; detailed link availability computation with actual orbit elements is required before the relay architecture is treated as baselined." If this computation has been done (and cited in \cite{spj2021lunarrelay}), cite the specific table or figure from that reference.

---

### RM-N04 — Minor — 02-01 §2 — "Factor of 5–10x" productivity differential between Tier A and Tier B supervision is unsupported by cited heritage

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/01-overview.md` (Section 4 reference in §02-02 Section 4); `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 4
**Number/claim:** "The productivity differential between the two regimes — for a task profile that includes novel manipulation, infrastructure installation, and scientific sampling — favors forward deployment by a factor estimated at 5–10× for task-hours delivered per crew-hour invested."
**Problem:** The 5–10× productivity differential is the quantitative claim that justifies the economic case for forward-deployed humans. It is stated as an "estimate" without any derivation or cited study. The only heritage used in the immediate context is Lunokhod's traverse rate (1–2 km/hr maximum under frame-advance teleoperation). "Supervised autonomy at ≤50 ms RTLT can achieve speeds an order of magnitude higher" is asserted — but "an order of magnitude higher traverse speed" is not the same as "5–10× higher task-hours delivered per crew-hour invested." Traverse rate and task productivity are different measures; the conversion requires assumptions about task mix, checkpoint frequency, and crew involvement per task that are not shown.

Additionally, neither the numerator (task-hours delivered at ≤50 ms RTLT) nor the denominator (crew-hours invested) is quantified for the Tier A case, so the ratio is not a ratio — it is an assertion.

**Required action:**

Either derive the 5–10× figure from the cognitive load arithmetic in §02-04 (which at least contains a structured demand model), or replace it with a more defensible framing: "The cognitive load arithmetic in §02-04 shows that 4 crew supervising 3 humanoids in periodic supervision mode can deliver 3 humanoid-operational-days per crew-day. Under Lunokhod-heritage direct teleoperation at Tier B latency, an analogous crew would manage approximately 1 rover-equivalent operational day per five crew-members per crew-day. The productivity leverage is therefore approximately 3÷(1/5) = 15× — but this comparison conflates latency regime, autonomy TRL, and task complexity. The honest answer is that the leverage is large and positive, but a specific factor requires a task-level simulation, not an assertion." Alternatively, mark the 5–10× figure explicitly as a "rough order-of-magnitude estimate, not a derived value."

---

### RM-N05 — Minor — 02-03 §3 — "500–2,000 taught demonstrations per new tool type" is stated without any cited basis

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 1, T04/manipulation category
**Number/claim:** "A lunar base task library must be assembled using ground simulant hardware, prior to deployment, at an estimated 500–2,000 taught demonstrations per new tool type."
**Problem:** This range is stated without a source. The demonstration count drives pre-deployment ground operations scope: if the humanoid must master 20 tool types and each requires 1,000 demonstrations, the ground program involves 20,000 demonstrations, with implications for schedule and cost. The ALOHA/ACT reference (\cite{zhao2023aloha}) that appears in the section documents bimanual manipulation learning from demonstrations, but ALOHA's published demonstration counts for novel objects were in the range of 50–200 episodes per task, not 500–2,000. The upper end of the stated range (2,000) may be conservative, but it is not reconciled with published demonstration efficiency figures.

**Required action:**

Cite the basis for the 500–2,000 range, or replace it with a derivation: "Based on published imitation learning results (e.g., ALOHA at 50–200 demonstrations per task for lab-scale manipulation \cite{zhao2023aloha}), a lunar surface task under distribution shift conditions may require 5–10× more demonstrations than the lab baseline to achieve comparable success rates, yielding approximately 250–2,000 demonstrations per task. Using 500–2,000 as the planning range is conservative at the high end." If no citation supports the range, flag it explicitly as a parametric estimate and add it to the assumption register as a program planning assumption.

---

### RM-Nit01 — Nit — §A18 — The 1:8–10 hard ceiling is described as "TRL-independent" but is implicitly dependent on crew size remaining at 4

**Severity:** Nit
**Section:** `study/05-cross-cutting/margins-and-assumptions.md`, §A18
**Number/claim:** "Hard ceiling approximately 1:8–10 regardless of TRL due to human value floor saturation in a 4-person crew."
**Problem:** The ceiling is not TRL-independent — it is crew-size-dependent. A 6-person crew with the same human value floor tasks would have a ceiling of approximately 1:12–15. The ceiling is correctly derived from the combination of the human value floor and the fixed 4-person crew size, but calling it "TRL-independent" is imprecise. A reviewer might read "TRL-independent" as implying that even with a larger crew the ceiling holds.

**Required action:**

Replace "regardless of TRL" with "regardless of TRL for a 4-person crew." Add: "This ceiling scales with crew size; a 6-person crew at the same autonomy TRL has a ceiling of approximately 1:12."

---

### RM-Nit02 — Nit — 02-02 §2 — Sheridan Level column in the latency table conflates normative framework with empirical claims

**Severity:** Nit
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 2, Sheridan/Verplank table
**Number/claim:** The table maps RTLT ranges to "Sheridan Level range" (e.g., "200 ms–1 s: 3–5") with "Operational mode" and "Human role" columns.
**Problem:** The document correctly notes "Sheridan's framework is not a performance curve — it is a normative taxonomy." But then the latency-to-Sheridan-level mapping is presented in a table format that implies precision: specific RTLT breakpoints map to specific Sheridan Level ranges. The empirical literature (METERON, KONTUR-2) is cited to "confirm" these tiers, but neither METERON nor KONTUR-2 uses the Sheridan taxonomy in its reporting. The mapping is the authors' interpretation, not a finding from those experiments. A reader could mistake the table for heritage data.

**Required action:**

Add a table footnote: "Sheridan Level assignments are this study's interpretation of the latency-operational-mode mapping, not findings from the cited experiments. The empirical literature confirms qualitatively distinct operating modes at the stated latency tiers but does not specify Sheridan Level values. The level ranges are illustrative."

---

### RM-Nit03 — Nit — 02-03 §5 — Counter-case section cites \cite{black2024pi0} and \cite{unitree2024h1} with [UNVERIFIED] flags — these appear in a substantive claim without resolution

**Severity:** Nit
**Section:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 5 and References
**Number/claim:** "\cite{black2024pi0} — pi-0 VLA model; cross-task generalization; supervisory layer capability baseline. [UNVERIFIED — cite pending primary source confirmation]" and "\cite{unitree2024h1} — Unitree H1; bipedal locomotion on prepared surfaces; commercial TRL baseline. [UNVERIFIED]"
**Problem:** Both citations appear in the main body of the section (pi-0 is cited in Section 5's counter-case; Unitree H1 is cited in Section 1's TRL assessment table) and in §A9. [UNVERIFIED] flags on citations used in substantive TRL assessments and in the counter-case argument leave open the possibility that the primary sources contradict the claims made. These are not load-bearing in the same way as the anomaly rate figure, but unverified citations on TRL claims in a PDR-track document are a citation discipline issue.

**Required action:**

Resolve both citations before Stage 9. For \cite{black2024pi0}: the pi-0 paper (Black et al., Physical Intelligence, 2024) is an arXiv preprint available at arXiv:2410.24164 — this should be verifiable against the primary source. For \cite{unitree2024h1}: Unitree's published product documentation or press releases should be sufficient to confirm locomotion capability claims. Remove [UNVERIFIED] once confirmed, or revise the claim if the source does not support it.

---

## §A15–§A19 Completeness Assessment

**§A15 (Boot cover replacement interval: 500 surface-hours).** Present and complete. Contains: interval definition, consumables manifest consequence (7 pairs/year/humanoid, 4.2 kg/year for three humanoids), validation path, and assigned owners. The "no heritage" acknowledgment is explicit. No gaps.

**§A16 (Locomotion power gait factor: 0.55).** Present and complete. Contains: derivation of the 0.55 factor (inherited from RM-002 remediation), the 0.84 cap-break threshold calculation, and technology gate assignment. The sensitivity analysis (factor 0.75 → 733 W with margin, still within 800 W cap) is shown. No gaps.

**§A17 (Relay constellation availability ≥95%).** Present and complete. Contains: the 75–85% single-asset shortfall, the two-satellite requirement, the autonomous safe-mode TRL requirement during outages, and path dependency. The derivation of 75–85% is qualitative (see RM-N03 above — Minor finding), but the assumption entry itself is properly structured.

**§A18 (Supervisor ratio 1:2–3 at IOC, 1:4–5 at full operation).** Present and complete. Contains: five-step derivation chain, NIP-10 heritage baseline, §A1 autonomy curve link, cognitive load arithmetic reference, post-2035 advancement path, and hard ceiling justification. Risk characterization is appropriate.

**§A19 (Crew composition at IOC: 4 crew, 3 humanoids, headroom factor ~2×).** Present but contains the internal arithmetic inconsistency identified in RM-M02 (12-hour waking period vs. 8-hour shift as base period) and the demand-figure mismatch with §02-04 identified in RM-M05. The structure and scope are correct; the arithmetic requires correction.

**Overall §A15–§A19 verdict:** All five entries are present (satisfying the presence requirement). §A15, §A16, and §A17 are complete. §A18 is substantially complete but inherits the 2040 task count inconsistency from RM-M04. §A19 contains arithmetic inconsistencies requiring correction (RM-M02, RM-M05).

---

## Summary Count

| Severity | Count | Findings |
|----------|-------|----------|
| Blocker  | 1     | RM-B01 |
| Major    | 6     | RM-M01 through RM-M06 |
| Minor    | 5     | RM-N01 through RM-N05 |
| Nit      | 3     | RM-Nit01 through RM-Nit03 |
| **Total** | **15** | |

---

## Key Patterns

The dominant failure mode across the Question (b) sections is **invented load-bearing constants with no derivation, no uncertainty bound, and no heritage anchor placed precisely where the arithmetic closes.** The most consequential instance is the 1-OOD-alert/sortie/humanoid rate (RM-B01), which is the single number that converts the cognitive load model from a system that could exceed its 8 person-hour capacity into one with an apparently comfortable 2× headroom margin. A reviewer who accepts that number without question reads a closed budget; a reviewer who asks where it comes from finds nothing. The same pattern appears at lesser severity in the 0.6 concurrency factor (RM-M01), the 0.2 person-hours/robot-hour periodic supervision cost (RM-M03), the 60% checkpoint demand reduction at 2040 (RM-M04), the 15–30 minute SPE response window (RM-M06), and the 5–10× productivity differential (RM-N04). Every structural closure point in the teaming model rests on at least one number that was chosen to produce the desired result rather than derived from data. This is not evidence of dishonesty — it is evidence of a model that was built from the answer backward. The fix is to (1) label every invented constant explicitly as a parametric planning assumption, (2) add a sensitivity table showing what happens when each constant is varied by ±50%, and (3) identify which constants are program commitments requiring analog data before the 2029 gate, vs. which are merely notional at concept phase. Until that sensitivity table exists, the 2× headroom claim should not be presented as a program commitment.
