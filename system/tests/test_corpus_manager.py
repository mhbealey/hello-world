"""Tests for system.tools.corpus_manager."""

import textwrap
from pathlib import Path

import pytest

from system.tools.corpus_manager import (
    add_entry,
    export_for_citation,
    find_duplicates,
    load_corpus,
    parse_bib,
    save_corpus,
    stats,
    validate_entry,
    verify_keys,
)

ORBITAL_CORPUS = Path("studies/active/01-orbital-platform/corpus/references.bib")
LUNAR_CORPUS = Path("studies/archive/lunar-humanoid-pathfinder/corpus/references.bib")

FIXTURE_BIB = textwrap.dedent("""
    @misc{key_one,
      title = {First Entry},
      author = {Smith, J.},
      year = {2020},
    }

    @article{key_two,
      title = {Second Entry},
      author = {Jones, A.},
      journal = {Science},
      year = {2021},
    }

    @misc{key_one,
      title = {Duplicate of key_one},
      author = {Smith, J.},
    }
""")


# ── parse_bib ──────────────────────────────────────────────────────────────────

class TestParseBib:
    def test_parses_misc_entry(self):
        bib = "@misc{k1,\n  title = {Test},\n  author = {A},\n}\n"
        entries = parse_bib(bib)
        assert len(entries) == 1
        assert entries[0]["key"] == "k1"
        assert entries[0]["entry_type"] == "misc"

    def test_parses_article_entry(self):
        bib = "@article{k2,\n  title = {Art},\n  author = {B},\n  journal = {J},\n}\n"
        entries = parse_bib(bib)
        assert entries[0]["entry_type"] == "article"
        assert entries[0]["fields"]["journal"] == "J"

    def test_parses_multiple_entries(self):
        entries = parse_bib(FIXTURE_BIB)
        assert len(entries) == 3

    def test_empty_returns_empty_list(self):
        assert parse_bib("") == []
        assert parse_bib("% just a comment\n") == []


# ── validate_entry ─────────────────────────────────────────────────────────────

class TestValidateEntry:
    def test_valid_misc_returns_no_errors(self):
        e = {"key": "k1", "entry_type": "misc", "fields": {"title": "T"}}
        assert validate_entry(e) == []

    def test_valid_article_returns_no_errors(self):
        e = {"key": "k2", "entry_type": "article",
             "fields": {"title": "T", "author": "A"}}
        assert validate_entry(e) == []

    def test_missing_title_returns_error(self):
        e = {"key": "k1", "entry_type": "misc", "fields": {}}
        errors = validate_entry(e)
        assert any("title" in err for err in errors)

    def test_invalid_key_returns_error(self):
        e = {"key": "bad key!", "entry_type": "misc", "fields": {"title": "T"}}
        errors = validate_entry(e)
        assert any("key" in err.lower() for err in errors)

    def test_techreport_requires_institution(self):
        e = {"key": "k1", "entry_type": "techreport", "fields": {"title": "T"}}
        errors = validate_entry(e)
        assert any("institution" in err for err in errors)


# ── add_entry ──────────────────────────────────────────────────────────────────

class TestAddEntry:
    def test_adds_new_entry(self, tmp_path):
        corpus = tmp_path / "refs.bib"
        add_entry(corpus, "new_key", "misc", {"title": "New Entry"})
        entries = load_corpus(corpus)
        assert any(e["key"] == "new_key" for e in entries)

    def test_rejects_duplicate_key(self, tmp_path):
        corpus = tmp_path / "refs.bib"
        add_entry(corpus, "k1", "misc", {"title": "First"})
        with pytest.raises(ValueError, match="already exists"):
            add_entry(corpus, "k1", "misc", {"title": "Second"})

    def test_rejects_invalid_entry(self, tmp_path):
        corpus = tmp_path / "refs.bib"
        with pytest.raises(ValueError):
            add_entry(corpus, "k1", "techreport", {"title": "T"})  # missing institution


# ── find_duplicates ────────────────────────────────────────────────────────────

