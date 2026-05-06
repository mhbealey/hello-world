---
name: executive-summary-agent
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform

**Study identity:** Orbital Industrial Spaceport — kilometer-scale commercial spaceport in LEO, v0.1 (active study at `studies/active/01-orbital-platform/`).

**Four questions and their one-sentence answers (for executive summary structure):**
- **(a) Architecture:** A modular truss-and-node architecture, 500 t phase 1 / 1,500 t full build-out at 400 km LEO, is the only viable path to kilometer-scale; ISS heritage validates the concept; scale requires Starship-class launch economics.
- **(b) Operations:** 24/7 three-shift operations with 8–12 resident crew, 2–4 visiting vehicles/month at IOC scaling to 20+ at full capacity; traffic management system is the critical enabling capability without ISS precedent.
- **(c) Economics:** The commercial case depends entirely on Starship cost realization ($100–500/kg vs. $3,000/kg current); propellant depot revenue and manufacturing premium products are the revenue pillars; bridge financing of $20–50B required through 2040.
- **(d) Roadmap:** IOC 2035 requires locking the truss interface standard by 2028 and Phase 1 crewing by 2031; technology gaps are at the system integration and commercial standardization level, not the physics level.

**Key numerical claims the executive summary must include (cite source):**
- 400 km target altitude (cross_coupling.yaml `target_altitude_km`)
- 500 t Phase 1 / 1,500 t full build-out (cross_coupling.yaml `phase1_mass_t`)
- ≥500 kW power (Phase 1) (cross_coupling.yaml `primary_power_kw`)
- <30 ms RTLT LEO-to-ground direct link (teleoperation-latency analysis)
- 8–12 crew at IOC; 20+ visiting vehicles/month at full ops
- 2028 gate: interface standards lock
- 2035 IOC target

**Format:** One-page equivalent (≤800 words). No hedging. Take positions on all four questions. Flag two to three most significant uncertainties — not a list of all uncertainties. The single biggest uncertainty is Starship economics; name it first.

**Visual identity note:** The executive summary header should reference the study's aesthetic: "precision industrial — not a science project, not a hotel." Set the tone in the opening paragraph.
