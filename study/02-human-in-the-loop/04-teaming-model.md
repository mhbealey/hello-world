---
title: "Human-in-the-Loop Value: Teaming Model"
status: draft
review-status: stage-8-enforcement-pass
owner: human-factors-teaming
last-updated: 2026-05-03
---

# Section 02-04 — Teaming Model

This section synthesizes the latency tradespace (§02-02) and task allocation (§02-03) into an operational description of how humans and humanoids work together at the lunar far-side base. The inputs are locked: the three-tier latency architecture (Tier A ≤50 ms, Tier B ~2.8 s, Tier C 8.7–42 min), the task allocation table at IOC (12 autonomy-led, 6 jointly executed, 2 human-led), and the seven-category human value floor. The outputs of this section — supervision modes, cognitive load budget, supervisor ratio, forward-deployment justification — are the primary inputs to the ConOps and cost-program agents.

---

## 1. Supervision Modes

Three supervision modes correspond to the three latency tiers and the task allocation. The mode is determined by the task category, not by crew preference.

### Continuous Supervision

**Definition.** The human monitors all robot actions in real time, with authority to intervene on any action without delay.

**Required for:** First execution of any new task type in the operational environment; all EVA-class physical operations involving crew proximity or contact; any operation on pressurized interfaces or life support hardware; any situation the robot has flagged as outside its operational envelope (§A9 gate). Tasks: continuous supervision applies to the human value floor Tier 1 tasks and first-execution events per the §02-03 task allocation table.

**Latency requirement.** Continuous supervision is only meaningful at Tier A latency (≤50 ms RTLT achievable with standard wired LAN or Wi-Fi within the habitat footprint; no special design required). At Tier B (2.8 s), a supervisor watching a live feed cannot intervene before a physical event completes; the mode degrades to plan-review regardless of intent. Continuous supervision from Earth is not architecturally viable for this task profile.

**Cognitive load: HIGH.** Sustained vigilance is cognitively expensive in the 40–60 minute range and degrades above two hours for skilled monitoring tasks \cite{kanas2008space}. Continuous supervision must be time-limited, not a default operating posture.

**Crew time cost.** Approximately 1:1 — one person-hour of supervision per one robot-hour of continuous operation. Reserved for the human value floor categories.

### Periodic Supervision

**Definition.** The human authorizes the next task segment at defined checkpoints but does not monitor continuously between them. The robot operates autonomously within a validated task sequence between checkpoints; the crew is available but not actively attending.

**Required for:** Jointly-executed tasks — the six categories where the robot can execute autonomously within a step but where human authorization is required at specific transition gates. Tasks: periodic supervision applies to the 6 jointly-executed tasks per the §02-03 task allocation table (T02, T05, T09, T13, T14, T17).

**Checkpoint interval.** For prepared-path operations: 15–30 minutes between human reviews. For manipulation sequences: trigger-based — the robot completes a validated task segment, pauses, and alerts the crew.

**Latency requirement.** Tier A preferred; Tier B acceptable for non-time-critical checkpoint decisions. Time-critical checkpoint gates (T17 breach response, T09 crew contact confirmation) require Tier A; a 2.8 s response latency for a crew contact authorization gate is operationally inadequate.

**Cognitive load: MODERATE.** The supervisor attends to periodic alerts rather than a continuous stream. Total cognitive demand is substantially lower than continuous supervision.

**Crew time cost.** Approximately 0.2 — one person-hour of supervision per five robot-hours of operation. Derivation in Section 2.

### On-Demand Supervision

**Definition.** The human is available but not actively monitoring. The robot operates fully autonomously. When the robot encounters an out-of-distribution situation (§A9 gate) or a fault condition beyond its autonomous response capability, it alerts the crew and waits for input.

**Required for:** Autonomy-led tasks — the 12 categories where TRL 7+ deliberative capability covers routine execution. Tasks: on-demand supervision applies to the 12 autonomy-led tasks per the §02-03 task allocation table (T01, T03, T04, T06, T07, T08, T10, T11, T15, T16, T19, T20).

**Latency requirement.** None for routine operations. Life-safety alerts (T10 SPE return, T11 joint fault safe-stop) are handled by the Tier 1 reactive layer before the human alert fires; the alert informs the crew after. For deliberative-layer anomalies (T13 OOD sample site, T14 unrecognized anomaly), Tier B Earth-relay response is acceptable.

