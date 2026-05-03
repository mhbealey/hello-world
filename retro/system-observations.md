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

---

## 2026-05-03 — Word count overruns are a repeating pattern, not a one-time failure

**Pattern:** Two of four Stage 7 Question (b) section agents exceeded hard word count caps that were explicitly added to agent prompts in Stage 7 Task 1. `study/02-human-in-the-loop/02-latency-tradespace.md` was written at approximately 3,000 words against a 3,000-word hard cap — the agent's self-reported count put it exactly at the cap ("approximately 3,000 words (at hard cap; the latency table, derivation, and multi-tier discussion together approach the limit)"), but the actual document contains enough material that it was flagged as possibly over. `study/02-human-in-the-loop/03-autonomy-trl-tasking.md` was written at 4,479 words against the same 3,000-word hard cap — a 49% overrun. The autonomy-trl-tasking agent correctly stated the overrun ("Word count: approximately 4,479 words — over the 3,000-word hard cap. Flagged for Stage 8 scope-discipline reviewer."). The two agents that stayed within target were human-factors-teaming for §02-01 (1,724 words, within 1,500–2,000 target) and §02-04 (3,340 words, within 2,500–3,500 target). Stage 6 scope-discipline review found similar overruns in §04-sensing-autonomy.md (5,182 words) and §05-environments-hardening.md (4,422 words). This is the second consecutive stage where newly written sections exceed their word count caps.

**Evidence:** `retro/session-logs.md` (2026-05-03 — autonomy-trl-tasking entry: "Word count: approximately 4,479 words — over the 3,000-word hard cap. Flagged for Stage 8 scope-discipline reviewer."); `study/02-human-in-the-loop/03-autonomy-trl-tasking.md` (self-reported 4,479 words; the 20-task taxonomy table alone spans 22 rows; the TRL assessment table spans 9 rows; the gap analysis section and counter-case section are each several hundred words); `study/02-human-in-the-loop/02-latency-tradespace.md` (self-reported "approximately 3,000 words (at hard cap)"; five substantive sections with multiple sub-tiers each); `retro/session-logs.md` (2026-05-03 — scope-discipline-reviewer: "5,182 words is the primary problem, with a ~700-word foundation models field survey... ~400 words of general context framing").

**Implication:** The word count cap instruction is understood by agents (they report their word counts, they acknowledge when they exceed caps) but is not effective at the content-planning stage. The pattern reveals a structural problem: agents begin writing with a topic outline — TRL assessment table, task taxonomy, gap analysis, counter-case, reconciliation — and discover at the end that the content exceeds the cap. At that point, the agent faces a choice between (a) cutting substantial analytical content that it believes adds value, and (b) delivering the full content and flagging the overrun. Agents consistently choose (b), which is rational from a content quality standpoint but defeats the purpose of the cap. The cap instruction alone is not sufficient enforcement because agents can report compliance failures after the fact rather than preventing them. This is the instructional-vs-structural enforcement problem again, appearing in a different domain: word counts, not breadcrumbs.

**Recommendation:** Two changes are needed. First, require agents to estimate and state their planned word count by section before writing each section, and get explicit confirmation from the orchestrator if the estimate exceeds the cap. This introduces a gate before overrun rather than a report after it. Second, for structurally overrun sections (where a 3,000-word cap requires cutting an inherently 5,000-word analysis), the planning conversation should reconsider whether the cap is realistic for the content type — §02-03's 20-task taxonomy + TRL table + gap analysis + counter-case is inherently more than 3,000 words if done rigorously. If the cap cannot be met without degrading analytical quality, the cap should be revised, not violated repeatedly and flagged for a downstream scope-discipline reviewer to trim. The scope-discipline reviewer is an expensive way to do structural editing that should happen at task-planning time.

**Severity:** concerning

---

## 2026-05-03 — Closing action failures: content agents skip administrative closing actions at consistent rate

