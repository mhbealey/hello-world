---
title: "Optimal Space Humanoid: Sensing and Autonomy"
status: draft
review-status: unreviewed
owner: robotics-sensing-autonomy
last-updated: 2026-05-03
---

# Section 01-04 — Optimal Space Humanoid: Sensing and Autonomy

This section defines the sensor suite and autonomy architecture for the bipedal space humanoid established in Sections 01-02 and 01-03. It designs to the constraints passed by those sections: 75 kg design-to total system mass (97.5 kg NTE), 800 W peak / 500 W steady-state power, and three first-class operating modes (surface bipedal locomotion, zero-g four-limb handrail mode, stationary dexterous manipulation). The most important constraint comes from the operational environment: cloud-connected inference is architecturally infeasible on the lunar far side, and the study's §A1 autonomy curve (TRL 6 by 2029, TRL 7+ by 2035, TRL 8 by 2038-2040) sets hard gates for what the system must deliver and when. Positions taken here are honest about what the heritage supports and what it does not.

---

## 1. Sensor Suite

The sensor suite defines what the robot knows about itself and its environment. Six categories are required; two additional categories are conditional.

### Stereo Vision and Depth Perception

Every modern operational humanoid uses a head-mounted stereo RGB pair combined with active depth sensing — structured light or time-of-flight (ToF) — for near-field manipulation and obstacle avoidance. Figure 02 uses dual NVIDIA vision systems with on-board inference \cite{figureai2024figure02}; Valkyrie uses a Carnegie Robotics MultiSense SL unit providing stereo RGB, stereo monochrome, and structured-light depth in a single head-mounted assembly \cite{nasa2023valkyrieFactsheet}; Robonaut 2 used stereo cameras plus infrared depth in its head unit \cite{diftler2011r2}. This heritage is deep and consistent.

The space-specific problem is illumination. On the lunar surface, the sun is at 0–15 degrees elevation relative to the local horizon for much of the mission duration at the far side base site, producing extreme contrast: surfaces in direct sun are at +130°C and saturate unfiltered sensors, while shadows are in total optical darkness (no atmosphere to scatter light). Structured-light active depth fails in bright unfiltered sunlight — the projected pattern is overwhelmed. The mitigation is a two-channel approach: passive stereo with high-dynamic-range (HDR) imaging for outdoor locomotion, and active ToF or structured-light depth activated only in shadow or indoor contexts where ambient light does not saturate the sensor. This requires HDR cameras with a dynamic range of at least 120 dB, compared to the 60-80 dB of consumer and industrial cameras. High-dynamic-range machine vision cameras with space-qualified lenses exist at TRL 5-6 in the terrestrial sensor market; the qualification delta for vacuum and radiation is a development item.

Additional wrist-mounted cameras (one per hand) are required for close-range manipulation monitoring — a configuration R2 used and that is well-established in dexterous robot arms. These are simpler sensors (mono or stereo RGB, no depth required at wrist range) and present no novel heritage challenge. They are baselined but not the primary locomotion sensor.

**Sensor allocation (stereo vision):** head-mounted stereo HDR camera pair + ToF depth unit (dual-mode), plus two wrist-mounted RGB cameras. Estimated mass: 0.8 kg total. Estimated steady-state power: 15–25 W.

### Inertial Measurement

IMUs are universal in bipedal robots — no heritage system omits them. The IMU provides body attitude, angular rate, linear acceleration, and the state estimates the locomotion controller requires to maintain balance across all three operating modes. Digit uses MEMS IMUs; Valkyrie uses MEMS IMUs; essentially all commercial bipeds use off-the-shelf MEMS IMU packages (e.g., VectorNav VN-200 class) \cite{agility2024digit}.

