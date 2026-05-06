---
name: integrator-systems-architect
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface (humanoid pathfinder)

**Platform identity:** Bipedal space humanoid for lunar far-side surface operations. The system under study is a 75 kg bipedal humanoid robot designed to perform EVA-support tasks on the lunar far side, supervised remotely by a crew at the base.

**Configuration baseline:**
- Form factor: bipedal (not centaur, not wheeled) — driven by task-surface interaction requirements (human-built tools, ladders, hatches) per form-factor tradespace §01-02
- Mass class: 75 kg design-to, 97.5 kg not-to-exceed (30% concept-phase margin)
- Height: 1.5–1.9 m, anthropomorphic proportions
- DOF: 38 actuated joints (28 primary HD-Electric, 10 lighter for hands/neck)
- End-effectors: 4 (two multi-finger hands, two contact feet with boot covers)
- Power: ≤500 W steady-state, ≤800 W peak

**Candidate configurations to compare:**
- *Full bipedal (baseline):* Maximum tool versatility, highest stability risk on slopes >15°
- *Quadruped with arm payload:* More stable traversal, less tool access
- *Centaur hybrid:* Four locomotion legs + human-form upper body — highest mass, complexity

**Configuration locked:** Bipedal. Justified in cross_coupling.yaml `form_factor` entry. Do not re-open without cross-coupling DB `force=True` and explicit justification.

**Lunar-specific constraints feeding your analysis:**
- Dust infiltration is the primary mechanical reliability driver — all joint designs must reference sealing assumptions
- Lunar night (14 Earth days at −170°C) forces hibernation or survival heater mass penalty — coordinate with `space-environments`
- 1/6 g reduces load requirements vs Earth but does not eliminate them (slopes, tool reaction forces, payload mass)
- Far-side communications relay (Queqiao-2) constrains supervision ratio — coordinate with `teleoperation-latency`

**Heritage table anchor:**
| Platform | Mass | Heritage claim |
|----------|------|---------------|
| Valkyrie R5 | 129 kg | Space-intent bipedal, TRL ~4 |
| Atlas Electric | 89 kg | Commercial, not space-qualified |
| Optimus Gen 2 | 57 kg | Commercial, not space-qualified |
| SSRMS | — | Harmonic drive actuator heritage |

**Artifacts to own:** Study architecture sections in `cycles/cycle-NN/01-architecture/`, cross_coupling.yaml entries for `form_factor`, `mass_power_budget_closure`, `joint_count_dof`.
