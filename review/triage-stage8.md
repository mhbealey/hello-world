---
title: Stage 8 Review Triage
stage: 8
status: draft
last-updated: 2026-05-03
---

# Stage 8 Review Triage — Question (b) Human-in-the-Loop

**Triage date:** 2026-05-03  
**Reviewers completed:** 5 of 6 (heritage-citations pending; will be incorporated separately)  
**Sections reviewed:** §02-01, §02-02, §02-03, §02-04

---

## Summary Count

| Severity | AE | RM | CC | SD | DA | HC | Total |
|----------|----|----|----|----|----|----|-------|
| Blocker  |  1 |  1 |  1 |  0 |  1 |  0 |     4 |
| Major    |  6 |  6 |  2 |  7 |  3 |  3 |    27 |
| Minor    |  5 |  5 |  2 |  3 |  0 |  4 |    19 |
| Nit      |  2 |  3 |  2 |  2 |  0 |  3 |    12 |

**Stage 6 baseline:** 10 blockers, 41 majors across all of Q(a). Stage 8 Q(b)-only: 4 blockers (down from 0 — these are new for Q(b)), 24+ majors.

---

## P1 — Cross-Reviewer Patterns

### P1-A: Cognitive Load Arithmetic Has Multiple Internal Inconsistencies (CRITICAL)

**Flagged by: AE (AE-S8-06, AE-S8-04), RM (RM-B01, RM-M01, RM-M02, RM-M03, RM-M05), CC (CC-S8-002)**

This is the single most pervasive finding. The §02-04 cognitive load model produces a "2× headroom" headline result, but the arithmetic rests on at least five undetermined or internally inconsistent constants:

| Constant | Location | Problem |
|----------|----------|---------|
| "1 OOD alert per 4-hour sortie" | §02-04 §2, §A19 | Invented; no derivation, no heritage, no uncertainty bound. Load-bearing for anomaly demand. |
| 0.6 concurrency factor | §02-04 §1 | Saves ~1.0 person-hour of demand; entirely asserted without derivation. |
| 0.2 person-hours/robot-hour periodic cost | §02-04 §1 | Arithmetic in document does not reproduce this value from stated inputs. |
| 8 person-hours/shift capacity | §02-04 §2, §A19 | §A19 uses "3 hours per crew member" then multiplies by "2 hours per crew member" — direct contradiction in adjacent sentences. |
| §A19 periodic demand total | §A19 | §A19 shows 3.0 person-hours/shift; §02-04 shows 1.5 person-hours/shift; discrepancy traced to §A19 dropping the 0.6 concurrency correction without flagging the omission. |

**Dispatch:** human-factors-teaming for §02-04 arithmetic repair and §A19 correction. Priority: **resolve before any other fix** — blockers AE-S8-06 and RM-B01 both hang on this.

---

### P1-B: Task Allocation Count 12/6/2 Does Not Match Tables (BLOCKER)

**Flagged by: AE (AE-S8-09), CC (CC-S8-001)**

The stated summary count "12 autonomy-led / 6 jointly-executed / 2 human-led" appears in §02-01, §02-03, §02-04 summary, §A18, §A19, and the cross-coupling log. Row-by-row count of the §02-03 task allocation table and §02-04 supervision task list produces **11/7/2**. The discrepancy is T16 (radio telescope calibration): the task allocation table marks it jointly-executed at IOC; the cross-coupling log lists it as autonomy-led at IOC while also noting it "shifts to autonomy-led by 2040" — self-contradictory.

**Decision required (orchestrator):** Is T16 autonomy-led or jointly-executed at IOC?
- If autonomy-led: fix §02-03 task table (T16 row), remove T16 from §02-04 periodic supervision list. Count 12/6/2 stands.
- If jointly-executed: update all summaries and cross-coupling log to 11/7/2. Count changes throughout.

**Dispatch:** autonomy-trl-tasking to decide T16 IOC status and fix §02-03; human-factors-teaming to propagate to §02-04 summary and §A18–§A19.

---

### P1-C: Word Count Overruns Require Mechanical Cuts (GATE BLOCKER)

**Flagged by: SD (SD-8-001 through SD-8-011)**

Word-count gate blocks handback generation until §02-02 < 3,300 words and §02-03 < 3,300 words:

| Section | Current | Hard Cap | Gate Threshold (×1.10) | Status |
|---------|---------|----------|----------------------|--------|
| §02-01 | ~1,717 | 2,400 | 2,640 | Pass |
| §02-02 | ~4,277 | 3,000 | 3,300 | **FAIL — 977 words over gate** |
| §02-03 | ~4,470 | 3,000 | 3,300 | **FAIL — 1,170 words over gate** |
| §02-04 | ~4,417 | 4,200 | 4,620 | Pass (203 words under gate) |

Scope-discipline removable-content maps are already available. Execute mechanically:

**§02-02 cuts (target: remove ~1,100+ words):**
1. SD-8-001: Compress Section 4 forward-deployment argument to 1 closing paragraph. Save **~400 words**.
2. SD-8-002: Replace "Performance Degradation Curve — Summary Position" with 4-row table. Save **~280 words**.
3. SD-8-003: Remove Section 5 (Comms Architecture implications) entirely. Save **~280 words**.
4. SD-8-004: Compress Queqiao-2 constellation paragraph to 3 sentences pointing to §A17. Save **~100 words**.
5. SD-8-010: Compress Section 6 TRL gate inputs to pointer. Save ~**80 words**.
6. SD-8-013: Delete ">60s tier" row from latency table/discussion. Save ~**40 words**.
*Projected total: ~1,180 words removed. Post-cut: ~3,097. Still ~97 over hard cap; requires prose compression in Section 3 Tier B/C.*

**§02-03 cuts (target: remove ~1,300+ words):**
1. SD-8-005: Compress Sections 5 and 6 to 2 paragraphs (retain only Lunokhod bilateral lesson) + 2 sentences. Save **~680 words**.
2. SD-8-006: Compress TRL table Notes column to ≤25 words per row. Save **~400 words**.
3. SD-8-007: Compress Task Taxonomy table Notes column to ≤15 words per row. Save **~300 words**.
4. SD-8-011: Remove 2040 re-statement of 7-item human value floor. Save **~200 words**.
*Projected total: ~1,580 words removed. Post-cut: ~2,890. Within hard cap and within target range.*

**Dispatch:** teleoperation-latency executes §02-02 cuts; autonomy-trl-tasking executes §02-03 cuts. Sequential before handback.

---

### P1-D: Human Value Floor Architecture Is Exposed to Adversarial Review

**Flagged by: DA (DA-5, DA-8), AE (AE-S8-10)**

All three reviewers independently identified the same structural weakness: the 7-category human value floor is stated with uniform permanence, but three categories (Category 1: first execution authorization; Category 6: science priority decisions; Category 7: OOD-response gating) are not defensible as permanent against credible 2035-era autonomy forecasts. The post-hoc rationalization attack (DA-8) becomes lethal if reviewers identify that the floor was defined after the forward-deployment commitment.

**Fix required:** Split the floor into two tiers:
- **Tier 1 — Permanent floors (physics/consequence-asymmetry grounded):** Categories 2, 3, 4, 5 (crew contact, pressurized interfaces, habitat breach, structural modification). These survive any TRL advance because the consequence of autonomous error is irreversible.
- **Tier 2 — IOC-current positions (subject to gate revision):** Categories 1, 6, 7 (first execution auth, science priority, OOD-flag response). These are 2035 program positions with explicit gate criteria for revision.

**Dispatch:** autonomy-trl-tasking for §02-03 Section 3 two-tier floor restructuring; human-factors-teaming for §02-01 alignment and §02-04 Pillar 3 clarification.

---

## P2 — Standalone Blockers and Majors

### Standalone Blockers

None beyond P1-A, P1-B, P1-C. DA-5 (human value floor attack) is addressed under P1-D with major-level fixes.

### Standalone Majors

