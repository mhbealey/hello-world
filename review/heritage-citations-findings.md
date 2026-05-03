---
title: Heritage Citations Review Findings
status: findings-complete
owner: heritage-citations-reviewer
last-updated: 2026-05-03
---

# Heritage Citations Review Findings

## Summary

| Severity | Count |
|----------|-------|
| Blocker  | 2     |
| Major    | 6     |
| Minor    | 5     |
| Nit      | 4     |

---

## Spot-check log

| Claim | Source cited | Verified? | Notes |
|-------|-------------|-----------|-------|
| Atlas Electric mass: 89 kg | `\cite{bostondynamics2024atlas}` | YES | Multiple sources confirm 89 kg. |
| Atlas Electric DOF: 56 | `\cite{bostondynamics2024atlas}` | PARTIAL — CONFLICT | Web search confirms 56 DOF. However, the heritage table in §01-01 claims 56 DOF, while §03 actuation description calls Atlas's actuator type "planetary roller-screw linear actuators" — Atlas Electric uses custom direct-drive electric actuators, not harmonic drives or roller screws. The "planetary roller-screw" description applies to the older hydraulic Atlas; the 2024 electric version uses fully rotational joints with custom high-density electric actuators, not linear roller-screw actuators. This is a mischaracterization in the heritage table. |
| Atlas Electric efficiency 85–90% electrical-to-mechanical | `\cite{bostondynamics2024atlas}` | YES | Confirmed by multiple sources including Boston Dynamics' own blog post "An Electric New Era for Atlas." |
| NASA Valkyrie R5 mass: 129 kg, 44 DOF | `\cite{nasa2023valkyrieFactsheet}` | YES | NASA fact sheet and Wikipedia both confirm 129 kg and 44 DOF. |
| Chang'e-4 LND radiation: ~60 µSv/hr dose equivalent | `\cite{zaconte2020lnd}` | PARTIAL — ATTRIBUTION ERROR | The ~60 µSv/hr figure is correct and verified (Zhang et al., Science Advances, 2020, DOI: 10.1126/sciadv.aaz1334). However, the citation key `zaconte2020lnd` and the references section in §05 attributes this to "Wimmer-Schweingruber et al." — the actual lead author is Shenyi Zhang (Robert F. Wimmer-Schweingruber is a co-author). The citation key name "zaconte" matches neither author and appears to be an invented/incorrect key name. |
| Lunokhod 2 distance: 39.16 km | `\cite{huntress2011soviet}` (in §04) | PARTIAL — WRONG SOURCE | The 39.16 km figure is correct (LRO photogrammetry revised from 37 km). However, this measurement was NOT in Huntress & Marov 2011 — the LRO-based cartographic revision was published post-2011 (ScienceDirect paper on LROC NAC imaging). Huntress & Marov (2011) would have cited the older ~37 km estimate. The soviet-russian-heritage.md notes "39.16 km (revised upward from original 37 km estimate by LRO laser ranging analysis)" as distinct recent data. |
| Mars rover AutoNav operational since 2014 (TRL 8 claim) | `\cite{ono2018msl}` | PARTIALLY WRONG | §04 text states AutoNav has "been operational on Curiosity and Perseverance since 2014" and uses it as TRL 8 heritage. Web search confirms AutoNav debuted on Curiosity in August 2013 (not 2014). The cited Ono et al. paper is a 2015 IEEE Aerospace Conference paper; BibTeX entry in references.bib gives `year = {2015}` but the paper title says "2015 IEEE Aerospace Conference" and the content describes Curiosity AutoNav. The claim in §04 uses "since 2014" which is slightly off from the actual 2013 debut. Not a major error but the date is incorrect. |
| FEDOR/Skybot F-850 mass: 106 kg | No direct citation in §01-01 | UNVERIFIABLE — CONFLICT | The heritage table cites 106 kg with no citation. Web search returns both 106 kg and 160 kg from different sources. The soviet-russian-heritage.md (§6) gives "~160 kg (launch configuration)". The 106 kg figure may refer to the robot without launch packaging or the operational configuration; the 160 kg figure appears in Russian sources for the launch-ready configuration. The value is unverified and conflicts with the study's own heritage notes. |
| Robonaut 2 leg installation: 40 hours vs. 20 planned | `\cite{space2018r2return}` | YES | Confirmed by NASA sources: leg installation took ~40 hours vs. ~20 planned. |
| ISS Li-ion battery ~160 Wh/kg (space-qualified) | `\cite{nasa_iss_battery}` | PARTIALLY CONFIRMED | ISS Li-ion cells achieved ~155 Wh/kg at beginning of life (BOL), per NASA NTRS documents. The study uses 160 Wh/kg as "design-to," which is slightly optimistic vs. the 155 Wh/kg documented BOL figure. The citation `\cite{nasa_iss_battery}` carries a note "Cite to be confirmed against primary source before PDR" — flagged as unconfirmed by the author. |
| Lunokhod 1 distance: 10.5 km | `\cite{huntress2011soviet}` | YES | Confirmed at ~10.54 km. |
| Atlas Electric actuator type: "planetary roller-screw linear actuators" | `\cite{bostondynamics2024atlas}` | WRONG | Atlas Electric (2024) uses custom direct-drive rotational actuators, not linear planetary roller-screw actuators. The roller-screw actuators were a feature of the hydraulic-to-electric transition concept (Atlas Electric blog) but the production 2024 model uses fully rotational joints with custom direct-drive motors. The §01-01 heritage table's description is technically incorrect. |

