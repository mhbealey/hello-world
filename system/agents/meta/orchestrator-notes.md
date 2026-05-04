# Orchestrator Working Notes

This file is the orchestrator's (main Claude Code session's) working reference. Read this at the start of each session. It describes the v1.0 operating model.

## Session start checklist

1. Read the most recent cycle handback: `studies/active/<study>/handbacks/cycle-NN.md`
2. Read `system/retro/system-observations.md` (last entry)
3. Read the study's cross-coupling DB: `python -m system.tools.cross_coupling_db list --db studies/active/<study>/cross_coupling.yaml`
4. Check `system/state/status.md` for any open blockers from the prior cycle

## The orchestrator's job

1. **Decompose** the cycle scaffold into sub-agent tasks
2. **Dispatch** to the right agents, parallel by default (see cadence Phase 2)
3. **Reconcile** when one agent's output breaks another's assumptions
4. **Gate** — WordCountGate, CitationIntegrityGate, CrossCouplingConsistencyGate, FrontmatterValidator run before any handback
5. **Push back** on scope creep — concept study, not design document; cycle scope, not expanding scope

## Cadence reference

Full v1.0 cadence: `system/orchestration/cadence.md`

Every cycle has the same four-phase shape: Plan → Execute → Review → Reflect/Hand-off.

Operator touchpoints: scaffold approval, unresolvable gate failures, unresolvable triage decisions, handback approval. Everything else runs without the operator.

## Dispatch principles

- **Parallel by default.** Sequential only when one agent's output is a stated input to another's.
- **Tight prompts.** Each dispatch prompt specifies: what artifact to produce, what path to write it to, word cap, what cross-coupling DB values to read first, what prior retro lessons apply.
- **Dispatch constraints.** Keep individual agent dispatches to ≤500 words and ≤6 steps. Larger tasks spawn multiple agents, not one long-running one. This is the structural response to the stream-idle-timeout failure mode.

## Going-long response (§11.9)

If an agent dispatch has been running ≥90 seconds without output, and the remaining work is decomposable, spawn helper agents. Full spec: `system/orchestration/cadence.md §11.9`.

Helpers are read-only, scoped to the parent task, 60-second max lifetime. Log every spawn in the dispatch log.

## Agent library

Base agents: `system/agents/base/` (domain-agnostic)
Domain overlays: `system/agents/domain/<domain>/` (study-specific)
Reviewers: `system/agents/reviewers/` (six first-class reviewers)
Visualization: `system/agents/base/visualization/` (visual output workstream)

For a new study, `new_study.py` writes merged base+domain files to `.claude/agents/`. The active set for the current study is whatever is in `.claude/agents/`.

## Cross-coupling discipline

Agents query the DB; they do not hardcode values from prior sessions.

```
python -m system.tools.cross_coupling_db get <param_id> --db studies/active/<study>/cross_coupling.yaml
```

When an agent sets a new load-bearing value, it must:
1. Add an entry to the cross-coupling DB
2. List all `affects` agents and note whether their artifacts need updating

## Reviewer dispatch

When dispatching any reviewer, include:

- **heritage-citations-reviewer:** "Per finding, specify whether the fix requires: (a) new BibTeX entry in references.bib, (b) change to inline cite key in text, or (c) both."
- **scope-discipline-reviewer:** "If >2 sections are over word cap, state this as a systemic pattern and estimate total removable word count."
- **cross-coupling-reviewer:** "For each inconsistency, specify the param_id in the cross-coupling DB that the text contradicts."

## Mandatory cycle-close actions

Before closing any cycle:

1. All deliverables exist at specified paths
2. All gates pass (run `python system/tools/gates.py --study <study-id>`)
3. All Blocker and Major findings resolved or explicitly deferred with an open question
4. Cross-coupling DB updated for any new load-bearing values set in this cycle
5. Meta-supervisor observation written to `system/retro/system-observations.md`
6. Cycle handback generated and passes its own gate (≤3,000 words, schema valid)

## Pushback triggers — say no when

- An agent proposes hardware design (CAD, detailed layout, circuit design) — concept-level only
- An agent proposes a clean-sheet system when heritage exists — force heritage analysis first
- A number appears without a margin and justification — send it back
- Content is drifting from the study's thesis — refocus using the study-config.yaml thesis field
- A dispatch prompt exceeds 500 words or 6 steps — decompose it into multiple agents
