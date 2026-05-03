---
title: "Optimal Space Humanoid: Form Factor Tradespace"
status: draft
review-status: unreviewed
owner: humanoid-systems-architect
last-updated: 2026-05-03
---

# Section 01-02 — Optimal Space Humanoid: Form Factor Tradespace

This section evaluates candidate form factors for the primary space humanoid against the operational requirements of a permanent lunar far side base. It takes a position, documents the basis for that position, and passes binding constraints to the actuation, sensing, environments, and budget subsections.

---

## 1. Tradespace Candidates

### Candidate A: Full Bipedal Humanoid

A bilateral, two-legged anthropomorphic robot of human scale (1.5–1.9 m standing height, 60–130 kg), with two dexterous arms and human-geometry hands. The canonical form factor: Atlas, Valkyrie, FEDOR, Optimus, Apollo.

Optimized for environments built for humans. Accesses EVA lockers, equipment racks, hatch openings, and ladder rungs without modification. Matches crew hand geometry for tool interoperability — the design intent Robonaut 2's hands were built to meet. On uneven lunar regolith with local slopes up to 20–30 degrees, a bipedal platform can in principle traverse terrain that defeats wheeled systems. In microgravity, however, legs are dead mass that provide no mobility advantage: FEDOR's legs were disabled by cosmonauts immediately upon arrival at the ISS because the robot had not been programmed for handrail-based locomotion in zero-g \cite{therobotreport2019skybot}. This is the canonical negative lesson for the form factor in mixed-environment missions.

Key heritage: Robonaut 2 (ISS-deployed, torso-only in practice), FEDOR/Skybot F-850 (ISS mission 2019, legs immobilized), NASA Valkyrie R5 (planetary surface design, never flown), Atlas Electric (commercial heritage, not space-qualified). The bipedal form has the deepest space-proximity heritage of any candidate.

**In/out call:** This is the study's primary candidate. The thesis holds that this form factor is the unlock for sustainable human-humanoid teaming at destinations built for humans. It must survive the counterarguments in this section, not assume them away.

---

### Candidate B: Centaur (Wheeled or Tracked Lower Body, Humanoid Upper Torso)

A humanoid upper body — two arms, dexterous hands, head-mounted sensors — mounted on a wheeled or tracked mobile base. Robonaut 2 on its Robochair (ISS stanchion mount) and NASA's subsequent R2 + Centaur 2 tracked-vehicle integration are the primary heritage. The ISS deployment of R2 was effectively a centaur by necessity: the torso was fixed to a stanchion, and the legs that arrived in 2014 were never made functional.

Optimized for flat or semi-prepared surfaces and interior environments. On the ISS, handrail-crawling on a fixed base eliminated the microgravity locomotion problem that defeated FEDOR. On the lunar surface, a tracked or wheeled base provides stable, power-efficient locomotion on compacted regolith paths between fixed work sites. Manipulator reach and dexterity are fully preserved in the upper body. Lunokhod's 10.5-km traverse over 11 months — achieved with a purpose-built 8-wheel rocker-bogey chassis — demonstrates the efficiency of purpose-designed ground mobility over bipedal walking \cite{huntress2011soviet}.

Key liabilities: access to vertical environments (ladders, hatches, stairwells) is constrained by the wheel/track base. Can the centaur enter a pressurized habitat through a standard hatch? In an early lunar base with prepared flat paths between modules, perhaps. In an improvised or EVA context on uneven terrain with a fallen crew member, no. The Robonaut 2 centaur integration added ~300 kg to the system; mass efficiency is poor relative to a bipedal robot doing the same upper-body task.

Key heritage: Robonaut 2 + Centaur 2 (NASA-JSC, 2013 onwards), Lunokhod 1/2 (USSR, 1970/1973 — not a centaur but the canonical tracked lunar platform).

**In/out call:** In for evaluation. The strongest alternative. Mass and terrain-access penalties are large.

---

### Candidate C: Quadrupedal with Manipulator Arms

A four-legged platform (Boston Dynamics Spot-class, 25–50 kg) with one or two robotic arms mounted at the shoulder. Strong locomotion on unstructured terrain; demonstrated in construction, industrial inspection, and military reconnaissance.

