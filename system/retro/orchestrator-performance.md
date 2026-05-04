---
title: Orchestrator Performance Retrospective
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Orchestrator Performance Retrospective

---

## Stage 2-4 Assessment

**Cross-coupling watchlist failures.**

The orchestrator's primary job is cross-coupling detection: when one agent sets a number or position, the orchestrator checks whether that breaks assumptions in other agents' artifacts. This did not happen in stages 2-4.

Specific failures:
1. The humanoid-systems-architect produced a heritage table with mass ranges (35–150 kg) and power estimates (~300–1,800 W). These constrain the destinations-trajectories lander manifest and the cost-program launch cost estimate. No cross-coupling entry was logged. No downstream agents were notified.
2. Two autonomy TRL entries were added to the assumption registry at different times, with incompatible values, by different processes. Neither was reconciled. The orchestrator did not check for contradictions before adding the second entry.
3. The reviewer agents were wired up and described in CLAUDE.md but were never invoked. The stage 4 handback showed "0 findings" — not because the sections were clean, but because no reviews ran. The orchestrator did not flag this explicitly.

**Enforcement failures.**

Breadcrumb conventions (session logs, cross-coupling log, retro artifacts) were specified in CLAUDE.md and scaffolded as files. They were not populated during any work session. The orchestrator treated them as optional despite stating they were required.

**Root cause.**

The CLAUDE.md instructions described *what* the breadcrumbs are and *where* they go, but did not specify *when* they are mandatory and *what happens* if they're missing. "The orchestrator reviews at major checkpoints" is not an enforcement mechanism — it's a reminder that can be ignored. Stage 5 adds explicit pre-handback gates.

**Corrective actions (stage 5):**
- Hard pre-handback checklist added to CLAUDE.md.
- Mandatory closing actions appended to every agent file.
- Soft warning gate added to `generate_handback.py`.
- Assumption registry now documents how to check for contradictions before adding.
- Cross-coupling log seeded with the first real entry (autonomy TRL curve) as a pattern for future entries.

---

## Stage 6 Assessment

**What worked well.**

*Parallel dispatch discipline.* Six reviewers ran in parallel on all six sections simultaneously. Four Batch 1 fix agents ran in parallel. Re-reviews ran in parallel. The background agent pattern (launch, continue other work, collect results on completion notification) worked as designed. Total elapsed time for the review-fix-re-review cycle was approximately correct given the scope.

*Triage structure.* The two-tier triage (P1 cross-reviewer patterns, P2 standalone blockers) correctly identified the highest-leverage fixes. The Batch 1/Batch 2 sequencing constraint was correctly identified (Batch 2 cannot run until DOF count and heater range are confirmed) and enforced.

*Re-review pass.* The targeted re-review (by reviewer, against specific finding IDs) is an efficient verification pattern. 19/20 findings PASS on first re-review. The one residual failure (HC-005 partial fix) was caught and fixed in a single targeted edit.

*Stop hook enforcement.* The stop hook (`~/.claude/stop-hook-git-check.sh`) blocked every session exit with uncommitted changes. This forced real-time commit discipline that was absent in stages 1–4. The stop hook is the most effective breadcrumb enforcement mechanism deployed to date.

**What didn't work.**

*Assumption numbering collision.* The orchestrator instructed the Batch 2 humanoid-systems-architect agent to add §A14 for the gait factor, without first checking whether §A14 had been taken by the robotics-actuation-structures agent (it had, for actuator mass sensitivity). The gait factor ended up as §A16. The assumption register is now non-sequential in its section-origin ordering. **Fix:** Before instructing any agent to add §A_N, query the assumption register for the highest existing §A_N and pass the correct next number in the agent prompt.

*Background agent interleaving with manual commits.* Multiple background agents wrote to overlapping files (session-logs.md, margins-and-assumptions.md) and completed after the orchestrator had already committed earlier versions of those files. This produced a sequence of small catch-up commits rather than clean per-agent commits. **Fix:** Wait for all parallel agents to complete before committing cross-cutting files (session-logs, margins register, cross-coupling log). Commit section files (§02, §03, etc.) eagerly, but hold cross-cutting files for a final batch commit.

*GitHub issues sync failure.* The GitHub MCP token expired during the P1/P2 issue-creation batch, leaving all 10 issues uncreated. The `review/triage.md` file serves as the canonical tracking document, but GitHub issues are the intended interface for external stakeholders. **Fix:** GitHub MCP should be tested for token validity before a batch write operation. Failure should be surfaced immediately, not silently skipped.

*§06 actuation power heritage (HC-006) was partially addressed.* The 0.85 efficiency factor is now explained as the ratio of HD-Electric efficiency (83%) to SEA efficiency (75%), but the underlying Valkyrie SEA power figure (1,800 W) is still from an estimated figure based on battery capacity and runtime — not a direct published measurement. This is a residual weakness correctly noted in the re-review PASS verdict ("requires validation against per-joint power data when hardware is available"). It was correctly scoped as a Major (not Blocker) and the fix correctly moves it from "uncited" to "cited with validation caveat."

**Net assessment.** Stage 6 executed the first real review pass and closed 10 Blockers and 12 selected Majors. The 51 combined findings confirmed that stage 5 section agents drifted on scope (word count) and technical discipline (unsupported numbers, broken heritage, arithmetic errors). The review-fix-re-review cycle worked correctly. The stop hook successfully enforced commit discipline. Key improvements needed for stage 7: assumption numbering handoff protocol, background agent commit sequencing, and citation discipline enforcement at agent prompt level.

---

## Stage 8 Assessment

The triage document (`triage-stage8.md`) with paragraph-level dispatch plan worked well — it provided enough specificity that agents knew exactly what to fix without reading the full review files. Timeout recovery was handled correctly: when agents timed out, the orchestrator diagnosed what had completed, then made remaining fixes directly rather than re-dispatching full prompts; this was faster and more reliable than re-dispatch for targeted single-paragraph changes. A `status.md` event log was created mid-session for live progress visibility and proved effective. One gap: scope-discipline review was skipped because `scope-discipline-reviewer` does not exist as a subagent type; the orchestrator should have dispatched a general-purpose agent for scope verification rather than omitting the step entirely. CLAUDE.md engagement style was added mid-session as a parallel non-content task — correctly handled without disrupting content work.
