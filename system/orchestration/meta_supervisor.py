"""
Meta-supervisor observation pipeline.

Reads cycle handback content and produces structured observations in
system/retro/system-observations.yaml. One observation per cycle, appended
at cycle close.

Usage:
    python -m system.orchestration.meta_supervisor generate \
        --study 01-orbital-platform --cycle 1
    python -m system.orchestration.meta_supervisor list
    python -m system.orchestration.meta_supervisor validate
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path
from typing import Optional

import yaml


# ── Paths ──────────────────────────────────────────────────────────────────────

def _repo_root() -> Path:
    return Path(__file__).parent.parent.parent


def _observations_path() -> Path:
    return _repo_root() / "system" / "retro" / "system-observations.yaml"


def _studies_root() -> Path:
    return _repo_root() / "studies" / "active"


# ── Parsing helpers ────────────────────────────────────────────────────────────

def _extract_section(text: str, heading_pattern: str) -> str:
    """Return content under a heading matching heading_pattern until the next ##."""
    lines = text.splitlines()
    in_section = False
    result: list[str] = []
    for line in lines:
        if re.search(heading_pattern, line, re.IGNORECASE) and line.startswith("#"):
            in_section = True
            continue
        if in_section:
            if line.startswith("##") and not line.startswith("###"):
                break
            result.append(line)
    return "\n".join(result).strip()


def _extract_bullets(text: str) -> list[str]:
    """Pull numbered or bulleted list items from text."""
    items: list[str] = []
    for line in text.splitlines():
        m = re.match(r"^(?:\d+\.|[-*])\s+(.+)", line.strip())
        if m:
            items.append(m.group(1).strip())
    return items


def _detect_trend(observations: list[dict]) -> str:
    """
    Determine trend from last three observations.

    Simple heuristic: count failed items across last three cycles.
    Improving if the most recent has fewer failures than the oldest of the three.
    """
    if len(observations) < 2:
        return "flat"
    window = observations[-3:]
    counts = [len(o.get("observations", {}).get("failed", [])) for o in window]
    if counts[-1] < counts[0]:
        return "improving"
    if counts[-1] > counts[0]:
        return "regressing"
    return "flat"


# ── Load / Save ────────────────────────────────────────────────────────────────

def load_observations() -> list[dict]:
    path = _observations_path()
    if not path.exists():
        return []
    data = yaml.safe_load(path.read_text())
    return data if isinstance(data, list) else []


def save_observations(observations: list[dict]) -> None:
    path = _observations_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.dump(observations, allow_unicode=True, sort_keys=False,
                               default_flow_style=False))


# ── Schema validation ──────────────────────────────────────────────────────────

def validate_observation(obs: dict) -> list[str]:
    """Return list of validation errors. Empty list means valid."""
    errors: list[str] = []
    required = ["observation_id", "study_id", "cycle_id", "date",
                "observations", "lessons_delta", "trend", "recommendations"]
    for field in required:
        if field not in obs:
            errors.append(f"Missing required field: {field}")

    if "observations" in obs:
        for sub in ("worked", "failed"):
            if sub not in obs["observations"]:
                errors.append(f"observations.{sub} is required")
            elif not isinstance(obs["observations"][sub], list):
                errors.append(f"observations.{sub} must be a list")

    if "trend" in obs and obs["trend"] not in ("improving", "flat", "regressing"):
        errors.append(f"trend must be improving|flat|regressing, got: {obs['trend']}")

    if "date" in obs:
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", str(obs["date"])):
            errors.append(f"date must be YYYY-MM-DD, got: {obs['date']}")

    return errors


# ── Generation ─────────────────────────────────────────────────────────────────

