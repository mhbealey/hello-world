---
title: Agent Performance Retrospective
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Agent Performance Retrospective

One entry per agent, per stage. Format: agent name, what worked, what didn't, prompt change recommended.

---

## soviet-russian-heritage — Stage 2

**What worked:**
- Produced 5,865 words of substantive heritage research with primary citations and explicit `[VERIFY]` flags on weak or secondary-only claims. This is the model for how all agents should work.
- Structured by topic (6 topics: Lunokhod, Salyut/Mir, Mars-500, Soviet lunar base concepts, Mir sustainment, contra-humanoid thread) with Key Sources / Lessons / Open Questions sub-sections per topic.
- Honest about coverage gaps — flagged inaccessible primary sources in Russian and untranslated literature explicitly.
- Generated 32 BibTeX entries covering the corpus well.

**What didn't:**
- Thin on Topics 5 and 6 — Mir sustainment philosophy and the contra-humanoid design philosophy thread appear to have been truncated due to context or length limits. These are the most directly relevant lessons for the study's core thesis.
- The `[VERIFY]` discipline was applied but not always with specific enough notes on *why* the claim is uncertain (secondary source vs. untranslated Russian vs. conflicting published figures).

**Prompt change recommended:**
- Add explicit topic coverage targets: "Cover all 6 topics listed. Topics 5 and 6 (Mir sustainment philosophy, contra-humanoid design thread) are particularly important — do not truncate these."
- Consider adding: "For each `[VERIFY]` flag, add one sentence explaining *what* needs verification and *why* the current source is insufficient."

---

## humanoid-systems-architect — Stage 2

**What worked:**
- Heritage table structure is solid: 9 robots × 10 columns, with honest "unverified" flags on power figures not published by manufacturers.
- Heritage gaps section (7 gaps) is substantive and directly references the study's mission requirements.
- Open questions section sets up the subsequent Question (a) sections correctly.

**What didn't:**
- Stopped at the heritage table — did not advance to form factor tradespace, mass/power budget, or configuration position-taking. The agent produced the first deliverable only.
- No cross-coupling decisions were logged despite the heritage table containing numbers (mass, DOF, power) that downstream agents will reference.
- Did not append to assumption registry or cross-coupling log despite producing architectural data.

**Prompt change recommended:**
- Make explicit that the heritage table is the *first* deliverable for this stage, not the only one — the agent should continue through tradespace and configuration position unless explicitly told to stop.
- Add the mandatory closing actions (already being added in Task 4) — require cross-coupling log entries for any design parameter set.

---

## orchestrator — Stage 2-4

**What worked:**
- Correctly structured the parallel agent dispatch to avoid write conflicts (separate bib stub files).
- The audit pass (stage 4) caught the critical YAML frontmatter bug across all 14 agent files — this was a showstopper that would have prevented any agent from working.
- The handback tooling was correctly identified as missing and implemented.

**What didn't:**
- Failed to enforce the breadcrumb conventions it scaffolded: session logs never written during work, cross-coupling log never populated, retro artifacts never written.
- Added contradictory autonomy TRL entries to the assumption registry without checking for conflicts.
- Scaffolded reviewers but never invoked them — left the stage 4 handback with a misleading "0 findings" count.
- Did not log cross-coupling decisions from the humanoid-systems-architect heritage table output.

**Prompt change recommended:**
- Add mandatory pre-handback checklist (Task 4 in stage 5 specification): registry contradictions resolved, breadcrumbs current, reviews invoked or explicitly deferred with written reason.
- Every assumption addition: search registry for contradictions first, resolve before adding.

---

## Stage 5 section agents (collective assessment) — Stage 6 review findings

**What worked:**
- All six sections completed to first-draft standard with consistent structure, position-taking, and margin documentation.
- Environments and heritage sections maintained good `[VERIFY]`/`[EST]` flag discipline.
- Cross-coupling table entries at the end of each section were a useful downstream interface.

