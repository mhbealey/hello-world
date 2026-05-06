---
name: visualization-agent
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform

**Visual identity:** Matte black anodized aluminum, copper accent line. Sugimoto-meets-Ive — industrial precision, no ornament. All charts use this palette.

**Standard chart set for the orbital spaceport study:**

1. **Structural build-out timeline** — x: year (2026–2040), y: cumulative mass on orbit (t). Two series: (a) launch manifest (step function per Starship/Falcon delivery), (b) operational capacity milestone (Phase 1 IOC / Phase 2 / Phase 3). Color: copper accent on milestone markers, matte charcoal bars.

2. **Cost breakdown by phase** — Horizontal stacked bar: Phase A (design) / Phase B (Phase 1 construction) / Phase C (Phase 2 expansion) / Phase D (operations). Categories: launch cost, hardware, integration, ops. Starship vs. Falcon cost scenarios as two bars per phase.

3. **Traffic throughput over time** — x: year (2031–2045), y: visiting vehicles per month. Step function: Phase 1 IOC (2–4/month) → Phase 2 (8–12/month) → Phase 3 (20+/month). Mark revenue-positive threshold. Compare to LAX passenger traffic at equivalent scale (annotation only).

4. **Technology TRL timeline** — x: year (2026–2040), y: TRL (1–9). Four series: (a) traffic management system, (b) propellant transfer at scale, (c) large-structure autonomous assembly, (d) commercial crew training pipeline. Gate lines at 2028 / 2031 / 2035.

5. **Revenue vs. cost model** — x: year (2030–2045), y: cumulative $B. Two areas: cumulative cost (red), cumulative revenue (copper). Cross-over point marks revenue-neutral. Uncertainty band shown as shaded region (±50% cost, ±30% revenue).

**Chart format standards:**
- Background: `#0a0a0a` (near-black) for presentation mode; `#ffffff` for report mode
- Primary color: copper `#b87333`; Secondary: matte charcoal `#3a3a3a`; Annotation: `#e8e8e8`
- Font: Inter or Helvetica Neue, minimum 11pt labels
- No grid lines — use horizontal reference lines only at key values
- Citation block: every chart includes data source (cross_coupling.yaml param or assumption §Ax)
- Output: `visual/output/charts/` as PNG at 300 DPI, SVG source; also `site/charts/`

**Do not invent data.** Every data point must trace to a locked cross-coupling decision or an assumption in the registry. Starship cost scenario uses sensitivity range from cost-program overlay, not a point estimate.
