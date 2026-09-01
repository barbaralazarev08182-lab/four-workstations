# VQ2 Retrieval Station — User Model Candidate

> Date: 2026-09-01  
> Status: CANDIDATE / NOT YET HUMAN VISUAL PASS  
> Scope: user-authored Hunyuan3D Retrieval Station candidate, component split, and integration constraints.

## 1. Candidate received

The user produced a Retrieval Station 3D candidate in Hunyuan 3D Studio based on the current Retrieval Edge direction.

Observed high-poly source scale from the 3D Studio screenshots:

- approximately 816k triangles / faces;
- approximately 408k vertices;
- component split enabled;
- 11 visible component groups (`Part 1` through `Part 11`) in the current split result.

The visual candidate preserves the intended asset family language:

- compact floor-mounted base;
- rear reel / winch mass;
- long steerable guide arm;
- forward circular cradle/recovery area;
- small forward tray;
- warm ivory main structure with champagne/brass and darker functional metal.

This is a user-authored visible asset candidate and therefore respects the locked asset-authoring boundary. Codex must not replace its geometry with a self-authored final model.

## 2. First visual/technical assessment

The candidate is directionally strong enough to continue toward Unity integration, but it is not yet formally approved.

Positive read:

- silhouette clearly reads as a repeated send/retrieve apparatus rather than generic furniture;
- guide arm gives strong outward directionality;
- reel/winch mass makes tether behavior physically legible;
- circular front cradle visually supports future orb docking/recovery behavior;
- overall material language remains compatible with the warm restrained Four Workstations world.

Open issues before promotion:

1. **Component split must be semantic, not arbitrary.**
   The 11-part split is useful only if moving/runtime-relevant groups can be addressed cleanly.
2. **Modelled thin line/tube elements should not become the final runtime tether.**
   The actual flexible tether remains a Unity/Codex runtime responsibility.
3. **High-poly source is too heavy to treat as the final runtime mesh without review.**
   Preserve the Hunyuan source as read-only/high-quality evidence first, then create a controlled reduced runtime candidate and compare visually.
4. **Scale and room footprint are not yet approved.**
   Final size must be judged in the canonical Office frozen camera.
5. **Pivot/origin placement must be authored or normalized around actual motion axes before animation/gameplay work.**

## 3. Recommended semantic component contract

The current 11 source parts do not need to remain 11 runtime parts.

Preferred runtime semantic groups are approximately:

- `Station_Base` — static main base/body;
- `Station_YawAssembly` — upper retrieval assembly if horizontal steering is supported;
- `Station_GuideArm` — arm that changes elevation / outward direction;
- `Station_ReelDrum` — reel/spool that can visibly rotate during pay-out/retrieval;
- `Station_GuideTip` — optional separate guide/roller only if independent motion or material control is needed;
- `Station_OrbCradle` — orb docking/recovery seat;
- `Station_RecoveryTray` — small forward tray if retained as a separate object;
- decorative shells/caps that do not animate should be merged with their nearest structural parent rather than kept as arbitrary tiny parts.

Do not preserve source fragmentation merely because the component splitter produced it.

## 4. Required anchors / sockets

Before Unity integration, normalize or create transforms for:

- `Tether_ReelExit` — physical line exit from the reel/body;
- `Tether_GuideTip` — final guide point at the arm tip;
- `Orb_TetherAttach` — belongs to the separate Retrieval Orb asset;
- `Orb_CradleSocket` — canonical resting/docking transform for the orb;
- optional `Recovery_TraySocket` if the tray is removable/semantic.

The runtime tether should be generated from these transforms, not imported as baked rope geometry.

## 5. Tether rule remains unchanged

The visible tether/rope is a runtime Unity system owned by Codex integration, not part of the user's final Hunyuan mesh.

Preferred implementation direction remains:

- procedural curve / LineRenderer-style presentation or equivalent custom rope curve;
- controlled sag near the stable room;
- tension response when contact/retrieval load increases;
- shortening/lengthening from actual allowed tether length during reel-out/retrieval;
- supports downward, horizontal, diagonal, and upward Retrieval;
- Outside-side behavior may gradually stop obeying ordinary gravity to communicate non-Euclidean / nonordinary correspondence.

Avoid a heavy chain-of-many-rigidbodies implementation unless later evidence proves it necessary.

## 6. Polygon strategy

Do not destructively optimize the Hunyuan source first.

Preserve:

`Read-only Hunyuan high-poly source -> controlled runtime reduction candidate -> fixed-camera comparison -> Human Visual approval`

The current ~816k-triangle source is substantially heavier than the already-approved 209,806-triangle Atlas production clean-source baseline while occupying a much smaller on-screen role.

Therefore a controlled reduction pass is expected before final runtime promotion, but **no arbitrary hard target is locked yet**.

A likely practical exploration range is approximately 60k–120k triangles, but the acceptable result must be determined by silhouette/material fidelity in the canonical Office camera rather than by hitting a number.

Use the Atlas Phase C lesson: reject reductions that visibly damage silhouettes or key mechanical forms even if they meet a budget.

## 7. Current status

`RETRIEVAL STATION MODEL CANDIDATE — USER-AUTHORED SOURCE RECEIVED / COMPONENT SPLIT AVAILABLE / HUMAN VISUAL PRODUCT PASS NOT YET DECLARED`

Next meaningful step after the user is satisfied with the source appearance:

1. export/preserve the original model;
2. inspect semantic part grouping and clean up arbitrary split groups;
3. remove/ignore baked line geometry from the runtime contract;
4. create pivots/sockets;
5. produce a controlled reduced candidate;
6. integrate into isolated Unity room candidate;
7. judge size, silhouette, and Rest/Atlas/Retrieval composition from the frozen canonical camera;
8. only then declare Human Visual PASS or iterate.