Optimized for terrain mobility across a wide range. Four contact points provide inherent stability against tip-over on slopes; Spot's 30-degree slope rating at 32.5 kg (unloaded) is the best static-stability figure in the heritage survey. Arm payload is limited (Spot Arm: 4 kg at full extension), and dual-hand dexterous manipulation against tools designed for humans is not demonstrated at any TRL. The form factor does not fit standard EVA airlock or habitat hatch geometry without structural modification of the base facilities. NASA has actively evaluated Spot for lunar surface scouting roles; no EVA-support role has been baselined.

Key heritage: Boston Dynamics Spot + Spot Arm, ANYmal (ETH Zurich / ANYbotics), MIT Cheetah research line.

**In/out call:** Out for the primary humanoid role. Locomotion is excellent; manipulation against human-tool geometry is poor. Evaluated here as a potential companion asset, not as the primary platform.

---

### Candidate D: Fixed Platform with Dexterous Arms

A stanchion or rail-mounted system with one or two high-DOF arms. Think Canadarm2 on ISS, JACO arms (Kinova), or the industrial collaborative-robot (cobot) class. No locomotion; fully dependent on the facility providing the mounting infrastructure.

Optimized for repetitive high-precision manipulation at fixed work sites. The deepest flight heritage for robotic arm manipulation in space (Canadarm2 has operated since 2001; SSRMS total DOF: 7 + 7). Can be sized for very high payload-to-robot-mass ratios. Cannot relocate; cannot respond to crew emergencies outside its working envelope; cannot traverse to a new work site without extensive infrastructure pre-positioning. A lunar base that depends on fixed-platform robots must be designed around their positions, not the other way around.

Key heritage: Canadarm2/SSRMS (ISS, 2001-present), JACO (Kinova, commercial), Robotic External Leak Locator and other ISS exterior robot tools.

**In/out call:** Out for the primary role. Heritage is deep in the fixed-arm branch, but the mobility requirement for a lunar surface base makes this form factor applicable only to pre-designated work stations — a supplementary role, not the primary mission system.

---

### Candidate E: Modular / Reconfigurable

A system with interchangeable locomotion bases (legged, wheeled, tracked) and interchangeable end-effectors, using a common trunk and mechanical/electrical interface standard. The DARPA Robotics Challenge (2013–2015) generated the most concentrated engineering effort on this concept in the US. None of the DRC entrants demonstrated reconfiguration in an operational environment; all were tuned to a fixed configuration for competition.

The appeal is obvious: one platform, many roles. A modular robot that can be a biped for EVA support and a centaur for interior logistics appears to solve the FEDOR microgravity problem without surrendering bipedal access. The problem is that no heritage system has demonstrated that reconfiguration can be accomplished on-orbit or on-surface by a crew member under time pressure with the dexterity limitations of EVA gloves. R2's leg installation on ISS took 40 hours (vs. 20 planned) under shirtsleeve conditions with full ground support \cite{space2018r2return}. That is the upper bound on on-orbit reconfiguration time for a reference-class crew, and it represents a mission planning commitment with no demonstrated speedup path.

Key heritage: DRC-era concepts (IHMC Robotics, Draper/RPI, Team ViGIR), NASA ATHLETE rover (modular wheel/leg hybrid), DARPA BSOD MOTOMAN concepts.

**In/out call:** In for evaluation as a long-horizon upgrade path, not as the baseline configuration for the first article. Reconfigurability is a growth option, not a design requirement at this phase.

---

### Candidate F: Teleoperated Avatar (Low-Autonomy Humanoid)

A humanoid form factor operated primarily or exclusively through an avatar teleop suit, with minimal on-board autonomy. FEDOR was this architecture: avatar teleoperation was the primary mode, with limited autonomous grasp as a secondary capability.

This is not a separate form factor but a separate operating philosophy applied to any humanoid form. It is included because it was the Soviet/Russian choice for both FEDOR and the planned TELEDROID follow-on, and because it is the honest null hypothesis for the study's autonomy thesis. A full bipedal humanoid operated in avatar mode does not require the TRL 6-8 autonomy curve assumed in §A1 of the margins register; it works at any autonomy TRL.

