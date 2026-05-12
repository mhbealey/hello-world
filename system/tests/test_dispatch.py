"""Tests for system.orchestration.dispatch."""

import textwrap
from pathlib import Path

import pytest
import yaml

from system.orchestration.dispatch import (
    AgentTask,
    DispatchResult,
    classify_failure,
    dispatch_cycle,
    load_scaffold,
    parse_dispatch_plan,
    resolve_dependencies,
    should_spawn_helper,
    spawn_helper,
)

STUDY_SLUG = "01-orbital-platform"

FIXTURE_SCAFFOLD = textwrap.dedent("""
    ---
    title: "Test Scaffold"
    study_id: test
    cycle: 99
    status: founder-approved
    last-updated: 2026-05-07
    ---

    # Test Scaffold

    ## Agent dispatch plan

    | agent-id | description | output | word cap |
    |----------|-------------|--------|----------|
    | teleoperation-latency | Latency analysis | `02-question-b/comms.md` | 2,000 |
    | cost-program | Cost estimate | `03-question-c/econ.md` | 3,000 |

    ## Gates

    WordCountGate
""")

FIXTURE_STUDY_CONFIG = textwrap.dedent("""
    study_id: test-study
    title: Test Study
    domain: orbital-platform
    four_questions:
      a:
        label: Architecture
        primary_agents:
          - integrator-systems-architect
        word_budget: 3000
        output_path: 01-question-a/
    cycle_structure: {}
""")


# ── load_scaffold ──────────────────────────────────────────────────────────────

class TestLoadScaffold:
    def test_loads_real_scaffold(self):
        scaffold = load_scaffold(STUDY_SLUG, 2)
        assert "frontmatter" in scaffold
        assert scaffold["frontmatter"]["cycle"] == 2

    def test_raises_for_missing_scaffold(self):
        with pytest.raises(FileNotFoundError):
            load_scaffold("nonexistent-study", 99)


# ── parse_dispatch_plan ────────────────────────────────────────────────────────

class TestParseDispatchPlan:
    def test_parses_table_entries(self):
        config = {}
        tasks = parse_dispatch_plan(FIXTURE_SCAFFOLD, config)
        agent_ids = [t.agent_id for t in tasks]
        assert "teleoperation-latency" in agent_ids
        assert "cost-program" in agent_ids

    def test_parses_word_budget(self):
        config = {}
        tasks = parse_dispatch_plan(FIXTURE_SCAFFOLD, config)
        latency = next(t for t in tasks if t.agent_id == "teleoperation-latency")
        assert latency.word_budget == 2000

    def test_falls_back_to_study_config(self, tmp_path):
        config = yaml.safe_load(FIXTURE_STUDY_CONFIG)
        empty_scaffold = "---\ntitle: x\ncycle: 1\nstatus: scaffold\nlast-updated: 2026-01-01\n---\n# No table\n"
        tasks = parse_dispatch_plan(empty_scaffold, config)
        agent_ids = [t.agent_id for t in tasks]
        assert "integrator-systems-architect" in agent_ids

    def test_real_cycle2_scaffold_parses(self):
        scaffold = load_scaffold(STUDY_SLUG, 2)
        config_path = Path("studies/active/01-orbital-platform/study-config.yaml")
        config = yaml.safe_load(config_path.read_text()) if config_path.exists() else {}
        tasks = parse_dispatch_plan(scaffold["text"], config)
        assert len(tasks) > 0


# ── resolve_dependencies ───────────────────────────────────────────────────────

class TestResolveDependencies:
    def test_single_batch_returns_one_wave(self):
        tasks = [
            AgentTask("agent-a", "out/a.md", batch="1"),
            AgentTask("agent-b", "out/b.md", batch="1"),
        ]
        waves = resolve_dependencies(tasks)
        assert len(waves) == 1
        assert len(waves[0]) == 2

    def test_two_batches_returns_two_waves(self):
        tasks = [
            AgentTask("agent-a", "out/a.md", batch="1"),
            AgentTask("agent-b", "out/b.md", batch="2"),
        ]
        waves = resolve_dependencies(tasks)
        assert len(waves) == 2

    def test_agents_in_same_batch_are_parallel(self):
        tasks = [
            AgentTask("a", "a.md", batch="1"),
            AgentTask("b", "b.md", batch="1"),
            AgentTask("c", "c.md", batch="1"),
        ]
        waves = resolve_dependencies(tasks)
        assert len(waves[0]) == 3


# ── Helper spawn protocol ──────────────────────────────────────────────────────

