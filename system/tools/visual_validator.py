"""Visual output validator — pre-handback gates for visual artifacts.

Usage:
    python -m system.tools.visual_validator --study STUDY_ID [--db DB_PATH]
    python -m system.tools.visual_validator --manifest PATH/manifest.yaml [--specs PATH/visual_specs.yaml]

Gates:
    1. Manifest exists and validates against visual_artifacts.schema.yaml
    2. GLB loads without error (trimesh)
    3. STL bounding box within spec height range (from visual_specs.yaml)
    4. Polygon count within budget (Tier 1: ≤100k, Tier 2: ≤500k, Tier 3: ≤2M)
    5. File sizes under caps (STL ≤50 MB, GLB ≤20 MB)
    6. All required PNG renders present
    7. Turntable present (warning only if absent — Tier 1 exemption)

Exit code 0 = all gates pass. Non-zero = at least one Blocker found.
"""

import argparse
import os
import sys
from pathlib import Path

import yaml

_SCHEMA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "orchestration", "schemas", "visual_artifacts.schema.yaml",
)

_POLYGON_CAPS = {1: 100_000, 2: 500_000, 3: 2_000_000}
_STL_SIZE_CAP = 50 * 1024 * 1024  # 50 MB
_GLB_SIZE_CAP = 20 * 1024 * 1024  # 20 MB

_REQUIRED_RENDERS = ["front.png", "side.png", "three-quarter.png", "exploded.png"]


class Finding:
    def __init__(self, severity: str, code: str, message: str, fix: str = ""):
        self.severity = severity  # Blocker, Major, Minor
        self.code = code
        self.message = message
        self.fix = fix

    def __str__(self) -> str:
        s = f"[{self.severity}] {self.code}: {self.message}"
        if self.fix:
            s += f"\n  Fix: {self.fix}"
        return s


