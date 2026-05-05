---
title: Codebase Audit — AI Agent Orchestration System
author: Senior Developer Audit
date: 2026-05-04
status: complete
---

# Codebase Audit — AI Agent Orchestration System

**Reviewer:** External senior developer  
**Branch:** `claude/setup-study-scaffolding-GYFFu`  
**Files read:** `system/orchestration/handback.py`, `system/orchestration/new_study.py`, `system/tools/gates.py`, `system/tools/cross_coupling_db.py`, `system/orchestration/schemas/handback.schema.yaml`, `.pre-commit-config.yaml`, `CLAUDE.md`, `ops/audits/audit-v1.0-2026-05-04.md`, full file tree  
**Scope:** Audit only. One structural improvement identified and justified in section 5.

---

## Preliminary note

There is already an audit in this repo — `ops/audits/audit-v1.0-2026-05-04.md`, written by Claude Code on the same day as this engagement. It is genuinely good: accurate diagnosis, correct prioritization, honest about what it got wrong. I am not going to repeat it. This document focuses on what that audit missed, what it was too polite about, and what it got right that I can independently confirm from the code.

Where I agree with the existing audit, I say so briefly. Where I disagree or go deeper, I say so specifically.

---

## 1. What is working well

**The gate architecture is sound.** `gates.py` has a clean separation of concerns — each gate is a standalone function, the runner composes them, exit codes are meaningful. The `Finding` dataclass with severity/gate/path/message/fix is exactly the right shape. A new developer can add a gate by writing one function and adding it to `_GATES`. That is good design.

**The handback schema is tight.** `handback.schema.yaml` uses `additionalProperties: false` on all objects, which means schema drift gets caught, not silently tolerated. The `$defs` pattern for `deliverable` and `findings_summary` is correct. Most vibe-coded YAML schemas I've seen are underspecified; this one is not.

**`cross_coupling_db.py` is the cleanest file in the repo.** The subcommand pattern is clear, `resolve_db()` handles the environment variable fallback correctly, `find_entry()` is a simple linear scan that's appropriate for the data size. The `cmd_validate` subcommand being a first-class citizen is good — it means agents can validate before reading.

**The `new_study.py` agent merge concept is architecturally correct.** The existing audit's section 2.3 identified this: static file merge at study-init time is the right approach for Claude Code's runtime model. The implementation in `_merge_agents()` mostly follows through on it. The concept is sound; the bugs are in the execution (see section 3).

**The retros are load-bearing documentation.** The existing audit called this out and I agree — `process-lessons.md` reads like engineering evidence, not post-hoc narrative. The lessons are specific enough to be falsifiable. This is rare and it means the gate designs in this codebase are grounded in actual failure modes, not speculation.

---

## 2. What is structurally weak

### 2.1 `handback.py` — the cycle key type mismatch is a real bug with a known blast radius

In `_load_findings_summary()` (line ~95):

```python
if str(data.get("cycle", "")) != str(cycle):
    continue
```

This string coercion is doing defensive work that should not be necessary. The YAML findings files store `cycle` as whatever type the agent wrote — sometimes integer `1`, sometimes string `"1"`, sometimes `"01"`. The function coerces both sides to string to handle this, which means integer `1` matches string `"1"` correctly. But it also means integer `1` does **not** match string `"01"` — they coerce to `"1"` and `"01"` respectively, which are not equal.

This is not hypothetical. The handback filenames use zero-padded cycle numbers (`cycle-01.yaml`). The scaffold parsing in `_read_scaffold()` uses `f"{cycle:02d}"` (zero-padded). The session log filtering in `_load_session_summary()` uses the same `str(s.get("cycle", "")) == str(cycle)` pattern. If any agent wrote `cycle: "01"` in a findings YAML (which is natural when copying from a filename), that finding is silently dropped from the handback summary. The client's description of "stage 7 reported stage 6 numbers" is consistent with this mechanism.

**The fix is a schema enforcement problem, not a coercion problem.** The `finding.schema.yaml` should declare `cycle` as `type: integer`. The gates should enforce it. The coercion in `handback.py` is a symptom of schema not being enforced at write time.

### 2.2 `handback.py` — session log loaded twice

`build_handback_markdown()` calls `_load_yaml(sessions_file)` directly (line ~175) to render the session log section. The same file was already loaded inside `_build_next_cycle_inputs()` → `_load_session_summary()` earlier in the same `generate()` call. The file is read from disk twice with no caching.

This is minor on its own. It is a signal that `handback.py` grew by accretion — functions were added independently, each pulling the data it needed, without a shared data-loading pass. As the handback grows to include more structured stores (assumption registry, visual specs), this pattern will produce a function that opens six files three times each. The right fix is a `_load_study_data(study_dir, cycle)` function that loads everything once and passes a context dict to the builders.

### 2.3 `gates.py` — `run_derivation()` drops the last table in any file

The table-parsing state machine in `run_derivation()` resets state when it hits a non-pipe line:

