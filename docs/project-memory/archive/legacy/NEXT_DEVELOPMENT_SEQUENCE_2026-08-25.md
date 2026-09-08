# Four Workstations — Next Development Sequence

> Date: 2026-08-25  
> Status: CURRENT USER-DIRECTED DEVELOPMENT SEQUENCE  
> Scope: development priority / sequencing only  
> Note: this document records the latest explicit project sequencing decision and should override older high-level sequencing where they conflict.

---

# 1. Immediate priority — finish and polish the current Office scene

Before returning to gameplay systems, the current Office scene should receive a focused visual polish pass.

Current intended work includes:

- replacing or improving materials on selected existing props / furniture;
- improving perceived material quality and surface response;
- refining overall scene texture / finish / tactile quality;
- making small positional adjustments where needed;
- preserving the already approved major composition, camera, geometry, lighting, and workstation relationships unless a new explicit Gate authorizes larger changes.

For simple object placement or repositioning, follow `docs/project-memory/UNITY_SPATIAL_INTERACTION_CONTRACTS.md`:

> Read geometry / transforms / colliders / anchors and calculate placement numerically. Do not use screenshot-only XYZ guessing.

Simple static prop placement should be treated as a fast deterministic machine task when source assets are already imported and normalized.

---

# 2. Character direction — move away from realistic human characters

After the Office polish pass, the next major focus is the player character.

Current user direction:

- do not assume the final character should remain a realistic or conventional human model;
- explore a stranger / more unusual creature-like character;
- the creature does not need to be fully humanoid;
- character design should intentionally reduce animation and contact complexity compared with the previously attempted human rigs;
- after selecting the character direction, refine its core movement and interaction animations before progressing to major gameplay systems.

Important production rule:

> “Non-human” is not automatically simpler.

The preferred design is a creature whose body plan deliberately reduces rigging/contact burden, for example:

- few major articulated joints;
- no realistic fingers required;
- no requirement for anatomically realistic human sitting;
- strong readable silhouette at the fixed Office camera;
- simple, stylized locomotion;
- interaction animations that can use clear anchors/sockets without demanding exact human anatomy.

Avoid choosing a creature that introduces even more animation complexity through many limbs, tails, wings, tentacles, or highly deformable anatomy unless that complexity is explicitly desired.

The objective is not merely visual novelty; it is to create a distinctive character whose animation system is more robust and cheaper to author/retarget than the previous humanoid path.

---

# 3. Character interaction refinement

Once the character model / rig direction is selected:

- establish the core animation set;
- validate locomotion;
- validate idle/rest behavior;
- validate interaction with Office anchors;
- tune visible contact with furniture and props;
- use Anchor / Socket / IK only where actually required;
- avoid returning to repeated screenshot-based manual XYZ offset tuning.

The previous humanoid seating failure remains a warning: target coordinates alone do not guarantee believable body contact. The new character design should reduce the number of body-contact constraints that need to be solved.

---

# 4. Economy and upgrade systems

After the Office and character foundation are sufficiently stable, move into the product systems layer.

Current intended order includes:

- economy system;
- player / room upgrade system;
- progression rewards;
- integration of existing current VQ2 resource concepts as appropriate.

Existing current economy direction remains:

- XP = player growth / progression, not spent;
- Coins = primary spend currency;
- Build Charge = shared project contribution resource.

Older Work Ticket / Public Fund concepts remain historical unless explicitly revived.

Exact balances, sinks, sources, upgrade prices, and progression pacing are not frozen by this sequencing document.

---

# 5. Atlas construction system

After the economy / upgrade foundation is established, develop the Atlas construction system as a real gameplay/progression system.

Current long-term Atlas direction already recorded elsewhere includes:

- central shared construction object;
- one-player-compatible progression;
- multiple players can contribute;
- visible physical evolution through stages;
- the object becomes progressively more refined rather than changing only through numbers/UI;
- after sufficient construction, it eventually unlocks access to another real room/world.

The exact Atlas phase count and final visual design remain separate design work.

---

# 6. Networking / shared-room systems

After the single-room gameplay and Atlas progression foundation are viable, proceed into networking / room-link systems.

This includes two distinct multiplayer layers that should not be conflated:

## 6.1 Current room multiplayer / shared state

Support the Four Workstations room as a 1–4 player shared persistent space.

Core rule remains:

> One active player must still have a complete experience. More players add parallelism, social presence, and acceleration; they must not gate basic progression.

## 6.2 Cross-room world-link system

The longer-term world-link direction is recorded in:

`docs/project-memory/VQ2_WORLD_LINK_AND_ROOM_EXPANSION_CONCEPT_2026-08-25.md`

Current strongest rules include:

- rooms belong to a global Ouroboros-like closed chain;
- linked neighboring rooms belong to strangers, not friends;
- stranger adjacency is initially assigned, then remains fixed/persistent;
- the Atlas must first be built to a sufficient stage before another world becomes visible;
- the first cross-room capability is observation only;
- the observed room knows it is being observed, but does not know the observer identity;
- later progression may allow one room to influence another;
- cross-world influence must carry a meaningful cost;
- the exact form of influence remains open.

---

# 7. Miniature other-world presentation

A major milestone after the networking/world-link foundation is to represent the linked stranger room as a miniature world visible through / on the Atlas.

The intended experience is not a conventional friend panel or statistics card.

It should eventually communicate another persistent real room through spatial/visual state.

Open future work includes:

- deciding which room state must synchronize;
- deciding how live the miniature representation should be;
- deciding how character activity is abstracted in the miniature;
- deciding how Office upgrades / expansions remain readable at miniature scale;
- designing the observation notification for the target room;
- validating performance and networking cost.

Do not prematurely implement full realtime coordinate streaming merely because the miniature world must feel alive. State-based representation remains a valid and likely preferable approach.

---

# 8. Current high-level sequence

The current user-directed order is:

1. **Office visual/material polish + small positional refinements**
2. **Final character direction**, likely a stylized unusual non-human creature
3. **Character animation / interaction refinement**
4. **Economy system**
5. **Upgrade / progression system**
6. **Atlas construction gameplay**
7. **Networking / persistent shared-room systems**
8. **Ouroboros stranger-room linkage**
9. **Miniature observation of the linked stranger world**
10. **Later paid/costly cross-world influence**, after observation is proven

This is the current project planning spine.

It supersedes older sequences that placed locomotion, Supabase presence, or Atlas proof work ahead of the newly requested Office polish and character redesign.

---

# 9. Execution principle

Do not work on all stages in parallel.

Use one Gate at a time.

Each Gate should:

- reuse existing assets/scripts/contracts first;
- define explicit acceptance criteria;
- avoid modifying frozen systems without authorization;
- produce machine-verifiable evidence where possible;
- require Human Visual PASS for visual work;
- update project memory when a major direction or failure becomes stable knowledge.

No commit/push of candidate implementation work should be assumed from this sequencing document alone; explicit execution authorization is still required for implementation Gates.
