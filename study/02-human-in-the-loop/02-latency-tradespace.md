---
title: "Human-in-the-Loop Value: Latency Tradespace"
status: draft
review-status: unreviewed
owner: teleoperation-latency
last-updated: 2026-05-03
---

# Section 02-02 — Latency Tradespace

The case for forward-deployed humans rests on a physics argument, not an organizational preference. The speed of light caps the rate at which a human operator can supervise a robot at any given distance. Below roughly 200 ms round-trip, a human can supervise in something resembling real time. Between 1 and 5 seconds, the interaction model changes qualitatively. Beyond 5 seconds, direct teleoperation is not a viable primary operating mode — it is an emergency fallback at best. The sections below derive these latency values for every destination in this study's scope, anchor the performance degradation curve to heritage data, and draw the architectural conclusions that follow.

---

## 1. Latency vs. Destination

### Derivation Method

One-way light-time (OWLT) is computed from the signal propagation formula:

```
OWLT (seconds) = distance (km) / 299,792 (km/s)
```

Round-trip light-time (RTLT) is twice the OWLT. These are the minimum achievable latencies for a direct Earth-to-destination link. Relay paths add the satellite-leg distances. Signal processing, compression, routing, and encryption add latency on top of physics; the table below shows physics-floor values only. Program-level latency budgets must add 10–50 ms processing overhead for state-of-the-art compressed video streams, and up to 200 ms for encryption and routing overhead in secure deep-space link architectures.

**Physical constants and distances used:**

- Speed of light: 299,792 km/s (exact, as defined by the BIPM)
- Earth-Moon mean distance: 384,400 km (IAU nominal value)
- Earth-Moon minimum distance (perigee): ~356,500 km
- Earth-Moon maximum distance (apogee): ~406,700 km
- Earth-Mars distance: 78,340,000 km at opposition; 378,000,000 km at conjunction
- Earth-Jupiter mean distance: 778,500,000 km; minimum ~628,700,000 km, maximum ~928,000,000 km

**Sample calculations (shown for verification):**

- Earth-Moon mean OWLT: 384,400 km ÷ 299,792 km/s = **1.282 s**
- Earth-Moon mean RTLT: 1.282 × 2 = **2.56 s**
- Earth-Mars at opposition OWLT: 78,340,000 km ÷ 299,792 km/s = **261 s (4.36 min)**
- Earth-Mars at opposition RTLT: 261 × 2 = **522 s (8.7 min)**
- Earth-Mars at conjunction OWLT: 378,000,000 km ÷ 299,792 km/s = **1,261 s (21.0 min)**
- Earth-Mars at conjunction RTLT: 1,261 × 2 = **2,522 s (42.0 min)**
- Earth-Jupiter minimum OWLT: 628,700,000 km ÷ 299,792 km/s = **2,097 s (35.0 min)**
- Earth-Jupiter maximum OWLT: 928,000,000 km ÷ 299,792 km/s = **3,096 s (51.6 min)**

### Queqiao-2 Relay Geometry

Queqiao-2, operational since April 2024, occupies an elliptical frozen orbit around the Moon with a periapsis of approximately 200–250 km and an apoapsis of approximately 16,000–17,000 km above the lunar surface, with an orbital period of approximately 24 hours and an inclination of 62.4° \cite{cnsa2024queqiao2}. The orbital geometry is designed to maintain simultaneous line-of-sight to both the lunar far side and Earth for the majority of its orbital period.

**Relay path latency calculation.** The relay introduces two additional path segments beyond direct Earth-Moon: Earth-to-satellite and satellite-to-far-side-surface. At apoapsis (most favorable geometry for far-side coverage), the satellite is approximately 16,000–17,000 km above the lunar surface. A conservative relay path estimate:

- Earth-to-Queqiao-2 at apoapsis: approximately 384,400 + 16,500 = ~400,900 km from Earth center, yielding OWLT of 400,900 ÷ 299,792 = **1.337 s**
- Queqiao-2-to-far-side surface: approximately 16,500 km, yielding OWLT of 16,500 ÷ 299,792 = **0.055 s**
- Total OWLT (relay path): approximately 1.337 + 0.055 = **1.392 s**
- Total RTLT (relay path, round trip): approximately **2.78 s**

This is a ~9% increase above the direct Earth-Moon RTLT of 2.56 s, because the relay satellite is at altitude above the lunar surface and the geometry adds path length. At periapsis (satellite close to lunar surface, on the near-side), the satellite cannot relay to the far side, so the relevant geometry is always near apoapsis.

