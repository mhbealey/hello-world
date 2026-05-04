"""new_study.py — initialize a new study under studies/active/.

Usage:
    python system/orchestration/new_study.py \\
        --id orbital-platform-study \\
        --title "Orbital Platform Architecture" \\
        --domain orbital-platform \\
        [--sections "01-mission-arch,02-human-factors,03-operations,04-program"] \\
        [--dry-run]

What it does:
  1. Creates studies/active/<id>/ directory tree
  2. Writes study-config.yaml from provided parameters
  3. Seeds cross_coupling.yaml (empty)
  4. Seeds assumption_registry.yaml (empty, ready for §A1 allocation)
  5. Seeds visual_specs.yaml from domain template
  6. Creates cycles/, handbacks/, retro/, corpus/ skeletons
  7. Merges system/agents/base/*.md + domain overlays → .claude/agents/
  8. Prints next steps

The .claude/agents/ write makes the merged agent set the active context for
Claude Code immediately after this script runs. No runtime assembly — the
concatenation happens here at study-init time.
"""

import argparse
import os
import shutil
import sys
from datetime import date
from pathlib import Path

import yaml

_REPO_ROOT = Path(__file__).parent.parent.parent
_AGENTS_BASE = _REPO_ROOT / "system" / "agents" / "base"
_AGENTS_META = _REPO_ROOT / "system" / "agents" / "meta"
_AGENTS_REVIEWERS = _REPO_ROOT / "system" / "agents" / "reviewers"
_AGENTS_DOMAIN = _REPO_ROOT / "system" / "agents" / "domain"
_AGENTS_VIZ = _REPO_ROOT / "system" / "agents" / "base" / "visualization"
_AGENTS_OUT = _REPO_ROOT / ".claude" / "agents"
_TEMPLATES = _REPO_ROOT / "system" / "templates"

_DEFAULT_SECTIONS = [
    "00-front-matter",
    "01-question-a",
    "02-question-b",
    "03-question-c",
    "04-question-d",
    "05-cross-cutting",
]


def _print(msg: str, dry: bool = False) -> None:
    prefix = "[dry-run] " if dry else ""
    print(f"{prefix}{msg}")


def _write(path: Path, content: str, dry: bool) -> None:
    if dry:
        _print(f"write {path}", dry)
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    _print(f"created {path}")


def _mkdir(path: Path, dry: bool) -> None:
    if dry:
        _print(f"mkdir {path}", dry)
        return
    path.mkdir(parents=True, exist_ok=True)
    _print(f"mkdir  {path}")


def _study_config(study_id: str, title: str, domain: str, sections: list[str]) -> str:
    config = {
        "study_id": study_id,
        "version": "0.1.0",
        "status": "active",
        "created_date": str(date.today()),
        "title": title,
        "domain": domain,
        "thesis": "TBD — fill in during cycle 1 planning",
        "sections": [{"id": s, "title": s.replace("-", " ").title()} for s in sections],
        "target_word_count": 80000,
        "word_count_gates": {
            "per_section_max": 12000,
            "per_file_max": 4000,
        },
        "key_parameters": {},
    }
    return yaml.dump(config, default_flow_style=False, allow_unicode=True, sort_keys=False)


def _empty_cross_coupling(study_id: str) -> str:
    data = {
        "study_id": study_id,
        "last_updated": str(date.today()),
        "entries": [],
    }
    return yaml.dump(data, default_flow_style=False, allow_unicode=True)


def _empty_assumption_registry(study_id: str) -> str:
    data = {
        "study_id": study_id,
        "last_updated": str(date.today()),
        "next_id": 1,
        "entries": [],
    }
    return yaml.dump(data, default_flow_style=False, allow_unicode=True, sort_keys=False)


def _visual_specs(study_id: str, domain: str) -> str:
    template_path = _REPO_ROOT / "system" / "state" / "visual_specs.yaml"
    if template_path.exists():
        text = template_path.read_text(encoding="utf-8")
        text = text.replace("<study-id>", study_id)
        text = text.replace("<domain>", domain)
        text = text.replace("YYYY-MM-DD", str(date.today()))
        text = text.replace("<concept-name>", study_id)
        return text
    return f"study_id: {study_id}\nlast_updated: {date.today()}\n"


def _section_frontmatter(section_id: str, title: str) -> str:
    return f"---\ntitle: {title}\nstatus: draft\nlast-updated: {date.today()}\n---\n\n# {title}\n\nContent TBD.\n"


