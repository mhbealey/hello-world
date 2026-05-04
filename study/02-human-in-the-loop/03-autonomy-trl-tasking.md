---
title: "Human-in-the-Loop Value: Autonomy TRL and Task Allocation"
status: draft
review-status: stage-8-enforcement-pass
owner: autonomy-trl-tasking
last-updated: 2026-05-04
---

# Section 02-03 — Autonomy TRL and Task Allocation

This section assesses what autonomous systems can do today, what the lunar far-side base mission requires them to do, and where the gap lies. It builds on the three-layer autonomy stack architecture (reactive / deliberative / supervisory), the two-tier compute architecture, and the per-layer TRL path established in Section 01-04. Content from that section is not repeated here; this section extends it into task-level specificity and derives the task allocation model that feeds the human-factors-teaming section (02-04).

The brutal assessment: commercial humanoid autonomy demonstrations look transformative on video and fail routinely at long-tail conditions. The lunar far side is the longest tail that exists — no training data, no cloud inference, no operator reboot, and physics that every terrestrial controller was trained to ignore. TRL numbers are assigned here with that failure baseline, not the highlight reel.

---

## 1. Capability-by-Task-Category TRL Assessment

The table below maps autonomous capability to the task categories relevant to this mission. "Current space TRL" means demonstrated in space or space-analog conditions; "current terrestrial TRL" means demonstrated in representative terrestrial deployment (not lab).

| Task Category | Current Space TRL | Current Terrestrial TRL | Gap to Mission Requirement | Notes |
|---|---|---|---|---|
| **Locomotion — prepared paths** | 3 | 6 | TRL 6 by 2029 per §A1 | Bipedal lunar surface is TRL 2–3; requires 2029 first-article demo on JSC-1A simulant in 1/6-g offload. |
| **Locomotion — unstructured terrain** | 2 | 4 | TRL 6 by 2035 | Long-tail failures on loose granular surfaces; no gravity-compensated simulant test exists. |
| **Manipulation — structured, pre-taught grasps** | 5 | 7 | TRL 6 by 2029 | R2 ISS heritage at TRL 5 \cite{diftler2011r2}; task library must be built on simulant before deployment. |
| **Manipulation — unstructured, novel objects** | 2 | 4 | TRL 6 by 2035 | Research demos fail outside training distribution \cite{zhao2023aloha}; lunar novel objects are the normal condition. |
| **Navigation — 3D mapping, terrain avoidance** | 8 | 9 | Met by 2029 with adaptation | AutoNav heritage at TRL 8 \cite{ono2018msl}; gap is speed (1.0–1.5 m/s vs. rover 0.045 m/s) and biped platform. |
| **Fault response — reactive, safe-stop** | 6 | 7 | TRL 7 by 2029 | Decade of rover safe-mode heritage; biped adds fall detection and recovery (terrestrial TRL 5). |
| **Fault response — deliberative, reconfiguration** | 3 | 5 | TRL 8 by 2035 | No load-bearing joint failure reconfiguration precedent in space; decision logic TRL gap is the constraint. |
| **Multi-step task execution — scripted** | 5 | 6 | TRL 6 by 2029 | AEGIS/R2 heritage at TRL 5 \cite{ono2018msl}; gap is 2–8 hour unattended sequences, beyond published demos. |
| **Novelty handling — unscripted situation response** | 2 | 3 | TRL 5 by 2035; TRL 7 by 2038–2040 | No space system has responded productively outside its pre-defined envelope without ground intervention. |

---

## 2. Mission Task Taxonomy

The following tasks constitute the operational envelope for the lunar far-side base humanoid fleet. Each task is classified by the primary autonomy category it exercises, the minimum autonomy TRL required for fully unattended execution, and the operational rationale.

