---
title: Aerospace Engineer Review Findings
status: findings-complete
owner: aerospace-engineer-reviewer
last-updated: 2026-05-03
stage: 8
---

# Aerospace Engineer Review Findings — Stage 8

**Sections reviewed:**
- `study/02-human-in-the-loop/01-overview.md` (§02-01)
- `study/02-human-in-the-loop/02-latency-tradespace.md` (§02-02)
- `study/02-human-in-the-loop/03-autonomy-trl-tasking.md` (§02-03)
- `study/02-human-in-the-loop/04-teaming-model.md` (§02-04)

---

## Findings

### AE-S8-01 — Major — §02-02 — Queqiao-2 relay geometry treats satellite as co-linear with Earth-Moon axis; error is small but derivation is wrong

**Severity:** Major
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 1, "Queqiao-2 Relay Geometry"
**Claim:** "Earth-to-Queqiao-2 at apoapsis: approximately 384,400 + 16,500 = ~400,900 km from Earth center, yielding OWLT of 400,900 ÷ 299,792 = **1.337 s**"
**Issue:** The derivation assumes Queqiao-2 is positioned radially outward from Earth on the Earth-Moon centerline (i.e., directly behind the Moon as seen from Earth). This is not the orbital geometry required for simultaneous Earth and far-side line-of-sight. For the satellite to see both Earth and the far side simultaneously, it must be above the lunar limb — not on the anti-Earth axis — which means the Earth-to-satellite slant range is approximately the Earth-Moon distance, not Earth-Moon + altitude. The geometry that makes far-side coverage possible is precisely the geometry where the satellite's altitude above the Moon adds only minimally to the Earth-satellite range.

More precisely: Queqiao-2 at apoapsis above the lunar limb is roughly 384,400 km from Earth (the Earth-Moon distance) plus a projection of the satellite's orbital radius onto the Earth-satellite direction. At 16,500 km altitude and an inclination of 62.4°, the projection is well below 16,500 km. The 400,900 km figure overstates the path length. The correct approach would be to compute the Earth-satellite range from the orbital geometry using the law of cosines; the resulting OWLT is approximately 1.28–1.32 s rather than 1.337 s, and the RTLT is approximately 2.56–2.64 s — materially closer to the direct Earth-Moon RTLT of 2.56 s, not 9% higher.

The cited 2.78–2.92 s RTLT range is therefore overstated by an unknown but potentially significant fraction. The range may be closer to 2.60–2.75 s depending on exact orbital geometry and viewing angle to the base site. The architectural conclusion (Earth supervision is inadequate for the far-side task profile) is not affected — the latency remains in the Lunokhod-tier regime regardless — but a study whose core physics argument rests on latency derivations cannot carry an incorrect geometry.

**Required action:** Replace the additive Earth-Moon + altitude path calculation with a slant-range calculation using the law of cosines, accounting for the actual angular offset of Queqiao-2 from the Earth-Moon radial axis at the orbital positions that provide dual-link coverage. Recompute the RTLT bounds accordingly. If the corrected values shift the RTLT upper end below 2.92 s, update the latency table and the §02-01 overview claim of "2.78–2.92 seconds." The §A17 register entry should be updated if the relay availability calculation is affected.

---

### AE-S8-02 — Minor — §02-02 — RTLT upper bound derivation is not shown; stated 2.92 s is internally consistent but not demonstrated

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 1, "Queqiao-2 Relay Geometry" and Latency Table
**Claim:** Latency table states OWLT max of 1.46 s and RTLT max of 2.92 s for lunar far side via relay.
**Issue:** The derivation section only computes the apoapsis (most favorable) geometry in detail, yielding RTLT = 2.78 s. The upper bound of 2.92 s (OWLT 1.46 s) appears in the table without a corresponding derivation. Internal check: 2 × 1.46 = 2.92 ✓ (table is internally consistent). The implied OWLT of 1.46 s requires an Earth-satellite path of 1.46 × 299,792 = 437,696 km. At lunar apogee (406,700 km Earth-Moon) + 17,000 km satellite altitude, the additive path would be 423,700 km, giving 1.413 s OWLT; the far-side surface segment adds ~17,000 ÷ 299,792 = 0.057 s; total OWLT ≈ 1.470 s, RTLT ≈ 2.94 s. The table's 2.92 s is slightly below this additive calculation, and neither calculation has shown its geometry assumptions.

