---
title: "Cycle 1 Handback — Orbital Industrial Spaceport"
study_id: 01-orbital-platform
cycle: 1
status: complete
last-updated: 2026-05-06
word_count: 1420
---

# Cycle 1 Handback: Orbital Industrial Spaceport

**Handback date:** 2026-05-06
**Cycle type:** Planning
**Status:** Complete — ready for Cycle 2 launch pending founder decisions

---

## What Cycle 1 Accomplished

### Infrastructure Created
- `study-config.yaml` — full study configuration with four questions, word budgets, cycle structure
- `assumption_registry.yaml` — 12 seeded assumptions (§A1–§A12), spanning all four questions
- `cross_coupling.yaml` — 7 parameters set, 4 locked
- `cycles/cycle-01/heritage-baseline.md` — heritage anchor document with primary/secondary/tertiary precedents
- `cycles/cycle-01/architectural-scope.md` — configuration tradespace, locked decisions, Phase 1 mass/power budget
- `cycles/cycle-02/scaffold.md` — complete dispatch plan for Cycle 2

### Locked Decisions (cross_coupling.yaml)

| param_id | Value | Locked |
|----------|-------|--------|
| `structural_concept` | modular-truss-and-node | ✓ |
| `target_altitude_km` | 400 | ✓ |
| `phase1_mass_t` | 500 | ✓ |
| `primary_power_kw` | 500 | ✓ |

These four decisions are the load-bearing assumptions for the entire study. They cannot be changed without cross_coupling.yaml `--force` override and explicit justification.

### Key Heritage Findings

1. **ISS is the correct primary analog.** 420 t, modular truss, 13-year assembly — this is the heritage for every structural number in this study. Our Phase 1 at 500 t is ISS + 20%.

2. **The solved problems are truly solved.** Autonomous docking (Dragon/Progress), attitude control, life support, comms — all at TRL 8–9. The study's technology risk is not in these areas.

3. **The unsolved problems are specific.** Three gaps with no ISS precedent: (a) multi-vehicle traffic management at 20+ vehicles/month, (b) propellant transfer at depot scale, (c) commercial non-astronaut industrial crew operations. These are the Cycle 2 deep-dive targets.

4. **Latency is not the architecture driver.** LEO ground-to-platform RTLT is <30 ms — full telepresence tier. Unlike the lunar pathfinder, autonomy decisions here are driven by crew-to-task economics, not communication delay. This simplifies the autonomy TRL requirements significantly.

---

## Critical Assumptions (Prioritized by Risk)

| ID | Risk | Short name | Single-sentence risk statement |
|----|------|-----------|-------------------------------|
| §A1 | CRITICAL | starship_cost_realization | If Starship cost stays at $3,000/kg (current), the commercial case doesn't close |
| §A8 | CRITICAL | interface_standard_2028 | Missing the 2028 interface lock pushes IOC past 2035 |
| §A11 | CRITICAL | debris_risk_area_scaling | 1 km platform has ×100 ISS debris exposure; no engineering heritage at this scale |
| §A6 | HIGH | traffic_throughput_ioc | 20 vehicles/month at full ops is an aspiration with no precedent |
| §A10 | HIGH | commercial_crew_30day_orient | 30-day on-orbit training for non-astronaut industrial workers is untested |
| §A12 | HIGH | revenue_model_depot_mfg | Revenue model is speculative; bridge financing required through 2040 |

---

## Founder Decisions Required Before Cycle 2

Three decisions require founder input before Cycle 2 agents can be dispatched. These are not technical decisions — they are commercial and strategic choices that set the study's scope.

**Decision 1: Orbital inclination**
- Option A: 51.6° (ISS heritage) — international access, TDRS coverage, higher drag
- Option B: 28.5° (Cape Canaveral direct) — maximum US payload, limits international partnership
- Implication: determines which launch vehicles deliver efficiently, which countries can crew the platform, and commercial partnership scope
- **Recommended: 51.6°.** The commercial upside of international access outweighs the ~15% payload mass advantage of 28.5°.

**Decision 2: Interface standard strategy**
- Option A: Proprietary — single commercial operator owns the standard; extracts licensing fees; slows adoption
- Option B: Open (industry-defined) — maximizes ecosystem; requires coordinating with commercial competitors on a standard
- Implication: determines whether this platform is a commercial monopoly or a commons infrastructure
- **Recommended: Open standard with founder-operator governance.** Analogous to airport standards — FAA-equivalent body for space, operator-led.

**Decision 3: Primary manufacturing product line for Phase 2**
- Option A: Pharmaceuticals — highest commercial TRL, demonstrable microgravity advantage for protein crystallization
- Option B: ZBLAN fiber optics — proven ×100 performance advantage in microgravity; market size limited
- Option C: Exotic alloys — highest theoretical value; lowest TRL; most speculative
- **Recommended: Pharmaceuticals for Phase 2 IOC; fiber optics as secondary.** Pharmaceuticals have the clearest commercial customer (pharmaceutical industry will pay); start with the highest-TRL revenue stream.

---

## Cycle 2 Launch Checklist

- [ ] Founder decision: orbital inclination → set `orbital_inclination` in cross_coupling.yaml
- [ ] Founder decision: interface standard strategy → set `interface_standard_strategy`
- [ ] Founder decision: manufacturing product line → set `primary_manufacturing_product`
- [ ] Read `cycles/cycle-02/scaffold.md` to confirm agent assignments
- [ ] All 12 §A assumptions reviewed — no objections to stated risk levels
- [ ] `cross_coupling.yaml` reviewed — 4 locked decisions confirmed

---

## Retro: What Worked in Cycle 1

1. The base/overlay agent split (compose.py) correctly separates domain-neutral methodology from study-specific data. The orbital-platform overlays are materially different from the lunar-surface overlays — the split is load-bearing, not cosmetic.
2. Seeding cross_coupling.yaml before analysis begins ensures Cycle 2 agents work from consistent shared state, not independently derived numbers that drift.
3. The heritage-baseline-first sequencing correctly establishes what is solved (docking, attitude control) vs. what is genuinely new (traffic management, propellant depot at scale). This prevents the study from spending 80% of its word count defending TRL 9 systems.

## Retro: What to Watch in Cycle 2

1. The commercial case (§A1) is the existential risk. Cost-program must engage this honestly — a study that assumes $100/kg Starship without documenting the risk of $1,000/kg is not credible.
2. The debris scaling problem (§A11) may be a hard constraint. fault-management-sustainment must engage this before Cycle 2 closes; if the cross-section area problem has no tractable engineering solution, the 1 km scale target must be revisited.
3. Word budgets are tight (3,000 words per main question agent). Agents must cut — the failure mode is verbose background sections. Every sentence must either establish a position or defend one.

---

*Cycle 1 complete. Word count: 1,420. Handback staged. Awaiting founder decisions for Cycle 2.*

*Agent: orchestrator | 2026-05-06*