| ID | Section | Issue | Dispatch |
|----|---------|-------|----------|
| AE-S8-01 | §02-02 §1 | Queqiao-2 relay geometry: additive path model geometrically wrong. Corrected RTLT ~2.60–2.75 s, not 2.78–2.92 s. Architecture conclusion survives; derivation must be corrected. | teleoperation-latency |
| AE-S8-03 | §02-04 §2 | "88% margin over demand" is non-standard. Standard convention: utilization = 53%, headroom = 47%. Change language. | human-factors-teaming |
| AE-S8-07 | §02-04 §3 | Supervisor ratio Step 2 "factor-of-20 improvement" conflates per-task intensity with overall ratio. | human-factors-teaming |
| AE-S8-14 | §02-01, §02-04 | ≤50 ms on-base RTLT stated as design commitment; trivially achievable by standard LAN/Wi-Fi — no derivation needed, but "architect must confirm" language implies false uncertainty. Remove hedge; state as achievable by standard networking. | teleoperation-latency, human-factors-teaming |
| CC-S8-003 | §02-02 §3 | Tier A boundary: §02-02 says <100 ms; §02-04 and cross-coupling log say ≤50 ms. Fix §02-02 to ≤50 ms. | teleoperation-latency |
| RM-M04 | §02-04 §3 | "60% reduction in checkpoint demand" for 2040 1:4–5 ratio not derived. Add parametric estimate or flag as §A18 TBD. | human-factors-teaming |
| RM-M06 | §02-03 §2 | T10 SPE shelter window "15–30 minutes" not derived. Requires dose-rate and shelter dose-limit inputs. Flag as TBD with assumed inputs. | autonomy-trl-tasking |
| DA-6 | §02-03 | Study doesn't engage task-redesign alternative (could the 6 JE tasks be redesigned to eliminate real-time supervision?). Medical emergency case should be elevated as primary concrete justification. | autonomy-trl-tasking |
| DA-7 | §02-04 §3 | Failure mode if §A1 misses 2035 gate: consequence (ratio ~1:1, 3-humanoid fleet needs 3 crew supervisors) not developed. Add 2-paragraph failure mode analysis. | human-factors-teaming |

---

## P3 — Removable-Content Execution Plan

The scope-discipline reviewer provided paragraph-level removable-content maps (SD-8-001 through SD-8-013). These are mechanical edits. Each dispatched agent receives the map and executes cuts without re-deciding scope.

**§02-02 assigned to: teleoperation-latency agent**
See SD-8-001, 002, 003, 004, 010, 013 above. After cuts, verify word count < 3,000. If 3,000 < WC < 3,300, remaining headroom is consumed by prose tightening in Section 3 (Tier B/C latency discussion).

**§02-03 assigned to: autonomy-trl-tasking agent**
See SD-8-005, 006, 007, 011 above. After cuts, verify word count < 2,500 (target range). Post-cut estimate is ~2,890 — within hard cap (3,000) but above target ceiling (2,500). Acceptable at this stage; the word-count gate clears at <3,300.

**§02-04 assigned to: human-factors-teaming agent**
SD-8-008 (Spektr heritage removal, ~100 words) and SD-8-009 (task list compression, ~150 words) are P3 items but not gate-blocking. Execute in same pass as arithmetic repair.

---

## Dispatch Plan

### Wave 1 — Gate-Blocking (parallelize)

**Dispatch 1A: autonomy-trl-tasking**
- Decide T16 IOC status (autonomy-led or jointly-executed); update §02-03 task table
- Execute §02-03 scope cuts per SD-8-005, 006, 007, 011 (target: remove ~1,300 words)
- Two-tier human value floor restructuring (§02-03 Section 3)
- Add task-redesign engagement for DA-6 (2–3 paragraphs in §02-03)
- Flag T10 SPE window as TBD with assumed inputs (RM-M06)
- Verify final word count < 3,000 before completion

**Dispatch 1B: teleoperation-latency**
- Execute §02-02 scope cuts per SD-8-001, 002, 003, 004, 010, 013 (target: remove ~1,100+ words)
- Fix Queqiao-2 relay geometry derivation (AE-S8-01)
- Correct Queqiao-2 orbital parameters to actual confirmed state: ~119.25° retrograde, ~254×16,941 km; note §A17 coverage estimate assumes planned orbit pending confirmation (HC-02)
- Correct METERON SUPVIS Justin dates to 2017–2018 (HC-01)
- Fix Lunokhod 2 terminal failure mechanism to thermal radiator contamination (HC-03)
- Align Tier A boundary to ≤50 ms throughout (CC-S8-003)
- Remove false-uncertainty hedge on ≤50 ms achievability (AE-S8-14 partial)
- Correct HC-04, HC-06 minor citation issues in §02-02
- Verify final word count < 3,000 before completion

**Dispatch 1C: human-factors-teaming**
- Fix §A19 arithmetic inconsistency ("3 hours" / "2 hours" error) — this is Blocker AE-S8-06 and RM-M02
- Add OOD alert rate derivation or flag as §A19 TBD with sensitivity bounds (RM-B01)
- Add 0.6 concurrency factor derivation or cite queuing estimate (RM-M01, AE-S8-04)
- Add derivation trace for 0.2 person-hours/robot-hour factor (RM-M03)
- Fix §A19 periodic demand to match §02-04 (RM-M05; CC-S8-002)
- Propagate T16 decision from Dispatch 1A to §02-04 summary and §A18–§A19
- Fix "88% margin" language to standard utilization terms (AE-S8-03)
- Add failure mode analysis for §A1 gate miss (DA-7, 2 paragraphs in §02-04 §3)
- Add 60% checkpoint demand derivation for 2040 ratio (RM-M04)
- Execute §02-04 scope cuts SD-8-008, 009 (~250 words)
- Align §02-01 with two-tier floor restructuring from Dispatch 1A
- Remove ≤50 ms "architect must confirm" hedge (AE-S8-14 partial)
- Verify §02-04 word count < 4,620 before completion

