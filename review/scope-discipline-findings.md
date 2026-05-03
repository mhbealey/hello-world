---
title: Scope Discipline Review Findings
status: findings-complete
owner: scope-discipline-reviewer
last-updated: 2026-05-03
---

# Scope Discipline Review Findings

## Summary

| Severity | Count |
|----------|-------|
| Blocker  | 0     |
| Major    | 6     |
| Minor    | 5     |
| Nit      | 4     |

No section is a design document in disguise — the blocker threshold is not crossed. But four sections are materially over length, and the overrun in `04-sensing-autonomy.md` is almost entirely attributable to two passages that read as field survey rather than program input. Addressing all majors brings total word count down by an estimated 2,400–3,200 words and brings every section within or near its target range.

---

## Word count assessment

| Section | Words | Target | Assessment |
|---------|-------|--------|------------|
| 01-overview.md | 1,931 | 1,200–1,800 | Marginally over. The heritage table is the right artifact; length is in the table rows and notes. Defensible if the table content is the deliverable. |
| 02-form-factor-tradespace.md | 3,881 | 1,800–2,500 | Over by ~1,400 words. The evaluation matrix and position sections are well-scoped; the candidate descriptions (Section 1, ~1,200 words) and the dissenting position (Section 5, ~200 words) are the primary sources of overrun. |
| 03-actuation-structures.md | 3,394 | 1,800–2,500 | Over by ~900 words. Mass allocation table and open questions are appropriate. The actuation trade narrative is detailed but largely on-scope. The over-length is mainly in the hydraulic actuation elimination argument (~350 words) and in the structural mass fraction derivation (~200 words). |
| 04-sensing-autonomy.md | 5,182 | 1,800–2,500 | Over by ~2,700 words. This is the primary problem section. Two passages (the foundation models field survey in Section 4, and the autonomy stack narrative in Section 3) account for ~1,500 words of the overrun and serve general robotics education more than they serve this specific program. |
| 05-environments-hardening.md | 4,422 | 1,500–2,000 | Over by ~2,400 words. For a requirements-plus-strategy section, this is 2–2.5× target. The environment requirements table (Section 1) is highly compressed and appropriate; the overrun is in the four subsections of Section 4 (system-level dust mitigation) and in the thermal design prose (Section 2), which both run longer than necessary. |
| 06-mass-power-budget.md | 4,048 | 1,200–1,800 | Over by ~2,200 words. A budget section should be tables plus derivations plus closure assessment. The tables and derivations are appropriate; Section 3 (budget closure assessment, ~300 words) and Sections 4–6 (cross-coupling summary, assumption logging, downstream inputs, ~800 words) are conceptually right but together push the section to roughly double target. The power actuation footnote (~150 words) crosses into design-level analysis. |

---

## Findings

### SD-001 — Major — 04-sensing-autonomy.md — Foundation models field survey displaces program analysis

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Major
**Location:** Section 4, "Foundation Models and Vision-Language-Action Systems: Capabilities and Failure Modes" (entire section, approximately lines 173–183)
**Issue:** Section 4 is approximately 700 words surveying the general state of the foundation model / VLA field: what systems exist (Figure 02 OpenAI VLA, Optimus, RT-2, pi0), what they can and cannot do generally, how they fail under distribution shift. This is field orientation material, not program analysis. The section answers "what is the state of foundation model robotics in 2026" rather than "what role does foundation model inference play in the autonomy architecture of this 75 kg bipedal humanoid for the lunar far side base?" The study position — foundation models belong at the supervisory layer, not the reactive or deliberative layers — is already stated clearly in Section 3 (supervisory layer description) and in Section 5 (autonomy/teleoperation boundary). Section 4 reiterates that position at length while adding the field survey context that is not needed to support or justify it. The specific program commitment (foundation models are in, but only at the supervisory layer, with a gate at 2029 for revisiting) can be stated in four to six sentences without the survey. The failure modes that matter for this architecture (out-of-distribution behavior, SEU corruption of model weights, inference latency vs. reactive control timing) are already noted in Section 4's own paragraphs; they do not need the preamble about what systems currently exist commercially.
**Recommended action:** Remove the survey framing ("What exists" and "What these systems cannot do reliably" as distinct paragraph topics). Compress Section 4 to a single ~150-word program-position paragraph that states: (1) foundation models are enabled for the supervisory layer; (2) their failure modes under radiation-induced bit errors and out-of-distribution lunar environments are the two program-relevant risks; (3) the 2029 gate decision criteria for expanding their role. The field context (RT-2, pi0, Figure 02 VLA) can be reduced to a single reference citation rather than a narrative survey.
**Estimated word saving:** ~500 words

