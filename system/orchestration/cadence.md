---
title: Agent Operations Cadence v1.0
last-updated: 2026-05-04
status: active
---

# Agent Operations Cadence v1.0

The unit of work is a **cycle** — a fixed four-phase structure that repeats. Cycles vary in scope but not in shape.

---

## Phase 1 — Plan (half a day)

Before any agent dispatch, produce a cycle scaffold at `studies/active/<study>/cycles/cycle-NN/scaffold.md`. Use the template at `system/templates/cycle_scaffold_template.md`.

The scaffold must include:
- Cycle objective in one sentence
- Deliverable artifacts with paths and word caps (hard, not aspirational)
- Agent dispatch plan with dependency order
- Stop conditions
- Risks and mitigations drawn from prior cycle retros

Scaffold is approved before Phase 2 begins. Approval requires the scaffold to reference at least one lesson from the last three cycle retros.

---

## Phase 2 — Execute (1–3 days)

The orchestrator runs the dispatch plan from the scaffold. Gates run continuously. Gate failures block progress and route back to the responsible agent for repair.

**Dispatch logging:** every agent dispatch is logged with start/end timestamps, agent version, and outcome in `studies/active/<study>/cycles/cycle-NN/dispatch-log.yaml`.

**Going-long response:** when an agent dispatch runs ≥90 seconds without producing output, or when the task is structurally decomposable and at risk of timeout, the orchestrator may spawn **helper agents**. See §11.9 below.

Phase 2 ends when content artifacts are complete and pass all gates. Not when the calendar says so.

---

## Phase 3 — Review (half a day to one day)

All six reviewers run in parallel against the cycle's content. Findings are triaged:
- **Blockers and Majors:** resolved in this cycle
- **Minors and Nits:** deferred to a numbered backlog

Review is mandatory in every content cycle. A content cycle that skips review is flagged by the meta-supervisor as a structural anomaly.

Pure cleanup cycles (no new content) skip Phase 3.

---

## Phase 4 — Reflect and hand off (half a day)

1. Meta-supervisor produces a cycle observation at `system/retro/system-observations.md`. The observation answers:
   - What new failure modes appeared that prior retros didn't document?
   - What prior lessons that should have prevented problems didn't take?
   - What's the trend across the last three cycles — improving, flat, or regressing?

2. Handback generator runs: `python system/orchestration/handback.py --cycle NN --study <study-id>`

3. Cycle handback output: `studies/active/<study>/handbacks/cycle-NN.md` — maximum 3,000 words, structured format, pointers to full detail rather than inline.

Cycle closes when the handback passes its own gate (schema valid, word count ≤ 3,000, all required sections present).

---

## Operator touchpoints

Four per cycle. Everything else runs without the operator:

1. **Scaffold approval** (Phase 1 exit)
2. **Gate failures the orchestrator can't auto-resolve** (during Phase 2)
3. **Triage decisions on findings the orchestrator can't auto-resolve** (during Phase 3)
4. **Handback approval** (Phase 4 exit)

---

## §11.9 — Duration-triggered helper agents

When an agent dispatch is running long, the orchestrator may spawn ephemeral helper agents to parallelize remaining work. This is the structural response to the stream-idle-timeout failure mode documented in v0.1 retros.

### Trigger conditions

Spawn helpers when **any** of:
1. Active agent has been running ≥90 seconds without producing output (stream may be idle)
2. Active agent's task is structurally decomposable and the remaining work could parallelize
3. Active agent has produced partial output but is at risk of timing out before completing remaining scope

Trigger is duration **plus** decomposability. A 200-second task on a single tightly-coupled deliverable does not get helpers — it gets watched. A 90-second task with three independent subtasks remaining gets helpers.

### Spawn authority

Only the orchestrator (Claude Code at the top level) may spawn helpers. Agents themselves cannot spawn helpers.

### Helper scope and constraints

- **Read-only by default.** Writes flow through the parent agent. Helper produces a structured result; parent integrates it.
- **Scoped to the parent task's artifacts.** A helper assisting on §06 may read §06 and the cross-coupling DB; it may not read §02 or modify files outside §06's scope.
- **Inherits the parent agent's domain context.**
- **Ephemeral.** Exists only for the duration of the parent task. Not registered as inventory agents.
- **Maximum lifetime 60 seconds.** A helper that doesn't return in 60 seconds is killed and logged as a helper timeout.

### Logging

Every helper spawn is logged as a structured event in the dispatch log under the parent agent's entry. Fields: parent agent, helper purpose, helper input, helper output (or timeout), elapsed time.

The meta-supervisor observes helper spawn rates as a system-health signal: too many helpers means agent prompts are too coarse; too few when long-running tasks fail means the trigger is mistuned.

### What helpers are for

- Fact-checking a single claim against corpus or web while parent continues writing
- Validating arithmetic in a specific table while parent continues structuring
- Regenerating a malformed sub-section while parent works on next sub-section
- Cross-referencing a value against the cross-coupling DB while parent integrates other inputs

### What helpers are not for

- Making decisions the parent agent should make
- Writing new content outside the parent's scope
- Substituting for a properly-scoped review pass
- Recovering from agent failure unrelated to duration

---

## What does not get cadence treatment

- **Question selection:** which question gets worked next is a founder decision
- **Cycle length:** cycles take as long as they take; overrun is information, not failure
- **Reviewer focus:** which reviewers run hardest is set per cycle in the scaffold

---

## Migration from v0.1

Lunar pathfinder study is archived as-is. v1.0 cadence applies to the next study from cycle 1.

- Cycle 1 of the next study: planning cycle (scope, agents, assumption seed, cross-coupling seed)
- Cycle 2: first content cycle under the new cadence

---

## Success criteria at cycle 6

- Findings counts per cycle trending down
- Cycle duration becoming more predictable
- Lessons added per cycle trending down
- Operator time per cycle trending down
- Content quality at question-completion holding or improving

If trends don't appear by cycle 6, the cadence is wrong and we redesign. This is a hypothesis, not a religion.
