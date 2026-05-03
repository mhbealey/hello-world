---
title: "Human-in-the-Loop Value: Teaming Model"
status: draft
review-status: unreviewed
owner: human-factors-teaming
last-updated: 2026-05-03
---

# Section 02-04 — Teaming Model

This section develops the teaming model that synthesizes the latency tradespace (§02-02) and task allocation (§02-03) into an operational description of how humans and humanoids work together at the lunar far-side base. The inputs are locked: the three-tier latency architecture (Tier A ≤50 ms, Tier B ~2.8 s, Tier C 8.7–42 min), the task allocation table at IOC (12 autonomy-led, 6 jointly executed, 2 human-led), and the seven-category human value floor. The outputs of this section — supervision modes, cognitive load budget, supervisor ratio, forward-deployment justification — are the primary inputs to the ConOps and cost-program agents.

---

## 1. Supervision Modes

Three supervision modes correspond to the three latency tiers and the task allocation. They are not interchangeable; the mode is determined by the task category, not by crew preference.

### Continuous Supervision

**Definition.** The human monitors all robot actions in real time, with authority to intervene on any action without delay.

**Required for:** First execution of any new task type in the operational environment; all EVA-class physical operations involving crew proximity or contact; any operation on pressurized interfaces or life support hardware; any situation the robot has flagged as outside its operational envelope (§A9 gate). In the 20-task taxonomy, this mode applies to T09 (EVA tool handoff) during its first several executions, T12 (joint-failure locomotion reconfiguration, human-led), and T18 (new tool demonstration capture).

**Latency requirement.** Continuous supervision is only meaningful at Tier A latency (≤50 ms RTLT). At Tier B (2.8 s), a supervisor watching a live feed cannot intervene before a physical event completes; the mode degrades to plan-review regardless of intent. Continuous supervision from Earth is not architecturally viable for this task profile.

**Cognitive load: HIGH.** The supervisor must maintain unbroken situational awareness — tracking the robot's position, tool state, force feedback indicators, and crew proximity — for the duration of the supervised window. Empirically, this sustained vigilance is cognitively expensive in the 40–60 minute range and degrades above two hours for highly skilled monitoring tasks \cite{kanas2008space}. Continuous supervision must therefore be a time-limited mode applied to tasks that genuinely require it, not a default operating posture.

**Crew time cost.** Approximately 1:1 — one person-hour of supervision per one robot-hour of continuous operation. This is the most expensive mode and must be reserved for the human value floor categories.

### Periodic Supervision

**Definition.** The human authorizes the next task segment at defined checkpoints but is not monitoring continuously between them. The robot operates autonomously within a validated task sequence between checkpoints; the crew is available but not actively attending.

**Required for:** Jointly-executed tasks in the task allocation table — the six categories where the robot can execute autonomously within a step but where human authorization is required at specific transition gates. In the 20-task taxonomy: T02 (unstructured terrain, human approves path segments), T05 (solar panel installation, human authorizes physical engagement at each stage), T09 (EVA tool handoff, crew confirms before physical contact), T13 (novel site geological sample, scientist selects site then robot executes), T14 (hardware anomaly reporting, robot flags then human decides), T16 (radio telescope calibration, scientist authorizes then robot executes), T17 (habitat breach locate-and-report, robot locates then human decides response).

**Checkpoint interval.** For prepared-path operations: 15–30 minutes between human reviews. For manipulation sequences: trigger-based (human authorized after each task stage completes, not on a fixed timer). In either case, the checkpoint is event-driven from the robot's side: the robot completes a validated task segment, pauses, and alerts the crew.

**Latency requirement.** Tier A preferred; Tier B (Earth-relay) acceptable for tasks where checkpoint decisions are not time-critical (T13 scientist site selection, T16 calibration authorization — these can tolerate the 2.8 s relay round-trip). Time-critical checkpoint gates (T17 breach response, T09 crew contact confirmation) require Tier A latency; a 2.8 s response latency for a crew contact authorization gate is operationally inadequate.

