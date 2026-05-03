---
title: Scope Discipline Review Findings
status: findings-complete
owner: scope-discipline-reviewer
last-updated: 2026-05-03
stage: 8
---

# Scope Discipline Review Findings — Stage 8
## Section 02 (Human-in-the-Loop), all four subsections

---

## Word Count Verification

Independent review confirms the following counts (estimated from line density and content inspection; "verified" means reviewer agrees with the known-count figure within ±5%):

| Section | Self-Reported | Known Count (Task Brief) | Reviewer Estimate | Target Range | Hard Cap | Status |
|---------|--------------|--------------------------|-------------------|--------------|----------|--------|
| §02-01 `01-overview.md` | ~1,720 | ~1,717 | ~1,720 | 1,500–2,000 | 2,400 | **Within target** |
| §02-02 `02-latency-tradespace.md` | ~3,000 | ~4,277 | ~4,200–4,300 | 1,800–2,500 | 3,000 | **Major — 43% over cap** |
| §02-03 `03-autonomy-trl-tasking.md` | (no self-report) | ~4,470 | ~4,400–4,500 | 1,800–2,500 | 3,000 | **Major — 49% over cap** |
| §02-04 `04-teaming-model.md` | ~3,340 | ~4,417 | ~4,400–4,450 | 2,500–3,500 | 4,200 | **Major — 5% over cap** |

**Note on §02-02 self-report:** The file's own footer reads "approximately 3,000 words (at hard cap)." The actual word count is approximately 4,200–4,300, which is 43% over the 3,000-word hard cap. The self-report is incorrect by ~1,277 words. The owning agent should correct this.

**Note on §02-04 self-report:** The file's footer reads "approximately 3,340 words." The actual count is approximately 4,400–4,450, a discrepancy of ~1,060–1,110 words. The self-report is materially incorrect.

---

## Severity Summary

| Severity | Count |
|----------|-------|
| Blocker | 0 |
| Major | 7 |
| Minor | 3 |
| Nit | 2 |

No section crosses 2× its hard cap. Both §02-02 and §02-03 are in the 43–49% over-cap band; §02-04 is 5% over cap. Removable-content maps are mandatory for all three.

---

## Findings

---

### SD-8-001 — Major — §02-02 — Section 4 substantially duplicates Section 01-04's forward-deployment argument

**Severity:** Major
**Location:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 4, "The Forward-Deployed-Human Argument" — entire section (~500 words)
**Issue:** Section 4 re-argues the forward-deployment case at length: what the crew loses moving from ≤50 ms to 2.8 s, the medical emergency scenario, and a productivity differential estimate of 5–10×. All three arguments are stated, often in nearly identical language, in Section 02-01 (Overview), paragraphs 4 and 5 of Section 4 ("The Forward-Deployed-Human Commitment"). The Overview section already contains the "operator is reviewing the robot's history" framing, the medical emergency scenario, and the latency gap quantification. Section 4 of §02-02 repeats this content at approximately the same level of detail, adding only the productivity differential estimate (~80 words). The section is structurally appropriate as a conclusion to the latency analysis — it is correct that the latency argument should close with an architectural implication — but it should do so in ~100 words, not ~500.
**Recommended action:** Compress Section 4 to one closing paragraph (~100 words) stating the architectural conclusion (Earth-supervision is not a viable primary mode for this task profile; forward deployment is a physics-driven requirement) and citing §02-01 for the full argument. Retain the productivity differential number (5–10× advantage) as it is the only new quantitative output of this section. The medical emergency scenario and the "reviewing history" framing should be deleted here as they already appear in full in §02-01.
**Estimated word saving:** ~400 words

---

### SD-8-002 — Major — §02-02 — Performance Degradation Curve subsection narrates what the heritage anchors already established