The space-specific problem is radiation. MEMS IMUs use polysilicon microfabricated structures that are susceptible to total ionizing dose (TID) effects. At the lunar far side, the TID environment without magnetospheric shielding runs approximately 10-100 mrad/day depending on solar weather. A commercial MEMS IMU with a TID threshold of 3-10 krad (typical) would accumulate damaging dose in weeks to months of unshielded operation. The mitigation is either radiation-hardened MEMS IMUs (available at TRL 5-6 from vendors such as Systron Donner or Northrop Grumman LITEF, at 3-5× the mass and cost of commercial equivalents) or modest local shielding (2-4 mm of aluminum or tantalum spot-shielding around the IMU package, adding ~50-100 g per unit). This study positions local spot-shielding of a commercial-grade IMU as the primary approach for the first article, with a fallback to rad-hard MEMS if TID testing at the 2029 gate shows unacceptable degradation. The IMU is a small, replaceable component — it qualifies as an ORU — and periodic replacement on a 1-2 year interval is a credible alternative to full radiation hardening if shielding proves insufficient.

Multiple IMU units (minimum two, preferably three) are required for fault detection and redundancy. A single IMU failure in a bipedal locomotion context is a safety-of-crew event if it causes loss of balance estimation.

**Sensor allocation (IMU):** three-unit redundant MEMS IMU set with spot shielding, body-mounted in torso. Estimated mass: 0.3 kg. Estimated steady-state power: 3-5 W.

### Tactile and Force-Torque Sensing

Robonaut 2 is the heritage anchor here: 350+ sensors including tactile arrays in the fingertips, wrists, and forearm surfaces \cite{nasa2016r2factsheet}. This sensor density was explicitly designed for safe contact with crew and for tool grasp feedback in EVA contexts — directly applicable to this mission. Without tactile feedback, a dexterous robot grasping an EVA tool in the presence of a suited crew member has no way to detect inadvertent contact with crew limbs and cannot modulate grasp force to avoid tool damage or slippage.

Force-torque (F/T) sensors at the wrist joints are required for any impedance-controlled manipulation task: they provide the wrist-level force/torque measurements the controller uses to detect contact, assess reaction forces from tools, and prevent joint overload. Valkyrie includes F/T sensing at the wrists \cite{radford2015valkyrie}. Current commercial F/T sensors (ATI Mini45, Sunrise Instruments) are available at TRL 7-8; space qualification of the electronics and strain gauge bond integrity in the thermal cycling range is a development item at TRL 5.

Tactile finger arrays at the density R2 demonstrated are approaching TRL 5-6 in commercial robotic hands (SynTouch BioTac, Xela Robotics sensor skins). The space qualification of flexible tactile sensor skins is at TRL 3-4: the flexible substrate materials and interconnect routing must survive the thermal cycling and vacuum outgassing requirements that will be validated by the space-environments agent. This is an identified TRL gap.

**Sensor allocation (tactile/F-T):** six-axis F/T sensors at each wrist (two units), tactile arrays in fingertip pads of each hand (distributed across 10-12 fingers). Estimated mass: 0.4 kg. Estimated steady-state power: 4-6 W.

### LIDAR and Point Cloud

For terrain navigation at ranges beyond 2-3 m, passive stereo vision degrades on low-texture surfaces — and lunar regolith is among the lowest-texture surfaces in the solar system (uniform gray, minimal albedo variation). Survey-quality LIDAR providing dense point clouds at 5-30 m range is required for safe locomotion path planning, hazard detection, and localizing the robot within a base map. This is also the primary sensing modality for the three-dimensional terrain reconstruction that enables the deliberative path planner to reason about slope, obstacle clearance, and footing quality ahead of the robot.

The closest heritage is not humanoid robotics but Mars surface operations. Perseverance carries LIDAR as part of its SHERLOC instrument and uses stereo cameras for near-field hazard detection; the Autonomous Navigation (AutoNav) system on Curiosity and Perseverance uses stereo camera-derived point clouds for traverse planning at speeds up to 0.045 m/s \cite{ono2018msl}. A bipedal humanoid with a target walking speed of 1.0-1.5 m/s requires a faster update rate than Mars rover AutoNav, but the fundamental point-cloud-based terrain assessment model is directly applicable heritage.

Solid-state LIDAR (e.g., Luminar Iris, Hesai AT128 class) is available commercially at 10-30 W power draw and 0.3-0.8 kg. This power budget is significant within the 500 W steady-state envelope: LIDAR alone represents 2-6% of steady-state power. It is not optional for outdoor locomotion, but it should be duty-cycled (active during locomotion, standby during stationary manipulation) to manage average power. Radiation hardening of solid-state LIDAR (which uses SPAD arrays or avalanche photodiodes susceptible to single-event effects) is at TRL 4; this is a shared TRL gap with the IMU radiation issue and should be addressed in the same radiation qualification program.

