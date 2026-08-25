# VQ2 Core Behavior → Task → Economy → World Loop

> Date: 2026-08-25  
> Status: PROPOSED / DEEP DESIGN — DISCUSSION IN PROGRESS  
> Scope: core verbs, task generation, outputs, risk/consequence, progression, economic sinks, scene-space implications  
> Implementation authorization: NONE

This document is the next design layer after `VQ2_WORLD_DRIVEN_ECONOMY_AND_TASK_SYSTEM_2026-08-25.md`.

The purpose is to stop designing Four Workstations as:

`Focus -> Coins -> Shop -> Decoration`

and instead define a world-driven loop in which the Office gradually becomes a strange inhabited node where creatures can work, rest, retrieve, inspect, cultivate, repair, construct, react to anomalies, and eventually connect to another real room.

The central design question is:

> What can the inhabitants do, why do those actions matter in this world, what do they produce, what can go wrong, and how do the results unlock genuinely new things to do?

Nothing in this document freezes final lore, exact item names, exact numerical balance, or exact animation requirements.

---

# 1. External research lessons worth keeping

The project should borrow structural lessons, not copy surface content.

## 1.1 Death Stranding — contribution should change useful world structure

Useful lesson:

- player resources can be donated into structures;
- structures can gain levels/new functionality;
- other players can benefit from those structures;
- social value does not require conventional chat or direct co-presence;
- even non-convertible social recognition can remain meaningful.

Application to Four Workstations:

> Long-term resources should visibly improve facilities, Atlas, expansion modules, or cross-world capabilities — not only increase balances.

This is especially relevant to the future anonymous Ouroboros room chain.

References:

- PlayStation — Death Stranding Director's Cut: unique Social Strand gameplay.
- PlayStation Blog — resources/roads/online structures and shared benefit.
- PlayStation — Death Stranding 2 guide: other-player structures can appear and be upgraded by further contributions.

## 1.2 DREDGE — strong upgrades expand capability and accessible unknowns

Useful lesson:

- research/equipment upgrades do not only raise yield;
- better equipment grants access to deeper or previously inaccessible discoveries;
- exploration carries risk;
- curios/discoveries can have value beyond a generic money number.

Application:

> The best Four Workstations upgrade should often unlock a new action, new target, deeper retrieval, safer containment, or new world layer.

Reference:

- DREDGE official / PlayStation descriptions: research equipment, access rare fish/deep-sea curios, explore deeper areas, risk increases in dangerous conditions.

## 1.3 Against the Storm — ambition can create pressure

Useful lesson:

- opening more territory, growing a settlement, assigning more exploitation activity, and simply pushing further can increase Hostility;
- danger is connected to expansion/activity rather than passive absence;
- players can choose how aggressively to push into risky opportunities;
- a failed settlement does not erase all meta-progression.

Application:

> Four Workstations should prefer “risk follows ambition” over “punishment follows absence.”

If a player chooses deeper salvage, unstable experiments, larger expansions, or stronger cross-world influence, they can create more strain/risk. A player who simply does not log in should not return to a destroyed room.

References:

- Against the Storm Official Wiki — Hostility.
- Against the Storm official/Steam description — dangerous exploration, modifiers, and risk/reward decisions.

## 1.4 Cult of the Lamb — activities, structures, inhabitants, and resource loops should feed each other

Useful lesson:

- resource collection enables structures/rituals;
- structures create new settlement activities;
- inhabitants have needs and visibly use the settlement;
- the base is a gameplay system, not only a decorative hub.

Application:

> Any new room module should ideally create at least one new behavior, task type, transformation, or character use-case.

## 1.5 Economy-design research — every faucet needs durable reasons to spend/use value

Useful lesson from GDC economy material:

- faucets/sources create currency/resources;
- sinks remove them;
- “fountaining” resources with insufficient sinks destroys pacing and value;
- progression pacing should be simulated and playtested rather than balanced by intuition alone.

Application:

> Coins cannot remain a permanent faucet attached to Focus while the only sinks are a finite furniture catalogue.

