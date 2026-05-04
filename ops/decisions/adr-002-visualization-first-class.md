---
title: "ADR-002: 3D visualization as first-class system output"
date: 2026-05-04
status: accepted
deciders: [founder, orchestrator]
---

# ADR-002: 3D visualization as first-class system output

## Status

Accepted. Infrastructure in v1.0; full agent build-out deferred to orbital platform study cycle 1.

## Context

v0.1 produced a 3D model as an afterthought — one agent, geometric primitives, not integrated with the assumption registry or cross-coupling DB, no review pass. The model was structurally correct but visually not credible as aerospace concept art.

Three arguments for making visualization first-class:
1. Visual is how decisions land — a holographic representation is the artifact people remember
2. Visualization is a verification surface — geometric inconsistency with text claims is detectable
3. Text-plus-visualization targets exactly the high-value segment (aerospace, defense, robotics, physical infrastructure)

## Decision

Every study the system produces ships with both written content and a hologram-ready visual representation. Visualization shares the same source-of-truth (cross-coupling DB), same review surface, same gate enforcement, and same handback inclusion as text content.

**v1.0 deliverables (infrastructure):**
- Five visualization agent stubs in `system/agents/base/visualization/`
- `system/tools/visual_pipeline.py` — full rendering pipeline (STL → GLB → PNG → MP4)
- `system/tools/visual_validator.py` — pre-handback visual output gates
- `system/state/visual_specs.yaml` — per-study visual parameter store
- `system/orchestration/schemas/visual_artifacts.schema.yaml` — output format contract
- Domain aesthetic-direction files in `system/agents/domain/*/visualization/`

**Deferred to orbital platform study cycle 1:**
- Agent prompt design for all five visualization agents
- Full visual_pipeline.py implementation (rendering and video)

**Fidelity tiers:**
- Tier 1 (block-out): geometric primitives, correct proportions. Default in early cycles.
- Tier 2 (concept art): surface treatment, materials, paneling. Ships with study by default.
- Tier 3 (hero render): polished aesthetic, lighting, environment. Selected deliverables only.

## Consequences

**Positive:**
- Visual and text cannot drift — they share the same locked spec values
- Differentiated study delivery package (PDF + GLB + renders + turntable)
- Visualization work is reviewable, not opaque

**Negative:**
- Five new agents, three new tools, integration into cycle review: real engineering cost
- Risk of over-investing in visual before text-side quality is fully solved (mitigation: defer full agent build-out)

## References

- `system/agents/base/visualization/` — agent stubs
- `system/tools/visual_pipeline.py` — rendering pipeline
- `system/tools/visual_validator.py` — validation gates
- `system/orchestration/schemas/visual_artifacts.schema.yaml` — output format contract
