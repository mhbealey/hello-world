---
title: CAD Generation Log
status: in-progress
owner: cad-generation-agent
last-updated: 2026-05-03
---

# CAD Generation Log

Append-only iteration log for the humanoid 3D model. Each entry records what changed, what the output looked like, and what was decided next.

---

## 2026-05-03 — Initial generation pass

**Specs extracted from study:**
- Height target: 1.5–1.9 m (§02 form factor tradespace); heritage bracket: Optimus 1.73 m / Atlas 1.50 m / Apollo 1.73 m / Valkyrie 1.87 m
- Total mass design-to: 75 kg (§02, §06)
- DOF: 51–55 kinematic; 38 independently actuated (§03)
  - Neck: 3, Torso: 2, Arms: 8 (3-DOF shoulder + 1-DOF elbow per side), Wrists: 6, Hands: 20–24 kinematic / 8 actuated, Hips: 6, Knees: 2, Ankles: 4
- Actuation: HD-Electric (harmonic drive + brushless DC) at load joints; QDD at wrist/hand joints (§03)
- Head: stereo HDR camera pair + ToF depth unit; two camera apertures at ±35 mm baseline, forward-facing (§04)
- Feet: boot/cover over foot end-effector with spring-loaded handrail-capture jaw; disposable overshoe (§03 dust mitigation)
- Form: full bipedal humanoid, T-pose reference geometry

**Parameters used:**
- HEIGHT target: 1.75 m
- TORSO: 0.32 m W × 0.20 m D × 0.42 m H
- HEAD_R: 0.105 m (sphere)
- NECK_H: 0.08 m, NECK_R: 0.04 m
- UPPER_ARM_L: 0.30 m, FOREARM_L: 0.26 m
- HAND: 0.10 m L × 0.08 m W × 0.04 m D (simplified box)
- THIGH_L: 0.42 m, SHIN_L: 0.38 m
- LIMB_R: 0.048 m, JOINT_R: 0.063 m, JOINT_H: 0.07 m
- FOOT: 0.25 m L × 0.13 m W × 0.065 m H (boot profile)
- CAMERA_R: 0.018 m, CAMERA_SEP: 0.07 m (stereo baseline)

**Output:**
- STL size: 534 KB
- GLB size: 194 KB
- Bounding box: 1.82 m wide × 0.27 m deep × 1.61 m tall
- Face count: 10,930 (trimesh)
- PNG renders: headless environment — pyglet not available; GLB is primary deliverable

**Issues / next iteration:**
- Actual height 1.61 m is within the 1.5–1.9 m study spec; slightly below 1.75 m design-to because torso bottom-to-hip gap and ankle-to-foot compress slightly. Acceptable at concept-vis fidelity.
- Depth (Y) at 0.27 m is anatomically narrow — torso depth drives this; could expand foot forward offset and torso depth if more realistic silhouette is desired.
- Camera bosses on head are simple forward-protruding cylinders (concept vis); no actual CSG cut into sphere (would require more complex BREP operation).
- Joint housings are cylindrical — all joints visible as slightly-wider-diameter rings on limb segments.
- Compound export (not progressive union) is fast and correct; no union artifacts observed.
- No renders available without display server; recommend converting GLB for Three.js viewer in the existing web viewer.
