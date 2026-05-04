---
title: Heritage Citations Review Findings
status: findings-complete
owner: heritage-citations-reviewer
last-updated: 2026-05-03
stage: 8
---

# Heritage Citations Review Findings — Stage 8

**Scope:** Section 02 files only: `study/02-human-in-the-loop/01-overview.md`, `02-latency-tradespace.md`, `03-autonomy-trl-tasking.md`, `04-teaming-model.md`

**Method:** All cite keys extracted and checked against `corpus/references.bib`; five specific claims verified by web search.

---

## Citation Key Inventory

All `\cite{key}` occurrences found in the four Section 02 files:

| Key | Used in file(s) | In references.bib? |
|---|---|---|
| `sheridan1978teleoperators` | 01-overview, 02-latency | YES |
| `huntress2011soviet` | 01-overview, 02-latency, 03-autonomy-trl-tasking, 04-teaming-model | YES |
| `zhao2023aloha` | 01-overview, 03-autonomy-trl-tasking, 04-teaming-model | YES |
| `basner2013mars500` | 01-overview, 04-teaming-model | YES |
| `cnsa2024queqiao2` | 01-overview, 02-latency, 04-teaming-model | YES |
| `lroc_lunokhod2_traverse` | 02-latency | YES |
| `meteron2019analog1` | 02-latency | YES |
| `meteron2015haptics2` | 02-latency | YES |
| `schmaus2019suprvisjustin` | 02-latency | YES |
| `kontur2016forcefeedback` | 02-latency | YES |
| `ono2018msl` | 02-latency, 03-autonomy-trl-tasking | YES |
| `spj2021lunarrelay` | 02-latency | YES |
| `kanas2008space` | 04-teaming-model | YES |
| `diftler2011r2` | 03-autonomy-trl-tasking | YES |
| `ssrms2020ntrs` | 03-autonomy-trl-tasking | YES |
| `bmw2024figuredeployment` | 03-autonomy-trl-tasking | YES |
| `agility2024digit` | 03-autonomy-trl-tasking | YES |
| `unitree2024h1` | 03-autonomy-trl-tasking | YES |
| `bdatlaselectric2024` | 03-autonomy-trl-tasking | YES |
| `black2024pi0` | 03-autonomy-trl-tasking, 04-teaming-model | YES |
| `nvidia2023jetson` | 03-autonomy-trl-tasking | YES |
| `nasa_sma_spektr` | 04-teaming-model | YES |

**Result: Zero dangling citation keys across all four Section 02 files.** Every `\cite{key}` in the text resolves to an entry in `corpus/references.bib`. This is the correct baseline posture and contrasts favorably with the Stage 6 findings for Section 01.

---

## Spot-Check Verification Log

