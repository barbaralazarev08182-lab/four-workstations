# VQ2 Player Surface Material Direction — 2026-09-02

Status: LOCKED USER DECISION — UPDATED

The player's original FBX materials/textures remain the visual source baseline, but the current grey-white body shell reads too dark in the Office and is now explicitly authorized for a controlled material refinement.

Implementation direction:
- Preserve the current player model, rig, skin weights, proportions, Humanoid mapping, WASD locomotion, Idle/Walk setup, camera, and lighting.
- Do not alter the joint materials. The existing darker mechanical joint treatment remains unchanged.
- Do not alter the head's horizontal ring region. That ring is reserved for a later dedicated emission/glow pass.
- The remaining grey-white shell regions — torso, limbs, hand/foot shell panels, and other matching body shell surfaces — may be converted to a refined metallic material.
- Target material character: warm light titanium / champagne-silver / warm grey metallic shell; clean, restrained, premium, satin rather than mirror-polished.
- Avoid chrome, black metal, saturated gold, neon, cyberpunk treatment, heavy wear, scratches, or dense surface detail.
- Keep the original texture identity where useful, but adjust the Unity/URP material response so the shell catches Office lighting and reflections more clearly.
- A practical starting range is Metallic about 0.65–0.8 and Smoothness about 0.45–0.6, then tune visually in the Office rather than treating those values as hard locks.
- No new generated texture set is required for this pass.

This decision supersedes the earlier rule that all original FBX surface appearance must remain visually unchanged. The protected exception is now specifically limited to a controlled refinement of the grey-white body shell material, with joints and the future head emission ring preserved.