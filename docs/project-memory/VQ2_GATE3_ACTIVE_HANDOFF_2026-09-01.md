# VQ2 Gate 3 — Active Handoff / Current Decisions

> Date: 2026-09-01  
> Status: ACTIVE / CURRENT PLANNING HANDOFF  
> Scope: current Gate 3 world/room state, Atlas baseline, Rest Edge, Retrieval Edge, first world-content direction, asset-authoring responsibilities, and next-step continuity  
> Important: this document records decisions and local Unity results newer than remote `main`. It is intentionally explicit about which implementation evidence is local-only.

---

# 0. Why this handoff exists

The project has advanced materially beyond the original 2026-08-31 Gate 3 planning document.

The most important continuity rule is:

> New decisions must not remain only in chat. Stable decisions, Human Visual PASS results, rejected approaches, authoritative baselines, and current next steps must be written into project Markdown as they are established.

This file therefore captures the current operational state as of 2026-09-01.

When this document conflicts with older VQ2 planning documents, use the following priority order:

1. latest explicit user decision / Human Visual result;
2. latest local implementation evidence and checkpoint/promotion result recorded here;
3. this active handoff;
4. older VQ2 project-memory documents;
5. older VQ1C/Web/freeze documents.

Do not allow an older conceptual Gate description to reopen a later Human Visual PASS.

---

# 1. Repository state / remote-main caveat

Remote GitHub `main` is behind the current local Unity work.

As verified on 2026-09-01, the latest Atlas Office promotion commit reported by the local workflow:

`fd068e78b6cfc10a028dd629df9dcbac2ed33e1e`

is **not currently resolvable on remote GitHub main**.

Therefore:

- treat the Atlas/local Unity commit hashes below as local authoritative implementation evidence;
- do not assume remote `main` contains the corresponding Unity files yet;
- do not rewrite local implementation history from the older remote state;
- when the local branch is intentionally pushed/merged, reconcile this handoff with the actual Git history.

This document is a project-memory bridge, not proof that the local Unity binaries/scenes are already on remote main.

---

# 2. Asset-authoring boundary — locked process rule

Formal final 3D asset production follows this division of responsibility:

1. user + ChatGPT define concept, visual language, proportions, and engineering envelope;
2. visual references / multi-view references are produced;
3. **user authors/generates the real 3D model**, commonly through Hunyuan3D and subsequent manual work;
4. Codex preserves the source, normalizes it, creates sockets/anchors/material integration as authorized, integrates into Unity, and performs QA;
5. Codex must **not invent replacement final geometry** for user-owned hero/world assets.

Greybox geometry remains acceptable only for measurements, clearance tests, spatial reservation, and technical validation.

Permanent reminder:

> User models the visible asset. Codex integrates and validates it.

This rule applies to Atlas, Rest Edge furniture, Retrieval apparatus, and future hero/world assets unless the user explicitly changes the rule.

---

# 3. Atlas — current authoritative local baseline

Atlas is no longer at the old Gate 3 Stage-0/1/2 conceptual state.

Later work superseded that early description.

## 3.1 Physical source and reduction

Hunyuan original source SHA:

`3FD39F2DBD696C38A94D7960A3F5C2A380B6527D4D82C45462EFD6ACA5F0A5D9`

Original high-poly mother:

- 641,914 triangles
- 404,427 vertices

The protected Hunyuan source must remain unchanged.

Phase C controlled reduction:

- 173,096-triangle candidate: Human Visual rejected because base / Optical silhouette visibly thickened;
- 209,806-triangle candidate: Human Visual PASS;
- 209,806 triangles is the production-safe clean-source baseline;
- do not reduce it further merely to satisfy an older triangle target.

## 3.2 Phase B2 optical/material-domain architecture

Phase B2 abandoned the failed face-selection separation approach.

Accepted architecture:

- original body PBR is preserved;
- Optical is a separate effect domain;
- dedicated 2048x2048 multi-channel UV emission mask;
- renderer-domain gating.

Emission channel intent:

- R = Arc Light / narrow inner-arc embedded seams;
- G = Upper top emitter / bridge slots / ring;
- B = Lower Core / central emitter / small base indicator;
- A = Special Response.

This architecture should be reused later for controlled breathing/emission polish rather than replaced by a new neon/glow system.

## 3.3 Physical Stage 0–4 architecture

Phase D Strategy A received Human Visual PASS.

It uses existing object boundaries only:

- 0 new physical cuts;
- 0 new visible seams created for staging.

Physical stages:

- Stage 0 — Base / lower core only; incomplete low foundation;
- Stage 1 — adds asymmetric Rear Installation Spine;
- Stage 2 — adds Upper Calibration Support / open skeletal frame;
- Stage 3 — adds Major Arc Shell / chassis; physical structure becomes substantially complete;
- Stage 4 — complete chassis with Optical domain enabled; qualitative transition from dormant complete machine to active spatial instrument.

Uneven triangle increments between stages are intentional and must not be normalized.

## 3.4 Stage Assembly result

Approved assembly candidate:

- one GLB asset family;
- one `AtlasRoot` prefab;
- 9 renderers;
- 9 unique Mesh references;
- 1 shared material;
- 209,806 triangles;
- estimated unique mesh memory 10,319,688 bytes;
- duplicate mesh memory 0;
- no stage-specific model copies.

Validation included:

- Unity compile PASS;
- repeated Stage 0→4→0 cycling PASS;
- no root/child transform drift;
- no scale drift;
- no mesh/material mutation;
- no orphan/duplicate renderers;
- Stage 0 returned pixel-identical after repeated cycling;
- Stage 4 matched the accepted complete Phase C Unity import;
- Optical is independently controllable and Stage-4-only.

Stage Assembly Human Visual / Product PASS.

Local checkpoint reported:

`8720d5ace5bf27984163503c3a6132c8c590f639`

`feat(vq2): approve Atlas stage assembly candidate`

## 3.5 Office integration — locked transform

An initial 1.0x Office integration was visually too small.

After visual iteration, the user explicitly approved:

- position `(0, 0.02, 0)`;
- Y rotation `180°`;
- uniform scale `2.5x`;
- preserve the canonical Office camera/view;
- preserve the rotated orientation because the original front arc/support blocked visual access to the center.

Do not restart scale/orientation comparison unless new evidence requires it.

Office integration Human Visual / Product PASS.

Local candidate checkpoint reported:

`0399f1a33f44168f0cbdac166e89c6816b44f0bd`

`feat(vq2): approve Atlas office integration candidate`

Local promotion commit reported:

`fd068e78b6cfc10a028dd629df9dcbac2ed33e1e`

`feat(vq2): promote approved Atlas office baseline`

Promotion evidence reported locally:

- Day scene byte-identical to accepted 2.5x candidate;
- Day SHA-256 `979282E2797894E1D95C2EA21FF59962847D064351C77857A7C9AAB89D135AB4`;
- N1R byte-identical to accepted Night candidate;
- N1R SHA-256 `636D224F494A719D3807B9CC142872345A87394D6693618C3B3C1D5EC348F9F3`;
- Unity compile PASS;
- PlayMode 4/4 PASS;
- blocking Console errors 0;
- Hunyuan and Phase C source hashes unchanged.

Treat this Atlas Office baseline as protected.

## 3.6 Atlas polish is deferred

Do **not** modify Atlas material/motion/VFX during the current room-identity work.

Future dedicated gate may be named:

`ATLAS MATERIAL + MOTION + FX POLISH`

Reserved directions include:

- warm marble/mineral-composite ivory body;
- champagne/brushed-metal arcs;
- dark restrained gunmetal structures;
- refined ceramic/stone/metal core;
- frosted Optical;
- two restrained warm-white / soft-champagne breathing light bands using the existing B2 mask architecture;
- subtle mechanical/calibration micro-motion;
- restrained refraction/spatial distortion, calibration sweep, and sparse motes.

Avoid cyberpunk/neon spectacle.

---

# 4. Current Gate 3 sequence

