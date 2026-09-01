# VQ2 Gate 3 — User Asset Intake Handoff to Codex

> Date: 2026-09-01  
> Status: ACTIVE HANDOFF / INTAKE PREPARATION  
> Scope: receive the user's completed visible 3D assets and prepare them for isolated Unity review without redesigning or beginning gameplay.

## 1. Purpose

The current task is to hand the user's completed 3D models to Codex for preservation, technical inspection, normalization, controlled runtime preparation, and isolated Unity integration.

This is **not** authorization to redesign the assets or begin Retrieval gameplay.

The locked production boundary remains:

> User authors the visible final 3D asset. Codex preserves, normalizes, integrates, creates technical pivots/sockets when needed, and validates.

Codex must not replace user-authored final geometry with self-authored visible geometry.

## 2. Intake rule

Do not assume which user models are present from chat history alone.

At the start of the task, Codex must inventory the actual newly supplied model files and report:

- filename/path;
- format;
- file size;
- object/mesh count;
- triangle/vertex count where available;
- material count;
- texture references and whether they resolve;
- transforms / scale / orientation;
- whether component splitting exists;
- whether any thin rope/tether geometry is baked into the source.

Preserve each supplied user source exactly before any modification.

Create a read-only / protected source copy or equivalent source-preservation arrangement following the repository's existing conventions. If a convention already exists, reuse it rather than inventing a parallel structure.

Record a SHA-256 hash for every preserved source file.

## 3. Expected asset family

The current Gate 3 user-authored asset family may include, depending on what is actually supplied:

- Rest Edge reusable single-person seat/table module;
- Retrieval Station;
- Retrieval Orb;
- later, Returning Piece;
- later, one or two ordinary recovered objects.

Do not mark an asset as received unless its actual file is present.

## 4. Retrieval Station specific contract

If the Retrieval Station model is supplied:

- preserve the original high-quality/high-poly source first;
- do not treat arbitrary component-split output as the final semantic hierarchy;
- inspect current parts and map them into meaningful functional groups where possible;
- do not destructively alter the source;
- do not keep modelled thin rope/tether geometry as the final runtime tether;
- do not begin the runtime tether system in this intake task.

Preferred semantic groups for the normalized candidate are approximately:

- `Station_Base`;
- `Station_YawAssembly` if horizontal steering is supported;
- `Station_GuideArm`;
- `Station_ReelDrum`;
- optional `Station_GuideTip` if it needs independent control;
- `Station_OrbCradle`;
- `Station_RecoveryTray` if retained separately.

Required technical transforms / sockets to prepare or reserve:

- `Tether_ReelExit`;
- `Tether_GuideTip`;
- `Orb_CradleSocket`;
- optional `Recovery_TraySocket`.

Pivots must correspond to real mechanical axes, especially:

- reel/spool rotation axis;
- guide-arm elevation axis;
- yaw axis if the upper mechanism rotates horizontally.

The previously observed Hunyuan candidate was approximately 816k triangles / 408k vertices with an 11-part split. Treat those values only as prior evidence; re-measure the actual supplied file.

Any runtime reduction must follow:

`protected source -> controlled reduced candidate -> fixed-camera comparison -> Human Visual approval`

Do not optimize to an arbitrary number. A 60k–120k exploration range may be useful, but visible silhouette and mechanical fidelity are authoritative.

## 5. Retrieval Orb specific contract

If the Retrieval Orb model is supplied:

- preserve the original source;
- keep the large luminous-shell region addressable as a distinct material/rendering domain where the source supports it;
- keep functional metal and primary decorative metal separable where practical;
- create/reserve `Orb_TetherAttach` at the actual physical tether connection point;
- create/reserve a canonical docking transform/orientation compatible with `Orb_CradleSocket`;
- do not invent a hook;
- do not bake the runtime tether into the Orb mesh;
- do not implement light behavior, lure behavior, contact logic, or Retrieval gameplay yet.

If the supplied Orb differs from earlier concept art, the actual user-authored model is authoritative unless the user explicitly asks for redesign.

## 6. Rest Edge seat specific contract

If the Rest seat/table module is supplied:

- preserve the source;
- treat it as **one reusable module**, not four independent meshes;
- do not redesign the chair/table;
- prepare a normalized prefab candidate;
- reserve seat/approach/facing/contact transforms as required by the existing Rest Edge technical scaffold;
- four placements in the room must reuse the same source/prefab unless the user explicitly requests variants.

Do not begin seating gameplay or final PEBBLE animation work.

## 7. Unity integration scope

After source preservation and normalization, create an **isolated candidate integration** only.

Do not promote directly into the authoritative Office/N1R scenes.

The isolated review should verify:

- scale relative to the canonical room;
- orientation;
- footprint and clearances;
- silhouette in the frozen canonical camera;
- material/texture integrity;
- hierarchy/pivot/socket correctness;
- duplicate mesh/material memory where relevant;
- absence of unexpected source mutation;
- no interference with the approved Atlas baseline.

Protect the current Atlas Office baseline. Do not modify Atlas geometry, Stage 0–4 logic, materials, camera, lighting, or its accepted 2.5x / Y=180° transform as part of this intake task.

## 8. Explicitly out of scope

Do not begin any of the following in this asset-intake task:

- Retrieval gameplay;
- procedural tether/rope runtime implementation;
- casting/aiming controls;
- Orb lure/contact behavior;
- recovered-object gameplay;
- Research systems;
- persistence/save-load;
- economy/loot systems;
- Atlas polish;
- PEBBLE final animation polish;
- new visible replacement geometry authored by Codex;
- broad room decoration.

## 9. Required output from Codex

Return a concise intake report containing:

1. actual received file inventory;
2. SHA-256 of every protected source;
3. geometry/material/texture statistics;
4. component/hierarchy assessment;
5. proposed semantic grouping for each model;
6. proposed pivot/socket plan;
7. reduction need and candidate strategy, if required;
8. isolated Unity integration path/scene/prefab plan;
9. compile/test status if integration was performed;
10. explicit list of untouched authoritative assets/scenes;
11. screenshots from the canonical frozen camera for Human Visual review if an isolated candidate was integrated.

Do not declare Human Visual / Product PASS yourself.

Stop after engineering/machine review and wait for user visual approval before promotion.