**What didn't:**
- **Citation discipline: systemic failure.** Approximately 22 of 25 `\cite{key}` keys had no corresponding BibTeX entries in `corpus/references.bib`. Agents added inline citations without adding bib entries, producing a non-functional citation corpus.
- **Arithmetic errors.** Two numerical errors in §02 (tradespace matrix weighted totals, inflating A-B gap 2.5×); one physics error in §06 (Stefan-Boltzmann radiator sizing claiming 0.3 m² rejects 300 W when the actual limit is ~100 W); DOF counting convention not stated in §03, allowing the 38 vs. 51–55 ambiguity to persist.
- **Word count drift.** §04 reached 5,182 words — 2,700 over the 2,500-word target. Foundation models field survey added ~700 words of content that duplicated positions already taken in the same section.
- **Cross-coupling leakage.** §05 and §06 published different heater ranges (50–150 W vs. 85–175 W) without any reconciliation. Neither agent checked the other's file.
- **Atlas Electric misidentification.** Two sections cited Atlas Electric's actuator type incorrectly (harmonic drives/roller screws rather than direct-drive motors), breaking the heritage argument for the HD-Electric selection in §03.

**Prompt changes required (applied in stage 7):**
1. Mandatory: "For every `\cite{key}` you write, add a corresponding BibTeX entry to `corpus/references.bib`. Do not leave dangling keys."
2. Mandatory: "State the word count of your output before submitting. It must be within ±20% of the target specified in the stage scaffolding."
3. Mandatory: "Show arithmetic derivation inline for any value that appears in a table. Do not write a final number without the calculation steps visible."
4. Mandatory: "Before publishing any cross-coupled number (mass, power, thermal, DOF), search `cross-coupling-log.md` and the adjacent section files to verify consistency."

---

## aerospace-engineer-reviewer — Stage 6

**What worked:**
- All three Blockers were independently identified and well-specified: DOF arithmetic (AE-001), radiator Stefan-Boltzmann physics (AE-002), and tradespace matrix arithmetic (AE-003).
- AE-002 included an independent calculation showing the physics limit, which made it an unambiguous fix target.
- Structured severity ratings (Blocker/Major/Minor/Nit) were correctly calibrated — no false positives in the Blocker tier.

**What didn't:**
- AE-005 (Atlas Electric DOF 56 vs. 28) was filed as Major rather than Blocker; given that it feeds the §01 heritage table directly and the heritage table is downstream input for §03, an argument exists that it should have been Blocker. This is a borderline call.

**No prompt changes required.**

---

## heritage-citations-reviewer — Stage 6

