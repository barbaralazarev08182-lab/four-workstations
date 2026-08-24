# VQ-1C Current State

**Project:** Four Workstations
**Updated:** 2026-08-24
**Purpose:** Short top-level handoff. This file should stay compact.

## Current status

```text
Office R5 + Rugfix         FINAL / FROZEN
Workstation geometry      FINAL / FROZEN
Office camera             FINAL / FROZEN
Office lightmap           FINAL / FROZEN
Animated Character Replacement  FINAL PASS / FROZEN
Character Lighting Compatibility FINAL PASS / FROZEN
Character Scale & Clearance      FINAL PASS / FROZEN
Standing-only Character Runtime  FINAL PASS / FROZEN
Night Desk Lamps                 FINAL PASS / FROZEN
Seated Character                 REJECTED / CLOSED
```

## Formal office asset

Formal office is the R5 final office with repaired workstation geometry and repaired Runtime_Rugs Atlas0 receiver bake.

Do not modify:

- Office GLB
- Lightmap UV
- Atlas assignment
- Rugfix
- `lightMapIntensity = 4.213 * Math.PI`
- `FINAL_OFFICE_CONTRAST = 1.20`
- CameraController
- SAFE_AREA
- desk coordinates
- seat anchors
- OfficeInteractionLayer
- Supabase

## Formal character strategy

Formal character runtime is **standing-only**.

Architecture:

```text
Existing Business Character Root
        │
        ├─ path / state / label / interaction
        └─ world transform
                 │
                 ▼
       Quaternius Character Visual Proxy
                 │
                 ├─ SkeletonUtils safe clone
                 ├─ Idle / Walk skeletal animation
                 └─ one following SpotLight per member
```

Rendering:

```text
PASS 1: Office Scene
        ↓ preserve depth
PASS 2: Character Scene
```

Formal assets and runtime scales:

```text
ming  Casual_Hoodie.gltf  0.905
hong  Formal.gltf         0.918
jie   Suit.gltf           0.911
qixi  Casual.gltf         0.914
```

Animation contract:

```text
stationary -> Idle
moving     -> Walk (in place)
```

Movement, paths, rotation, status, visibility and interaction remain owned by
the existing business root. The character scene contains exactly four frozen
camera-compatible Character SpotLights.

## Desk-facing

```text
ming / desk1 : -X
hong / desk2 : +X
jie  / desk3 : -X
qixi / desk4 : +X
```

Business positions remain unchanged.

## Closed work

Do not reopen these without explicit user instruction:

- Blender office rebuild
- Office lightmap rebake
- UV debugging
- Atlas debugging
- Golden camera matching
- Character seated rig
- Toy-joint seated rig
- Static seated mesh
- Mixamo / humanoid rig
- complex character animation

## Freeze boundary

Office, Character and Night Lighting have completed Machine + Human Visual
validation. Do not start further visual enhancement without a newly authorized
Gate.

## Working rules

- One Gate at a time.
- Do not make broad refactors.
- Do not touch frozen business logic unless the task explicitly requires it.
- Machine PASS is not visual PASS.
- Use real browser screenshots for final visual judgment.
- Do not commit / push / deploy unless explicitly requested.
