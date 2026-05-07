"""Tests for system.orchestration.meta_supervisor."""

import textwrap
from pathlib import Path

import pytest
import yaml

from system.orchestration.meta_supervisor import (
    generate_observation,
    validate_observation,
    load_observations,
    save_observations,
    append_observation,
    _detect_trend,
    _extract_section,
    _extract_bullets,
)


# ── Fixtures ───────────────────────────────────────────────────────────────────

FIXTURE_HANDBACK = textwrap.dedent("""
    ---
    title: "Cycle 1 Handback"
    study_id: test-study
    cycle: 1
    status: complete
    ---

    # Cycle 1 Handback

    ## Retro: What Worked in Cycle 1

    1. The base/overlay split worked correctly.
    2. Heritage-first sequencing established known-good anchors.

    ## Retro: What to Watch in Cycle 2

    1. Commercial case is the existential risk — must engage honestly.
    2. Debris scaling may be a hard constraint.

    ## Next Session Priorities

    1. Founder decisions on inclination and interface standard.
    2. Launch Cycle 2 with parallel agent dispatch.
""")


@pytest.fixture
def handback_file(tmp_path):
    p = tmp_path / "handback.md"
    p.write_text(FIXTURE_HANDBACK)
    return p


@pytest.fixture
def observations_file(tmp_path, monkeypatch):
    import system.orchestration.meta_supervisor as ms
    obs_path = tmp_path / "system-observations.yaml"
    monkeypatch.setattr(ms, "_observations_path", lambda: obs_path)
    return obs_path


# ── Section extraction ─────────────────────────────────────────────────────────

class TestExtractSection:
    def test_extracts_worked_section(self):
        result = _extract_section(FIXTURE_HANDBACK, r"what\s+worked")
        assert "base/overlay" in result

    def test_extracts_watch_section(self):
        result = _extract_section(FIXTURE_HANDBACK, r"what to watch")
        assert "commercial" in result.lower()

    def test_returns_empty_for_missing_heading(self):
        result = _extract_section(FIXTURE_HANDBACK, r"nonexistent heading xyz")
        assert result == ""


class TestExtractBullets:
    def test_extracts_numbered_list(self):
        text = "1. First item\n2. Second item\n3. Third item"
        bullets = _extract_bullets(text)
        assert len(bullets) == 3
        assert bullets[0] == "First item"

    def test_extracts_dash_list(self):
        text = "- Alpha\n- Beta"
        bullets = _extract_bullets(text)
        assert "Alpha" in bullets

    def test_returns_empty_for_plain_text(self):
        bullets = _extract_bullets("No lists here.")
        assert bullets == []


# ── Trend detection ────────────────────────────────────────────────────────────

class TestDetectTrend:
    def test_single_observation_is_flat(self):
        obs = [{"observations": {"failed": ["a", "b"]}}]
        assert _detect_trend(obs) == "flat"

    def test_fewer_failures_is_improving(self):
        obs = [
            {"observations": {"failed": ["a", "b", "c"]}},
            {"observations": {"failed": ["a", "b"]}},
            {"observations": {"failed": ["a"]}},
        ]
        assert _detect_trend(obs) == "improving"

    def test_more_failures_is_regressing(self):
        obs = [
            {"observations": {"failed": ["a"]}},
            {"observations": {"failed": ["a", "b"]}},
            {"observations": {"failed": ["a", "b", "c"]}},
        ]
        assert _detect_trend(obs) == "regressing"

    def test_same_failures_is_flat(self):
        obs = [
            {"observations": {"failed": ["a", "b"]}},
            {"observations": {"failed": ["c", "d"]}},
        ]
        assert _detect_trend(obs) == "flat"


# ── generate_observation ───────────────────────────────────────────────────────

