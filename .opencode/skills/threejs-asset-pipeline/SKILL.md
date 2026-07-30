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

## Verification

After any change, run and confirm clean output for:

```
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Then open the browser at `http://localhost:3000` and visually verify the 3D scene.