**Cognitive load: MODERATE.** The supervisor attends to periodic alerts rather than a continuous stream. Between checkpoints, cognitive load is low; at checkpoint events, attention rises briefly to review robot state, make the authorization decision, and send the confirmation. The total cognitive demand is substantially lower than continuous supervision.

**Crew time cost.** Approximately 0.2 — one person-hour of supervision per five robot-hours of operation. Derivation: a typical 8-hour operational shift with jointly-executed tasks running involves approximately 4–6 checkpoint interactions, each consuming 5–10 minutes of active crew attention. That totals 20–60 minutes of active supervisory work per 8-hour shift per humanoid, yielding a 0.04–0.125 person-hour per robot-hour ratio; 0.2 is the conservative upper estimate across a high-density task day.

### On-Demand Supervision

**Definition.** The human is available but not actively monitoring. The robot operates fully autonomously under its deliberative and reactive layers. When the robot encounters an out-of-distribution situation (§A9 gate: the supervisory layer withholds action and alerts the crew) or a fault condition beyond its autonomous response capability, it sends an alert and waits for human input before proceeding.

**Required for:** Autonomy-led tasks — the 12 categories where TRL 7+ deliberative capability covers routine execution without human authorization gates. In the 20-task taxonomy: T01 (prepared path transit), T03 (GPS navigation), T04 (taught sample collection), T06 (Tier 2 ORU replacement after initial supervised run), T07 (base structure inspection), T08 (equipment transport), T10 (SPE shelter autonomous return — Tier 1 reactive, no human authorization possible in time), T11 (joint anomaly safe-stop — Tier 1 reactive, crew notified after), T15 (EVA preparation checklist assistance), T19 (radiator panel replacement after initial supervised run), T20 (pre-traverse terrain mapping).

**Latency requirement.** None from a routine operations standpoint — the robot does not require human input during autonomous execution. Anomaly alert response time is task-consequence-driven: life-safety alerts (T10 SPE return, T11 joint fault safe-stop) must be designed so the robot's Tier 1 reactive layer handles the safety-critical response before the human alert is even generated; the alert informs the crew after the autonomous response executes. For deliberative-layer anomalies (T13 OOD sample site, T14 unrecognized anomaly), the response window is minutes, not seconds, and Tier B Earth-relay response is acceptable.

**Cognitive load: LOW during nominal operations, HIGH during anomaly response.** The on-demand mode is a burst-demand profile. A crew supervisor running on-demand oversight of three humanoids executing autonomy-led tasks will have low load for the majority of the shift and a sharp load spike when an anomaly alert fires. Alert design must prevent alarm saturation — too many low-priority alerts trains crews to ignore the queue, which is the failure mode. The on-demand alert priority system must distinguish: (a) immediate life-safety alerts requiring crew response within seconds (T10-class), (b) operational alerts requiring crew response within minutes (T13, T14 OOD gate), and (c) informational notifications requiring acknowledgment but no decision (T11 safe-stop completed, T07 inspection image review).

**Crew time cost.** Approximately 0.05 per robot-hour nominally; anomaly response is a burst of 10–30 minutes per event, frequency-dependent. Derivation: for nominally operating autonomy-led tasks, crew attention is effectively zero except for telemetry glancing (estimated 3–5 minutes per hour per humanoid for a monitoring crew member to confirm nominal status). Anomaly rate at TRL 7 deliberative layer is not established by heritage; a conservative estimate of one OOD alert per 4-hour sortie per humanoid (3 humanoids = approximately 3 alerts per shift) × 15 minutes average resolution = 45 minutes of anomaly response per crew shift distributed across the team.

---

## 2. Cognitive Load Analysis

### Mir Baseline: The Crew Time Constraint