class TestGenerateObservation:
    def test_returns_dict(self, handback_file):
        result = generate_observation("test-study", 1, handback_file)
        assert isinstance(result, dict)

    def test_observation_id_format(self, handback_file):
        result = generate_observation("test-study", 1, handback_file)
        assert result["observation_id"] == "test-study-cycle-1"

    def test_study_id_set(self, handback_file):
        result = generate_observation("test-study", 1, handback_file)
        assert result["study_id"] == "test-study"

    def test_worked_extracted(self, handback_file):
        result = generate_observation("test-study", 1, handback_file)
        assert len(result["observations"]["worked"]) >= 1
        assert any("overlay" in w.lower() or "heritage" in w.lower()
                   for w in result["observations"]["worked"])

    def test_failed_extracted(self, handback_file):
        result = generate_observation("test-study", 1, handback_file)
        assert len(result["observations"]["failed"]) >= 1

    def test_recommendations_extracted(self, handback_file):
        result = generate_observation("test-study", 1, handback_file)
        assert len(result["recommendations"]) >= 1

    def test_validates_against_schema(self, handback_file):
        result = generate_observation("test-study", 1, handback_file)
        errors = validate_observation(result)
        assert errors == []

    def test_lessons_delta_empty_when_no_prior(self, handback_file):
        result = generate_observation("test-study", 1, handback_file, existing=[])
        assert isinstance(result["lessons_delta"], list)


# ── validate_observation ───────────────────────────────────────────────────────

class TestValidateObservation:
    def _valid_obs(self):
        return {
            "observation_id": "test-cycle-1",
            "study_id": "test",
            "cycle_id": 1,
            "date": "2026-05-07",
            "observations": {"worked": ["x"], "failed": []},
            "lessons_delta": [],
            "trend": "flat",
            "recommendations": ["do something"],
        }

    def test_valid_observation_returns_no_errors(self):
        assert validate_observation(self._valid_obs()) == []

    def test_missing_field_returns_error(self):
        obs = self._valid_obs()
        del obs["trend"]
        errors = validate_observation(obs)
        assert any("trend" in e for e in errors)

    def test_invalid_trend_returns_error(self):
        obs = self._valid_obs()
        obs["trend"] = "unknown"
        errors = validate_observation(obs)
        assert any("trend" in e for e in errors)

    def test_bad_date_returns_error(self):
        obs = self._valid_obs()
        obs["date"] = "07-May-2026"
        errors = validate_observation(obs)
        assert any("date" in e for e in errors)


# ── load/save/append ───────────────────────────────────────────────────────────

class TestLoadSaveAppend:
    def test_load_empty_returns_empty_list(self, observations_file):
        result = load_observations()
        assert result == []

    def test_save_and_load_round_trips(self, observations_file):
        obs = [{
            "observation_id": "x-1",
            "study_id": "x",
            "cycle_id": 1,
            "date": "2026-05-07",
            "observations": {"worked": ["a"], "failed": []},
            "lessons_delta": [],
            "trend": "flat",
            "recommendations": ["r"],
        }]
        save_observations(obs)
        loaded = load_observations()
        assert len(loaded) == 1
        assert loaded[0]["observation_id"] == "x-1"

    def test_append_adds_entry(self, observations_file):
        obs = {
            "observation_id": "x-1",
            "study_id": "x",
            "cycle_id": 1,
            "date": "2026-05-07",
            "observations": {"worked": ["a"], "failed": []},
            "lessons_delta": [],
            "trend": "flat",
            "recommendations": ["r"],
        }
        append_observation(obs)
        loaded = load_observations()
        assert any(o["observation_id"] == "x-1" for o in loaded)

    def test_append_replaces_duplicate_id(self, observations_file):
        obs = {
            "observation_id": "x-1",
            "study_id": "x",
            "cycle_id": 1,
            "date": "2026-05-07",
            "observations": {"worked": ["a"], "failed": []},
            "lessons_delta": [],
            "trend": "flat",
            "recommendations": ["r"],
        }
        append_observation(obs)
        obs2 = dict(obs)
        obs2["trend"] = "improving"
        append_observation(obs2)
        loaded = load_observations()
        entries = [o for o in loaded if o["observation_id"] == "x-1"]
        assert len(entries) == 1
        assert entries[0]["trend"] == "improving"


# ── Integration: real Cycle 1 observation ─────────────────────────────────────

class TestRealObservations:
    def test_cycle1_orbital_observation_exists(self):
        obs = load_observations()
        ids = [o["observation_id"] for o in obs]
        assert "01-orbital-platform-cycle-1" in ids

    def test_lunar_backfill_exists(self):
        obs = load_observations()
        ids = [o["observation_id"] for o in obs]
        assert "lunar-humanoid-stage-08" in ids

    def test_all_observations_valid(self):
        obs = load_observations()
        for o in obs:
            errors = validate_observation(o)
            assert errors == [], f"{o.get('observation_id')}: {errors}"
