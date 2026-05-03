# Web Viewer

Static site generator for the study. Reads `study/` and `corpus/`, produces `site/`.

## Setup

```
pip install -r tools/requirements.txt
```

## Build

```
python tools/build_site.py
```

Open `site/index.html` in any browser.

## What it shows

- **Dashboard** — total sections, words, maturity %, open questions, assumptions, margins, per-section status bars.
- **Per-section pages** — rendered markdown with status badge, owner, last-updated, cross-references to other sections.
- **Sidebar nav** — every section, color-coded by status.

## Frontmatter convention

Each markdown file in `study/` should start with YAML frontmatter:

```
---
title: Form Factor Tradespace
status: draft       # not-started | in-progress | draft | reviewed | final
owner: humanoid-systems-architect
last-updated: 2026-05-02
---
```

Files without frontmatter still render — they default to `status: not-started`, `owner: —`.

## Regenerate after every agent session

The site is regenerated from scratch each time. Just rerun the build script.