A permanent base crew is not a dedicated supervisory team. The Mir Mission Chronicle establishes the baseline: across 28 long-duration expeditions (1986–2000), approximately 30–40% of crew time went to unscheduled maintenance and repair, 20–30% to scheduled science, 15% to mandatory exercise (two hours daily), and 25–35% to communications, documentation, housekeeping, and personal time \cite{kanas2008space}. Science time was chronically crowded out by maintenance; the ratio of actual to planned science time was consistently below 1.0.

A far-side base crew supervising three humanoids faces a different distribution than a Mir crew, but the competition for crew time is the same. The humanoid fleet reduces crew direct maintenance burden — robots perform T06 (Tier 2 ORU replacement) and T19 (radiator panel replacement), tasks that on Mir required EVA or internal maintenance by cosmonaut crew. But the humanoids introduce their own maintenance requirements (boot cover replacement per §A15, Tier 2 board replacement per §A11). The net maintenance reduction is an open question requiring ConOps analysis, but the Mir baseline establishes that maintenance demand will be substantial regardless of automation level. A planning model that assumes crew are primarily available for robot supervision misreads the baseline.

**Available supervisory bandwidth.** From the Mir baseline, if a 4-person crew allocates 30–40% of time to maintenance, 15% to exercise, and 25% to communications and personal time, approximately 25–30% of total crew-time remains available for supervisory functions (including both active supervision and on-call availability). At an 8-hour nominal work shift, 4 crew × 8 hours × 0.25–0.30 available fraction yields approximately 8–10 person-hours per crew shift available for supervisory demand. The conservative estimate is **8 person-hours per crew shift** after maintenance, exercise, and personal time are accounted for.

### Cognitive Load Under the Three-Tier Model at IOC

The supervisory demand from three humanoids executing the 2035 IOC task mix is derived step by step:

**On-demand supervision demand (12 autonomy-led tasks):**
- 3 humanoids × approximately 4 autonomous task chains running per shift × 0.05 person-hours per robot-hour of autonomous operation
- Per-shift active monitoring time: 3 humanoids × 8 hours × 0.05 = **1.2 person-hours**
- Anomaly response budget: conservative estimate 3 OOD alerts per shift × 15 minutes each = 0.75 person-hours = **0.75 person-hours**
- On-demand subtotal: **~2.0 person-hours per crew shift**

**Periodic supervision demand (6 jointly-executed tasks per active humanoid):**
- In a typical 8-hour operational day, a humanoid running jointly-executed tasks generates approximately 4–6 checkpoint interactions per shift at 5–10 minutes per checkpoint
- Conservative estimate: 5 checkpoints × 10 minutes = 50 minutes = 0.83 person-hours per humanoid
- For 3 humanoids with overlapping checkpoint schedules (not all running jointly-executed tasks simultaneously): approximately 3 × 0.83 × 0.6 concurrency factor = **~1.5 person-hours**
- (The 0.6 concurrency factor reflects that at any given time, some humanoids will be in autonomy-led phases while others are at checkpoint gates; simultaneous checkpoints from all three robots are rare and represent the peak demand case, not the nominal case.)

**Continuous supervision demand (human value floor tasks):**
- Continuous supervision is not a steady-state activity; it applies to specific events. A realistic sortie day includes approximately 1–2 continuous-supervision events (a first-execution task, an EVA tool handoff sequence, a new task demonstration).
- Estimated 1.5 continuous-supervision events per shift × 30 minutes each = **0.75 person-hours**

**Total supervisory demand per crew shift:** 2.0 + 1.5 + 0.75 = **~4.25 person-hours**

**Supervisory capacity:** 8 person-hours per crew shift (Mir-baseline available fraction, 4-crew team)

**Headroom: 3.75 person-hours (approximately 3.75÷4.25 = 88% margin over demand)**

