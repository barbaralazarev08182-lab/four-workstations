# VQ2 Matter Reclamation & Fabrication Bench — Concept and Interaction Spec

> Date: 2026-09-04  
> Status: DESIGN PROPOSAL / NOT YET USER-LOCKED  
> Scope: physical design, player-facing workflow, processing logic, output handling, first-hour onboarding use  
> Implementation authorization: NONE

## 0. Purpose

Define a single in-room machine that turns recovered physical objects into understandable, reusable world value without collapsing all recovered objects into generic currency.

The machine must support the already locked VQ2 resource architecture:

- retrieved objects first exist physically in the room;
- the player decides whether to preserve, strip, reclaim, research, or contain them;
- ordinary fabrication reshapes matter already inside the refuge and therefore does not directly reduce Refuge Reserve `R`;
- bulk feedstock families are Structure, Polymer, Conductive, and Bio/Volatile;
- high-capability fabrication may additionally require intact components and knowledge/blueprints;
- the machine is part of the same world loop as Retrieval, room construction, Continuity Body maintenance, plants, devices, and Atlas progression.

This document does not lock final visual styling, exact dimensions, processing times, animation timings, sound design values, material costs, or final nomenclature.

---

## 1. Working identity

Working English name:

`Matter Reclamation & Fabrication Bench`

Working Chinese name:

`物质回收重构台`

Design intent:

> A domestic-scale alien workshop that can inspect, separate, reclaim, and refabricate matter, but still treats recovered objects as physically meaningful things rather than inventory tokens.

It should feel more like a precise research/workbench hybrid than a giant industrial furnace or magical matter printer.

Avoid:

- trash compactor read;
- oversized factory conveyor read;
- arcade vending machine read;
- generic sci-fi replicator that converts anything into anything;
- hologram-only UI with no physical work surfaces;
- dense cyberpunk panels and neon strips;
- a single slot that simply deletes objects and awards numbers.

---

## 2. Recommended physical scale and placement

Recommended first-pass footprint:

- width: approximately 2.6 m;
- depth: approximately 0.9 m;
- main work-surface height: approximately 0.95 m;
- highest fixed structure: approximately 1.6–1.8 m;
- player clear standing zone in front: at least 1.1–1.3 m deep;
- side service clearance: approximately 0.5 m where scene layout permits.

The exact values remain tunable after in-engine first-person scale review.

The Bench should be floor-standing and self-supporting. It should not require the final two-wall architecture to function, so the room layout can evolve independently.

Recommended placement principle:

- not directly beside Atlas;
- not immediately beside the Retrieval Station;
- close enough that a retrieved object can be physically moved to it without feeling like an inventory teleport;
- far enough from the open edge that a first-time player can safely inspect and manipulate objects without accidental fall-risk framing;
- visually belongs to the workshop/home side of the room, while Retrieval Station belongs to the boundary/Outside side.

---

## 3. Physical layout — four functional zones in one machine

Recommended left-to-right organization from the player's front-facing view:

`[ Intake / Scan ] -> [ Separation Core ] -> [ Material & Component Output ] -> [ Fabrication Output ]`

These are not four unrelated machines. They are four readable functions inside one continuous bench.

### 3.1 Intake / Scan Cradle

Purpose:

- receive a physical recovered object;
- hold irregular objects securely;
- perform non-destructive first analysis;
- provide the player's first decision point.

Recommended form:

- shallow open cradle rather than closed oven;
- approximately 0.75–0.9 m wide;
- adjustable three-point supports or low-profile adaptive clamps;
- support geometry retracts when empty;
- integrated ring/arc scanning structure rises or pivots around the object during analysis;
- object remains visibly recognizable during initial scan.

Do not immediately hide the object behind a door.

The player should still feel: "this is the thing I just brought home."

### 3.2 Separation Core

Purpose:

- controlled disassembly;
- preserve intact functional components when possible;
- prepare remaining bulk matter for reclamation;
- visually explain why Strip and Reclaim are different choices.

Recommended form:

- central semi-enclosed work volume;
- transparent/smoked protective shield can close only when destructive processing starts;
- two or three compact articulated precision tools rather than many industrial robot arms;
- internal movement should be precise and calm, not factory-chaotic;
- the player can still see the object's silhouette and major structural changes.

The machine should be able to perform visible actions such as:

- release a fastener/interface;
- cut along a seam;
- separate a shell;
- remove one intact module;
- direct bulk fragments into the reclamation channel.

No gore-like treatment for biological material in the default workflow. Bio/Volatile handling requires later content-specific safety rules.

### 3.3 Material & Intact-Component Output

Purpose:

Make the result physically legible instead of only updating HUD balances.

Recommended two distinct output types:

A. `Component Tray`

- a small open tray/drawer near waist height;
- intact motors, sensors, cores, optical modules, regulators, unidentified assemblies, etc. appear here as real items;
- unknown/valuable components should remain physical objects until stored, researched, installed, or deliberately reclaimed.

B. `Feedstock Reservoirs`

- four compact visible storage channels/reservoirs integrated below or behind the work surface;
- Structure;
- Polymer;
- Conductive;
- Bio/Volatile.

The player does not need to see loose powder pellets for all four categories. The reservoirs may use internally stabilized cartridges/cassettes.

Recommended visual language:

- same machine family;
- distinct shape/icon/texture coding first;
- color only as a secondary cue;
- avoid saturated red/green/blue/yellow game-resource bins.

The four feedstock values may appear on the Bench's local interface and later on contextual build UI, but should not become permanent MMO wallet bars on the main HUD.

### 3.4 Fabrication Output Bay

Purpose:

- manufacture small finished objects;
- create Build Packages for medium objects;
- create project components for large structures.

Recommended form:

- right-side open output bay;
- compact adjustable platform;
- protective shell/field closes temporarily during active fabrication;
- fabrication progress is visible through partial silhouette, layered assembly, or moving structural bands;
- avoid magical instant fade-in.

Output categories:

1. Small finished item — tool, repair part, lamp module, sensor, small container.
2. Medium `Build Package` — chair, table, cabinet, bed, plant module, equipment module.
3. Large `Project Package` — wall segment kit, floor/platform kit, containment frame, large utility module, Atlas-related construction part.

Large structures are completed in-world at their construction site, not emitted fully assembled from the Bench.

---

## 4. Primary player standing positions

The Bench should support three natural interaction positions rather than requiring the player to stand on one exact marker.

### Position A — Intake

Used for:

- carrying/placing recovered object;
- starting scan;
- physically observing the object before any destructive action.

### Position B — Center / Decision

Used for:

- reading scan results;
- choosing Preserve / Strip / Reclaim / Research / Contain;
- watching separation;
- taking intact components.

### Position C — Fabrication

Used for:

- choosing known blueprint;
- previewing required material/component inputs;
- starting fabrication;
- taking the finished item or Build Package.

Do not force camera locking. First-person control should remain available except for very short interaction focus moments if required for usability.

---

## 5. Interaction philosophy

The Bench should not use a giant floating crafting menu.

Preferred structure:

- physical object first;
- local machine display second;
- contextual minimal text third;
- global HUD last.

The player should be able to understand the machine's current state by looking at it.

Core states:

- `Idle`
- `ObjectLoaded`
- `Scanning`
- `AnalysisReady`
- `AwaitingDecision`
- `Stripping`
- `Reclaiming`
- `ResearchTransfer`
- `ContainmentTransfer`
- `Fabricating`
- `OutputReady`
- `PowerLimited`
- `BlockedByStability`

---

## 6. Analysis result presentation

The first scan should not generate a full encyclopedic report.

Recommended layered output:

### Layer 1 — immediate practical information