**Severity:** Major
**Location:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 2, subsection "Performance Degradation Curve — Summary Position" (~350 words)
**Issue:** The three heritage anchors (Lunokhod, METERON/KONTUR-2, Sheridan/Verplank) each establish specific latency performance characteristics. The "Summary Position" subsection then re-narrates the same latency regime properties in five paragraphs keyed to the same five tiers, without adding new data or changing the conclusions. Each paragraph restates content from the preceding heritage anchors while adding operational glosses that are already implied. For example, the "1–5 s" paragraph repeats the frame-advance adaptation, the Lunokhod crater incident, and the reactive autonomy requirement — all of which were stated at greater precision in the Lunokhod heritage anchor. The ">60 s" paragraph ("Jupiter and beyond") covers a destination that is explicitly out of scope for the first operational decade and adds nothing to the latency argument for the lunar far-side case. The "200 ms–1 s" paragraph describes predictive display requirements for a regime that is not the primary operating mode for any role in this architecture.
**Recommended action:** Remove the "Performance Degradation Curve — Summary Position" subsection entirely, or compress it to a single four-row summary table (latency band | operational mode | viable for far-side base? | architectural implication) of approximately 100 words, replacing ~350 words of prose. The heritage anchors have already done the analytical work; a synthesis table is sufficient to close the section. The out-of-scope ">60 s" tier should be removed entirely.
**Estimated word saving:** ~250–300 words

---

### SD-8-003 — Major — §02-02 — Section 5 (Communications Architecture implications) is an engineering requirements list, not a concept-paper finding

**Severity:** Major
**Location:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 5, "Implications for Communications Architecture" (~280 words)
**Issue:** Section 5 lists three communications architecture requirements: relay availability >95%, latency budget discipline (minimize stack overhead), and bandwidth secondary to latency. These are engineering requirements that belong in the far-side-base-architect's section or in the ConOps section, not in a latency tradespace analysis section. The latency tradespace section's job is to derive the latency numbers and the operational implications — which it has done. The "pass these requirements downstream" function is handled by Section 6 (Inputs to Autonomy-TRL-Tasking), which is the correct mechanism. Section 5 reads as a requirements allocation exercise rather than a tradespace finding, and it partially duplicates the §A17 relay assumption already logged in the assumptions register.
**Recommended action:** Remove Section 5 as a standalone section. Relocate the >95% relay availability requirement to a one-sentence note at the end of Section 1 (Latency vs. Destination), where it belongs next to the Queqiao-2 availability estimate. Remove the bandwidth and latency-budget-discipline paragraphs entirely — they are downstream design requirements that do not need to appear in this section. The total word saving from removing Section 5 is approximately 280 words; the net information loss is zero given the existing §A17 entry.
**Estimated word saving:** ~280 words

---

### SD-8-004 — Major — §02-02 — Section 1 Queqiao-2 relay availability estimate includes speculative constellation planning beyond section scope

**Severity:** Major
**Location:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 1, "Relay Availability" paragraph (~160 words, beginning "Published sources indicate...")
**Issue:** The relay availability paragraph begins with an appropriate estimate of current Queqiao-2 dual-link coverage (75–85%), then extends into a projection for a "24-hour relay constellation (two or more Queqiao-class satellites phased 180° apart)" achieving >95% availability. This constellation architecture recommendation is a far-side-base-architect deliverable, not a latency tradespace finding. The latency section's job is to identify what availability is needed (>95%) and what current assets provide (75–85%). The gap between those two numbers is an open question that creates a requirement for the constellation design — it is not the latency section's job to propose the constellation. Additionally, the concluding note ("By the 2038–2040 IOC target, either an extended Queqiao constellation or an alternative relay architecture...is assumed operational") is duplicated from §A17 in the assumptions register and does not need to appear in the body of this section.
**Recommended action:** Reduce the relay availability paragraph to three sentences: (1) Queqiao-2 provides 75–85% dual-link availability at the equatorial far side; (2) the ConOps requires >95%; (3) the gap is a relay constellation design requirement carried by §A17 and the far-side-base-architect. Remove the constellation configuration proposal and the IOC timeline note. The footnote reference to §A17 is sufficient.
**Estimated word saving:** ~100 words

---

**Removable-content map for §02-02:**

```
Section: study/02-human-in-the-loop/02-latency-tradespace.md
Current word count: ~4,277
Target word count: 1,800–2,500
Hard cap: 3,000
Removable content (in priority order):
  1. Section 4 "The Forward-Deployed-Human Argument" — duplicate of §02-01 §4;
     compress to one closing paragraph retaining only the 5–10× productivity figure
     — ~400 words removed
  2. Section 2 "Performance Degradation Curve — Summary Position" subsection —
     narrates heritage anchors already stated; compress to one four-row summary table
     — ~280 words removed
  3. Section 5 "Implications for Communications Architecture" — engineering requirements
     list; remove section entirely; relocate >95% availability note to Section 1 one-liner
     — ~280 words removed
  4. Section 1 Queqiao-2 relay availability paragraph — speculative constellation
     architecture beyond section scope; compress to 3 sentences pointing to §A17
     — ~100 words removed
Estimated post-cut total: 4,277 − (400 + 280 + 280 + 100) = ~3,217 words
```

