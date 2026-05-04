---
title: Process Lessons
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Process Lessons

---

## Lesson 1: Breadcrumb discipline does not happen by being scaffolded

**From stage 2-4.**

Breadcrumb files were created and documented in CLAUDE.md as required. They were not populated during work. This is the single most important process lesson from the first four stages.

**Why it happened:** Scaffolding a file and describing its format creates the appearance of a system but not the enforcement. When agents are under time pressure or focused on content, the closing actions get skipped. There is no natural stopping point that forces the question "did I write my session log?"

**Enforcement mechanism (implemented in stage 5):**
1. Every agent file has a mandatory closing actions checklist at the bottom — the agent cannot mark work complete without completing these.
2. CLAUDE.md has a hard pre-handback checklist — the orchestrator cannot generate a handback without verifying these are satisfied.
3. `generate_handback.py` has a soft warning gate that flags missing breadcrumbs and stale session logs before generating.

**The principle:** A convention that produces a warning when violated is better than a convention that produces nothing. A gate that blocks progress is better than a warning. Move from warnings to gates as the system matures.

---

## Lesson 2: "Zero findings" is not a success signal without evidence that reviews ran

**From stage 4.**

The handback showed "Blockers: 0, Majors: 0" — which looks like clean sections. But this was because no review agents had been invoked, not because the sections were clean. The handback format did not distinguish between "reviews ran and found nothing" and "reviews never ran."

**Corrective action:** The handback now surfaces whether review files exist. If they don't exist, the finding count is marked as unreliable, not as a clean bill of health. Stage 6 will run the first real review pass.

---

## Lesson 3: Contradictions in the assumption registry compound silently

**From stage 4.**

Two incompatible autonomy TRL assumptions were in the registry simultaneously for an entire stage cycle. Downstream agents reading the registry would have gotten conflicting inputs. The conflict was caught only at handback time when both entries were visible in the same section.

**Corrective action:** The registry now has explicit instructions for checking contradictions before adding. The "How to add an assumption" note at the top of the registry is the gate. Any agent that adds an assumption without checking this note is violating the process.

---

## Lesson 4: Parallel agent dispatch is efficient but requires explicit write isolation

**From stage 2.**

The soviet-russian-heritage and humanoid-systems-architect agents were dispatched in parallel to avoid sequential bottlenecks. Both needed to write to `corpus/references.bib`. The conflict was avoided by directing each agent to a separate stub bib file (`corpus/heritage-notes/*.bib`) and planning a later merge. This worked.

**The principle:** Parallel dispatch is correct for corpus research. The isolation requirement (separate output files per parallel agent) must be stated explicitly in the dispatch prompt, or agents will try to write to the same file and produce corruption or race conditions.

---

## Lesson 5: Agent scope must be bounded by deliverable, not by topic

**From stage 2.**

The humanoid-systems-architect was dispatched to "populate the corpus" for Question (a). It produced the heritage table (the entry-point deliverable) and stopped. This is correct behavior for an open-ended prompt but incorrect behavior for a staged study: the agent should continue to the next deliverable unless told to stop.

**Corrective action:** Agent dispatch prompts for stage 5+ specify the *complete deliverable* (target file path, minimum word count, required sections) rather than an open topic area. "Produce `02-form-factor-tradespace.md`, 1,500-2,500 words, including a tradespace matrix and a stated position" is a bounded deliverable. "Research the form factor tradespace" is not.

---

## Lesson 6: Citation keys without BibTeX entries are non-functional and invisible

**From stage 6 review (HC-009, P2-8).**

Approximately 22 of 25 `\cite{key}` references across all six Question (a) sections had no corresponding BibTeX entry in `corpus/references.bib`. The agents added inline citation keys correctly, but assumed the BibTeX entries already existed or would be added later. The result is a document that looks citable but is not — a reviewer cannot look up any of the cited sources.

**Why it happened:** Agent prompts specified "cite your sources using `\cite{key}` format" but did not require BibTeX entry creation as part of the same action. Adding an inline key takes one second; adding a BibTeX entry takes thirty seconds. Under any time pressure, the BibTeX step gets deferred.

**Corrective action (applied in stage 7):** Agent prompts must now state explicitly: "For every `\cite{key}` you add to the text, you must also add a BibTeX entry to `corpus/references.bib` in the same session. Do not add a citation key without its bib entry. If you cannot find a primary source, use a `@misc` entry with a `note = {To be confirmed against primary source before PDR}` field." This is a blocking requirement, not a guideline.