| # | Claim | Citation | Verified? | Findings |
|---|---|---|---|---|
| 1 | METERON SUPVIS Justin: "task-level supervisory command is robust to 800 ms delays" | `schmaus2019suprvisjustin` | YES — accurate | Search confirms 832 ms average round-trip delay (800–1132 ms range) in SUPVIS Justin sessions 2017–2018. The key finding (task-level supervisory command robust to 800 ms; direct teleoperation not) is accurately characterized. MINOR: The text attributes SUPVIS Justin to "2015–2016" (§02-02, Heritage Anchor 2) but ISS crew sessions occurred in 2017–2018. Confirmed by DLR METERON website. |
| 2 | Sheridan/Verplank 1978 10-level taxonomy | `sheridan1978teleoperators` | YES — accurate | The 10-level taxonomy is confirmed by multiple scholarly sources. Correct institution (MIT Man-Machine Systems Laboratory). Publication exists in NASA NTRS (NTRS citation 19790007441). The BibTeX entry's techreport type and institution are correct. |
| 3 | Lunokhod NIP-10 five-person crew structure: driver, navigator, systems engineer, antenna operator, commander | `huntress2011soviet` | YES — accurate | Five-man crew structure confirmed across multiple independent sources including Wikipedia Lunokhod programme article and Smithsonian Air & Space. Roles confirmed as: driver (joystick), navigator, antenna operator, flight/systems engineer, commander. NIP-10 location at Simferopol-28 / Shkolnoye, Crimea confirmed. |
| 4 | Mars-500 Basner et al. 2013 PNAS: hypokinesis increased, sleep altered, one crew member accounted for majority of errors | `basner2013mars500` | YES — accurate | DOI 10.1073/pnas.1212646110 confirmed. PNAS vol. 110, no. 7, pp. 2635–2640. Key findings accurately reported: protracted hypokinesis across mission; sleep/wake alterations; individual variability in performance degradation. The study's characterization is faithful to the published findings. |
| 5 | Queqiao-2 orbital parameters: periapsis ~200–250 km, apoapsis ~16,000–17,000 km, inclination 62.4°, period ~24 hours | `cnsa2024queqiao2` | PARTIALLY WRONG — see HC-08 | The planned parameters (200 × 16,000 km, 62.4°, 24 hr) are accurately reported. However, independent tracking by Scott Tilley in September 2024 revealed the satellite entered a 119.25° retrograde orbit (~254 × 16,941 km), not the planned 62.4° prograde orbit. The 62.4° inclination figure is the planned/nominal specification, not the confirmed operational orbit. The satellite is confirmed operational and relaying for Chang'e-4, but the actual orbital inclination differs from the value cited throughout the study. |
| 6 | Lunokhod frame-advance technique: "7–20 second image update interval" | `lroc_lunokhod2_traverse` | YES — accurate | Multiple sources confirm: Lunokhod 2 cameras returned images at 3.2, 5.7, 10.9, or 21.1 seconds per frame. Operational update interval of "7 to 20 seconds" for operators cited in Murphy 1998 CMU technical report. The `lroc_lunokhod2_traverse` citation is a cartography paper; image update interval data is more accurately sourced to mission documentation, but the interval range is correct. |
| 7 | Lunokhod 2 terminal failure: "drove into a crater whose trailing shadow was not visible in the preceding frame, covering the solar panels with dust" | `lroc_lunokhod2_traverse` | PARTIALLY WRONG — see HC-09 | The Smithsonian Air & Space account clarifies: Lunokhod 2 descended into a crater; when operators maneuvered it out, the lid touched the crater wall, depositing dust on the solar cells; when the lid closed, that dust was deposited onto the radiators (not directly the solar panels). The insulation effect then caused thermal overheating — the mechanism was radiator contamination, not direct solar panel coverage. The text's "covering the solar panels with dust" is a simplification that misidentifies the failure mechanism. |
| 8 | Lunokhod 1 traverse: "10.54 km over 10.5 months" | `huntress2011soviet` / `lroc_lunokhod2_traverse` | PARTIALLY WRONG — see HC-10 | Lunokhod 1 operated from November 17, 1970 through ~September 14, 1971 (last contact), with operations formally ended October 4, 1971 — approximately 10.5 months, correct. However, LRO photogrammetry (Karachevtseva et al., same paper group as lroc_lunokhod2_traverse) revised the Lunokhod 1 traverse from 10.54 km to 9.93 km. The lroc_lunokhod2_traverse citation is for Lunokhod 2 only; the Lunokhod 1 distance revision is from a companion paper not cited in the study. |
| 9 | Mir crew time: "30–40% of crew time went to unscheduled maintenance" | `kanas2008space` | UNCERTAIN — see HC-11 | Web searches did not confirm this specific percentage from Kanas & Manzey or the Mir Mission Chronicle. The ESA Mir bulletin describes crew workday as "6.5 net working hours for experimental work and/or system maintenance" with significant unscheduled maintenance. The 30–40% figure is plausible and consistent with known Mir operational history, but cannot be confirmed as a figure from Kanas & Manzey 2008 specifically without access to the full text. The citation may be an over-attribution to Kanas & Manzey for a figure from the NASA Mir Mission Chronicle (NASA TP-98-207890). |
| 10 | TORU collision: "cosmonaut Tsibliev's incomplete mental model of the Progress spacecraft's altered center of gravity response characteristics" | `nasa_sma_spektr` | YES — accurate | Confirmed by NASA SMA safety message and multiple historical accounts. Tsibliev commanded manual TORU docking; Progress M-34 had altered CG due to overloaded cargo; the vehicle did not respond as expected; collision with Spektr followed. The URL given in the BibTeX entry matches the actual NASA SMA document location. |

