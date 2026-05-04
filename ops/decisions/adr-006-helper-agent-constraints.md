---
title: "ADR-006: Helper agent constraints — read-only, 60s lifetime, §11.9"
status: Accepted
date: 2026-05-04
---

# ADR-006: Helper agent constraints

## Status

Accepted

## Context

Dispatched agents sometimes need to perform sub-tasks (look up a parameter, verify a citation, check a schema) that don't warrant a full agent dispatch. §11.9 defines duration-triggered helper agents: when a dispatch runs ≥90s, the dispatching agent may spawn a helper.

The question is what constraints to place on helper agents to prevent scope creep.

## Decision

Helper agents are:
1. **Read-only**: no writes to study files, no YAML store mutations
2. **Lifetime-capped**: maximum 60 seconds
3. **Single-purpose**: one decomposed sub-task per helper
4. **Logged**: parent agent logs `helpers_spawned` in session-logs.yaml with purpose/elapsed_ms/outcome

## Rationale

- Read-only constraint prevents helpers from producing unreviewed changes to study content.
- 60s cap ensures helpers don't compound the latency problem they were spawned to mitigate.
- Logging provides observability for the meta-supervisor to detect helper overuse patterns.

## Consequences

- Helpers may read `system/state/`, `system/orchestration/`, and the study's structured stores.
- Helpers that exceed 60s are recorded as `outcome: timeout` in the session log.
- If a helper needs to write something, it must be promoted to a full agent dispatch.
- The meta-supervisor uses helper event frequency as a signal of dispatch decomposition quality.
