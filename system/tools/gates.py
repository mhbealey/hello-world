"""Study gates — run pre-commit and pre-handback validation checks.

Usage:
    python system/tools/gates.py --study STUDY_ID [--gate GATE_NAME]
    python system/tools/gates.py --study-path PATH [--gate GATE_NAME]
    python -m system.tools.gates --study STUDY_ID

Gates:
    frontmatter   FrontmatterValidator   — required fields, valid status, date format
    wordcount     WordCountGate          — per-file and per-section word caps
    citations     CitationIntegrityGate  — [@key] and \\cite{key} resolve in references.bib
    crosscoupling CrossCouplingConsistencyGate — DB is schema-valid, unique param_ids

Exit code 0 = all gates pass. Non-zero = at least one Blocker or Major finding.
"""

import argparse
import os
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

import yaml

_SCHEMA_CC = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "orchestration", "schemas", "cross_coupling.schema.yaml",
)
_SCHEMA_AR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "orchestration", "schemas", "assumption_registry.schema.yaml",
)

_REQUIRED_FRONTMATTER = {"title", "status", "last-updated"}
_VALID_STATUSES = {"draft", "in-progress", "complete", "archived", "active"}
_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
_CITE_RE = re.compile(r"[@\\]cite\{([^}]+)\}|@\[([^\]]+)\]|\[@([^\]]+)\]")
_BIBTEX_KEY_RE = re.compile(r"^@\w+\{([^,\s]+),", re.MULTILINE)


@dataclass
class Finding:
    severity: str  # Blocker, Major, Minor, Nit
    gate: str
    path: str
    message: str
    fix: str = ""

    def __str__(self) -> str:
        s = f"[{self.severity}] {self.gate}  {self.path}\n  {self.message}"
        if self.fix:
            s += f"\n  Fix: {self.fix}"
        return s


def _resolve_study_path(study_id: str | None, study_path: str | None) -> Path:
    if study_path:
        return Path(study_path)
    if study_id:
        for root in ("studies/active", "studies/archive"):
            p = Path(root) / study_id
            if p.exists():
                return p
        print(f"error: study '{study_id}' not found under studies/active/ or studies/archive/", file=sys.stderr)
        sys.exit(1)
    print("error: provide --study or --study-path", file=sys.stderr)
    sys.exit(1)


def _iter_study_md(study_path: Path):
    """Yield all .md files under the study's section directories."""
    sections_root = study_path / "study"
    if not sections_root.exists():
        return
    yield from sections_root.rglob("*.md")


