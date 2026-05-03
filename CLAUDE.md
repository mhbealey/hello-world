# Humanoid-Forward Space Exploration Study

## What this project is

A concept study examining humanoid-forward architecture for space exploration, with the lunar far side permanent base as the testbed. Output is a publishable concept paper of 80-150 pages, not a design document.

## Document purpose

This study is the core bones of a program, not an academic paper. Agents optimize for: decomposability into work packages with clear scope and deliverables; forward-carrying assumptions as program commitments with explicit go/no-go gates; real program structure with phases, milestones, and decision authority; identification of the minimum first article that proves the architecture; and traceability for handoff to teams that pick up the work. When in doubt between interesting analysis and actionable program input, choose actionable.

## The thesis

A humanoid-forward architecture is the unlock for three things current architectures cannot deliver:

1. Economically sustainable presence across the inner and middle solar system
1. The in-space industrial base that enables future deep space and eventual interstellar capability
1. Persistent scientific operations at destinations beyond credible crewed reach

The lunar far side base proves the human-humanoid teaming model before it extends outward.

## The four questions, in order

The study is structured around four questions. Each becomes a major document section. They are ordered by dependency — earlier answers constrain later ones.

**(a) Optimal Space Humanoid.** What does the machine actually look like? Foundational.
**(b) Human-in-the-Loop Value.** Where does human supervision add value, where is it overhead?
**(c) Workflow / ConOps.** How does a mission actually run, end to end?
**(d) Build and Deploy.** Technology roadmap, destinations, program structure.

A short opening section — *Why this study, why now* — frames the document before (a). Roughly two pages.

## How the agent system works

The project uses sub-agents defined in `.claude/agents/`. The orchestrator (this Claude Code session, working from this `CLAUDE.md`) decomposes work and dispatches to sub-agents. Each sub-agent owns specific document artifacts and is the only agent that should write to them. Cross-cutting agents (heritage, far-side-base-architect) feed the others rather than owning final document sections.

**Critical orchestrator behavior — cross-coupling detection.** When one agent updates an artifact, the orchestrator checks whether the update breaks assumptions in other agents' artifacts. Example: the humanoid systems architect raises mass from 80 kg to 120 kg → this changes the destinations-trajectories agent's lander manifest → this changes the cost-program agent's launch cost estimate. The orchestrator forces this reconciliation rather than letting inconsistency accumulate.

**Critical scope-discipline behavior.** Sub-agents will try to design hardware. Push back. The deliverable is a concept paper that takes positions and justifies them with margin analysis and heritage, not a CAD model. When an agent asks "should I size the actuator?" the answer is usually "size it parametrically against heritage data, document the assumption, move on."

## Document tree

All study artifacts live under `study/`. Agents own specific files. The structure:

```
study/
  00-front-matter/
    abstract.md
    why-this-why-now.md          [orchestrator + heritage]
  01-optimal-space-humanoid/
    01-overview.md                [humanoid-systems-architect]
    02-form-factor-tradespace.md  [humanoid-systems-architect]
    03-actuation-structures.md    [robotics-actuation-structures]
    04-sensing-autonomy.md        [robotics-sensing-autonomy]
    05-environments-hardening.md  [space-environments]
    06-mass-power-budget.md       [humanoid-systems-architect]
  02-human-in-the-loop/
    01-overview.md                [human-factors-teaming]
    02-latency-tradespace.md      [teleoperation-latency]
    03-autonomy-trl-tasking.md    [autonomy-trl-tasking]
    04-teaming-model.md           [human-factors-teaming]
  03-workflow-conops/
    01-overview.md                [conops-integrator]
    02-mission-timeline.md        [conops-integrator]
    03-fault-sustainment.md       [fault-management-sustainment]
  04-build-and-deploy/
    01-technology-roadmap.md      [technology-roadmap-trl]
    02-destinations.md            [destinations-trajectories]
    03-far-side-testbed.md        [far-side-base-architect]
    04-cost-program.md            [cost-program]
  05-cross-cutting/
    soviet-russian-heritage.md    [soviet-russian-heritage]
    open-questions.md             [orchestrator]
    margins-and-assumptions.md    [orchestrator]

corpus/                           (repo root, not under study/)
  references.bib                  [all agents append]
  heritage-notes/                 [all agents write stub bibs here]
```

## Working principles

1. **Margin everything.** Every number gets a margin and a justification. No bare values.
1. **Heritage before invention.** When an agent reaches for a number, the first move is to look up heritage. Invented numbers get flagged.
1. **Take positions.** A study that hedges everything contributes nothing. Take positions, defend them, note where reviewers will push back.
1. **Russian instinct.** When choosing between elegant and boring-but-flown, choose boring-but-flown unless there's a specific reason not to.
1. **Flag uncertainty.** TBDs and open questions go in `open-questions.md`. Don't paper over them.

## When to invoke which agent

The orchestrator invokes sub-agents via the Task tool. Each agent's `description` field in `.claude/agents/` tells the orchestrator when to use it. The cross-cutting agents (`soviet-russian-heritage`, `far-side-base-architect`) should be invoked frequently as consultants to other agents, not just for their own sections.

## The handback loop

This project runs as a loop between Claude Code (which executes stages) and a planning conversation (which designs new stages). At the end of each stage, generate a handback document:

```
python tools/generate_handback.py --stage N
```

The handback (`handback-stageN.md`) is a self-contained markdown document. The user pastes it into a new planning conversation, which produces the scaffolding for stages N+1, N+2, N+3. The user brings that scaffolding back to Claude Code. The loop repeats.

The handback is the contract between executor and planner. Maintain the breadcrumbs (frontmatter, cross-coupling log, session logs, retro artifacts) so the handback has real content to summarize.

When any stage completes, the orchestrator's last action before declaring the stage done is to generate the handback and confirm the user has it.