**What worked:**
- HC-001 (Atlas Electric actuator type) and HC-002 (Chang'e-4 citation) are both clean, well-specified Blockers with exact correction instructions.
- The spot-check table (11 claims × provenance evaluation) is the most rigorous citation audit produced in this project to date and should be the model for future heritage review passes.
- The systemic dangling-citation finding (HC-009/P2-8) correctly identified the 22-of-25 problem and specified the fix scope.

**What didn't:**
- HC-005 (Lunokhod 2 citation) was fixed by the §02 agent but with a text note rather than a dedicated BibTeX entry, leaving the citation technically still pointing to Huntress 2011. This was caught by the re-review. The fix was trivial once identified, but HC-005 should have been specified at the Blocker level to prevent exactly this "partial fix" outcome.

**Prompt change recommended:**
- Add: "For any citation finding, specify whether the fix requires (a) a new BibTeX entry in references.bib, (b) a change to the inline `\cite{}` key, or (c) both. Ambiguity here allows agents to fix the text without fixing the bib or vice versa."

---

## reliability-margins-reviewer — Stage 6

**What worked:**
- RM-001 and RM-002 are both genuine Blockers that required non-trivial structural fixes (removal of circular closure logic; addition of a gated assumption). These would not have been caught without an adversarial reviewer.
- The double-margin observation (subsystem NTE × system NTE stacking) is a legitimate structural concern correctly flagged as Major.

**What didn't:**
- None significant — all findings were correctly calibrated and well-specified.

**No prompt changes required.**

---

## cross-coupling-reviewer — Stage 6

**What worked:**
- CC-001 (heater range mismatch §05→§06) is the most important systemic finding of the stage: the same parameter appeared with different values in adjacent sections and no agent caught it. The cross-coupling reviewer's explicit cross-file comparison methodology found it where individual section reviewers would not.
- The reconciliation results table (13 decisions × pass/fail) is an efficient format for this reviewer's scope.

**What didn't:**
- None significant.

**No prompt changes required.**

---

## scope-discipline-reviewer — Stage 6

**What worked:**
- SD-001 (foundation models survey) and SD-003 (dust mitigation verbosity) are correctly identified and correctly calibrated as Majors.
- The word count table (5 sections × word count vs. target) is an efficient summary that should be included in every scope-discipline review output.

**What didn't:**
- The reviewer did not flag the overall finding count as potentially indicating systemic scope drift. With §04 at 5,182 words, the section is over-target by a factor of 2×. A pattern-level observation ("all sections over target; §04 worst offender") would have been useful context for the orchestrator's triage.

**Prompt change recommended:**
- Add: "If more than 2 sections are over word-count target, state this as a systemic pattern, not just individual findings. Estimate the total removable word count across all sections."

---

## devils-advocate-reviewer — Stage 6

**What worked:**
- DA-001 (economics unquantified) and DA-002 (TRL 6 gate without demo program) are both correctly identified as Blockers. These are exactly the kind of "structurally load-bearing but undefended" claims that a program review board would attack first.
- The DA-001 fix specification (task taxonomy + cost delta + crossover sensitivity + ConOps gate) was detailed enough that the §02 agent implemented it correctly in a single pass.

**What didn't:**
- None significant.

**No prompt changes required.**

---

## robotics-actuation-structures — Stage 6 fix pass

**What worked:**
- Went beyond the minimum required fix for AE-004/RM-003/RM-004: added a full three-class actuator mass derivation with specific commercial catalog anchors (Harmonic Drive AG CSF series, IKO CRBH series, Unitree M107). This is the right level of rigor for a concept study.
- Independently identified and corrected the FFKM −180°C physical infeasibility (the seal glass-transitions at −50 to −70°C), which was not in the triage brief — this is good engineering catch behavior.
- Correctly adopted SSRMS/Canadarm2 as the space-heritage anchor for harmonic drive actuation, which is the right substitution for the discredited Atlas Electric heritage chain.

**What didn't:**
- The agent added §A14 and §A15 to the assumptions register. The orchestrator separately instructed the Batch 2 agent to add §A14 (gait factor), causing a naming collision — the gait factor ended up as §A16. The orchestrator should have checked the assumption register count before issuing §A14 as the instruction.

**No agent prompt change required** (the naming collision was an orchestrator error).**

---

## space-environments — Stage 6 fix pass

**What worked:**
- Clean, targeted fix pass: all three findings (HC-002, CC-001, SD-003) addressed exactly as specified.
- The "Confirmed value for cross-coupling" callout added to §05 is the right pattern for documenting an authoritative value that downstream agents must match.

**What didn't:**
- Nothing significant.

**No prompt changes required.**

---

## robotics-sensing-autonomy — Stage 6 fix pass

**What worked:**
- Foundation models compression from ~700 to ~150 words is a disciplined reduction that preserves the program position without losing actionable content.
- The 2029 TRL 6 gate minimum observable paragraph is specific enough to function as an actual program gate criterion (named facility class, task specification, duration, decision rule).

**What didn't:**
- Nothing significant.

**No prompt changes required.**

---

## humanoid-systems-architect (§02 and §06+§01) — Stage 6 fix pass

**What worked:**
- §02 economics analysis correctly structured with all four required elements (taxonomy, cost delta, crossover, ConOps gate).
- §06 survival mode closure correctly rewritten to remove the circular 150 W "goal" and replace with a FSP provision approach.
- Radiator sizing correctly flagged as open (TRL 2) with Stefan-Boltzmann constraint stated.

**What didn't:**
- The §06 agent was instructed to add §A14 for the gait factor, but §A14 had already been taken by robotics-actuation-structures for the actuator mass sensitivity assumption. The agent correctly resolved this by using §A16 instead, but the numbering is now non-sequential in the register (§A14, §A15, then §A16 out of order relative to section origin). A future cleanup pass should normalize this.

**No prompt change required** (orchestrator-side issue on assumption numbering).

---