```python
elif in_table:
    # Process accumulated table block
    ...
    table_lines = []
    in_table = False
```

If a markdown file ends while the parser is inside a table — which happens when a table is the last content in a file — the accumulated `table_lines` are never processed. The gate silently passes on any bare numbers in final tables.

This is a pattern I have seen in hand-rolled line-by-line parsers. The fix is to process the accumulated block after the loop exits, not only on transition. One line after the `for` loop:

```python
# flush any trailing table
if table_lines:
    # same processing block
```

### 2.4 `gates.py` — `run_derivation()` is undocumented at the system level

`CLAUDE.md` lists four gates: `WordCountGate`, `CitationIntegrityGate`, `CrossCouplingConsistencyGate`, `FrontmatterValidator`. The `DerivationDisplayGate` (`run_derivation`) exists in the code and runs as part of the default gate suite, but it appears nowhere in the documentation. An operator reading `CLAUDE.md` before running gates does not know it exists. It also runs on `study_path.rglob("*.md")` — all markdown files, not just `study/` section files like the other gates — which means it will flag markdown tables in retros, review files, and handback documents. This is probably unintentional scope.

### 2.5 `new_study.py` — silent agent file collision in `_merge_agents()`

The merge writes all agent files flat into `.claude/agents/`:

```python
_write_agent(_AGENTS_OUT / base_file.name, content)
```

If two source directories contain a file with the same name, the second write silently overwrites the first. The `visualization/` subdirectory inside base agents (`system/agents/base/visualization/`) contains five files. Those are written to `.claude/agents/<filename>.md` alongside base agents. If a future domain overlay or reviewer file shares a name with any visualization agent, the collision is silent and the wrong agent definition becomes active.

The fix is collision detection before the write loop: build a set of filenames being written, assert no duplicates before writing any of them.

### 2.6 `new_study.py` — no sync validation between `system/agents/` and `.claude/agents/`

After `new_study.py` runs, the active agent set in `.claude/agents/` is a snapshot of `system/agents/` at that moment. If a base agent is later edited in `system/agents/base/`, the active copy in `.claude/agents/` goes stale immediately. Nothing detects this. The orchestrator runs against stale agents until someone manually re-runs `new_study.py` or notices the divergence.

There should be a gate — or at minimum a pre-session check — that compares modification timestamps or content hashes between `system/agents/**/*.md` and the corresponding `.claude/agents/` files and warns when they diverge. This is a low-effort check that prevents an entire class of silent errors.

### 2.7 `cross_coupling_db.py` — `load()` has no error handling

```python
def load(db_path: str) -> dict:
    with open(db_path, encoding="utf-8") as fh:
        return yaml.safe_load(fh)
```

If the file does not exist, this raises `FileNotFoundError` with a Python traceback — not the consistent `error: ...` + `sys.exit(1)` pattern used everywhere else in the same file. An agent invoking this via Bash will see an uncaught exception instead of a clean error message. Consistent error handling matters when the consumer is another AI parsing stdout.

The fix is four lines:

```python
def load(db_path: str) -> dict:
    if not os.path.exists(db_path):
        print(f"error: DB file not found: {db_path}", file=sys.stderr)
        sys.exit(1)
    with open(db_path, encoding="utf-8") as fh:
        return yaml.safe_load(fh)
```

---

## 3. What is vulnerable

### 3.1 No enforcement that `finding.schema.yaml` `cycle` field is integer

The root cause of the stale-data bug in section 2.1 is that findings files are written by agents and never validated against the schema at write time. The `finding.schema.yaml` exists in `system/orchestration/schemas/`. The gates run on study markdown files. Nobody runs the schema validator on findings YAML before they are read by `handback.py`.

The `validate_all_yaml.py` tool exists and runs in pre-commit (`schema-validation` hook). But it validates `cross_coupling.yaml` and `assumption_registry.yaml` — whether it validates individual finding files depends on its implementation, which I have not seen. If it does not, findings files are unvalidated structured data that handback.py trusts unconditionally.

This is the highest-severity data integrity gap in the system.

### 3.2 Pre-commit gates only run on `types: [yaml]` changes

The `schema-validation` hook in `.pre-commit-config.yaml` has `types: [yaml]`. This means it runs only when a YAML file is staged. A commit that modifies only markdown study files does not trigger schema validation. The `pytest-fast` hook only runs at `pre-push`, not pre-commit. A developer (or Claude Code session) can commit broken markdown — missing frontmatter, invalid citations, malformed cross-coupling references — and the gates never fire.

The intent is clearly for gates to run before any study content is committed. The current hook configuration does not achieve this. The `schema-validation` and a `study-gates` hook should both trigger on markdown changes.

### 3.3 `_visual_specs()` in `new_study.py` uses naive string replacement as templating

```python
text = text.replace("<study-id>", study_id)
text = text.replace("<domain>", domain)
```

