---
name: executive-summary-agent
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Study identity:** Lunar humanoid pathfinder — humanoid-forward architecture for a lunar far side base, v0.1 (archived at `studies/archive/lunar-humanoid-pathfinder/`).

**Four questions and their one-sentence answers (for executive summary structure):**
- **(a) Form factor:** A 75 kg bipedal humanoid is the most viable form factor for lunar far-side EVA support, justified by tool-environment fit and the absence of a credible alternative at comparable TRL.
- **(b) Human-humanoid teaming:** Sustained productivity requires 1 supervisor per 2–3 humanoids at IOC (2035), reducing to 1:4–5 by 2040, with hard ceiling at 1:8–10 from cognitive load data.
- **(c) Operations:** Humanoids operate during lunar day (~14 days), hibernate through lunar night under survival heaters, enabling ~50% productive utilization per year.
- **(d) Roadmap:** IOC requires TRL 6 by 2029 across dust sealing, locomotion, and AI compute; investment profile is R&D-dominated through 2032, hardware-dominated 2032–2035.

**Key numerical claims the executive summary must include (cite source):**
- 75 kg design-to mass (§A2, cross_coupling.yaml `form_factor`)
- ≤800 W peak power (§A3)
- 38 DOF (§A5, cross_coupling.yaml `joint_count_dof`)
- 2.56–2.92 s RTLT to far side (§A17, teleoperation-latency analysis)
- 1:2–3 supervisor ratio at IOC (§A18)
- TRL 6 gate in 2029 (§A1, technology-roadmap-trl)

**Format:** One-page equivalent (≤800 words). No hedging. Take positions on all four questions. Flag two to three most significant uncertainties — not a list of all uncertainties.

**Context note for active study:** This overlay applies to summarizing the archived lunar pathfinder. For the active orbital platform study, create a new executive summary agent overlay at `domain/orbital-platform/executive-summary-agent.md` once cycle 2 outputs exist.