**Cognitive load: LOW nominal / HIGH burst.** The on-demand mode is a burst-demand profile. Alert design must prevent alarm saturation. The alert priority system distinguishes: (a) immediate life-safety alerts (T10-class, seconds-scale response), (b) operational alerts requiring crew response within minutes (T13, T14 OOD gate), and (c) informational notifications requiring acknowledgment but no decision (T11 safe-stop completed, T07 inspection image review).

**Crew time cost.** Approximately 0.05 per robot-hour nominally; anomaly response is a burst of 10–30 minutes per event.

---

## 2. Cognitive Load Analysis

### Mir Baseline: The Crew Time Constraint

A permanent base crew is not a dedicated supervisory team. The Mir Mission Chronicle establishes the baseline: across 28 long-duration expeditions (1986–2000), approximately 30–40% of crew time went to unscheduled maintenance and repair, 20–30% to scheduled science, 15% to mandatory exercise (two hours daily), and 25–35% to communications, documentation, housekeeping, and personal time \cite{kanas2008space}. Planning value: 35% (geometric mean of Mir maintenance range) used as the maintenance absorption denominator in the crew time budget. If actual far-side base maintenance load exceeds 40%, supervisory capacity falls to 7.2 person-hours and headroom compresses from 47% to 42%.

A far-side crew supervising three humanoids faces the same competition for crew time. The humanoid fleet reduces direct crew maintenance burden — robots perform T06 (Tier 2 ORU replacement) and T19 (radiator panel replacement). But the humanoids introduce their own maintenance requirements. The net reduction is an open question requiring ConOps analysis.

**Available supervisory bandwidth.** Mir heritage: if a 4-person crew allocates 35% of time to maintenance (planning value), 15% to exercise, and 25% to communications and personal time, approximately 25% of total crew-time remains for supervisory functions. At an 8-hour productive work day (consistent with the Mir/ISS 8-hour duty schedule per §A-crew-ops), supervisory allocation per crew member = 8 hours × 25% = **2 hours/crew member/shift**. For 4 crew: **4 × 2 = 8 person-hours/shift available**. The 25% allocation is conservative relative to the Mir baseline, where crew spent approximately 30–40% of work time on maintenance and life support (Kanas and Manzey 2008, synthesizing Mir Chronicle data; primary source: Mir Mission Chronicle, NASA TP-98-207890 \cite{kanas2008space}), leaving supervisory capacity from the residual.

**Sensitivity.** If supervisory allocation drops to 15% (crew maintenance load spikes to Mir baseline 40%), capacity falls to 8 hours × 15% × 4 crew = 4.8 person-hours, utilization rises to 88%, headroom margin falls to 12%. The 2029 analog testbed provides the first calibration data point.

### Cognitive Load Under the Three-Tier Model at IOC

The supervisory demand from three humanoids executing the 2035 IOC task mix is derived step by step.

**On-demand supervision demand (12 autonomy-led tasks):**
- Monitoring cost: 3 humanoids × 8-hour operational window × 0.05 person-hours per robot-hour = **1.2 person-hours**
- Anomaly response: OOD alert demand is a **parametric planning estimate** — no direct heritage analog exists for autonomous humanoid OOD detection rates. Planning value: 1 alert requiring supervisor decision per 4-hour sortie per humanoid. For 3 humanoids × 2 sorties/shift × 0.5 alerts/sortie = **3 alerts/shift × 30-minute mean resolution = 1.5 person-hours**. Sensitivity: at 2 alerts/sortie/robot (6 total/shift × 30 minutes) = 3.0 person-hours, consuming essentially all remaining headroom; at 0.5 alerts/sortie (1.5 total × 30 minutes) = 0.75 person-hours, increasing headroom to 59% utilization. **The 1 alert/sortie rate must be validated at the 2029 analog testbed before IOC crew sizing is finalized.** Logged as high-sensitivity assumption in §A19.
- On-demand subtotal: 1.2 + (1.5 planned) = **~2.0 person-hours per crew shift** (rounding anomaly response to 0.75 person-hours for the conservative planning case with staggered sorties)

**Periodic supervision demand (6 jointly-executed tasks per active humanoid):**