- estimated total mass contribution;
- broad material composition;
- artificial / natural / biological / unknown;
- active motion/life signs if detectable;
- current handling risk;
- anomaly/stability warning if present.

### Layer 2 — separable value

- recoverable bulk feedstock estimate;
- possible intact components;
- uncertain/internal region;
- whether destructive processing will destroy unknown structure.

### Layer 3 — knowledge-dependent details

Unlocked only after relevant research:

- more precise classification;
- likely original function;
- compatibility with existing systems;
- special blueprint potential;
- safe containment requirements;
- deeper anomaly information.

Important rule:

> The Bench may tell the player what it can currently detect; it must not authoritatively explain mysteries the world has not yet earned.

---

## 7. The five processing paths

### 7.1 Preserve

Action:

- eject/return object unchanged.

Use cases:

- collection;
- room display;
- later research;
- Atlas observation;
- emotional/story value;
- player uncertainty.

Cost:

- essentially no permanent R change;
- only small temporary P use for scanning.

### 7.2 Strip

Action:

- precision disassembly designed to preserve useful intact subcomponents.

Tradeoff:

- lower bulk-material yield than full Reclaim;
- greater chance to preserve whole components;
- may reveal internal mystery objects without destroying them.

Best use:

- artificial machinery;
- complex devices;
- potentially reusable systems.

### 7.3 Reclaim

Action:

- destructive matter recovery.

Tradeoff:

- maximum generic material recovery;
- destroys object identity;
- destroys components not explicitly extracted first;
- should require a deliberate confirmation when the item is unique, unknown, alive, story-relevant, or not yet fully analyzed.

Reclaim must not be the default one-click action.

### 7.4 Research

Action:

- transfer object/sample to a research-compatible state/module.

Early game:

- may simply reserve the object on a protected Bench rack and begin non-destructive analysis.

Later:

- dedicated Research Module may handle longer experiments.

Outputs:

- knowledge;
- classification;
- blueprint;
- handling rule;
- Atlas interpretation;
- new scan capability.

### 7.5 Contain

Action:

- move unstable, living, active, or anomalous matter into a controlled enclosure.

Early game:

- Contain may be unavailable until a basic containment capability is built.

If unavailable, the Bench must not pretend the object is safe. It should warn the player and force Preserve / limited Research / leave outside / other available handling choices.

---

## 8. Material-accounting contract

The Bench reshapes matter; it does not create or destroy Refuge Reserve `R` under normal closed-refuge operation.

Example:

Recovered object inside Atlas:

- total normalized contribution: `0.80 R`.

After Strip/Reclaim:

- Structure: 0.42;
- Polymer: 0.13;
- Conductive: 0.12;
- intact component: 0.08;
- anomalous core preserved: 0.05.

Total remains:

`0.80`

Build a chair using 0.55 of feedstock:

- feedstock storage decreases by 0.55;
- chair world-mass state increases by 0.55;
- total `R` remains unchanged.

Any apparent processing loss should normally become another internal state such as recoverable residue/heat rather than silently deleting R.

Exact thermal/exergy simulation is out of scope for V1 unless later needed for gameplay.

---

## 9. Power behavior

The Bench is a high-P device but not a major direct R sink while Atlas is closed.

Recommended behavior:

- Scan: low to moderate P draw;
- Strip: moderate P draw with short peaks;
- Reclaim: high P draw;
- Fabricate small: moderate P draw;
- Fabricate medium package: high P draw over longer duration;
- large project package: high P draw and possibly staged operation.

If Power Headroom is insufficient:

- the Bench slows or pauses safely;
- local machine lighting reflects reduced throughput;
- the game should not permanently delete inputs;
- low-R conservation policy may limit peak fabrication before critical systems are threatened.

---

## 10. Recommended local interface

The Bench should use one integrated physical display rather than many screens.

Recommended location:

- centered above/behind the main work surface;
- readable while player stands 0.7–1.2 m away;
- angled slightly upward toward first-person eye level.

