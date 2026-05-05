"""Validate every YAML file in the repo against its corresponding schema.

Schema mapping (by path pattern):
  */cross_coupling.yaml              → schemas/cross_coupling.schema.yaml
  */assumption_registry.yaml         → schemas/assumption_registry.schema.yaml
  */visual/manifest.yaml             → schemas/visual_artifacts.schema.yaml
  */findings/*.yaml                  → schemas/finding.schema.yaml
  system/orchestration/schemas/*.schema.yaml → self-referential (skipped)

Usage:
    python system/tools/validate_all_yaml.py [--root PATH] [--quiet]
    python -m system.tools.validate_all_yaml

Exit code 0 = all valid. Nonzero = at least one invalid file.
"""

import argparse
import os
import sys
from pathlib import Path

import yaml

_SCHEMAS_DIR = Path(__file__).parent.parent / "orchestration" / "schemas"

_SCHEMA_MAP: dict[str, str] = {
    "cross_coupling.yaml": "cross_coupling.schema.yaml",
    "assumption_registry.yaml": "assumption_registry.schema.yaml",
    "manifest.yaml": "visual_artifacts.schema.yaml",
    "session-logs.yaml": "session_log.schema.yaml",
}

_STEM_MAP: dict[str, str] = {
    "cross_coupling": "cross_coupling.schema.yaml",
    "assumption_registry": "assumption_registry.schema.yaml",
    "handback": "handback.schema.yaml",
}


def _load_schema(schema_name: str) -> dict | None:
    path = _SCHEMAS_DIR / schema_name
    if not path.exists():
        return None
    with open(path, encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def _find_schema(yaml_path: Path) -> tuple[str | None, dict | None]:
    name = yaml_path.name
    if name in _SCHEMA_MAP:
        schema_name = _SCHEMA_MAP[name]
        return schema_name, _load_schema(schema_name)

    stem = yaml_path.stem
    if stem in _STEM_MAP:
        schema_name = _STEM_MAP[stem]
        return schema_name, _load_schema(schema_name)

    # findings/*.yaml — any YAML file whose immediate parent directory is "findings"
    if yaml_path.parent.name == "findings":
        return "finding.schema.yaml", _load_schema("finding.schema.yaml")

    # Check if parent directory name gives a hint
    if "handback" in str(yaml_path):
        return "handback.schema.yaml", _load_schema("handback.schema.yaml")

    return None, None


def validate_file(yaml_path: Path, quiet: bool = False) -> list[str]:
    """Return list of error strings (empty = valid)."""
    try:
        import jsonschema  # noqa: PLC0415
    except ImportError:
        return ["jsonschema not installed — run: pip install jsonschema"]

    schema_name, schema = _find_schema(yaml_path)
    if schema is None:
        return []  # No schema for this file — skip silently

    try:
        with open(yaml_path, encoding="utf-8") as fh:
            data = yaml.safe_load(fh)
    except yaml.YAMLError as e:
        return [f"YAML parse error: {e}"]

    if data is None:
        return []  # Empty file — skip

    errors = []
    try:
        jsonschema.validate(data, schema)
        if not quiet:
            print(f"OK  {yaml_path}  [{schema_name}]")
    except jsonschema.ValidationError as e:
        errors.append(f"INVALID {yaml_path}: {e.message}")
    except jsonschema.SchemaError as e:
        errors.append(f"BAD SCHEMA {schema_name}: {e.message}")

    return errors


def find_yaml_files(root: Path) -> list[Path]:
    excludes = {".git", "node_modules", "__pycache__", ".pytest_cache"}
    results = []
    for p in root.rglob("*.yaml"):
        if any(ex in p.parts for ex in excludes):
            continue
        # Skip schema files themselves
        if p.parent.name == "schemas" and p.name.endswith(".schema.yaml"):
            continue
        results.append(p)
    return sorted(results)


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate YAML files against schemas")
    parser.add_argument("--root", default=".", help="Repo root (default: .)")
    parser.add_argument("--quiet", action="store_true", help="Only print errors")
    args = parser.parse_args()

    root = Path(args.root)
    files = find_yaml_files(root)
    all_errors: list[str] = []

    for f in files:
        errors = validate_file(f, quiet=args.quiet)
        all_errors.extend(errors)

    if all_errors:
        for e in all_errors:
            print(e, file=sys.stderr)
        print(f"\n{len(all_errors)} validation error(s)", file=sys.stderr)
        sys.exit(1)
    else:
        checked = sum(1 for f in files if _find_schema(f)[0] is not None)
        print(f"All {checked} schema-mapped YAML files valid ({len(files)} total scanned)")
        sys.exit(0)


if __name__ == "__main__":
    main()
