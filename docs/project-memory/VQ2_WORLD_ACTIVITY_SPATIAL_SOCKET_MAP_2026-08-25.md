# VQ2 World Activity & Spatial Socket Map

> Date: 2026-08-25  
> Status: DESIGN MAP / PROPOSED — GUIDES OFFICE POLISH, NOT IMPLEMENTATION AUTHORIZATION  
> Scope: Office spatial reservation, future activities, sockets/anchors, upgrade footprints, scene-polish guardrails  
> Purpose: ensure the Office is polished around future gameplay instead of being visually filled first and redesigned later

---

# 0. Why this map exists

The Office must not be treated as a finished realistic workplace that later receives gameplay objects wherever space happens to remain.

The current direction is the opposite:

> The Office is a small strange world-node whose empty space is part of the future gameplay architecture.

Before final material polish and decorative filling, the project needs to know:

- where characters may perform future actions;
- which floor/wall/edge areas must remain available;
- which surfaces need reusable semantic sockets;
- where larger facilities may eventually grow;
- which current props may be removed or replaced;
- which areas are safe for permanent visual decoration;
- which areas should remain deliberately under-filled.

This document is a **semantic spatial map**. It does not authorize Unity implementation and does not freeze exact Unity world coordinates.

---

# 1. Source-of-truth warning: semantic layout now, Unity coordinates later

The historical committed OfficeWorld coordinate contract is useful for understanding the room topology:

- four workstations around the central area;
- two walls;
- two open room sides;
- central circulation spine;
- fixed camera-oriented composition.

However, the current Unity project has migration history and a later world-orientation correction. Therefore this document must **not copy historical Web coordinates and declare them current Unity coordinates**.

Permanent rule:

> When an actual Unity task begins, the Agent must query the live Unity scene for transforms, renderer/collider bounds, surfaces, and authored anchors, then record the current world-space values.

This follows `UNITY_SPATIAL_INTERACTION_CONTRACTS.md`:

`Inspect scene -> identify semantic target -> query actual geometry -> calculate placement -> validate -> Human Visual review`

Do not use screenshot guessing or old coordinate transcription as the placement method.

---

# 2. Spatial philosophy

## 2.1 Empty space can be gameplay space

During Office Final Polish, an area must not be filled merely because it visually appears empty.

An empty area may be reserved for:

- a future character behavior;
- a future facility;
- a construction animation;
- a temporary world event;
- a room-state transformation;
- future spatial expansion;
- Atlas growth/operation clearance;
- an interaction camera/readability requirement.

## 2.2 The room should become less realistic over time

The starting image can still read as an office/workshop, but long-term upgrades may make it increasingly strange.

Therefore polish should avoid making every zone so conventionally complete that later impossible systems feel pasted on.

## 2.3 Major structures need action clearance, not only mesh clearance

A future facility footprint is larger than its mesh.

For every major gameplay structure, reserve:

- physical mesh footprint;
- character approach point;
- character operating position;
- animation clearance;
- readable silhouette in fixed camera;
- particles/VFX clearance when relevant;
- route clearance around it.

---

# 3. High-level Office activity map

Conceptual zoning only:

```text
                 [ WALL SYSTEM ZONE ]
        information / research / anomalies / archive

     [ PERSONAL ]      [ ATLAS ]       [ PERSONAL ]
     workstation        CORE           workstation

     [ PERSONAL ]    circulation       [ PERSONAL ]
     workstation       spine           workstation


  [ OPEN EDGE A ]                    [ OPEN EDGE B ]
   REST / WATCH                        SALVAGE
   cliff sitting                   retrieval / rig

             [ FUTURE OUTER EXPANSION INTERFACES ]
```

This diagram is not a literal camera orientation map. It records functional relationships only.

---

# 4. Zone A — Central Atlas Core

## Current role

Central visual/circulation area between the four workstations.

## Long-term role

Primary shared construction system and later room-link device.

