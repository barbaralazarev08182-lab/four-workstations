# Hozy Product Analysis & Transfer Lessons for Four Workstations

> Date: 2026-08-25  
> Status: RESEARCH / PRODUCT REFERENCE — NOT IMPLEMENTATION AUTHORIZATION  
> Scope: Hozy product structure, interaction design, spatial editing, progression/content model, visual presentation, post-launch lessons, transfer recommendations for Four Workstations

---

# 0. Executive conclusion

Hozy is best understood as a **high-quality interaction-and-transformation product** rather than a deep systemic progression product.

Its major strengths are:

- tactile direct manipulation;
- highly legible before/after room transformation;
- curated freedom that lets inexperienced players create attractive spaces;
- strong screenshot/marketing readability;
- smart semantic placement constraints;
- warm diorama presentation;
- satisfying micro-feedback on repeated actions.

Its main structural weakness at launch was the opposite side of the same design choice:

- the core loop was finite;
- there was little economy/progression pressure;
- authored rooms/furniture carried most of the content burden;
- players consumed the available content quickly;
- community demand rapidly shifted toward Game Plus, Sandbox, more rooms, and more furniture.

Official post-launch data/reports reviewed during this analysis:

- ~450k wishlists shortly before launch;
- >100k copies sold in the first four days;
- >200k players/users referenced by April 21 official update;
- >270k "renovators" referenced in the May roadmap;
- Game Plus added as early endgame response;
- first Sandbox iteration arrived in Update 1.2;
- future room-geometry editing, additional rooms, seasonal content, and themed DLC were announced.

Core lesson for Four Workstations:

> **Use Hozy as a quality benchmark for touch, placement, composition, and transformation — but do not inherit its dependence on authored room/furniture content as the main source of longevity.**

Four Workstations should aim for:

`Hozy-level tactile interaction + persistent systemic world growth + long-lived social/world mystery`

rather than:

`more rooms + more furniture = more game`.

---

# 1. Hozy's real product loop

A simplified Hozy loop:

```text
Enter neglected authored room
-> clean / remove / repair
-> repaint / change surface treatment
-> unpack curated furniture
-> place / rotate / compose
-> room becomes warm and inhabited
-> finish / photograph / move to next room
```

The emotional reward is primarily:

> **Visible transformation created by the player's own direct manipulation.**

The strongest reward is not a currency number or character stat. It is the difference between the room before and after the player's actions.

This is a major transferable lesson.

For Four Workstations, major systems should also seek a strong before/after delta:

- Atlas incomplete -> functioning / more legible;
- empty edge -> built salvage structure;
- unstable expansion frame -> stable platform;
- dormant growth object -> transformed mature state;
- wall anomaly -> contained / studied / deliberately expanded;
- plain room -> persistent history accumulated over weeks;
- stranger room -> visibly evolves over repeated observation.

---

# 2. Hozy's strongest innovation: interaction as interface design

Come On Studio describes Hozy as effectively an **interface inside a game environment**.

The team came from UI/interface design and treats each repeated action as something that must be pleasurable in itself.

The mop is the canonical example:

- follows cursor movement;
- rotates toward movement direction;
- tilts based on movement speed;
- visibly compresses;
- leaves wet surface feedback;
- produces matching audio.

The design pattern is:

```text
Player input
+ object motion response
+ deformation
+ surface response
+ sound
+ timing/weight
= tactile credibility
```

This is more important than the literal realism of the tool.

## Transfer to Four Workstations

Do not judge core actions only by functional correctness.

For important repeated verbs, ask:

> "Does the action itself feel good for the 50th time?"

High-priority tactile verbs should likely include:

### S-tier repeated verbs

- pick up / place a world object;
- pull/retrieve from the open edge;
- install a component into Atlas;
- operate/calibrate Atlas;
- build/repair a structure;
- inspect/handle recovered objects.

Potential tactile layering for salvage:

```text
input begins
-> creature reaches
-> line becomes taut
-> character body compresses/leans
-> rig responds mechanically
-> resistance changes
-> sound pitch/texture changes
-> retrieved object crosses boundary
-> object gains room gravity/contact
-> small impact/settling response
```

The important rule:

> **Do not spend Hozy-level polish on every low-value click. Spend it on the verbs that define the game.**

---

# 3. Semantic placement: the most directly reusable system lesson

Hozy does not treat object placement as unrestricted XYZ editing.

Its placement system uses context-aware constraints such as:

- wall objects orient toward walls;
- objects avoid clipping through walls;
- large furniture cannot stack on large furniture;
- different object sizes/weights have different held-response behavior;
- later Sandbox still retains structured placement logic;
- rugs require special rules because they can exist beneath furniture and can be stored rolled.

