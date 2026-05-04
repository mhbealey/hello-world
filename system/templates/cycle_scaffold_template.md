---
cycle: NN
study_id: <study-id>
date_opened: YYYY-MM-DD
status: planning  # planning | executing | reviewing | closed
---

# Cycle NN Scaffold — <one-sentence objective>

## Objective

One sentence. What this cycle produces and why it matters now.

## Deliverables

| Artifact | Path | Word cap | Owner agent |
|----------|------|----------|-------------|
| <section name> | `studies/active/<study>/study/<path>.md` | N,000 | <agent-id> |

All listed artifacts must exist and pass gates before this cycle can close.

## Agent dispatch plan

Sequential dependencies must be explicitly noted. Parallel by default.

```
Batch 1 (parallel):
  <agent-id>  →  <deliverable>
  <agent-id>  →  <deliverable>

Batch 2 (depends on Batch 1):
  <agent-id>  →  <deliverable>

Review batch (depends on all content above):
  <reviewer-id>  →  <deliverable>
  <reviewer-id>  →  <deliverable>
```

## Gates

Pre-commit gates (run automatically):
- WordCountGate: all deliverables under their caps
- CitationIntegrityGate: all `[@key]` references resolve in references.bib
- FrontmatterValidator: all modified .md files have valid frontmatter

Pre-close gates (run at cycle close):
- CrossCouplingConsistencyGate: all numbers in deliverables match the cross-coupling DB
- FindingsTriageGate: no unresolved Blocker findings

## Stop conditions

This cycle is complete when:
1. All deliverables listed above exist at their specified paths
2. All gates pass
3. All Blocker and Major findings are resolved or explicitly deferred with an open question

## Risks from prior cycles

<!-- Read the most recent meta-supervisor observation before filling this section. -->
<!-- Address at least one lesson from the last three cycles explicitly. -->

| Lesson (from retro) | How this cycle addresses it |
|---------------------|----------------------------|
| <lesson summary> | <concrete response in this cycle's design> |

## Notes

Any constraints, special instructions, or founder decisions that shaped this scaffold.
