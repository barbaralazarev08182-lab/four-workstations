# VQ2 Project Memory — Canonical Entry

> Status: **ACTIVE / CANONICAL ENTRYPOINT**  
> Consolidation started: 2026-09-08  
> Purpose: make current project truth easy to find without asking Codex or ChatGPT to infer authority from dozens of dated experiment files.

## 1. Read order

For normal VQ2 work, read **only these files first**:

1. `current/VQ2_CURRENT_HANDOFF.md`
2. the relevant current topic file:
   - `current/VQ2_WORLD_CURRENT.md`
   - `current/VQ2_REFUGE_CURRENT.md`
   - `current/VQ2_OUTSIDE_CURRENT.md`
   - `current/VQ2_LIGHTING_CURRENT.md`
   - `current/VQ2_SYSTEMS_CURRENT.md`
3. `current/VQ2_HUMAN_REVIEW_CURRENT.md` when a visual / feel / baseline decision matters.

Only open older dated files when a current file explicitly points to them or when historical evidence is required.

## 2. Authority hierarchy

When sources conflict, use this order:

1. latest explicit Human decision / latest Human Visual or Feel PASS/FAIL;
2. live local Unity serialized/project state;
3. these curated `current/` documents;
4. specifically referenced historical project-memory files;
5. old roadmap, research, authorization, proposal, implementation-awaiting-review, or superseded baseline files.

**Machine PASS != Human Visual PASS.** Codex is an executor and technical verifier, not the authority for subjective visual acceptance.

## 3. What the old files mean now

The many existing date-stamped files under `docs/project-memory/` are retained as historical evidence. They are **not automatically current** simply because they exist or contain the word `PASS`, `FINAL`, `LOCK`, `BASELINE`, or `AUTHORIZATION` in the filename.

Examples of historical material include:

- experiment authorizations and implementation logs;
- `AWAITING_HUMAN_REVIEW` checkpoints;
- rejected or superseded layout attempts;
- older Gate handoffs;
- old furniture searches/selections;
- intermediate Atlas / Sun / Outside calibration steps;
- research notes and proposals.

Do not scan the whole directory and vote between old files. Start from this index.

## 4. Maintenance rule going forward

Project memory is **current truth, not an infinite diary**.

Update an existing `current/` topic file when any of these change:

- a world/story rule;
- a Human Visual / Feel PASS or FAIL;
- an authoritative baseline;
- a rejected route with reusable consequences;
- a technical or authoring boundary;
- a major gameplay/layout/system decision.

Do **not** create a new canonical project-memory file for every parameter experiment, screenshot batch, temporary implementation, or machine-only PASS. Those belong in work output, Human review logs, or historical/archive material.

## 5. Non-destructive consolidation phase

This first consolidation pass deliberately does **not** delete or physically move legacy files. Remote GitHub `main` can lag the local Unity worktree and local documentation commits. Deleting/moving old files before reconciling local-only history would create unnecessary merge risk.

`archive/README.md` defines how legacy material should be treated until a later physical archive pass.

## 6. Repository-state warning

Do not use remote GitHub alone as proof of the current local Unity candidate. The local Unity worktree may contain newer candidate changes and documentation-only commits that have not been pushed.

Before merging this consolidation branch into the active local history, reconcile it with the user's newer local documentation commits.
