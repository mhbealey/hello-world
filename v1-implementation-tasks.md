# System v1.0 Implementation Tasks

## How this document works

This is the implementation backlog for the v1.0 spec. Tasks are organized into phases. Each task has a unique ID (T-NN), objective, acceptance criteria, dependencies, estimated session size, and a checkpoint flag.

Claude Code works through this incrementally. At session start: read this document and `system/state/v1-progress.yaml`, identify the next eligible task, report to founder, proceed on approval.

---

## Phase 0 — Bootstrap

### T-01: Create the progress tracker

**Objective:** Create `system/state/v1-progress.yaml` with schema for tracking task state.

**Acceptance criteria:**
- File exists at `system/state/v1-progress.yaml`
- Contains entries for every task with `status: not-started`
- Loads cleanly with `yaml.safe_load`

**Dependencies:** None.

**Size:** S.

**Checkpoint:** No.

---

### T-02: Create the v1 working directory skeleton

**Objective:** Create the top-level directory skeleton.

**Acceptance criteria:**
- Directories exist: `program/`, `studies/`, `system/`, `team/`, `business/`, `ops/`
- Each contains a placeholder README.md

**Dependencies:** T-01.

**Size:** S.

**Checkpoint:** No.

---

### T-03: Add CHANGELOG

**Objective:** Create `ops/CHANGELOG.md` documenting v1.0 work.

**Acceptance criteria:**
- File exists at `ops/CHANGELOG.md`
- First entry: "v1.0 implementation begun"
- Keep a Changelog convention

**Dependencies:** T-02.

**Size:** S.

**Checkpoint:** No.

---

## Phase 1 — Schemas

### T-04: Cross-coupling schema

**Objective:** `system/orchestration/schemas/cross_coupling.schema.yaml`

**Dependencies:** T-02.

**Size:** S.

**Checkpoint:** No.

---

### T-05: Assumption registry schema

**Objective:** `system/orchestration/schemas/assumption_registry.schema.yaml`

**Dependencies:** T-04.

**Size:** S.

**Checkpoint:** No.

---

### T-06: Finding, session log, and handback schemas

**Objective:** Three schema files under `system/orchestration/schemas/`.

**Acceptance criteria:**
- `finding.schema.yaml` — reviewer enum matches six reviewers
- `session_log.schema.yaml`
- `handback.schema.yaml`
- All validate against jsonschema

**Dependencies:** T-05.

**Size:** M.

**Checkpoint:** No.

---

### T-07: Schema validator tool

**Objective:** `system/tools/validate_all_yaml.py` validates every YAML file against its schema.

**Acceptance criteria:**
- Discovers YAML files and matches to schemas by location convention
- Exits 0 on success, nonzero on failures
- Tests at `system/tests/test_validator.py`

**Dependencies:** T-06.

**Size:** M.

**Checkpoint:** Yes.

---

## Phase 2 — Repository restructure

### T-08: Migrate lunar content to archive

**Objective:** All v0.1 study content at `studies/archive/lunar-humanoid-pathfinder/`

**Dependencies:** T-02, T-03.

**Size:** L.

**Checkpoint:** Yes.

---

### T-09: Update internal cross-references

**Objective:** All internal links point to new paths.

**Dependencies:** T-08.

**Size:** M.

**Checkpoint:** No.

---

### T-10: Remove unused infrastructure

**Objective:** Remove AlphaEdge stack (Next.js, Prisma, TypeScript).

**Dependencies:** T-09.

**Size:** M.

**Checkpoint:** Yes.

---

### T-11: Audit and rotate secrets

**Objective:** Remove `.env` files from history, add `ops/SECURITY.md`.

**Dependencies:** T-10.

**Size:** M.

**Checkpoint:** Yes.

---

## Phase 3 — Cross-coupling database

### T-12: Migrate cross-coupling log to YAML

**Objective:** `studies/archive/lunar-humanoid-pathfinder/cross_coupling.yaml`

**Dependencies:** T-04, T-08.

**Size:** L.

**Checkpoint:** Yes.

---

### T-13: Build the cross-coupling DB API

**Objective:** `system/tools/cross_coupling_db.py` with get/list/show/validate.

**Dependencies:** T-12.

**Size:** L.

**Checkpoint:** No.

---

### T-14: Build the cross-coupling consistency gate

**Objective:** `CrossCouplingConsistencyGate` in `system/tools/gates.py`.

**Dependencies:** T-13.

**Size:** M.

**Checkpoint:** No.

---

## Phase 4 — Assumption registry

### T-15: Migrate assumption registry to YAML

**Objective:** Convert margins-and-assumptions.md to structured YAML.

**Dependencies:** T-05, T-08.

**Size:** L.

**Checkpoint:** Yes.

---

### T-16: Build the assumption registry service

**Objective:** `system/tools/assumption_registry.py` with atomic ID allocation.

**Dependencies:** T-15.

**Size:** L.

**Checkpoint:** No.

---

## Phase 5 — Gate framework

### T-17: Word count gate

**Objective:** `WordCountGate` in `system/tools/gates.py`.

**Dependencies:** T-07.

**Size:** S.

**Checkpoint:** No.

---

### T-18: Citation integrity gate

**Objective:** `CitationIntegrityGate` in `system/tools/gates.py`.

**Dependencies:** T-17.

**Size:** M.

**Checkpoint:** No.

---

### T-19: Derivation display gate

**Objective:** Gate detecting bare numbers in tables without visible derivation.

**Dependencies:** T-18.

**Size:** M.

**Checkpoint:** Yes.

---

### T-20: Frontmatter validator