**Sensor allocation (LIDAR):** one solid-state LIDAR unit, torso or head-mounted, 360-degree azimuthal FOV or hemispheric FOV with duty cycling. Estimated mass: 0.5 kg. Estimated steady-state power (active): 20-30 W (duty cycle to ~10 W average during mixed operations).

### Joint State Sensing

Joint encoders (position), torque sensors, and temperature sensors are required at all 38 joints. This is infrastructure, not a novel sensor choice: every operational humanoid carries it. The actuation section already carries these within the joint hardware mass allocation. They are noted here because the sensing architecture must account for their data bandwidth — 38 joints at 1 kHz sampling of position, velocity, torque, and temperature generates approximately 600 kbps of joint-state data continuously, which the onboard compute must process in real time without drop-outs.

### Conditional: Thermal and Radiometric Sensing

Thermal infrared imaging (8-14 µm wavelength) provides surface temperature mapping — relevant for detecting ice or volatiles in permanently shadowed regions (PSRs), identifying hotspots in machinery, and monitoring crew EVA suit surface temperatures during close-contact operations. This is a secondary science and situational awareness sensor, not required for locomotion or manipulation baseline functionality.

It is listed here as a growth provision: thermal imaging arrays are available at TRL 6-7 (FLIR Lepton-class microbolometers) at low power (1-3 W) and low mass (50-100 g). Adding it costs very little in mass and power. Its absence from the baseline budget does not close any trade; its presence adds PSR reconnaissance capability that the science objectives in Section 03 will likely require. Baselined as optional; coordinated with the conops-integrator agent.

### Sensor Suite Summary

| Sensor category | Units | Mass (kg) | Steady-state power (W) | TRL (terrestrial) | Space TRL gap |
|---|---|---|---|---|---|
| Stereo HDR camera + ToF depth (head) | 1 stereo pair + 1 ToF | 0.8 | 15-25 | 6-7 | HDR outdoor + vacuum qualification: TRL 4-5 |
| Wrist cameras (RGB mono) | 2 | 0.15 | 3-5 | 8 | Vacuum/thermal qual: TRL 5-6 |
| IMU (3-unit redundant) | 3 | 0.3 | 3-5 | 8 | Radiation TID under unshielded lunar conditions: TRL 4-5 with spot shielding mitigation |
| Wrist F/T sensors | 2 | 0.25 | 4-6 | 7-8 | Thermal cycling bond integrity: TRL 5 |
| Fingertip tactile arrays | 10-12 (distributed) | 0.15 | 2-4 | 4-5 | Flexible substrate vacuum/thermal cycling: TRL 3-4 |
| Solid-state LIDAR | 1 | 0.5 | 10-30 (duty cycled) | 7 | Radiation (SPAD) hardening: TRL 4 |
| **Total sensor suite** | — | **~2.1 kg** | **~37-75 W peak** | — | — |

The 2.1 kg sensor suite mass is less than 3% of the 75 kg design-to total system mass. Sensor power at peak (75 W) represents ~9% of steady-state power budget. Both figures are modest within system margins; the sensors are not the mass or power driver. The TRL gaps in the space-specific column represent the sensing subsystem's contribution to the 2029 program gate.

This sensor mass estimate feeds the mass-power budget section (01-06) and must be reconciled against the structure + actuation allocation of 30.0 kg design-to, leaving 45.0 kg for sensors, compute, power, thermal, and consumables.

---

## 2. Onboard Compute Architecture

### The Fundamental Constraint

The lunar far side has no direct line-of-sight to Earth. All communication passes through the Queqiao-2 relay satellite (operational as of 2024) or successors, with minimum relay round-trip latency of approximately 2.6 seconds at the most favorable orbital geometry and longer during relay outages. Cloud-connected inference — the architecture used by every commercial AI-enabled humanoid today, including Figure 02's VLA model and Optimus's foundation model inference at data center scale — is not available \cite{figureai2024figure02, tesla2023optimus2}. All perception, planning, and control inference must execute onboard, within the 800 W peak power budget and the 2.1 kg sensor-suite-already-allocated mass envelope.

