---
title: "ADR-008: Cross-coupling parameters require explicit lock before agents depend on them"
status: Accepted
date: 2026-05-06
---

# ADR-008: Cross-coupling parameters require explicit lock/supersede discipline

## Status

Accepted

## Context

The v1.0 cross_coupling_db.py supported `get`, `list`, `show`, `validate`. There was no mechanism to distinguish "working value" from "load-bearing decision." An agent could read a parameter, write a document section depending on it, and then another agent could overwrite the parameter — silently invalidating the first agent's work.

At scale (8+ agents in parallel), undisciplined cross-coupling parameter mutation causes consistency failures that are expensive to detect and fix.

## Decision

Add `lock()`, `supersede()`, `list_locked()`, `list_affecting()`, and a `LockedDecisionError` to the cross_coupling_db module. Also add a `set` CLI subcommand with `--lock` flag and `--force` override.

**Lock semantics:** A locked parameter raises `LockedDecisionError` if any agent attempts to overwrite it without `force=True`. The error message names the parameter and instructs the agent to document the reason.

**Supersede semantics:** When a decision is revised, the old entry is marked `superseded_by: <new_param_id>` and unlocked. The new entry becomes the canonical reference. Session logs must document the reason for the change.

**Atomic writes:** All writes use `tempfile` + `os.replace()` to avoid partial-write corruption.

## Consequences

**Positive:**
- Agents can trust locked values; no silent mutation
- Supersede chain provides audit trail for decision changes
- `list-locked` provides a quick view of all load-bearing decisions
- `render_cross_coupling.py` renders locked vs. active vs. superseded in a structured Markdown report

**Negative:**
- Locking too early creates friction if a decision needs to change
- `force=True` override must be disciplined; easy to abuse

## Protocol

An agent should lock a parameter at the moment it becomes a stated input to another agent's output. Parameters should not be locked during exploratory analysis phases. The Cycle 1 planning phase locks four foundational parameters; all others remain unlocked until Cycle 2 analysis completes.