class TestHelperSpawnProtocol:
    def test_no_helper_before_threshold(self):
        assert should_spawn_helper(60.0, has_output=False) is False

    def test_helper_triggered_after_threshold_with_no_output(self):
        assert should_spawn_helper(100.0, has_output=False) is True

    def test_no_helper_if_has_output(self):
        assert should_spawn_helper(100.0, has_output=True) is False

    def test_spawn_helper_returns_event(self):
        event = spawn_helper("cost-program", "decompose revenue model section")
        assert event.parent_agent == "cost-program"
        assert event.read_only is True
        assert event.max_duration_s == 60
        assert event.spawned_at


# ── Failure classification ────────────────────────────────────────────────────

class TestFailureClassification:
    def test_timeout_failure_mode(self):
        r = DispatchResult("agent-a", "timeout")
        r = classify_failure(r, "")
        assert r.failure_mode == "timeout"
        assert r.failure_detail

    def test_partial_output_mode(self):
        r = DispatchResult("agent-a", "failed")
        long_text = " ".join(["word"] * 100)
        r = classify_failure(r, long_text)
        assert r.failure_mode == "partial_output"
        assert "partial" in r.failure_detail.lower()

    def test_error_mode_no_output(self):
        r = DispatchResult("agent-a", "failed")
        r = classify_failure(r, "")
        assert r.failure_mode == "error"

    def test_failure_detail_is_not_none(self):
        for status in ("timeout", "failed"):
            r = DispatchResult("x", status)
            r = classify_failure(r, "")
            assert r.failure_detail is not None


# ── dispatch_cycle (dry run) ───────────────────────────────────────────────────

class TestDispatchCycleDryRun:
    def test_dry_run_returns_report(self):
        report = dispatch_cycle(STUDY_SLUG, 2, dry_run=True)
        assert report.study_id == STUDY_SLUG
        assert report.cycle == 2

    def test_dry_run_queues_agents(self):
        report = dispatch_cycle(STUDY_SLUG, 2, dry_run=True)
        statuses = [r.status for r in report.results]
        assert "queued" in statuses or "failed" in statuses

    def test_dry_run_does_not_write_session_log(self):
        log_path = Path("studies/active/01-orbital-platform/retro/session-logs.yaml")
        before_size = log_path.stat().st_size if log_path.exists() else 0
        dispatch_cycle(STUDY_SLUG, 2, dry_run=True)
        after_size = log_path.stat().st_size if log_path.exists() else 0
        assert after_size == before_size

    def test_dry_run_has_session_log_entry(self):
        report = dispatch_cycle(STUDY_SLUG, 2, dry_run=True)
        assert report.session_log_entry is not None
        assert report.session_log_entry["dry_run"] is True

    def test_live_dispatch_executes_and_logs(self, monkeypatch):
        """Live dispatch invokes claude CLI and logs results — never silently absorbed.
        Uses monkeypatch to mock subprocess so no real API calls are made in tests.
        """
        import subprocess
        import system.orchestration.dispatch as d

        # Mock shutil.which to return a fake claude path
        monkeypatch.setattr("shutil.which", lambda name: "/usr/bin/claude" if name == "claude" else None)

        # Mock subprocess.run to return fake successful output
        fake_result = subprocess.CompletedProcess(
            args=[],
            returncode=0,
            stdout="Mock agent output for testing purposes. " * 50,
            stderr="",
        )
        monkeypatch.setattr("subprocess.run", lambda *a, **kw: fake_result)

        report = dispatch_cycle(STUDY_SLUG, 2, dry_run=False, agent_filter="destinations-trajectories")

        # At least one result should be present
        assert len(report.results) >= 1
        # Results must have status set — never silently absorbed
        for r in report.results:
            assert r.status is not None
            if r.status == "failed":
                assert r.failure_mode is not None
                assert r.failure_detail is not None

    def test_unapproved_scaffold_raises(self, tmp_path, monkeypatch):
        import system.orchestration.dispatch as d
        monkeypatch.setattr(d, "_studies_root", lambda: tmp_path)
        study_dir = tmp_path / "test-study"
        scaffold_dir = study_dir / "cycles" / "cycle-01"
        scaffold_dir.mkdir(parents=True)
        (study_dir / "study-config.yaml").write_text(
            "study_id: test\ndomain: orbital-platform\nfour_questions: {}\ncycle_structure: {}"
        )
        (scaffold_dir / "scaffold.md").write_text(
            "---\ntitle: x\ncycle: 1\nstatus: scaffold\nlast-updated: 2026-01-01\n---\n# x\n"
        )
        with pytest.raises(ValueError, match="founder-approved"):
            dispatch_cycle("test-study", 1, dry_run=False)
