# Unity Spatial Placement & Interaction Contracts

> Date: 2026-08-25  
> Status: ENGINEERING RULE / PROJECT MEMORY  
> Scope: Unity object placement, prop attachment, character-to-object interaction, Agent/Codex execution rules

This document formalizes a recurring production problem: objects and characters were sometimes placed by visual approximation instead of by explicit geometric/spatial contracts, causing avoidable errors such as props landing on the floor instead of a tabletop or seated characters visibly missing the chair.

The project should not accept "looks approximately right from one screenshot" as the primary placement method when the scene geometry can be queried numerically.

---

# 1. Core rule

> Final placement must be computed from scene geometry, transforms, colliders, or authored anchors/sockets — not guessed from visual appearance.

Human visual review remains required, but it is a final validation layer, not the coordinate-solving method.

For any interactive contact, distinguish:

- object/root transform;
- actual visible/contact surface;
- target anchor/socket;
- contacting point on the interacting object/character;
- local space vs world space;
- verification tolerance.

---

# 2. Why Transform.position is usually not enough

`Transform.position` is the object's pivot/root, not necessarily the visible center or contact surface.

Examples:

- A desk pivot may be on the floor, at the geometric center, or inherited from a parent Office root.
- A cup pivot may be at its center, base, handle, or an arbitrary import origin.
- A chair pivot does not define the seat surface.
- A character root does not equal pelvis/butt position.

Nested parents, import scale, rotations, and local/world coordinate conversions can add further offsets.

Therefore an Agent must not infer "put object at desk.position + some Y" unless the prefab contract explicitly defines that relationship.

---

# 3. Prop-on-surface placement contract

Example: placing a cup on a desk.

Preferred order of methods:

## A. Authored Socket — strongest method

The desk prefab contains an explicit child transform, for example:

- `DeskRoot`
- `CupSocket_A`
- `CupSocket_B`

The cup prefab contains an explicit contact transform, for example:

- `CupRoot`
- `BottomContact`

Placement is solved by matching `BottomContact` to `CupSocket_A` in world space, then applying intended orientation.

This is the preferred method for repeatable designed placements.

## B. Collider / raycast surface query

If no socket exists:

1. identify the intended desk collider;
2. choose an X/Z candidate point inside the tabletop area;
3. raycast downward from above the desk;
4. use the actual hit point and surface normal as the support point;
5. compute the cup's bottom/contact offset;
6. place the cup so its bottom contact sits on the hit point with only a tiny intentional clearance;
7. verify no penetration and no visible floating.

## C. Renderer bounds — approximation only

`Renderer.bounds` may be used to estimate the object's world-space center/extents when stronger surface data is unavailable.

However, axis-aligned bounds are not a semantic tabletop definition and can be misleading for rotated, irregular, or compound objects.

Do not treat `bounds.max.y` alone as a guaranteed tabletop surface unless the geometry has already been validated as such.

---

# 4. Required automated verification for placed props

An Agent placing an object should report, at minimum:

- target object path/name;
- target world transform;
- support point used;
- object contact point used;
- final world position/rotation;
- support/contact gap;
- overlap/penetration result when relevant;
- screenshot from the frozen game camera.

A placement task should fail rather than silently pass if:

- the target surface cannot be identified confidently;
- the required collider/socket is missing;
- the result penetrates the support object;
- the object is visibly floating;
- the object lands on the floor or another unintended surface.

---

# 5. Local space vs world space rule

Agents must explicitly distinguish local and world coordinates.

Common failure pattern:

1. read a child object's local position;
2. interpret it as a world position;
3. place another object using that value;
4. produce a large offset because the parent is translated/rotated/scaled.

Any placement calculation that crosses object hierarchies should intentionally convert between spaces rather than mixing coordinates.

The report should state which space each important coordinate is expressed in.

---

# 6. Character seating is not only "pelvis Y = chair surface Y"

Sitting is more constrained than static prop placement.

A visually correct seated pose depends on multiple simultaneous conditions:

- pelvis/hip location;
- character root offset;
- avatar/reference pose;
- animation clip's authored root/pelvis motion;
- character body proportions;
- chair seat height/depth;
- chair back position;
- thigh direction;
- knee bend;
- foot/floor contact;
- arm/hand clearance if a desk is present;
- scale and rig retargeting differences.

Therefore matching only one point can still produce a visibly wrong result.

The previous project lesson remains important:

> Target accuracy does not equal visual contact correctness.

---

# 7. Seat interaction contract

Any chair intended for reliable character seating should eventually expose a seat contract such as:

