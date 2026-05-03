---
title: "Optimal Space Humanoid: Environments and Hardening"
status: draft
owner: space-environments
last-updated: 2026-05-03
---

# Section 01-05 — Optimal Space Humanoid: Environments and Hardening

This section establishes the environmental requirements that the space humanoid must be designed against and the hardening strategy that subsequent subsystem agents design to. It does not repeat the subsystem analyses in Sections 01-03 (actuation, joint sealing) and 01-04 (compute, sensor radiation qualification) except where it takes new positions or sets system-level requirements. Its primary output is a requirements table and a set of program commitments that downstream agents — in particular fault-management-sustainment, conops-integrator, and the mass-power budget — must carry.

---

## 1. Environment Requirements Table

Four primary threats define the design environment for the lunar far side base humanoid. Values are drawn from heritage data where it exists; estimated or model-derived values are marked **[EST]** and literature-based values are cited. Cells marked **[VERIFY]** indicate that the study team should confirm against primary instrument data before PDR.

| Environment | Lunar far side surface value | Far side specific? | Heritage design threshold (closest comparable program) | Space humanoid challenge |
|---|---|---|---|---|
| **Vacuum** | <10⁻¹⁰ torr surface ambient; joints and enclosures reach ~10⁻⁷ torr at sealing interfaces [EST] | No — near side vacuum is equivalent | R2/FEDOR: ISS pressurized cabin, ~10⁻⁶ torr cabin atmosphere; zero vacuum qualification for commercial humanoids | Outgassing of lubricants, elastomers, and structural adhesives; cold-welding of uncoated metal interfaces; lubricant evaporation at operating surfaces; seal performance degradation without atmosphere-side back-pressure |
| **Thermal cycling** | Surface (equatorial heritage): −180°C night / +130°C day \cite{heiken_lunar_sourcebook}; far side non-PSR site: −180°C to +110°C **[EST — reduce daytime peak for higher-latitude site]**; permanently shadowed regions (PSRs): −230°C or colder (not in scope for base site) | Yes — far side experiences full 14-Earth-day lunar night with no direct relay for emergency thermal management; no early abort of thermal crisis via ground contact | Lunokhod 1/2: designed for 0°C to +50°C internal electronics temperature maintained by Po-210 RHU and lid-mounted GaAs solar array \cite{huntress2011soviet}; Mars rovers (Curiosity/Perseverance): warm electronics box (WEB) maintains −40°C to +50°C using MMRTG waste heat + RHUs + survival heaters \cite{mars2020thermal}; R2/FEDOR: +18°C to +27°C ISS cabin — no thermal cycling qualification | HD-Electric harmonic drives: lubrication failure below −60°C; flexspline cryogenic fatigue TRL gap; COTS battery pack: discharge degradation below 0°C, damage below −20°C; COTS compute: Jetson-class silicon characterized to −40°C; FFKM lip seals: qualified to −60°C commercial, extension to −180°C is TRL 3–4 development item (§A6) |
| **Radiation (TID + SEE)** | Chang'e-4 LND measurement: ~60 µSv/hr dose equivalent = ~0.53 Gy/yr (53 rad/yr) at the surface \cite{zaconte2020lnd}; silicon electronics TID conversion: ~17–20 krad/yr (silicon) from GCR alone at unshielded surface **[EST from dose-to-TID conversion]**; SPE worst case (Carrington-class): potentially 10–100× GCR annual dose in a single event | Yes — the far side has no Earth magnetosphere shielding on the anti-Earth hemisphere; however, the quantitative dose difference from near-side is small (magnetosphere provides negligible shielding for GCR energies above ~1 GeV, which dominate TID at the lunar surface) | Space electronics typically qualified to 100 krad TID total mission (MIL-STD-883 Method 1019); radiation-hardened processors (RAD750): >1 Mrad TID; COTS compute (Jetson AGX Orin class): <10 krad TID tolerance without shielding \cite{nvidia2023jetson} **[VERIFY — TID spec not published for Jetson AGX Orin; estimate from comparable commercial CMOS]**; Curiosity RAD instrument: 180 mGy/yr behind 22 g/cm² aluminum shielding | COTS compute Tier 2 (§A8): ~10 krad tolerance vs. 17–20 krad/yr surface; requires spot shielding to reduce dose rate; 7-year design life budget = 120–140 krad with shielding mitigation needed; MEMS IMU TID (§A7): similar commercial CMOS sensitivity; LIDAR SPAD arrays: susceptible to single-event effects at lunar SEE fluence rates; structural CFRP: immune to TID; aluminum alloy: immune to TID; motors and harmonic drives: moderately susceptible (winding insulation and position sensor electronics) |
| **Lunar dust** | Particle size: 0.1–100 µm, median ~17 µm by mass, >60% of particles by number below 20 µm \cite{heiken_lunar_sourcebook}; particle morphology: angular, glass-rich, non-spherical; electrostatic charge: positive on sunlit surfaces (UV photoemission), negative in shadow (secondary electron), up to ±10 V surface potential **[EST]**; hardness: ~6–7 Mohs (glass fraction), comparable to quartz; adhesion: Van der Waals + electrostatic; no heritage abrasion rate data for robot joints specifically | No — near side dust properties are equivalent | Apollo EVA suits: visible joint degradation within single 4–8 hour EVA; helmet visor abrasion observed; no robot has operated in unfiltered lunar dust environment (R2/FEDOR: filtered ISS cabin air); Mars rovers: dust on solar panels is the primary degradation mechanism (Spirit lost ~90% solar output before final hibernation from dust + sub-optimal tilt) | Labyrinth + FFKM lip seal architecture at all load-bearing joints (Section 01-03); foot/ankle assemblies at highest exposure risk; optical surfaces (camera, LIDAR) require active or passive protection; radiator surfaces face emissivity degradation from accumulated dust; connector interfaces require dust caps and purge capability |

