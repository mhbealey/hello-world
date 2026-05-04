import os
import sys

import pytest

# Allow running from repo root without installing the package
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from system.tools.cross_coupling_db import find_entry, load, resolve_db

FIXTURE = os.path.join(os.path.dirname(__file__), "fixtures", "cross_coupling_fixture.yaml")
ARCHIVE_DB = os.path.join(
    os.path.dirname(__file__), "..", "..",
    "studies", "archive", "lunar-humanoid-pathfinder", "cross_coupling.yaml",
)


def test_get_value_returns_correct_string():
    """get on a known param_id returns the expected value string."""
    data = load(FIXTURE)
    entry = find_entry(data, "form_factor")
    assert entry is not None
    assert "75 kg" in entry["value"]
    assert entry["set_by"] == "humanoid-systems-architect"


def test_list_returns_all_entries():
    """All entries in the fixture are accessible by param_id."""
    data = load(FIXTURE)
    entries = data["entries"]
    param_ids = [e["param_id"] for e in entries]
    assert "form_factor" in param_ids
    assert "supervisor_ratio" in param_ids
    assert len(entries) == 2


def test_find_entry_returns_none_for_missing_param():
    """find_entry returns None when param_id does not exist."""
    data = load(FIXTURE)
    assert find_entry(data, "nonexistent_param") is None


def test_archive_db_has_expected_entries():
    """Migrated archive DB contains all 23 expected entries."""
    data = load(ARCHIVE_DB)
    assert data["study_id"] == "lunar-humanoid-pathfinder"
    param_ids = {e["param_id"] for e in data["entries"]}
    required = {
        "autonomy_trl_curve",
        "form_factor",
        "mass_power_budget_closure",
        "supervisor_ratio",
        "crew_composition_ioc",
        "latency_architecture",
        "task_allocation_ioc",
        "human_value_floor",
    }
    missing = required - param_ids
    assert not missing, f"Missing param_ids in archive DB: {missing}"
    assert len(data["entries"]) == 23
