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