This is a minor issue because the architectural conclusion is insensitive to whether the upper bound is 2.88 or 2.94 s, but the derivation discipline requires both bounds to be shown.

**Required action:** Add a brief parallel derivation for the upper-bound case (lunar apogee geometry, satellite at maximum altitude above far-side limb) showing the geometry assumptions and arithmetic. The derivation should be consistent with the correction requested in AE-S8-01.

---

### AE-S8-03 — Major — §02-04 — Headroom characterization is ambiguous and uses non-standard margin language

**Severity:** Major
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 2, "Cognitive Load Under the Three-Tier Model"
**Claim:** "Headroom: 3.75 person-hours (approximately 3.75÷4.25 = 88% margin over demand)" and "roughly a factor of 2 between demand and capacity"
**Issue:** The two characterizations are inconsistent and both are stated in non-standard ways that create confusion about whether the budget is comfortable or tight.

Arithmetic check (all correct):
- Total demand: 2.0 + 1.5 + 0.75 = 4.25 person-hours ✓
- Capacity: 4 crew × 8 hr × 0.25–0.30 fraction → 8 person-hours ✓
- Surplus: 8 − 4.25 = 3.75 person-hours ✓

The problem is the characterization: "88% margin over demand" is computed as (capacity − demand) / demand = 3.75 / 4.25 = 88.2%. However, a reader seeing "88% margin" without context will likely interpret it as "the budget is 88% consumed" (i.e., 12% margin remaining), which inverts the correct reading. The standard aerospace margin convention is (capacity − demand) / demand expressed as a positive number when capacity exceeds demand — so 88% margin is formally correct but stylistically unusual. The "factor of 2" characterization (8 / 4.25 = 1.88×) is accurate but rounds aggressively to "2." These two phrasings, placed in adjacent sentences, describe the same surplus in ways that a non-specialist reader will likely misread as contradictory.

Furthermore, the "88% margin over demand" framing is not how cognitive workload budgets are normally presented in human factors literature. The standard presentation is: demand = 4.25 person-hours, capacity = 8 person-hours, utilization = 53% (demand/capacity), margin = 47% of capacity unused. This is the framing a human-factors-teaming reviewer, ConOps agent, or cost-program agent will expect.

**Required action:** Replace "88% margin over demand" with standard utilization and margin language: "supervisory demand = 4.25 person-hours (53% of available capacity); headroom = 3.75 person-hours (47% of capacity)." Remove the inconsistent "factor of 2" claim or replace it with "capacity exceeds demand by 1.88×." The finding does not change the arithmetic — the numbers are correct — only the presentation is non-standard.

---

### AE-S8-04 — Major — §02-04 — Periodic supervision demand calculation uses an unexplained concurrency factor that is the dominant uncertainty in the budget

