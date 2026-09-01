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

This scale / edge relation is now the visual reference and must not drift.

## 3. Accepted Retrieval Station state

- presentation scale: **3.5**;
- position: `(7.784205, 0, 1.625)`;
- Y rotation: **180 degrees**;
- reported world bounds: `2.745662 x 2.235772 x 3.281719 m`;
- Guide Arm remains directed toward Outside;
- base remains floor-supported / edge-related;
- current composition is accepted and must not be re-authored.

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

## 8. Latest optimization decision — performance first, no mandatory reduction

The earlier requirement to perform a controlled mesh-reduction gate before promotion is **superseded**.

The current user decision is:

> Do not reduce the accepted user meshes merely to hit a triangle-count target. Preserve the Human Visual PASS high-quality meshes unless real runtime profiling demonstrates a meaningful performance problem.

Therefore:

- Retrieval Station may remain at approximately **816,590 tris**;
- Rest Seat may remain at approximately **50,104 tris** shared across four instances;
- Retrieval Orb may remain at approximately **52,691 tris**;
- Returning Piece may remain at approximately **49,986 tris**;
- no reduction candidate is required before promotion;
- triangle count by itself is not a failure criterion.

The protected source FBX files remain the canonical high-quality sources.

If later profiling identifies a real bottleneck, optimization should be evidence-driven and non-destructive. Possible future strategies include runtime LODs, region-aware reduction, texture/memory optimization, shadow tuning, or renderer/material optimization. Do not assume mesh reduction is the first or only remedy.

## 9. Next authorized engineering gate — promotion + performance baseline

The next engineering step is to promote the current Human Visual PASS room state into the authoritative Office and N1R scenes while preserving their lighting/state differences, then profile the actual production result.

Promotion must preserve exactly:

- Rest Seat x2.0 and its accepted edge relationship;
- Retrieval Station x3.5, position `(7.784205, 0, 1.625)`, Y=180 degrees;
- Retrieval Orb accepted size/docking;
- restored user PBR materials;
- left green-rug removal through the approved derivative mesh;
- full dining-set removal;
- Atlas baseline unchanged;
- no Retrieval gameplay, tether, animation, or new visual polish.

After promotion, record a performance baseline on the actual authoritative scenes. At minimum capture:

- target resolution / graphics quality used for the measurement;
- average FPS and observed low/slow frame behavior over a repeatable short run;
- CPU frame time;
- GPU frame time where available;
- visible triangle count / vertices or equivalent renderer stats;
- batches / SetPass / draw calls where available;
- mesh memory;
- texture memory or at least imported texture memory totals for the new user assets;
- renderer count;
- shadow-casting status/cost notes for Station, Seats, Orb, and Atlas;
- comparison of Office Day and N1R Night if their costs differ materially.

This is a **baseline measurement**, not a pretext to optimize immediately.

If the promoted production scenes are stable at the project's target performance with reasonable frame-time headroom, the current meshes remain accepted indefinitely and Gate 3 closes without a reduction pass.

If a genuine bottleneck is observed, report the evidence and likely source before changing geometry.

## 10. Promotion / checkpoint requirements

For this promotion:

1. back up / record pre-promotion Office and N1R hashes;
2. apply only the already Human-Visual-PASS candidate state;
3. preserve Atlas source/prefab hashes and stage behavior;
4. preserve all user source FBX hashes;
5. run Compile;
6. run PlayMode tests;
7. verify Console blocking errors = 0;
8. capture canonical Office Day and N1R Night evidence after promotion;
9. capture the performance baseline described above;
10. record new authoritative Office/N1R hashes;
11. create a checkpoint commit only after the promoted state validates cleanly;
12. record the commit and promoted hashes in project-memory.

No new Human Visual redesign is required unless the promotion itself produces visible drift from the already accepted candidate.

## 11. Gate 3 close condition

Gate 3 may close when all of the following are true:

- the Human Visual PASS state is promoted to authoritative Office and N1R;
- Compile and PlayMode remain PASS;
- Console blocking errors remain 0;
- source FBX and Atlas protected hashes remain unchanged;
- canonical screenshots show no visual drift;
- production performance baseline shows no blocking runtime issue;
- checkpoint commit is created and recorded.

Mesh reduction is **not** a Gate 3 close condition.

## 12. After Gate 3 closes

The next product-facing development direction is the **Retrieval runtime foundation**, starting with physical device behavior rather than loot/content complexity:

- Station mechanical yaw/elevation/guide behavior as required by the existing design;
- reel pay-out / retrieval behavior;
- runtime flexible tether between Station and Orb;
- Orb deploy / hold / retrieve;
- downward / horizontal / diagonal / upward support;
- controlled sag/tension feedback;
- no attraction/content table/economy initially.

Returning Piece behavior and actual recovered-content logic come after the basic Retrieval device can physically send and recover the Orb reliably.

## 13. Interaction constraint

Do not generate or edit images unless the user's current message explicitly contains the exact phrase `生成图片`.