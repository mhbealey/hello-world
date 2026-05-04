"""One-time migration: lunar-humanoid-pathfinder archive → structured YAML.

T-15: margins-and-assumptions.md → assumption_registry.yaml
T-22: review/*.md → findings/*.yaml

Usage:
    python -m system.tools.migrate_archive [--dry-run] [--archive PATH]
"""

import argparse
import re
import sys
from datetime import date
from pathlib import Path

import yaml

_TODAY = date.today().isoformat()
_REVIEWER_MAP = {
    "aerospace-engineer": "aerospace-engineer-reviewer",
    "heritage-citations": "heritage-citations-reviewer",
    "reliability-margins": "reliability-margins-reviewer",
    "scope-discipline": "scope-discipline-reviewer",
    "cross-coupling": "cross-coupling-reviewer",
    "devils-advocate": "devils-advocate-reviewer",
}
_SEVERITY_MAP = {
    "blocker": "Blocker",
    "major": "Major",
    "minor": "Minor",
    "nit": "Nit",
}
_RISK_MAP = {
    "high": "high",
    "medium": "medium",
    "medium-high": "high",
    "low-medium": "medium",
    "low": "low",
    "critical": "critical",
}


def _parse_findings_file(path: Path, study_id: str) -> list[dict]:
    """Parse a reviewer findings .md file into a list of finding dicts."""
    stem = path.stem  # e.g. "aerospace-engineer-findings"
    reviewer_key = stem.replace("-findings", "")
    reviewer = _REVIEWER_MAP.get(reviewer_key)
    if not reviewer:
        return []

    text = path.read_text(encoding="utf-8")
    # Split on '### FindingID' headers
    blocks = re.split(r"^###\s+", text, flags=re.MULTILINE)[1:]

    findings = []
    for block in blocks:
        lines = block.strip().splitlines()
        if not lines:
            continue
        header = lines[0].strip()

        # Parse header: "AE-S8-01 — Major — §02-02 — Title" or "RM-B01 — Blocker — ..."
        m = re.match(r"([A-Z][A-Za-z0-9-]+)\s+[—–-]{1,3}\s+(\w+)\s+[—–-]{1,3}\s*(.*)", header)
        if not m:
            continue

        finding_id = m.group(1)
        severity_raw = m.group(2).strip().lower()
        severity = _SEVERITY_MAP.get(severity_raw, "Minor")

        body = "\n".join(lines[1:])

        def _field(name: str) -> str:
            pattern = rf"\*\*{re.escape(name)}:\*\*\s*(.*?)(?=\n\*\*|\Z)"
            match = re.search(pattern, body, re.DOTALL)
            return match.group(1).strip() if match else ""

        section = _field("Section") or _field("Sections reviewed")
        claim = _field("Claim") or ""
        issue = _field("Issue") or ""
        required_action = _field("Required action") or ""

        observation = " ".join(filter(None, [claim, issue]))[:1000] or body[:500]
        fix = required_action[:500] or "See finding file for resolution."
        impact = claim[:300] or "See finding."

        # Determine status from triage files
        status = "open"

        entry = {
            "finding_id": finding_id,
            "reviewer": reviewer,
            "severity": severity,
            "study_id": study_id,
            "cycle": "stage-8",
            "file_path": f"review/{path.name}",
            "section": section[:200] if section else None,
            "observation": observation,
            "impact": impact,
            "fix": fix,
            "status": status,
            "resolution_notes": None,
            "date_found": _TODAY,
            "date_resolved": None,
        }
        findings.append(entry)

    return findings


def migrate_findings(archive_dir: Path, study_id: str, dry_run: bool) -> int:
    review_dir = archive_dir / "review"
    findings_dir = archive_dir / "findings"

    all_findings = []
    for review_file in sorted(review_dir.glob("*-findings.md")):
        parsed = _parse_findings_file(review_file, study_id)
        all_findings.extend(parsed)
        print(f"  Parsed {len(parsed):2d} findings from {review_file.name}")

    if not dry_run:
        findings_dir.mkdir(exist_ok=True)
        for f in all_findings:
            fid = f["finding_id"].lower().replace("-", "_")
            out_path = findings_dir / f"{fid}.yaml"
            with open(out_path, "w", encoding="utf-8") as fh:
                yaml.dump(f, fh, default_flow_style=False, allow_unicode=True, sort_keys=False)
    else:
        print(f"  [dry-run] Would write {len(all_findings)} finding YAML files to {findings_dir}")

    print(f"  Total: {len(all_findings)} findings")
    return len(all_findings)