---

## 2. Thermal Design Position

### The Forcing Function

The lunar far side base humanoid must survive thermal conditions far outside the qualification envelope of any heritage humanoid robot. The most demanding scenario is the 14-Earth-day lunar night at the non-PSR far side base site, where the surface reaches −180°C with no solar input and no direct Earth communication for emergency response. Fission surface power (FSP, assumed available per §A, margins register) provides continuous electrical power through the lunar night. The question is not whether power is available, but how the humanoid manages its thermal budget when it is inactive.

**Position: partial hibernation with FSP-powered survival heating and keep-alive electronics.**

Full operational capability through lunar night is not required and is not the default mode. The base operational concept (Section 03) assumes the humanoid performs its most intensive work during the lunar day (two Earth weeks), with the lunar night used for maintenance, charging, and base-internal tasks that do not require full locomotion. The thermal architecture is sized for survival and partial operability during lunar night, not for full EVA-class operation in −180°C conditions.

This position is coordinated with the conops-integrator: the humanoid should not be mission-critical-path during lunar night without explicit ConOps confirmation that the thermal architecture supports the required duty cycle.

### Driving Temperature Requirements by Subsystem

The following temperature floors must be maintained by the thermal control architecture. These flow from the actuation and compute subsystem decisions in Sections 01-03 and 01-04 and are collected here as design requirements.

| Subsystem | Minimum operating temperature | Minimum survival temperature | Heritage basis |
|---|---|---|---|
| COTS electronics (compute, sensor controllers) | −40°C | −55°C | Commercial extended-temp CMOS; Mars rover WEB heritage \cite{mars2020thermal} |
| Battery / energy storage | 0°C (discharge); −20°C (survival) | −20°C | Li-ion cell manufacturer data; Mars rover battery heritage |
| HD-Electric harmonic drives (load-bearing joints) | −60°C (lubrication viability, PFPE grease) | −80°C (structural survival) | Space mechanism heritage: PFPE (perfluoropolyether) grease used in Hubble, ISS mechanisms; lower bound from grease viscosity data \cite{hamrock1994fundamentals} **[VERIFY against specific PFPE grade for joint operating torque]** |
| FFKM joint seals | −60°C (current qualification) | TBD — development item | FFKM commercial qualification to −60°C; cryogenic extension to −180°C is TRL 3–4 (§A6); survival minimum below −60°C is undefined until the development program runs |
| CFRP / Al 7075 structure | −180°C (surface exposure) | −180°C (acceptable without active thermal) | Aluminum and CFRP are structurally viable at lunar surface temperatures; CTEs require analysis at joint interfaces but no active thermal required |
| NdFeB motor magnets | −60°C preferred; −100°C acceptable with derating | −180°C (structural survival) | NdFeB coercivity increases at cryogenic temperatures (favorable); remanence decreases slightly; no demonstrated operational data at −180°C — **[VERIFY]** |