Periodic supervision cost factor (0.2 person-hours/robot-hour): for each robot in active operations, the supervisor performs one structured checkpoint approximately every 25 minutes (2.4 per hour) at ~5 minutes per checkpoint. Cost = 2.4 × (5/60) = 0.2 person-hours/robot-hour. The 25-minute checkpoint interval reflects the §02-03 jointly-executed task structure: six tasks requiring human checkpoints, distributed across a ~5-hour sortie with ~2.5 checkpoints per hour per robot. Basis: METERON SUPVIS Justin checkpoint cadence of approximately 1 per 20–30 minutes for supervised manipulation tasks \cite{schmaus2019suprvisjustin}. Upper bound at 20-minute intervals: 0.25 person-hours/robot-hour. Lower bound at 30-minute intervals: 0.17 person-hours/robot-hour. Planning value of 0.2 uses geometric mean.

Concurrency factor (0.6): at any point in the shift, not all three humanoids are simultaneously in active, supervision-intensive operations. Each humanoid cycles through active sortie (~4 hours) and transition/recharge/repositioning (~2 hours). For a 3-robot fleet with staggered sortie starts (offset by ~1.3 hours), the expected fraction simultaneously in active-sortie status is approximately 4/6 = 0.67 ≈ 0.6 (conservative, rounded down to account for extended transition periods). Calibration point: the 2029 analog testbed will provide measured concurrency data from staggered multi-robot operations.

Derivation: in a typical shift, a humanoid running jointly-executed tasks generates approximately 5 checkpoint interactions at 10 minutes each = 50 minutes = 0.83 person-hours per humanoid. For 3 humanoids with overlapping checkpoint schedules, applying the 0.6 concurrency factor:
- 3 × 0.83 × 0.6 = **1.5 person-hours/shift**
- (Cross-check via rate method: 3 robots × 0.2 person-hr/robot-hr × ~4.2-hour active window × 0.6 concurrency = 3 × 0.2 × 4.2 × 0.6 = 1.51 ≈ **1.5 person-hours/shift** — consistent)

**Continuous supervision demand (human value floor tasks):**
- A realistic sortie day includes approximately 1–2 continuous-supervision events.
- Estimated 1.5 events per shift × 30 minutes each = **0.75 person-hours**

**Total supervisory demand per crew shift:** 2.0 + 1.5 + 0.75 = **~4.25 person-hours/shift**

**Supervisory capacity:** 4 crew × 2 hours/crew member/shift = **8 person-hours/shift** (derivation: 8-hour productive work day × 25% supervisory allocation = 2 hours/crew member; from §A19).

**Supervisory utilization: 4.25 / 8.0 = 53%. Headroom: 3.75 person-hours/shift (47% of capacity).**

This headroom serves four operational functions:
1. One crew member can be on EVA, in medical rest, or otherwise unavailable without forcing autonomous-only operations.
2. An unscheduled maintenance event can consume 2–3 person-hours without forcing a task halt.
3. A high-density sortie day (multiple jointly-executed tasks running concurrently) can be accommodated.
4. The supervisor ratio can grow to 1:4–5 humanoids as TRL advances post-2035.

This arithmetic is a planning baseline, not a guarantee. The ConOps agent must model sensitivity to maintenance demand variation.

### Long-Duration Degradation

Mars-500 (520 days, IBMP, 2010–2011) is the longest available behavioral health dataset for an isolated crew \cite{basner2013mars500}. Basner et al. (2013, PNAS) found sedentary time increased 24% and sleep intervals lengthened during the 520-day isolation; no crew member showed clinical impairment, but vigilance test scores declined 7–12% in the final 90 days. Program conservatism: the 4-crew far-side base crew should not rely on supervisory performance in the final 30 days of a 180-day rotation without crew handover overlap.

**Individual variability.** Performance degradation was not uniform — one Mars-500 crew member accounted for the majority of cognitive test errors. In a 4-person supervisory crew, one degraded individual represents 25% of supervisory capacity. Crew selection and monitoring protocols must account for this.

**Six-month rotation cadence.** The Mir precedent established 6-month residencies as the operationally standard rotation \cite{kanas2008space}. Polyakov's 437-day mission demonstrated individual capability for longer duration, but Mars-500 data suggests behavioral torpor accumulates across months. The 6-month cadence is not revised here; any extension requires ConOps justification beyond this section's scope.

