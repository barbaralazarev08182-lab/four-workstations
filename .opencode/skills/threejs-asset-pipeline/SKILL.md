---
name: threejs-asset-pipeline
description: |
  3D asset pipeline for the four-workstations office scene. Use when modifying
  procedural office modeling, replacing or adding GLB characters, integrating
  skeletal animation, optimizing 3D assets, or adjusting pathing, actions,
  lighting, and cameras.
---

# Three.js Asset Pipeline

## Pre-work

1. Read all source files in `components/office-3d/` before making changes.
2. Understand the current separation:
   - `CharacterController` — position, pathing, heading, and behavior state only.
   - `CharacterRenderer` — appearance and animation rendering only.
   - These two must **never** be re-coupled.

## Model import checklist

Before importing any new 3D model, inspect and report:

- File size
- Node names and hierarchy
- Skeleton / bone structure
- Animation clip names (read the `animations` array; never assume names)
- Material count
- Texture dimensions
- Estimated draw calls
- Origin, scale, and forward-axis orientation

## Format & fallbacks

- Prefer GLB / glTF for new models.
- Every GLB model must provide:
  - A loading state (spinner, skeleton, or low-poly stand-in).
  - An error fallback (procedural character or silhouette).
  - A procedural character fallback for browsers that fail to load the model.

## Animation rules

- All action states (sit, walk, type, eat, etc.) must be able to **restore to the previous state** when the action ends.
- Do not assume animation clip names — always read `animations` from the imported model first.

## Constraints

- Do not change the Realtime status structure as a side effect of swapping appearances.
- After every change, verify the character does not clip through walls, desks, float, or sink into the floor.
- Test on both desktop and mobile (< 760 px) viewports.
- Large models must have a performance risk report before being committed; do not commit large models silently.
- **Never** upgrade or downgrade `three`, `@react-three/fiber`, or `@react-three/drei` — they are vendored via `work/deps/*.tgz`.

## File organization

Source files, raw imports, and optimized runtime assets are kept in separate locations:

| Layer | Location | Purpose |
|-------|----------|---------|
| Blender sources | `work/assets-src/` (gitignored) | `.blend` files, editable masters |
| Raw imports | `work/assets-raw/` (gitignored) | Uncompressed GLB, full-size textures |
| Optimized assets | `public/models/` | Draco/Meshopt compressed GLB, 1024² textures |
| Provenance log | `docs/ASSET_PROVENANCE.md` | Author, license, modification history |

## Unified conventions

All assets in the project must share:

| Property | Standard |
|----------|----------|
| World unit | 1 unit = 1 meter |
| Origin | Model root at feet/ground contact, centered on XZ |
| Forward direction | +Z (glTF default) |
| Model scale | Applied at import; no runtime scale hacks |
| Node naming | `Armature`, `Bone_Hip`, `Bone_Spine`, `Bone_Head`, `Bone_Arm_L`, `Bone_Arm_R`, `Bone_Leg_L`, `Bone_Leg_R` |
| Material naming | `Mat_Body`, `Mat_Face`, `Mat_Clothing`, `Mat_Accent` |
| Bone naming | LowerCamelCase, English, no spaces |
| Animation clip naming | `idle`, `walk`, `sit`, `type`, `eat`, `rest`, `wave` |

## Pre-import inspection

Before any model enters the project, check and report:

- Triangle count (total + per-mesh)
- Draw calls (material count × submesh count)
- Material count (unique materials)
- Texture dimensions (each map)
- File size (raw GLB + compressed)
- Bone count (if rigged)
- Animation duration (each clip, in seconds)
- glTF Validator result (must pass with zero errors)

## External asset rules

- Every external asset **must** be registered in `docs/ASSET_PROVENANCE.md` with author, source URL, license, and modification history.
- **Forbidden**: mixing art styles from incompatible asset packs in the same scene.
- All textures must be ≤ 1024×1024. Exceptions require explicit approval.
- Mobile performance budget: < 50k triangles total scene, < 100 draw calls.

## Changfen (肠粉) model specification

The British Shorthair cat "Changfen" must retain these defining features:

| Trait | Requirement |
|-------|-------------|
| Face | Round, broad, with prominent cheek pads |
| Ears | Small, wide-set, rounded tips |
| Coat | Blue-gray, short, dense, plush appearance |
| Eyes | Large, round, golden/copper color |
| Body | Cobby (compact, stocky), broad chest |
| Legs | Short, thick, sturdy |
| Tail | Thick, rounded tip |
| Default expression | Slightly grumpy / "cold face" (resting cat face) |

A generic slim/long cat model **must not** be used and labeled as Changfen.
A stylized interpretation is acceptable as long as the 7 defining traits are recognizable.

### 肠粉模型定位

Phase 1C 产出的程序化肠粉为**视觉 MVP 和 blockout 占位**，不得声明为最终模型。
最终版本需要定制 GLB 和 Blender 制作流程。
程序化版本的目标是验证比例、色彩和动画系统，而非交付最终视觉品质。

## Bevel / chamfer specification

All visible edges must have 2–4% bevel relative to edge length. Bevels catch highlights and are the cheapest way to distinguish "premium wooden toy" from "default BoxGeometry".

- Apply bevel to all furniture, walls, and structural geometry
- Do NOT bevel tiny decorative details (< 5mm edges)
- Verify bevels in grayscale screenshots — they should produce subtle highlight lines

## Verification

After any change, run and confirm clean output for:

```
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Then open the browser at `http://localhost:3000` and visually verify the 3D scene.

For art changes, also load the `art-direction-review` skill and complete the screenshot checklist.
