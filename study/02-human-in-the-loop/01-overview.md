---
title: "Human-in-the-Loop Value: Overview"
status: draft
review-status: unreviewed
owner: human-factors-teaming
last-updated: 2026-05-03
---

# Section 02-01 — Human-in-the-Loop Value: Overview

## 1. Stating Question (b)

The study's second foundational question is: where does human-in-the-loop add value, and where is it overhead?

This question is stated imprecisely in most robotics and space systems literature. The imprecise version — "should humans be involved in robot operations?" — is useless for program design; the answer is always yes somewhere and no somewhere else. The precise version has three dimensions:

1. **Under what conditions?** What latency tier, what task novelty level, what consequence profile?
2. **For which task categories?** The 20-task taxonomy developed for the far-side base mission provides the specific answer.
3. **At what cost?** Human supervision is not free — it consumes crew time, and crew time at a permanent lunar far-side base is a genuinely scarce resource. The question is not "does supervision add value?" but "does supervision add more value than the crew time it costs?"

The study takes a clear position: human-in-the-loop is a design requirement in a bounded set of conditions, and it is overhead outside those conditions. Conflating the two — treating supervisory involvement as inherently valuable regardless of condition — produces an underperforming architecture. Eliminating it entirely produces an unsafe one. The correct design finds the boundary and enforces it.

---

## 2. The Answer in Brief

Human-in-the-loop adds value under three specific conditions, each carrying independent weight:

**Condition 1: Latency below approximately 200 ms.** The physics of signal propagation set a hard limit on what supervision can accomplish. At latency below 200 ms, an operator perceives robot state and responds to an anomaly within one human reaction cycle (approximately 200–300 ms total, combining detection, decision, and command). Supervision is genuine: the operator can halt, redirect, or intervene before a situation evolves. Above approximately 1 s RTLT, direct teleoperation is degraded for precision manipulation tasks. At 2.8 s RTLT — the minimum achievable via Earth-relay to the lunar far side — the operator's command arrives 2.8 s after the state that triggered it. Supervision at this latency tier is not moment-to-moment oversight; it is plan-review and deferred instruction \cite{sheridan1978teleoperators, huntress2011soviet}. The forward-deployed crew on the far-side base habitat operates at ≤50 ms RTLT to the humanoids; this is the Tier A supervision zone where crew oversight adds genuine real-time value.

**Condition 2: Task novelty outside the robot's trained operational envelope.** Autonomous systems fail at the boundary of their training distribution in ways that neither the system nor a ground observer can fully predict in advance \cite{zhao2023aloha}. Exploration is structurally out-of-distribution: the purpose of a far-side scientific base is to encounter things not previously characterized. A human supervisor provides the OOD detection and decision authority that autonomous systems cannot reliably provide for themselves under these conditions. This is the rationale behind the 7-category human value floor established in the autonomy-TRL-tasking analysis — a floor that does not shrink as TRL advances, because exploration novelty does not diminish with robot maturity.

**Condition 3: Consequence asymmetry — when the cost of authorization delay is low and the cost of error is irreversible or life-safety.** For a jointly-executed task such as EVA tool handoff to a suited crew member, the cost of a human authorization gate is 2–5 minutes of crew time. The cost of a missed collision or contact-force anomaly is potential crew injury. This asymmetry makes the gate worth its cost regardless of how capable the robot's manipulation system becomes. The asymmetry argument also runs in reverse: for autonomy-led tasks such as prepared-path transit (T01), the cost of a human authorization gate is high (it serializes robot operations and forces crew attention to a routine task) and the cost of failure is low (the robot stops safely). Human involvement there is pure overhead.

**Under all other conditions** — Tier B/C latency, routine and repetitive tasks within the operational envelope, consequence-symmetric decisions where the cost of intervention matches or exceeds the cost of autonomous error — human supervision is overhead. This is the study's position and it is stated clearly because the economic case for the humanoid-forward architecture depends on it. A robot fleet that requires continuous human supervision for routine operations provides no leverage over a crew operating without robots; it adds maintenance demand without multiplying capability.

At the 2035 IOC, the task allocation is: 12 of 20 mission tasks are autonomy-led, 6 are jointly executed (requiring defined human interaction at specific gates), and 2 are human-led. This is not a temporary gap to be closed by further autonomy development; the jointly-executed and human-led categories represent the permanent value floor for human presence.

---

## 3. How the Question is Answered

The two preceding sections — Section 02-02 (Latency Tradespace) and Section 02-03 (Autonomy TRL and Task Allocation) — develop the inputs to the teaming model. This section synthesizes their conclusions.