After Atlas Office promotion, current intended sequence is:

1. Rest Edge;
2. Retrieval Edge;
3. first world-content set;
4. room identity cleanup / composition review;
5. frozen-camera full-room Human Visual Gate;
6. only after that, begin semantic interaction/gameplay foundation.

No gameplay system should be started merely because an edge concept exists.

---

# 5. Room cleanup / Rest Edge technical state

A previous Codex Rest Edge candidate incorrectly authored visible Rest Edge geometry.

That was rejected as a process violation because the visible model belongs to the user-authored asset pipeline.

Corrected state:

- all Codex-authored Rest Edge visible meshes/materials/pads were removed from the isolated candidate;
- Rest Edge scaffold contains 0 Renderers / 0 MeshFilters;
- technical semantic/measurement scaffolding remains allowed;
- future SeatAnchor / Approach / Facing / BodySeatContact / GroundReference / FootTarget transforms may remain for integration and validation;
- Codex must wait for the user's actual Rest Edge asset before visible integration.

Authorized room cleanup candidate removed/disabled the obsolete furniture groups:

- `Runtime_Sofa`;
- `Runtime_SofaExtras`;
- `Runtime_MeetingTable`;
- `Runtime_MeetingChairs`;
- `Runtime_MeetingStorage`.

No replacement furniture/decor is to be invented by Codex.

The old sofa rug is merged into protected `Runtime_Rugs`; it was intentionally retained rather than destructively cut from a merged source.

Reported technical candidate validation:

- Unity compile PASS;
- PlayMode 5/5 PASS;
- blocking Console errors 0;
- production Office / N1R / Atlas prefab hashes unchanged;
- not yet promoted as a final Rest Edge visual baseline.

Reported scaffold measurements:

- SeatAnchor A contact `(0.20, 0.45, -6.08)`;
- SeatAnchor B contact `(1.62, 0.45, -6.08)`;
- approaches around Z=`-5.30`;
- between-sitting-position clearance 0.337 m;
- lateral clearance around each 0.409 m;
- PEBBLE open-edge clearance 0.169 m;
- Atlas→Rest route 1.350 m;
- Rest→Retrieval route 4.776 m.

These are technical references, not final furniture dimensions.

---

# 6. Rest Edge — active visual/model direction

Rest Edge must communicate:

> sitting at the open boundary is an ordinary domestic behavior for the residents.

It is not:

- a balcony;
- an observation deck;
- a safety platform;
- a sci-fi facility;
- a large replacement sofa zone.

The current design direction has evolved from a continuous built-in ledge into a set of small user-authored single-person Rest modules placed along the left-side edge.

## 6.1 Current Rest seat module concept

Current user direction:

- one reusable single-person seat model;
- **four instances** placed along the left-side Rest Edge;
- seat/base should sit directly against / flush with the floor, without ordinary raised chair legs;
- integrated small table/platform extends outward beyond the seat rather than remaining inside the seat footprint;
- overall size must remain compact enough for four modules to coexist without turning the edge into a furniture wall;
- visual language remains warm, quiet, low-profile, and secondary to Atlas.

Reference-design conclusions from the current visual exploration:

- avoid a two-person-sofa reading;
- keep the back low and restrained;
- clearly read as one resident per module;
- keep the outward table materially integrated with the seat/base;
- avoid railings, giant cushions, decorative clutter, glow strips, or strong sci-fi detailing.

A practical exploratory envelope discussed in chat was roughly:

- seat width around 0.65–0.75 m;
- outward table allowance around 0.25–0.35 m;
- module width around 0.95–1.05 m.

These numbers are **not locked asset-contract dimensions** until the user explicitly approves a final model/reference.

The current image set includes front, 3/4, side, and top-view product references, but the seat asset has **not yet received a formal Human Visual PASS as final geometry**.

Next modeling rule:

> User authors one clean final seat module; Unity duplicates it four times. Do not author four independent meshes unless a later asymmetry requirement appears.

---

# 7. Retrieval Edge — current core concept

