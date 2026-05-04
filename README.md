# Private Space Program

Analytical infrastructure for a private space program. Studies are produced outputs. The agent system, tooling, and gates are the persistent product.

## First study

**Lunar Humanoid Pathfinder** — `studies/archive/lunar-humanoid-pathfinder/`

Concept study examining humanoid-forward architecture for space exploration, with a lunar far side permanent base as the testbed. Eight stages, completed 2026-05-04.

## Repo structure

| Directory | Purpose |
|-----------|---------|
| `system/` | Agents, orchestration, tools, retro, state |
| `studies/active/` | Studies in progress |
| `studies/archive/` | Completed studies (read-only) |
| `program/` | Roadmap, milestones, work packages |
| `team/` | Roles, onboarding |
| `business/` | Legal, pitch materials |
| `ops/` | Audits, architecture decision records |

## System v1.0

Restructured from a single-study repo to a program-level infrastructure on 2026-05-04. Key changes:

- Study content moved to `studies/archive/lunar-humanoid-pathfinder/`
- Agents generified and split into base/domain/meta/reviewer layers
- Six reviewer types promoted to first-class agent files
- CLAUDE.md rewritten to describe the system, not the study
- AlphaEdge application code deleted (88 files)

See `ops/audits/audit-v1.0-2026-05-04.md` for the full restructure audit.

## Running the system

Build the study site:
```
python system/tools/build_site.py --study lunar-humanoid-pathfinder
```

Generate a handback:
```
python system/orchestration/handback.py --stage N --study <study-id>
```

Start a new study:
```
python system/orchestration/new_study.py --id <id> --title "<title>" --domain <domain>
```
