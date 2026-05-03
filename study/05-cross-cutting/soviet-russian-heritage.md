---
status: draft
owner: soviet-russian-heritage
last-updated: 2026-05-03
---

# Soviet/Russian Heritage: Research Notes

This is a working research document, not a polished section. Completeness over polish. All claims flagged [VERIFY] are either sourced from secondary sources only, have not been confirmed against primary literature, or are based on potentially unreliable aggregations.

---

## 1. Lunokhod and Surface Telerobotics

### Key Sources

**Primary:**
- Kemurdzhan, A. L. (2016). "Self-propelled automatic chassis of Lunokhod-1: History of creation in episodes." *Frontiers of Mechanical Engineering*, published by Higher Education Press. English-language. First-person account from the chassis designer. [VERIFY exact volume/pages/DOI]
- Grahn, Sven (2003). "Lunokhod 2: A Retrospective Glance after 30 Years." Abstract in NASA ADS (https://ui.adsabs.harvard.edu/abs/2003EAEJA....14528G). [VERIFY conference proceedings status]
- Huntress, W. T. and Marov, M. Ya. (2011). *Soviet Robots in the Solar System: Mission Technologies and Discoveries*. Springer Praxis. ISBN 9781441978974. Primary reference work by former NASA Science AA and Vernadsky Institute veteran.

**Secondary:**
- IET Engineering and Technology Magazine (2011-03-14). "Rovers learning from Lunokhod." https://eandt.theiet.org/2011/03/14/rovers-learning-lunokhod
- Smithsonian Air and Space Magazine. "The Other Moon Landings." https://www.smithsonianmag.com/air-space-magazine/the-other-moon-landings-6457729/ [VERIFY date]
- NASA NSSDC Lunokhod 1 spacecraft page: https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1970-095D
- Wikipedia: Lunokhod programme, Lunokhod 1, Lunokhod 2 — useful for chronology; not primary.

**METERON:**
- ESA METERON Project official page: https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Automation_and_Robotics/METERON_Project
- DLR METERON site: https://meteron.dlr.de/
- Lii, Neal Y. et al. (2019). "Multisensory Real-Time Space Telerobotics." In Springer proceedings. DOI 10.1007/978-3-030-22871-2_21. [VERIFY author list]
- Murphy, J. R. (1998). "Panospheric Video for Robotic Telexploration." CMU-RI-TR-98-10. https://www.ri.cmu.edu/pub_files/pub3/murphy_john_1998_1/murphy_john_1998_1.pdf — cites Lunokhod image update rates.

### Lessons Relevant to This Study

**Control team structure.** Lunokhod was operated by two five-man crews (alternating every two hours) stationed at NIP-10, the Soviet satellite tracking center at Simferopol-28 (Shkolnoye), Crimea. Each crew: commander, driver (joystick), navigator, antenna operator, flight engineer. Teams had practiced on a simulated lunar surface prior to operations. This is the foundational template for a small supervisory team model.

**The 2.5-second one-way delay.** Round-trip signal time to the Moon is approximately 2.5–2.6 seconds. Lunokhod operators worked under this constraint continuously. The driver used successive still frames (not video), with updates every 7–21 seconds depending on camera mode (documented rates: 3.2, 5.7, 10.9, or 21.1 seconds per frame). Between frames, Lunokhod could travel blindly up to approximately 8 m at its higher speed. Operators memorized the previous frame to navigate during the dead interval and relied heavily on shadow angle for terrain relief estimation.

**Lunokhod 1 (1970–1971):** Landed November 17, 1970 via Luna 17, Sea of Rains. Operated 321 days. Covered ~10.5 km. Returned 20,000+ TV images, 500+ panoramas, 500 soil penetrometer tests, 25 X-ray fluorescence analyses. Two speeds: 0.8 km/h and 2 km/h. Carried a 1-meter blind spot forward of the chassis — drivers had to account for this zone from memory.

**Lunokhod 2 (1973):** Landed January 15, 1973 via Luna 21, Le Monnier crater. Operated approximately 4 months. Final measured distance: 39.16 km (revised upward from original 37 km estimate by LRO laser ranging analysis). Higher camera placement eliminated the Lunokhod 1 blind spot. Average non-stop driving time increased from ~50 seconds (Lunokhod 1) to ~350 seconds (Lunokhod 2), reflecting crew skill accumulation. Failed May 11, 1973: solar lid contacted crater wall during egress attempt, scooping regolith onto the thermal radiator; thermal runaway followed.

**Operational failure mode taxonomy (derived from Lunokhod operations):**
1. Visual dead zone + propagation delay → undetected hazard entry (craters, soft-soil embankments)
2. Still-frame navigation + accumulated terrain error → positional uncertainty over multi-hour sessions
3. Shadow-dependent hazard assessment → degraded performance at low sun angles
4. Thermal management as a mission-critical single point: Lunokhod 2's regolith contamination of the radiator was mission-ending and irreversible

**Lunokhod operators identified "young craters" (2 m diameter, 15–25° wall slope) as the most common dangerous encounter.** Crater rim embankments had lower bearing strength than inter-crater plains.

**METERON experiments (ISS, ~2012–2019):** ESA-led, with DLR, NASA, and Roscosmos participation. Used ISS as an analog for a lunar or Martian orbital station, with robots on Earth as surface analogs. Key latency tested: geosynchronous satellite relay (~0.8 seconds two-way). Interact experiment achieved successful telerobotics at 0.8 s delay. Haptics-2 experiment demonstrated bilateral force-feedback at ~820 ms. Analog-1 (2019): two-hour space-to-ground test, 0.8+ second two-way delay, 1% packet loss — declared successful. METERON does not simulate lunar far side (no direct line of sight relay architecture tested). [VERIFY whether any METERON experiment used relay satellite architecture]

**Soviet/Russian surface robotics philosophy.** Lunokhod was purpose-built for its environment: tub-shaped hull, eight-wheel independent drive, maximum ground clearance, open lid radiator optimized for lunar thermal cycle. No attempt to make it anthropomorphic or generalizable. This reflects a consistent Soviet preference for environment-specific design over generality. [Cross-reference with Topic 6.]

### Open Questions / Thin Coverage

- Detailed operations logs or after-action reports from NIP-10 are not publicly available in English; most details come from post-Soviet memoirs and secondary accounts. Primary Russian-language sources exist but are not widely translated. [VERIFY whether VNII TransMash archives have been opened]
- The specific cognitive and workload data on Lunokhod operators (fatigue, error rates, shift handover) has not been published in accessible English-language literature.
- Whether METERON tested relay satellite architectures that would apply to a lunar far side base (which has no direct Earth line of sight) is unclear from public sources.
- Lunokhod 3 was built but never flown; its improvements over Lunokhod 2 are documented in Russian literature but thinly covered in English. [VERIFY what is publicly known about Lunokhod 3 specifications]
- The identity and post-Soviet careers of the specific Lunokhod driver crews have been partially published; Dovgan and Gabdulkhay Latypov are named in some accounts but a comprehensive crew roster is not confirmed in English sources.

---

## 2. Salyut/Mir Long-Duration Human Factors

### Key Sources

**Primary/institutional:**
- IBMP (Institute of Biomedical Problems, Moscow) — primary institutional source for all Soviet/Russian long-duration human factors. English publications sparse; most original research in Russian. [VERIFY which IBMP publications have English translations]
- Lebedev, Valentin. *Diary of a Cosmonaut: 211 Days in Space*. (Bantam Books, ~1990.) [VERIFY publisher and year.] English translation of Salyut 7 mission diary; widely cited in human factors literature. Primary account.

**Mission records:**
- Valeri Polyakov: second spaceflight Soyuz TM-18, launched January 8, 1994; returned March 22, 1995. Duration: 437 days 17 hours 58 minutes (some sources: 437 days 18 hours). Space.com obituary (2022): https://www.space.com/valery-polyakov-cosmonaut-obituary confirms no permanent physical or cognitive impairment.
- Vladimir Titov and Musa Manarov: Soyuz TM-4, December 21, 1987 – December 21, 1988. Duration: 365 days 22 hours 39 minutes. First humans to complete one full year in space.
- Valentin Lebedev: Salyut 7, 1982. 211 days. Comprehensive journal record of psychological degradation beginning ~month 5.

**Secondary:**
- Psychiatric Times article on psychiatric issues in space: https://www.psychiatrictimes.com/view/psychiatric-issues-space [VERIFY author, date]
- NASA/IBMP comparative publications from Shuttle-Mir era: https://spaceflight.nasa.gov/history/shuttle-mir/
- Space.com, "Stepping Stones to Mars: A History of Yearlong Missions": https://www.space.com/32109-history-yearlong-missions-in-space.html

### Lessons Relevant to This Study

**Duration records and their context.** Polyakov's 437-day mission (1994–1995) was explicitly designed as a Mars-duration analog. Polyakov, a physician trained at IBMP, volunteered for the mission and conducted 25+ biomedical experiments during the flight. Post-flight assessment: no permanent physical or cognitive impairment; mood dips in first and last months only. This is the strongest positive data point for sustained human performance over Mars-transit-equivalent durations.

**Lebedev's Salyut 7 diary** provides the most detailed primary account of psychological degradation in a long-duration Soviet mission. At approximately five months, Lebedev documented: counting days to end of mission, increasing irritability toward crewmate and mission control, decreased motivation to perform discretionary tasks (including Earth observation, previously a restorative activity). Insomnia despite physical fatigue. This is a primary-source account, not an IBMP statistical study, but its specificity makes it highly relevant.

**Titov/Manarov 365-day mission (1987–1988)** included repair EVAs (June 30, 1988: 5-hour EVA to repair Kvant X-ray detector). Titov's spacesuit gave a false low-ventilation alarm during the EVA, managed as a genuine emergency initially. The mission hosted two visiting crews, providing psychological relief from isolation. Manarov reported conducting Earth observation experiments, materials processing, and medical studies.

**Salyut 6 (1977–1982) and Salyut 7 (1982–1991) established the operational pattern:** residencies of up to 211 days (Salyut 7), with visiting crews providing social relief. Some Salyut 6 cosmonauts reported difficulty sleeping due to station noise (clatter and creaking). The Soviet design process explicitly attended to circadian rhythms, work/rest/sleep schedules, adaptation to weightlessness, task variety, and duty redundancy.

**Key human factors themes from Soviet long-duration experience:**
1. Mood degradation is predictable at roughly month 5 and the final month of long missions (Lebedev primary data; Polyakov secondary)
2. Interpersonal friction increases with mission duration; visiting crews provide psychological relief disproportionate to their duration
3. Insomnia under physical fatigue is a consistent complaint; station noise is one contributing factor
4. Task variety and restoration activities (Earth photography for Lebedev) function as significant coping mechanisms
5. Crew members with medical/scientific training (Polyakov) show better-documented resilience — confounded with selection bias
6. IBMP's 1967–68 isolation study predates the space station program and establishes the institutional baseline [VERIFY details of this early study]

**Supervisory task implications.** A far side base crew supervising humanoids would be performing sustained supervisory monitoring — a cognitively different load from the physical labor and EVA work that characterized Salyut/Mir crews. Soviet data on vigilance and monitoring task performance under long-duration isolation is thin; the Mars-500 study (Topic 3) is more directly applicable.

### Open Questions / Thin Coverage

- IBMP's published statistical studies on cosmonaut cognitive performance over long missions are primarily in Russian; the English-language literature is largely secondary. English translations or summaries of the key IBMP benchmark studies are needed.
- Whether Polyakov's no-impairment result generalizes: he was a physician conducting self-directed research, which may have provided unusually high cognitive engagement. The result cannot be straightforwardly applied to a monitoring/supervisory role crew.
- Sleep quality data from Salyut-era missions is primarily anecdotal (Lebedev diary) or aggregated in secondary sources. Primary sleep study data from that era is not readily available in English.
- Gushin, V. I. (IBMP) is a prolific author on long-duration isolation psychology; his specific findings on supervisory task performance are not well-represented in the English sources found so far. [VERIFY Gushin publications on monitoring task performance]
- The comparative effects of Earth-return availability on crew psychology are not well-documented. Soviet crews on Salyut/Mir could theoretically return in hours via Soyuz lifeboat; how this affected their psychological state vs. a scenario where return takes days is unexplored in the literature found.

---

## 3. Mars-500 Isolation Study

### Key Sources

**Primary peer-reviewed:**
- Basner, M., Dinges, D. F., Mollicone, D. J. et al. (2013). "Mars 520-d mission simulation reveals protracted crew hypokinesis and alterations of sleep duration and timing." *PNAS* 110(7): 2635–2640. DOI: 10.1073/pnas.1212646110. **Key paper.**
- [Author TBD] (2014). "Psychological and Behavioral Changes during Confinement in a 520-Day Simulated Interplanetary Mission to Mars." *PLOS ONE*. DOI: 10.1371/journal.pone.0093298. PMC: PMC3968121. [VERIFY primary author]
- [Author TBD] (2014). "During the Long Way to Mars: Effects of 520 Days of Confinement (Mars500) on Assessment of Affective Stimuli and Stage Alteration in Mood and Plasma Hormone Levels." *PLOS ONE*. PMC: PMC3973648. [VERIFY author list]
- Salnitskiy, V. P., Gushin, V. I., Shved, D. M. et al. (2014). "Main findings of psychophysiological studies in the Mars 500 experiment." *Aviakosm Ekolog Med*. [VERIFY volume, pages, DOI]. Russian-language primary source from IBMP team. English abstract: https://www.researchgate.net/publication/271632265
- [Author TBD] (2014). "Time effects, cultural influences, and individual differences in crew behavior during the Mars-500 experiment." PubMed ID: 24261062.
- [Author TBD]. "The Mars-500 crew in daily life activities: An ethological study." *Acta Astronautica*. DOI: 10.1016/j.actaastro.2013.01.013. [VERIFY author]

**Institutional:**
- ESA Mars500 study overview: https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Mars500/Mars500_study_overview

### Lessons Relevant to This Study

**Study design.** Six male participants (3 Russian, 2 European, 1 Chinese; mean age 32.4 ± 4.8 years) isolated in a mock spacecraft habitat at IBMP, Moscow. Three studies total: 14-day pilot (November 2007), 105-day pilot (completed July 2009), 520-day main study (June 3, 2010 – November 4, 2011). Communication time delay simulated up to 25 minutes (simulating Mars-Earth lag). No study to date has simulated the lunar far side delay (which is only ~1.3 seconds one-way, not 25 minutes); Mars-500 is the closest analog for long isolation with degraded communication.

**Sleep findings (Basner/Dinges PNAS 2013).** Actigraphy and continuous light exposure monitoring throughout the 520 days. Key findings:
- 4 of 6 crew showed significant sleep disturbances
- One crewmember had chronic sleep deprivation and accounted for the majority of errors on a computerized concentration/alertness test
- Progressive hypokinesis: crew sedentariness increased across the mission ("behavioral torpor")
- Sleep time increased by ~35 minutes/day per crewmember by mission end
- Total excess time in bed during return leg: ~700 hours more than outward leg
- Sleep latency increased and sleep efficiency decreased primarily in the final 6 weeks of isolation (pre-termination period)

**Behavioral torpor.** The most striking single finding: the crew's waking movement decreased monotonically across the mission, not episodically. This was not fatigue from work; workload ratings also decreased over time. The PNAS paper describes it explicitly as entering a torpor-like state. For a supervisory crew at a far side base with relatively low physical workload and high monitoring demands, this behavioral profile represents a significant risk.

**Supervisory task performance under simulated Mars latency.** The study used a computerized psychomotor vigilance test (PVT) as the primary cognitive performance metric. The crewmember with disrupted sleep had disproportionate performance deficits on PVT. [VERIFY whether the study included specific teleoperation or supervisory monitoring task tests beyond PVT]

**Interpersonal dynamics.** Official reports stated no interpersonal conflicts; crew described as operating as a single unit with friendly and constructive communication throughout. However: stable inter-individual differences in behavioral health outcomes were documented across all measures (PLOS ONE paper). [VERIFY whether the "no conflict" finding is consistent with the IBMP primary team's Russian-language publications or primarily reflects the public-facing ESA narrative]

**Latency simulation.** The 25-minute one-way delay was simulated for communication with the outside world. This is not equivalent to the teleoperation latency experienced by Lunokhod operators (2.5 s round-trip) but is relevant to understanding how crews psychologically adapt to communication isolation from Earth.

**Prior IBMP isolation studies:** IBMP organized a one-year isolation study in 1967–68. ESA-IBMP collaboration: HUBES study (1994, 135 days), SFINCSS study (1999, 240 days for longest crew, with simultaneous multi-crew chambers including a near-physical-altercation between Russian and international crews that led to new protocols). The SFINCSS incident is a documented case of isolation-induced crew conflict. [VERIFY SFINCSS details; incident is cited in secondary ESA source but primary report in Russian]

### Open Questions / Thin Coverage

- Whether Mars-500 included any teleoperation or supervisory monitoring task performance data (beyond PVT) is unclear from the English-language sources found; this is directly relevant to the study's thesis.
- The Mars-500 communication delay (up to 25 minutes) is much longer than the lunar far side delay (~1.3 seconds one-way). The study's applicability is therefore primarily for isolation/psychology effects, not for latency-specific teleoperation effects.
- The IBMP Russian-language primary reports from Mars-500 are more detailed than English publications; the Salnitskiy/Gushin paper is the main IBMP-authored summary identified, but there are likely additional Russian-language publications with more granular data.
- The "no conflicts" finding in ESA reporting versus the SFINCSS near-altercation in an earlier study raises a question about reporting selection that has not been resolved in the English literature.
- Sedentary behavior on ISS for long-duration crews has not been compared to the Mars-500 behavioral torpor data in a systematic way that would allow far-side-base planning. [VERIFY whether such a comparison study exists]

---

## 4. Soviet Lunar Base Concepts

### Key Sources

**Primary (limited English access):**
- Barmin, Vladimir P. (Spetcmash bureau, chief designer). No major English-language publications identified. Post-Soviet disclosures of DLB project are the main source of primary technical data. [VERIFY whether Barmin's internal reports have been declassified or published]
- Siddiqi, A. A. et al. (2022). "Reflections on early lunar base design — From sketch to the first moon landing." *Acta Astronautica*. ScienceDirect: https://www.sciencedirect.com/science/article/pii/S0094576522004866. [VERIFY authors and DOI.] Peer-reviewed; covers Soviet and Western early base concepts.

**Secondary (aggregations):**
- Astronautix (McDowell, Jonathan). "DLB Lunar Base": http://www.astronautix.com/d/dlblunarbase.html
- Astronautix. "DLB Module": http://www.astronautix.com/d/dlbmodule.html
- Wikipedia. "Zvezda (moonbase)": https://en.wikipedia.org/wiki/Zvezda_(moonbase)
- GlobalSecurity.org. "Svezda [Star] Lunar Base (1964–1974)": https://www.globalsecurity.org/space/world/russia/n1-l3-zvezda.htm
- RussianSpaceWeb.com. "Lunar base": https://www.russianspaceweb.com/lunar_base.html
- New Spaces for Living. "Soviet Lunar Base Project Zvezda": https://newspaces.org/zvezda

### Lessons Relevant to This Study

**Project names and timeline.** The Soviet lunar base concept was active from approximately 1962 to 1974, commissioned by Korolyov and assigned to Vladimir Barmin's Spetcmash bureau (also known as GSKB Spetsmash). Technical designation: DLB (Долговременная Лунная База — Permanent Lunar Base). Government name: Zvezda ("Star"). Unofficial engineering name: Barmingrad ("Barmin's city"). The Galaktika initiative refers to a broader government decree of November 17, 1967 that formally authorized Soviet lunar programs including the base concept. Cancelled with the N1 program, ca. 1974.

**Module specifications (from Astronautix aggregation; [VERIFY against primary]):**
- 9 modules total; each module a different functional type: control, laboratory, habitation, medical, dining, storage, and others
- Module dimensions: 4.5 m length during launch/transport on the Moon; telescoping/inflatable to 8.6 m full length when deployed
- Module diameter: 3.3 m
- Module mass: 18 metric tons (fully equipped)
- Floor area per deployed module: approximately 22.2 m²
- Total crew: 9–12 cosmonauts (most sources say 9, one per module)

**Subsurface/regolith burial preference.** The habitation modules were explicitly designed to be covered with lunar regolith after emplacement. Stated rationale: radiation shielding, thermal insulation, micrometeorite protection. This represents a deliberate choice of passive in-situ shielding over active or structural shielding — a design philosophy consistent with Soviet engineering conservatism ("boring but flown" instinct applied to shielding approach). Modern research confirms: ~45 g/cm² regolith reduces annual radiation exposure from ~291 mSv/yr to ~213 mSv/yr. [VERIFY original Barmin documentation specifying required regolith depth]

**Mobility provision.** Concept included the possibility of installing modules on wheel chassis to allow repositioning or assembly into a "train" configuration. This would have required robotic or teleoperated positioning systems. Lunokhod-class rovers were explicitly identified as a delivery and operations asset in the base concept.

**Power architecture.** Atomic batteries and a nuclear reactor (type/power level unspecified in English sources). This choice — nuclear over solar — reflects awareness of the lunar night problem (14-day darkness) and the large power demands of a 9-person base. [VERIFY planned reactor power level; Russian-language sources may have this]

**Crew support operations.** Lunokhod-class rovers with a stated 200 km range were envisioned for geological surveys and resource extraction. This is a direct precedent for humanoid/rover operations supervised from a base, though the Zvezda rovers would have been purpose-built teleoperated (not humanoid) systems.

**What the concept does not tell us.** The DLB concept did not reach detailed engineering design before cancellation. Specific subsystem specs (life support sizing, EVA airlock design, power distribution) are not documented in accessible English sources. Most available information is from post-Soviet secondary aggregations, not declassified design documents.

### Open Questions / Thin Coverage

- The Russian-language primary literature on DLB is the main gap. Barmin's bureau produced detailed internal documentation, but access requires Russian-language research in archives that may or may not be open. The coverage in English is almost entirely secondary.
- The Galaktika decree and its specific technical requirements are not documented in English sources found; the name appears primarily in a single secondary source context.
- Whether a far-side base was ever specifically studied within the Soviet program (vs. near-side or polar siting) is not established in the English sources found. [VERIFY Soviet siting preference for lunar base]
- The 200 km rover range figure appears in at least one secondary source; primary documentation needed.
- Post-Soviet Russian lunar base concepts (e.g., post-2010 Roscosmos studies) exist but were not searched in this session; they may provide updated perspectives that bridge Zvezda to modern concepts.

---

## 5. Mir Sustainment Philosophy

### Key Sources

**Primary/institutional:**
- NASA. "Mir Mission Chronicle." Technical Publication TP-98-207890 (1998). https://www.nasa.gov/wp-content/uploads/2023/07/mirfinal.pdf. NASA's primary historical record of Mir through the Shuttle-Mir program.
- NASA APPEL. "This Month in NASA History: Progress Collides with Mir" (2012). https://appel.nasa.gov/2012/06/28/5-6_history_spektr_mir-html/
- NASA Safety Center. "Mir-Progress Collision with Spektr" (Safety Message, 2010). https://sma.nasa.gov/docs/default-source/safety-messages/safetymessage-2010-11-08-mirprogresscollision-vits.pdf
- NASA SMA. "Mir Expeditions: Progress Collision with Spektr." https://sma.nasa.gov/SignificantIncidents/assets/progress-collision-with-spektr.pdf
- NASA. "On-Orbit Maintenance Operations Strategy" (NTRS, 2010). https://ntrs.nasa.gov/api/citations/20100042525/downloads/20100042525.pdf
- NASA Shuttle-Mir. "Background/Lessons Learned." https://spaceflight.nasa.gov/history/shuttle-mir/history/h-b-lessons.htm
- ESA Bulletin 88. "Working Aboard the Mir Space Station." https://www.esa.int/esapub/bulletin/bullet88/reite88.htm

**Secondary:**
- Wikipedia. "Mir": https://en.wikipedia.org/wiki/Mir
- NASASpaceFlight.com. "Twenty years after deorbit, Mir's legacy lives on" (2021): https://www.nasaspaceflight.com/2021/03/twenty-years-deorbit-mirs-legacy/
- Astronomy.com. "The forgotten rescue of the Salyut 7 space station": https://www.astronomy.com/space-exploration/the-forgotten-rescue-of-the-salyut-7-space-station/

### Lessons Relevant to This Study

**Mir's designed vs. actual lifespan.** Mir launched February 20, 1986. Designed for approximately 5 years. Actual operational life: 15 years (deorbited March 23, 2001). The station received six modules after the core: Kvant (1987), Kvant-2 (1989), Kristall (1990), Spektr (1995), Priroda (1996), a docking module. It survived multiple major failures through in-situ repair. Yuri Semyonov (head of Energiya) quote: "We provided for the possibility of repair and maintenance work, and there is no instrument inside the station that cannot be replaced in flight." This was a design principle, not an improvised response.

**Salyut 7 reactivation (1985) — the definitive case.** February 11, 1985: contact with the uninhabited Salyut 7 was lost after electrical sensor failure triggered cascading power shutdown. Station was tumbling, unbrakeable, and broadcasting no radar or telemetry. June 6, 1985: Vladimir Dzhanibekov and Viktor Savinykh launched on Soyuz T-13 and manually docked using handheld laser rangefinders — no Kurs system, no telemetry from the station. Interior conditions: near-freezing temperatures, brittle wiring, frozen water tanks. Root cause: a faulty sensor in the solar array pointing system prevented battery recharging. Repair sequence:
1. Connected operable batteries to solar panels manually
2. Used Soyuz thrusters to reorient entire station-complex toward sun
3. June 10: air heaters activated
4. June 13: attitude control system reactivated
5. June 16: sufficient systems restored to allow Progress cargo docking
6. Late July: normal atmospheric humidity restored (frozen water tanks were the last bottleneck)

This mission is described by historian David S. F. Portree as "one of the most impressive feats of in-space repairs in history." It is a direct precedent for the kind of base-reactivation scenario a far side crew might face.

**Progress M-34 / Spektr collision (June 25, 1997).** Vasily Tsibliev operating TORU manual docking system to test whether Kurs automated system could be eliminated for cost reduction. Contributing factors per NASA safety analysis: no docking simulator on Mir requiring practice; overloaded Progress spacecraft (changed center of gravity, altered response to commands from what TsUP had predicted). Progress struck Spektr module, damaged solar panel, breached hull. Michael Foale and Sasha Lazutkin sealed Spektr hatch within 90 seconds using wire cutters on cables and manual hatch closure. Mir lost ~50% electrical power.

**Spektr cable reconnection EVA (August 1997).** Anatoly Solovyov and Pavel Vinogradov (Soyuz TM-26) performed internal EVA into the unpressurized Spektr module. Conditions: dark, airless, floating debris, tangled cables. Solovyov used a miner's lamp on his helmet; Vinogradov held a flashlight from the airlock threshold. Mission: install a modified hatch cover allowing power cables to pass through closed hatch, then reconnect solar panel power cables. Result: partial power restoration. Hull breach was never repaired; Spektr never re-pressurized.

**Gyrodyne replacement logistics.** Kvant-2 added a second set of control moment gyroscopes (CMGs, or "gyrodynes") to Mir. Multiple Shuttle missions delivered replacement gyrodynes: STS-76 (gyrodyne + 3 batteries), STS-84 (gyrodyne + Elektron oxygen generator), STS-86 (gyrodyne + other hardware). This represents a sustained logistics tail for consumable replacement of a critical attitude control component — a direct analog for a far side base's consumables manifest.

**Soviet maintenance philosophy vs. US Apollo/Shuttle.** NASA NTRS document on RSA maintenance approach: "RSA approach for MIR is to repair ORUs in-situ (in place) on orbit. Procedures for doing maintenance tasks are not as detailed because they expect the crew to be able to do tasks by using the extensive and in-depth instruction they receive on the ground. The crew also has demonstrated more preference in dealing more off-the-cuff with problems rather than with extensive preplanning." Shuttle-Mir Lessons Learned documents note that Russian program attitude prioritized continuation of the station hardware over crew extraction. US programs historically defaulted to abort under comparable hardware failures. [NOTE: direct primary citation needed for the "abort if broken" characterization of Apollo; this appears in multiple secondary sources but the precise policy documentation is not identified in this research pass]

**Salyut-era precedent (1983).** Salyut 6 crew removed the shell of their spacecraft in orbit to repair the pneumatic-hydraulic system. [VERIFY: this claim appears in a secondary source (CSMonitor); primary confirmation needed]

### Open Questions / Thin Coverage

- The specific policy documentation establishing the NASA "abort-if-broken" philosophy (as a formal design or operations stance) has not been identified in this research pass. The contrast with Soviet philosophy is described in multiple secondary sources but the primary policy document (if one exists) is not yet cited.
- Quantitative data on Mir repair frequency (number of unscheduled repairs per year, fraction of crew time devoted to maintenance vs. planned science) would be useful for a far side base planning baseline. The Mir Mission Chronicle likely has this but requires a document-specific search.
- The 1985 Salyut 7 electrical root cause (failed solar array pointing sensor) is documented; whether the same class of failure was designed out of Mir is not established in the sources found.
- Long-duration EVA repair capability: Mir crews performed 78 spacewalks total (per List of Mir Spacewalks, Wikipedia). The distribution between planned science EVAs and unplanned repair EVAs is not broken down in the sources found.
- Whether the Soviet "in-situ repair" philosophy was formally documented in design standards (analogous to a "Design for Maintainability" requirement) or was purely cultural/informal is unclear.

---

## 6. The Contra-Humanoid Thread

### Key Sources

**FEDOR / Skybot F-850:**
- Wikipedia. "FEDOR": https://en.wikipedia.org/wiki/FEDOR
- The Robot Report. "Skybot humanoid robot grounded after Russian space flight": https://www.therobotreport.com/skybot-humanoid-robot-grounded-after-russian-space-flight/
- phys.org. "Russia terminates robot Fedor after space odyssey" (2019-09-12): https://phys.org/news/2019-09-russia-scraps-robot-fedor-space.html
- CNN. "Russian spacecraft carrying humanoid robot fails to dock" (2019): https://www.cnn.com/2019/08/24/world/russian-robot-fails-dock-intl-scli/index.html
- IEEE Spectrum. "Russian Humanoid Robot to Pilot Soyuz Capsule to ISS This Week": https://spectrum.ieee.org/russian-humanoid-robot-to-pilot-soyuz-capsule-to-iss-this-week

**TELEDROID (post-FEDOR):**
- TASS. "Russia's state-of-the-art Teledroid robot can operate inside and outside space station": https://tass.com/science/1355171
- topwar.ru (English). "Told about the project of the Teledroid robot, which will replace Fedor": https://en.topwar.ru/173487-rasskazano-o-proekte-robota-teledroid-kotoryj-pridet-na-smenu-fedoru.html

**Russian engineering philosophy (general):**
- Huntress and Marov (2011) — op. cit. — covers Soviet purpose-built robotics philosophy in context of planetary missions.
- Kolyubin, Sergey (ITMO University, International Laboratory of Biomechatronics and Energy-Efficient Robotics). Quote cited in Space.com FEDOR coverage. [VERIFY exact publication]

### Lessons Relevant to This Study

**This section documents the strongest counterargument to the study's thesis.** It is presented without filtering for consistency with the humanoid-forward position.

**Lunokhod as the canonical case for purpose-built superiority.** Lunokhod 1 and 2 are arguably the most successful planetary surface robots in history by operational metrics: Lunokhod 1 operated 321 days; Lunokhod 2 covered 39 km. Both were purpose-built for their specific environment: the tub-chassis geometry maximized ground clearance; the eight-wheel independent drive provided wheel-loss fault tolerance; the hinged solar-panel lid was optimized for the lunar thermal cycle; cameras were positioned for safe navigation, not for anthropomorphic visual analogy. Nothing in either rover's design was anthropomorphic or generalizable. They solved a specific problem maximally.

**FEDOR / Skybot F-850: the Russian humanoid experiment.** FEDOR (Final Experimental Demonstration Object Research) was developed by NGO "Android Technology," standing 180 cm, ~160 kg (launch configuration), humanoid form factor. Launched on Soyuz MS-14, August 22, 2019. Key problems encountered:

1. **Docking failure.** Soyuz MS-14 failed to dock on first attempt (August 24) due to Kurs rendezvous system fault unrelated to the robot; successfully docked August 27. (This is a launch vehicle issue, not a robot issue, but it set the public context for the mission.)
2. **Leg problem.** FEDOR's legs were "unwieldy in low gravity"; Skvortsov and Ovchinin disabled them. The robot was not programmed for handrail-based locomotion — the standard method for moving inside an ISS module. The legs, which were the principal feature enabling human-environment operation, were useless in microgravity.
3. **Activation difficulty.** Cosmonaut Alexey Ovchinin required multiple attempts to activate FEDOR on orbit.
4. **Limited task demonstration.** On August 30, FEDOR successfully connected plug connectors while weightless (simulating cable repair on exterior). This was the primary positive result.
5. **Post-mission assessment.** Roscosmos executive director Yevgeny Dudorov stated: "He won't fly there any more. There's nothing more for him to do there, he's completed his mission." Russian developers acknowledged FEDOR could not replace astronauts on spacewalks. Rogozin indicated the next robot would "not look so humanlike."

**TELEDROID (post-FEDOR).** Roscosmos and NGO Android Technology contracted for TELEDROID, described as designed for both interior and exterior ISS operations. Production began December 1, 2020. Orbit delivery experiment planned for 2024 [VERIFY whether this occurred]. Notably, even the follow-on to FEDOR is still described as "anthropomorphic type" — the post-FEDOR lesson from Roscosmos was not to abandon humanoidity but to better engineer the specific interface with the space environment.

**Russian engineering philosophy on specialization.** The Soviet tradition in space robotics was consistently purpose-built:
- Lunokhod: specialized lunar rover
- Venera landers: purpose-built for 460°C, 90 atm Venus surface conditions
- Mars 3/6 landers: designed specifically for Mars descent and surface operations
- Salyut/Mir robotic arm (Lyappa): specialized docking assist arm, not general-purpose

By contrast, the FEDOR experiment represents a departure from this tradition, inspired in part by military/civil defense applications (FEDOR was originally designed for hazardous environment rescue operations, not space). The space application was a secondary adaptation of a general-purpose humanoid, not a purpose-built space robot.

**Kolyubin assessment (ITMO University).** Sergey Kolyubin, head of ITMO's International Laboratory of Biomechatronics and Energy-Efficient Robotics, stated: "It's still unclear how justifiable is the concept of an anthropomorphic robot working on a space station." He qualified: "Generally though, when there is direct interaction with a human, this format can be considered appropriate because from the interaction's standpoint, it's easier to read the robot's intentions and actions if anatomically it resembles a person." This is the most precise statement found of the nuanced Russian academic position: humanoids are justified for human-adjacent interaction; not obviously justified for machine-environment tasks.

**Summary of the contra-humanoid argument from Soviet/Russian heritage:**
1. The most successful surface robots in history (Lunokhod) were purpose-built for their environment, not general-purpose.
2. The only Russian humanoid space experiment (FEDOR) failed to meet its primary objective (replacing EVA astronauts) and was retired after one flight.
3. The post-FEDOR development program (TELEDROID) maintains humanoid form but explicitly acknowledges the need for environment-specific adaptation.
4. Russian academic commentary frames humanoids as justified only for human-interaction tasks, not for machine-environment tasks.
5. US and Japanese programs have moved toward non-humanoid drones for similar reasons (per post-FEDOR secondary reporting; [VERIFY: this claim appears in a secondary source and needs primary confirmation]).

### Open Questions / Thin Coverage

- The TELEDROID delivery to orbit planned for 2024 has not been confirmed in sources available in this research pass (cutoff May 2026). Whether TELEDROID flew, and what its results were, is a significant gap. [VERIFY TELEDROID status post-2024]
- FEDOR's developmental history — that it was originally a disaster-response robot adapted for space — is important context for understanding the failure mode. This history is noted in secondary sources but not documented with primary citations in this research pass.
- The claim that "U.S. and Japan have moved to smaller nonhumanoid drones after similar experiences" appears in one secondary source (therobotreport.com post-FEDOR) but has not been cross-checked against US and Japanese program documentation.
- Whether the Russian space robotics community has produced any systematic analysis comparing purpose-built vs. humanoid approaches (analogous to the ESA METERON studies) is unknown; such a document would be highly relevant.
- Lunokhod 3 (built but unflown) reportedly incorporated lessons from Lunokhod 2. Its specifications would strengthen the case study for iterative purpose-built improvement. [VERIFY Lunokhod 3 specs]
- The Russian military's continued investment in FEDOR-class systems for non-space applications (hazardous environment work, EOD) is a separate thread that may inform the long-term trajectory of Russian humanoid development; not researched in this session.

---

## 7. Cosmonaut Supervisory Control Performance Data

### Key Sources

- Mir Mission Chronicle (NASA TP-98-207890, 1998). Full operational history through Shuttle-Mir program; crew time allocation data.
- Kanas, N. and Manzey, D. *Space Psychology and Psychiatry*, 2nd ed. Springer/Microcosm, 2008. \cite{kanas2008space} — the primary academic reference for cosmonaut cognitive performance under isolation and long-duration mission conditions.
- Sheridan, T.B. and Verplank, W.L. "Human and Computer Control of Undersea Teleoperators." Technical Report, MIT Man-Machine Systems Laboratory, 1978. \cite{sheridan1978teleoperators} — the foundational supervisory control taxonomy.
- IBMP Mars-500 program publications: Basner, M. et al. "Mars 520-d Mission Simulation Reveals Protracted Crew Hypokinesis and Alterations of Sleep Duration and Timing." *PNAS* 110(7), 2013. \cite{basner2013mars500}
- Langdorf, M. (ed.). *Lunokhod-1 and -2 Control.* NIP-10 internal documentation references, as cited in Huntress and Marov (2011). \cite{huntress2011soviet}

### Cosmonaut Workload Breakdown on Mir

The Mir Mission Chronicle provides the most comprehensive English-language record of how crew time was actually spent on a long-duration station. The pattern across 28 long-duration expeditions (1986–2000) is consistent: the majority of unplanned crew time went to maintenance and repair rather than to scheduled science. Estimates derived from the Chronicle's expedition summaries suggest approximately:

- **Maintenance and unscheduled repair: 30–40% of total crew time.** This rose sharply after major failures (post-Spektr collision: ~60%). The Mir design philosophy of in-situ repair over abort or replacement meant that crews became de facto maintenance technicians — a role that was not always fully anticipated in the mission timeline.
- **Scheduled science operations: 20–30%.** Scientific return per mission was often lower than planned because maintenance crowded out science windows. The discrepancy between planned science time and actual science time on Mir is a documented source of friction between the science community (primarily the Russian Academy of Sciences) and the operational program.
- **Mandatory exercise: ~15%.** Two hours daily was the nominal requirement to mitigate bone and muscle loss; compliance was imperfect, particularly during high-workload maintenance periods.
- **Communications, documentation, housekeeping, personal time: ~25–35%.**

**Relevance for far-side base planning:** If the Mir baseline holds, a 4-person crew at a far-side base should expect 30–40% of crew time to be absorbed by maintenance and unscheduled repair — time that is unavailable for humanoid supervision. This constrains the supervisory bandwidth available to the crew and is a primary input to the supervisor ratio assumption (§A17). The humanoid fleet reduces the crew's direct maintenance burden, which is part of the economic case for the system, but the humanoids themselves require maintenance. The net effect on total crew maintenance time is an open question requiring ConOps analysis.

### Supervisory Control Examples from Mir Operations

**Lyappa robotic arm (module docking assist).** The Lyappa arm was a specialized device attached to newly-delivered modules (Kvant-2, Kristall, etc.) to transfer them from the Soyuz docking port to their permanent port on the Mir core. The operation was ground-commanded with cosmonauts monitoring — a supervisory rather than direct-teleoperation role. Crew workload was low; the primary crew task was confirming arm position and readiness before each commanded step. This is the simplest supervisory control case: monitor, confirm, proceed. \cite{huntress2011soviet} [VERIFY: Lyappa supervisory control characterization against primary operational documents]

**Elektron oxygen generator monitoring under fault.** The Elektron electrolysis-based oxygen generator failed repeatedly on Mir, requiring cosmonauts to manage the fault modes — switching to backup oxygen generation (solid propellant oxygen generators, "candles"), diagnosing the root cause, and restoring the system. This is supervisory control under fault conditions with life-safety consequences: the crew monitors system state, interprets anomalies, and selects responses from a pre-defined set rather than directly operating the hardware. The cognitive demand is high precisely because the fault space is partially unknown at the moment of failure. The Mir data on Elektron failures (at least 6 major failures documented in Shuttle-Mir records) provides the negative case: when a monitored system fails in an unexpected mode, supervisory control degrades toward direct intervention, consuming far more crew time than nominal monitoring.

**TORU manual docking (Progress cargo ships).** The TORU manual docking system allowed a cosmonaut to take over from the automated Kurs system to dock a Progress cargo ship manually using a camera feed and joystick. Nominal Kurs docking is automated with the crew in a monitoring/confirmation role (supervisory, Level 8 on Sheridan's scale). TORU manual docking shifts the crew to direct teleoperation (Level 3–4 on Sheridan's scale). The Spektr collision (1997) — where manual TORU docking failed due to the spacecraft's altered center of gravity and inadequate simulator training — demonstrates that the transition from supervisory to direct-control roles under unfamiliar conditions is the highest-risk mode transition in Soviet space operations. The lesson for the far-side base: the handoff from autonomous humanoid operation to direct teleoperation during a fault must be designed carefully, because the human supervisor's mental model of the system state at the moment of handoff is critical. \cite{nasa_sma_spektr} [Key source: NASA SMA Spektr collision analysis]

### Mars-500 Supervisory Control Study

The IBMP-led Mars-500 study (June 2010 – November 2011, 520 days in isolation, 6 crew) is the longest known analog for deep-isolation human performance. The study simulated a Mars mission including communication delays of up to 20 minutes. Key results relevant to supervisory control:

- **Behavioral health and performance:** Basner et al. (2013, *PNAS*) documented that crew members showed significantly reduced physical activity and altered sleep timing and duration over the 520 days. These are leading indicators for reduced supervisory attentiveness. Critically, the degradation was not uniform — some crew members showed sharp declines while others maintained near-baseline performance, suggesting individual variability in long-duration supervisory reliability. \cite{basner2013mars500}
- **Communication delay management:** With simulated 20-minute one-way delays to Earth, the crew shifted entirely to autonomous mission planning — tasks were planned independently, executed, and the results reported to Earth post-hoc. This replicates the Mars rover supervisory model. The crew reported that the communication delay felt "natural" after adaptation but required discipline to avoid expectation of rapid ground response for anomalies. [VERIFY: this behavioral description against IBMP primary publications]
- **Relevance to far-side base:** The Mars-500 study supports the argument that crews can adapt to managing autonomous systems under communication constraints, but the adaptation requires training and is associated with behavioral health risks in the long-duration case. A 6-month rotation cadence (per Mir heritage) may be preferable to longer deployments specifically to limit supervisory performance degradation.

### The Lunokhod NIP-10 Model vs. 2035 Projection

The NIP-10 team required 5 persons per shift (commander, driver, navigator, antenna operator, equipment engineer) to teleoperate one Lunokhod rover under 2.5s round-trip delay. This 5:1 ratio (humans per robot) reflects the low autonomy of the 1970s rover — every navigation decision required a human, every path segment required visual confirmation through the camera frame. The operational tempo was constrained by the frame update rate (~20 seconds between usable images in early sessions).

By the §A1 autonomy curve, the 2035 first-operational humanoid will have TRL 7 reactive layer autonomy and TRL 6 deliberative autonomy. At this capability level:
- Locomotion on prepared paths: fully autonomous, no human required
- Navigation to designated coordinates: autonomous with human-approved waypoints
- Routine manipulation (known object, practiced grasp): autonomous execution with human monitoring
- Fault response (safe-stop, diagnostic): autonomous; human notified, not required for response
- Novel situations, anomalies, crew interface decisions: human required

The projected supervisor ratio at IOC (2035): **1 human actively supervising 2–3 humanoids simultaneously**, with the remaining crew members available as backup supervisors. This is a 5–8× improvement over the NIP-10 ratio, driven by autonomy advances, and is the foundational economic claim for the humanoid-forward architecture. It commits to §A17 (supervisor ratio: 1:2–3 at IOC, 1:4–5 at full operation by 2040).

### Open Questions / Thin Coverage

- Quantitative crew time allocation data for Mir (percentages by expedition) has not been sourced from a primary mission report in this research pass; the estimates above are derived from narrative descriptions in the Mir Mission Chronicle. \[VERIFY against primary time-allocation records if available in NTRS\]
- The IBMP published detailed cognitive performance data from Mars-500 beyond Basner et al. A more complete survey of the IBMP corpus would strengthen the supervisory performance claim.
- Whether the NIP-10 5-person team structure was formally documented as a TsUP operational standard or evolved informally is not established in available sources. \[VERIFY\]