The world must create recurring, activity-linked uses for common value, while rare progress must require more than money.

---

# 2. Top-level architecture — three loops, not one

Four Workstations should contain three interacting timescales.

## 2.1 Real-Life Loop — slow input

Typical duration: tens of minutes.

Examples:

- Focus / study / work;
- meaningful check-in;
- selected real-life commitment.

Primary purpose:

> Convert real effort into stable progression fuel without forcing the user to stare at the game.

Outputs may include:

- XP;
- Coins;
- limited Build Charge;
- progress on a currently assigned long-form world task;
- growth time/progress for selected systems.

Real-life input is important, but it is not the whole game.

## 2.2 Room Visit Loop — short decisions and physical actions

Typical duration: seconds to a few minutes.

Examples:

- inspect what changed;
- decide how to handle an event;
- lower the salvage line;
- inspect a recovered object;
- place an object into research/cultivation;
- repair something;
- contribute to a project;
- choose whether to take a risky contract;
- rest/observe at the edge;
- later observe the linked stranger room.

Primary purpose:

> Give the player meaningful decisions and visible world feedback when they actually look at the room.

## 2.3 World Project Loop — days to months

Examples:

- build Atlas;
- build/upgrade salvage infrastructure;
- establish research/cultivation capability;
- open an expansion platform;
- stabilize or transform a persistent anomaly;
- eventually unlock observation and costly cross-world influence.

Primary purpose:

> Make the room physically and functionally different after weeks/months of use.

---

# 3. Core verbs — the game should be built around actions, not item categories

The first design target is a compact reusable verb library.

The game should not require one bespoke animation for every task. Multiple tasks can reuse the same physical verb.

## 3.1 FOCUS / COMMIT

World meaning:

- perform sustained ordered work;
- assemble, write, calculate, calibrate, study, sort, or tune something.

Real input:

- Focus session / real-life productive block.

Produces:

- XP;
- common liquidity (Coins);
- limited Build Charge;
- progress on certain long-form assigned activities.

Important:

- the creature does not always need to stare at a computer;
- the visible representation can vary: blueprint work, assembly, scanning, sorting, writing, device calibration.

## 3.2 RETRIEVE / SALVAGE

World meaning:

> Reach beyond the known room boundary and bring something back.

Early expression:

- line/hook lowered over an open edge.

Later capability examples:

- basic line;
- winch;
- magnetic retrieval;
- probe;
- targeted/deeper retrieval;
- containment retrieval for unstable objects.

Produces:

- physical objects;
- common scrap/components;
- strange specimens/seeds;
- rare artifacts;
- event triggers;
- occasionally nothing.

Risk:

- lose input;
- wear/damage equipment;
- pull back something dangerous/unknown;
- create a follow-up room situation.

This is a major non-office gameplay pillar.

## 3.3 INSPECT / RESEARCH / PROCESS

World meaning:

> Convert an unknown thing into understanding, a usable component, a blueprint, or a deliberate decision.

Possible actions:

- inspect;
- scan;
- open;
- separate;
- test;
- classify;
- combine;
- destructively analyze.

Key decision:

A recovered item should not always have one obvious optimal path.

Example options:

- sell now for Coins;
- preserve as a collectible;
- consume it in research;
- cultivate it;
- use it in a build;
- stake it in a risky experiment;
- later use it as a cross-world influence input.

This creates opportunity cost and prevents every object from collapsing into money.

## 3.4 BUILD / REPAIR / INSTALL

World meaning:

> Turn accumulated effort and discoveries into permanent or semi-permanent world change.

Targets:

- Atlas;
- salvage rig;
- research device;
- containment structure;
- cultivation module;
- wall/edge reinforcement;
- outward expansion platform;
- future strange structures.

Outputs:

- new scene geometry;
- new actions;
- new task families;
- new capacity;
- safer/higher-risk options;
- social/world-link capability.

Strong rule:

> Major construction should usually unlock a new verb or new target, not only +X% efficiency.

## 3.5 REST / RECOVER / WATCH