| # | Task Name | Primary Autonomy Category | Min TRL for Full Autonomy | Can be human-led? | Notes |
|---|---|---|---|---|---|
| T01 | Transit on prepared path between base modules | Locomotion (prepared) | TRL 6 | Yes, but tempo penalty | Daily transits impractical to supervise at 1:3 ratio. |
| T02 | Negotiate unprepared terrain to science waypoint | Locomotion (unstructured) | TRL 6 | Yes | Short excursions plausibly supervised via habitat video. |
| T03 | Navigate to GPS-designated sample collection point | Navigation (3D mapping) | TRL 8 (met) | Yes | AutoNav-class; heritage solid. |
| T04 | Collect regolith sample at designated site | Manipulation (pre-taught) | TRL 6 | Yes | Slope and compaction variability require TRL 6 deliberative adaptation. |
| T05 | Install solar panel segment at pre-surveyed location | Multi-step task execution (scripted) | TRL 6 | Human-lead preferred before TRL 7 | Physical engagement gates require human authorization; irreversible if misseated. |
| T06 | Replace Tier 2 compute ORU in humanoid workshop | Manipulation (pre-taught) | TRL 6 | Human-lead for first execution | Structured workshop; pre-taught connector sequence. |
| T07 | Inspect external base structure (visual survey) | Navigation + Multi-step (scripted) | TRL 6 | Yes | Pre-programmed path; analogous to Perseverance inspection drives. |
| T08 | Transport equipment from logistics airlock to worksite | Locomotion + Manipulation (pre-taught) | TRL 6 | Yes, but crew time intensive | Prepared path; 50–300 m range. |
| T09 | EVA support — carry tools to crew member at worksite | Locomotion + Manipulation (pre-taught) | TRL 6 | Jointly executed — crew confirms before handoff | Safety-of-crew contact; crew authorization required every handoff. |
| T10 | Respond to SPE shelter warning — return autonomously to habitat | Fault response (reactive) | TRL 7 | Must be fully autonomous | 15–30 min window; human authorization impractical in time-critical SPE scenario. |
| T11 | Detect and report joint anomaly, initiate safe-stop | Fault response (reactive) | TRL 7 | Must be fully autonomous | Tier 1 supervisor handles; no judgment required; crew notified after. |
| T12 | Reconfigure locomotion after single joint failure | Fault response (deliberative) | TRL 8 | Human-lead before TRL 8 | Deliberative reasoning required; human intervention mandatory before TRL 8. |
| T13 | Collect geological sample at novel outcrop (unscripted location) | Novelty handling + Manipulation | TRL 7 | Jointly executed — scientist provides site decision | Scientist selects via relay; robot executes mechanics. |
| T14 | Identify and report unrecognized hardware anomaly at base perimeter | Novelty handling | TRL 7 | Jointly executed | Robot flags deviation; human assesses operational significance. |
| T15 | Perform pre-scripted EVA preparation checklist (suit station) | Multi-step task execution (scripted) | TRL 6 | Yes | Well-bounded; high repetition; identical environment each cycle. |
| T16 | Operate radio telescope array calibration instrument | Multi-step (scripted) + Manipulation | TRL 6 | Autonomy-led at IOC | Scripted calibration protocol; pre-mapped instrument; human reviews logs not execution. |
| T17 | Respond to habitat pressure drop alarm — locate and report breach | Novelty handling + Navigation | TRL 7 | Must be partially autonomous | Robot initiates autonomously; human makes sealing/evacuation decision. |
| T18 | Train on new tool type via demonstration capture | Manipulation (supervised learning) | Not an autonomy gate | Must be crew-led | Crew demonstrates; robot records new behavior library entry. |
| T19 | Remove and replace dust-degraded radiator panel | Manipulation (pre-taught) + Locomotion | TRL 6 | Human-lead initially | Teachable connector sequence; first execution requires crew supervision. |
| T20 | Assess and map terrain ahead of planned traverse | Navigation (3D mapping) | TRL 8 (met) | Yes | AutoNav-class; crew reviews map before long traverse approval. |

