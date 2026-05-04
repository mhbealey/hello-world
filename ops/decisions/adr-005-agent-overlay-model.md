---
title: "ADR-005: Static file concatenation for agent domain overlays"
status: Accepted
date: 2026-05-04
---

# ADR-005: Static file concatenation for agent domain overlays

## Status

Accepted

## Context

Agents need domain-specific knowledge (e.g., a lunar-surface humanoid architect needs different priors than a deep-space-transit architect). Options for implementing this:

1. **Runtime injection**: concatenate base + overlay at agent invocation time
2. **Static pre-merge**: `new_study.py` concatenates base + overlay at study initialization, writes merged files to `.claude/agents/`
3. **Separate agent per domain**: maintain entirely distinct agent files per domain

## Decision

Static pre-merge via `new_study.py`. Domain overlays live in `system/agents/domain/<domain>/`. At `new_study.py` invocation, base content is concatenated with the domain overlay (if present) and written to `.claude/agents/` under the base agent name.

## Rationale

- **Claude Code agents are static files**: the `.claude/agents/` directory is read at session start; there is no runtime injection mechanism in Claude Code.
- **Single-file agents**: the merged file is self-contained and auditable.
- **Overlay is additive**: the separator `---\n## Domain overlay: <domain>` makes the boundary explicit.
- **No runtime dependency**: agents don't need to read overlay files during dispatch.

## Consequences

- `.claude/agents/` is regenerated from scratch by `new_study.py`. Files there are not canonical.
- Canonical sources are `system/agents/base/` and `system/agents/domain/`.
- If a domain has no overlay for an agent, the base file is copied as-is.
- Changes to base/domain sources require re-running `new_study.py` (or manual re-merge) to take effect in `.claude/agents/`.
- Visualization agents follow the same model: `system/agents/base/visualization/` + `system/agents/domain/<domain>/visualization/`.
