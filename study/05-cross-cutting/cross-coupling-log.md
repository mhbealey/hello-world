---
title: Cross-Coupling Log
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Cross-Coupling Log

This file records architectural decisions, parameter values, and positions that downstream agents depend on. When a number or position is set here, all agents listed under "Affects" must be notified and must update their artifacts if the decision changes their scope.

## Format

```
## YYYY-MM-DD — Parameter name
**Parameter:** what was decided
**Value:** the specific value, range, or position
**Set by:** which agent or process set it
**Affects:** list of agents whose work depends on this
**Basis:** why this value was chosen
```

---

## 2026-05-03 — Autonomy TRL curve

**Parameter:** Humanoid autonomy TRL trajectory (study assumption)
**Value:** TRL 6 (space-relevant environments) by ~2029 → TRL 7+ (space-relevant) by ~2035 → TRL 8 (qualified, operational environment) by ~2038-2040
**Set by:** orchestrator (resolution of stage 4 contradiction between two incompatible registry entries)
**Affects:** autonomy-trl-tasking, human-factors-teaming, conops-integrator, technology-roadmap-trl, cost-program, far-side-base-architect (deployment timeline)
**Basis:** Study assumption with explicit go/no-go gates at each milestone. Not a forecast. See §A1 in `study/05-cross-cutting/margins-and-assumptions.md` for full text. If the 2029 gate is missed, the deployment timeline slips proportionally; if the 2035 gate is missed, the teaming model defaults to higher human-in-the-loop ratios.

---

## 2026-05-03 — Form factor position

**Parameter:** Space humanoid primary form factor
**Value:** Full bipedal humanoid — two legs, two arms, two dexterous hands, anthropomorphic geometry, standing height 1.5–1.9 m, design-to mass 75 kg, not-to-exceed mass 97.5 kg (30% margin)
**Set by:** humanoid-systems-architect
**Affects:** robotics-actuation-structures, robotics-sensing-autonomy, space-environments, humanoid-systems-architect (budget), conops-integrator
**Basis:** Tradespace of five candidates weighted against seven criteria; bipedal form scores highest (3.65/5.00) driven by human tool and environment compatibility (C1, weight 0.25) — the lunar far side base is built for humans, and maintaining dual tool and infrastructure standards for a non-human-geometry robot over a 20-year permanent base lifetime is more costly than the locomotion and mass penalties of the bipedal form. Centaur is the close second (3.55); it becomes the correct answer if the base infrastructure is designed for robots before crew arrival, which the current program timeline does not support. Four end-effectors (feet and hands) must support both bipedal surface locomotion and handrail-grasp zero-g mobility as first-class modes — this requirement flows directly from the FEDOR/Skybot F-850 negative lesson.

---

## 2026-05-03 — Actuation architecture

**Parameter:** Primary joint actuation type for the space humanoid
**Value:** High-ratio harmonic drive electric (HD-Electric) for load-bearing joints (hips, knees, ankles, shoulders, elbows); hybrid QDD-class for low-torque fine-control joints (wrists, fingers, ankle fine-axis). Hydraulic actuation eliminated. SEA retained as fallback if harmonic flexspline cryogenic validation fails by 2029 gate.
**Set by:** robotics-actuation-structures
**Affects:** space-environments (thermal architecture for joint heaters; seal material development), humanoid-systems-architect (mass-power budget — actuator mass fraction and peak power validation), technology-roadmap-trl (harmonic flexspline cryogenic TRL gap must close by 2029), fault-management-sustainment (ORU replacement strategy for actuator modules), cost-program (actuator unit cost heritage)
**Basis:** HD-Electric offers best mass efficiency (Atlas Electric: 89 kg, 56 DOF, 85–90% efficiency) at required torque levels. SEA mass penalty is prohibitive at 75 kg target (Valkyrie: 129 kg, 44 DOF). QDD joint-resident motor mass creates unfavorable distribution for full-body humanoid. Hydraulic eliminated for outgassing risk in vacuum and non-serviceability in EVA context. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 1.

---

## 2026-05-03 — Joint count and DOF architecture

**Parameter:** Nominal joint count and DOF allocation for the space humanoid
**Value:** 38 DOF nominal (range 36–40), distributed: neck 3, torso 2, arms 4 DOF each (shoulder 3 + elbow 1), wrists 3 DOF each, hands 10–12 DOF each, hips 3 DOF each, knees 1 DOF each, ankles 2 DOF each
**Set by:** robotics-actuation-structures
**Affects:** robotics-sensing-autonomy (joint state sensing requirements, control loop count), humanoid-systems-architect (mass-power budget — 38-joint allocation feeds actuator mass table), conops-integrator (task capability envelope), fault-management-sustainment (joint failure mode catalog)
**Basis:** Calibrated against R2 42-DOF torso+arm+hand heritage (ISS-deployed task set) and Valkyrie 44-DOF space-intent design. Reduction to 38 by cutting torso DOF from 3 to 2 and reducing hand DOF to minimum sufficient for EVA tool grasp per R2 design intent. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 2.

---

## 2026-05-03 — Structure + actuation mass allocation

**Parameter:** Structure and actuation mass design-to target
**Value:** 30.0 kg design-to / 39.0 kg NTE (30% margin) for primary structure + actuation + joints/sealing + end-effectors combined. This is 40% of the 75 kg total system design-to mass.
**Set by:** robotics-actuation-structures
**Affects:** humanoid-systems-architect (mass-power budget section must close remaining 45 kg design-to across sensors, compute, power, thermal, consumables, fluid lines), destinations-trajectories (lander manifest assumes 75 kg / 97.5 kg NTE total system), cost-program
**Basis:** Parametric breakdown: primary structure 8.5 kg (CFRP + Al hybrid), actuation 13.0 kg (38 joints × ~340 g mean), joints/seals 4.0 kg, end-effectors 4.5 kg = 30.0 kg total. See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 4.

---

## 2026-05-03 — Dust mitigation primary strategy

**Parameter:** Primary dust mitigation approach for joint architecture
**Value:** Dual-stage labyrinth + single elastomeric lip seal (perfluoroelastomer, FFKM-class) for all load-bearing joints; disposable Vectran/Zylon boot covers for foot/ankle assemblies at 500-hour parametric replacement interval
**Set by:** robotics-actuation-structures
**Affects:** space-environments (FFKM cryogenic validation program; TRL 3 → TRL 5 required by 2029 gate), fault-management-sustainment (boot cover consumables manifest and replacement procedure), far-side-base-architect (consumables resupply manifest for boot covers), technology-roadmap-trl (seal material development on critical path)
**Basis:** Labyrinth seals have TRL 7–8 in terrestrial contaminated industrial environments. FFKM elastomers have ISS heritage in fluid line connectors at −60°C to +200°C; extension to −180°C is a development item at TRL 4. Active gas purge rejected (continuous supply dependency). Graceful degradation rejected (permanent base multi-year horizon). See `study/01-optimal-space-humanoid/03-actuation-structures.md` Section 3.