Expected progression:

`empty / parts`
-> `foundation`
-> `assembled structure`
-> `active structure`
-> `stranger-world observation`
-> `later costly cross-world influence`

## Behaviors that may occur here

- inspect Atlas;
- contribute Build Charge;
- carry/attach a component;
- calibrate a module;
- repair instability;
- observe the miniature linked room;
- respond to Atlas signal/event;
- later prepare a cross-world influence action.

## Required future semantic anchors

Suggested contract names:

- `AtlasRoot`
- `AtlasInteractionAnchor`
- `AtlasObserveAnchor`
- `AtlasRepairAnchor`
- `AtlasModuleSocket_01..04`
- `AtlasVFXOrigin`
- `AtlasMiniatureWorldOrigin`
- `AtlasClearanceVolume`

Exact names may change, but the semantics must exist.

## Permanent polish guardrail

Do not fill the Atlas reservation zone with permanent decorative clutter merely because the center looks empty.

Allowed before Atlas implementation:

- temporary/lightweight visual placeholders if explicitly removable;
- floor treatment that remains compatible with later Atlas footprint;
- subtle material polish.

Avoid:

- large rugs with irreplaceable composition dependence;
- fixed furniture occupying the central construction footprint;
- permanent prop clusters that would need to be removed later;
- route changes made only to support temporary decoration.

---

# 5. Zone B — Four Personal Workstations

## Current role

Four individual desk/workstation identities.

## Long-term role

Not just “computer desks.” Each workstation becomes a personal activity/identity surface that can host different world behaviors.

Possible future uses:

- real Focus representation;
- drawing plans;
- object inspection;
- sorting salvage;
- small research task;
- personal cultivation object;
- personal collection/display;
- small machine calibration;
- cosmetic identity.

## Workstation should support multiple semantic surfaces

Each workstation should eventually expose a standard contract such as:

- `DeskRoot`
- `DeskTopSurface`
- `DeskApproachAnchor`
- `DeskWorkAnchor`
- `DeskCharacterFacing`
- `MugSocket`
- `PersonalObjectSocket_A`
- `PersonalObjectSocket_B`
- `ResearchObjectSocket`
- `MemoryDisplaySocket`
- `SmallDeviceSocket`

Do not assume all sockets need to be visibly occupied at once.

## Important change from older “desk shop” thinking

The desk is **not primarily a furniture catalogue display**.

A player should not eventually cover every square centimeter with purchased decoration.

At least part of every desk should remain usable as an activity surface.

Recommended conceptual split:

- `Identity/Display area`
- `Active work/research area`
- `Character interaction clearance`

## Office Final Polish guardrail

Before adding any permanent desk prop, classify it:

1. structural/base furniture;
2. fixed world prop;
3. future player-owned slot content;
4. temporary decorative filler.

If category 4 conflicts with future slots, remove it rather than designing around it.

---

# 6. Zone C — Open Edge A: Rest / Watch / Social Presence

## Current spatial opportunity

One of the two wall-less floor edges can become usable instead of being treated as unfinished architecture.

The sofa is no longer considered a necessary long-term rest solution.

## Long-term role

A calm behavioral space where strange characters can physically inhabit the world boundary.

Possible actions:

- sit with legs/body hanging over the edge;
- sit in pairs/groups;
- lie near the edge;
- watch the unknown outside;
- snack/drink;
- idle/rest/recover;
- observe a distant world event;
- react when something passes outside the room.

## Required future semantic anchors

- `EdgeRestZoneRoot`
- `EdgeSeatAnchor_01..N`
- `EdgeSeatFacing_01..N`
- `EdgeLieAnchor` (optional)
- `EdgeLookTarget`
- `EdgeSafeApproachAnchor`
- `EdgeCharacterClearanceVolume`

For non-humanoid creatures, these anchors should describe **contact and facing**, not assume a human pelvis/leg solution.