---

### SD-002 — Major — 04-sensing-autonomy.md — Autonomy stack narrative repeats and extends beyond program scope

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Major
**Location:** Section 3, "Autonomy Stack" — specifically the reactive layer, deliberative layer, and supervisory layer subsections (~lines 147–170, approximately 600 words of prose)
**Issue:** The autonomy stack section has two parts: an ASCII diagram of the three-layer architecture (appropriate, compact, high value) and then ~600 words of narrative that for each layer describes: (a) what terrestrial systems demonstrate, (b) the TRL gap, and (c) what is needed to close the gap. The gap characterization and work-to-close are conceptually appropriate for a concept paper. However, the prose for each layer reads longer than it needs to because it re-establishes the general properties of each layer before stating the program-relevant gap. For example, the reactive layer paragraph begins by describing what "balance recovery" is and what "Atlas Electric and Unitree H1 have demonstrated" — general robotics context that the reader of this study does not need explained. The same pattern recurs in each layer. The program-relevant content in each layer is: (1) current space TRL, (2) what specifically is missing for this mission (lunar 1/6g, regolith, communication latency), and (3) what work is required by the 2029 gate. That content is already present; it is surrounded by general-context narrative that inflates the word count without adding actionable program content.
**Recommended action:** Compress each autonomy stack layer to 3–5 sentences: space TRL, the mission-specific gap (not the general description of what the layer does), and the required validation program. The ASCII diagram is worth keeping; it anchors the architecture clearly. The Lunokhod counterpoint at the end of Section 5 (~250 words) is well-scoped and should be retained.
**Estimated word saving:** ~350–400 words

---

### SD-003 — Major — 05-environments-hardening.md — Dust mitigation subsections run 2× necessary length

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Major
**Location:** Section 4, subsections 4.1 through 4.3 (~lines 120–148, approximately 700 words)
**Issue:** The system-level dust mitigation section covers four sub-topics: optical sensors, thermal radiators, electrical connectors, and joint seals (summary reference). The joint seals subsection (4.4) is appropriately brief — it correctly defers to Section 01-03 rather than restating it. The other three subsections each follow a pattern: state the failure mode, evaluate options, state the position, then continue with implementation detail that belongs in a design document rather than a concept paper. Subsection 4.1 (optical sensors) includes the mechanism of EDD (electrostatic dust deflection), the physics of why it works and fails (variable particle charge polarity, 1/6g settling force), and the specific implementation (ITO-coated electrode grids) — this is 150 words of technology description that supports a single conclusion: EDD is a growth provision, covers and cleaning are the baseline. The conclusion takes one sentence; the justification for rejecting EDD does not need to recite EDD's operating mechanism. Subsection 4.3 (connectors) similarly describes three connector failure modes in specific technical detail before reaching the position (dust caps + N₂ purge). The positions themselves are correct and should be kept; the analytical paths to those positions are longer than concept-paper fidelity requires.
**Recommended action:** Compress each dust subsection to: (1) the threat statement (one sentence), (2) the study position (one to two sentences), (3) the TRL or heritage basis (one citation or reference to the relevant section). Remove the option-evaluation narratives within each subsection; those belong in a design review, not a concept paper. The connector failure mode taxonomy (contact resistance, dielectric breakdown, mechanical jamming) is an example of content that should be removed or reduced to a parenthetical.
**Estimated word saving:** ~350–450 words

---