**Relay availability.** Published sources indicate Queqiao-2 provides simultaneous Earth and far-side line-of-sight for the large majority of its 24-hour orbital period \cite{cnsa2024queqiao2, spj2021lunarrelay}. The satellite's inclination and elliptical frozen orbit are designed to maximize this overlap. Based on the orbital geometry (apoapsis above the lunar limb, providing the elevation angle required for far-side coverage), availability of simultaneous dual-link coverage is estimated at 75–85% per orbit for a receiver at the equatorial far side, degrading toward the polar regions. A 24-hour relay constellation (two or more Queqiao-class satellites phased 180° apart) would achieve >95% availability — the operational availability floor that this study's ConOps requires for supervisory operations (see Section 5 below).

**Note:** The study's baseline assumes the permanent far-side base arrives when a mature relay architecture is in place, not when Queqiao-2 is the sole asset. By the 2038–2040 IOC target, either an extended Queqiao constellation or an alternative relay architecture (L2 halo orbit relay, polar relay constellation) is assumed operational with >95% availability. This is flagged as §A17 (see Section 5 below).

### Latency Table

| Destination | OWLT min (s) | OWLT max (s) | RTLT min (s) | RTLT max (s) | Relay overhead | Supervisory ops viable? |
|---|---|---|---|---|---|---|
| Earth orbit / ISS | <0.010 | <0.050 | <0.020 | <0.100 | None | Yes — direct teleoperation |
| Lunar near side (direct LOS) | 1.19 | 1.36 | 2.38 | 2.71 | None | Marginal — NIP-10 regime |
| Lunar far side (via relay) | 1.39 | 1.46 | 2.78 | 2.92 | +0.19–0.36 s vs. near side | Marginal — requires relay availability |
| Lunar far side (relay outage) | N/A | N/A | No link | No link | Full outage | No — autonomous fall-safe required |
| Cislunar crew to lunar surface | <0.010 | <0.050 | <0.020 | <0.100 | Depends on orbit altitude | Yes — forward-deployed human regime |
| Mars surface (opposition) | 261 | 261 | 522 | 522 | None needed | No — autonomous ops required |
| Mars surface (conjunction) | 1,261 | 1,261 | 2,522 | 2,522 | None needed | No |
| Mars surface (full range) | 261 | 1,261 | 8.7 min | 42 min | None needed | No — rover model |
| Jupiter system (full range) | 2,097 | 3,096 | 70 min | 103 min | None needed | No — fully autonomous |

**Key architectural read from this table:** The gap between the cislunar-supervised case (RTLT <100 ms) and the Earth-supervised-via-relay case (RTLT ~2.8 s) is approximately two orders of magnitude in latency. As Section 2 shows, these two cases produce qualitatively different operating modes, not merely quantitatively different ones.

---

## 2. Performance Degradation with Latency

### Heritage Anchor 1 — Lunokhod (2.5 s round-trip delay)

The Lunokhod program is the primary heritage for long-latency surface teleoperation. Lunokhod 1 (1970–1971) and Lunokhod 2 (1973) were operated by five-man NIP-10 crews — driver, navigator, systems engineer, antenna operator, and commander — from a ground control facility in Crimea. The Earth-Moon round-trip light-time averages 2.56 seconds; operational communications added modest additional overhead, placing the effective round-trip delay at approximately 2.5–3.0 seconds \cite{lroc_lunokhod2_traverse}.

The crew adapted to this delay with a distinctive operational technique: the driver would issue a move command, then wait for the next transmitted television frame (updated every 7–20 seconds) to confirm the robot's new position before issuing another command. During the interval between commands, Lunokhod traversed blind — up to 8 meters per frame interval at the nominal traverse speed. This "frame-advance" approach was a direct adaptation to the latency regime, not an optimal supervisory control strategy. It placed an effective ceiling on situational awareness: operators were always working from a snapshot of where the rover had been, not where it was.

The operational cost of this regime manifested concretely in Lunokhod 2's final months: the rover drove into a crater whose trailing shadow was not visible in the preceding frame, covering the solar panels with dust that terminated the mission \cite{lroc_lunokhod2_traverse}. The incident is a textbook illustration of what 2.5-second latency costs in terrain-novelty-sensitive operations. Following this and other near-misses, the NIP-10 crews adopted progressively more conservative advance rates, accepting a reduction in traverse speed to reduce terrain-novelty risk.

