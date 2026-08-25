# VQ2 Inhabitant / Creature Direction v0.1

> Date: 2026-08-25  
> Status: RESEARCH / PROPOSED — DISCUSSION IN PROGRESS  
> Scope: player-avatar creature design, world-fiction role, animation cost, interaction anatomy, readability, customization  
> Purpose: replace the realistic-human character assumption with a creature direction that is distinctive, world-consistent, and substantially cheaper/more reliable to animate in Unity

---

# 0. Why this design track exists

The project has already learned that realistic / humanoid characters create disproportionate production cost when exact world contact matters.

Historical problems included:

- Humanoid reference-pose / T-pose fragility;
- finger mapping deformation;
- retargeting mismatch;
- pelvis versus real seat-contact mismatch;
- foot-floor correction;
- chair back / thigh / desk clearance;
- repeated per-character calibration;
- visually wrong seating despite numerically plausible target bones.

The new character direction should therefore not ask:

> "How can we make a human-shaped character easier to animate?"

It should ask:

> "What kind of inhabitant would naturally belong in this world while requiring a much simpler motion/contact system?"

This is both a fiction decision and an engineering decision.

---

# 1. External reference lessons

## 1.1 Slime Rancher — constraint can create identity

In a GDC postmortem, Slime Rancher creator Nick Popovich explicitly described choosing limbless slimes partly because animation was a production constraint.

Relevant lesson for Four Workstations:

> A deliberately simple body plan can become part of the game's identity instead of looking like a technical compromise.

Do not add anatomical complexity unless it buys a gameplay verb the project actually needs.

## 1.2 Pikmin — tiny characters need immediately readable markers

Nintendo's Pikmin 4 developer discussion describes early concern with making small characters readable from a top-down view, including using distinctive head features/markers.

Relevant lesson:

> At miniature camera scale, silhouette and one strong identity marker matter more than realistic facial detail.

Four Workstations should design for its fixed orthographic/isometric camera first, not for a close-up character turntable.

## 1.3 General game-rig lesson

Animation-production literature repeatedly emphasizes that the skeleton/rig should be designed around the worst-case motions the game actually needs.

For Four Workstations, the important motions are not combat or acrobatics. They are:

- idle / wander;
- sit at edge;
- inspect / carry;
- pull / retrieve;
- operate a small device;
- repair / build;
- react / emote;
- rest / sleep.

The creature body should be optimized for these verbs.

---

# 2. Creature design requirements

The future inhabitant should satisfy all of the following.

## 2.1 Visual requirements

- clearly non-human at first glance;
- readable from the frozen miniature camera;
- strong silhouette;
- warm / strange rather than grotesque;
- compatible with `premium toy-house × architectural model × gentle life game`;
- simple enough that four inhabitants can be visually distinct without four unrelated rigs;
- visually compatible with the world's "domestic impossibility" tone;
- should not look like a generic sci-fi alien.

## 2.2 Gameplay requirements

The body must support:

- walking or another clear locomotion mode;
- sitting/dangling at an open floor edge;
- approaching desks/workstations;
- holding or at least visibly manipulating small objects;
- pulling a line/tool during salvage;
- operating Atlas / machines;
- inspecting recovered items;
- building / repairing;
- resting/sleeping;
- expressive reactions.

## 2.3 Production requirements

Prefer:

- one shared rig topology for all player variants;
- very low bone count;
- no individual finger rig requirement;
- no realistic shoulder girdle requirement;
- no human facial rig requirement;
- no strict Humanoid/Mecanim dependency;
- no need for anatomically perfect hip/knee/foot contact;
- easy authored contact sockets;
- animation reuse across all four characters;
- possibility of procedural squash/stretch and simple IK.

---

# 3. Three morphology directions considered

## Direction A — Fully limbless blob

Shape:

- one soft central body;
- face;
- optional antenna / ears / crown feature;
- movement by bounce, slide, roll, or squash/stretch;
- object interaction through temporary tendril, magnet-like tool, telekinetic effect, or held attachment.

### Advantages

- lowest animation/rig cost;
- no seating pelvis problem;
- extremely easy squash/stretch expression;
- very readable silhouette;
- easy cosmetic variants.

### Problems for Four Workstations

