# VQ2 Systems — Current Baselines

> Status: **ACTIVE**  
> Updated: 2026-09-08

## Engine / candidate context

- Unity `6000.3.21f1`
- URP `17.3.0`
- primary local candidate: `Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`
- production scenes must not be overwritten/promoted without explicit Human authorization
- remote GitHub may lag the local Unity worktree; verify live serialized state when implementation details matter

## Time system

Human lock:

> **60 real minutes = 1 in-game day.**

Do not casually change day-cycle duration while working on lighting, Outside visuals or unrelated systems.

The visible universe does not need to rotate with this day cycle.

## Atlas / Boundary baseline

Atlas is the stabilizing anchor of the Refuge's 3D domain. The stabilized domain is larger than the visible architecture.

`Atlas Boundary Membrane V2` retains Human Visual PASS unless explicitly reopened.

Accepted reference settings:

- Atlas Boundary radius: `21m`;
- center authority: `AtlasAnchor`;
- boundary normally invisible;
- contact patch cap: `6°` with inspector range `5–8°`;
- effect duration: `0.65s`;
- accepted candidate: B;
- peak distortion: about `1.5 screen pixels`;
- behavior: travelling signed compression/expansion wavefront;
- interior recovery: immediate / near-immediate after passage;
- visible ring / outline / Fresnel / emission / tint: off;
- Far Sky Y rotation at that accepted checkpoint: `45°`.

The visual should read as a localized bending/compression/expansion of the actual outside background over the curved boundary surface, not as a portal, reticle, combat shield, concentric ripple ring, magnifying lens or glass bubble.

Player radial constraint and Orb crossing had passed objective validation at that checkpoint.

## SunVisual baseline

SunVisual still appearance retains Human Visual PASS unless explicitly reopened.

Accepted geometry/orbit reference:

- core diameter: `0.50m`;
- corona outer diameter: `0.58m`;
- Atlas Boundary radius: `21.0m`;
- orbit center radius: `20.70m`;
- orbit center authority: `AtlasAnchor`;
- orbit plane: house-center vertical Y-Z great circle in the accepted convention;
- motion: uniform, counter-clockwise in the approved side-view convention;
- no Unity Light components under SunVisual;
- visible SunVisual and primary `SunDirectionalLight` are separate systems;
- SunVisual appearance remains constant across the daily cycle rather than being recolored by time-of-day.

Important: the accepted SunVisual appearance/orbit is a protected visual baseline, but the **daylight orbit may be formally reopened** later if the Golden west-wall problem requires different lighting geometry. Any such change must revalidate the visible sun/day-cycle relationship rather than silently assuming compatibility.

## Wireless Power Hub

The wall-mounted Power Hub is conceptually distinct from Atlas.

- it creates a smaller local wireless-power sphere/coverage region;
- ordinary Refuge devices and the guide drone may operate inside that field without conventional plug-to-wall wiring;
- it is not the true Refuge boundary;
- exact later power UI/economy can remain open.

## Retrieval

Retrieval Station + Orb is a core protected gameplay system.

Current conceptual rules:

- Retrieval creates a controlled crossing through the Atlas boundary;
- tether/cable maintains connection/power;
- opening the Refuge has real systemic cost/consequence;
- retrieved content must be Outside-native rather than ordinary human relics;
- a catch becomes a physical/stabilized Refuge object/sample that can be inspected, processed, preserved, placed or used;
- the southeast open technical-area relocation remains a broader architectural direction, but exact transforms are not locked by the failed Zoning V1.

Do not break Retrieval hierarchy/scripts/functionality during unrelated visual dressing.

## Build Grid foundation

The Build Grid foundation received Human Visual / Feel PASS at prototype level and should remain protected unless a real blocker is found.

Accepted contract:

- continuous floor remains one surface; build grid is a separate overlay;
- primary visual grid cell: `1.0m x 1.0m`;
- logical placement step: `0.5m`;
- deterministic grid origin/orientation;
- explicit authored logical footprint independent from exact mesh silhouette;
- ghost preview;
- occupancy/overlap rejection;
- floor-bound validation;
- initial rotation rule: `90°` increments;
- footprint data is authored rather than treating renderer bounds as authority.

Historical Open20m prototype reference:

- bounds: X `-10 -> 10m`, Z `-10 -> 10m`;
- grid origin: `(-10, -10)`;
- overlay elevation: `0.025m` above floor;
- Human review accepted the 1m visual grid, 0.5m snapping, ghost behavior, valid/invalid feedback and overall placement feel.

Temporary prototype test blocks were validation-only and are not authored room furniture.

## Furniture runtime placement + persistence

Accepted baseline supports:

- open/access catalog;
- select registered furniture;
- spawn/ghost preview;
- move with `0.5m` grid snap;
- `90°` rotation;
- confirm placement;
- re-select placed furniture;
- pick up / reposition / rotate / replace;
- save;
- reload restore;
- duplicate prevention;
- reposition after reload.

Persistence preserves furniture catalog/prefab identity and placement transform state sufficiently to restore player-authored layouts. This is a **furniture-layout persistence layer**, not authorization for a complete global save-system redesign.

Medium floor-standing furniture workflow is player-driven: Codex/import pipeline prepares valid catalog prefabs; the user decides final position/rotation in-game.

## Player / camera

The game is first-person. Player locomotion, transforms, camera feel and input are protected during unrelated art passes.

Do not alter player/camera behavior merely to make a screenshot composition work.

## Drone

The drone is a persistent autonomous utility/narrative companion.

Long-term direction includes voice/intent control and practical commands such as observation, following/positioning, lighting/scanning/recording assistance.

When the outside civilization takes direct control, communicate the change through motion, timing, gaze/orientation, voice cadence, text presentation and behavior—not only exposition.

This is design direction, not a requirement to implement the full voice stack during unrelated visual tasks.

## Asset acquisition / Blender boundary

External assets should follow a controlled source -> inspect/standardize/adapt -> Unity candidate pipeline rather than being blindly dropped into production.

BlenderKit acquisition works through the local Blender + BlenderKit workflow. A past `403` on supplied free assets was traced to an invalid non-UUID `scene_uuid`; with a valid UUID, the requested assets downloaded successfully.

Important compatibility rule:

- Unity URP cannot directly run Blender Geometry Nodes, EEVEE world-volume graphs or arbitrary Cycles procedural materials;
- inspect the actual source graph/geometry/animation first;
- bake/convert/simplify/recreate deliberately where needed;
- do not replace a Human-supplied specific asset with a low-quality procedural substitute merely because the first acquisition attempt fails.

## Validation / authority

Technical checks after implementation work may include:

- Compile PASS;
- shader errors = 0;
- PlayMode smoke PASS;
- blocking runtime errors = 0;
- protected transforms/systems unchanged when outside task scope.

These are technical Gates only.

> **Machine PASS != Human Visual / Feel PASS.**

Human subjective review controls visual, spatial and feel acceptance.

## Commit / promotion discipline

Unless explicitly authorized:

- do not promote candidate -> production;
- do not push/commit Unity candidate assets as if they were accepted;
- do not declare Human PASS yourself;
- documentation should update the existing canonical current files instead of creating a new dated project-memory document for every experiment.