## Interaction requirement

This zone must remain readable and physically open enough for body silhouettes.

Do not place:

- tall cabinets;
- large plants;
- dense floor decoration;
- railings that contradict the intended exposed-edge experience;
- large static objects that remove sitting silhouettes.

Small removable props may exist only if they do not compromise the future behavior zone.

---

# 7. Zone D — Open Edge B: Retrieval / Salvage Interface

## Long-term role

The second open edge is reserved for the action pattern currently described as “fishing-like,” but it is **not locked as conventional fishing**.

Core action:

`reach/drop/cast outward or downward`
-> `contact unknown external space`
-> `retrieve something`

Possible future equipment forms:

- line;
- hook;
- winch;
- magnetic tool;
- crane arm;
- probe;
- net;
- unknown/custom device.

## Behavior progression possibility

`manual/basic retrieval`
-> `deeper retrieval`
-> `specialized retrieval`
-> `risky/overloaded retrieval`
-> `signal-targeted retrieval`

This is an example of upgrades unlocking new verbs/ranges rather than only increasing yield percentages.

## Required future semantic anchors

- `SalvageZoneRoot`
- `SalvageCharacterAnchor`
- `SalvageFacing`
- `SalvageDropOrigin`
- `SalvageLineClearance`
- `SalvageRigSocket`
- `SalvageRetrievedObjectSpawn`
- `SalvageDebrisVFXOrigin`
- `SalvageFailureImpactZone`

## Polish guardrail

This edge should remain capable of receiving a future medium-sized mechanical structure.

Do not permanently occupy it with:

- a couch;
- a large display shelf;
- dense decorative furniture;
- fixed plants/props that would visually fight the salvage rig;
- geometry that blocks a clear vertical/outward line.

---

# 8. Zone E — Wall System / Information / Research Surface

## Current opportunity

The room has two walls, making vertical surface space unusually valuable.

## Long-term role

At least one wall area should support a physical information/research system rather than relying only on conventional UI.

Possible evolution:

`simple board`
-> `task/situation board`
-> `research archive`
-> `anomaly record`
-> `Atlas/link information`

Possible content:

- current room situations;
- projects;
- research discoveries;
- recovered-object records;
- unusual signals;
- memories/traces;
- limited social/world-link information.

## Required future anchors

- `WallBoardRoot`
- `WallBoardInteractionAnchor`
- `WallBoardLookTarget`
- `WallResearchDisplaySocket_A..N`
- `WallEventVFXOrigin`

## Important anomaly reservation

Do not assume every wall area remains permanently intact.

A selected wall subsection may later support:

- cracks;
- temporary openings;
- strange growth;
- residue;
- a repair state;
- an event state.

Therefore avoid designing the entire wall as an irreplaceable continuous decorative mural.

The exact “anomaly-capable wall panel” is still OPEN and should be selected only after reviewing the actual Unity composition.

---

# 9. Zone F — Research / Processing Reserve

## Why this zone is needed

The world-driven economy requires a place where recovered things can become understood/processed instead of automatically becoming Coins.

A future player may need to:

- inspect an unknown item;
- scan it;
- separate it;
- combine it;
- stabilize it;
- process raw salvage into usable components;
- prepare an experiment.

## Current decision

A dedicated final facility is **not yet selected**.

However, Office polish must preserve the possibility of one medium/small processing station.

Possible forms:

- tabletop instrument;
- small wall-mounted workstation;
- compact freestanding device;
- future external-platform facility.

## Reservation rule

Do not commit every remaining interior corner to decorative furniture.

At least one plausible equipment location must remain available until the first research/processing gameplay is designed.

Suggested future anchors once location is selected:

- `ResearchStationRoot`
- `ResearchCharacterAnchor`
- `ResearchInputSocket`
- `ResearchOutputSocket`
- `ResearchVFXOrigin`

---

# 10. Zone G — Cultivation / Growth Reserve

## Important principle