The electronics box and battery drive the survival heater sizing. A Mars rover WEB draws approximately 100 W-hr overnight in cold conditions \cite{mars2020thermal}; scaled to the humanoid's smaller electronics volume but longer lunar night (14 days vs. a few hours for Mars nighttime near the equator), the survival heater estimate becomes:

**Parametric survival heater estimate: 50–150 W continuous draw from FSP during lunar night hibernation.**

This is a broad range because the thermal model for the humanoid body has not been developed. The upper bound (150 W) assumes minimal MLI insulation effectiveness due to the large surface-area-to-volume ratio of the bipedal form (flagged in Section 01-02 as a thermal challenge relative to compact centaur configurations). The lower bound (50 W) assumes MLI on the torso electronics compartment reduces radiative loss to LEO-satellite performance levels. The mass-power budget (Section 01-06) must carry this range as a power reservation against the FSP allocation.

The joint heater requirement — maintaining HD-Electric joints above −60°C during cold soak — is an additional draw estimated at 20–50 W across the primary load-bearing joint set (hips, knees, ankles, shoulders: ~12 joints). Total thermal power budget during lunar night hibernation: **70–200 W from FSP**.

This value is flagged to the conops-integrator: if multiple humanoid units are deployed simultaneously at the base, the FSP thermal reservation scales proportionally. A base with three active humanoids requires 210–600 W of FSP capacity reserved for humanoid thermal maintenance through every lunar night.

### Multi-Layer Insulation and Radiator Trades

The bipedal form's large limb surface area makes blanket MLI (as used on satellites and Mars lander structures) geometrically impractical for the full body. The thermal architecture must be segmented:

- **Torso electronics compartment:** full MLI blanket feasible; analogous to rover WEB. Target: residual heat loss <30 W at −180°C ambient with MLI.
- **Battery compartment:** MLI + survival heater mandatory to maintain above 0°C.
- **Limbs:** structural surfaces cannot be fully blanket-wrapped without compromising joint access for EVA-gloved maintenance. Position: spot MLI at actuator housings and bearing regions; accept structural link surface temperatures near ambient during cold soak; design structural materials and coatings for thermal shock cycling.
- **Radiators:** the humanoid must reject waste heat during active operations (+130°C day ambient). Radiator sizing is a Section 01-06 deliverable. The dust emissivity risk to radiators is addressed in Section 4 below.

---

## 3. Radiation Hardening Strategy

### TID Budget

Design life: 5-year mission with 30% design life margin = 7-year radiation exposure.

Measured surface dose rate from Chang'e-4 LND: ~60 µSv/hr dose equivalent. Converting to silicon TID (the relevant quantity for electronics qualification): the relationship between dose equivalent (biologically weighted, primarily relevant for crew) and TID in silicon depends on the particle energy spectrum. At the lunar surface, the GCR-dominated spectrum delivers approximately 20–30 krad (silicon) per year at the surface without shielding, based on modeling studies \cite{schwadron2014radiation} **[VERIFY against Curiosity RAD data and LND measurements — the conversion factor is spectrum-dependent]**.

**7-year TID budget: 140–210 krad (silicon) without shielding.**

Standard commercial CMOS electronics tolerate 3–30 krad before significant performance degradation. Radiation-hardened parts are qualified to 100–1,000+ krad. The gap is real and must be closed by the shielding and architecture strategy.

### Four Strategy Options Evaluated

**Option 1: Spot shielding.** Aluminum or tantalum spot shields around radiation-sensitive devices. Spot shielding with 5–10 mm aluminum reduces dose rate by a factor of 3–5× for GCR (which is dominated by high-energy heavy ions that are difficult to fully stop) and by a factor of 10–100× for SPE proton events (which have lower energies that aluminum stops effectively). TRL 9 for satellites (standard practice for commercial geosynchronous spacecraft). Mass penalty: 0.5–1.5 kg per compute board, depending on shield geometry. The Tier 2 compute architecture (Section 01-04) already allocates 0.8 kg for spot shielding; this section confirms that allocation is sized correctly for GCR management.