def generate_observation(
    study_id: str,
    cycle_id: str | int,
    handback_path: Path,
    existing: Optional[list[dict]] = None,
) -> dict:
    """
    Generate a structured observation dict from a handback file.
    existing is the list of prior observations (for trend and lessons_delta).
    """
    if existing is None:
        existing = []

    text = handback_path.read_text()

    # Extract what worked
    worked_text = _extract_section(text, r"what\s+worked")
    worked = _extract_bullets(worked_text)
    if not worked:
        worked = ["Cycle completed and handback generated."]

    # Extract what to watch / what failed
    failed_text = _extract_section(text, r"what to watch|what\s+failed|issues|blockers")
    failed = _extract_bullets(failed_text)

    # Recommendations from next-session priorities or scaffold checklist
    recs_text = _extract_section(text, r"next session|priorities|cycle.*checklist|recommendations")
    recs = _extract_bullets(recs_text)
    if not recs:
        recs = ["Review cycle outputs before dispatching the next cycle."]

    # Lessons delta — new items not in prior observations
    prior_lessons: set[str] = set()
    for obs in existing:
        for lesson in obs.get("lessons_delta", []):
            prior_lessons.add(lesson.get("text", "")[:60])

    lessons_delta: list[dict] = []
    for item in failed:
        short = item[:60]
        if short not in prior_lessons:
            lessons_delta.append({"text": item})

    # Observation ID
    obs_id = f"{study_id}-cycle-{cycle_id}"

    all_obs = existing + [{"observations": {"worked": worked, "failed": failed}}]
    trend = _detect_trend(all_obs)

    try:
        source = str(handback_path.relative_to(_repo_root()))
    except ValueError:
        source = str(handback_path)

    return {
        "observation_id": obs_id,
        "study_id": study_id,
        "cycle_id": cycle_id,
        "date": date.today().isoformat(),
        "source": source,
        "observations": {
            "worked": worked,
            "failed": failed,
        },
        "lessons_delta": lessons_delta,
        "trend": trend,
        "recommendations": recs[:5] if recs else ["Review cycle outputs."],
    }


def append_observation(obs: dict) -> None:
    """Validate and append an observation to the YAML store."""
    errors = validate_observation(obs)
    if errors:
        raise ValueError(f"Invalid observation: {errors}")
    observations = load_observations()
    # Replace existing entry for same observation_id
    observations = [o for o in observations if o.get("observation_id") != obs["observation_id"]]
    observations.append(obs)
    save_observations(observations)


# ── CLI ────────────────────────────────────────────────────────────────────────

def _cmd_generate(args: argparse.Namespace) -> None:
    study_id = args.study
    cycle_id = args.cycle

    handback_path = _studies_root() / study_id / "cycles" / f"cycle-{int(cycle_id):02d}" / "handback.md"
    if not handback_path.exists():
        print(f"ERROR: handback not found: {handback_path}", file=sys.stderr)
        sys.exit(1)

    existing = load_observations()
    obs = generate_observation(study_id, cycle_id, handback_path, existing)
    errors = validate_observation(obs)
    if errors:
        print(f"ERROR: generated observation fails validation: {errors}", file=sys.stderr)
        sys.exit(1)

    if args.dry_run:
        print(yaml.dump([obs], allow_unicode=True, sort_keys=False))
        return

    append_observation(obs)
    print(f"Observation written: {obs['observation_id']}")


def _cmd_list(args: argparse.Namespace) -> None:
    observations = load_observations()
    if not observations:
        print("No observations recorded.")
        return
    for obs in observations:
        print(f"  {obs['observation_id']}  {obs['date']}  trend={obs['trend']}")


def _cmd_validate(args: argparse.Namespace) -> None:
    observations = load_observations()
    ok = True
    for obs in observations:
        errors = validate_observation(obs)
        if errors:
            print(f"INVALID {obs.get('observation_id', '?')}: {errors}")
            ok = False
    if ok:
        print(f"All {len(observations)} observations valid.")
    else:
        sys.exit(1)


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Meta-supervisor observation pipeline.")
    sub = parser.add_subparsers(dest="command", required=True)

    gen = sub.add_parser("generate", help="Generate observation from handback")
    gen.add_argument("--study", required=True)
    gen.add_argument("--cycle", required=True, type=int)
    gen.add_argument("--dry-run", action="store_true")

    sub.add_parser("list", help="List all recorded observations")
    sub.add_parser("validate", help="Validate all observations against schema")

    args = parser.parse_args(argv)
    if args.command == "generate":
        _cmd_generate(args)
    elif args.command == "list":
        _cmd_list(args)
    elif args.command == "validate":
        _cmd_validate(args)


if __name__ == "__main__":
    main()
