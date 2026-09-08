# VQ2 Project Memory

> Status: **ACTIVE / CANONICAL ENTRYPOINT**  
> Updated: 2026-09-08

This directory is intentionally split into **current truth** and **historical archive**.

## Read order

For normal VQ2 work, start here and then read only the relevant files under `current/`:

- `current/VQ2_CURRENT_HANDOFF.md`
- `current/VQ2_WORLD_CURRENT.md`
- `current/VQ2_REFUGE_CURRENT.md`
- `current/VQ2_OUTSIDE_CURRENT.md`
- `current/VQ2_LIGHTING_CURRENT.md`
- `current/VQ2_SYSTEMS_CURRENT.md`
- `current/VQ2_HUMAN_REVIEW_CURRENT.md`

Use `archive/legacy/` only when historical evidence or an old experiment is specifically needed.

## Authority

When documents conflict, use this order:

1. latest explicit Human decision / latest Human Visual or Feel PASS/FAIL;
2. live project state when available;
3. curated files under `current/`;
4. specifically relevant historical evidence under `archive/legacy/`;
5. old roadmaps, proposals, authorizations, intermediate experiments, or superseded baselines.

**Machine PASS != Human Visual PASS.**

A historical filename containing `PASS`, `FINAL`, `LOCK`, `BASELINE`, or `AUTHORIZATION` does not make that document current.

## Maintenance rule

Project memory should record current truth, not become an infinite experiment diary.

Update an existing `current/` file when an important rule, Human decision, baseline, rejection, technical boundary, authoring boundary, or major gameplay/layout direction changes.

Do not create a new canonical project-memory Markdown file for every parameter test, screenshot batch, machine-only PASS, or temporary implementation. Keep those as work evidence or historical material instead.

## Repository note

GitHub documentation is not proof of unpushed local Unity state. Do not infer live local candidate state from remote files alone.
