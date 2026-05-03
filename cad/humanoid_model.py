"""
Space Humanoid — Parametric CadQuery Model
cad-generation-agent, 2026-05-03

Specs extracted from study/01-optimal-space-humanoid/:
- Total height: 1.5–1.9 m (form factor tradespace §02); design-to 1.75 m
- Total mass: 75 kg design-to (§02, §06)
- Standing height: 1.5–1.9 m, bipedal, T-pose reference
- DOF: 51–55 kinematic DOF; 38 independently actuated
  - Neck: 3 DOF
  - Torso: 2 DOF
  - Arms (×2): 3-DOF shoulder + 1-DOF elbow + 3-DOF wrist = 7 per arm
  - Hands (×2): 10–12 kinematic DOF per hand; 4 independent actuators per hand
  - Hips (×2): 3 DOF per hip
  - Knees (×2): 1 DOF per knee
  - Ankles (×2): 2 DOF per ankle
- Actuation: HD-Electric (harmonic drive + brushless DC) at load joints;
  QDD at wrist/hand joints
- Head: stereo HDR camera pair + ToF depth unit; two camera apertures
- Feet: disposable boot/cover over foot end-effector + spring-loaded handrail jaw
- Form: full bipedal humanoid, T-pose (arms horizontal, legs straight down)
"""

import cadquery as cq
import os

os.makedirs("cad/output", exist_ok=True)

# ---------------------------------------------------------------------------
# Parameters — all in meters
# Derived from study specs:
#   Form factor §02: 1.5–1.9 m height; 75 kg design-to
#   Heritage bracket: Optimus 1.73 m / Atlas 1.50 m / Valkyrie 1.87 m
# ---------------------------------------------------------------------------
HEIGHT       = 1.75     # m total target height

TORSO_H      = 0.42     # m  torso box height
TORSO_W      = 0.32     # m  torso box width (shoulder to shoulder, inner)
TORSO_D      = 0.20     # m  torso box depth (front to back)

NECK_R       = 0.04     # m  neck cylinder radius
NECK_H       = 0.08     # m  neck cylinder height

HEAD_R       = 0.105    # m  head sphere radius (≈ 210 mm diameter, human scale)

UPPER_ARM_L  = 0.30     # m
FOREARM_L    = 0.26     # m
HAND_L       = 0.10     # m  simplified hand box length (palm + fingers)
HAND_W       = 0.08     # m
HAND_D       = 0.04     # m

LIMB_R       = 0.048    # m  limb cylinder radius
JOINT_R      = 0.063    # m  joint housing cylinder radius (slightly larger than limb)
JOINT_H      = 0.07     # m  joint housing height (axial depth of housing)

THIGH_L      = 0.42     # m
SHIN_L       = 0.38     # m

FOOT_L       = 0.25     # m  foot box length (fore–aft)
FOOT_W       = 0.13     # m  foot box width
FOOT_H       = 0.065    # m  foot box height (boot profile)

# Camera apertures cut into head sphere
CAMERA_R     = 0.018    # m  camera lens recess radius
CAMERA_DEPTH = 0.025    # m  recess cut depth
CAMERA_SEP   = 0.07     # m  stereo baseline (center-to-center)
CAMERA_Y     = HEAD_R * 0.55  # m  forward offset of camera face on sphere

# ---------------------------------------------------------------------------
# Derived geometry — Z is vertical (up), Y is forward, X is lateral
# Origin: torso center (geometrically centered on the torso box)
# ---------------------------------------------------------------------------

# Key Z elevations
TORSO_TOP_Z  = TORSO_H / 2.0                              # top face of torso
TORSO_BOT_Z  = -TORSO_H / 2.0                             # bottom face of torso

NECK_BOT_Z   = TORSO_TOP_Z                                # neck sits on torso top
NECK_TOP_Z   = NECK_BOT_Z + NECK_H
HEAD_CZ      = NECK_TOP_Z + HEAD_R                        # sphere center

# Shoulder position: at the top corners of the torso
SHOULDER_X   = TORSO_W / 2.0 + JOINT_R                   # outward from torso edge
SHOULDER_Z   = TORSO_TOP_Z - 0.06                         # slightly below torso top

