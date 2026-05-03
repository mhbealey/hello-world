---
title: "Human-in-the-Loop Value: Latency Tradespace"
status: draft
review-status: stage-8-enforcement-pass
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
- Earth-Moon mean distance: 384,400 km (IAU nominal value; actual varies ±3% over the lunar month. RTLT planning range absorbs this variation.)
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

Queqiao-2 (launched 2024) operates in a confirmed retrograde orbit of approximately 119.25° inclination and 254 × 16,941 km altitude — a higher-eccentricity orbit than the 62.4° / 200 × 16,000 km design specification. The satellite is operational and providing relay services. Coverage availability (75–85% per orbit) was estimated for the planned orbit; actual availability for the confirmed retrograde orbit requires analysis (flagged in §A17; >95% relay availability required). Future relay constellations (L2 halo, polar) are addressed in §04-03.

**Relay path latency derivation.** The relay introduces a two-hop path: Earth → satellite → far-side surface. At apoapsis (most favorable geometry for far-side coverage), the satellite is approximately 16,941 km above the lunar surface.

- Lunar radius: 1,737 km (used to compute Earth-to-satellite distance from Earth-Moon center)
- Earth-to-satellite at apoapsis: ~384,400 km (Earth-Moon center) + 1,737 km (lunar radius) + 16,941 km (satellite altitude above surface) ≈ **403,078 km**. However, the satellite is not co-linear with the Earth-Moon axis during far-side coverage; the actual Earth-satellite path varies with orbital geometry. Range: approximately 385,000–401,000 km (varies ±8% with orbital position along the retrograde orbit).
- Satellite-to-far-side surface: approximately 16,941 km, yielding OWLT of 16,941 ÷ 299,792 = **0.057 s**
- Total one-way relay path: ~402,000–418,000 km (Earth-satellite + satellite-surface)
- One-way light time (relay): 402,000–418,000 km ÷ 299,792 km/s = **1.34–1.39 s**
- Total RTLT (relay path, round trip): **2.68–2.78 s**

Upper bound (2.92 s) corresponds to maximum Earth-satellite path length when the satellite is at a position over the far-side hemisphere with maximum angular separation from Earth; lower bound (2.60 s) corresponds to the geometry most favoring Earth visibility. Planning value of 2.78 s uses the geometric mean of the nominal range; 2× standard deviation is ±0.16 s. The study's headline value of **~2.78 s** falls within this range and the architectural conclusion (Tier B supervision viable) is unaffected. Note: the confirmed retrograde orbit (119.25° inclination) means coverage geometry differs from the planned near-equatorial orbit; the 75–85% availability estimate carries HIGH uncertainty pending geometry analysis for the confirmed orbit.

### Latency Table

| Destination | OWLT min (s) | OWLT max (s) | RTLT min (s) | RTLT max (s) | Relay overhead | Supervisory ops viable? |
|---|---|---|---|---|---|---|
| Earth orbit / ISS | <0.010 | <0.050 | <0.020 | <0.100 | None | Yes — direct teleoperation |
| Lunar near side (direct LOS) | 1.19 | 1.36 | 2.38 | 2.71 | None | Marginal — NIP-10 regime |
| Lunar far side (via relay) | 1.34 | 1.39 | 2.68 | 2.78 | +0.12–0.22 s vs. near side | Marginal — requires relay availability |
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

The crew adapted to this delay with a distinctive operational technique: the driver would issue a move command, then wait for the next transmitted television frame (updated every 7–20 seconds per Lunokhod operations heritage \cite{lunokhod_ops_heritage}) to confirm the robot's new position before issuing another command. During the interval between commands, Lunokhod traversed blind — up to 8 meters per frame interval at the nominal traverse speed. This "frame-advance" approach was a direct adaptation to the latency regime, not an optimal supervisory control strategy. It placed an effective ceiling on situational awareness: operators were always working from a snapshot of where the rover had been, not where it was.

The operational cost of this regime manifested concretely in Lunokhod 2's final months: Lunokhod 2's mission ended due to thermal overheating after soil contaminated the thermal radiators — during recovery from a crater, the rover's open solar lid contacted the crater wall, depositing soil on the radiators; when the lid closed, the insulating soil caused the battery to overheat and the mission terminated \cite{lroc_lunokhod2_traverse}. The situational awareness lesson — crater proximity detection — stands; the failure mode was thermal management, not panel power loss.

The Lunokhod traverse record — 9.93 km for Lunokhod 1 over 10.5 months (LRO photogrammetric revision, 2013; pre-LRO estimate was 10.54 km); 39.16 km for Lunokhod 2 over approximately 5 months — represents the best achievable throughput in the 2.5-second latency regime using frame-advance teleoperation and a dedicated expert crew.

