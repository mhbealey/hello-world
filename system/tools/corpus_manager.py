"""
Citation corpus management tool.

Manages BibTeX corpora for space program studies. Supports adding,
verifying, deduplicating, and exporting citations.

Usage:
    python -m system.tools.corpus_manager --corpus <path/to/references.bib> add \
        --key iss_assembly_complete --type misc \
        --field title="International Space Station: Assembly Complete" \
        --field author="NASA" --field year=2011

    python -m system.tools.corpus_manager --corpus <path> verify --study <study_path>
    python -m system.tools.corpus_manager --corpus <path> duplicates
    python -m system.tools.corpus_manager --corpus <path> export --format apa
    python -m system.tools.corpus_manager --corpus <path> stats
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Iterator

# ── BibTeX parsing ─────────────────────────────────────────────────────────────

_ENTRY_RE = re.compile(
    r"@(\w+)\s*\{\s*([^,\s]+)\s*,\s*(.*?)\n\}",
    re.DOTALL,
)
_FIELD_RE = re.compile(
    r"(\w+)\s*=\s*(?:\{(.*?)\}|\"(.*?)\"|([\w\d]+))",
    re.DOTALL,
)

REQUIRED_FIELDS: dict[str, list[str]] = {
    "article": ["title", "author"],
    "book": ["title", "author"],
    "techreport": ["title", "institution"],
    "misc": ["title"],
    "inproceedings": ["title", "author", "booktitle"],
    "report": ["title"],
    "online": ["title", "url"],
}


def parse_bib(bib_text: str) -> list[dict]:
    """Parse BibTeX text and return list of entry dicts."""
    entries = []
    for m in _ENTRY_RE.finditer(bib_text):
        entry_type = m.group(1).lower()
        key = m.group(2).strip()
        fields_text = m.group(3)
        fields: dict[str, str] = {}
        for fm in _FIELD_RE.finditer(fields_text):
            fname = fm.group(1).lower()
            fval = fm.group(2) or fm.group(3) or fm.group(4) or ""
            # collapse whitespace in multi-line values
            fval = re.sub(r"\s+", " ", fval).strip()
            fields[fname] = fval
        entries.append({"key": key, "entry_type": entry_type, "fields": fields})
    return entries


def entry_to_bib(entry: dict) -> str:
    """Render a parsed entry dict back to BibTeX string."""
    lines = [f"@{entry['entry_type']}{{{entry['key']},"]
    for k, v in entry["fields"].items():
        lines.append(f"  {k} = {{{v}}},")
    lines.append("}")
    return "\n".join(lines)


# ── Validation ─────────────────────────────────────────────────────────────────

def validate_entry(entry: dict) -> list[str]:
    """Return list of validation errors for an entry dict."""
    errors: list[str] = []
    key = entry.get("key", "")
    if not key or not re.match(r"^[a-zA-Z0-9_:.\-]+$", key):
        errors.append(f"Invalid key: {key!r}")

    entry_type = entry.get("entry_type", "").lower()
    required = REQUIRED_FIELDS.get(entry_type, ["title"])
    fields = entry.get("fields", {})
    for req in required:
        if req not in fields or not fields[req].strip():
            errors.append(f"Missing required field '{req}' for @{entry_type}{{{key}}}")

    return errors


# ── Corpus file I/O ────────────────────────────────────────────────────────────

def load_corpus(corpus_path: Path) -> list[dict]:
    if not corpus_path.exists():
        return []
    return parse_bib(corpus_path.read_text())


def save_corpus(corpus_path: Path, entries: list[dict]) -> None:
    corpus_path.parent.mkdir(parents=True, exist_ok=True)
    lines = ["% BibTeX corpus managed by system/tools/corpus_manager.py", ""]
    for entry in entries:
        lines.append(entry_to_bib(entry))
        lines.append("")
    corpus_path.write_text("\n".join(lines))


# ── Core operations ────────────────────────────────────────────────────────────

def add_entry(corpus_path: Path, key: str, entry_type: str, fields: dict[str, str]) -> None:
    """Validate and append a new entry to the corpus. Raises ValueError on invalid input."""
    entry = {"key": key, "entry_type": entry_type.lower(), "fields": fields}
    errors = validate_entry(entry)
    if errors:
        raise ValueError(f"Entry validation failed: {errors}")

    entries = load_corpus(corpus_path)
    existing_keys = {e["key"] for e in entries}
    if key in existing_keys:
        raise ValueError(f"Key already exists: {key!r}")

    entries.append(entry)
    save_corpus(corpus_path, entries)


def verify_keys(corpus_path: Path, study_path: Path) -> dict[str, list[str]]:
    """
    Scan study markdown files for citation references and check against corpus.

    Returns dict with:
        'missing': keys referenced in text but not in corpus
        'present': keys referenced in text and present in corpus
        'unused': corpus keys not referenced anywhere in study
    """
    corpus = load_corpus(corpus_path)
    corpus_keys = {e["key"] for e in corpus}

    # Find all citation patterns: \cite{key}, [@key], [cite:key]
    cited: set[str] = set()
    for md_file in study_path.rglob("*.md"):
        text = md_file.read_text(errors="replace")
        cited.update(re.findall(r"\\cite\{([^}]+)\}", text))
        cited.update(re.findall(r"\[@([^\]]+)\]", text))
        cited.update(re.findall(r"\[cite:([^\]]+)\]", text))

    # Also scan .bib stubs in heritage-notes/
    notes_dir = study_path / "corpus" / "heritage-notes"
    if notes_dir.exists():
        for bib_file in notes_dir.glob("*.bib"):
            for entry in parse_bib(bib_file.read_text()):
                corpus_keys.add(entry["key"])

    missing = sorted(cited - corpus_keys)
    present = sorted(cited & corpus_keys)
    unused = sorted(corpus_keys - cited)

    return {"missing": missing, "present": present, "unused": unused}


def find_duplicates(corpus_path: Path) -> dict[str, list[int]]:
    """Return dict of key → list of line positions where key appears more than once."""
    entries = load_corpus(corpus_path)
    seen: dict[str, int] = {}
    duplicates: dict[str, list[int]] = {}
    for i, entry in enumerate(entries):
        key = entry["key"]
        if key in seen:
            if key not in duplicates:
                duplicates[key] = [seen[key]]
            duplicates[key].append(i)
        else:
            seen[key] = i
    return duplicates


def export_for_citation(corpus_path: Path, fmt: str = "apa") -> str:
    """Generate formatted citation list in apa, mla, or chicago style."""
    entries = load_corpus(corpus_path)
    lines: list[str] = []

    for entry in sorted(entries, key=lambda e: e["fields"].get("author", e["fields"].get("title", ""))):
        fields = entry["fields"]
        author = fields.get("author", "Unknown Author")
        title = fields.get("title", "Untitled")
        year = fields.get("year", "n.d.")
        journal = fields.get("journal", "")
        publisher = fields.get("publisher", fields.get("institution", fields.get("organization", "")))
        url = fields.get("url", "")
        doi = fields.get("doi", "")
        source = doi if doi else url

        if fmt == "apa":
            line = f"{author} ({year}). {title}."
            if journal:
                line += f" *{journal}*."
            elif publisher:
                line += f" {publisher}."
            if source:
                line += f" {source}"
        elif fmt == "mla":
            line = f'{author}. "{title}."'
            if journal:
                line += f" *{journal}*,"
            if year:
                line += f" {year}."
            if source:
                line += f" {source}."
        elif fmt == "chicago":
            line = f'{author}. "{title}."'
            if journal:
                line += f" *{journal}*"
            if year:
                line += f" ({year})."
            if source:
                line += f" {source}."
        else:
            raise ValueError(f"Unknown format: {fmt!r}. Use apa, mla, or chicago.")

        lines.append(line)

    return "\n\n".join(lines)


def stats(corpus_path: Path) -> dict:
    """Return corpus statistics."""
    entries = load_corpus(corpus_path)
    by_type: dict[str, int] = {}
    for e in entries:
        et = e["entry_type"]
        by_type[et] = by_type.get(et, 0) + 1
    return {"total": len(entries), "by_type": by_type}


# ── CLI ────────────────────────────────────────────────────────────────────────

def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Corpus manager for study citations.")
    parser.add_argument("--corpus", required=True, help="Path to references.bib")

    sub = parser.add_subparsers(dest="command", required=True)

    # add
    add_p = sub.add_parser("add", help="Add an entry to the corpus")
    add_p.add_argument("--key", required=True)
    add_p.add_argument("--type", dest="entry_type", required=True)
    add_p.add_argument("--field", action="append", metavar="KEY=VALUE", default=[])

    # verify
    ver_p = sub.add_parser("verify", help="Check study citations against corpus")
    ver_p.add_argument("--study", required=True, help="Path to study root")

    # duplicates
    sub.add_parser("duplicates", help="Find duplicate keys")

    # export
    exp_p = sub.add_parser("export", help="Export formatted citations")
    exp_p.add_argument("--format", choices=["apa", "mla", "chicago"], default="apa")
    exp_p.add_argument("--out", help="Output file path (default: stdout)")

    # stats
    sub.add_parser("stats", help="Corpus statistics")

    args = parser.parse_args(argv)
    corpus_path = Path(args.corpus)

    if args.command == "add":
        fields: dict[str, str] = {}
        for item in args.field:
            if "=" not in item:
                print(f"ERROR: --field must be KEY=VALUE, got: {item!r}", file=sys.stderr)
                sys.exit(1)
            k, _, v = item.partition("=")
            fields[k.strip()] = v.strip()
        try:
            add_entry(corpus_path, args.key, args.entry_type, fields)
            print(f"Added: {args.key}")
        except ValueError as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(1)

    elif args.command == "verify":
        result = verify_keys(corpus_path, Path(args.study))
        print(f"Cited and present: {len(result['present'])}")
        if result["missing"]:
            print(f"MISSING ({len(result['missing'])}):")
            for k in result["missing"]:
                print(f"  {k}")
        else:
            print("No missing keys.")
        if result["unused"]:
            print(f"Unused corpus keys: {len(result['unused'])}")

    elif args.command == "duplicates":
        dupes = find_duplicates(corpus_path)
        if dupes:
            print(f"Duplicate keys ({len(dupes)}):")
            for k, positions in dupes.items():
                print(f"  {k}: entries {positions}")
        else:
            print("No duplicates found.")

    elif args.command == "export":
        output = export_for_citation(corpus_path, args.format)
        if args.out:
            Path(args.out).write_text(output)
            print(f"Exported to {args.out}")
        else:
            print(output)

    elif args.command == "stats":
        s = stats(corpus_path)
        print(f"Total entries: {s['total']}")
        for et, count in sorted(s["by_type"].items()):
            print(f"  @{et}: {count}")


if __name__ == "__main__":
    main()