---

## Findings

### HC-001 — BLOCKER — §01-01 / §01-03 — Atlas Electric actuator type misidentified as roller-screw linear

**Section:** `study/01-optimal-space-humanoid/01-overview.md` (heritage table) and `study/01-optimal-space-humanoid/03-actuation-structures.md` (Section 1, HD-Electric discussion)
**Severity:** Blocker
**Claim:** §01-01 heritage table lists Atlas Electric actuation type as "Electric (planetary roller-screw linear actuators, high-density NdFeB motors)". §03 cites Atlas Electric as heritage for HD-Electric harmonic drive efficiency of 85–90%.
**Citation status:** Cited (`\cite{bostondynamics2024atlas}`) but used incorrectly
**Issue:** The 2024 Atlas Electric uses custom fully-rotational direct-drive actuators, not linear planetary roller-screw actuators. The roller-screw linear architecture appeared in Boston Dynamics' electric-transition prototype era, not the 2024 production robot. More critically, §03 uses Atlas Electric as the primary heritage citation for "HD-Electric with harmonic drives" — but Atlas Electric does not use harmonic drives. It uses custom high-torque direct-drive motors. The 85–90% efficiency figure appears to be correctly attributed (multiple sources confirm Boston Dynamics published this for the electric Atlas), but the claim that this efficiency comes from harmonic drive transmissions cannot be sourced to Atlas. The entire actuation architecture section's HD-Electric position is supported by a heritage mischaracterization. The heritage citation justifies harmonic drives using a robot that doesn't use them.
**Required action:** (1) Correct the §01-01 heritage table actuator description from "planetary roller-screw linear actuators" to "custom fully-rotational direct-drive electric actuators." (2) Remove Atlas Electric as the primary heritage citation for the harmonic drive architecture choice in §03. Find an appropriate primary citation for harmonic drive efficiency (e.g., Harmonic Drive AG technical papers, SSRMS joint documentation) or reframe the HD-Electric position with the correct heritage. The efficiency figure (85–90%) can remain attributed to Atlas Electric as a benchmark for electric actuator performance generally, but not as evidence that harmonic drives achieve this efficiency.

---

