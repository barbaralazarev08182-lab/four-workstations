# VQ2 First-Person Camera Prototype Authorization — 2026-09-02

Status: USER AUTHORIZED / PROTOTYPE ONLY

The user authorizes a reversible first-person camera prototype in the current Office scene.

## Prototype intent
- First-person is being evaluated as the primary active gameplay view.
- The existing accepted diagonal dollhouse/room camera must be preserved and remain recoverable for later Room View / Rest View use.
- Do not redesign the room or permanently replace the existing camera during this prototype.

## Implementation boundaries
- Reuse the current accepted player and WASD locomotion.
- Add mouse-look and a stable dedicated Eye Pivot / first-person camera rig.
- Do not parent the camera directly to an animated head bone in a way that produces animation-driven camera shake.
- Keep Root Motion off.
- Preserve current player model, skeleton, skin weights, proportions, animations, materials, Office lighting, and existing room camera.
- No head-bob, motion blur, crouch, sprint, interaction system, inventory, or other gameplay expansion is required for this first pass.
- The prototype should be easy to disable or remove without damaging the accepted Office baseline.

## Evaluation goal
The user should be able to enter PlayMode, move with WASD, look with the mouse, and spend several minutes judging the room from human eye height.

The prototype is a camera/feel test only. Do not treat first-person as permanently promoted until Human Visual / operation review.
