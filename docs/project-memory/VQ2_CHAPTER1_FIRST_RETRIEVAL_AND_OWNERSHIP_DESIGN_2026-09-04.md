# VQ2 Chapter 1 — First Retrieval & First Ownership Design — 2026-09-04

> Status: DESIGN PROPOSAL / NOT YET USER-LOCKED
>
> Purpose: deepen the Chapter 1 first-hour gameplay blueprint by defining the two strongest retention anchors that still need concrete design: (1) the player's first meaningful ownership choice inside the refuge and (2) the first complete Retrieval object/loop.
>
> Authority note: the user's confirmed feedback is that the current story is strong but the first-hour gameplay is not yet sufficient for retention. The specific solutions in this document are proposals until explicitly accepted.

---

## 1. First-hour retention target

By the end of Chapter 1, the player should strongly feel all three of the following:

1. **I want to keep changing this room.**
2. **I want to perform Retrieval again.**
3. **I want to understand what exists outside.**

The opening should therefore not rely on lore curiosity alone. It must produce ownership, mechanical curiosity, and world curiosity in parallel.

The first hour should complete at least one full loop:

`Inhabit -> Retrieve -> Inspect -> Use/Place -> Observe -> Reinterpret`

The player should not have to wait until Chapter 2 to play the core game.

---

## 2. First ownership event — recommended direction

### 2.1 Design goal

The first personal choice should make the room visibly different within the first 10–15 minutes.

It should:

- happen through physical interaction rather than a long menu;
- use the room/build-space itself as the interface where possible;
- be reversible or low-risk so a new player cannot make a bad permanent choice;
- create a visible before/after state;
- teach that this refuge is not a fixed level: it is the player's persistent home;
- avoid opening a full inventory/catalog/economy system during the current design phase.

### 2.2 Recommended structure: First Living Corner

The starter crate contains several simple domestic modules, but the refuge initially has enough stable local capacity to fully activate only one small living setup before the first Retrieval.

The player physically chooses where to establish the first living corner and which starter function to prioritize.

Recommended three starter directions:

- **Rest** — a simple resting module / recliner / bed-adjacent setup with a warm local light.
- **Work** — a compact work surface / tool station with practical local illumination.
- **Observe** — a chair / small console oriented toward the open Outside view.

These are not intended as permanent classes or exclusive branches.

The choice should mainly answer:

> What does this player make important first when given an empty refuge?

The other starter options should become available soon enough that the player does not feel punished for the initial choice.

### 2.3 Spatial choice matters as much as functional choice

The player should also choose where the first setup sits inside the 20×20 room.

This is valuable because:

- it uses the already accepted Build Grid logic;
- it produces a room state unique to the player's placement;
- it immediately teaches that position is meaningful;
- the same chapter will later place a Retrieved object into this personalized space.

The first placement interaction should remain simple. It should not require opening the full future build catalog.

### 2.4 Immediate feedback

Once placed/activated:

- a local warm light comes on;
- the module becomes usable;
- the nearby floor/wall lighting composition changes;
- the guide drone acknowledges the player's choice without judging it;
- the room should visibly progress from "delivered refuge" toward "occupied home."

The purpose is not a stat bonus. The reward is ownership and visible transformation.

---

## 3. First Retrieval object — recommended direction

### 3.1 Core rule

The first Retrieved object should be:

> **mostly understandable enough to be useful, but partly impossible to classify.**

It should not be a pure collectible, pure lore key, pure resource chunk, or immediately dangerous lifeform.

The first Retrieval must teach that Outside objects can have multiple values at the same time.

### 3.2 Working design: Composite Debris with Anomalous Core

Working identifier only:

`FRO-01 — First Retrieval Object`

Do not treat this as final lore naming.

Physical concept:

- roughly hand-to-torso-scale recovered debris;
- clearly artificial, but not visually attributable to a named faction;
- outer body made from a damaged composite/metal/ceramic shell;
- visible fracture or opening reveals a much smaller internal structure;
- the shell is ordinary enough for the refuge systems to recognize as usable matter;
- the internal structure cannot be classified or recycled normally.

The object therefore has two readable layers:

**Outer shell = utility.**

**Inner core = mystery.**

