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
