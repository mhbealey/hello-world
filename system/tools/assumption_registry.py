"""Assumption registry service — per-study §A<N> numbered assumption store.

Usage:
    python -m system.tools.assumption_registry add   --db PATH --name NAME --statement STMT --basis BASIS --risk LEVEL --owner AGENT [--gate GATE] [--cc-param PARAM_ID]
    python -m system.tools.assumption_registry list  --db PATH [--risk high|critical] [--status active]
    python -m system.tools.assumption_registry get   --db PATH A1
    python -m system.tools.assumption_registry next-id --db PATH
    python -m system.tools.assumption_registry validate --db PATH
    python -m system.tools.assumption_registry set-status --db PATH A1 revised

Default DB: $ASSUMPTION_REGISTRY_DB or ./assumption_registry.yaml

ID allocation uses file-level locking (fcntl.flock) to prevent races when
multiple agents run concurrently on the same study.
"""

import argparse
import fcntl
import os
import sys
from contextlib import contextmanager
from datetime import date
from pathlib import Path

import yaml

_DB_ENV = "ASSUMPTION_REGISTRY_DB"
_DB_DEFAULT = "assumption_registry.yaml"
_SCHEMA_REL = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "orchestration", "schemas", "assumption_registry.schema.yaml",
)

_EMPTY_DB_TEMPLATE = {
    "study_id": "unknown",
    "last_updated": str(date.today()),
    "next_id": 1,
    "entries": [],
}


def resolve_db(path_arg: str | None) -> str:
    if path_arg:
        return path_arg
    return os.environ.get(_DB_ENV, _DB_DEFAULT)


@contextmanager
def _locked_open(path: str, mode: str = "r+"):
    """Open a file with an exclusive flock for safe concurrent access."""
    p = Path(path)
    if mode in ("w", "w+") or not p.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
        p.touch()
    with open(path, mode, encoding="utf-8") as fh:
        fcntl.flock(fh, fcntl.LOCK_EX)
        try:
            yield fh
        finally:
            fcntl.flock(fh, fcntl.LOCK_UN)


def load(db_path: str) -> dict:
    if not Path(db_path).exists():
        print(f"error: registry not found: {db_path}", file=sys.stderr)
        print(f"       create one with: python -m system.tools.assumption_registry init --db {db_path}", file=sys.stderr)
        sys.exit(1)
    with open(db_path, encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}


def _save(db_path: str, data: dict) -> None:
    data["last_updated"] = str(date.today())
    with open(db_path, "w", encoding="utf-8") as fh:
        yaml.dump(data, fh, default_flow_style=False, allow_unicode=True, sort_keys=False)


def find_entry(data: dict, entry_id: str) -> dict | None:
    for e in data.get("entries", []):
        if e["id"] == entry_id:
            return e
    return None


def cmd_init(args: argparse.Namespace) -> None:
    if Path(args.db).exists():
        print(f"error: {args.db} already exists", file=sys.stderr)
        sys.exit(1)
    tmpl = dict(_EMPTY_DB_TEMPLATE)
    tmpl["study_id"] = args.study_id or Path(args.db).parent.name
    _save(args.db, tmpl)
    print(f"created: {args.db}")


def cmd_add(args: argparse.Namespace) -> None:
    with _locked_open(args.db, "r+") as fh:
        fh.seek(0)
        data = yaml.safe_load(fh) or {}

        next_n = data.get("next_id", 1)
        entry_id = f"A{next_n}"

        entry: dict = {
            "id": entry_id,
            "short_name": args.name,
            "statement": args.statement,
            "basis": args.basis,
            "risk_level": args.risk,
            "owner_agent": args.owner,
            "date_added": str(date.today()),
            "last_reviewed": None,
            "status": "active",
            "go_no_go_gate": args.gate,
            "superseded_by": None,
            "cross_coupling_param": args.cc_param,
        }

        data.setdefault("entries", []).append(entry)
        data["next_id"] = next_n + 1
        data["last_updated"] = str(date.today())

        fh.seek(0)
        fh.truncate()
        yaml.dump(data, fh, default_flow_style=False, allow_unicode=True, sort_keys=False)

    print(f"added: §{entry_id}  {args.name}")


def cmd_list(args: argparse.Namespace) -> None:
    data = load(args.db)
    entries = data.get("entries", [])
    if args.risk:
        entries = [e for e in entries if e["risk_level"] == args.risk]
    if args.status:
        entries = [e for e in entries if e["status"] == args.status]
    if not entries:
        print("(no entries matching filters)")
        return
    for e in entries:
        gate = f"  [gate: {e['go_no_go_gate']}]" if e.get("go_no_go_gate") else ""
        print(f"§{e['id']:<5} [{e['risk_level']:<8}] {e['short_name']}{gate}")
        print(f"       {e['statement'][:100]}{'...' if len(e['statement']) > 100 else ''}")


