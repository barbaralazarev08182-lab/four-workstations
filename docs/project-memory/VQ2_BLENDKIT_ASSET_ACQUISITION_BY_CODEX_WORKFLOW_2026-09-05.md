# VQ2 Blendkit asset acquisition by Codex workflow — 2026-09-05

## User workflow decision
The user prefers not to manually install Blender / Blendkit, organize downloaded furniture, or convert assets. For Blendkit furniture, Codex should own the acquisition workflow end-to-end whenever local permissions/network allow.

## Corrected acquisition model
- Blendkit model pages generally do not hand the user a standalone `.blend/.fbx/.glb` download through the browser page. The official flow is to access/download assets through the Blendkit add-on in Blender.
- The Lapis Sofa by Amura asset is listed as Free and can be accessed through Blendkit.
- Free Blendkit assets may be accessible without account login; if authentication is required by the current client/session, Codex should stop only for the minimal unavoidable user authentication step, then continue automatically.

## Preferred Codex workflow
1. Detect whether Blender is already available locally.
2. If absent, prefer a user-local / portable official Blender install so no admin/system-wide change is required.
3. Install/enable the supplied Blendkit add-on package.
4. Acquire the exact Lapis Sofa asset using its Blendkit asset ID `ca4ba7a1-3bd1-41db-b43e-2b5feb9b0f25`.
5. Prefer programmatic/headless use of Blender/Blendkit client where practical; GUI interaction should be minimized.
6. If a login/API key is genuinely required, request only that one user action and then resume.
7. Save a clean source `.blend` or export an engine-friendly `.fbx/.glb` plus required textures/material data.
8. Import to the Unity candidate project, measure true dimensions, calculate 0.5m grid occupancy, place, and produce Human Review screenshots.
9. Preserve source/license metadata and asset URL.
10. Do not commit/push/promote unless separately authorized.

## Placement rule remains authoritative
Real-world proportions take precedence over grid rounding. Do not non-uniformly stretch furniture to fill old graybox footprints. Report actual W×D×H, hard occupancy, use/clearance occupancy, final orientation, and narrowest circulation width.
