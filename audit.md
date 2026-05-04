---
title: v1.0 Codebase Audit
author: Claude Code
date: 2026-05-04
status: complete
---

# v1.0 Codebase Audit

Sources read before writing this: all ten retros (`process-lessons.md`,
`orchestrator-performance.md`, `agent-performance.md`, `system-observations.md`
stages 2–8), all 20 agent files, the five Python tools, the full migration table
in the spec, and the current directory tree. The `.env.production` issue was
resolved before this document was written — secrets scrubbed from git history,
`.gitignore` hardened.

---

## 1. What the spec gets right

The diagnosis is accurate. Every failure mode named in Parts 1–3 has a direct
corresponding retro entry:

- Lesson 1 (breadcrumbs): confirmed. Session logs were empty for stages 2–4
  despite being scaffolded. Stop hook enforcement was the only intervention
  that actually changed behavior.
- Lesson 6 (dangling citations): confirmed. 22/25 citation keys had no BibTeX
  entry at stage 6 review. Fixed in stage 7 by prompt-level enforcement.
  Stage 8 had zero dangling keys — the fix held.
- Lesson 8 (cross-coupling mismatches): confirmed. The T16 inconsistency in
  stage 8 appeared in six separate locations simultaneously, none caught by
  agents before publication. This is the highest-frequency structural failure
  across all stages and the right first target.
- Lesson 9 (assumption numbering): confirmed. §A14 was claimed by two agents
  in the same stage; the collision was caught only at handback time.
- Lesson 10 (stream idle timeout): confirmed, and underweighted in the spec.
  Five timeouts in stage 8 alone. See section 4 below.

The frame shift in Part 1 is correct. The repo presents itself as a lunar study
with tooling around it. The spec's inversion — analytical infrastructure that
produces studies — is the right mental model for everything that follows.

---

## 2. Where the spec is wrong or incomplete

### 2.1 `docs/`, `CONTEXT.md`, `CHANGELOG.md` all route to DELETE, not archive

The spec's migration table says:
- `docs/` → "Inspect contents, route appropriately"
- `CONTEXT.md` → `program/thesis.md` (migrate content)
- `CHANGELOG.md` → `ops/CHANGELOG.md` (move, restart from v1.0.0)

All three are AlphaEdge trading app artifacts, not space program content.
`docs/design-tokens.md` is Tailwind color tokens for a mobile UI.
`docs/content.md` is UI copy (toast messages, tab labels, wizard step headers).
`docs/interactions.md` is touch target specifications.
`CONTEXT.md` opens with "AlphaEdge — Project Context. A personal mobile trading
companion app." `CHANGELOG.md` is the AlphaEdge prompt-by-prompt build log.

None of this migrates. All of it deletes with the Next.js stack.

### 2.2 The retro artifacts should not be archived with the lunar study

The spec puts `retro/` inside `studies/archive/lunar-humanoid-pathfinder/`.
This is wrong for the system-level retros. `process-lessons.md` lesson 10
(stream idle timeout pattern) applies to every future study, not just the
lunar one. `system-observations.md` is explicitly meta-system observation —
it observes the orchestrator's behavior, not the study's content.

Recommended split:
- `retro/process-lessons.md` → `system/retro/process-lessons.md` (system-level)
- `retro/system-observations.md` → `system/retro/system-observations.md`
  (system-level)
- `retro/orchestrator-performance.md` → `system/retro/` (system-level)
- `retro/agent-performance.md` → `system/retro/` (system-level)
- `retro/session-logs.md` → `studies/archive/lunar-humanoid-pathfinder/retro/`
  (study-specific)

### 2.3 Agent base/overlay concatenation requires explicit orchestrator action

Part 3.2 says the orchestrator "combines the base agent with the relevant domain
overlay at runtime." In Claude Code, agents are static `.md` files read by the
runtime — there is no dynamic prompt assembly built in. The concatenation must
be done explicitly: either the orchestrator writes a merged file to
`.claude/agents/<name>.md` before dispatch, or the scaffolding includes both
files as context in the dispatch prompt.

This is feasible. It just means `new_study.py` (Part 4.7) needs to write the
merged agent files to `.claude/agents/` as part of study initialization, not
assemble them at call time. The overlay model works; the mechanism is a file
write, not an import.

