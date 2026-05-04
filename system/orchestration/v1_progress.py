#!/usr/bin/env python3
"""v1.0 Implementation Progress Tracker

Usage:
    python system/orchestration/v1_progress.py init
    python system/orchestration/v1_progress.py status
    python system/orchestration/v1_progress.py next
    python system/orchestration/v1_progress.py start T-04
    python system/orchestration/v1_progress.py complete T-04 [--notes NOTE] [--deliverables PATH ...]
    python system/orchestration/v1_progress.py block T-04 "reason"
    python system/orchestration/v1_progress.py skip T-04 "reason"
    python system/orchestration/v1_progress.py set T-04 --status completed
"""

import argparse
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

PROGRESS_FILE = Path("system/state/v1-progress.yaml")
TASKS_FILE = Path("v1-implementation-tasks.md")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def load_progress() -> dict | None:
    if not PROGRESS_FILE.exists():
        return None
    with open(PROGRESS_FILE, encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def save_progress(data: dict) -> None:
    PROGRESS_FILE.parent.mkdir(parents=True, exist_ok=True)
    tmp = PROGRESS_FILE.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8") as fh:
        yaml.dump(data, fh, sort_keys=False, default_flow_style=False, allow_unicode=True)
    tmp.replace(PROGRESS_FILE)


def parse_tasks_from_markdown() -> list[dict]:
    if not TASKS_FILE.exists():
        print(f"ERROR: {TASKS_FILE} not found. Run from repo root.", file=sys.stderr)
        sys.exit(1)

    text = TASKS_FILE.read_text(encoding="utf-8")
    tasks = []

    task_pattern = re.compile(
        r"^### (T-\d+): (.+?)$\n+\*\*Objective:\*\* (.+?)$",
        re.MULTILINE,
    )

    for match in task_pattern.finditer(text):
        task_id, title, objective = match.group(1), match.group(2), match.group(3)

        section_start = match.end()
        next_section = text.find("\n### ", section_start)
        if next_section == -1:
            next_section = text.find("\n## ", section_start)
        section = text[section_start:next_section] if next_section != -1 else text[section_start:]

        deps_match = re.search(r"\*\*Dependencies:\*\* (.+?)$", section, re.MULTILINE)
        deps_str = deps_match.group(1).strip() if deps_match else "None."
        dependencies: list[str] = []
        if deps_str.lower() not in ("none.", "none", ""):
            dependencies = [d.strip().rstrip(".,") for d in re.split(r"[,;]", deps_str)]
            dependencies = [d for d in dependencies if re.match(r"^T-\d+$", d)]

        size_match = re.search(r"\*\*Size:\*\* ([SMLX])", section)
        size = size_match.group(1) if size_match else "M"

        cp_match = re.search(r"\*\*Checkpoint:\*\* (Yes|No)", section)
        checkpoint = cp_match.group(1) == "Yes" if cp_match else False

        tasks.append({
            "task_id": task_id,
            "title": title.strip(),
            "objective": objective.strip(),
            "dependencies": dependencies,
            "size": size,
            "checkpoint": checkpoint,
        })

    return tasks


def _get_task(data: dict, task_id: str) -> dict | None:
    for t in data["tasks"]:
        if t["task_id"] == task_id:
            return t
    return None


def cmd_init(args: argparse.Namespace) -> None:
    if PROGRESS_FILE.exists() and not getattr(args, "force", False):
        print(f"{PROGRESS_FILE} already exists. Use --force to overwrite.")
        sys.exit(1)

    tasks = parse_tasks_from_markdown()
    progress = {
        "schema_version": 1,
        "created_at": now_iso(),
        "last_updated": now_iso(),
        "tasks": [
            {
                "task_id": t["task_id"],
                "title": t["title"],
                "status": "not-started",
                "size": t["size"],
                "checkpoint": t["checkpoint"],
                "dependencies": t["dependencies"],
                "started_at": None,
                "completed_at": None,
                "notes": "",
                "deliverable_paths": [],
                "blockers": "",
            }
            for t in tasks
        ],
    }
    save_progress(progress)
    print(f"Initialized {PROGRESS_FILE} with {len(tasks)} tasks.")


def cmd_status(args: argparse.Namespace) -> None:
    data = load_progress()
    if data is None:
        print(f"No progress file at {PROGRESS_FILE}. Run 'init' first.")
        sys.exit(1)

    counts: dict[str, int] = {}
    for t in data["tasks"]:
        counts[t["status"]] = counts.get(t["status"], 0) + 1

    total = len(data["tasks"])
    done = counts.get("completed", 0) + counts.get("skipped", 0)
    pct = (done / total * 100) if total else 0

    print("v1.0 Implementation Progress")
    print("=" * 40)
    print(f"Total:       {total}")
    print(f"Completed:   {counts.get('completed', 0)}")
    print(f"Skipped:     {counts.get('skipped', 0)}")
    print(f"In-progress: {counts.get('in-progress', 0)}")
    print(f"Blocked:     {counts.get('blocked', 0)}")
    print(f"Not started: {counts.get('not-started', 0)}")
    print(f"Progress:    {pct:.1f}%")

    blocked = [t for t in data["tasks"] if t["status"] == "blocked"]
    if blocked:
        print("\nBlocked:")
        for t in blocked:
            print(f"  {t['task_id']}: {t['blockers']}")


def cmd_next(args: argparse.Namespace) -> None:
    data = load_progress()
    if data is None:
        print(f"No progress file at {PROGRESS_FILE}. Run 'init' first.")
        sys.exit(1)

    completed_ids = {
        t["task_id"] for t in data["tasks"] if t["status"] in ("completed", "skipped")
    }

    for t in data["tasks"]:
        if t["status"] != "not-started":
            continue
        if all(dep in completed_ids for dep in t["dependencies"]):
            print(f"Next:        {t['task_id']}")
            print(f"Title:       {t['title']}")
            print(f"Size:        {t['size']}")
            print(f"Checkpoint:  {t['checkpoint']}")
            deps = ", ".join(t["dependencies"]) if t["dependencies"] else "none"
            print(f"Depends on:  {deps}")
            return

    in_prog = [t for t in data["tasks"] if t["status"] == "in-progress"]
    if in_prog:
        print("In-progress (complete these first):")
        for t in in_prog:
            print(f"  {t['task_id']}: {t['title']}")
        return

    if not any(t["status"] == "not-started" for t in data["tasks"]):
        print("All tasks complete.")
    else:
        print("No eligible task — check for unmet dependencies or blocked tasks.")


def cmd_start(args: argparse.Namespace) -> None:
    data = load_progress()
    if data is None:
        print(f"No progress file at {PROGRESS_FILE}.", file=sys.stderr)
        sys.exit(1)
    t = _get_task(data, args.task_id)
    if t is None:
        print(f"Task {args.task_id} not found.", file=sys.stderr)
        sys.exit(1)
    t["status"] = "in-progress"
    t["started_at"] = now_iso()
    data["last_updated"] = now_iso()
    save_progress(data)
    print(f"Started {args.task_id}.")


def cmd_complete(args: argparse.Namespace) -> None:
    data = load_progress()
    if data is None:
        print(f"No progress file at {PROGRESS_FILE}.", file=sys.stderr)
        sys.exit(1)
    t = _get_task(data, args.task_id)
    if t is None:
        print(f"Task {args.task_id} not found.", file=sys.stderr)
        sys.exit(1)
    t["status"] = "completed"
    t["completed_at"] = now_iso()
    if getattr(args, "notes", None):
        t["notes"] = args.notes
    if getattr(args, "deliverables", None):
        t["deliverable_paths"] = args.deliverables
    data["last_updated"] = now_iso()
    save_progress(data)
    print(f"Completed {args.task_id}.")
    if t.get("checkpoint"):
        print("CHECKPOINT: Requires founder review before next task.")


def cmd_block(args: argparse.Namespace) -> None:
    data = load_progress()
    if data is None:
        print(f"No progress file at {PROGRESS_FILE}.", file=sys.stderr)
        sys.exit(1)
    t = _get_task(data, args.task_id)
    if t is None:
        print(f"Task {args.task_id} not found.", file=sys.stderr)
        sys.exit(1)
    t["status"] = "blocked"
    t["blockers"] = args.reason
    data["last_updated"] = now_iso()
    save_progress(data)
    print(f"Blocked {args.task_id}: {args.reason}")


def cmd_skip(args: argparse.Namespace) -> None:
    data = load_progress()
    if data is None:
        print(f"No progress file at {PROGRESS_FILE}.", file=sys.stderr)
        sys.exit(1)
    t = _get_task(data, args.task_id)
    if t is None:
        print(f"Task {args.task_id} not found.", file=sys.stderr)
        sys.exit(1)
    t["status"] = "skipped"
    t["completed_at"] = now_iso()
    t["notes"] = args.reason
    data["last_updated"] = now_iso()
    save_progress(data)
    print(f"Skipped {args.task_id}: {args.reason}")


def cmd_set(args: argparse.Namespace) -> None:
    data = load_progress()
    if data is None:
        print(f"No progress file at {PROGRESS_FILE}.", file=sys.stderr)
        sys.exit(1)
    t = _get_task(data, args.task_id)
    if t is None:
        print(f"Task {args.task_id} not found.", file=sys.stderr)
        sys.exit(1)
    t["status"] = args.status
    if args.status == "completed":
        t["completed_at"] = now_iso()
    if getattr(args, "notes", None):
        t["notes"] = args.notes
    data["last_updated"] = now_iso()
    save_progress(data)
    print(f"{args.task_id} → {args.status}")


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="v1_progress", description="v1.0 implementation progress tracker")
    sub = p.add_subparsers(dest="cmd", required=True)

    pi = sub.add_parser("init")
    pi.add_argument("--force", action="store_true")

    sub.add_parser("status")
    sub.add_parser("next")

    ps = sub.add_parser("start")
    ps.add_argument("task_id")

    pc = sub.add_parser("complete")
    pc.add_argument("task_id")
    pc.add_argument("--notes", default="")
    pc.add_argument("--deliverables", nargs="*", default=[])

    pb = sub.add_parser("block")
    pb.add_argument("task_id")
    pb.add_argument("reason")

    psk = sub.add_parser("skip")
    psk.add_argument("task_id")
    psk.add_argument("reason")

    pset = sub.add_parser("set")
    pset.add_argument("task_id")
    pset.add_argument("--status", required=True,
                      choices=["not-started", "in-progress", "completed", "blocked", "skipped"])
    pset.add_argument("--notes", default="")

    return p


def main() -> None:
    args = build_parser().parse_args()
    dispatch = {
        "init": cmd_init, "status": cmd_status, "next": cmd_next,
        "start": cmd_start, "complete": cmd_complete,
        "block": cmd_block, "skip": cmd_skip, "set": cmd_set,
    }
    dispatch[args.cmd](args)


if __name__ == "__main__":
    main()
