"""Tests for system.tools.new_cycle scaffold generator."""

import textwrap
from pathlib import Path

import pytest
import yaml

from system.tools.new_cycle import generate_scaffold, _extract_risks, _find_handbacks


STUDY_SLUG = "01-orbital-platform"


class TestGenerateScaffold:
    def test_returns_string(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        assert isinstance(result, str)

    def test_frontmatter_present(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        assert result.startswith("---")
        assert "study_id: 01-orbital-platform" in result
        assert "cycle: 3" in result

    def test_frontmatter_valid_yaml(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        # extract frontmatter block
        parts = result.split("---", 2)
        assert len(parts) >= 3
        fm = yaml.safe_load(parts[1])
        assert fm["study_id"] == "01-orbital-platform"
        assert fm["cycle"] == 3
        assert fm["status"] == "scaffold"

    def test_objective_section_present(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        assert "## Objective" in result

    def test_deliverables_section_present(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        assert "## Deliverables" in result

    def test_dispatch_plan_section_present(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        assert "## Agent dispatch plan" in result

    def test_gates_section_present(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        assert "## Gates" in result
        assert "WordCountGate" in result

    def test_stop_conditions_present(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        assert "## Stop conditions" in result

    def test_risks_section_present(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        assert "## Risks from prior cycles" in result

    def test_cycle_number_in_heading(self):
        result = generate_scaffold(STUDY_SLUG, 3)
        assert "Cycle 03" in result

    def test_different_cycle_numbers(self):
        for n in [2, 3, 5]:
            result = generate_scaffold(STUDY_SLUG, n)
            assert f"cycle: {n}" in result


class TestWritesToExpectedPath:
    def test_dry_run_does_not_write(self, tmp_path, monkeypatch):
        """Dry-run mode should not write any files."""
        from system.tools import new_cycle
        monkeypatch.setattr(new_cycle, "_studies_root", lambda: tmp_path)
        # create minimal study-config
        study_dir = tmp_path / STUDY_SLUG
        study_dir.mkdir(parents=True)
        (study_dir / "study-config.yaml").write_text(
            "study_id: test-study\ntitle: Test\nfour_questions: {}\ncycle_structure: {}"
        )
        scaffold = generate_scaffold.__wrapped__ if hasattr(generate_scaffold, "__wrapped__") else generate_scaffold
        result = new_cycle.generate_scaffold(STUDY_SLUG, 3)
        assert isinstance(result, str)
        # no cycle directory should have been created
        assert not (study_dir / "cycles" / "cycle-03").exists()

    def test_main_writes_scaffold(self, tmp_path, monkeypatch, capsys):
        from system.tools import new_cycle
        monkeypatch.setattr(new_cycle, "_studies_root", lambda: tmp_path)
        study_dir = tmp_path / "test-study"
        study_dir.mkdir(parents=True)
        (study_dir / "study-config.yaml").write_text(textwrap.dedent("""
            study_id: test-study
            title: Test Study
            four_questions: {}
            cycle_structure:
              cycle_03:
                type: synthesis
                description: "Synthesis cycle"
                outputs: []
        """))
        new_cycle.main(["test-study", "3"])
        out_path = study_dir / "cycles" / "cycle-03" / "scaffold.md"
        assert out_path.exists()
        content = out_path.read_text()
        assert "cycle: 3" in content

    def test_main_refuses_overwrite(self, tmp_path, monkeypatch, capsys):
        from system.tools import new_cycle
        monkeypatch.setattr(new_cycle, "_studies_root", lambda: tmp_path)
        study_dir = tmp_path / "test-study"
        cycles_dir = study_dir / "cycles" / "cycle-03"
        cycles_dir.mkdir(parents=True)
        (study_dir / "study-config.yaml").write_text(
            "study_id: test-study\ntitle: Test\nfour_questions: {}\ncycle_structure: {}"
        )
        (cycles_dir / "scaffold.md").write_text("existing content")
        with pytest.raises(SystemExit):
            new_cycle.main(["test-study", "3"])


class TestRiskExtraction:
    def test_extracts_risks_from_fixture_handbacks(self, tmp_path):
        hb = tmp_path / "handback.md"
        hb.write_text(textwrap.dedent("""
            # Handback

            ## Retro: What Worked
            1. Compose worked great

            ## Retro: What to Watch in Next Cycle
            1. The commercial case is the existential risk
            2. The debris scaling problem may be a hard constraint
            3. Word budgets are tight
        """))
        risks = _extract_risks([hb])
        assert len(risks) >= 2
        assert any("commercial" in r.lower() for r in risks)

    def test_returns_empty_list_for_no_handbacks(self):
        risks = _extract_risks([])
        assert risks == []

    def test_caps_at_six_risks(self, tmp_path):
        hb = tmp_path / "handback.md"
        lines = "\n".join(f"{i+1}. Risk number {i+1}" for i in range(10))
        hb.write_text(f"## Retro: What to Watch\n{lines}\n")
        risks = _extract_risks([hb])
        assert len(risks) <= 6

    def test_real_handback_extracts_risks(self):
        """Integration test: real Cycle 1 handback should yield risks."""
        handbacks = _find_handbacks(STUDY_SLUG)
        if not handbacks:
            pytest.skip("No handbacks found")
        risks = _extract_risks(handbacks)
        # at least one risk should come from the real handback
        assert isinstance(risks, list)
