# VQ2 World Link & Room Expansion Concept

> Date: 2026-08-25  
> Status: CONCEPT / DISCUSSION IN PROGRESS  
> Scope: product/world design only; no implementation authorization  
> Source: direct user design discussion on 2026-08-25

This document records an important extension of the Four Workstations product direction. It is intentionally separated into **accepted/current ideas** and **open questions** so later planning does not accidentally turn exploratory thoughts into frozen rules.

The project is currently paused from implementation while these concepts are discussed in more detail.

---

# 1. Central platform as a shared construction object

## 1.1 Current idea

The existing circular platform located between the four workstations should become something that players can gradually build together.

Key rules currently intended:

- The system must work for **one player** as well as multiple players.
- Four simultaneous players are **not required**.
- Multiple players may contribute to the same construction.
- The platform should visibly become more complete and more refined through construction stages.
- Progress should therefore be expressed as a **physical/world transformation**, not only as a numeric level.

This remains compatible with the existing 1–4 player rule: additional players may accelerate or enrich progress, but solo play must remain viable.

## 1.2 Observation must be earned through construction

The linked stranger room should **not be visible from the beginning**.

Current intended progression:

1. The room begins with an incomplete central platform / device.
2. Players gradually construct and refine it.
3. Only after the platform reaches a sufficient construction stage does the ability to reveal another world become available.
4. At first, the newly revealed external-room function is **observation only**.
5. At later construction/progression stages, the project may unlock ways to influence the linked world.

This means the first appearance of another real player's world is itself a progression reward and a major world-expansion moment, rather than a default menu feature available on day one.

The exact construction threshold, number of stages, pacing, and resource requirements are still open.

## 1.3 Important long-term function

At the observation-unlock stage, the central platform should display a **miniature model of another room belonging to a stranger**.

The intended experience is:

- the player remains inside their own room;
- the central structure presents another room as a miniature spatial model;
- the target room is not selected from a friend list;
- the target belongs to a stranger in the wider Four Workstations world;
- the stranger-room relationship is **randomly assigned when the room enters the chain, then remains fixed/persistent**;
- the player can visually observe that room and what is happening there;
- the observed room represents another real room state rather than being only decorative fiction.

The purpose of this idea is to connect otherwise unrelated player rooms into one larger world structure without requiring everyone to occupy the same physical game space.

This is currently one of the most important long-term product concepts under discussion.

---

# 2. Anonymous room chain — Ouroboros topology

## 2.1 Current topology idea

The intended social/world structure is **not a friend graph**.

The current user-stated direction is:

> Rooms belonging to strangers are linked together globally like a snake biting its own tail — an Ouroboros-like closed chain.

The important properties currently intended are:

- the connected room belongs to a **stranger**, not a chosen friend;
- the stranger connection is initially assigned without a pre-existing social relationship;
- once the chain relationship is established, it is **fixed rather than periodically reshuffled**;
- the player should therefore continue seeing the same neighboring stranger room instead of receiving a new random room every day/session;
- players do not manually choose a known social target as the core behavior;
- all participating rooms conceptually belong to one continuous closed world-link structure;
- following the chain far enough would conceptually return to the starting point.

This creates a very different social feeling from a conventional friend list, guild, lobby, public MMO map, or random-content feed.

The current concept is closer to:

`Room A -> Room B -> Room C -> ... -> Room N -> Room A`

where the rooms are occupied by otherwise unrelated players / groups, and the neighbor relation persists.

The exact technical graph implementation is **not frozen** yet. The diagram above records the intended mental model: a global closed chain with persistent stranger adjacency rather than a friendship network or a rotating random-room feed.

## 2.2 First interaction boundary — observation only

When the external-room function first unlocks, it should be **observation only**.

At this stage the observing player may:

- see the linked stranger room as a miniature;
- observe its visible state;
- observe what is happening there to the degree later supported by the system.

At this stage the observing player may **not**:

- modify the other room;
- change its objects;
- directly transmit information to that room through this system;
- otherwise interfere with the other player's space.

This boundary is intentional. Deeper interaction belongs to later progression.

## 2.3 The observed room knows it is being observed, but not by whom

A new explicit rule is now part of the current design direction:

> When one room is actively observing another room through the world-link system, the observed room can know that it is being observed, but it does not know the identity of the observer.

Therefore:

- observation is **not invisible surveillance**;
- the target receives some form of awareness that an external room is currently looking in / connected through observation;
- the observer's account, room identity, name, or exact origin is not revealed at this stage;
- anonymity remains preserved even though observation itself is perceptible.

