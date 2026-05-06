---
title: "ADR-010: Render tools generate human-readable views from YAML stores"
status: Accepted
date: 2026-05-06
---

# ADR-010: Render tools for cross-coupling and assumption registry views

## Status

Accepted

## Context

`cross_coupling.yaml` and `assumption_registry.yaml` are machine-readable YAML stores. Agents can query them via CLI or Python API. But at handback time, human reviewers need to scan all locked decisions and critical assumptions without running CLI commands.

## Decision

Add two render scripts:
- `system/tools/render_cross_coupling.py` — renders `cross_coupling.yaml` to Markdown, organized into locked / active / superseded sections with basis notes
- `system/tools/render_assumptions.py` — renders `assumption_registry.yaml` to Markdown, sorted by risk level (critical → low), with summary table and detailed entries

Both scripts:
- Accept `--db PATH` and `--out PATH` arguments
- Default to stdout if no `--out` specified
- Support filter flags (`--locked-only`, `--risk`, `--status`)
- Include generated timestamp and study_id in output header

**Render at handback:** The handback.py script should run both render tools and attach the output to the handback package. This is not yet implemented; it is a Cycle 2 task.

## Consequences

**Positive:**
- Handback packages become self-contained: all decisions and assumptions visible without querying YAML
- Render output can be committed to `review/` directory for reviewer consumption
- Filtering by `--risk critical` or `--locked-only` supports quick executive review

**Negative:**
- Rendered files can go stale if YAML is updated and render is not re-run; these are outputs, not sources of truth
- No automatic render trigger; depends on handback script integration (Cycle 2)