def _strip_frontmatter(text: str) -> tuple[dict, str]:
    """Return (frontmatter_dict, body_text). frontmatter_dict is {} if none found."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    fm_text = text[3:end].strip()
    body = text[end + 4:].lstrip("\n")
    try:
        fm = yaml.safe_load(fm_text) or {}
    except yaml.YAMLError:
        fm = {}
    return fm, body


def _count_words(text: str) -> int:
    return len(text.split())


# ─── FrontmatterValidator ────────────────────────────────────────────────────

def run_frontmatter(study_path: Path) -> list[Finding]:
    findings = []
    for md in _iter_study_md(study_path):
        text = md.read_text(encoding="utf-8")
        if not text.startswith("---"):
            findings.append(Finding(
                "Major", "frontmatter", str(md),
                "No YAML frontmatter found",
                "Add --- frontmatter block with title, status, last-updated",
            ))
            continue
        fm, _ = _strip_frontmatter(text)
        rel = str(md.relative_to(study_path))
        for field_name in _REQUIRED_FRONTMATTER:
            if field_name not in fm:
                findings.append(Finding(
                    "Blocker", "frontmatter", rel,
                    f"Missing required frontmatter field: '{field_name}'",
                    f"Add `{field_name}: <value>` to frontmatter",
                ))
        if "status" in fm and fm["status"] not in _VALID_STATUSES:
            findings.append(Finding(
                "Minor", "frontmatter", rel,
                f"Invalid status value: '{fm['status']}' (valid: {sorted(_VALID_STATUSES)})",
                f"Set status to one of: {', '.join(sorted(_VALID_STATUSES))}",
            ))
        if "last-updated" in fm:
            val = str(fm["last-updated"])
            if not _DATE_RE.match(val):
                findings.append(Finding(
                    "Minor", "frontmatter", rel,
                    f"last-updated '{val}' is not YYYY-MM-DD format",
                    "Use ISO 8601 date format: YYYY-MM-DD",
                ))
    return findings


# ─── WordCountGate ────────────────────────────────────────────────────────────

def run_wordcount(study_path: Path) -> list[Finding]:
    findings = []
    config_path = study_path / "study-config.yaml"
    if not config_path.exists():
        findings.append(Finding(
            "Minor", "wordcount", str(config_path),
            "study-config.yaml not found — word count caps unavailable",
            "Create study-config.yaml with word_count_gates section",
        ))
        return findings

    with open(config_path, encoding="utf-8") as fh:
        config = yaml.safe_load(fh) or {}

    wc_gates = config.get("word_count_gates", {})
    per_file_max = wc_gates.get("per_file_max")
    per_section_max = wc_gates.get("per_section_max")

    section_counts: dict[str, int] = {}
    for md in _iter_study_md(study_path):
        _, body = _strip_frontmatter(md.read_text(encoding="utf-8"))
        count = _count_words(body)
        rel = str(md.relative_to(study_path))

        if per_file_max and count > per_file_max:
            overage = count - per_file_max
            findings.append(Finding(
                "Major", "wordcount", rel,
                f"{count:,} words exceeds per-file cap of {per_file_max:,} (overage: {overage:,})",
                f"Reduce file to ≤{per_file_max:,} words",
            ))

        # Accumulate per-section totals (section = immediate parent directory name)
        section = md.parent.name
        section_counts[section] = section_counts.get(section, 0) + count

    if per_section_max:
        for section, total in section_counts.items():
            if total > per_section_max:
                overage = total - per_section_max
                findings.append(Finding(
                    "Major", "wordcount", f"study/{section}/",
                    f"Section total {total:,} words exceeds per-section cap of {per_section_max:,} (overage: {overage:,})",
                    f"Reduce section to ≤{per_section_max:,} words",
                ))

    return findings


# ─── CitationIntegrityGate ────────────────────────────────────────────────────

def _extract_bib_keys(bib_path: Path) -> set[str]:
    if not bib_path.exists():
        return set()
    text = bib_path.read_text(encoding="utf-8", errors="replace")
    return set(_BIBTEX_KEY_RE.findall(text))


def _extract_citations(text: str) -> list[str]:
    """Extract all citation keys from a markdown body."""
    keys = []
    for m in _CITE_RE.finditer(text):
        raw = m.group(1) or m.group(2) or m.group(3) or ""
        # Handle multi-key: [@key1; @key2]
        for part in re.split(r"[;,\s]+", raw):
            part = part.strip().lstrip("@")
            if part:
                keys.append(part)
    # Also match bare [@key] with pandoc-style
    for m in re.finditer(r"\[@([^\]@;,\s][^\]]*?)\]", text):
        for part in re.split(r"[;,\s@]+", m.group(1)):
            part = part.strip().lstrip("@")
            if part:
                keys.append(part)
    return keys


def run_citations(study_path: Path) -> list[Finding]:
    findings = []
    bib_path = study_path / "corpus" / "references.bib"
    bib_keys = _extract_bib_keys(bib_path)

    if not bib_path.exists():
        findings.append(Finding(
            "Minor", "citations", str(bib_path),
            "references.bib not found — citation checks skipped",
            "Create corpus/references.bib",
        ))
        return findings

    for md in _iter_study_md(study_path):
        _, body = _strip_frontmatter(md.read_text(encoding="utf-8"))
        rel = str(md.relative_to(study_path))
        seen: set[str] = set()
        for key in _extract_citations(body):
            if key in seen:
                continue
            seen.add(key)
            if key not in bib_keys:
                findings.append(Finding(
                    "Blocker", "citations", rel,
                    f"Unresolved citation key: '{key}'",
                    f"Add @misc{{{key}, ...}} to corpus/references.bib or fix the key",
                ))
    return findings


# ─── CrossCouplingConsistencyGate ─────────────────────────────────────────────

def run_crosscoupling(study_path: Path) -> list[Finding]:
    findings = []
    db_path = study_path / "cross_coupling.yaml"
    if not db_path.exists():
        findings.append(Finding(
            "Minor", "crosscoupling", str(db_path),
            "cross_coupling.yaml not found",
            "Create cross_coupling.yaml or run new_study.py",
        ))
        return findings

    with open(db_path, encoding="utf-8") as fh:
        data = yaml.safe_load(fh) or {}

    # Schema validation
    try:
        import jsonschema  # noqa: PLC0415
        with open(_SCHEMA_CC, encoding="utf-8") as fh:
            schema = yaml.safe_load(fh)
        jsonschema.validate(data, schema)
    except ImportError:
        findings.append(Finding("Minor", "crosscoupling", str(db_path),
                                "jsonschema not installed — schema validation skipped",
                                "pip install jsonschema"))
    except Exception as e:  # noqa: BLE001
        findings.append(Finding("Blocker", "crosscoupling", str(db_path),
                                f"cross_coupling.yaml schema invalid: {e}",
                                "Fix cross_coupling.yaml structure per schema"))

    # Unique param_ids
    entries = data.get("entries", [])
    seen_ids: set[str] = set()
    for entry in entries:
        pid = entry.get("param_id", "")
        if pid in seen_ids:
            findings.append(Finding(
                "Blocker", "crosscoupling", str(db_path),
                f"Duplicate param_id: '{pid}'",
                "Each param_id must be unique in the DB",
            ))
        seen_ids.add(pid)

    # study_id matches study-config.yaml
    config_path = study_path / "study-config.yaml"
    if config_path.exists():
        with open(config_path, encoding="utf-8") as fh:
            config = yaml.safe_load(fh) or {}
        db_study = data.get("study_id", "")
        cfg_study = config.get("study_id", "")
        if db_study and cfg_study and db_study != cfg_study:
            findings.append(Finding(
                "Major", "crosscoupling", str(db_path),
                f"cross_coupling.yaml study_id '{db_study}' ≠ study-config.yaml study_id '{cfg_study}'",
                "Align study_id values",
            ))

    return findings


# ─── Runner ──────────────────────────────────────────────────────────────────

_GATES = {
    "frontmatter": run_frontmatter,
    "wordcount": run_wordcount,
    "citations": run_citations,
    "crosscoupling": run_crosscoupling,
}


def run_gates(study_path: Path, gate_name: str | None = None) -> list[Finding]:
    gates = {gate_name: _GATES[gate_name]} if gate_name else _GATES
    all_findings: list[Finding] = []
    for name, fn in gates.items():
        results = fn(study_path)
        all_findings.extend(results)
    return all_findings


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="gates",
        description="Study gates — pre-commit and pre-handback validation",
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--study", metavar="STUDY_ID")
    group.add_argument("--study-path", metavar="PATH")
    parser.add_argument("--gate", default=None, choices=list(_GATES.keys()),
                        help="Run a single gate instead of all")
    args = parser.parse_args()

    study_path = _resolve_study_path(args.study, args.study_path)
    findings = run_gates(study_path, args.gate)

    if not findings:
        print(f"OK: all gates pass for {study_path}")
        sys.exit(0)

    blockers = [f for f in findings if f.severity == "Blocker"]
    majors = [f for f in findings if f.severity == "Major"]
    for f in findings:
        print(f)
        print()

    summary = f"{len(findings)} finding(s): {len(blockers)} Blocker, {len(majors)} Major"
    print(summary)
    sys.exit(1 if (blockers or majors) else 0)


if __name__ == "__main__":
    main()