The exact visual/audio/UI expression of “someone is observing this room” is not decided yet.

This rule reinforces the ring concept: each room exists inside a larger connected structure, but the people occupying adjacent nodes do not begin with conventional social identity disclosure.

## 2.4 Why anonymity + persistence matter

The current concept should not be interpreted as “friends, but selected randomly.”

The anonymity / stranger relationship is part of the idea itself, and persistence is also part of it.

The intended tension is:

> At first the neighboring room is unknown, but because the link remains fixed, that unknown room can gradually become recognizable through repeated observation.

Potential experiential qualities to protect during later design discussion include:

- curiosity about an unknown room;
- accidental discovery without a friend-selection step;
- gradual familiarity with the same stranger room over time;
- noticing long-term changes in that room;
- awareness that many other small rooms exist beyond one's own;
- a sense that one's room is one fixed node in a much larger continuous world;
- indirect social presence without requiring prior relationships;
- the subtle tension of knowing that an unknown room may also be aware when observation is happening.

These are design intentions to investigate, not yet measurable acceptance criteria.

## 2.5 Later progression: costly influence on another world

The project now has another explicit long-term direction:

> After observation has existed as the initial room-to-room capability, later progression should eventually allow a player/room to **influence the linked stranger world** in some way.

This influence is **not free**.

A fundamental rule is:

> Affecting another world must require a meaningful cost, sacrifice, resource expenditure, risk, cooldown, opportunity cost, or other form of price.

The reason for the cost is not yet formalized, but the design intent is clear: influencing another person's persistent room should feel consequential rather than becoming frictionless spam.

At this point, the following are **not decided**:

- what “influence” actually means;
- whether influence is always helpful, neutral, ambiguous, or can have negative consequences;
- whether it changes objects, environment, events, resources, temporary states, or something else;
- whether the effect is immediate or delayed;
- whether the target can refuse, resist, redirect, or respond;
- whether repeated influence creates a relationship over time;
- what exact cost is paid;
- whether the cost comes from Coins, Build Charge, a new scarce resource, time, progression, a constructed device, or another system;
- whether influence reveals any additional information about the observer.

Do not infer conventional messaging, gifting, griefing, PvP, or direct object editing from the word “influence.” Those remain separate possibilities and are not approved.

## 2.6 Open topology/system questions

The following are still undecided:

- whether every room has exactly one outgoing and one incoming room link;
- whether the chain is directional or can be observed/influenced both ways;
- how new rooms enter the closed chain while preserving persistent adjacency;
- how deleted or permanently inactive rooms leave the chain;
- what happens to neighboring links when a room must be removed from the chain;
- whether offline rooms remain observable;
- whether influence can occur while the target is offline;
- whether the system links player accounts or room instances as the canonical node;
- whether one central platform can ever reveal more than the immediate linked room;
- how live the miniature representation should be;
- what exact room state is important enough to synchronize;
- whether identity is always hidden, partially visible later, or eventually discoverable;
- what later interaction between neighboring stranger rooms should exist beyond the general “costly influence” direction.

Do not silently turn any of these open questions into implementation requirements.

---

# 3. Open floor edge as a rest location

## 3.1 Existing spatial condition

The current room has:

- one floor plane;
- two walls;
- two exposed/open sides without walls.

Rather than automatically filling or closing these open sides, the current design idea is to make at least one open edge directly usable by the characters.

## 3.2 Current rest concept

The sofa can be removed from the long-term room design.

Instead, when a character wants to rest, the character can sit directly on the exposed floor edge, similar to sitting at the side of a cliff:

- body remains on the room floor;
- legs can hang over the open edge;
- the open boundary itself becomes part of the room's usable space.

This is intended to make the unusual two-wall / two-open-side room structure more interesting rather than treating it as an unfinished conventional office.

## 3.3 Open questions

Not decided yet:

- whether edge sitting is purely an idle/rest action or has gameplay consequences;
- how many characters can sit together;
- whether several sitting poses exist;
- whether time-of-day or player state changes the behavior;
- exact animation, anchor, pathfinding, and safety rules.

The concept is currently spatial/product design only.

---

# 4. Second open edge: a fishing-like interaction into the void

## 4.1 Current idea

The other open floor edge may support an activity structurally similar to fishing.

The important idea is the action, not conventional fishing content:

1. the player/character uses the open edge;
2. a line or similar object is lowered or cast outward/downward;
3. the line disappears into the unknown/void outside the room;
4. something may later be retrieved;
5. what is retrieved is **not a fish**.

The exact meaning and reward are intentionally unresolved.

## 4.2 Design caution

