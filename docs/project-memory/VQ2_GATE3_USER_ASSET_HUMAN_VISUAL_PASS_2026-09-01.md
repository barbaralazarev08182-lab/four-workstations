# VQ2 Gate 3 — User Asset Human Visual PASS

> Date: 2026-09-01
> Status: HUMAN VISUAL / PRODUCT PASS
> Scope: current isolated Gate 3 room candidate after user-asset scale correction, edge placement, room cleanup, rug derivative split, and PBR restoration.

## 1. Human Visual decision

The user explicitly confirmed the current candidate is visually acceptable: **PASS**.

This supersedes the prior `HUMAN VISUAL REVIEW PENDING` state.

The following presentation state is now the accepted visual reference for the next engineering gate.

## 2. Accepted Rest Edge state

- one shared Rest Seat prefab;
- four instances;
- presentation scale: **2.0**;
- each seat remains flush with the real Rest floor edge;
- reported per-seat world bounds: `1.428822 x 0.745385 x 0.899160 m`;
- reported edge distance: approximately `0.000001 m`;
- scale-change edge-snap compensation: `DeltaX=0`, `DeltaY=0`, `DeltaZ=-0.224790 m`;
- instance ordering / X spacing remains unchanged;
- no platform, railing, or replacement geometry was added.

This scale / edge relation is now the visual reference and must not drift during optimization.

## 3. Accepted Retrieval Station state

- presentation scale: **3.5**;
- position: `(7.784205, 0, 1.625)`;
- Y rotation: **180 degrees**;
- reported world bounds: `2.745662 x 2.235772 x 3.281719 m`;
- Guide Arm remains directed toward Outside;
- base remains floor-supported / edge-related;
- current composition is accepted and must not be re-authored during optimization.

## 4. Accepted Retrieval Orb state

- internal scale remains `25.55`;
- independent world presentation factor: `1.5`;
- parent compensation under Station x3.5: `0.428571`;
- reported world bounds: `0.405047 x 0.447263 x 0.399027 m`;
- docking pivot/world relation is accepted;
- `Orb_CradleSocket` relation is accepted;
- no emission redesign was performed in this Gate.

## 5. Accepted room cleanup

The user-approved candidate removes:

- the unused left-side green floor rug;
- the full right-side dining set, including table, benches/seating, and dining ceramics/place settings.

No replacement furniture was added.

For the rug, a candidate-only non-destructive derivative was used:

- source mesh: `POD_RUG_LEFT` / `Runtime_Rugs`;
- original source preserved unchanged;
- source: 648 verts / 420 tris;
- connected-component analysis: 114 topological components;
- unwanted semantic rug cluster: 38 complete connected components;
- removed cluster: 216 verts / 140 tris;
- derived candidate: 432 verts / 280 tris;
- valid workstation rugs remain.

The source Office GLB reported SHA-256 remains:

`139F8C7B0FF26D9A130C20EF976F6DE564B7200A5CFCF6836E863EB038EB7B30`

## 6. Accepted material restoration

The white-placeholder state is superseded.

Current candidate restores the user-authored PBR appearance through Unity-side URP/Lit materials for:

- Rest Seat;
- Retrieval Station;
- Retrieval Orb;
- Returning Piece.

Source maps are 4096x4096 BaseColor, Normal, Metallic, and Roughness.

URP binding contract:

- BaseColor -> Base Map;
- Normal -> Normal Map;
- Metallic -> packed metallic R;
- Smoothness -> `1 - Roughness`, packed into alpha.

No repainting, recoloring, AI-regeneration, or source-FBX modification was performed.

Orb emission remains deferred unless later handled by a dedicated non-destructive material/effect gate.

## 7. Engineering validation at PASS

Reported:

- Compile: PASS;
- PlayMode: 5/5 PASS;
- Console blocking errors: 0;
- staged files: 0;
- commit: none;
- production promotion: none.

