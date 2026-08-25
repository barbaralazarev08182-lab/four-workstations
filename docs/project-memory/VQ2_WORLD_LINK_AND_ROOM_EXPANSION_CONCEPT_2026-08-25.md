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

At a sufficiently advanced construction stage, the central platform should gain the ability to display a **miniature model of another player's room**.

The intended experience is:

- the player remains inside their own room;
- the central structure presents another room as a miniature spatial model;
- the player can visually observe that room and what is happening there;
- the observed room represents another real player / room state rather than being only decorative fiction.

The purpose of this idea is to connect players and rooms without requiring everyone to occupy the same physical game space.

This is currently one of the most important long-term product concepts under discussion.

---

# 2. Room-to-room observation: first interaction boundary

## 2.1 Current first-stage rule

The first version of room-to-room connection should be **observation only**.

At this stage the observing player may:

- see another player's miniature room;
- observe its visible state;
- observe what is happening there to the degree later supported by the system.

At this stage the observing player may **not**:

- modify the other room;
- change its objects;
- directly transmit information to that room through this system;
- otherwise interfere with the other player's space.

This boundary is intentional. Deeper interaction can be designed later.

## 2.2 Open questions

The following are not decided yet:

- how another room is selected;
- whether the target is a friend, a known room, a random room, or another relationship;
- whether one or several miniature rooms can be viewed;
- whether the observed room must currently be online;
- how live the representation should be;
- what exact room state is important enough to synchronize;
- what later interaction between rooms should exist;
- whether future systems allow messages, visits, gifts, exchanges, cooperative actions, or other forms of contact.

Do not treat any of those possibilities as approved features yet.

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

- **Center** — shared construction and future observation of other rooms.
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
- later observation of another room.

Still open:

- whether it is the primary long-term progression object of the whole room;
- how much of the game's room-to-room relationship should pass through it;
- how construction stages relate to newly unlocked capabilities.

## 8.2 What makes observing another room repeatedly interesting?

The project must eventually identify which visible changes carry social value.

Possible categories to investigate later include room activity, construction state, player presence, room expansion, decoration/state changes, or other persistent differences.

These are research directions, not approved requirements.

The key question is:

> What does a player genuinely want to notice when looking at another real player's miniature room?

## 8.3 What is outside the room?

A complete lore answer is not currently required.

However, future design will eventually need enough spatial logic to support several ideas consistently:

- exposed floor edges;
- sitting at those edges;
- lowering a line into an unseen space;
- expanding platforms outward;
- observing other rooms from the central structure.

No answer is frozen yet.

## 8.4 How should the room visually grow over months of use?

Two different forms of growth are now visible:

1. existing structures become progressively more complete/refined;
2. the physical room boundary may expand outward with new platforms/structures.

The balance between these two forms of long-term growth remains open.

---

# 9. Relationship to existing Project Atlas planning

Existing VQ2 planning described Project Atlas primarily as the central shared construction project.

This discussion adds an important possible long-term destination:

> The shared central construction may eventually become the mechanism through which a room can visually observe another player's miniature room.

This should be treated as a meaningful extension of the Atlas concept, but **not yet as an implementation specification**.

The existing near-term Atlas Greybox work should therefore not automatically implement room networking, realtime observation, Supabase room mirroring, final art, or deep social interaction merely because this concept now exists.

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
- later miniature observation of another player's room;
- observation-only as the first room-to-room interaction stage;
- replacing sofa-style rest with sitting on an open floor edge;
- exploring a fishing-like action into the unknown from the other edge;
- physical wall board for tasks/messages/information;
- possible future platform/room expansion from the existing floor boundary.

### B. Open design space

All exact rules for networking, rewards, lore, expansion topology, room selection, messages, visiting, object transfer, and retrieved items remain open.

### C. Implementation

No implementation work should begin from this concept document until a later discussion explicitly promotes a subset of these ideas into an implementation Gate.
