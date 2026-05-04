---
title: "ADR-004: Gate enforcement model — Blocker/Major stops handback, Minor/Nit does not"
status: Accepted
date: 2026-05-04
---

# ADR-004: Gate enforcement model

## Status

Accepted

## Context

Four pre-handback gates run before every cycle close: FrontmatterValidator, WordCountGate, CitationIntegrityGate, CrossCouplingConsistencyGate. The question is how violations map to enforcement behavior.

Options:
1. Any violation blocks handback
2. Severity-based: Blocker/Major blocks; Minor/Nit warns only
3. All violations warn, operator decides

## Decision

Severity-based enforcement:
- **Blocker** / **Major**: handback generation refused (`sys.exit(1)`)
- **Minor** / **Nit**: printed to stderr as warnings; handback proceeds

## Rationale

- Blockers and Majors represent structural integrity failures (missing frontmatter, word count exceeded >10%, broken citation keys, invalid schema). These must stop the cycle.
- Minors and Nits are style/completeness issues. They should surface but not stop delivery when content is otherwise sound.
- Absolute blocking on all violations creates incentive to suppress the gate runner entirely.

## Consequences

- `gates.py run_gates()` exits 1 only for Blocker/Major findings.
- `handback.py` calls gates before writing output; it receives the exit code.
- Gate suppressors (running without gates) are explicitly prohibited by CLAUDE.md working principles.
- Gate thresholds (e.g., word count at 110% of cap = Blocker) are configurable in `study-config.yaml`.
