"""
One-time script to backfill meta-supervisor observations for the lunar pathfinder
archive. Reads existing handbacks in studies/archive/lunar-humanoid-pathfinder/handbacks/
and produces structured observation entries.

Run once:
    python -m system.tools.backfill_lunar_observations
"""

from __future__ import annotations

from pathlib import Path
import yaml

from system.orchestration.meta_supervisor import (
    append_observation,
    load_observations,
    validate_observation,
    _extract_section,
    _extract_bullets,
    _detect_trend,
)


REPO_ROOT = Path(__file__).parent.parent.parent
ARCHIVE = REPO_ROOT / "studies" / "archive" / "lunar-humanoid-pathfinder" / "handbacks"

STAGE_META = {
    "stage4": {
        "observation_id": "lunar-humanoid-stage-04",
        "date": "2026-05-03",
        "source": "studies/archive/lunar-humanoid-pathfinder/handbacks/handback-stage4.md",
        "worked": [
            "Base agent library dispatched and produced structured drafts for all Question (a) subsections.",
            "Heritage-research-agent and humanoid-systems-architect ran in parallel with write isolation via separate stub bib files.",
        ],
        "failed": [
            "Breadcrumb files scaffolded but not populated — session logs, cross-coupling log, and retro files were empty through stage 4.",
            "Assumption registry had two contradicting autonomy TRL entries simultaneously for an entire cycle; conflict undetected until stage 5 handback.",
            "Review agents scaffolded but never invoked — zero-findings count is a false signal, not a clean bill of health.",
        ],
        "lessons_delta": [
            "Breadcrumb discipline does not happen by being scaffolded; enforcement must be a blocking gate.",
            "Zero findings without evidence that reviews ran is misleading, not a success signal.",
            "Contradictions in the assumption registry compound silently across stages.",
        ],
        "trend": "flat",
        "recommendations": [
            "Add mandatory closing actions checklist to every agent file.",
            "Implement blocking gate: agent cannot declare complete without session log entry.",
            "Dispatch review agents in stage 5 before any new content is added.",
        ],
    },
    "stage5": {
        "observation_id": "lunar-humanoid-stage-05",
        "date": "2026-05-03",
        "source": "studies/archive/lunar-humanoid-pathfinder/handbacks/handback-stage5.md",
        "worked": [
            "Retroactive breadcrumb reconstruction captured all stage 2–4 decisions for the record.",
            "Mandatory closing actions added to all agent files; pre-handback checklist enforced.",
            "Cross-coupling log seeded with 13 entries covering all prior decisions.",
        ],
        "failed": [
            "Retroactive reconstruction is acknowledged unreliable — the record represents the orchestrator's best reconstruction, not contemporaneous logging.",
            "Citation keys added without corresponding BibTeX entries; corpus has ~22 missing reference entries.",
        ],
        "lessons_delta": [
            "Retroactive reconstruction is possible but produces unreliable records; real-time enforcement is the only solution.",
            "Agent prompts must require BibTeX entry creation alongside every inline citation key added.",
        ],
        "trend": "improving",
        "recommendations": [
            "Run CitationIntegrityGate before stage 6 dispatch; block on missing BibTeX entries.",
            "Treat retroactively-reconstructed retro artifacts as lower-confidence sources.",
        ],
    },
    "stage6": {
        "observation_id": "lunar-humanoid-stage-06",
        "date": "2026-05-03",
        "source": "studies/archive/lunar-humanoid-pathfinder/handbacks/handback-stage6.md",
        "worked": [
            "First real review pass ran; six reviewers produced structured findings.",
            "CitationIntegrityGate detected 22 missing BibTeX entries — gate caught what agent discipline missed.",
            "[VERIFY] flag discipline adopted by heritage agents; gaps identified in engineering agent outputs.",
        ],
        "failed": [
            "[VERIFY] flag used inconsistently — concentrated in heritage files, absent from engineering analysis sections despite specific TRL claims that require verification.",
            "Word budgets breached in two of six Question (a) sections.",
        ],
        "lessons_delta": [
            "Gates are more reliable than agent discipline; gates must enforce what conventions only recommend.",
            "Inline uncertainty flags ([VERIFY], [EST]) must be required for all numeric claims not from direct primary source citation.",
        ],
        "trend": "improving",
        "recommendations": [
            "Add [VERIFY]/[EST] requirement to all agent dispatch prompts for stage 7.",
            "Enforce word budget cap as a blocking gate, not a soft warning.",
        ],
    },
    "stage7": {
        "observation_id": "lunar-humanoid-stage-07",
        "date": "2026-05-03",
        "source": "studies/archive/lunar-humanoid-pathfinder/handbacks/handback-stage7.md",
        "worked": [
            "BibTeX corpus patched with missing entries; CitationIntegrityGate passes.",
            "[VERIFY] and [EST] flags applied consistently after explicit requirement added to agent prompts.",
            "Review agents ran in parallel; findings triage completed in-cycle.",
        ],
        "failed": [
            "Soviet/Russian heritage section grew over word budget; scope discipline needed earlier in agent dispatch.",
            "Some findings deferred from stage 6 were not addressed in stage 7.",
        ],
        "lessons_delta": [
            "Agent scope must be bounded by deliverable (file path + word cap), not by topic area.",
            "Deferred findings must carry explicit resolution targets or they slip indefinitely.",
        ],
        "trend": "improving",
        "recommendations": [
            "All deferred findings must have an explicit owner and target cycle before handback closes.",
            "Add scope gate: agent dispatch prompt must specify target file path and word cap.",
        ],
    },
    "stage8": {
        "observation_id": "lunar-humanoid-stage-08",
        "date": "2026-05-04",
        "source": "studies/archive/lunar-humanoid-pathfinder/handbacks/handback-stage8.md",
        "worked": [
            "Study reached draft-complete status for all four questions.",
            "All Blocker and Major findings resolved; Minor and Nit findings logged for v1.1.",
            "Cross-coupling DB consistent across all deliverables at handback time.",
            "Word count within budget across all sections after scope-discipline enforcement.",
        ],
        "failed": [
            "Visualization workstream planned but not executed; study shipped without figures.",
            "Executive summary word budget was tight; synthesis agents need earlier dispatch in future studies.",
        ],
        "lessons_delta": [
            "Visualization workstream requires dedicated dispatch cycle; cannot be bolted on at the end.",
            "Executive summary agent needs Cycle N-1 outputs as inputs; schedule accordingly.",
        ],
        "trend": "improving",
        "recommendations": [
            "Build visualization pipeline foundation before content cycles in the next study.",
            "Schedule executive summary agent dispatch in the penultimate cycle, not the final cycle.",
            "Archive study after merge review; mark retro artifacts as read-only.",
        ],
    },
}


def backfill() -> None:
    existing = load_observations()
    existing_ids = {o["observation_id"] for o in existing}

    for stage_key, meta in sorted(STAGE_META.items()):
        obs_id = meta["observation_id"]
        if obs_id in existing_ids:
            print(f"  skip (already exists): {obs_id}")
            continue

        obs = {
            "observation_id": obs_id,
            "study_id": "lunar-humanoid-pathfinder",
            "cycle_id": stage_key,
            "date": meta["date"],
            "source": meta["source"],
            "observations": {
                "worked": meta["worked"],
                "failed": meta["failed"],
            },
            "lessons_delta": [{"text": t} for t in meta["lessons_delta"]],
            "trend": meta["trend"],
            "recommendations": meta["recommendations"],
        }

        errors = validate_observation(obs)
        if errors:
            print(f"  ERROR {obs_id}: {errors}")
            continue

        append_observation(obs)
        print(f"  wrote: {obs_id}")


if __name__ == "__main__":
    backfill()