---

## Findings

### HC-01 — Major — §02-02 — METERON SUPVIS Justin experiment dated "2015–2016" but ISS sessions occurred 2017–2018

**Severity:** Major
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Heritage Anchor 2
**Claim:** "The METERON SUPVIS Justin experiments (2015–2016) tested a supervisory control approach at ISS-to-ground latency."
**Citation status:** Citation exists (`schmaus2019suprvisjustin`); date in text is wrong
**Issue:** The Schmaus et al. 2019 paper documents SUPVIS Justin ISS crew sessions conducted in 2017 and 2018 (first session August 25, 2017 with Sergei Ryazansky; second session March 2018 with Scott Tingle; third session with Alexander Gerst in 2018). The ground preparation and simulation work began earlier, but the actual ISS-to-ground teleoperation experiments took place in 2017–2018, not 2015–2016. The METERON project began around 2013, and Haptics-1/Haptics-2 experiments were earlier, which may explain the date confusion — but SUPVIS Justin specifically ran in 2017–2018. The BibTeX entry for `schmaus2019suprvisjustin` correctly gives the paper year as 2019, which would be consistent with a 2017–2018 experimental campaign. The "2015–2016" date in the text is incorrect for the SUPVIS Justin sessions specifically.
**Required action:** Correct "2015–2016" to "2017–2018" for the SUPVIS Justin ISS sessions. If the intent was to reference the earlier ground-based preparation phases, clarify that the ISS crew sessions occurred in 2017–2018. Verify against `schmaus2019suprvisjustin` primary paper which states the experiment dates.

---

### HC-02 — Major — §02-02 — Queqiao-2 inclination stated as 62.4° but actual orbital inclination is ~119.25° (retrograde)

