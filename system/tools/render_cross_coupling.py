"""Render cross_coupling.yaml to a human-readable Markdown report.

Usage:
    python -m system.tools.render_cross_coupling [--db PATH] [--out PATH] [--locked-only]

Output: Markdown table with all cross-coupling parameters, status, and values.
"""

import argparse
import os
import sys
from datetime import datetime
from pathlib import Path

import yaml

_DB_ENV = "CROSS_COUPLING_DB"
_DB_DEFAULT = "cross_coupling.yaml"


def load(db_path: str) -> dict:
    with open(db_path, encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}


def render(data: dict, locked_only: bool = False) -> str:
    entries = data.get("entries", [])
    if locked_only:
        entries = [e for e in entries if e.get("locked")]

    study_id = data.get("study_id", "unknown")
    last_updated = data.get("last_updated", "unknown")
    generated = datetime.now().strftime("%Y-%m-%d %H:%M UTC")

    lines = [
        f"# Cross-Coupling Parameters — {study_id}",
        f"",
        f"*Last updated: {last_updated} | Rendered: {generated}*",
        f"",
    ]

    if not entries:
        lines.append("*(no entries)*")
        return "\n".join(lines)

    # Locked entries first
    locked = [e for e in entries if e.get("locked") and not e.get("superseded_by")]
    unlocked = [e for e in entries if not e.get("locked") and not e.get("superseded_by")]
    superseded = [e for e in entries if e.get("superseded_by")]

    if locked:
        lines += [
            "## Locked Decisions",
            "",
            "| param_id | Value | Set by | Locked date | Affects |",
            "|----------|-------|--------|-------------|---------|",
        ]
        for e in locked:
            affects = ", ".join(e.get("affects") or []) or "—"
            lines.append(
                f"| `{e['param_id']}` | {e['value']} | {e['set_by']} "
                f"| {e.get('locked_date', '?')} | {affects} |"
            )
        lines.append("")

    if unlocked and not locked_only:
        lines += [
            "## Active (Unlocked) Parameters",
            "",
            "| param_id | Value | Set by | Date set | Affects |",
            "|----------|-------|--------|----------|---------|",
        ]
        for e in unlocked:
            affects = ", ".join(e.get("affects") or []) or "—"
            lines.append(
                f"| `{e['param_id']}` | {e['value']} | {e['set_by']} "
                f"| {e.get('date_set', '?')} | {affects} |"
            )
        lines.append("")

    if superseded and not locked_only:
        lines += [
            "## Superseded Parameters",
            "",
            "| param_id | Superseded by | Last value |",
            "|----------|---------------|-----------|",
        ]
        for e in superseded:
            lines.append(f"| `{e['param_id']}` | `{e['superseded_by']}` | {e['value']} |")
        lines.append("")

    # Basis notes for locked entries
    if locked:
        lines += ["## Basis Notes (Locked Decisions)", ""]
        for e in locked:
            lines.append(f"**`{e['param_id']}`**: {e.get('basis', '(no basis recorded)')}")
        lines.append("")

    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="render_cross_coupling",
        description="Render cross_coupling.yaml to Markdown",
    )
    parser.add_argument("--db", default=None, metavar="PATH",
                        help=f"Path to cross_coupling.yaml (default: ${_DB_ENV} or {_DB_DEFAULT})")
    parser.add_argument("--out", default=None, metavar="PATH",
                        help="Output path for Markdown (default: stdout)")
    parser.add_argument("--locked-only", action="store_true",
                        help="Only render locked entries")
    args = parser.parse_args()

    db_path = args.db or os.environ.get(_DB_ENV, _DB_DEFAULT)
    if not Path(db_path).exists():
        print(f"error: {db_path} not found", file=sys.stderr)
        sys.exit(1)

    data = load(db_path)
    output = render(data, locked_only=args.locked_only)

    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
        print(f"rendered: {args.out}")
    else:
        print(output)


if __name__ == "__main__":
    main()
