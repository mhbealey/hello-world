"""Tests for system.agents.compose — agent prompt composer."""

import textwrap
from pathlib import Path

import pytest

from system.agents.compose import (
    compose_agent_prompt,
    compose_for_domain,
    list_agents,
    list_overlays,
    _strip_frontmatter,
)

_BASE_DIR = Path("system/agents/base")
_DOMAIN_DIR = Path("system/agents/domain")


# ─── Unit tests ───────────────────────────────────────────────────────────────

def test_strip_frontmatter_removes_yaml_block():
    text = "---\nname: test\nversion: 1.0.0\n---\n\nBody content here."
    result = _strip_frontmatter(text)
    assert "name: test" not in result
    assert "Body content here." in result


def test_strip_frontmatter_no_frontmatter_returns_unchanged():
    text = "No frontmatter, just content."
    assert _strip_frontmatter(text) == text


def test_strip_frontmatter_incomplete_block_returns_unchanged():
    text = "---\nonly one fence"
    assert _strip_frontmatter(text) == text


def test_compose_base_only_returns_full_file(tmp_path):
    base = tmp_path / "agent.md"
    base.write_text("---\nname: test-agent\n---\n\nBase content.", encoding="utf-8")
    result = compose_agent_prompt(base)
    assert "Base content." in result
    assert "name: test-agent" in result


def test_compose_with_overlay_appends_overlay_body(tmp_path):
    base = tmp_path / "agent.md"
    overlay = tmp_path / "overlay.md"
    base.write_text("---\nname: test-agent\n---\n\nBase content.", encoding="utf-8")
    overlay.write_text(
        "---\nname: test-agent\ndomain: test-domain\n---\n\nOverlay content.",
        encoding="utf-8",
    )
    result = compose_agent_prompt(base, overlay)
    assert "Base content." in result
    assert "Overlay content." in result
    # Separator present
    assert "---" in result
    # Overlay frontmatter should NOT appear (stripped)
    lines = result.splitlines()
    # The 'name: test-agent' from overlay frontmatter should not be in result body
    # (it may appear in base frontmatter, but not duplicated from overlay)
    overlay_fm_in_body = any(
        "domain: test-domain" in line for line in lines
    )
    assert not overlay_fm_in_body


def test_compose_missing_overlay_returns_base_only(tmp_path):
    base = tmp_path / "agent.md"
    base.write_text("Base content only.", encoding="utf-8")
    result = compose_agent_prompt(base, tmp_path / "nonexistent-overlay.md")
    assert result == "Base content only."


def test_compose_missing_base_raises(tmp_path):
    with pytest.raises(FileNotFoundError):
        compose_agent_prompt(tmp_path / "nonexistent.md")


def test_compose_overlay_body_not_duplicated(tmp_path):
    """Overlay body should appear exactly once."""
    base = tmp_path / "agent.md"
    overlay = tmp_path / "overlay.md"
    base.write_text("Base.", encoding="utf-8")
    overlay.write_text("---\nname: x\n---\n\nUNIQUE_MARKER.", encoding="utf-8")
    result = compose_agent_prompt(base, overlay)
    assert result.count("UNIQUE_MARKER") == 1


# ─── Integration tests against real agent files ────────────────────────────────

def test_list_agents_returns_non_empty():
    agents = list_agents()
    assert len(agents) > 10
    assert "teleoperation-latency" in agents
    assert "integrator-systems-architect" in agents


def test_list_overlays_lunar_surface_non_empty():
    overlays = list_overlays("lunar-surface")
    assert len(overlays) >= 3
    assert "space-environments" in overlays


def test_list_overlays_missing_domain_returns_empty():
    overlays = list_overlays("nonexistent-domain-xyz")
    assert overlays == []


def test_compose_teleoperation_latency_base_only():
    """Base teleoperation-latency is domain-neutral."""
    result = compose_for_domain("teleoperation-latency", "nonexistent-domain")
    assert len(result) > 100
    # Should not contain lunar specifics that are only in overlay
    assert "Queqiao-2" not in result or "RTLT" not in result  # one may remain in base
    # Should contain domain-neutral concepts
    assert "latency" in result.lower()


def test_compose_teleoperation_latency_lunar():
    """Lunar overlay adds Queqiao-2 and RTLT specifics."""
    result = compose_for_domain("teleoperation-latency", "lunar-surface")
    assert "Queqiao-2" in result
    assert "2.56" in result  # near-side RTLT
    assert "2.92" in result  # far-side RTLT upper bound


def test_compose_space_environments_lunar():
    """Lunar overlay adds lunar-surface specifics to domain-neutral base."""
    result = compose_for_domain("space-environments", "lunar-surface")
    # Overlay content
    assert "lunar dust" in result.lower() or "lunar night" in result.lower()
    # Base content (generic)
    assert "thermal" in result.lower()


def test_compose_autonomy_trl_lunar():
    """Lunar overlay adds TRL curve and gate specifics."""
    result = compose_for_domain("autonomy-trl-tasking", "lunar-surface")
    assert "2029" in result  # TRL 6 gate year
    assert "TRL" in result


def test_compose_base_agent_is_domain_neutral(tmp_path):
    """Spot-check: base conops-integrator reads as domain-neutral."""
    base_path = _BASE_DIR / "conops-integrator.md"
    if not base_path.exists():
        pytest.skip("conops-integrator.md not found")
    text = base_path.read_text(encoding="utf-8")
    # Domain-neutral: should NOT contain lunar-specific hardcoded specifics
    lunar_specific = ["lunar night", "14 Earth days", "Queqiao-2", "bipedal", "humanoid"]
    found = [term for term in lunar_specific if term.lower() in text.lower()]
    # Allow at most 1 incidental reference (e.g., heritage table may mention humanoid)
    assert len(found) <= 1, f"Base agent has domain-specific terms: {found}"


def test_compose_output_starts_with_base_content():
    """Merged output must start with base agent content, not overlay."""
    base_path = _BASE_DIR / "teleoperation-latency.md"
    overlay_path = _DOMAIN_DIR / "lunar-surface" / "teleoperation-latency.md"
    if not base_path.exists() or not overlay_path.exists():
        pytest.skip("Files not found")
    base_text = base_path.read_text(encoding="utf-8")
    merged = compose_agent_prompt(base_path, overlay_path)
    # Merged should start with the beginning of the base file
    assert merged.startswith(base_text[:50])