Display modes:

1. object scan silhouette;
2. composition bands;
3. anomaly/risk indication;
4. processing choice;
5. projected outputs;
6. blueprint/fabrication list;
7. material/component requirements;
8. local process progress.

Avoid conventional RPG rarity colors.

Use restrained typography, simple symbols, real spatial relationship to the loaded object, and optional drone voice guidance during onboarding.

---

## 11. First Chapter first-use sequence — target 2–4 minutes

This is the recommended onboarding use after the player's first successful Retrieval.

### Beat 1 — object lands in the room

The first recovered object remains on the oak floor.

No automatic inventory collection.

The player can walk around it and inspect it physically.

Drone prompt is minimal:

> "I can analyze it. Bring it to the Bench."

### Beat 2 — physical loading

Player carries or guides the object onto Intake Cradle.

Adaptive supports close around it.

Machine recognizes stable placement.

### Beat 3 — non-destructive scan

A single clean scan cycle runs.

Recommended visual sequence:

- Bench wakes;
- scan arc rises/pivots;
- warm-neutral light traverses object;
- local display builds a rough silhouette;
- machine briefly pauses at an unresolved internal zone.

The first result should be readable in under 10–15 seconds.

Example result:

- artificial composite structure;
- mostly common recoverable matter;
- one intact internal component;
- one unresolved internal core/region;
- no immediate active hazard detected;
- unresolved region should not be reclaimed without loss of information.

### Beat 4 — first meaningful processing choice

For the first tutorial use, the recommended default lesson is `Strip`, not full Reclaim.

Reason:

- shows that objects contain both bulk matter and specific components;
- physically reveals the internal mystery;
- avoids training the player that every retrieved object should be destroyed.

The player confirms Strip.

### Beat 5 — visible separation

Protective shield partially closes.

Precision tools remove outer shell/material sections.

One intact component is placed on Component Tray.

The unresolved core remains physically intact.

Bulk material reservoirs increase.

### Beat 6 — immediate use of reclaimed value

The Bench suggests or unlocks one simple known blueprint / Build Package that uses part of the newly available material.

Recommended onboarding outcome:

- player fabricates a second small domestic/work module or a practical room item;
- machine outputs a physical Build Package;
- player uses Build Grid to place it;
- room visibly improves.

This closes:

`Retrieve -> Inspect -> Process -> Fabricate -> Place -> Observe`.

### Beat 7 — mystery remains

The unresolved core/component is still present as a physical object.

It may be preserved, placed, researched later, or react subtly to the later Chapter 1 war event.

The Bench must not explain it away.

---

## 12. First-use failure protections

First Chapter onboarding must prevent accidental destructive mistakes.

Recommended safeguards:

- unique/unknown first object cannot be fully reclaimed without a second deliberate confirmation;
- unresolved internal core is highlighted as "information loss if destroyed" rather than "rare item";
- no irreversible failure caused by misunderstanding the controls;
- no mandatory timed interaction;
- no QTE;
- no random destruction chance during the tutorial processing;
- no hidden recipe requirement that blocks the first successful fabrication.

Later systems may introduce risky processing only after the player explicitly chooses that risk.

---

## 13. Physical storage recommendation

Do not represent all feedstock as loose room props.

Recommended:

- Bench contains internal standardized material cassettes/reservoirs for the four bulk categories;
- important intact components remain discrete physical inventory/world objects;
- special/unique artifacts remain physical;
- ordinary bulk feedstock may be represented numerically on the local machine and construction interfaces.

This creates a useful distinction:

> Bulk matter is standardized and fungible within a category; discoveries and intact components keep identity.

---

## 14. Visual/material language proposal

Must harmonize with current VQ2 rather than reproduce old office equipment.

Recommended:

- warm titanium-silver / light technical metal as primary shell family;
- off-white ceramic/composite work surfaces;
- dark graphite only in mechanical gaps, service channels, and protective interiors;
- restrained warm ivory operational light;
- transparent/smoked safety panels where necessary;
- asymmetry allowed, but overall silhouette should feel stable and domestic-scale;
- low greeble density;
- visually precise seams and interfaces rather than exposed pipes everywhere.

The machine should look advanced enough to process alien matter, but comfortable enough to plausibly live beside for years.

---

## 15. Sound direction proposal

Core sound should be restrained and tactile.

Idle:

- almost silent;
- very low electrical/field presence.

Scan:

- one soft rising tonal sweep;
- faint mechanical movement;
- small pause/chirp at unresolved regions.

Strip:

- precise clicks;
- short servo movement;
- controlled cutting/separation sounds;
- no loud grinder by default.

Reclaim:

- deeper contained processing tone;
- material movement within sealed chamber;
- power-load response audible in Power Hub if desired.

Fabrication:

- layered assembly pulses and short mechanical seating sounds;
- final output should have a satisfying real-world weight/contact sound.

Avoid constant beeping.

---

## 16. Animation requirements for the player character

The Bench should initially avoid requiring complex bespoke whole-body animation for every action.

Minimum useful interactions:

- carry/guide medium recovered object;
- place object on cradle;
- take component from tray;
- take Build Package;
- optional short hand-touch/confirmation interaction.

The machine should perform most precise disassembly itself.

Later Continuity Body animation can add richer manipulation without blocking early implementation.

---

## 17. Production decomposition

User-authored visual asset responsibility candidate:

- main Bench shell;
- Intake Cradle;
- scan arc/ring;
- Separation Core visible tools and shield;
- Component Tray;
- four feedstock reservoir doors/indicators;
- Fabrication Output Bay;
- display frame;
- visible hard mechanical interfaces.

Unity/runtime responsibility candidate:

- object load socket logic;
- adaptive cradle animation/control;
- scan sequencing;
- local UI rendering;
- processing state machine;
- component/material accounting;
- recipe/blueprint validation;
- build-package spawning;
- P-load response;
- R accounting invariants;
- safe interruption/recovery;
- first-chapter tutorial scripting.

Exact ownership may change after modeling review.

---

## 18. Recommended implementation order

Do not build the full machine at once.

Prototype order:

### M0 — Graybox spatial test

- 2.6 m proxy bench;
- Intake surface;
- player standing clearance;
- output bay;
- first-person scale review.

### M1 — Load and Scan

- physical object placed into Intake;
- local scan result;
- no destructive processing yet.

### M2 — Strip and Outputs

- one scripted object;
- separates one intact component + bulk categories;
- validate R conservation.

### M3 — Fabricate one Build Package

- consume standardized feedstock allocation;
- output one physical package;
- place through Build Grid;
- validate R unchanged.

### M4 — First Chapter integration

- connect first Retrieval object;
- complete the 2–4 minute onboarding sequence;
- Human Visual/Feel review.

Only after this should the design expand toward Reclaim, Research, Contain, recipe libraries, large construction projects, and advanced anomaly handling.

---

## 19. Human review questions before locking

1. Does 2.6 m-wide domestic workshop scale feel correct inside the current 20x20 room?
2. Should the Bench read more as furniture/workbench or more as advanced appliance?
3. Should Intake and Fabrication be left/right as proposed, or reversed for room flow?
4. Is the first tutorial path `Strip -> component + materials + preserved core` accepted?
5. Is it desirable for four bulk feedstock reservoirs to be physically visible, or should the machine hide most storage internally?
6. Should the player physically carry medium recovered objects, or should the Bench/Drone assist with heavy-object movement?
7. Should the first fabricated Build Package be a domestic object, workshop object, or player-selected second starter module?
8. Should unique intact components normally remain physical in-room objects until installed/stored, or enter a dedicated physical storage cabinet?

Until these receive user decisions, the Bench remains a proposal rather than a locked production contract.
