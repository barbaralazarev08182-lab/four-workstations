# VQ2 Resource, Retrieval, Refuge Reserve & Synthetic Body — Deep Research

> Date: 2026-09-04
> Status: DEEP RESEARCH / STRONG DESIGN PROPOSAL — NOT YET USER-LOCKED
> Scope: retrieved-object processing, material/fabrication loop, Orb control/radar/light states, Atlas refuge mass-energy accounting, low/high reserve consequences, synthetic-body gameplay
>
> This document responds to the user's request to challenge or reconstruct weak assumptions rather than preserve them by patching. It does **not** authorize implementation and does not silently supersede later explicit user decisions.

---

# 0. Executive conclusion

The current design becomes much more coherent if four decisions are taken together:

1. **Retire the old `XP / Coins / Build Charge` architecture from the core VQ2 physical economy.** Those documents were research for the earlier productivity/office direction. The current native Unity refuge game should primarily use physical recovered matter, specific intact components, knowledge/blueprints, and room/world state. Coins may still exist later for a separate social/commercial layer, but should not be the universal answer to construction.
2. **Use one paired Matter Workbench with two physically legible functions: Reclaim and Fabricate.** Retrieved objects remain physical until the player deliberately preserves, strips, researches, contains, or destroys them.
3. **Do not treat ordinary electricity use as permanent loss of the refuge's total 100 reserve.** In a sealed refuge, lights/TV/sun/body/workbench merely move energy between usable and low-grade/thermal states. The total long-term reserve changes mainly when the Atlas boundary is opened and matter/energy crosses it.
4. **Keep the synthetic/robot-like player body, but redefine it as a human-continuity body rather than a generic robot.** Preserve human rituals such as eating, drinking, resting and sleeping as optional identity/comfort/narrative actions rather than mandatory hunger/thirst bars. Functional power should largely be handled passively by the room's wireless power field.

This produces one coherent fantasy:

`Outside object -> Retrieval -> physical object in room -> inspect/decide -> reclaim selected matter -> fabricate/build -> room changes -> larger capability -> deeper Retrieval`

while the Atlas reserve loop is:

`sealed refuge: total reserve conserved -> breach causes real loss -> retrieved matter replenishes/increases reserve -> too little causes conservation -> too much beyond Atlas capacity causes field load`

---

# 1. Why the older economy should not drive the current game

Existing historical/proposed VQ2 economy documents define XP, Coins and Build Charge. They correctly contain reusable principles such as:

- sources / pools / sinks / converters;
- visible world change is stronger than invisible numerical gain;
- recovered objects should have multiple possible uses;
- failure should create new situations rather than only subtract currency;
- upgrades should unlock new capabilities rather than only +X% efficiency.

However, the current game is no longer an office productivity companion. Therefore the old wallet architecture should not be treated as current authority.

For the current refuge game, the recommended core value types are:

- **Refuge Reserve** — one normalized top-level mass-energy reserve for the Atlas domain;
- **Material Feedstocks** — physical construction matter already inside that reserve;
- **Intact Components** — discrete special parts that should not be melted into generic currency;
- **Knowledge / Blueprints** — informational progression;
- **World State** — structures, living things, discoveries, Atlas capability and persistent room changes.

Do not add a general `Scrap` currency that makes all recovered objects equivalent.

---

# 2. Retrieved-object handling — recommended physical pipeline

## 2.1 The object must remain an object first

A recovered thing should not immediately become an inventory icon or number.

Default sequence:

1. Orb pulls target across Atlas boundary.
2. Target physically enters the room.
3. Target is placed/dropped on a receiving pad or floor.
4. Player can walk around it, inspect it and decide what it means.
5. Only after a deliberate decision does it enter processing.

This preserves the central fantasy that the Outside is real and its contents can become part of the player's home.

## 2.2 One machine, two clearly separated processes

Working name only:

**Matter Reclamation & Fabrication Bench / 物质回收重构台**

The visual asset should read as one room facility but contain two separate bays:

