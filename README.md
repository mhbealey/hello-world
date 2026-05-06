# Private Space Program

Analytical infrastructure for a private space program. Studies are produced outputs. The agent system, tooling, and gates are the persistent product.

## Studies

| Study | Status | Domain |
|-------|--------|--------|
| Lunar Humanoid Pathfinder | Archived (`studies/archive/lunar-humanoid-pathfinder/`) | lunar-surface |
| Orbital Industrial Spaceport | Active, Cycle 1 complete (`studies/active/01-orbital-platform/`) | orbital-platform |

## What this system does

Multi-agent analytical framework for space architecture concept studies. An orchestrator dispatches specialized agents to produce documents; agents share state through a cross-coupling parameter database and assumption registry; gates validate output before handback.

Each study produces: a set of scoped analytical documents, a locked cross-coupling parameter DB, a numbered assumption registry, and a handback summary for session continuity.

## Repo structure

```
system/agents/base/      14 domain-neutral agents
system/agents/domain/    Study-specific overlays (lunar-surface, orbital-platform)
system/agents/compose.py Merge base + overlay at dispatch
system/tools/            cross_coupling_db, assumption_registry, render tools, gates
system/orchestration/    Study scaffolding, handback generation

studies/active/          Studies in progress
studies/archive/         Completed studies (read-only)

ops/decisions/           Architecture Decision Records
ops/handoff/             Handoff packages
```

## Running the system

**Compose a domain-specific agent prompt:**
```bash
python -m system.agents.compose teleoperation-latency orbital-platform
python -m system.agents.compose teleoperation-latency --base-only
```

**Query the cross-coupling database:**
```bash
python -m system.tools.cross_coupling_db --db studies/active/01-orbital-platform/cross_coupling.yaml list
python -m system.tools.cross_coupling_db --db studies/active/01-orbital-platform/cross_coupling.yaml list-locked
python -m system.tools.cross_coupling_db --db studies/active/01-orbital-platform/cross_coupling.yaml set <param> <value> --set-by <agent> --basis "<basis>" --lock
```

**Render parameter DB and assumption registry to Markdown:**
```bash
python -m system.tools.render_cross_coupling --db studies/active/01-orbital-platform/cross_coupling.yaml
python -m system.tools.render_assumptions --db studies/active/01-orbital-platform/assumption_registry.yaml
```

**Run tests:**
```bash
python -m pytest system/tests/
```

**Generate a handback:**
```bash
python system/orchestration/handback.py --stage N --study 01-orbital-platform
```

**Start a new study:**
```bash
python system/orchestration/new_study.py --id <id> --title "<title>" --domain <domain>
```

## Active study status

**01-orbital-platform** — Kilometer-scale orbital industrial spaceport at ~400 km LEO. Four study questions: (a) architectural configuration, (b) operations and traffic, (c) habitation and economics, (d) roadmap and partnership.

Cycle 1 complete. Four decisions locked. Cycle 2 awaits three founder decisions (orbital inclination, interface standard strategy, manufacturing product line). See `studies/active/01-orbital-platform/cycles/cycle-01/handback.md`.

## System version

v1.1 — Base/overlay agent split, compose.py, orbital-platform domain, cross_coupling_db lock/supersede, render tools. 2026-05-06.