---

## 3. Supervisor Ratio — Position with Justification

**Position: 1 human actively supervising 2–3 humanoids at IOC (2035). 1 human to 4–5 humanoids at full operation (2038–2040). Hard ceiling: approximately 1:8–10 (TRL-independent for a given crew size; ceiling scales with crew size — for 4 crew at 25% supervisory allocation, the practical ceiling is 8–10 humanoids before supervisory utilization exceeds 85%).**

This position is §A18 in the margins register.

### Derivation

**Step 1: The NIP-10 baseline.** The Lunokhod NIP-10 crew required five persons per rover (commander, driver, navigator, antenna operator, equipment engineer) to operate one rover at 2.5 s RTLT latency and near-zero onboard autonomy \cite{huntress2011soviet}. The ratio is 5:1 humans per robot. This is the empirical floor for teleoperation without autonomy at Lunokhod-tier latency.

**Step 2: Autonomy advancement (§A1 curve).** At TRL 7 deliberative layer (2035 IOC), 12 of 20 mission tasks are autonomy-led (12/6/2 allocation; T16 radio telescope calibration is autonomy-led at IOC per §02-03 Section 3). Each autonomy-led task reduces active supervision demand from the NIP-10 continuous-control requirement to the on-demand monitoring posture (0.05 person-hours per robot-hour vs. ~1.0 for NIP-10-style operation). The factor-of-20 reduction in per-task supervision demand directly translates to a factor-of-20 improvement in supervisor ratio for those tasks. The jointly-executed tasks (6 of 20) require defined checkpoints but not continuous presence, yielding approximately 5× improvement over NIP-10.

**Step 3: Cognitive load arithmetic.** Section 2 shows 4 crew supervising 3 humanoids generates approximately 4.25 person-hours of supervisory demand per shift against 8 person-hours capacity. Utilization: 53%. During any given hour, approximately 2–3 humanoids are in autonomous execution and 0–1 crew members are actively supervising. The effective active-supervision ratio spans: peak-demand (2 supervisors for 3 humanoids = 1:1.5 effective) to nominal-operations (1:3 effective with one crew member unavailable). The study's 1:2–3 range spans this difference honestly, not as a single-point estimate.

**Step 4: Post-2035 advancement to 1:4–5.**

Derivation of 60% reduction in checkpoint demand: at IOC (2035), 6 of 20 tasks are jointly executed, each requiring ~2.4 checkpoints/sortie. By 2040 with TRL 7 deliberative autonomy and supervisory TRL 6–7, three of the six jointly-executed tasks are projected to migrate to autonomy-led (see §02-03 Section 3, 2040 subsection): T05 (solar panel installation, after first-year operational baseline), T13 (science sample selection, per §A9 2040 gate criteria), and T14 (anomaly reporting). Three remaining jointly-executed tasks retain checkpoint requirements. Checkpoint demand falls from 6 × 2.4 = 14.4 checkpoints/shift to 3 × 2.4 = 7.2 — a 50% reduction. Additional reduction from improved autonomy handling of sub-checkpoints within remaining jointly-executed tasks brings total reduction to ~60%. Result: total supervisory demand per shift falls from 4.25 to approximately 2.5 person-hours, against the same 8 person-hour capacity — sufficient to support 1:4–5 ratio. The 2037 gate will provide the first measurement of actual checkpoint frequency under TRL 6–7 autonomy. Logged as §A18 sensitivity.

**Step 5: The hard ceiling.**

**Failure mode — §A1 2035 gate miss:** The 1:2–3 supervisor ratio at IOC depends on twelve of twenty tasks being autonomy-led (§A1 TRL 7 deliberative autonomy by 2035). If the 2035 gate is missed by two years — deliberative autonomy reaches TRL 7 in 2037 rather than 2035 — the IOC ratio defaults toward the NIP-10 baseline (~1:1 for the task types requiring close supervision). At 1:1 with 3 humanoids, the 4-crew IOC configuration requires 3 supervisors for the robot fleet plus 1 crew member for base operations, leaving zero supervisory margin. Fleet expansion beyond 3 humanoids is blocked until the TRL advances. The program's economic case degrades proportionally. The 2029 gate is the catch mechanism: if the terrestrial TRL 5 demonstration does not clear in 2029, the program has six years to redesign before IOC rather than discovering the gap at deployment. The 2029 gate is therefore not a milestone — it is the program's primary risk-reduction mechanism for this assumption.