### SD-004 — Major — 05-environments-hardening.md — Thermal design section contains parametric modeling prose that belongs in a budget appendix

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Major
**Location:** Section 2, "Thermal Design Position" — specifically the survival heater derivation, driving temperature table, and MLI/radiator trade paragraphs (~lines 29–71, approximately 650 words)
**Issue:** Section 2 contains a multi-part thermal analysis: a subsystem driving temperature requirements table (six rows), a parametric survival heater estimate derived from Mars rover WEB scaling (~200 words of derivation), and an MLI/radiator trade by body region (four sub-bullets). This material is doing the work of a thermal design analysis rather than stating a concept-paper position. The concept-paper deliverable for the thermal section is: (1) what is the thermal survival requirement, (2) what is the position (hibernation strategy), and (3) what does downstream need to plan against. The positions are present and correct; the survival heater derivation showing "50 W lower bound from MLI effectiveness, 150 W upper bound from bipedal surface area" is appropriate at a concept paper as a parametric range. But the table of per-subsystem minimum operating temperatures, the Mars rover WEB scaling arithmetic written out in prose ("scaled to the humanoid's smaller electronics volume but longer lunar night... the survival heater estimate becomes..."), and the four-point MLI trade by body region all cross into subsystem design territory. These are preliminary thermal design artifacts, not concept-paper positions. The result from this analysis — 70–200 W FSP reservation — is the number that matters, and it is correctly stated. The derivation path can be reduced.
**Recommended action:** Remove the per-subsystem driving temperature table (its values are established in 01-03 and 01-04 for the relevant components; restating them here duplicates content). Replace the Mars rover WEB scaling derivation with a one-sentence parametric statement citing the range and the Mars rover analog. Compress the MLI by body region trade to two sentences (torso can be fully blanketed, limbs cannot; structural surface temperatures accepted near ambient). Retain the final parametric estimates (70–200 W FSP reservation per humanoid) and the coordination note to conops-integrator. The information that matters for program planning survives; the thermal engineering derivation does not need to be in the concept paper.
**Estimated word saving:** ~350–450 words

---

### SD-005 — Major — 02-form-factor-tradespace.md — Candidate descriptions are overlong for their role as evaluation setup

**Section:** `study/01-optimal-space-humanoid/02-form-factor-tradespace.md`
**Severity:** Major
**Location:** Section 1, Candidates C through F (~lines 43–88, approximately 500 words)
**Issue:** Candidates A and B receive detailed treatment that is justified by their role as the primary candidate and strongest alternative, respectively. Candidates C (Quadrupedal + Arms), D (Fixed Platform), and E (Modular Reconfigurable) each receive full subsections (100–180 words each) with heritage cites, detailed in/out arguments, and key heritage lists. These three candidates are evaluated as out-of-scope (C: out for primary role; D: out for primary role; E: out for baseline). Candidate F (Teleoperated Avatar) is not a separate form factor — the section itself notes this — yet it receives its own 200-word treatment. For candidates that are quickly eliminated, the function of their description is to establish that they were seriously considered and why they were rejected. That function can be served in one to two sentences each, followed by their scores in the evaluation matrix, rather than full subsection treatments. The evaluation matrix already provides the comparative basis; the candidate descriptions for the out-candidates are redundant with the matrix in most of their content. The DARPA Robotics Challenge context in Candidate E (~60 words) is general robotics background not tied to this specific platform's rejection.
**Recommended action:** Compress Candidates C, D, and E each to 3–5 sentences: form factor definition, primary liability for this mission, in/out call with one sentence of basis. Candidate F should be reduced to a parenthetical in Candidate A's section or eliminated entirely since the section explicitly identifies it as an operating mode, not a platform decision. The evaluation matrix carries the comparison; the candidate descriptions only need to establish what each candidate is and why it was included or excluded.
**Estimated word saving:** ~350–400 words

---

### SD-006 — Major — 06-mass-power-budget.md — Actuation power footnote is a design-level derivation, not a budget closure item

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Major
**Location:** Section 2, "Actuation power notes" paragraph (~lines 93–96, approximately 170 words)
**Issue:** The actuation power notes paragraph walks through a multi-step scaling calculation: start from Valkyrie at ~1,800 W for 129 kg, apply mass ratio (75/129), apply efficiency factor (0.85), allocate 65% to locomotion, apply a 0.55 normal-vs-vigorous gait factor to reach 260 W. This is a parametric derivation chain that is appropriate for a design document footnote or an appendix. In a concept-paper budget section, the correct approach is: state the heritage anchor, state the parametric assumption, state the resulting number, and flag the uncertainty. The multi-step arithmetic chain does not belong in the body of a concept-paper section — it belongs in the margins register (as an assumption) or in a supporting calculation file. The budget table already lists the 260 W figure; this paragraph is the derivation of that figure, which is a level of analysis below concept-paper scope.
**Recommended action:** Replace the actuation power notes paragraph with two sentences: one stating the parametric scaling from Valkyrie heritage and the resulting 260 W design-to figure, and one flagging it as an unvalidated parametric assumption that must be confirmed by task-level simulation. The full derivation arithmetic can be preserved in §A3 of the margins register as the assumption's supporting basis rather than in the body of the section.
**Estimated word saving:** ~120 words