**Objective:** `FrontmatterValidator` in `system/tools/gates.py`.

**Dependencies:** T-17.

**Size:** S.

**Checkpoint:** No.

---

### T-21: Pre-handback gate runner

**Objective:** `gates.py main()` running all gates and aggregating results.

**Dependencies:** T-14, T-17, T-18, T-19, T-20.

**Size:** M.

**Checkpoint:** No.

---

## Phase 6 — Handback rewrite

### T-22: Migrate findings to structured YAML

**Objective:** Convert `review/*.md` finding files to structured YAML.

**Dependencies:** T-06, T-08.

**Size:** L.

**Checkpoint:** Yes.

---

### T-23: Rewrite the handback generator

**Objective:** `system/orchestration/handback.py` reading structured stores, max 5,000 words.

**Dependencies:** T-13, T-16, T-21, T-22.

**Size:** L.

**Checkpoint:** Yes.

---

## Phase 7 — Status surface

### T-24: Build the status surface

**Objective:** `system/orchestration/status.py` writing `system/state/status.yaml`.

**Dependencies:** T-06.

**Size:** M.

**Checkpoint:** No.

---

### T-25: Build the status web view

**Objective:** `system/tools/status_view.py` rendering status.yaml as phone-friendly HTML.

**Dependencies:** T-24.

**Size:** M.

**Checkpoint:** Yes.

---

## Phase 8 — Agent restructure

### T-26: Move agents to system/agents/

**Objective:** All `.claude/agents/*.md` at correct v1.0 paths.

**Dependencies:** T-08.

**Size:** S.

**Checkpoint:** No.

---

### T-27: Add versioning frontmatter to agent files

**Objective:** `version: 1.0.0` and `domain-applicability` on every agent.

**Dependencies:** T-26.

**Size:** S.

**Checkpoint:** No.

---

### T-28: Materialize five missing reviewer agents

**Objective:** Agent files for five reviewers in `system/agents/reviewers/`.

**Dependencies:** T-27.

**Size:** L.

**Checkpoint:** Yes.

---

### T-29: Identify lunar-specific content in agent prompts

**Objective:** `system/agents/MIGRATION_PLAN.md` per-agent migration plan.

**Dependencies:** T-27.

**Size:** L.

**Checkpoint:** Yes.

---

### T-30: Execute the base/overlay split

**Objective:** Generic base agents + lunar overlays at `system/agents/domain/lunar-surface/`.

**Dependencies:** T-29.

**Size:** L.

**Checkpoint:** No.

---

## Phase 9 — CI and testing

### T-31: Set up pytest infrastructure

**Objective:** `pyproject.toml` with project metadata and dev dependencies.

**Dependencies:** Any prior task that wrote tests.

**Size:** M.

**Checkpoint:** No.

---

### T-32: Set up CI workflow

**Objective:** `.github/workflows/ci.yaml` with test, schema-validation, gates jobs.

**Dependencies:** T-31.

**Size:** M.

**Checkpoint:** Yes.

---

### T-33: Set up pre-commit hooks

**Objective:** `.pre-commit-config.yaml` with ruff, schema validation, gates.

**Dependencies:** T-32.

**Size:** S.

**Checkpoint:** No.

---

## Phase 10 — Documentation

### T-34: Rewrite top-level CLAUDE.md

**Objective:** Under-100-line CLAUDE.md describing the system.

**Dependencies:** T-08, T-26.

**Size:** S.

**Checkpoint:** Yes.

---

### T-35: Rewrite README.md

**Objective:** New README under 1,500 words.

**Dependencies:** T-34.

**Size:** M.

**Checkpoint:** Yes.

---

### T-36: Document Architecture Decision Records

**Objective:** ADR-0001 through ADR-0008 in `ops/decisions/`.

**Dependencies:** T-30.

**Size:** L.

**Checkpoint:** No.

---

## Phase 11 — Cycle scaffolding

### T-37: Build the cycle scaffold template

**Objective:** `system/templates/cycle_scaffold_template.md`.

**Dependencies:** Phase 6 complete.

**Size:** M.

**Checkpoint:** No.

---

### T-38: Build the new-study scaffolding tool

**Objective:** `system/orchestration/new_study.py`.

**Dependencies:** T-30, T-37.

**Size:** L.

**Checkpoint:** Yes.

---

## Phase 12 — Visualization

### T-39: Define visual artifact schema

**Objective:** `system/orchestration/schemas/visual_artifacts.schema.yaml`.

**Dependencies:** T-06.

**Size:** S.

**Checkpoint:** No.

---

### T-40: Build the visual pipeline skeleton

**Objective:** `system/tools/visual_pipeline.py` with Stage 1 implemented.

**Dependencies:** T-39.

**Size:** M.

**Checkpoint:** Yes.

---

## Closing tasks

### T-41: Generate v1.0 implementation handback

**Objective:** `handback-v1.0-implementation.md` under 5,000 words.

**Dependencies:** All prior tasks.

**Size:** M.

**Checkpoint:** Yes.

---

### T-42: Tag v1.0.0 release

**Objective:** Annotated git tag v1.0.0.

**Dependencies:** T-41.

**Size:** S.

**Checkpoint:** Yes.

---

## Phase 13 — Out of scope for Claude Code

- T-OOS-01: Visual pipeline stages 2-5 (Meshy, Blender, Unreal)
- T-OOS-02: Third-party AI 3D service integration
- T-OOS-03: Production deployment infrastructure
- T-OOS-04: Agent dispatch mechanism refactoring beyond v1 spec
- T-OOS-05: Second study content (orbital platform)
