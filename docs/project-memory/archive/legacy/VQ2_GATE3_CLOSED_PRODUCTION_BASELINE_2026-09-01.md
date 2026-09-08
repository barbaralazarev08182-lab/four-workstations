# VQ2 Gate 3 — Closed Production Baseline

> Date: 2026-09-01
> Status: CLOSED

Gate 3 is formally closed based on Human Visual PASS, production promotion, validation, and performance baseline evidence.

## Production state

Checkpoint commit:

`3a8eb5fb769918987426d5aadb55f802a6017cb0`

Promotion hashes:

- Office: `979282E2…5AB4` -> `81A7DE3A…F89B`
- N1R: `636D224F…F9F3` -> `5A6463F7…120B`
- Atlas prefab unchanged: `4CBC9996…7993`
- Original Runtime Rugs / Office GLB unchanged: `139F8C7B…7B30`

Protected source FBX unchanged:

- Seat: `074A4F21…98F9`
- Station: `2D822E2E…86B9`
- Orb: `621E9956…8E2`
- Returning Piece: `0CABAD29…9977`

All source/working FBX assets remain under Git LFS.

## Accepted production content

- Rest Edge seats promoted at presentation scale `2.0`, edge-snapped, one shared prefab / four instances.
- Retrieval Station promoted at accepted x3.5 presentation, Y=180 degrees, accepted edge composition.
- Retrieval Orb promoted at accepted reduced world size and docking relation.
- Left unused green rug remains removed through the accepted non-destructive Runtime_Rugs derivative.
- Existing valid workstation rugs remain.
- Dining table, benches/seating, and dining ceramics/place settings remain removed.
- User-authored PBR appearance remains restored for Seat, Station, Orb, and Returning Piece.
- Atlas remains unchanged.

## Performance baseline

Environment:

- 1920x1080
- High quality
- URP Render Scale 1.0
- MSAA 4x
- RTX 4060 Laptop

Measured:

- Day: average `4.190 ms / 238.65 FPS`, P95 `19.250 ms`
- Night: average `1.506 ms / 663.99 FPS`, P95 `2.122 ms`
- Day: `1,073,628 tris`, 51 enabled renderers
- Night: `1,205,775 tris`, 56 enabled renderers
- Mesh memory: Day `96.42 MB`; Night `109.63 MB`
- Texture runtime memory: approximately `621.24 MB`
- User-asset textures: approximately `84.22 MB`
- Atlas mesh: approximately `20.65 MB`
- Station, Seats, and Orb cast shadows

No sustained blocking performance problem was observed.

The current high-poly assets are accepted for the production baseline. Triangle count alone is not a reason to reopen optimization. Any future mesh/texture/shadow optimization must be evidence-driven by real profiling.

Batch-mode evidence did not provide trustworthy GPU frame time, draw-call, batch, or SetPass values. Those values were intentionally not fabricated. If needed, they belong in a later dedicated Player profiling gate.

## Validation

- Compile: PASS
- PlayMode: 5/5 PASS
- Console blocking errors: 0
- Authoritative Day screenshot is byte-identical to the accepted PASS candidate
- No mesh reduction performed
- No LOD generation performed
- No runtime tether or Retrieval gameplay implemented
- Historical excluded untracked files remain uncommitted

## Gate decision

VQ2 GATE 3

- HUMAN VISUAL PASS
- PRODUCTION PROMOTED
- PERFORMANCE BASELINE COMPLETE
- HIGH-POLY CURRENT ASSETS ACCEPTABLE FOR PRODUCTION BASELINE
- CLOSED

## Next phase

The next product-facing phase is Retrieval Runtime foundation, beginning with physical device behavior rather than content/economy complexity:

- Station guide/yaw/elevation behavior as required;
- reel pay-out / retrieval;
- runtime flexible tether;
- Orb deploy / hold / retrieve;
- support for downward, horizontal, diagonal, and upward sending;
- restrained sag/tension feedback;
- no loot table, attraction economy, or large content system in the first pass.

Do not reopen Gate 3 unless a concrete visual, functional, or performance blocker is discovered.