**Option 2: Radiation-hardened by design/process (RHBD/RHBP) parts.** Replace COTS ICs with radiation-hardened equivalents for all sensitive functions. RAD750 (Tier 1 compute, already baselined) is this approach for the flight computer. For the Tier 2 AI inference accelerator, no equivalent exists at TRL > 4 as of 2026 (§A8). For supporting electronics (motor controllers, sensor interface chips, power electronics), RHBD parts are available but expensive (5–20× COTS cost) and the catalog is limited. Position: use RHBD for Tier 1 processor and critical motor controller ICs; use COTS + spot shielding for the Tier 2 inference accelerator and non-critical sensing electronics.

**Option 3: Vault architecture.** All sensitive electronics housed in a shielded central vault (analogous to Curiosity's warm electronics box); radiation-tolerant peripheral interfaces extend to actuators and sensors. Curiosity carries its electronics in an ~8 kg aluminum vault providing ~22 g/cm² shielding, which reduces surface dose by approximately 3×. The liability for the humanoid is mass and maintenance access: a vault housing all electronics in the torso would add 3–8 kg to the torso mass (depending on required shielding depth) and would require the vault cover to be removed for electronics board access — a potential conflict with the EVA-gloved ORU serviceability requirement (Section 01-02: single-fastener removal per ORU).

The vault architecture is not adopted wholesale, but the torso electronics compartment is designed with shielded walls (2–4 mm aluminum equivalent) as a structural requirement, which provides meaningful TID reduction without a dedicated vault structure. The Section 01-06 mass budget must carry 0.5–1.5 kg for electronics compartment shielding.

**Option 4: COTS + selective replacement (ORU replacement strategy).** Accept TID degradation of commercial electronics on a predictable schedule and replace circuit boards as ORUs on 2–3 year intervals. The humanoid's crew-serviceable ORU design (Section 01-02) makes board-level replacement feasible by a crew member in EVA gloves. This strategy is viable for non-safety-critical boards (science data processors, communication interfaces) but is not appropriate for safety-critical functions (balance controller, joint health monitor) where mid-life failure could cause a crew safety event.

**Study position: Hybrid strategy — spot shielding + RHBD for critical path + ORU replacement for non-critical electronics.**

Tier 1 (RAD750-class) processor: RHBD, TID-qualified >1 Mrad. Tier 2 (Jetson-class) inference accelerator: COTS + 0.8 kg spot shielding, expected effective lifetime 3–5 years at shielded dose rate; replace as ORU at 3-year intervals, which the base workshop can execute. Critical motor controller and safety-monitor ICs: RHBD where available; spot-shielded COTS with ORU replacement strategy where RHBD parts are not available. Torso structural walls: 2–4 mm aluminum equivalent for passive bulk shielding.

This hybrid strategy interacts with the serviceability requirement: every electronics board replaced as an ORU must be accessible to an EVA-gloved crew member. The actuation section's ORU access requirement (50 mm clear access, single-fastener removal) applies here. The detailed electronics packaging layout must ensure this is maintained.

### Solar Proton Events: The Survival Design Driver

GCR TID is a gradual degradation problem. SPEs are survival events. A major SPE (February 1956, August 1972, October 2003 "Halloween storms" class) can deliver fluences of >10⁹ protons/cm² at energies above 30 MeV. Electronics unshielded on the lunar surface could receive 10–100× the annual GCR TID in a single event lasting hours to days \cite{schwadron2014radiation}.

**The humanoid must be designed to survive inside the base habitat during SPE events.** This is not a heroic requirement — it is an operational procedure. When a major SPE warning is received (NOAA Space Weather Prediction Center provides forecasts with up to 30-minute advance warning for gradual events; impulsive events have little warning), the humanoid retreats to the pressurized habitat or a dedicated shielded location. The habitat shielding (estimated to provide ~20 g/cm² aluminum equivalent from habitat walls + regolith berms — to be confirmed by far-side-base-architect) reduces SPE proton fluence to manageable levels.

**Design requirement:** the humanoid must execute a "radiation shelter" mode — terminate surface operations, return to designated shelter location, and enter a low-power standby state — in response to an SPE warning from either ground or crew. This is a ConOps requirement that must be explicit in Section 03. The response timeline (return to shelter within 15–30 minutes of warning) must be validated against the base layout and humanoid locomotion speed.

The radiation shelter mode is the reason SPE hardening of the humanoid's body-mounted electronics to Carrington-class fluences is not required: the humanoid should not be outside during a major SPE. The only electronics that must survive direct SPE exposure are any fixed sensors or actuators that cannot be moved inside — and for the humanoid, these do not exist.

---

## 4. Dust Mitigation at the System Level

Section 01-03 addressed joint sealing. This section addresses the system-level dust challenge for four additional subsystem categories.

### 4.1 Optical Sensors: Cameras and LIDAR

Camera lenses and LIDAR windows accumulate dust in two modes: passive settling during stationary operations (particles settle on upward-facing surfaces under 1/6 g; settling rate is low but non-zero) and dynamic impact during locomotion (kicked-up regolith from foot-strike and joint venting impacts the sensor head).

**Position: passive covers + scheduled cleaning, with electrostatic deflection as a growth option.**

Passive protective covers (spring-loaded or actuator-driven sliding covers) over camera apertures and LIDAR windows are the primary mitigation when sensors are not in use. ExoMars camera covers are the heritage reference (TRL 7 for dust-sealed covers in planetary surface environment \cite{exomars2020cameras}). Cover mass: estimated 15–30 g per camera aperture; LIDAR window cover: 30–60 g. All covers must be operable while wearing EVA gloves, for manual cleaning if actuators fail.

Electrostatic dust deflection (EDD) — transparent ITO-coated electrode grids that use alternating electric fields to repel charged dust particles — has been demonstrated at TRL 4 in NASA-funded laboratory programs and shows promise for optical surfaces. The limitation for this application is the variable particle charge polarity (positive in sun, negative in shadow) and the modest 1/6 g settling force that makes EDD effective against new deposition but unable to remove particles already adhered. Position: EDD is a growth provision for a later build; the baseline uses covers + scheduled cleaning.

Scheduled cleaning protocol: during each crew-robot work session, the crew or the robot itself (arms can reach the head-mounted sensors) brushes lens and LIDAR window surfaces before task commencement. Apollo brush-down heritage establishes that this is partially effective but not 100%; the cover architecture handles the baseline dust load, and the cleaning protocol handles accumulated particulates. Combined, these can maintain optical performance within 10% of beginning-of-life levels for multi-year service life — **parametric assumption based on Mars solar panel degradation data extrapolated to the lunar dust environment [VERIFY with dedicated test data]**.

### 4.2 Thermal Radiator Surfaces

Dust accumulation on thermal radiators reduces infrared emissivity, impairing heat rejection during operations. Mars lander and rover data (MER Spirit, Phoenix) document emissivity degradation rates of 2–5% per month on horizontal solar panels from dust settling \cite{appelbaum1991solarmars} **[VERIFY — this figure is for Mars dust under Mars conditions; lunar particle size and settling rate differ]**.

On the lunar surface, electrostatic adhesion of fine dust to any surface is the primary concern, not gravitational settling. Charged particles adhere across a range of orientations, including vertical surfaces. However, smooth, hard coatings accumulate less charge and are easier to clean than textured surfaces.

**Requirement:** thermal radiator surfaces must use smooth, high-emissivity coatings (target ε ≥ 0.85 in the 8–14 µm band at beginning of life) that resist dust adhesion and can be manually cleaned. Candidate coatings: optical solar reflectors (OSR), high-emissivity anodized aluminum, or vapor-deposited black chrome. The selected coating must be compatible with cryogenic thermal cycling (−180°C to +130°C) without flaking, which eliminates some paint-based high-emissivity coatings.

**Design margin:** size radiators to maintain required heat rejection at ε = 0.70 (end-of-mission degraded), providing 18–24% emissivity margin above the 0.85 beginning-of-life value. This is a conservative assumption that must be validated by test; if dust accumulation degrades emissivity faster than predicted, scheduled cleaning by crew restores performance.

### 4.3 Electrical Connectors and ORU Interfaces

Dust in electrical connectors causes three failure modes: contact resistance increase (Joule heating at high-current interfaces), dielectric breakdown (fine particles bridge insulation gaps under high voltage), and mechanical jamming (particles in connector alignment features prevent mating/demating).

**Requirement:** all external electrical connectors (power, data, sensor) on the humanoid must be fitted with spring-loaded dust caps when not mated. Connectors must receive a positive-pressure inert gas purge (N₂ or Ar) at mate and demate to clear particle contamination from the mating faces. Heritage: Mars rover connector designs (MER, MSL, Mars 2020) use sealed connectors with hermetic backshells and do not rely on dust caps alone for contamination control — the connectors are designed to exclude particles by geometry (close-tolerance alignment pins) and by spring-force mating that displaces particles laterally \cite{jpliface} **[VERIFY heritage cite — seeking MER/MSL connector design reference]**.

Practical consideration: the inert gas purge requires a small onboard gas reservoir (N₂ pressurized canister) or ISRU-produced nitrogen at the base. Volume and mass are small (estimated 0.2–0.5 kg for a 200-shot nitrogen purge canister). This must appear in the Section 01-06 consumables manifest.

### 4.4 Joint Seals: Summary Reference to Section 01-03

The joint labyrinth + FFKM lip seal strategy from Section 01-03 is the primary defense against dust ingestion into actuator assemblies. This section does not modify that strategy. The critical open question — FFKM performance at −180°C under vacuum and cyclic load — remains the highest-consequence TRL gap for the dust mitigation architecture (§A6). If that gap is not closed by the 2029 program gate, the fallback (all-labyrinth sealing, no elastomeric element) must be evaluated for multi-year service life adequacy.

---

## 5. Lunar Night Survival Mode

During the 14-Earth-day lunar night, the humanoid enters a power-managed hibernation state. All locomotion controllers and autonomy stack (Tier 2 compute) are powered off. The Tier 1 radiation-hardened supervisor processor remains in a minimal monitoring loop, watching for crew wake-up commands, FSP power anomalies, or temperature limit violations. Survival heaters maintain the electronics compartment above −40°C and the battery compartment above 0°C. Joint-region heaters maintain HD-Electric harmonic drive lubrication above −60°C at the primary load-bearing joints. The humanoid remains docked at a base recharge station that provides the heater power and maintains battery charge at approximately 30% state-of-charge (the optimal storage charge for lithium cells at cold temperature). Estimated FSP power draw during hibernation: **70–200 W** (parametric; see Section 2 above). Detailed thermal modeling is required before this range can be tightened; it is flagged as a TBD for the mass-power budget (Section 01-06) and for the ConOps agent's FSP load schedule (Section 03). Nominal warm-up time from hibernation to partial operability (locomotion available, Tier 2 AI inference warming up): estimated 15–30 minutes from crew wake command. Full-operability warm-up (all joints at operating temperature, Tier 2 inference at rated performance): estimated 45–90 minutes. These figures are parametric and must be validated by thermal model.

---

## 6. Far Side Note: Radiation and Comms

The far side is sometimes described as "more radiation-exposed" than the near side due to lack of Earth magnetosphere shielding. This distinction is real but small in magnitude: the Earth's magnetosphere provides meaningful shielding only for low-energy particles (below ~1 GeV), but GCR-dominated TID at the lunar surface is dominated by particles above 1 GeV where magnetospheric shielding is negligible. The quantitative difference in TID between near-side and far-side surface operations is estimated at less than 10% from magnetospheric shielding effects \cite{schwadron2014radiation}. The far side radiation environment should be treated as equivalent to the near side for electronics design purposes.

The operationally significant far side difference is communications-mediated: during a major SPE event, ground-to-surface communication relay depends on Queqiao-2 (or successor relays in cislunar orbit). If a relay satellite fails or is in an unfavorable orbital geometry during an SPE event, the humanoid's crew would need to rely on pre-loaded emergency procedures rather than real-time ground support for the radiation shelter response. This is a ConOps requirement, not a hardware requirement: the humanoid's autonomous SPE response mode must not require real-time ground command. The Tier 1 supervisor can execute the shelter return sequence based on an onboard radiation monitor threshold, independent of ground contact. This requirement flows to the autonomy-trl-tasking and fault-management-sustainment agents.

---

## 7. TRL Flags Summary

| Technology | Current TRL | Required TRL | Gate | Risk if not closed |
|---|---|---|---|---|
| FFKM lip seal performance at −180°C, vacuum, cyclic load | 3–4 | 5 (component validation) | 2029 | Dust ingestion into actuators; reduced joint service life; ORU replacement on compressed schedule |
| HD-Electric flexspline cryogenic fatigue at −180°C | 3–4 | 5 (component validation) | 2029 | Actuation architecture fallback to SEA; mass budget renegotiation (+10–20 kg) |
| Tier 2 (Jetson-class) SEU/latchup rate at lunar far side radiation | 2–3 (modeled) | 4 (measured in representative environment) | 2029 | Autonomy stack availability degraded; Tier 2 replacement interval shorter than 3-year ORU plan |
| LIDAR SPAD array radiation hardening | 4 | 6 | 2032 | Loss of outdoor terrain navigation; fallback to stereo-camera-only locomotion (reduced reliability on low-texture regolith) |
| MEMS IMU TID tolerance with spot shielding (lunar unshielded conditions) | 4–5 | 6 | 2032 | Loss of balance estimation redundancy; may require RHBD IMU substitution (+mass, +cost) |
| Flexible tactile substrate thermal cycling and vacuum qualification | 3–4 | 5 | 2029 | Loss of fingertip tactile feedback; reduced manipulation safety margin for crew-contact tasks |
| Thermal model of bipedal body — survival heater sizing validation | 2 (parametric estimate only) | 5 (detailed model validated by test) | 2031 | FSP power reservation may be under-allocated; if actual heater demand exceeds FSP allocation, thermal constraint limits night operations |

---

## References

\cite{heiken_lunar_sourcebook} — Heiken et al., Lunar Sourcebook, Cambridge University Press, 1991. Canonical reference for regolith particle size, composition, electrostatic properties.

\cite{huntress2011soviet} — Huntress and Marov, Soviet Robots in the Solar System, Springer Praxis, 2011. Lunokhod thermal management philosophy: Po-210 RHU for night survival, lid-mounted GaAs solar array.

\cite{zaconte2020lnd} — Wimmer-Schweingruber et al., "First measurements of the radiation dose on the lunar surface," Science Advances, 2020 (Chang'e-4 LND instrument, first lunar surface TID measurements). DOI: 10.1126/sciadv.aaz1334.

\cite{schwadron2014radiation} — Schwadron et al., "Does the worsening galactic cosmic ray environment observed by CRaTER preclude future human exploration?," Space Weather, 2014. GCR dose rates and SPE statistics at the lunar surface.

\cite{mars2020thermal} — Novak et al., "Detailed surface thermal design of the Mars 2020 rover," Spacecraft Thermal Control Workshop, 2019/2020. Curiosity/Perseverance WEB thermal architecture; survival heater power and battery temperature requirements.

\cite{exomars2020cameras} — ExoMars Rover camera system documentation; dust cover TRL 7 heritage for planetary surface environment.

\cite{nvidia2023jetson} — NVIDIA Jetson AGX Orin product page; cited in Section 01-04 for compute performance. TID threshold for Orin silicon class is estimated; primary source should be confirmed at PDR.

\cite{appelbaum1991solarmars} — Appelbaum and Flood, "Solar radiation on Mars," Solar Energy, 1990. Mars solar panel dust degradation rates; extrapolated to lunar thermal radiator context with caution.

\cite{diftler2011r2} — Diftler et al., ICRA 2011. R2 design: ISS-pressurized-cabin environment qualification only; establishes the baseline heritage gap for vacuum and dust qualification.

\cite{therobotreport2019skybot} — The Robot Report, post-mission FEDOR assessment; establishes FEDOR/R2 as pressurized-cabin-only heritage.