def cmd_get(args: argparse.Namespace) -> None:
    data = load(args.db)
    entry = find_entry(data, args.id)
    if entry is None:
        print(f"error: §{args.id} not found", file=sys.stderr)
        sys.exit(1)
    print(yaml.dump(entry, default_flow_style=False, allow_unicode=True), end="")


def cmd_next_id(args: argparse.Namespace) -> None:
    data = load(args.db)
    print(f"A{data.get('next_id', 1)}")


def cmd_set_status(args: argparse.Namespace) -> None:
    valid_statuses = ("active", "revised", "superseded")
    if args.new_status not in valid_statuses:
        print(f"error: status must be one of {valid_statuses}", file=sys.stderr)
        sys.exit(1)

    with _locked_open(args.db, "r+") as fh:
        fh.seek(0)
        data = yaml.safe_load(fh) or {}
        entry = find_entry(data, args.id)
        if entry is None:
            print(f"error: §{args.id} not found", file=sys.stderr)
            sys.exit(1)
        entry["status"] = args.new_status
        data["last_updated"] = str(date.today())
        fh.seek(0)
        fh.truncate()
        yaml.dump(data, fh, default_flow_style=False, allow_unicode=True, sort_keys=False)
    print(f"§{args.id} status → {args.new_status}")


def cmd_validate(args: argparse.Namespace) -> None:
    try:
        import jsonschema  # noqa: PLC0415
    except ImportError:
        print("error: jsonschema not installed — run: pip install jsonschema", file=sys.stderr)
        sys.exit(1)
    with open(_SCHEMA_REL, encoding="utf-8") as fh:
        schema = yaml.safe_load(fh)
    data = load(args.db)
    try:
        jsonschema.validate(data, schema)
    except jsonschema.ValidationError as e:
        print(f"INVALID: {e.message}", file=sys.stderr)
        sys.exit(1)

    # Check next_id consistency
    entries = data.get("entries", [])
    if entries:
        max_n = max(int(e["id"][1:]) for e in entries)
        if data.get("next_id", 1) <= max_n:
            print(f"WARNING: next_id {data['next_id']} ≤ max existing ID A{max_n} — possible corruption")
    print(f"OK: {args.db} validates ({len(entries)} entries, next §A{data.get('next_id', 1)})")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="assumption_registry",
        description="Assumption registry — per-study §A<N> numbered assumption store",
    )
    parser.add_argument("--db", default=None, metavar="PATH",
                        help=f"Path to assumption_registry.yaml (default: ${_DB_ENV} or {_DB_DEFAULT})")
    sub = parser.add_subparsers(dest="command", required=True)

    p_init = sub.add_parser("init", help="Create a new empty registry")
    p_init.add_argument("--study-id", default=None)

    p_add = sub.add_parser("add", help="Add a new assumption (auto-assigns §A<N>)")
    p_add.add_argument("--name", required=True, metavar="SLUG")
    p_add.add_argument("--statement", required=True)
    p_add.add_argument("--basis", required=True)
    p_add.add_argument("--risk", required=True, choices=["low", "medium", "high", "critical"])
    p_add.add_argument("--owner", required=True, metavar="AGENT")
    p_add.add_argument("--gate", default=None, metavar="GATE_NAME")
    p_add.add_argument("--cc-param", default=None, metavar="PARAM_ID",
                       help="cross_coupling.yaml param_id this assumption underpins")

    p_list = sub.add_parser("list", help="List assumptions")
    p_list.add_argument("--risk", default=None, choices=["low", "medium", "high", "critical"])
    p_list.add_argument("--status", default=None, choices=["active", "revised", "superseded"])

    p_get = sub.add_parser("get", help="Show a single assumption as YAML")
    p_get.add_argument("id", metavar="A<N>")

    sub.add_parser("next-id", help="Print the next available §A<N> without allocating it")

    p_ss = sub.add_parser("set-status", help="Change an assumption's status")
    p_ss.add_argument("id", metavar="A<N>")
    p_ss.add_argument("new_status", choices=["active", "revised", "superseded"])

    sub.add_parser("validate", help="Validate registry against schema")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.db = resolve_db(args.db)
    dispatch = {
        "init": cmd_init,
        "add": cmd_add,
        "list": cmd_list,
        "get": cmd_get,
        "next-id": cmd_next_id,
        "set-status": cmd_set_status,
        "validate": cmd_validate,
    }
    dispatch[args.command](args)


if __name__ == "__main__":
    main()
