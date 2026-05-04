---
title: Mechanical Cleanup Report
date: 2026-05-04
scope: entire repo
---

# Mechanical Cleanup Report

Scope: rename verbose/unclear/inconsistent items; remove dead code; add missing
headers; fix formatting inconsistencies; flag (but do not modify) architectural
judgment items.

---

## Changes Made

### 1. `tools/generate_charts.py` — hardcoded date in footer

**Before:** `FOOTER = "Humanoid-Forward Space Study — Auto-generated 2026-05-03"`  
**After:** `FOOTER = f"Humanoid-Forward Space Study — Auto-generated {date.today()}"`  
Added `from datetime import date` import. The sister tool `gen_q2_charts.py` already
used `date.today()`; this brings them into alignment.

---

### 2. `tools/gen_q2_charts.py` — missing shebang, hardcoded paths, stale stage labels

**Shebang:** Added `#!/usr/bin/env python3` at line 1 (all other Python tools have it;
this file lacked it, making it inconsistent with the rest of the suite).

**Hardcoded absolute paths (two occurrences):**  
- `out1 = "/home/user/hello-world/site/charts/q2_latency_effectiveness.png"` →  
  `out1 = OUTPUT_DIR / "q2_latency_effectiveness.png"`  
- `out2 = "/home/user/hello-world/site/charts/q2_supervisor_ratio.png"` →  
  `out2 = OUTPUT_DIR / "q2_supervisor_ratio.png"`  

Added `OUTPUT_DIR = Path(__file__).resolve().parent.parent / "site" / "charts"` and
`OUTPUT_DIR.mkdir(parents=True, exist_ok=True)` at module level, matching the pattern
in `generate_charts.py`.

**Stale stage labels in chart titles:**  
- `"Operator Effectiveness vs. RTLT Latency — Q(b) Stage 7"` →  
  `"Operator Effectiveness vs. RTLT Latency — Q(b)"`  
- `"Humanoid Supervisor Ratio Projection — Q(b) Stage 7"` →  
  `"Humanoid Supervisor Ratio Projection — Q(b)"`  

Stage number removed (not pinned to a specific stage; auto-generated on run).

---

### 3. `tools/sync_to_github.py` — inline import inside function

**Before:** `parse_frontmatter()` contained `import yaml` inside the try block.  
**After:** `import yaml` moved to module-level imports (line 27). Matches how all
other tools import `yaml`.

---

### 4. `study/05-cross-cutting/soviet-russian-heritage.md` — missing `title:` field

**Before:** Frontmatter lacked `title:` key; all other study files have one.  
**After:** `title: Soviet/Russian Heritage Research Notes` added.  
Without a title, the handback generator's section table shows the auto-derived
stem name; this makes it explicit.

---

### 5. Study `last-updated` frontmatter — three Q(b) files stale

All three files were modified on 2026-05-04 (confirmed via `git log --format="%ci"`)
but retained `last-updated: 2026-05-03`.

| File | Old | New |
|------|-----|-----|
| `study/02-human-in-the-loop/01-overview.md` | 2026-05-03 | 2026-05-04 |
| `study/02-human-in-the-loop/02-latency-tradespace.md` | 2026-05-03 | 2026-05-04 |
| `study/02-human-in-the-loop/04-teaming-model.md` | 2026-05-03 | 2026-05-04 |

`03-autonomy-trl-tasking.md` already showed `2026-05-04`; no change needed.

---

### 6. `src/app/(app)/trade/page.tsx` — orphaned comment

**Before:** Line 412 read `// Need Badge import` immediately above  
`import { Badge } from "@/components/ui/badge";`  
The `Badge` import was already present; the comment was a leftover TODO from when
it was added and serves no documentation purpose.  
**After:** Comment removed.

---

## Flags — Architectural Judgment Required

These were identified but not modified. Each requires a decision before acting.

---

### F1. `parse_frontmatter()` triplicated across tools

The same function body appears in `generate_handback.py`, `build_site.py`, and
`sync_to_github.py`. The implementations are near-identical; they handle the same
YAML parsing with the same fallback behavior. Refactoring to a shared
`tools/utils.py` would reduce maintenance surface but requires updating three
import chains and confirming the merged behavior is correct in all three contexts.

---

### F2. `parse_open_questions()` duplicated

The same function appears in `generate_handback.py` and `build_site.py`. Same
refactoring opportunity as F1.

---

### F3. `parse_study_files()` in `generate_charts.py` reimplements `collect_section_state()`