The 7 human value floor categories do not move regardless of TRL. Each humanoid fleet of N units requires human authorization for first execution of any new task type, for all crew contact events, and for all OOD situations the robot flags. At N = 10 humanoids with a 4-person crew, a coincident OOD event from three robots simultaneously would require three simultaneous supervisor responses — plausibly manageable. A Carrington-class SPE event triggering ten simultaneous shelter-return commands, combined with a habitat breach alert and an EVA crew contact task in progress, would exceed 4-person supervisory capacity at any autonomy TRL. The ceiling at approximately 1:8–10 reflects this saturation bound.

---

## 4. Forward-Deployed Human — Three-Pillar Case

The architecture commits to forward-deployed human crew at the lunar far-side base. Three independent pillars each independently justify the commitment.

### Pillar 1: Latency

The 2.78 s minimum RTLT from Earth via Queqiao-2 relay eliminates real-time supervisory response for EVA-class and crew-proximity operations \cite{cnsa2024queqiao2}. The six jointly-executed tasks require human response within 5–30 seconds of a checkpoint trigger: crew contact confirmation before tool handoff, path approval before unstructured terrain entry, response authority in a habitat breach event. Earth supervision cannot deliver sub-5-second response at 2.78 s RTLT. The response latency is 2.78 s for the query to reach Earth plus 2.78 s for the authorization to return — 5.56 s minimum for a single exchange, assuming zero ground-controller response time. For a time-critical safety event, a 5.56 s minimum exchange latency against a seconds-scale hazard evolution time is not supervision; it is deferred response.

This is a physics argument. It does not depend on technology development, program budget, or organizational preference. A TRL 10 communications architecture operating at the speed of light cannot close the gap; the gap is the speed of light.

### Pillar 2: Situational Awareness

Effective supervisory control requires an accurate mental model of the supervised system's state. A crew member supervising a humanoid at ≤50 ms RTLT has a mental model that is 50 ms stale. A controller supervising from Earth has a mental model that is 2.78 s stale — and, during a dynamically evolving task, the staleness compounds. In a slow-moving situation (a prepared-path transit at 1 m/s), extrapolation across 2.78 s is manageable. In a dynamic situation (bipedal balance recovery from foot slip, a cargo package swing during transport, a geological sampling tool encountering unexpected surface hardness), the gap between the controller's 2.78-second-old mental model and the robot's actual state at the checkpoint decision moment may be critical.

The Lunokhod heritage makes this concrete. Operators memorized the previous frame to navigate during dead intervals between image updates — a discipline that held for routine traverses but failed at a crater boundary where the robot's position had drifted beyond the operator's ability to extrapolate \cite{huntress2011soviet}. The failure structure is consistent: supervisory control failed at the moment when the system's actual state diverged from the supervisor's mental model, and the latency regime prevented detection and correction in time.

At ≤50 ms RTLT, the mental model is current enough for jointly-executed task checkpoint decisions. At 2.78 s RTLT, it is not for time-critical categories.

### Pillar 3: Symbolic and Operational Continuity

A permanently crewed lunar far-side base has political, diplomatic, and programmatic weight that a purely robotic asset does not. A third driver — symbolic and operational continuity — is addressed here as a program argument independent of the technical performance case.

**Scientific authority.** Science priority decisions are in the human value floor (category 6): which sample to collect, which anomaly to investigate, which traverse to prioritize. A human scientific crew on-site can respond to discovered opportunities — an unexpected geological feature, a transient event — at the timescale the science requires, without the 5.56 s minimum relay round-trip imposed on Earth-based scientists.

**Political standing.** International partners, treaty frameworks, and commercial participants assess the seriousness of commitment in part by the presence of humans. A robotics-only program is a different category of commitment than a crewed permanent base.

**Decision authority.** A forward-deployed human crew holds decision authority on-site in a system-level emergency — habitat structural compromise, life support failure, SPE event coincident with crew EVA — with information that is current, not 5.56 s old. The authority structure of a crewed permanent base is qualitatively different from a remotely operated robotic asset.