def _parse_assumptions(margins_path: Path) -> list[dict]:
    text = margins_path.read_text(encoding="utf-8")

    # Parse the table rows (skip header and separator)
    table_re = re.compile(r"^\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|", re.MULTILINE)
    table_entries = {}
    for m in table_re.finditer(text):
        assumption = m.group(1).strip()
        source = m.group(2).strip()
        owner = m.group(3).strip()
        risk_raw = m.group(4).strip().lower()
        if assumption.lower() in ("assumption", "---", "") or "---" in assumption:
            continue
        table_entries[assumption[:80]] = {
            "source": source,
            "owner": owner,
            "risk_raw": risk_raw,
        }

    # Parse extended sections: ### A1. Title
    section_re = re.compile(r"^###\s+(A(\d+))\.\s+(.+?)$", re.MULTILINE)
    sections = {}
    section_blocks = re.split(r"^###\s+A\d+\.", text, flags=re.MULTILINE)[1:]
    section_headers = section_re.findall(text)

    for (aid, num, title), block in zip(section_headers, section_blocks):
        sections[aid] = {"num": int(num), "title": title.strip(), "body": block.strip()}

    assumptions = []
    for aid, sdata in sorted(sections.items(), key=lambda x: x[1]["num"]):
        # Find matching table entry
        table_info = {}
        title_lower = sdata["title"].lower()[:40]
        for tkey, tval in table_entries.items():
            if title_lower[:20] in tkey.lower() or tkey.lower()[:20] in title_lower:
                table_info = tval
                break

        owner = table_info.get("owner", "orchestrator").strip()
        risk_raw = table_info.get("risk_raw", "medium")
        risk_words = re.findall(r"\b(?:high|medium|low|critical)\b", risk_raw)
        risk = _RISK_MAP.get(risk_words[0] if risk_words else "medium", "medium")

        # Extract first sentence as short statement
        body = sdata["body"]
        first_sent = re.split(r"(?<=\.)\s", body.replace("\n", " "))[0][:300]

        # Determine go/no-go gate if mentioned
        gate_m = re.search(r"(202\d)\s+gate|gate\s+at\s+(202\d)", body, re.IGNORECASE)
        gate = gate_m.group(1) or gate_m.group(2) if gate_m else None

        entry = {
            "id": aid,
            "short_name": sdata["title"][:80],
            "statement": first_sent,
            "basis": table_info.get("source", "See study document")[:200],
            "risk_level": risk,
            "owner_agent": owner[:80],
            "date_added": _TODAY,
            "status": "active",
        }
        if gate:
            entry["go_no_go_gate"] = gate
        assumptions.append(entry)

    return assumptions


def migrate_assumptions(archive_dir: Path, dry_run: bool) -> int:
    margins_path = archive_dir / "study" / "05-cross-cutting" / "margins-and-assumptions.md"
    if not margins_path.exists():
        print(f"  WARNING: {margins_path} not found, skipping")
        return 0

    assumptions = _parse_assumptions(margins_path)
    registry = {
        "study_id": archive_dir.name,
        "next_id": len(assumptions) + 1,
        "assumptions": assumptions,
    }

    out_path = archive_dir / "assumption_registry.yaml"
    if dry_run:
        print(f"  [dry-run] Would write {len(assumptions)} assumptions to {out_path}")
        for a in assumptions[:3]:
            print(f"    {a['id']}: {a['short_name'][:60]}")
        print("    ...")
    else:
        with open(out_path, "w", encoding="utf-8") as fh:
            yaml.dump(registry, fh, default_flow_style=False, allow_unicode=True, sort_keys=False)
        print(f"  Wrote {len(assumptions)} assumptions to {out_path}")

    return len(assumptions)


def main() -> None:
    parser = argparse.ArgumentParser(description="Migrate archive to structured YAML")
    parser.add_argument(
        "--archive",
        default="studies/archive/lunar-humanoid-pathfinder",
        help="Path to archive study directory",
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--only", choices=["findings", "assumptions"], default=None)
    args = parser.parse_args()

    archive_dir = Path(args.archive)
    if not archive_dir.exists():
        print(f"ERROR: archive not found: {archive_dir}", file=sys.stderr)
        sys.exit(1)

    study_id = archive_dir.name

    if args.only != "findings":
        print(f"\n--- T-15: Assumptions ({study_id}) ---")
        n = migrate_assumptions(archive_dir, dry_run=args.dry_run)
        print(f"  Done: {n} assumptions")

    if args.only != "assumptions":
        print(f"\n--- T-22: Findings ({study_id}) ---")
        n = migrate_findings(archive_dir, study_id, dry_run=args.dry_run)
        print(f"  Done: {n} findings")


if __name__ == "__main__":
    main()