World meaning:

- inhabit the world instead of constantly producing;
- sit on the open edge;
- lie down/curl up;
- observe the void;
- quietly watch Atlas;
- interact socially with another creature in low-pressure ways.

Possible systemic roles later:

- recover creature readiness for optional active world actions;
- clear temporary strain after risky activity;
- trigger small observational events;
- create social presence when multiple creatures happen to rest together.

Guardrail:

> Rest must not become a punitive stamina chore that blocks the user's real-life Focus progress.

## 3.6 RESPOND / CHOOSE

World meaning:

> Something has happened in the room; choose what kind of world this becomes next.

Examples:

- wall crack;
- strange growth;
- floating objects;
- jammed salvage line;
- unstable Atlas reading;
- unknown signal;
- escaped specimen;
- structural damage after a risky experiment.

The action is primarily a **decision verb**.

A good situation offers at least two meaningful responses, often:

- safe / expensive / predictable;
- curious / delayed / informative;
- risky / potentially rare / consequence-heavy.

This is how the room produces tasks without becoming a checklist app.

---

# 4. Later unlock verbs

These should not all exist on day one.

## 4.1 CULTIVATE

Unlocked after the player acquires something worth growing and builds a compatible module.

Possible targets:

- ordinary plant;
- strange seed;
- fungus;
- crystalline object;
- tiny organism;
- machine-organic hybrid.

Growth should use staged models/state changes rather than requiring continuous simulation.

The choice can become:

- harvest now;
- keep growing;
- preserve as room identity;
- use mature result in a project/research action.

## 4.2 OBSERVE ANOTHER ROOM

Unlocked only after sufficient Atlas construction.

Rules already established elsewhere:

- fixed stranger-room adjacency;
- global Ouroboros-like chain;
- observation first;
- observed room knows observation is occurring;
- observer identity remains hidden.

This creates a new verb without requiring traditional multiplayer co-presence.

## 4.3 INFLUENCE ANOTHER ROOM

Late progression.

Rule already established:

> Cross-world influence must carry meaningful cost.

The best future influence should likely be additive/opportunity-generating rather than destructive ownership violation.

Possible categories remain open:

- send/trigger a temporary world event;
- create a visible environmental trace;
- deliver a rare opportunity/object;
- alter a temporary condition;
- cause a mysterious but recoverable phenomenon.

Exact form is intentionally not frozen.

---

# 5. Task-generation model — where tasks actually come from

The game should not rely primarily on a static Daily Quest list.

Every task should have a reason to exist in the world.

## 5.1 Intent Tasks

Triggered because the player starts something.

Examples:

- begin Focus;
- start deep salvage;
- initiate an experiment;
- begin a build phase.

The player owns the decision.

## 5.2 Need Tasks

Triggered because an owned system has a real state.

Examples:

- frequently used winch needs repair;
- research device is jammed after risky use;
- containment unit must be stabilized after a specimen reaction.

Guardrail:

> Needs should generally come from use/risk, not passive offline decay.

## 5.3 Opportunity Tasks

Triggered by discoveries or transient world conditions.

Examples:

- unusual signal detected;
- a drifting object passes near the room;
- strange seed begins reacting;
- linked room performs a visible unusual action later in progression.

These should feel like opportunities, not mandatory chores.

## 5.4 Incident / Anomaly Tasks

Triggered by the world or as consequences of earlier choices.

Examples:

- wall crack;
- local gravity problem;
- residue contamination;
- Atlas instability;
- escaped growth;
- damaged edge.

A failure can therefore become a new piece of content.

## 5.5 Project Tasks

Persistent multi-step goals.

Examples:

- Atlas Phase 1 -> 2;
- build salvage winch;
- construct research module;
- add an external platform;
- create an unusual cultivation structure.

Projects are the main world-growth spine.

## 5.6 Voluntary Risk Contracts

The player explicitly chooses higher stakes.

Examples:

- Deep Salvage;
- Overcharge Scan;
- Forced Atlas Decode;
- Unstable Cultivation;
- Contract Focus with a staked input.