---

### SD-007 — Minor — 03-actuation-structures.md — Hydraulic actuation elimination is longer than warranted for a candidate that is quickly disqualified

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Minor
**Location:** Section 1, "Hydraulic Actuation" subsection (~lines 25–26, approximately 300 words)
**Issue:** The hydraulic actuation candidate receives ~300 words including a description of the pre-2024 Atlas architecture, a description of why Boston Dynamics abandoned it, and two space-specific disqualifying problems. Hydraulic is eliminated from further consideration at the end of this paragraph. For a concept paper, the elimination argument is: hydraulic actuation is disqualified by vacuum outgassing risk and by crew serviceability (hydraulic line failures cannot be diagnosed/repaired in EVA gloves). Both points are correct and require citation. The Boston Dynamics transition rationale (~100 words describing operational complexity, leak risk, pump noise, startup time, and proportional valve fine motor control challenges) is supporting color rather than program analysis — these are terrestrial liabilities that are superseded by the two space-specific disqualifiers. A reader who already knows hydraulic actuation's terrestrial liabilities does not need them explained here; a reader who does not know them does not need to know them to understand why hydraulic actuation fails in space.
**Recommended action:** Compress the hydraulic actuation section to two sentences plus a citation: the space-specific disqualifiers (vacuum outgassing and crew serviceability) are sufficient to eliminate it, with the note that Boston Dynamics' own transition to electric provides supporting heritage for the architectural direction.
**Estimated word saving:** ~150 words

---

### SD-008 — Minor — 04-sensing-autonomy.md — Joint state sensing subsection is infrastructure acknowledgment, not a concept-paper position

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Minor
**Location:** Section 1, "Joint State Sensing" subsection (~lines 59–61, approximately 100 words)
**Issue:** The joint state sensing subsection explicitly notes "This is infrastructure, not a novel sensor choice: every operational humanoid carries it." It is included to account for data bandwidth (38 joints × 1 kHz × 4 channels ≈ 600 kbps). The bandwidth figure is the only program-relevant output of this subsection; it feeds the compute architecture. That output can be delivered as a sentence in the compute architecture section (Section 2) without a standalone subsection. The subsection's primary function appears to be completeness for the sensor survey — but the section scope is not "complete sensor survey of all sensors on the robot," it is "sensor suite for this specific mission." Infrastructure sensors that the compute architecture must accommodate do not need their own subsection; they need a note.
**Recommended action:** Remove the joint state sensing subsection. Add a single sentence to Section 2 (compute architecture, data bandwidth) noting that joint state telemetry (38 joints at 1 kHz) contributes ~600 kbps to the onboard bus and is carried within the compute architecture's real-time loop without novel sensor requirements.
**Estimated word saving:** ~80 words

---

### SD-009 — Minor — 05-environments-hardening.md — Section 5 (Lunar Night Survival Mode) repeats content from Section 2

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md`
**Severity:** Minor
**Location:** Section 5, "Lunar Night Survival Mode" (~lines 158, approximately 220 words)
**Issue:** Section 5 re-describes the lunar night hibernation state: all locomotion controllers and Tier 2 compute powered off; Tier 1 supervisor in monitoring loop; survival heaters maintain electronics above −40°C and battery above 0°C; joint heaters maintain HD-Electric joints above −60°C; docked at recharge station; FSP power draw 70–200 W; warm-up times 15–30 minutes to partial operability, 45–90 minutes to full operability. Most of this content was established in Section 2 of the same file (thermal design position). The warm-up times and the hibernation state description are new to Section 5, but the thermal power figures and the hibernation operational concept are repeated. The warm-up times (~30 words) should be retained somewhere — they are operationally relevant and are correctly passed to the mass-power budget section. But they do not need their own 220-word section; they can appear as a note within Section 2 or as a bullet in the TRL flags summary.
**Recommended action:** Remove Section 5 as a standalone section. Incorporate the warm-up time estimates (the only new information) into Section 2 as a brief operational note. Retain the FSP draw figure and the 3-year ORU context that Section 5 adds only by reference to Section 3.
**Estimated word saving:** ~150–180 words

---

### SD-010 — Minor — 06-mass-power-budget.md — Section 5 (new assumption logging) is a process artifact, not document content

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md`
**Severity:** Minor
**Location:** Section 5, "New Assumption: Battery Energy Density (§A13)" (~lines 130–141, approximately 200 words)
**Issue:** Section 5 is an assumption logging entry — it explains the protocol for adding to the margins register and then re-states the §A13 battery energy density assumption in full narrative form. This is process metadata, not concept-paper content. The assumption itself (160 Wh/kg design-to, 150 Wh/kg conservative floor, technology gate conditions) is already embedded in Section 1 (battery sizing derivation) where it is introduced. A note that "this assumption has been logged as §A13 in the margins register" is appropriate in the document; a full 200-word re-statement of the assumption is not. The cross-coupling summary (Section 4) already references §A13 by name, which is the correct level of engagement.
**Recommended action:** Remove Section 5 entirely. Replace with a single sentence at the end of Section 1: "Battery energy density assumption logged as §A13 in the margins register; risk owner is humanoid-systems-architect with 2029 and 2032 review gates." The margins register is the authoritative home for assumption text; the document should reference it, not duplicate it.
**Estimated word saving:** ~170 words