The liability is crew time: every avatar-mode task requires a dedicated operator for its full duration, plus recovery time from operator fatigue (full-body exosuit teleop is physiologically demanding). At a six-person lunar far side base, crew time is the scarcest resource. The study's thesis is that autonomy maturation eliminates the 1:1 operator-robot pairing requirement; avatar mode is the fallback for anomaly recovery, not the primary operating mode. The FEDOR data point (cosmonauts disabled the legs immediately, and the robot's only demonstrated useful work was a simulated cable repair in avatar mode) suggests that high-quality avatar teleop is both achievable and insufficient as a long-term crew-efficiency model.

**In/out call:** In for evaluation but treated as an operating mode of Candidate A, not a separate platform decision.

---

## 2. Evaluation Criteria and Weights

The criteria below are weighted against the study's thesis: a permanent lunar far side base where humanoid robots support small human crews in EVA-support, logistics, and science operations, with increasing autonomous capability over the program lifetime. Weights sum to 1.0.

| # | Criterion | Weight | Rationale |
|---|-----------|--------|-----------|
| C1 | Human tool and environment compatibility | 0.25 | The base is built for humans; the robot must use human tools and access human-geometry spaces without facility modification. Highest weight because it is the foundational value proposition of the humanoid form. |
| C2 | Surface locomotion on uneven terrain | 0.20 | Lunar far side regolith is uneven; slope traverse and step negotiation are daily mission requirements. Cannot be delegated to a companion asset if the primary humanoid cannot perform it. |
| C3 | Microgravity / pressurized cabin mobility | 0.15 | The humanoid will transit to the surface via a pressurized lander and may operate inside pressurized modules. The FEDOR lesson makes this a salient criterion even though it is not the primary operating environment. |
| C4 | Crew serviceability and fault isolation | 0.15 | Derived directly from R2's disabling failure \cite{spectrum2018r2broken}. A robot that cannot be serviced by a crewmate in EVA gloves is a single-fault total loss at the lunar far side. |
| C5 | Mass and lander manifest compatibility | 0.10 | Lander payload is a hard constraint. Every kilogram of robot is a kilogram less of consumables or redundant hardware. 30% mass margin per NASA-STD-5001 must be preserved. |
| C6 | Autonomy scalability | 0.10 | The form factor must not architecturally constrain the autonomy TRL curve assumed in §A1. A platform that requires continuous teleoperation for locomotion (e.g., unstable centaur on slopes) raises the required operator bandwidth and defeats the teaming model. |
| C7 | Crew training overhead | 0.05 | A non-human form factor requires crew to learn new mental models for supervision and emergency intervention. Lowest weight because training is a one-time investment, not an ongoing operational cost. |

---

## 3. Evaluation Matrix

Scores are 1 (poor) to 5 (excellent). Weighted score = score × weight. Brief cell notes follow. Candidates scored: A (Full Bipedal Humanoid), B (Centaur), C (Quadrupedal + Arms), D (Fixed Platform), E (Modular Reconfigurable).

