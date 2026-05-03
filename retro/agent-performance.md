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