### HC-002 — BLOCKER — §01-05 — Chang'e-4 LND citation key is non-existent in references.bib and lead author is wrong

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md` (Section 1 and Section 3)
**Severity:** Blocker
**Claim:** The radiation dose rate of ~60 µSv/hr is attributed to `\cite{zaconte2020lnd}` and references section identifies this as "Wimmer-Schweingruber et al."
**Citation status:** Fabricated key / Wrong attribution
**Issue:** Two problems: (1) The BibTeX key `zaconte2020lnd` does not appear in `/home/user/hello-world/corpus/references.bib` at all — the citation is made but the BibTeX entry was never added to the corpus. (2) The lead author on the Science Advances paper (DOI: 10.1126/sciadv.aaz1334) is Shenyi Zhang, not Wimmer-Schweingruber. Wimmer-Schweingruber is a co-author. The references section of §05 reads "Wimmer-Schweingruber et al." which is the wrong primary attribution. The 60 µSv/hr figure itself is correct and verified, so the underlying data is real — but the citation scaffolding is wrong on both counts.
**Required action:** (1) Add a properly formed BibTeX entry to `corpus/references.bib` for Zhang et al. (2020), Science Advances, DOI 10.1126/sciadv.aaz1334. (2) Rename the citation key (e.g., `zhang2020lnd`) and update all in-text citations and the §05 references section accordingly. (3) Correct the attribution in §05 references section from "Wimmer-Schweingruber et al." to "Zhang, S. et al. (lead author)."

---

### HC-003 — MAJOR — §01-04 — AutoNav "TRL 8 since 2014" claim: wrong year and unsupported TRL level

**Section:** `study/01-optimal-space-humanoid/04-sensing-autonomy.md` (Section 3, Reactive Layer discussion and Section 5 Lunokhod counterpoint)
**Severity:** Major
**Claim:** "Mars rover AutoNav traverse capability applied to a biped — AutoNav has been operational on Curiosity and Perseverance since 2014, representing the most relevant flight heritage for autonomous operation at this layer."
**Citation status:** Cited (`\cite{ono2018msl}`) — incorrect year in claim
**Issue:** AutoNav on Curiosity debuted on August 27, 2013, not 2014. The JPL press release "NASA's Mars Curiosity Debuts Autonomous Navigation" is from 2013. The year error is minor in isolation but "since 2014" reads as a programmatic fact supporting a TRL claim. More substantively, the text in §04 does not explicitly say "TRL 8" but the study's broader claims use AutoNav as a TRL 8 reference for deliberative path planning; the referenced Ono et al. 2015 paper is a conference paper on risk-aware path planning algorithms, which is terrain classification and path planning research — not a TRL 8 certification or demonstration. The BibTeX entry in references.bib confirms this is a 2015 IEEE Aerospace Conference paper. Using a methods/research paper as evidence of operational TRL 8 status is a misuse of the citation.
**Required action:** Correct the year from "since 2014" to "since 2013." Clarify that AutoNav's operational status on Curiosity/Perseverance supports a TRL heritage claim for the capability class (terrain-classified autonomous traverse) but the Ono et al. citation is a research paper on the method, not a TRL validation report. Supplement with a more direct operational heritage citation (e.g., JPL mission status reports or the Science Robotics 2023 paper on Perseverance autonomous systems) if TRL 8 is to be claimed explicitly.

---

### HC-004 — MAJOR — §01-01 / §01-05 — FEDOR mass conflict between heritage table and soviet-russian-heritage.md

**Section:** `study/01-optimal-space-humanoid/01-overview.md` (heritage table row for FEDOR/Skybot F-850)
**Severity:** Major
**Claim:** Heritage table gives FEDOR mass as 106 kg with no citation. §05 references section cites `\cite{therobotreport2019skybot}` for FEDOR.
**Citation status:** Uncited in heritage table; conflicts with own study's heritage notes
**Issue:** The `soviet-russian-heritage.md` document in §6 gives FEDOR's mass as "~160 kg (launch configuration)." The §01-01 heritage table gives 106 kg with no citation or note explaining the discrepancy. Web search returns both figures — 106 kg appears to be the operational robot-only configuration, while 160 kg includes launch support hardware. The 106 kg figure may be defensible but the discrepancy between 106 kg in the heritage table and ~160 kg in the study's own verified heritage notes creates an internal inconsistency. No citation supports either figure in the heritage table. The heritage table's FEDOR entry for DOF also notes "48 (brushless motor count used as DOF proxy; actual articulated DOF unverified)" — the mass should receive the same "unverified" treatment.
**Required action:** Add a citation for the 106 kg figure or mark it **[VERIFY]**. Add a note to the heritage table explaining the discrepancy with the ~160 kg launch-configuration figure documented in `soviet-russian-heritage.md`. The two figures should be reconciled before PDR with a note distinguishing operational robot mass from launch-manifest mass.

---

### HC-005 — MAJOR — §01-02 — Lunokhod 2 distance attributed to Huntress & Marov (2011), which predates the LRO measurement

**Section:** `study/01-optimal-space-humanoid/02-form-factor-tradespace.md` (Candidate B discussion) and `study/01-optimal-space-humanoid/04-sensing-autonomy.md` (Section 5 Lunokhod counterpoint)
**Severity:** Major
**Claim:** §02 refers to "Lunokhod's 10.5-km traverse over 11 months" (cited to `\cite{huntress2011soviet}`). §04 states "Lunokhod accumulated 48 km of traverse over two vehicles across multiple years" (cited to `\cite{huntress2011soviet}`).
**Citation status:** Partially wrong — Huntress & Marov 2011 predates the LRO-revised figure
**Issue:** The 39.16 km figure for Lunokhod 2 (noted in `soviet-russian-heritage.md`) is based on LRO photogrammetry analysis published after 2011 (the ScienceDirect cartography paper). Huntress & Marov (2011) would have cited the older ~37 km estimate. Citing Huntress & Marov for "48 km total" (§04: 10.5 km + ~37-39 km) is possible only if using the more recent revised figure for Lunokhod 2 distance — but then the source for the Lunokhod 2 portion must be the LRO-based cartography paper, not Huntress & Marov. The claim is supportable but the citation is wrong for the more precise modern figure. §02 avoids the specific distance claim (says only "10.5-km traverse" for Lunokhod) — this is correctly attributed. §04's "48 km" aggregate is where the citation mismatch occurs.
**Required action:** For §04's "48 km of traverse over two vehicles," add a second citation for the LRO-based Lunokhod 2 revised distance alongside `\cite{huntress2011soviet}`, and add the LRO cartography paper to `corpus/references.bib`. Alternatively, use ~47 km (10.5 + ~37 km original estimate) with Huntress & Marov as the sole citation and note the LRO revision in a footnote.

---

### HC-006 — MAJOR — §01-03 — "Valkyrie at 21 W mean per joint" used as HD-Electric efficiency proxy when it is SEA data

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md` (Section 5, Open Question 3) and `study/01-optimal-space-humanoid/06-mass-power-budget.md` (Section 2, Actuation power notes)
**Severity:** Major
**Claim:** §03 states: "at 21 W mean per joint (from Valkyrie SEA per-joint data \cite{paine2015valkyrieActuator}, adjusted for improved efficiency), simultaneous full-effort engagement of 38 joints would exceed 800 W."
**Citation status:** Cited but methodologically misused
**Issue:** The Paine et al. 2015 paper describes Valkyrie's SEA (Series Elastic Actuator) per-joint power performance. The study's chosen actuation architecture is HD-Electric (harmonic drives), explicitly selected *instead of* SEA partly on the basis that HD-Electric is more mass-efficient. Using SEA per-joint power data as the baseline for an HD-Electric architecture then "adjusting for improved efficiency" is a circular argument: the adjustment factor is not cited to any source. The 800 W peak power budget derives in part from this unadjusted SEA-to-HD conversion. The power budget is one of the study's primary numerical commitments that flows downstream to far-side-base-architect and cost-program. Using the wrong baseline actuator heritage for the power estimate and applying an uncited efficiency adjustment factor is a major methodological issue for a document that emphasizes margin discipline.
**Required action:** Either find HD-Electric-specific per-joint power data from Atlas Electric or comparable harmonic-drive robot platforms, or explicitly document the SEA-to-HD efficiency adjustment factor with a citation. The §03 open question already flags this as needing a "task-level simulation" — that should also note the absence of HD-Electric heritage data for per-joint power. The §A3 power budget assumption in the margins register should flag this derivation as an estimated value, not a heritage-anchored value.