**Severity:** Major
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md` (Queqiao-2 Relay Geometry); `study/02-human-in-the-loop/01-overview.md` (§4); `study/02-human-in-the-loop/04-teaming-model.md` (Pillar 1)
**Claim:** "Queqiao-2 occupies an elliptical frozen orbit around the Moon with a periapsis of approximately 200–250 km and an apoapsis of approximately 16,000–17,000 km above the lunar surface, with an orbital period of approximately 24 hours and an inclination of 62.4°."
**Citation status:** Citation exists (`cnsa2024queqiao2`); the nominal parameters are from CNSA's pre-launch specification; the actual operational orbit differs
**Issue:** Independent astronomer Scott Tilley determined in September 2024 that Queqiao-2 entered a retrograde orbit with inclination approximately 119.25° and dimensions approximately 254 × 16,941 km — not the planned 62.4° prograde frozen orbit of 200 × 16,000 km. This is not a small rounding difference; the inclination differs by 57 degrees and the orbit is retrograde rather than prograde. The satellite is confirmed operational (successfully relayed for Chang'e-4 and Chang'e-6) so the change does not invalidate the relay function, but the claimed orbital parameters — specifically the 62.4° inclination — are the pre-launch design specification, not the confirmed operational state. The latency calculations in §02-02 are not materially affected (path lengths change only modestly given apoapsis altitude is similar), but the coverage geometry analysis (availability percentages, the "75–85% per orbit for a receiver at the equatorial far side") depends on inclination and would need to be revisited against the actual 119.25° retrograde orbit. 

The `cnsa2024queqiao2` BibTeX note correctly says "CNSA official communications and mission announcements, March–April 2024" — that is accurate as far as it goes. The issue is that independently observed post-deployment tracking revealed the actual orbit differs from what those March–April 2024 announcements described.
**Required action:** (1) Update the inclination statement from "62.4°" to the confirmed value (~119.25° retrograde) or qualify it explicitly as "planned/nominal specification per CNSA pre-launch announcements; actual operational inclination reported by independent tracking at ~119.25° retrograde (Scott Tilley, September 2024)." (2) Flag that the coverage availability estimate of 75–85% was derived for the 62.4° prograde orbit and has not been validated against the actual retrograde orbit geometry. (3) Update the `cnsa2024queqiao2` BibTeX note to acknowledge the post-deployment tracking discrepancy.

---

### HC-03 — Major — §02-02 — Lunokhod 2 terminal failure mechanism is mischaracterized: radiators contaminated, not solar panels directly covered

**Severity:** Major
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Heritage Anchor 1
**Claim:** "Lunokhod 2's final months: the rover drove into a crater whose trailing shadow was not visible in the preceding frame, covering the solar panels with dust that terminated the mission."
**Citation status:** Citation exists (`lroc_lunokhod2_traverse`); the claimed mechanism is factually inaccurate
**Issue:** The Lunokhod 2 terminal sequence, as documented in multiple sources including the Smithsonian Air & Space retrospective and the 2003 retrospective paper (Kemurdzhian et al.), was as follows: (1) The rover descended into a small crater (~4.5 m across) because the crater's shadow was hidden behind crater walls in the navigation camera view. (2) When operators maneuvered the rover out of the crater, the open lid of the solar panel array touched the crater wall, causing lunar soil to be deposited on the solar cells. (3) When the lid was then closed for the lunar night, that accumulated soil was transferred onto the thermal radiators on the rover body. (4) The insulating effect of soil on the radiators prevented adequate heat rejection; internal temperatures rose to fatal levels on the following day. The mission-ending failure was thus **radiator contamination causing thermal failure**, not direct solar panel coverage reducing power. The solar cells were briefly dirtied but the vehicle was not killed by power loss; it was killed by overheating. The text's framing ("covering the solar panels with dust that terminated the mission") misidentifies both the primary contamination surface (radiators, not solar panels) and the failure mode (thermal runaway, not power loss).

This matters programmatically because the text draws from this heritage the lesson about situational awareness and latency — which is valid. But the specific technical claim about the mechanism is wrong, and if used in a subsequent design argument about solar panel dust protection (as it might be in Section 05 or the far-side-base-architect section), the wrong lesson would be drawn.
**Required action:** Correct the failure mechanism description to: the rover descended into a crater whose rim was not visible in the preceding frame; during recovery, the open solar lid contacted the crater wall, depositing soil on the solar cells; when the lid closed, this soil was deposited onto the thermal radiators; insulation of the radiators caused thermal overheating that terminated the mission. The latency-and-situational-awareness lesson is preserved; the technical claim is corrected.

---

### HC-04 — Minor — §02-02 — Lunokhod 1 traverse distance of "10.54 km" is the superseded figure; LRO revision gives 9.93 km

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Heritage Anchor 1
**Claim:** "The Lunokhod traverse record — 10.54 km for Lunokhod 1 over 10.5 months; 39.16 km for Lunokhod 2 over approximately 5 months."
**Citation status:** `lroc_lunokhod2_traverse` cited; internally inconsistent treatment of the two rovers
**Issue:** The study cites `lroc_lunokhod2_traverse` (Karachevtseva et al., Planetary and Space Science, 2013) which is the LRO photogrammetry paper for Lunokhod 2, correctly establishing the revised 39.16 km figure. However, the same research group published a companion paper for Lunokhod 1 (Karachevtseva et al., Planetary and Space Science, 2013 — separate paper, same DOI series) that revised the Lunokhod 1 distance from the telemetry-based 10.54 km to **9.93 km** based on LRO NAC imagery. The study correctly uses the LRO-revised 39.16 km for Lunokhod 2 but retains the older, pre-LRO 10.54 km for Lunokhod 1. This is internally inconsistent: both figures should either use the LRO-revised values (9.93 km and 39.16 km) or both use the original telemetry-based estimates.

The combined traverse total cited in Section 02-03 as reference to "48 km of lunar surface with two vehicles" (implying 10.54 + ~37 original estimate ≈ 47.5 km, or 10.54 + 39.16 ≈ 49.7 km, or correctly 9.93 + 39.16 = 49.09 km) varies depending on which figures are used. The inconsistency does not affect the latency argument substantively, but it represents sloppy handling of the heritage record in a document that emphasizes heritage precision.
**Required action:** Either use the LRO-revised figures for both rovers (9.93 km and 39.16 km), citing both Karachevtseva papers, or retain the original telemetry figures for both (10.54 km and ~37 km) with a note that LRO revision exists. Do not mix LRO-revised Lunokhod 2 with pre-LRO Lunokhod 1. Add the Lunokhod 1 LRO cartography paper (companion to `lroc_lunokhod2_traverse`) to `corpus/references.bib` if the LRO-revised Lunokhod 1 figure is to be used.

---

### HC-05 — Minor — §02-04 — Mir crew time maintenance percentage (30–40%) attributed to Kanas & Manzey but primary source is likely NASA Mir Mission Chronicle

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Section 2 (Mir Baseline)
**Claim:** "The Mir Mission Chronicle establishes the baseline: across 28 long-duration expeditions (1986–2000), approximately 30–40% of crew time went to unscheduled maintenance and repair, 20–30% to scheduled science, 15% to mandatory exercise (two hours daily), and 25–35% to communications, documentation, housekeeping, and personal time. \cite{kanas2008space}"
**Citation status:** Citation exists but may be a mis-attribution; primary source is more likely the NASA Mir Mission Chronicle
**Issue:** The text explicitly names "Mir Mission Chronicle" as the source ("The Mir Mission Chronicle establishes the baseline") and then cites `kanas2008space` (Kanas & Manzey 2008, Space Psychology and Psychiatry). These are two different documents. The NASA Mir Mission Chronicle is NASA TP-98-207890 (Portree & Trevino, 1999), a primary institutional record of Mir operations. Kanas & Manzey is a textbook on space psychology. The 30–40% maintenance figure and the crew time breakdown given are more characteristic of an operational chronicle than a psychology textbook. Web search did not find the 30–40% figure attributed specifically to Kanas & Manzey in the space psychology literature. If the figure originates from the Mir Mission Chronicle (which seems likely given the text says "The Mir Mission Chronicle establishes the baseline"), then the citation should be to NASA TP-98-207890, not to Kanas & Manzey. The `kanas2008space` reference may be appropriate for the subsequent behavioral health discussion but is likely not the correct source for the crew time distribution figures.
**Required action:** Clarify and correct the citation. If the 30–40% maintenance figure and crew time breakdown come from the NASA Mir Mission Chronicle (TP-98-207890), cite that document (and add it to `corpus/references.bib`). Kanas & Manzey can be retained as the citation for behavioral health observations and the cognitive load discussion but should not be the citation for operational time allocation statistics.

---

### HC-06 — Minor — §02-02 — `lroc_lunokhod2_traverse` is a wrong-fit citation for the image update interval claim

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Heritage Anchor 1
**Claim:** "The crew adapted to this delay with a distinctive operational technique: the driver would issue a move command, then wait for the next transmitted television frame (updated every 7–20 seconds)."
**Citation status:** Cited to `lroc_lunokhod2_traverse` — a cartography paper, not an operations document
**Issue:** The `lroc_lunokhod2_traverse` BibTeX entry is the Karachevtseva et al. (2013) cartography paper establishing Lunokhod 2's traverse distance from LRO photogrammetry. It is a mapping and distance-measurement paper, not an account of teleoperation operations, image update intervals, or operator technique. The 7–20 second image update interval is confirmed by other sources (Lunokhod 2 had cameras operating at 3.2, 5.7, 10.9, or 21.1 s/frame; the 7–20 second figure appears in Murphy 1998 CMU-RI-TR-98-10 "Panospheric Video for Robotic Telexploration" citing Lunokhod operational records). The claim is accurate; the citation is the wrong source for it. The cartography paper establishes traverse distances, not operator technique.
**Required action:** Either add a more appropriate citation for the image update interval claim (e.g., Murphy 1998, or Huntress & Marov 2011 if that text covers operational technique) alongside `lroc_lunokhod2_traverse`, or replace `lroc_lunokhod2_traverse` with a more appropriate operations-focused source for this specific claim. Add the supplementary source to `corpus/references.bib`.

---

### HC-07 — Minor — §02-04 — NASA SMA Spektr citation URL format not verified as stable; document note may be inaccurate

**Severity:** Minor
**Section:** `study/02-human-in-the-loop/04-teaming-model.md`, Pillar 2 (Situational Awareness)
**Claim:** "The TORU manual docking failure (Spektr collision, 1997) resulted in part from cosmonaut Tsibliev's incomplete mental model of the Progress spacecraft's altered center of gravity response characteristics \cite{nasa_sma_spektr}."
**Citation status:** Citation exists; factual claim is accurate; BibTeX note contains a URL that may be outdated
**Issue:** The factual claim is accurate and consistent with multiple accounts of the Spektr collision. The `nasa_sma_spektr` BibTeX entry gives the URL `https://sma.nasa.gov/docs/default-source/safety-messages/safetymessage-2010-11-08-mirprogresscollision-vits.pdf` with note "To be confirmed against primary source before PDR." Web search confirms NASA SMA did publish such a document ("Spektr of Failure: Mir-Progress Collision"). The URL format is a common NASA SMA URL pattern and a direct URL from web search returned the document. The note "dated 8 November 2010" is confirmed.

