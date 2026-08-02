# VQ-1C OfficeWorld Coordinate Contract

This document freezes the spatial contract exposed by the committed formal OfficeWorld implementation at source commit `e4fcc055d71ddf8903ac113efecf3b21e071566e`. The machine-readable companion is `docs/assets/vq1c-officeworld-coordinate-contract.json`.

Authority labels used below:

- **Authoritative**: a value or behavior read directly by the current runtime.
- **Derived**: a deterministic result calculated from authoritative parent transforms and local geometry.
- **Unknown**: the current runtime defines no value; it must not be invented for Blender authoring.

## 1. Scope

This contract covers the full formal OfficeWorld: room axes and bounds, four workstation slots, character destinations and paths, interactive facilities, camera framing, and the Three.js-to-Blender authoring conversion. It is the baseline for a future full-office GLB.

The existing Hero Corner is only a visual/style reference. Its local layout is not authoritative for the full OfficeWorld. This document does not change runtime code, assets, interaction behavior, or the stashed integration candidate.

Primary authority is `components/office-3d/scene-config.ts`, with runtime interpretation supplied by `OfficeWorld.tsx`, `LowPolyWorkstation.tsx`, `OfficeAmenities.tsx`, `CharacterController.tsx`, `character-paths.ts`, `AnimatedLowPolyCharacter.tsx`, `CameraController.tsx`, and `OfficeWebGLScene.tsx`. Business desk binding comes from `lib/office/desk-slots.ts` and `lib/supabase/status-mapper.ts`.

## 2. Coordinate system

The formal runtime uses a right-handed Three.js world in meters:

- `+Y` is up; the visible plank floor top is `Y=0`.
- `-X` is left and `+X` is right.
- `-Z` is back and `+Z` is front.
- Rotations are radians about `+Y` unless stated otherwise.
- Procedural characters face local `+Z`; a root `rotationY` turns that forward axis into the recorded world-facing vector.

Blender authoring is right-handed and `+Z` up. The canonical axis conversion is:

```text
Three (x, y, z) -> Blender (x, -z, y)
Blender (x, y, z) -> Three (x, z, -y)
Three local +Z -> Blender local -Y
Three rotationY(theta) -> Blender rotationZ(theta)
```

The conversion belongs to Blender's glTF export and Three.js GLTF loading. A full-office asset must therefore load at identity in the frontend; no extra correction rotation or scale is part of the contract. This convention is corroborated by `Vq1cHeroCornerRuntime` in `components/qa/Vq1cHeroCornerRuntime.tsx` and the glTF export in `tools/blender/build_vq1c_hero_corner.py`.

## 3. Room contract

The horizontal origin is the room center. Authoritative camera-fit bounds are `min [-8.1, -0.41, -6.6]`, `max [8.1, 4.5, 6.6]`, giving a nominal room size of `16.2 × 13.2 m` and `4.5 m` above the visible floor.

| Element | Authoritative or derived geometry |
| --- | --- |
| Base slab | Center `[0, -0.32, 0]`, size `[16.2, 0.18, 13.2]`; AABB `[-8.1,-0.41,-6.6]` to `[8.1,-0.23,6.6]`. |
| Visible planks | Combined derived AABB `[-7.7,-0.24,-6.2]` to `[7.7,0,6.2]`; floor top is `Y=0`. |
| Back wall | Plane centered at `Z=-6.1`, thickness `0.24`, height `4.5`; AABB `[-7.7,0,-6.22]` to `[7.7,4.5,-5.98]`. |
| Left wall | Plane centered at `X=-7.58`, thickness `0.24`; AABB `[-7.7,0,-6.1]` to `[-7.46,4.5,6.1]`. |
| Open sides | Right (`+X`) and front (`+Z`). |
| Window | Semantic center `[2.5,2.6,-6.22]`, size `[3.2,1.8,0.1]`; opening spans X `0.9..4.1`, Y `1.7..3.5`. |

