---
title: "ADR-009: compose.py as the canonical agent dispatch interface"
status: Accepted
date: 2026-05-06
---

# ADR-009: compose.py as the canonical agent dispatch interface

## Status

Accepted

## Context

With the base/overlay split in place (ADR-007), there are now two ways to dispatch an agent: (a) read the base file directly, (b) compose base + overlay and use the merged text. If agents are dispatched inconsistently, some will operate on domain-neutral methodology without study-specific data, which is not the intended operation.

## Decision

`system/agents/compose.py` is the single dispatch interface. All agent invocations in a study context use `compose_for_domain(agent_name, domain)`. Direct base-file reads are permitted for introspection and testing only.

**CLI:** `python -m system.agents.compose <agent> <domain>` outputs the merged prompt to stdout. The orchestrator pipes this to the agent at dispatch time.

**API:** `from system.agents.compose import compose_for_domain; prompt = compose_for_domain("teleoperation-latency", "orbital-platform")`

**Fallback:** If an overlay doesn't exist for the requested domain, `compose_for_domain` returns the base-only prompt. This is correct behavior — base-only is better than no dispatch.

## Consequences

**Positive:**
- Single point of truth for what prompt any agent receives
- Overlay-missing fallback means compose never blocks a dispatch
- Testable: 17 tests in `system/tests/test_compose.py`
- `list_agents()` and `list_overlays(domain)` provide discovery for orchestrator tooling

**Negative:**
- Orchestrators must know the current study domain to compose correctly
- Compose output is a string; not structured — if agents need metadata from frontmatter, they must parse it separately

## Note

The `new_study.py` workflow (for writing merged files to `.claude/agents/`) is an alternative to runtime compose — it pre-computes merged files for the active study. Both patterns are valid; compose.py is the authoritative source for what the merged content should be.