### Left / Intake side — Reclaim

- physical intake cradle;
- analysis arch / scan field;
- sealable decomposition chamber;
- output feedstock rack/cassettes.

### Right / Output side — Fabricate

- blueprint/pattern selector;
- feedstock intake from local storage;
- small-object fabrication chamber;
- output tray / build-package dock.

Central area:

- small physical status display;
- material yield preview;
- anomaly/life warning;
- no giant floating crafting menu by default.

Recommended approximate footprint for later art exploration: wall-side machine roughly `2.0–2.5 m` wide, `0.8–1.0 m` deep, `1.2–1.5 m` high. Exact dimensions are not locked.

## 2.3 Analysis comes before destruction

Basic scan should classify:

- approximate total mass;
- structural composition;
- polymer/fiber fraction;
- conductive/functional fraction;
- biological/volatile fraction;
- life/activity indication;
- anomaly / unresolved component;
- known blueprint relationship, if any.

The machine should never auto-recycle a living or unresolved anomalous object.

## 2.4 Four bulk material families

Recommended generic feedstocks:

### `Structure`

Metals, minerals, ceramics, glass-like material, structural composites.

Used for:

- wall/floor/platform sections;
- furniture frames;
- shelves/storage;
- machine housings;
- Retrieval Station structural upgrades;
- rails, supports, brackets.

### `Polymer`

Plastics, elastomers, fibers, sealants, insulation, textiles/soft composites.

Used for:

- cable jackets;
- seals;
- cushions/furniture surfaces;
- flexible joints;
- containers;
- clothing/synthetic surface components.

### `Conductive`

Conductors, semiconductor-grade matter, optical/electrical functional materials and other reusable electrical feedstock.

Used for:

- sensors;
- displays;
- power routing;
- Retrieval electronics;
- radar/echo equipment;
- workbench electronics;
- Power Hub upgrades.

### `Bio / Volatile`

Water, carbon-rich organics, nutrients, gases and biologically useful feedstock.

Used for:

- plants;
- food/sensory products;
- animal support;
- bio-polymers;
- atmosphere/water replenishment;
- later cultivation systems.

These four should be understood as standardized processed feedstock, not four arbitrary currencies.

## 2.5 Intact Components are separate from bulk feedstock

Important rule:

> Advanced technology should not be reproducible merely because the player melted enough random chairs.

Some recovered things contain:

- power regulators;
- optical assemblies;
- high-precision actuators;
- unknown cores;
- alien functional modules;
- living structures;
- irreproducible artifacts.

These remain **discrete physical components**.

Construction recipes can therefore require:

`generic feedstock + specific intact part + blueprint/knowledge`

rather than only a pile of universal material.

## 2.6 Player decisions at the Reclaimer

Recommended choices:

### Preserve

Do nothing destructive. Keep/display/store the object.

### Strip

Open/disassemble carefully. Lower bulk yield but better chance to preserve functional components and information.

### Reclaim

Destructive bulk conversion. Highest generic feedstock yield, destroys most authored structure/identity.

### Hold for Research

Machine refuses destructive processing until a later Research facility or knowledge gate handles the unknown component.

### Contain

For living/unstable/anomalous targets. Requires later containment capability.

This is stronger than `loot -> sell`, because the same object can have mass value, component value, knowledge value, narrative value and relationship value.

---

# 3. Fabrication and construction

## 3.1 Small output

The Matter Bench can directly fabricate:

- repair patches;
- tether sleeve/connector parts;
- simple tools;
- small storage bins;
- small lamps;
- household utensils;
- sensor pieces;
- basic electronic modules.

## 3.2 Medium output

Furniture and medium devices should emerge as a **Build Package / assembly kit**, not magically appear in the player's inventory.

Examples:

- chair;
- table;
- shelf;
- bed/rest unit;
- monitor/TV support;
- plant rack;
- small research module.

Player takes/authorizes the package, enters placement mode, snaps it to the existing `0.5 m` logical Build Grid, rotates and confirms.

