# VQ2 First-Person Camera Prototype Authorization — 2026-09-02

Status: USER AUTHORIZED / ACTIVE PROTOTYPE / VISUAL CORRECTION

The user authorizes a reversible first-person camera prototype in the current Office scene.

## Prototype intent
- First-person is being evaluated as the primary active gameplay view.
- The existing accepted diagonal dollhouse/room camera must be preserved and remain recoverable for later Room View / Rest View use.
- Do not redesign the room or permanently replace the existing camera during this prototype.

## Current prototype result
- WASD + mouse-look is operational.
- Existing room camera remains available through the prototype view switch.
- Dedicated Eye Pivot is stable and independent of the animated Head Bone.
- Full-body first-person presentation is desired: looking down should show the player's body, arms, legs, and feet while avoiding head-geometry camera clipping.
- User reports the overall first-person effect is viable.

## Current Human Visual corrections
1. Move the first-person Eye Pivot / camera backward only slightly relative to the player, using local-space backward offset rather than a world-space guess. Start with approximately 0.03–0.05 m and stop once the body framing feels natural. Do not change eye height unless separately requested.
2. The player's head must still cast a normal shadow in first-person. Hiding head geometry from the first-person camera must not remove its shadow caster.
3. Do not solve head clipping by disabling the entire head Renderer if that also removes its shadow. Prefer camera-layer/culling separation or an equivalent shadow-preserving method. If needed, use a shadow-only duplicate/renderer solution that follows the same head bone without changing visible character geometry.
4. When switching back to the room camera, the complete character including head must render normally.

## Implementation boundaries
- Reuse the current accepted player and WASD locomotion.
- Add/use mouse-look and a stable dedicated Eye Pivot / first-person camera rig.
- Do not parent the camera directly to an animated head bone in a way that produces animation-driven camera shake.
- Keep Root Motion off.
- Preserve current player model, skeleton, skin weights, proportions, animations, materials, Office lighting, and existing room camera.
- No head-bob, motion blur, crouch, sprint, interaction system, inventory, or other gameplay expansion is required for this pass.
- The prototype should remain easy to disable or remove without damaging the accepted Office baseline.

## Evaluation goal
The user should be able to enter PlayMode, move with WASD, look with the mouse, see a believable full body when looking down, see a complete character shadow including the head, and spend several minutes judging the room from human eye height.

The prototype remains under Human Visual / operation review and is not yet permanently promoted.
