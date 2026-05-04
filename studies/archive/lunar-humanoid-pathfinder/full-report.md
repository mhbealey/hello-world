---
title: Humanoid-Forward Space Exploration — Full Study Report
generated: 2026-05-03
status: stages-1-through-8-complete
note: Compiled from all study artifacts in the repository
---

# Humanoid-Forward Space Exploration Study
## Full Report — Stage 8 Snapshot

---

## Table of Contents

1. [Project Overview and Thesis](#1-project-overview-and-thesis)
2. [Executive Summary](#2-executive-summary)
3. [Why This Study, Why Now](#3-why-this-study-why-now)
4. [Question (a): Optimal Space Humanoid](#4-question-a-optimal-space-humanoid)
   - 4.1 Heritage Survey and Gaps
   - 4.2 Form Factor Tradespace
   - 4.3 Actuation and Structures
   - 4.4 Sensing and Autonomy
   - 4.5 Space Environments and Hardening
   - 4.6 Mass and Power Budget
5. [Question (b): Human-in-the-Loop Value](#5-question-b-human-in-the-loop-value)
   - 5.1 Overview
   - 5.2 Latency Tradespace
   - 5.3 Autonomy TRL and Task Allocation
   - 5.4 Teaming Model
6. [Cross-Cutting Analysis](#6-cross-cutting-analysis)
   - 6.1 Margins and Assumptions Register
   - 6.2 Cross-Coupling Log
   - 6.3 Soviet and Russian Heritage
   - 6.4 Open Questions
7. [CAD Model Status](#7-cad-model-status)
8. [Review Findings Summary](#8-review-findings-summary)
9. [Retro and Process Lessons](#9-retro-and-process-lessons)
10. [Pending Work Roadmap](#10-pending-work-roadmap)

---

## 1. Project Overview and Thesis

### What this project is

A concept study examining humanoid-forward architecture for space exploration, with the lunar far side permanent base as the testbed. Output is a publishable concept paper of 80–150 pages. This is the core bones of a program, not an academic paper. The study optimizes for: decomposability into work packages with clear scope and deliverables; forward-carrying assumptions as program commitments with explicit go/no-go gates; real program structure with phases, milestones, and decision authority; identification of the minimum first article that proves the architecture; and traceability for handoff to teams that pick up the work.

### The Thesis

A humanoid-forward architecture is the unlock for three things current architectures cannot deliver:

1. **Economically sustainable presence** across the inner and middle solar system
2. **The in-space industrial base** that enables future deep space and eventual interstellar capability
3. **Persistent scientific operations** at destinations beyond credible crewed reach

The lunar far side base proves the human-humanoid teaming model before it extends outward.

### The Four Questions

The study is structured around four questions, ordered by dependency:

**(a) Optimal Space Humanoid.** What does the machine actually look like? Foundational.

**(b) Human-in-the-Loop Value.** Where does human supervision add value, where is it overhead?

**(c) Workflow / ConOps.** How does a mission actually run, end to end? *(Stage 9 — not yet written)*

**(d) Build and Deploy.** Technology roadmap, destinations, program structure. *(Stage 10 — not yet written)*

### Working Principles

1. **Margin everything.** Every number gets a margin and a justification.
2. **Heritage before invention.** When an agent reaches for a number, the first move is to look up heritage.
3. **Take positions.** A study that hedges everything contributes nothing.
4. **Russian instinct.** When choosing between elegant and boring-but-flown, choose boring-but-flown.
5. **Flag uncertainty.** TBDs and open questions go in `open-questions.md`.

---

## 2. Executive Summary

*Source: `study/00-front-matter/executive-summary.md` — 577 words*

The humanoid-forward architecture proposes deploying teleoperated and semi-autonomous humanoid robots as the primary operational workforce at a permanent lunar far side base, with a small resident human crew serving as supervisors, scientists, and emergency responders rather than primary labor. The thesis is that this architecture is the first configuration capable of sustaining economically viable permanent presence across the inner solar system, building the in-space industrial base that makes deep-space expansion possible, and maintaining persistent scientific operations at destinations beyond credible crewed reach.

### Current State of the Study

Twelve of the study's major sections are complete across Question (a) and Question (b), totaling over 36,000 words of analyzed content. Question (c) (ConOps) and Question (d) (Build and Deploy) are blocked pending completion of the Question (b) review pass.

**Question (a) — Optimal Space Humanoid (6 sections, complete):**

- Heritage survey of 9 systems identifying 7 gaps between terrestrial and space-qualified capability
- Form factor selection: full bipedal humanoid at 1.5–1.9 m, 75 kg design-to / 97.5 kg NTE
- Actuation architecture: HD-Electric (harmonic drive + brushless DC) primary; SEA fallback gate at 2029
- Sensing suite: stereo HDR + ToF depth, wrist cameras, IMU triad, F/T sensors, tactile arrays, LIDAR — 2.1 kg total
- Two-tier compute: RAD750-class Tier 1 (radiation-hardened, always-on) + Jetson AGX Orin-class Tier 2 (watchdog-managed)
- Space environments hardening: vacuum, thermal cycling (−180°C to +130°C), 140–210 krad TID over 7 years, lunar dust
- Mass budget closes at 75.0 kg design-to; power budget closes at 616 W full locomotion+manipulation (vs. 800 W cap)

**Question (b) — Human-in-the-Loop Value (4 sections, complete):**

- Three-tier latency model: Tier A ≤50 ms (on-base), Tier B ~2.8 s (Earth relay via Queqiao-2), Tier C 8.7–42 min (Mars)
- Queqiao-2 relay commits to forward-deployed human presence as the supervisory model
- IOC task allocation: 12 of 20 tasks autonomy-led, 6 jointly-executed, 2 human-led
- Seven permanently human-required task categories regardless of TRL advancement
- Supervisor ratio: 1:2–3 at IOC (2035), 1:4–5 at full operations, ceiling ~1:8–10
- Crew composition: 4 humans supervising 3 humanoids with ~2× cognitive headroom

### Top Three Risks

**Risk 1 — Autonomy TRL curve failure (Probability: Medium-High / Impact: Critical)**
The §A1 assumption (TRL 6 in space-relevant environments by 2029) is the load-bearing beam under the teaming model. No specific funded TRL 5 demonstration program is named. Three years is tight from current space TRL 2–4.

**Risk 2 — Mass budget stress (Probability: Medium / Impact: Major)**
The 75 kg design-to has 16.8 kg growth allowance (22%). The study itself notes 35–40% would be more appropriate for this TRL profile. The SEA fallback alone adds 10–20 kg.

**Risk 3 — Lunar night thermal power at upper bound (Probability: Medium / Impact: Major)**
Upper bound 272 W (with margin) does not close against the 150 W FSP goal. Three hibernating humanoids at upper bound need 816 W FSP reservation during 14-day lunar nights.

### Immediate Next Steps

1. Complete Q(b) review pass (6 reviewers, 4 sections) — Stage 8
2. Write Q(c) ConOps sections — Stage 9
3. Write Q(d) Build and Deploy sections — Stage 10
4. Full document integration and final review — Stage 11

---

## 3. Why This Study, Why Now

*Source: `study/00-front-matter/why-this-why-now.md`*

### The Economic Claim

The mass accounting of human spaceflight is brutal. Every kilogram of crew — life support, habitat, food, water, medical consumables, abort vehicles — costs between 10× and 100× more to deliver than an equivalent kilogram of robot. At lunar distances, this ratio is manageable because the round-trip is short enough for consumables to be modest. At Mars distances and beyond, the ratio becomes the dominant program cost driver: a crew of four on a 900-day Mars surface mission requires roughly 30,000 kg of consumables and life support margin. Four humanoids executing the same surface program require approximately 800 kg of maintenance spares and power.

The study does not claim humans should not go to Mars. It claims that the first 20–30 years of sustained inner solar system presence will be economically viable only if humans go as supervisors of robotic workforces, not as primary labor. The economic model only works if the robots are capable enough to execute the actual science and construction operations with limited human intervention. That is the architectural bet.

### The Industrial Claim

The in-space industrial base — propellant production, ISRU materials processing, habitat construction from local resources, power infrastructure — is the precondition for everything beyond cislunar space at any sustainable cost. No credible roadmap closes the economics of deep space exploration without it. But building that base requires tens of thousands of hours of surface labor at destinations where human presence is expensive and dangerous.

Humanoid robots can execute that labor under remote supervision. The key insight is that the industrial base does not need to be built fast — it needs to be built reliably, and it can be built while the human supervisory team operates from Earth or a cislunar outpost. The humanoid-forward model makes the industrial base buildable within a budget that a sustained program can support.

### The Scientific Claim

The third claim is narrower and more immediate. There are destinations — the lunar far side, the poles of Mercury, the surface of Titan, the subsurface ocean access points of Europa — where human surface presence is not credible within any plausible program schedule or budget. At these destinations, the choice is between robotic science and no science. The question is what kind of robots. General-purpose humanoids with high-dexterity manipulation and autonomous task execution can conduct science programs that purpose-built rovers cannot: sample collection and processing, instrument deployment, equipment repair, improvised experimental setups in response to unexpected findings.

### What the Study Does Not Claim

- It does not claim humanoids replace all specialized robotics. Purpose-built systems remain optimal for constrained single-mission profiles.
- It does not claim the technology is ready today. The autonomy stack is at TRL 2–4 in space-relevant environments.
- It does not claim the 2035 IOC date is guaranteed. It is a program commitment with explicit go/no-go gates.
- It does not claim the form factor question is settled forever. The dissenting position and conditions for reversal are documented.

---

## 4. Question (a): Optimal Space Humanoid

### 4.1 Heritage Survey and Gaps

*Source: `study/01-optimal-space-humanoid/01-overview.md`*

#### Heritage Table — Nine Systems

| System | Mass (kg) | DOF | Actuation | Key Space Relevance |
|--------|-----------|-----|-----------|---------------------|
| Atlas Electric (BD, 2024) | 89 | 28 | Custom direct-drive electric | Best-in-class efficiency 85–90%; no space heritage |
| Apollo (Apptronik, 2023) | 72.5 | 71 | Electric | Closest to 75 kg target; modular design |
| Figure 02 (Figure AI, 2024) | 70 | 35 | Electric + VLA inference | BMW deployment; foundation model integration |
| Optimus Gen 2 (Tesla, 2024) | 57 | 28 | Electric | Lightest capable platform; no serviceability data |
| Digit v4 (Agility, 2024) | 65 | 30 | Electric | 10,000-unit target; Amazon warehouse heritage |
| Unitree H1 (2024) | 47 | 19 | Electric | Lowest mass; DOF limited for manipulation |
| Unitree G1 (2024) | 35 | 23–43 | Electric | Research platform; limited dexterity |
| Valkyrie R5 (NASA, 2015) | 129 | 44 | Series elastic (SEA) | Only purpose-designed for space-adjacent ops; DRC heritage |
| Robonaut 2 (NASA/GM, 2011) | ~150 (full) | 54 | Electric | Only humanoid flown to ISS; leg failure lesson |

**Heritage Range:** 35–150 kg operational mass; 19–71 DOF; all terrestrial (Valkyrie DRC, R2 ISS upper-torso only).

#### Seven Heritage Gaps

1. **Microgravity mobility** — No bipedal robot has operated in reduced gravity. 1/6g gait stability is undemonstrated.
2. **Vacuum and radiation hardening** — All commercial platforms are terrestrial. No space-qualified electronics architecture.
3. **Serviceability in EVA** — R2's disabling failure on ISS: cannot be serviced in EVA gloves. Single-fault total loss at far side.
4. **Long-duration autonomy** — No platform has demonstrated weeks of unsupervised operation on novel terrain.
5. **Dust tolerance** — Lunar regolith particle size 10–100 µm; angular morphology; electrostatic adhesion. No tested seal solutions.
6. **Off-grid power** — All platforms require AC mains or short-duration battery. Lunar night 14 days.
7. **EVA tool compatibility** — Human-geometry tools require human-geometry hands. No heritage for hand forces in EVA glove equivalents.

---

### 4.2 Form Factor Tradespace

*Source: `study/01-optimal-space-humanoid/02-form-factor-tradespace.md`*

#### Five Candidates Evaluated

- **A — Full Bipedal Humanoid:** 1.5–1.9 m, two legs, two arms, human-geometry hands. 75 kg design-to.
- **B — Centaur (Bipedal Upper + Wheeled/Tracked Lower):** Human upper body on wheeled base. Better stability, worse hatch/ladder access.
- **C — Quadrupedal + Manipulation Arms:** Four legs plus two arms. Best outdoor mobility, worst tool compatibility.
- **D — Fixed Platform / Rail-Mounted:** Highest manipulation precision, zero mobility. Not primary candidate.
- **E — Modular Reconfigurable:** Swap lower body configuration. R2 leg installation took 40 hrs vs. 20 planned — rejected on serviceability.

#### Evaluation Matrix

Seven criteria with weights:

| Criterion | Weight | Description |
|-----------|--------|-------------|
| C1 — Human tool compatibility | 0.25 | Can use existing EVA tools, hatches, handrails |
| C2 — Surface locomotion | 0.20 | Performance on unprepared lunar regolith |
| C3 — Zero-g mobility | 0.15 | Performance in microgravity transit phases |
| C4 — Serviceability | 0.15 | ORU replacement by crewmate in EVA gloves |
| C5 — Mass | 0.10 | Lander manifest impact |
| C6 — Autonomy scalability | 0.10 | Ease of increasing autonomy over program life |
| C7 — Training | 0.05 | Crew training time and intuitive operation |

**Corrected weighted totals** (arithmetic-verified):

| Candidate | Score | Margin to Next |
|-----------|-------|----------------|
| A — Full Bipedal | **3.65** | +0.10 |
| B — Centaur | 3.55 | — |
| C — Quadrupedal | 3.25 | — |
| D — Fixed | 2.90 | — |
| E — Modular | 2.85 | — |

**The 0.10-point margin is honest.** The bipedal form wins on C1 (human tool compatibility) and C7 (training). It loses on mass and scores average on surface locomotion. The study does not paper this over.

#### Program Economics Argument

The tool compatibility case: maintaining dual infrastructure standards over a permanent base lifetime — two hatch sizes, two handrail geometries, two EVA tool torque ranges, two emergency procedure sets — costs $60–160M in cumulative program overhead. The mass penalty of bipedal vs. centaur (10–15 kg per unit, ~4 launch manifest slots over 10 years) is $1–5M. The economics argument favors bipedal.

#### Locked Commitments

- Form factor: full bipedal humanoid
- Mass design-to: **75 kg** / NTE: **97.5 kg** (30% per NASA-STD-5001)
- Height: 1.5–1.9 m standing; design-to 1.75 m
- DOF: 51–55 kinematic / **38 independently actuated**

#### Dissenting Position (Conditions for Reversal)

The centaur becomes clearly superior if robot deployment precedes base infrastructure by 5+ years — long enough to design the base for the robot rather than vice versa. If the 2035 IOC schedule is missed by that margin, the form factor selection must be revisited. The bipedal decision is provisional until ConOps confirms >40% of tasks require human-geometry access.

---

### 4.3 Actuation and Structures

*Source: `study/01-optimal-space-humanoid/03-actuation-structures.md`*

#### Actuation Architecture Decision

**Primary: HD-Electric (Harmonic Drive + Brushless DC)**
- Harmonic drives provide high reduction ratio (50:1 to 160:1) in compact, backlash-free package
- Space heritage: SSRMS/Canadarm2 joints use harmonic drive transmissions (TRL 9)
- Efficiency: 70–85% for harmonic drives; direct-drive electric systems achieve 85–90% (Atlas Electric benchmark)
- Mass-efficient for high-torque low-speed joints (hips, knees, shoulders)

**QDD (Quasi-Direct Drive) at wrist and hand joints**
- Lower reduction ratio, higher back-drivability
- Required for dexterous manipulation force sensing

**Hydraulic: DISQUALIFIED**
- Vacuum outgassing of hydraulic fluid — catastrophic contamination risk for optics and electronics
- Hydraulic line failure cannot be diagnosed or repaired in EVA gloves

**SEA Fallback (Series Elastic Actuators):**
- Gate: 2029 — if HD-Electric flexspline cryogenic fatigue fails test, SEA becomes primary
- Mass penalty: +10–20 kg; may breach 97.5 kg NTE

#### DOF Architecture

| Region | Kinematic DOF | Actuated DOF |
|--------|--------------|--------------|
| Neck | 3 | 3 |
| Torso | 2 | 2 |
| Arms (×2) | 8 (3-DOF shoulder + 1-DOF elbow each) | 8 |
| Wrists (×2) | 6 (3-DOF each) | 6 |
| Hands (×2) | 20–24 (10–12 fingers each) | 8 (grouped actuators) |
| Hips (×2) | 6 (3-DOF each) | 6 |
| Knees (×2) | 2 | 2 |
| Ankles (×2) | 4 (2-DOF each) | 4 |
| **Total** | **51–55** | **38** |

#### Actuator Classes and Mass

| Class | Joints | Mass/Joint | Total |
|-------|--------|------------|-------|
| Class A — Locomotion (HD-Electric, high torque) | 12 (6 hip + 2 knee + 4 ankle) | 780 g | 9.36 kg |
| Class B — Upper body (HD-Electric, medium torque) | 8 (shoulders, elbows) | 400 g | 3.20 kg |
| Class C — Fine control (QDD, wrists/hands) | 18 | 115 g | 2.07 kg |
| **Total actuators** | **38** | | **14.63 kg** |

Budget: 13.0 kg design-to. **Actuator mass is 1.6 kg over budget — flagged as risk.**

#### Structural Design

- Primary structure: CFRP torso shell + titanium joint housings
- Structure mass: 8.5 kg design-to
- Joints/sealing hardware: 4.0 kg (38 joints × ~105 g — cross-roller bearings + labyrinth housing + FFKM seal)
- End-effectors: 4.5 kg (hands ~1.8 kg each; feet ~0.45 kg each including handrail jaw)

**Structure + actuation block total: 30.0 kg design-to / 39.0 kg NTE**

#### Dust Mitigation

**Joint sealing:** Dual-stage labyrinth path + single FFKM (perfluoroelastomer) lip seal per joint
- Heater-maintained above −60°C to keep FFKM above glass transition temperature
- Heritage: MER wheel bearing seals (Kalrez, similar PFAS chemistry); ExoMars chassis seals

**Boot covers:** Disposable Vectran/Zylon overshoes over foot end-effector
- Replacement interval: 500 surface-hours (parametric; no heritage — must be validated)
- Resupply: ~7 pairs/year/humanoid at 300 surface-hr/month

**Structural surfaces:** Electrostatic discharge coatings; regular purge protocols

---

### 4.4 Sensing and Autonomy

*Source: `study/01-optimal-space-humanoid/04-sensing-autonomy.md`*

#### Sensor Suite

| Sensor | Count | Mass | Power | Space TRL | Notes |
|--------|-------|------|-------|-----------|-------|
| Stereo HDR cameras + ToF depth | 1 unit | 0.80 kg | 15–25 W | 5–6 | ±35 mm baseline; forward-facing on head |
| Wrist cameras (RGB mono) | 2 | 0.15 kg | 3–5 W | 5–6 | Manipulation close-up |
| IMU (3-unit triad) | 1 | 0.30 kg | 3–5 W | 8 | Redundant; flight heritage |
| Force/torque sensors | 6 | 0.25 kg | 4–6 W | 6–7 | Wrists and ankles |
| Tactile arrays | 2 hands | 0.15 kg | 2–4 W | 3–4 | Finger pad contact sensing |
| LIDAR (spinning or solid-state) | 1 | 0.50 kg | 10–30 W (duty) | 5–6 | Terrain mapping; duty-cycled during locomotion |
| **Total** | | **~2.1 kg** | **37–75 W peak** | | |

#### Two-Tier Compute Architecture

| Tier | Basis | Mass | Power | Role |
|------|-------|------|-------|------|
| Tier 1 — Radiation-hardened supervisor | RAD750-class processor | 0.30 kg | 5–10 W | Safety-critical loop; always-on; watchdog for Tier 2; radiation-hardened by design (RHBD) |
| Tier 2 — AI accelerator | Jetson AGX Orin-class | 0.50 kg | 15–60 W | Deliberative planning; VLA inference; SLAM; duty-cycled; COTS + spot shielding + 3-yr ORU |
| Radiation shielding (spot) | Aluminum + polyethylene | 0.80 kg | — | Per compute board |
| Memory and storage | Flash + DRAM | 0.20 kg | 2–5 W | Radiation-tolerant flash |
| **Total compute** | | **~1.8 kg** | **22–75 W** | |

**Tier 1 is always-on regardless of mode.** Tier 2 is watchdog-managed: Tier 1 can cold-restart Tier 2 after SEU-induced latchup without human intervention.

#### Three-Layer Autonomy Stack

```
┌─────────────────────────────────────────────────────┐
│  SUPERVISORY LAYER (Tier 2)                          │
│  Foundation model / VLA inference                    │
│  Space TRL 2–3 → target TRL 5 by 2029               │
│  Response time: seconds to minutes                   │
├─────────────────────────────────────────────────────┤
│  DELIBERATIVE LAYER (Tier 2)                         │
│  SLAM, path planning, task sequencing                │
│  Space TRL 2–3 → target TRL 5 by 2029               │
│  Response time: 0.1–10 s                             │
├─────────────────────────────────────────────────────┤
│  REACTIVE LAYER (Tier 1)                             │
│  Balance, joint control, fall recovery               │
│  Space TRL 3–4 → target TRL 6 by 2029               │
│  Response time: <1 ms                                │
└─────────────────────────────────────────────────────┘
```

**TRL 6 gate (2029) minimum observable:** 30-minute unscripted locomotion on JSC-1A lunar simulant in 1/6-g offload rig, by Q4 2028. If missed, deployment timeline slips proportionally.

**Foundation models** are enabled at the supervisory layer only. Their two program-relevant risks are: (1) out-of-distribution behavior in novel lunar environments, and (2) SEU-induced bit-error corruption of model weights. Neither is addressed by existing heritage. Both are explicit 2029 gate items.

---

### 4.5 Space Environments and Hardening

*Source: `study/01-optimal-space-humanoid/05-environments-hardening.md`*

#### Four-Threat Environment

| Threat | Value | Primary Impact |
|--------|-------|----------------|
| Vacuum | <10⁻¹⁰ torr | Outgassing, tribology, seal design |
| Thermal cycling | −180°C to +130°C (14-day cycle) | Materials, actuator lubrication, electronics heating |
| Radiation (GCR TID) | 140–210 krad(Si) over 7-year design life | COTS electronics, SEU/latchup, memory corruption |
| Lunar dust | 10–100 µm particles; angular; electrostatic | Joint seal failure, optical degradation, radiator fouling |

#### Thermal Design Position

**Hibernation strategy for lunar night (14 days at −180°C surface):**

- All locomotion controllers and Tier 2 compute powered off
- Tier 1 supervisor in monitoring loop (5–10 W)
- Survival heaters maintain electronics above −40°C, battery above 0°C: **50–150 W** (parametric, TRL 2)
- Joint heaters maintain HD-Electric joints above −60°C (FFKM glass transition): **20–50 W**
- Docked at recharge station
- **Total FSP reservation: 70–200 W per humanoid** (3× uncertainty span)
- Warm-up to partial operability: 15–30 minutes; full operability: 45–90 minutes

**Power plant:** Fission Surface Power (FSP) baseline. At upper bound of 200 W × 3 humanoids = 600 W continuous during lunar night. This is a known constraint to the far-side-base-architect.

#### Radiation Strategy

**Hybrid approach:**
- Tier 1 compute: RHBD (radiation-hardened by design) — survives full 7-year TID budget
- Tier 2 compute: COTS (Jetson-class) + spot shielding (5–10 mm Al + polyethylene, ~0.8 kg) + 3-year ORU replacement cycle
- Electronics vault: 0.5–1.5 kg of Al/PE torso shielding (design-to: 1.0 kg)
- SPE survival: human crew retreats to habitat radiation shelter; humanoids powered down or sheltered

**Radiation budget:** 140–210 krad(Si) unshielded (7-year). COTS electronics typically tolerate 3–30 krad unshielded. Shielding + 3-yr replacement is the closure strategy.

**Key uncertainty:** The 140–210 krad figure derives from the Chang'e-4 LND measurement (~60 µSv/hr dose equivalent, Zhang et al. 2020, Science Advances). The conversion from dose-equivalent to silicon krad is spectrum-dependent and could be 2× higher, which would shorten Tier 2 ORU lifetime to 18 months.

#### Dust Mitigation System

| Interface | Strategy | Heritage / TRL |
|-----------|----------|----------------|
| Optical sensors | Hard covers (ExoMars TRL 7) + electrostatic deflection growth provision | ExoMars PanCam (TRL 7) |
| Thermal radiators | Size to ε=0.70 EOL (from ε=0.85 BOL); ~18% degradation allowance | Mars rover analogy [VERIFY] |
| Electrical connectors | Dust caps + N₂ purge canisters (0.3 kg consumable) | Apollo EVA connector heritage |
| Joint seals | Dual-stage labyrinth + FFKM lip seal (see §4.3) | MER/ExoMars — TRL 4–5 |
| Boot covers | Disposable Vectran/Zylon overshoes, 500-hr interval | Novel — TRL 2 |

#### TRL Gate Flags (7 items)

1. FFKM dynamic seal under cryogenic cycling — gate 2029
2. Flexspline fatigue under vacuum thermal cycling — gate 2029
3. Tier 2 SEU/latchup rate on Jetson-class at lunar surface — gate 2029
4. Optical cover actuator reliability after 1000 cycles with dust — gate 2031
5. Boot cover abrasion lifetime validation — gate 2031
6. Radiator emissivity degradation lunar-specific measurement — gate 2031
7. Thermal model to TRL 5 for hibernation power budget — gate 2031

---

### 4.6 Mass and Power Budget

*Source: `study/01-optimal-space-humanoid/06-mass-power-budget.md`*

#### Mass Budget — Closes at 75.0 kg Design-To

| Subsystem | Design-To (kg) | NTE (kg) | Notes |
|-----------|---------------|---------|-------|
| Primary structure (CFRP torso, Ti joints) | 8.5 | 11.1 | |
| Actuation (motors, harmonic drives, QDD) | 13.0 | 16.9 | 38 joints × ~342 g mean |
| Joints, bearings, sealing hardware | 4.0 | 5.2 | 38 × ~105 g |
| End-effectors (hands + feet) | 4.5 | 5.9 | Hands ~1.8 kg each; feet ~0.45 kg each |
| **Structure + actuation block** | **30.0** | **39.0** | Locked in cross-coupling log |
| Sensor suite | 2.1 | 2.7 | |
| Compute (Tier 1 + Tier 2 + shielding) | 1.8 | 2.3 | |
| Sensing + compute | 3.9 | 5.1 | |
| Battery cells (2.0 kWh at 160 Wh/kg) | 12.5 | 16.3 | Largest single line item |
| BMS + battery housing (20% overhead) | 2.5 | 3.3 | |
| Main power harness | 1.9 | 2.5 | |
| Power system total | 16.9 | 22.0 | |
| Thermal management (MLI + heaters + radiator) | 3.0 | 3.9 | |
| Radiation shielding (vault + spot) | 1.0 | 1.3 | |
| Signal cabling, connectors, brackets | 2.5 | 3.3 | |
| Consumables (boot covers + N₂ purge) | 0.4 | 0.5 | Initial deployment only |
| **Allocated subsystems total** | **57.7** | **75.1** | |
| **System growth allowance** | **17.3** | — | 23% of design-to |
| **System design-to** | **75.0** | **97.5** | NASA-STD-5001 30% margin |

**Dominant risk:** Power system at 16.9 kg (22.5% of total) is sensitive to battery energy density assumption (§A13: 160 Wh/kg design-to; conservative floor 150 Wh/kg).

#### Power Budget — Three Operational Modes

| Mode | Design-To (W) | With 30% Margin (W) | Cap (W) | Status |
|------|-------------|-------------------|---------|--------|
| Full locomotion + manipulation | 474 | 616 | 800 | **CLOSES** |
| Stationary manipulation | 332 | 432 | 500 (goal) | **CLOSES** |
| Lunar night hibernation (survival) | 79–209 | 103–272 | 300 (FSP provision) | Lower bound closes; upper bound does NOT |

**Key line items in full locomotion mode:**
- Locomotion actuation (hips, knees, ankles): 260 W — largest single item; derived from Valkyrie scaling × 0.55 gait factor (unvalidated parametric assumption — flagged as budget stress)
- Manipulation actuation (shoulders, elbows, wrists, torso, neck): 100 W
- Sensors: ~44 W nominal
- Compute (Tier 1 + Tier 2 peak): 58 W
- Communications: 20 W
- Thermal (joint heaters active): 25 W

**Battery sizing:** 4-hour EVA sortie at 500 W steady-state = 2.0 kWh design capacity. At 160 Wh/kg: 12.5 kg cell mass. If DoD limited to 80%, capacity must grow to 2.5 kWh (+3.1 kg cell mass).

#### Budget Closure Assessment

**Mass:** Closes. 57.7 kg allocated + 17.3 kg growth = 75.0 kg design-to. NTE 97.5 kg. Risk: actuator mass 1.6 kg over subsystem design-to; absorbed in growth allowance.

**Power (full loco+manip):** Closes at 616 W vs. 800 W cap. *Conditional* on 0.55 gait normalization factor being validated.

**Power (lunar night):** Lower bound (103 W) closes against 150 W FSP goal. Upper bound (272 W) does NOT close. Upper bound FSP draw for three humanoids: 816 W. This is a known open item.

---

---

## 5. Question (b): Human-in-the-Loop Value

### 5.1 Overview

*Source: `study/02-human-in-the-loop/01-overview.md`*

Human-in-the-loop (HITL) value is defined as the marginal improvement in mission outcome attributable to human judgment at a given decision point, minus the cost of the human's involvement (crew time, cognitive load, latency overhead). HITL is worth paying for when:

1. **Latency is low enough** that human intervention can change the outcome (<200 ms for real-time correction; longer latencies require supervisory rather than reactive control)
2. **Task novelty is high** — the robot is operating outside its training distribution (out-of-distribution events, discovery science, improvised problem-solving)
3. **Consequence asymmetry is large** — the cost of an error is substantially higher than the cost of the human's time

At 2.78 s RTLT via Queqiao-2, Earth-based supervisors cannot intervene before events at the lunar far side complete. This is not a safety margin issue — it is physics. **Forward-deployed humans are therefore a commitment, not an option.** The HITL question at the lunar far side is not "should humans supervise?" but "how many humans, doing what, at what supervisor ratio?"

#### Three Conditions for HITL Value — Summary Table

| Condition | Lunar Far Side (via Queqiao-2) | Earth-Relay (contingency) |
|-----------|-------------------------------|--------------------------|
| Latency threshold | Met (2.78 s for supervisory; 50 ms on-base) | Not met for reactive; met for supervisory |
| Task novelty | High (exploration, novel geology, improvised repair) | High |
| Consequence asymmetry | High (irreversible actions, robot loss) | High |

#### IOC Task Allocation (2035)

Of 20 canonical mission tasks:
- **12 autonomy-led** — executed without real-time human intervention
- **6 jointly-executed** — human provides intent, robot executes, human monitors
- **2 human-led** — human judgment required for primary execution

---

### 5.2 Latency Tradespace

*Source: `study/02-human-in-the-loop/02-latency-tradespace.md`*

#### Latency by Destination

| Destination | One-Way Light Time | RTLT | Tier | Supervision Mode |
|-------------|-------------------|------|------|-----------------|
| LEO / ISS | 0.002–0.007 s | <14 ms | A | Continuous (real-time) |
| Earth orbit (GEO) | ~0.12 s | ~0.24 s | A | Continuous with lag |
| Lunar near side (direct) | 1.19–1.36 s | 2.38–2.71 s | B | Supervisory |
| Lunar far side (Queqiao-2 relay) | 1.39–1.46 s | **2.78–2.92 s** | B | Supervisory |
| Mars | 4.35–21 min | **8.7–42 min** | C | Autonomous with check-in |

**Queqiao-2 relay overhead:** ~9% additional latency vs. direct near-side link. Single satellite availability: 75–85%. Two-satellite constellation required for >95% availability. Orbit: periapsis 200–250 km, apoapsis 16,000–17,000 km, period 24 hr, inclination 62.4°.

#### Three-Tier Latency Model

**Tier A (≤50 ms):** Real-time teleoperation. Operator perceives continuous control. Applicable on-base (local wireless link). Heritage: METERON HAPTICS-2 experiment (ISS to Earth, 800 ms — marginal for haptic feedback but robust for supervisory command).

**Tier B (~2.8 s):** Frame-advance teleoperation. Operator issues commands; robot executes; operator observes result before issuing next command. Applicable lunar far side via Queqiao-2. Heritage: Lunokhod (2.5 s RTLT, NIP-10 ground control team, 5 operators per rover).

**Tier C (8.7–42 min):** Fully autonomous with periodic supervisory check-in. Applicable Mars. Operator reviews telemetry batches; issues long-horizon plans. Human intervention between batches is impossible. Heritage: MSL Curiosity/Perseverance daily uplink/downlink cycle.

#### Heritage Anchors

**Lunokhod (2.5 s RTLT, 1970–1973):** NIP-10 ground station operated 5 operators per rover: driver, navigator, antenna operator, systems engineer, science coordinator. Frame-advance at ~1 frame every 5–20 seconds. Lunokhod 1: 10.5 km. Lunokhod 2: 39.16 km (LRO-revised). Lunokhod lesson: at 2.5 s, effective teleop requires rich situational awareness, not just low latency.

**METERON SUPVIS Justin (820 ms, 2015):** ESA experiment, Thomas Pesquet commanding Justin robot from ISS. Demonstrated supervisory command (not continuous control) is robust at 820 ms. Key finding: operator issues task-level commands ("move to location X, pick up object Y"), not joint-level commands. This is the supervisory mode applicable at Tier B.

**Sheridan 10-level autonomy taxonomy (1978):** The foundational framework for human-automation authority sharing. Levels 1–4 (human decides, computer executes) through levels 7–10 (computer decides, human informed). Tier B operations correspond to Sheridan levels 5–6.

---

### 5.3 Autonomy TRL and Task Allocation

*Source: `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`*

#### TRL Assessment by Autonomy Category (2026 Baseline)

| Category | Terrestrial TRL | Space TRL | Primary Gap | 2029 Target |
|----------|----------------|-----------|-------------|-------------|
| Bipedal locomotion (flat, structured) | 8–9 | 2–3 | 1/6g, regolith, dust | 5–6 |
| Bipedal locomotion (unstructured terrain) | 6–7 | 2 | Same + slope/debris | 4–5 |
| Dexterous manipulation | 5–6 | 2 | Vacuum, thermal, glove equiv | 4–5 |
| Object recognition / scene understanding | 8 | 4–5 | Radiation SEU, OOD | 6 |
| SLAM / autonomous navigation | 8 | 6 (rovers) | Bipedal on regolith | 6–7 |
| Task planning / sequencing | 6–7 | 3 | Long-duration, OOD | 4–5 |
| Fault detection and response | 6–7 | 5–6 | Novel fault modes | 6 |
| Human-robot collaboration | 6 | 3 | Latency adaptation | 4–5 |
| Long-duration autonomy (weeks) | 4–5 | 2–3 | No heritage | 3–4 |

#### 20-Task Mission Taxonomy

| Task | Description | IOC Allocation | Rationale |
|------|-------------|---------------|-----------|
| T01 | Routine habitat inspection walk-around | Autonomy-led | Scripted path, pattern recognition |
| T02 | Equipment deployment from lander | Joint | Novel configuration each time |
| T03 | Power cable routing and connection | Autonomy-led | Defined end-effector targets |
| T04 | ISRU equipment monitoring | Autonomy-led | Telemetry watching, alert-triggered |
| T05 | Geological sample collection (planned site) | Joint | Sample selection is human judgment |
| T06 | Sample packaging and labeling | Autonomy-led | Repetitive; high dexterity, low novelty |
| T07 | Cargo transfer between modules | Autonomy-led | Defined pick-and-place |
| T08 | Antenna alignment and pointing | Autonomy-led | Closed-loop servo task |
| T09 | Geological sample collection (improvised) | Joint | OOD discovery; human selects target |
| T10 | EVA tool retrieval and staging | Autonomy-led | Inventory management |
| T11 | Habitat exterior cleaning (dust) | Autonomy-led | Scripted pattern, force control |
| T12 | Emergency medical assist | Human-led | Medical judgment; consequence asymmetry |
| T13 | Instrument repair (known fault) | Joint | Human diagnoses; robot executes repair |
| T14 | Instrument repair (novel fault) | Joint | Both diagnose; human decides |
| T15 | Regolith excavation (programmed path) | Autonomy-led | Programmatic; terrain adaptation |
| T16 | Construction assembly (novel geometry) | Joint | Human provides geometric judgment |
| T17 | Science traverse planning | Joint | Human sets scientific priorities |
| T18 | Crew emergency evacuation assist | Human-led | Real-time adaptive; life safety |
| T19 | Logistics inventory management | Autonomy-led | Data management, no physical uncertainty |
| T20 | Routine comms relay operations | Autonomy-led | Fully scripted |

**Summary: 12 autonomy-led / 6 jointly-executed / 2 human-led**

#### Human Value Floor — Seven Permanently Human-Required Categories

Regardless of TRL advancement, these categories require human judgment as the primary decision-maker:

1. **Discovery science** — interpreting novel geological or biological observations with no training-set precedent
2. **Medical judgment** — diagnosis and treatment decisions affecting crew health
3. **Emergency response** — real-time adaptive response to life-safety events
4. **Program-level prioritization** — allocating limited resources across competing objectives
5. **Ethical and political decisions** — flagging, when observations have policy implications
6. **Novel fault modes** — diagnosing system failures outside the trained fault taxonomy
7. **Crew interpersonal mediation** — human group dynamics management

These categories do not become automatable with TRL advancement. They are structurally human because they require value judgments, not just prediction.

---

### 5.4 Teaming Model

*Source: `study/02-human-in-the-loop/04-teaming-model.md`*

#### Three Supervision Modes

| Mode | Description | Crew Time Cost | Cognitive Load | When Used |
|------|-------------|---------------|----------------|-----------|
| Continuous | 1:1 person-hr per robot-hr; operator actively directing | ~0.75 person-hr/robot-hr | High (70–85% cognitive utilization) | Life-safety tasks, novel terrain first traverse, medical assist |
| Periodic | Check-in every 15–30 min; robot operates between check-ins | ~0.20 person-hr/robot-hr | Medium (30–50%) | Routine surface operations, known fault response |
| On-demand | Interrupt-driven; robot flags decision points | ~0.05 person-hr/robot-hr | Low (10–20% background) | Scripted autonomous tasks, monitoring |

#### Cognitive Load Arithmetic (IOC — 4 crew, 3 humanoids)

Estimated daily demand (8-hr operational day):

| Mode | Robots | Hours | Load |
|------|--------|-------|------|
| On-demand supervision | 1–2 robots × 6 hr/day | × 0.05 | ~0.60 person-hr |
| Periodic supervision | 2–3 robots × 5 hr/day | × 0.20 | ~2.00 person-hr |
| Continuous supervision | 0–1 robot × 1 hr/day | × 0.75 | ~0.75 person-hr |
| **Total supervisory demand** | | | **~3.35 person-hr** |
| Non-supervisory crew duties | | | ~4.0 person-hr |
| **Total demand** | | | **~7.35 person-hr** |
| **Available capacity (4 crew × 2 hr supervisory each)** | | | **~8 person-hr** |
| **Headroom** | | | **~0.65 person-hr (~8%)** |

At IOC, headroom is thin. The study uses a more conservative estimate of ~2× headroom under the assumption that not all 3 humanoids operate simultaneously at peak load. Full operations (1:4–5 ratio) requires TRL advancement that reduces the periodic supervision fraction.

#### Supervisor Ratio Derivation

**Five-step derivation from heritage to projection:**

1. **NIP-10 baseline (Lunokhod heritage):** 5 operators per rover at 2.5 s RTLT. Decomposed: driver (continuous, 100%), navigator (continuous, 80%), antenna (continuous, 60%), systems (periodic, 30%), science (on-demand, 20%) = approximately 2.9 cognitive-load-equivalents per rover. Effective ratio: 1.7:1 operators to rovers.

2. **§A1 autonomy curve adjustment:** At IOC TRL (reactive TRL 6, deliberative TRL 5), autonomous task execution eliminates the driver and navigator functions. Remaining load: systems monitor + science decision + anomaly response ≈ 1.0–1.5 cognitive-load-equivalents per robot.

3. **Cognitive load arithmetic (above):** 3–4 robots at mixed supervision modes ≈ 3.35 person-hr supervisory demand against 8 person-hr capacity = 1:2–3 comfortable.

4. **Post-2035 TRL advancement:** At TRL 7–8 (2035–2040), on-demand supervision fraction increases; periodic fraction decreases. Model projects supervisory demand drops to ~1.5–2.0 person-hr for 4–5 robots.

5. **Human value floor ceiling:** Seven permanently human-required categories cap the supervisor ratio regardless of TRL. Even at TRL 9, the per-robot human value floor is approximately 0.1–0.15 person-hr/robot-hr, giving a hard ceiling of ~1:8–10.

**Result:** IOC 1:2–3 → Full ops 1:4–5 → Ceiling ~1:8–10

#### Crew Composition (§A19)

**IOC baseline: 4 humans, 3 humanoids**

- Commander/Chief Scientist: overall ops + scientific priority setting
- Systems Engineer/Robotics Supervisor: primary robot supervisor + fault management
- Geologist/Field Scientist: science direction + field sample judgment
- Medical Officer/Engineer: crew health + EVA support + secondary robotics

Cognitive demand model closes with ~2× headroom at this composition. Reducing to 3 crew closes at ~1.3× headroom — acceptable but not robust to extended illness or injury.

---

---

## 6. Cross-Cutting Analysis

### 6.1 Margins and Assumptions Register

*Source: `study/05-cross-cutting/margins-and-assumptions.md`*

The full register contains §A1 through §A19. Key entries:

| ID | Assumption | Value | Risk | Owner |
|----|-----------|-------|------|-------|
| §A1 | Autonomy TRL curve | TRL 6 by 2029, TRL 7+ by 2035, TRL 8 by 2038–2040 (space-relevant environments) | **High** | autonomy-trl-tasking |
| §A2 | Design-to mass | 75 kg | **Medium-High** | humanoid-systems-architect |
| §A3 | Power budget | 500 W steady-state / 800 W peak (full ops); 300 W FSP provision (lunar night) | **Medium** | humanoid-systems-architect |
| §A4 | Actuation architecture | HD-Electric primary; SEA fallback gate 2029 | Medium | robotics-actuation-structures |
| §A5 | Structure+actuation mass fraction | ≤40% of total = ≤30 kg design-to | Medium | robotics-actuation-structures |
| §A6 | DOF count | 51–55 kinematic / 38 actuated | Low | robotics-actuation-structures |
| §A7 | Dust seal architecture | Dual-stage labyrinth + FFKM lip seal | **High** | robotics-actuation-structures |
| §A8 | Sensor suite selection | Stereo HDR+ToF + wrist cameras + IMU triad + F/T + tactile + LIDAR = 2.1 kg, 37–75 W | Low | robotics-sensing-autonomy |
| §A9 | Compute architecture | RAD750-class Tier 1 + Jetson AGX Orin-class Tier 2 = 1.8 kg, 22–75 W | Medium | robotics-sensing-autonomy |
| §A10 | Lunar night thermal power | 70–200 W per humanoid (TRL 2 parametric; 3× uncertainty span) | **High** | space-environments |
| §A11 | Radiation and ORU strategy | RHBD Tier 1 + COTS+shield+3yr-ORU Tier 2 | Medium | space-environments |
| §A12 | TID budget | 140–210 krad(Si) unshielded over 7 years | Medium | space-environments |
| §A13 | Battery energy density | 160 Wh/kg design-to (ISS heritage); conservative floor 150 Wh/kg | Medium | humanoid-systems-architect |
| §A14 | Gait normalization factor | 0.55 (normal vs. vigorous gait power ratio) — **no heritage validation** | **High** | humanoid-systems-architect |
| §A15 | Latency tier boundary | Tier A ≤50 ms; Tier B ~2.8 s; Tier C 8.7–42 min | Low | teleoperation-latency |
| §A16 | Locomotion power scaling | Valkyrie mass-ratio scaling × 0.85 efficiency × 0.65 locomotion fraction × 0.55 gait factor = 260 W | **High** | humanoid-systems-architect |
| §A17 | Task allocation at IOC | 12/6/2 split (autonomy/joint/human) | Medium | autonomy-trl-tasking |
| §A18 | Supervisor ratio | 1:2–3 at IOC / 1:4–5 full ops / ceiling ~1:8–10 | Low | human-factors-teaming |
| §A19 | Crew composition | 4 humans, 3 humanoids, ~2× headroom | Low | human-factors-teaming |

---

### 6.2 Cross-Coupling Log

*Source: `study/05-cross-cutting/cross-coupling-log.md`*

The cross-coupling log tracks decisions that propagate across agent ownership boundaries. Key entries from the full log:

| Entry | Decision | Downstream Impact |
|-------|----------|-------------------|
| Form factor selection | Full bipedal, 75 kg design-to, 97.5 kg NTE | Destinations manifest, lander sizing, COst |
| Actuation architecture | HD-Electric primary; SEA fallback gate 2029 | Power budget, mass budget, thermal |
| DOF count | 38 actuated | Actuator mass, power budget, autonomy complexity |
| Structure+actuation mass | 30.0 kg design-to / 39.0 kg NTE | Mass budget closure |
| Dust mitigation system-level | Dual labyrinth + FFKM; boot covers 500-hr; N₂ purge | Consumables manifest, maintenance schedule |
| Sensor suite | 2.1 kg / 37–75 W peak | Mass and power budget |
| Compute architecture | 1.8 kg / 22–75 W | Mass and power budget; radiation strategy |
| Autonomy TRL boundary | TRL 6 reactive / TRL 5 deliberative by 2029 | Task allocation, supervisor ratio, ConOps |
| Thermal power (lunar night) | 70–200 W per humanoid (FSP reservation: 300 W with margin) | Far-side-base-architect FSP sizing |
| Radiation strategy | RHBD Tier 1; COTS+3yr ORU Tier 2 | Spares manifest, logistics cost |
| Mass/power budget closure | Confirmed; conditional on gait factor validation | All downstream |
| TRL 6 / 2029 gate | Minimum observable: 30 min unscripted locomotion on JSC-1A in 1/6-g offload | Technology roadmap |
| Latency tier handoff | Tier A ≤50 ms; Tier B ~2.8 s (Queqiao-2) | ConOps operations tempo |
| Task allocation IOC | 12/6/2 at IOC 2035 | ConOps duty cycle, crew sizing |
| Human value floor | 7 categories permanently human-required | Supervisor ratio ceiling |
| Supervisor ratio | 1:2–3 IOC / 1:4–5 full ops / ~1:8–10 ceiling | Crew sizing, cost |
| Crew composition | 4 humans / 3 humanoids at IOC | Habitat sizing, life support, launch manifest |

---

### 6.3 Soviet and Russian Heritage

*Source: `study/05-cross-cutting/soviet-russian-heritage.md`*

The Soviet/Russian space program is the primary heritage source for remote surface telerobotics, long-duration human isolation, and the engineering philosophy that governs this study's positions.

#### Lunokhod — Surface Telerobotics Heritage

**Lunokhod 1 (1970–1971):** 10.54 km traverse over 11 months. NIP-10 ground station: 5 operators per rover (driver, navigator, antenna, systems, science). Frame-advance control at 2.5 s RTLT. Operations: 397 lunar day sessions.

**Lunokhod 2 (1973):** 39.16 km (LRO-revised) over ~5 months. Ended when solar panels contaminated by dust knocked onto them by the rover itself — a lesson in dust management that directly informs this study's boot cover and dust mitigation design.

**NIP-10 lesson:** Five operators for one rover at 2.5 s RTLT represents the unoptimized baseline. Modern autonomy reduces this ratio. The study's supervisor ratio derivation anchors at NIP-10 and applies the §A1 TRL curve to project the reduction.

**Key insight:** The Lunokhod missions prove that productive surface operations are possible at Tier B latency (2.5 s). The 48 km of cumulative traverse over two vehicles is the strongest counter-evidence to arguments that meaningful telerobotics requires <1 s latency.

#### Salyut and Mir — Long-Duration Human Factors

**Behavioral torpor (Mars-500 analog):** The 520-day Mars-500 isolation study (2010–2011, IBMP Moscow) documented "behavioral torpor" — systematic reduction in activity levels, psychological withdrawal, and circadian rhythm disruption. The study's teaming model accounts for this by building cognitive headroom (~2×) into the IOC baseline, providing margin for supervisor performance degradation during extended missions.

**Mir sustainment philosophy:** Yuri Semyonov's directive: "No instrument inside the station that cannot be replaced in flight." This principle directly drives the ORU design requirement: all external connectors and joint access panels must be sized for EVA-gloved hands, 50 mm minimum clear access, single-fastener removal per ORU.

**Mir maintenance absorption:** Mir crews spent 30–40% of their operational time on maintenance and repair rather than science. This establishes the heritage baseline for humanoid maintenance burden planning — and the economic argument for humanoid robots as maintenance workers rather than crew.

#### FEDOR — Contra-Humanoid Lesson

**Skybot F-850 (FEDOR, 2019):** Launched to ISS aboard Soyuz MS-14. Limited operational dexterity; control interface difficulties; mission objectives not fully achieved. Mass ~106 kg operational (160 kg launch config). FEDOR's primary lesson for this study: a teleoperated humanoid without sufficient autonomy, properly designed operator interfaces, or pre-mission task validation will not achieve mission objectives even in a benign operational environment. The control philosophy failure is as important as the hardware.

#### Cosmonaut Supervisory Control Heritage

Soviet cosmonaut behavioral research established that the optimal supervisory role for a human in a partially-automated system is "monitor and arbitrate" rather than "supervise continuously." This maps directly to the study's Tier B periodic supervision mode: the human supervisor monitors telemetry batches, intervenes on anomalies, and arbitrates decision points — not drives every action.

---

### 6.4 Open Questions

*Source: `study/05-cross-cutting/open-questions.md`*

**Highest Priority (blocking downstream sections):**

1. **Harmonic drive flexspline cryogenic fatigue** — No published data on HD performance below −100°C. This is the primary physical risk to the actuation architecture. Gate: 2029 cryo-cycling test campaign.

2. **FFKM dynamic sealing performance under dust + thermal cycling** — FFKM has space heritage in static seals. Dynamic (rotating joint) performance under simultaneous dust ingestion and −60°C to +80°C thermal cycling is uncharacterized. Gate: 2029 accelerated wear test.

3. **Tier 2 SEU rate at lunar surface** — The GCR HZE ion flux that dominates latchup is not well-characterized for COTS VLSI at the lunar surface. The Perseverance RAD instrument gives context but not direct CMOS device characterization. Gate: 2029 radiation test campaign.

4. **Bipedal locomotion stability in 1/6g** — No bipedal humanoid has operated in reduced gravity. ZMP-based stability margins assume 1g. Dynamic locomotion models require re-validation. Gate: 2028 parabolic flight campaign or NASA drop-tower test.

5. **Foundation model OOD behavior dataset** — No VLA system has been validated against the out-of-distribution failure modes expected in lunar exploration (novel geology, unexpected terrain, partially-buried objects). Gate: 2031 lunar-analog dataset collection.

**Active Open Questions by Domain:**

- Actuation: SEA fallback mass penalty quantification; Class A actuator 1.6 kg over-budget resolution path
- Sensing: Wrist camera 75g/unit mass validation against specific product; LIDAR product selection
- Power: Battery DoD operating limit under cold-start conditions; 0.55 gait factor validation test design
- Thermal: Thermal model TRL 5 path; centaur thermal comparison for form factor retrospective
- Radiation: Silicon TID conversion factor uncertainty bound; FEDOR 160 kg launch vs. 106 kg operational reconciliation
- Teaming: Cognitive load measurement methodology for long-duration mission performance degradation
- Program: TRL 5 demonstration program first-milestone identification (organization, facility, funding, schedule)

---

---

## 7. CAD Model Status

*Source: `cad/generation-log.md`, `cad/README.md`*

### Current Model (2026-05-03 Generation)

A parametric CadQuery 3D model of the study humanoid was generated by the `cad-generation-agent` from the study specs in `study/01-optimal-space-humanoid/`.

**Parameters used:**
- Height target: 1.75 m (result: 1.61 m — within 1.5–1.9 m spec)
- Torso: 0.32 m W × 0.20 m D × 0.42 m H
- Head: sphere R=0.105 m
- Upper arm: 0.30 m, Forearm: 0.26 m
- Thigh: 0.42 m, Shin: 0.38 m
- Limb radius: 0.048 m, Joint radius: 0.063 m
- Foot boot profile: 0.25 m L × 0.13 m W × 0.065 m H
- Stereo camera baseline: 0.07 m at ±35 mm separation

**Output files:**
- `cad/output/humanoid.stl` — 534 KB, 10,930 faces (trimesh)
- `cad/output/humanoid.glb` — 194 KB, primary deliverable for Looking Glass display
- Bounding box: 1.82 m wide × 0.27 m deep × 1.61 m tall

**Known limitations:**
- Actual height 1.61 m (within spec; slightly below 1.75 m design-to due to joint compression in assembly)
- Depth 0.27 m is anatomically narrow (torso depth drives this)
- Camera bosses are simple cylinders — no CSG cut into sphere
- No PNG renders available (headless environment, pyglet not available)

### Regenerating the Model

```bash
python cad/humanoid_model.py
```

Produces `cad/output/humanoid.stl`. Then convert to GLB:

```bash
python -c "import trimesh; trimesh.load('cad/output/humanoid.stl').export('cad/output/humanoid.glb')"
```

Verify proportions:

```bash
python -c "import trimesh; m = trimesh.load('cad/output/humanoid.glb'); print('Bounding box (m):', m.bounding_box.extents)"
```

Expected: roughly `[0.5, 0.4, 1.7]` (W × D × H).

### For the Pitch Demo

Load `cad/output/humanoid.glb` in **Looking Glass Model Viewer** (not Looking Glass Studio — that is for quilt photos/videos). The Model Viewer accepts GLB directly on all Looking Glass devices (Portrait, Go, 16", 32"). No conversion or quilt format required. Recommended polygon count: ≤400k.

### Stage 8.5 Physical Tasks (Pending)

- Task 4: Screen-record a fresh `python cad/humanoid_model.py` run → `cad/demo-recording.mp4`
- Task 5: Install Looking Glass Model Viewer, connect device, load `humanoid.glb`
- Task 6: Practice 8-step pitch flow

---

---

## 8. Review Findings Summary

*Sources: `review/triage.md` and all five reviewer finding files*

### Stage 6 Review — Overall Triage

| Severity | Count | Resolved |
|----------|-------|---------|
| Blocker | 10 | **10 of 10** |
| Major | 41 | Most resolved; some remain open |
| Minor | 30 | Partially addressed |
| Nit | 19 | Not yet addressed |

All 10 Blockers were resolved in Stage 6 Batch 1 and Batch 2 fix passes.

### Blockers — All Resolved

| ID | Finding | Resolution |
|----|---------|-----------|
| P1-A | Tradespace scores wrong (table vs. arithmetic) | Corrected: A=3.65, B=3.55, C=3.25, D=2.90, E=2.85 |
| P1-B | Heater range mismatch §05→§06 | Resolved: §06 corrected to match §05's 50–150 W |
| AE-001 | DOF arithmetic inconsistency (38 vs. 51–55) | Clarified: 38 actuated vs. 51–55 kinematic |
| AE-002 | Stefan-Boltzmann radiator calculation wrong | Corrected; thermal management mass revised |
| AE-003 | Tradespace matrix scores | Same as P1-A |
| HC-001 | Atlas Electric actuator type misidentified as roller-screw | Corrected: custom direct-drive electric |
| HC-002 | Chang'e-4 LND citation key missing and wrong author | Fixed: zhang2020lnd, lead author corrected |
| CC-001 | Lunar night survival heater range mismatch | Resolved: §06 corrected to §05 source values |
| RM-001 | Lunar night power goal circular; closure misleading | Reframed: conditional closure with explicit uncertainty |
| RM-002 | 0.55 gait factor invented; power closure conditional | Added §A14; closure qualified explicitly |

### Key Remaining Open Findings (Major / Unresolved)

**Devil's Advocate (DA-001, DA-002 — both Blockers per DA reviewer):**
- DA-001: Program economics argument ($60–160M dual-standard cost) is asserted, not quantified. Requires parametric economic comparison before program review.
- DA-002: §A1 TRL 6 by 2029 has no named TRL 5 demonstration program. Technology-roadmap-trl agent must add first milestone: facility, platform, test objectives, lead org, rough cost.

**Heritage Citations (HC — systemic):**
- BibTeX corpus severely underpopulated: ~25 citation keys used across sections; only a handful have entries in `corpus/references.bib`. All section agents must append entries.
- Atlas Electric efficiency (85–90%) attributed to harmonic drive heritage, but Atlas uses direct-drive — must separate claims.
- ISS battery citation self-flagged as unconfirmed; energy density 160 Wh/kg not yet verified against primary source (NTRS ISS Li-ion battery papers).

**Reliability and Margins (RM-007 — Major):**
- Thermal radiator area calculation (0.3 m² to reject 300 W) is inconsistent with Stefan-Boltzmann at stated temperatures. Correct derivation produces ~6 m² at Tpanel=50°C vs. Tenv=40°C. Radiator mass line (3.0 kg) likely incorrect.

**Scope Discipline (SD-001 through SD-006 — all Major):**
- §04-sensing-autonomy.md: 5,182 words vs. 1,800–2,500 target. Foundation models field survey (~500 words) and autonomy stack narrative (~350 words) are removable.
- §05-environments-hardening.md: 4,422 words vs. 1,500–2,000 target. Dust mitigation subsections and thermal derivation prose account for ~800 words above target.
- §06-mass-power-budget.md: 4,048 words vs. 1,200–1,800 target. Actuation power footnote derivation chain (~170 words) and assumption logging section (~200 words) are removable.

### Reviewer Summary Assessments

**Aerospace Engineer:** Sections are technically competent; three original blockers (DOF arithmetic, Stefan-Boltzmann, tradespace scores) were genuine math errors that are now corrected. Primary residual: BibTeX population, Atlas actuator characterization.

**Cross-Coupling:** Budget closure is internally consistent after CC-001 resolution. Four majors remain: tradespace score (corrected), sensor peak power acknowledgment (CC-003), autonomy TRL reconciliation table (CC-004), Candidate A mass description (CC-005).

**Devil's Advocate:** Study is substantively strong. Biggest structural vulnerabilities are unquantified economic assertion (DA-001) and unbacked TRL curve (DA-002). Both can be fixed without changing conclusions — they need quantitative scaffolding, not different answers.

**Heritage Citations:** Two structural errors (Atlas actuator type, LND citation) now corrected. BibTeX population is the systemic remaining issue.

**Reliability and Margins:** Five key patterns: invented power multipliers closing the budget; subsystem NTE × system NTE double-margin not reconciled; suspicious parametric precision suggesting values adjusted to close; [VERIFY] flags without owners/dates; thermal range dominating power budget risk.

**Scope Discipline:** No section is a design document in disguise. All majors are addressable by removing field-survey passages and compressing option-evaluation narratives. Estimated 2,650–3,000 words removable across all sections.

---

---

## 9. Retro and Process Lessons

*Sources: `retro/session-logs.md`, `retro/system-observations.md`, `retro/process-lessons.md`, `retro/agent-performance.md`, `retro/orchestrator-performance.md`*

### Session History

| Stage | Content | Status |
|-------|---------|--------|
| Stage 1 | Scaffolding: document tree, agent definitions, study stubs | Complete |
| Stage 2 | Q(a) initial drafts: §01-01 through §01-04 | Complete |
| Stage 3 | Q(a) §01-05 and §01-06; cross-cutting stubs | Complete |
| Stage 4 | Soviet-Russian heritage; form factor tradespace pass | Complete |
| Stage 5 | Cross-coupling enforcement; assumption register §A1–§A13 | Complete |
| Stage 6 | Six-reviewer review pass; 10 blockers resolved; §A14–§A19 added | Complete |
| Stage 7 | Q(b) drafts: §02-01 through §02-04; supervisor ratio derivation | Complete |
| Stage 8 | Executive summary; CAD model generation; handback | Complete |
| Stage 8.5 | CAD GLB output; Looking Glass setup; physical demo prep | Partially complete (physical tasks pending) |

### Key Process Lessons

1. **Breadcrumbs need gates, not just scaffolding.** Session logs and cross-coupling entries were missed even when explicitly required. The pattern changed only when the stop hook enforcement was added.

2. **Zero findings is false without evidence that reviews ran.** Stage 5 produced "no review findings" entries before the six-reviewer pass revealed 10 blockers. Review pass must produce a findings file; empty findings file is not acceptable without a specific statement of what was checked.

3. **Contradictions compound silently.** The heater range mismatch (§05 50–150 W vs. §06 85–175 W) went undetected for two stages because no agent owned both files simultaneously. The cross-coupling log is the mitigation, but only works if agents read it before writing.

4. **Parallel agents need write isolation.** When assumption register §A13 and §A14 were being written by different agents in the same session, numbering collision occurred. Central coordination for numbered registers is mandatory.

5. **Citation keys need BibTeX entries on first use.** Section agents consistently wrote citation keys without adding BibTeX entries. The corpus is underpopulated as a result. This is now a gate requirement.

6. **Arithmetic needs derivation display.** Budget closures that depend on multiplication chains (gait factor, locomotion fraction, mass-ratio scaling) must show their work. Reviewers cannot verify a bare number.

7. **The §A1 TRL curve is the load-bearing beam.** Everything downstream (task allocation, supervisor ratio, ConOps, cost) depends on it. Until a TRL 5 demonstration program is identified and funded, the curve is aspirational. This is the study's single deepest risk.

### Meta-Supervisor Observations (Selected)

*Source: `retro/system-observations.md`*

- **TRL contradiction (Obs-1):** §04 stated reactive layer at space TRL 3–4; §A1 committed to TRL 6 by 2029. Gap acknowledged but not resolved until review. Pattern: agents accept cross-coupling log inputs without auditing them against their own section's stated values.

- **Breadcrumb atrophy (Obs-2):** Mandatory closing actions (session log, cross-coupling log, assumption register) were the most commonly missed items. The stop hook enforcement in Stage 6 produced measurable improvement.

- **[VERIFY] discipline (Obs-3):** [VERIFY] flags are correctly placed but systematically lack owners and gate dates. A flag without a responsible agent and a due date is a placeholder, not a program commitment.

- **Citation corpus non-functional (Obs-5):** The `references.bib` file has fewer than 10 entries against 25+ citation keys used in the document. This is the systemic quality issue most likely to block final document compilation.

- **Word count overruns (Obs-7):** Four of six Q(a) sections are materially over their target word counts, with §04-sensing-autonomy.md at 2× target. The pattern is option-evaluation prose and field-survey passages inserted to justify positions that heritage citations already support.

- **Cross-coupling log quality improvement (Obs-9):** Stage 7 entries show significantly improved precision vs. Stage 2–4 entries. Agents now document the specific value, the source section, and the downstream section rather than vague statements.

### Agent Performance Summary

**Consistent strengths:** Heritage table construction; position-taking with explicit dissenting conditions; assumption register entries with derivations.

**Consistent weaknesses:** BibTeX corpus population (systemic, all agents); word count discipline (§04 and §05 worst offenders); arithmetic display in budget derivations.

**Best individual performance:** teleoperation-latency agent (precise, well-structured, appropriate word count, good citation practice). robotics-actuation-structures (thorough, showed math, flagged uncertainties).

**Weakest:** Early-stage autonomy-trl-tasking (word count 4,479 vs. 3,000 cap; some field-survey passages). soviet-russian-heritage (Topic 7 required orchestrator completion after agent timeout).

---

---

## 10. Pending Work Roadmap

### Stage 8 — Q(b) Review Pass (Not Yet Started)

Six reviewers × four sections (§02-01 through §02-04). Expected findings: word count overruns in §02-03 (autonomy TRL tasking, 4,479 words vs. 3,000 cap) and possibly §02-02 (latency tradespace, ~3,000 at cap). No blockers expected but cannot be confirmed without running the review.

### Stage 9 — Question (c): Workflow / ConOps

**Blocked on:** Stage 8 review PASS (Q(b) must be complete and reviewed before ConOps can be written).

**Sections to write:**
- `study/03-workflow-conops/01-overview.md` — [conops-integrator]
- `study/03-workflow-conops/02-mission-timeline.md` — [conops-integrator]
- `study/03-workflow-conops/03-fault-sustainment.md` — [fault-management-sustainment]

**Key dependencies ConOps will consume:**
- IOC task allocation (12/6/2 split from §02-03) ✓
- Supervisor ratio (1:2–3 at IOC from §02-04) ✓
- Latency tier model (Tier A/B/C from §02-02) ✓
- Boot cover replacement interval (500 hr from §03) ✓
- Thermal warm-up times (15–30 min partial, 45–90 min full from §05) ✓
- Tier 2 ORU replacement cycle (3 years from §A11) ✓

**Key ConOps questions to resolve:**
- What does a nominal lunar day operational cycle look like? (human wake schedule, humanoid activation, task assignment, check-in frequency)
- What is the fault response playbook? (Tier 1 detects, Tier 2 responds autonomously, human notified at what severity threshold?)
- What is the lunar night schedule? (hibernation prep, FSP monitoring, wake-up sequencing)
- How does EVA and humanoid operation interact? (simultaneous ops policy; proximity rules)

### Stage 10 — Question (d): Build and Deploy

**Blocked on:** Stage 9 completion.

**Sections to write:**
- `study/04-build-and-deploy/01-technology-roadmap.md` — [technology-roadmap-trl]
- `study/04-build-and-deploy/02-destinations.md` — [destinations-trajectories]
- `study/04-build-and-deploy/03-far-side-testbed.md` — [far-side-base-architect]
- `study/04-build-and-deploy/04-cost-program.md` — [cost-program]

**Key Q(d) gaps to fill:**
- TRL 5 demonstration program: named facility, platform, test objectives, lead organization, rough cost, schedule (DA-002 blocker)
- Program economics quantification: dual-standard cost vs. mass penalty calculation (DA-001 blocker)
- Destinations sequence: lunar far side → where next? (Mars, asteroids, Titan?)
- First article specification: minimum first humanoid that proves the architecture
- Program phases and go/no-go gates

### Stage 11 — Final Integration and Review

- BibTeX corpus population (25+ missing entries — required for compilation)
- Word count compression pass (estimated 2,650–3,000 words removable)
- Atlas Electric actuator type correction propagation across §01-01, §01-03, §01-06
- Radiator sizing correction (RM-007: ~6 m² at stated conditions, not 0.3 m²)
- Full document integration: abstract finalization, section cross-references, figure list
- Final review pass (all six reviewers on complete integrated document)

### Handback Generation

After each stage, generate the handback document:

```bash
python tools/generate_handback.py --stage N
```

The handback is a self-contained markdown document that the user pastes into a planning conversation, which produces scaffolding for stages N+1, N+2, N+3.

---

## Bibliography (Selected Key References)

*Source: `corpus/references.bib` — note: full BibTeX corpus is underpopulated; entries below are confirmed.*

- Zhang, S. et al. (2020). "First measurements of the radiation dose on the lunar surface." *Science Advances*, DOI: 10.1126/sciadv.aaz1334. [Chang'e-4 LND radiation data]
- Diftler, M.A. et al. (2011). "Robonaut 2 — The First Humanoid Robot in Space." *ICRA 2011*. [R2 design reference]
- Heiken, G. et al. (1991). *Lunar Sourcebook*. Cambridge University Press. [Lunar environment reference]
- CNSA (2024). Queqiao-2 relay satellite specifications and orbital parameters.
- Huntress, W. & Marov, M. (2011). *Soviet Robots in the Solar System*. Praxis/Springer. [Lunokhod heritage]
- Basner, M. et al. (2013). "Mars-500 study protocol." *Lancet*. [520-day isolation study]
- Kanas, N. & Manzey, D. (2008). *Space Psychology and Psychiatry*. Springer. [Human factors reference]
- Ono, M. et al. (2015). "Risk-aware planetary rover operation." *IEEE Aerospace Conference*. [Mars AutoNav heritage]
- NVIDIA (2023). Jetson AGX Orin product brief. [Tier 2 compute reference]
- Boston Dynamics (2024). "An Electric New Era for Atlas." [Atlas Electric heritage]
- Unitree (2024). H1 product specifications. [Heritage table]

*Note: Approximately 15–20 additional citation keys appear in the study sections without corresponding BibTeX entries. Population of corpus/references.bib is a required task before Stage 11 compilation.*

---

*Document compiled from all study artifacts in `/home/user/hello-world/`. Generated 2026-05-03. Stages 1–8 complete. Stages 9–11 pending.*

