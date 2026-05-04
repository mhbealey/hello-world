---
title: Charts Index
status: in-progress
owner: visualization-agent
last-updated: 2026-05-03
---

# Charts Index

Registry of all charts produced by the visualization-agent. Each entry includes the chart filename, what it shows, and where it is used in the study.

| File | Shows | Used in |
|------|-------|---------|
| autonomy-trl-curve.png | §A1 autonomy TRL maturity projection 2024–2042 with go/no-go gates at 2029, 2035, 2040 and full-teaming-model band (TRL 7–9) | §02-human-in-the-loop, §04-build-and-deploy/technology-roadmap |
| comms-latency-by-destination.png | Round-trip light travel time (log scale) for ISS through Jupiter, color-coded by teleoperation regime (direct / supervised / full autonomy) | §02-human-in-the-loop/latency-tradespace, §03-workflow-conops, §04-build-and-deploy/destinations |
| section-word-count.png | Current word count per study .md file, sorted descending, colored by draft status | Study management / orchestrator dashboard |

## Q(b) Latency and Teaming Charts — Stage 7

**q2_latency_effectiveness.png** — Operator effectiveness (normalized, 0–100%) vs. RTLT latency (10 ms to 100 s, log scale). Four curves: direct teleoperation, predictive display/model-mediated, shared autonomy (periodic supervision), full autonomy (on-demand supervision). Heritage anchors: Lunokhod NIP-10 (2.5 s RTLT, direct teleoperation), METERON SUPVIS Justin (820 ms, predictive display). Tier A (≤50 ms) and Tier B (2.78–2.92 s) latency zones marked. Source section: §02-02.

**q2_supervisor_ratio.png** — Humanoids per active supervisor (log scale, 0.1–20) vs. year (2026–2045). Primary projection from NIP-10 heritage (0.2 at 2026) through IOC (2.5 at 2035, §A18) to full ops (5.0 at 2040). Uncertainty band ±50%. Hard ceiling (~8–10) from human value floor saturation marked. TRL gate annotations: TRL 5 (2029), TRL 6 (2032), TRL 7/IOC (2035), TRL 8/full ops (2040). Source section: §02-04.
