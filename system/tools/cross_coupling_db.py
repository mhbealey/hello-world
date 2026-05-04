"""Cross-coupling parameter database — query interface for agents.

Usage:
    python -m system.tools.cross_coupling_db get <param_id> [--db PATH] [--field FIELD]
    python -m system.tools.cross_coupling_db list [--db PATH]
    python -m system.tools.cross_coupling_db show <param_id> [--db PATH]
    python -m system.tools.cross_coupling_db validate [--db PATH]

Default DB path: $CROSS_COUPLING_DB env var, or ./cross_coupling.yaml
"""

import argparse
import os
import sys

import yaml

_DB_ENV = "CROSS_COUPLING_DB"
_DB_DEFAULT = "cross_coupling.yaml"
_SCHEMA_REL = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "orchestration", "schemas", "cross_coupling.schema.yaml",
)


def load(db_path: str) -> dict:
    with open(db_path, encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def find_entry(data: dict, param_id: str) -> dict | None:
    for entry in data.get("entries", []):
        if entry["param_id"] == param_id:
            return entry
    return None


def resolve_db(path_arg: str | None) -> str:
    if path_arg:
        return path_arg
    return os.environ.get(_DB_ENV, _DB_DEFAULT)


def cmd_get(args: argparse.Namespace) -> None:
    data = load(args.db)
    entry = find_entry(data, args.param_id)
    if entry is None:
        print(f"error: param_id '{args.param_id}' not found", file=sys.stderr)
        sys.exit(1)
    field = args.field
    if field not in entry:
        print(f"error: field '{field}' not present in entry", file=sys.stderr)
        sys.exit(1)
    val = entry[field]
    if isinstance(val, list):
        print("\n".join(str(v) for v in val))
    else:
        print(val)


def cmd_list(args: argparse.Namespace) -> None:
    data = load(args.db)
    for entry in data.get("entries", []):
        print(f"{entry['param_id']:<45} {entry['parameter']}")


def cmd_show(args: argparse.Namespace) -> None:
    data = load(args.db)
    entry = find_entry(data, args.param_id)
    if entry is None:
        print(f"error: param_id '{args.param_id}' not found", file=sys.stderr)
        sys.exit(1)
    print(yaml.dump(entry, default_flow_style=False, allow_unicode=True), end="")


def cmd_validate(args: argparse.Namespace) -> None:
    try:
        import jsonschema
    except ImportError:
        print("error: jsonschema not installed — run: pip install jsonschema", file=sys.stderr)
        sys.exit(1)
    with open(_SCHEMA_REL, encoding="utf-8") as fh:
        schema = yaml.safe_load(fh)
    data = load(args.db)
    try:
        jsonschema.validate(data, schema)
        print(f"OK: {args.db} validates against schema")
    except jsonschema.ValidationError as e:
        print(f"INVALID: {e.message}", file=sys.stderr)
        sys.exit(1)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="cross_coupling_db",
        description="Cross-coupling parameter database query tool",
    )
    parser.add_argument(
        "--db",
        default=None,
        metavar="PATH",
        help=f"Path to cross_coupling.yaml (default: ${_DB_ENV} or {_DB_DEFAULT})",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_get = sub.add_parser("get", help="Print a single field of a parameter (default: value)")
    p_get.add_argument("param_id")
    p_get.add_argument("--field", default="value", metavar="FIELD",
                       help="Field to return: value, basis, set_by, affects, notes (default: value)")

    sub.add_parser("list", help="List all param_ids with their names")

    p_show = sub.add_parser("show", help="Dump a full entry as YAML")
    p_show.add_argument("param_id")

    sub.add_parser("validate", help="Validate DB file against the JSON Schema")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.db = resolve_db(args.db)

    dispatch = {
        "get": cmd_get,
        "list": cmd_list,
        "show": cmd_show,
        "validate": cmd_validate,
    }
    dispatch[args.command](args)


if __name__ == "__main__":
    main()
