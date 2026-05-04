"""Status surface — record and query system events.

Writes structured events to system/state/status.yaml, providing a real-time
view of the system state for the operator (mobile-friendly via status_view.py).

Usage:
    python -m system.orchestration.status record --type gate_pass --study my-study --details "WordCountGate: 3 files checked"
    python -m system.orchestration.status tail [--n 20]
    python -m system.orchestration.status current

Events append to status.yaml. File is truncated when it exceeds 1 MB.
"""

import argparse
import fcntl
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

_STATUS_FILE = Path("system/state/status.yaml")
_MAX_BYTES = 1 * 1024 * 1024  # 1 MB

_EVENT_TYPES = [
    "cycle_start", "cycle_close",
    "agent_dispatch", "agent_complete", "agent_error",
    "gate_pass", "gate_fail",
    "finding_added", "finding_resolved",
    "cc_param_set", "assumption_added",
    "handback_generated",
    "helper_spawned", "helper_complete", "helper_timeout",
    "checkpoint_reached",
    "info",
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _load() -> dict:
    if not _STATUS_FILE.exists():
        return {"last_updated": _now(), "current_study": None, "current_cycle": None, "events": []}
    with open(_STATUS_FILE, encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}


def _save(data: dict) -> None:
    _STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
    tmp = _STATUS_FILE.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8") as fh:
        yaml.dump(data, fh, default_flow_style=False, allow_unicode=True, sort_keys=False)
    tmp.replace(_STATUS_FILE)


def _truncate_if_needed(data: dict) -> dict:
    """Keep only the most recent events when file would exceed 1 MB."""
    serialized = yaml.dump(data, default_flow_style=False)
    if len(serialized.encode()) > _MAX_BYTES:
        events = data.get("events", [])
        # Keep the most recent 500 events
        data["events"] = events[-500:]
        data["truncated_at"] = _now()
    return data


def record(
    event_type: str,
    study: str | None = None,
    cycle: int | str | None = None,
    agent: str | None = None,
    details: str = "",
    metadata: dict | None = None,
) -> None:
    """Record an event to status.yaml. Thread-safe via flock."""
    if event_type not in _EVENT_TYPES:
        raise ValueError(f"Unknown event type: {event_type}. Valid: {_EVENT_TYPES}")

    event: dict = {
        "ts": _now(),
        "type": event_type,
    }
    if study:
        event["study"] = study
    if cycle is not None:
        event["cycle"] = cycle
    if agent:
        event["agent"] = agent
    if details:
        event["details"] = details
    if metadata:
        event["metadata"] = metadata

    _STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
    _STATUS_FILE.touch(exist_ok=True)

    with open(_STATUS_FILE, "r+", encoding="utf-8") as fh:
        fcntl.flock(fh, fcntl.LOCK_EX)
        try:
            fh.seek(0)
            content = fh.read()
            data = yaml.safe_load(content) if content.strip() else {}
            if not data:
                data = {"last_updated": _now(), "current_study": None, "current_cycle": None, "events": []}

            data.setdefault("events", []).append(event)
            data["last_updated"] = _now()

            if study:
                data["current_study"] = study
            if cycle is not None:
                data["current_cycle"] = cycle

            data = _truncate_if_needed(data)

            fh.seek(0)
            fh.truncate()
            yaml.dump(data, fh, default_flow_style=False, allow_unicode=True, sort_keys=False)
        finally:
            fcntl.flock(fh, fcntl.LOCK_UN)


def tail(n: int = 20) -> list[dict]:
    data = _load()
    return data.get("events", [])[-n:]


def current() -> dict:
    data = _load()
    return {
        "last_updated": data.get("last_updated"),
        "current_study": data.get("current_study"),
        "current_cycle": data.get("current_cycle"),
        "recent_events": data.get("events", [])[-5:],
    }


def cmd_record(args: argparse.Namespace) -> None:
    meta = None
    if getattr(args, "meta", None):
        try:
            import json
            meta = json.loads(args.meta)
        except Exception:
            meta = {"raw": args.meta}
    record(
        event_type=args.type,
        study=getattr(args, "study", None),
        cycle=getattr(args, "cycle", None),
        agent=getattr(args, "agent", None),
        details=getattr(args, "details", ""),
        metadata=meta,
    )
    print(f"recorded: {args.type}")


def cmd_tail(args: argparse.Namespace) -> None:
    events = tail(args.n)
    for e in events:
        ts = e.get("ts", "?")
        etype = e.get("type", "?")
        details = e.get("details", "")
        agent = e.get("agent", "")
        line = f"{ts}  {etype:<20}"
        if agent:
            line += f"  agent={agent}"
        if details:
            line += f"  {details}"
        print(line)


def cmd_current(args: argparse.Namespace) -> None:
    state = current()
    print(yaml.dump(state, default_flow_style=False, allow_unicode=True), end="")


def main() -> None:
    parser = argparse.ArgumentParser(prog="status", description="System status surface")
    sub = parser.add_subparsers(dest="cmd", required=True)

    pr = sub.add_parser("record", help="Record an event")
    pr.add_argument("--type", required=True, choices=_EVENT_TYPES)
    pr.add_argument("--study", default=None)
    pr.add_argument("--cycle", default=None)
    pr.add_argument("--agent", default=None)
    pr.add_argument("--details", default="")
    pr.add_argument("--meta", default=None, help="JSON metadata string")

    pt = sub.add_parser("tail", help="Show recent events")
    pt.add_argument("-n", type=int, default=20)

    sub.add_parser("current", help="Show current state")

    args = parser.parse_args()
    dispatch = {"record": cmd_record, "tail": cmd_tail, "current": cmd_current}
    dispatch[args.cmd](args)


if __name__ == "__main__":
    main()