This validates a principle already established for Four Workstations:

> Users and Agents should express **intent**; the system should solve low-level geometry.

Instead of:

`Player manually solves Y coordinate`

use:

`Player says: place this here -> system identifies valid support surface -> computes contact -> snaps/orients -> validates collision`.

## Proposed Four Workstations object taxonomy

A future placement system should classify objects by placement semantics, not only prefab name.

Examples:

### FLOOR_FURNITURE

- cabinet;
- large machine;
- workbench;
- storage;
- major personal furniture.

Rules:

- floor support required;
- no overlapping structural clearance;
- path/interaction clearance validation.

### SURFACE_PROP

- mug;
- sample;
- small plant/growth object;
- book;
- recovered artifact;
- tool.

Rules:

- valid horizontal support surface;
- `BottomContact` to support point/socket;
- footprint check.

### WALL_OBJECT

- task/archive board module;
- photograph/memory;
- shelf;
- research display;
- strange boundary marker.

Rules:

- wall normal alignment;
- wall bounds/occupancy;
- no overlap with reserved anomaly/system regions.

### RUG / UNDERLAY

- carpet;
- mat;
- floor marking.

Rules:

- may overlap under approved furniture;
- special collision layer.

### SLOT_OBJECT

- desk personal object;
- Atlas component;
- machine module;
- experiment container.

Rules:

- explicit semantic socket;
- deterministic placement;
- no freeform precision problem.

### EVENT_OBJECT

- anomaly residue;
- temporary debris;
- recovered unknown;
- repair scaffold.

Rules:

- temporary gameplay ownership;
- cannot be silently destroyed by normal decor placement;
- state persistence defined separately.

This taxonomy should eventually be shared by:

- player placement;
- Agent/Codex placement;
- save/load;
- multiplayer synchronization;
- inventory/shop systems;
- world events.

---

# 4. Critical warning from Hozy: direct manipulation is fragile

Hozy also demonstrates the cost of this interaction style.

Recent Steam feedback and official patches show recurring problems involving:

- imprecise controls;
- cursor/input frustrations;
- objects falling out of the level;
- disappearing/reset furniture;
- rugs behaving incorrectly after save/load;
- wall objects getting stuck;
- progress/save edge cases;
- furniture state being rearranged or lost.

This matters because direct manipulation creates a strong ownership expectation:

> If the player carefully placed something, the game must remember it exactly.

A placement system that feels wonderful for 20 seconds but corrupts state after reload is worse than a less fancy but reliable system.

## Four Workstations requirement

For persistent objects, acceptance priority should be:

1. deterministic placement;
2. exact persistence;
3. multiplayer consistency;
4. collision/contact correctness;
5. tactile polish.

Not the reverse.

Future QA should include:

```text
place object
-> save
-> close/reload
-> verify exact transform + semantic surface + occupancy
-> sync another client
-> verify same result
-> move/remove
-> save/reload again
```

For room identity, persistence bugs are product-critical, not cosmetic bugs.

---

# 5. Curated freedom vs full sandbox — Hozy's central tension

Hozy's original design intentionally avoids an overwhelming full furniture catalogue.

The team describes the game as a **curated sandbox**: the furniture selection is constrained enough that ordinary users can create an attractive result without being expert interior designers.

This is an important strength.

However, player demand quickly pushed toward:

- choosing which item to unpack;
- remixing furniture sets;
- Game Plus room variants;
- full Sandbox;
- future geometry editing.

This exposes a universal design tension:

> **Curation produces quality and accessibility. Freedom produces ownership and longevity.**

## Recommended Four Workstations solution: progressive freedom

Do not choose between rigid snap slots and unlimited free placement globally.

Use multiple freedom levels by system.

### Level 1 — Designed sockets

Best for:

- first personal desk items;
- Atlas components;
- machine modules;
- functional interaction props.

Benefits:

- excellent composition;
- deterministic Agents;
- cheap multiplayer state;
- no navigation breakage.

### Level 2 — Valid surface zones

Player can choose location within a bounded semantic surface.

Examples:

- move a sample anywhere on a research bench;
- arrange several personal objects on a desk;
- place wall memories in an allocated wall panel.

System automatically handles:

- support height;
- rotation constraints;
- collision;
- footprint.

### Level 3 — Flexible cosmetic regions

Later progression may unlock more freedom in safe non-gameplay zones.

Examples:

- external decorative platform;
- personal display shelf;
- future expansion room/module.

### Level 4 — Structural expansion

Not freeform CAD.

Use authored attachment interfaces/modules so the room silhouette changes while camera/navigation remain controllable.

This provides the emotional benefit of sandbox ownership without making every object a networked rigid-body construction problem.

---

# 6. Hozy shows why customization itself can be progression