Protected hashes reported unchanged:

- Office: `979282E2797894E1D95C2EA21FF59962847D064351C77857A7C9AAB89D135AB4`;
- N1R: `636D224F494A719D3807B9CC142872345A87394D6693618C3B3C1D5EC348F9F3`;
- Atlas prefab: `4CBC99963F8239E03F253B630E5929DDC3B91CF9A69F39099C1458C73B2C7993`;
- Seat source: `074A4F21EF407F1705720F8372740961DE4B0DCDEFDA86A0F9FEBB22FFA198F9`;
- Station source: `2D822E2E570B09AA25EF1A2CD7E8ACA16611476688EF28AEF7CD5BAE4F2986B9`;
- Orb source: `621E995604D4724143A6F737BFEA0A830ABDD302AE3925DAE90A469E4A4D38E2`;
- Returning Piece source: `0CABAD29CA8416B9211F0207413D5526FD0608EE1A14EB44D5F6A73EE9CA9977`.

## 8. Next authorized engineering gate: controlled runtime mesh reduction

Do **not** immediately promote the current high-poly user meshes as final long-term production assets.

The next gate is a controlled reduction / runtime-clean-source comparison against this accepted visual reference.

Priority:

1. Retrieval Station: current source is about **816,590 tris**. Produce region-aware reduction candidates. Preserve Guide Arm/Tip, reel silhouette, cradle, base silhouette, mechanical joints, and all visible forms from the canonical camera. Do not use a blind global one-click decimate. A practical exploration range is roughly `120k-220k tris`, but visual fidelity overrides the number.
2. Rest Seat: current source is about **50,104 tris** and is shared by four instances. Produce a conservative candidate, roughly `15k-30k tris` as an exploration range, while preserving silhouette, cushion/seat edge forms, outward table, and normal/UV/material fidelity.
3. Retrieval Orb: current source is about **52,691 tris**. Optimization is optional/conservative; do not damage the smooth silhouette or material response merely to hit a target.
4. Returning Piece: current source is about **49,986 tris**. It is not necessary to reduce it in the same pass unless evidence shows a clear runtime need; preserve its small-object silhouette and future orientation behavior potential.

For every optimized candidate:

- preserve original protected FBX/source assets;
- preserve accepted world scale/position/orientation;
- preserve PBR materials/UVs/normals/tangents;
- compare against this PASS candidate using the same canonical full-room and close-up views;
- report triangles/vertices/memory before and after;
- reject any candidate with visible silhouette/material degradation.

No gameplay, tether, animation, or promotion is authorized during reduction.

## 9. Promotion sequence after reduction PASS

Only after the reduced runtime candidates receive Human Visual PASS:

1. promote the accepted Seat / Station / Orb / room-cleanup state into authoritative Office;
2. apply the equivalent room-content state to N1R while preserving Night lighting/state differences;
3. preserve Atlas transform/stages/material baseline unchanged;
4. run compile / PlayMode / Console validation;
5. verify protected source hashes remain unchanged;
6. create a checkpoint commit;
7. record the promoted Office/N1R hashes and commit in project-memory.

That promotion closes the current Gate 3 room/world-readiness work unless a new visual blocker is discovered.

## 10. After Gate 3 closes

The next product-facing development direction should be the **Retrieval runtime foundation**, starting with the device's physical behavior rather than loot/content complexity:

- Station guide/yaw/elevation mechanical control as needed;
- reel pay-out / retrieval behavior;
- runtime flexible tether between Station and Orb;
- Orb deploy / hold / retrieve;
- downward / horizontal / diagonal / upward support;
- controlled sag/tension feedback;
- no attraction/content table/economy initially.

Returning Piece behavior and actual recovered-content logic should come after the basic Retrieval device can physically send and recover the Orb reliably.

## 11. Interaction constraint

Do not generate or edit images unless the user's current message explicitly contains the exact phrase `生成图片`.