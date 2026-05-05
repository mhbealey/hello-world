# Private Space Program — Analytical Infrastructure

A multi-agent system that produces aerospace concept studies. The agents, orchestration tooling, and quality gates are the persistent product. Studies are outputs.

**First completed study:** Lunar Humanoid Pathfinder — humanoid-forward architecture for a lunar far side base. Eight stages, 64,000+ words, completed 2026-05-04. See `studies/archive/lunar-humanoid-pathfinder/`.

---

## How the system works

A study is produced across multiple work cycles. Each cycle follows the same loop:

```
Plan cycle (scaffold) → Dispatch agents → Gate check → Handback → Next cycle
```

**Agents** are specialized markdown prompt files in `system/agents/`. Each agent has a defined role: subsystem analyst, reviewer, meta-supervisor, etc. They run inside Claude Code, which dispatches them in parallel or sequentially depending on dependencies.

**Gates** are automated validation checks that run before any content is committed or handed back. They catch missing frontmatter, unresolved citations, word count overruns, and cross-coupling inconsistencies.

**The handback** is the memory system. Because Claude Code has no memory between sessions, `system/orchestration/handback.py` reads all structured study data and produces a summary document that the next session starts from. Without the handback, context is lost.

**The cross-coupling database** (`cross_coupling.yaml` per study) is the shared source of truth for load-bearing parameters — mass budgets, power numbers, any value that multiple agents reference. Agents read from it via `system/tools/cross_coupling_db.py` instead of inventing numbers independently.

---

## Repo structure

```
system/
  agents/
    base/           # Domain-agnostic agent definitions
    domain/         # Study-specific overlays (merged over base at study init)
    meta/           # Orchestrator support agents
    reviewers/      # Six first-class reviewer agents
  orchestration/
    handback.py     # Cycle handback generator
    new_study.py    # Study initializer — creates structure + merges agents
    status.py       # Study status reporter
    sync.py         # GitHub sync utility
    schemas/        # YAML schemas for all structured data files
  tools/
    gates.py        # Quality gates (frontmatter, citations, word count, cross-coupling)
    cross_coupling_db.py  # Parameter database CLI for agents
    build_site.py   # Render study markdown → HTML site
    validate_all_yaml.py  # Schema validation for all YAML files
  retro/            # System-level lessons (apply to all studies)
  state/            # Current system status and progress tracking
  tests/            # Unit tests

studies/
  active/           # Studies in progress
  archive/          # Completed studies (read-only)

program/            # Roadmap, milestones, work packages
team/               # Roles, onboarding
business/           # Legal, pitch materials
ops/
  audits/           # Codebase and process audits
  decisions/        # Architecture Decision Records (ADRs)
```

---

## Starting a new study

```bash
python system/orchestration/new_study.py \
  --id my-study-id \
  --title "Study Title" \
  --domain orbital-platform \
  --sections "00-front-matter,01-mission-arch,02-human-factors,05-cross-cutting"
```

This will:
1. Create `studies/active/my-study-id/` with the full directory structure
2. Seed `cross_coupling.yaml`, `assumption_registry.yaml`, and `study-config.yaml`
3. Merge `system/agents/base/` + domain overlays into `.claude/agents/` — making the merged agent set active in Claude Code immediately

Available domains: `lunar-surface`, `orbital-platform`, `deep-space-transit`

After running, fill in the cycle 01 scaffold at `studies/active/<id>/cycles/cycle-01/scaffold.md` before starting work.

---

## Running a study cycle

**1. Check current status:**
```bash
python system/orchestration/status.py --study <study-id>
```

**2. Run gates before committing:**
```bash
python system/tools/gates.py --study <study-id>
```

Gates check: frontmatter validity, word count caps, citation integrity, cross-coupling consistency. Exit code 0 = all pass. Non-zero = blockers or majors found — fix before committing.

Run a single gate:
```bash
python system/tools/gates.py --study <study-id> --gate citations
```

Available gates: `frontmatter`, `wordcount`, `citations`, `crosscoupling`, `derivation`

**3. Generate a handback at cycle end:**
```bash
python system/orchestration/handback.py --study <study-id> --cycle 1
```

This produces `studies/active/<id>/handbacks/cycle-01.yaml` and `cycle-01.md`. The markdown handback is what you paste into the next planning session.