The final assembly can use a short local field/assembler animation. The player should see the object become part of the room.

## 3.3 Large output

Large architecture should be project-based:

- wall segment;
- floor expansion;
- external platform;
- containment bay;
- advanced Retrieval module;
- larger Power Hub equipment;
- Atlas-linked structure.

Large projects should consume material over stages and physically change the room.

Do not have a desktop-sized machine instantly eject a complete 4 m wall.

## 3.4 Recommended recipe logic

Examples below are balance placeholders, not locked prices:

- Basic chair: `2 Structure + 2 Polymer`
- Small shelf: `4 Structure + 1 Polymer`
- Room lamp: `1 Structure + 1 Polymer + 1 Conductive`
- Tether maintenance pack: `1 Polymer + 1 Conductive`
- Basic sensor upgrade: `1 Structure + 3 Conductive`
- Plant module: `2 Structure + 2 Polymer + 2 Conductive + 3 Bio`
- 2x2 m structural platform unit: `8–12 Structure + 1–2 Polymer + 1 Conductive`
- Advanced Power Hub module: generic feedstock + a specific intact regulator/component
- Atlas capability upgrade: **must never be generic feedstock only**; require discovery/knowledge and one or more specific recovered elements.

Exact units must be tuned after a real retrieval-yield simulation.

---

# 4. Retrieval Orb — player control architecture

Existing locked technical rules remain:

- Orb is active/self-directed, not a passive fishing bobber;
- powered tether originates at `Tether_GuideTip` on the far end of the guide arm;
- Orb can travel upward/downward/horizontal/diagonal;
- tether powers Orb outside local refuge power;
- Orb returns to `Orb_CradleSocket` in the front basket;
- long reach must remain configurable;
- avoid ordinary gravity-pendulum fishing behavior.

## 4.1 Do not make the player manually pilot six degrees of freedom

Full drone-simulator controls would conflict with LOW VERB / HIGH DISCOVERY and increase cognitive load.

Recommended interaction is **shared control**:

- player specifies desired direction/target;
- Orb handles stabilization, braking and micro-collision avoidance;
- tether system automatically pays out/reels appropriately;
- player remains responsible for where to go, what to scan and what to connect to.

## 4.2 Retrieval Mode

Functional input vocabulary, not final key bindings:

### Enter Retrieval Mode

Player interacts with Station.

Effects:

- guide arm wakes/aims if later articulated;
- Orb powers up;
- Station Echo display activates;
- standard first-person camera remains grounded in the room.

### Aim

Player look/cursor defines desired azimuth/elevation.

### Drive / Extend

Hold one primary input:

- Orb actively moves toward the aimed direction;
- tether automatically pays out as required;
- releasing input causes Orb to brake and hold rather than drift forever.

### Scan

One secondary input emits an active Echo Pulse.

### Acquire / Connect

Once a return is resolved and the Orb is close enough, one contextual input establishes capture/interaction.

### Retrieve

Hold a dedicated return/reel input:

- Station reels cable in;
- Orb actively cooperates with return motion;
- attached object follows according to mass/tension constraints.

### Abort / Auto-home

Emergency/simple return command. Orb safely attempts to return to cradle.

## 4.3 Camera

Recommended baseline:

- player keeps first-person view at Station;
- nearby Orb is viewed directly in-world;
- when Orb travels beyond comfortable visual range, a small physical Station screen shows Orb camera imagery;
- optional later `Orb View` can enlarge this feed, but should not be mandatory.

Reason: the room/tether relationship is the fantasy. A permanent full-screen drone camera would make the player forget that their body is still standing at the Station.

---

# 5. Echo / radar system

A radar-like tool is strongly recommended because long-distance 3D teleoperation without spatial aids becomes needlessly difficult.

Working name:

**Echo Disc / Echo Scope / 回波盘**

## 5.1 Physical presentation

Integrate it into Retrieval Station rather than adding a generic HUD minimap.

Recommended display:

- shallow circular/oval disc centered on Station/Orb frame;
- concentric range marks;
- current maximum tether reach shown as outer limit;
- contact markers projected onto the reference plane;
- vertical stems show above/below-plane displacement;
- selected target gets a restrained outline, not loot-rarity color.

This borrows a proven 3D spatial-reading principle from space-sim scanners without copying their art style.

## 5.2 Detection states

### Passive return

Very weak contacts appear only as uncertain/flickering marks.

### Active Echo Pulse

Orb emits one expanding pulse. This briefly increases resolution of nearby targets.

### Resolved contact

System can estimate:

- direction;
- range;
- relative motion;
- approximate mass band;
- activity/life-like motion;
- unresolved anomaly indication.

Do **not** reveal exact loot contents at long range.

## 5.3 Contact visual language

Prefer shape/rhythm over rainbow colors:

- solid/simple mark: resolved inert object;
- hollow mark: weak/unresolved return;
- double/animated return: moving or active target;
- broken/distorted mark: anomalous/interfered return;
- vertical stalk: target above/below reference plane.

---

# 6. Orb light states

Existing visual direction remains warm ivory / beige-yellow / yellow-white, restrained, premium, non-neon.

Do not solve state readability primarily by changing the Orb into red/green/blue game-UI colors.

Recommended states:

## Stored

- low-intensity warm glow;
- very slow 5–7 s breathing;
- reads as sleeping but connected.

## Power-up

- smooth rise in intensity;
- one traveling pulse from Station through tether to Orb.

## Deploying / cruising

- medium stable glow;
- slight forward-side emphasis toward motion direction;
- slow breathing remains.

## Approaching Atlas boundary

- breathing period shortens subtly;
- surface seam/arc becomes slightly more legible;
- no alarm color.

## Boundary crossing

- one brief white-gold intensity swell;
- visible pulse travels along tether;
- Atlas boundary ripple carries most of the spectacle.

## Active scan

- one radial expansion across luminous shell;
- Echo Pulse travels outward;
- no strobe.

## Target resolved

- one asymmetric precision element / arc stabilizes toward target;
- base glow becomes steady rather than flashing.

## Contact / capture

- short double pulse;
- tether brightness increases near connector;
- target connection is readable physically.

## Tension

- faster directional pulse along tether;
- Orb core visually tightens/brights slightly;
- Station display communicates actual tension value.

## Heavy Tension

- stronger but restrained amber-warm bias may be tested at Station indicators;
- Orb should avoid generic flashing red unless Human Visual review proves it necessary.

## Low operational power

- overall intensity decreases;
- breathing slows;
- never use random flickering unless the state is actual instability/anomaly.

## Anomalous interference

- tiny timing desynchronization / asymmetric pulse is preferable to a dramatic color swap.

---

# 7. The 100-point refuge model — necessary reconstruction

## 7.1 The user's intent should be preserved, but the literal interpretation must change

User intent:

- all matter/energy in the refuge can be understood under one conserved global value;
- starting world is normalized to 100;
- Retrieval opening has real cost;
- bringing matter back can restore/grow the refuge;
- low reserve affects the world;
- too much matter may stress the system.

Recommended correction:

> `100` should be a **normalized Atlas Refuge Reserve**, not a literal percentage of kilograms plus joules.

Reason:

If the refuge is sealed, turning on a TV or lamp cannot make total mass-energy vanish. Energy changes form. Therefore we need to distinguish **total reserve** from **currently usable power/exergy**.

## 7.2 Three variables, only one long-term resource

### `R` — Refuge Reserve

Long-term normalized mass-energy inventory.

Start:

`R = 100.0`

This is the main persistent resource.

It changes only through boundary flux / exceptional loss:

`R_next = R_now + imported equivalent - exported equivalent - breach leakage`

Do not call `100` a maximum. It is the starting nominal reference and may go above 100.

### `P` — Operational Power

Short-term usable energy state.

Not a second currency.

Lights, artificial sun, TV, workbench, Orb thrust, robot charging etc. temporarily draw `P`.