`ROOM_BOUNDS` in `scene-config.ts` is authoritative for camera fitting. `RoomShell` in `OfficeWorld.tsx` is authoritative for the current visible floor and walls. Entrance and restroom door meshes exist, but the current wall geometry does not cut matching structural openings; door openings are therefore **unknown**, not inferred from the door meshes.

## 4. Playable bounds and safe area

There is no authoritative character playable AABB, edge padding, room-bound clamp, navigation mesh, or collision avoidance in the current implementation. Characters follow discrete authored paths and destinations at `Y=0`. This absence is part of the contract and must not be replaced with `ROOM_BOUNDS` by assumption.

The derived envelope of all recorded path nodes and final destinations is `min [-6.5,0,-5.2]`, `max [7,0,5.1]`. It excludes character radius and is only a planning envelope, not a collision or gameplay boundary.

The camera target is clamped to the active camera zone inset by `1.5 m`; for the desktop zone this yields X `-6.6..6.6` and Z `-5.1..5.1`. This is camera-only behavior.

`SAFE_AREA` values are CSS pixels, not meters. Portrait is top/bottom/left/right `64/160/16/16`, landscape `48/44/24/24`, desktop all zero. They reduce the viewport available to camera fitting and are also exposed to HUD CSS by `useHudSafeArea`.

## 5. Workstation slots

All workstation roots and business positions below are authoritative from `WORKSTATION_LAYOUT` and `buildPositionSet` in `scene-config.ts`. Visual sub-part centers are derived from local geometry in `LowPolyWorkstation.tsx` using `world = parent + rotateY(rotationY, localOffset)`.

| Desk | Scene key | Root center | rotationY / facing | Visual chair root | Character work seat | Approach | Computer visual center |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `desk_1` | `ming` | `[-3.2,0,-1.75]` | `+π/2` / `+X` | `[-1.95,0,-1.75]` | `[-2.25,0,-1.75]` | `[-1.8,0,-1.75]` | `[-3.28,1.53,-1.75]` |
| `desk_2` | `hong` | `[3.2,0,1.75]` | `-π/2` / `-X` | `[1.95,0,1.75]` | `[2.25,0,1.75]` | `[1.8,0,1.75]` | `[3.28,1.53,1.75]` |
| `desk_3` | `jie` | `[-3.2,0,1.75]` | `+π/2` / `+X` | `[-1.95,0,1.75]` | `[-2.25,0,1.75]` | `[-1.8,0,1.75]` | `[-3.28,1.53,1.75]` |
| `desk_4` | `qixi` | `[3.2,0,-1.75]` | `-π/2` / `-X` | `[1.95,0,-1.75]` | `[2.25,0,-1.75]` | `[1.8,0,-1.75]` | `[3.28,1.53,-1.75]` |

Each procedural desk top has local size `[3.05,0.26,1.35]` and center `[0,0.82,0]`; rotation swaps its world X/Z footprint. The workstation visual footprint is derived from a local `[3.5,0.035,2.8]` marker. The empty-desk label is at root plus `[0,2.38,0]`. The monitor and gifted-coffee groups are visible-raycast interaction targets; there are no separate colliders.

The visual chair root and character work seat differ by `0.30 m` on X at every desk. Runtime character authority is the work seat in `CHARACTER_POSITIONS`; the discrepancy remains unresolved for asset modeling.

## 6. Characters

The four stable scene keys bind by desk key, not by a permanently fixed production user ID:

| Scene key | Desk | Default desk position | Desk facing |
| --- | --- | --- | --- |
| `ming` | `desk_1` | `[-2.25,0,-1.75]` | `+X` |
| `hong` | `desk_2` | `[2.25,0,1.75]` | `-X` |
| `jie` | `desk_3` | `[-2.25,0,1.75]` | `+X` |
| `qixi` | `desk_4` | `[2.25,0,-1.75]` | `-X` |

Initial position is status-dependent; there is no single authoritative spawn point. `resetToDesk` uses the default desk position. Status destinations are authoritative as follows:

| Scene key | Meeting | Dining | Sofa | Coffee | Restroom | Entrance |
| --- | --- | --- | --- | --- | --- | --- |
| `ming` | `[4.45,0,3]` | `[6,0,-2.75]` | `[-5.2,0,3.3]` | `[-1.5,0,-4.5]` | `[-5.5,0,-5.2]` | `[-6.5,0,2.8]` |
| `hong` | `[6.15,0,3]` | `[7,0,-3.9]` | `[-5.2,0,3.9]` | `[-1.05,0,-4.5]` | `[-5.1,0,-5.2]` | `[-6.5,0,3.25]` |
| `jie` | `[4.45,0,5.1]` | `[6,0,-5.05]` | `[-5.2,0,4.5]` | `[-0.6,0,-4.5]` | `[-4.7,0,-5.2]` | `[-6.5,0,3.7]` |
| `qixi` | `[6.15,0,5.1]` | `[5,0,-3.9]` | `[-5.2,0,5.1]` | `[-0.15,0,-4.5]` | `[-4.3,0,-5.2]` | `[-6.5,0,4.15]` |

The route graph contains `center`, `left`, `right`, `back`, `front`, `dining`, `meeting`, `sofa`, `restroom`, and `entrance` nodes. `buildCharacterPath` selects the shortest weighted node route, then appends the facility approach and final destination; points within `0.12 m` are deduplicated. Base speed is `1.62 m/s × speedMultiplier`, and arrival tolerance is `0.08 m`.

Character root/feet remain at `Y=0`; waypoint vertical direction is zeroed. No collision radius is enforced. HTML labels are offset `[0,2.8,0]`, interaction emoji `[0,3.48,0]`, and pointer menus use screen-space `clientX/clientY`, not world coordinates.

## 7. Facilities and interaction hotspots

Facility roots come from `FURNITURE_POSITIONS` in `scene-config.ts`; geometry and label offsets come from `InteractiveFurniture` in `OfficeAmenities.tsx`.

| Facility | Root / interaction position | rotationY | Primary visible geometry | Label |
| --- | --- | --- | --- | --- |
| Meeting | `[5.3,0,4.05]` | `0` | Top center `[5.3,.72,4.05]`, size `[3.7,.2,1.55]` | `[5.3,2.45,4.05]` |
| Dining | `[6,0,-3.9]` | `0` | Top center `[6,.72,-3.9]`, radius `1.25`, height `.2` | `[6,2.05,-3.9]` |
| Sofa | `[-5.2,0,4.2]` | `π` | Body center `[-5.2,.5,4.2]`, size `[1.35,.45,3.05]` | `[-5.2,2.1,4.2]` |
| Coffee | `[-.8,0,-5.45]` | `0` | Body center `[-.8,.8,-5.45]`, size `[1.45,1.6,.75]` | `[-.8,2.2,-5.45]` |
| Restroom door | `[-5.5,0,-6.1]` | `0` | Center `[-5.5,1.35,-6.1]`, size `[2,2.7,.2]` | `[-5.5,3.05,-6.1]` |
| Entrance door | `[-7.58,0,3.5]` | `+π/2` | Center `[-7.58,1.35,3.5]`, world size `[.2,2.7,2]` | `[-7.58,3.05,3.5]` |

These interactions raycast the visible group and descendants; no separate hotspot or collider dimensions are authoritative. A GLB replacement must either preserve equivalent visible raycast targets or introduce explicitly named runtime anchors/hotspots without moving the recorded roots.

Two additional visual zones are authoritative but non-interactive: cat home center `[2.3,0,-4.65]`, radius `1.3`; cat actor rest center `[-2.4,0,4.8]`, radius `.35`.

## 8. Camera contract

The formal camera is orthographic. Initial position is `[10.8,11.8,14.5]`, target `[0,.8,0]`, zoom `44`, near `.1`, far `100`. Runtime zone changes retain a fixed position-to-target offset `[10.8,11,14.5]` and compute zoom from projected zone bounds, remaining viewport after `SAFE_AREA`, and zone margin, with a minimum zoom of `12`.