# Elbow position: shoulder center + upper arm length along X
ELBOW_X      = SHOULDER_X + UPPER_ARM_L
ELBOW_Z      = SHOULDER_Z

# Wrist / hand attach
WRIST_X      = ELBOW_X + FOREARM_L
WRIST_Z      = ELBOW_Z

# Hip position: at the bottom of the torso, outward
HIP_X        = TORSO_W / 4.0                              # inboard of shoulder (pelvis width)
HIP_Z        = TORSO_BOT_Z - JOINT_H / 2.0

# Knee position: hip center - thigh length
KNEE_Z       = HIP_Z - THIGH_L

# Ankle position: knee center - shin length
ANKLE_Z      = KNEE_Z - SHIN_L

# Foot: resting on the floor; bottom of foot at ankle - foot height
FOOT_BOT_Z   = ANKLE_Z - FOOT_H
FOOT_CZ      = FOOT_BOT_Z + FOOT_H / 2.0
# Foot shifted slightly forward (Y direction) relative to ankle centerline
FOOT_FWD     = 0.04     # m  forward offset of foot center from ankle axis

# ---------------------------------------------------------------------------
# Build each part — using cq.Workplane and .translate() for placement
# All parts are built at origin then translated into position
# ---------------------------------------------------------------------------

parts = []

# --- Torso ---
torso = cq.Workplane("XY").box(TORSO_W, TORSO_D, TORSO_H)
parts.append(torso.val())

# --- Neck ---
neck = (
    cq.Workplane("XY")
    .cylinder(NECK_H, NECK_R)
    .translate((0, 0, NECK_BOT_Z + NECK_H / 2.0))
)
parts.append(neck.val())

# --- Head ---
head = cq.Workplane("XY").sphere(HEAD_R).translate((0, 0, HEAD_CZ))
parts.append(head.val())

# --- Camera recesses (cut cylinders embedded in head — visualized as separate small discs) ---
# Show cameras as small protruding disc/cylinder features on the forward face of the head
for sign in (-1, 1):
    cam = (
        cq.Workplane("XZ")
        .cylinder(CAMERA_DEPTH, CAMERA_R)
        .translate((sign * CAMERA_SEP / 2.0, HEAD_CZ, 0))
        # rotate so cylinder axis points forward (Y)
    )
    # Build as a sphere-plane cut result would need CSG; instead represent as
    # a small forward-protruding boss cylinder (concept vis fidelity)
    cam_boss = (
        cq.Workplane("XZ")
        .cylinder(CAMERA_DEPTH, CAMERA_R)
    )
    # Rotate 90° around X to point in +Y, then translate
    cam_boss = cam_boss.rotate((0, 0, 0), (1, 0, 0), 90)
    cam_boss = cam_boss.translate((sign * CAMERA_SEP / 2.0, CAMERA_Y + CAMERA_DEPTH / 2.0, HEAD_CZ))
    parts.append(cam_boss.val())

