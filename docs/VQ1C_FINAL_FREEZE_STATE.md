# VQ-1C Final Freeze State

**Project:** Four Workstations
**Date:** 2026-08-24
**Status:** FINAL PASS / FROZEN

This is the concise project-level freeze contract. Historical investigation and
QA evidence remain in their existing documents and output directories.

## Final systems

```text
Office R5 + Rugfix                  FINAL PASS / FROZEN
Workstation Geometry               FINAL PASS / FROZEN
Office Camera                      FINAL PASS / FROZEN
Direct-only Lightmap               FINAL PASS / FROZEN
Standing-only Animated Character   FINAL PASS / FROZEN
Character Two-Scene Rendering      FINAL PASS / FROZEN
Character Lighting Compatibility   FINAL PASS / FROZEN
Character Scale & Clearance        FINAL PASS / FROZEN
Night Desk Lamps                   FINAL PASS / FROZEN
Seated Character                   REJECTED / CLOSED
```

## Office contract

- Formal asset: R5 final office with Rugfix Atlas0 receiver repair.
- Workstation geometry, desks, chairs and seat anchors are frozen.
- `CameraController`, `SAFE_AREA`, office lighting, lightmap UV/atlas assignment,
  `OfficeInteractionLayer` and Supabase contracts are frozen.
- Day remains direct-only baked lighting with the approved contrast and
  lightmap intensity.

## Character contract

- Four Quaternius skeletal glTF characters: Ming, Hong, Jie and Qixi.
- `SkeletonUtils.clone(...)` is required for each independent skeleton.
- Stationary uses `Idle`; moving uses in-place `Walk`.
- The existing business root remains the source of truth for movement, paths,
  position, rotation, status, visibility and interaction.
- Standing-only semantics are frozen. Seated work remains rejected and closed.
- Final scales: Ming `0.905`, Hong `0.918`, Jie `0.911`, Qixi `0.914`.
- Approved furniture-clearance destinations in `character-paths.ts` are frozen.

## Character lighting and rendering

```text
VIEW_LIGHT_DIR = normalize(10.8, 0, 14.5)
light position = P + VIEW_LIGHT_DIR * 0.55 + (0, 2.35, 0)
target         = P + (0, 0.62, 0)
```

Each character has one Character Scene SpotLight:

```text
color       #FFE8C8
intensity   35
angle       0.5
penumbra    0.75
distance    4
decay       2
castShadow  false
```

Rendering remains exactly two passes: Office Scene first, then Character Scene
with preserved office depth. Do not add `clearDepth()`, a third pass, layers
redesign or post-processing.

## Night contract

Night Desk Lamps remain the approved night-only system: four desk SpotLights
and four emissive lamp proxies with no realtime shadows. Day restores the exact
frozen daytime state. Do not retune night lighting without a new Gate.

## Validation and change control

Machine and Human Visual validation are both PASS for Office, Character and
Night Lighting. Formal evidence is retained under the project QA outputs.

Do not modify any frozen system or reopen seated-character work without explicit
authorization for a new Gate.