For now this should **not** be prematurely defined as a traditional fishing system.

The current concept is more general:

> The player can reach from the room boundary into an unseen space and retrieve something from it.

This distinction should be preserved until the purpose of the mechanic is clearer.

## 4.3 Open questions

Not decided yet:

- what can be retrieved;
- why those objects exist outside the room;
- whether results are random;
- whether this relates to collection, construction, decoration, progression, narrative, or another system;
- whether it has economic value;
- whether it connects to other players or rooms;
- whether there is timing, rarity, failure, or a minigame;
- what the external/void space actually represents.

No economy or reward loop should be inferred yet.

---

# 5. Physical wall board for tasks / information

## 5.1 Current idea

A wall can contain a physical clickable information surface, such as:

- a blackboard;
- notice board;
- clipboard-like board;
- another room-native information object.

Clicking it may allow the player to inspect information such as:

- tasks;
- messages;
- other useful room/system information.

The exact information architecture is not decided.

## 5.2 Open questions

Not decided yet:

- whether this is mainly a task board or a broader information hub;
- which information belongs here instead of in normal UI;
- whether content is personal, room-level, system-level, or social;
- whether the board itself changes/upgrades over time.

---

# 6. Future room-floor expansion

## 6.1 Current idea

In the future, players may be able to expand outward from the current floor boundary.

Possible expression:

- construct a small additional platform from an existing edge;
- use that new platform for an interesting structure, facility, or activity.

The important direction is that the current room may eventually **grow spatially** rather than requiring an immediate move to a completely different map.

## 6.2 Open questions

Not decided yet:

- whether expansion is free-form or uses fixed attachment points;
- how many expansion points exist;
- maximum size;
- which directions are allowed;
- which buildings/facilities can be constructed;
- what resources or progression are required;
- whether different rooms can develop visibly different silhouettes;
- how expansion interacts with the frozen office camera, lighting, navigation, character routes, and composition.

Because these questions can affect major technical and visual architecture, no implementation should begin from assumptions about them.

---

# 7. Current spatial-system picture

Without freezing any world lore, the current concepts already create a useful spatial division:

- **Center** — shared construction; later unlock of persistent anonymous observation; eventually possible costly influence on the linked room.
- **Open edge A** — character rest / edge sitting.
- **Open edge B** — interaction with an unknown space through the fishing-like action.
- **Walls** — physical access point for tasks/messages/information.
- **Outer boundary** — possible future room/platform expansion.

This is useful because different parts of the existing small room can gain distinct purposes instead of solving long-term depth mainly by adding more maps.

This also aligns with the current project principle that the small Office should first become a dense, stateful, interactive world before new areas are used as the primary solution to shallow gameplay.

---

# 8. Product questions that should be discussed before implementation

The following questions are currently more important than Unity implementation details.

## 8.1 What should the central platform ultimately mean?

Already present:

- shared construction;
- visible physical progression;
- observation only unlocks after sufficient construction;
- later observation of a fixed linked stranger room;
- the target knows it is being observed but does not know who the observer is;
- later progression should support some form of costly influence on the linked world;
- the device physically manifests the fact that the player's room belongs to a larger anonymous world-chain.

Still open:

- whether it is the primary long-term progression object of the whole room;
- exact construction stages;
- how quickly the first external world becomes visible;
- how much of the game's room-to-room relationship should pass through it;
- which later capabilities unlock from additional construction stages.

## 8.2 What makes observing the same stranger room repeatedly interesting?

This question is specifically about **persistent familiarity with an initially unknown room**.

The player is not expected to receive a disposable new random room every day. Instead, the same linked stranger room remains present long enough for its identity and changes to accumulate meaning.

The project must eventually identify which visible changes make that persistent neighboring room worth checking again.

Possible categories to investigate later include room activity, construction state, player presence, room expansion, decoration/state changes, unusual events, or other persistent differences.

These are research directions, not approved requirements.

The key question is:

> What can change in a fixed stranger room so that the player gradually recognizes it and becomes curious about its continuing life, without turning the relationship into a conventional friend system?

## 8.3 What should “being observed” feel like?

The target is explicitly aware of observation, while observer identity remains hidden.

Future design needs to determine the emotional tone of that awareness.

It could feel:

- curious;
- slightly mysterious;
- socially present;
- potentially tense;
- reassuring that another world is out there.

No exact presentation is approved yet.

Important constraint:

> The awareness mechanic should communicate connection without accidentally making the system feel like covert surveillance or harassment.

## 8.4 What kind of influence is worth paying for?

