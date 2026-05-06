---
name: space-environments
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform (LEO ~400 km)

**Primary environmental drivers for a 400 km LEO spaceport:**

**1. Thermal cycling (dominant structural driver)**
- 16 cycles per 24 hours (90-minute orbital period)
- Temperature excursion: −120°C (eclipse) to +120°C (sunlit), external surfaces
- Cycle count at 10-year life: ~58,400 cycles — far exceeding lunar (25 cycles/year)
- Design implication: thermal fatigue is the primary structural life driver; all external mechanisms must be designed for 60,000+ cycles minimum

**2. Radiation environment**
- Total ionizing dose (TID): 5–10 krad(Si)/year at 400 km, 51.6° inclination (ISS heritage)
- South Atlantic Anomaly (SAA): dose rate spikes; shielded interior is primary crew habitat during SAA passes
- Galactic cosmic rays: lower concern at LEO than lunar; Earth's magnetosphere provides partial shielding
- Solar energetic particle (SEP) events: GLE events require shelter protocol; ISS shelter protocol is the baseline

**3. Atomic oxygen (LEO-specific, no lunar analog)**
- Atomic oxygen flux at 400 km: ~10^14 atoms/cm²/s; erosion rate for unprotected polymers ~1–3 µm/year
- Materials constraint: all external polymer surfaces require AO-resistant coating (e.g., SiO₂ or Al₂O₃ coating on Kapton)
- Optical surfaces, solar array blankets, and external seals require periodic inspection for AO erosion

**4. Debris and micrometeorite flux**
- Trackable debris (>10 cm): ISS performs ~2–3 debris avoidance maneuvers per year at 400 km
- Small debris (1–10 cm): shielding per NASA MMOD standard (Whipple shield); critical for pressurized modules
- Spaceport-specific risk: larger cross-sectional area than ISS (1 km vs. 109 m) multiplies hit probability proportionally; this is a critical design driver with no ISS-heritage solution
- Mitigation: modular design allows section isolation; debris shields on high-value modules

**5. Atmospheric drag (unique to LEO)**
- Drag at 400 km: ~0.1 mN/m² frontal area; drives reboost propellant budget
- Solar activity dependence: F10.7 index drives density variation ×10 over solar cycle; reboost cadence varies
- Implication: propellant depot on-station is both a service and a necessity for self-sustainment

**Environmental design margins (concept phase):**
- Thermal: design to ±20°C beyond expected excursion (−140°C / +140°C external)
- Radiation: 30% margin on total dose (TID budget design-to = 1.3× expected)
- Debris: Whipple shield per NASA-STD-6016 for all crew modules
- AO: inspection intervals every 18 months for critical external surfaces
