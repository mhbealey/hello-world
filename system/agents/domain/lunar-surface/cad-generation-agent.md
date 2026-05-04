---
name: cad-generation-agent
version: 1.0.0
domain: lunar-surface
last-updated: 2026-05-04
---

## Domain overlay: lunar-surface (humanoid pathfinder)

**Model identity:** Bipedal space humanoid, lunar surface EVA configuration.

**Geometry targets (from cross-coupling DB):**
- Mass class: 75 kg design-to
- Height: 1.5–1.9 m (nominal 1.65 m)
- DOF: 38 actuated joints
- End-effectors: 4 (two hands + two feet/boots)
- Joint style: harmonic-drive cylindrical housings at primary joints (shoulders, elbows, wrists, hips, knees, ankles)
- Sensor head: rounded helmet form, two circular camera apertures (stereo HDR), IMU housing at crown

**Aesthetic (lunar-surface):**
- Smooth, paneled surfaces — NASA/ILC/Apollo-PLSS heritage, not toy/mecha
- White matte primary panels, grey joint housings, ExoMars red accent stripe at shoulder line
- Boots: wider base footprint than commercial humanoid, ankle-height — Apollo EVA boot heritage
- No weapons, no exaggerated features, no anime-mecha aesthetics
- HMD-01 decal on upper torso (study identifier)

**Script paths:**
- Source: `visual/source/humanoid_model.py`
- STL: `visual/source/humanoid.stl`
- GLB: `visual/output/humanoid.glb`

**Looking Glass note:** GLB loads directly into the Looking Glass Model Viewer. Keep polygon count ≤400k (T1 fidelity) for smooth real-time display.

**Self-evaluation criteria:**
- Bounding box: ~1.5–1.9 m tall ✓ / Limbs proportioned anthropomorphically ✓ / Joints visible at correct anatomical locations ✓ / Sensor head identifiable ✓
- Bad output: T-pose stick figure, stacked boxes with no joint differentiation, obviously wrong proportions