### 2.4 Cross-coupling "tool call" syntax is not a real agent capability

Part 4.3 describes agents querying the database via
`cross_coupling_db.get('humanoid_design_to_mass_kg')`. Agents in Claude Code
do not execute Python — they use the Read/Write/Bash tools. The correct
interface is a Bash invocation:

```bash
python -m system.tools.cross_coupling_db get humanoid_design_to_mass_kg
```

This works and is easy to implement. The agent prompt should show the Bash
invocation, not a function call. The spec's interface is a logical description;
the actual dispatch surface is the command line.

### 2.5 The spec omits the stream idle timeout problem

Five timeouts in stage 8, three in stage 7, recurring across all stages with
large files. The root cause is documented in lesson 10 but the spec has no
structural response to it — no dispatch constraint, no retry policy, nothing
in the scaffolding template that prevents a 24-step agent prompt being written.

This needs to be structural, not just documented. The scaffolding template
(`system/templates/scaffolding_template.md`) should have a hard constraint
block:

```
DISPATCH CONSTRAINT: each agent call targets one section, max 500 words of
target output, max 6 steps. Tasks requiring more than this dispatch
sequentially across multiple calls.
```

The `orchestrator-notes.md` should document the timeout recovery pattern
explicitly: diagnose what completed before timeout → direct edit for remaining
work → log as `outcome: intervened` in session log.

### 2.6 The `scope-discipline-reviewer` registration gap should be fixed, not just moved

In stage 8, the scope re-review was skipped because
`scope-discipline-reviewer` does not exist as a registered subagent type even
though `.claude/agents/scope-discipline-reviewer.md` exists. The spec promotes
all six reviewers to first-class agents, which fixes this. But the registration
gap — files in `.claude/agents/` that Claude Code doesn't surface as
`subagent_type` options — is worth understanding before the migration. Moving
files to `system/agents/reviewers/` and adding a symlink or copy to
`.claude/agents/` on study init may be necessary.

---

## 3. Appendix A answers

**Q1. Corpus sharing — shared or per-study?**
Shared at `system/corpus/`, with `studies/<study>/corpus/` subdirectory for
study-unique entries. The stage 6 dangling-citation problem was partly caused
by agents not knowing what was already in the bib. A shared corpus surfaces
existing entries; per-study bib means agents start from scratch every time.
Divergence is a real risk with shared, but it's managed by the
`heritage-citations-reviewer` — catching divergence is that reviewer's job.

**Q2. Agent versioning — semantic or content-hash?**
Semantic (`1.0.0`). Content-hash versioning is unreadable in logs and makes
"what changed between these two runs" harder to answer than `git diff` on the
file. Semantic versions are cheap to assign and immediately interpretable.

**Q3. YAML vs SQLite for cross-coupling and assumption stores?**
YAML. Concurrency is not the real problem here: the orchestrator is the only
writer to shared state, and it writes sequentially after agents return, not
during parallel agent execution. Agents write to their own section files only.
The git-diff property of YAML is worth more than SQLite's concurrency safety
for a problem that isn't concurrent in practice. If the architecture changes
such that agents write directly to shared state, migrate then.

**Q4. Gates as pre-commit hooks or callable Python API?**
Both, with the gate runner as the primary interface. The handback generator
calls it explicitly. The pre-commit hook calls it via `python -m system.orchestration.gates`. Don't implement two separate gate systems — implement
one gate runner and call it from both surfaces. The pre-commit hook is one
line: `python -m system.orchestration.gates --study $(cat .active-study)`.

**Q5. Recommended starting point — cross-coupling DB or something else?**
Agree: cross-coupling database. Lesson 8 recurred in stage 8 (T16 in six
locations). The assumption registry collision (lesson 9) has the same root
cause — uncoordinated shared state written by agents that don't check what
already exists. Both are fixed by structured stores. Starting with the
cross-coupling DB produces a pattern that the assumption registry service
(4.4) can copy almost directly.

**Q6. Critical infrastructure pieces the spec omitted?**
One: a formal timeout recovery pattern in `orchestrator-notes.md`. The spec
adds gate infrastructure and structured stores, but the most frequent actual
failure mode (stream idle timeout on large files) has no structural response.
The recovery pattern exists in the retros; it needs to be in the orchestrator's
operating procedure, not just historical documentation.

