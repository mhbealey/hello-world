#!/usr/bin/env python3
"""
Generate the stage handback document.

Reads the repo state — section content, frontmatter, review findings,
retro artifacts, session logs, cross-coupling log, assumption registry —
and produces a single self-contained markdown document for the next
planning session.

Usage:
    python tools/generate_handback.py [--stage N] [--out path]

Defaults:
    --stage 4
    --out handback-stage{N}.md
"""

import argparse
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict

import yaml

ROOT = Path(__file__).resolve().parent.parent
STUDY_DIR = ROOT / "study"
REVIEW_DIR = ROOT / "review"
RETRO_DIR = ROOT / "retro"
CORPUS_DIR = ROOT / "corpus"

STATUS_ORDER = ["not-started", "in-progress", "draft", "reviewed", "final"]
REVIEW_STATUS_ORDER = ["unreviewed", "findings-open", "findings-addressed", "accepted"]


def parse_frontmatter(text):
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    try:
        meta = yaml.safe_load(parts[1]) or {}
    except yaml.YAMLError:
        meta = {}
    return meta, parts[2].lstrip()


def collect_section_state():
    """Walk study/, return list of section dicts with metadata + word count."""
    sections = []
    if not STUDY_DIR.exists():
        return sections

    for path in sorted(STUDY_DIR.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        rel = path.relative_to(ROOT).as_posix()
        words = len(re.findall(r"\b\w+\b", body))
        sections.append({
            "path": rel,
            "title": meta.get("title") or path.stem.replace("-", " ").title(),
            "status": meta.get("status", "not-started"),
            "review_status": meta.get("review-status", "unreviewed"),
            "owner": meta.get("owner", "—"),
            "last_updated": meta.get("last-updated", "—"),
            "words": words,
            "body": body,
        })
    return sections


def parse_findings_summary(path):
    """Extract severity counts and findings list from a reviewer report."""
    if not path.exists():
        return {"counts": {}, "findings": [], "exists": False}

    text = path.read_text(encoding="utf-8")
    _, body = parse_frontmatter(text)

    counts = {}
    for sev in ["Blocker", "Major", "Minor", "Nit"]:
        m = re.search(rf"\|\s*{sev}\s*\|\s*(\d+)\s*\|", body, re.IGNORECASE)
        if m:
            counts[sev.lower()] = int(m.group(1))
        else:
            counts[sev.lower()] = 0

    findings = []
    finding_blocks = re.split(r"^###\s+Finding\s+", body, flags=re.MULTILINE)[1:]
    for block in finding_blocks:
        finding = {}
        title_match = re.match(r"([^\n]+)", block)
        if title_match:
            finding["title"] = title_match.group(1).strip()
        for field in ["Severity", "Section", "Claim", "Issue", "Required action"]:
            m = re.search(rf"\*\*{field}:\*\*\s*([^\n]+)", block)
            if m:
                finding[field.lower().replace(" ", "_")] = m.group(1).strip()
        if finding:
            findings.append(finding)

    return {"counts": counts, "findings": findings, "exists": True}


def collect_all_findings():
    """Read all review/*-findings.md files."""
    reviewers = [
        "aerospace-engineer",
        "heritage-citations",
        "reliability-margins",
        "scope-discipline",
        "cross-coupling",
        "devils-advocate",
    ]
    results = {}
    for r in reviewers:
        path = REVIEW_DIR / f"{r}-findings.md"
        results[r] = parse_findings_summary(path)
    return results


def find_cross_reviewer_patterns(all_findings):
    """Identify findings that multiple reviewers flagged on the same section/claim."""
    section_hits = defaultdict(list)
    for reviewer, data in all_findings.items():
        for f in data.get("findings", []):
            sec = f.get("section", "").split(",")[0].strip()
            if sec:
                section_hits[sec].append({
                    "reviewer": reviewer,
                    "severity": f.get("severity", "?"),
                    "title": f.get("title", ""),
                    "issue": f.get("issue", ""),
                })
    return {sec: hits for sec, hits in section_hits.items() if len(hits) >= 2}


def read_or_blank(path):
    if path.exists():
        return path.read_text(encoding="utf-8")
    return ""


def extract_after_frontmatter(text):
    _, body = parse_frontmatter(text)
    return body


def parse_session_logs():
    path = RETRO_DIR / "session-logs.md"
    if not path.exists():
        return []
    body = extract_after_frontmatter(path.read_text(encoding="utf-8"))
    sessions = re.split(r"^##\s+", body, flags=re.MULTILINE)[1:]
    return [s.strip() for s in sessions if s.strip()]


def parse_cross_coupling_log():
    path = STUDY_DIR / "05-cross-cutting" / "cross-coupling-log.md"
    if not path.exists():
        return []
    body = extract_after_frontmatter(path.read_text(encoding="utf-8"))
    entries = re.split(r"^##\s+", body, flags=re.MULTILINE)[1:]
    return [e.strip() for e in entries if e.strip()]


def parse_open_questions():
    path = STUDY_DIR / "05-cross-cutting" / "open-questions.md"
    if not path.exists():
        return []
    body = extract_after_frontmatter(path.read_text(encoding="utf-8"))
    rows = []
    pattern = re.compile(
        r"^\s*-\s*\[([^\]]+)\]\s*(.+?)\s*—\s*(.+?)\s*—\s*(.+?)\s*—\s*(.+)$"
    )
    for line in body.splitlines():
        m = pattern.match(line)
        if m:
            domain = m.group(1).strip()
            question = m.group(2).strip()
            # Filter out format-documentation placeholder rows
            if domain.lower() == "domain" or question.lower() == "question":
                continue
            rows.append({
                "domain": domain,
                "question": question,
                "context": m.group(3).strip(),
                "owner": m.group(4).strip(),
                "by_when": m.group(5).strip(),
            })
    return rows


def get_assumption_registry_text():
    path = STUDY_DIR / "05-cross-cutting" / "margins-and-assumptions.md"
    return read_or_blank(path)


def get_critical_section_text(sections, max_chars=8000):
    """Return full text of the most-mature sections, truncated to max_chars total."""
    mature = [s for s in sections if s["status"] in ("draft", "reviewed", "final")]
    mature.sort(key=lambda s: s["words"], reverse=True)

    output = []
    chars_used = 0
    for s in mature:
        chunk = f"\n\n### {s['title']} (`{s['path']}`)\n\n{s['body']}\n"
        if chars_used + len(chunk) > max_chars:
            chunk = chunk[: max_chars - chars_used] + "\n\n*[truncated]*"
            output.append(chunk)
            break
        output.append(chunk)
        chars_used += len(chunk)
    return "\n".join(output)


def build_handback(stage_num):
    sections = collect_section_state()
    all_findings = collect_all_findings()
    cross_patterns = find_cross_reviewer_patterns(all_findings)
    sessions = parse_session_logs()
    coupling = parse_cross_coupling_log()
    open_qs = parse_open_questions()

    total_words = sum(s["words"] for s in sections)
    by_status = defaultdict(int)
    by_review_status = defaultdict(int)
    for s in sections:
        by_status[s["status"]] += 1
        by_review_status[s["review_status"]] += 1

    total_blockers = sum(d["counts"].get("blocker", 0) for d in all_findings.values())
    total_majors = sum(d["counts"].get("major", 0) for d in all_findings.values())
    total_minors = sum(d["counts"].get("minor", 0) for d in all_findings.values())
    total_nits = sum(d["counts"].get("nit", 0) for d in all_findings.values())

    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    out = []
    out.append(f"# Stage {stage_num} Handback")
    out.append("")
    out.append(
        f"*Generated {now}. Self-contained handback for the next planning session. "
        f"Paste this entire document into a new conversation to plan stages "
        f"{stage_num + 1}+.*"
    )
    out.append("")
    out.append("---")
    out.append("")

    # 1. Executive snapshot
    out.append("## 1. Executive Snapshot")
    out.append("")
    out.append(f"**Total sections:** {len(sections)}")
    out.append(f"**Total words written:** {total_words:,}")
    out.append("")
    out.append("**Section status:**")
    for status in STATUS_ORDER:
        c = by_status.get(status, 0)
        if c:
            out.append(f"- {status}: {c}")
    out.append("")
    out.append("**Review status:**")
    for rs in REVIEW_STATUS_ORDER:
        c = by_review_status.get(rs, 0)
        if c:
            out.append(f"- {rs}: {c}")
    out.append("")
    out.append("**Findings totals:**")
    out.append(f"- Blockers: {total_blockers}")
    out.append(f"- Majors: {total_majors}")
    out.append(f"- Minors: {total_minors}")
    out.append(f"- Nits: {total_nits}")
    out.append("")

    # 2. What got built
    out.append("## 2. What Got Built")
    out.append("")
    out.append("| Section | Status | Review | Owner | Words | Updated |")
    out.append("|---------|--------|--------|-------|------:|---------|")
    for s in sections:
        out.append(
            f"| {s['title']} | {s['status']} | {s['review_status']} | "
            f"{s['owner']} | {s['words']:,} | {s['last_updated']} |"
        )
    out.append("")

    # 3. What's broken — findings that matter
    out.append("## 3. Findings That Matter")
    out.append("")
    out.append(
        "Blockers and majors only. Minors and nits omitted from handback "
        "(they're in the repo)."
    )
    out.append("")

    for reviewer, data in all_findings.items():
        if not data.get("exists"):
            continue
        blockers = [f for f in data["findings"]
                    if f.get("severity", "").lower().startswith("blocker")]
        majors = [f for f in data["findings"]
                  if f.get("severity", "").lower().startswith("major")]
        if not blockers and not majors:
            continue
        out.append(f"### {reviewer}")
        out.append("")
        for f in blockers + majors:
            sev = f.get("severity", "?")
            out.append(f"**[{sev}] {f.get('title', '(untitled)')}**")
            if f.get("section"):
                out.append(f"- *Section:* {f['section']}")
            if f.get("claim"):
                out.append(f"- *Claim:* {f['claim']}")
            if f.get("issue"):
                out.append(f"- *Issue:* {f['issue']}")
            if f.get("required_action"):
                out.append(f"- *Required action:* {f['required_action']}")
            out.append("")

    # 4. Cross-reviewer patterns
    if cross_patterns:
        out.append("## 4. Patterns Across Reviewers")
        out.append("")
        out.append("Sections flagged by 2+ reviewers — these are the priorities.")
        out.append("")
        for sec, hits in cross_patterns.items():
            out.append(f"### {sec}")
            out.append("")
            for h in hits:
                out.append(
                    f"- **{h['reviewer']}** [{h['severity']}]: "
                    f"{h['title']} — {h['issue']}"
                )
            out.append("")
    else:
        out.append("## 4. Patterns Across Reviewers")
        out.append("")
        out.append("*No sections flagged by 2+ reviewers (or reviews not yet run).*")
        out.append("")

    # 5. Decisions that got made
    out.append("## 5. Decisions Locked In")
    out.append("")
    out.append(
        "From `study/05-cross-cutting/cross-coupling-log.md`. "
        "These constrain stages going forward."
    )
    out.append("")
    if coupling:
        for entry in coupling:
            first_line = entry.split("\n", 1)[0] if "\n" in entry else entry[:80]
            out.append(f"### {first_line}")
            out.append("")
            out.append(entry)
            out.append("")
    else:
        out.append("*No cross-coupling decisions logged yet.*")
        out.append("")

    # 6. Open questions blocking progress
    out.append("## 6. Open Questions Blocking Progress")
    out.append("")
    if open_qs:
        out.append("| Domain | Question | Owner | By when |")
        out.append("|--------|----------|-------|---------|")
        for q in open_qs:
            out.append(
                f"| {q['domain']} | {q['question']} | {q['owner']} | {q['by_when']} |"
            )
    else:
        out.append("*No open questions registered.*")
    out.append("")

    # 7. Assumption registry (full)
    out.append("## 7. Assumption Registry (Full)")
    out.append("")
    out.append("Verbatim from `study/05-cross-cutting/margins-and-assumptions.md`.")
    out.append("")
    reg_text = get_assumption_registry_text()
    if reg_text:
        out.append(extract_after_frontmatter(reg_text))
    else:
        out.append("*Registry not found.*")
    out.append("")

    # 8. What broke in the agent system
    out.append("## 8. What Broke in the Agent System")
    out.append("")
    for retro_file in ["agent-performance.md", "orchestrator-performance.md",
                       "process-lessons.md"]:
        path = RETRO_DIR / retro_file
        if path.exists():
            out.append(f"### {retro_file}")
            out.append("")
            out.append(extract_after_frontmatter(path.read_text(encoding="utf-8")))
            out.append("")

    if not any((RETRO_DIR / f).exists() for f in
               ["agent-performance.md", "orchestrator-performance.md", "process-lessons.md"]):
        out.append("*No retro artifacts found.*")
        out.append("")

    # 9. Session logs (compressed)
    out.append("## 9. Session Logs")
    out.append("")
    if sessions:
        if len(sessions) > 10:
            out.append(
                f"*Showing last 10 of {len(sessions)} sessions. "
                "Earlier sessions: titles only.*"
            )
            out.append("")
            for s in sessions[:-10]:
                first_line = s.split("\n", 1)[0]
                out.append(f"- {first_line}")
            out.append("")
            out.append("**Recent sessions (full):**")
            out.append("")
            for s in sessions[-10:]:
                first_line = s.split("\n", 1)[0] if "\n" in s else s[:80]
                out.append(f"### {first_line}")
                out.append("")
                out.append(s)
                out.append("")
        else:
            for s in sessions:
                first_line = s.split("\n", 1)[0] if "\n" in s else s[:80]
                out.append(f"### {first_line}")
                out.append("")
                out.append(s)
                out.append("")
    else:
        out.append("*No session logs found.*")
        out.append("")

    # 10. Critical section content
    out.append("## 10. Critical Section Content (Full Text)")
    out.append("")
    out.append(
        "Full text of the most-mature sections, capped at ~8,000 characters total. "
        "The next planning session reads these to ground its proposals in what was "
        "actually written, not just what the metadata says."
    )
    out.append("")
    out.append(get_critical_section_text(sections))
    out.append("")

    # 11. User's note
    out.append("## 11. User's Note for the Next Planning Session")
    out.append("")
    out.append(
        "*[Edit this section before pasting into the next conversation. "
        "Tell the planner what you're thinking now, what you've changed your "
        "mind about, what surprised you, what you want stages 5+ to focus on. "
        "Three to five sentences is enough.]*"
    )
    out.append("")
    out.append("**Your note:**")
    out.append("")
    out.append("> ")
    out.append("")

    # 12. Instructions for the planner
    out.append("## 12. Instructions for the Next Planning Session")
    out.append("")
    out.append(
        f"You are receiving this handback to design stages "
        f"{stage_num + 1}, {stage_num + 2}, and {stage_num + 3} of the "
        "humanoid-forward space exploration study."
    )
    out.append("")
    out.append("**Your job:**")
    out.append("")
    out.append("1. Read this handback in full.")
    out.append("2. Identify the 2-3 most important findings or patterns.")
    out.append(
        "3. Decide whether the next stage should be remediation "
        "(fixing what's broken), continuation (next major content push), "
        "integration (weaving sections together), or pivot (the findings "
        "revealed something the study needs to change fundamentally)."
    )
    out.append(
        f"4. Propose stages {stage_num + 1}–{stage_num + 3} with concrete scope "
        "for each, in the same single-file scaffolding format used for stages 1-4."
    )
    out.append(
        "5. Be honest if the findings suggest the study should change "
        "direction. The handback exists so the loop can correct itself."
    )
    out.append("")
    out.append("**What good output looks like:**")
    out.append("")
    out.append(f"- A clear assessment of what stages 1–{stage_num} produced.")
    out.append("- A specific recommendation for the next stage with reasoning.")
    out.append(
        "- A scaffolding document for the next stage in the same "
        "`=== FILE: path ===` format used previously."
    )
    out.append(
        "- Any prompt-tuning recommendations for existing agents based "
        "on the retro findings."
    )
    out.append("")
    out.append("---")
    out.append("")
    out.append("*End of handback.*")

    return "\n".join(out)


def check_breadcrumb_freshness():
    """Warn if breadcrumbs are stale or missing."""
    issues = []

    sessions_path = RETRO_DIR / "session-logs.md"
    if sessions_path.exists():
        body = extract_after_frontmatter(sessions_path.read_text(encoding="utf-8"))
        if "## " not in body:
            issues.append("retro/session-logs.md has no session entries")
    else:
        issues.append("retro/session-logs.md does not exist")

    reg_path = STUDY_DIR / "05-cross-cutting" / "margins-and-assumptions.md"
    if reg_path.exists():
        text = reg_path.read_text(encoding="utf-8").lower()
        trl_lines = [l for l in text.split("\n")
                     if "trl" in l and "|" in l and "humanoid" in l]
        if len(trl_lines) > 1:
            issues.append(
                f"Possible TRL contradiction: {len(trl_lines)} TRL-related "
                "assumption rows. Review margins-and-assumptions.md for consistency."
            )

    return issues


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--stage", type=int, default=4)
    parser.add_argument("--out", default=None)
    args = parser.parse_args()

    issues = check_breadcrumb_freshness()
    if issues:
        print("WARNING: breadcrumb issues detected:")
        for i in issues:
            print(f"  - {i}")
        print("\nProceeding anyway, but the handback may be incomplete.")
        print()

    out_path = args.out or f"handback-stage{args.stage}.md"
    handback = build_handback(args.stage)

    Path(out_path).write_text(handback, encoding="utf-8")
    print(f"Handback generated: {out_path}")
    print(f"Length: {len(handback):,} characters / ~{len(handback) // 4:,} tokens")


if __name__ == "__main__":
    main()