def validate(manifest_path: str, specs_path: str | None = None) -> list[Finding]:
    findings: list[Finding] = []

    # Gate 1: manifest exists and parses
    if not Path(manifest_path).exists():
        return [Finding("Blocker", "VV-001", f"Manifest not found: {manifest_path}",
                        "Run visual_pipeline.py run-all to generate")]

    with open(manifest_path, encoding="utf-8") as fh:
        manifest = yaml.safe_load(fh)

    # Gate 1b: schema validation
    try:
        import jsonschema  # noqa: PLC0415
        with open(_SCHEMA_PATH, encoding="utf-8") as fh:
            schema = yaml.safe_load(fh)
        jsonschema.validate(manifest, schema)
    except ImportError:
        findings.append(Finding("Minor", "VV-002",
                                "jsonschema not installed — schema validation skipped",
                                "pip install jsonschema"))
    except Exception as e:  # noqa: BLE001
        findings.append(Finding("Blocker", "VV-003", f"Manifest schema invalid: {e}",
                                "Fix manifest structure per visual_artifacts.schema.yaml"))

    tier = manifest.get("fidelity_tier", 1)
    artifacts = manifest.get("artifacts", {})

    # Gate 2: GLB loads
    glb_path = artifacts.get("glb", {}).get("path", "")
    if glb_path and Path(glb_path).exists():
        try:
            import trimesh  # noqa: PLC0415
            mesh = trimesh.load(glb_path)
            poly_count = len(mesh.faces) if hasattr(mesh, "faces") else 0
            cap = _POLYGON_CAPS.get(tier, _POLYGON_CAPS[2])
            if poly_count > cap:
                findings.append(Finding(
                    "Major", "VV-004",
                    f"Polygon count {poly_count:,} exceeds Tier {tier} cap {cap:,}",
                    "Simplify mesh in CadQuery source or reduce surface detail"))
        except ImportError:
            findings.append(Finding("Minor", "VV-005",
                                    "trimesh not installed — GLB load check skipped",
                                    "pip install trimesh"))
        except Exception as e:  # noqa: BLE001
            findings.append(Finding("Blocker", "VV-006", f"GLB load failed: {e}",
                                    "Regenerate GLB via visual_pipeline.py stl-to-glb"))
    elif glb_path:
        findings.append(Finding("Blocker", "VV-007", f"GLB file missing: {glb_path}",
                                "Run visual_pipeline.py stl-to-glb"))

    # Gate 3: STL bounding box vs. spec height
    if specs_path and Path(specs_path).exists():
        with open(specs_path, encoding="utf-8") as fh:
            specs = yaml.safe_load(fh)
        expected_h = specs.get("geometry", {}).get("overall_height_m")
        stl_path = artifacts.get("stl", {}).get("path", "")
        if expected_h and stl_path and Path(stl_path).exists():
            try:
                import trimesh  # noqa: PLC0415
                mesh = trimesh.load(stl_path)
                bbox = mesh.bounding_box.extents
                actual_h = max(bbox)
                # Allow ±15% tolerance
                if abs(actual_h - expected_h) / expected_h > 0.15:
                    findings.append(Finding(
                        "Blocker", "VV-008",
                        f"STL height {actual_h:.2f} m deviates >15% from spec {expected_h} m",
                        "Adjust scale in CadQuery source to match spec height"))
            except ImportError:
                pass  # already flagged above

    # Gate 4: file sizes
    stl_info = artifacts.get("stl", {})
    stl_size = stl_info.get("size_bytes") or (
        Path(stl_info.get("path", "")).stat().st_size
        if stl_info.get("path") and Path(stl_info.get("path", "")).exists() else 0
    )
    if stl_size > _STL_SIZE_CAP:
        findings.append(Finding("Major", "VV-009",
                                f"STL size {stl_size / 1e6:.1f} MB exceeds 50 MB cap",
                                "Reduce mesh resolution in CadQuery source"))

    glb_info = artifacts.get("glb", {})
    glb_size = glb_info.get("size_bytes") or (
        Path(glb_info.get("path", "")).stat().st_size
        if glb_info.get("path") and Path(glb_info.get("path", "")).exists() else 0
    )
    if glb_size > _GLB_SIZE_CAP:
        findings.append(Finding("Major", "VV-010",
                                f"GLB size {glb_size / 1e6:.1f} MB exceeds 20 MB cap",
                                "Reduce mesh resolution or compress textures"))

    # Gate 5: required renders
    renders = artifacts.get("renders", {})
    renders_dir = ""
    if renders:
        for render_name in ["front", "side", "three_quarter", "exploded"]:
            rpath = renders.get(render_name, {}).get("path", "")
            if not rpath or not Path(rpath).exists():
                findings.append(Finding("Blocker", "VV-011",
                                        f"Required render missing: {render_name}",
                                        "Run visual_pipeline.py render"))

    # Gate 6: turntable (warning for Tier 1, Blocker for Tier 2+)
    tt = artifacts.get("turntable", {})
    tt_path = tt.get("path", "")
    if not tt_path or not Path(tt_path).exists():
        sev = "Minor" if tier == 1 else "Blocker"
        findings.append(Finding(sev, "VV-012",
                                f"Turntable MP4 missing (Tier {tier})",
                                "Run visual_pipeline.py turntable"))

    return findings


def main() -> None:
    parser = argparse.ArgumentParser(description="Visual output validator")
    parser.add_argument("--study", default=None, help="Study ID (looks up paths from visual_specs.yaml)")
    parser.add_argument("--manifest", default=None, help="Direct path to manifest.yaml")
    parser.add_argument("--specs", default=None, help="Direct path to visual_specs.yaml")
    args = parser.parse_args()

    if args.study:
        specs_path = f"studies/active/{args.study}/visual_specs.yaml"
        manifest_path = f"studies/active/{args.study}/visual/manifest.yaml"
    elif args.manifest:
        manifest_path = args.manifest
        specs_path = args.specs
    else:
        parser.error("provide either --study or --manifest")

    findings = validate(manifest_path, specs_path)

    if not findings:
        print("OK: all visual output gates pass")
        sys.exit(0)

    blockers = [f for f in findings if f.severity == "Blocker"]
    for f in findings:
        print(f)
    print(f"\n{len(findings)} finding(s): {len(blockers)} Blocker(s)")
    sys.exit(1 if blockers else 0)


if __name__ == "__main__":
    main()