One minor inaccuracy: the BibTeX entry identifies the document as "Safety Message" dated 8 November 2010, but the text characterizes it as a "Significant Incident Analysis." The NASA SMA website calls these "Safety Messages." This is a formatting issue only.
**Required action:** Confirm the URL resolves and update the BibTeX note from "To be confirmed against primary source before PDR" to "Confirmed accessible at URL as of [date]" when primary source access is achieved. Correct "Significant Incident Analysis" in the text (if the document is a Safety Message) or verify the NASA SMA document uses that title.

---

### HC-08 — Nit — §02-03 — `ssrms2020ntrs` entry carries [VERIFY] flag and no confirmed NTRS document number

**Severity:** Nit
**Section:** `study/02-human-in-the-loop/03-autonomy-trl-tasking.md`; `corpus/references.bib`
**Claim:** "SSRMS (Canadarm2) has operated continuously on ISS since 2001. Seven joints using harmonic drive transmissions with brushless DC motors. TRL 8 for its defined task set."
**Citation status:** Citation exists; BibTeX entry is self-flagged [VERIFY] with no NTRS accession number
**Issue:** The `ssrms2020ntrs` BibTeX entry explicitly states "[VERIFY] — SSRMS operational heritage widely cited; primary NTRS reference number TBD before PDR." The citation is used in Section 02-03 without flagging the verification status to the reader. The SSRMS factual claims (7 joints, harmonic drives, TRL 8) are accurate per publicly available NASA and Canadian Space Agency documentation, but the specific NTRS document cited does not have a confirmed accession number. This is a low-severity issue because the facts are not in dispute — SSRMS is extensively documented — but the citation scaffolding is incomplete.
**Required action:** Locate a specific NTRS document (or NASA/CSA technical publication) for SSRMS and add the accession number to the BibTeX entry. Remove the [VERIFY] flag once confirmed. Candidate documents include MDA Space publications and JSC Engineering Papers on Canadarm2. This does not affect the Section 02-03 argument but should be resolved before PDR per the citation discipline policy.