**Note:** After these four cuts, §02-02 will be at approximately 3,217 words — still above the 3,000-word hard cap by ~7%. A second-pass compression of Section 3 (Autonomy/Teleoperation Handoff), specifically the Tier C Mars subsection (the Mars rover model is established in §02-03 and §02-01; ~100-word reduction available), brings the section to approximately 3,100 words. The remaining overrun of ~100 words above hard cap will require the owning agent to apply prose compression rather than structural removal. The above cuts are necessary but not sufficient alone; they are the removable blocks.

---

### SD-8-005 — Major — §02-03 — Sections 5 and 6 together are a self-justification appendix, not concept-paper content

**Severity:** Major
**Location:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 5 "Counter-Case: Do High-Autonomy Humanoids Need Human Supervision?" (~480 words) and Section 6 "Reconciliation with §A1 and §A9" (~300 words)
**Issue:** Section 5 addresses the counter-case that improving VLA models will render human supervision unnecessary by 2035. Three arguments are provided: exploration is structurally OOD, consequence asymmetry, and the Lunokhod lesson. These arguments are architecturally important — they belong in this study. However, Section 5's role is redundant with §02-01 (Overview), which already states all three of these arguments as the basis for the three-condition framework in Section 2 of the Overview. The "consequence asymmetry" argument appears in §02-01 Section 2 (Condition 3) at essentially the same level of detail. The "exploration is structurally OOD" argument appears in §02-01 Section 2 (Condition 2). The Lunokhod bilateral lesson (humans saved Lunokhod despite ground-in-the-loop limitations) is the most novel content in Section 5 (~100 words) and is the only part worth preserving here.

Section 6 "Reconciliation with §A1 and §A9" is a verification exercise confirming that the TRL table does not contradict two assumptions already in the register. This is appropriate as a closing-action note but occupies 300 words of document body. Reconciliation with assumptions is a process activity; the document body should state the conclusion of the reconciliation ("No finding requires updating §A1 or §A9") in one sentence per assumption, not re-derive the reconciliation.
**Recommended action:** Compress Section 5 to two paragraphs: (1) acknowledge the counter-case in one sentence; (2) state the three-argument response in abbreviated form (~100 words), retaining the Lunokhod bilateral lesson as the only content not repeated in §02-01, and adding a cross-reference to §02-01 Section 2 for the full argument. Remove Section 6 as a standalone section; replace with two sentences at the end of Section 4 (Task Allocation Table): "This table is consistent with §A1 (autonomy curve) and §A9 (foundation model constraint). No revision to either assumption is required; cross-coupling flag documented in closing actions."
**Estimated word saving:** ~580 words

---

### SD-8-006 — Major — §02-03 — Task Taxonomy table notes column contains full-paragraph analysis that belongs in Section 3

**Severity:** Major
**Location:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 1, TRL Assessment table — the Notes column for each row (~600 words of inline table prose)
**Issue:** The Notes column in the TRL assessment table (Section 1) contains multi-sentence analytical paragraphs averaging 60–90 words per row, totaling approximately 600 words. This includes heritage citations, TRL derivation logic, gap characterization, and test requirements. This is the right analytical content for a concept paper, but it is embedded in a table where it cannot be efficiently read or scanned. Table notes columns serve as concise annotations (one sentence, one number, one flag) — not analysis paragraphs. More specifically, the gap characterization and derivation content in the Notes column partially duplicates the Gap Analysis section (Section 3), which was written separately. The reader who wants the analytical path should go to Section 3; the table should provide the positions and scores, not the analysis.
**Recommended action:** Reduce each Notes column entry to one sentence (≤25 words): state the space TRL justification and the mission gap. Move all derivation, heritage narrative, and test requirements to Section 3, where they are already partially covered. A typical compressed note would read: "Space TRL 3: no bipedal humanoid on any planetary surface; gap is 1/6-g regolith locomotion validation (§04 gate)." This preserves the analytical conclusions while reducing table bulk. The Heritage notes column cell for "Navigation — 3D mapping" ("Space TRL 8: Mars AutoNav is the unambiguous heritage...Perseverance's AutoNav traversed 22.8 km...") runs to ~90 words and is a full heritage narrative; compress to one sentence.
**Estimated word saving:** ~380–420 words

