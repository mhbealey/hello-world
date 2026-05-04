import os
import sys
from pathlib import Path

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from system.tools.gates import (
    run_crosscoupling,
    run_citations,
    run_frontmatter,
    run_wordcount,
)

FIXTURE = Path(__file__).parent / "fixtures" / "gates" / "study"
ARCHIVE = Path(__file__).parent.parent.parent / "studies" / "archive" / "lunar-humanoid-pathfinder"


# ─── FrontmatterValidator ────────────────────────────────────────────────────

def test_frontmatter_valid_file_no_blocker():
    findings = run_frontmatter(FIXTURE)
    blockers = [f for f in findings if f.severity == "Blocker"
                and "no_frontmatter" not in f.path]
    assert not blockers, f"Unexpected Blocker on valid file: {blockers}"


def test_frontmatter_missing_triggers_finding():
    findings = run_frontmatter(FIXTURE)
    no_fm = [f for f in findings if "no_frontmatter" in f.path]
    assert no_fm, "Expected at least one finding for the no-frontmatter fixture file"


# ─── WordCountGate ────────────────────────────────────────────────────────────

def test_wordcount_under_cap_no_finding():
    findings = run_wordcount(FIXTURE)
    # Our fixture file is well under 1000 words — no Major expected
    majors = [f for f in findings if f.severity in ("Blocker", "Major")]
    assert not majors, f"Unexpected wordcount Major on fixture: {majors}"


def test_wordcount_archive_runs_without_crash():
    # Archive may not have study-config.yaml (moved to new location); just verify no exception
    findings = run_wordcount(ARCHIVE)
    assert isinstance(findings, list)


# ─── CitationIntegrityGate ────────────────────────────────────────────────────

def test_citations_valid_key_no_blocker():
    findings = run_citations(FIXTURE)
    # TestKey2024 exists in the fixture bib — overview.md citation should pass
    blockers = [f for f in findings if f.severity == "Blocker"]
    assert not blockers, f"Unexpected Blocker for valid citation: {blockers}"


def test_citations_missing_key_detected(tmp_path):
    # Create a study with a broken citation
    (tmp_path / "study" / "01-test").mkdir(parents=True)
    (tmp_path / "corpus").mkdir()
    (tmp_path / "corpus" / "references.bib").write_text(
        "@misc{RealKey2024, author={A}, title={B}, year={2024}}\n"
    )
    (tmp_path / "study" / "01-test" / "page.md").write_text(
        "---\ntitle: T\nstatus: draft\nlast-updated: 2026-01-01\n---\n\nSee [@GhostKey].\n"
    )
    findings = run_citations(tmp_path)
    unresolved = [f for f in findings if "GhostKey" in f.message]
    assert unresolved, "Expected a Blocker for unresolved citation key GhostKey"


# ─── CrossCouplingConsistencyGate ─────────────────────────────────────────────

def test_crosscoupling_valid_db_no_blocker():
    findings = run_crosscoupling(FIXTURE)
    blockers = [f for f in findings if f.severity == "Blocker"]
    assert not blockers, f"Unexpected Blocker on valid fixture DB: {blockers}"


def test_crosscoupling_duplicate_param_id(tmp_path):
    (tmp_path / "cross_coupling.yaml").write_text(
        "study_id: dup-test\nlast_updated: '2026-01-01'\n"
        "entries:\n"
        "  - param_id: same_id\n    parameter: X\n    date: '2026-01-01'\n"
        "    value: A\n    set_by: agent\n    affects: [other]\n    basis: X\n"
        "  - param_id: same_id\n    parameter: Y\n    date: '2026-01-01'\n"
        "    value: B\n    set_by: agent\n    affects: [other]\n    basis: Y\n"
    )
    findings = run_crosscoupling(tmp_path)
    dups = [f for f in findings if "Duplicate" in f.message]
    assert dups, "Expected Blocker for duplicate param_id"


def test_crosscoupling_archive_db_passes():
    findings = run_crosscoupling(ARCHIVE)
    blockers = [f for f in findings if f.severity == "Blocker"]
    assert not blockers, f"Archive cross_coupling.yaml has Blockers: {blockers}"