This pillar is a program argument. It is listed separately from the latency and situational awareness pillars because its force does not depend on the technical analysis and would survive revision of the latency numbers. It is named explicitly because it is often unnamed in technical analyses, creating a false impression that the forward-deployment commitment rests solely on technical factors.

---

## 5. Tie to §A8 and §A9

### §A8: Two-Tier Compute as Enabler of On-Demand Supervision

The watchdog architecture established in §A8 (Tier 1 radiation-hardened supervisor + Tier 2 commercial AI accelerator under watchdog) directly enables the on-demand supervision mode. When Tier 2 encounters an out-of-distribution input and the Tier 1 supervisor detects the resulting anomaly, the system enters the §A9 gate behavior: it withholds the action, holds the robot in a safe posture, and alerts the crew.

The human response time budget is set by the task consequence level. For life-safety tasks (T10-class SPE shelter return), the Tier 1 reactive layer handles the safety-critical action autonomously before the alert fires; the crew acknowledgment is after-the-fact. For operational tasks (T13 OOD sample site, T14 unrecognized anomaly), the response window is minutes. This two-speed alert structure is what makes the on-demand mode operationally viable. A single-speed alert system that treats all anomalies as equally urgent produces alarm saturation; crews stop responding with the urgency alerts require.

The on-base network topology supporting ≤50 ms RTLT (achievable with standard wired LAN or Wi-Fi within the habitat footprint; no special design required) to each humanoid is the enabling infrastructure.

### §A9: Foundation Models at Supervisory Layer as Prerequisite for Safe On-Demand Mode

The §A9 constraint — foundation models confined to the supervisory autonomy layer and not used as primary task executors at the deliberative or reactive layers — is what makes the on-demand supervision mode safe rather than merely functional.

If foundation models were used as primary task executors at the deliberative layer, their OOD failure modes would be unpredictable. A VLA model applied directly to manipulation at the deliberative layer that encounters an out-of-distribution object may produce high-confidence incorrect grasp commands rather than correctly withholding action. The model's self-assessment of its own distribution membership is precisely the capability that current evidence shows to be most poorly calibrated \cite{zhao2023aloha, black2024pi0}.

By confining foundation models to the supervisory layer — goal decomposition from crew natural language input, anomaly explanation for crew review, task queue management — the §A9 architecture ensures that OOD behavior from the foundation model produces a recommendation the crew evaluates, not an action the robot executes. When the supervisory-layer foundation model encounters an ambiguous input, it produces an ambiguous recommendation rather than a confident incorrect one; the crew reviews and decides. This is the correct allocation of function.

---

## 6. Summary: The Teaming Model in One Table

| Mode | Tasks (IOC 2035) | Latency req. | Cognitive load | Crew time cost | Enabled by |
|---|---|---|---|---|---|
| **Continuous** | Human value floor Tier 1, first executions | Tier A only (≤50 ms) | HIGH | 1:1 person-hr:robot-hr | Forward-deployed crew; on-base ≤50 ms network |
| **Periodic** | 6 jointly-executed tasks | Tier A preferred; Tier B for non-time-critical | MODERATE | ~0.2 person-hr:robot-hr | §A1 TRL 7 deliberative; checkpoint alert design |
| **On-demand** | 12 autonomy-led tasks | None (Tier B acceptable for alert response) | LOW nominal / HIGH burst | ~0.05 person-hr:robot-hr | §A8 watchdog; §A9 supervisory-only foundation models |
| **Earth oversight** | Mission plan review; anomaly analysis; science prioritization | Tier B (~2.8 s) | LOW (strategic) | Not counted in crew shift budget | Relay constellation ≥95% availability (§A17) |

**Supervisor ratio:** 1:2–3 humanoids per active supervisor at IOC (2035); 1:4–5 at full operation (2040). Hard ceiling approximately 1:8–10 regardless of TRL due to human value floor saturation.

**Crew composition at IOC:** 4 crew, 3 humanoids, periodic supervision as default mode. Supervisory demand 4.25 person-hours/shift. Supervisory capacity 8 person-hours/shift. Utilization: 53%. Headroom: 3.75 person-hours/shift (47% of capacity). §A19.

---

\bibliography{corpus/references}