---

### SD-011 — Minor — 02-form-factor-tradespace.md — Raw weighted total arithmetic in Section 3 is appendix material

**Section:** `study/01-optimal-space-humanoid/02-form-factor-tradespace.md`
**Severity:** Minor
**Location:** Section 3, evaluation matrix — the "Raw weighted totals" block following the table (~lines 123–128, approximately 100 words)
**Issue:** After the evaluation matrix table, Section 3 includes a full arithmetic expansion showing each candidate's weighted total step by step: "A (Bipedal): 5(0.25) + 3(0.20) + 2(0.15) + 3(0.15) + 4(0.10) + 4(0.10) + 5(0.05) = 1.25 + 0.60 + 0.30 + 0.45 + 0.40 + 0.40 + 0.25 = 3.65." This arithmetic is implicit in the matrix table itself and adds nothing substantive to the reader's understanding. It is the kind of working arithmetic that belongs in a supporting calculation sheet, not in a concept-paper section body. The corrected weighted totals (the table shows 3.60 but the arithmetic shows 3.65 — a transcription discrepancy) are the only non-obvious output, and they would be better served by a note that corrects the table values than by re-deriving the full arithmetic.
**Recommended action:** Remove the full arithmetic expansion block. Update the table's weighted total row to show the corrected values (3.65 for bipedal, 3.55 for centaur, etc.) and add a table note: "Weighted totals recalculated from cell values; table corrected to match." One sentence of commentary on the narrow bipedal-centaur gap (currently the paragraph following the arithmetic block) is worth retaining.
**Estimated word saving:** ~80 words

---

### SD-012 — Nit — 01-overview.md — Open questions section addresses form-factor tradespace reader, not section purpose

**Section:** `study/01-optimal-space-humanoid/01-overview.md`
**Severity:** Nit
**Location:** Section "Open Questions (to be resolved in subsequent sections)" — Questions 3, 4, and 5 (~lines 60–65)
**Issue:** The open questions section frames questions that are appropriate for the form-factor tradespace section (01-02) and downstream sections, not for a heritage table section. The heritage table section's purpose is to document what exists and what is missing — the heritage gaps section does this well. The open questions section is effectively a preview of what 01-02 through 01-04 will answer. Questions 3 (SEA vs. QDD), 4 (autonomy under latency), and 5 (single vs. dual form factor) are addressed in downstream sections and are not output of the heritage table itself. This is not wrong — forwarding open questions to downstream sections is a legitimate concept-paper practice — but it adds length to the overview section without being heritage content.
**Recommended action:** Compress to two or three questions that are specifically unresolved by the heritage table content itself: the mass constraint (Question 1) and the DOF count (Question 2) are genuinely downstream-affecting outputs of the table. The actuation type, autonomy level, and form factor questions (3, 4, 5) are section previews that the section headers in 01-02 through 01-04 already provide; they can be removed or reduced to one-sentence references.
**Estimated word saving:** ~120 words

---

