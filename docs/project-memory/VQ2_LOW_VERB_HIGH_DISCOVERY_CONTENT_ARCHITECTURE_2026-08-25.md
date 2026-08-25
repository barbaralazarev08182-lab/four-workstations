# VQ2 Low-Verb, High-Discovery Content Architecture

> Date: 2026-08-25  
> Status: RESEARCH / PROPOSED — CONTENT DIRECTION, NOT IMPLEMENTATION SPEC  
> Scope: world content, novelty, complexity control, long-term discovery  
> User preference: prioritize **what exists in the world** before specifying exact controls, minigames, timings, UI, formulas, or implementation details

---

# 0. The design problem

Four Workstations should avoid both extremes:

## Too simple

`Focus -> Coins -> Buy Decoration`

or

`Salvage -> Random Item -> Sell`

The controls are easy, but every result means the same thing, so novelty disappears quickly.

## Too complex

- many independent minigames;
- every facility has its own UI;
- many currencies;
- crafting trees with dozens of generic ingredients;
- separate rules for every object category;
- large daily quest/checklist structures;
- multiple meters that constantly demand attention.

This can create depth, but it fights the desired calm, small-world identity and sharply increases implementation/content cost.

## Target

> **Low Verb, High Discovery** — the player learns a small vocabulary of actions, while the world keeps presenting new objects, states, relationships, consequences, interpretations, and visible changes.

Another phrasing:

> **Simple hands, deep world.**

The player should rarely need to learn a new control scheme merely because a new interesting thing has appeared.

---

# 1. Research lessons

## 1.1 Tiny Glade — few tools, many stories

Pounce Light describes Tiny Glade as a toy-like building experience without management/combat/goals. The game uses procedural "building chemistry": a path crossing a wall can create a door, raising structures causes supports/details to adapt, and the developers describe validating tools by how many stories they can tell.

Lesson:

> Novelty can come from **contextual response and combinations**, not from adding more tools.

References:

- https://store.steampowered.com/app/2198150/Tiny_Glade/
- https://80.lv/articles/exclusive-tiny-glade-developers-discuss-bevy-proceduralism-publishers-cozy-games

## 1.2 Stacklands — one physical language, many relationships

Stacklands compresses village-building into cards. Its primary physical interaction is extremely simple: move/stack cards. New problems and discoveries come from what different cards do when related to each other.

Designer Aran Koning explicitly describes stacking as a way to keep creating new problems while preserving a feeling of simplicity and depth.

Lesson:

> A large possibility space does not require a large input vocabulary if the **relationships between content pieces** are rich.

Reference:

- https://www.gamedeveloper.com/business/how-stacklands-uses-simplicity-to-create-a-compelling-card-based-village-builder

## 1.3 Strange Horticulture — repeated action, changing meaning

The game repeatedly asks the player to identify/use plants. The mechanical language remains narrow, while novelty comes from:

- discovering new plants;
- understanding their properties;
- applying the same collection in new narrative situations;
- choosing which plant to use and seeing consequences;
- gradually understanding a larger mystery.

Lesson:

> Reusing one interaction becomes interesting when the **meaning of the object and situation changes**.

References:

- https://www.gamedeveloper.com/design/finding-right-plant-job-strange-horticulture
- https://www.strangehorticulture.com/

## 1.4 Unpacking — ordinary objects can carry progression

Unpacking has an unusually small mechanical core: take an object out, inspect it through handling, find a place for it. The objects themselves carry character history, change meaning over time, and communicate relationships/environmental narrative.

The developers emphasize subtractive design: do not add features simply because comparable games have them.

Lesson:

> An object can be gameplay content because of **what it means, where it came from, and how it changes**, not only because it has stats.

References:

- https://www.gamedeveloper.com/marketing/unpacking-a-narrative-through-1-000-household-items
- https://www.gamedeveloper.com/design/unpacking-the-design-pillars-of-a-chill-puzzle-game

## 1.5 A Short Hike — small verb set, curiosity-rich world

A Short Hike uses a small set of understandable movement/interaction verbs, while off-path landmarks, characters, small activities, and new access possibilities continuously reward curiosity.

Lesson:

> A world feels larger than its mechanical complexity when the player repeatedly sees something and thinks, "What is that?" or "Can I reach/use that now?"

Reference:

- https://blog.playstation.com/2021/08/05/crafting-a-tiny-open-world-a-look-behind-the-scenes-at-the-creation-of-a-short-hike/

## 1.6 DREDGE — keep the signature action accessible; put risk around it

DREDGE deliberately kept fishing accessible. The developers rejected fuel busywork and did not want the fishing minigames to become frustrating or make-or-break. Tension comes from surrounding world conditions such as time/night, what is found, where the player goes, inventory pressure, and risk.