This is fragile in three ways: it fails silently if the template changes placeholder names; it does not escape study IDs that contain YAML-special characters; and it replaces every occurrence of the literal string `<study-id>` in the template, including any that appear in comments or example values. As long as study IDs are simple slugs this will not break. The moment someone passes `--id "my study: v1"` the output YAML is malformed.

The fix is to use proper YAML construction — build the dict in Python and serialize it — rather than text substitution on a template file.

---

## 4. What I would refactor first, and what I would never touch

**Refactor first: findings YAML validation at write time.**

The cycle type mismatch bug (section 2.1) and the broader data integrity gap (section 3.1) both trace to the same root: findings files are agent-written YAML that is read by `handback.py` without validation. Enforcing `finding.schema.yaml` on write — either by adding a findings gate or by running `validate_all_yaml.py` against `findings/*.yaml` in the pre-commit hook — closes this gap. This is the highest-leverage change because it fixes the known stale-data bug and prevents the class of bugs it represents.

The fix is narrow: add `findings/**/*.yaml` to the coverage of `validate_all_yaml.py` and confirm that `finding.schema.yaml` declares `cycle` as `type: integer`. No architecture changes, no new files, closes a real bug.

**Refactor second: `run_derivation()` table flush bug.**

One line fix, zero risk, closes a silent gate failure. Do it in the same PR as the findings validation.

**Refactor third: `load()` error handling in `cross_coupling_db.py`.**

Four lines. The tool is agent-facing — clean error messages on the CLI matter more here than anywhere else in the codebase.

**Never touch: the gate architecture.**

The `Finding` dataclass, the `_GATES` registry, the runner pattern in `run_gates()` — this is the best-designed part of the codebase. It is clean, extensible, and testable. Do not refactor it. Add gates to it.

**Never touch: the `build_handback_yaml` / `build_handback_markdown` split.**

Separating structured data generation from markdown rendering is correct. The data model in `build_handback_yaml` is validated against the schema. The markdown is derived from the validated data. This is the right shape. The double file-load bug (section 2.2) should be fixed by adding a context loader, not by merging the two functions.

**Never touch: the `cross_coupling_db.py` subcommand interface.**

The agent-facing CLI is the right interface. The subcommand pattern is clean. The `--db` / `$CROSS_COUPLING_DB` resolution is correct. Leave it alone and fix the `load()` error handling around it.

---

## 5. The one structural improvement I would ship

**Ship: findings YAML schema enforcement in the gate suite.**

Here is why this is the highest-leverage single change:

The client described the system's core value as adversarial review with verified data integrity. The gates enforce integrity on markdown content (frontmatter, citations, word count, cross-coupling). But the findings files — the outputs of adversarial review — are unvalidated. An agent that writes `cycle: "01"` instead of `cycle: 1` silently disappears from the handback summary. The review happened; the record of it did not survive into the handback. The client's known bug ("stage 7 reported stage 6 numbers") is a direct consequence.

The fix has three parts, all in existing files:

1. Confirm `finding.schema.yaml` declares `cycle` as `type: integer` (or add this constraint if missing).
2. In `validate_all_yaml.py`, extend coverage to validate all `findings/*.yaml` files against `finding.schema.yaml`.
3. In `.pre-commit-config.yaml`, update the `schema-validation` hook `types` to `[yaml, markdown]` so it runs on every commit, not only when YAML files are staged.

This does not change the architecture. It does not break backwards compatibility with existing handback documents. It fixes the known bug and closes the data integrity gap that underlies it.

The PR should include: the schema fix (if needed), the validator extension, the pre-commit config change, and one new test in `system/tests/test_gates.py` that writes a findings file with `cycle: "01"` and asserts the validator catches it.

---

## 6. On the existing internal audit

The `ops/audits/audit-v1.0-2026-05-04.md` document is accurate and I agree with its Tier 1 / Tier 2 / Tier 3 prioritization. Its section 2.1 (AlphaEdge stack deletion) and 2.2 (retro split) are correct calls. Its identification of the cross-coupling DB as the first structural improvement is defensible.

Where I differ: the existing audit frames the handback stale-data bug as a known issue to be addressed "after structured stores exist" (Tier 4, item 7). I think that underweights it. The bug is present in the current code, has a known trigger, and is fixable without touching the architecture. Deferring it means the next several study cycles run against a generator that can silently drop review findings from the record. The fix I am proposing in section 5 costs one afternoon and closes it now.

The existing audit also does not identify the `run_derivation()` table flush bug, the agent file collision risk in `_merge_agents()`, or the `.claude/agents/` sync gap. These are not critical but they are findable and they matter.

One thing the existing audit got right that I want to reinforce: the recursive self-correction loop and the agent architecture are not the problem. The problems are all in the tooling layer — the plumbing around the loop, not the loop itself. That framing should govern every refactor decision: fix the plumbing, leave the loop alone.

---

*Audit complete. Recommended first PR: findings YAML schema enforcement. See section 5 for scope and implementation plan.*
