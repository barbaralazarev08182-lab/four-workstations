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

## 1.2 Important new long-term function

At a sufficiently advanced construction stage, the central platform should gain the ability to display a **miniature model of another room belonging to a stranger**.

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

## 2.2 First interaction boundary

The first version of room-to-room connection should be **observation only**.

At this stage the observing player may:

- see the linked stranger room as a miniature;
- observe its visible state;
- observe what is happening there to the degree later supported by the system.

At this stage the observing player may **not**:

- modify the other room;
- change its objects;
- directly transmit information to that room through this system;
- otherwise interfere with the other player's space.

This boundary is intentional. Deeper interaction can be designed later.

## 2.3 Why anonymity + persistence matter

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
- indirect social presence without requiring prior relationships.

These are design intentions to investigate, not yet measurable acceptance criteria.

## 2.4 Open questions

The following are still undecided:

- whether every room has exactly one outgoing and one incoming room link;
- whether the chain is directional or can be traversed/observed both ways;
- how new rooms enter the closed chain while preserving persistent adjacency;
- how deleted or permanently inactive rooms leave the chain;
- what happens to neighboring links when a room must be removed from the chain;
- whether offline rooms remain observable;
- whether the system links player accounts or room instances as the canonical node;
- whether one central platform can ever reveal more than the immediate linked room;
- how live the miniature representation should be;
- what exact room state is important enough to synchronize;
- whether identity is hidden, partially visible, or eventually discoverable;
- what later interaction between neighboring stranger rooms should exist;
- whether future systems allow messages, gifts, exchanges, visits, cooperative actions, or other forms of contact.

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

- **Center** — shared construction and persistent anonymous connection to another room in the global chain.
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
- later observation of a fixed linked stranger room;
- physical manifestation of the fact that the player's room belongs to a larger anonymous world-chain.

Still open:

- whether it is the primary long-term progression object of the whole room;
- how much of the game's room-to-room relationship should pass through it;
- how construction stages relate to newly unlocked capabilities.

## 8.2 What makes observing the same stranger room repeatedly interesting?

This question is now specifically about **persistent familiarity with an initially unknown room**.

The player is not expected to receive a disposable new random room every day. Instead, the same linked stranger room remains present long enough for its identity and changes to accumulate meaning.

The project must eventually identify which visible changes make that persistent neighboring room worth checking again.

Possible categories to investigate later include room activity, construction state, player presence, room expansion, decoration/state changes, unusual events, or other persistent differences.

These are research directions, not approved requirements.

The key question is:

> What can change in a fixed stranger room so that the player gradually recognizes it and becomes curious about its continuing life, without turning the relationship into a conventional friend system?

## 8.3 What does the Ouroboros chain mean to the player?

The global closed-chain idea can exist as backend topology, as visible world lore, or both.

Still open:

- whether players know explicitly that all rooms form a closed loop;
- whether they can ever perceive rooms beyond their immediate neighbor;
- whether moving through/along the chain becomes possible later;
- whether the chain has direction;
- whether the closed-loop structure has any gameplay consequence beyond fixed adjacency/observation.

The Ouroboros structure itself and persistent stranger adjacency are now part of the current design direction; their player-facing expression is not yet frozen.

## 8.4 What is outside the room?

A complete lore answer is not currently required.

However, future design will eventually need enough spatial logic to support several ideas consistently:

- exposed floor edges;
- sitting at those edges;
- lowering a line into an unseen space;
- expanding platforms outward;
- observing other rooms through the central structure;
- the concept that many separated rooms still belong to one connected world structure.

No answer is frozen yet.

## 8.5 How should the room visually grow over months of use?

Two different forms of growth are now visible:

1. existing structures become progressively more complete/refined;
2. the physical room boundary may expand outward with new platforms/structures.

The balance between these two forms of long-term growth remains open.

---

# 9. Relationship to existing Project Atlas planning

Existing VQ2 planning described Project Atlas primarily as the central shared construction project.

This discussion adds an important possible long-term destination:

> The shared central construction may eventually become the mechanism through which each room observes a persistently linked stranger room in a global Ouroboros-like chain. The stranger adjacency is assigned without a pre-existing social relationship and then remains fixed.

This should be treated as a meaningful extension of the Atlas concept, but **not yet as an implementation specification**.

The existing near-term Atlas Greybox work should therefore not automatically implement global room topology, matchmaking, room networking, realtime observation, Supabase room mirroring, final art, or deep social interaction merely because this concept now exists.

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
- later miniature observation of a **stranger room**, not a friend room;
- the stranger-room adjacency is **randomly assigned initially, then fixed/persistent**;
- all rooms conceptually linked into an **Ouroboros-like closed chain** rather than a friendship graph or rotating discovery feed;
- observation-only as the first room-to-room interaction stage;
- replacing sofa-style rest with sitting on an open floor edge;
- exploring a fishing-like action into the unknown from the other edge;
- physical wall board for tasks/messages/information;
- possible future platform/room expansion from the existing floor boundary.

### B. Open design space

Exact rules for chain direction, chain insertion/removal, room identity exposure, offline behavior, networking, rewards, lore, expansion topology, messages, visiting, object transfer, and retrieved items remain open.

### C. Explicitly superseded interpretation

Do **not** describe the room-observation system as a friend-world viewer, friend-list extension, or a random room that refreshes every day/session.

The intended structure is anonymous stranger linkage with persistent adjacency inside a global closed room chain.

### D. Implementation

No implementation work should begin from this concept document until a later discussion explicitly promotes a subset of these ideas into an implementation Gate.
