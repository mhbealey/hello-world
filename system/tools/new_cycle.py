"""
Generate a new cycle scaffold from study-config.yaml and recent cycle history.

Usage:
    python -m system.tools.new_cycle <study_slug> <cycle_number> [--dry-run]
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

import yaml


def _studies_root() -> Path:
    return Path(__file__).parent.parent.parent / "studies" / "active"


def _load_study_config(study_slug: str) -> dict:
    path = _studies_root() / study_slug / "study-config.yaml"
    if not path.exists():
        raise FileNotFoundError(f"study-config.yaml not found: {path}")
    return yaml.safe_load(path.read_text())


def _find_handbacks(study_slug: str) -> list[Path]:
    """Return handback.md paths sorted by cycle number (ascending)."""
    cycles_dir = _studies_root() / study_slug / "cycles"
    if not cycles_dir.exists():
        return []
    handbacks = sorted(cycles_dir.glob("cycle-*/handback.md"))
    return handbacks


def _extract_risks(handbacks: list[Path], max_cycles: int = 3) -> list[str]:
    """Pull 'Retro: What to Watch' bullet points from the most recent N handbacks."""
    risks: list[str] = []
    for hb in reversed(handbacks[-max_cycles:]):
        text = hb.read_text()
        in_watch = False
        for line in text.splitlines():
            if re.search(r"what to watch", line, re.IGNORECASE):
                in_watch = True
                continue
            if in_watch:
                if line.startswith("#"):
                    break
                m = re.match(r"^\d+\.\s+(.+)", line.strip())
                if m:
                    risks.append(m.group(1).strip())
    return risks[:6]  # cap at 6


def _build_deliverables_table(config: dict, cycle_number: int) -> str:
    cycle_key = f"cycle_{cycle_number:02d}"
    cycle_cfg = config.get("cycle_structure", {}).get(cycle_key, {})
    outputs = cycle_cfg.get("outputs", [])
    study_id = config.get("study_id", "unknown")

    rows = []
    for output in outputs:
        if output.endswith(".yaml"):
            continue
        path = f"studies/active/{study_id}/{output}"
        rows.append(f"| {Path(output).stem} | `{path}` | TBD | TBD |")

    if not rows:
        rows.append("| <section name> | `studies/active/<study>/<path>.md` | N,000 | <agent-id> |")

    header = "| Artifact | Path | Word cap | Owner agent |\n|----------|------|----------|-------------|"
    return header + "\n" + "\n".join(rows)


def _build_dispatch_plan(config: dict, cycle_number: int) -> str:
    cycle_key = f"cycle_{cycle_number:02d}"
    cycle_cfg = config.get("cycle_structure", {}).get(cycle_key, {})

    # gather agents from four_questions
    agents_by_question = {}
    for q_key, q in config.get("four_questions", {}).items():
        for agent in q.get("primary_agents", []):
            agents_by_question.setdefault(q_key, []).append(agent)

    lines = ["Batch 1 (parallel):"]
    for q_key, agents in agents_by_question.items():
        for agent in agents:
            q_label = config["four_questions"][q_key].get("label", q_key)
            output_path = config["four_questions"][q_key].get("output_path", "")
            lines.append(f"  {agent}  →  {output_path} ({q_label})")

    lines.append("")
    lines.append("Review batch (depends on Batch 1):")
    for reviewer in ["aerospace-engineer-reviewer", "heritage-citations-reviewer",
                     "scope-discipline-reviewer", "cross-coupling-reviewer"]:
        lines.append(f"  {reviewer}  →  review/findings.yaml")

    return "\n".join(lines)


def _build_risks_table(risks: list[str]) -> str:
    if not risks:
        return ("| Lesson (from retro) | How this cycle addresses it |\n"
                "|---------------------|----------------------------|\n"
                "| <lesson summary> | <concrete response in this cycle's design> |")
    rows = []
    for risk in risks:
        rows.append(f"| {risk} | <!-- address explicitly --> |")
    header = ("| Lesson (from retro) | How this cycle addresses it |\n"
              "|---------------------|----------------------------|")
    return header + "\n" + "\n".join(rows)


def generate_scaffold(study_slug: str, cycle_number: int) -> str:
    """Return the rendered scaffold markdown for the given study and cycle."""
    config = _load_study_config(study_slug)
    handbacks = _find_handbacks(study_slug)
    risks = _extract_risks(handbacks)

    cycle_key = f"cycle_{cycle_number:02d}"
    cycle_cfg = config.get("cycle_structure", {}).get(cycle_key, {})
    cycle_type = cycle_cfg.get("type", "analysis")
    cycle_desc = cycle_cfg.get("description", "")

    deliverables_table = _build_deliverables_table(config, cycle_number)
    dispatch_plan = _build_dispatch_plan(config, cycle_number)
    risks_table = _build_risks_table(risks)

    today = date.today().isoformat()

    return f"""---
title: "Cycle {cycle_number:02d} Scaffold — {config.get('title', study_slug)}"
study_id: {config.get('study_id', study_slug)}
cycle: {cycle_number}
status: scaffold
last-updated: {today}
---

# Cycle {cycle_number:02d} Scaffold — {cycle_type.capitalize()} Phase

## Objective

{cycle_desc or f"Cycle {cycle_number} analysis. Replace with one-sentence objective."}

## Deliverables

{deliverables_table}

All listed artifacts must exist and pass gates before this cycle can close.

## Agent dispatch plan

Sequential dependencies must be explicitly noted. Parallel by default.

```
{dispatch_plan}
```

## Gates

Pre-commit gates (run automatically):
- WordCountGate: all deliverables under their caps
- CitationIntegrityGate: all `[@key]` references resolve in references.bib
- FrontmatterValidator: all modified .md files have valid frontmatter

Pre-close gates (run at cycle close):
- CrossCouplingConsistencyGate: all numbers in deliverables match the cross-coupling DB
- FindingsTriageGate: no unresolved Blocker findings

## Stop conditions

This cycle is complete when:
1. All deliverables listed above exist at their specified paths
2. All gates pass
3. All Blocker and Major findings are resolved or explicitly deferred with an open question

## Risks from prior cycles

{risks_table}

## Notes

Generated from study-config.yaml on {today}. Review and adjust before dispatching agents.
"""


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Generate a new cycle scaffold.")
    parser.add_argument("study_slug", help="Study slug (e.g. 01-orbital-platform)")
    parser.add_argument("cycle_number", type=int, help="Cycle number (e.g. 3)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print scaffold to stdout without writing to disk")
    args = parser.parse_args(argv)

    scaffold = generate_scaffold(args.study_slug, args.cycle_number)

    if args.dry_run:
        print(scaffold)
        return

    out_dir = _studies_root() / args.study_slug / "cycles" / f"cycle-{args.cycle_number:02d}"
    out_path = out_dir / "scaffold.md"

    if out_path.exists():
        print(f"ERROR: scaffold already exists at {out_path}. Refusing to overwrite.", file=sys.stderr)
        sys.exit(1)

    out_dir.mkdir(parents=True, exist_ok=True)
    out_path.write_text(scaffold)
    print(f"Scaffold written to {out_path}")


if __name__ == "__main__":
    main()