---

### HC-09 — Nit — §02-03 — `unitree2024h1` BibTeX key year is 2023 in the entry body; key implies 2024

**Severity:** Nit
**Section:** `corpus/references.bib`
**Claim:** No specific claim — formatting consistency issue in the BibTeX entry
**Citation status:** BibTeX entry exists; year field inconsistent with key name
**Issue:** The `unitree2024h1` entry in `corpus/references.bib` gives `year = {2023}` in the entry body, while the key name `unitree2024h1` implies 2024. (This mirrors the `ono2018msl`/year=2015 inconsistency flagged in Stage 6 as HC-12.) The Unitree H1 was announced/launched in 2023; the 2024 key name may refer to the product page access date. The inconsistency is minor but creates confusion.
**Required action:** Align the BibTeX key with the year in the entry body. Either change the key to `unitree2023h1` (matching year = 2023) and update all in-text citations, or update year = 2024 if the product page was substantially updated in 2024. Low priority.

---

### HC-10 — Nit — §02-02 — Queqiao-2 RTLT derivation rounds relay path distance inconsistently

**Severity:** Nit
**Section:** `study/02-human-in-the-loop/02-latency-tradespace.md`, Queqiao-2 Relay Geometry
**Claim:** "Earth-to-Queqiao-2 at apoapsis: approximately 384,400 + 16,500 = ~400,900 km from Earth center."
**Citation status:** N/A — arithmetic issue, not citation issue
**Issue:** The derivation uses "16,500 km" as the midpoint representative of the "16,000–17,000 km" apoapsis range. This is internally consistent. However, the apoapsis altitude is measured above the lunar surface, not above the lunar center. The Moon's mean radius is 1,737 km, so the satellite at 16,500 km above the surface is approximately 16,500 + 1,737 = 18,237 km from the lunar center. The calculation "384,400 + 16,500 = ~400,900 km from Earth center" adds Earth-Moon center distance to the satellite altitude above the lunar surface, not the satellite distance from the lunar center. This understates the Earth-to-satellite distance by approximately 1,737 km (the lunar radius), producing a calculated OWLT of 1.337 s when the correct value would be approximately 400,900 + 1,737 = 402,637 km ÷ 299,792 = 1.343 s. The resulting RTLT would be 2.686 s rather than the stated 2.674 s — a difference of about 12 ms. This is below program significance but the derivation is arithmetically imprecise.
**Required action:** Add the lunar radius (1,737 km) to the Earth-satellite path calculation, or note explicitly that the satellite altitude above the surface is being used as a proxy for the full geometric path (acceptable for back-of-envelope, not for a derivation that shows calculation steps). The 2.78 s minimum RTLT figure used throughout the study is already conservative enough to absorb this correction.

