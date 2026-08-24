# VQ-1C Character Runtime — Final Freeze

**Project:** Four Workstations / VQ-1C OfficeWorld
**Date:** 2026-08-24
**Status:** FINAL PASS / FROZEN

## 1. Final decision

The formal character runtime uses a **standing-only** strategy.

- Walking: standing character
- Working: standing character
- Meeting / dining / coffee / sofa / other states: standing character
- Seated character: **REJECTED / CLOSED**

Do not reopen seated-character work unless a future Gate explicitly authorizes it.

## 2. Current formal Quaternius runtime

This section is the authoritative current contract. The 2026-08-10 static
character baseline and failed seated experiments are retained later in this file
for historical traceability, but they no longer define production.

### Assets

```text
Ming  public/models/vq1/characters/quaternius/ming/Casual_Hoodie.gltf
Hong  public/models/vq1/characters/quaternius/hong/Formal.gltf
Jie   public/models/vq1/characters/quaternius/jie/Suit.gltf
Qixi  public/models/vq1/characters/quaternius/qixi/Casual.gltf
```

Each asset has one skin and includes the approved `Idle` and `Walk` clips.

### Animation

```text
stationary -> Idle
moving     -> Walk
Walk       -> IN_PLACE = YES
```

No other clip is part of the formal runtime. Do not add Run, Sitting, Typing,
Eating, Coffee, Wave, IK, Foot IK or facial animation without a new Gate.

### Scale

Values are read from the final production source:

```text
Ming  0.905
Hong  0.918
Jie   0.911
Qixi  0.914
```

Adult office proportion and furniture clearance have Machine + Human Visual
PASS. Do not continue scale or millimeter-level destination tuning.

### Skeleton ownership

Every model must be instantiated with:

```text
SkeletonUtils.clone(gltf.scene)
```

Plain `scene.clone()` is forbidden for these SkinnedMesh assets. Final verified
ownership results are:

```text
Ming  620 / 620
Hong  620 / 620
Jie   806 / 806
Qixi  558 / 558
```

### Transform and business ownership

The existing `characterRoot-${user.id}` remains the only transform source of
truth. It owns world movement, paths, position, rotation, status, visibility and
interaction. Each visual clone follows that root. `AnimationMixer` owns skeletal
motion only; one mixer and one skeleton clone exist per member.

### Lighting

The old character-forward horizontal offset was incompatible with the
Quaternius humanoids under the frozen formal camera. The final compatibility
formula is:

```text
VIEW_LIGHT_DIR = normalize(10.8, 0, 14.5)
               ~= (0.597, 0, 0.802)

light position = P + VIEW_LIGHT_DIR * 0.55 + (0, 2.35, 0)
target         = P + (0, 0.62, 0)
```

Frozen SpotLight parameters:

```text
color       #FFE8C8
intensity   35
angle       0.5
penumbra    0.75
distance    4
decay       2
castShadow  false
```

Exactly four Character SpotLights exist in the Character Scene. They must not
relight the Office Scene.

### Rendering

Rendering remains Two-Scene:

```text
PASS 1  Office Scene
        preserve depth
PASS 2  Character Scene, same renderer/camera/canvas
```

Do not call `clearDepth()`, add a third render pass, redesign around layers or add
EffectComposer/Bloom/SSAO/GTAO.

### Furniture clearance

The final standing-compatible destinations in `character-paths.ts` are frozen:

- desk positions move `0.60` toward the central aisle;
- meeting positions move `0.60` radially away from the table;
- dining positions move `0.55` radially away from the table;
- sofa positions move `0.85` in front of the sofa and face it;
- coffee, restroom and entrance destinations remain unchanged.

Path topology and business-root semantics remain unchanged.

### Performance and validation

Final desktop validation remained above 60 FPS. The latest representative
Day/Night movement runs measured approximately `233–240 FPS`, with four
characters, four mixers, four skeleton clones, four Character SpotLights and zero
console errors. The existing `THREE.Clock` deprecation warning is pre-existing.

Formal evidence:

```text
outputs/vq1c-character-light-final/
outputs/vq1c-character-scale-clearance-final/
outputs/vq1c-character-scale-clearance-final-v2/
```

### Seated

```text
SEATED CHARACTER = REJECTED / CLOSED
```

The formal runtime is standing-only in every destination/state.

### Current final status

```text
ANIMATED CHARACTER REPLACEMENT      FINAL PASS / FROZEN
CHARACTER LIGHTING COMPATIBILITY    FINAL PASS / FROZEN
CHARACTER SCALE & CLEARANCE         FINAL PASS / FROZEN
STANDING-ONLY CHARACTER RUNTIME     FINAL PASS / FROZEN
SEATED CHARACTER                    REJECTED / CLOSED
```

## 3. Superseded static-character baseline — historical

The remaining sections preserve the earlier static-character and seated-attempt
record. Where they conflict with Section 2, Section 2 is authoritative.

Base asset:

```text
public/models/vq1/characters/qa/vq1c-character-base-r1.glb
```

Asset facts:

- 1 mesh
- ~50,000 tris
- no skin
- no animation
- original height ≈ 1.1059 m
- runtime scale = 0.85

