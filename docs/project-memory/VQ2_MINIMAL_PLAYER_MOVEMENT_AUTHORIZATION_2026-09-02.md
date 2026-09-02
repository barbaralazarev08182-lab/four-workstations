# VQ2 Minimal Player Movement Authorization — 2026-09-02

## Decision

Authorize a minimal WASD player movement controller for the current Unity Office so the already-validated character FBX can be tested as the player using real displacement speed.

## Constraints

- Keep Root Motion disabled.
- Drive Idle / Walk from actual movement speed.
- Do not modify the character model, skeleton, skin weights, or scale.
- Do not modify the Office camera or lighting.
- Keep this implementation minimal; it is a movement/animation validation step, not a full player-controller architecture pass.