# ---------------------------------------------------------------------------
# Arms (bilateral — right side at +X, left side at -X)
# ---------------------------------------------------------------------------
for side in (1, -1):
    sx = side  # sign for left/right

    # Shoulder joint housing (at the shoulder attachment point)
    shoulder_jt = (
        cq.Workplane("YZ")
        .cylinder(JOINT_H, JOINT_R)
        .translate((sx * SHOULDER_X, 0, SHOULDER_Z))
    )
    parts.append(shoulder_jt.val())

    # Upper arm (cylinder along X, centered between shoulder and elbow)
    upper_arm_cx = sx * (SHOULDER_X + UPPER_ARM_L / 2.0)
    upper_arm = (
        cq.Workplane("YZ")
        .cylinder(UPPER_ARM_L, LIMB_R)
        .translate((upper_arm_cx, 0, SHOULDER_Z))
    )
    parts.append(upper_arm.val())

    # Elbow joint housing
    elbow_jt = (
        cq.Workplane("YZ")
        .cylinder(JOINT_H, JOINT_R)
        .translate((sx * ELBOW_X, 0, ELBOW_Z))
    )
    parts.append(elbow_jt.val())

    # Forearm (cylinder along X, centered between elbow and wrist)
    forearm_cx = sx * (ELBOW_X + FOREARM_L / 2.0)
    forearm = (
        cq.Workplane("YZ")
        .cylinder(FOREARM_L, LIMB_R)
        .translate((forearm_cx, 0, ELBOW_Z))
    )
    parts.append(forearm.val())

    # Wrist joint housing (small)
    wrist_jt = (
        cq.Workplane("YZ")
        .cylinder(JOINT_H * 0.7, JOINT_R * 0.85)
        .translate((sx * WRIST_X, 0, WRIST_Z))
    )
    parts.append(wrist_jt.val())

    # Hand (simplified box — offset outboard from wrist center)
    hand_cx = sx * (WRIST_X + HAND_L / 2.0 + JOINT_H * 0.35)
    hand = (
        cq.Workplane("XY")
        .box(HAND_L, HAND_W, HAND_D)
        .translate((hand_cx, 0, WRIST_Z))
    )
    parts.append(hand.val())

# ---------------------------------------------------------------------------
# Legs (bilateral)
# ---------------------------------------------------------------------------
for side in (1, -1):
    sx = side
    hx = sx * HIP_X

    # Hip joint housing
    hip_jt = (
        cq.Workplane("XY")
        .cylinder(JOINT_H, JOINT_R)
        .translate((hx, 0, HIP_Z))
    )
    parts.append(hip_jt.val())

    # Thigh (vertical cylinder, center between hip and knee)
    thigh_cz = (HIP_Z + KNEE_Z) / 2.0
    thigh = (
        cq.Workplane("XY")
        .cylinder(THIGH_L, LIMB_R * 1.15)
        .translate((hx, 0, thigh_cz))
    )
    parts.append(thigh.val())

    # Knee joint housing
    knee_jt = (
        cq.Workplane("XY")
        .cylinder(JOINT_H, JOINT_R)
        .translate((hx, 0, KNEE_Z))
    )
    parts.append(knee_jt.val())

    # Shin (vertical cylinder, center between knee and ankle)
    shin_cz = (KNEE_Z + ANKLE_Z) / 2.0
    shin = (
        cq.Workplane("XY")
        .cylinder(SHIN_L, LIMB_R)
        .translate((hx, 0, shin_cz))
    )
    parts.append(shin.val())

    # Ankle joint housing (small)
    ankle_jt = (
        cq.Workplane("XY")
        .cylinder(JOINT_H * 0.8, JOINT_R * 0.9)
        .translate((hx, 0, ANKLE_Z))
    )
    parts.append(ankle_jt.val())

    # Foot / boot — slightly forward of ankle centerline, floor-resting
    foot = (
        cq.Workplane("XY")
        .box(FOOT_W, FOOT_L, FOOT_H)
        .translate((hx, FOOT_FWD, FOOT_CZ))
    )
    parts.append(foot.val())

# ---------------------------------------------------------------------------
# Assemble into a compound and export
# ---------------------------------------------------------------------------
compound = cq.Compound.makeCompound(parts)
out_stl = "cad/output/humanoid.stl"
cq.exporters.export(compound, out_stl)

stl_size = os.path.getsize(out_stl)
print(f"Exported {out_stl}  ({stl_size / 1024:.1f} KB)")

# ---------------------------------------------------------------------------
# Quick geometry summary (no trimesh needed)
# ---------------------------------------------------------------------------
bb = compound.BoundingBox()
print(f"CadQuery bounding box (m): "
      f"X {bb.xmin:.3f}..{bb.xmax:.3f}  "
      f"Y {bb.ymin:.3f}..{bb.ymax:.3f}  "
      f"Z {bb.zmin:.3f}..{bb.zmax:.3f}")
print(f"  Width  (X): {bb.xmax - bb.xmin:.3f} m")
print(f"  Depth  (Y): {bb.ymax - bb.ymin:.3f} m")
print(f"  Height (Z): {bb.zmax - bb.zmin:.3f} m")