This is where stronger punishment belongs.

## 5.7 Chain Events — later game

Generated by the anonymous linked-room system.

Examples:

- someone is currently observing this room;
- an anonymous influence arrives;
- the fixed stranger room has visibly changed;
- Atlas detects a response/echo.

Do not convert these into friend-chat chores.

---

# 6. Task template — every future task should be designable in the same format

Before implementing any world task, define:

1. **Trigger** — why did this happen?
2. **Visible cue** — how does the room show it without relying only on UI?
3. **Choices** — what can the player do?
4. **Required verb(s)** — retrieve, inspect, repair, etc.
5. **Inputs/stake** — Coins, item, Build Charge, time, tool condition, or nothing.
6. **Success output** — item, knowledge, progress, unlock, world change.
7. **Failure consequence** — if any.
8. **Follow-up state** — does success/failure create another situation?
9. **Repeatability** — one-off, rare, recurring, or project milestone.
10. **Spatial/animation cost** — what scene anchors/assets/animations are required?

This template is important because it connects game design to production feasibility.

---

# 7. Value types — do not turn everything into currency

The economy can contain many kinds of value without creating many wallet currencies.

## 7.1 XP — permanent personal growth

Purpose:

- player-level progression;
- unlock breadth/choices;
- never spent.

Should not directly multiply productivity power aggressively.

## 7.2 Coins — common liquidity

Purpose:

- predictable/common purchases and services;
- routine repairs;
- ordinary parts;
- cosmetic commissioning;
- processing fees;
- some optional construction inputs.

Coins are useful, but intentionally not universal.

## 7.3 Build Charge — Atlas/shared-construction behavior resource

Purpose:

- connect genuine activity to shared long-term Atlas construction.

Rules already established:

- not bought;
- not traded;
- limited;
- not convertible from Coins.

## 7.4 Physical Items

Examples:

- common parts;
- retrieved scrap;
- strange seed/specimen;
- unstable object;
- artifact;
- broken component;
- one-off relic.

These are objects with identity and multiple possible uses.

They should not automatically become wallet balances.

## 7.5 Knowledge / Blueprint Unlocks

Some progression should be informational rather than monetary.

Examples:

- learn what a specimen does;
- unlock a build recipe;
- decode an Atlas behavior;
- identify how to safely handle a new class of object.

Knowledge is a powerful anti-inflation gate because a rich player cannot simply buy understanding if the discovery has not happened.

## 7.6 World State

Examples:

- built structure exists;
- wall is cracked/repaired/transformed;
- specimen is growing;
- Atlas phase changed;
- expansion platform exists;
- a persistent trace remains.

This is often the most valuable reward because it is visible.

---

# 8. Anti-inflation architecture

The project should assume that any uncapped or recurring Coin source will eventually create wealthy long-term players.

Therefore the economy must remain playable even if a player has a huge Coin balance.

## Rule 1 — Money is a lubricant, not the master key

Coins can solve common/predictable needs.

Coins alone should not directly buy:

- Atlas core progress;
- all rare discoveries;
- all blueprints;
- every expansion;
- observation access;
- strongest cross-world actions;
- every rare object.

## Rule 2 — Major projects use mixed requirements

Example structure:

`common Coin cost + specific physical input + knowledge/blueprint + build action/progress`

This means the player must actually interact with the world.

## Rule 3 — Activity creates proportional sinks

Prefer:

- tool wear from using tools;
- experiment inputs consumed by experiments;
- repairs caused by risky attempts;
- processing costs caused by processing;
- influence costs caused by influence.

Avoid:

- arbitrary daily rent;
- furniture decaying because the player was offline;
- passive punishment for absence.

## Rule 4 — Items have competing uses

A rare object is more interesting if the player must choose:

- sell;
- research;
- build;
- cultivate;
- keep;
- risk in experiment;
- later use across the world-link.

Opportunity cost creates value better than a huge price tag alone.

## Rule 5 — Late-game sinks should open possibilities

A good expensive sink should feel like:

> “I am paying to attempt something meaningful.”

not:

> “The game deleted 10,000 Coins because my balance was too high.”

Strong late sinks may include:

- high-risk experiments;
- specialized retrieval operations;
- major expansion modules;
- advanced processing;
- expensive restoration/transformation;
- later anonymous cross-world influence.

---

# 9. Consequence / punishment ladder

Punishment should have graded severity and should usually be chosen through risk.

## Tier 0 — Safe action

Examples:

- ordinary Focus;
- basic salvage;
- normal inspection.

Failure consequence:

- low/no reward;
- time/opportunity spent.

No harsh punishment.

## Tier 1 — Staked action

Player consumes or risks an input.

Failure consequence:

- stake/input lost;
- reduced output.

## Tier 2 — Equipment consequence

Player deliberately uses a higher-risk mode.

Failure consequence:

- tool wear;
- damaged component;
- temporary facility disable until repaired.

## Tier 3 — World consequence

Reserved for clearly signaled risky experiments/major events.

Failure consequence:

- local anomaly;
- crack/residue;
- strange growth;
- floating objects;
- follow-up recovery project.

Key rule:

> Consequence should often generate gameplay rather than only subtracting currency.

## Permanent-loss guardrail

Do not casually destroy:

- purchased cosmetics;
- long-term sentimental objects;
- another player's contribution;
- core Atlas progress.

Permanent irreversible losses, if ever used, require a separately approved design Gate.

---

# 10. Pressure principle — risk follows ambition

This should become one of the project's most important systemic rules.

> The world becomes more difficult/strange when the player chooses to push deeper, faster, or harder — not simply because time passed while they were absent.

Examples:

- deeper salvage -> better unknowns + more tool strain/anomaly chance;
- stronger experiment -> better blueprint/discovery chance + greater containment risk;
- faster Atlas decoding -> higher temporary instability;
- bigger expansion -> unlocks more capability but creates more systems to actively use/manage;
- stronger cross-world influence -> higher cost/rarer input.

The player can therefore choose a calm cozy pace or a more ambitious strange-world pace.

This preserves accessibility while allowing meaningful risk.

---

# 11. Progression architecture — four progression dimensions

Do not make one Level number carry the whole game.

## 11.1 Player Level — personal breadth

Answers:

> “What options am I experienced enough to access?”

Can unlock:

- categories;
- personal expression;
- research choices;
- optional contracts;
- creature customization.

Avoid making it the sole gate for world capability.

## 11.2 Facility Capability — what the room can physically do

Examples:

- Salvage Rig Tier;
- Research/Containment capability;
- Cultivation capability;
- expansion infrastructure.

These upgrades should visibly change scene objects.

## 11.3 Atlas Phase — main shared world-link progression

Answers:

> “How far has this room reconnected itself to the larger world?”

Major capability milestones:

- construction;
- activation;
- observation;
- later influence.

## 11.4 Knowledge / Discovery — what the room understands

Answers:

> “What have we actually discovered?”

Knowledge can unlock:

- new recipes;
- new safe handling methods;
- new experiment options;
- targeted retrieval;
- new interpretations of Atlas/void phenomena.

This keeps exploration relevant even for wealthy/high-level players.

---

# 12. First-pass system loops

These are concrete loop candidates, not implementation locks.

## Loop A — Real Focus -> Atlas

`Real Focus`
-> XP + Coins + limited Build Charge
-> creature performs varied in-world work behavior
-> Build Charge contributed to Atlas
-> Atlas physically gains parts/stages
-> major phase unlocks new capability

Purpose:

Preserve the original “real effort visibly grows our world” thesis.

## Loop B — Edge Salvage

`Choose salvage depth/mode`
-> optional input/tool wear
-> retrieve unknown object / nothing / event
-> inspect object
-> choose sell / research / build / cultivate / keep / risk
-> result changes inventory/knowledge/world

Purpose:

Create a repeatable non-office discovery engine.

## Loop C — Research

`Unknown object`
-> safe inspect OR destructive analysis OR risky experiment
-> knowledge / blueprint / transformed item / anomaly
-> unlock new recipe/handling/capability