Used power mostly becomes heat/low-grade energy inside the closed refuge and is gradually recovered/reconditioned by Atlas/Power systems.

Therefore ordinary use does not permanently reduce `R`.

### `S` — Stability Margin / Field Load

Derived condition, not spendable money.

Depends on:

- Atlas tier/capacity;
- total stabilized mass;
- unintegrated foreign mass;
- current breach size;
- active anomalies;
- system damage.

High `R` is useful until the current Atlas tier is overloaded.

## 7.3 Closed-state rule

When Atlas is completely closed and healthy:

- ordinary lights: `R` loss ≈ 0;
- artificial sun: `R` loss ≈ 0;
- TV: `R` loss ≈ 0;
- workbench: `R` loss ≈ 0;
- robot locomotion/charging: `R` loss ≈ 0;
- plant/animal metabolism: `R` loss ≈ 0;
- fabrication/recycling: `R` loss ≈ 0` (matter is rearranged; usable energy temporarily changes state).

These activities can create temporary `P` load and thermal/recovery backlog.

This preserves the fiction of an effectively sustainable sealed refuge.

## 7.4 What actually lowers `R`

Recommended durable drains:

1. Opening Atlas boundary.
2. Keeping the breach open over time.
3. Increasing breach aperture / passing large mass through it.
4. Deliberately exporting/jettisoning matter.
5. Player-chosen risky experiments that damage/stress the boundary.
6. Major narrative incidents, used sparingly.

Avoid passive offline tax.

## 7.5 Retrieval cost model

Prototype formula:

`BreachCost = OpenCost + TimeCost + ApertureCost + CrossingCost`

where:

- `OpenCost` — paid once to create the controlled opening;
- `TimeCost` — leakage per second while open;
- `ApertureCost` — larger opening for large object costs more;
- `CrossingCost` — stabilizing foreign matter while crossing adds additional cost.

Orb thrust, scan and camera mostly draw `P`, not permanent `R`.

Example-only tuning target for early testing:

- open boundary: ~`0.08–0.15 R`;
- ordinary 20–40 s deployment leakage: ~`0.03–0.10 R`;
- small-target crossing overhead: ~`0.01–0.05 R`;
- ordinary useful early salvage may bring `+0.3–1.5 R` equivalent matter.

Therefore a successful ordinary salvage is usually net positive, while tiny rare/anomalous objects can deliberately be net negative because their knowledge/story value matters more than mass.

Exact numbers are **not locked**.

---

# 8. Low-reserve consequences

Do not make low reserve a generic hunger bar that immediately kills the player.

Recommended priority shedding:

## `R ~ 85–100+` — Normal

- full artificial sun cycle;
- room lighting normal;
- TV/comfort systems normal;
- workbench normal;
- full standard Retrieval capability;
- plants/animals normal.

## `R ~ 70–85` — Conservation

- decorative/comfort lighting reduced;
- artificial sun can slightly shorten/soften low-priority periods;
- workbench heavy operations recover power more slowly;
- long/deep Retrieval is discouraged or temporarily limited by `P` recovery;
- plant growth slows slightly;
- guide drone reduces nonessential wandering.

## `R ~ 50–70` — Critical Reserve

- nonessential lighting visibly shuts down;
- TV/entertainment unavailable or intermittent;
- high-power fabrication restricted;
- Retrieval range / active scan frequency reduced;
- artificial sun becomes shorter/weaker;
- plants enter low-growth state;
- biological life support remains prioritized;
- player synthetic body's basic mobility remains protected.

## `R ~ 30–50` — Emergency

- Atlas, consciousness continuity, atmosphere/life and core navigation take priority;
- Power Hub provides only essential coverage;
- artificial sun only has a limited service window;
- workbench largely restricted to repair/emergency output;
- standard Retrieval may be locked except an emergency recovery mode;
- plants become dormant;
- animal support is rationed but should not arbitrarily kill pets while player is absent.

## Protected floor

Normal gameplay should prevent the player from spending below a protected reserve floor (working idea `~25–30 R`).

The game must include an anti-softlock recovery path, such as a low-cost emergency retrieval channel with guaranteed bulk matter targets.

Do not allow routine mistakes to permanently brick a save.

---

# 9. High-reserve / excess-mass consequences

Important correction:

> `R > 100` must not automatically be bad. Surplus is one of the rewards for successful Retrieval.

Instead, Atlas has a **stabilization capacity**.

Working Tier-1 example:

- start `R = 100`;
- comfortable capacity may be around `120–130`;
- exact values are open.

## Surplus within capacity

Positive:

- more construction freedom;
- stronger emergency buffer;
- room expansion possible;
- ability to invest in expensive projects.

## Near capacity

- slower `P` recovery under heavy load;
- Atlas field activity becomes slightly more visible;
- Station warns that additional unintegrated imports reduce stability margin;
- incentive to build, stabilize or upgrade Atlas capacity.

## Above safe capacity

Recommended consequences:

- further large Retrieval temporarily restricted;
- unintegrated foreign objects require stabilization/containment;
- Atlas boundary ripples occur more frequently;
- anomalous objects may become harder to contain;
- Power Hub sees intermittent load events;
- player is encouraged to convert surplus into room structure/projects or expand Atlas capability.

Do not simply delete excess mass.

---

# 10. What everyday systems do to the resource model

## Artificial Sun

- high sustained `P` load during day cycle;
- almost no permanent `R` loss while sealed;
- low reserve causes shorter/dimmer cycle because usable power availability/recovery is constrained;
- sun remains visually separate from the Directional Light implementation.

## Normal room lighting

- low/medium `P` draw;
- shed before critical systems.

## TV / entertainment

- low `P` draw;
- first comfort feature to shut down in conservation emergencies;
- good visual feedback that the room is rationing.

## Matter Workbench

- large temporary `P` spikes during reclaim/fabricate;
- transformation conserves `R` internally;
- may create recovery/thermal delay before full power is available again.

## Retrieval Station

- idle low draw;
- Orb thrust/scan/camera use `P`;
- **breach** is what causes persistent `R` loss.

## Power Hub / Battery

- Power Hub distributes power; battery buffers `P` and handles peaks;
- it does not create new `R`;
- low reserve makes recharge slower / max peak service smaller.

## Plants

- do not create mass;
- convert Bio feedstock, water/CO2 and light into biomass;
- remain inside `R`;
- can contribute to atmosphere/water cycling and domestic identity.

## Animals

- their body mass is part of `R` once inside;
- food/water/waste are internal transformations;
- waste should be recycled by life-support systems;
- biological support adds continuous `P`/throughput load but should not act as a permanent mass drain in a sealed healthy system.

---

# 11. Synthetic / robot-like player body — comparative decision

## Option A — replace with ordinary human body

Advantages:

- food/drink/sleep immediately intuitive;
- stronger conventional vulnerability;
- easier emotional reading for some players;
- biological environment and plants/animals feel naturally connected.

Disadvantages:

- much less distinctive;
- weakens the premise that the alien civilization preserved human consciousness rather than simply rebuilding humans;
- discards the current authored character direction;
- introduces a large conventional survival-design expectation (hunger/thirst/oxygen/medicine) that conflicts with LOW VERB / HIGH DISCOVERY.

## Option B — generic robot body

Advantages:

- visually distinctive;
- easy repair/maintenance mechanics;
- directly supports digitized-consciousness premise.

Disadvantages:

- eating/drinking/sleeping become nonsensical;
- domestic life risks feeling fake;
- player may feel like replaceable equipment rather than a preserved human;
- cat/plants/home rituals lose emotional resonance;
- generic battery/repair bars can become another ordinary survival game.

## Option C — recommended: Human Continuity Shell / synthetic soma

Keep the current robot-like visual body but make it an **alien-built embodied continuity system for a human consciousness**.

Required fiction/function:

- full tactile/proprioceptive sensor model;
- controlled warmth/skin-contact feedback;
- taste/smell emulation or compatible ingestion interface;
- pain/damage feedback exists because agency/body ownership requires meaningful self-protection;
- internal power is continuously maintained while inside the Power Hub field;
- body has a local reserve for temporary loss of wireless coverage;
- no constant battery-chore loop inside the home.

### Eating

Not required as a starvation bar.

Functions can include:

- sensory pleasure;
- human ritual/social identity;
- story/memory triggers;
- optional Bio feedstock/body-maintenance contribution;
- interaction with recovered alien foods/plants.

The fact that the alien designers preserved the ability to eat can itself be a clue that they attempted to preserve **personhood**, not merely data.

### Drinking

Same principle:

- sensory/ritual interaction;
- optional coolant/working-fluid replenishment can exist, but not as an hourly thirst meter;
- player should be able to drink because it feels human, not because the game nags every ten minutes.

### Sleep / rest

Preserve sleep as a major human behavior.

Possible synthetic explanation:

- low-input neural state used for memory consolidation / model synchronization / emotional re-indexing;
- can advance artificial-sun time;
- can trigger dreams, memories and subtle story material;
- not required every fixed real-time interval.

This is compatible with real evidence that biological sleep participates in memory consolidation; the game is extrapolating the *function*, not claiming a real artificial consciousness requires sleep.

### Charging

Mostly passive inside the room's wireless field.

This is important: replacing hunger with a battery meter would solve one problem by creating a worse chore.

### Damage / repair

Later gameplay opportunity:

- shell surface damage;
- sensor misalignment;
- actuator damage;
- conductive/polymer repair;
- severe damage affects perception/movement before death;
- recovery uses the Matter/Workshop system.

Do not make routine maintenance decay while the player is offline.

### Identity stakes

The shell must not feel infinitely disposable.

Recommended lore direction to explore:

- the active consciousness state is unique/continuous;
- replacing body parts is possible, but restoring a destroyed consciousness is not a trivial `load backup` operation;
- memory continuity or subjective continuity can become a later philosophical/narrative question.

---

# 12. Research references and lessons

## Prey (2017)

- Recycler turns miscellaneous objects into four material types; Fabricator reconstructs useful items from those materials.
- Lesson: destructive reclamation and fabrication are clearer when they are distinct operations; a small material vocabulary can compress junk without turning everything into money.
- VQ2 should **not** copy Prey's exact Organic/Mineral/Synthetic/Exotic categories, but the structural pattern is useful.

Sources:
- https://prey.fandom.com/wiki/Material_Recycler
- https://prey.fandom.com/wiki/Materials

## Astroneer

- Shredders convert debris into generic Scrap, then Scrap trades for resources.
- Lesson for VQ2 is mostly a warning: one generic Scrap currency is readable but destroys object/material identity. VQ2's discoveries should retain composition and special components.

Source:
- https://store.steampowered.com/news/posts/?appids=361420

## No Man's Sky

- Refiner/cooking experimentation can record discovered recipes for future use.
- Lesson: discoveries can permanently expand the player's knowledge library rather than only increase a wallet.

Source:
- https://www.nomanssky.com/waypoint-update/

## Elite Dangerous scanner

- 3D scanner projects contacts onto a reference plane and uses vertical stems to communicate whether a contact is above or below the plane; weak contacts can remain unresolved.
- Lesson: good precedent for a compact diegetic Retrieval Echo display.

Source:
- https://hosting.zaonce.net/elite/website/assets/English-PlayersGuide_v2.00-Horizons.pdf

## Teleoperation / human factors

NASA and robotics literature repeatedly emphasizes situational awareness, depth cues, predictive/zone displays, precise intended motion and fused real+model visualizations. Full manual remote navigation is difficult for non-experts; shared-control approaches are increasingly used.

Sources:
- https://ntrs.nasa.gov/citations/19930002793
- https://ntrs.nasa.gov/citations/20210018087
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9002051/

VQ2 implication:

> Player should choose intent and target; Orb should handle stabilization and micro-navigation.

## Closed-loop life support

NASA ECLSS reclaims wastewater/humidity and regenerates oxygen; modern ISS water recovery has demonstrated ~98% recovery in the relevant system milestone. ESA MELiSSA explicitly studies closed-loop recovery of food, water and oxygen from waste, CO2 and minerals.

Sources:
- https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/
- https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/
- https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Melissa/Closed_Loop_Concept

VQ2 implication:

> Eating, plants, waste, water and ordinary domestic use should mainly circulate matter internally. They should not be arbitrary permanent drains of the Atlas reserve.

## Thermodynamics / useful energy

First-law sources describe energy as conserved/transformed rather than disappearing. Exergy/energy-quality concepts distinguish total energy from the amount capable of producing useful work.

Sources:
- https://www.energy.gov/sites/default/files/2026-04/DOE-HDBK-1010-92.pdf
- https://pressbooks.online.ucf.edu/thermorit/chapter/energy-balance-for-closed-systems/

VQ2 implication:

> `R` and `P` must be conceptually distinct even if the player sees only one main long-term reserve number.

## Digitized consciousness / embodiment

Citizen Sleeper explicitly uses a digitized human consciousness in an artificial body as its player premise; SOMA demonstrates that embodiment/identity can be gameplay themes rather than background lore. Research on body ownership emphasizes multisensory body ownership, agency and interoceptive/body signals as important to self experience. Biological sleep research provides a real basis for memory-consolidation functions that VQ2 can extrapolate into synthetic rest.

Sources:
- https://store.steampowered.com/app/1578650/Citizen_Sleeper/
- https://blog.playstation.com/?p=117757
- https://pmc.ncbi.nlm.nih.gov/articles/PMC5214748/
- https://www.nature.com/articles/nrn2762

---

# 13. Recommended system loop after reconstruction

```text
OUTSIDE SIGNAL
    ↓