### SD-013 — Nit — 03-actuation-structures.md — Structural mass fraction derivation includes terrestrial heritage arithmetic that is not load-bearing

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md`
**Severity:** Nit
**Location:** Section 2, "Structural Mass Fraction" (~lines 87–89, approximately 100 words)
**Issue:** The structural mass fraction paragraph estimates that structure + actuation = 45–55% of total system mass for terrestrial humanoids, then states this study targets ≤40%. The terrestrial 45–55% figure is described as a "parametric assumption" but the basis for that range is not cited — it appears to be an estimate derived from the commercial heritage robots whose system mass breakdowns are not published. Since this figure is used only to establish that 40% is "aggressive relative to terrestrial heritage," and since the specific 30.0 kg target has already been established from the Atlas/Valkyrie heritage scaling (per Section 4), the 45–55% parametric comparison adds little to the argument. It is background context rather than a program commitment.
**Recommended action:** Remove the "45–55% in terrestrial humanoids" parametric statement. The 30.0 kg design-to target is justified by the detailed Section 4 mass allocation table; the comparison to a general terrestrial fraction is not needed and introduces an uncited parametric estimate.
**Estimated word saving:** ~60 words

---

### SD-014 — Nit — 04-sensing-autonomy.md — LIDAR subsection includes terrain sensor rationale already established in locomotion requirements

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Nit
**Location:** Section 1, "LIDAR and Point Cloud" — first paragraph (~lines 51–53)
**Issue:** The LIDAR subsection opens by explaining why passive stereo vision degrades on low-texture surfaces, and why lunar regolith is among the lowest-texture surfaces in the solar system. This rationale has already been established by the operational environment description (far side base, lunar regolith locomotion requirements) and by the constraints from Section 01-02. The reader of a concept paper does not need the LIDAR choice justified by a general explanation of stereo vision limitations; they need the LIDAR specification (what kind, what power, what mass, what TRL gap) and a heritage citation. The opening justification paragraph (~80 words) is unnecessary preamble.
**Recommended action:** Remove the opening justification paragraph for LIDAR. Begin the subsection directly with the Mars rover heritage connection (Perseverance AutoNav as the applicable point-cloud terrain planning heritage) and the sensor specification. The Digit cite already referenced in the survey table establishes that LIDAR is standard in operational humanoids; no additional justification is needed.
**Estimated word saving:** ~70 words

---

## Estimated total word saving from addressing all findings

| Severity | Findings | Estimated savings |
|----------|----------|-------------------|
| Major (6) | SD-001 through SD-006 | ~1,820–2,000 words |
| Minor (5) | SD-007 through SD-011 | ~580–660 words |
| Nit (4) | SD-012 through SD-014 | ~250–330 words (plus SD-011 already counted above as minor) |
| **Total** | **15** | **~2,650–3,000 words** |

After addressing all findings, estimated section word counts would be:

| Section | Current | After | vs. Target |
|---------|---------|-------|------------|
| 01-overview.md | 1,931 | ~1,810 | Within 1,200–1,800 (just above; minor residual) |
| 02-form-factor-tradespace.md | 3,881 | ~3,350 | Still over 2,500; further tightening needed in Section 4 prose |
| 03-actuation-structures.md | 3,394 | ~3,085 | Still over 2,500; over-length is distributed, not in a single removable block |
| 04-sensing-autonomy.md | 5,182 | ~4,200 | Materially improved; requires one more round of compression to reach target |
| 05-environments-hardening.md | 4,422 | ~3,380 | Closer to target; Section 2 and Section 3 (radiation options) still have compression opportunity |
| 06-mass-power-budget.md | 4,048 | ~3,680 | Budget sections are inherently table-heavy; may be acceptable if tables are considered against a higher word count target (~2,500) |

**Assessment:** Addressing the six majors brings the most over-length sections within a single additional editing pass of their targets. `02-form-factor-tradespace.md` and `03-actuation-structures.md` will remain over target after these changes and will require a second tightening pass focused on the position justification prose in their final sections (Sections 4–5 of 02, Sections 1–2 of 03). The tables and allocation figures in 06 justify some additional length; the 1,200–1,800 word target for a budget section should be reconsidered to 1,800–2,500 given the table-heavy nature of the deliverable.

---

## Pattern diagnosis

Two recurring patterns produce most of the overrun:

1. **Position justification over-explains the path, not just the conclusion.** Concept papers take positions. The path to the position (the rejected alternatives, the option evaluation mechanics) should be shorter than the position itself. In multiple sections, the rejection argument for a losing option is as long as the winning option's justification. This inflates length without adding program value.

2. **General field context is inserted to support positions that do not need it.** The foundation models survey (SD-001), the hydraulic actuation terrestrial liabilities (SD-007), the stereo vision degradation explanation (SD-014) — all are field-orientation material inserted to justify positions that the heritage citations already support. A concept paper citing Valkyrie and Atlas Electric does not also need to explain how harmonic drives work or how stereo vision fails on low-texture surfaces. The citations do the supporting work; the inline explanations are redundant.