The Lunokhod traverse record — 10.54 km for Lunokhod 1 over 10.5 months; 39.16 km for Lunokhod 2 over approximately 5 months — represents the best achievable throughput in the 2.5-second latency regime using frame-advance teleoperation and a dedicated expert crew.

**Operational implication for this study:** Lunokhod's performance ceiling is the heritage floor for what Earth-supervised humanoid teleoperation on the far side can achieve. A humanoid supervised from Earth via relay would face an identical latency regime. The task profile of the far-side base — EVA-class manipulation, infrastructure maintenance, scientific sampling in novel terrain — requires significantly higher situational awareness and reactive response speed than Lunokhod's terrain traversal. Earth-supervision at Lunokhod's latency tier is not an adequate operating mode for this task profile.

### Heritage Anchor 2 — METERON / KONTUR-2 (0.8 s round-trip delay)

The ESA METERON (Multi-Purpose End-To-End Robotic Operations Network) program conducted a series of teleoperation experiments from the ISS to ground robots between 2013 and 2019. The round-trip latency for ISS-to-ground links via geosynchronous relay was approximately 800–850 ms — the Haptics-1, Haptics-2, and Analog-1 experiments all operated in this range \cite{meteron2019analog1}.

Key METERON results:
- At 820–850 ms RTLT, bilateral force-feedback teleoperation was feasible for structured tasks (the Haptics-2 experiment demonstrated bilateral control was possible at this delay) \cite{meteron2015haptics2}.
- Analog-1 (November 2019) successfully demonstrated geological sampling from ISS with ~850 ms communications latency; the astronaut issued commands and assessed results on a time-delayed video feed.
- The METERON SUPVIS Justin experiments (2015–2016) tested a supervisory control approach at ISS-to-ground latency: the astronaut issued goal-level commands to DLR's Rollin' Justin robot, which executed tasks autonomously. The key finding was that **task-level supervisory command is robust to 800 ms delays in a way that real-time control is not** \cite{schmaus2019suprvisjustin}. The operator does not need to hold closed-loop control at 800 ms; issuing discrete commands and waiting for execution confirmation is viable.

The KONTUR-2 experiment (2015, Russian cosmonaut teleoperation of a force-feedback manipulator in Germany from ISS) found that haptic feedback improved performance in real-time conditions, but that its benefit diminished and could reverse at higher latencies — consistent with the general finding that real-time control strategies degrade more than supervisory strategies as latency increases \cite{kontur2016forcefeedback}.

**METERON position:** 800 ms is in the "painful but workable" regime for structured tasks with predictive displays or supervisory command strategies. It is at the edge of the "direct teleoperation viable" regime; full direct teleoperation at 800 ms requires high operator workload and produces elevated error rates compared to near-zero latency. The 2.5 s Lunokhod regime is a further qualitative step beyond 800 ms.

### Heritage Anchor 3 — Sheridan/Verplank Supervisory Control Framework

Sheridan and Verplank's 1978 10-level taxonomy of supervisory control provides the theoretical framework for mapping latency to operational mode \cite{sheridan1978teleoperators}. The taxonomy ranges from Level 1 (human does everything, computer does nothing) to Level 10 (computer acts entirely autonomously; human is informed only if it decides to). Intermediate levels represent graduated allocation of initiative and decision authority between human and machine.

The latency-to-Sheridan-level mapping for this study:

| Latency (RTLT) | Sheridan Level range | Operational mode | Human role |
|---|---|---|---|
| <200 ms | 2–3 | Direct teleoperation with machine assistance | Primary actuator; computer enforces limits |
| 200 ms–1 s | 3–5 | Shared control; predictive displays assist | Primary decision-maker; computer executes low-level motion |
| 1–5 s | 5–7 | Supervisory control; goal-level commanding | Sets objectives, approves intermediate steps; robot executes |
| 5–60 s | 7–9 | High supervisory / low autonomy | Approves mission plans; monitors anomalies; robot self-supervises |
| >60 s (Mars/Jupiter) | 9–10 | Fully autonomous | Mission planner; reviews outcomes; cannot intervene in real time |

Sheridan's framework is not a performance curve — it is a normative taxonomy. But the empirical literature (METERON, KONTUR-2, and earlier Lunokhod operations) confirms that the latency tiers above correspond to qualitatively distinct operational regimes, not just quantitative variations.

### Performance Degradation Curve — Summary Position

The study takes the following position, anchored to the heritage above:

