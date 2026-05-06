"""Render assumption_registry.yaml to a human-readable Markdown report.

Usage:
    python -m system.tools.render_assumptions [--db PATH] [--out PATH] [--risk LEVEL] [--status STATUS]

Output: Markdown table with all assumptions, risk levels, and gate references.
"""

import argparse
import os
import sys
from datetime import datetime
from pathlib import Path

import yaml

_DB_ENV = "ASSUMPTION_REGISTRY_DB"
_DB_DEFAULT = "assumption_registry.yaml"

_RISK_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}
_RISK_EMOJI = {"critical": "🔴", "high": "🟠", "medium": "🟡", "low": "🟢"}


def load(db_path: str) -> dict:
    with open(db_path, encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}


def render(data: dict, risk_filter: str | None = None, status_filter: str | None = None) -> str:
    entries = data.get("entries", [])
    if risk_filter:
        entries = [e for e in entries if e["risk_level"] == risk_filter]
    if status_filter:
        entries = [e for e in entries if e["status"] == status_filter]

    study_id = data.get("study_id", "unknown")
    last_updated = data.get("last_updated", "unknown")
    generated = datetime.now().strftime("%Y-%m-%d %H:%M UTC")

    lines = [
        f"# Assumption Registry — {study_id}",
        f"",
        f"*Last updated: {last_updated} | Rendered: {generated} | "
        f"Total entries: {len(data.get('entries', []))}*",
        f"",
    ]

    if not entries:
        lines.append("*(no entries matching filters)*")
        return "\n".join(lines)

    # Sort by risk level then ID
    entries = sorted(entries, key=lambda e: (_RISK_ORDER.get(e["risk_level"], 9), e["id"]))

    # Summary table
    lines += [
        "## Summary",
        "",
        "| ID | Risk | Short name | Gate | Status |",
        "|----|------|-----------|------|--------|",
    ]
    for e in entries:
        risk_icon = _RISK_EMOJI.get(e["risk_level"], "⚪")
        gate = e.get("go_no_go_gate") or "—"
        status = e.get("status", "active")
        cc = f" → `{e['cross_coupling_param']}`" if e.get("cross_coupling_param") else ""
        lines.append(
            f"| §{e['id']} | {risk_icon} {e['risk_level']} | {e['short_name']}{cc} | {gate} | {status} |"
        )
    lines.append("")

    # Detail section
    lines += ["## Detailed Entries", ""]
    for e in entries:
        risk_icon = _RISK_EMOJI.get(e["risk_level"], "⚪")
        gate_line = f"\n**Gate:** {e['go_no_go_gate']}" if e.get("go_no_go_gate") else ""
        cc_line = f"\n**Cross-coupling:** `{e['cross_coupling_param']}`" if e.get("cross_coupling_param") else ""
        superseded = f"\n> **SUPERSEDED by §{e['superseded_by']}**" if e.get("superseded_by") else ""
        lines += [
            f"### §{e['id']} — {e['short_name']}  {risk_icon}",
            f"",
            f"**Statement:** {e['statement']}",
            f"",
            f"**Basis:** {e['basis']}",
            f"",
            f"**Owner:** `{e['owner_agent']}` | **Added:** {e['date_added']} | **Status:** {e['status']}"
            f"{gate_line}{cc_line}{superseded}",
            f"",
            "---",
            "",
        ]

    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="render_assumptions",
        description="Render assumption_registry.yaml to Markdown",
    )
    parser.add_argument("--db", default=None, metavar="PATH",
                        help=f"Path to assumption_registry.yaml (default: ${_DB_ENV} or {_DB_DEFAULT})")
    parser.add_argument("--out", default=None, metavar="PATH",
                        help="Output path for Markdown (default: stdout)")
    parser.add_argument("--risk", default=None, choices=["low", "medium", "high", "critical"],
                        help="Filter by risk level")
    parser.add_argument("--status", default=None, choices=["active", "revised", "superseded"],
                        help="Filter by status")
    args = parser.parse_args()

    db_path = args.db or os.environ.get(_DB_ENV, _DB_DEFAULT)
    if not Path(db_path).exists():
        print(f"error: {db_path} not found", file=sys.stderr)
        sys.exit(1)

    data = load(db_path)
    output = render(data, risk_filter=args.risk, status_filter=args.status)

    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
        print(f"rendered: {args.out}")
    else:
        print(output)


if __name__ == "__main__":
    main()