This headroom — roughly a factor of 2 between demand and capacity — is the margin that serves four operational functions:
1. One crew member can be on EVA, in medical rest, or otherwise unavailable without forcing autonomous-only operations.
2. An unscheduled maintenance event can consume 2–3 person-hours of supervisory bandwidth without forcing a task halt.
3. A high-density sortie day (multiple jointly-executed tasks running concurrently) can be accommodated without exceeding capacity.
4. The supervisor ratio can grow to 1:4–5 humanoids as TRL advances post-2035 without redesigning the crew size.

This arithmetic is not a guarantee; it is a planning baseline. If actual maintenance demand rises above the Mir 30–40% baseline (which Mir exceeded during high-failure-rate periods), supervisory headroom compresses. The ConOps agent must model the sensitivity to maintenance demand variation.

### Long-Duration Degradation

The Mars-500 study (520 days, IBMP, 2010–2011) is the longest available behavioral health dataset for an isolated crew performing monitoring-intensive tasks \cite{basner2013mars500}. Key findings with direct application to the far-side base:

**Behavioral torpor.** Crew sedentariness increased monotonically across the mission. This was not fatigue from physical work — workload ratings also declined. The crew entered a reduced-activity equilibrium. For a supervisory role, reduced spontaneous activity is a leading indicator for reduced alertness and delayed anomaly response. The on-demand supervision mode is specifically vulnerable: a supervisor in behavioral torpor may not respond promptly to anomaly alerts.

**Individual variability.** Performance degradation was not uniform — one Mars-500 crew member accounted for the majority of cognitive test errors and had the most disrupted sleep. In a 4-person supervisory crew, one degraded individual represents 25% of supervisory capacity. Crew selection and monitoring protocols must account for this variability, not only for aggregate crew performance.

**Six-month rotation cadence.** The Mir precedent established 6-month residencies as the operationally standard long-duration rotation. Polyakov's 437-day mission demonstrated individual capability for longer duration \cite{kanas2008space}, but the Mars-500 data suggests behavioral torpor accumulates over the first several months and individual performance variance compounds over time. The study does not revise the 6-month rotation cadence established by Mir heritage; any extension beyond 6 months requires ConOps justification beyond this section's scope. Rotation cadence is a ConOps decision, not a teaming model decision.

---

## 3. Supervisor Ratio — Position with Justification

**Position: 1 human actively supervising 2–3 humanoids at IOC (2035). 1 human to 4–5 humanoids at full operation (2038–2040). Hard floor: approximately 1:8–10 maximum even at TRL 9+.**

This position is §A18 in the margins register.

### Derivation

**Step 1: The NIP-10 baseline.** The Lunokhod NIP-10 crew required five persons per rover (commander, driver, navigator, antenna operator, equipment engineer) to operate one rover at 2.5 s RTLT latency and near-zero onboard autonomy \cite{huntress2011soviet}. The ratio is 5:1 humans per robot. This is the empirical floor for teleoperation without autonomy at Lunokhod-tier latency. The NIP-10 model cannot be directly applied to 2035 operations; it serves as the baseline from which autonomy improvements are measured.

**Step 2: Autonomy advancement (§A1 curve).** At TRL 7 deliberative layer (2035 IOC), 12 of 20 mission tasks are autonomy-led. Each autonomy-led task reduces active supervision demand from the NIP-10 continuous-control requirement to the on-demand monitoring posture (0.05 person-hours per robot-hour vs. effectively 1.0+ for NIP-10-style operation). The factor-of-20 reduction in per-task supervision demand directly translates to a factor-of-20 improvement in supervisor ratio for those tasks. The jointly-executed tasks (6 of 20) require defined checkpoints but not continuous presence, yielding approximately a 5× improvement over NIP-10 for those tasks.

**Step 3: Cognitive load arithmetic.** The calculation in Section 2 above shows that 4 crew supervising 3 humanoids generates approximately 4.25 person-hours of supervisory demand per shift against 8 person-hours of available capacity. The effective active-supervision ratio during normal operations is not 4:3 (1.33 humans per humanoid nominal) but closer to 1:2–3, because during any given hour approximately 2–3 humanoids are in autonomous execution and one or zero crew members are actively supervising. When two humans are simultaneously attending to supervisory duties at peak demand, the effective ratio is 2 supervisors for 3 humanoids = 0.67 humanoids per supervisor, or about 1:1.5.