`generate_charts.py` contains a simplified version of the study-file walker that
exists in `generate_handback.py` (`collect_section_state`) and `build_site.py`
(`collect_files`). The `generate_charts.py` version uses `.split()` for word count
instead of `re.findall(r"\b\w+\b")`, producing slightly different counts. Once the
shared utility module is created (F1), this should also migrate there.

---

### F4. `gen_q2_charts.py` executes at module import

All chart generation code (two full figures, ~280 lines) runs at module scope, not
inside a `if __name__ == '__main__':` block. This means importing the module in a
REPL or test generates and saves charts immediately. Refactoring to wrap everything
in `main()` and `if __name__ == '__main__': main()` would align with the rest of
the suite but requires extracting the figure-building code into functions (which
also interleave global pyplot state). Non-trivial restructure.

---

### F5. `review-status: stage-8-enforcement-pass` not in recognized status vocabulary

Four Q(b) files use `review-status: stage-8-enforcement-pass`. The handback
generator's `REVIEW_STATUS_ORDER` list is:
`["unreviewed", "findings-open", "findings-addressed", "accepted"]`

The custom value falls outside this list, so these sections show as `not-started`
in the review-status summary of the handback. The semantic intent is closer to
`findings-addressed`. Decision needed: keep the custom value for expressiveness,
or collapse to the recognized vocabulary. If kept, `REVIEW_STATUS_ORDER` in both
`generate_handback.py` and `build_site.py` needs updating.

---

### F6. `handback-stage8-current.md` vs `handback-stage8.md`

Both files exist at repo root. The `-current` variant appears to be an intermediate
artifact from a mid-stage regeneration. If `handback-stage8.md` is the authoritative
final document, `handback-stage8-current.md` can be deleted. Confirm before deleting
in case it contains state not in the final version.

Similarly, `handback-stage4-5.md` exists alongside `handback-stage4.md` and
`handback-stage5.md` — origin unclear. If it is a combined planning document that
was superseded, it can be deleted; if it is the authoritative stage-4→5 bridge,
keep it.

---

### F7. `review/triage.md` — Stage 6 artifact still present

`review/triage.md` is titled "Stage 6 Review Triage" and has status `in-progress`.
The current triage document is `review/triage-stage8.md`. The old file is not dead
(it is historical record), but the mismatched `status: in-progress` could confuse
agents reading it as current state. Decision: rename to `triage-stage6.md` for
naming consistency with `triage-stage8.md`, or leave as-is as historical record.

---

### F8. `src/app/(app)/portfolio/page.tsx:111` — feature stub

`const colorblind = false; // TODO: read from settings`

Dead boolean hardcoded to `false` with a TODO. If colorblind mode is not on the
roadmap, remove it and all downstream uses. If it is, this needs a settings API
call. Decision: this affects the PortfolioChart component; check if the value is
consumed anywhere downstream before removing.

---

### F9. Agent tool-list format inconsistency

All agent definition files use YAML block sequence:
```yaml
tools:
  - Read
  - Write
```
Except `cad-generation-agent.md`, which uses an inline string:
```yaml
tools: Read, Write, Bash, Grep, Glob
```
The Claude Agent SDK may handle both formats, but the inconsistency makes the agent
files harder to machine-parse uniformly. `cad-generation-agent.md` should be
updated to block sequence format if the SDK accepts both.

---

## Patterns Noted (Not Acted On)

1. **`console.error` pattern is correct in all API routes** — every catch block
   logs the error with `console.error`. These are intentional (server-side error
   logging for Vercel), not debug cruft. No action needed.

2. **`eslint-disable @typescript-eslint/no-explicit-any` comments** — appear in
   `portfolio/page.tsx`, `settings/page.tsx`, `trade/page.tsx`, `yahoo.ts`. These
   suppress a real typing gap; the underlying `any` casts are at API response
   boundaries. Not dead code — they suppress lint failures that would block build.

3. **Section comments in `types/schemas.ts`** — `// ---- Claude API Response Schemas ----`
   style headers. These are file-organization dividers, not dead code. No action.

4. **`generate_charts.py` and `gen_q2_charts.py` are both chart generators** but
   operate independently with no shared output directory constant. After F4 is
   resolved, consolidating both under a single entrypoint (`generate_charts.py`)
   or runner script would simplify the build sequence.

5. **Handback files accumulate at repo root** — stage 4, 5, 6, 7, 8 handbacks
   all live at repo root with no subdirectory. At current growth rate (one per
   stage) this is manageable, but a `handbacks/` directory would keep the root
   clean. Deferring as cosmetic.