Section 02-02 derives the three-tier latency architecture from physics: Tier A (≤50 ms, forward-deployed crew), Tier B (~2.8 s RTLT, Earth-relay), and Tier C (8.7–42 min, Mars). The critical finding is that the gap between Tier A and Tier B latency is approximately two orders of magnitude, and this gap is qualitative, not quantitative. Tier A enables genuine supervisory control; Tier B enables plan review and deferred instruction; Tier C enables only mission architecture oversight. The Lunokhod NIP-10 heritage anchors Tier B performance: five operators per rover, 2.5 s round-trip latency, frame-advance teleoperation with a 7–21 second image update interval, and a mission-ending failure when a crater rim was not visible in the preceding frame \cite{huntress2011soviet}. This is the best achievable Earth-supervised surface teleoperation at lunar distances, and the far-side base task profile substantially exceeds its capability requirements.

Section 02-03 develops the 20-task taxonomy for far-side base operations, assigns each task a minimum autonomy TRL for unattended execution, and maps the 2035 IOC task allocation between autonomy-led, jointly-executed, and human-led categories. The seven-category human value floor — first execution of any new task type in the operational environment, all physical contact with suited crew, pressurized interface operations, crew-habitat-access decisions, habitat structural modification, science priority decisions, and OOD situations flagged by the robot itself — represents the tasks where human authorization is required not because TRL is low but because the consequence profile demands it.

Section 02-04 (the teaming model) synthesizes these two inputs into three supervision modes — continuous, periodic, and on-demand — and maps each mode to its applicable latency tier, task category, and cognitive load. The three-tier latency model maps to three distinct teaming modes; the task allocation table maps specific tasks to those modes. The supervisor ratio, crew composition, and forward-deployment commitment all derive from this synthesis.

---

## 4. The Forward-Deployed-Human Commitment

The architecture commits to human crew physically present at the lunar far-side base for Tier A operations. This commitment is not optional and it is not a preference argument. It rests on a physics derivation.

The minimum RTLT from Earth to the lunar far side via the Queqiao-2 relay is 2.78–2.92 seconds \cite{cnsa2024queqiao2}. This is a physics floor; no communications technology reduces it. At this latency, a humanoid robot traveling at 1.0 m/s covers 2.8 meters during a single signal transit. A bipedal robot fall — from initial foot slip to ground contact — completes in approximately 0.3–0.8 seconds. A contact force developing at a tool-crew interface reaches injury threshold in milliseconds. An Earth-based operator watching a 2.8-second-old video feed and issuing commands that arrive 2.8 seconds later is not supervising the robot; the operator is reviewing the robot's history and sending instructions for its future. This is not a degraded form of supervision; it is a different activity with a different function.

The task profile of the far-side base requires real-time supervisory oversight for the jointly-executed category. Six of 20 mission tasks — unstructured terrain traverse with human path approval, solar panel installation with physical engagement authorization, EVA tool handoff with crew contact confirmation, novel-site geological sampling with scientist site selection, hardware anomaly investigation with crew decision, and habitat breach locate-and-report with crew response authorization — require human response within seconds to minutes of a checkpoint trigger. Earth supervision at 2.8 s RTLT cannot deliver this. Forward-deployed crew at ≤50 ms on-base latency can.

Earth supervision is not eliminated; it serves a real and important function. Earth-based mission controllers provide mission plan review, science prioritization at the strategic level, anomaly analysis with access to full ground facility expertise, and oversight continuity during crew sleep periods. What Earth supervision cannot provide — and what the architecture does not ask it to provide — is moment-to-moment operational oversight of physically dynamic tasks.

The medical emergency case makes the argument concrete. A crew member on EVA suffers a suit breach. The humanoid is the nearest asset capable of providing first response. From the base habitat at ≤50 ms RTLT, a second crew member can drive the humanoid to the scene, assess via the robot's cameras, and direct manipulation in real time. From Earth at 2.8 s RTLT, the available response is a pre-programmed autonomous emergency protocol — which, at TRL 7 in 2035, may or may not handle the specific scenario correctly. Earth supervision in a medical emergency does not provide a degraded version of the on-base response; it provides a qualitatively different and operationally inadequate response for this task profile.

---

## 5. Preview of Section 02-04

Section 02-04 develops the full teaming model across five areas. First, it defines the three supervision modes — continuous, periodic, and on-demand — with precise cognitive load estimates derived from the Mir crew time baseline (30–40% maintenance absorption, Topic 7 in the Soviet/Russian heritage file) and the Mars-500 behavioral degradation data \cite{basner2013mars500}. Second, it presents the cognitive load analysis across the three latency tiers, with the arithmetic showing why 4 crew and 3 humanoids close the supervisory demand balance at IOC with a 3–4× headroom margin. Third, it defends the supervisor ratio — 1 human to 2–3 humanoids at IOC (2035), advancing to 1:4–5 by full operation (2040) — with the NIP-10 heritage as the 5:1 baseline and the §A1 autonomy curve as the advancement model. Fourth, it states the three-pillar case for forward-deployed humans: latency (physics), situational awareness (mental model currency), and symbolic/operational continuity (political and program weight of crewed presence). Fifth, it ties the teaming model explicitly to the §A8 two-tier compute architecture and the §A9 foundation-model-supervisory-only constraint, showing how these architectural decisions enable the on-demand supervision mode.

---

*Word count: approximately 1,720 words.*

\bibliography{corpus/references}