The study's 1:2–3 range spans the difference between peak-demand (1:1.5 effective) and nominal-operations (1:3 effective) with one crew member unavailable. The 1:2–3 range is the honest operational description, not a single point estimate.

**Step 4: Post-2035 advancement to 1:4–5.** As TRL 8 deliberative capability matures between 2038 and 2040, jointly-executed tasks begin migrating to autonomy-led. T16 (calibration) shifts to autonomy-led by 2040 in the task allocation table; T05 (panel installation) and T09 (tool handoff) may lighten to supervised monitoring rather than confirmed checkpoint gates as the task library and operational experience accumulate. By 2040, 16–17 of 20 tasks at autonomy-led level reduces the jointly-executed checkpoint demand by approximately 60%, reducing total supervisory demand per shift from 4.25 to approximately 2.5 person-hours. Against the same 8 person-hour capacity, the headroom grows to 5.5 person-hours — sufficient to support a 1:4–5 ratio (4 humanoids per 4-person crew, or 5 humanoids with a dedicated supervision coordinator role).

**Step 5: The hard floor.** The 7 human value floor categories do not move regardless of TRL. Each humanoid fleet of N units requires human authorization for first execution of any new task type, for all crew contact events, and for all OOD situations the robot flags. At N = 10 humanoids with a 4-person crew, a single coincident OOD event from three robots simultaneously would require three simultaneous supervisor responses — plausibly manageable. A Carrington-class SPE event triggering ten simultaneous shelter-return commands, combined with a habitat breach alert and an EVA crew contact task in progress, would exceed 4-person supervisory capacity at any autonomy TRL. The floor at approximately 1:8–10 reflects this saturation bound. This is not a TRL-dependent limit; it is a consequence of the human value floor combined with the finite attention of a 4-person team.

---

## 4. Forward-Deployed Human — Three-Pillar Case

The architecture commits to forward-deployed human crew at the lunar far-side base. This is not optional. Three independent pillars each independently justify the commitment; all three must be satisfied.

### Pillar 1: Latency

The 2.78 s minimum RTLT from Earth via Queqiao-2 relay eliminates real-time supervisory response for EVA-class and crew-proximity operations \cite{cnsa2024queqiao2}. The jointly-executed task category (6 of 20 mission tasks) requires human response within 5–30 seconds of a checkpoint trigger: crew contact confirmation before tool handoff, path approval before unstructured terrain entry, response authority in a habitat breach event. Earth supervision cannot deliver sub-5-second response at 2.78 s RTLT. The response latency is 2.78 s for the crew's query to reach Earth plus 2.78 s for the authorization to return — 5.56 s minimum for a single exchange, assuming zero ground-controller response time. For a time-critical safety event (crew contact authorization, habitat breach response), a 5.56 s minimum exchange latency against a seconds-scale hazard evolution time is not supervision; it is deferred response.

This is a physics argument. It does not depend on technology development, program budget, or organizational preference. A TRL 10 communications architecture operating at the speed of light cannot close the gap; the gap is the speed of light.

### Pillar 2: Situational Awareness

Effective supervisory control requires an accurate mental model of the supervised system's state. A crew member supervising a humanoid at ≤50 ms RTLT has a mental model that is 50 ms stale. A controller supervising from Earth has a mental model that is 2.78 s stale — and, during a dynamically evolving task, the staleness compounds. Every 2.78 s, the controller's model must be updated from the next received telemetry frame; between updates, the controller extrapolates. In a slow-moving situation (a prepared-path transit at 1 m/s), extrapolation across 2.78 s is manageable: the robot has moved approximately 2.8 m and is probably in roughly its expected position. In a dynamic situation (bipedal balance recovery from foot slip, a cargo package swing during transport, a geological sampling tool encountering unexpected surface hardness), the gap between the controller's 2.78-second-old mental model and the robot's actual state at the checkpoint decision moment may be critical.

