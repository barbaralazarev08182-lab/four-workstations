# VQ2 Project Memory

> Status: **ACTIVE / CANONICAL ENTRYPOINT**  
> Updated: 2026-09-08  
> Scope: current VQ2 truth only.

This directory is intentionally small. It is not an experiment diary.

## Read order

For normal work, read `VQ2_CURRENT_HANDOFF.md` first, then only the topic files needed for the task:

1. `current/VQ2_CURRENT_HANDOFF.md`
2. `current/VQ2_WORLD_CURRENT.md` — premise, Atlas, Retrieval, Outside world rules
3. `current/VQ2_GAMEPLAY_CURRENT.md` — core loop and first-hour gameplay contract
4. `current/VQ2_REFUGE_CURRENT.md` — room, architecture, Garden, furniture direction
5. `current/VQ2_OUTSIDE_CURRENT.md` — sky, black hole, nebula, planet, Outside activity
6. `current/VQ2_LIGHTING_CURRENT.md` — Golden direction, bounce, daylight and practical lighting
7. `current/VQ2_SYSTEMS_CURRENT.md` — Unity/system baselines and accepted numeric contracts
8. `current/VQ2_HUMAN_REVIEW_CURRENT.md` — current Human PASS / FAIL / pending ledger

## Authority

When sources conflict, use this order:

1. latest explicit Human decision / latest Human Visual or Feel PASS/FAIL;
2. live local Unity serialized/project state when available;
3. the curated `current/` documents here;
4. Git history or an explicitly requested old document;
5. old roadmaps, proposals, authorizations, intermediate experiments, or superseded baselines elsewhere in the repository.

**Machine PASS != Human Visual / Feel PASS.**

A historical filename containing `PASS`, `FINAL`, `LOCK`, `BASELINE`, or `AUTHORIZATION` does not make it current.

## Historical material

The former large `archive/legacy/` Markdown collection has been removed from the working tree after its still-relevant facts were consolidated into `current/`.

Nothing was erased from Git history. The pre-cleanup snapshot remains recoverable from commit:

`bfc9d7b715674199918fad435c7a18b05e019e62`

See `archive/README.md` for the recovery rule.

## Maintenance rule

Project memory records **current truth**, not every implementation attempt.

Update an existing `current/` file when an important world rule, Human decision, baseline, rejection, technical boundary, authoring boundary, or major gameplay/layout direction changes.

Do not create a new dated canonical Markdown file for every parameter test, screenshot batch, machine-only PASS, temporary implementation, or rejected experiment. Keep those in work outputs, commit history, issue/PR discussion, or task evidence instead.

## Repository-state warning

GitHub documentation is not proof of unpushed local Unity state. Remote docs may lag the active local candidate. When a decision depends on current implementation, verify the live serialized project state rather than inferring it from GitHub alone.