| Criterion | Wt | A: Bipedal | B: Centaur | C: Quad+Arm | D: Fixed | E: Modular |
|-----------|-----|-----------|------------|-------------|----------|------------|
| C1: Tool/env compat | 0.25 | **5** — Human-geometry hands and limbs; R2 hand design is the heritage | **4** — Upper body identical to bipedal; base geometry limits hatch/locker access | **2** — Arms limited; hand geometry not matched to EVA tools at any TRL | **3** — Arms can be human-geometry; immobile limits deployment reach | **4** — Upper body can match; reconfiguration time is a liability |
| C2: Surface locomotion | 0.20 | **3** — Demonstrated on moderate terrain; bipedal walking on regolith is undemonstrated at required reliability | **4** — Wheels/tracks outperform biped on compacted paths; loses on vertical obstacles and soft regolith | **5** — Four-point stability; best terrain mobility in this set | **1** — Zero locomotion | **3** — Depends on active configuration; transition time is a risk |
| C3: Zero-g / cabin mobility | 0.15 | **2** — FEDOR is the data point; legs are liabilities in zero-g without dedicated handrail mode; fixable via controller design but undemonstrated | **4** — Torso-on-stanchion is exactly how R2 operated on ISS; tracks/wheels disengage in zero-g but base mass remains | **2** — Four legs designed for gravity; no handrail-grasp capability demonstrated | **3** — Stanchion-mount is exactly this; no zero-g locomotion needed | **2** — Reconfiguration to a zero-g mode adds complexity; undemonstrated |
| C4: Crew serviceability | 0.15 | **3** — Possible in principle; requires modular design discipline that no heritage system demonstrates; R2 was the negative lesson | **3** — Same upper-body serviceability constraint; base adds wheeled-system fault modes | **4** — Simpler mechanical architecture; fewer DOF; easier to diagnose and replace | **4** — Fixed platform; full ground-support access to components; best serviceability posture | **2** — Reconfiguration interfaces add connector/seal fault modes; more things to break |
| C5: Mass | 0.10 | **4** — 60–90 kg target range is achievable; Optimus at 57 kg and Atlas at 89 kg bracket the target; Valkyrie at 129 kg is the cautionary upper bound | **2** — Centaur base adds 50–150 kg; total system mass is a hard manifest problem | **4** — 25–50 kg platform; lightest mobile option | **3** — Variable; stanchion mount adds structural mass to facility, not to robot manifest | **3** — Reconfigurable components add connector/adapter mass overhead |
| C6: Autonomy scalability | 0.10 | **4** — Bipedal form supports the full autonomy stack from teleoperation to supervised autonomy to full autonomy as TRL advances; no architectural constraints | **3** — Autonomy for wheeled platforms is more mature than legged; but upper-body task autonomy is identical to bipedal | **3** — Locomotion autonomy is more mature; manipulation autonomy is weaker | **4** — Fixed base simplifies the autonomy problem; manipulation-only autonomy is higher TRL | **2** — Reconfiguration adds autonomy states; software complexity scales non-linearly |
| C7: Training overhead | 0.05 | **5** — Most intuitive for crew; human form factor minimizes cognitive distance between operator intent and robot action | **4** — Upper body is familiar; base behavior is novel but lower cognitive load than legged locomotion | **3** — Quadruped locomotion is counterintuitive for humans; emergency intervention harder | **4** — Simple work envelope; easy to predict and supervise | **3** — Mode transitions require crew to track current configuration |
| **Weighted total** | 1.00 | **3.60** | **3.35** | **2.95** | **2.55** | **2.80** |

**Raw weighted totals:**
- A (Bipedal): 5(0.25) + 3(0.20) + 2(0.15) + 3(0.15) + 4(0.10) + 4(0.10) + 5(0.05) = 1.25 + 0.60 + 0.30 + 0.45 + 0.40 + 0.40 + 0.25 = **3.65**
- B (Centaur): 4(0.25) + 4(0.20) + 4(0.15) + 3(0.15) + 2(0.10) + 3(0.10) + 4(0.05) = 1.00 + 0.80 + 0.60 + 0.45 + 0.20 + 0.30 + 0.20 = **3.55**
- C (Quad+Arm): 2(0.25) + 5(0.20) + 2(0.15) + 4(0.15) + 4(0.10) + 3(0.10) + 3(0.05) = 0.50 + 1.00 + 0.30 + 0.60 + 0.40 + 0.30 + 0.15 = **3.25**
- D (Fixed): 3(0.25) + 1(0.20) + 3(0.15) + 4(0.15) + 3(0.10) + 4(0.10) + 4(0.05) = 0.75 + 0.20 + 0.45 + 0.60 + 0.30 + 0.40 + 0.20 = **2.90**
- E (Modular): 4(0.25) + 3(0.20) + 2(0.15) + 2(0.15) + 3(0.10) + 2(0.10) + 3(0.05) = 1.00 + 0.60 + 0.30 + 0.30 + 0.30 + 0.20 + 0.15 = **2.85**