Formal runtime uses **1 shared geometry** for all four members.

## 3. Four-member palette

Each member uses its own BaseColor texture while sharing the same geometry and the same normal / roughness / metallic maps.

- ming: sage / gray-green
- hong: terracotta / peach
- jie: gray-blue
- qixi: lavender

Face remains warm cream/yellow; eyes and mouth retain the original dark details.

## 4. Business transform contract

The existing business root remains the only source of truth:

```text
characterRoot-${user.id}
```

The new visual proxy follows the business root every frame via world position / quaternion.

Do not create a second movement or state system.

The existing business logic remains responsible for:

- path movement
- member binding
- business state
- visibility
- rotation
- interaction
- labels
- Supabase-driven state

## 5. Desk-facing contract

Final work-facing directions:

```text
ming / desk1 : yaw -π/2, forward -X
hong / desk2 : yaw +π/2, forward +X
jie  / desk3 : yaw -π/2, forward -X
qixi / desk4 : yaw +π/2, forward +X
```

Formal work positions remain unchanged:

```text
ming  (-2.25, 0, -1.75)
hong  ( 2.25, 0,  1.75)
jie   (-2.25, 0,  1.75)
qixi  ( 2.25, 0, -1.75)
```

Do not move desks, chairs, seat anchors, or business coordinates to fit the character.

## 6. Two-scene rendering contract

Because the office uses baked lightmaps with `environmentIntensity = 0`, the formal character visual is rendered in a separate character scene.

### Pass 1
Render the frozen office scene.

### Pass 2
Render the character scene with:

- same renderer
- same camera
- same canvas
- `autoClear = false`
- office depth preserved

This keeps furniture depth occlusion correct while allowing real-time character lighting.

Do not revert to Three.js Layers as a per-object light-isolation solution.

## 7. Character spotlights

One spotlight follows each character.

Frozen parameters:

```text
color       #FFE8C8
intensity   35
angle       0.5
penumbra    0.75
distance    4
decay       2
castShadow  false
```

Per-frame position:

```text
P + F * 0.55 + (0, 2.35, 0)
```

Target:

```text
P + (0, 0.62, 0)
```

Where:

- `P` = business-root world position
- `F` = character world forward

Spotlights exist only in the character scene and must not relight the office.

## 8. Legacy character handling

Legacy business components remain.

Only the old visual mesh is hidden through the existing hidden-visual mechanism.

Must remain available:

- business root
- Html label
- interaction
- state
- path
- member binding

Formal result:

```text
old black visual = absent
```

## 9. Resource contract

Formal browser behavior:

```text
Base character GLB requests  = 1
BaseColor requests           = 4 total
Shared geometry              = YES
Material instances           = 4
Spotlights                   = 4
Shadow maps                  = 0
Office renders/frame         = 1
Character renders/frame      = 1
Seated / rig / toy assets    = 0 runtime requests
```

## 10. Seated-character experiments — CLOSED

Three routes were tested and rejected:

### A. Normal skinned rig
Result: FAIL

Problems:
- hip/body-bottom collapse
- fan-shaped tearing
- knee compression

### B. Toy-joint rig
Result: FAIL

Problems:
- obvious seams
- unnatural hip connection
- visible split / flap artifacts

### C. Static seated mesh
Result: FAIL

Problems:
- severe geometry stretching
- mesh tearing / spikes
- bad chair intersection

Production must not reference seated, rig-test, or toy-joint assets.

Historical QA assets may remain for traceability.

## 11. Final visual validation

Final browser screenshots:

```text
131-standing-only-work-full.png
132-standing-only-work-close.png
133-standing-only-four-different.png
134-standing-only-walk.png
135-standing-only-formal.png
```

Human review:

```text
Character scale        PASS
Desk facing            PASS
Chair relationship     PASS / acceptable
Desk/monitor occlusion PASS
Palette                PASS
Spotlight              PASS
Movement               PASS
Old visual             absent
Seated visual          absent
Formal page            PASS
```

## 12. Frozen dependencies

Do not change for character work:

- R5 Office GLB
- Rugfix Atlas0
- Atlas1
- lightMapIntensity
- contrast 1.20
- Camera
- desks
- chairs
- lamps
- seatAnchor
- OfficeInteractionLayer
- Supabase

## 13. Historical 2026-08-10 status — superseded

```text
R5 OFFICE                         FINAL PASS / FROZEN
RUG LIGHTMAP                      FINAL PASS / FROZEN
NEW CHARACTER VISUAL              FINAL PASS / FROZEN
DESK FACING                       FINAL PASS / FROZEN
CHARACTER LIGHTING                FINAL PASS / FROZEN
STANDING-ONLY CHARACTER RUNTIME   FINAL PASS / FROZEN
SEATED CHARACTER                  REJECTED / CLOSED
```

## 14. Historical future suggestions — closed by current freeze

These were suggestions before the current Character and Night systems completed
Machine + Human Visual validation. They are not open work:

1. Night / desk-lamp lighting
2. Extremely subtle idle bob
3. Small visual variations / accessories

Do not reopen seated-character research unless the base character asset changes.
