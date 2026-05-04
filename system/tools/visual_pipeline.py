"""Visual output pipeline — STL → GLB → PNG renders → MP4 turntable.

Usage:
    python -m system.tools.visual_pipeline stl-to-glb --input F.stl --output F.glb
    python -m system.tools.visual_pipeline render --input F.glb --angles front,side,three-quarter,exploded --output-dir DIR
    python -m system.tools.visual_pipeline turntable --input F.glb --duration 15 --resolution 1080p --output F.mp4
    python -m system.tools.visual_pipeline run-all --study STUDY_ID [--db DB_PATH]

Requires: trimesh, pyglet or pyrender, cadquery (for CadQuery scripts)
Install: pip install trimesh pyrender imageio[ffmpeg]
"""

import argparse
import hashlib
import json
import os
import sys
from pathlib import Path

import yaml


def _require(module_name: str) -> None:
    try:
        __import__(module_name)
    except ImportError:
        print(f"error: {module_name} not installed — run: pip install {module_name}", file=sys.stderr)
        sys.exit(1)


def cmd_stl_to_glb(args: argparse.Namespace) -> None:
    """Convert STL mesh to GLB (binary glTF) for Looking Glass display."""
    _require("trimesh")
    import trimesh  # noqa: PLC0415

    mesh = trimesh.load(args.input)
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)

    # Export as glTF 2.0 binary
    mesh.export(str(out), file_type="glb")
    print(f"written: {out} ({out.stat().st_size:,} bytes)")


def cmd_render(args: argparse.Namespace) -> None:
    """Generate PNG renders at standard angles from a GLB file."""
    # TODO: implement with pyrender or similar when agent prompts are finalized
    # Angle definitions:
    #   front:         azimuth=0,   elevation=15
    #   side:          azimuth=90,  elevation=15
    #   three-quarter: azimuth=45,  elevation=30
    #   exploded:      azimuth=30,  elevation=45, components separated
    angles = args.angles.split(",")
    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"STUB: render {args.input} at angles {angles} → {out_dir}")
    print("      full implementation pending: requires pyrender + scene lighting setup")


def cmd_turntable(args: argparse.Namespace) -> None:
    """Produce a 1080p turntable video from a GLB file."""
    # TODO: implement with imageio[ffmpeg] when agent prompts are finalized
    # 15s @ 24fps = 360 frames, 1 degree/frame full rotation
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    print(f"STUB: turntable {args.input} → {out} ({args.duration}s, {args.resolution})")
    print("      full implementation pending: requires imageio[ffmpeg] + pyrender")


def cmd_run_all(args: argparse.Namespace) -> None:
    """Run the full pipeline for a study: CadQuery → STL → GLB → renders → turntable → manifest."""
    specs_path = Path(f"studies/active/{args.study}/visual_specs.yaml")
    if not specs_path.exists():
        print(f"error: visual_specs.yaml not found at {specs_path}", file=sys.stderr)
        sys.exit(1)

    with open(specs_path, encoding="utf-8") as fh:
        specs = yaml.safe_load(fh)

    concept = specs.get("primary_concept", {}).get("name", "concept")
    source_path = specs.get("output_paths", {}).get("source", f"visual/source/{concept}.py")
    stl_path = specs.get("output_paths", {}).get("stl", f"visual/output/{concept}.stl")
    glb_path = specs.get("output_paths", {}).get("glb", f"visual/output/{concept}.glb")
    renders_dir = specs.get("output_paths", {}).get("renders_dir", "visual/renders/")
    turntable_path = specs.get("output_paths", {}).get("turntable", f"visual/renders/turntable.mp4")

    # Step 1: run CadQuery source to produce STL
    if not Path(source_path).exists():
        print(f"error: CadQuery source not found at {source_path}", file=sys.stderr)
        sys.exit(1)
    ret = os.system(f"python {source_path}")
    if ret != 0:
        print("error: CadQuery script failed", file=sys.stderr)
        sys.exit(1)

    # Step 2: STL → GLB
    glb_args = argparse.Namespace(input=stl_path, output=glb_path)
    cmd_stl_to_glb(glb_args)

    # Step 3: renders
    render_args = argparse.Namespace(
        input=glb_path,
        angles="front,side,three-quarter,exploded",
        output_dir=renders_dir,
    )
    cmd_render(render_args)

    # Step 4: turntable
    turntable_args = argparse.Namespace(
        input=glb_path, duration=15, resolution="1080p", output=turntable_path
    )
    cmd_turntable(turntable_args)

    # Step 5: write manifest
    _write_manifest(specs, stl_path, glb_path, renders_dir, turntable_path)
    print(f"pipeline complete for study '{args.study}'")


def _sha256(path: str) -> str | None:
    p = Path(path)
    if not p.exists():
        return None
    h = hashlib.sha256(p.read_bytes()).hexdigest()
    return h


def _write_manifest(specs: dict, stl: str, glb: str, renders_dir: str, turntable: str) -> None:
    study_id = specs.get("study_id", "unknown")
    concept = specs.get("primary_concept", {}).get("name", "concept")
    tier = specs.get("primary_concept", {}).get("fidelity_tier", 1)
    manifest_path = Path(renders_dir).parent / "manifest.yaml"

    def _file_entry(path: str) -> dict:
        p = Path(path)
        entry: dict = {"path": path}
        if p.exists():
            entry["size_bytes"] = p.stat().st_size
            entry["checksum_sha256"] = _sha256(path)
        return entry

    manifest = {
        "study_id": study_id,
        "concept_name": concept,
        "fidelity_tier": tier,
        "generator": specs.get("output_paths", {}).get("source", ""),
        "artifacts": {
            "stl": _file_entry(stl),
            "glb": _file_entry(glb),
            "renders": {
                "front": _file_entry(os.path.join(renders_dir, "front.png")),
                "side": _file_entry(os.path.join(renders_dir, "side.png")),
                "three_quarter": _file_entry(os.path.join(renders_dir, "three-quarter.png")),
                "exploded": _file_entry(os.path.join(renders_dir, "exploded.png")),
            },
            "turntable": _file_entry(turntable),
        },
    }
    with open(manifest_path, "w", encoding="utf-8") as fh:
        yaml.dump(manifest, fh, default_flow_style=False, allow_unicode=True)
    print(f"written: {manifest_path}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="visual_pipeline",
        description="Visual output pipeline: CadQuery → STL → GLB → renders → turntable",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_glb = sub.add_parser("stl-to-glb", help="Convert STL to GLB")
    p_glb.add_argument("--input", required=True)
    p_glb.add_argument("--output", required=True)

    p_render = sub.add_parser("render", help="Generate PNG renders at standard angles")
    p_render.add_argument("--input", required=True)
    p_render.add_argument("--angles", default="front,side,three-quarter,exploded")
    p_render.add_argument("--output-dir", required=True)

    p_tt = sub.add_parser("turntable", help="Produce turntable MP4")
    p_tt.add_argument("--input", required=True)
    p_tt.add_argument("--duration", type=int, default=15)
    p_tt.add_argument("--resolution", default="1080p")
    p_tt.add_argument("--output", required=True)

    p_all = sub.add_parser("run-all", help="Run full pipeline for a study")
    p_all.add_argument("--study", required=True)
    p_all.add_argument("--db", default=None)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    dispatch = {
        "stl-to-glb": cmd_stl_to_glb,
        "render": cmd_render,
        "turntable": cmd_turntable,
        "run-all": cmd_run_all,
    }
    dispatch[args.command](args)


if __name__ == "__main__":
    main()