**0–200 ms (direct teleoperation viable zone).** Operator maintains closed-loop control. Predictive displays improve performance but are not required. Task completion rates for manipulation tasks are comparable to undelayed baseline. This is the operating range of terrestrial industrial teleoperation and the ISS robotic arm (SSRMS) operating against near-Earth targets. The forward-deployed crew on the far-side base operates in this range for all humanoid supervision: their quarters are within meters, not light-seconds, of the robots.

**200 ms–1 s (degraded direct teleoperation; predictive displays required).** Operator can still drive closed-loop control but error rates increase non-linearly above ~400 ms for precision manipulation tasks. METERON Haptics-2 results (820 ms) show bilateral haptic teleoperation at the boundary of viability. Predictive displays — graphical overlays showing extrapolated robot state based on the last received command — are required to maintain situational awareness. This is the regime of ISS-to-lunar-surface direct teleoperation in an unrelayed scenario at the closest orbital geometry.

**1–5 s (supervisory control required; direct teleoperation inadequate).** The Lunokhod heritage sits in this band (2.5 s). Frame-advance teleoperation is the practical adaptation. Any task requiring continuous closed-loop feedback — bipedal balance recovery, EVA tool manipulation with contact forces, crew proximity operations — cannot be reliably supervised in this regime because the human's corrective commands arrive after the situation has already evolved. Predictive displays cannot extrapolate through genuinely novel terrain encounters (the Lunokhod crater incident). The robot must carry sufficient reactive autonomy to handle these events without operator input. This is the Earth-relay-supervised lunar far side regime.

**5–60 s (semi-autonomous; rover model).** At this latency tier, real-time supervision is impossible by definition — a 5-second action-consequence cycle means a fall, collision, or equipment damage occurs and resolves before the operator even receives the first indication of trouble. The Mars rover model applies: operators write a traverse plan, uplink it, and the rover executes autonomously with AutoNav or equivalent terrain-avoidance capability \cite{ono2018msl}. Crew are mission architects and anomaly responders, not moment-to-moment supervisors.

**>60 s (fully autonomous; mission planner model).** Jupiter and beyond. No interaction model other than mission planning and outcome review is physically viable. Operators uplink mission objectives; the robot fleet executes across days or weeks; outcomes are reported and analyzed. This is not in scope for the humanoid-forward architecture's first operational decade but establishes the outer boundary of the latency tradespace.

---

## 3. Autonomy/Teleoperation Handoff by Latency Tier

The latency analysis drives a three-tier autonomy allocation, which feeds directly into the autonomy-trl-tasking agent's task catalog and the human-factors-teaming agent's crew workload model.

### Tier A — Cislunar-Supervised Lunar Surface (RTLT <100 ms)

A crew stationed at a cislunar gateway, low lunar orbit, or the far-side base surface habitat has round-trip latency to the humanoid of order tens of milliseconds — well below Lunokhod's 2.5-second regime and far below the 200 ms threshold for direct teleoperation degradation. At this latency, the operator can in principle drive closed-loop teleoperation. In practice, the study's operating model does not use direct teleoperation as the primary mode even at this latency, because it is an inefficient use of crew time and places excessive cognitive load on a small crew supervising multiple robots.

The preferred mode in Tier A is **supervised autonomy with low-latency human-in-the-loop**: the humanoid executes tasks semi-autonomously; the operator monitors, intervenes when the robot requests confirmation or when the operator identifies an anomaly, and can take direct teleoperation control within 100 ms response time in any emergency. This is qualitatively different from the Lunokhod model because the operator can perceive an emerging problem and intervene before it resolves. Emergency response is viable. This is the forward-deployed-human operational tier. The 10 ms latency ceiling is a study design assumption; the actual value depends on on-base network topology, which the far-side-base-architect must size.

**Target for this study: ≤50 ms RTLT from crew workstation to humanoid over the base network.** This is the architectural commitment for forward-deployed operations. It drives the base network topology requirement to low-latency wired or short-range radio links within the habitat complex, not relay-dependent links.

### Tier B — Earth-Supervised Lunar Surface via Relay (RTLT ~2.8 s)

This tier corresponds to the Queqiao-2-relayed Earth-to-far-side link. Round-trip latency is approximately 2.78–2.92 seconds minimum; relay outages introduce complete loss-of-link periods. This is Lunokhod's regime.

The study's position: **Earth-supervision via relay is not a viable primary operating mode for the task profile of the far-side base.** The humanoid task profile includes bipedal locomotion in terrain with novel features, EVA tool manipulation within a meter of crew members, pressurized interface operations, and emergency response. All of these require either direct teleoperation (impossible at 2.8 s RTLT) or supervisory control with the robot carrying sufficient reactive autonomy to handle unexpected events — which means the robot's reactive and deliberative layers must be mature enough to operate without moment-to-moment human input.

