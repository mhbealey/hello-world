# Aesthetic Direction — Lunar Surface Domain

## Reference heritage

- NASA Apollo EVA suit (ILC Dover A7L/A7LB): white primary, grey accents, visible joint bellows
- Robonaut 2 (NASA/GM): white panels, gold visor, visible cable routing
- Valkyrie R5: white structural panels, grey joints, blue accent lighting on sensors
- ExoMars Rover: white/grey with instrument protrusions, minimal weathering shown

## Material palette

| Surface | Material call | Notes |
|---------|--------------|-------|
| Primary structural panels | White, matte, ε ≈ 0.85 | High emissivity for thermal control |
| Joint housings | Medium grey, slightly specular | Indicates metal, not polymer |
| Thermal radiator panels | White/silver, distinct from structure panels | Must be visually distinguishable |
| Sensor apertures | Neutral grey, slightly recessed | Show protective cover in closed position |
| Foot/boot assembly | Dusty white-grey | Weathering appropriate — lunar regolith accumulation |
| Harness/cable routing | Not visible at Tier 2 | Abstract away at concept-art fidelity |

## Paneling logic

- Panels follow subsystem boundaries: torso/electronics bay panels distinct from structural frame
- Access panels indicated by slight surface offsets (0.5–1 mm) and visible fastener rows
- Radiator panel locations consistent with visual_specs.yaml surface_area values
- Panel seams run horizontally on limbs (consistent with EVA suit design heritage)
- Avoid organic curves — aerospace fabrication convention is flat panels with defined break lines

## Weathering convention

Tier 2: light dust accumulation on horizontal surfaces (feet, shoulders, top of head). No corrosion — vacuum environment.
Tier 3: deeper regolith accumulation, slight UV-yellowing on white panels, scuff marks on boot soles. For hero renders only.

## Sensor visibility

Cameras: small dark apertures with protective cover rings — visible but not dominant.
LIDAR: small dome or array on head — must be geometrically distinct from cameras.
IMUs: internal — not visible on surface.

## Decals and typography

Tier 2: unit designation (e.g., "HMD-01") on torso panel, simple stencil font, grey-on-white.
Tier 3: program logo, mission patches per creative direction from Joy. Defer to Chief Creative.
