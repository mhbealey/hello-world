#!/usr/bin/env python3
"""
Static site generator for the humanoid-forward space exploration study.

Walks study/ and corpus/, parses YAML frontmatter and registers,
renders to site/ as static HTML with navigation, cross-links, and a dashboard.

Usage:
    python tools/build_site.py
"""

import re
import json
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict

import yaml
import markdown
from jinja2 import Environment, FileSystemLoader, select_autoescape

ROOT = Path(__file__).resolve().parent.parent
STUDY_DIR = ROOT / "study"
CORPUS_DIR = ROOT / "corpus"
SITE_DIR = ROOT / "site"
TEMPLATE_DIR = ROOT / "tools" / "templates"
STATIC_DIR = ROOT / "tools" / "static"
RETRO_DIR = ROOT / "retro"
AGENTS_DIR = ROOT / ".claude" / "agents"

STATUS_ORDER = ["not-started", "in-progress", "draft", "reviewed", "final"]
STATUS_COLORS = {
    "not-started": "#9ca3af",
    "in-progress": "#f59e0b",
    "draft": "#3b82f6",
    "reviewed": "#8b5cf6",
    "final": "#10b981",
}

AGENT_STATUS_COLORS = {
    "active": "#10b981",
    "idle": "#f59e0b",
    "never-run": "#9ca3af",
}

HEALTH_COLORS = {
    "green": "#10b981",
    "yellow": "#f59e0b",
    "red": "#ef4444",
}


def parse_frontmatter(text):
    """Extract YAML frontmatter from markdown. Returns (meta_dict, body_str)."""
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


def format_section_label(section):
    """'01-optimal-space-humanoid' -> '1. Optimal Space Humanoid'."""
    if section == "_root":
        return "Front Matter"
    parts = section.split("-", 1)
    if len(parts) == 2 and parts[0].isdigit():
        return f"{int(parts[0])}. {parts[1].replace('-', ' ').title()}"
    return section.replace("-", " ").title()


def out_filename(rel_path):
    """study/01-foo/02-bar.md -> 01-foo__02-bar.html"""
    return rel_path.replace("/", "__").replace(".md", ".html")


def extract_cross_refs(body, all_rel_paths):
    """Find references to other study files in the body."""
    refs = set()
    for rel in all_rel_paths:
        stem = rel.replace(".md", "")
        if rel in body or stem in body:
            refs.add(rel)
    return sorted(refs)


def collect_files():
    """Walk study/ and return list of file dicts with metadata + rendered HTML."""
    files = []
    if not STUDY_DIR.exists():
        return files

    all_paths = sorted(STUDY_DIR.rglob("*.md"))
    all_rel = [p.relative_to(STUDY_DIR).as_posix() for p in all_paths]

    md = markdown.Markdown(
        extensions=["tables", "fenced_code", "toc", "footnotes", "sane_lists"],
        output_format="html5",
    )

    for path in all_paths:
        text = path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        rel = path.relative_to(STUDY_DIR).as_posix()
        section = rel.split("/")[0] if "/" in rel else "_root"

        word_count = len(re.findall(r"\b\w+\b", body))
        md.reset()
        html_body = md.convert(body)

        files.append({
            "path": rel,
            "section": section,
            "section_label": format_section_label(section),
            "title": meta.get("title") or path.stem.replace("-", " ").title(),
            "status": meta.get("status", "not-started"),
            "owner": meta.get("owner", "—"),
            "last_updated": meta.get("last-updated", "—"),
            "words": word_count,
            "html_body": html_body,
            "cross_refs": extract_cross_refs(body, all_rel),
            "out_file": out_filename(rel),
        })

    return files


def parse_open_questions():
    """Parse study/05-cross-cutting/open-questions.md into rows."""
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


def parse_md_table(section_text):
    """Parse a markdown table into list of row-dicts."""
    lines = [l for l in section_text.splitlines() if l.strip().startswith("|")]
    if len(lines) < 2:
        return []
    headers = [h.strip() for h in lines[0].strip("|").split("|")]
    rows = []
    for line in lines[2:]:
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) == len(headers):
            rows.append(dict(zip(headers, cells)))
    return rows


def parse_margins_and_assumptions():
    """Parse the margins/assumptions register."""
    path = STUDY_DIR / "05-cross-cutting" / "margins-and-assumptions.md"
    if not path.exists():
        return [], []
    text = path.read_text(encoding="utf-8")
    _, body = parse_frontmatter(text)
    margins, assumptions = [], []
    sections = re.split(r"^##\s+", body, flags=re.MULTILINE)
    for sec in sections:
        head = sec.split("\n", 1)[0].strip().lower()
        if head.startswith("margins"):
            margins = parse_md_table(sec)
        elif head.startswith("assumptions"):
            assumptions = parse_md_table(sec)
    return margins, assumptions