---

## 3. Gap Analysis by Deployment Date

### 2029 First-Article Gate (TRL 6 reactive, TRL 5 deliberative/supervisory)

At the 2029 gate, the capability ceiling per §A1 is: reactive layer TRL 6, deliberative layer TRL 5, supervisory layer TRL 5. In task terms:

**Autonomously executable by 2029:** T03 (navigation to GPS waypoint), T11 (joint anomaly safe-stop), portions of T07 (visual inspection on pre-programmed path). Reactive or navigation layers carry the load; deliberative layer is minimal.

**Requires human-in-loop in 2029:** Everything else. The deliberative TRL 5 ceiling means the robot can attempt pre-taught manipulation tasks (T04, T05, T06, T08) under human supervision but cannot handle exceptions autonomously. Multi-step tasks require human authorization at each major step because the deliberative layer lacks exception-handling maturity to decide independently when to proceed after a step anomaly.

**Not executable even with human-in-loop in 2029:** T10 (SPE shelter return autonomously) and T12 (deliberative joint-failure reconfiguration) require TRL 7 deliberative response — not achievable by 2029 per §A1. The first-article gate is a hardware and locomotion gate, not a task-operations gate.

### 2035 Initial Operational Capability (TRL 7+ in space-relevant environment)

By 2035, the deliberative layer advances to TRL 7 (validated in space-analog environment) and the supervisory layer advances toward TRL 6–7. The autonomy/teleoperation boundary shifts substantially:

**Autonomy-led by 2035:** T01 (prepared path transit), T03 (GPS navigation), T04 (taught sample collection), T06 (ORU replacement in workshop after first run), T07 (inspection surveys), T08 (equipment transport on prepared paths), T10 (SPE shelter autonomous return — TRL 7 reactive), T11 (safe-stop on anomaly), T15 (EVA preparation checklist assistance), T16 (radio telescope calibration — scripted, well-structured), T19 (radiator panel replacement on repeat execution), T20 (terrain mapping).

**Jointly executed by 2035:** T02 (unstructured terrain with human path approval), T05 (panel installation — human authorizes physical engagement at each stage), T09 (tool handoff — human confirmation before physical contact), T13 (science sample at novel site — scientist selects site, robot executes), T14 (anomaly reporting — robot flags, human decides), T17 (pressure breach — robot locates, human decides response).

**Human-led by 2035:** T12 (load-bearing joint failure reconfiguration — requires TRL 8, not available until 2038–2040), T18 (new tool demonstration — always crew-led), and any task explicitly overridden by crew or ground.

**Human value floor — permanently human-required categories:**

1. Authorization of first execution of any task type the robot has not previously performed in the operational environment (not in simulation)
2. All physical contact with suited crew members, including tool handoff (T09), regardless of demonstrated autonomy TRL
3. Any action on pressurized interfaces or life support hardware
4. Emergency responses where the outcome affects whether crew can remain outside the habitat (T17 at highest consequence level)
5. Habitat modification — structural changes affecting pressure integrity or load paths
6. Science priority decisions — which sample to collect, which anomaly to investigate (T13, T14)
7. Any situation the robot itself flags as outside its operational envelope (§A9 position: when the supervisory model withholds action on OOD inputs, a human must decide)

**Two-tier floor structure.** These seven categories divide into two tiers by permanence. **Tier 1 — Permanent, physics-grounded:** Categories 2, 3, 4, and 5 (crew-contact operations, pressurized interface manipulation, habitat breach response, structural modification). The consequence of autonomous error in these categories is irreversible physical harm to crew or habitat; no TRL advance eliminates the need for human authorization. **Tier 2 — IOC program positions, subject to gate revision:** Categories 1, 6, and 7 (first execution authorization, science priority decisions, OOD-response gating). These reflect 2035-era autonomy capability; they are program positions that will be reviewed at the 2037 and 2040 gates as TRL advances. Specific gate criteria: Category 1 migrates to supervised autonomy when the task library covers >95% of encountered conditions; Category 6 when AI scientific advisor systems are validated against ground-truth geologist decisions on held-out datasets; Category 7 when robot uncertainty quantification achieves TRL 6 (calibrated OOD detection). The Tier 1 categories are non-negotiable regardless of model capability; the Tier 2 categories represent the program's current conservative position, not a permanent ceiling on autonomy.