This is the most significant architectural departure from commercial practice. It is not a technology gap that will close naturally as commercial AI matures — it is a fundamental consequence of physics. Every architectural decision downstream must be made with this constraint as primary.

### Two-Tier Compute Architecture

This study takes the position that the onboard compute architecture requires two tiers: a **hardened supervisory processor** and a **commercial inference accelerator** operating under watchdog supervision.

**Tier 1 — Radiation-hardened supervisor processor.** A radiation-hard (RH) processor (VORAGO VA41620, BAE Systems RAD750-class, or equivalent) runs the safety-critical control loops: joint position/velocity/torque control, balance maintenance, collision avoidance, and fault monitoring. These are deterministic, low-latency (< 1 ms cycle time) functions that cannot tolerate single-event upsets (SEUs) causing register corruption. The RAD750 is the canonical space heritage processor — it has flown on Mars Reconnaissance Orbiter, Curiosity, Perseverance, and dozens of other missions. Its clock speed (200-400 MHz) is orders of magnitude slower than commercial AI accelerators, and it runs no machine-learning inference; it runs validated, verified flight software. Power draw: 5-10 W. This tier is always-on.

**Tier 2 — Commercial AI inference accelerator under watchdog.** A commercial edge-AI SoC (NVIDIA Jetson AGX Orin-class, or a successor) runs the perception pipeline, the deliberative planner, the VLA model for task-level reasoning, and the supervisory interface. The Jetson AGX Orin draws 15-60 W at its various power modes \cite{nvidia2023jetson}. It is not radiation-hardened; total ionizing dose and single-event latchup are failure modes. The watchdog architecture has the Tier 1 supervisor monitor the Tier 2 output: if Tier 2 produces commands outside validated envelopes, stops producing output within deadline, or if the supervisor detects a latchup condition, it takes over with safe-mode behaviors (halt motion, alert crew or ground) and issues a power cycle command to reset Tier 2. Single-event latchup in commercial CMOS at the lunar far side is expected at a rate of approximately 1-10 events per day without shielding, based on Perseverance's radiation environment data scaled to humanoid operating temperature. Spot-shielding (5-10 mm aluminum, ~0.5-1.0 kg mass penalty per compute board) reduces latchup rate by 2-3 orders of magnitude at moderate mass cost.

The heritage precedent for this two-tier approach is the Mars Science Laboratory (Curiosity) architecture: the spacecraft computer (RAD750) runs flight-critical operations, while science instruments with their own processors are power-cycled and reset as needed. The same separation of concerns applies here.

**Power allocation for compute within the 800 W system peak budget:**

| Compute element | Mass (kg) | Power (W) | Notes |
|---|---|---|---|
| Tier 1: RH supervisor processor (RAD750-class) | 0.3 | 5-10 | Always on; deterministic control loops |
| Tier 2: Commercial AI accelerator (Jetson AGX Orin-class) | 0.5 | 15-60 | Duty-cycled; watchdog-managed |
| Spot shielding for Tier 2 board | 0.8 | — | Aluminum/tantalum laminate |
| Memory (rad-tolerant SRAM + flash) | 0.2 | 2-5 | Radiation-tolerant COTS with EDAC |
| **Compute total** | **~1.8 kg** | **~22-75 W** | Power range: Tier 2 at low/high performance mode |

The compute allocation (1.8 kg, 22-75 W) is modest in mass but significant in power: at peak, Tier 2 alone can draw 60 W, which is 12% of the steady-state 500 W budget and 7.5% of the 800 W peak budget. This is acceptable, but it means that compute, sensors, and actuation must be budgeted together rather than treated as independent line items. The mass-power budget section (01-06) must carry the full sensor + compute total (~3.9 kg, ~60-150 W peak) as a single envelope.