---

## Lesson 7: Arithmetic errors in tables are invisible without forced derivation display

**From stage 6 review (AE-001, AE-002, AE-003).**

Three arithmetic errors survived to the review pass: the tradespace matrix weighted totals in §02 were wrong (inflating the A-vs-B gap 2.5×); the DOF count in §03 did not state its counting convention (leaving the 38 vs. 51–55 ambiguity); the Stefan-Boltzmann limit in §06 was applied incorrectly (claiming 0.3 m² at ε=0.70 rejects 300 W, when the actual limit at realistic lunar sink temperature is ~100 W).

**Why it happened:** Tables contain final values with no visible derivation. An agent that calculates wrong and writes a wrong number produces output indistinguishable from output where the calculation was done correctly. The error is invisible until an independent reviewer checks the arithmetic.

**Corrective action (applied in stage 7):** Any value in a table that results from a calculation must show the calculation steps, either in the table Notes column or in a derivation subsection immediately preceding the table. A final number without visible steps is not acceptable for any value that a downstream agent or reviewer will use as an input. The review pass is not a substitute for in-band arithmetic verification — reviewers are expected to find arithmetic errors, but requiring them to do so increases review cost. The first line of defense is forcing derivation display.

---

## Lesson 8: Cross-coupling mismatches between adjacent sections propagate until reviewed

**From stage 6 review (CC-001, P1-B).**

§05 stated electronics/battery survival heaters at 50–150 W. §06 used 85–175 W — a 70% lower-bound inflation that fundamentally changed the survival power closure narrative. Neither section agent detected the discrepancy; no cross-coupling entry was written when §06 chose its different range.

**Why it happened:** Agents read the section they are writing but do not proactively cross-check the same parameter in adjacent section files. The cross-coupling log is supposed to capture these decisions, but it requires an agent to (a) know that another section has already set a value, and (b) choose to log the discrepancy rather than silently using their own value.

**Corrective action (applied in stage 7):** Agent prompts for integrating sections (§06 budget) must now include: "Before writing any value that was also set in §01–§05, search those files for that value and verify consistency. If you use a different value, log the change in `cross-coupling-log.md` with a justification." The cross-coupling log check is a mandatory pre-commit action for any agent whose section is an integrator.

---

## Lesson 9: Assumption register numbering must be centrally coordinated

**From stage 6 fix pass.**

The robotics-actuation-structures agent (Batch 1) added §A14 (actuator mass sensitivity) and §A15 (boot cover replacement) to the assumptions register. The orchestrator then separately instructed the humanoid-systems-architect agent (Batch 2) to add §A14 (gait factor). The gait factor ended up as §A16 — non-sequentially numbered relative to the section order that would be expected.

**Why it happened:** The orchestrator issued assumption number assignments by counting the highest existing entry (§A13 at the time of Batch 2 briefing) without accounting for the fact that Batch 1 agents were simultaneously writing §A14 and §A15.

**Corrective action (applied in stage 7):** The orchestrator must query the assumption register for its highest numbered entry immediately before issuing any instruction that includes a specific §A_N number. The query happens in the same message turn as the dispatch prompt, not at prompt-writing time. Alternatively, agent prompts should say "add this assumption as the next sequential entry after the current highest §A_N — do not use a specific number assigned in this prompt."

---

## Lesson 10: Stream idle timeout is the dominant failure mode for large-file agent tasks

**From stage 8.**

Stream idle timeout caused partial completion in three of four content agents dispatched to large files. The 24-step human-factors-teaming prompt was too large by a factor of approximately four; the agent timed out mid-task and the remaining work required direct orchestrator intervention. **Fix:** Break large-file tasks into sections of fewer than 500 words of target output each. Maximum prompt complexity is 5–6 steps covering one file. When a task requires more than that, dispatch sequentially in multiple calls rather than combining into one prompt.

**Direct orchestrator edits beat re-dispatch for targeted fixes.** When the remaining work after a timeout is a single sentence or a known paragraph, doing it in the main session is faster and more reliable than composing a new agent prompt, waiting for dispatch, and verifying the result.

**Focused Wave 2 reviewers beat comprehensive Wave 1 reviewers.** Six tool uses and 40 seconds per reviewer (3 specific questions, one file) outperformed 22+ tool uses and 10+ minutes per reviewer (broad mandate, all files). Scope the review prompt to 3 specific questions, not 20.
