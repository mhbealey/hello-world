"""Cross-coupling parameter database — query interface for agents.

Usage:
    python -m system.tools.cross_coupling_db get <param_id> [--db PATH] [--field FIELD]
    python -m system.tools.cross_coupling_db list [--db PATH]
    python -m system.tools.cross_coupling_db show <param_id> [--db PATH]
    python -m system.tools.cross_coupling_db set <param_id> <value> --set-by AGENT --basis BASIS [--lock] [--affects A B ...]
    python -m system.tools.cross_coupling_db lock <param_id> [--db PATH]
    python -m system.tools.cross_coupling_db supersede <old_param_id> <new_param_id> [--db PATH]
    python -m system.tools.cross_coupling_db list-locked [--db PATH]
    python -m system.tools.cross_coupling_db list-affecting <param_id> [--db PATH]
    python -m system.tools.cross_coupling_db validate [--db PATH]

Default DB path: $CROSS_COUPLING_DB env var, or ./cross_coupling.yaml
"""

import argparse
import os
import sys
import tempfile
from contextlib import contextmanager
from datetime import date
from pathlib import Path

import yaml

_DB_ENV = "CROSS_COUPLING_DB"
_DB_DEFAULT = "cross_coupling.yaml"
_SCHEMA_REL = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "orchestration", "schemas", "cross_coupling.schema.yaml",
)


class LockedDecisionError(Exception):
    """Raised when attempting to modify a locked cross-coupling entry."""


def load(db_path: str) -> dict:
    with open(db_path, encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}