**Severity:** Major
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 2, "Periodic supervision demand"
**Claim:** "3 × 0.83 × 0.6 concurrency factor = ~1.5 person-hours. (The 0.6 concurrency factor reflects that at any given time, some humanoids will be in autonomy-led phases while others are at checkpoint gates; simultaneous checkpoints from all three robots are rare and represent the peak demand case, not the nominal case.)"
**Issue:** The 0.6 concurrency factor is the second largest term in the periodic supervision subtotal (1.5 person-hours, 35% of total 4.25 person-hour demand), yet it has no derivation. It is stated as a qualitative judgment ("simultaneous checkpoints from all three robots are rare") without any supporting calculation. A queuing-theoretic estimate of the probability of simultaneous checkpoint events across three independently-operating humanoids could be derived from the checkpoint frequency and duration assumptions already stated in the section. If each humanoid generates approximately 5 checkpoint events per shift with ~10 minute duration in an 8-hour shift, the fraction of time each humanoid is at a checkpoint is 50/480 ≈ 10%. The probability that all three are simultaneously at a checkpoint is 0.10³ = 0.001 — vanishingly small — but the probability that two are simultaneously at a checkpoint is 3 × 0.10² × 0.90 ≈ 2.7%. This suggests the concurrency factor should be closer to 0.9–0.95 (very little overlap), not 0.6, which would imply that 40% of checkpoint time is "lost" to overlap. If the concurrency factor is 0.9 instead of 0.6, the periodic supervision subtotal rises from 1.5 to 2.25 person-hours, and total supervisory demand rises from 4.25 to 5.0 person-hours — reducing the surplus from 3.75 to 3.0 person-hours and changing the utilization from 53% to 63%. The budget still closes, but the margin characterization changes materially.

**Required action:** Derive the 0.6 concurrency factor from first principles, or replace it with a factor derived from a queuing model or simulation of checkpoint event timing across three humanoids. If the factor is revised upward toward 0.9, recompute the total supervisory demand and update the headroom characterization. If the 0.6 factor is defended, show the reasoning (e.g., the 6 jointly-executed task categories are not all running simultaneously; perhaps only 2 of 6 categories are active in a typical shift window, which halves the checkpoint rate).

---

### AE-S8-05 — Minor — §02-04 — Continuous supervision demand estimate (1.5 events × 30 min) is not traced to mission frequency data

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 2, "Continuous supervision demand"
**Claim:** "A realistic sortie day includes approximately 1–2 continuous-supervision events (a first-execution task, an EVA tool handoff sequence, a new task demonstration). Estimated 1.5 continuous-supervision events per shift × 30 minutes each = 0.75 person-hours."
**Issue:** The 1.5 events/shift figure is a bare assertion. The task taxonomy in §02-03 lists the tasks requiring continuous supervision: first execution of new task types (T18), human-led locomotion reconfiguration (T12), and EVA tool handoff (T09 — though T09 is listed as jointly executed, not continuously supervised). There is no analysis of how often these events occur per shift at IOC. First execution of a new task type is presumably a rare event (once per new task category, not once per shift). EVA tool handoff would occur only on EVA-days. Continuous supervision events at the rate of 1.5/shift would imply these triggering events are nearly daily, which may be aggressive at IOC when the task library is initially limited. Conversely, during commissioning operations (high rate of first-execution events), 1.5/shift could be conservative.

**Required action:** Trace the 1.5 events/shift estimate to the §02-03 task taxonomy. Specify which tasks drive this estimate and at what operational tempo they occur. If first-execution events are uncommon after an initial commissioning period, the continuous supervision demand should be stated as a function of phase (higher during commissioning, lower during steady-state operations) rather than a single flat estimate.

---

### AE-S8-06 — Blocker — §02-04 — Supervisory capacity derivation is internally inconsistent between Section 2 and Assumption §A19

**Severity:** Blocker
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 2 vs. `study/05-cross-cutting/margins-and-assumptions.md`, §A19
**Claim (§02-04 Section 2):** "if a 4-person crew allocates 30–40% of time to maintenance, 15% to exercise, and 25% to communications and personal time, approximately 25–30% of total crew-time remains available for supervisory functions… 4 crew × 8 hours × 0.25–0.30 available fraction yields approximately 8–10 person-hours per crew shift available for supervisory demand. The conservative estimate is **8 person-hours per crew shift**"
**Claim (§A19 in margins register):** "For supervisory activities specifically, the fraction available without competing with science, EVA prep, and personal time is 25–30%, or approximately **3 hours per crew member per shift**. For 4 crew: 4 × 2 hours ≈ 8 person-hr/shift"
**Issue:** The §02-04 derivation and the §A19 derivation give the same answer (8 person-hours) via two different paths that contradict each other.

