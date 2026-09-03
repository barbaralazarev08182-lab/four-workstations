# VQ2 Build Grid & Placement Contract — 2026-09-03

Status: USER BUILD-SYSTEM DIRECTION — FOUNDATION LOCKED / PROTOTYPE IMPLEMENTED / HUMAN VISUAL-FEEL REVIEW PENDING

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

## 9. Prototype implementation result — 2026-09-03

Implementation target:
- `Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`
- production scene was not modified by this task;
- no commit / push / promotion was performed by the implementation agent.

Implemented building runtime/editor files:
- `Assets/FourWorkstations/Scripts/Building/BuildGridDefinition.cs`
- `Assets/FourWorkstations/Scripts/Building/BuildableFootprint.cs`
- `Assets/FourWorkstations/Scripts/Building/BuildOccupancyGrid.cs`
- `Assets/FourWorkstations/Scripts/Building/BuildGridOverlay.cs`
- `Assets/FourWorkstations/Scripts/Building/BuildModePrototypeController.cs`
- `Assets/FourWorkstations/Scripts/Building/FourWorkstations.Building.asmdef`
- `Assets/FourWorkstations/Scripts/Editor/OpenOfficeBuildGridPrototype.cs`
- `Assets/FourWorkstations/Tests/PlayMode/BuildGridPrototypeTests.cs`

Reported prototype constants:
- build bounds: X `-10 -> 10m`, Z `-10 -> 10m`;
- Grid Origin: `(-10, -10)`;
- primary visual grid: `1m`;
- logical placement step: `0.5m`;
- overlay elevation: `0.025m` above floor.

Reported test footprints:
- A `1 x 1m` -> `2 x 2` logical cells — PASS;
- B `2 x 1m` -> `4 x 2` logical cells — PASS;
- C `1.5 x 0.5m` -> `3 x 1` logical cells — PASS.

Reported objective validation:
- empty-space placement — PASS;
- overlap rejection — PASS;
- partial out-of-bounds rejection — PASS;
- 90-degree rotation — PASS;
- four consecutive rotations with no anchor / coordinate drift — PASS;
- confirm writes occupancy — PASS;
- cancel leaves occupancy unchanged — PASS;
- Unity Compile — PASS;
- PlayMode tests — 10/10 PASS;
- blocking errors — 0.

Prototype controls reported for manual review:
- `B` — toggle Build Mode;
- `1 / 2 / 3` — select test buildables A/B/C;
- center-screen pointer / mouse aim to target floor and move snapped Ghost;
- `R` — rotate 90 degrees;
- left click or `F` — confirm placement;
- right click, `X`, or `Esc` — cancel current Ghost;
- green feedback — valid placement;
- red feedback — overlap or out-of-bounds.

## 10. Current checkpoint

Technical prototype is considered ready for Human Visual / Feel Review, not production promotion.

The next action is the user's manual review of:
- 1m visual grid readability;
- 0.5m snapping feel;
- overlay intensity / dashed-line quality;
- Ghost alignment and footprint readability;
- valid / invalid feedback clarity;
- 90-degree rotation feel in first-person and optional room view.

Do not extend into inventory, economy, crafting, final build UI, furniture catalog integration, save/load, or production promotion until the user reports Human Visual / Feel PASS or gives specific corrections.