---

## Cross-Cutting Observations

**1. Section 02 BibTeX population is complete.** All citation keys used in Section 02 files are present in `corpus/references.bib`. This is a significant improvement over the Stage 6 state for Section 01, where approximately 20+ keys were missing.

**2. The Queqiao-2 orbital parameter issue (HC-02) is the most consequential finding.** The study's relay geometry analysis, availability estimates, and latency calculations all proceed from the planned 62.4° prograde orbit. The actual confirmed retrograde orbit at 119.25° has different coverage geometry for far-side receivers. The latency arithmetic is not materially affected (apoapsis altitude similar), but the coverage availability percentages are derived from a geometry that does not match the operational satellite.

**3. The Lunokhod 2 failure mechanism error (HC-03) propagates a wrong lesson.** The text argues from Lunokhod 2's terminal failure that "latency prevents the operator from seeing what the robot is doing." That lesson is correct. But the stated mechanism — "solar panels covered with dust" — is wrong; the failure was radiator contamination causing thermal overheating. If the study elsewhere uses Lunokhod 2 as heritage for solar panel dust protection design, it would be drawing the wrong design implication.

**4. SUPVIS Justin date error (HC-01) is a credibility issue in front of expert reviewers.** Anyone familiar with the METERON program will immediately recognize that "2015–2016" is wrong for the ISS crew sessions. This is a verifiable fact, not an interpretation, and incorrect dates in a heritage-anchored study undermine confidence in the rest of the heritage claims.

**5. The Mir maintenance percentage (HC-05) is likely correctly sourced to the Mir Mission Chronicle but wrongly cited to Kanas & Manzey.** The NASA TP-98-207890 is a primary institutional source; Kanas & Manzey is a secondary synthesis. The text even names "Mir Mission Chronicle" as the source while citing the textbook — this is an internal contradiction.

---

## Summary Count Table

| Severity | Count |
|---|---|
| Blocker | 0 |
| Major | 3 |
| Minor | 4 |
| Nit | 3 |
| **Total** | **10** |

**Key finding for Section 02:** No dangling citation keys (zero blockers on that criterion). Three major findings — two factual errors (Queqiao-2 inclination, Lunokhod 2 failure mechanism) and one date error (SUPVIS Justin dates). All are correctable without restructuring the arguments they support. The latency and supervisory control arguments are sound; the heritage claims that anchor them need targeted correction.
