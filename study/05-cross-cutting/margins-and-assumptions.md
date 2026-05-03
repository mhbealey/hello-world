# Margins and Assumptions Register

This file tracks all margins applied and assumptions made across the study, in one place, for review.

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
|Humanoid autonomy TRL 7+ achievable by 2035|autonomy-trl-tasking analysis                   |autonomy-trl-tasking     |High — drives teaming model           |
|Humanoid autonomy TRL 6 in space-relevant environments by ~2029|Study assumption, not a forecast. This is a program commitment with an explicit go/no-go gate at ~2029.|autonomy-trl-tasking|High — drives the entire teaming model|
|Fission surface power available by 2030s   |NASA FSP program current status                 |far-side-base-architect  |Medium — solar+battery fallback exists|
|Starship HLS or equivalent operational     |Artemis program baseline                        |destinations-trajectories|Medium — alternatives exist           |
|Far side relay infrastructure expandable   |Queqiao-2 operational, future relays in planning|far-side-base-architect  |Medium — drives comms architecture    |

[Each agent appends to this register as work progresses. Orchestrator reviews at major checkpoints.]