| Zone | Target | Bounds min / max | Margin |
| --- | --- | --- | --- |
| Desktop | `[0,.8,0]` | `[-8.1,-.41,-6.6]` / `[8.1,4.5,6.6]` | `.88` |
| Workstations | `[0,.5,.3]` | `[-5.5,0,-2.8]` / `[5.5,2,3.5]` | `.92` |
| Living | `[-.5,.5,4.5]` | `[-6.5,0,2.8]` / `[7.2,2.2,6.2]` | `.88` |
| Amenities | `[0,.5,-4]` | `[-6.5,0,-6.2]` / `[7,2.2,-1.5]` | `.90` |
| Overview | `[0,.8,0]` | room bounds | `.85` |

Automatic selection uses desktop when the smaller viewport dimension is at least `760 px`; otherwise portrait selects workstations and landscape selects overview. `MapControls` disables rotation, enables damping (`.08`) and screen-space panning, constrains zoom to `12..120`, and clamps target panning to active zone bounds inset `1.5 m`.

## 9. Existing visual layout

The committed formal office remains programmatic. Four workstation roots form two left/right columns around the central aisle. The living zone is toward `+Z`, with sofa on the left and meeting table on the right. Amenities occupy `-Z`, with coffee near the back center, dining at back-right, restroom at back-left, and entrance on the left wall/front side. Right and front room sides remain open for the isometric view.

The main path spine runs through center `[0,0,0]`, left/right aisles `[-5.6,0,0]` and `[5.6,0,0]`, back `[-1.2,0,-4.6]`, and front `[0,0,3.2]`. This layout description is not a substitute for the numeric roots and route graph in the JSON contract.

## 10. Blender authoring contract

Author the full office with Blender origin `[0,0,0]` at the room's horizontal center and floor top `Z=0`. Use the coordinate conversion in section 2. Required Blender workstation roots are:

| Desk | Blender position | rotationZ |
| --- | --- | --- |
| `desk_1` | `[-3.2,1.75,0]` | `+π/2` |
| `desk_2` | `[3.2,-1.75,0]` | `-π/2` |
| `desk_3` | `[-3.2,-1.75,0]` | `+π/2` |
| `desk_4` | `[3.2,1.75,0]` | `-π/2` |

Facility Blender roots are meeting `[5.3,-4.05,0]`, dining `[6,3.9,0]`, sofa `[-5.2,-4.2,0]`, coffee `[-.8,5.45,0]`, restroom `[-5.5,6.1,0]`, and entrance `[-7.58,-3.5,0]`.

Named empties should expose desk roots, character seats, approaches, computers, all facility roots, and the window. Recommended exact names are listed in the JSON `blenderAuthoringTargets.recommendedAnchors`. The exported full-office root must have position `[0,0,0]`, rotation `[0,0,0]`, and scale `[1,1,1]`; frontend scale correction is not allowed by this contract.

## 11. Conflicts and unknowns

1. **No character playable clamp.** Only destinations and a route graph exist. Free-movement bounds, collision radius, wall padding, and navigation clearance remain unknown.
2. **Chair/work-seat mismatch.** The visual chair root is `0.30 m` closer to room center than the authoritative character work position at every desk.
3. **Doors lack wall openings.** Door meshes overlap the current wall planes; final opening size and wall cuts are not defined.
4. **Interaction sizes are implicit.** Facilities, computers, gifts, and characters use visible-geometry raycasts, not independent collider dimensions.
5. **Restroom marker mismatch.** `CharacterController` places the restroom status marker at `[4.9,2.65,-5.92]`, while the restroom door and character destinations are on negative X. Both runtime facts are recorded; intent remains unknown.

These issues must be resolved explicitly before they are baked into a full-office asset. They are not license to alter the authoritative positions in this contract.
