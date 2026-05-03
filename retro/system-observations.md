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

**2026-05-03 update:** Stage 6 executed the first real review pass (6 reviewers × 6 sections). Finding count: 10 Blockers, 41 Majors, 30 Minors, 19 Nits — 51 combined Blockers+Majors, exceeding the scaffolding's predicted 50-finding threshold. This confirms the observation was correct: the "zero findings" signal in stage 4 was a false negative from absent reviews, not a clean bill of health. All 10 Blockers and 12 selected Majors were addressed in Batch 1/Batch 2 fix passes. 20/20 re-review findings PASS. This observation is resolved.

---

## 2026-05-03 — Citation corpus is non-functional: ~22 of 25 citation keys have no BibTeX entries

**Pattern:** The six Question (a) section agents produced documents with approximately 25 inline citation keys in `\cite{key}` format. Spot-checking by the heritage-citations reviewer found that approximately 22 of 25 keys had no corresponding BibTeX entry in `corpus/references.bib`. The three keys with bib entries are `zhang2020lnd` (added by space-environments during stage 6 fix pass), `ono2018msl` (added by robotics-sensing-autonomy), and `nvidia2023jetson` (added by robotics-sensing-autonomy). All other citation keys — including load-bearing ones like `\cite{radford2015valkyrie}`, `\cite{bostondynamics2024atlas}`, `\cite{nasa2023valkyrieFactsheet}`, `\cite{paine2015valkyrieActuator}`, `\cite{harmonicdrive_ag_catalog}`, `\cite{ssrms2020ntrs}` — are dangling.

**Evidence:** `review/heritage-citations-findings.md` (HC-009, Major treated as near-Blocker): "Only 3 of ~25 citation keys have BibTeX entries. All six section agents generated citation keys in their text but almost none have corresponding entries in `corpus/references.bib`." `review/triage.md` (P2-8): "This makes the document non-functional as a citable study — a reviewer cannot look up any of the cited sources."

**Implication:** The document is not yet a citable study. It is a concept paper with citation-shaped markers. A reader who wants to verify the Valkyrie 1,800 W figure, the Atlas Electric 89 kg mass, or the SSRMS joint efficiency range cannot do so from the current bib file. The citation keys create an expectation of verifiability that the bib file does not fulfill. This is a publishability blocker that must be resolved before the study can be shared externally.

The priority fix list (from P2-8): Valkyrie R5 fact sheet, Harmonic Drive AG catalog, Chang'e-4 LND paper (done), Mars AutoNav paper (done), ISS battery NTRS document. The robotics-actuation-structures stage 6 fix pass added `harmonicdrive_csf_catalog`, `iko_crb_catalog`, `ssrms2020ntrs`, `harmonicdrive_esmats2019`, `mechanical_efficiency_hd_asme2021` — these need to be verified as real entries rather than agent-generated placeholder keys.

**Recommendation:** Stage 7 should include a dedicated "citation hygiene" task that verifies each existing `\cite{key}` against `corpus/references.bib` and adds bib entries for all load-bearing numerical claims. This is a separate task from new content generation — an agent that is both generating content and hunting BibTeX sources will deprioritize the BibTeX work. Dedicate a heritage-citations-reviewer pass specifically to bib completion.

**Severity:** major

---

## 2026-05-03 — Stop hook is the most effective breadcrumb enforcement mechanism deployed

**Pattern:** The git stop hook (`~/.claude/stop-hook-git-check.sh`) blocks session exit when uncommitted changes exist. In stage 6, the hook fired multiple times during the fix pass as background agents wrote to files after manual commits. Each firing required an immediate commit-and-push cycle, producing real-time commit discipline. This is the first stage in which breadcrumb discipline was maintained consistently without retroactive reconstruction.

**Evidence:** All stage 6 work is captured in contemporaneous commits with specific finding IDs in commit messages. The `retro/session-logs.md` entries are real-time, not retroactive. `cross-coupling-log.md` has entries added during the stage (not all on one date at the start). `margins-and-assumptions.md` has entries added by individual agents, not bulk-inserted at handback time.

**Implication:** Structural enforcement (a hook that blocks exit) is categorically more effective than instructional enforcement (a convention that can be skipped). The stop hook does not require agent discipline — it forces the action by making the cost of skipping visible and immediate (the session is blocked). This confirms Lesson 1's principle: "A gate that blocks progress is better than a warning."

**New pattern to capture:** The stop hook creates a pressure to commit partial work to clear the block. In stage 6, this twice resulted in committing files that background agents were still modifying (the margins-and-assumptions.md was committed with robotics-actuation-structures additions before the Batch 2 agent had completed its additions to the same file). The correct response is to commit section files immediately and hold cross-cutting files (session logs, margins register, cross-coupling log) for a final batch commit after all parallel agents complete.

**Recommendation:** Add to the orchestrator's workflow: "Cross-cutting files (session-logs.md, margins-and-assumptions.md, cross-coupling-log.md) are committed once, after all parallel agents on a batch have completed. Section files (§01–§06, §A files) may be committed eagerly per agent. This prevents partial-state commits on files that multiple agents are writing concurrently."

**Severity:** informational (positive observation with one corrective note)
