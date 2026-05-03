---
title: "Human-in-the-Loop Value: Autonomy TRL and Task Allocation"
status: draft
review-status: unreviewed
owner: autonomy-trl-tasking
last-updated: 2026-05-03
---

# Section 02-03 — Autonomy TRL and Task Allocation

This section assesses what autonomous systems can do today, what the lunar far-side base mission requires them to do, and where the gap lies. It builds on the three-layer autonomy stack architecture (reactive / deliberative / supervisory), the two-tier compute architecture, and the per-layer TRL path established in Section 01-04 \cite{ono2018msl}. Content from that section is not repeated here; this section extends it into task-level specificity and derives the task allocation model that feeds the human-factors-teaming section (02-04).

The brutal assessment: commercial humanoid autonomy demonstrations look transformative on video and fail routinely at long-tail conditions. The lunar far side is the longest tail that exists — no training data, no cloud inference, no operator reboot, and physics that every terrestrial controller was trained to ignore. TRL numbers are assigned here with that failure baseline, not the highlight reel.

---

## 1. Capability-by-Task-Category TRL Assessment

The table below maps autonomous capability to the task categories relevant to this mission. "Current space TRL" means demonstrated in space or space-analog conditions; "current terrestrial TRL" means demonstrated in representative terrestrial deployment (not lab). Notes column shows the TRL derivation, not just the number.