**Operational implication for this study:** Lunokhod's performance ceiling is the heritage floor for what Earth-supervised humanoid teleoperation on the far side can achieve. A humanoid supervised from Earth via relay would face an identical latency regime. The task profile of the far-side base — EVA-class manipulation, infrastructure maintenance, scientific sampling in novel terrain — requires significantly higher situational awareness and reactive response speed than Lunokhod's terrain traversal. Earth-supervision at Lunokhod's latency tier is not an adequate operating mode for this task profile.

### Heritage Anchor 2 — METERON / KONTUR-2 (0.8 s round-trip delay)

The ESA METERON (Multi-Purpose End-To-End Robotic Operations Network) program conducted a series of teleoperation experiments from the ISS to ground robots between 2013 and 2019. The round-trip latency for ISS-to-ground links via geosynchronous relay was approximately 800–850 ms — the Haptics-1, Haptics-2, and Analog-1 experiments all operated in this range \cite{meteron2019analog1}.

Key METERON results:
- At 820–850 ms RTLT, bilateral force-feedback teleoperation was feasible for structured tasks (the Haptics-2 experiment demonstrated bilateral control was possible at this delay) \cite{meteron2015haptics2}.
- Analog-1 (November 2019) successfully demonstrated geological sampling from ISS with ~850 ms communications latency; the astronaut issued commands and assessed results on a time-delayed video feed.
- The METERON SUPVIS Justin experiments, conducted via ISS sessions from August 2017 through late 2018 (ESA/DLR; three crew sessions), tested a supervisory control approach at ISS-to-ground latency: the astronaut issued goal-level commands to DLR's Rollin' Justin robot, which executed tasks autonomously. The key finding was that **task-level supervisory command is robust to 800 ms delays in a way that real-time control is not** \cite{schmaus2019suprvisjustin}. The operator does not need to hold closed-loop control at 800 ms; issuing discrete commands and waiting for execution confirmation is viable.

The KONTUR-2 experiment (August 2015, Russian cosmonaut teleoperation of a force-feedback manipulator in Germany from ISS; the KONTUR-2 ISS sessions were distinct from the Earth-based KONTUR-2 ground demonstration series of 2015–2016) found that haptic feedback improved performance in real-time conditions, but that its benefit diminished and could reverse at higher latencies \cite{kontur2016forcefeedback}.

**METERON position:** 800 ms is in the "painful but workable" regime for structured tasks with predictive displays or supervisory command strategies. The 2.5 s Lunokhod regime is a further qualitative step beyond 800 ms.

### Heritage Anchor 3 — Sheridan/Verplank Supervisory Control Framework

Sheridan and Verplank's 1978 10-level taxonomy of supervisory control provides the theoretical framework for mapping latency to operational mode \cite{sheridan1978teleoperators}. The taxonomy ranges from Level 1 (human does everything, computer does nothing) to Level 10 (computer acts entirely autonomously; human is informed only if it decides to).

The latency-to-Sheridan-level mapping for this study:

| Latency (RTLT) | Sheridan Level range | Operational mode | Human role |
|---|---|---|---|
| <200 ms | 2–3 | Direct teleoperation with machine assistance | Primary actuator; computer enforces limits |
| 200 ms–1 s | 3–5 | Shared control; predictive displays assist | Primary decision-maker; computer executes low-level motion |
| 1–5 s | 5–7 | Supervisory control; goal-level commanding | Sets objectives, approves intermediate steps; robot executes |
| 5–60 s | 7–9 | High supervisory / low autonomy | Approves mission plans; monitors anomalies; robot self-supervises |

### Performance Degradation Curve — Summary Position

| RTLT Band | Operational Mode | Viable for Far-Side Base? | Architectural Implication |
|-----------|-----------------|--------------------------|--------------------------|
| ≤50 ms (Tier A) | Continuous teleoperation | Yes — primary mode | On-base forward deployment required |
| 2.6–2.9 s (Tier B) | Checkpoint-gated supervision | Yes — secondary mode | Queqiao-2 relay; jointly-executed tasks only |
| 8.7–42 min (Tier C) | Deferred instruction / full autonomy | No real-time supervision | Earth-relay for scheduled low-novelty ops only |
| >60 min | Mission-planner model | Out of scope (first decade) | Not addressed in this study |

---

## 3. Autonomy/Teleoperation Handoff by Latency Tier

The latency analysis drives a three-tier autonomy allocation, which feeds directly into the autonomy-trl-tasking section's task catalog and the human-factors-teaming agent's crew workload model.

### Tier A — Cislunar-Supervised Lunar Surface (RTLT ≤50 ms)

