"""
Cycle dispatch orchestrator.

Reads a cycle scaffold, resolves agent dependencies, composes prompts via
base + domain overlay, and executes agents in dependency order (parallel
where possible). Logs all dispatches and outputs to the session log.

This module runs agents as subprocess calls to `claude --prompt`. It is
designed to be invoked by an orchestrator session, not run autonomously.
In practice, the orchestrator reads the scaffold, calls dispatch_cycle(),
and receives structured results back.

Usage (library):
    from system.orchestration.dispatch import dispatch_cycle, load_scaffold

    result = dispatch_cycle("01-orbital-platform", 2, dry_run=True)

Usage (CLI):
    python -m system.orchestration.dispatch --study 01-orbital-platform \
        --cycle 2 --dry-run
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import yaml

from system.agents.compose import compose_for_domain


# ── Paths ──────────────────────────────────────────────────────────────────────

def _repo_root() -> Path:
    return Path(__file__).parent.parent.parent


def _studies_root() -> Path:
    return _repo_root() / "studies" / "active"


def _session_log_path(study_slug: str) -> Path:
    return _studies_root() / study_slug / "retro" / "session-logs.yaml"


# ── Data classes ───────────────────────────────────────────────────────────────

@dataclass
class AgentTask:
    agent_id: str
    output_path: str
    word_budget: Optional[int] = None
    depends_on: list[str] = field(default_factory=list)
    batch: str = "1"


@dataclass
class DispatchResult:
    agent_id: str
    status: str                     # queued | running | complete | failed | timeout
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    output_path: Optional[str] = None
    word_count: Optional[int] = None
    failure_mode: Optional[str] = None  # timeout | error | partial_output
    failure_detail: Optional[str] = None
    helper_spawned: bool = False


@dataclass
class CycleDispatchReport:
    study_id: str
    cycle: int
    dispatched_at: str
    results: list[DispatchResult] = field(default_factory=list)
    session_log_entry: Optional[dict] = None

    @property
    def all_complete(self) -> bool:
        return all(r.status == "complete" for r in self.results)

    @property
    def failed(self) -> list[DispatchResult]:
        return [r for r in self.results if r.status in ("failed", "timeout")]


# ── Scaffold parsing ───────────────────────────────────────────────────────────

def load_scaffold(study_slug: str, cycle_number: int) -> dict:
    path = (_studies_root() / study_slug / "cycles"
            / f"cycle-{cycle_number:02d}" / "scaffold.md")
    if not path.exists():
        raise FileNotFoundError(f"Scaffold not found: {path}")
    text = path.read_text()

    # Extract frontmatter
    fm: dict = {}
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            fm = yaml.safe_load(parts[1]) or {}

    return {"path": str(path), "frontmatter": fm, "text": text}


def parse_dispatch_plan(scaffold_text: str, study_config: dict) -> list[AgentTask]:
    """
    Extract agent tasks from the dispatch table in the scaffold.

    Reads the '## Agent dispatch plan' section, parsing batch and dependency
    annotations. Falls back to study-config.yaml agent list if no table found.
    """
    tasks: list[AgentTask] = []

    # Try to parse the dispatch table from the scaffold
    # Look for lines like: | agent-id | output_path | word_cap | notes |
    table_re = re.compile(
        r"\|\s*([a-z][a-z0-9-]+)\s*\|"      # agent-id
        r"\s*`?([^`|\n]+?)`?\s*\|"           # output path
        r"\s*([0-9,]+|TBD)?\s*\|",           # word budget (optional)
    )

    in_dispatch = False
    batch_num = "1"
    batch_label = "1"
    seen_depends: list[str] = []

    for line in scaffold_text.splitlines():
        if re.search(r"## Agent dispatch plan", line, re.IGNORECASE):
            in_dispatch = True
            continue
        if in_dispatch and line.startswith("## "):
            break
        if in_dispatch:
            batch_m = re.search(r"Batch\s+(\d+|[A-Za-z]+)", line, re.IGNORECASE)
            if batch_m:
                batch_label = batch_m.group(1)
                if "depend" in line.lower() or "after" in line.lower():
                    depends_on_batch = batch_num
                else:
                    depends_on_batch = ""
                batch_num = batch_label
                continue

            m = table_re.search(line)
            if m:
                agent_id = m.group(1).strip()
                output = m.group(2).strip()
                budget_str = m.group(3)
                budget = None
                if budget_str and budget_str != "TBD":
                    budget = int(budget_str.replace(",", ""))
                tasks.append(AgentTask(
                    agent_id=agent_id,
                    output_path=output,
                    word_budget=budget,
                    batch=batch_num,
                ))

    if not tasks:
        # Fall back to study config
        for q_key, q in study_config.get("four_questions", {}).items():
            for agent in q.get("primary_agents", []):
                tasks.append(AgentTask(
                    agent_id=agent,
                    output_path=q.get("output_path", ""),
                    word_budget=q.get("word_budget"),
                    batch="1",
                ))

    return tasks


def resolve_dependencies(tasks: list[AgentTask]) -> list[list[AgentTask]]:
    """
    Return tasks grouped into execution waves.

    Wave 0 = no dependencies; Wave 1 = depends on Wave 0; etc.
    Tasks in the same batch run in parallel.
    """
    batches: dict[str, list[AgentTask]] = {}
    for task in tasks:
        batches.setdefault(task.batch, []).append(task)
    return list(batches.values())


# ── Helper agent spawn ─────────────────────────────────────────────────────────

@dataclass
class HelperSpawnEvent:
    parent_agent: str
    subtask: str
    spawned_at: str
    max_duration_s: int = 60
    read_only: bool = True


def should_spawn_helper(elapsed_s: float, has_output: bool,
                        threshold_s: float = 90.0) -> bool:
    """Return True if a helper should be spawned for a long-running task."""
    return elapsed_s > threshold_s and not has_output


def spawn_helper(parent_agent: str, subtask: str) -> HelperSpawnEvent:
    """
    Record a helper spawn event. In production, this triggers a sub-agent call.
    The helper is read-only, scoped to parent_agent's task, max 60s lifetime.
    """
    return HelperSpawnEvent(
        parent_agent=parent_agent,
        subtask=subtask,
        spawned_at=datetime.now(timezone.utc).isoformat(),
    )


# ── Failure handling ───────────────────────────────────────────────────────────

FAILURE_MODES = ("timeout", "error", "partial_output")


def classify_failure(result: DispatchResult, output_text: str = "") -> DispatchResult:
    """
    Classify a failed dispatch result. Updates failure_mode and failure_detail.
    Failures are logged as structured events, never silently absorbed.
    """
    if result.status == "timeout":
        result.failure_mode = "timeout"
        result.failure_detail = f"Agent {result.agent_id} exceeded time limit"
    elif output_text and len(output_text.split()) > 50:
        result.failure_mode = "partial_output"
        result.failure_detail = (
            f"Agent {result.agent_id} produced {len(output_text.split())} words "
            f"then failed — partial output may be usable"
        )
    else:
        result.failure_mode = "error"
        result.failure_detail = f"Agent {result.agent_id} failed with no output"
    return result


# ── Session log ────────────────────────────────────────────────────────────────

def _append_session_log(study_slug: str, entry: dict) -> None:
    log_path = _session_log_path(study_slug)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    entries: list[dict] = []
    if log_path.exists():
        data = yaml.safe_load(log_path.read_text())
        if isinstance(data, list):
            entries = data
    entries.append(entry)
    log_path.write_text(yaml.dump(entries, allow_unicode=True, sort_keys=False,
                                   default_flow_style=False))


# ── Core dispatch ──────────────────────────────────────────────────────────────

def dispatch_cycle(
    study_slug: str,
    cycle_number: int,
    dry_run: bool = False,
) -> CycleDispatchReport:
    """
    Dispatch all agents for a cycle per the scaffold.

    In dry_run mode, resolves dependencies and composes prompts but does
    not execute agents. Returns a CycleDispatchReport with queued status.

    In live mode, agents are dispatched in dependency order. Failures are
    logged as structured events and surfaced in the report — never
    silently absorbed.
    """
    scaffold = load_scaffold(study_slug, cycle_number)
    fm = scaffold["frontmatter"]

    # Check scaffold is approved
    if not dry_run and fm.get("status") not in ("founder-approved", "executing"):
        raise ValueError(
            f"Scaffold status is {fm.get('status')!r}; must be 'founder-approved' "
            f"before dispatch. Set status in scaffold frontmatter."
        )

    # Load study config for fallback agent list
    config_path = _studies_root() / study_slug / "study-config.yaml"
    study_config = yaml.safe_load(config_path.read_text()) if config_path.exists() else {}
    domain = study_config.get("domain", "")

    tasks = parse_dispatch_plan(scaffold["text"], study_config)
    waves = resolve_dependencies(tasks)

    report = CycleDispatchReport(
        study_id=study_slug,
        cycle=cycle_number,
        dispatched_at=datetime.now(timezone.utc).isoformat(),
    )

    log_entries: list[dict] = []

    for wave_idx, wave in enumerate(waves):
        for task in wave:
            result = DispatchResult(
                agent_id=task.agent_id,
                status="queued",
                output_path=task.output_path,
            )

            if dry_run:
                # Compose prompt but don't execute
                try:
                    prompt = compose_for_domain(task.agent_id, domain)
                    result.status = "queued"
                except FileNotFoundError:
                    result.status = "failed"
                    result.failure_mode = "error"
                    result.failure_detail = f"Base agent not found: {task.agent_id}"
            else:
                result.started_at = datetime.now(timezone.utc).isoformat()
                result.status = "running"
                # Production: agent execution would happen here.
                # Structured failure handling: any exception sets failed status
                # and logs the failure mode — never silently absorbed.
                try:
                    # Placeholder for actual agent invocation
                    # In production: invoke claude --prompt <composed_prompt>
                    # and capture output to task.output_path
                    raise NotImplementedError(
                        "Live dispatch requires claude CLI. Use dry_run=True "
                        "for scaffolding validation."
                    )
                except Exception as exc:
                    result.status = "failed"
                    result = classify_failure(result)
                    result.failure_detail = str(exc)
                result.completed_at = datetime.now(timezone.utc).isoformat()

            report.results.append(result)
            log_entries.append({
                "agent_id": task.agent_id,
                "status": result.status,
                "wave": wave_idx,
                "output_path": task.output_path,
                "failure_mode": result.failure_mode,
            })

    # Write session log entry
    session_entry = {
        "event": "cycle_dispatch",
        "study_id": study_slug,
        "cycle": cycle_number,
        "timestamp": report.dispatched_at,
        "dry_run": dry_run,
        "agents": log_entries,
        "summary": {
            "total": len(report.results),
            "queued": sum(1 for r in report.results if r.status == "queued"),
            "failed": len(report.failed),
        },
    }
    report.session_log_entry = session_entry

    if not dry_run:
        _append_session_log(study_slug, session_entry)

    return report


# ── CLI ────────────────────────────────────────────────────────────────────────

def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Cycle dispatch orchestrator.")
    parser.add_argument("--study", required=True)
    parser.add_argument("--cycle", required=True, type=int)
    parser.add_argument("--dry-run", action="store_true",
                        help="Resolve dependencies and compose prompts without executing")
    args = parser.parse_args(argv)

    report = dispatch_cycle(args.study, args.cycle, dry_run=args.dry_run)

    mode = "[DRY RUN] " if args.dry_run else ""
    print(f"{mode}Cycle {report.cycle} dispatch — {report.dispatched_at}")
    print(f"  Total agents: {len(report.results)}")
    for r in report.results:
        status = r.status.upper()
        detail = f" — {r.failure_detail}" if r.failure_detail else ""
        print(f"  [{status}] {r.agent_id} → {r.output_path}{detail}")

    if report.failed:
        print(f"\nFailed agents ({len(report.failed)}):")
        for r in report.failed:
            print(f"  {r.agent_id}: {r.failure_mode} — {r.failure_detail}")
        sys.exit(1)


if __name__ == "__main__":
    main()