### 2038–2040 Full Operation (TRL 8 qualified in operational environment)

By the 2040 full operation horizon, the TRL 8 deliberative layer unlocks T12 (joint-failure reconfiguration) and advances novelty handling (T13, T14) from jointly-executed to a lighter-touch supervisory model. T17 (pressure breach response) may reach fully autonomous execution with crew notification rather than authorization, depending on mission rule evolution. Tasks T05 and T09 may shift to autonomy-led with crew monitoring rather than jointly executed as task library and operational experience accumulate.

The Tier 1 human value floor (Categories 2, 3, 4, 5) does not shift regardless of TRL advancement — the consequence of autonomous failure is disproportionate and irreversible. The Tier 2 categories (1, 6, 7) are reviewed at the 2037 and 2040 gates per the criteria stated above.

---

## 4. Task Allocation Table

This table is the primary input to the human-factors-teaming section (02-04). The justification for each allocation is in Section 3 above.

| Task | Allocation at IOC (2035) | Allocation at Full Operation (2040) |
|---|---|---|
| T01 — Prepared path transit | **Autonomy-led** (human monitors via telemetry) | **Autonomy-led** |
| T02 — Unstructured terrain to science waypoint | **Jointly executed** (human approves path segments) | **Jointly executed** (lighter oversight, shorter confirmation window) |
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
| T16 — Radio telescope calibration | **Autonomy-led** (scripted calibration protocol; human reviews logs, not execution) | **Autonomy-led** |
| T17 — Habitat breach — locate and report | **Jointly executed** (robot locates, human decides sealing action) | **Jointly executed** or Autonomy-led with notify (depends on mission rules) |
| T18 — New tool demonstration capture | **Human-led** (crew or ground demonstrates) | **Human-led** |
| T19 — Radiator panel replacement | **Autonomy-led** after first supervised run | **Autonomy-led** |
| T20 — Pre-traverse terrain mapping | **Autonomy-led** (human reviews map before long traverse approval) | **Autonomy-led** |

**Supervisor ratio input to human-factors-teaming:** At 2035 IOC, 12 of 20 tasks are autonomy-led; 6 are jointly executed (requiring defined human interaction but not continuous supervision); 2 are human-led. A 4-person crew supervising 3 humanoids executing 2–3 concurrent task chains can manage the authorization load at roughly 1:3 robot-to-active-supervisor ratio during nominal operations. This is a first-order estimate; the human-factors-teaming section (02-04) validates it against cognitive workload models and task duration distributions.

---

## 5. Counter-Case: Do High-Autonomy Humanoids Need Human Supervision?

The serious counter-case: Foundation models trained on internet-scale data and fine-tuned on robot demonstrations are rapidly improving zero-shot task transfer. VLA models (pi-0, OpenVLA \cite{black2024pi0}) demonstrate cross-task generalization in unstructured lab environments. If this trajectory continues, a 2035-vintage model might handle most jointly-executed task categories without human authorization gates. Why build the architecture around human-in-the-loop if autonomy may render it unnecessary?

**Consequence asymmetry.** For tasks in a factory, the consequence of autonomous failure is a bad part and a human walkover to reset. For tasks at a lunar far-side base, the consequence space includes a crew member injured during a tool handoff, a habitat structural element damaged beyond repair in weeks, or a geological sample irreversibly contaminated. The asymmetry between a human authorization gate (2–5 minutes) and an autonomous failure in a high-consequence context is large enough that the burden of proof lies with those who want to remove the gate, not those who want to keep it.