Hozy initially separated gameplay from economy: placing furniture has no economic benefit and the process itself is the reward.

This works very well for a short-form product.

For a persistent product like Four Workstations, the lesson is not "remove economy."

The stronger lesson is:

> **Do not let economy replace intrinsic enjoyment.**

Bad Four Workstations version:

`place item -> +10 XP`

Player places it only for reward.

Better version:

`I wanted this strange object displayed here because it records something that happened to us.`

The economy determines access/rarity/tradeoff.

The placement itself should still be satisfying and personally meaningful.

Therefore personal/world objects should ideally have at least one of these roles:

- identity;
- memory;
- function;
- evidence/discovery;
- growth;
- world reaction;
- social trace;
- collection;
- aesthetic expression.

Avoid a catalogue where most objects differ only by price and shape.

---

# 7. Hozy's launch/post-launch pattern: strong acquisition, weaker depth

Observed pattern:

```text
Strong visual concept / demo / screenshots
-> very high wishlist interest
-> strong launch conversion
-> players consume finite authored content
-> demand for more freedom/endgame
-> Game Plus
-> Sandbox
-> more rooms
-> seasonal content
-> themed DLC
```

This is a healthy commercial response from the Hozy team, but it also reveals the content model's cost.

Every major longevity extension tends to require:

- new furniture;
- new rooms;
- new art sets;
- new surface variants;
- more authored combinations.

This is **content scaling**.

Four Workstations should prefer **system scaling** wherever possible.

Examples:

One well-designed salvage system can generate:

- mundane finds;
- rare objects;
- anomalies;
- building components;
- research inputs;
- failures;
- world clues.

One cultivation system can generate:

- stages;
- mutations/variants;
- materials;
- persistent room identity;
- experiment inputs;
- social observation changes.

One Atlas system can generate:

- construction;
- discovery;
- observation;
- incoming observation;
- neighbor familiarity;
- later influence;
- costly experiments.

The strategic target:

> **Build expensive systems that recombine; avoid relying on an endless treadmill of handcrafted rooms.**

---

# 8. The screenshot problem: Hozy is extremely marketable

Hozy's premise is readable from one screenshot:

- beautiful cutaway room;
- warm sunlight;
- clutter/furniture;
- obvious renovation fantasy;
- strong before/after potential.

This likely contributed to its very large pre-launch wishlist count and strong launch.

Four Workstations must not become so systemically clever that its store-page visual promise becomes unreadable.

A future screenshot should ideally communicate in seconds:

> "Four strange little residents live and build together inside a warm miniature room whose edges open onto something impossible."

Possible visual marketing anchors:

- four highly readable creature silhouettes;
- warm handcrafted Office/habitat;
- central partially built Atlas;
- one creature sitting with legs over the exposed edge;
- another operating a retrieval rig;
- visible strange recovered object;
- clear room expansion/building state;
- later screenshots: miniature neighboring room visible through Atlas.

This is a key reason the creature/world silhouette work matters commercially, not only narratively.

---

# 9. Diorama edge treatment — a strong visual transfer lesson

Hozy carefully treats cutaway edges as part of the scene instead of leaving a raw clean plane.

Its rooms use architectural fragments/structure so the diorama feels like a piece cut from a larger place.

Four Workstations should learn the principle but not the fiction.

Our open edges are **real world boundaries**, not merely camera cutaways.

Therefore the floor edge should communicate:

- material thickness;
- internal construction;
- wear;
- attachment/stabilization points;
- possible expansion interfaces;
- boundary reactions;
- history of repairs or additions.

The edge can evolve over progression.

Example progression:

```text
simple exposed floor edge
-> reinforced attachment points
-> salvage rig mounting
-> repair scars / markings
-> expansion anchor
-> new platform connection
```

Thus the edge itself becomes a long-term storytelling surface.

---

# 10. Clutter: Hozy's warmth comes partly from density, but Four Workstations must control it

Hozy rooms often become visually rich through many small objects.

This creates:

- warmth;
- personality;
- scale cues;
- photographic richness.

But for Four Workstations, excessive clutter creates specific risks:

- fixed-camera readability loss;
- character silhouettes disappear;
- interaction targets become ambiguous;
- Agents have more collision/placement complexity;
- future gameplay regions get accidentally occupied;
- multiplayer state grows unnecessarily;
- special recovered objects stop feeling special.

Recommended principle:

> **Curated density, not maximal density.**

Use high detail where it communicates identity/history, and preserve deliberately empty gameplay space.

The Office should never be filled simply because Hozy screenshots look rich.

---

# 11. What Four Workstations should directly borrow

## BORROW 1 — Moment-to-moment tactile quality

Every flagship interaction needs layered visual/audio/motion response.