def _merge_agents(domain: str, dry: bool) -> None:
    """Merge base + domain overlays into .claude/agents/ (flat)."""
    if not dry:
        _AGENTS_OUT.mkdir(parents=True, exist_ok=True)

    domain_dir = _AGENTS_DOMAIN / domain

    def _write_agent(dest: Path, content: str) -> None:
        if dry:
            _print(f"  write {dest}", dry)
        else:
            dest.write_text(content, encoding="utf-8")

    # Base agents (with optional domain overlay)
    for base_file in sorted(_AGENTS_BASE.glob("*.md")):
        overlay = domain_dir / base_file.name
        content = base_file.read_text(encoding="utf-8")
        if overlay.exists():
            ov_text = overlay.read_text(encoding="utf-8")
            content += f"\n\n---\n\n## Domain overlay: {domain}\n\n{ov_text}"
        _write_agent(_AGENTS_OUT / base_file.name, content)

    # Visualization agents (with optional domain visualization overlay)
    if _AGENTS_VIZ.exists():
        domain_viz_dir = domain_dir / "visualization"
        for vf in sorted(_AGENTS_VIZ.glob("*.md")):
            content = vf.read_text(encoding="utf-8")
            overlay = domain_viz_dir / vf.name
            if overlay.exists():
                ov_text = overlay.read_text(encoding="utf-8")
                content += f"\n\n---\n\n## Domain visualization overlay: {domain}\n\n{ov_text}"
            _write_agent(_AGENTS_OUT / vf.name, content)

    # Reviewer agents (no domain overlay)
    for rf in sorted(_AGENTS_REVIEWERS.glob("*.md")):
        content = rf.read_text(encoding="utf-8")
        _write_agent(_AGENTS_OUT / rf.name, content)

    # Meta agents (no domain overlay)
    for mf in sorted(_AGENTS_META.glob("*.md")):
        content = mf.read_text(encoding="utf-8")
        _write_agent(_AGENTS_OUT / mf.name, content)

    _print(f"agents merged → {_AGENTS_OUT} ({domain} domain overlay)")


def create_study(
    study_id: str,
    title: str,
    domain: str,
    sections: list[str],
    dry: bool,
) -> None:
    root = _REPO_ROOT / "studies" / "active" / study_id

    if root.exists() and not dry:
        print(f"error: {root} already exists", file=sys.stderr)
        sys.exit(1)

    _print(f"=== Creating study: {study_id} ===")

    # Core directories
    for d in ["cycles", "handbacks", "retro", "corpus", "visual/output", "visual/renders", "visual/source"]:
        _mkdir(root / d, dry)

    # Section skeleton files
    for sec in sections:
        sec_title = sec.replace("-", " ").title()
        _write(root / "study" / sec / "overview.md",
               _section_frontmatter(sec, sec_title), dry)

    # study-config.yaml
    _write(root / "study-config.yaml", _study_config(study_id, title, domain, sections), dry)

    # Seed data files
    _write(root / "cross_coupling.yaml", _empty_cross_coupling(study_id), dry)
    _write(root / "assumption_registry.yaml", _empty_assumption_registry(study_id), dry)
    _write(root / "visual_specs.yaml", _visual_specs(study_id, domain), dry)

    # Seed corpus
    _write(root / "corpus" / "references.bib",
           f"% References for {title}\n% Add BibTeX entries here\n", dry)

    # Seed retro session log
    _write(root / "retro" / "session-logs.yaml",
           f"study_id: {study_id}\nsessions: []\n", dry)

    # Cycle 1 scaffold stub
    scaffold_template = _TEMPLATES / "cycle_scaffold_template.md"
    if scaffold_template.exists():
        content = scaffold_template.read_text(encoding="utf-8")
        content = content.replace("NN", "01").replace("<study-id>", study_id)
        _write(root / "cycles" / "cycle-01" / "scaffold.md", content, dry)

    # Merge agents
    _print("Merging agents into .claude/agents/ ...")
    _merge_agents(domain, dry)

    _print("")
    _print("=== Next steps ===")
    _print(f"1. Fill in the cycle 01 scaffold: {root}/cycles/cycle-01/scaffold.md")
    _print(f"2. Define the study thesis in: {root}/study-config.yaml")
    _print("3. Run cycle 1 (planning cycle) — scope, agent assignments, assumption seed, CC seed")
    _print(f"4. After cycle 1: python system/tools/gates.py --study {study_id}")


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="new_study",
        description="Initialize a new study under studies/active/",
    )
    parser.add_argument("--id", required=True, metavar="STUDY_ID")
    parser.add_argument("--title", required=True)
    parser.add_argument("--domain", required=True,
                        help="Domain overlay to apply (e.g. lunar-surface, orbital-platform)")
    parser.add_argument("--sections", default=None,
                        help="Comma-separated section IDs (default: 00-front-matter through 05-cross-cutting)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print what would be created without writing anything")
    args = parser.parse_args()

    sections = (
        [s.strip() for s in args.sections.split(",")]
        if args.sections
        else _DEFAULT_SECTIONS
    )

    create_study(
        study_id=args.id,
        title=args.title,
        domain=args.domain,
        sections=sections,
        dry=args.dry_run,
    )


if __name__ == "__main__":
    main()