Purpose:

Prevent salvage from becoming “fish -> sell.”

## Loop D — Cultivation

`Recovered seed/specimen`
-> install in growth slot
-> time + selected real-world activity/care advances stages
-> visible transformation
-> choose harvest / preserve / further experiment

Purpose:

Long-duration visible world memory.

## Loop E — Room Incident

`Visible world event`
-> player interprets it
-> safe/risky response choice
-> consume input / perform action
-> success or consequence
-> room visibly changes

Purpose:

Make the room generate stories/tasks without a new map.

## Loop F — Build / Expansion

`Blueprint/discovery + common costs + specific items + build progress`
-> construction stages
-> new platform/facility appears
-> new verb/task family becomes possible

Purpose:

Make economy terminate in world capability.

## Loop G — Atlas Chain

`Atlas construction milestone`
-> fixed stranger room becomes observable
-> observed room knows observation is happening
-> repeated observation builds familiarity without identity disclosure
-> later costly influence becomes possible
-> influence generates a visible trace/opportunity in another node

Purpose:

Turn progression into anonymous persistent social connection.

---

# 13. Example situations for later content design

These are intentionally varied to establish the tone. They are not approved final quests.

## 13.1 Something is pulling the line

Trigger:

- salvage attempt catches a heavy unknown.

Choices:

- cut line: lose input, remain safe;
- pull carefully: ordinary recovery chance;
- overload winch: better rare outcome chance, risk tool/edge damage.

Possible failure follow-up:

- winch breaks;
- fragment hits floor edge;
- repair/research debris situation appears.

## 13.2 The wall is making a sound

Trigger:

- room anomaly.

Choices:

- seal/insulate;
- scan;
- open a controlled hole.

Possible outputs:

- knowledge;
- object;
- persistent visual change;
- temporary anomaly.

## 13.3 The seed refuses the pot

Trigger:

- strange cultivated item reaches a reaction stage.

Choices:

- destroy safely;
- move to containment;
- let it continue growing.

Result:

- safe material;
- new blueprint;
- unusual room growth/event.

## 13.4 Atlas receives a pulse

Trigger:

- Atlas sufficiently developed.

Choices:

- ignore;
- decode slowly;
- force decode with a staked input.

Result:

- knowledge;
- temporary Atlas instability;
- possible chain-related clue/event.

## 13.5 The room is being observed

Trigger:

- linked stranger currently observes this room.

World cue:

- in-world Atlas reaction, not merely a popup.

Initial player action:

- possibly nothing required; the event can simply create awareness.

Later progression may add response preparation without revealing observer identity.

---

# 14. Scene-space implications — do not overfinish the Office before reserving behavior space

The Office Final Polish must treat empty space as future gameplay capacity.

## 14.1 Center — Atlas Zone

Reserve:

- Atlas footprint;
- character approach/interaction clearance;
- vertical growth;
- miniature-room display visibility;
- future VFX without blocking camera.

Do not fill the central area with permanent decorative clutter.

## 14.2 Open Edge A — Rest / Observation Edge

Reserve:

- one or more safe sitting anchors;
- leg-hang clearance;
- creature approach route;
- possible future low-pressure social/rest behaviors.

## 14.3 Open Edge B — Retrieval / Salvage Edge

Reserve:

- basic hand-line interaction;
- later deployable winch/rig footprint;
- animation clearance;
- recovered-object landing/inspection point;
- possible VFX/debris zone.

## 14.4 Wall Utility Zone

At least one wall section should remain available for:

- physical board/archive;
- anomaly clues;
- research information;
- possibly small mounted devices.

Avoid turning every wall into immutable decoration.

## 14.5 Research / Processing Socket

The current Office should reserve at least one plausible place where a small research/processing object could later exist.

This does not require building it now.

The important requirement is not to make every desk/floor surface permanently unavailable.

## 14.6 Expansion Interfaces

At least one or more floor-boundary directions should remain structurally readable as future attachment points.