| Task Category | Current Space TRL | Current Terrestrial TRL | Gap to Mission Requirement | Notes |
|---|---|---|---|---|
| **Locomotion — prepared paths** | 3 | 6 | TRL 6 by 2029 per §A1 | Space TRL 3: no bipedal humanoid has operated on any planetary surface; Lunokhod wheeled rovers are non-bipedal precedent; FEDOR demonstrated station ingress/egress in zero-g but not surface walking. Terrestrial TRL 6: Boston Dynamics Atlas and Unitree H1 walk reliably on prepared surfaces in controlled environments but success rates in multi-hour unattended runs on rough terrain are not published \cite{unitree2024h1}. TRL 3 = demonstrated in relevant environment (laboratory analog), not in space. Gap: 1/6-g locomotion controller validation in JSC-1A simulant (Q4 2028 gate minimum observable per §04). |
| **Locomotion — unstructured terrain** | 2 | 4 | TRL 6 by 2035 | Space TRL 2: concept demonstrated but no hardware in space-relevant gravity + terrain. Terrestrial TRL 4: Atlas and Unitree handle moderate outdoor terrain; both exhibit long-tail failures on loose granular surfaces (sand, gravel), which are the closest terrestrial analog to lunar regolith \cite{bdatlaselectric2024}. Loose granular surface locomotion triggers foot slip and state estimator divergence — modes that are common in lunar fine regolith. TRL 4 = technology component validated in laboratory. Gap: no training dataset or simulator exists for humanoid locomotion in lunar regolith, and no gravity-compensated test has been performed. |
| **Manipulation — structured, pre-taught grasps** | 5 | 7 | TRL 6 by 2029 | Space TRL 5: Robonaut 2 demonstrated panel operations and ISS handrail grasp on-orbit (technology validated in relevant environment, ISS) \cite{diftler2011r2}; SSRMS has TRL 8 for its specific task set but is a fixed-arm system, not a free-body manipulator \cite{ssrms2020ntrs}. Terrestrial TRL 7: Figure 02 and Digit deployed in BMW and Amazon facilities performing pre-taught grasp sequences \cite{bmw2024figuredeployment, agility2024digit}. Mission-specific gap is teaching: pre-taught grasps require demonstration data in the target environment. A lunar base task library must be assembled using ground simulant hardware, prior to deployment, at an estimated 500–2,000 taught demonstrations per new tool type. |
| **Manipulation — unstructured, novel objects** | 2 | 4 | TRL 6 by 2035 | Space TRL 2: no dexterous manipulation of novel objects has been attempted in space outside pre-programmed tool grasps. Terrestrial TRL 4: research demonstrations exist (UC Berkeley DROID, Stanford ALOHA \cite{zhao2023aloha}) but fail consistently at objects outside training distribution — transparent, deformable, very small, or surface-texture-ambiguous objects. In a lunar base context, "novel object" includes any tool or sample not represented in the training dataset, which is the normal condition in scientific fieldwork. TRL 4 = component validated in lab; operational deployment requires TRL 6 at minimum. |
| **Navigation — 3D mapping, terrain avoidance** | 8 | 9 | Met by 2029 with adaptation | Space TRL 8: Mars AutoNav (Curiosity, Perseverance) is the unambiguous heritage — stereo-camera-derived point-cloud terrain classification and path planning, operating autonomously since 2012 at speeds up to 0.045 m/s \cite{ono2018msl}. Perseverance's AutoNav traversed 22.8 km through Jezero Crater with human intervention only for long-range path selection. The gap is speed (humanoid target: 1.0–1.5 m/s, 30–40× faster than AutoNav) and platform (biped not rover). Point-cloud mapping algorithms transfer directly; locomotion stability at biped speeds requires its own validation (addressed under locomotion categories). |
| **Fault response — reactive, safe-stop** | 6 | 7 | TRL 7 by 2029 | Space TRL 6: Mars rovers implement autonomous safe-stop, tilt-limit monitoring, and communication-loss safe-mode with more than a decade of flight heritage. Perseverance's autonomous reactive fault response (AutoNav abort on tilt threshold, communication loss timer) has closed TRL 6 in operational environment. Extension to a biped adds: fall-detection-and-recovery (no space heritage, terrestrial TRL 5 in Atlas/Boston Dynamics demos), joint fault isolation (space precedent from SSRMS joint failure 2021 isolation procedure), and Tier 2 compute watchdog reset (architecture new, no space heritage but heritage pattern in MSL compute hierarchy). Composite TRL 6, advancing to 7 with fall recovery validation. |
| **Fault response — deliberative, reconfiguration** | 3 | 5 | TRL 8 by 2035 | Space TRL 3: rovers reconfigure around single-joint failures (Curiosity's wheel damage workarounds are the best published heritage) but do not replicate biped motor-out reconfiguration. Terrestrial TRL 5: Valkyrie demonstrated deliberative fault recovery in DRC environments; commercial systems lack this entirely. Biped-specific challenge: a single load-bearing joint failure (hip, knee) can make upright locomotion impossible; the robot must either switch to tripod/crawling mode or request human intervention — a decision with no published space heritage. |
| **Multi-step task execution — scripted** | 5 | 6 | TRL 6 by 2029 | Space TRL 5: MSL autonomous science (AEGIS targeting, onboard science data assessment) demonstrates scripted multi-step execution in space-relevant environment \cite{ono2018msl}. R2 executed scripted panel operation sequences on ISS at TRL 5 (technology validated in relevant environment, never operationally deployed at volume). Terrestrial TRL 6: Figure 02 and Digit execute multi-step assembly sequences in factory deployments. Gap for this mission: task duration — lunar base tasks require unattended sequences lasting 2–8 hours, an order of magnitude longer than any published demonstration. Long-duration task monitoring and exception handling (what does the robot do when step 4 of a 12-step sequence fails?) are the development items. |
| **Novelty handling — unscripted situation response** | 2 | 3 | TRL 5 by 2035; TRL 7 by 2038–2040 | Space TRL 2: no autonomous space system has responded productively to a situation outside its pre-defined operating envelope without ground intervention. Curiosity's motor anomaly responses are rule-based, not novelty-adaptive. Terrestrial TRL 3: laboratory VLA demonstrations show some zero-shot task transfer, but production deployments universally rely on pre-taught behavior; "zero-shot" performance degrades substantially at test distribution boundary. This category is where the honest answer diverges most from the YouTube narrative. Novelty handling TRL 3 means the concept is demonstrated in laboratory conditions, not validated in any deployment environment. |

---

## 2. Mission Task Taxonomy

The following tasks constitute the operational envelope for the lunar far-side base humanoid fleet. Each task is classified by the autonomy category it primarily exercises, the minimum autonomy TRL required for fully unattended execution, and whether it can be executed with human-lead (human decides, robot assists) or whether the operational tempo requires fully autonomous execution (because the task duration, location, or timing precludes continuous human oversight).

| # | Task Name | Primary Autonomy Category | Min TRL for Full Autonomy | Can be human-led? | Notes |
|---|---|---|---|---|---|
| T01 | Transit on prepared path between base modules | Locomotion (prepared) | TRL 6 | Yes, but tempo penalty | ~100m daily transit; crew oversight is impractical at 1:3 robot:crew ratio if every transit requires a dedicated supervisor |
| T02 | Negotiate unprepared terrain to science waypoint | Locomotion (unstructured) | TRL 6 | Yes | Short excursions (<500m) plausibly human-supervised via habitat video; longer traverses require autonomous execution by 2035 IOC |
| T03 | Navigate to GPS-designated sample collection point | Navigation (3D mapping) | TRL 8 (met) | Yes | AutoNav-class capability; the heritage is solid. The gap is speed and platform, not algorithm |
| T04 | Collect regolith sample at designated site | Manipulation (pre-taught) | TRL 6 | Yes | Sampling tool grasp must be pre-taught; site conditions (slope, compaction) introduce variability that requires TRL 6 deliberative adaptation |
| T05 | Install solar panel segment at pre-surveyed location | Multi-step task execution (scripted) | TRL 6 | Human-lead preferred before TRL 7 | Requires: carry panel to site, align, connect electrical, verify; multi-step scripted sequence with physical engagement; first execution always human-supervised |
| T06 | Replace Tier 2 compute ORU in humanoid workshop | Manipulation (pre-taught) | TRL 6 | Human-lead for first execution | Pre-taught connector sequence in a structured workshop environment; TRL 6 capable by 2029 if task library built; high value because it reduces crew EVA time |
| T07 | Inspect external base structure (visual survey) | Navigation + Multi-step (scripted) | TRL 6 | Yes | Pre-programmed inspection path with photo capture at defined waypoints; directly analogous to planned Perseverance inspection drives |
| T08 | Transport equipment from logistics airlock to worksite | Locomotion + Manipulation (pre-taught) | TRL 6 | Yes, but crew time intensive | Carries tools, spare ORUs, consumables; requires grasping and securing items in transit across 50–300m of prepared path |
| T09 | EVA support — carry tools to crew member at worksite | Locomotion + Manipulation (pre-taught) | TRL 6 | Jointly executed — crew must confirm before handoff | Robot autonomously transits and positions; EVA crew member authorizes the physical handoff; crew authorization gate required (safety-of-crew contact event) |
| T10 | Respond to SPE shelter warning — return autonomously to habitat | Fault response (reactive) | TRL 7 | Must be fully autonomous | Crew may be in EVA suits with limited comms; robot must self-initiate shelter return on Tier 1 radiation monitor threshold, within 15–30 minutes; human authorization impractical in time-critical SPE scenario |
| T11 | Detect and report joint anomaly, initiate safe-stop | Fault response (reactive) | TRL 7 | Must be fully autonomous | Tier 1 supervisor handles this with no human-in-loop; if Tier 2 watchdog reset fails, Tier 1 halts motion and alerts crew; scripted response with no judgment required |
| T12 | Reconfigure locomotion after single joint failure | Fault response (deliberative) | TRL 8 | Human-lead before TRL 8 | Load-bearing joint failure forces mode switch (tripod, crawl, or standstill); requires deliberative reasoning about what is safe; human intervention required before deliberative TRL 8 is reached |
| T13 | Collect geological sample at novel outcrop (unscripted location) | Novelty handling + Manipulation | TRL 7 | Jointly executed — scientist provides site decision | Robot executes approach and collection mechanics; scientist (via delayed relay) selects site, approves sample; autonomy handles execution, human provides judgment |
| T14 | Identify and report unrecognized hardware anomaly at base perimeter | Novelty handling | TRL 7 | Jointly executed | Robot identifies deviation from baseline visual survey; human reviews footage and decides response; autonomy must recognize "this is different" — which requires TRL 5 novelty detection before the flag is meaningful |
| T15 | Perform pre-scripted EVA preparation checklist (suit station) | Multi-step task execution (scripted) | TRL 6 | Yes | Suit don/doff assistance is well-bounded; robot aids crew member through pre-planned steps; high repetition and identical environment each cycle |
| T16 | Operate radio telescope array calibration instrument | Multi-step (scripted) + Manipulation | TRL 6 | Yes — scientist oversees via relay | Calibration procedure is scripted; instrument is pre-mapped; relay-delayed scientist authorization acceptable because calibration is not time-critical at minute timescales |
| T17 | Respond to habitat pressure drop alarm — locate and report breach | Novelty handling + Navigation | TRL 7 | Must be partially autonomous | Time-critical; crew may be compromised; robot must initiate inspection autonomously and report location; human makes the sealing/evacuation decision |
| T18 | Train on new tool type via demonstration capture | Manipulation (supervised learning) | Not an autonomy gate — infrastructure task | Must be crew-led | Crew or ground operator demonstrates the task; robot records and generates new behavior library entry; this is a maintenance activity for the autonomy system itself, not an autonomous operation |
| T19 | Remove and replace dust-degraded radiator panel | Manipulation (pre-taught) + Locomotion | TRL 6 | Human-lead initially | Connector sequence and panel alignment are teachable; first execution requires crew supervision; repeat execution is autonomy-led after the 2035 IOC |
| T20 | Assess and map terrain ahead of planned traverse | Navigation (3D mapping) | TRL 8 (met) | Yes | Pre-traverse terrain scouting using LIDAR point cloud; AutoNav-class heritage fully applicable; robot sends map to crew/ground for path approval at long range |

---

## 3. Gap Analysis by Deployment Date

### 2029 First-Article Gate (TRL 6 reactive, TRL 5 deliberative/supervisory)

At the 2029 gate, the capability ceiling per §A1 is: reactive layer TRL 6, deliberative layer TRL 5, supervisory layer TRL 5. In task terms, this ceiling means:

**Autonomously executable by 2029:** T03 (navigation to GPS waypoint), T11 (joint anomaly safe-stop), portions of T07 (visual inspection on pre-programmed path). These are tasks where the reactive or navigation layers carry the load and the deliberative layer is minimal.

**Requires human-in-loop in 2029:** Everything else. The deliberative TRL 5 ceiling means the robot can attempt pre-taught manipulation tasks (T04, T05, T06, T08) under human supervision but cannot handle exceptions autonomously. Multi-step tasks (T05, T15, T16, T19) require human authorization at each major step because the deliberative layer lacks the exception-handling maturity to decide independently when to proceed after a step anomaly.

**Not executable even with human-in-loop in 2029:** T10 (SPE shelter return autonomously) and T12 (deliberative joint-failure reconfiguration) require TRL 7 deliberative response — not achievable by 2029 per §A1. The first-article gate is a hardware and locomotion gate, not a task-operations gate.

**Human value floor at 2029:** Every task involving physical contact with crew (T09 handoff), all multi-step sequences with error branches (T05, T16, T19), all novelty-response tasks (T13, T14, T17), and all judgment calls on irreversible actions are permanently human-in-loop regardless of TRL.

### 2035 Initial Operational Capability (TRL 7+ in space-relevant environment)

By 2035, the deliberative layer advances to TRL 7 (validated in space-analog environment) and the supervisory layer advances toward TRL 6–7. The autonomy/teleoperation boundary shifts substantially:

**Autonomy-led by 2035:** T01 (prepared path transit), T03 (GPS navigation), T04 (taught sample collection), T06 (ORU replacement in workshop after first run), T07 (inspection surveys), T08 (equipment transport on prepared paths), T10 (SPE shelter autonomous return — a TRL 7 reactive task), T11 (safe-stop on anomaly), T15 (EVA preparation checklist assistance), T19 (radiator panel replacement on repeat execution), T20 (terrain mapping).

**Jointly executed by 2035:** T02 (unstructured terrain with human path approval), T05 (panel installation — human authorizes physical engagement at each stage), T09 (tool handoff — human confirmation before physical contact), T13 (science sample at novel site — scientist selects site, robot executes), T14 (anomaly reporting — robot flags, human decides), T16 (calibration procedure — scientist authorizes via relay), T17 (pressure breach — robot locates, human decides response).

**Human-led by 2035:** T12 (load-bearing joint failure reconfiguration — requires TRL 8 deliberative capability not available until 2038–2040), T18 (new tool demonstration — always crew-led), and any task explicitly overridden by crew or ground.

**What remains permanently human-required regardless of TRL:** Life-safety decisions; any action that is irreversible outside the robot itself (habitat modification, pressurized interface operations, life support system connections); first execution of any new task type; explicit crew override for any reason. This is the human value floor, detailed below.

### 2038–2040 Full Operation (TRL 8 qualified in operational environment)

By the 2040 full operation horizon, the TRL 8 deliberative layer unlocks T12 (joint-failure reconfiguration) and meaningfully advances novelty handling (T13, T14) from jointly-executed to a lighter-touch supervisory model. T17 (pressure breach response) may reach fully autonomous execution with crew notification rather than authorization, depending on mission rule evolution. Tasks T05 and T09 may shift to autonomy-led with crew monitoring rather than jointly executed, as the task library and operational experience accumulate.

What does not shift regardless of TRL advancement: the human value floor. The tasks below remain human-required not because TRL is low but because the consequence of autonomous failure is disproportionate, the situation is structurally novel (exploration is novelty by definition), or the decision carries value judgments that program policy assigns to humans.

**Human value floor — permanently human-led tasks:**

1. Authorization of first execution of any task type the robot has not previously performed in the operational environment (not in simulation, in the actual base)
2. All physical contact with suited crew members, including tool handoff (T09), regardless of demonstrated autonomy TRL
3. Any action on pressurized interfaces or life support hardware
4. Emergency responses where the outcome affects whether crew can remain outside the habitat (T17 at the highest consequence level)
5. Habitat modification — structural changes to the base that affect pressure integrity or load paths
6. Science priority decisions — which sample to collect, which anomaly to investigate (T13, T14) — these carry scientific judgment that humans are not delegating to autonomous systems on this program regardless of model capability
7. Any situation the robot itself flags as outside its operational envelope (the §A9 position: foundation models at the supervisory layer must correctly withhold action on OOD inputs; when the model withholds, a human must decide)

The human value floor derives directly from the §A9 constraint: foundation models are not primary task executors for safety-critical operations in unstructured environments. Exploration is unstructured by definition. The floor is therefore not a temporary gap; it is a program position.

---

## 4. Task Allocation Table

This table is the primary input to the human-factors-teaming section (02-04). It sets the supervisor ratio assumptions. The justification for each allocation is in Section 3 above.

| Task | Allocation at IOC (2035) | Allocation at Full Operation (2040) |
|---|---|---|
| T01 — Prepared path transit | **Autonomy-led** (human monitors via telemetry) | **Autonomy-led** |
| T02 — Unstructured terrain to science waypoint | **Jointly executed** (human approves path segments) | **Jointly executed** (lighter human oversight, shorter confirmation window) |
| T03 — Navigate to GPS sample point | **Autonomy-led** (human monitors) | **Autonomy-led** |
| T04 — Collect pre-taught regolith sample | **Autonomy-led** (human reviews data after) | **Autonomy-led** |
| T05 — Install solar panel segment | **Jointly executed** (human authorizes physical engagement gates) | **Jointly executed** (authorization gates remain; task is irreversible) |
| T06 — Replace Tier 2 ORU in workshop | **Autonomy-led** after first human-supervised run | **Autonomy-led** |
| T07 — Inspect base structure | **Autonomy-led** (human reviews flagged images) | **Autonomy-led** |
| T08 — Transport equipment on prepared path | **Autonomy-led** (human monitors) | **Autonomy-led** |
| T09 — EVA tool handoff to crew | **Jointly executed** (crew confirms before every physical contact) | **Jointly executed** (human confirmation remains — safety-of-crew) |
| T10 — SPE shelter autonomous return | **Autonomy-led** (Tier 1 reactive, no human authorization in time) | **Autonomy-led** |
| T11 — Joint anomaly safe-stop | **Autonomy-led** (Tier 1 reactive; crew notified after) | **Autonomy-led** |
| T12 — Joint-failure locomotion reconfiguration | **Human-led** (robot halts, crew or ground decides mode) | **Autonomy-led** (TRL 8 deliberative unlocks this task) |
| T13 — Novel site geological sample | **Jointly executed** (scientist selects site, robot executes) | **Jointly executed** (scientific judgment remains human) |
| T14 — Unrecognized hardware anomaly report | **Jointly executed** (robot flags, human decides) | **Jointly executed** (human decision remains for novel anomalies) |
| T15 — EVA preparation checklist | **Autonomy-led** (crew present for suit operations; robot assists) | **Autonomy-led** |
| T16 — Radio telescope calibration | **Jointly executed** (scientist authorizes via relay; robot executes) | **Autonomy-led** (scripted; human reviews logs, not execution) |
| T17 — Habitat breach — locate and report | **Jointly executed** (robot locates, human decides sealing action) | **Jointly executed** or Autonomy-led with notify (depends on mission rules) |
| T18 — New tool demonstration capture | **Human-led** (crew or ground demonstrates) | **Human-led** |
| T19 — Radiator panel replacement | **Autonomy-led** after first supervised run | **Autonomy-led** |
| T20 — Pre-traverse terrain mapping | **Autonomy-led** (human reviews map before long traverse approval) | **Autonomy-led** |

**Supervisor ratio input to human-factors-teaming:** At 2035 IOC, 12 of 20 tasks are autonomy-led; 6 are jointly executed (requiring defined human interaction but not continuous supervision); 2 are human-led. Assuming the 12 autonomy-led tasks run concurrently during a sortie and require monitoring but not authorization, and the 6 jointly-executed tasks require an average of 2–5 minutes of human interaction per task execution, a 4-person crew supervising 3 humanoids executing 2–3 concurrent task chains can manage the authorization load at roughly 1:3 robot-to-active-supervisor ratio during nominal operations. This is a first-order estimate; the human-factors-teaming section (02-04) must validate it against cognitive workload models and task duration distributions.

---

## 5. Counter-Case: Do High-Autonomy Humanoids Need Human Supervision?

The serious version of the counter-case: Foundation models trained on internet-scale data and fine-tuned on robot demonstrations are rapidly improving zero-shot task transfer. GPT-4V class models can describe images of novel tool configurations with reasonable accuracy. VLA models (pi-0, OpenVLA \cite{black2024pi0}) demonstrate cross-task generalization in unstructured lab environments. If this trajectory continues, a 2035-vintage model might handle most of the "jointly executed" task categories without human authorization gates. Why build the architecture around human-in-the-loop if autonomy may render it unnecessary?

Three answers, in order of weight:

**First, exploration is structurally OOD.** The defining feature of exploration — as distinct from manufacturing, logistics, or maintenance — is that the environment contains things not previously encountered. A lunar base engaged in scientific fieldwork will routinely encounter geological formations, equipment states, and surface conditions for which no training data exists. Current evidence on VLA generalization shows that performance degrades near training distribution boundaries in ways that are not predictable in advance and that the model itself does not reliably identify \cite{zhao2023aloha}. An architecture that relies on a model to self-assess whether it is in-distribution is relying on the model's most poorly-calibrated capability. Human supervision provides the OOD detection that models cannot reliably provide for themselves. This is not a statement that models will never solve this — it is a statement that they have not solved it by 2026, and the §A9 assumption should be revisited at each gate as evidence accumulates.

**Second, consequence asymmetry.** For tasks in a factory, the consequence of an autonomous failure is a bad part, a safety stop, and a human walkover to reset. For tasks at a lunar far-side base, the consequence space includes: a crew member injured during a tool handoff that went wrong; a habitat structural element damaged in a way that takes weeks to repair; a geological sample contaminated or destroyed. The asymmetry between the cost of a human authorization gate (2–5 minutes) and the cost of an autonomous failure in a high-consequence context is so large that the burden of proof lies with those who want to remove the gate, not those who want to keep it.

**Third, the Lunokhod lesson runs in both directions.** Soviet engineers operated Lunokhod with full ground-in-the-loop teleoperation and covered 48 km of lunar surface with two vehicles. The lesson used to argue for autonomy is that ground-in-the-loop cannot scale. The lesson used to argue for human supervision is that human operators have repeatedly solved problems that autonomous systems of the era could not: Lunokhod 1's operators kept the vehicle operational through sensor degradation and surface anomalies that a rule-based autonomous system would have terminated on. The appropriate update is not "therefore full autonomy" but "therefore design the human-autonomy interface to let human judgment act quickly when needed" — which is what the jointly-executed task category implements \cite{huntress2011soviet}.

---

## 6. Reconciliation with §A1 and §A9

**§A1 autonomy curve validation.** The TRL table in Section 1 supports the §A1 curve for the reactive and navigation layers: locomotion on prepared paths reaching TRL 6 by 2029 is consistent with the rate of advance from current terrestrial TRL 6 to space-relevant TRL 6 given the 2029 gate minimum observable (30-minute unscripted locomotion on JSC-1A simulant in 1/6-g offload facility). Navigation (TRL 8 space heritage from AutoNav) already exceeds the 2029 requirement. The deliberative layer's path to TRL 5 by 2029 is achievable if the lunar-analog task demonstration dataset construction begins by 2027 — a program initiation constraint that must flow to the technology roadmap. The novelty handling category (TRL 3 terrestrial, TRL 2 space) does not contradict §A1 because §A1 targets the reactive and deliberative layers, not novelty handling; the 2035 and 2040 targets for novelty handling (TRL 5 and TRL 7 respectively) are consistent with the curve but are not driven by it. No finding in this section requires updating §A1.

**§A9 foundation model constraint validation.** Tasks T13 (novel site sample), T14 (anomaly identification), and T17 (habitat breach response) are the three tasks where, without §A9's constraint, a foundation model might be used as the primary decision-maker. In each case, the situation is structurally out-of-distribution by definition: the specific geological formation, the specific hardware anomaly, the specific breach location are all novel. The §A9 constraint — foundation models at supervisory layer only, not primary task executor in safety-critical unstructured operations — is validated by the task taxonomy. Foundation model capability is appropriately used in T13 for translating a scientist's natural-language description of what sample to collect into a robot-executable approach and grasping sequence, and in T14 for generating an anomaly report that crew can efficiently review. These are supervisory-layer functions. The primary decision in both cases remains human. §A9 does not require updating.

**Cross-coupling flag:** The task allocation table in Section 4, and specifically the human value floor identified in Section 3, are new inputs to the assumption register and cross-coupling log. These are logged as required entries in the closing actions below.

---

## References

\cite{ono2018msl} — Mars AutoNav; AutoNav on Curiosity/Perseverance; stereo-camera terrain classification; autonomous traverse heritage.
\cite{diftler2011r2} — Robonaut 2 ISS deployment; structured manipulation heritage; EVA tool grasp.
\cite{ssrms2020ntrs} — SSRMS/Canadarm2; space-qualified manipulation arm; harmonic drive joint heritage.
\cite{bmw2024figuredeployment} — Figure 02 at BMW Spartanburg; structured-environment autonomy TRL baseline.
\cite{agility2024digit} — Digit v4 at Amazon; multi-step scripted manipulation in logistics environment.
\cite{huntress2011soviet} — Lunokhod heritage; Soviet teleoperation philosophy; human-in-loop lessons.
\cite{unitree2024h1} — Unitree H1; bipedal locomotion on prepared surfaces; commercial TRL baseline. [UNVERIFIED — cite pending primary source confirmation]
\cite{bdatlaselectric2024} — Boston Dynamics Atlas Electric; bipedal locomotion performance; long-tail failure modes. [UNVERIFIED — cite pending primary source confirmation]
\cite{zhao2023aloha} — ALOHA/ACT; dexterous manipulation; training distribution limitations; zero-shot generalization bounds.
\cite{black2024pi0} — pi-0 VLA model; cross-task generalization; supervisory layer capability baseline. [UNVERIFIED — cite pending primary source confirmation]
\cite{nvidia2023jetson} — Jetson AGX Orin; Tier 2 compute platform; inference performance baseline.