**Pattern:** The human-factors-teaming agent completed two substantive sections (§02-01 at 1,724 words and §02-04 at 3,340 words, both analytically sound) and then failed to execute two mandatory closing actions: adding §A18 and §A19 to `study/05-cross-cutting/margins-and-assumptions.md`, and writing a session log entry. The cross-coupling log entry for the supervisor ratio and crew composition parameters referenced §A18 and §A19 by number, indicating the agent was aware of the register and intended to add the assumptions — but the actual writes were never made. The orchestrator added both assumptions (§A18, §A19) and the session log entry as mandatory closing actions before the stage could be considered complete. This is structurally identical to the soviet-russian-heritage agent's Stage 5 failure: that agent also completed substantive content but did not write a session log entry (noted in `retro/agent-performance.md`).

**Evidence:** `retro/session-logs.md` (2026-05-03 — human-factors-teaming entry, "Got stuck": "§A18 and §A19 were referenced in CC log and teaming model text but not written to the assumptions register. Orchestrator added both as a mandatory closing action. Session log entry also added by orchestrator (agent did not write it)."); `study/05-cross-cutting/margins-and-assumptions.md` (§A18 and §A19 entries both carry the note "Added 2026-05-03 by human-factors-teaming (orchestrator completing missing closing action)"); `study/05-cross-cutting/cross-coupling-log.md` (supervisor ratio and crew composition entries reference "See §A18" and "See §A19" as register pointers, confirming the agent wrote the CC log but not the register entries).

**Implication:** The closing action gap is not random. It follows a consistent pattern: the agent completes the primary content deliverable (section text, cross-coupling log) and then fails at the administrative tail (session log, assumption register). This suggests the agent treats content-generation and administrative closing as a sequential queue, and the queue terminates after the last substantive item rather than running to completion. The mandatory closing actions list at the bottom of agent prompts is a text checklist, not a blocking gate — an agent can exit without proving it has written to the register, and the cost of that exit is zero at the moment of exit. The cost is borne later by the orchestrator who detects the gap. Two instances of the same failure pattern (Stage 5 heritage agent, Stage 7 human-factors-teaming agent) across different agents and different stages confirms this is a system-level issue, not individual agent variability.

**Recommendation:** The mandatory closing actions list must be restructured as a checklist that generates verifiable artifact evidence, not just a reminder. For the assumption register specifically: agent prompts should require the agent to state the §A number of each assumption it is adding before it is added ("the next available assumption number is A19; I will now add §A19 as follows...") and to quote the first line of the added assumption after writing it ("Added §A19: 'Crew composition at IOC: 4 crew, 3 humanoids...'"). This makes the closing action explicit and verifiable in the session output, rather than relying on the agent to have completed it silently. The orchestrator can then check the output log rather than the file state to confirm closing actions were executed.

**Severity:** concerning

---

## 2026-05-03 — Agent timeout and direct orchestrator authorship: new recovery pattern requires policy

**Pattern:** The soviet-russian-heritage agent (Stage 7, Task 2) produced only 24 tokens before terminating with a stream idle error (timeout). The orchestrator wrote Topic 7 — approximately 1,000 words covering cosmonaut supervisory control performance data, Mir crew time allocation, Lyappa arm supervisory control examples, Mars-500 behavioral health results, and the Lunokhod NIP-10 team model projected to 2035 — directly, without invoking a sub-agent. The direct authorship was successful: the content meets the study's analytical standards, three BibTeX entries were added, and the total `soviet-russian-heritage.md` file reached 6,702 words across 7 topics. This is the first recorded instance of the orchestrator functioning as a content author rather than a dispatcher in this project.

**Evidence:** `retro/session-logs.md` (2026-05-03 — orchestrator as soviet-russian-heritage entry: "Topic 7 written directly by orchestrator after soviet-russian-heritage agent timed out. Topic 7 scope: cosmonaut supervisory control performance data... Word count for Topic 7: approximately 1,000 words."); `study/05-cross-cutting/soviet-russian-heritage.md` (total 6,702 words, 7 topics completed).