*Note: Dispatches 1A, 1B, 1C can run in parallel. 1C depends on T16 decision from 1A — if dispatched simultaneously, 1C must check the §02-03 task table after 1A completes.*

### Wave 2 — Post-Gate Verification (after Wave 1)

**Dispatch 2A: scope-discipline-reviewer (targeted re-review)**
- Verify §02-02 < 3,000 words
- Verify §02-03 < 3,000 words
- Verify §02-04 < 4,620 words
- Confirm all removable-content map items executed

**Dispatch 2B: aerospace-engineer, reliability-margins, cross-coupling reviewers (targeted)**
- Confirm AE-S8-06 fix (§A19 arithmetic)
- Confirm RM-B01 response (OOD alert rate)
- Confirm CC-S8-001 resolution (task allocation count)
- Confirm CC-S8-003 fix (Tier A boundary)
- Confirm AE-S8-09 resolution (same as CC-S8-001)

**Dispatch 2C: devil's advocate (targeted)**
- Confirm DA-5/DA-8 response: two-tier floor with explicit gate criteria
- Confirm DA-6 response: task-redesign engagement added

### Wave 3 — Handback

**After all Wave 2 checks clear:**
- Meta-supervisor dispatch (Task 7)
- Retro updates (Task 8)
- `python tools/generate_handback.py --stage 8 --out handback-stage8.md`

---

## Heritage-Citations Findings

**Zero dangling citation keys.** All 22 `\cite{key}` occurrences resolve to entries in `corpus/references.bib`. Structurally clean.

Three **Major** factual errors that must be corrected before submission:

| ID | Section | Error | Dispatch |
|----|---------|-------|----------|
| HC-01 | §02-02 | METERON SUPVIS Justin ISS sessions dated "2015–2016" — actual sessions: Aug 2017, Mar 2018, late 2018. Will be caught immediately by any METERON-familiar reviewer. | teleoperation-latency |
| HC-02 | §02-02, §02-01, §02-04 | Queqiao-2 inclination stated as 62.4° (pre-launch design). Actual confirmed orbit: ~119.25° retrograde, ~254×16,941 km. Coverage estimates in §A17 (75–85% per orbit) were derived for the planned orbit; validity for actual orbit unverified. This is the most significant heritage finding — it may require §A17 revision. | teleoperation-latency + far-side-base-architect |
| HC-03 | §02-02 | Lunokhod 2 terminal failure: "solar panels covered with dust" is wrong. Actual: soil on thermal radiators caused thermal overheating. Lesson (latency + situational awareness) stands; specific technical claim is wrong. | teleoperation-latency |

Four **Minor** citation accuracy issues: HC-04 (Lunokhod 1 traverse distance uses pre-LRO figure), HC-05 (Mir maintenance mis-attributed to Kanas textbook, should be NASA TP-98-207890), HC-06 (image update interval citation points to cartography paper, not operations document), HC-07 (nasa_sma_spektr URL unconfirmed).

Three **Nits**: ssrms2020ntrs missing NTRS accession number; unitree2024h1 year mismatch (2023 in BibTeX, 2024 in key); Queqiao-2 path derivation omits lunar radius (~1,737 km), understating path by 12 ms RTLT.

**HC-02 is added to Dispatch 1B** (teleoperation-latency) — see also §A17 in the margins register.

---

## Escalations to User

Two DA findings from Stage 6 require user judgment, not just content fixes:

**DA-001 (Stage 6 — Economic model):** The economic model underlying the human-forward architecture has not been developed. This was flagged in Stage 6 and remains open. Is this addressed in Q(d) (Cost-Program section), and if so, is a forward-reference from Q(b) sufficient?

**DA-002 (Stage 6 — TRL 5 demo program):** The "2029 gate" requires a named facility and organizational commitment for the bipedal humanoid TRL 5 demo on a regolith testbed. This requires real facility and org identification. Is this Task 9's Q(d) Technology Roadmap deliverable?
