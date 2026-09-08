# Project Memory Archive

> Status: **HISTORICAL / NON-CANONICAL**  
> Updated: 2026-09-08

This archive is intentionally almost empty.

The former `archive/legacy/` directory contained a large collection of dated research notes, implementation authorizations, intermediate PASS/FAIL checkpoints, old handoffs, asset-selection notes and superseded experiments. After consolidating still-relevant facts into `../current/`, those legacy Markdown files were removed from the working tree to keep project memory readable.

## Nothing was erased from Git history

The complete pre-cleanup legacy tree remains recoverable from commit:

`bfc9d7b715674199918fad435c7a18b05e019e62`

For a specific historical file, inspect that commit rather than restoring the entire archive into the active tree.

Example pattern:

`git show bfc9d7b715674199918fad435c7a18b05e019e62:docs/project-memory/archive/legacy/<FILE>.md`

## Authority rule

Historical evidence never overrides:

1. latest explicit Human decision / latest Human Visual or Feel PASS/FAIL;
2. live local project state;
3. `../current/` canonical documents.

A historical filename containing `PASS`, `FINAL`, `LOCK`, `BASELINE` or `AUTHORIZATION` does not make it current.

## Maintenance rule

Do not recreate a permanent bulk legacy folder. If an old experiment must be consulted, inspect it from Git history and copy only the still-relevant conclusion into the appropriate existing `current/` file when Human confirms it remains authoritative.