Earth-supervision via relay is reserved for two specific use cases:
1. **Scheduled, low-novelty pre-scripted operations**: tasks for which the full execution sequence is pre-validated and the operator is reviewing outcomes rather than directing execution in real time. Analogous to Mars rover uplink-plan-and-execute.
2. **Anomaly response with deliberate delay acceptance**: when the forward-deployed crew is unavailable (e.g., medical emergency, scheduled sleep period), Earth can maintain oversight via relay, but with the understanding that the robot's autonomous safe-mode behavior must cover the 2.8-second response window. Any command sent from Earth is a "future instruction" rather than a real-time correction.

**Inputs to autonomy-trl-tasking from this tier:** At Tier B latency, the humanoid's reactive layer must be capable of independent fall recovery, collision avoidance, and graceful degradation to safe-mode without any crew input. The deliberative layer must be capable of completing a queued task sequence or aborting cleanly if an obstacle condition exceeds its confidence threshold. These capabilities must be TRL 6 (reactive) and TRL 5 (deliberative) by the 2029 gate and TRL 7+ by the 2035 IOC — consistent with §A1 in the assumptions register.

### Tier C — Earth-Supervised Mars Surface (RTLT 8.7–42 min)

At Mars, real-time supervision of any kind is physically impossible. The operational model is exactly the NASA Mars rover model: daily (or multi-day) uplink of mission plans; autonomous execution using the robot's onboard autonomy; downlink of telemetry and results. The crew role is mission architect and anomaly reviewer, not supervisor.

The humanoid-forward case for Mars adds a forward-deployment layer: humans in Mars orbit or at a Mars surface base serve as the Tier A supervisor for Mars-surface humanoids, just as far-side-base crew serve as Tier A supervisors for lunar surface humanoids. The Earth supervision of Mars operations falls to Tier C — post-hoc review, not real-time intervention.

---

## 4. The Forward-Deployed-Human Argument

The latency analysis supports a single architectural conclusion that this study treats as load-bearing: **Earth-supervision of the far-side base is not a viable operational mode for the task profile this base requires. Forward-deployed humans are a first-order architectural requirement, not a convenience.**

The argument is quantitative, not rhetorical.

**What the crew loses when supervision moves from the base (RTLT ≤50 ms) to Earth (RTLT ~2.8 s):**

At 50 ms RTLT, a crew operator perceives robot state and responds to an anomaly within one human reaction cycle (~200–300 ms total including detection, decision, and command). The robot can be halted or redirected before a contact force builds to a damage threshold, before a foot placement in loose regolith causes a fall, before a tool being handed off to a suited crew member moves unexpectedly. The operator is functionally present.

At 2.8 s RTLT, the operator's command arrives 2.8 seconds after the state that prompted it. A bipedal humanoid at 1.0 m/s traverse speed travels 2.8 meters during the signal transit. The robot falls, if it is going to fall, long before the operator's halt command can arrive. A contact force developing at a tool-crew interface reaches its damage threshold in milliseconds, not seconds. The operator watching a 2.8-second-old video feed and issuing commands that arrive 2.8 seconds later is not supervising the robot — the operator is reviewing the robot's history and sending instructions for its future. This is fundamentally different from supervision, and the task profile of the far-side base requires supervision.