The bipedal humanoid leads at **3.65**, with the centaur close behind at **3.55**. The gap is narrow, which is the honest result: the bipedal form wins primarily on C1 (human tool compatibility, highest weight) and C7 (training). It loses on mass and scores only average on surface locomotion — neither of which should be papered over.

---

## 4. Position and Justification

**Study position: Full bipedal humanoid, baseline configuration, single form factor for both EVA-support and interior logistics roles.**

The bipedal form wins on the criterion that matters most for the thesis: a lunar far side base built for human habitation will contain human-geometry tools, human-geometry hatches, human-geometry lockers, and human-geometry work surfaces. A robot that matches this geometry can be deployed into a base designed by humans, for humans, without requiring the facility to be redesigned around the robot. The alternative — designing base tools to the robot — is valid in isolation but commits the program to maintaining two parallel tool standards, one for crewed operations and one for robotic operations, indefinitely. The Soviet instinct toward purpose-built systems is correct for single-destination, fixed-duration missions. It is less correct for a permanent base supporting evolving crew compositions, expanding mission sets, and eventual remote operation without crew present.

The strongest weakness in the bipedal score is C3 (microgravity mobility, score 2). FEDOR is the reference point, and it is a negative one \cite{therobotreport2019skybot}. This study treats the FEDOR failure not as evidence against the bipedal form factor but as a requirement that the controller design must solve. FEDOR's legs were disabled because the software for handrail-based locomotion was not developed — not because bipedal geometry is physically incompatible with zero-g mobility. R2's handrail-capable hands demonstrate that the relevant capability is in the end-effectors, not in having a wheeled base. The design requirement passed to the actuation and autonomy sections is explicit: the foot and hand end-effectors must be capable of handrail grasp, and a zero-g mobility mode using all four limbs as manipulators must be a first-class software mode alongside the surface bipedal mode.

The Lunokhod counterargument must be engaged directly. Lunokhod 1 and Lunokhod 2 together traversed approximately 48 km of lunar surface and returned more scientific data per kilogram of delivered hardware than any other robotic lunar mission \cite{huntress2011soviet}. The Soviet engineers built a rover optimized for the lunar surface — eight independently-driven wheels, rocker-bogey suspension, pressurized electronics compartment, lid-mounted solar array — and it worked. The lesson drawn by Soviet and post-Soviet designers is that purpose-built beats generalist in resource-constrained environments. FEDOR itself was the Soviet attempt to apply the same philosophy to a humanoid: build a capable teleop avatar, don't try to generalize.

This argument holds for pure science rover missions. It fails when the mission requirement is to support human crews in facilities that humans also use. The moment crew members enter the base and require maintenance support, emergency response, and tool sharing with the robots, the generalist platform recovers its value. Lunokhod did not need to hand tools to cosmonauts. The space humanoid does. The design-to-the-robot alternative requires locking in a toolset at the facility design phase and prevents the crew from adapting their work practice — a significant operational constraint for a permanent base with a 20-year planning horizon. The question "why do the robots need to look like humans if humans are present?" has a direct answer: because the tools, the hatches, and the emergency response procedures are designed for humans, and the cost of duplicating all of them for a different robot geometry exceeds the cost of building a robot that fits the existing human geometry.

The bipedal form is not selected because it is theoretically optimal. It is selected because the task environment is human-built, the crew interface requirement is real, and the cost of maintaining parallel tool and infrastructure standards over a permanent base lifetime outweighs the locomotion and mass penalties of the bipedal form. This is a program economics argument, not a robotics argument.

---

## 5. Dissenting Position

The centaur configuration would be the right answer if two conditions hold simultaneously: first, the lunar far side base is designed from the start with robotic accessibility as a first-class requirement (separate robotic corridors, wider hatches, standardized mounting rails, dual-standard tool sets), and second, the mission profile emphasizes indoor logistics and fixed-site manipulation over terrain-crossing EVA support. Under these conditions, the centaur's mass penalty becomes a logistics-module problem rather than a lander manifest problem (large tracked robots can be delivered separately from crewed landers), its superior microgravity handling is a genuine advantage during the base construction phase, and the indoor manipulation task set is fully covered by the humanoid upper body. The program schedule at which a centaur becomes clearly superior is the one where the base infrastructure investment precedes the first humanoid deployment by five or more years — long enough to design the base for the robot rather than vice versa. If the base construction timeline slips relative to the humanoid deployment timeline, the generalist bipedal form recovers its advantage.