Dry-run to preview without writing:
```bash
python system/orchestration/handback.py --study <study-id> --cycle 1 --dry-run
```

**4. Query the cross-coupling database (from agents or terminal):**
```bash
python -m system.tools.cross_coupling_db list --db studies/active/<id>/cross_coupling.yaml
python -m system.tools.cross_coupling_db get <param_id> --db studies/active/<id>/cross_coupling.yaml
python -m system.tools.cross_coupling_db validate --db studies/active/<id>/cross_coupling.yaml
```

---

## Building the study site

Renders study markdown to a navigable HTML site:
```bash
python system/tools/build_site.py --study lunar-humanoid-pathfinder
```

Output goes to `studies/archive/lunar-humanoid-pathfinder/site/`. The live site for the completed study is at [hello-world-gilt-ten.vercel.app](https://hello-world-gilt-ten.vercel.app).

---

## The handback loop (how sessions chain together)

The handback is the single most important operational concept in this system. Here is the full loop:

1. Claude Code runs cycle N — agents write content, reviewers produce findings, cross-coupling DB is updated
2. Operator runs `gates.py` — fix any blockers before proceeding
3. Operator runs `handback.py --cycle N` — generates the handback document from all structured data
4. Operator opens `handbacks/cycle-NN.md`, reviews it, optionally adds a note in the next-cycle-inputs section
5. Operator pastes the handback into a new Claude conversation (planning session)
6. Planning session reads the handback, designs the next cycle, returns a scaffold
7. Operator takes the scaffold back to Claude Code — cycle N+1 begins

**The handback is generated from structured data, not written by hand.** If findings YAML files, the cross-coupling database, and the session log are accurate, the handback is accurate. If they are not, the handback will reflect whatever is in them.

---

## Agent architecture

Agents are assembled at study-init time by `new_study.py`. The merge model:

- **Base agents** (`system/agents/base/`) are domain-agnostic. They define behavior that applies to any study.
- **Domain overlays** (`system/agents/domain/<domain>/`) extend base agents with study-context specifics — environment parameters, heritage references, domain constraints. An overlay file with the same name as a base file gets appended to it.
- **Reviewer agents** (`system/agents/reviewers/`) are first-class agents with no domain overlay. All six run on every study.
- **Meta agents** (`system/agents/meta/`) support orchestrator operation — the meta-supervisor and orchestrator notes.

The merged set is written to `.claude/agents/` at study init. **If you edit a base agent after init, re-run `new_study.py` or manually copy the updated file into `.claude/agents/` — the active set does not auto-update.**

For orchestrator operating style and engagement model, see `system/agents/meta/orchestrator-notes.md`.

---

## Pre-commit hooks

The repo uses pre-commit for automated checks on every commit:

```bash
pip install pre-commit
pre-commit install
```

Hooks:
- **ruff** — Python linting (E, F, W, I rules)
- **schema-validation** — validates all YAML files against their schemas (runs on YAML changes)
- **pytest-fast** — runs unit tests (runs at pre-push)

Run manually:
```bash
pre-commit run --all-files
```

---

## Running tests

```bash
pytest system/tests/ -v
```

Tests cover gate logic, cross-coupling DB operations, and assumption registry. See `system/tests/` for fixtures and test files.

---

## Key operational documents

| Document | What it is |
|----------|------------|
| `CLAUDE.md` | System context for Claude Code — read this to understand the engagement model and mandatory breadcrumb protocol |
| `system/agents/meta/orchestrator-notes.md` | Full orchestrator operating model |
| `system/retro/system-observations.md` | System-level lessons from all completed studies — read before starting a new study |
| `system/retro/process-lessons.md` | Process lessons with root causes and fixes |
| `ops/decisions/` | Architecture Decision Records — locked choices and the reasoning behind them |
| `ops/audits/` | Codebase audits |

---

## Environment variables

Copy `.env.example` to `.env` and fill in:

```
ANTHROPIC_API_KEY=     # Required for Claude Code
CROSS_COUPLING_DB=     # Optional: default path for cross_coupling_db.py
```

---

## Python environment

Requires Python 3.11+. Install dependencies:

```bash
pip install -r system/tools/requirements.txt
```

Or using pyproject.toml:
```bash
pip install -e .
```
