# Aesthetic Direction — Orbital Platform Domain

## Reference heritage

- ISS modules (Boeing/Thales/RSC Energia): white/gold thermal blankets, anodized aluminum, visible thermal straps
- Cygnus PCM: cylindrical white with solar panel extensions, MLI blanket coverage on non-panel surfaces
- Canadarm2: white structural members, gold MLI at joint interfaces
- Tiangong modules: white panels, gold solar arrays, visible berthing interfaces

## Material palette

| Surface | Material call | Notes |
|---------|--------------|-------|
| Primary structural panels | White, low-gloss | Consistent with ISS thermal control convention |
| MLI blanket coverage | Gold/silver crinkled texture | On non-panel surfaces — joints, transitions |
| Solar array surfaces | Deep blue (if applicable to concept) | If concept has power generation surfaces |
| Berthing/docking interfaces | Anodized aluminum, medium grey | Hard interfaces visible as distinct material |
| Radiator panels | White, distinct texture from structure | May be articulated in geometry if concept requires |
| Thruster nozzles | Metallic grey | If concept includes propulsion |

## Paneling logic

- MLI blanket boundaries follow thermal zone definitions from visual_specs.yaml
- Structural panels are larger than lunar-surface (less EVA-glove constraint)
- Handrail locations must be visible — handrails are first-class geometric features for orbital humanoid concepts
- Access panel indicators: different surface texture, not raised edges

## Weathering convention

Tier 2: minimal — orbital environment does not produce dust or corrosion. Slight tonal variation from solar UV exposure acceptable.
Tier 3: MMOD pitting on exposed surfaces (subtle texture variation), slight yellowing on white panels from atomic oxygen.

## Note on zero-g geometry

If the concept is intended for zero-g operation, geometry should not imply a "standing" posture. Neutral position is a slight crouch with all joints near mid-range. Handrail grasp end-effectors should be visible and in a pre-grasp configuration.