Echo detection / player chooses target
    ↓
Orb deployment
    ↓
Atlas breach (real Reserve loss)
    ↓
Physical object returns (Reserve gain + possible field load)
    ↓
Inspect object in room
    ↓
┌──────────────┬─────────────┬───────────────┬─────────────┐
│ Preserve     │ Strip       │ Reclaim       │ Research /  │
│ as object    │ components  │ bulk matter   │ Contain     │
└──────────────┴─────────────┴───────────────┴─────────────┘
    ↓
Feedstock + intact components + knowledge
    ↓
Fabricate small item / create Build Package / start project
    ↓
0.5m Build Grid placement
    ↓
Room gains new object / module / capability
    ↓
New target classes / deeper Retrieval / new Outside relationships
```

Resource loop:

```text
SEALED REFUGE
R remains approximately conserved
        │
        ├─ lights / sun / TV / body / workbench -> temporary P load -> heat/recovery -> P returns
        │
        └─ plants / animals / water / food -> internal matter cycling

RETRIEVAL
open Atlas boundary
        ↓
R leaks while open
        ↓
bring outside mass in
        ↓
R rises
        ↓
within Atlas capacity: useful surplus
above Atlas capacity: field-load problem -> build / stabilize / upgrade
```

---

# 14. Decisions still requiring user lock

The following are recommendations, not final locks:

1. retire XP/Coins/Build Charge from the current core game economy;
2. use the four feedstock families `Structure / Polymer / Conductive / Bio-Volatile`;
3. use one paired Reclaim+Fabricate Matter Bench;
4. use Preserve / Strip / Reclaim / Research-Contain decision paths;
5. adopt `R` Reserve + `P` Operational Power + `S` Stability derived-state model;
6. set `R=100` as nominal start, not a hard 100% cap;
7. safe/critical numeric thresholds;
8. exact breach cost formula/numbers;
9. Echo Disc presentation and shared-control Orb inputs;
10. retain robot-like model as a Human Continuity Shell rather than replace it with an ordinary human body;
11. make eating/drinking/sleep/rest human-continuity interactions rather than mandatory survival meters.

Do not implement or call these final until the user explicitly accepts/revises them.