**Open TRL gap — no equivalent of commercial AI-class performance in a rad-hard package.** As of 2026, there is no radiation-hardened processor that approaches the inference performance (275 TOPS) of the Jetson AGX Orin. The SRAMjet program, BAE Systems' next-generation processors, and DARPA HPSC (High Performance Spaceflight Computing) efforts are moving toward this gap, but TRL is 3-4 for space-relevant AI-inference hardware. This is the compute architecture's primary risk. If a rad-hard AI accelerator at TRL 6 is available by the 2029 gate, the Tier 2 watchdog architecture can be simplified or replaced. If not — and this is the more likely outcome — the watchdog architecture described here is the operational solution through the 2035 first deployment window.

**On-board model size.** Running a 7B-parameter VLA foundation model requires approximately 14 GB of model weights in FP16 precision, which the Jetson AGX Orin (with 64 GB unified memory option) can accommodate. However, the inference latency for a 7B model on Jetson-class hardware is 200-500 ms per query — acceptable for supervisory task-level reasoning but not for reactive control (which runs on Tier 1 at sub-millisecond timescales). The architecture keeps the large VLA model at the supervisory layer, not in the reactive loop. Smaller purpose-trained models (1-3B parameters) are feasible for specific mid-level perception tasks (object recognition, grasp pose estimation) at 50-100 ms latency on the same hardware.

---

## 3. Autonomy Stack

The autonomy stack is the study's core technical risk. Commercial humanoid autonomy is calibrated for structured, near-zero-latency, controlled environments: a BMW factory floor, an Amazon fulfillment center. Lunar surface operations are structurally the opposite: unstructured terrain, unpredictable dust, radiation-induced sensor noise, communication latency that makes ground-in-the-loop for reactive control physically impossible, and no prospect of remote reboot if the robot falls and cannot recover. The honest assessment of each layer's TRL follows.

```
┌─────────────────────────────────────────────────────────┐
│  SUPERVISORY LAYER (goal-setting, crew interface,       │
│  anomaly reporting, task queue management)               │
│  Terrestrial TRL: 3-4  |  Space TRL: 2-3               │
│  Compute: Tier 2 (VLA foundation model)                  │
├─────────────────────────────────────────────────────────┤
│  DELIBERATIVE LAYER (task planning, object recognition,  │
│  manipulation planning, path planning)                   │
│  Terrestrial TRL: 4-5  |  Space TRL: 2-3               │
│  Compute: Tier 2 (smaller inference models)             │
├─────────────────────────────────────────────────────────┤
│  REACTIVE LAYER (balance, collision avoidance,          │
│  fall recovery, joint limit enforcement,                 │
│  safe contact response)                                  │
│  Terrestrial TRL: 6-7  |  Space TRL: 3-4               │
│  Compute: Tier 1 (RH supervisor, deterministic)         │
└─────────────────────────────────────────────────────────┘
```

### Reactive Layer

The reactive layer runs at sub-millisecond timescales and handles the behaviors the robot must execute without deliberation: maintaining balance on uneven terrain, recovering from unexpected contact, enforcing joint position and torque limits, and executing a controlled fall if balance is unrecoverable. This is where Atlas Electric and Unitree H1 have demonstrated the deepest capability — Boston Dynamics' whole-body control and model predictive control (MPC) for balance recovery is the state of the art at approximately TRL 6-7 in terrestrial environments.

Space TRL is honestly 3-4. No bipedal humanoid has demonstrated reactive balance recovery in lunar-analog conditions: 1/6 g, fine loose regolith with unknown bearing capacity, absence of air damping, radiation-induced sensor noise. The 1/6 g case alone is underexplored in hardware — most bipedal locomotion controllers are trained and tested at 1 g. Low-gravity locomotion controllers are in active research as of 2026 but have not been demonstrated on hardware in a representative environment. Dust accumulation on LIDAR and camera optics during locomotion will degrade point cloud quality in ways that the reactive controller's state estimator has not been validated against.

To reach TRL 6 in space-relevant environments by the 2029 gate, the reactive layer needs: (1) hardware testing in a lunar gravity offload facility with representative dust simulant (JSC-1A or NU-LHT-2M) on the ground surface, (2) validation of the state estimator under partial sensor degradation scenarios, and (3) demonstration of controlled fall and recovery in low-gravity conditions. Items (1) and (2) are achievable in existing NASA facilities by 2029; item (3) requires either a parabolic flight campaign or a dedicated low-gravity analog facility.