Lesson:

> The core action does not need to become mechanically harder in order for later play to become more tense or interesting.

Reference:

- https://www.gamedeveloper.com/design/trawling-in-the-deep-how-black-salt-games-made-spooky-fishing-rpg-i-dredge-i-

---

# 2. Where Four Workstations should place complexity

## Keep LOW

- number of core verbs;
- number of control schemes;
- number of independent minigames;
- number of currencies;
- number of persistent meters;
- UI hierarchy depth;
- recipe/crafting-tree size;
- mandatory daily chores;
- one-off rules the player must memorize.

## Allow HIGHER

- variety of things discovered;
- visual/state transformation;
- object meaning;
- object relationships;
- consequences;
- combinations between existing systems;
- environmental storytelling;
- persistent history/traces;
- mystery/reinterpretation;
- asynchronous stranger-world variation.

Core rule:

> **Put complexity in the world, not in the player's hands.**

---

# 3. Proposed world-content families — “what exists”

The first playable world does not need dozens of systems. It needs several **families of interesting things** that can reuse the same small action vocabulary.

These families are content architecture, not separate minigames.

---

## Family A — Recovered Things

Objects retrieved from the Outside / Between.

Not generic loot and not automatically currency.

Possible broad forms:

- recognizable fragments;
- broken mechanisms;
- unknown crafted objects;
- seeds / spores / dormant things;
- soft/organic matter;
- small living or almost-living things;
- objects with impossible geometry/behavior;
- objects apparently related to room architecture;
- objects with no immediate known purpose;
- rare things that later fit Atlas/projects.

The novelty comes from the question:

> **“What did we bring back this time?”**

One salvage behavior can therefore remain interesting for a long time without adding many salvage minigames.

---

## Family B — Things That Do Not Quite Fit the Room

A subset of recovered/encountered objects whose behavior does not fully match normal room rules.

Examples of *content behavior*, not implementation requirements:

- slowly returns to a particular orientation;
- seems heavier/lighter than its size suggests;
- reacts near an edge;
- responds when Atlas moves;
- produces a sound only under a certain room condition;
- refuses to stay on one surface but behaves normally on another;
- casts or reflects something subtly wrong;
- changes after being left near another object;
- causes a nearby ordinary object to behave differently.

These do not need a unique control scheme.

They create novelty because the familiar verbs `retrieve / inspect / place / observe` produce unfamiliar results.

---

## Family C — Things That Grow or Transform

Persistent objects that change through time, care, Focus, proximity, environment, or other world conditions.

Not limited to plants.

Possible forms:

- seed-like growth;
- fungal/soft colony;
- crystalline structure;
- small organism;
- object that unfolds or molts;
- machine-organic hybrid;
- recovered material that gradually becomes stable;
- structure that reacts to the room and develops a unique final form.

The important promise is:

> **The thing you place today may not be the same thing you see later.**

This makes returning to the same room interesting without requiring a new map.

---

## Family D — Room Situations / Anomalies

Temporary or persistent conditions that happen **to the existing room** rather than moving the player into a separate level.

Possible broad categories:

- boundary irregularity;
- wall/floor change;
- gravity/orientation oddity;
- residue/growth;
- device malfunction;
- unusual sound/signal;
- drifting/arriving object;
- living thing escaping/moving;
- Atlas response;
- conflict between two placed objects/conditions.

The novelty comes from:

> **“What is different about our room today?”**

The same room becomes a content generator.

Do not require every anomaly to have its own bespoke minigame.

---

## Family E — Structures / Long-Lived Projects

Physical things the room gradually gains.

Examples:

- Atlas;
- salvage equipment;
- research / analysis surface;
- containment/storage structure;
- cultivation structure;
- boundary anchor;
- stabilized external platform;
- later specialized extension/facility.

Their primary value should be:

> **new capability / new place / new kind of thing that can happen**

rather than only numeric efficiency.

These structures are where world progression becomes visible.

---

## Family F — Traces, Scars, Repairs, and Memory Objects

The world should remember some things that happened.

Possible forms:

- repaired patch;
- worn salvage attachment;
- altered edge surface;
- residue from an old event;
- a strange object retained on display;
- upgraded/replaced component whose previous form remains visible;
- small mark from an experiment;
- room object associated with a particular player/event;
- collected physical evidence of discoveries.

This family does not need a large mechanic.

Its value is persistence:

> **My room looks like this because things happened here.**

This separates Four Workstations from reset-based level design and from pure furniture decorating.

---

## Family G — Atlas / Stranger-World Phenomena

Content that exists because the room belongs to a persistent larger chain.

Possible forms, from early to later progression:

- unexplained signal;
- recurring pattern;
- partial spatial echo;
- stable miniature stranger room;
- visible long-term change in that fixed room;
- indication that this room is being observed;
- later received cross-world trace/event;
- later costly outgoing influence;
- evidence suggesting the larger ring structure.

The novelty comes from a source that local single-player systems cannot produce:

> **another persistent room is changing independently of you.**

This should stay narrow and mysterious rather than becoming a conventional social-media feed.

---

# 4. The novelty matrix — newness without new controls

A new piece of content does not need a new mechanic if it changes one or more of these dimensions:

## 4.1 New Appearance

It looks unlike previous things.

Useful, but weakest on its own.

## 4.2 New State

It grows, cracks, opens, stabilizes, contaminates, sleeps, activates, degrades through use, or changes form.

Stronger because the world evolves.

## 4.3 New Function

An existing-looking thing suddenly becomes useful for another existing system.

Example pattern:

`unknown object -> later discovered Atlas-compatible component`

## 4.4 New Relationship

Two existing things react when near/combined/connected.

This is one of the cheapest ways to multiply discovery.

## 4.5 New Consequence

The same familiar action produces a new kind of outcome or follow-up situation.

## 4.6 New Interpretation

The player learns that something previously understood one way means something else.

Example pattern:

`random Atlas vibration -> repeated signal -> evidence of another room`

This is knowledge progression.

## 4.7 New Social Trace

The change comes from another persistent room rather than local authored content.

This creates freshness without requiring an entirely new gameplay system.

---

# 5. Recommended player verb budget — concept level only

Do not freeze exact controls yet.

The current world can plausibly remain rich with a small family of reusable verbs such as:

- **Focus / Commit**
- **Retrieve**
- **Inspect / Observe**
- **Place / Arrange**
- **Build / Repair**
- **Rest / Watch**

Later Atlas capabilities can extend `Observe` and `Influence` without multiplying unrelated interaction languages.

Important rule:

> A new interesting object should **usually reuse an existing verb**.

If every new object demands a new minigame, the content architecture has failed.

---

# 6. What makes this different from “too simple”

A shallow system gives one meaning to each verb:

`Retrieve -> item -> sell`

A richer low-verb system allows:

```text
Retrieve
-> ordinary useful fragment
-> unknown artifact
-> living thing
-> growth object
-> dangerous/misfit object
-> Atlas-relevant piece
-> clue
-> room situation
```

The control remains simple.

The **question after the action** keeps changing.

Likewise:

```text
Inspect
-> identify
-> discover property
-> discover relationship
-> discover risk
-> discover that previous interpretation was wrong
```

And:

```text
Place
-> decorate
-> display memory
-> trigger relationship
-> cultivate
-> stabilize
-> unintentionally create situation
```

This is the intended source of depth.

---

# 7. What makes this different from “too complex”

Do not automatically add:

- a chemistry UI for every strange object;
- a separate farming UI for growth things;
- a separate fishing progression tree;
- a separate anomaly combat mode;
- five quality rarities + elemental affinities + random affixes;
- ten crafting materials;
- three research currencies;
- hunger/thirst/sanity/happiness meters;
- facility-specific currencies;
- unique controls for each Atlas phase.

Those are common ways to increase content, but they increase cognitive and production complexity faster than they increase wonder.

Preferred design:

> **One room, a few verbs, many things worth wondering about.**

---

# 8. Content selection test

When proposing a new feature/content family, ask:

1. Does this add something the player can **notice / discover / care about**?
2. Can it mostly use an existing verb?
3. Does it create a new state, relationship, consequence, interpretation, or persistent trace?
4. Can it visibly affect the room?
5. Does it connect to at least one existing world system rather than living in a sealed mini-game?
6. Would it still be interesting without adding another currency?
7. Would a screenshot communicate that something unusual is happening?

Strong candidate:

> mostly “yes”.

Weak candidate:

> requires a new menu, currency, progression tree, and tutorial but does not create a strong new world situation.

---

# 9. Recommended content priority

The project should currently prioritize **families with high recombination value**, not detailed implementations.

Strongest current set:

1. Recovered Things
2. Misfit / Reactive Things
3. Growing / Transforming Things
4. Room Situations / Anomalies
5. Long-Lived Structures / Projects
6. Traces / Memory / Repairs
7. Atlas / Stranger-World Phenomena

These seven families are enough to create a world that feels much broader than its input complexity.

They can all coexist inside one small persistent room.

---

# 10. One-sentence direction

> **Four Workstations should not continually teach the player new ways to press buttons; it should continually give the player new reasons to care about what happens after pressing the same few buttons.**

Or more simply:

> **少动词，高发现；少系统，高结果差异。**

No implementation is authorized by this document.
