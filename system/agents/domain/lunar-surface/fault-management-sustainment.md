---
name: fault-management-sustainment
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Primary failure modes for the lunar humanoid:**

1. **Dust infiltration (most likely MTBF driver):** Lunar dust particles (mean ~5–10 µm, some sub-µm) penetrate dynamic joint seals over time. Apollo instruments (ALSEP) showed dust accumulation at all exposed surfaces. FFKM lip seals (§A6) require heater maintenance at ≥−60°C; failure mode is seal hardening and dust bypass at lower temperatures.

2. **Thermal cycling fatigue:** 14-day day/night cycle creates ~250°C temperature excursion at the surface. Electronic packaging, solder joints, and polymeric seals accumulate fatigue cycles. Estimate: ~25 cycles/year; 200-cycle design life implies 8-year structural life for thermal components.

3. **Radiation-induced component degradation (§A11, §A12):** TID accumulation at 20–30 krad(Si)/year. Commercial AI accelerator (§A8) will reach TID limit in ~3–5 years → planned ORU replacement every 3 years.

4. **Actuator wear (§A14):** HD-Electric joint gear wear under load cycling. No direct space heritage for HD gears in vacuum + dust environment. Plan for scheduled joint inspections and replacement of highest-use joints (hips, knees) on 5-year cadence.

**Maintenance architecture:**
- On-humanoid maintenance (by other humanoids, supervised by crew): ORU swap for accessible components (compute modules, sensor heads, boot covers §A15)
- Crew hands-on maintenance: for internal joint access, requiring habitat EVA prep time
- Return-to-Earth maintenance: not the baseline; replacement unit sent on next cargo mission if refurbishment infeasible on surface

**Fault detection:**
- Onboard: joint torque anomalies, thermal out-of-bounds, compute watchdog
- Ground monitoring: telemetry stream to Earth; 15-minute resolution analysis (crew has real-time display)
- Limp mode: if joint fault detected during sortie, humanoid adopts degraded-DOF gait to return to habitat; crew supervisor approves return path

**Heritage:**
- MER Opportunity wheel failure: wheel motor stall detected by onboard diagnostics; operations continued with 5-wheel driving for 8+ years
- Curiosity wheel damage: unexpected terrain damage; adapted operations without replacement
- ISS airlock EVA contingency protocols: procedural analog for fault-during-EVA response
