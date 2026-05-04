---
study_id: system-v1.0
cycle: v1.0-implementation
date_generated: 2026-05-04
status: complete
---

# v1.0 System Implementation Handback

**Generated:** 2026-05-04  
**Status:** COMPLETE  
**Progress:** 40/42 tasks (95.2% — T-41 and T-42 close the loop)

---

## What was built

The system was restructured from a single-study tool into a reusable program analytical infrastructure. The repo now contains the system (agents, tools, gates, orchestration) as the product, with studies as outputs.

### Core infrastructure (T-01 through T-13)

| Component | Path | Status |
|-----------|------|--------|
| Archive study with ARCHIVED.md | `studies/archive/lunar-humanoid-pathfinder/` | complete |
| study-config.yaml backfill | `studies/archive/.../study-config.yaml` | complete |
| Skeleton READMEs | `program/`, `team/`, `business/`, `ops/`, `studies/active/` | complete |
| CLAUDE.md rewrite | `CLAUDE.md` | complete |
| README.md rewrite | `README.md` | complete |
| Cross-coupling DB schema | `system/orchestration/schemas/cross_coupling.schema.yaml` | complete |
| Cross-coupling DB CLI | `system/tools/cross_coupling_db.py` | complete |
| Archive CC YAML (23 entries) | `studies/archive/.../cross_coupling.yaml` | complete |
| DB tests (4) | `system/tests/test_cross_coupling_db.py` | complete |
| Finding schema | `system/orchestration/schemas/finding.schema.yaml` | complete |
| Session log schema | `system/orchestration/schemas/session_log.schema.yaml` | complete |
| Handback schema | `system/orchestration/schemas/handback.schema.yaml` | complete |
| YAML validator | `system/tools/validate_all_yaml.py` | complete |

### Cadence and operations (T-14 through T-20)

| Component | Path | Status |
|-----------|------|--------|
| Cadence doc (4-phase cycle, §11.9) | `system/orchestration/cadence.md` | complete |
| Cycle scaffold template | `system/templates/cycle_scaffold_template.md` | complete |
| ADR-001 (v1.0 cadence) | `ops/decisions/adr-001-v1.0-cadence.md` | complete |
| Derivation display gate | `system/tools/gates.py` → `run_derivation()` | complete |
| Assumption registry migration | `studies/archive/.../assumption_registry.yaml` (19 entries) | complete |

### Gates and tooling (T-21 through T-28)

| Component | Path | Status |
|-----------|------|--------|
| gates.py (4+1 gates) | `system/tools/gates.py` | complete |
| Gate tests (9) | `system/tests/test_gates.py` | complete |
| Assumption registry CLI | `system/tools/assumption_registry.py` | complete |
| Assumption registry tests (7) | `system/tests/test_assumption_registry.py` | complete |
| Findings migration (63 YAML files) | `studies/archive/.../findings/` | complete |
| Handback generator rewrite | `system/orchestration/handback.py` | complete |
| Status surface | `system/orchestration/status.py` | complete |
| Status web view | `system/tools/status_view.py` | complete |

### Visualization workstream (T-28)

| Component | Path | Status |
|-----------|------|--------|
| ADR-002 (visualization first-class) | `ops/decisions/adr-002-visualization-first-class.md` | complete |
| Visual pipeline | `system/tools/visual_pipeline.py` | complete |
| Visual validator (7 gates) | `system/tools/visual_validator.py` | complete |
| Visualization agent prompts (5) | `system/agents/base/visualization/` | complete |
| Domain aesthetic-direction (3) | `system/agents/domain/*/visualization/aesthetic-direction.md` | complete |

### Agent architecture (T-27, T-29, T-30)

| Component | Path | Status |
|-----------|------|--------|
| Versioning frontmatter (22 files) | `system/agents/base/`, `system/agents/meta/` | complete |
| Migration plan | `system/agents/MIGRATION_PLAN.md` | complete |
| Priority 1 base/overlay split | `space-environments.md`, `cad-generation-agent.md` | complete |
| Lunar-surface domain overlays | `system/agents/domain/lunar-surface/` | complete |

### Study scaffolding (T-26)

| Component | Path | Status |
|-----------|------|--------|
| new_study.py | `system/orchestration/new_study.py` | complete |

### Infrastructure (T-31 through T-36)

| Component | Path | Status |
|-----------|------|--------|
| pyproject.toml | `pyproject.toml` | complete |
| CI workflow | `.github/workflows/ci.yaml` | complete |
| Pre-commit config | `.pre-commit-config.yaml` | complete |
| ADR-003 (YAML over SQLite) | `ops/decisions/adr-003-yaml-over-sqlite.md` | complete |
| ADR-004 (gate enforcement) | `ops/decisions/adr-004-gate-enforcement.md` | complete |
| ADR-005 (agent overlay model) | `ops/decisions/adr-005-agent-overlay-model.md` | complete |
| ADR-006 (helper constraints) | `ops/decisions/adr-006-helper-agent-constraints.md` | complete |

---

## Test suite

20 tests passing across 3 test files:
- `test_cross_coupling_db.py` — 4 tests
- `test_assumption_registry.py` — 7 tests
- `test_gates.py` — 9 tests

All pass clean on Python 3.11.

---

## What was not done

**T-30 partial:** Only Priority 1 agents split (space-environments, cad-generation-agent). Priority 2 splits (destinations-trajectories, conops-integrator, heritage-research-agent, robotics-sensing-autonomy, robotics-actuation-structures) deferred to first non-lunar study init per the migration plan.

**T-19 scope:** Derivation gate is implemented as a `Nit`-severity scanner. It finds bare numbers in table rows without derivation markers. Severity may need tuning based on false-positive rate observed in practice.

**Visual pipeline stubs:** `cmd_render` and `cmd_turntable` in `visual_pipeline.py` are stubs pending `pyrender` and `imageio[ffmpeg]` installation in the study environment. STL→GLB is implemented via trimesh.

---

## For the next operator

The system is ready for first-use on a new study. To initialize:

```bash
python -m system.orchestration.new_study \
  --study-id <id> \
  --title "<title>" \
  --domain lunar-surface \
  --sections 4
```

Then dispatch the first cycle using `system/templates/cycle_scaffold_template.md` as the starting structure.

Pre-handback gate run:
```bash
python -m system.tools.gates --study <study-id>
```

Status surface:
```bash
python -m system.tools.status_view  # http://localhost:8080
```

The first study priority should be to verify that `new_study.py` produces a correct skeleton end-to-end, then run one synthetic cycle through the full gate → handback pipeline.

---

## Architectural decisions locked

See `ops/decisions/` for six ADRs covering:
- v1.0 cadence model (ADR-001)
- Visualization as first-class output (ADR-002)
- YAML flat files over SQLite (ADR-003)
- Gate enforcement severity model (ADR-004)
- Static agent overlay concatenation (ADR-005)
- Helper agent constraints §11.9 (ADR-006)

These decisions are locked for v1.0. Changes require a new ADR.