def build_activity_feed(limit=20):
    """Parse retro/session-logs.md into a reverse-chronological feed."""
    path = RETRO_DIR / "session-logs.md"
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    _, body = parse_frontmatter(text)
    entries = re.split(r"^##\s+", body, flags=re.MULTILINE)[1:]
    feed = []
    for e in reversed(entries[-limit:]):
        first_line = e.split("\n", 1)[0].strip()
        body_text = (e.split("\n", 1)[1].strip() if "\n" in e else "")[:300]
        agent_match = re.search(r"—\s*([^:—\n]+):", first_line)
        agent = agent_match.group(1).strip() if agent_match else "orchestrator"
        feed.append({"title": first_line, "body": body_text, "agent": agent})
    return feed


def collect_agents():
    """Walk .claude/agents/ and return list of agent dicts with activity info."""
    agents = []
    if not AGENTS_DIR.exists():
        return agents

    sessions_text = ""
    sessions_path = RETRO_DIR / "session-logs.md"
    if sessions_path.exists():
        sessions_text = sessions_path.read_text(encoding="utf-8").lower()

    recent_sessions = re.split(r"^##\s+", sessions_text, flags=re.MULTILINE)[-3:]
    recent_text = " ".join(recent_sessions)

    for path in sorted(AGENTS_DIR.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        meta, _ = parse_frontmatter(text)
        name = meta.get("name") or path.stem
        description = meta.get("description", "No description.")

        mentions = sessions_text.count(name.lower().replace("-", " "))
        mentions += sessions_text.count(name.lower())
        recent = name.lower() in recent_text or name.lower().replace("-", " ") in recent_text

        status = "active" if recent else ("idle" if mentions > 0 else "never-run")

        agents.append({
            "name": name,
            "description": description[:220] if description else "No description.",
            "mentions": mentions,
            "status": status,
            "status_color": AGENT_STATUS_COLORS.get(status, "#9ca3af"),
            "path": path.relative_to(ROOT).as_posix(),
        })

    return sorted(agents, key=lambda a: (-a["mentions"], a["name"]))


def build_health_panel(files):
    """Build four system health indicators."""
    # 1. Breadcrumb freshness
    sessions_path = RETRO_DIR / "session-logs.md"
    bc_status, bc_label = "red", "No session logs"
    if sessions_path.exists():
        body = sessions_path.read_text(encoding="utf-8")
        dates = re.findall(r"## (\d{4}-\d{2}-\d{2})", body)
        if dates:
            try:
                latest = datetime.strptime(dates[-1], "%Y-%m-%d")
                delta = datetime.now() - latest
                if delta.days <= 1:
                    bc_status, bc_label = "green", f"Updated {dates[-1]}"
                elif delta.days <= 7:
                    bc_status, bc_label = "yellow", f"Updated {dates[-1]}"
                else:
                    bc_status, bc_label = "red", f"Stale since {dates[-1]}"
            except ValueError:
                bc_status, bc_label = "yellow", "Date parse error"
        else:
            bc_status, bc_label = "red", "No dated entries"

    # 2. Registry contradictions
    reg_path = STUDY_DIR / "05-cross-cutting" / "margins-and-assumptions.md"
    reg_status, reg_label = "green", "No contradictions detected"
    if reg_path.exists():
        reg_text = reg_path.read_text(encoding="utf-8").lower()
        trl_rows = [l for l in reg_text.split("\n") if "trl" in l and "|" in l and "humanoid" in l]
        if len(trl_rows) > 1:
            reg_status, reg_label = "red", f"{len(trl_rows)} possible TRL contradiction rows"

    # 3. Review coverage
    total = len(files) if files else 1
    accepted = sum(1 for f in files if f.get("status") == "accepted")
    rev_pct = round(100 * accepted / total)
    rev_status = "green" if rev_pct >= 80 else ("yellow" if rev_pct >= 40 else "red")
    rev_label = f"{rev_pct}% sections reviewed"

    # 4. Cross-coupling log entries
    coupling_path = STUDY_DIR / "05-cross-cutting" / "cross-coupling-log.md"
    cc_count = 0
    if coupling_path.exists():
        cc_text = coupling_path.read_text(encoding="utf-8")
        cc_count = len(re.findall(r"^## \d{4}-\d{2}-\d{2}", cc_text, re.MULTILINE))
    cc_status = "green" if cc_count >= 3 else ("yellow" if cc_count >= 1 else "red")
    cc_label = f"{cc_count} decisions logged"

    return {
        "breadcrumb": {"status": bc_status, "color": HEALTH_COLORS[bc_status], "label": bc_label},
        "registry":   {"status": reg_status, "color": HEALTH_COLORS[reg_status], "label": reg_label},
        "review":     {"status": rev_status, "color": HEALTH_COLORS[rev_status], "label": rev_label, "pct": rev_pct},
        "coupling":   {"status": cc_status, "color": HEALTH_COLORS[cc_status], "label": cc_label},
    }


def collect_charts():
    """Return list of chart filenames in site/charts/ (built before this call)."""
    charts_dir = SITE_DIR / "charts"
    if not charts_dir.exists():
        return []
    return [p.name for p in sorted(charts_dir.glob("*.png"))]


def build_dashboard(files):
    """Aggregate stats."""
    by_status = {s: 0 for s in STATUS_ORDER}
    by_section = {}
    total_words = 0

    for f in files:
        status = f["status"] if f["status"] in by_status else "not-started"
        by_status[status] += 1
        total_words += f["words"]
        sec = f["section_label"]
        if sec not in by_section:
            by_section[sec] = {
                "total": 0,
                "words": 0,
                "by_status": {s: 0 for s in STATUS_ORDER},
            }
        by_section[sec]["total"] += 1
        by_section[sec]["words"] += f["words"]
        by_section[sec]["by_status"][status] += 1

    completion_pct = 0
    if files:
        weighted = sum(STATUS_ORDER.index(f["status"]) for f in files if f["status"] in STATUS_ORDER)
        max_weighted = len(files) * (len(STATUS_ORDER) - 1)
        completion_pct = round(100 * weighted / max_weighted) if max_weighted else 0

    return {
        "total_files": len(files),
        "by_status": by_status,
        "by_section": by_section,
        "total_words": total_words,
        "completion_pct": completion_pct,
        "status_colors": STATUS_COLORS,
        "status_order": STATUS_ORDER,
    }


def build_nav(files):
    """Group files by section for sidebar."""
    nav = defaultdict(list)
    for f in files:
        nav[f["section_label"]].append(f)

    def sort_key(label):
        m = re.match(r"(\d+)\.", label)
        return (int(m.group(1)) if m else 999, label)

    return sorted(nav.items(), key=lambda kv: sort_key(kv[0]))


def render_site(files, dashboard, open_qs, margins, assumptions,
                activity_feed, agents, health, charts):
    """Render the full site."""
    if SITE_DIR.exists():
        shutil.rmtree(SITE_DIR)
    SITE_DIR.mkdir(parents=True)
    (SITE_DIR / "charts").mkdir(exist_ok=True)

    if STATIC_DIR.exists():
        shutil.copytree(STATIC_DIR, SITE_DIR / "static")

    env = Environment(
        loader=FileSystemLoader(str(TEMPLATE_DIR)),
        autoescape=select_autoescape(["html"]),
    )

    nav = build_nav(files)
    common = {
        "nav": nav,
        "build_time": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status_colors": STATUS_COLORS,
        "health_colors": HEALTH_COLORS,
        "agent_count": len(agents),
    }

    # Dashboard
    tpl = env.get_template("dashboard.html")
    (SITE_DIR / "index.html").write_text(tpl.render(
        dashboard=dashboard,
        open_questions=open_qs,
        margins=margins,
        assumptions=assumptions,
        files=files,
        activity_feed=activity_feed,
        health=health,
        charts=charts,
        **common,
    ), encoding="utf-8")

    # Agent roster
    if env.loader.list_templates() and "agents.html" in env.loader.list_templates():
        tpl_agents = env.get_template("agents.html")
        (SITE_DIR / "agents.html").write_text(tpl_agents.render(
            agents=agents,
            **common,
        ), encoding="utf-8")

    # Section pages
    tpl = env.get_template("page.html")
    files_by_path = {f["path"]: f for f in files}
    for f in files:
        cross_ref_links = []
        for ref in f["cross_refs"]:
            if ref in files_by_path:
                cross_ref_links.append({
                    "path": ref,
                    "title": files_by_path[ref]["title"],
                    "out_file": files_by_path[ref]["out_file"],
                })
        out = SITE_DIR / f["out_file"]
        out.write_text(tpl.render(
            file=f,
            cross_ref_links=cross_ref_links,
            **common,
        ), encoding="utf-8")

    search_index = [{
        "title": f["title"],
        "section": f["section_label"],
        "out_file": f["out_file"],
        "status": f["status"],
        "snippet": re.sub(r"<[^>]+>", " ", f["html_body"])[:300],
    } for f in files]
    (SITE_DIR / "search-index.json").write_text(
        json.dumps(search_index), encoding="utf-8"
    )

    print(f"Built {len(files)} pages -> {SITE_DIR}/index.html")
    if (SITE_DIR / "agents.html").exists():
        print(f"Agent roster -> {SITE_DIR}/agents.html ({len(agents)} agents)")


def main():
    if not STUDY_DIR.exists():
        print(f"Warning: {STUDY_DIR} does not exist yet. Creating empty site.")
        STUDY_DIR.mkdir(parents=True, exist_ok=True)

    files = collect_files()
    dashboard = build_dashboard(files)
    open_qs = parse_open_questions()
    margins, assumptions = parse_margins_and_assumptions()
    activity_feed = build_activity_feed()
    agents = collect_agents()
    health = build_health_panel(files)
    charts = collect_charts()
    render_site(files, dashboard, open_qs, margins, assumptions,
                activity_feed, agents, health, charts)


if __name__ == "__main__":
    main()