### Deliberative Layer

The deliberative layer operates at timescales of 0.1-10 seconds and handles task planning, object recognition, grasp pose selection, path planning, and coordination between locomotion and manipulation. This is the layer where commercial deployments (Figure 02 at BMW, Digit at Amazon) have made the most visible recent progress — structured-environment task execution at TRL 4-5 \cite{bmw2024figuredeployment, agility2024digit}.

Space TRL is 2-3, and the gap is real. The deliberative layer in commercial systems is trained on extensive datasets of human demonstrations in the target environment. For a lunar base environment, no demonstration dataset exists. The environment is maximally out-of-distribution relative to any training dataset assembled from terrestrial robotic operations: the visual appearance (uniform gray dust, stark shadows, no color variation), the surface physics (unconsolidated regolith, unknown bearing capacity), and the tool inventory (EVA hardware, habitat connectors, scientific instruments) are all beyond the training distribution of any existing model. Generalization to out-of-distribution environments is an active research problem in foundation model robotics — and the current evidence from RT-2-class systems is that generalization degrades substantially outside training distribution, even for superficially similar tasks.

The path to TRL 5 by 2029 and TRL 7 by 2035 requires: (1) construction of a lunar-analog task demonstration dataset using high-fidelity simulants and representative hardware, (2) fine-tuning of foundation models on this dataset, and (3) hardware-in-the-loop validation in an analog environment. The first item is a data-collection program that can begin immediately with existing commercial humanoid hardware. The third item requires the first article space humanoid hardware, which does not exist yet — making the 2035 TRL 7 gate dependent on first article availability by approximately 2031-2032. This is a program scheduling dependency that the technology-roadmap-trl agent must carry.

### Supervisory Layer

The supervisory layer operates at timescales of seconds to hours and handles goal-setting, crew communication, anomaly reporting, task queue management, and the human-in-the-loop interface. At TRL 3-4, this layer is the least mature in the heritage base. The closest analogues are mission management software (Mars rover sequencing systems), natural language robot interfaces (research at MIT and CMU), and commercial task-assignment interfaces like those used with Figure 02 (voice-driven task assignment via VLA model).

Space TRL is 2-3. The supervisory layer is where the communication latency constraint bites hardest: on the lunar far side, a crew member at the habitat can interact with the robot in near-real-time, but ground controllers cannot. The supervisory layer must therefore implement sufficient onboard goal-reasoning to generate, queue, and execute multi-step task sequences without continuous crew intervention, while still presenting a comprehensible state and intent model to the crew when they are present and to the ground via delayed telemetry.

Foundation models (VLA-class, LLM reasoning) are architecturally well-matched to this supervisory function. Natural language task assignment ("prepare the oxygen sensor replacement kit and stage it at EVA hatch 2") is the use case Figure 02 demonstrated at BMW — crew-facing, goal-level, not step-by-step \cite{figureai2024figure02}. This is the provisional position for foundation models in this architecture: high-value at the supervisory layer for crew-robot natural language interface, not yet reliable enough to be the primary executor at the deliberative layer for novel tasks.

---

## 4. Foundation Models and Vision-Language-Action Systems: Capabilities and Failure Modes

Foundation models for robotics — systems that use large language models (LLMs), vision-language models (VLMs), or combined vision-language-action (VLA) models to enable generalized robot behavior — are the most rapidly evolving element of the commercial humanoid landscape as of 2026. They warrant careful engagement rather than either dismissal or overselling.

**What exists.** Figure 02 uses an OpenAI-trained VLA model that enables natural-language task assignment and demonstration-based skill acquisition \cite{figureai2024figure02}. Tesla's Optimus uses a foundation model architecture for manipulation planning \cite{tesla2023optimus2}. Google's RT-2 class systems (2023-2025) demonstrated that internet-scale pretraining on vision-language data, followed by fine-tuning on robot manipulation demonstrations, produces systems capable of zero-shot generalization to tasks unseen in the robotics training data. Physical Intelligence (pi0) and similar 2024-2025 systems have pushed further toward generalist manipulation policies. This is genuine progress; the skeptical prior of two years ago that "foundation models cannot run on real-time robot hardware" has been substantially weakened.

