import os
import sys
import tempfile
from pathlib import Path

import pytest
import yaml

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from system.tools.assumption_registry import (
    cmd_add,
    cmd_get,
    cmd_init,
    cmd_list,
    cmd_next_id,
    find_entry,
    load,
    resolve_db,
)
import argparse


def _init_db(tmp_path: Path, study_id: str = "test-study") -> str:
    db = str(tmp_path / "assumption_registry.yaml")
    cmd_init(argparse.Namespace(db=db, study_id=study_id, force=False))
    return db


def _add(db: str, name: str = "test-assumption", risk: str = "medium") -> None:
    cmd_add(argparse.Namespace(
        db=db,
        name=name,
        statement="A test assumption statement.",
        basis="Test basis.",
        risk=risk,
        owner="test-agent",
        gate=None,
        cc_param=None,
    ))


# ─── init ────────────────────────────────────────────────────────────────────

def test_init_creates_file(tmp_path):
    db = _init_db(tmp_path)
    assert Path(db).exists()
    data = load(db)
    assert data["study_id"] == "test-study"
    assert data["next_id"] == 1
    assert data["entries"] == []


# ─── add ─────────────────────────────────────────────────────────────────────

def test_add_first_entry_gets_A1(tmp_path):
    db = _init_db(tmp_path)
    _add(db)
    data = load(db)
    assert len(data["entries"]) == 1
    assert data["entries"][0]["id"] == "A1"
    assert data["next_id"] == 2


def test_add_sequential_ids(tmp_path):
    db = _init_db(tmp_path)
    _add(db, "first")
    _add(db, "second")
    _add(db, "third")
    data = load(db)
    ids = [e["id"] for e in data["entries"]]
    assert ids == ["A1", "A2", "A3"]
    assert data["next_id"] == 4


def test_add_preserves_all_fields(tmp_path):
    db = _init_db(tmp_path)
    cmd_add(argparse.Namespace(
        db=db,
        name="autonomy-trl-curve",
        statement="TRL 6 by 2029.",
        basis="Study assumption.",
        risk="high",
        owner="autonomy-trl-tasking",
        gate="2029-trl6-gate",
        cc_param="autonomy_trl_curve",
    ))
    data = load(db)
    entry = data["entries"][0]
    assert entry["short_name"] == "autonomy-trl-curve"
    assert entry["risk_level"] == "high"
    assert entry["go_no_go_gate"] == "2029-trl6-gate"
    assert entry["cross_coupling_param"] == "autonomy_trl_curve"
    assert entry["status"] == "active"


# ─── get ─────────────────────────────────────────────────────────────────────

def test_find_entry_returns_correct(tmp_path):
    db = _init_db(tmp_path)
    _add(db, "first")
    _add(db, "second")
    data = load(db)
    entry = find_entry(data, "A2")
    assert entry is not None
    assert entry["short_name"] == "second"


def test_find_entry_returns_none_for_missing(tmp_path):
    db = _init_db(tmp_path)
    data = load(db)
    assert find_entry(data, "A99") is None


# ─── next_id ─────────────────────────────────────────────────────────────────

def test_next_id_without_adding(tmp_path, capsys):
    db = _init_db(tmp_path)
    _add(db)
    cmd_next_id(argparse.Namespace(db=db))
    captured = capsys.readouterr()
    assert "A2" in captured.out
    # Verify next_id was not consumed
    data = load(db)
    assert data["next_id"] == 2
