---
title: Stage 6 Review Triage
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Stage 6 Review Triage

## Summary

- **Blockers: 10** (all must be resolved before stage 6 closes)
- **Majors: 41** (Priority 3 below selects the 12 most load-bearing for stage 6; remaining 29 deferred)
- **Minors: 30** (deferred — future cleanup pass)
- **Nits: 19** (deferred)

51 blockers+majors exceeds the scaffolding's 50-finding threshold, confirming stage 5 agents drifted badly on both scope (word count) and technical discipline (unsupported numbers, broken heritage, arithmetic errors). This is useful calibration data.

---

## Priority 1 — Cross-reviewer patterns

Two findings were independently identified by 2+ reviewers on the same section/claim.

### P1-A — Tradespace evaluation matrix scores wrong (AE-003 + CC-002)

**Flagged by:** aerospace-engineer-reviewer (AE-003, Blocker), cross-coupling-reviewer (CC-002, Major)
**Section:** `study/01-optimal-space-humanoid/02-form-factor-tradespace.md` — Section 3, evaluation matrix table "Weighted total" row
**Consolidated issue:** The table's Weighted total row reads A=3.60, B=3.35, C=2.95, D=2.55, E=2.80. The document's own "Raw weighted totals" recalculation below the table gives the correct values: A=3.65, B=3.55, C=3.25, D=2.90, E=2.85. The table overstates the A-vs-B winning margin as 0.25 when the correct gap is 0.10 — 2.5× inflation. The text in Section 4 correctly quotes 3.65 but the table is what readers and downstream agents see first.
**Owning agent:** humanoid-systems-architect
**Required fix:** Correct the Weighted total row in the evaluation matrix to A=3.65, B=3.55, C=3.25, D=2.90, E=2.85. Verify the Section 4 text explicitly states the A-B gap is 0.10 (it currently does implicitly; make it explicit).

### P1-B — Lunar night survival power range mismatch across sections (CC-001 + RM-001)

**Flagged by:** cross-coupling-reviewer (CC-001, Blocker), reliability-margins-reviewer (RM-001, Blocker)
**Sections:** `05-environments-hardening.md` Section 2 (source) → `06-mass-power-budget.md` power table (downstream)
**Consolidated issue:** §05 and the cross-coupling log state electronics/battery survival heaters at 50–150 W. §06's power table shows 85–175 W — a lower bound shift of +70% with no explanation. This changes budget closure narrative materially: §06 currently claims "barely closes at 148 W vs. 150 W goal." At §05's numbers, the lower bound comfortably closes at ~103 W. Additionally (RM-001), the 150 W goal is circular: it is derived from the lower end of the §A10 parametric range, making the "closure at lower bound" conclusion guaranteed by construction rather than by analysis.
**Owning agents:** space-environments (§05 source of truth), humanoid-systems-architect (§06 must match)
**Required fix:** (1) space-environments agent determines which number is correct (50–150 W or 85–175 W) and states the basis for any revision. (2) humanoid-systems-architect updates §06 to match §05, removes the 150 W as a "design goal" since it is a derived estimate not an independent requirement, and rewrites the survival-mode closure row to separate fixed electronics draw (~9 W, closes trivially) from the thermal reservation (open-range, TRL 2, pending thermal model — provision 300 W with margin for FSP planning).

---

## Priority 2 — Standalone blockers (8 remaining after P1)

### P2-1 — DOF table sums wrong; actuation mass allocation breaks (AE-001)

**Reviewer:** aerospace-engineer
**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Issue:** DOF table uses "each" language throughout. Bilateral sum = 51–55 DOF, not 36–40. At 38 joints × 340 g, actuation mass = 13.0 kg. At 51 joints × 340 g, actuation mass = 17.3 kg — 4.3 kg over the 13.0 kg allocation, breaking the 30 kg structure+actuation constraint and cascading into the §06 budget.
**Owning agent:** robotics-actuation-structures
**Required fix:** Reconcile table entries and total. Either (a) restate bilateral entries as totals throughout and recount, or (b) accept 51+ DOF nominal and revise the actuation mass upward. The §06 budget must be re-run after this is resolved. Note: this fix must complete BEFORE humanoid-systems-architect re-runs the §06 budget.