Because later cross-world influence must have a cost, the effect needs enough meaning to justify that cost.

Future design should compare categories such as:

- subtle environmental changes;
- temporary events;
- beneficial assistance;
- ambiguous surprises;
- persistent traces;
- changes that create a response opportunity.

These are discussion categories only.

The core unresolved question is:

> What can one anonymous neighboring room do to another that feels meaningful, visible, and worth a price, while still respecting ownership of the target room?

## 8.5 What does the Ouroboros chain mean to the player?

The global closed-chain idea can exist as backend topology, as visible world lore, or both.

Still open:

- whether players know explicitly that all rooms form a closed loop;
- whether they can ever perceive rooms beyond their immediate neighbor;
- whether moving through/along the chain becomes possible later;
- whether the chain has direction;
- whether influence follows the same direction as observation;
- whether the closed-loop structure has any gameplay consequence beyond fixed adjacency/observation/influence.

The Ouroboros structure itself and persistent stranger adjacency are now part of the current design direction; their player-facing expression is not yet frozen.

## 8.6 What is outside the room?

A complete lore answer is not currently required.

However, future design will eventually need enough spatial logic to support several ideas consistently:

- exposed floor edges;
- sitting at those edges;
- lowering a line into an unseen space;
- expanding platforms outward;
- observing other rooms through the central structure;
- the concept that many separated rooms still belong to one connected world structure.

No answer is frozen yet.

## 8.7 How should the room visually grow over months of use?

Two different forms of growth are now visible:

1. existing structures become progressively more complete/refined;
2. the physical room boundary may expand outward with new platforms/structures.

The balance between these two forms of long-term growth remains open.

---

# 9. Relationship to existing Project Atlas planning

Existing VQ2 planning described Project Atlas primarily as the central shared construction project.

This discussion adds an important long-term progression path:

> Build the shared central structure -> reach a sufficient stage -> reveal a persistently linked stranger room -> initially observe only -> later unlock a costly ability to influence that linked world.

The stranger adjacency is assigned without a pre-existing social relationship and then remains fixed.

The observed room knows that observation is occurring, while the observer's identity remains hidden.

This should be treated as a meaningful extension of the Atlas concept, but **not yet as an implementation specification**.

The existing near-term Atlas Greybox work should therefore not automatically implement global room topology, matchmaking, room networking, realtime observation, observation notifications, cross-world influence, Supabase room mirroring, final art, or deep social interaction merely because this concept now exists.

The concept needs further product discussion first.

---

# 10. Current development status / guardrail

Development is intentionally paused while these ideas are discussed.

This document does **not** authorize changes to:

- Unity production scenes;
- frozen Office Camera;
- workstation layout;
- Day or Night lighting baselines;
- character routes/anchors;
- Supabase integration;
- economy;
- final Atlas art;
- gameplay code.

No open question in this document should be silently converted into a development requirement.

---

# 11. Memory rule for future conversations

When this topic returns, future planning should distinguish three levels:

### A. User-stated current direction

Treat the following as the current strongest ideas:

- shared gradual construction of the central platform;
- solo-compatible construction;
- **another world does not appear immediately; the platform must first be built to a sufficient stage**;
- later miniature observation of a **stranger room**, not a friend room;
- the stranger-room adjacency is **randomly assigned initially, then fixed/persistent**;
- all rooms conceptually linked into an **Ouroboros-like closed chain** rather than a friendship graph or rotating discovery feed;
- the first unlocked cross-world capability is **observation only**;
- the **observed room knows it is being observed, but does not know who the observer is**;
- later progression should unlock **some way to influence the linked stranger world**;
- **cross-world influence must carry a meaningful cost**;
- replacing sofa-style rest with sitting on an open floor edge;
- exploring a fishing-like action into the unknown from the other edge;
- physical wall board for tasks/messages/information;
- possible future platform/room expansion from the existing floor boundary.

### B. Open design space

Exact rules for construction thresholds, chain direction, chain insertion/removal, observation presentation, room identity exposure, offline behavior, networking, the form/cost/consequences of influence, rewards, lore, expansion topology, messages, visiting, object transfer, and retrieved items remain open.

### C. Explicitly superseded interpretation

Do **not** describe the room-observation system as a friend-world viewer, friend-list extension, a random room that refreshes every day/session, or an anonymous observation system in which the target has no awareness of being watched.

The intended structure is anonymous stranger linkage with persistent adjacency inside a global closed room chain, with visible awareness of observation but hidden observer identity.

### D. Implementation

No implementation work should begin from this concept document until a later discussion explicitly promotes a subset of these ideas into an implementation Gate.