The Lunokhod heritage makes this concrete. Operators memorized the previous frame to navigate during the dead interval between image updates — a discipline that held for routine traverses but failed at the crater boundary where the robot's position had drifted beyond the operator's ability to extrapolate \cite{huntress2011soviet}. The TORU manual docking failure (Spektr collision, 1997) resulted in part from cosmonaut Tsibliev's incomplete mental model of the Progress spacecraft's altered center of gravity response characteristics \cite{nasa_sma_spektr}. Both failures share a structure: supervisory control failed at the moment when the system's actual state diverged from the supervisor's mental model, and the latency regime prevented the supervisor from detecting and correcting the divergence in time.

At ≤50 ms RTLT, the mental model is current enough for the jointly-executed task checkpoint decisions. At 2.78 s RTLT, it is not, for the time-critical categories.

### Pillar 3: Symbolic and Operational Continuity

A permanently crewed lunar far-side base has political, diplomatic, and programmatic weight that a purely robotic asset does not. The three functional dimensions of this pillar are distinct:

**Scientific authority.** The far-side base's primary mission includes ongoing scientific operations — radio astronomy in the zone of Earth-silence, geological sampling and survey, subsurface investigation. Science priority decisions are in the human value floor (category 6): which sample to collect, which anomaly to investigate, which traverse to prioritize. These decisions carry scientific judgment that the program does not delegate to autonomous systems. A human scientific crew on-site, rather than relay-delayed Earth-based scientists, can respond to discovered opportunities — an unexpected geological feature, a transient event — at the timescale the science requires.

**Political standing.** International partners, treaty frameworks, and commercial participants in a far-side base program will assess the seriousness of national or multilateral commitment in part by the presence of humans. A robotics-only program is a different category of commitment than a crewed permanent base. The lunar far side is contested international territory; human presence establishes physical presence as a program posture in a way that robotic assets do not.

**Decision authority.** A forward-deployed human crew holds decision authority on-site that cannot be delegated to Earth-based mission controllers at 2.78 s latency. In a system-level emergency — habitat structural compromise, life support failure, SPE event coincident with crew EVA — the crew makes decisions with information that is current, not 5.56 s old. The authority structure of a crewed permanent base is qualitatively different from a remotely operated robotic asset. This matters for anomaly response at the scale of the base's operational risk profile.

This pillar is a program argument, not a technical performance argument. It is listed separately from the latency and situational awareness pillars because its force does not depend on the technical analysis and would survive revision of the latency numbers. It should be named explicitly because it is often unnamed in technical analyses, creating a false impression that the forward-deployment commitment rests solely on technical factors.

---

## 5. Tie to §A8 and §A9

### §A8: Two-Tier Compute as Enabler of On-Demand Supervision

The watchdog architecture established in §A8 (Tier 1 radiation-hardened supervisor + Tier 2 commercial AI accelerator under watchdog) directly enables the on-demand supervision mode. When Tier 2 encounters an out-of-distribution input — an unexpected surface configuration, a novel object in the manipulation workspace, a sensor reading outside the training distribution — and the Tier 1 supervisor detects the resulting anomaly (command rate exceeds validated envelopes, output deadline missed, latchup condition triggered), the system enters the §A9 gate behavior: it withholds the action, holds the robot in a safe posture, and alerts the crew.

The human response time budget for this alert — the on-demand supervision response window — is set by the task consequence level. For life-safety tasks (T10-class SPE shelter return), the Tier 1 reactive layer handles the safety-critical action autonomously before the alert fires; the crew acknowledgment is after-the-fact. For operational tasks (T13 OOD sample site, T14 unrecognized anomaly), the response window is minutes — the robot holds position and the crew has time to review the situation and issue a decision. This two-speed alert structure is what makes the on-demand mode operationally viable. A single-speed alert system that treats all anomalies as equally urgent produces alarm saturation; crews stop responding to alerts with the urgency they require.