§02-04 path: 4 crew × 8 hr/shift × 0.25 fraction = 8 person-hours. This implies each crew member contributes 2 person-hours of supervisory capacity from an 8-hour shift.

§A19 path: fraction available for supervision = 25–30% → "approximately 3 hours per crew member per shift" (3 hours is 37.5% of an 8-hour shift, not 25–30%). Then §A19 states "4 × 2 hours ≈ 8 person-hr/shift" — reverting to 2 hours/crew member despite the preceding sentence saying 3 hours/crew member. The paragraph is internally contradictory: it states 3 hours per crew member and then multiplies by 2 hours per crew member.

Furthermore, the §02-04 arithmetic omits a critical element: the section uses an 8-hour work shift, but Mir crews worked a 12-hour waking day with roughly half dedicated to scheduled activities. If the base operates on a 12-hour waking day with 8 hours of scheduled work, the available supervisory fraction must be applied to the waking period or the working period — and the two calculations give different answers (12 hr × 0.25 = 3 hr/crew member vs. 8 hr × 0.25 = 2 hr/crew member). The document does not state which time base it uses.

**Required action:** (1) Correct the §A19 derivation: either state 2 hours per crew member (matching the 8-hour shift × 25% calculation) or 3 hours per crew member (matching the 25–30% of a 12-hour waking day) — not both in adjacent sentences. (2) State explicitly in §02-04 whether the 8-hour shift is the time base for the capacity calculation or whether a longer waking period is assumed. (3) Reconcile §02-04 Section 2 and §A19 so both documents show identical arithmetic. This is a blocker because the supervisory capacity figure is the denominator of the primary teaming model result.

---

### AE-S8-07 — Major — §02-04 — Supervisor ratio Step 2 conflates per-task supervision intensity with overall supervisor ratio; logic is non-rigorous

**Severity:** Major
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 3, "Derivation Step 2"
**Claim:** "At TRL 7 deliberative layer (2035 IOC), 12 of 20 mission tasks are autonomy-led. Each autonomy-led task reduces active supervision demand from the NIP-10 continuous-control requirement to the on-demand monitoring posture (0.05 person-hours per robot-hour vs. effectively 1.0+ for NIP-10-style operation). The factor-of-20 reduction in per-task supervision demand directly translates to a factor-of-20 improvement in supervisor ratio for those tasks."
**Issue:** The final claim — "directly translates to a factor-of-20 improvement in supervisor ratio" — does not follow. A factor-of-20 improvement in per-task supervision intensity would translate to a factor-of-20 improvement in supervisor ratio only if all tasks were autonomy-led. But the allocation is 12/20 autonomy-led, 6/20 jointly-executed, and 2/20 human-led. The jointly-executed tasks are specifically the ones that dominate supervisory demand (the periodic supervision subtotal of 1.5 person-hours in the cognitive load calculation exceeds the on-demand subtotal of 2.0 person-hours only marginally). The supervisor ratio is driven by the jointly-executed and human-led tasks, not the autonomy-led ones.

More precisely: the NIP-10 baseline of 5:1 cannot be improved by a factor of 20 to reach 0.25:1 (1:4), because the jointly-executed tasks impose a supervision floor that is not captured in the factor-of-20 argument. The ratio derivation would be more honest if it computed the NIP-10 equivalent demand for a 2035 task mix directly: 12 tasks × 0.05 + 6 tasks × 0.2 + 2 tasks × 1.0 = 0.6 + 1.2 + 2.0 = 3.8 relative units per robot, compared to the NIP-10 equivalent of approximately 20 relative units (all tasks at 1.0+ supervision intensity). This gives a factor-of-5 improvement, not factor-of-20, yielding a rough ratio of 5:1 ÷ 5 = 1:1, which is consistent with the Step 3 finding of 1:1.5 effective at peak demand.

**Required action:** Revise Step 2 to drop the "factor-of-20 improvement in supervisor ratio" claim and replace it with a proper weighted computation of effective supervision demand across the 2035 task mix. The conclusion (1:2–3 supervisor ratio at IOC) is probably correct; the logical path to it needs to be fixed. A task-weighted demand calculation is more defensible than a single-task intensity ratio extrapolated across all tasks.