- manual repair/building becomes visually indirect;
- pulling a salvage line becomes harder to sell physically;
- edge sitting loses much of its charm if the creature has no dangling legs;
- many tools would need an invented manipulation rule;
- may make ordinary furniture feel less naturally usable.

### Current assessment

> Excellent production efficiency, but too restrictive for the current verb set unless the world is redesigned around non-contact manipulation.

Not the strongest current recommendation.

---

## Direction B — Soft-bodied compact creature with four stub limbs

Current strongest proposal.

Basic body plan:

- one large continuous body/head mass;
- face directly on the body, with little or no separate neck;
- two short flexible arms;
- two short flexible legs;
- mitten/pad hands rather than fingers;
- simple rounded feet;
- optional single silhouette feature on top/back: antenna, ear pair, sprout, soft horn, tuft, fin, etc.;
- body can compress / stretch beyond human anatomy.

The creature may be approximately pear-, seed-, bean-, pebble-, or dumpling-shaped, but the exact silhouette is not frozen.

### Why this is strong

It preserves almost every useful human gameplay affordance without preserving human anatomy.

It can:

- walk;
- sit with legs over the edge;
- pull;
- hold;
- point;
- inspect;
- operate a workbench;
- sleep curled up;
- carry an object;
- reach toward Atlas.

But it does not need:

- fingers;
- realistic wrists;
- clavicles;
- neck deformation;
- anatomical shoulders;
- realistic pelvis;
- realistic spine;
- precise human knee proportions;
- mocap-grade joint fidelity.

### Seating advantage

A human sit requires believable pelvis, thigh, knee and foot relationships.

This creature can use a much simpler visual rule:

`BodySeatContact -> Seat/EdgeAnchor`

The lower body can compress slightly while the two legs simply dangle.

Therefore a correct seated pose does not require the player's eye to validate a real human hip structure.

### Tool-interaction advantage

Hands can be simple pads/mitten ends.

A tool interaction only needs:

`LeftHandSocket / RightHandSocket -> ToolGripTarget`

No finger gripping animation is required.

### Current assessment

> Best balance between distinctive world identity, gameplay expressiveness, and production simplicity.

This is the recommended prototype direction.

---

## Direction C — strongly exotic multi-limbed creature

Examples of the design space:

- four legs + two arms;
- tripod locomotion;
- multiple tentacles;
- tail-based manipulation;
- floating body with articulated appendages.

### Advantages

- highly distinctive;
- can strongly support non-human worldbuilding;
- potentially very expressive.

### Problems

- custom locomotion complexity rises sharply;
- seating becomes bespoke;
- desk/edge/furniture interaction becomes more difficult;
- more limbs mean more contact and clipping problems;
- external reusable animation becomes much less useful;
- harder to maintain four variants on one small production budget.

### Current assessment

> Violates the practical reason for moving away from realistic humans unless a future gameplay concept specifically justifies the anatomy.

Not recommended for the first playable inhabitant.

---

# 4. Recommended inhabitant body — functional specification

Working description only; no species name yet.

> A small soft-bodied resident with a large unified torso/head, two short arms, two short legs, simple pad hands/feet, large readable eyes, and one strong silhouette marker. Its body behaves more like a flexible toy/creature than a miniature human.

## 4.1 Recommended proportions

Do not freeze exact meters yet.

Relative design target:

- body/head mass: ~60–70% of visible character volume;
- legs: short, roughly 15–25% of full standing height;
- arms: enough reach to touch desk-level tools, but visually stubby;
- no thin neck;
- hands larger than anatomical realism would suggest so they read at camera distance;
- feet broad enough to support readable contact/shadow;
- top marker tall/clear enough to distinguish silhouettes without hiding behind the body.

The creature should look good at the actual Office camera before close-up detail is considered.

## 4.2 Suggested rig skeleton

A production creature should aim for a deliberately small Generic/custom rig.

Possible skeleton:

```text
Root
└─ Body
   ├─ Face/Aim (optional)
   ├─ Arm_L_Upper
   │  └─ Arm_L_Lower_or_Hand
   ├─ Arm_R_Upper
   │  └─ Arm_R_Lower_or_Hand
   ├─ Leg_L
   │  └─ Foot_L (optional)
   ├─ Leg_R
   │  └─ Foot_R (optional)
   └─ TopFeature
```

Target: approximately 8–12 meaningful deform/animation bones, not 50–70 humanoid bones.

