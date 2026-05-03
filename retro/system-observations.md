---
title: System Observations
status: in-progress
owner: meta-supervisor
last-updated: 2026-05-03
---

# System Observations

Written by the meta-supervisor agent. Each entry is an observation about the system's behavior — orchestrator decisions, agent drift, missing dispatches, recurring patterns of error, or things that work unusually well.

Entries are append-only. Do not edit past entries.

---

## 2026-05-03 — Autonomy TRL contradiction: assumption registry discipline failure

**Pattern:** The orchestrator added two incompatible autonomy TRL assumptions to `study/05-cross-cutting/margins-and-assumptions.md` across stages 1–4 without detecting the conflict. The specific failure: one entry stated a TRL target for 2035 deployment; a second entry, added later by a different process, stated an incompatible value for the same parameter. Both lived in the registry simultaneously for an entire stage cycle. The conflict was caught only at stage 5 handback time, when both entries appeared in the same document section and the contradiction was visually obvious. No agent that read the registry during that window had clean inputs.

**Evidence:** `retro/session-logs.md` (stage 2–4 retroactive entry, "Got stuck" section); `retro/orchestrator-performance.md` (Stage 2–4 Assessment, item 2); `retro/process-lessons.md` (Lesson 3); `study/05-cross-cutting/cross-coupling-log.md` (first entry: "Autonomy TRL curve — Set by: orchestrator (resolution of stage 4 contradiction)"); `study/05-cross-cutting/margins-and-assumptions.md` (§A1, resolution note).

**Implication:** The assumption registry has no structural enforcement against contradictions. The "How to add an assumption" note added in stage 5 is a text instruction, not a gate. An agent or orchestrator that skips the preamble can add a conflicting entry without friction. The real failure is not that a contradiction appeared — contradictions are expected as analysis evolves — but that the registry has no field for "supersedes entry N" and no automated scan for duplicate-parameter entries. Contradictions are invisible until the full register is read linearly.

**Recommendation:** Add a "Supersedes" field to the assumption table. Add a soft check to `generate_handback.py` that scans for entries with identical or near-identical parameter names and flags them before handback generation. The current text-only instruction ("search this file for contradicting entries") relies on agent discipline, which has been demonstrated unreliable.

**Severity:** concerning

---

## 2026-05-03 — Breadcrumb atrophy: scaffolding without enforcement produces empty infrastructure

**Pattern:** Every breadcrumb convention — session logs, cross-coupling log, agent-performance and orchestrator-performance retrospectives, process lessons, system observations — was scaffolded in stages 1–4 and none were populated during those stages. Stage 5 reconstructed all of them retroactively from file metadata and the stage 4 handback. The retroactive reconstruction is explicitly flagged in `retro/session-logs.md`: "This entry is retroactive, written at the start of stage 5 from file metadata and the stage 4 handback." The cross-coupling log contains 13 entries, all dated 2026-05-03 (stage 5), with zero entries from any prior stage — meaning all cross-coupling decisions made in stages 1–4 were silently absorbed without record.

**Evidence:** `retro/session-logs.md` (stage 2–4 retroactive entry, "Got stuck" — "Breadcrumb discipline was scaffolded but not maintained"); `retro/orchestrator-performance.md` ("Enforcement failures" section); `retro/process-lessons.md` (Lesson 1: "Breadcrumb discipline does not happen by being scaffolded"); `study/05-cross-cutting/cross-coupling-log.md` (all entries dated 2026-05-03).

**Implication:** The structural reason is that scaffolding creates apparent completeness — the files exist, the format is documented, the conventions look real — without creating any friction when they are skipped. There is no difference from the agent's perspective between "I wrote the session log" and "I did not write the session log" when there is no gate. Worse: retroactive reconstruction is possible, which means the system can recover from breadcrumb atrophy, which removes the urgency of real-time maintenance. The retro artifacts should be viewed as unreliable for any analysis of what actually happened in stages 1–4; they represent the orchestrator's best reconstruction, not a contemporaneous record.

**Recommendation:** Breadcrumb conventions must be enforced at the boundary of a work unit, not at handback time. The only reliable enforcement is a blocking gate: the agent cannot declare a section draft-complete without appending to the session log and cross-coupling log. The mandatory closing actions now appended to each agent file are the right mechanism; the question is whether they are enforced or advisory. Stage 6 should treat missing closing-action evidence as a blocker, not a warning.

**Severity:** concerning

---

## 2026-05-03 — [VERIFY] discipline: inconsistent across agents, concentrated in heritage-mode agents