---

### AE-S8-08 — Minor — §02-03 — TRL table "Current Space TRL" conflates platform TRL with algorithm TRL for navigation

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 1, Navigation row
**Claim:** "Navigation — 3D mapping, terrain avoidance: Current Space TRL 8. Space TRL 8: Mars AutoNav (Curiosity, Perseverance) is the unambiguous heritage — stereo-camera-derived point-cloud terrain classification and path planning, operating autonomously since 2012."
**Issue:** The TRL 8 claim is defensible for the AutoNav algorithm in the specific application of wheeled rover navigation on Mars, but it is presented in a table column titled "Current Space TRL" for the general task category "Navigation — 3D mapping, terrain avoidance" in the context of a bipedal humanoid on the lunar surface. This is not a TRL for the mission application; it is a TRL for a related but different application (wheeled rover, different gravity, different surface, different platform kinematics). The notes column partially hedges this ("gap is speed and platform"), but the TRL 8 entry in the "Current Space TRL" column will be read by downstream agents as meaning the capability is 95%+ demonstrated for the application at hand. The correct reading is: the algorithm (point-cloud-based terrain avoidance) is at TRL 8 on wheeled rovers in Mars gravity; the application to bipedal humanoid locomotion in lunar gravity is at TRL 3–4 because no biped has operated on any planetary surface.

**Required action:** Split the navigation row into "Navigation algorithm (point cloud mapping and path planning)" at TRL 8 (AutoNav heritage) and "Navigation for bipedal platform in lunar 1/6-g" at TRL 2–3 (concept only; no biped has operated on a planetary surface). Or add a column clarifying what the Space TRL 8 claim applies to, so the gap to mission application is explicit. This distinction matters for the task allocation: T03 (navigate to GPS sample point) is listed as "TRL 8 (met)" in the task taxonomy, which is plausible for the mapping and path planning algorithm but not for the full task including bipedal execution.

---

### AE-S8-09 — Major — §02-03 — Task allocation count in the table (12/6/2) is inconsistent with the task table itself

**Severity:** Major
**Section:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 4 and Section 3
**Claim:** "At 2035 IOC, 12 of 20 tasks are autonomy-led; 6 are jointly executed (requiring defined human interaction but not continuous supervision); 2 are human-led."
**Issue:** Counting from the task allocation table in Section 4 at IOC (2035):

**Autonomy-led at IOC:** T01, T03, T04, T06 (after first run), T07, T08, T10, T11, T15, T19 (after first run), T20 = **11 tasks**

**Jointly executed at IOC:** T02, T05, T09, T13, T14, T16, T17 = **7 tasks**

**Human-led at IOC:** T12, T18 = **2 tasks**

Total: 11 + 7 + 2 = 20 ✓ (count is correct), but the breakdown is 11/7/2, not 12/6/2 as stated in the summary claim.

The discrepancy is T16 (radio telescope calibration), which the Section 3 text lists under "Jointly executed by 2035" but the table entry shows "Jointly executed (scientist authorizes via relay; robot executes)" at IOC — consistent with jointly executed. However, Section 3 also lists T16 under "Jointly executed by 2035," which is consistent with the table. The mismatch is between the summary count claim (12/6/2) and what can be counted in the table (11/7/2).

One likely explanation: the document authors may have counted T06 and T19 each as autonomy-led even when "after first supervised run" is the qualifier — but those first runs represent a human-led or jointly-executed execution that is not captured in the count. If first-run executions are excluded from the autonomy-led count, T06 and T19 drop to jointly-executed for the IOC period, making the split 9/9/2 — even further from the 12/6/2 claim.

The summary count is used in §02-04 as the basis for the cognitive load model and supervisor ratio. If the correct split is 11/7/2 (or 9/9/2), the periodic supervision subtotal rises substantially.

