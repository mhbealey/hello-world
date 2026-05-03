# Orchestrator Working Notes

This file isn't an agent — it's the orchestrator's (main Claude Code session's) working reference. Read this at the start of each session.

## The orchestrator's job

1. **Decompose** user requests into sub-agent tasks.
1. **Dispatch** to the right sub-agents, in parallel where possible.
1. **Reconcile** when one agent's output breaks another's assumptions.
1. **Maintain** the master document and the open-questions list.
1. **Push back** on scope creep — this is a concept paper, not a design document.

## How to dispatch

For any non-trivial work session, the pattern is:

1. Identify which document section(s) the request touches.
1. Look up the owning agent(s) in the document tree in `CLAUDE.md`.
1. Invoke the owning agent via the Task tool with a tight, scoped prompt.
1. If the work depends on heritage analysis, also invoke `soviet-russian-heritage` as a consultant.
1. After the agent returns, check whether its output changes anything in adjacent sections. If yes, invoke the affected agents to update.

## Cross-coupling watchlist

These are the high-frequency coupling points. Watch them:

- **Humanoid mass** (humanoid-systems-architect) ↔ **Lander manifest** (destinations-trajectories) ↔ **Cost** (cost-program)
- **Autonomy TRL** (autonomy-trl-tasking) ↔ **Teaming model** (human-factors-teaming) ↔ **ConOps** (conops-integrator)
- **Far side comms architecture** (far-side-base-architect) ↔ **Latency tradespace** (teleoperation-latency)
- **Power architecture** (space-environments + humanoid-systems-architect) ↔ **ConOps duty cycles** (conops-integrator)
- **TRL targets** (technology-roadmap-trl) ↔ **Schedule and cost** (cost-program)

## Pushback triggers — say no when

- An agent asks to design hardware (CAD, detailed mechanical layout, circuit design). This study is concept-level.
- An agent proposes a new clean-sheet system when heritage exists. Force a heritage analysis first.
- An agent gives a number without a margin or a justification. Send it back.
- The document is drifting toward "humanoid robotics in general" rather than "humanoid robotics for the stated mission." Refocus.

## Mandatory closing actions

Before signaling that your work is complete, you must:

1. Update `last-updated` in the frontmatter of every file you modified.
1. If you added or changed an assumption, update `study/05-cross-cutting/margins-and-assumptions.md` and check for contradictions with existing entries.
1. If you made a decision other agents will reference (mass, power, TRL, configuration choice, etc.), append to `study/05-cross-cutting/cross-coupling-log.md`.
1. Append a one-paragraph entry to `retro/session-logs.md` describing what you attempted, what you completed, and any blockers.

Skipping these steps means your work is not complete. The orchestrator will reject incomplete sessions.

## Reviewer dispatch — required additions to every reviewer prompt

When dispatching any review agent (aerospace-engineer, heritage-citations, reliability-margins, scope-discipline, cross-coupling, devils-advocate), the dispatch prompt must include:

**For heritage-citations-reviewer:** "For any citation finding, specify whether the fix requires: (a) a new BibTeX entry in `corpus/references.bib`, (b) a change to the inline `\cite{}` key in the text, or (c) both. Specify this explicitly per finding — an agent that only fixes the text without fixing the bib leaves a dangling key, and vice versa."

**For scope-discipline-reviewer:** "If more than 2 sections are over word-count target, state this as a systemic pattern (not just individual findings) and estimate the total removable word count across all sections."

## Assumption register numbering protocol

Before instructing any agent to add §A_N (a specific numbered assumption), run:
```
grep "^### A[0-9]" study/05-cross-cutting/margins-and-assumptions.md | tail -3
```
Pass the correct next number in the agent prompt. Never hardcode a number at prompt-writing time — always look it up at dispatch time.

## Section agent word count discipline

When dispatching any section agent with a word count target, include: "Verify your output word count before completing. It must be within ±20% of [target] words. State the final word count in your session log entry."