---

### HC-007 — MAJOR — §01-03 — "HD-Electric efficiency 85–90%" attributed to Atlas which uses direct drive, not harmonic drives

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md` (Section 1, HD-Electric description)
**Severity:** Major
**Claim:** "Electrical-to-mechanical efficiency of 85–90% is documented for Atlas \cite{bostondynamics2024atlas}."
**Citation status:** Cited but misattributed to wrong mechanism
**Issue:** This is a consequence of HC-001. The 85–90% figure is real and attributable to the electric Atlas platform. However, the section uses this figure as evidence for harmonic drive efficiency specifically, saying it is "documented for Atlas \cite{bostondynamics2024atlas}." Since Atlas Electric uses direct-drive, not harmonic drives, this figure is evidence for direct-drive electric actuator efficiency — not for harmonic drives. Harmonic drives are known to have lower efficiency (typically 70–85% depending on reduction ratio and load) due to flexspline friction, which the Atlas figure would actually overstate. The study's actuation architecture choice (harmonic drives) may be undermined by this misattribution: if the efficiency figure that makes HD-Electric attractive is actually from a direct-drive robot, the case for harmonic drives loses its strongest published efficiency support.
**Required action:** Separate the efficiency claim from the Atlas citation. Cite Atlas Electric efficiency (85–90%) as evidence for modern electric actuator performance generally. Find and cite primary sources specific to harmonic drive efficiency (Harmonic Drive AG product data, SSRMS actuator papers, or Valkyrie HD joint papers if any exist) to establish the HD-Electric efficiency range independently. If primary sources show harmonic drive efficiency is lower than 85–90%, this must be reflected in the power budget.

---

### HC-008 — MINOR — §01-06 — ISS battery citation marked by author as unconfirmed; energy density value slightly optimistic

**Section:** `study/01-optimal-space-humanoid/06-mass-power-budget.md` (Section 1, Battery Sizing; Section 5, §A13)
**Severity:** Minor
**Claim:** "ISS battery replacement project using lithium-ion at ~160 Wh/kg, 2017–2019" cited to `\cite{nasa_iss_battery}`.
**Citation status:** Author self-flagged as unconfirmed; value slightly off
**Issue:** The citation carries its own note: "[Cite to be confirmed against primary source before PDR]." This is a responsible flag by the author, but a citation carrying this note should not anchor a budget assumption. The NTRS document on ISS Li-ion batteries reports 155 Wh/kg at beginning-of-life (BOL), not 160 Wh/kg. The study uses 160 Wh/kg as the design-to value. This 3% overstatement (5 Wh/kg) translates to approximately 0.4 kg of optimism in the battery cell mass calculation — within noise, but against the study's own commitment to heritage-before-invention and margin discipline. Additionally, `\cite{nasa_iss_battery}` does not appear in `corpus/references.bib`, making it a dangling citation.
**Required action:** (1) Add the NTRS ISS Li-ion battery paper to `corpus/references.bib` with a proper BibTeX entry. (2) Confirm the energy density figure against the primary source (NTRS 20160012048 or 20170003873 appear to be the relevant documents). (3) If the correct figure is 155 Wh/kg, revise the design-to value or note the 5 Wh/kg optimism as a known deviation with explicit justification.

---

### HC-009 — MINOR — §01-01 — Multiple major citations absent from references.bib

**Section:** All six section files; `corpus/references.bib`
**Severity:** Minor
**Claim:** Sections 01-01 through 01-06 collectively cite approximately 25 distinct BibTeX keys. The references.bib file contains only 3 entries added by the section agents: `heiken_lunar_sourcebook`, `ono2018msl`, and `nvidia2023jetson`.
**Citation status:** Missing — incomplete BibTeX population
**Issue:** The following frequently-used citation keys appear in text across multiple sections but have no BibTeX entries in `corpus/references.bib`: `radford2015valkyrie`, `paine2015valkyrieActuator`, `nasa2023valkyrieFactsheet`, `bostondynamics2024atlas`, `bostondynamics2024electricera`, `diftler2011r2`, `nasa2016r2factsheet`, `ntrs2010r2overview`, `huntress2011soviet`, `therobotreport2019skybot`, `spectrum2018r2broken`, `space2018r2return`, `unitree2023h1`, `unitree2024g1`, `apptronik2023apollo`, `tesla2023optimus2`, `figureai2024figure02`, `agility2024digit`, `bmw2024figuredeployment`, `schwadron2014radiation`, `mars2020thermal`, `exomars2020cameras`, `appelbaum1991solarmars`, `mir_wikipedia`, `zaconte2020lnd` (HC-002). The CLAUDE.md instructions state "all agents append" to `references.bib`; the section agents did not do this.
**Required action:** Each agent that produced sections 01-01 through 01-06 must append BibTeX entries for all citations used. This is a systematic omission across all six files, not a single-section issue. A BibTeX population pass is required before any downstream agent attempts to compile or typeset the document.

---

### HC-010 — MINOR — §01-05 — `mir_wikipedia` cited as source for Mir sustainment philosophy

**Section:** `study/01-optimal-space-humanoid/03-actuation-structures.md` (Section 1, Hydraulic discussion)
**Severity:** Minor
**Claim:** "The Mir sustainment philosophy — 'no instrument inside the station that cannot be replaced in flight' \cite{mir_wikipedia} — argues directly against fluid-line architectures at a far side base."
**Citation status:** Cited — Wikipedia as primary source for a key program commitment
**Issue:** The CLAUDE.md working principle states "Heritage before invention" and the study emphasizes primary sources. The Yuri Semyonov quote "no instrument inside the station that cannot be replaced in flight" is correctly documented in `soviet-russian-heritage.md` Section 5, citing the NASA Mir Mission Chronicle (NASA TP-98-207890, 1998) as the primary/institutional source. The sections cite `mir_wikipedia` (a Wikipedia article) as the source for this quote, bypassing the verified primary source already identified in the heritage research notes. Wikipedia is used here as a first-order citation for a program-critical design principle.
**Required action:** Replace `\cite{mir_wikipedia}` with a citation to the NASA Mir Mission Chronicle (NASA TP-98-207890) or a Yuri Semyonov primary statement, consistent with `soviet-russian-heritage.md`'s sourcing. Add the NASA TP-98-207890 document to `corpus/references.bib`.

---

### HC-011 — MINOR — §01-02 — R2 leg installation time attributed to `space2018r2return` without verifying the specific claim

**Section:** `study/01-optimal-space-humanoid/02-form-factor-tradespace.md` (Candidate E, Modular)
**Severity:** Minor
**Claim:** "R2's leg installation on ISS took 40 hours (vs. 20 planned) under shirtsleeve conditions with full ground support \cite{space2018r2return}."
**Citation status:** Claim is accurate; citation source is a 2018 article about R2's return, not about the 2014 leg installation
**Issue:** The 40 vs. 20 hour claim is verified correct (the leg installation took place in July-August 2014, not 2018). The citation key `space2018r2return` refers to a 2018 Space.com article about R2 returning to Earth for repairs — not a 2014 article about the leg installation. A 2018 return article would mention the leg installation history in passing, but the primary source for the 40-hour installation figure should be a contemporaneous 2014 source. The description "under shirtsleeve conditions" is also potentially inaccurate — the leg installation was performed on-orbit inside the ISS (shirtsleeve environment, correct) but the phrasing could be mistaken as meaning on the ground. This is accurate.
**Required action:** Supplement or replace `\cite{space2018r2return}` with a contemporaneous 2014 source documenting the leg installation timeline (e.g., the NASA NTRS paper "Robonaut 2 on the International Space Station," NTRS 20140000957, which covers on-orbit operations). The 2018 return article is a secondary reference for a 2014 event.

---

### HC-012 — NIT — §01-04 — `ono2018msl` BibTeX key year is 2015 not 2018; inconsistency with key name

**Section:** `corpus/references.bib` and `study/01-optimal-space-humanoid/04-sensing-autonomy.md`
**Severity:** Nit
**Claim:** BibTeX entry `ono2018msl` has `year = {2015}` in the entry body.
**Citation status:** Formatting inconsistency
**Issue:** The BibTeX key name `ono2018msl` implies year 2018, but the actual year in the entry is 2015, consistent with it being a 2015 IEEE Aerospace Conference paper. The key name is misleading but not incorrect — keys are arbitrary identifiers. It could cause confusion in future automated checks that extract year from key name.
**Required action:** Consider renaming the key to `ono2015msl` for consistency with the actual publication year, and updating all in-text references accordingly. Low priority but should be addressed before final compilation.

---

### HC-013 — NIT — §01-01 — Robonaut 2 upper torso mass "~68 kg" labeled as estimated but no heritage source given

**Section:** `study/01-optimal-space-humanoid/01-overview.md` (heritage table, R2 row)
**Severity:** Nit
**Claim:** R2 mass given as "~150 (full config with legs); upper torso ~68 (estimated from published torso-only config, **unverified**)."
**Citation status:** Uncited; marked unverified
**Issue:** The table correctly marks the ~68 kg torso figure as unverified. However, it also provides no path to verification — no note about where this figure might come from. The `diftler2011r2` citation (Diftler et al., ICRA 2011) is cited elsewhere for R2 design; the design paper might contain the mass breakdown. If it does, the heritage table should cite it rather than labeling the figure unverified. If it does not appear in the design paper, that should be noted explicitly.
**Required action:** Check `diftler2011r2` and `nasa2016r2factsheet` for R2 subsystem mass breakdown. If the ~68 kg figure appears there, add the citation and remove the "unverified" flag. If not, note that the torso-only mass is not published in primary sources and flag for PDR.

---

### HC-014 — NIT — §01-05 — `appelbaum1991solarmars` misattributed: study is Solar Energy 1990, not 1991; used for a claim it does not support

**Section:** `study/01-optimal-space-humanoid/05-environments-hardening.md` (Section 4.2, Thermal Radiator Surfaces)
**Severity:** Nit
**Claim:** "Mars lander and rover data (MER Spirit, Phoenix) document emissivity degradation rates of 2–5% per month on horizontal solar panels from dust settling \cite{appelbaum1991solarmars} [VERIFY — this figure is for Mars dust under Mars conditions; lunar particle size and settling rate differ]."
**Citation status:** Wrong reference — Appelbaum & Flood (1990/1991) is a solar radiation modeling study, not a dust degradation study; MER Spirit and Phoenix post-date it by over a decade
**Issue:** The Appelbaum & Flood paper ("Solar radiation on Mars," Solar Energy, 1990) is a solar irradiance model for Mars surface operations — not a measurement of dust-induced emissivity or efficiency degradation. MER Spirit and Phoenix operated in 2004–2010, more than a decade after this paper. The specific claim about Spirit's solar panel degradation from dust would need to be sourced to MER mission reports or published Spirit power analysis papers, not to a 1990 irradiance model. The text itself flags [VERIFY] but the cited source is wrong for what is being claimed.
**Required action:** Find and cite actual MER Spirit/Phoenix dust degradation data (likely from NASA/JPL mission publications or Colozza 2005-class power analysis papers for Mars surface) and replace the Appelbaum citation for the degradation rate claim. The Appelbaum paper could remain cited as background on Mars solar environment but not as the source for the degradation rate.

---

## Cross-Cutting Observations

**1. BibTeX corpus is severely underpopulated.** The `references.bib` has only 3 entries added by section agents, against approximately 25+ citation keys used. This is a systemic failure to comply with the "all agents append" instruction in CLAUDE.md. No section can be properly reviewed for citation existence when the BibTeX entries do not exist for verification.

**2. Atlas Electric is misunderstood throughout.** The heritage table, actuation section, and power budget all use Atlas Electric as heritage for harmonic drive actuation. Atlas Electric does not use harmonic drives — it uses custom direct-drive actuators. This error propagates from §01-01 through §01-03 and §01-06 and affects the credibility of the actuation architecture position's primary heritage claim.

**3. The LND citation is both missing from the corpus and has the wrong lead author.** Given that the Chang'e-4 LND radiation figure is the primary empirical anchor for the radiation environment requirements, this is consequential beyond a formatting issue.

**4. The study applies heritage citations responsibly in most other respects.** The Valkyrie mass/DOF figures are correct. The Lunokhod distance figures are approximately right with appropriate caveats. The R2 leg installation time is correct. The ISS battery energy density is close (155 vs. 160 Wh/kg) and appropriately self-flagged. The overall picture is a technically competent draft with two structural errors (Atlas actuator type, LND citation) that need correction before the document is defensible.