class TestFindDuplicates:
    def test_detects_duplicates(self, tmp_path):
        corpus = tmp_path / "refs.bib"
        corpus.write_text(FIXTURE_BIB)
        dupes = find_duplicates(corpus)
        assert "key_one" in dupes

    def test_clean_corpus_returns_empty(self, tmp_path):
        corpus = tmp_path / "refs.bib"
        bib = "@misc{k1,\n  title = {T},\n}\n@misc{k2,\n  title = {U},\n}\n"
        corpus.write_text(bib)
        assert find_duplicates(corpus) == {}


# ── verify_keys ────────────────────────────────────────────────────────────────

class TestVerifyKeys:
    def test_finds_missing_key(self, tmp_path):
        corpus = tmp_path / "refs.bib"
        corpus.write_text("@misc{present_key,\n  title = {T},\n}\n")
        md = tmp_path / "doc.md"
        md.write_text("See \\cite{present_key} and \\cite{missing_key}.")
        result = verify_keys(corpus, tmp_path)
        assert "missing_key" in result["missing"]
        assert "present_key" in result["present"]

    def test_detects_at_citation_syntax(self, tmp_path):
        corpus = tmp_path / "refs.bib"
        corpus.write_text("@misc{iss_ref,\n  title = {ISS},\n}\n")
        md = tmp_path / "doc.md"
        md.write_text("Per [@iss_ref] the ISS has...")
        result = verify_keys(corpus, tmp_path)
        assert "iss_ref" in result["present"]

    def test_no_citations_returns_empty_missing(self, tmp_path):
        corpus = tmp_path / "refs.bib"
        corpus.write_text("@misc{k1,\n  title = {T},\n}\n")
        md = tmp_path / "doc.md"
        md.write_text("No citations here.")
        result = verify_keys(corpus, tmp_path)
        assert result["missing"] == []


# ── export_for_citation ────────────────────────────────────────────────────────

class TestExportForCitation:
    def _make_corpus(self, tmp_path):
        corpus = tmp_path / "refs.bib"
        corpus.write_text(
            "@misc{k1,\n  title = {Alpha},\n  author = {Smith, J.},\n  year = {2020},\n}\n"
            "@article{k2,\n  title = {Beta},\n  author = {Jones, A.},\n  year = {2021},\n  journal = {Science},\n}\n"
        )
        return corpus

    def test_apa_export_contains_title(self, tmp_path):
        corpus = self._make_corpus(tmp_path)
        output = export_for_citation(corpus, "apa")
        assert "Alpha" in output

    def test_mla_export_works(self, tmp_path):
        corpus = self._make_corpus(tmp_path)
        output = export_for_citation(corpus, "mla")
        assert "Beta" in output

    def test_chicago_export_works(self, tmp_path):
        corpus = self._make_corpus(tmp_path)
        output = export_for_citation(corpus, "chicago")
        assert "2020" in output or "2021" in output

    def test_unknown_format_raises(self, tmp_path):
        corpus = self._make_corpus(tmp_path)
        with pytest.raises(ValueError):
            export_for_citation(corpus, "harvard")


# ── Integration: real corpora ─────────────────────────────────────────────────

class TestRealCorpora:
    def test_orbital_corpus_has_20_plus_entries(self):
        s = stats(ORBITAL_CORPUS)
        assert s["total"] >= 20

    def test_orbital_corpus_no_duplicates(self):
        dupes = find_duplicates(ORBITAL_CORPUS)
        assert dupes == {}

    def test_orbital_corpus_all_entries_valid(self):
        entries = load_corpus(ORBITAL_CORPUS)
        for entry in entries:
            errors = validate_entry(entry)
            assert errors == [], f"{entry['key']}: {errors}"

    def test_lunar_corpus_loads(self):
        entries = load_corpus(LUNAR_CORPUS)
        assert len(entries) >= 20

    def test_lunar_corpus_no_duplicates(self):
        dupes = find_duplicates(LUNAR_CORPUS)
        assert dupes == {}