Growth gameplay does not mean “office plants only.”

Possible growth objects:

- normal plant;
- strange seed;
- fungus;
- crystal;
- organism;
- hybrid machine/plant;
- transforming artifact.

## Spatial policy

Small personal growth can live on desks.

Larger or stranger cultivation should eventually have a separate location or future platform.

Therefore do not make the four desks the only possible place where growth gameplay can exist.

Possible future anchors:

- `CultivationRoot`
- `GrowthSlot_01..N`
- `GrowthInteractionAnchor`
- `GrowthVFXOrigin`

Dedicated cultivation location remains OPEN.

---

# 11. Zone H — Outer Boundary / Expansion Interfaces

## Long-term role

The room may eventually grow outward rather than moving immediately to a new map.

Potential additions:

- small side platform;
- salvage extension;
- cultivation platform;
- workshop module;
- observation deck;
- strange structural growth;
- specialized facility.

## Current rule

Expansion topology is not frozen.

But Office polish should not visually imply that every outer boundary is permanently sealed/final.

## Future anchor concept

Once actual attachment points are selected, define explicit transforms such as:

- `ExpansionSocket_A`
- `ExpansionSocket_B`
- `ExpansionSocket_C`

Each socket should later define:

- attachment frame;
- max footprint envelope;
- route connection;
- camera readability envelope;
- construction/VFX clearance.

Do not create these coordinates from screenshots. Extract them in Unity after expansion directions are selected.

---

# 12. Zone I — Circulation / Route Spine

## Role

The room needs to support characters moving between:

- personal workstation;
- Atlas;
- open edge rest;
- salvage edge;
- wall board;
- future research station;
- future expansion structures.

## Permanent rule

Circulation space is gameplay space.

Do not treat open floor paths as unused decoration opportunity.

Major future facilities must expose:

- `ApproachAnchor`;
- occupancy/interaction clearance;
- route-safe perimeter.

Any Office Polish repositioning should be checked against current/future route envelopes.

No new exact route graph is frozen by this document.

---

# 13. Zone J — Event / Temporary Occupancy Space

The world-driven task system needs temporary events that visibly occupy the room.

Examples:

- fallen debris;
- floating objects;
- cracked wall particles;
- escaped organism;
- strange residue;
- temporary device;
- recovered oversized object;
- repair scaffold;
- Atlas instability effect.

Therefore the scene needs some visual “breathing room.”

Permanent clutter reduces the ability to stage temporary events.

Rule:

> Final Polish should preserve at least a few low-clutter regions where temporary event props/VFX can appear without colliding with permanent decoration.

Exact event spawn sockets remain OPEN until Unity geometry is inspected.

---

# 14. Personalization policy — slots, not total free placement

The project should continue avoiding unrestricted free placement as the default system.

Reasons:

- fixed camera composition;
- route safety;
- fast deterministic Agent placement;
- easier networking;
- fewer collision problems;
- better art direction control;
- stable room readability.

However, “fixed slots” should not mean boring identical desks.

A slot can support categories/variants and stateful objects.

Example:

`PersonalObjectSocket_A`

could hold:

- toy;
- specimen jar;
- recovered relic;
- growing organism;
- strange lamp;
- trophy;
- small machine.

Thus the slot is a technical constraint, not a thematic constraint.

---

# 15. Socket hierarchy standard for future assets

Reusable interactive assets should be authored so Agents can place them deterministically.

Recommended semantics:

## World/furniture side

- `Root`
- `InteractionAnchor`
- `Facing`
- `TopSurface`
- `AttachSocket`
- `ApproachAnchor`
- `VFXOrigin`
- `ClearanceVolume`

## Prop side

- `Root`
- `GroundContact` / `BottomContact`
- `GrabSocket`
- `EffectOrigin`

## Character side

Exact creature rig is OPEN, but semantic contacts should eventually exist, for example:

- `CharacterRoot`
- `BodyContact`
- `LeftFootContact` / locomotion contacts when applicable;
- `RightFootContact`;
- `LeftGrabContact`;
- `RightGrabContact`;
- `LookOrigin`;
- action-specific contacts only where needed.

Do not force human pelvis/hand/finger assumptions onto the new creature design.

---

# 16. Office Final Polish classification system

Before any prop/material/layout change, classify the target area:

### GREEN — Safe to finalize visually

Examples:

- structural surfaces unlikely to become interactive;
- base materials;
- permanent desk/chair geometry once interaction compatibility is confirmed;
- selected non-gameplay architectural detail.

Can receive high-confidence final polish.

### YELLOW — Polish, but preserve flexibility

Examples:

- workstation tops;
- selected wall sections;
- corners that may later hold small devices;
- non-core floor decoration.

Polish is allowed, but do not build composition around permanent clutter.

### RED — Gameplay reservation

Examples:

- Atlas zone;
- edge-rest zone;
- salvage edge;
- future expansion interfaces;
- future anomaly wall panel;
- route spine;
- future research/processing reservation.

Do not permanently fill or spatially close these areas during Final Polish.

---

# 17. Immediate consequences for upcoming Office polish

When Office Final Polish begins, the Agent should first perform a **Spatial Reservation Audit** before moving or adding assets.

Required output:

1. current Unity screenshot from frozen camera;
2. live Unity world transforms/bounds for major furniture;
3. identify the two open edges in current Unity coordinates;
4. identify Atlas reservation envelope;
5. mark current sofa and evaluate removal/replacement compatibility;
6. identify at least one wall-board candidate area;
7. identify at least one research/processing reserve candidate;
8. identify potential outer expansion interfaces;
9. identify major circulation paths;
10. mark Green / Yellow / Red polish zones.

Only after this audit should fine placement/material work begin.

---

# 18. What is currently decided vs still open

## Strong current direction

- Center is reserved for Atlas progression.
- One exposed edge should support rest / cliff sitting.
- The other exposed edge should support future retrieval/salvage interaction.
- At least one wall area should support physical task/research/information functions.
- Room boundaries may later support outward expansion.
- Workstations are personal activity surfaces, not only computer desks or decor shelves.
- The scene must reserve event/temporary occupancy space.
- Simple prop placement should use geometry/sockets rather than screenshot guessing.
- Future major facilities require approach and action clearance, not only mesh space.

## Open

- Exact Unity coordinates of every reservation.
- Which physical open edge becomes Rest vs Salvage.
- Exact research station form/location.
- Exact cultivation facility form/location.
- Exact wall anomaly panel.
- Expansion topology and number of expansion sockets.
- Final number of desk sockets.
- Final creature contact/rig semantics.
- Exact room-event spawn locations.

---

# 19. Relationship to economy/progression design

This spatial map exists because progression is expected to unlock **new verbs and world capabilities**.

Therefore the room must be physically capable of showing progression such as:

- a machine appearing;
- a platform being built;
- an edge becoming usable;
- an unknown thing being processed;
- an organism growing;
- a wall changing state;
- Atlas revealing another real room;
- later cross-world influence preparation.

If the Office is visually finalized without these reservations, economy/progression will later be forced into menus.

That outcome is explicitly undesirable.

The desired principle is:

> Progression should become visible in the room before it becomes visible in a menu.

---

# 20. Implementation guardrail

This document is a planning map only.

It does not authorize:

- moving current production furniture;
- deleting the sofa immediately;
- creating Atlas assets;
- creating the salvage rig;
- adding new character routes;
- adding sockets to production prefabs;
- changing the frozen camera;
- changing lighting;
- implementing economy/networking;
- changing Unity scenes.

When implementation resumes, each area must be promoted through an explicit Gate.

The first recommended use of this document is not gameplay implementation. It is to prevent the upcoming Office Final Polish from occupying future gameplay space.