- `SeatAnchor` — target character/root or pelvis alignment frame;
- `SeatForward` — intended facing direction;
- `SeatSurface` / seat height reference;
- optional `LeftFootTarget`;
- optional `RightFootTarget`;
- optional hand/desk targets for typing or other seated actions;
- occupancy/clearance volume.

Any compatible character should expose corresponding semantic references such as:

- root;
- pelvis/hips bone;
- left/right foot;
- left/right hand when needed.

A seated interaction should be solved in stages:

1. validate character scale/avatar/rig;
2. place/warp root relative to `SeatAnchor`;
3. play the intended sit animation;
4. inspect pelvis contact;
5. correct feet/hands using IK or rig constraints when needed;
6. verify chair/back/desk collision and clearance;
7. capture Human Visual evidence from the frozen Office Camera.

Do not repair repeated seating errors with arbitrary per-character XYZ offsets unless those offsets become an explicit documented calibration contract.

---

# 8. Agent/Codex execution rule

For spatial tasks, an Agent should use Unity/editor/runtime queries whenever possible instead of relying on source-file guesses or screenshot-only placement.

Preferred workflow:

`Inspect scene -> identify semantic target -> query actual transform/bounds/collider/anchor -> calculate placement -> run Unity -> measure result -> capture screenshot -> Human Visual review`

Do not use this workflow:

`look at screenshot -> guess XYZ -> rerun -> guess XYZ again`

Visual iteration may refine an already geometrically valid result, but it should not replace geometric reasoning.

When the Agent lacks enough scene information, the correct response is to add/query an explicit diagnostic or anchor rather than invent coordinates.

---

# 9. Asset authoring rule

Interactive assets should be normalized before production use.

Where applicable, standardized prefabs should include semantic child transforms such as:

- `Root`
- `GroundContact`
- `TopSurface`
- `SeatAnchor`
- `GrabSocket`
- `CupSocket`
- `HandTarget`
- `FootTarget`
- `AttachPoint`

Names may vary, but the semantic contract must be explicit.

This converts future Agent work from open-ended spatial guessing into deterministic matching between known points.

---

# 10. Practical difficulty classification

## Simple / deterministic

Examples:

- cup on desk;
- plant pot on shelf;
- lamp on table;
- prop in a known snap slot.

These should usually be solved with sockets or surface queries and should not suffer large placement errors.

## Moderate

Examples:

- character sitting in a chair;
- hands on keyboard;
- character holding a cup;
- character interacting with a deforming/animated prop.

These need multiple anchors plus animation/IK calibration.

## Complex

Examples:

- arbitrary character proportions using one generic seated animation with perfect contact everywhere;
- dynamic interaction with irregular moving geometry;
- two-character synchronized contact-heavy animation;
- realtime procedural full-body contact without pre-authored semantic targets.

These require more advanced rigging, warping, IK, or bespoke animation support.

---

# 11. Speed / efficiency baseline for simple placement tasks

The project should treat simple deterministic placement as a **fast machine task**, not a visual iteration task.

Examples:

- add a flower pot to a specific desk;
- place a cup on a tabletop;
- place a lamp on a known surface;
- attach a prop to an existing socket.

Once the scene is loaded and the asset is already imported/normalized, the expected Agent workflow should normally be a single short pass:

`identify target -> query geometry/socket -> calculate transform -> place -> validate contact`

For this class of task, the working benchmark is **seconds-level to very short execution**, potentially on the order of tens of seconds when the necessary geometric data is already available. The project should not accept repeated screenshot-driven XYZ tuning as normal work for such cases.

Important distinction:

- editor startup, asset download/import, shader compilation, or first-time asset normalization are separate costs;
- the **placement itself** should remain deterministic and cheap.

If a supposedly simple placement takes repeated iterations, the Agent should first diagnose the missing contract:

- no usable collider;
- bad pivot/origin;
- missing `BottomContact` / `TopSurface` / socket;
- merged geometry without semantic target;
- local/world transform confusion;
- scale/orientation mismatch.

The preferred fix is to create or expose the missing reusable spatial contract once, then reuse it for all later placements.

Permanent efficiency principle:

> Do not spend human review cycles solving a coordinate problem that the scene geometry can solve numerically.

This speed baseline should be reflected in future Agent/Codex prompts for modeling, prop placement, scene assembly, and interaction setup.

---

# 12. Permanent acceptance principle

> If a task has a physically meaningful contact relation, the project should define and validate that relation numerically before judging it visually.

Examples:

- cup bottom -> desk support surface;
- character pelvis/root -> seat anchor;
- feet -> floor targets;
- hand -> cup/keyboard socket;
- prop -> attachment socket.

Human Visual PASS remains the final authority because numerical contact can still look wrong, but obvious geometric placement errors should be prevented before visual review.