**The Lunokhod lesson runs in both directions.** Soviet engineers operated Lunokhod with full ground-in-the-loop teleoperation and covered 48 km of lunar surface with two vehicles \cite{huntress2011soviet}. The lesson cited for autonomy is that ground-in-the-loop cannot scale. The lesson cited for human supervision is that human operators kept the vehicle operational through sensor degradation and surface anomalies that a rule-based system would have terminated on. The appropriate update is not "therefore full autonomy" but "therefore design the human-autonomy interface to let human judgment act quickly when needed" — which is what the jointly-executed task category implements.

**Exploration is structurally OOD.** A lunar base engaged in scientific fieldwork will routinely encounter geological formations, equipment states, and surface conditions for which no training data exists. Current evidence shows VLA performance degrades near training distribution boundaries in ways the model itself does not reliably identify \cite{zhao2023aloha}. An architecture relying on a model to self-assess whether it is in-distribution is relying on its most poorly calibrated capability. This is not a claim that models will never solve this — it is a claim that they have not solved it by 2026.

### The Task-Redesign Alternative

The 2.78 s RTLT from Earth via Queqiao-2 relay eliminates Earth-based supervision for time-critical operations — but does it follow that forward-deployed humans are required? An alternative is to redesign the jointly-executed tasks to eliminate real-time supervision checkpoints entirely through mechanical interlocks, force-limit parameters, and pre-validated envelopes. Each of the six jointly-executed tasks is assessed below.

**T05 (solar panel installation).** Force-limiting interlocks cannot substitute for human judgment of panel seating on dusty, non-standard surfaces in the first operational years. Pre-validated envelopes are feasible for repeat executions after a 6-month operational baseline; this task is a Tier 2 candidate for migration to autonomy-led after that baseline. Redesign partially succeeds — first-execution authorization remains.

**T09 (EVA tool handoff).** A physical dead-man switch on the crew-member receiving side could theoretically substitute — but only if the crew member is physically present at the handoff point. Earth supervision cannot confirm crew safe positioning in real time within the 5.56 s minimum round-trip exchange. This task cannot be redesigned away from human involvement without compromising crew safety. Redesign fails.

**T13 (science sample selection).** Science priority judgment — which sample to collect at a novel outcrop — is the defining jointly-executed element. Could scripted selection rules substitute? No, because the task is defined by its novelty: the outcrop is unscripted by definition. Tier 2 floor.

**T14 (anomaly reporting).** Pre-validated decision trees could route low-stakes anomalies to autonomous response — a partial redesign that narrows the jointly-executed scope but does not eliminate it. Tier 2 candidate for 2040.

**T16 (radio telescope calibration).** Redesign succeeded: the calibration protocol is scripted, the instrument is pre-mapped, and the procedure is not time-critical at minute timescales. T16 is autonomy-led at IOC per Section 3 and the task allocation table. This is the paradigm case where redesign works.

**T17 (habitat breach — locate and report).** Life-safety, Tier 1. Consequence asymmetry makes autonomous sealing/evacuation decision insufficient at IOC TRL. The locate-and-report portion is autonomy-led; the response decision is not redesign-eligible.

The medical emergency scenario — a crew member with a suit breach, sudden cognitive impairment, or trauma requiring immediate robotic assistance — is the concrete case that no task redesign eliminates. No interlock, parameter envelope, or pre-validated protocol substitutes for a human operator who can improvise in real time with the crew member present. This case, not the jointly-executed task list, is the irreducible argument for forward deployment.

---

## 6. Forward Link to §02-04

This section provides §02-04 with three inputs: the supervisor ratio estimate (1:2–3 at IOC), the task allocation table (12 autonomy-led / 6 jointly-executed / 2 human-led), and the two-tier human value floor. See §02-04.

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
