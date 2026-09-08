# VQ2 Chapter 1 — First-Hour Gameplay Blueprint — 2026-09-04

> Status: USER-APPROVED DIRECTION / EXECUTION BLUEPRINT
>
> This document converts the accepted Chapter 1 narrative into a playable first-hour structure. The user explicitly agreed that the first hour must be strengthened as gameplay, not merely as story delivery.
>
> Important distinction: the **five-phase structure, player-agency requirement, first complete Retrieval loop before the war, war-as-playable-event, and room-state transformation** are now accepted direction. Exact object identities, exact minute timings, tutorial wording, numbers, UI, rewards, and final encounter tuning remain adjustable until implemented and Human Play/Feel reviewed.

---

# 1. Product goal

The first hour must not rely on atmosphere, dialogue, or lore alone.

By the end of Chapter 1, the target player should strongly feel all three of the following:

1. **I want to make this place my home.**
2. **I want to perform Retrieval again.**
3. **I want to understand what exists outside.**

The game should retain players through:

- spatial ownership;
- physical interaction;
- Retrieval as the unique core fantasy;
- visible world response;
- mystery created by evidence rather than exposition;
- a room that becomes measurably more personal because of player action.

Do not attempt retention through generic systems such as:

- early combat for its own sake;
- loot rarity colors;
- large skill trees;
- task-list spam;
- five currencies;
- repeated QTEs;
- long forced cinematics;
- an encyclopedia-style tutorial.

The first hour must prove the actual VQ2 fantasy.

---

# 2. Mandatory first-hour rules

## 2.1 Control quickly

- Give normal first-person control within roughly the first minute.
- Do not begin with a long non-interactive cinematic.
- The arrival can be visually authored, but the player should regain agency quickly.

## 2.2 No long stretches of passive exposition

- Avoid extended sequences of `walk -> listen -> walk -> listen`.
- Dialogue should normally occur while the player is moving, inspecting, placing, testing, or operating something.
- Do not force the camera toward every narrative event.
- The player should be allowed to look away from the drone, Atlas, or the war.

## 2.3 Novelty cadence

As a target rhythm, provide a meaningful new response, interaction, visual change, question, or piece of agency approximately every few minutes.

This is not a rigid timer. It is a pacing guardrail against a flat first hour.

## 2.4 First core loop must happen in Chapter 1

The player must complete a small version of:

`Inhabit -> Retrieve -> Inspect -> Use/Place -> Observe -> Reinterpret`

before Chapter 1 ends.

Do not defer the game's defining loop until Chapter 2.

## 2.5 Fail-soft onboarding

- The first full Retrieval should not be easily lost through one mistake.
- No catastrophic refuge failure during basic tutorial play.
- If the player misunderstands an early control, recovery should be quick and diegetic.
- The first hour may communicate danger without requiring punitive failure states.

## 2.6 The room must visibly change

At hour 1, the room should not look identical to minute 1.

At least some of the following should be visibly attributable to the player:

- one or more activated systems;
- one personally placed / assembled object;
- one Retrieved object physically present;
- one new functional or comfort improvement;
- visible evidence left by the distant war / Atlas disturbance;
- a new unresolved signal or object outside.

This is critical for the Persistent Room identity.

---

# 3. Five gameplay phases

The five existing narrative mini-chapters remain useful, but they are now gameplay phases rather than prose-only beats.

Approximate structure:

```text
00-08 min   1. 门后没有走廊      Arrival / freedom / first ownership
08-18 min   2. 一间还不像家的家  Power / crate / placement / first remote person
18-28 min   3. 看不见的边界      Atlas mystery discovered through physical evidence
28-43 min   4. 把手伸出世界      First real Retrieval loop
43-60 min   5. 光先到达          Playable distant war + refuge disturbance + next hook
```

Timings are pacing targets, not hard scripted locks.

---

# 4. Detailed 0–60 minute flow

## 0:00–1:00 — Arrival shock, then control

### Player experience

- Arrival / transfer through the left-side door.
- Player enters the open two-wall refuge room.
- The first major visual should be the contrast between an ordinary domestic floor / room and the impossible Outside beyond the open sides.
- Door closes behind the player.
- Normal movement and look control become available quickly.

### What the player can do immediately

- move;
- look into the Outside;
- inspect the closed door;
- approach the room interior;
- notice the drone;
- notice Atlas;
- notice the supply crate;
- notice Retrieval Station.

### Design purpose

The first minute must communicate:

> This is not a cutscene museum. I am physically here.

Do not explain Atlas yet.

---

## 1:00–3:00 — Free inspection before instruction

The player is given a short period to investigate naturally.

The drone should react contextually rather than instantly dumping instructions.

Examples:

- inspect door -> drone warns that the entrance is unavailable;
- approach open edge -> drone gives a restrained safety warning;
- approach Atlas -> drone prevents touching it, but gives only its name;
- inspect crate -> drone identifies it as initial supplies;
- inspect Retrieval Station -> drone says it is not yet ready for use.

No requirement that all of these interactions happen.

### Retention purpose

The room should immediately contain several unanswered questions visible at once.

The player chooses which one to poke first.

---

## 3:00–5:00 — First useful action

The drone directs the player toward a very simple practical action rather than a lore conversation.

Candidate examples:

- obtain / drink water;
- open a basic local utility;
- move a simple object into place;
- connect / activate one small domestic module.

The action should take less than two minutes.

### Feedback

Something visibly changes when completed:

- a local light activates;
- a device wakes up;
- a small room zone becomes functional;
- the drone acknowledges the system state.

### Design purpose

The first reward is not XP.

The reward is:

> I touched the room, and the room changed.

---

## 5:00–8:00 — First ownership choice

The player receives a small choice that changes the room immediately.

This should **not** require the full future build catalog or inventory system.

Candidate structure:

- the supply crate contains a few usable starter modules / furnishings;
- player chooses which one to set up first;
- simple physical placement or snap placement is used;
- the chosen object remains in the room.

Exact item identities remain open.

Possible categories:

- seating / rest;
- small storage;
- utility surface;
- local comfort / lighting.

### Rule

The choice does not need to create a branching storyline.

Its job is to establish:

> This is becoming my version of the room.

End Phase 1 with the player having caused at least one persistent spatial change.

---

# Phase 2 — 一间还不像家的家

## 8:00–11:00 — Open the supply crate properly

The player physically opens / explores the initial crate.

Avoid a large inventory grid if possible.

Preferred feeling:

- open container;
- see real objects / modules;
- take or activate what is needed;
- understand that the refuge began with limited but useful prepared supplies.

The crate should feel like part of the world, not a menu portal.

### Player learns

- supplies exist;
- the room was prepared for someone;
- the preparation is incomplete;
- someone expected the player to build / inhabit rather than merely wait.

---

## 11:00–14:00 — Activate local power

Introduce the wall-mounted wireless Power Hub at a practical level.

Player performs a simple activation / verification sequence.

### Visible feedback

Power activation should create a clear room-wide response, for example:

- several devices wake up in sequence;
- a display becomes available;
- a local light zone activates;
- the drone behavior changes because stable local power is available.

Do not explain full fictional physics.

Player only needs to understand:

> Devices inside this local region can operate without conventional wiring.

---

## 14:00–18:00 — The drone becomes a person

During an active task, the first remote alien individual connects through the drone.

Important:

- do not stop all gameplay for a conversation;
- allow the player to continue placing, inspecting, or operating something;
- the tonal shift should make the player realize that this is not merely tutorial AI.

The remote individual should answer only a small number of questions.

Strong information to establish:

- the speaker is alive;
- the speaker belongs to the civilization connected to the refuge project;
- the player is described as preserved rather than simply rescued;
- the speaker has incomplete knowledge / limited willingness to explain.

Do **not** explain:

- full alien motives;
- total surviving human count;
- full Atlas physics;
- full Outside cosmology.

### Phase payoff

The room now has both:

- mechanical mystery;
- personal mystery.

There is someone on the other side of the drone.

---

# Phase 3 — 看不见的边界

## 18:00–21:00 — Artificial sun / environmental clue

Use the internal artificial sun and room lighting as an environmental clue.

Possible event:

- the artificial sun crosses a location where a subtle refraction / distortion appears in empty space;
- or another controlled environmental interaction briefly reveals something larger than the house.

The player should be able to notice this naturally.

The drone may react if the player misses it, but should not immediately explain the complete phenomenon.

---

## 21:00–24:00 — Physical boundary test

Give the player a way to test the mystery.

Possible implementation candidates:

- a small sensor / probe is extended away from the floor edge;
- the drone demonstrates a controlled test;
- a harmless object or field visualization reveals that the habitable domain extends beyond the visible architecture.

Do not encourage the player to throw arbitrary important objects into the void.

### Required conclusion

The player should infer before being explicitly told:

> The two missing walls are not the real boundary of my environment.

---

## 24:00–28:00 — Atlas partial reveal

Atlas is identified as the stabilizing anchor at a high level.

Do not deliver a physics lecture.

Sufficient first-hour understanding:

- the room exists inside a larger invisible stable domain;
- Atlas is central to maintaining it;
- the true boundary exists farther from the house;
- the Outside beyond that boundary is not ordinary empty space.

### Visual payoff

A small part of the Atlas Sphere may become visible briefly through:

- refraction;
- ripple;
- light distortion;
- controlled probe contact.

Then it disappears again.

### Retention purpose

The player now has a new spatial question:

> Where does my world actually end?

Immediately after this question is established, introduce the system that crosses that boundary: Retrieval.

---

# Phase 4 — 把手伸出世界

## 28:00–31:00 — Retrieval Station hands-on tutorial

The player approaches the Retrieval Station.

Teach only the minimum verbs required for one successful operation.

Possible minimum interaction set:

- deploy / launch;
- steer or guide target direction;
- connect / attach;
- retrieve / reel back;
- dock.

Avoid opening a large equipment UI.

### Important physical language

The player should clearly see:

- Orb leaving the station;
- tether physically paying out;
- the cable having direction and tension;
- the Orb existing in real 3D space.

This cannot feel like selecting an item from a remote menu.

---

## 31:00–34:00 — Orb travels through the safe domain

Let the player operate the Orb for a short distance **before** crossing Atlas.

Purpose:

- learn movement safely;
- understand tether behavior;
- see parallax between near objects and distant universe background;
- establish that the Orb is a real object moving away from home.

No major danger yet.

---

## 34:00–36:00 — First Atlas boundary crossing

This is one of the first hour's major signature moments.

When Orb crosses the invisible Atlas boundary:

- the Sphere becomes briefly visible locally;
- a ripple / refraction moves around the crossing point;
- the tether visibly passes through the boundary;
- room lighting / comfort systems dip slightly;
- one or more powered devices may reduce output;
- Atlas / Power Hub may show a restrained response.

No giant red warning UI.

The player should understand the cost through the room itself.

### Intended thought

> I just opened my safe world.

---

## 36:00–39:00 — Search and target acquisition

The first target should be intentionally readable and low-risk.

It should not be a generic glowing loot box.

Candidate target properties:

- physically strange but understandable enough to approach;
- small enough to retrieve;
- has both useful material value and a small unresolved anomaly / feature;
- provides an immediate room benefit after return.

Exact identity remains open.

The player guides Orb toward it and establishes a connection.

### Design rule

First target acquisition should create tension through distance / unknown space, not through combat.

---

## 39:00–41:00 — Reel it home

The player initiates retrieval.

Important feedback:

- visible tether tension;
- object starts moving;
- room systems remain slightly dimmed while boundary is open;
- object passes through Atlas Sphere;
- boundary reacts again;
- once fully inside, room systems begin recovering.

The object should physically return to the station / room.

Its arrival on the wooden floor should have weight, sound, and physical presence.

### Signature moment

> Something that was outside my world is now lying in my home.

This is a core VQ2 fantasy and must feel substantial.

---

## 41:00–43:00 — Inspect and make a first use decision

The player examines the Retrieved object.

Do not force a severe irreversible moral choice in the tutorial.

Instead, introduce the multi-value principle safely.

Candidate structure:

- a clearly usable portion can be converted / used for a small refuge or domestic improvement;
- an anomalous portion / property is worth preserving and remains in the room for later observation.

The result should both:

1. improve the room in a visible small way;
2. leave behind an unresolved object or question.

### Core loop completed

By minute ~43, the player has now experienced:

`Inhabit -> Retrieve -> Inspect -> Use/Place -> Observe -> Reinterpret`

The game's central promise is no longer theoretical.

---

# Phase 5 — 光先到达

## 43:00–46:00 — Calm after first success

Give the player a short decompression period.

The room should now feel more inhabited than at arrival.

Allow the player to:

- inspect the Retrieved object;
- look at the improvement they just created;
- move around freely;
- speak briefly with the drone;
- look outside.

This calm is necessary so the coming war has contrast.

Do not immediately trigger the spectacle the instant Retrieval ends.

---

## 46:00–49:00 — Distant fleet arrival

The first major outside war event begins while the player retains control.

Core locked narrative beat remains:

- a distant fleet arrives with an extremely fast transition;
- they immediately attack an unreadable target / region;
- many beam-like attacks are visible;
- initially there is no conventional explosion sound reaching the room.

### Gameplay rule

Do not force a cinematic camera.

The player may:

- run closer to the open side;
- stay farther inside;
- watch from another angle;
- look at the drone;
- look at Atlas;
- partially miss details.

The world event does not exist only for the camera.

---

## 49:00–51:00 — Annihilating strike

A vastly more powerful strike destroys the fleet rapidly.

The event should strongly affect lighting inside the room:

- external flash changes shadow direction / brightness briefly;
- walls, furniture, character, and floor catch the event light;
- the room itself visually proves that the battle exists in the same reality.

Still no immediate conventional explosion sound.

### Emotional target

The player has just learned how powerful their little Retrieval system feels.

Now the game shows a scale at which that power is almost irrelevant.

This contrast is intentional.

---

## 51:00–54:00 — Silence

After the fleet disappears, allow several seconds of real quiet.

Do not immediately explain the event.

The player can inspect the Outside and ask the drone questions.

Correct answers may include genuine uncertainty.

The drone / remote operator does not need to know who fought whom.

The first-hour war identities may remain permanently unknown.

---

## 54:00–57:00 — Delayed disturbance hits the refuge

The physical effect reaches the room later.

This should become a short gameplay event using systems already taught.

Possible consequences:

- Power Hub output drops;
- one local device disconnects;
- room lights dip;
- Retrieval Station reports an abnormal state;
- Atlas Sphere becomes visible over a much larger arc than before;
- floor / furniture receive a restrained physical shake;
- the first Retrieved object may react unexpectedly.

### Player action

The player performs a small recovery sequence using known interactions.

Examples:

- stabilize / confirm Power Hub state;
- return a system to local power;
- inspect / reset Retrieval Station;
- verify Atlas response through a known interface.

Do not introduce a brand-new complicated minigame at minute 55.

### Design purpose

The war is no longer just background spectacle.

It has physically entered the player's home.

---

## 57:00–59:00 — Recovery and contradiction

Power stabilizes.

The room returns to a recognizable state, but not perfectly to its pre-war state.

Leave one or more subtle persistent traces.

Candidate traces:

- a changed reading;
- a slightly altered Retrieved object;
- a new Atlas reaction;
- a minor visual residue;
- a distant new piece of debris.

The player should feel:

> My home survived, but the outside world can touch it.

---

## 59:00–60:00 — The gameplay hook, not just the story hook

Retrieval Station detects something new.

No large quest banner is necessary.

The signal / object should be visibly connected in timing to the aftermath, but its true origin should remain uncertain.

The player approaches.

The drone cannot classify it normally.

Suggested emotional beat:

> "This... is not in the current classification."

Outside, a small object / signal / fragment is now reachable or becoming reachable.

The chapter ends with a question the player can eventually act on:

> **Can I retrieve that?**

This is stronger than ending only on:

> Who destroyed the fleet?

The story mystery drives curiosity; the actionable Retrieval mystery drives continued play.

---

# 5. First-hour information budget

## The player should understand by the end of Chapter 1

- this room is a long-term refuge / home, not a normal apartment;
- the visible walls are not the true habitable boundary;
- Atlas is central to maintaining a larger stable domain;
- local wireless power supports ordinary room life;
- Retrieval Orb + tether can cross the Atlas boundary;
- opening the boundary produces a real cost / system disturbance;
- objects from Outside can be physically brought home;
- Retrieved objects can have both practical and discovery value;
- the drone is sometimes occupied / contacted by a real alien individual;
- the Outside contains active civilizations and events vastly beyond human scale;
- the refuge is safe enough to live in, but not isolated from all consequences.

## The player should NOT understand yet

- why humanity was preserved;
- whether preservation was benevolent;
- how many humans remain;
- why this player specifically is here;
- exact Atlas physics;
- exact thermodynamic / dimensional-loss terminology;
- the full topology of Outside;
- identities of the two sides in the distant war;
- who fired the annihilating strike;
- whether the war event has anything to do with the player;
- full motives / politics of the preserving civilization;
- exact role or identity of the remote drone operator.

Mystery must survive the tutorial.

---

# 6. Player-agency requirements

The first hour should include multiple forms of agency, not only movement.

Minimum target categories:

1. **Exploration agency** — choose what to inspect first.
2. **Spatial agency** — place / arrange at least one persistent room object.
3. **Operational agency** — activate power or a room system.
4. **Interpretive agency** — infer the Atlas boundary before full explanation.
5. **Mechanical agency** — operate Orb / tether during first Retrieval.
6. **Use agency** — decide how a first Retrieved resource contributes to the room at a small scale.
7. **Attention agency** — choose how and from where to witness the distant war.
8. **Recovery agency** — help the refuge recover after the delayed disturbance.

Not every action needs branching narrative consequences.

The important requirement is that the player does not experience Chapter 1 as a guided museum tour.

---

# 7. Retention checkpoints

These are design review checkpoints, not analytics promises.

## ~5 minutes

Player has already:

- moved freely;
- seen the impossible exterior;
- interacted with the room;
- caused one visible response.

Question in player's mind:

> Where am I?

## ~10 minutes

Player has:

- opened / used supplies;
- begun changing the room;
- understood that this is intended as a lived-in space.

Question:

> What can I make this place become?

## ~15 minutes

Player discovers there is a real person behind the drone at least sometimes.

Question:

> Who is on the other side?

## ~25 minutes

Player discovers the invisible refuge boundary / Atlas role.

Question:

> Where does my world actually end?

## ~35 minutes

Player crosses Atlas for the first time with Orb and sees the cost.

Question:

> What else is out there?

## ~42 minutes

The first Retrieved object is physically inside the room and changes something.

Question:

> What will I bring back next?

## ~50 minutes

Player witnesses an incomprehensibly powerful outside event.

Question:

> What kind of universe am I living beside?

## ~60 minutes

A new actionable unknown appears.

Question:

> Can I retrieve it?

---

# 8. Anti-patterns to avoid during implementation

Do not turn this blueprint into:

- a waypoint chain where every object glows yellow;
- an hour-long voice-over tutorial;
- a sequence of modal UI windows;
- a build-system tutorial before the player understands why building matters;
- a resource-economy tutorial with multiple counters;
- a combat tutorial;
- a forced cinematic war scene;
- an early permanent punishment for experimenting with Retrieval;
- a lore dump about high-dimensional physics;
- a room that visually resets after each scripted beat.

The tutorial should be embedded in physical life.

---

# 9. Implementation priority implied by this blueprint

This blueprint does **not** mean all Chapter 1 systems should be built immediately.

The current project execution order remains conservative.

For future Chapter 1 implementation, the critical playable proof should eventually be built in this order:

1. first-person room traversal;
2. stable open-room visual foundation;
3. simple object interaction;
4. one persistent placement / room-change interaction;
5. Power Hub local activation feedback;
6. Atlas boundary visualization prototype;
7. minimal Orb + tether control;
8. one complete Retrieval target loop;
9. room-light / power response to boundary opening;
10. distant war visual event;
11. delayed refuge disturbance using already learned interactions;
12. final new Retrieval signal hook.

Do not build the full economy, full build catalog, large inventory, or complete story system merely to prove Chapter 1.

---

# 10. Current locked direction vs open tuning

## Accepted direction

- Five-phase first-hour structure.
- Fast return of player control.
- Room ownership must begin early.
- Real remote alien contact occurs during active play, not only exposition.
- Atlas boundary is discovered through physical evidence.
- First complete Retrieval happens before the war.
- First Retrieval visibly affects room power / stability.
- First Retrieved object physically enters and remains in the room.
- The player gets a practical payoff from Retrieval.
- Distant war remains non-combat for the player.
- War event occurs without forced cinematic camera.
- Delayed disturbance physically affects the refuge.
- Player participates in recovery using known verbs.
- Chapter ends with an actionable Retrieval mystery.
- The room at minute 60 is visibly different from minute 1.

## Still open

- exact starter crate contents;
- exact first placed object;
- exact Power Hub activation interaction;
- exact remote operator dialogue;
- exact Atlas boundary probe method;
- exact first Retrieved object;
- exact material / anomaly split of that object;
- exact Retrieval controls;
- exact first Retrieval range;
- exact energy / stability response values;
- exact war asset presentation method;
- exact post-war failure / recovery visuals;
- exact final signal / object identity;
- exact minute-by-minute timing after playtesting.

Any of these may be tuned without invalidating the accepted first-hour structure.

---

# 11. Success criterion

Chapter 1 should not end with the player thinking only:

> "That was an interesting story."

The stronger target is:

> "That room is mine now."
>
> "I brought something impossible into it."
>
> "Something else is out there."
>
> "I want to go get it."

That is the intended transition from narrative interest to gameplay retention.