**Implication:** The direct authorship recovery works at the content level but creates two systemic risks. First, the orchestrator writing content is architecturally anomalous — CLAUDE.md defines the orchestrator as a dispatcher that "decomposes work and dispatches to sub-agents," with ownership of specific cross-cutting files but not the substantive study sections. Orchestrator-authored content lacks the agent-ownership chain that makes the breadcrumb trail traceable; the session log entry for Topic 7 is recorded under "orchestrator (as soviet-russian-heritage)" rather than under the owning agent. Second, direct authorship as a timeout fallback establishes a precedent: if an agent times out, the orchestrator writes the content directly. This precedent may reduce the urgency of diagnosing and resolving agent timeout conditions if direct authorship is perceived as a low-cost alternative. The soviet-russian-heritage agent's timeout has no documented root cause, no attempted retry, and no remediation note in the session log — the fallback was used immediately.

**Recommendation:** The orchestrator should establish a timeout policy with three tiers: (1) retry the same agent once with a reduced scope prompt (e.g., "write Topic 7 only, ~800 words"); (2) if the retry also times out, invoke the heritage agent with a scoped deliverable prompt; (3) if that also fails, invoke direct authorship as a last resort with an explicit note that the content requires review against the owning agent's standards. The current practice skips tiers 1 and 2. Additionally, timeout events should be logged to `retro/agent-performance.md` with any available diagnostic information (which agent, approximate token count at timeout, task description), so recurring timeout patterns on specific agents can be identified. A single timeout is informational; a pattern of timeouts on a specific agent class indicates a prompt length or task scope problem that should be addressed structurally.

**Severity:** minor

---

## 2026-05-03 — Cross-coupling log quality improved: Stage 7 entries are substantively richer than prior stages

**Pattern:** The five new cross-coupling log entries added in Stage 7 — forward-deployed supervisory latency target and relay availability floor, latency-tier autonomy handoff, task allocation table at IOC, human value floor, supervisor ratio, crew composition — are structurally and substantively richer than entries from Stages 5 and 6. Each Stage 7 entry explicitly names the downstream agents it affects, states the specific parameter value those agents will consume, and provides the reasoning chain that justifies the value. The supervisor ratio entry, for example, names conops-integrator, cost-program, and far-side-base-architect as affected agents, states the specific parameter values each will consume ("4.25 person-hours supervisory demand per crew shift," "4-person crew defines the annual crew operations cost"), and traces the derivation to a five-step justification chain in §02-04 Section 3. By contrast, the Stage 5 entries for the dust mitigation strategy and sensor suite allocation name affected agents but provide only one or two sentences of basis, without specifying which parameter values the downstream agents should use.

**Evidence:** `study/05-cross-cutting/cross-coupling-log.md` — comparing Stage 5 entries (e.g., "Dust mitigation primary strategy": 2 sentences of basis, affected agents named but downstream parameter values not specified) against Stage 7 entries (e.g., "Supervisor ratio assumption": 5-step derivation chain, specific numerical inputs named for each downstream agent, owner and cross-register pointer included). The Stage 7 entries also include `@register pointer` references to §A18 and §A19, creating explicit cross-links between the coupling log and the assumption register that Stage 5 entries lack.

**Implication:** The improvement in cross-coupling log quality is not accidental. It appears to result from the agent dispatch prompt format used in Stage 7, which required cross-coupling log entries to include "explicit 'affects' fields naming downstream agents and the parameter values they will consume." When the output format specifies the required content explicitly (not just "add a cross-coupling entry" but "include the parameter value downstream agents will use"), agents produce entries that are actionable rather than advisory. This is a positive example of the structural-over-instructional principle: the output format requirement enforces content quality in a way that the general "log your decisions" instruction does not.

**Recommendation:** The cross-coupling log entry format should be codified as a template in the log file's header section, replacing the current minimalist format description. The template should explicitly require: (a) the specific numerical value or position being set, (b) for each affected agent, the specific parameter value that agent will consume, and (c) a pointer to the assumption register entry if one was created. Stage 7's implicit prompt practice should become explicit in the file format, so it applies to all future entries regardless of whether the dispatch prompt enforces it.

**Severity:** informational (positive observation)
