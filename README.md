# Humanoid-Forward Space Exploration Study

A concept study examining humanoid-forward architecture for space exploration, with the lunar far side permanent base as the testbed. Output: a publishable concept paper of 80–150 pages. Developed by a multi-agent AI engineering team.

## The Thesis

A humanoid-forward architecture is the unlock for three things current architectures cannot deliver:

1. **Economically sustainable presence** across the inner and middle solar system
2. **The in-space industrial base** that enables future deep space and eventual interstellar capability
3. **Persistent scientific operations** at destinations beyond credible crewed reach

The lunar far side base proves the human-humanoid teaming model before it extends outward.

## The Four Questions

The study is structured around four questions, ordered by dependency:

| # | Question | Status |
|---|----------|--------|
| (a) | **Optimal Space Humanoid** — What does the machine actually look like? | Draft complete |
| (b) | **Human-in-the-Loop Value** — Where does human supervision add value, where is it overhead? | Not started |
| (c) | **Workflow / ConOps** — How does a mission actually run, end to end? | Not started |
| (d) | **Build and Deploy** — Technology roadmap, destinations, program structure | Not started |

## Current State

- **12 sections written**, 37,000+ words
- **Question (a) draft-complete**: 6-section analysis of the space humanoid covering heritage, form factor, actuation, sensing/autonomy, environments, and mass/power budget
- **Mass budget closes**: 75 kg design-to / 97.5 kg not-to-exceed; 487 W steady-state / 782 W peak
- **Form factor position**: Full bipedal humanoid, defended on program economics grounds
- **23 open questions** logged with owners and milestone gates

## Agent System

This study is developed by 17 specialized AI agents, each owning specific artifacts:

- **Subsystem agents**: humanoid-systems-architect, robotics-actuation-structures, robotics-sensing-autonomy, space-environments, teleoperation-latency, autonomy-trl-tasking, human-factors-teaming, conops-integrator, fault-management-sustainment, destinations-trajectories, far-side-base-architect, technology-roadmap-trl, cost-program
- **Cross-cutting agents**: soviet-russian-heritage, far-side-base-architect
- **System agents**: visualization-agent, executive-summary-agent, meta-supervisor

The orchestrator dispatches agents in parallel by default, reconciles cross-coupling decisions, enforces breadcrumb discipline, and generates handback documents for planning continuity.

## Dashboard

```bash
pip install -r tools/requirements.txt
python tools/build_site.py
open site/index.html
```

## Handback Loop

This project runs as a loop between Claude Code (executor) and a planning conversation (designer). At the end of each stage:

```bash
python tools/generate_handback.py --stage N
```

The handback is a self-contained document pasted into a new planning conversation, which returns the scaffolding for the next stage.

## Key Assumptions

- **Autonomy TRL curve**: TRL 6 (space-relevant) by ~2029 → TRL 7+ by ~2035 → TRL 8 by ~2038-2040
- **Fission surface power** available by 2030s
- **Starship HLS or equivalent** operational for lunar manifest
- **Bipedal form factor**: 75 kg design-to, 500 W steady-state / 800 W peak power

## Repository Structure

```
study/           — concept paper sections (markdown)
corpus/          — BibTeX references
tools/           — build scripts and generators
retro/           — session logs, agent performance, system observations
.claude/agents/  — agent definitions
```