---

### SD-8-007 — Major — §02-03 — Task Taxonomy table (Section 2) Notes column contains operational justification prose that duplicates Section 3

**Severity:** Major
**Location:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 2, Mission Task Taxonomy table — Notes column (~450 words)
**Issue:** The mission task taxonomy table (20 tasks) has a Notes column where each row contains 20–50 words of operational rationale: why the task is human-led, what the tempo penalty is, when the first human-supervised run applies. Many of these notes contain conditional logic ("TRL 6 capable by 2029 if task library built"; "repeat execution is autonomy-led after the 2035 IOC") that belongs in Section 3 (Gap Analysis) rather than a table cell. The table's job is to classify tasks (taxonomy + minimum TRL + allocation); the justification for the classification belongs in Section 3's gap analysis or in the preceding TRL table's Notes. The table is currently doing double duty as both a classification instrument and a justification document, inflating it by approximately 450 words.
**Recommended action:** Strip the Notes column to one clause per row (≤15 words), sufficient to anchor the row to its rationale without re-narrating it. Example: T05 notes currently reads "Requires: carry panel to site, align, connect electrical, verify; multi-step scripted sequence with physical engagement; first execution always human-supervised." This compresses to "Multi-step scripted; first execution human-supervised." The Section 3 gap analysis, which covers 2029/2035/2040 progression for each task, is the correct location for the fuller justification.
**Estimated word saving:** ~300–350 words

---

**Removable-content map for §02-03:**

```
Section: study/02-human-in-the-loop/03-autonomy-trl-tasking.md
Current word count: ~4,470
Target word count: 1,800–2,500
Hard cap: 3,000
Removable content (in priority order):
  1. Section 5 "Counter-Case" — compress to 2 paragraphs retaining only
     the Lunokhod bilateral lesson; cross-reference §02-01 for the rest
     — ~380 words removed
  2. Section 6 "Reconciliation with §A1 and §A9" — replace with 2 sentences
     at end of Section 4
     — ~300 words removed
  3. Section 1 TRL table Notes column — compress each entry to ≤25 words;
     move derivation narrative to Section 3
     — ~380–420 words removed
  4. Section 2 Task Taxonomy table Notes column — compress each entry to
     ≤15 words
     — ~300–350 words removed
Estimated post-cut total: 4,470 − (380 + 300 + 400 + 325) = ~3,065 words
```

**Note:** After these cuts, §02-03 will be at approximately 3,065 words — still ~65 words above hard cap. The owning agent must then apply prose compression to Section 3 (Gap Analysis by Deployment Date), specifically the 2029 gate and 2035 IOC subsections which contain some narrative duplication of the task allocation table (~80 words of repeated allocation listings). The above are the structural removals; residual overrun requires prose tightening.

---

### SD-8-008 — Major — §02-04 — Section 4 Pillar 2 (Situational Awareness) includes the Spektr collision heritage not anchored to a task-specific argument

