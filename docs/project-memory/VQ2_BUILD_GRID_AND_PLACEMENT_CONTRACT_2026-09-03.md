# VQ2 Build Grid & Placement Contract — 2026-09-03

Status: USER BUILD-SYSTEM DIRECTION — FOUNDATION LOCKED / FULL BUILD MODE NOT YET IMPLEMENTED

## 1. Purpose

The enlarged Office floor should support a grid-based construction / placement system. The floor remains a continuous surface; the build grid is a separate logical and visual overlay that appears only in build mode.

## 2. Grid scale

- Primary visual grid cell: 1.0m x 1.0m, aligned to the current Unity world/grid scale.
- Internal placement resolution must support 0.5m increments.
- Valid footprint dimensions may therefore include 0.5, 1.0, 1.5, 2.0, etc.
- Grid origin and orientation must be deterministic and stable.

## 3. Footprint concept

Every buildable object has an explicit logical footprint independent from its exact mesh silhouette.

Examples:
- 0.5 x 0.5
- 1 x 1
- 1.5 x 1
- 2 x 1
- 2 x 2

A round, irregular, or asymmetrical model can still occupy a rectangular logical footprint for placement and collision rules.

## 4. Placement behavior

Build mode should eventually support:
- visible dashed / restrained grid overlay;
- ghost preview;
- snapping to 0.5m placement increments;
- explicit footprint preview;
- valid / invalid placement feedback;
- overlap / occupancy rejection;
- 90-degree rotation as the initial rotation rule;
- later support for save/load of placed objects.

Footprint dimensions should be authored data, not automatically inferred from renderer bounds as the authoritative rule.

## 5. Non-destructive implementation

Do not split the current floor into hundreds of mesh tiles. Use an independent grid overlay and logical occupancy system. Do not modify protected source FBX assets to implement the build grid.

## 6. Current implementation scope

The first prototype should only establish:
1. build-mode grid overlay;
2. footprint data structure;
3. one or a few test buildables;
4. snapped ghost preview;
5. basic occupancy and floor-bound validation;
6. 90-degree rotation;
7. placement confirmation / cancellation in an isolated candidate or QA context.

Do not build a full furniture catalog, economy, crafting tree, inventory UI, or final production build menu yet.

## 7. Tooling / execution constraint — USER PREFERENCE

When Codex implements or validates this system, minimize Computer Use because it consumes the user's quota heavily.

Preferred order:
1. direct file/code edits;
2. command-line inspection and scripts;
3. Unity BatchMode / automated editor scripts;
4. automated EditMode / PlayMode tests;
5. automated screenshots or generated evidence where possible.

Use Computer Use only when a genuinely visual/manual Unity action cannot reasonably be completed through code, scripts, batch mode, or automated tests. If Computer Use is required, keep it brief and limited to the minimum necessary visual verification.

## 8. Human visual review boundary — USER LOCKED

Do not spend substantial Computer Use quota trying to self-judge subjective visual quality.

The user will manually review visual / feel-sensitive checkpoints such as:
- whether the dashed grid looks too strong or too weak;
- whether grid spacing reads correctly in first-person and room view;
- whether ghost placement feels visually aligned;
- whether footprint highlighting looks intuitive;
- whether snapping / rotation feels pleasant;
- whether the build-mode presentation fits the room aesthetically.

Codex should stop at these checkpoints, provide the candidate scene and concise instructions for how the user can test it, then wait for Human Visual PASS / FAIL before doing cosmetic iteration or promotion.

Automated validation should still cover objective rules such as snapping math, occupancy rejection, floor bounds, rotation, deterministic grid origin, compile status, PlayMode stability, and blocking errors.