Exact topology must follow the chosen mesh.

## 4.3 Semantic contact points

Every standardized character prefab should expose reusable semantic transforms:

- `GroundContact`
- `BodySeatContact`
- `HandSocket_L`
- `HandSocket_R`
- `CarryCenter`
- `LookTarget`
- optional `HeadTopCosmeticSocket`
- optional `BackCosmeticSocket`

This aligns with `UNITY_SPATIAL_INTERACTION_CONTRACTS.md`.

The world object owns the matching target:

- Edge/Chair -> `SeatAnchor`
- Salvage rig -> `PullGrip_L/R`
- Atlas -> `OperateTarget_L/R`
- Workbench -> `InspectTarget`
- Item -> `GrabSocket`

Agent placement/interaction must match these anchors geometrically rather than by screenshot guessing.

---

# 5. Animation philosophy

The goal is not a giant animation library.

The goal is a small vocabulary that recombines into many world behaviors.

## 5.1 Core motion set

A first full character could plausibly cover a large fraction of the game with roughly these families:

1. `Idle` — body breathing/sway.
2. `Walk/Hop` — primary locomotion.
3. `SitEdge` — body compression + dangling legs.
4. `Rest/Sleep` — curl/squash/lie.
5. `Reach/Interact` — generic one/two-hand machine interaction.
6. `Carry/Hold` — object held near body.
7. `Pull` — salvage/rope/tool effort.
8. `Inspect` — hold/look/tilt object.
9. `Build/Repair` — generic repeated manipulation.
10. `ReactStartle` — world anomaly response.
11. `Cheer/Happy` — reward/social response.
12. `Sad/Tired/Failed` — low-energy consequence response.

Many tasks can reuse the same physical animation with different props and targets.

Example:

`Reach/Interact`

can support:

- press Atlas component;
- turn a small machine;
- touch research device;
- adjust desk experiment;
- activate wall board.

## 5.2 Expression should come from whole-body motion

At miniature scale, do not depend on detailed facial animation.

Expression channels can be:

- body squash/stretch;
- body lean;
- eye shape/blink;
- top-feature movement;
- arm pose;
- speed/timing;
- small material/color accent change if appropriate;
- particle/icon only when necessary.

A creature can communicate surprise by:

`compress -> snap upward -> eyes widen -> top feature stiffens`

rather than requiring a facial blendshape system.

## 5.3 Controlled exaggeration is desirable

Because the creature is not human, motion can intentionally violate realistic anatomy:

- arms temporarily stretch farther during a grab;
- body compresses while sitting;
- feet widen slightly on landing;
- top feature trails movement;
- body leans dramatically while pulling;
- creature can curl into a compact sleeping shape.

This creates charm while solving contact/readability problems.

---

# 6. Identity and four-player differentiation

Four players should share one body/rig family unless a later design intentionally adds species diversity.

Identity should come from a limited set of highly readable channels.

Recommended hierarchy:

1. **Base body color/material family**
2. **Top silhouette feature**
3. **one accessory / clothing-like element**
4. **idle personality variant**
5. optional face/eye variant

Examples of top markers:

- soft antenna;
- short ear pair;
- sprout;
- tuft;
- rounded horn;
- fin;
- folded ribbon-like appendage.

This follows the miniature-readability lesson: one strong silhouette marker can do more work than detailed clothing.

Avoid requiring different skeleton topologies for the four players.

---

# 7. Fiction role — what are these creatures?

Do not define them as "aliens working in an office."

Current stronger fiction framing:

> They are simply the inhabitants of these rooms. The room's furniture, tools, rituals, and work surfaces belong to their way of living.

The real-world resemblance to an office is a visual bridge for the player, not necessarily a literal statement that the inhabitants are employees in a human corporate system.

They can naturally treat the same room as:

- home;
- workshop;
- study;
- lab;
- construction site;
- rest place.

## 7.1 Why their soft/simple anatomy can belong to the world

No biological explanation needs to be given immediately.

The world already contains physical rules that differ from ours.

Therefore inhabitants can have:

- compressible bodies;
- exaggerated reach;
- unusual sitting posture;
- resilient falls/edge behavior;
- simplified manipulators.

These should feel normal to them.

Do not write an early exposition explaining their evolution.

## 7.2 Open origin possibilities

Keep open:

- naturally evolved residents;
- inhabitants shaped/adapted by node environments;
- life that emerged with the room network;
- descendants of something older;
- multiple related forms across different rooms.

Do not connect their origin to the Fracture/System mystery prematurely.

---

# 8. Player relationship to the inhabitant

Current product structure maps real members to persistent personal workstations/characters.

A future fiction decision is still needed:

### Option A — the player *is* the resident

The resident is the player's avatar/self inside the room.

Strengths:

- simple identity;
- personal desk/world ownership reads naturally;
- cross-world observation feels personal.

### Option B — the player guides a resident

The resident is a small autonomous creature the player influences.

Strengths:

- more room for autonomous idle behavior;
- can create a virtual-pet/companion relationship;
- makes strange creature behavior less constrained by self-representation.

### Current recommendation

Do not freeze this yet.

However, regardless of fiction, the creature should be autonomous enough to perform believable ambient behaviors when the player is not issuing a direct command.

---

# 9. What this means for Office furniture

Changing inhabitants changes furniture expectations.

Do not assume every current human chair/desk dimension must remain sacred forever.

Possible future polish changes may include:

- slightly lower/wider chairs;
- rounded seats;
- generous edge/perch areas;
- larger simple controls instead of tiny keyboards/buttons;
- tools with oversized grips;
- low equipment benches;
- floor-level interaction objects;
- more spaces where creatures climb/perch/sit casually.

However, this document does not authorize moving frozen production layout yet.

The first creature prototype should be tested against the current room before major furniture changes are approved.

---

# 10. Prototype acceptance test for a creature design

Before accepting a final creature style, one representative prototype should be evaluated against the actual Office camera and core verb set.

Required visual/motion tests:

- idle at desk;
- walk through central route;
- sit on open edge;
- stand from edge;
- hold one recovered object;
- pull a line/tool;
- interact with Atlas-height target;
- inspect object;
- lie/curl/rest;
- react to an anomaly;
- four color/silhouette variants visible together.

Acceptance questions:

1. Can all actions be read from the fixed Office camera?
2. Does edge sitting look natural without human-style pelvis calibration?
3. Can tool contact be solved with 1–2 hand sockets rather than fingers?
4. Does the character remain charming when doing nothing?
5. Is the silhouette distinct from generic human/chibi characters?
6. Can all four players share the same rig/animation set?
7. Can simple interactions be aligned geometrically using anchors?
8. Does the creature still belong aesthetically beside the warm wood/paper/brass Office?
9. Does the creature feel strange without making the game read as sci-fi alien content?
10. Is the rig simpler enough to justify abandoning the old humanoid pipeline?

If these fail, do not compensate with more bones and more IK until the morphology itself is reconsidered.

---

# 11. Current strongest direction

The strongest current proposal is:

> **A soft-bodied, non-human resident with one unified body/head mass, two stub arms, two stub legs, simple pad hands/feet, large readable eyes, and one strong silhouette marker.**

Design goal:

> Strange enough to become an IP identity; simple enough that animation and contact become predictable engineering tasks rather than repeated humanoid calibration work.

This is intentionally not yet a final species design.

Next design work should explore 3–5 visual silhouette families within this morphology before choosing one for a Unity prototype.

---

# 12. Superseded assumptions

Do not automatically assume:

- realistic human proportions;
- Unity Humanoid/Mecanim as the required character foundation;
- five-finger hand rigs;
- standard office sitting posture;
- human mocap compatibility as a primary requirement;
- existing realistic/custom human model replacement bake-off remains the preferred next character gate.

The earlier Quaternius-vs-Synty humanoid replacement research remains useful historical technical evidence, but this new creature direction is now the higher-priority exploration path unless the user reverses it.

---

# 13. Open questions

Still open:

- exact silhouette;
- species/name;
- body material: skin/felt/rubber/plantlike/other;
- presence/shape of mouth;
- eye style;
- whether arms are always visible or partly retractable;
- whether limbs can stretch during interaction;
- whether body squash/stretch is literal world biology or purely animation language;
- top-marker system;
- player-is-avatar vs player-guides-resident;
- whether all rooms share one species;
- whether nearby stranger rooms may contain visibly different related forms;
- exact rig topology;
- exact scale relative to furniture;
- locomotion: walk, waddling walk, hop, or hybrid.

No implementation should start until a visual silhouette direction is selected for prototype.