---

## 4. Prioritized work plan

Ordered by leverage, not by the spec's day-numbered timeline. The timeline
in Part 8 is reasonable; this is the dependency-aware ordering within it.

**Tier 1 — Do first (structural unlocks):**

1. **Delete the AlphaEdge stack** (Part 6). 88 files, 450+ lines of TypeScript.
   No dependencies on anything being built. Removing it makes the repo legible
   and eliminates the confusion between "space program infrastructure" and
   "abandoned trading app." Takes 20 minutes. Do it before the restructure, not
   after, so the restructure moves only the right things.

2. **Directory restructure** (Part 2), with the retro split correction from
   section 2.2 above. Move lunar content to archive, create the `system/`,
   `program/`, `team/`, `business/`, `ops/` skeletons. Mechanical but must be
   done cleanly — one PR, file-by-file migration table in the commit message.

3. **Promote all six reviewers to first-class agent files** (Part 3.3). This
   is one afternoon of work, fixes the stage 8 registration gap, and prevents
   reviewer prompt drift across stages. Do it as part of the restructure PR or
   immediately after.

**Tier 2 — The one structural improvement (pick one and ship it well):**

4. **Cross-coupling database** (Part 4.3). Build `system/tools/cross_coupling_db.py`,
   the YAML schema, the CLI interface, and a migration script that converts the
   existing `cross-coupling-log.md` entries to structured YAML. Write two tests:
   `test_locked_write_rejected` and `test_concurrent_allocation_serializes`.
   The markdown view regenerates from the YAML — don't maintain both by hand.

**Tier 3 — Do in parallel with Tier 2 or immediately after:**

5. **Scaffolding template with dispatch constraints** — add the 500-word/6-step
   hard constraint block to `system/templates/scaffolding_template.md` and the
   timeout recovery pattern to `orchestrator-notes.md`. Zero code, high
   leverage against the most frequent failure mode.

6. **Generic-ify agent base/overlay split** (Part 3.2) for the three most
   lunar-specific agents: `far-side-base-architect` (already correctly
   identified as domain overlay), `destinations-trajectories` (Moon, Mars
   specifics belong in overlay), `autonomy-trl-tasking` (TRL curve milestones
   are lunar-operation specific). The remaining agents are already largely
   generic.

**Tier 4 — After Tier 2 is proven:**

7. Handback rewrite (Part 4.2) — current handback.py works; the stale-data bug
   is patched. Rewrite against structured stores once those stores exist.

8. Assumption registry service (Part 4.4) — copy the cross-coupling DB pattern.

9. CI workflow (Part 4.11) — add after test suite has enough coverage to be
   worth running in CI.

---

## 5. What to defer or skip

- **`new_study.py` scaffolding tool** (Part 4.7): useful but premature. Build
  it when there are two studies to compare. Building it before the second study
  exists optimizes for a use case you don't yet fully understand.

- **Status YAML surface** (Part 4.6): the current `status.md` event log works
  for the current operator. The structured YAML surface is better but not
  blocking anything. Defer until the cross-coupling DB is stable.

- **ADRs** (Part 4.12): the first dozen ADRs are documenting decisions being
  made right now in this spec. Write them as decisions are made, not as a
  batch document-everything exercise. Start the file; add entries as they
  come up naturally.

- **Business/team/ops directory content**: create the skeletons as empty
  directories with placeholder READMEs. Don't populate `business/pitch/` or
  `team/roles.md` during a development engagement — that's founder-level content.

---

## 6. One thing that surprised me

The retros are unusually good. Most project retros are either too vague
("we should communicate better") or too specific to be reusable. These are
precise, causal, and falsifiable — lesson 6 names the exact count (22 of 25),
the exact mechanism (agents added keys without bib entries), and the exact fix
(mandatory prompt language). Lesson 10 names the failure mode, the trigger
condition (large file + comprehensive rewrite), and the recovery pattern that
worked.

That quality of retro is rare and it means the lessons are trustworthy inputs.
Where the spec says "this failed in the retros," it's drawing on actual evidence,
not impressions. The infrastructure being built in v1.0 is well-targeted because
the diagnosis is accurate.

---

*Audit complete. Ready to proceed with Tier 1: delete the AlphaEdge stack,
then execute the directory restructure.*