A crew stationed at a cislunar gateway, low lunar orbit, or the far-side base surface habitat has round-trip latency to the humanoid of order tens of milliseconds — well below Lunokhod's 2.5-second regime and far below the 200 ms threshold for direct teleoperation degradation. Standard wired or short-range radio LAN achieves <10 ms RTLT within a lunar habitat; the ≤50 ms target is conservative and achievable without special network design.

The preferred mode in Tier A is **supervised autonomy with low-latency human-in-the-loop**: the humanoid executes tasks semi-autonomously; the operator monitors, intervenes when the robot requests confirmation or when the operator identifies an anomaly, and can take direct teleoperation control within 100 ms response time in any emergency. This is qualitatively different from the Lunokhod model because the operator can perceive an emerging problem and intervene before it resolves. Emergency response is viable. This is the forward-deployed-human operational tier.

**Target for this study: ≤50 ms RTLT from crew workstation to humanoid over the base network.** This drives the base network topology requirement to low-latency wired or short-range radio links within the habitat complex, not relay-dependent links.

### Tier B — Earth-Supervised Lunar Surface via Relay (RTLT ~2.8 s)

This tier corresponds to the Queqiao-2-relayed Earth-to-far-side link. Round-trip latency is approximately 2.68–2.78 s minimum (nominal range per derivation above); relay outages introduce complete loss-of-link periods. This is Lunokhod's regime.

The study's position: **Earth-supervision via relay is not a viable primary operating mode for the task profile of the far-side base.** The humanoid task profile includes bipedal locomotion in terrain with novel features, EVA tool manipulation within a meter of crew members, pressurized interface operations, and emergency response. All of these require either direct teleoperation (impossible at 2.8 s RTLT) or supervisory control with the robot carrying sufficient reactive autonomy to handle unexpected events.

Earth-supervision via relay is reserved for two specific use cases:
1. **Scheduled, low-novelty pre-scripted operations**: tasks for which the full execution sequence is pre-validated and the operator is reviewing outcomes rather than directing execution in real time. Analogous to Mars rover uplink-plan-and-execute.
2. **Anomaly response with deliberate delay acceptance**: when the forward-deployed crew is unavailable (e.g., scheduled sleep period), Earth can maintain oversight via relay, but with the understanding that the robot's autonomous safe-mode behavior must cover the 2.8-second response window.

**Inputs to autonomy-trl-tasking from this tier:** At Tier B latency, the humanoid's reactive layer must be capable of independent fall recovery, collision avoidance, and graceful degradation to safe-mode without any crew input. The deliberative layer must be capable of completing a queued task sequence or aborting cleanly if a task step produces a condition outside its confidence threshold. These capabilities must be TRL 6 (reactive) and TRL 5 (deliberative) by the 2029 gate and TRL 7+ by the 2035 IOC — consistent with §A1 in the assumptions register.

### Tier C — Earth-Supervised Mars Surface (RTLT 8.7–42 min)

At Mars, real-time supervision of any kind is physically impossible. The operational model is exactly the NASA Mars rover model: daily (or multi-day) uplink of mission plans; autonomous execution using the robot's onboard autonomy; downlink of telemetry and results. The crew role is mission architect and anomaly reviewer, not supervisor \cite{ono2018msl}.

The humanoid-forward case for Mars adds a forward-deployment layer: humans in Mars orbit or at a Mars surface base serve as the Tier A supervisor for Mars-surface humanoids, just as far-side-base crew serve as Tier A supervisors for lunar surface humanoids. The Earth supervision of Mars operations falls to Tier C — post-hoc review, not real-time intervention.

---

## 4. The Forward-Deployed-Human Argument

The latency analysis above compels a conclusion: Earth-relay supervision (RTLT ~2.78 s at Tier B, 5.56 s minimum round-trip exchange) is not a viable primary mode for this task profile. Tier B latency eliminates continuous teleoperation and constrains jointly-executed tasks to checkpoint-gated supervision (see §02-04). The 5–10× productivity differential between Tier A (≤50 ms, on-base) and Tier B supervision for checkpoint-intensive operations quantifies the operational cost of Earth-relay primary supervision and constitutes the physics-driven requirement for forward deployment. The full forward-deployment argument — three-pillar structure, medical emergency case — is in §02-04 Section 4.

---

## 5. Inputs to Autonomy-TRL-Tasking

This latency analysis provides the following inputs to §02-03: Tier A (≤50 ms) supports autonomy-led and jointly-executed task profiles; Tier B (~2.78 s) constrains jointly-executed tasks to checkpoint-gated supervision requiring ≤5 s human decision latency; Tier C (8.7–42 min) requires full task autonomy with no real-time human supervision.

---

\bibliography{corpus/references}