**Severity:** Major
**Location:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 4, Pillar 2 "Situational Awareness" — the Spektr/TORU paragraph and the Lunokhod crater paragraph (~200 words, beginning "The Lunokhod heritage makes this concrete")
**Issue:** The Pillar 2 section makes a correct and important argument about mental model currency at different latency tiers. It then grounds this with two heritage examples: Lunokhod crater boundary failure and the Spektr collision (1997). The Lunokhod example is appropriate — it is the primary heritage anchor for the latency argument throughout Section 02 and has been established in detail in §02-02. The Spektr/TORU example is a different kind of failure: the Spektr collision resulted from altered center-of-gravity response in the Progress spacecraft during a manual docking attempt, not from a latency-induced mental model failure in the sense described by the surrounding paragraph. Cosmonaut Tsibliev was operating TORU at low latency (within the Mir station's radio line-of-sight); the issue was unfamiliarity with an altered system state, not propagation delay. Using Spektr as a latency heritage example is imprecise and potentially misleading. Additionally, the full two-example structure is longer than needed to establish the mental model argument — the Lunokhod example suffices.
**Recommended action:** Remove the Spektr/TORU paragraph (~100 words). Retain the Lunokhod heritage reference with its citation. The mental model argument stands on the Lunokhod example and the general latency physics; the Spektr case introduces a confounding human factors variable (system familiarity, not latency) that dilutes the argument.
**Estimated word saving:** ~100 words

---

**Removable-content map for §02-04:**

```
Section: study/02-human-in-the-loop/04-teaming-model.md
Current word count: ~4,417
Target word count: 2,500–3,500
Hard cap: 4,200
Removable content (in priority order):
  1. Section 4 Pillar 2 — Spektr/TORU paragraph — incorrect heritage application,
     Lunokhod example sufficient
     — ~100 words removed
  2. Section 1 "Periodic Supervision" — checkpoint interval paragraph and the
     task list is over-long; T16 is listed in the "Required for" but then appears
     in the Task Allocation Table in §02-03; the "Required for" list in each mode
     names specific tasks already in the §02-03 table — this is duplication (~80 words)
     — ~80 words removed
  3. Section 2 Cognitive Load — "Long-Duration Degradation" subsection includes
     a 6-month rotation cadence discussion that concludes "rotation cadence is a
     ConOps decision, not a teaming model decision" — ~60 words of the 130-word
     subsection discuss rotation cadence only to defer it; compress to one sentence
     — ~60 words removed
  4. Section 5 "§A9: Foundation Models at Supervisory Layer" — the second
     paragraph (beginning "If foundation models were used as primary task
     executors...") re-makes the §A9 argument for the third time across the
     section (already stated in §02-01 and §02-03); compress to one sentence
     pointing to §02-03 Section 5 for the VLA failure mode argument
     — ~80 words removed
Estimated post-cut total: 4,417 − (100 + 80 + 60 + 80) = ~4,097 words
```

**Note:** These four cuts bring §02-04 to approximately 4,097 words — within the 4,200-word hard cap with ~103 words of margin. The section is dense with necessary content (supervision modes, cognitive load derivation, supervisor ratio derivation, three-pillar forward-deployment case) that is genuinely load-bearing. The four removals above are the identifiable structural cuts; residual tightening to reach the 3,500-word target requires prose compression throughout, particularly in the Section 3 supervisor ratio derivation steps (Step 2 and Step 5 are the most verbose relative to their informational content).

---

### SD-8-009 — Minor — §02-04 — Section 1 lists tasks explicitly for each supervision mode, duplicating §02-03 Task Allocation Table

**Severity:** Minor
**Location:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 1, all three supervision mode subsections — the "Required for" lists (~200 words total across three modes)
**Issue:** Each supervision mode subsection in Section 1 contains a "Required for" list that names specific tasks from the 20-task taxonomy (e.g., "T09 (EVA tool handoff to crew)", "T02 (unstructured terrain with human path approval)"). This list fully duplicates the Task Allocation Table in §02-03 Section 4, which is the authoritative source for mode assignments. Section 1's job is to define the modes and their properties; the task assignments are a §02-03 output. The duplication is not incorrect — it aids readability — but it adds approximately 200 words and creates a maintenance dependency: when the task allocation changes, both tables must be updated simultaneously.
**Recommended action:** In each supervision mode subsection, replace the explicit task list with a pointer: "Applies to: autonomy-led tasks in the §02-03 allocation table (T01, T03, T04..." can become "Applies to: the 12 autonomy-led tasks in §02-03 Table 4; see that table for the complete assignment." One sentence per mode replaces the multi-item lists. The Summary Table in Section 6 already provides the mode-to-task-category cross-reference at the appropriate level.
**Estimated word saving:** ~150 words

---

### SD-8-010 — Minor — §02-02 — Section 6 (Inputs to Autonomy-TRL-Tasking) duplicates TRL gate requirements stated in §02-03

**Severity:** Minor
**Location:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 6, "Inputs to Autonomy-TRL-Tasking" — items 1 and 2 (~160 words)
**Issue:** Section 6 items 1 and 2 state TRL requirements for the reactive and deliberative layers at the 2029 and 2035 gates (TRL 6 reactive by 2029; TRL 5 deliberative by 2029; TRL 7 by 2035). These are gate requirements that are already stated in §02-03 Section 3 (Gap Analysis by Deployment Date) and in the §A1 assumption. Section 6's function is to flag what the latency analysis requires the autonomy layer to do differently than it might without the latency constraint — the "close the 2.8 s gap" function. Items 3 and 4 (safe-mode during relay outages; ≤50 ms on-base latency validation) are genuinely new requirements flowing from the latency analysis. Items 1 and 2 are re-statements of existing requirements with latency framing that adds little.
**Recommended action:** Compress items 1 and 2 into a single one-sentence requirement: "The reactive layer's autonomous responses (fall recovery, collision halt, force-limit enforcement) must cover the 2.8 s Earth-relay response gap; TRL gates are §A1." Delete the full TRL gate restatement. Retain items 3 and 4 in full as they carry new requirements.
**Estimated word saving:** ~100 words

---

### SD-8-011 — Minor — §02-03 — Section 3 "2038–2040 Full Operation" is underspecified relative to its length

**Severity:** Minor
**Location:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 3, "2038–2040 Full Operation" subsection (~210 words)
**Issue:** The 2040 subsection is approximately 210 words but delivers less analytical content than the 2029 and 2035 subsections. It lists which tasks may shift to autonomy-led (T12, lighter-touch T13/T14, possibly T17), then re-states the human value floor. The human value floor content is stated in full at the end of this subsection (7 items, ~200 words), but it was already established in the 2035 IOC subsection ("What remains permanently human-required regardless of TRL"). The floor does not change between 2035 and 2040, and re-stating it in the 2040 subsection is redundant. The 2040 analytical content (what moves, what stays) can be stated in 4–6 sentences; the human value floor listing should not be repeated.
**Recommended action:** Remove the re-statement of the 7-item human value floor from the 2040 subsection. Replace with a single sentence: "The human value floor (items 1–7 above) is unchanged; no TRL advancement moves life-safety decisions, crew contact events, or exploration judgment calls to autonomous execution." This reduces the 2040 subsection to approximately 80–100 words of new material identifying what actually changes between 2035 and 2040. The removed floor re-statement is approximately 200 words.
**Estimated word saving:** ~200 words

---

### SD-8-012 — Nit — §02-04 — Section 2 Mir baseline uses 30–40%/25–30% maintenance ranges without a single committed planning value

**Severity:** Nit
**Location:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 2, "Mir Baseline" and "Available supervisory bandwidth" paragraphs
**Issue:** The Mir baseline paragraph correctly establishes a 30–40% maintenance absorption range and a 25–30% remaining fraction for supervisory functions, then commits to "approximately 8 person-hours per crew shift" as the conservative planning value. However, the arithmetic is not shown inline: 4 crew × 8 hours × 0.25–0.30 = 8.0–9.6 person-hours — rounded to 8 hours. This derivation is in the text but formatted as a prose sentence; for a value that anchors the entire supervisory demand calculation, it should be formatted as an explicit arithmetic line for traceability. Additionally, "approximately 8 person-hours per crew shift" is rounded from the 0.25 floor, but the 0.30 ceiling yields 9.6 person-hours — a significant difference in the headroom calculation. The conservative rounding direction is correct (use 0.25), but the paper does not explicitly note that it uses the conservative end of the range.
**Recommended action:** Add a one-line arithmetic statement after the prose: "Planning value: 4 crew × 8 h × 0.25 (conservative fraction) = 8.0 person-hours per shift." Add a parenthetical noting the ceiling: "(using 0.25 available fraction, not 0.30, as the conservative planning basis)." This is a ~15-word addition that adds no length concern but improves arithmetic traceability. No word saving — this is a quality flag, not a length flag.
**Estimated word saving:** 0 (addition, not removal — required for arithmetic discipline)

---

### SD-8-013 — Nit — §02-02 — The ">60 s (fully autonomous; mission planner model)" tier is out of scope and should be cut

**Severity:** Nit
**Location:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 2, subsection "Performance Degradation Curve — Summary Position," final paragraph (">60 s, fully autonomous, mission planner model")
**Issue:** The final tier in the performance degradation summary covers Jupiter and beyond, explicitly noted as "not in scope for the humanoid-forward architecture's first operational decade." If it is not in scope, it should not appear in the body of this section. The paragraph adds approximately 60 words to describe a scenario the section immediately dismisses. The latency table in Section 1 already includes Jupiter entries; that is sufficient coverage for an out-of-scope destination. The ">60 s" tier entry in the Sheridan/Verplank mapping table (Level 9–10, fully autonomous) is also sufficient coverage of the theoretical regime.
**Recommended action:** Delete the ">60 s" paragraph from the Summary Position subsection. The latency table and the Sheridan table cover this regime without a dedicated prose paragraph.
**Estimated word saving:** ~60 words (if SD-8-002's cut of the entire Summary Position subsection is not implemented; otherwise this finding is subsumed within SD-8-002)

---

## Summary Count Table

| Finding | Severity | Section | Estimated Word Saving |
|---------|----------|---------|----------------------|
| SD-8-001 | Major | §02-02 | ~400 |
| SD-8-002 | Major | §02-02 | ~280 |
| SD-8-003 | Major | §02-02 | ~280 |
| SD-8-004 | Major | §02-02 | ~100 |
| SD-8-005 | Major | §02-03 | ~680 |
| SD-8-006 | Major | §02-03 | ~400 |
| SD-8-007 | Major | §02-03 | ~325 |
| SD-8-008 | Major | §02-04 | ~100 |
| SD-8-009 | Minor | §02-04 | ~150 |
| SD-8-010 | Minor | §02-02 | ~100 |
| SD-8-011 | Minor | §02-03 | ~200 |
| SD-8-012 | Nit | §02-04 | 0 (quality flag) |
| SD-8-013 | Nit | §02-02 | ~60 (subsumed in SD-8-002 if that cut is taken) |

**Totals by severity:**

| Severity | Findings | Total estimated word saving |
|----------|----------|----------------------------|
| Major (8) | SD-8-001 through SD-8-008 | ~2,565 words |
| Minor (3) | SD-8-009 through SD-8-011 | ~450 words |
| Nit (2) | SD-8-012, SD-8-013 | ~60 words (SD-8-013 subsumed if SD-8-002 taken) |
| **Total** | **13** | **~3,015–3,075 words** |

---

## Projected post-cut word counts

Applying all major and minor cuts (not nits):

| Section | Current | Major cuts | Minor cuts | Projected | vs. Hard Cap | vs. Target |
|---------|---------|-----------|------------|-----------|-------------|------------|
| §02-01 | ~1,717 | — | — | ~1,717 | 285 under cap | Within target |
| §02-02 | ~4,277 | −1,060 | −100 | ~3,117 | 117 over cap | 617 over target top |
| §02-03 | ~4,470 | −1,405 | −200 | ~2,865 | 135 under cap | Within target (just) |
| §02-04 | ~4,417 | −100 | −150 | ~4,167 | 33 under cap | 667 over target top |

**Residual situation after all recommended cuts:**

- **§02-02 remains ~117 words over hard cap.** The owning agent must apply prose compression throughout Sections 1–3 to close this gap. Section 3 Tier B and Tier C subsections together offer ~120 words of prose compression without structural removal (the Tier C subsection partly duplicates the Mars rover model description in §02-01).
- **§02-04 is within hard cap but 667 words above target top (3,500).** The section is content-dense and structurally justified; the target should be reconsidered upward to 2,500–4,000 given that the teaming model section carries the supervisor ratio derivation, cognitive load arithmetic, the three-pillar case, and the §A8/§A9 tie-in — all of which are load-bearing program commitments. The current 4,200 hard cap is the right ceiling; the target range should be relaxed to match.
- **§02-03 will be within target range after cuts**, assuming the residual overrun (~65 words above hard cap before prose compression) is handled by tightening Section 3's narrative.

---

## Pattern diagnosis

Two recurring patterns produce the overrun in §02-02 and §02-03:

1. **The argument is made once in §02-01 and then re-made in detail in §02-02 and §02-03.** The forward-deployment physics argument, the three conditions for human value, the OOD exploration rationale, and the consequence asymmetry argument all appear in full in §02-01, then re-appear in equal or greater detail in the downstream sections. The Overview's job is to summarize the synthesis; the downstream sections should not re-derive what the Overview summarized. Each section should state its specific findings and cross-reference the Overview for the architectural conclusion, not repeat the conclusion in full.

2. **Table notes columns are carrying analysis prose that belongs in the section body.** Both TRL tables in §02-03 have Notes columns that run 60–90 words per row. This creates invisible word count — the table is perceived as compact but contains hundreds of words of analytical content that is not subject to the same discipline as body prose. Table cells should contain positions and classifications; derivations and justifications should be in the body text.