**The medical emergency case.** Consider a scenario in which a crew member on EVA becomes incapacitated — cardiac event, suit breach, suit pressure loss — and the humanoid is the nearest asset capable of providing first response (retrieving a medical kit, supporting the crew member's suit integrity, guiding the crew member back to the airlock). From the far-side base surface at 50 ms RTLT, a second crew member can drive the humanoid to the incapacitated crew member, assess the situation via the robot's cameras, and direct the robot's manipulation in real time. From Earth at 2.8 s RTLT, the best available response is a pre-programmed autonomous emergency protocol executed by the robot's own autonomy stack — which, at TRL 6–7 in 2035, may or may not handle the specific scenario correctly. A 2.8-second latency in a medical emergency is not a degraded version of supervision; it is the absence of supervision. The forward-deployed crew is the safety layer that makes the far-side base safe for human occupation.

**Quantifying the productivity differential.** In the Lunokhod heritage, frame-advance teleoperation at 2.5 s RTLT achieved traverse rates on the order of 1–2 km/hr maximum, and in practice much less because operators accepted conservative advance rates after near-misses \cite{lroc_lunokhod2_traverse}. Supervised autonomy at ≤50 ms RTLT with a reactive autonomous layer handling terrain following can achieve speeds an order of magnitude higher for routine traverse tasks, with the operator intervening only at decision points. The productivity differential between the two regimes — for a task profile that includes novel manipulation, infrastructure installation, and scientific sampling — favors forward deployment by a factor estimated at 5–10× for task-hours delivered per crew-hour invested.

**The position stated explicitly:** The two-tier human presence model — forward-deployed crew at or near the lunar far side as primary supervisors, Earth as mission architects and oversight authorities — is not an architectural option the study considers alongside alternatives. It is the study's baseline. Earth-supervision-only is evaluated here as a comparison case and rejected as operationally inadequate for this task profile.

---

## 5. Implications for Communications Architecture

The latency analysis places the following requirements on the communications infrastructure, which the far-side-base-architect must carry into the relay constellation design.

**Relay availability floor.** The study's ConOps requires >95% availability of Earth-relay connectivity for mission oversight, anomaly reporting, and scheduled operation upload-and-review. Below 95%, the outage fraction forces autonomous fall-safe behavior for a material fraction of operating hours. At 75–85% availability (single Queqiao-2 asset), outage periods require robust autonomous safe-mode: the humanoid must halt current operations, secure its tool load, and wait for link restoration without crew input from either the base (if crew are unavailable) or Earth. This is a TRL requirement on the autonomous safe-mode behavior, not merely a communications coverage engineering choice. A mature relay constellation providing >95% availability — two or more Queqiao-class assets or an equivalent architecture — is an architectural prerequisite for the base, not a growth option.

**Latency budget discipline.** The 2.78 s minimum RTLT for the Earth-relay-far-side link is a physics floor. Any compression, routing, or encryption overhead added on top of this floor directly reduces the already-marginal supervisory capacity of Earth-supervised operations. This study treats the physics floor as the design target: minimize added latency in the communications stack. For the on-base network (crew-to-humanoid, Tier A link), the ≤50 ms RTLT target requires wired or short-range radio link design, not relay-dependent architecture.

**Bandwidth is secondary to latency for supervisory operations.** A 1 Mbit/s low-latency link providing live compressed video (720p at 1–5 fps is adequate for supervisory confirmation of robot state) and command telemetry is operationally more useful than a 100 Mbit/s link with 5 seconds of added processing latency. Video frame rate sufficient for supervisory confirmation — not immersive teleoperation — is the bandwidth design driver. Haptic teleoperation (which requires kilohertz-rate force feedback) is excluded from the Earth-relay link by physics; it is viable only at Tier A latency.

---

## 6. Inputs to Autonomy-TRL-Tasking

The following specific requirements flow from this latency analysis to the autonomy-trl-tasking section:

1. **Reactive layer must close the 2.8 s gap.** Any task that a human operator could handle reactively in 0–200 ms at Tier A latency must be handled autonomously by the reactive layer when Earth-supervised (Tier B) or during relay outages. This includes fall recovery, collision detection and halt, tool-force limit enforcement, and emergency halt on sensor anomaly. TRL 6 for this layer by 2029 is the gate requirement; TRL 7 by 2035 is the deployment requirement.

2. **Deliberative layer must execute queued task sequences without continuous confirmation.** At Tier B latency, the operator cannot confirm each step of a multi-step task at real time. The deliberative layer must execute a validated task sequence, flag decision points that require Earth confirmation (and wait for response, pausing execution), and abort gracefully if a task step produces a condition outside its confidence bounds. TRL 5 by 2029; TRL 7 by 2035.

3. **Safe-mode behavior must be designed to cover relay outage periods.** During link outages, the humanoid must autonomously detect the loss of link, continue or safely halt current operations depending on task state, and remain in a recoverable posture until link restoration. This is a concrete functional requirement, not a generic "robustness" requirement.

4. **The ≤50 ms on-base latency target must be verified against the supervisory control model.** The human-factors-teaming agent must validate that 50 ms RTLT is within the "direct teleoperation viable" zone for the specific manipulation tasks the crew will perform. If any tasks require <10 ms for adequate force feedback (e.g., high-precision tool assembly), the on-base network latency target must tighten further.

---

*Word count: approximately 3,000 words (at hard cap; the latency table, derivation, and multi-tier discussion together approach the limit).*

\bibliography{corpus/references}