Do not place final art that makes all outward growth impossible without another visual redesign.

## 14.7 Personal Workstations

Desks should not be treated only as decoration slots.

Future personal desk states may support:

- normal work object;
- small research device;
- specimen/object under study;
- personal collectible;
- cosmetic identity.

Therefore desk slots should be semantic/action-capable, not merely “plant / mug / photo.”

---

# 15. Character-design implications

The planned non-human/strange creature direction should be evaluated against the verb library.

A strong creature design should make these actions cheap and readable:

- idle / look around;
- walk/hop/slide;
- sit/curl/rest;
- pull/lift/carry;
- inspect/hold/look;
- tap/repair/assemble;
- startled/react/celebrate.

These reusable actions can cover many tasks.

Do not choose a visually interesting creature whose anatomy makes all physical interaction more expensive than a humanoid.

The best target is:

> Distinctive silhouette + simple rig + forgiving contact + expressive reusable motions.

---

# 16. Production strategy — make strange systems cheap through state changes

Many world events can be implemented as deterministic state swaps rather than expensive simulation.

Examples:

### Wall event

`Wall_Intact`
-> crack decal/mesh stage
-> particle burst
-> `Wall_Open/Broken` variant

### Cultivation

`Stage_0`
-> `Stage_1`
-> `Stage_2`
-> `Stage_3`

### Salvage rig

- deploy/retract transform animation;
- hook/line animation;
- pre-authored recovered-object spawn/contact socket.

### Atlas

- phase prefabs / sub-object activation;
- simple transform animation;
- restrained particles/emissive.

### Room anomaly

- local object state change;
- limited particles;
- physics only where controlled;
- avoid universal realtime mesh destruction unless explicitly required.

This is consistent with the project's new spatial-interaction contract: geometry/anchors first, visual QA last.

---

# 17. Design acceptance tests for any new mechanic

A proposed mechanic should not enter implementation merely because it sounds fun.

Ask:

1. What new verb/decision does it create?
2. What visible part of the room does it use/change?
3. Does it create value other than Coins?
4. What meaningful sink/opportunity cost exists?
5. Can a solo player use/complete it?
6. Does multiplayer improve it without becoming mandatory?
7. Can failure create interesting follow-up rather than only subtraction?
8. Does it respect no-punishment-for-absence?
9. Can it be implemented with reusable creature animations and deterministic spatial anchors?
10. Does it remain readable from the frozen Office camera?
11. Does it make the room more distinctive after weeks of play?
12. Does it open future design space instead of consuming space for a one-off gimmick?

A mechanic that fails several of these questions should be redesigned before code.

---

# 18. Current strongest proposed framework

The current recommended core is:

```text
REAL-LIFE EFFORT
      ↓
FOCUS / COMMIT
      ↓
XP + Coins + limited Build Charge
      ↓
WORLD VISIT
      ↓
Retrieve / Inspect / Build / Rest / Respond
      ↓
Items + Knowledge + World State + Consequences
      ↓
Projects / Facilities / Atlas / Expansion
      ↓
NEW VERBS + DEEPER RISKS + NEW SPACES
      ↓
Atlas Observation / Future Influence
      ↓
A ROOM THAT BECOMES STRANGER, MORE CAPABLE, AND MORE CONNECTED
```

The economy is therefore not a shop economy.

It is a **capability-and-world-change economy**.

Coins remain useful but subordinate.

The most valuable rewards are:

- new capabilities;
- new knowledge;
- specific meaningful objects;
- visible persistent world transformations;
- new relationships between rooms.

---

# 19. What should be designed next

Before final Office polish and before writing a full Level 1–30 reward table, the next design artifact should be a **World Activity & Spatial Socket Map**.

It should map every important existing room area to:

- current purpose;
- future possible verbs;
- required anchor/socket/clearance;
- whether the space can be permanently decorated;
- whether it must remain flexible;
- likely asset/animation/VFX cost.

This will allow Office Final Polish to proceed without accidentally occupying future gameplay space.

No scene/code change is authorized by this document.
