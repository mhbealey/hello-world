"""Cycle handback generator — v1.0.

Reads the structured stores for a study cycle and produces:
  1. A YAML companion document (validated against handback.schema.yaml)
  2. A companion Markdown narrative (max 5,000 words)

Both files are written to studies/<study-id>/handbacks/cycle-<NN>.{yaml,md}.

Usage:
    python -m system.orchestration.handback --study <study-id> --cycle <N>
    python -m system.orchestration.handback --study my-study --cycle 1 --dry-run
"""

import argparse
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

_STUDIES_ROOT = Path("studies")
_SCHEMAS_DIR = Path(__file__).parent / "schemas"
_MAX_WORDS = 5000
_STATUS_ENUM = {"complete", "incomplete", "blocked"}


def _now() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def _word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text))


def _study_path(study_id: str) -> Path:
    for root in (_STUDIES_ROOT / "active", _STUDIES_ROOT / "archive"):
        p = root / study_id
        if p.exists():
            return p
    raise FileNotFoundError(f"Study not found: {study_id} (checked active/ and archive/)")


def _load_yaml(path: Path) -> dict | list | None:
    if not path.exists():
        return None
    with open(path, encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def _read_scaffold(study_dir: Path, cycle: int) -> dict:
    cycle_str = f"{cycle:02d}"
    scaffold_path = study_dir / "cycles" / f"cycle-{cycle_str}" / "scaffold.md"
    if not scaffold_path.exists():
        return {"objective": f"Cycle {cycle} (scaffold not found)", "deliverables_raw": []}

    text = scaffold_path.read_text(encoding="utf-8")
    objective = ""
    m = re.search(r"^##\s+Objective\s*\n+([^\n]+)", text, re.MULTILINE)
    if m:
        objective = m.group(1).strip()

    deliverables = []
    in_table = False
    for line in text.splitlines():
        if "| Path" in line or "| path" in line:
            in_table = True
            continue
        if in_table and line.startswith("|") and "---" not in line:
            parts = [p.strip() for p in line.split("|")[1:-1]]
            if parts:
                deliverables.append({"path": parts[0], "planned": True})
        elif in_table and not line.startswith("|"):
            in_table = False

    return {"objective": objective or f"Cycle {cycle}", "deliverables_raw": deliverables}


def _collect_deliverables(study_dir: Path, cycle: int, planned: list[dict]) -> list[dict]:
    cycle_str = f"{cycle:02d}"
    cycle_dir = study_dir / "cycles" / f"cycle-{cycle_str}"

    produced_paths: set[str] = set()
    if cycle_dir.exists():
        for f in cycle_dir.rglob("*"):
            if f.is_file() and f.name != "scaffold.md":
                produced_paths.add(f.relative_to(study_dir).as_posix())

    result = []
    for item in planned:
        path_str = item["path"]
        full = study_dir / path_str
        if full.exists():
            status = "produced"
            wc: int | None = None
            if full.suffix == ".md":
                wc = _word_count(full.read_text(encoding="utf-8"))
        else:
            status = "deferred"
            wc = None
        result.append({"path": path_str, "status": status, "word_count": wc, "notes": None})

    for p in sorted(produced_paths):
        already = any(d["path"] == p for d in result)
        if not already:
            full = study_dir / p
            wc = _word_count(full.read_text(encoding="utf-8")) if full.suffix == ".md" else None
            result.append({"path": p, "status": "produced", "word_count": wc, "notes": None})

    return result


def _load_findings_summary(study_dir: Path, cycle: int) -> dict:
    empty = {"total": 0, "blockers": 0, "majors": 0, "minors": 0, "nits": 0, "resolved": 0, "deferred": 0}
    findings_dir = study_dir / "findings"
    if not findings_dir.exists():
        return empty

    counts: dict[str, int] = {k: 0 for k in empty}
    for f in findings_dir.glob("*.yaml"):
        data = _load_yaml(f)
        if not isinstance(data, dict):
            continue
        if str(data.get("cycle", "")) != str(cycle):
            continue
        counts["total"] += 1
        sev = str(data.get("severity", "")).lower()
        status = str(data.get("status", "open")).lower()
        if sev == "blocker":
            counts["blockers"] += 1
        elif sev == "major":
            counts["majors"] += 1
        elif sev == "minor":
            counts["minors"] += 1
        elif sev == "nit":
            counts["nits"] += 1
        if status == "resolved":
            counts["resolved"] += 1
        elif status == "deferred":
            counts["deferred"] += 1
    return counts


def _load_blockers_remaining(study_dir: Path, cycle: int) -> list[str]:
    findings_dir = study_dir / "findings"
    if not findings_dir.exists():
        return []
    blockers = []
    for f in findings_dir.glob("*.yaml"):
        data = _load_yaml(f)
        if not isinstance(data, dict):
            continue
        if str(data.get("cycle", "")) != str(cycle):
            continue
        if str(data.get("severity", "")).lower() == "blocker":
            if str(data.get("status", "open")).lower() not in ("resolved", "wont-fix"):
                blockers.append(data.get("finding_id", f.stem))
    return sorted(blockers)


def _derive_status(blockers_remaining: list[str], deliverables: list[dict]) -> str:
    if blockers_remaining:
        return "blocked"
    blocked_deliverables = [d for d in deliverables if d["status"] == "blocked"]
    if blocked_deliverables:
        return "incomplete"
    return "complete"


def _load_session_summary(study_dir: Path, cycle: int) -> str:
    sessions_file = study_dir / "retro" / "session-logs.yaml"
    data = _load_yaml(sessions_file)
    if not isinstance(data, dict):
        return ""
    sessions = data.get("sessions", [])
    cycle_sessions = [s for s in sessions if str(s.get("cycle", "")) == str(cycle)]
    if not cycle_sessions:
        return ""
    last = cycle_sessions[-1]
    return str(last.get("summary", ""))


def _build_next_cycle_inputs(
    study_dir: Path,
    cycle: int,
    blockers: list[str],
    findings_summary: dict,
) -> str:
    parts = []
    if blockers:
        parts.append(f"Resolve {len(blockers)} open blocker(s): {', '.join(blockers)}.")
    total = findings_summary.get("total", 0)
    unresolved = total - findings_summary.get("resolved", 0) - findings_summary.get("deferred", 0)
    if unresolved > 0:
        parts.append(f"Address {unresolved} open finding(s) from cycle {cycle}.")
    session_summary = _load_session_summary(study_dir, cycle)
    if session_summary:
        parts.append(session_summary[:300])
    if not parts:
        parts.append(f"Continue from cycle {cycle} deliverables. No blockers outstanding.")
    return " ".join(parts)


def build_handback_yaml(study_id: str, cycle: int, study_dir: Path) -> dict:
    scaffold = _read_scaffold(study_dir, cycle)
    deliverables = _collect_deliverables(study_dir, cycle, scaffold["deliverables_raw"])
    findings_summary = _load_findings_summary(study_dir, cycle)
    blockers_remaining = _load_blockers_remaining(study_dir, cycle)
    status = _derive_status(blockers_remaining, deliverables)
    next_inputs = _build_next_cycle_inputs(study_dir, cycle, blockers_remaining, findings_summary)

    return {
        "study_id": study_id,
        "cycle": cycle,
        "date_generated": _now(),
        "objective": scaffold["objective"],
        "status": status,
        "deliverables": deliverables,
        "findings_summary": findings_summary,
        "blockers_remaining": blockers_remaining,
        "next_cycle_inputs": next_inputs,
        "gates_passed": len(blockers_remaining) == 0,
    }


def build_handback_markdown(hb: dict, study_dir: Path) -> str:
    cycle = hb["cycle"]
    lines: list[str] = []

    lines += [
        f"---",
        f"study_id: {hb['study_id']}",
        f"cycle: {cycle}",
        f"date_generated: {hb['date_generated']}",
        f"status: {hb['status']}",
        f"---",
        "",
        f"# Cycle {cycle} Handback — {hb['study_id']}",
        "",
        f"**Generated:** {hb['date_generated']}  ",
        f"**Status:** {hb['status'].upper()}  ",
        f"**Gates passed:** {'Yes' if hb.get('gates_passed') else 'No'}",
        "",
        "## Objective",
        "",
        hb["objective"],
        "",
        "## Deliverables",
        "",
        "| Path | Status | Words |",
        "|------|--------|------:|",
    ]

    for d in hb["deliverables"]:
        wc = d.get("word_count") or "—"
        lines.append(f"| `{d['path']}` | {d['status']} | {wc} |")

    lines += ["", "## Findings Summary", ""]
    fs = hb["findings_summary"]
    lines += [
        f"- **Total:** {fs['total']}",
        f"- Blockers: {fs['blockers']}  Majors: {fs['majors']}  "
        f"Minors: {fs['minors']}  Nits: {fs['nits']}",
        f"- Resolved: {fs['resolved']}  Deferred: {fs['deferred']}",
        "",
    ]

    if hb["blockers_remaining"]:
        lines += ["## Open Blockers", ""]
        for b in hb["blockers_remaining"]:
            lines.append(f"- {b}")
        lines.append("")

    lines += [
        "## Next Cycle Inputs",
        "",
        hb["next_cycle_inputs"],
        "",
    ]

    # Load session summary if present
    sessions_file = study_dir / "retro" / "session-logs.yaml"
    sessions_data = _load_yaml(sessions_file)
    if isinstance(sessions_data, dict):
        cycle_sessions = [
            s for s in sessions_data.get("sessions", [])
            if str(s.get("cycle", "")) == str(cycle)
        ]
        if cycle_sessions:
            lines += ["## Session Log", ""]
            for s in cycle_sessions:
                lines.append(f"**Session {s.get('session_id', '?')}** ({s.get('date', '?')})")
                lines.append("")
                lines.append(str(s.get("summary", "")))
                artifacts = s.get("artifacts_produced", [])
                if artifacts:
                    lines.append("")
                    lines.append("Artifacts:")
                    for a in artifacts:
                        lines.append(f"  - {a}")
                lines.append("")

    return "\n".join(lines)


def _validate_yaml(data: dict) -> list[str]:
    try:
        import jsonschema
    except ImportError:
        return []
    schema_path = _SCHEMAS_DIR / "handback.schema.yaml"
    if not schema_path.exists():
        return []
    with open(schema_path, encoding="utf-8") as fh:
        schema = yaml.safe_load(fh)
    errors = []
    try:
        jsonschema.validate(data, schema)
    except jsonschema.ValidationError as e:
        errors.append(f"Schema violation: {e.message}")
    return errors


def generate(study_id: str, cycle: int, dry_run: bool = False) -> tuple[Path, Path]:
    study_dir = _study_path(study_id)
    handbacks_dir = study_dir / "handbacks"
    cycle_str = f"{cycle:02d}"

    hb_yaml_path = handbacks_dir / f"cycle-{cycle_str}.yaml"
    hb_md_path = handbacks_dir / f"cycle-{cycle_str}.md"

    hb_data = build_handback_yaml(study_id, cycle, study_dir)
    hb_md = build_handback_markdown(hb_data, study_dir)

    wc = _word_count(hb_md)
    if wc > _MAX_WORDS:
        print(
            f"WARNING: handback is {wc} words (limit {_MAX_WORDS}). "
            "Trim session logs or deliverables list.",
            file=sys.stderr,
        )

    errors = _validate_yaml(hb_data)
    if errors:
        for e in errors:
            print(f"SCHEMA ERROR: {e}", file=sys.stderr)
        if not dry_run:
            sys.exit(1)

    if dry_run:
        print("--- YAML ---")
        print(yaml.dump(hb_data, default_flow_style=False, allow_unicode=True))
        print("--- MARKDOWN ---")
        print(hb_md)
        print(f"--- word count: {wc} ---")
        return hb_yaml_path, hb_md_path

    handbacks_dir.mkdir(parents=True, exist_ok=True)
    with open(hb_yaml_path, "w", encoding="utf-8") as fh:
        yaml.dump(hb_data, fh, default_flow_style=False, allow_unicode=True, sort_keys=False)
    hb_md_path.write_text(hb_md, encoding="utf-8")

    print(f"Handback written:")
    print(f"  YAML: {hb_yaml_path}")
    print(f"  MD:   {hb_md_path}")
    print(f"  Words: {wc}  Status: {hb_data['status']}")
    return hb_yaml_path, hb_md_path


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="handback",
        description="Generate a cycle handback document",
    )
    parser.add_argument("--study", required=True, help="Study ID")
    parser.add_argument("--cycle", required=True, type=int, help="Cycle number")
    parser.add_argument("--dry-run", action="store_true", help="Print to stdout, do not write")
    args = parser.parse_args()
    generate(args.study, args.cycle, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
