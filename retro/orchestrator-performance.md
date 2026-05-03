---
title: Orchestrator Performance Retrospective
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Orchestrator Performance Retrospective

---

## Stage 2-4 Assessment

**Cross-coupling watchlist failures.**

The orchestrator's primary job is cross-coupling detection: when one agent sets a number or position, the orchestrator checks whether that breaks assumptions in other agents' artifacts. This did not happen in stages 2-4.

Specific failures:
1. The humanoid-systems-architect produced a heritage table with mass ranges (35–150 kg) and power estimates (~300–1,800 W). These constrain the destinations-trajectories lander manifest and the cost-program launch cost estimate. No cross-coupling entry was logged. No downstream agents were notified.
2. Two autonomy TRL entries were added to the assumption registry at different times, with incompatible values, by different processes. Neither was reconciled. The orchestrator did not check for contradictions before adding the second entry.
3. The reviewer agents were wired up and described in CLAUDE.md but were never invoked. The stage 4 handback showed "0 findings" — not because the sections were clean, but because no reviews ran. The orchestrator did not flag this explicitly.

**Enforcement failures.**

Breadcrumb conventions (session logs, cross-coupling log, retro artifacts) were specified in CLAUDE.md and scaffolded as files. They were not populated during any work session. The orchestrator treated them as optional despite stating they were required.

**Root cause.**

The CLAUDE.md instructions described *what* the breadcrumbs are and *where* they go, but did not specify *when* they are mandatory and *what happens* if they're missing. "The orchestrator reviews at major checkpoints" is not an enforcement mechanism — it's a reminder that can be ignored. Stage 5 adds explicit pre-handback gates.

**Corrective actions (stage 5):**
- Hard pre-handback checklist added to CLAUDE.md.
- Mandatory closing actions appended to every agent file.
- Soft warning gate added to `generate_handback.py`.
- Assumption registry now documents how to check for contradictions before adding.
- Cross-coupling log seeded with the first real entry (autonomy TRL curve) as a pattern for future entries.