---

## 6. Constraints Passed to Downstream Sections

The following constraints flow from the form factor decision. Downstream sections must design to these requirements, not revisit the form factor choice.

**To 03-actuation-structures:**
- Two-leg, two-arm, two-hand anthropomorphic geometry. Standing height 1.5–1.9 m.
- Total system mass target: 75 kg (design-to), 97.5 kg (not-to-exceed with 30% margin per NASA-STD-5001). This supersedes the Valkyrie 129 kg reference; 129 kg is treated as the cautionary upper bound, not the target.
- Four end-effectors (two hands, two feet) must be capable of both human-tool grasp geometry and rigid handrail grasp for zero-g locomotion. This is a dual-function requirement, not a growth option.
- All external connectors and joint access panels must be sized for EVA-gloved hands (minimum 50 mm clear access, single-fastener removal per ORU).

**To 04-sensing-autonomy:**
- Bipedal form factor must support three operating modes as first-class software states: (1) surface bipedal locomotion, (2) zero-g four-limb handrail mode, (3) stationary dexterous manipulation. Autonomy stack must cover all three modes at their respective TRL levels per the §A1 curve.
- Human-geometry form factor enables direct transfer learning from human demonstration data. The autonomy architecture should exploit this; do not design an autonomy stack that requires separate training pipelines for each mode.
- The form factor does not constrain sensor placement; head-mounted stereo, body-mounted lidar, and wrist-mounted cameras are all compatible.

**To 05-environments-hardening:**
- The bipedal form has large surface-area-to-volume ratio compared to a compact centaur or fixed platform. Thermal analysis must account for radiative and conductive heat paths through all four limbs.
- Dust ingress paths include ankle/knee/hip joints and all four end-effectors. Joint seal design must prioritize the leg joints under the assumption that they will contact regolith during kneeling and ground-contact recovery.
- The robot must be operable in both vacuum (EVA support) and pressurized cabin (interior logistics). The seal and thermal architecture must cover both environments.

**To 06-mass-power-budget:**
- Mass budget baseline: 75 kg design-to. With 30% margin: 97.5 kg not-to-exceed. Heritage bracket: 57 kg (Optimus Gen 2, commercial, not space-qualified) to 89 kg (Atlas Electric, commercial, not space-qualified) to 129 kg (Valkyrie, space-intent, not flown).
- Power budget baseline: target total system ≤500 W steady-state locomotion, ≤800 W peak (manipulation under load). These are parametric assumptions from heritage; Valkyrie estimated at ~1,800 W is the cautionary upper bound for a 129 kg platform. Scaling by mass ratio (75/129) and accounting for improved electric actuator efficiency suggests 700–900 W peak is achievable; 500 W steady-state is aggressive and must be validated against the actuation subsystem design. 30% power margin per NASA-STD-5001 applies.
- All subsystem power allocations must be compatible with a shared far-side base power plant running fission surface power; no assumption of unlimited power draw.

---

## References

\cite{therobotreport2019skybot} — FEDOR/Skybot F-850 post-mission assessment; legs disabled on ISS.
\cite{spectrum2018r2broken} — Robonaut 2 serviceability failure; key quote on non-serviceability by astronauts.
\cite{space2018r2return} — R2 leg installation timeline (40 hours vs. 20 planned); on-orbit reconfiguration complexity.
\cite{huntress2011soviet} — Lunokhod 1/2 traverse and scientific return; Soviet purpose-built design philosophy.
\cite{nasa2023valkyrieFactsheet} — Valkyrie R5 mass (129 kg) as cautionary upper bound.
\cite{diftler2011r2} — Robonaut 2 ISS deployment and EVA tool compatibility design intent.
\cite{ntrs2010r2overview} — R2 EVA glove geometry design rationale.