### P2-2 — Radiator sizing violates Stefan-Boltzmann; thermal mass undersized 2–4× (AE-002)

**Reviewer:** aerospace-engineer
**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Issue:** "0.3 m² rejects 300 W at ε=0.70, T_panel=50°C." Stefan-Boltzmann hard limit at those parameters is ~130 W with a 4 K sink; with a realistic effective sink temperature (~243 K, accounting for lunar ground view factor during daytime), maximum rejection is ~100 W from 0.3 m². Required area for 300 W rejection is 0.7–1.5 m². Thermal mass in the budget (3.0 kg at ~10 kg/m²) is undersized by 2–4×, threatening mass closure.
**Owning agent:** humanoid-systems-architect (for §06 correction) in coordination with space-environments (for correct thermal inputs)
**Required fix:** Flag thermal radiator sizing as open (TRL 2, pending detailed thermal model). Do not assert specific radiator area or thermal mass as closed values. Replace with a range derived from the Stefan-Boltzmann limits at the stated panel temperature and realistic sink assumptions, and note the mass budget risk.

### P2-3 — Atlas Electric misidentified as harmonic-drive/roller-screw; HD-Electric heritage argument broken (HC-001)

**Reviewer:** heritage-citations
**Sections:** `01-overview.md` (heritage table), `03-actuation-structures.md` (Section 1)
**Issue:** Heritage table says Atlas Electric uses "planetary roller-screw linear actuators + harmonic drives." Atlas 2024 uses custom fully-rotational direct-drive motors — no harmonic drives, no roller screws. §03 uses Atlas Electric as the primary heritage citation for selecting HD-Electric harmonic drives and the 85–90% efficiency claim. The efficiency claim may be correct (for Atlas's direct-drive actuators) but cannot be used to support harmonic drive selection.
**Owning agents:** humanoid-systems-architect (§01 heritage table), robotics-actuation-structures (§03 heritage argument)
**Required fix:** (1) Correct §01 heritage table Atlas Electric actuator description. (2) Find and cite appropriate HD-Electric harmonic drive heritage for §03 (Harmonic Drive AG technical data, SSRMS joint documentation, or equivalent). The 85–90% efficiency figure may be retained as an electric actuator benchmark but must not be presented as harmonic-drive-specific heritage.

### P2-4 — Chang'e-4 LND citation key non-existent; lead author wrong (HC-002)

**Reviewer:** heritage-citations
**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Issue:** Citation key `zaconte2020lnd` does not exist in `corpus/references.bib`. The paper is attributed to "Wimmer-Schweingruber et al." when the lead author is Shenyi Zhang (Zhang et al., *Science Advances*, 2020, DOI: 10.1126/sciadv.aaz1334). The underlying data point (60 µSv/hr) is correct.
**Owning agent:** space-environments
**Required fix:** Add the correct BibTeX entry to `corpus/references.bib` (Zhang et al. 2020, DOI 10.1126/sciadv.aaz1334). Replace `\cite{zaconte2020lnd}` with the correct key throughout §05. Correct all in-text attribution from "Wimmer-Schweingruber et al." to "Zhang et al."

### P2-5 — Locomotion 260 W built on uncited 0.55 gait factor; budget closure conditional (RM-002)

**Reviewer:** reliability-margins
**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Issue:** The derivation chain Valkyrie 1,800 W → (75/129) → ×0.85 → ×0.65 → ×0.55 = 260 W contains a final 0.55 "normal vs. vigorous gait" multiplier described in the section as having "no direct heritage validation." If this factor is 0.75 (equally unsupported), the budget exceeds the 800 W cap with 30% margin. Budget closure is conditional on an invented multiplier.
**Owning agent:** humanoid-systems-architect
**Required fix:** Add the 0.55 gait factor to the assumption register as §A14. Mark the locomotion power budget closure as conditional pending the gait power validation simulation referenced in §03. The budget section's "Yes, with two qualifications" closure statement must become "Yes, with three qualifications."

### P2-6 — Form factor economic argument unquantified; foundational choice unsupported (DA-001)

**Reviewer:** devils-advocate
**Section:** `study/01-optimal-space-humanoid/02-form-factor-tradespace.md`
**Issue:** The study's foundational commitment — bipedal over centaur and purpose-built variants — rests on the claim that "the cost of dual tool and infrastructure standards over 20 years exceeds the locomotion and mass penalties of the bipedal form." This is stated as a conclusion without any supporting calculation, parametric estimate, or order-of-magnitude analysis. The 0.10-point tradespace gap (3.65 vs. 3.55) is within scoring uncertainty. A program review board would demand the economics at the first review.
**Owning agent:** humanoid-systems-architect
**Required fix:** Add a parametric economic comparison to §02 Section 4 or a new Section 6 subsection: (a) rough task taxonomy for the base broken down by tool-geometry dependency; (b) parametric estimate of recurring cost delta between one-robot-type and two-robot-type programs; (c) crossover sensitivity. This does not need precision — it needs to show the economics argument is directionally correct and that the crossover point is not near the study's assumptions. If ConOps input is needed first, mark the economic conclusion as provisional with an explicit gate.

### P2-7 — Autonomy TRL 6/2029 has no specific demonstration program (DA-002)

**Reviewer:** devils-advocate
**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md` (autonomy stack section); `study/05-cross-cutting/margins-and-assumptions.md` (§A1)
**Issue:** §A1 is honest that TRL 6 by 2029 is a study assumption, not a forecast. But the section does not identify: what specific test demonstrates TRL 6, at what facility, by which organization, at what cost. Without a named first-gate program, §A1 is an assumption without a path. The study currently says "if TRL 6 is missed, the timeline slips" — but a program needs to say "TRL 6 will be demonstrated by [program X] at [facility Y] by [date Z]."
**Owning agent:** robotics-sensing-autonomy (§04 autonomy stack); technology-roadmap-trl should also be noted as the agent responsible for naming the first-gate demonstration program in stage 7
**Required fix:** In §04, add a subsection or paragraph in the Section 3 autonomy stack discussion that specifies the minimum observable for the 2029 TRL 6 gate: what system, running what task, in what environment, validates the gate. The entry for §A1 in the assumptions register should reference this minimum observable. The full technology roadmap (Section 04-01, to be written in stage 7) will carry the detailed program; §04 must at minimum name the gate criteria.

### P2-8 — Systemic: only 3 of ~25 citation keys have BibTeX entries (HC-009, Major treated as near-Blocker)

**Reviewer:** heritage-citations
**Sections:** All six
**Issue:** All six section agents generated citation keys in their text (e.g., `\cite{bostondynamics2024atlas}`) but almost none of these keys have corresponding BibTeX entries in `corpus/references.bib`. Approximately 22 of 25 citation keys are dangling. This makes the document non-functional as a citable study — a reviewer cannot look up any of the cited sources.
**Owning agents:** All subsystem agents are responsible; orchestrator must enforce. This is a systemic fix.
**Required fix:** Before stage 6 closes, each section agent should verify that every citation key used in its section has a corresponding BibTeX entry. The highest-priority keys to add are those cited for load-bearing numerical claims: the Valkyrie R5 fact sheet, the Harmonic Drive AG source for actuator efficiency, the Chang'e-4 LND paper (HC-002 cross-reference), the Mars AutoNav paper, and the ISS battery NTRS document.

---

## Priority 3 — Standalone majors addressed in stage 6

From 41 majors, selecting the 12 most load-bearing. Remaining 29 deferred to a future cleanup pass.

| ID | Reviewer | Section | Issue | Owning agent |
|----|----------|---------|-------|-------------|
| AE-004 | aerospace-eng | §03 | 340 g/joint actuation mass lacks per-joint heritage anchor | robotics-actuation-structures |
| AE-005 | aerospace-eng | §06 | Atlas Electric DOF stated as 56 in heritage table; BD claims 28 | humanoid-systems-architect |
| AE-008 | aerospace-eng | §06 | Battery sized at 100% DoD; no cold-temperature capacity derate stated | humanoid-systems-architect |
| HC-005 | heritage-cit | §01 | Lunokhod 2 39.16 km cited to Huntress 2011 which predates LRO measurement | humanoid-systems-architect |
| HC-006 | heritage-cit | §06 | Per-joint power estimate uses Valkyrie SEA data scaled by uncited factor to represent HD-Electric | humanoid-systems-architect |
| RM-003 | rel-margins | §03 | Actuation 13.0 kg has no concrete per-joint heritage anchor | robotics-actuation-structures |
| RM-004 | rel-margins | §03 | Joints/sealing 4.0 kg (105 g/joint) has no comparable sealed-joint heritage | robotics-actuation-structures |
| CC-003 | cross-coupling | §04→§06 | Sensor peak power 75 W in §04 not reflected in §06 power table (~44 W shown) | humanoid-systems-architect |
| CC-004 | cross-coupling | §04 | Autonomy layer current TRLs (2–4) not reconciled against 2029 TRL 6 gate | robotics-sensing-autonomy |
| CC-005 | cross-coupling | §02 | Candidate A described as "60–130 kg" but locked at 75 kg — pre-lock placeholder not updated | humanoid-systems-architect |
| SD-001 | scope-disc | §04 | Foundation models field survey ~700 words; study position already stated in §§3,5 | robotics-sensing-autonomy |
| SD-003 | scope-disc | §05 | Dust mitigation subsections run 2× target; option-evaluation prose replaces table rows | space-environments |

---

## Deferred — minors and nits

18 additional majors, 30 minors, and 19 nits are deferred to a future cleanup pass. These are tracked in the individual findings files.

---

## Dispatch plan

**Sequencing constraint:** P2-1 (DOF count fix, §03) must complete before the §06 budget re-run. P1-B §05 reconciliation (survival heater range) must complete before the §06 survival-mode fix. All other fixes are parallel-safe within an agent.

**Batch 1 (parallel — four agents):**

| Agent | Findings to address | Key outputs |
|-------|---------------------|-------------|
| robotics-actuation-structures | P2-1 (DOF), P2-3 §03 (Atlas heritage), AE-004/RM-003 (actuator mass), RM-004 (joint mass) | Corrected §03 with reconciled DOF total and updated mass breakdown |
| space-environments | P1-B §05 (heater range source of truth), P2-4 (Chang'e-4 citation), SD-003 (dust section compression) | Corrected §05 with fixed citation and confirmed heater range |
| robotics-sensing-autonomy | P2-7 (TRL 6 gate criteria), CC-004 (TRL path per layer), SD-001 (foundation model survey compression) | Updated §04 with gate criteria and compressed foundation model section |
| humanoid-systems-architect §02 only | P1-A (matrix arithmetic), P2-6 (economics analysis), AE-003 (same as P1-A), CC-005 (candidate A mass), HC-005 (Lunokhod citation) | Corrected §02 with fixed matrix and parametric economics |

**Batch 2 (after Batch 1 — humanoid-systems-architect §06 + §01):**

| Agent | Findings to address | Key outputs |
|-------|---------------------|-------------|
| humanoid-systems-architect §06 + §01 | P1-B §06 (survival mode fix), P2-2 (radiator flag as open), P2-5 (gait factor §A14), AE-005 (Atlas DOF), AE-008 (battery DoD), HC-006 (per-joint power), CC-003 (sensor peak power), P2-3 §01 (Atlas heritage table correction) | Re-run budget with corrected DOF and heater range; add §A14; correct §01 Atlas entry |

**GitHub sync:** After triage.md is written, sync all Priority 1 and Priority 2 findings to GitHub issues.