Retrieval Edge is no longer best described as a conventional fishing dock.

Current strongest concept:

> A resident sends a tethered glowing sphere beyond the room's stable frame. The sphere is not a hook. It carries a stable room-associated signal / resonance. Things in the Outside may notice it, approach it, respond to it, follow it, adhere to it, or establish temporary coupling with it. The player then decides whether and how to bring that relationship/content back toward the room.

Working terms such as `Resonance Orb`, `Retrieval Orb`, or `引界球` are placeholders only. Final naming is open.

## 7.1 The end of the line is a glowing sphere, not a hook

User-established concept:

- tether/line terminates in a small luminous sphere;
- no conventional hook;
- sphere can attract or elicit responses from ordinary recovered matter, strange objects, and unusual life;
- the sphere should feel like a precise small world-device rather than a magical crystal or fishing lure.

Suggested visual structure remains provisional:

- semi-translucent luminous core;
- restrained protective metal/structural bands;
- tether connection;
- small cradle/dock on the Retrieval apparatus when stored.

Light should function as readable language, not decorative neon.

Possible diegetic feedback examples:

- slow stable breathing = normal connection;
- brief double pulse = something detected;
- one-sided luminance = directional contact;
- momentary darkness / irregular cadence = unstable correspondence;
- persistent faint pattern = something continues to follow/respond.

Do not lock these exact codes until interaction prototyping.

## 7.2 Retrieval is directional, not simply downward

Critical user decision:

> Retrieval must not be limited to lowering a line downward. The device can establish contact upward, downward, horizontally, or diagonally beyond the open edge.

This is compatible with the current Outside world rule that direction/distance outside the stable room frame are not ordinary metric geography.

Therefore:

- an upward cast does **not** mean the game has defined a literal sky biome;
- a downward cast does **not** define a literal ocean/depth map;
- visible direction is an intuitive resident/player gesture for establishing a relationship through a non-ordinary external medium;
- the game should preserve ambiguity about what those directions ultimately mean.

The Retrieval apparatus should therefore support a visibly steerable/aimable arm or guide rather than being a fixed downward fishing rod.

A particularly strong future visual teaching moment is:

- the orb is cast upward in an apparently ordinary arc;
- once it leaves the room's stable frame, it stops behaving like a normal ballistic object;
- additional tether allows it to continue drifting/holding 'upward' rather than simply falling back;
- the player learns the Outside rule behaviorally, without exposition text.

## 7.3 Core interaction philosophy

Retrieval must obey `Low Verb / High Discovery`.

The player's mechanical vocabulary should remain small.

Current conceptual loop:

`send / place orb -> observe response -> decide continue / hold / retrieve -> bring back content, trace, or relationship`

Avoid turning the system into:

- dexterity-heavy fishing QTE;
- increasingly complex casting controls;
- bait rarity trees;
- elemental lure systems;
- large fishing-specific UI;
- a separate minigame economy.

Long-term depth should come from the **meaning and behavior of what responds**, not from increasingly complicated controls.

## 7.4 Retrieval as a core world-content engine

The intended long-term role is larger than a side activity.

Retrieval should become one of the main ways the world sends new content into the persistent room.

Preferred system relationship:

`Outside / Retrieval`

→ `Recovered content / traces / life / anomalies`

→ `Inspect / Research / Place / Grow / Build / Repair / Observe`

→ `new knowledge / capability / room history`

→ sometimes `Atlas reinterpretation / newly understood patterns`

→ new Retrieval possibilities.

The desired question is not:

> What reward did I fish up?

It is:

> What did we bring into our world this time, and what will it mean later?

Atlas must not become the explanation for every Retrieval result. The Outside needs independent ecology, ordinary material, living content, and mysteries that remain unrelated to Atlas.

---

# 8. Everyday Retrieval content — current direction

Unique mystery props must remain a minority.

The system needs a large repeatable ordinary-content base so that rare anomalies retain weight.

Current direction is to build **content families**, not hundreds of one-off scripted collectibles.

## 8.1 Ordinary structural / material fragments

