---
title: "ADR-007: Domain-neutral base agents with study-specific overlays"
status: Accepted
date: 2026-05-06
---

# ADR-007: Domain-neutral base agents with study-specific overlays

## Status

Accepted

## Context

The v1.0 agent library was written for the lunar humanoid pathfinder study. Each agent file contained both methodology (domain-neutral) and study-specific data (lunar surface, humanoid platform, Queqiao-2 relay). When beginning the orbital spaceport study, every agent would need to be rewritten or the lunar-specific content would contaminate the new study.

Two options:
1. **Rewrite per study** — copy all agents, replace study-specific content each time. Simple, but no code reuse and no systematic way to share methodology improvements across studies.
2. **Base/overlay split** — base agents contain only domain-neutral methodology; domain overlays contain study-specific data, heritage, and decisions. Compose at dispatch time.

## Decision

Implement the base/overlay split. Base agents in `system/agents/base/`, domain overlays in `system/agents/domain/<domain>/`. A `compose.py` module merges base + overlay at dispatch, stripping overlay frontmatter and concatenating overlay body.

**Composition rule:** `compose_agent_prompt(base_path, overlay_path)` → base text + `\n\n---\n\n` + overlay body (frontmatter stripped). If overlay is missing, returns base only (not an error).

## Consequences

**Positive:**
- Base agents can be improved once and the improvement applies to all studies
- Domain overlays accumulate study-specific knowledge that does not pollute other studies
- `compose.py` is testable (17 tests in `system/tests/test_compose.py`)
- New domains require only a set of overlays, not a full agent rewrite

**Negative:**
- Agents now live in two files; orchestrators must compose before dispatch
- Overlay must not duplicate base content (it extends, not replaces)
- The boundary between "methodology" (belongs in base) and "study data" (belongs in overlay) requires judgment

## Compliance test

`test_compose_base_agent_is_domain_neutral` verifies that base agents contain ≤1 domain-specific term. All 14 base agents pass as of 2026-05-06.
