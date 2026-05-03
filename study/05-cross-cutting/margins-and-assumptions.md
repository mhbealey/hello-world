---
title: Margins and Assumptions Register
status: in-progress
owner: orchestrator
last-updated: 2026-05-03
---

# Margins and Assumptions Register

This file tracks all margins applied and assumptions made across the study, in one place, for review.

## How to add an assumption

Short assumptions (one sentence, fits in a table row): add directly to the Assumptions table.
Long assumptions (multi-sentence, with go/no-go gates or cascading consequences): add a one-line summary pointer in the table and a numbered subsection `### AN. Title` below, containing the full text. Use the next available number (current highest: A1).

Before adding: search this file for contradicting entries. If a contradiction exists, resolve it before adding — do not leave two rows with incompatible values for the same quantity.

## Margins

|Quantity             |Margin|Standard / Source                          |Notes                                      |
|---------------------|------|-------------------------------------------|-------------------------------------------|
|Mass (concept phase) |30%   |AIAA / NASA-STD-5001 concept-phase practice|Applied at humanoid-systems-architect level|
|Power (concept phase)|30%   |AIAA / NASA-STD-5001 concept-phase practice|Applied at humanoid-systems-architect level|
|Cost (concept phase) |±50%  |NASA cost-estimating practice              |Reflected as range in cost-program         |
|Schedule             |±30%  |NASA schedule-estimating practice          |Reflected in technology-roadmap-trl        |

## Assumptions

|Assumption                                 |Source / Justification                          |Owner                    |Risk if wrong                         |
|-------------------------------------------|------------------------------------------------|-------------------------|--------------------------------------|
|Humanoid autonomy maturity curve           |See §A1 below                                   |autonomy-trl-tasking     |High — drives teaming model and roadmap|
|Fission surface power available by 2030s   |NASA FSP program current status                 |far-side-base-architect  |Medium — solar+battery fallback exists|
|Starship HLS or equivalent operational     |Artemis program baseline                        |destinations-trajectories|Medium — alternatives exist           |
|Far side relay infrastructure expandable   |Queqiao-2 operational, future relays in planning|far-side-base-architect  |Medium — drives comms architecture    |

### A1. Humanoid autonomy maturity curve

This study assumes humanoid autonomy reaches **TRL 6 in space-relevant environments by approximately 2029**, advancing to **TRL 7+ in space-relevant environments by approximately 2035**, advancing to **TRL 8 (qualified through demonstration in operational environment) by approximately 2038-2040** — coincident with the lunar far side base initial operational capability.

This is a study assumption, not a forecast. The study's purpose is to work out the architectural and operational consequences if this curve holds. The assumption is treated as a **program commitment with explicit go/no-go gates at each TRL milestone**: if the 2029 gate is missed, the deployment timeline slips proportionally; if the 2035 gate is missed, the human-humanoid teaming model defaults to higher human-in-the-loop ratios.

Owner: autonomy-trl-tasking. Risk if wrong: high — drives the entire teaming model and the build-and-deploy roadmap.

[Each agent appends to this register as work progresses. Orchestrator reviews at major checkpoints.]