Common results may include:

- ceramic-like chunks;
- thin metal or mineral plates;
- bent connection pieces;
- small frame fragments;
- worn structural strips;
- fiber bundles;
- translucent hard sheets;
- strange but non-magical stone/mineral bodies.

They can feed later Build / Repair / experimentation / display without collapsing into abstract `ore x3` loot.

Preferred rule:

> Keep recovered matter physically legible as objects whenever practical; do not immediately reduce every recovery to inventory numbers.

## 8.2 Soft / growth-capable matter

Examples:

- membranes;
- spores;
- fibers;
- translucent seed-like pods;
- soft leaf-like sheets;
- contracting organic-looking clumps;
- slowly hardening or unfolding matter.

Most should be modest rather than spectacular.

Some may change after being brought into the room, creating future `place -> wait -> notice` content.

Do not automatically turn this into a conventional farming system.

## 8.3 Common Boundary Life

Boundary life should not be treated as rare collectible pets by default.

The Outside should contain repeatable small life forms that can be seen often enough to imply an ecology.

Working examples discussed:

- luminous fluff-like drifting life;
- two-fin / leaf-like transparent gliders;
- bubble-like organisms with visible internal structure;
- small needle-tail followers moving alongside the tether;
- shell-like small bodies that temporarily attach to the orb;
- paper-wing / membrane-like forms that move with external flow.

Possible behaviors:

- approach but never enter the room;
- orbit the orb;
- touch and leave;
- follow toward the edge and retreat;
- occasionally cross the boundary;
- become familiar over repeated encounters;
- later react to a room object or signal.

Core rule:

> A living encounter is not automatically loot.

## 8.4 Trace / residue / information results

A Retrieval attempt does not need to return a discrete object.

Possible results:

- luminous dust;
- fibers on the tether;
- thin crystallization;
- heat/material marking on the orb;
- an externally imposed pulse pattern;
- a short-lived membrane residue;
- directional response information;
- evidence of a large thing that could not be recovered.

These results are especially compatible with the world rule that information/pattern may cross more easily than stable matter.

## 8.5 Mundane evidence of use / construction

Occasional ordinary foreign-use fragments can greatly increase world believability:

- worn fastener;
- broken handle fragment;
- small piece of an unfamiliar tabletop/panel;
- cloth-like scrap;
- connector/fastener that does not match the room's standards;
- edge/corner fragment that appears to have belonged to a used object.

Do not immediately state where such fragments came from.

Their value is the thought:

> Something appears to have used or built this.

## 8.6 Rare remembered discoveries

Rare content may include long-term seeds already present in the world-content research:

- Returning Piece;
- Miniature Floor Fragment;
- Listening Shell-like content;
- Indexed/precisely fitting structural objects;
- unusual life with repeated behavior;
- significant external pattern/trace;
- content later reinterpreted through Atlas or another room event.

These should remain uncommon enough that players remember them.

---

# 9. Directional Retrieval — content bias without literal geography

Different visible cast directions may develop different **probability / behavior tendencies**, but should not be explained as normal biomes.

Current exploratory direction:

## Upward-facing contact may tend toward

- light drifting life;
- spores / membranes / fibers;
- luminous small organisms;
- signal / trace-heavy responses;
- low-mass floating fragments;
- fast transient contacts.

## Downward-facing contact may tend toward

- heavier structural fragments;
- condensed matter;
- slow larger responses;
- stronger tether load;
- dense residue / material pieces.

## Horizontal / diagonal contact may tend toward

- moving/passing content;
- mixed fragments;
- active small life;
- short-lived encounters;
- unusual lateral tension / directionality.

These are **design biases, not lore locks**.

The game should not state:

- 'up = sky biome';
- 'down = ocean/deep sea';
- 'left/right = literal mapped regions'.

Players may discover tendencies empirically while the underlying Outside remains ambiguous.

---

# 10. Retrieval risk and progression — conceptual only

Risk should follow player ambition rather than random punishment.

Current conceptual escalation:

- simple contact: stable, ordinary recoveries;
- weaker correspondence: more ambiguous responses, harder recovery;
- stronger/longer contact: possibility of larger, living, transforming, or unstable results;
- later containment/stabilization capability: permits bringing back content previously unsafe to cross the boundary;
- later pattern/signal capability: permits intentional communication attempts rather than only passive attraction.

Avoid a progression tree based mainly on numeric bonuses such as:

`+20% rare chance`, `+15 m rope`, `purple lure`, `legendary bait`.

Prefer capability unlocks such as:

- better sensing;
- better stabilization;
- better containment;
- new known signal/pattern behavior;
- improved ability to maintain a difficult coupling.

Exact controls, tuning, UI, timings, and rarity distribution are **not authorized/frozen yet**.

---

# 11. Retrieval apparatus — future user-authored asset

The Retrieval Edge hero device should visually communicate:

> something is repeatedly sent beyond the room and brought back through a controlled tether.

Current likely component language:

- compact fixed floor/base anchor;
- reel/winch/tether mechanism;
- steerable or tilting guide arm rather than a fixed downward rod;
- orb cradle / storage point;
- tether outlet/guide;
- optional shallow recovery cradle/tray if it improves the read.

Do not make it:

- a conventional fishing dock;
- a boat winch;
- a harbor crane;
- a large industrial machine;
- a cyberpunk console;
- a glowing portal apparatus.

Rest Edge should read warm / soft / horizontal / domestic.

Retrieval Edge should read directional / mechanical / outward-reaching / repeatedly used.

The two edges must remain visually distinct.

The user will author/generate the final Retrieval apparatus and orb geometry. Codex may only greybox dimensions/clearance before the real asset exists.

---

# 12. Current user modeling responsibilities for Gate 3

As of this handoff, the small set of likely user-authored assets required before the frozen-camera room review is:

1. one reusable Rest Edge single-person seat + outward integrated small table module, duplicated four times in Unity;
2. one Retrieval Edge apparatus / station;
3. one Retrieval glowing orb / tether-end device, either as part of the apparatus asset family or a separate controlled asset;
4. Returning Piece / first memorable recovered object;
5. one or two ordinary recovered-object models for contrast.

Do not inflate this into a large asset-production list before the room composition is reviewed.

If the Retrieval apparatus already incorporates a recovery tray/cradle, no separate tray model is required.

---

# 13. Explicitly deferred / do not start yet

Do not start these merely because the concepts are documented:

- Retrieval gameplay runtime;
- semantic interaction foundation;
- object persistence/save-load;
- full research system;
- cultivation/farming system;
- full anomaly system;
- economy/loot rarity system;
- Atlas gameplay state machine;
- Atlas material/motion/FX polish;
- final PEBBLE animation polish;
- stranger-room implementation;
- networking/cross-room influence;
- large Outside environment/sky/ocean/void visual definition.

The current Gate remains world/room readiness first.

---

# 14. Current next step

Immediate work should remain visual/asset-focused.

Current practical order:

1. finish and approve the single Rest seat module reference/model;
2. integrate four copies into the left Rest Edge candidate and check frozen-camera scale/composition;
3. design the Retrieval apparatus and glowing orb as a coherent asset family with multi-view references;
4. user authors the actual Retrieval model(s);
5. Codex integrates the real models and validates anchors/clearance without redesigning geometry;
6. add only a tiny first recovered-content set;
7. perform the full-room frozen-camera Human Visual Gate.

Do not begin core gameplay before the room itself communicates the intended world identity.

---

# 15. Maintenance rule from this point forward

This handoff must be updated whenever one of the following occurs:

- user explicitly approves/rejects a visual direction;
- Human Visual PASS changes the authoritative baseline;
- a Gate is passed/failed/reopened;
- a local candidate is promoted;
- an asset-authoring responsibility changes;
- a major world rule is established or superseded;
- a previous design path is explicitly rejected;
- the project sequence/priority changes.

Do not leave those decisions only in chat.

The planning/coordination layer is responsible for preserving this continuity in Markdown.