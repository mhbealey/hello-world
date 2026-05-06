---
name: visualization-agent
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Standard chart set for the lunar humanoid pathfinder study:**

1. **Autonomy TRL curve** — x: time (2024–2040), y: TRL (1–9), with three series: (a) optimistic assumption, (b) baseline (§A1), (c) conservative. Mark the 2029, 2035, and 2040 gate lines. Source: cross_coupling.yaml `autonomy_trl_curve`.

2. **Mass budget breakdown** — horizontal stacked bar by subsystem: structure+actuation (§A5), power system (§A13 battery), sensors (§A7), compute (§A8), thermal (heaters), margin (30%). Target: 75 kg design-to. Show breakdown vs. not-to-exceed.

3. **Latency vs. task performance degradation** — x: round-trip latency (ms, log scale), y: task success rate (%). Show tiers: <500 ms (telepresence), 500–3000 ms (supervised autonomy), >3000 ms (high autonomy required). Mark 2.56 s (near side) and 2.92 s (far side via relay).

4. **Supervisor ratio over time** — x: year (2035–2045), y: humanoids per supervisor. Step function showing IOC (1:2–3) → maturation (1:4–5) → ceiling (1:8–10). Source: §A18.

5. **TRL gate Gantt** — x: year, y: technology area (dust sealing, locomotion, compute, relay). Show TRL milestone per technology area, gate lines at 2029/2035. Highlight critical path.

**Chart format standards for this study:**
- Color palette: monochrome primary with single accent color for key series
- Font: sans-serif, minimum 11pt for labels
- Citation block: every chart includes data source (assumption §Ax or cross_coupling param)
- Output: `visual/output/charts/` as PNG at 300 DPI, SVG source

**Do not invent data.** Every value in every chart must trace to an assumption in the registry or a locked cross-coupling decision. If a value is not yet locked, show parametric sensitivity bounds instead of a point estimate.
