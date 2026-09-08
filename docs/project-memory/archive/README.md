# VQ2 Project Memory Archive Policy

> Status: **ACTIVE POLICY**  
> Updated: 2026-09-08

## Purpose

This directory defines how legacy project-memory should be treated during consolidation.

The current repository contains many dated Markdown files recording:

- research;
- proposals;
- authorizations;
- implementation checkpoints;
- `AWAITING_HUMAN_REVIEW` states;
- intermediate PASS/FAIL results;
- old Gate handoffs;
- superseded layout/lighting/Outside experiments;
- asset-search and furniture-selection history.

These files are useful historical evidence, but they should not all compete as current authority.

## Current rule

For normal work, begin at:

`docs/project-memory/README.md`

and use the curated files under:

`docs/project-memory/current/`

Legacy date-stamped files outside `current/` should be treated as **historical/supporting material unless the current index explicitly points to them**.

## Why files are not physically moved yet

The first consolidation pass is intentionally non-destructive.

Reasons:

1. remote GitHub `main` can lag the local Unity/documentation worktree;
2. recent Human/Codex documentation-only commits may exist locally but not on remote;
3. moving hundreds of files before reconciling local history could cause noisy merges and accidental loss of context;
4. current authority can be fixed immediately through the canonical index without rewriting history.

Therefore this pass creates a **logical archive** first.

## Later physical archive pass

After local and remote documentation history is reconciled, legacy files may be moved under topical archive folders such as:

- `archive/2026-08-foundation/`
- `archive/2026-09-interior/`
- `archive/2026-09-lighting/`
- `archive/2026-09-atlas-boundary/`
- `archive/2026-09-outside/`
- `archive/assets-and-furniture/`
- `archive/character/`

Physical movement is organizational only. Do not rewrite old Human verdicts to make history look cleaner.

## What should remain outside archive

Keep only a small stable set as canonical current truth:

- canonical entry/index;
- concise current handoff;
- current world rules;
- current Refuge direction;
- current Outside direction;
- current lighting direction;
- current systems baselines;
- current Human-review ledger.

When a topic changes, update the current topic file rather than spawning another canonical dated file.

## Historical lookup rule

Open archived/legacy material only when:

- exact old parameter values are needed;
- a failure root cause must be verified;
- an asset/source provenance question arises;
- a current file explicitly references an old document;
- a rollback needs historical serialized/design evidence.

Do not ask Codex to read every Markdown file before ordinary tasks.
