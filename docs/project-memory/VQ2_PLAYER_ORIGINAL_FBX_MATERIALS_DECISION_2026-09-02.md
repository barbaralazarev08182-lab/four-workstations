# VQ2 Player Original FBX Materials Decision — 2026-09-02

Status: LOCKED USER DECISION

The current player FBX already contains its intended surface textures/material information.

Implementation direction:
- Do not redesign, repaint, recolor, or invent a new character look.
- Codex should restore/use the original FBX materials and textures in Unity and assign them correctly to the current player instance.
- Preserve the current player model, rig, skin weights, proportions, Humanoid mapping, locomotion setup, camera, and lighting.
- If Unity import requires extracting/remapping embedded materials/textures or creating URP-compatible material assets, that technical conversion is allowed as long as the visual source remains the FBX's original texture/material data.
- Do not generate substitute textures.

This decision supersedes any prior suggestion to create a temporary custom base-look color scheme for the player.