**Required action:** Recount the task allocation table row by row at IOC to produce the verified split. If the split is 11/7/2, update the summary claim in Section 4 of §02-03, the §02-01 overview, and the §02-04 teaming model's cognitive load inputs. If the split is 9/9/2 (treating first-run events as jointly-executed), the periodic supervision demand rises and the headroom calculation in §02-04 must be rerun. This is a blocker-class arithmetic issue if the cognitive load model is based on the incorrect 12/6/2 split, but classified Major because the overall conclusions are likely robust to the correction.

---

### AE-S8-10 — Minor — §02-03 — Counter-case engagement omits the strongest version of the pro-autonomy argument (cost-of-crew)

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 5
**Claim:** Section 5 presents three answers to the counter-case ("why do high-autonomy humanoids need human supervision?") focused on OOD failure, consequence asymmetry, and the Lunokhod bidirectional lesson.
**Issue:** The section takes the brief's instruction to "seriously address the counter-case" seriously for the technical arguments, but misses the most economically consequential version: the cost of the forward-deployed crew. A 4-person permanent crew at a lunar far-side base represents an order-of-magnitude more program cost than robotic-only operations, and the counter-case in its strongest form is not "autonomy handles OOD well" but "the cost of crew makes the human value floor prohibitively expensive; better to accept higher autonomous failure rates than pay for permanent crew." This is a program-level argument, not a technical performance argument, and it is the version that will appear in program reviews and budget discussions. The study takes the forward-deployment commitment as load-bearing, but the counter-case section should engage the economic version to be complete.

**Required action:** Add a fourth point to the counter-case response addressing the cost argument. The response is: the economic case for the humanoid architecture rests on the crew multiplier (a small crew supervising a large humanoid fleet produces more task-hours than a crew operating without robots or a purely autonomous fleet requiring periodic servicing missions). The cost argument for forward deployment is not "crew is cheap" but "crew at the far side is what makes the humanoid fleet productive, and the productivity differential justifies the crew cost." This argument is implied in §02-01's treatment of supervision as a lever for productivity, but it should be stated explicitly in the counter-case section.

---

### AE-S8-11 — Nit — §02-02 — Earth-Moon mean distance used for RTLT derivation is IAU nominal; actual mean varies by ±3%

**Severity:** Nit
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 1, "Physical constants and distances used"
**Claim:** "Earth-Moon mean distance: 384,400 km (IAU nominal value). Earth-Moon mean RTLT: 1.282 × 2 = **2.56 s**"
**Issue:** The IAU 384,400 km figure is the nominal semi-major axis of the Moon's orbit. The actual mean Earth-Moon distance varies due to the lunar orbital eccentricity (e ≈ 0.055), giving a perigee of ~356,500 km and apogee of ~406,700 km — a ±7% range around the mean. The mean over a full orbit is very close to the nominal (within 0.1%), so the 384,400 km figure is appropriate for the mean case. However, the direct Earth-Moon RTLT in the latency table is stated as a fixed 2.38–2.71 s range (near side), which implies min OWLT of 1.19 s and max OWLT of 1.36 s. Verification: 356,500 ÷ 299,792 = 1.189 s ≈ 1.19 s ✓; 406,700 ÷ 299,792 = 1.357 s ≈ 1.36 s ✓. These numbers are correct. The mean OWLT derivation (384,400 ÷ 299,792 = 1.282 s) is also correct. No arithmetic error, just a nit on presentation.

**Required action:** No numerical change needed. Optionally, note in the derivation that the 384,400 km is the semi-major axis (not the true mean distance), which differs from the true mean by <0.1% due to orbital eccentricity — negligible for this analysis.

---

### AE-S8-12 — Nit — §02-04 — §A14 cross-reference for the gait factor is erroneous; correct reference is §A16

