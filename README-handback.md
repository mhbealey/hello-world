# Handback Document

The handback closes the loop between Claude Code (which executes stages) and the planning session (which designs new stages).

## How it works

1. Claude Code runs stages 1-N.
1. At the end of stage N (typically 4 first time), run:
   ```
   python tools/generate_handback.py --stage 4
   ```
1. This produces `handback-stage4.md` — a self-contained markdown document.
1. Open the handback. Edit Section 11 to add your note for the next planning session.
1. Paste the entire handback into a new Claude conversation.
1. The planning session reads it, designs stages 5-7, returns a new scaffolding document.
1. You take the new scaffolding back to Claude Code. Claude Code runs stages 5-7.
1. Repeat at the end of stage 7.

## What's in the handback

1. Executive snapshot — counts of sections, words, findings.
1. What got built — table of every section with status, review status, owner.
1. Findings that matter — blockers and majors only.
1. Patterns across reviewers — sections flagged by 2+ reviewers.
1. Decisions locked in — from the cross-coupling log.
1. Open questions blocking progress.
1. Assumption registry — full, verbatim.
1. What broke in the agent system — from retro artifacts.
1. Session logs — recent ones full, older ones as titles.
1. Critical section content — full text of most-mature sections, ~8,000 chars.
1. User's note — you edit this before pasting.
1. Instructions for the planner — directs the next planning session.

## When to regenerate

After every major milestone, not just at stage end. Useful checkpoints:

- After Section 01 fully drafted, before reviewers run.
- After Section 01 reviewers complete and findings addressed.
- After all four sections drafted.
- After full review pass on all sections.

The handback regenerates from current repo state every time. Call it as often as useful.
