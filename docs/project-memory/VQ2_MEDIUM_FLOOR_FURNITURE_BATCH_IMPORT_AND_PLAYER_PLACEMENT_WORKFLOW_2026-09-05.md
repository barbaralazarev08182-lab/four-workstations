# VQ2 Medium Floor Furniture Batch Import + Player Placement Workflow

Date: 2026-09-05
Status: USER DECISION / SUPERSEDES DEFERRED ONE-BY-ONE DOWNLOAD POLICY FOR MEDIUM FLOOR-STANDING FURNITURE ONLY

## Decision

For medium-sized furniture that stands directly on the floor and can be moved with the existing in-game placement system, stop doing final placement one asset at a time through Codex.

Instead:

1. Batch-acquire the selected furniture assets.
2. Standardize and import them into Unity as candidate prefabs.
3. Register them with the existing placement/build system.
4. Let the user enter the game and personally place/rotate/rearrange them.

Codex owns asset preparation, normalization, metadata, pivot/collider/footprint setup, and placement-system registration. The user owns final spatial composition and rotation in-game.

## Scope: include now

Medium floor-standing furniture such as:
- sofas
- armchairs / lounge chairs
- dining / occasional chairs
- coffee tables
- side tables
- nightstands / small cabinets
- other comparable freestanding furniture already shortlisted

Potentially include floor planters if useful, but they are secondary.

## Exclude from this batch

Do not include in this first batch:
- wall lamps / wall-mounted items
- rugs / decals / flat floor dressing
- ceiling fixtures
- very small tabletop decor
- architecture / built-ins
- large special-purpose gameplay machinery
- Atlas / Retrieval / Experiment objects

Beds or other large pieces should only join the batch if their placement system behavior is already suitable and the asset is actually selected.

## Asset acquisition rule

Before download/import, verify for each BlenderKit item:
- exact asset identity / page
- current authenticated `CAN_DOWNLOAD=True`
- successful HTTP download permission
- license/source metadata

Do not trust a public `Free` badge by itself if authenticated API says otherwise.

Do not download assets that fail permission checks.

## Prefab normalization gate

Every imported furniture prefab must be normalized before it enters the placement catalog:

- Unity +Y is up
- object stands upright
- base/feet contact floor correctly
- consistent forward direction recorded
- no accidental 90/180 degree orientation mistakes
- source scale preserved unless a justified unit correction is needed
- no non-uniform scale used to force fit
- usable pivot at floor/base and practical rotation center
- sensible collider(s), not excessive mesh colliders unless justified
- measured world-space W x D x H recorded
- 0.5m grid hard footprint recorded
- recommended interaction/use clearance recorded when relevant
- clean project-facing name
- source/license metadata retained

## Placement system

Reuse the existing in-game placement/build system. Do not create a second furniture placement framework unless the current system is technically incapable of handling furniture prefabs.

Furniture should be selectable/spawnable from a candidate furniture catalog/palette and support the existing move/place/rotate workflow.

Final position and facing are NOT pre-authored by Codex. The user will place and rotate furniture in-game.

## Scene handling

Do not remove accepted graybox layout globally before the user has placed replacements. Graybox items may stay available as spatial references until replaced by the user.

Imported candidate furniture can live in a staging/catalog state rather than being permanently scattered through the room.

## Review philosophy

This workflow intentionally reduces repeated Human Review screenshots for each furniture asset. Human review moves from `Codex places one item -> screenshot -> adjust -> repeat` to `user directly composes the room in-game`.

Codex only needs to prove that each prefab is technically ready to place: correct orientation, scale, pivot, collider, footprint, materials, and placement-system registration.

## Precedence

This decision supersedes the earlier one-by-one deferred download workflow for medium floor-standing furniture. The earlier policy still applies to wall-mounted decor, rugs, lighting, small decor, unresolved special-case assets, and anything not suitable for the current placement system.