**What these systems cannot do reliably.** First, out-of-distribution generalization has limits that are not predictable in advance. A model fine-tuned on a BMW factory floor will not automatically generalize to lunar surface operations, and the failure modes are not graceful — the model may produce highly confident but incorrect actions for inputs outside its training distribution. Lunar surface is not "a little outside distribution." It is an environment with no prior exposure in any training dataset: novel gravity, novel visual statistics, novel object appearances, novel force feedback patterns. Second, under radiation-induced bit errors in model weights or activation memory, foundation model behavior is not characterized. A single-event upset in a weight matrix could produce subtle systematic errors in motion planning that are not detectable from output alone. Validated, interpretable models with bounded failure modes are not what large-scale neural networks provide. Third, the power and memory requirements for running 7B+ parameter models in real time compete with actuation. The Jetson-class hardware that makes onboard inference feasible today draws 30-60 W to achieve 200-500 ms per inference — acceptable for supervisory reasoning, not for a reactive controller that must execute in under 1 ms.

**Study position.** Foundation models are an enabling technology for the supervisory autonomy layer: crew-robot natural language interface, goal decomposition, anomaly explanation, and mission-context awareness. At the deliberative and reactive layers, safety-critical and novel-environment operations must use architectures with validated, bounded failure modes — model predictive control, behavior trees, and verified state machines — supplemented by learned models fine-tuned on domain-specific data. This is not a permanent verdict. If domain-specific lunar-surface training datasets are constructed, if foundation model uncertainty quantification matures, and if radiation-effect characterization is performed, the architecture should be revisited at the 2029 and 2035 program gates. The provisional position is conservative by design: the cost of an autonomous mistake on the lunar far side — an unrecoverable fall, a crew injury, a habitat breach — is categorically higher than the cost of a mistake in a BMW factory. The acceptable failure rate is proportionally lower.

---

## 5. Autonomy/Teleoperation Boundary

The autonomy/teleoperation boundary is the interface between this section and the Human-in-the-Loop analysis (Section 02). A provisional position is stated here; it will be refined by the autonomy-trl-tasking and human-factors-teaming agents.

The position is structured against the §A1 autonomy curve: TRL 6 by 2029, TRL 7+ by 2035. The 2035 column is the relevant baseline for initial lunar far side base operations.

**Fully autonomous by 2035 (no crew supervision required):**
- Routine locomotion between pre-mapped waypoints on prepared paths
- Sensor data collection at pre-designated sites (instrument readings, sample imaging)
- Pre-scripted maintenance procedures on hardware the robot has been specifically trained and tested on (routine filter replacements, connector inspections)
- Self-monitoring, health reporting, and safe-mode transitions on fault detection
- Returning to a designated safe location when communication is lost or anomaly exceeds onboard response capability

These are tasks with bounded environments, predictable inputs, and failure modes that can be characterized in advance. They correspond to Mars rover AutoNav traverse capability applied to a biped — AutoNav has been operational on Curiosity and Perseverance since 2014, representing the most relevant flight heritage for autonomous operation at this layer \cite{ono2018msl}.

**Human-supervised by 2035 (crew or ground authorization required):**
- Novel manipulation tasks (first time performing a task type, or performing a trained task in an unexpected configuration)
- EVA tool handoff with crew members (safety-of-crew event; human must confirm robot state before physical contact)
- Any operation in a permanently shadowed region where sensor performance is reduced and terrain is uncharacterized
- Emergency response procedures (non-routine, high-stakes, time-critical)
- Any task involving pressurized interfaces (hatch operation, connector make/break on life support systems)

These tasks share a common property: the consequence of autonomous failure is either safety-of-crew or irreversible. Human supervision adds value specifically when the cost of being wrong is high and the situation is poorly covered by training data. Under the §A1 curve, by 2035 the deliberative layer is at TRL 7 but not TRL 8 — verified in analog environment but not fully qualified through operational demonstration. Human authorization gates are appropriate until the full operational qualification is achieved.

