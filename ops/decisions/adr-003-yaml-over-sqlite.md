---
title: "ADR-003: YAML flat files over SQLite for structured stores"
status: Accepted
date: 2026-05-04
---

# ADR-003: YAML flat files over SQLite for structured stores

## Status

Accepted

## Context

The system needs persistent stores for: cross-coupling parameters, assumptions, findings, session logs, handbacks, and visual artifact manifests. Two obvious options:

1. **YAML flat files** — one file per store, human-readable, diff-friendly, no binary blob in git
2. **SQLite** — relational queries, concurrent writes without file locking, richer constraints

## Decision

Use YAML flat files for all structured stores.

## Rationale

- **Git-native**: YAML diffs are readable in PR reviews. SQLite binary blobs are not.
- **Agent-readable**: Agents use `Read` tool directly. No SQL client required.
- **Schema-validated**: jsonschema covers our constraint needs without a DB.
- **Concurrency**: Writes are infrequent (one agent session at a time). `fcntl.flock` handles the rare concurrent case.
- **Operational simplicity**: No migration scripts, no DB engine dependency, no connection pooling.

## Consequences

- File-based locking (`fcntl.flock`) must be used for concurrent writes in assumption_registry.py and status.py.
- Files are truncated/rotated when they grow large (status.yaml: 1 MB cap, keep last 500 events).
- Complex cross-store queries are not supported — if needed, Python tooling reads both files.
- SQLite remains an option if concurrent write pressure exceeds what flock can handle.
