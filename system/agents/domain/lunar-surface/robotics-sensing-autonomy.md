---
name: robotics-sensing-autonomy
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-06
---

## Domain overlay: lunar-surface

**Sensor suite (§A7):** ~2.1 kg total, 37–75 W peak
| Sensor | Location | Function | Heritage |
|--------|----------|----------|---------|
| Stereo HDR cameras (2×) | Head | Navigation, object recognition, terrain assessment | Mastcam-Z (Mars 2020) stereo baseline |
| IMU (6-DOF) | Torso | State estimation, locomotion control | MEMS heritage, space-qualified variants exist |
| Proprioceptive sensors | All joints | Torque, position feedback | Standard in HD-Electric systems |
| LIDAR (solid-state) | Chest | 3D terrain mapping, proximity | Leica BLK variant; space-qual TRL ~5 |
| Thermometry | Joints | Seal temperature monitoring | TRL 6+ |

**Illumination challenge:** Lunar surface illumination is extreme — low sun angle creates long shadows, high-contrast scenes, and high dynamic range requirements. HDR imaging with stereo baseline is required. Standard cameras designed for Earth diffuse lighting perform poorly without HDR adaptation.

**Navigation:** GPS is not available on the lunar surface. SLAM (Simultaneous Localization and Mapping) using LIDAR + stereo cameras with dead reckoning from IMU. Beacon augmentation from base site provides absolute reference within ~1 km radius.

**Compute architecture (§A8):** Two-tier
- Tier 1 (supervisor): Space-grade rad-hard processor (e.g., GR740 or equivalent); runs safety-critical watchdogs, fault detection, communications
- Tier 2 (AI accelerator): Commercial AI processor (NVIDIA Jetson class or equivalent); runs perception, motion planning, task execution; behind shielding
- Watchdog: if Tier 2 fails or produces out-of-bounds commands, Tier 1 halts motion and enters safe mode

**Foundation models (§A9):** Operate at task planning layer only. Generate high-level action sequences (pick up object, walk to waypoint). Primary task execution (joint-level control) is classical motion planning + learned primitives. Full end-to-end neural control deferred to TRL 8+ demonstration.

**TRL gaps:**
- Solid-state LIDAR in lunar thermal cycling: TRL ~5 → TRL 6 needed by 2029
- Commercial AI accelerator radiation tolerance: TID limit ~1–5 krad; planned ORU replacement at 3-year intervals (§A11)
- SLAM in unstructured lunar terrain: TRL 4–5 for bipedal platform; benchmark against Mars rover visual odometry