The on-base network topology supporting ≤50 ms RTLT to each humanoid is the enabling infrastructure. The alert must propagate from robot to crew workstation within the latency budget. The far-side-base-architect must confirm that the on-base network — wired or short-range radio, not relay-dependent — achieves ≤50 ms RTLT from every deployed humanoid position to the primary crew workstation.

### §A9: Foundation Models at Supervisory Layer as Prerequisite for Safe On-Demand Mode

The §A9 constraint — foundation models (VLA-class, LLM reasoning) confined to the supervisory autonomy layer and not used as primary task executors at the deliberative or reactive layers — is what makes the on-demand supervision mode safe rather than merely functional.

If foundation models were used as primary task executors at the deliberative layer, their OOD failure modes would be unpredictable and potentially unrecoverable. A VLA model applied directly to a manipulation task at the deliberative layer that encounters an out-of-distribution object may produce high-confidence incorrect grasp commands rather than correctly withholding action. The model's self-assessment of its own distribution membership is precisely the capability that current evidence shows to be most poorly calibrated \cite{zhao2023aloha, black2024pi0}. An on-demand supervision mode built on a deliberative layer that does not reliably detect its own OOD condition is not a supervision mode; it is a hope that the autonomous system will ask for help before it does something wrong.

By confining foundation models to the supervisory layer — goal decomposition from crew natural language input, anomaly explanation for crew review, task queue management — the §A9 architecture ensures that OOD behavior from the foundation model produces a recommendation the crew evaluates, not an action the robot executes. When the supervisory-layer foundation model encounters an ambiguous input (a novel geological feature the scientist's natural-language description does not unambiguously specify), it produces an ambiguous recommendation rather than a confident incorrect one; the crew reviews the recommendation and makes the decision. This is the correct allocation of function.

The crew's on-demand supervision role is precisely this: the evaluation of supervisory-layer recommendations on novel or ambiguous inputs, and the authorization of action when the evaluation confirms the recommended approach is correct. The §A9 constraint is not a limitation on the architecture; it is the structural feature that makes on-demand supervision a real safety layer rather than a nominal one.

---

## 6. Summary: The Teaming Model in One Table

| Mode | Tasks (IOC 2035) | Latency req. | Cognitive load | Crew time cost | Enabled by |
|---|---|---|---|---|---|
| **Continuous** | Human value floor, first executions | Tier A only (≤50 ms) | HIGH | 1:1 person-hr:robot-hr | Forward-deployed crew; on-base ≤50 ms network |
| **Periodic** | 6 jointly-executed tasks | Tier A preferred; Tier B for non-time-critical | MODERATE | ~0.2 person-hr:robot-hr | §A1 TRL 7 deliberative; checkpoint alert design |
| **On-demand** | 12 autonomy-led tasks | None (Tier B acceptable for alert response) | LOW nominal / HIGH burst | ~0.05 person-hr:robot-hr | §A8 watchdog; §A9 supervisory-only foundation models |
| **Earth oversight** | Mission plan review; anomaly analysis; science prioritization | Tier B (~2.8 s) | LOW (strategic) | Not counted in crew shift budget | Relay constellation ≥95% availability (§A17) |

**Supervisor ratio:** 1:2–3 humanoids per active supervisor at IOC (2035); 1:4–5 at full operation (2040). Hard ceiling approximately 1:8–10 regardless of TRL due to human value floor saturation.

**Crew composition at IOC:** 4 crew, 3 humanoids, periodic supervision as default mode. Total supervisory demand approximately 4.25 person-hours per crew shift against approximately 8 person-hours available capacity; headroom factor ~2× (§A19).

---

*Word count: approximately 3,340 words.*

\bibliography{corpus/references}