### 3.3 Why this is better than a simple resource rock

A plain mineral teaches only:

> Retrieval gives resources.

A pure mysterious artifact teaches only:

> Retrieval gives lore objects.

FRO-01 teaches both at once:

> Outside can keep my home alive, and Outside can bring something into my home that I do not understand.

This is the intended VQ2 identity.

### 3.4 No harsh first-hour moral trap

Do not force the new player into a permanent "destroy it or preserve it" choice on the first Retrieval.

Recommended first-hour behavior:

- the recognized outer shell can be safely processed / partially converted into usable material or stability support;
- the anomalous inner core automatically remains because the system cannot process it;
- the player therefore receives practical benefit **and** keeps the mystery object.

Later chapters can introduce genuinely difficult choices where preserving an object conflicts with resource value.

The first hour should teach the concept before testing the player morally.

---

## 4. First Retrieval — playable interaction proposal

### 4.1 Avoid a fishing minigame

The Retrieval Station may visually evoke a tether/fishing relationship, but the first interaction should not become:

- timing bars;
- bait systems;
- button-mashing;
- random bite windows;
- QTE tension meters;
- loot rarity fireworks.

The game remains Low Verb / High Discovery.

### 4.2 Recommended first Retrieval control sequence

The first full Retrieval can be built around a small number of verbs:

1. **Observe / scan** — identify a nearby target outside the refuge.
2. **Aim / choose direction** — point the Orb toward the target.
3. **Deploy** — Orb leaves the Station and tether begins extending.
4. **Cross** — Orb passes through the Atlas boundary; the boundary briefly becomes visible through refraction/ripple.
5. **Approach** — player guides or directs the Orb through real 3D Outside space.
6. **Connect** — one deliberate interaction establishes a physical link with the object.
7. **Retrieve** — Station retracts the tether while the player observes the object coming closer.
8. **Receive** — object crosses the Atlas boundary and physically lands/settles inside the room.

The depth should come from observing the world and later target behavior, not from arbitrary dexterity checks.

### 4.3 The Atlas opening cost must be felt, not explained by HUD

During the first boundary breach:

- selected room lights dip slightly;
- Power Hub output visibly changes;
- a low structural/audio response appears;
- comfort systems may briefly reduce output;
- Atlas boundary shows a short-lived visual disturbance;
- after closure, the refuge slowly recovers rather than snapping instantly back.

Avoid a large tutorial popup saying "Energy -12" unless later UI design explicitly requires it.

The player's conclusion should be:

> Opening this world costs something.

### 4.4 Physical return is the reward moment

The most important moment is not a loot panel.

The object should visibly travel all the way back and become a real object in the player's room.

Desired sequence:

`tether tension -> object crosses boundary -> cable retracts -> object reaches station/room -> physical contact with floor/platform -> room acoustics react`

The player should be able to walk around it immediately.

This is one of the project's core differentiators.

---

## 5. Inspect -> Use -> Place loop

After retrieval, the player should not immediately receive a text description containing the answer.

Recommended process:

### Stage A — visual inspection

The player notices:

- exterior damage;
- unfamiliar construction;
- recognizable salvageable shell;
- internal structure that looks materially different.

### Stage B — refuge analysis

The local system can identify only part of it.

Example information hierarchy:

- outer shell: usable matter / recoverable structural material;
- internal core: no reliable classification;
- origin: unknown;
- faction: unknown;
- danger: no immediate known active hazard, but not fully understood.

### Stage C — practical use

Part of the shell is converted/allocated toward one small improvement.

Strong recommendation:

> The first Retrieval should provide enough usable material or stability margin to activate the next domestic improvement that was unavailable before Retrieval.

This makes the loop immediately legible:

`go outside -> bring something home -> home gets better`

### Stage D — persistent mystery

The anomalous core remains physically present.

The player chooses where to place/store it, or the system initially places it in a safe inspection location and later allows repositioning.

It should remain in the room after the tutorial sequence ends.

---

## 6. Proposed subtle behavior of the anomalous core

The core should not immediately speak, open a portal, display a lore cutscene, or reveal a faction.

Recommended behavior is much smaller:

- normally inert;
- at specific moments, changes orientation / brightness / internal pattern very slightly;
- may react weakly to Atlas;
- may react to the later first-hour distant battle;
- reaction should not prove that it belongs to either side of the conflict.

This creates reinterpretation:

Before the battle:

> strange component.

After the battle:

> Why did it react?

That is stronger than simply giving the player a codex entry.

---

## 7. Revised first-hour rhythm proposal

A slightly stronger pacing than the earlier 0–60 outline is recommended:

### 0–6 min — Arrival / immediate agency

- control quickly;
- door, open room, Outside, drone;
- minimal required exposition;
- starter crate becomes immediate actionable objective.

### 6–15 min — First Living Corner

- inspect starter modules;
- choose first domestic priority;
- place it using simple spatial placement;
- activate local power;
- room visibly changes.

Retention promise established:

> I can make this place mine.

### 15–23 min — Atlas boundary discovery

- artificial Sun / Outside view / local test reveals that the open architecture is not the true boundary;
- Atlas Sphere becomes partially visible for the first time;
- player infers rather than receives a full lecture.

Retention promise established:

> This room is physically stranger than it looks.

### 23–38 min — First Retrieval

- Station activation;
- target identification;
- Orb deployment;
- boundary breach;
- cost felt through room response;
- target captured;
- object physically returns.

Retention promise established:

> I can reach into Outside and bring things home.

### 38–47 min — Inspect / Use / Improve

- inspect FRO-01;
- useful shell recognized;
- anomalous core remains unknown;
- part of retrieved matter powers a second small room improvement;
- player places/keeps the anomaly.

Retention promise established:

> What I retrieve changes my home and may contain mysteries.

### 47–57 min — First distant war

- player retains movement/control;
- fleet arrival and attack;
- silent overwhelming counter-strike annihilates fleet;
- room receives extreme light changes;
- anomalous core may react subtly;
- no forced faction explanation.

Retention promise established:

> Outside is active at a scale far beyond me.

### 57–60 min — Delayed disturbance / next hook

- delayed disturbance reaches Atlas;
- room/power reacts;
- player uses already learned interactions to help restore normal operation;
- after stabilization, Retrieval Station detects a new uncategorized signal/object approaching reachable space.

Do not immediately explain it.

The chapter should end with player agency and curiosity intact.

---

## 8. Desired room-state delta at the end of Chapter 1

At minute 60, the room should not look like the minute-1 room.

Player-caused or player-experienced changes should include at least:

- first living corner placed by the player;
- Power Hub / local systems active;
- at least one additional improvement enabled by Retrieval;
- FRO-01 anomalous core physically present somewhere in the room;
- evidence that the Atlas boundary exists;
- subtle trace/state change from the distant battle or delayed disturbance;
- a new Outside target/signal now available or approaching.

This creates the persistent-room memory:

> My room is already becoming *my* version of this place.

---

## 9. Anti-goals

Do not solve retention by adding generic systems that dilute VQ2 identity.

Avoid in Chapter 1:

- combat tutorial;
- skill tree;
- large quest log;
- multiple currencies;
- rarity-color loot structure;
- survival bars everywhere;
- crafting menu overload;
- inventory management tutorial;
- repeated dialogue lock-ins;
- forced long cinematic sequences;
- fake high stakes where failure is impossible but presented as a QTE;
- immediately explaining Atlas, the preserving civilization, or the war factions.

Retention should come from:

`ownership + physical Retrieval + visible world response + unresolved meaning`

---

## 10. Open questions requiring later user lock

The following are intentionally not locked by this proposal:

- exact visual design of the three starter living modules;
- whether all three starter choices remain in the final game;
- exact first-placement footprint and Build Grid rules for the onboarding object;
- exact appearance/material language of FRO-01;
- exact amount/type of useful matter recovered from its shell;
- exact method of partial processing;
- whether the anomalous core reacts to Atlas before the war;
- whether it reacts during the war;
- whether the first post-war signal is related to the battle;
- whether the first Retrieval target is hand-authored/scripted or selected from a constrained pool;
- exact player control model for Orb approach and connection;
- exact timing of the battle within the 47–57 minute window.

These should be decided through narrative/gameplay iteration rather than assumed.
