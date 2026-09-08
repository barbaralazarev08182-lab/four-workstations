# VQ2 V3 Layout Temporary Freeze + Atlas Boundary / Outside V1 Authorization — 2026-09-04

> Status: USER AUTHORIZED NEXT STAGE / V3 LAYOUT TEMPORARILY FROZEN FOR NOW
>
> Scope: Open20m candidate after Interior Architecture V3 massing.

## 1. Current interior state

The current Interior Architecture V3 massing has reached a provisional acceptable direction. The user explicitly said it is starting to feel right and to leave it as-is for now.

This is NOT a final Human PASS on all furniture/architecture details. It is a temporary freeze so production can move to the Atlas refuge boundary and Outside visual-space stage.

Do not continue adding or redesigning V3 residential architecture during this stage unless a hard conflict is discovered.

## 2. Next-stage authorization

Proceed with a candidate-only V1 implementation of:

- the normally invisible spherical Atlas refuge boundary / "air wall";
- the Outside universe visual layer beyond the room;
- minimal hooks for future boundary reveal/ripple events.

The Atlas sphere is the true refuge boundary. The room walls are not the true habitable boundary.

## 3. Atlas sphere direction

- Sphere center must follow the Atlas anchor, not an arbitrary room object.
- The sphere must be substantially larger than the 20x20 room.
- Use radius ~30m as the first candidate test value only. This is NOT a final locked radius.
- The sphere is normally invisible.
- Do not render a permanent glowing bubble, fog dome, force-field shell, or always-visible sci-fi sphere.
- Boundary visibility should appear only through events such as contact, Retrieval crossing, disturbance, later sun interaction, or explicit QA preview.
- Keep boundary logic separate from visual reveal logic.
- Player/physics containment should use robust radial-boundary logic rather than relying on a visible sphere mesh.

## 4. Outside visual architecture

Do NOT solve Outside with one physical 100m black sphere.

Use layered space:

1. Far visual background: infinite skybox / procedural sky.
2. Near 3D Outside: sparse real 3D matter / particles / debris where parallax matters.
3. Mid/far event layer: later fleet/war/special-event staging at much greater apparent distance.

V1 should focus on the far visual background plus very restrained near 3D parallax support.

## 5. Outside art direction

- near-black deep space, not pure flat black;
- restrained dark blue / teal / warm-black variation;
- sparse stars;
- subtle large-scale structure only;
- no giant wallpaper nebula;
- no dense colorful galaxy field;
- no cyberpunk RGB space;
- no always-moving star tunnel;
- far background should have no parallax;
- any near particulate/debris may have subtle parallax and must not read as nearby fake stars.

The room must remain the visual home anchor. Outside should feel immense, quiet, and difficult to read.

## 6. Lighting isolation

This stage should not redesign room lighting.

- Keep existing Directional Light and current interior lighting setup unchanged.
- If the new skybox would alter ambient/reflection response, preserve the current room lighting behavior rather than allowing the background to accidentally relight the room.
- Small Atlas sun / synchronized Directional Light work remains a later substage.

## 7. Boundary reveal direction

V1 should provide an event-ready reveal path:

- normally invisible;
- localized ripple / refractive response at a point on the spherical surface;
- no permanent outline;
- no global RGB shield mode;
- future Retrieval crossing can create a stronger localized opening/reveal;
- future disturbances can propagate visible ripples across parts of the boundary.

Exact final shader, pulse speed, distortion amount, and color remain open.

## 8. Candidate-only safety

- Candidate scene only.
- No production promotion.
- No final art claim.
- No final radius lock.
- No final sun implementation in this pass.
- No commit/push of Unity implementation unless separately authorized.

## 9. Human review target

The first review should answer:

1. Does the normally invisible sphere concept read correctly when debug-revealed?
2. Does the Outside finally feel like deep space rather than a flat black void?
3. Does the background remain visually quiet enough that the home/interior remains primary?
4. Is the sphere large enough to feel larger than the house without becoming meaningless?
5. Is the outside layering suitable for later Retrieval, distant events, and the Atlas sun?