**Severity:** Nit
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 3, Step 2 (and review prompt watch item)
**Claim:** The review brief's watch item states "The 0.55 gait factor referenced in §02-04 from §A14." However, §02-04 does not reference §A14 or the 0.55 gait factor at any point in the document. The 0.55 gait factor is registered in §A16 of the margins register ("Locomotion power gait factor: 0.55") and is derived in §02-03's TRL table notes and the §01-06 power budget. §A14 covers actuator mass sensitivity (342 g vs. 385 g/joint). Section §02-04 references §A8, §A9, §A15, §A11, §A1, §A17, §A18, §A19 — but not §A14.
**Issue:** The §02-04 document correctly does not invoke the gait factor (which is an actuation power assumption, not a teaming model input). No cross-reference error exists within §02-04 itself. The erroneous §A14 attribution is in the review prompt, not the reviewed document. However, if future versions of §02-04 attempt to import the gait factor assumption as a supervisor ratio input (e.g., to argue that lower locomotion power implies longer unattended sortie duration), the correct citation will be §A16, not §A14.

**Required action:** No action required in §02-04. Confirm that §A16 (gait factor) and §A14 (actuator mass) are distinct assumptions with distinct owners and that neither document cross-references the wrong one.

---

### AE-S8-13 — Minor — §02-03 — TRL for novelty handling is TRL 3 terrestrial / TRL 2 space, but task T17 requires TRL 7 by IOC — gap is understated

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`, Section 1 and Section 2
**Claim:** Novelty handling row: "Current Space TRL: 2. Current Terrestrial TRL: 3. Gap to Mission Requirement: TRL 5 by 2035; TRL 7 by 2038–2040." Task T17 (habitat breach — locate and report): "Novelty handling + Navigation. Min TRL for Full Autonomy: TRL 7. Must be partially autonomous."
**Issue:** T17 requires the robot to autonomously initiate inspection and locate a habitat breach on an alert — the section assigns this a minimum TRL 7 requirement. But the novelty handling TRL table says TRL 5 by 2035. This is a contradiction: T17 cannot simultaneously require TRL 7 and be expected to execute at TRL 5. The gap is called out correctly in the 2029 gate analysis ("not executable even with human-in-loop in 2029: T10 and T12 require TRL 7"), but T17 is not mentioned in the same breath as these demanding tasks despite sharing the TRL 7 requirement.

Checking the task allocation table, T17 at IOC is "Jointly executed (robot locates, human decides sealing action)." The "must be partially autonomous" qualification in the task taxonomy means the robot must autonomously initiate, not that the full response is autonomous. "Partially autonomous" TRL could be lower than TRL 7 for the overall task, if initiation is handled by reactive (TRL 6) and location reporting is handled by navigation (TRL 8 met). The TRL 7 stated in the task taxonomy as "Min TRL for Full Autonomy" may refer to full autonomy (robot locates AND decides sealing response), not partial autonomy (robot locates, human decides). This distinction is important but is not stated clearly.

**Required action:** Clarify whether the TRL 7 in T17's task taxonomy row refers to full autonomy (including the sealing decision) or partial autonomy (location only, with human decision). If it refers to full autonomy, the 2035 jointly-executed allocation is consistent — the robot is not fully autonomous at IOC. If it refers to the partial-autonomy threshold required for the jointly-executed mode, the TRL must be reconciled with the novelty handling TRL 5 ceiling for 2035. Add a note in the task taxonomy explaining what "Min TRL for Full Autonomy" means when the 2035 allocation is jointly-executed (i.e., full autonomy is the post-2040 target, not the IOC requirement).

---

### AE-S8-14 — Major — §02-01 and §02-04 — Forward-deployed crew latency stated as "≤50 ms" but no derivation of on-base network topology is provided or cited

**Severity:** Major
**Section:** `study/02-human-in-the-loop/01-overview.md`, Section 1; `study/02-human-in-the-loop/02-latency-tradespace.md`, Section 3, Tier A; `study/02-human-in-the-loop/04-teaming-model.md`, Section 5
**Claim:** "The forward-deployed crew on the far-side base habitat operates at ≤50 ms RTLT to the humanoids." (§02-01); "Target for this study: ≤50 ms RTLT from crew workstation to humanoid over the base network." (§02-02); "The far-side-base-architect must confirm that the on-base network achieves ≤50 ms RTLT from every deployed humanoid position to the primary crew workstation." (§02-04)
**Issue:** The ≤50 ms RTLT target is stated in three separate documents as the architectural commitment for Tier A supervision, but its derivation is never shown and the reference for the "direct teleoperation viable zone" (0–200 ms) is cited in §02-02 as the upper bound of viability, not as the derivation of 50 ms specifically. The distance from the crew workstation to the humanoid(s) at the far-side base governs this latency. At the speed of light, 50 ms RTLT corresponds to a one-way distance of 0.025 s × 299,792 km/s = 7,495 km — obviously far more than the physical base dimensions. The physics of light propagation implies that any on-base wired or short-range radio network with cable/signal runs under a few kilometers will achieve sub-millisecond propagation latency. The binding constraint is not propagation latency but network protocol latency: video codec decode latency (10–30 ms for hardware-accelerated H.264/H.265), TCP/IP round-trip handshake, and display rendering. The 50 ms target is almost certainly achievable for any reasonable on-base network design, but the document treats it as an open requirement without demonstrating this.

The issue is that the study's load-bearing argument rests on the contrast between Tier A (≤50 ms) and Tier B (2.78 s). If the ≤50 ms figure is easily achievable and requires no special design (just a standard wired Ethernet or Wi-Fi 6 local network with hardware video decode), that should be stated. Instead, the document's repeated "the far-side-base-architect must confirm" language implies this is a non-trivial design challenge, which it is probably not for the distances involved.

**Required action:** Show the on-base network latency derivation. State the physical base dimensions (crew quarters to robot maximum deployment distance), derive propagation latency, add codec and protocol overhead, and confirm the 50 ms figure is achievable. If 50 ms is trivially met (it almost certainly is), state this and remove the forward-looking "architect must confirm" language, or replace it with a more specific task for the architect (e.g., "confirm that the codec pipeline and display latency do not exceed 40 ms to preserve margin against the 50 ms target in the highest-demand haptic feedback scenario").

---

## Summary Count

| Severity | Count |
|---|---|
| Blocker | 1 |
| Major | 6 |
| Minor | 5 |
| Nit | 2 |
| **Total** | **14** |

---

## Stage 8 Findings Notes

**What closed cleanly:**
- The 2.78 s RTLT physics argument (Queqiao-2 relay, minimum achievable) is structurally correct even if the geometry approximation in AE-S8-01 is imprecise; the architectural conclusion is insensitive to the correction.
- The TRL table in §02-03 is notably more rigorous than typical concept-phase autonomy assessments. The notes column showing derivation, not just numbers, and the explicit separation of space TRL from terrestrial TRL, is the right approach. The finding in AE-S8-08 is a refinement, not a repudiation.
- The counter-case engagement in §02-03 Section 5 is genuinely substantive; the Lunokhod bidirectional reading is particularly strong. AE-S8-10 adds to it rather than questioning it.
- The supervisory demand arithmetic (4.25 person-hours) is internally correct in §02-04 Section 2 given the stated assumptions. The finding in AE-S8-03 is about presentation, not arithmetic. AE-S8-04 challenges the derivation of a key input assumption.
- The human value floor concept in §02-03 Section 3 is the right architectural move. The seven categories are defensible and well-reasoned. No findings challenge the substance of this section.

**What requires resolution before the document can be referenced by downstream agents (ConOps, cost-program):**
- AE-S8-06 (Blocker): The supervisory capacity derivation contradiction between §02-04 and §A19 must be resolved. The capacity figure is the denominator of the teaming model.
- AE-S8-09 (Major): The 12/6/2 task split claim must be reconciled with the actual table count (11/7/2). All downstream uses of this split must be updated if the count changes.
- AE-S8-03 (Major): Margin language must be corrected before the headroom figure is cited in ConOps or cost documents.
- AE-S8-01 (Major): Relay geometry must be corrected before the RTLT figure is cited as a load-bearing physics value.