## BORROW 2 — Semantic placement assistance

Users choose intent/location; system solves support, contact, orientation and collision.

## BORROW 3 — Strong before/after delta

Construction, repair, growth and anomalies should visibly alter the world.

## BORROW 4 — Curated starting freedom

Early customization should be hard to make ugly or break gameplay.

## BORROW 5 — Diorama composition discipline

Every gameplay area must look good in the canonical camera.

## BORROW 6 — Material/light quality as a product feature

Warm light, contact shadows, object weight and material response are not finishing details; they are part of perceived product value.

## BORROW 7 — Social screenshotability

The room should create moments users naturally want to capture/share.

---

# 12. What Four Workstations should adapt rather than copy

## ADAPT 1 — Furniture placement

Hozy: broad decorative arrangement.

Four Workstations:

- sockets for functional objects;
- semantic free placement in safe zones;
- progressive freedom later.

## ADAPT 2 — Room transformation

Hozy: dirty -> restored.

Four Workstations:

- ordinary -> lived-in -> strange -> capable -> connected.

## ADAPT 3 — Curated content

Hozy: curated furniture sets.

Four Workstations:

- curated item families tied to gameplay/discovery;
- less catalogue breadth, more object meaning.

## ADAPT 4 — Sandbox

Hozy: creative endpoint/endgame.

Four Workstations:

- expression is integrated into persistent progression from early game;
- broader freedom unlocks as safe regions/facilities expand.

---

# 13. What Four Workstations should explicitly NOT copy

## DO NOT COPY 1 — Finite furniture catalogue as primary economy sink

It guarantees late-game currency inflation once players own what they want.

## DO NOT COPY 2 — New authored rooms as the main longevity solution

Production cost scales too directly with playtime.

## DO NOT COPY 3 — No-consequence progression model

Four Workstations needs optional risk/consequence to support a deeper persistent system.

## DO NOT COPY 4 — All decorative objects treated as equal clutter

Recovered/anomalous/memory objects need systemic meaning and persistence priority.

## DO NOT COPY 5 — Complex free placement before persistence/networking is reliable

Hozy's own post-launch placement/save bugs demonstrate the danger.

## DO NOT COPY 6 — Beautiful micro-interaction at the expense of state reliability

Persistent world state is sacred in Four Workstations.

---

# 14. Proposed Four Workstations "Hozy Quality Bar"

When development resumes, future major interactive objects can be reviewed using this quality checklist.

For a flagship interaction, verify:

### Intent readability

- can the player immediately understand what can be manipulated?

### Pickup / activation

- clear response in <100–200ms perceptually;
- object/character visibly reacts;
- sound confirms activation.

### Motion quality

- acceleration/deceleration communicates weight;
- object/character orientation follows intent;
- no robotic snapping unless explicitly designed.

### Contact

- semantic surface/anchor is correct;
- contact shadows/physical settle make result believable;
- no visible float/penetration.

### State change

- the world visibly remembers what happened.

### Persistence

- save/load retains result exactly.

### Multiplayer

- another client reads the same state.

### Camera readability

- interaction remains understandable from the canonical Office camera.

### Repetition

- action still feels acceptable after many repetitions;
- animation length does not become friction.

---

# 15. Recommended immediate product-design consequence

Hozy reinforces that Office Final Polish should not be limited to changing materials.

When that work resumes, review the room through three simultaneous lenses:

1. **Visual quality** — material/light/composition.
2. **Interaction quality** — surfaces, sockets, future tactile actions.
3. **Transformation capacity** — can this area visibly evolve later?

Examples:

### Open edge

Do not merely make floor material prettier.

Design the edge so it can later support:

- sitting;
- salvage mounting;
- damage/repair;
- expansion anchors;
- visual progression.

### Atlas center

Do not merely create a beautiful static device.

Its model hierarchy should support visible staged construction and moving/interactive parts.

### Desk

Do not merely scatter decor.

Preserve meaningful object/surface capacity for:

- personal expression;
- research;
- recovered objects;
- small machines;
- memories.

### Walls

Do not fill every wall with permanent artwork.

Leave room for:

- board/archive;
- anomalies;
- research output;
- persistent traces.

---

# 16. Final strategic position

The most useful way to position Hozy relative to Four Workstations is:

> **Hozy shows how good a small 3D room can feel. Four Workstations must solve how that room can remain meaningful for months.**

Hozy's core excellence:

`touch -> composition -> transformation`

Four Workstations' intended extension:

`touch -> transformation -> persistence -> discovery -> construction -> risk -> social/world connection -> new capability`

If Four Workstations achieves Hozy-level tactile and visual confidence while preserving its own systemic depth, it can occupy a substantially different product space from a conventional productivity app, office decorator, or finite cozy renovation game.
