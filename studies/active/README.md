# Active Studies

Studies currently in progress. Each study gets its own subdirectory with a `study-config.yaml` defining its structure, agents, and constraints.

## Starting a new study

```
python system/orchestration/new_study.py --id <study-id> --title "<title>" --domain <domain>
```

This script:
1. Creates the directory under `studies/active/<study-id>/`
2. Writes a `study-config.yaml` from the provided parameters
3. Copies and specializes agent overlays from `system/agents/domain/<domain>/`
4. Writes merged agent files to `.claude/agents/` for the new study context

## Completed studies

Completed studies move to `studies/archive/<study-id>/`. See `studies/archive/lunar-humanoid-pathfinder/` for the first completed study.