def _save_atomic(db_path: str, data: dict) -> None:
    """Write YAML atomically via temp file + rename to avoid partial writes."""
    data["last_updated"] = str(date.today())
    p = Path(db_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(dir=p.parent, suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            yaml.dump(data, fh, default_flow_style=False, allow_unicode=True, sort_keys=False)
        os.replace(tmp_path, db_path)
    except Exception:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
        raise


def find_entry(data: dict, param_id: str) -> dict | None:
    for entry in data.get("entries", []):
        if entry["param_id"] == param_id:
            return entry
    return None


def resolve_db(path_arg: str | None) -> str:
    if path_arg:
        return path_arg
    return os.environ.get(_DB_ENV, _DB_DEFAULT)


def lock(db_path: str, param_id: str) -> None:
    """Lock a parameter so it cannot be overwritten without force=True."""
    data = load(db_path)
    entry = find_entry(data, param_id)
    if entry is None:
        print(f"error: param_id '{param_id}' not found", file=sys.stderr)
        sys.exit(1)
    entry["locked"] = True
    entry["locked_date"] = str(date.today())
    _save_atomic(db_path, data)
    print(f"locked: {param_id}")


def supersede(db_path: str, old_param_id: str, new_param_id: str) -> None:
    """Mark old_param_id as superseded by new_param_id."""
    data = load(db_path)
    old = find_entry(data, old_param_id)
    if old is None:
        print(f"error: param_id '{old_param_id}' not found", file=sys.stderr)
        sys.exit(1)
    new = find_entry(data, new_param_id)
    if new is None:
        print(f"error: new param_id '{new_param_id}' not found", file=sys.stderr)
        sys.exit(1)
    old["superseded_by"] = new_param_id
    old["locked"] = False  # unlock old so it's clearly retired
    _save_atomic(db_path, data)
    print(f"superseded: {old_param_id} → {new_param_id}")


def list_locked(db_path: str) -> list[dict]:
    """Return all locked entries."""
    data = load(db_path)
    return [e for e in data.get("entries", []) if e.get("locked")]


def list_affecting(db_path: str, param_id: str) -> list[dict]:
    """Return all entries that list param_id in their 'affects' field."""
    data = load(db_path)
    result = []
    for entry in data.get("entries", []):
        if param_id in (entry.get("affects") or []):
            result.append(entry)
    return result


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
        locked_flag = " [LOCKED]" if entry.get("locked") else ""
        superseded = f" [superseded→{entry['superseded_by']}]" if entry.get("superseded_by") else ""
        print(f"{entry['param_id']:<45} {entry['parameter']}{locked_flag}{superseded}")


def cmd_show(args: argparse.Namespace) -> None:
    data = load(args.db)
    entry = find_entry(data, args.param_id)
    if entry is None:
        print(f"error: param_id '{args.param_id}' not found", file=sys.stderr)
        sys.exit(1)
    print(yaml.dump(entry, default_flow_style=False, allow_unicode=True), end="")


def cmd_set(args: argparse.Namespace) -> None:
    """Add or update a cross-coupling entry. Raises if entry is locked (unless --force)."""
    if not Path(args.db).exists():
        data: dict = {"study_id": "unknown", "last_updated": str(date.today()), "entries": []}
    else:
        data = load(args.db)

    existing = find_entry(data, args.param_id)
    if existing is not None:
        if existing.get("locked") and not args.force:
            raise LockedDecisionError(
                f"param_id '{args.param_id}' is locked. Use --force to override (and document the reason)."
            )
        existing["value"] = args.value
        existing["set_by"] = args.set_by
        existing["basis"] = args.basis
        existing["date_set"] = str(date.today())
        if args.affects:
            existing["affects"] = args.affects
        if args.lock:
            existing["locked"] = True
            existing["locked_date"] = str(date.today())
    else:
        entry = {
            "param_id": args.param_id,
            "parameter": args.param_id.replace("_", " "),
            "value": args.value,
            "set_by": args.set_by,
            "basis": args.basis,
            "date_set": str(date.today()),
            "affects": args.affects or [],
            "locked": args.lock,
            "locked_date": str(date.today()) if args.lock else None,
            "superseded_by": None,
        }
        data.setdefault("entries", []).append(entry)

    _save_atomic(args.db, data)
    lock_note = " [LOCKED]" if args.lock else ""
    print(f"set: {args.param_id} = {args.value}{lock_note}")


def cmd_lock(args: argparse.Namespace) -> None:
    lock(args.db, args.param_id)


def cmd_supersede(args: argparse.Namespace) -> None:
    supersede(args.db, args.old_param_id, args.new_param_id)


def cmd_list_locked(args: argparse.Namespace) -> None:
    entries = list_locked(args.db)
    if not entries:
        print("(no locked entries)")
        return
    for e in entries:
        print(f"{e['param_id']:<45} = {e['value']}  [locked {e.get('locked_date', '?')}]")


def cmd_list_affecting(args: argparse.Namespace) -> None:
    entries = list_affecting(args.db, args.param_id)
    if not entries:
        print(f"(no entries affect '{args.param_id}')")
        return
    for e in entries:
        print(f"{e['param_id']:<45} {e['parameter']}")


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

    p_set = sub.add_parser("set", help="Add or update a parameter entry")
    p_set.add_argument("param_id")
    p_set.add_argument("value")
    p_set.add_argument("--set-by", required=True, metavar="AGENT")
    p_set.add_argument("--basis", required=True)
    p_set.add_argument("--affects", nargs="*", default=None, metavar="PARAM_ID")
    p_set.add_argument("--lock", action="store_true", help="Lock immediately after setting")
    p_set.add_argument("--force", action="store_true", help="Override locked entry")

    p_lock = sub.add_parser("lock", help="Lock a parameter (prevent modification)")
    p_lock.add_argument("param_id")

    p_sup = sub.add_parser("supersede", help="Mark a parameter as superseded by a new one")
    p_sup.add_argument("old_param_id")
    p_sup.add_argument("new_param_id")

    sub.add_parser("list-locked", help="List all locked parameters")

    p_la = sub.add_parser("list-affecting", help="List parameters that affect a given param_id")
    p_la.add_argument("param_id")

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
        "set": cmd_set,
        "lock": cmd_lock,
        "supersede": cmd_supersede,
        "list-locked": cmd_list_locked,
        "list-affecting": cmd_list_affecting,
        "validate": cmd_validate,
    }
    dispatch[args.command](args)


if __name__ == "__main__":
    main()
