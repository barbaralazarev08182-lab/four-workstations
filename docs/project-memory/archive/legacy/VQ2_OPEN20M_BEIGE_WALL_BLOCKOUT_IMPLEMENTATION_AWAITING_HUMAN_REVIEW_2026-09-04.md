# VQ2 Open20m Beige Wall Blockout — Implementation Result / Awaiting Human Review — 2026-09-04

> Status: CANDIDATE IMPLEMENTATION COMPLETE / HUMAN VISUAL-FEEL REVIEW PENDING
>
> This record describes the reported local Unity candidate state. It is not a Human Visual PASS, production promotion, or proof that local Unity assets were pushed to GitHub.

## 1. Scope completed

Target scene:

`Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`

Candidate-only Open20m L-wall architecture blockout has been implemented using Poly Haven `Beige Wall 001`.

Reported unchanged by this round:

- Production scenes/assets;
- player;
- Atlas;
- Retrieval Station;
- camera;
- lighting;
- accepted Oak floor geometry/material.

No commit / push / production promotion was performed for the local Unity implementation.

## 2. Wall material implementation

Source maps used:

- Base Color: `beige_wall_001_diff_4k.jpg`
- AO: `beige_wall_001_ao_4k.png`
- Normal GL: `beige_wall_001_nor_gl_4k.png`
- Roughness: `beige_wall_001_rough_4k.png`

All reported as 4096x4096. Project copies were reported hash-identical to original downloaded files.

Candidate material:

`Assets/FourWorkstations/Art/Environment/Materials/Candidates/Open20mBeigeWall/Open20m_BeigeWall001_URP.mat`

Reported mapping:

- Diffuse -> Base Map;
- AO -> Occlusion;
- Normal GL -> Unity Normal Map;
- Roughness -> `Smoothness = 1 - Roughness`, stored in packed-map alpha;
- Metallic = `0`;
- Displacement not used.

Reported tiling: `10 x 1.55`, approximately one texture repeat per `2 x 2m` on a 20m x 3.1m wall.

## 3. Floor and wall geometry

Reported floor bounds:

`(-10, -0.41, -10) -> (10, 0, 10)`

Wall thickness: `0.15m`

Wall height: `3.1m`

### West / Min-X wall

- Position: `(-10.075, 1.55, 0)`
- Scale: `(0.15, 3.1, 20)`
- Bounds: `(-10.15, 0, -10) -> (-10, 3.1, 10)`
- Interior face: `X = -10`

### North / Max-Z wall

- Position: `(0, 1.55, 10.075)`
- Scale: `(20, 3.1, 0.15)`
- Bounds: `(-10, 0, 10) -> (10, 3.1, 10.15)`
- Interior face: `Z = 10`

The accepted placement rule is preserved:

> The interior wall faces align to the buildable floor boundaries and all wall thickness extends outward, so the walls do not consume the 20x20 buildable floor.

Reported wall intrusion into buildable floor: `0m`.

## 4. Build Grid result

Reported mathematical range remains:

`(-10,-10) -> (10,10)`

The outer dashed visual line was offset inward by half its line width (`9mm`) so the visible border remains readable at the floor edge and is not hidden by the new walls.

This is an implementation delta to `BuildGridOverlay.cs`; it must be treated as a visual rendering adjustment only, not a change to the accepted 0.5m placement/grid mathematics.

Human review must confirm the compensation does not make the grid feel inset or visually shrink the usable floor.

## 5. Validation reported

- PlayMode tests: `10/10 PASS`
- Unity compile: PASS
- blocking errors: `0`
- staged files: `0`

Reported modified files/areas:

- `Office_Open20m_Candidate.unity`
- `Open20mBeigeWall/` candidate material/texture directory
- `Open20mBeigeWallArchitectureGate.cs`
- `BuildGridOverlay.cs`
- `BuildGridPrototypeTests.cs`

## 6. Technical review note before Human PASS

The reported wall bounds create a correct interior L-corner but the two outward-thickness rectangles only meet along the interior corner line. In plan view, the exterior corner region `X in [-10.15,-10]`, `Z in [10,10.15]` is not filled by either wall.

This may be invisible from the room interior but could become visible from the open Outside side, elevated viewpoints, strong sunlight, or future exterior presentation.

Do not automatically alter the approved interior-floor relationship. If the missing outside corner is visually observable, solve it candidate-only by either:

- extending one wall outward by one wall thickness at the corner; or
- adding a `0.15 x 3.1 x 0.15m` exterior corner cap entirely outside the buildable floor.

Any correction must preserve interior faces at `X=-10` and `Z=10` and preserve zero intrusion into the buildable floor.

## 7. Human Visual / Feel Gate still open

This implementation is not yet a Human PASS.

Review should focus on:

- whether `3.1m` wall height feels right at first-person eye level;
- whether `0.15m` thickness reads as believable without feeling heavy;
- whether Beige Wall 001 is warm/refined enough beside the accepted oak floor;
- whether wall normal/roughness are subtle rather than dirty or concrete-like;
- whether `10 x 1.55` tiling looks naturally scaled and not visibly repetitive;
- whether the L-corner feels architecturally clean;
- whether the exterior corner gap is visible;
- whether the Build Grid remains visually full-size and reaches the usable floor edge;
- whether furniture can visually read as able to sit flush to the walls later;
- whether the two walls create the intended house/open-universe composition.

Do not proceed to final door design, trim, Power Hub, Matter Bench, detailed furniture layout, or production promotion until this wall blockout receives explicit Human Visual / Feel review.
