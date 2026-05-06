---
name: robotics-sensing-autonomy
version: 1.0.0
domain: orbital-platform
last-updated: 2026-05-06
---

## Domain overlay: orbital-platform

**Sensor suite for spaceport operations:**
| Sensor | Application | Heritage | TRL |
|--------|-------------|---------|-----|
| LIDAR (docking) | Approach guidance for visiting vehicles | DragonEye, TriDAR | 8–9 |
| Stereo cameras (wide field) | Platform situational awareness, debris monitoring | ISS external cameras (HDEV) | 8–9 |
| Thermal IR cameras | Hull integrity monitoring, solar array health | ISS FLIR surveys | 7–8 |
| Radar (traffic monitoring) | Multi-vehicle tracking at approach | No direct LEO heritage | 5–6 |
| GPS/navigation beacons | Visiting vehicle relative navigation | ISS GPS augmentation | 8–9 |
| Acoustic sensors (IVA) | Pressure leak detection | ISS acoustic monitoring | 7–8 |

**Illumination:** Not a challenge in LEO — sunlit periods provide ample illumination; eclipse periods require active lighting for EVA and inspection. Contrast with lunar surface where low-angle illumination was the primary imaging challenge.

**Navigation:** GPS available in LEO. Platform GPS provides absolute position for all visiting vehicles. No SLAM required — this is a fundamental operational difference from the lunar surface study.

**Autonomous traffic monitoring (the gap):**
- Tracking 20+ vehicles in approach corridors simultaneously requires an air-traffic-controller-equivalent system
- No current LEO platform operates at this traffic density
- Required capability: real-time tracking, collision avoidance alerting, approach sequence management
- TRL ~4 for software; TRL ~6 for hardware components; system integration TRL ~3–4
- Development path: simulate with digital twin → demonstrate at low traffic density (IOC) → scale to full throughput

**Compute architecture:**
- Platform-wide network: high-bandwidth ethernet backbone (ISS uses MIL-STD-1553 and Ethernet; next-gen commercial will be gigabit Ethernet minimum)
- Distributed compute nodes: each module has local compute for life support, autonomy; connected to platform-wide network
- Radiation: commercial-grade computing is feasible with shielding in pressurized modules; external compute nodes require rad-hard or ORU-replaceable strategy
- No severe radiation constraint at 400 km (TID ~5–10 krad/year); standard industrial compute can survive with modest shielding

**Foundation models in spaceport context:**
- Traffic management AI: machine learning for anomaly detection in approach trajectories; TRL 4 for this application
- Predictive maintenance: sensor fusion for health monitoring across 1 km structure; promising but not flight-proven at this scale
- Decision support (not autonomous decision): AI-assisted anomaly flagging with human authorization required for all consequential actions

**Key TRL gaps:**
- Multi-vehicle traffic management system: TRL 3–4 → need TRL 6 by 2032
- Large-structure health monitoring (distributed sensor fusion): TRL 4–5 → need TRL 6 by 2032
- Autonomous manufacturing cell operations in microgravity: TRL 3–5 (domain-dependent)