**Pattern:** The `[VERIFY]` inline flag — defined in `study/05-cross-cutting/soviet-russian-heritage.md` as marking claims "sourced from secondary sources only, have not been confirmed against primary literature, or are based on potentially unreliable aggregations" — is used 33 times in that file and 8 times in `study/01-optimal-space-humanoid/05-environments-hardening.md`. It appears 0 times in four of the six Question (a) agent outputs: `01-overview.md`, `02-form-factor-tradespace.md`, `03-actuation-structures.md`, and `04-sensing-autonomy.md`. The `01-overview.md` agent uses "unverified" 12 times in a table column but does not use `[VERIFY]` as an inline flag. The `04-sensing-autonomy.md` agent describes TRL gaps and qualification uncertainties at length in prose but applies no inline uncertainty marker to specific claims.

**Evidence:** Grep counts across agent output files: `soviet-russian-heritage.md` (33 `[VERIFY` instances); `05-environments-hardening.md` (8); `04-sensing-autonomy.md`, `03-actuation-structures.md`, `02-form-factor-tradespace.md` (0 each); `01-overview.md` (0 `[VERIFY]`, 12 "unverified" in table). The environments-hardening section uses both `[VERIFY]` and a distinct `[EST]` tag for estimated values.

**Implication:** The `[VERIFY]` discipline was adopted by the agents whose work is most explicitly grounded in primary-source uncertainty (heritage research, instrument measurements) and was skipped by the agents whose work is engineering analysis built on published specifications. This is partly appropriate — engineering analysis citing a manufacturer datasheet is different from a historical claim citing a secondary account — but it creates a misleading asymmetry. The sensing/autonomy section contains specific TRL claims ("TRL 4–5 in terrestrial sensor market"), power figures ("15–25 W"), and heritage comparisons that should be flagged for verification before PDR, but are not. Reviewers scanning for uncertainty flags will find them concentrated in the heritage files and draw incorrect conclusions about verification coverage in the engineering sections. The environments-hardening agent's adoption of a dual `[VERIFY]` / `[EST]` system is a better model: it distinguishes claims that need primary-source confirmation (`[VERIFY]`) from estimates derived by calculation (`[EST]`).

**Recommendation:** The next agent dispatch cycle should explicitly require that any specific numeric claim not directly traceable to a cited primary source carries either `[VERIFY]` or `[EST]`. This is a one-line addition to the mandatory closing actions: "Flag every numeric claim not from a direct primary source citation with [VERIFY] or [EST]." The environments-hardening dual-tag system should be documented as the project standard.

**Severity:** concerning

---

## 2026-05-03 — Review agents scaffolded but never invoked: zero-findings is a false signal

**Pattern:** All six reviewer agent definitions (`aerospace-engineer`, `heritage-citations`, `reliability-margins`, `scope-discipline`, `cross-coupling`, `devils-advocate`) exist in `.claude/agents/` and are listed in the dispatch graph as parallel-safe runners that "run in parallel on any draft-complete section." No review agent was invoked in stages 1–4 or in stage 5. The stage 4 handback reported "Blockers: 0, Majors: 0" — a number that reads as a clean bill of health but reflects only that no reviews ran. Stage 5 noted this explicitly: "Stage 4 reviewers were scaffolded but never invoked — zero findings count is misleading (reviews never ran)." As of this observation run, six sections of Question (a) are draft-complete and no review has been run on any of them.

**Evidence:** `retro/session-logs.md` (stage 2–4 retroactive entry, "Got stuck" — "Stage 4 reviewers were scaffolded but never invoked"); `retro/orchestrator-performance.md` (Stage 2–4 Assessment, item 3: "Scaffolded reviewers but never invoked them — left the stage 4 handback with a misleading 0 findings count"); `retro/process-lessons.md` (Lesson 2: "'Zero findings' is not a success signal without evidence that reviews ran"); `study/05-cross-cutting/dispatch-graph.md` (reviewer dispatch instructions); absence of any review output files in the repo.

**Implication:** Draft-complete sections have been designated complete without any adversarial review pass. The budget closes on paper, but no reviewer has looked at whether the 75 kg design-to mass is achievable, whether the heritage citations are accurate, whether the actuation selection survives a devil's advocate challenge, or whether scope creep has occurred. The scope-discipline reviewer exists specifically to catch the drift toward hardware design that CLAUDE.md warns against — and it has read nothing. The longer the review gap persists, the more downstream agents will build on unreviewed assumptions and the harder correction becomes.

**Recommendation:** First review pass should be the immediate next action after Question (a) sections are confirmed draft-complete. The six reviewers should run in parallel on the six Question (a) sections. Review output should be required before any Question (b) agent is dispatched, because the teaming model and ConOps sections both consume Question (a) numbers as inputs. A review finding that changes the mass budget after ConOps has consumed it creates the cross-coupling cascade the system is designed to prevent.

**Severity:** critical