**Human-controlled (always, regardless of TRL):**
- Life-safety decisions (choices that determine whether a crew member lives or dies)
- Irreversible actions with consequences extending beyond the robot itself (habitat modification, EVA suit life support interface connections, propellant transfers)
- Actions the crew or ground explicitly overrides autonomous execution for any reason

No autonomy TRL curve changes the requirement for human authority over irreversible life-safety decisions. This is not a technical constraint; it is a program and ethical constraint that should be explicit in the autonomy architecture from the start. The supervisory layer must implement a hardware-backed inhibit capability — a crew-accessible override that defeats any autonomous command — as a design requirement, not a growth provision.

**The Lunokhod counterpoint.** The Soviet Lunokhod program operated with permanent ground-in-the-loop teleoperation: five-person crews in real time, with the vehicle stopped between each command cycle \cite{huntress2011soviet}. Lunokhod accumulated 48 km of traverse over two vehicles across multiple years. The lesson drawn by Soviet engineers — and correctly generalized by post-Soviet designers including FEDOR — is that high-quality teleoperation by expert operators can accomplish significant work without onboard autonomy. This study does not reject this lesson; it qualifies it. Lunokhod's operators had near-real-time control (2.5-second round trip, manageable for a rover moving at walking speed). At the lunar far side base, crew members have the same latency advantage for local supervisory control. The case for autonomy is not that teleoperation is wrong; it is that crew time is the scarcest resource in a permanent base, and a 1:1 robot-operator ratio for all robot tasks is not sustainable at any base size. Autonomy is the crew-time multiplier that makes the humanoid-forward architecture economically viable. Avatar-mode teleoperation (full crew-controlled operation in the FEDOR tradition) remains the failure-mode fallback for any task where autonomous execution fails — and this fallback must be designed in, not assumed away.

---

## 6. Handoff Points to Adjacent Sections

**To teleoperation-latency (02-02):** The autonomy/teleoperation boundary defined in Section 5 above requires the latency tradespace to quantify the minimum latency achievable on the lunar far side relay architecture and to define what supervisory control actions are feasible within that latency. The reactive layer's 1 ms cycle time is clearly shorter than any relay latency; the supervisory layer's 1-10 second decision timescale is within or near relay latency. The boundary between "autonomous, crew can supervise from habitat" and "autonomous, ground can supervise with latency" depends on the relay architecture that the teleoperation-latency agent must characterize.

**To human-factors-teaming (02-04):** The autonomy boundary positions in Section 5 above (fully autonomous vs. human-supervised vs. human-controlled categories) require the human-factors-teaming agent to define what a crew supervision interaction looks like in practice: how many seconds does a crew authorization gate add to a task, how does crew workload distribute across a six-person base with multiple robots, and what cognitive load does the supervisory interface place on crew during high-task-density periods. The foundation model natural-language interface at the supervisory layer is a candidate for reducing cognitive load — whether it succeeds or adds complexity depends on factors the human-factors agent must assess.

---

## References

\cite{nasa2016r2factsheet} — R2 fact sheet; 350+ sensors, 38 processors, tactile and F/T sensing in hands.
\cite{diftler2011r2} — R2 ISS deployment; EVA tool compatibility; sensor architecture design intent.
\cite{radford2015valkyrie} — Valkyrie design paper; MultiSense SL stereo head, F/T sensing at wrists.
\cite{nasa2023valkyrieFactsheet} — Valkyrie fact sheet; sensor suite description.
\cite{figureai2024figure02} — Figure 02; VLA model, onboard dual NVIDIA compute, BMW deployment.
\cite{tesla2023optimus2} — Optimus Gen 2; foundation model autonomy approach.
\cite{bmw2024figuredeployment} — BMW Spartanburg deployment of Figure 02; structured-environment autonomy TRL.
\cite{agility2024digit} — Digit v4; LIDAR, Intel RealSense depth cameras, MEMS IMU sensor suite.
\cite{huntress2011soviet} — Lunokhod traverse heritage; Soviet teleoperation philosophy.
\cite{ono2018msl} — MSL/Curiosity AutoNav; Mars rover autonomous navigation as flight heritage for deliberative path planning.
