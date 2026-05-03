#!/usr/bin/env python3
"""
Sync open questions and review findings to GitHub issues.

Reads study/05-cross-cutting/open-questions.md (and review/*-findings.md
when they exist) and creates or updates GitHub issues. Idempotent —
matches on title prefix to avoid duplicates.

Usage:
    python tools/sync_to_github.py --repo owner/repo [--dry-run]

Requirements:
    pip install PyGithub

Authentication:
    Set GITHUB_TOKEN environment variable, or use gh CLI credentials.
"""

import argparse
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STUDY_DIR = ROOT / "study"

DOMAIN_LABELS = {
    "scope": "domain:scope",
    "autonomy": "domain:autonomy",
    "power": "domain:power",
    "form factor": "domain:form-factor",
    "isru": "domain:isru",
    "framing": "domain:framing",
    "cost": "domain:cost",
    "human-factors": "domain:human-factors",
    "actuation/thermal": "domain:actuation",
    "actuation/power": "domain:actuation",
    "sealing/dust": "domain:dust",
    "serviceability/dust": "domain:dust",
    "compute/radiation": "domain:compute",
    "compute/trl": "domain:compute",
    "sensing/illumination": "domain:sensing",
    "sensing/tactile": "domain:sensing",
    "autonomy/locomotion": "domain:autonomy",
    "autonomy/ood": "domain:autonomy",
    "latency/supervision": "domain:latency",
    "thermal/humanoid": "domain:thermal",
    "radiation/silicon-tid": "domain:radiation",
    "thermal/ndfeb": "domain:thermal",
    "thermal/connector": "domain:thermal",
    "dust/radiator": "domain:dust",
    "conops/spe": "domain:conops",
}


def parse_frontmatter(text):
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    try:
        import yaml
        meta = yaml.safe_load(parts[1]) or {}
    except Exception:
        meta = {}
    return meta, parts[2].lstrip()


def parse_open_questions():
    path = STUDY_DIR / "05-cross-cutting" / "open-questions.md"
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    _, body = parse_frontmatter(text)
    rows = []
    pattern = re.compile(
        r"^\s*-\s*\[([^\]]+)\]\s*(.+?)\s*—\s*(.+?)\s*—\s*(.+?)\s*—\s*(.+)$"
    )
    for line in body.splitlines():
        m = pattern.match(line)
        if m:
            domain = m.group(1).strip()
            question = m.group(2).strip()
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


def make_issue_title(q):
    tag = f"[{q['domain']}]"
    text = q["question"]
    max_len = 80 - len(tag) - 1
    if len(text) > max_len:
        text = text[:max_len - 1] + "…"
    return f"{tag} {text}"


def make_issue_body(q):
    return (
        f"**Domain:** {q['domain']}\n\n"
        f"**Question:** {q['question']}\n\n"
        f"**Context:** {q['context']}\n\n"
        f"**Owner:** {q['owner']}\n\n"
        f"**By when:** {q['by_when']}\n\n"
        f"---\n"
        f"*Auto-synced from `study/05-cross-cutting/open-questions.md`*"
    )


def get_domain_label(domain):
    key = domain.lower()
    return DOMAIN_LABELS.get(key, f"domain:{key.split('/')[0]}")


def sync_issues(owner, repo, dry_run=False):
    try:
        from github import Github, GithubException
    except ImportError:
        print("ERROR: PyGithub not installed. Run: pip install PyGithub")
        sys.exit(1)

    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        # Try reading from gh CLI credential store
        import subprocess
        try:
            result = subprocess.run(
                ["gh", "auth", "token"], capture_output=True, text=True
            )
            token = result.stdout.strip() if result.returncode == 0 else None
        except FileNotFoundError:
            pass

    if not token:
        print("ERROR: No GitHub token. Set GITHUB_TOKEN or authenticate with `gh auth login`.")
        sys.exit(1)

    g = Github(token)
    try:
        gh_repo = g.get_repo(f"{owner}/{repo}")
    except GithubException as e:
        print(f"ERROR: Cannot access {owner}/{repo}: {e}")
        sys.exit(1)

    # Get existing issues (open only) for deduplication
    existing = {}
    for issue in gh_repo.get_issues(state="open"):
        existing[issue.title] = issue

    questions = parse_open_questions()
    created, updated, skipped = 0, 0, 0

    for q in questions:
        title = make_issue_title(q)
        body = make_issue_body(q)
        labels = ["type:open-question", get_domain_label(q["domain"])]

        if title in existing:
            issue = existing[title]
            if issue.body != body:
                if dry_run:
                    print(f"  DRY-RUN update: {title}")
                else:
                    issue.edit(body=body)
                    print(f"  Updated: {title}")
                updated += 1
            else:
                skipped += 1
        else:
            if dry_run:
                print(f"  DRY-RUN create: {title}")
            else:
                try:
                    gh_repo.create_issue(title=title, body=body, labels=labels)
                    print(f"  Created: {title}")
                except GithubException:
                    # Labels may not exist yet; create without labels
                    gh_repo.create_issue(title=title, body=body)
                    print(f"  Created (no labels): {title}")
            created += 1

    print(f"\nSync complete: {created} created, {updated} updated, {skipped} unchanged")


def main():
    parser = argparse.ArgumentParser(description="Sync open questions to GitHub issues")
    parser.add_argument("--repo", required=True, help="owner/repo")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    parts = args.repo.split("/")
    if len(parts) != 2:
        print("ERROR: --repo must be owner/repo format")
        sys.exit(1)

    sync_issues(parts[0], parts[1], dry_run=args.dry_run)


if __name__ == "__main__":
    main()
