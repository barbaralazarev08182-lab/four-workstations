# Four Workstations — VQ2 Economy & Progression Research

> Date: 2026-08-25  
> Status: RESEARCH / PROPOSED — NOT IMPLEMENTATION LOCKED  
> Purpose: define the economy/progression architecture early enough to inform Office final polish, spatial reservation, future character/content work, Atlas construction, and multiplayer systems.

This document intentionally separates **architecture we should preserve**, **recommended direction**, **working balance targets**, and **open decisions**. It does not authorize implementation yet.

---

# 0. Executive recommendation

Four Workstations should use a deliberately small economy:

1. **XP** — personal lifetime growth; never spent.
2. **Coins** — personal soft currency; spent on choice, expression, and optional shared upgrades.
3. **Build Charge** — behavior-earned Atlas construction resource; cannot be bought, traded, or converted from Coins.

Do not add a fourth general-purpose currency in V1.

Items, collectibles, plants, memories, Atlas phases, desk slots, room upgrades, and stranger-world links are **state/content**, not extra currencies.

The economy should be designed around one central promise:

> Real-life effort creates visible changes in the miniature world.

Therefore most meaningful rewards and spending should end in a visible scene change rather than an invisible numerical stat increase.

---

# 1. Existing project constraints that remain valid

The current VQ2 planning already established a useful foundation:

- XP is growth and is not spent.
- Coins are the main shop currency.
- Build Charge is reserved for meaningful Atlas contribution.
- Atlas core progress cannot be purchased with Coins.
- Build Charge cannot be purchased or traded.
- One active player must be able to complete core progression.
- Additional players may accelerate or enrich progress but cannot be required.
- Personal Desk progression uses fixed semantic slots rather than unrestricted free placement.
- Level unlocks should open choices/content rather than multiply productivity efficiency.
- No forced streak punishment.
- The Office should deepen before new maps become the default solution.

The older Work Ticket / Public Fund economy is historical. Its currency model should not override the newer XP / Coins / Build Charge architecture.

However, some **technical safety patterns** from the old economy remain useful later: server-authoritative rewards, immutable transaction ledger, idempotent event IDs, atomic spend operations, non-negative balance checks, and safe retry behavior.

---

# 2. External reference research — useful patterns, not copy targets

## 2.1 Spirit City: Lofi Sessions

Relevant pattern:

- real productivity tools/actions feed XP;
- XP unlocks room and character cosmetics plus collection-related hints;
- the productivity action remains the input while the game layer provides visible rewards.

Lesson for Four Workstations:

> Focus should remain meaningful even when the player is not actively manipulating the game. Progression can reward real work with room/character/world expression instead of power creep.

Reference:
https://store.steampowered.com/app/2113850/Spirit_City_Lofi_Sessions/

## 2.2 Rusty's Retirement

Relevant pattern:

- the game coexists with other desktop work;
- crops generate resources;
- resources are reinvested into farm expansion and automation;
- progression visibly changes the persistent desktop world.

Lesson:

> A desktop companion can support a low-attention loop where the visible world keeps becoming richer without demanding continuous active play.

Reference:
https://store.steampowered.com/app/2666510/Rustys_Retirement/

## 2.3 Animal Crossing: New Horizons

Relevant patterns:

- daily routine generates Nook Miles;
- Miles unlock recipes, inventory capacity, and other options;
- house expansion repeatedly converts long-term economy progress into larger/more expressive personal space;
- furniture and decoration make progression visible.

Lesson:

> Space, capacity, and self-expression can be stronger long-term rewards than numerical power.

References:
https://animalcrossing.nintendo.com/new-horizons/explore/
https://animalcrossing.nintendo.com/new-horizons/create/

## 2.4 Stardew Valley

Relevant patterns:

- money and materials combine for concrete upgrades;
- tool/house upgrades open new capabilities;
- Community Center bundles convert accumulated resources into visible world restoration and community-wide outcomes.

Lesson:

> Large progression goals are strongest when the resource sink produces a persistent world transformation rather than only a progress bar.

References:
https://stardewvalleywiki.com/Bundles
https://stardewvalleywiki.com/Tools
https://stardewvalleywiki.com/Carpenter%27s_Shop

## 2.5 Palia

Relevant patterns:

- housing/decor is a major long-term identity system;
- Growable Furniture visibly moves through growth stages;
- housing uses designated attachment/add-on structures in several systems;
- the newer Lunar Path progression is explicitly permanent/non-expiring rather than FOMO-based.

Lessons:

- staged-growth props fit Four Workstations well;
- permanent progression suits the project's low-pressure productivity identity;
- fixed attachment points can preserve visual/technical control while still allowing customization.

References:
https://palia.com/news/patch-181
https://palia.com/news/patch-198

## 2.6 Economy design frameworks

Unity, Machinations, and GDC economy talks converge on the same basic discipline:

- Sources create resources.
- Pools store resources.
- Sinks/drains remove resources.
- Converters transform one resource/state into another.
- The whole economy should be simulated/tuned as a flow, not assembled as unrelated prices and rewards.

Useful references:
https://unity.com/how-to/what-game-economy-guide-part-1
https://machinations.io/docs/framework-basics
https://www.gdcvault.com/play/1020524/Economic-Balancing-and-Improved-Monetization
https://www.gdcvault.com/play/1027021/Connecting-Core-Gameplay-to-Progression

Permanent research lesson:

> Draw the resource graph first; set exact prices second.

---

# 3. Economy graph for Four Workstations

```text
REAL-LIFE ACTION
Check-In / Focus / limited social activity
        |
        +------------------+-------------------+
        |                  |                   |
        v                  v                   v
       XP                Coins            Build Charge
        |                  |                   |
        v                  v                   v
 Player Level       Shop / Upgrades      Atlas Contribution
        |                  |                   |
        v                  v                   v
 Unlock choices      Inventory / Room      Atlas Build Progress
 / slot capacity      visible objects          |
        |                  |                   v
        +------------------+------------> Atlas Phase
                                           |
                                           v
                                   World capabilities
                              (later stranger-room observation)
```

Important:

- XP does not convert to Coins.
- Coins do not convert to Build Charge.
- Build Charge does not buy shop items.
- No player-to-player currency trading in V1.
- Atlas Progress is a persistent project state, not another spendable currency.

---

# 4. Three different kinds of progression

The project should avoid putting every form of growth into one Level number.

## 4.1 Personal Growth — Player Level

Question answered:

> How long have I meaningfully participated, and what choices have I unlocked?

Player Level should:

- unlock catalog categories;
- unlock additional Desk slot types/capacity;
- unlock new plant/decor families;
- unlock character cosmetic choices later;
- unlock access to optional systems when appropriate.

Player Level should **not**:

- multiply Focus rewards dramatically;
- make a high-level user produce more Build Charge per minute;
- gate basic shared-room participation;
- become a productivity leaderboard.

## 4.2 Personal Expression — Desk / Inventory / Collection

Question answered:

> What is mine, and what does my presence look like in this room?

The Desk is the primary early personal-expression surface.

V1 should use fixed slots and standardized asset footprints.

Recommended initial visible slot families:

- Mug
- Plant
- Small Decor / Books
- Photo / Memory

Longer-term candidates:

- Toy
- Rare object
- Desk mat / surface accent
- non-realtime-light Lamp cosmetic
- small shelf/side module

Do not open 8–12 objects on day one. Start sparse and grow capacity.

## 4.3 Shared World Growth — Atlas + Room Projects

Question answered:

> What are we building together, and how is our shared world changing?

Atlas remains the primary non-optional shared progression line.

Separate future shared room upgrades may exist, but they should not require a new shared currency.

---

# 5. Reward sources

## 5.1 XP sources

Primary:

- valid Focus sessions;
- first meaningful Check-In of the day;
- Atlas contribution / major project milestones;
- selected one-time achievements/milestones.

Secondary and tightly capped:

- first meaningful social interaction with another room member;
- first-time discovery/tutorial completions.

Avoid:

- XP from spam-click interactions;
- XP from leaving the app open indefinitely;
- large streak bonuses that punish absence.

## 5.2 Coin sources

Coins should mostly come from **real meaningful activity**, especially Focus.

Recommended source hierarchy:

1. Focus completion — main faucet.
2. small daily/board goals — secondary faucet.
3. milestone/Atlas phase completion — occasional burst.
4. selected discovery/collection rewards — small occasional source.

Do not make passive online time the main Coin faucet.

## 5.3 Build Charge sources

Preserve the current prototype structure unless playtesting disproves it:

- 25 min valid Focus -> +1 Build Charge
- 50 min valid Focus -> +2 Build Charge
- daily earn cap around 2
- storage cap around 6
- no purchase
- no trade
- no Coin conversion

Build Charge is intentionally scarce and behavior-linked.

Its job is to protect Atlas from becoming a simple money sink.

---

# 6. Reward pacing and anti-grind design

Four Workstations is connected to real work/study behavior. The economy must not reward unhealthy endless sessions.

Recommended pattern:

## XP

- generous enough that every meaningful day moves the bar;
- mild or no harsh daily cap;
- no exponential grind curve;
- early levels fast, later levels increasingly deliberate.

## Coins

Keep the existing soft-diminishing-return idea:

- first meaningful sessions of the day: full Coin value;
- later sessions: reduced Coin rate;
- very long activity days should still earn something, but should not dominate the economy.

## Build Charge

Use a firm daily earning cap.

This is the strongest anti-grind protection because it prevents one person from converting a 12-hour workday into overwhelming Atlas progress.

## Absence

No negative streak mechanics.

A player returning after several days should see continuity, not debt/punishment.

---

# 7. Player Level pacing — target shape, not frozen numbers

Do not choose exact XP thresholds until the reward model is simulated.

Recommended experience targets:

- Level 2: first day / very early onboarding.
- Level 5: roughly first active week.
- Level 10: roughly 2–3 active weeks.
- Level 20: roughly 2–3 months of normal use.
- Level 30: roughly 4–6 months of normal use.

Use **active-day/session pacing**, not calendar punishment.

Curve shape:

- very fast first 3 levels;
- progressively slower but readable Levels 4–10;
- mild long-term curve after 10;
- avoid exponential RPG-style walls.

Reason:

The primary value of levels is new choices, not competitive power. There is no benefit in creating a massive grind wall.

---

# 8. Proposed Level unlock philosophy

The existing Lv.1–10 table remains a good prototype skeleton. Recommended interpretation:

- L1: core Office / Focus / Atlas participation.
- L2: basic catalog.
- L3: first personal decor capacity.
- L4: additional basic item family.
- L5: Plant slot/system.
- L6: second/expanded decor capacity.
- L7: higher catalog tier.
- L8: Photo / Memory expression.
- L9: rare/special visual category.
- L10: first major long-term identity milestone.

Levels 11–30 should not be filled with arbitrary filler now.

Later tiers can unlock:

- more expression capacity;
- new room-system categories;
- character cosmetics;
- special plant/object families;
- Atlas cosmetic customization;
- collection/prestige content.

Do not use levels to lock the core stranger-world connection if Atlas progression already gates that feature. Avoid double-gating major content unless there is a clear reason.

---

# 9. Shop / Catalog architecture

The early shop should be better understood as a **permanent catalog of unlocked choices**, not a pressure-driven rotating store.

## 9.1 Core rules

- Coins only.
- No loot boxes.
- No premium power.
- No FOMO-based permanent misses.
- Catalog items can be level/milestone locked, but once unlocked remain available.
- Preview before purchase.
- Purchased items enter inventory/collection and can be equipped/placed in compatible slots.
- Fixed-slot placement first; unrestricted free placement is not a V1 requirement.

## 9.2 Acquisition channels

Not every item must come from Coins.

Possible channels:

- Coin catalog — common/main acquisition.
- Player Level milestone — unlock availability.
- Atlas milestone — thematic reward.
- Achievement / collection — rare reward.
- later Void-edge activity — discoveries/objects.
- later stranger-world system — special traces/rewards.

This creates variety without adding currencies.

---

# 10. Price bands — working targets

Exact prices are not locked. Use **time-to-afford** as the design variable.

Assuming a normal active day earns roughly the current prototype target of 80–150 Coins:

| Band | Working price | Intended feeling |
|---|---:|---|
| Starter/Common | 80–150 | affordable from one normal active day/session cycle |
| Standard | 180–320 | deliberate choice; about 1–3 normal active days |
| Special | 350–700 | desirable item; several active days |
| Premium visual/growable | 800–1,500 | long-term cosmetic goal; roughly 1–2 active weeks depending on use |
| Major shared optional upgrade | 1,000+ total | shared/longer project; exact scale after simulation |

The existing first-shop 100–400 Coin prototype range fits the first three bands and can remain the starting test set.

Do not inflate prices merely because late players accumulate Coins. Add meaningful long-term cosmetic/shared sinks instead.

---

# 11. Coin sinks

Coins need multiple visible destinations across the lifecycle.

## 11.1 Early sinks

- mugs;
- books;
- plants/pots;
- photo frames;
- toys;
- desk clocks;
- cosmetic accessories.

## 11.2 Mid sinks

- higher-tier Desk items;
- Desk surface/theme variants;
- additional optional display capacity;
- character cosmetics;
- growable/animated decorative objects;
- wall/room cosmetic variants.

## 11.3 Long-term sinks

- rare prestige decor;
- shared optional Office upgrades;
- room expansion modules/platforms if later approved;
- expensive cosmetic variants for Atlas;
- future cross-world influence consumables/actions, if the influence design eventually uses Coins as part of its cost.

Important distinction:

> Coins may buy optional shared expression, but must not buy core Atlas Build Progress.

---

# 12. Shared optional upgrades without a fourth currency

If the Office later has optional shared improvements beyond Atlas, do **not** resurrect a permanent Public Fund currency by default.

Recommended alternative:

### Direct Contribution Project

Example:

`Shared Coffee Corner Upgrade — 1,200 Coins total`

Any member may contribute any amount of personal Coins.

- contribution is immediately sunk;
- project progress is persistent;
- one person may fund it eventually;
- four people may fund it faster;
- no separate fund balance exists outside the project;
- completed project creates a visible world change.

This preserves the 1–4 player rule and adds a useful Coin sink without inventing a new economy layer.

This remains PROPOSED, not locked.

---

# 13. Upgrade taxonomy

The word “upgrade” should not automatically mean bigger numerical output.

Four Workstations should prioritize five upgrade types:

## 13.1 Capacity upgrades

Examples:

- unlock a new Desk slot;
- add a shelf/socket;
- expand display/storage capacity.

## 13.2 Visual quality/state upgrades

Examples:

- object becomes more refined;
- plant moves to a new growth stage;
- Atlas gains a new structural tier;
- a wall/board/furniture module changes appearance.

## 13.3 Capability upgrades

Examples:

- Atlas first becomes active;
- Atlas later unlocks stranger-room observation;
- later still, Atlas may unlock costly cross-world influence.

These are major progression beats and should be physically visible.

## 13.4 Spatial upgrades

Examples:

- small platform added at an approved room edge;
- a new fixed room attachment point becomes usable.

These must be planned against camera, pathing, lighting, and composition before implementation.

## 13.5 Expression/prestige upgrades

Examples:

- rare decor variants;
- character cosmetics;
- Atlas cosmetics;
- room trim/material variants;
- collection display objects.

Avoid early upgrades such as:

- “+20% Focus XP”;
- “+50% Coins per minute”;
- “higher Level means faster Build Charge.”

Those create power creep and distort the real-life behavior loop.

---

# 14. Plant/growth-object system

Plants are a strong candidate for the first non-Atlas visible progression object.

Recommended implementation/design model:

`Stage 0 -> Stage 1 -> Stage 2 -> Stage 3 -> Mature/Flowering`

Use discrete models/states rather than requiring continuous procedural growth.

Possible growth input later:

- elapsed real days;
- meaningful Focus participation;
- optional care interaction;
- combination of time + activity.

Do not make “pay Coins repeatedly to grow faster” the default design.

Coins should purchase the plant/pot/variant; living progression should primarily come from time/activity.

---

# 15. Atlas economy/progression architecture

Atlas is the shared mainline and should be visibly constructed.

Recommended structure:

```text
Phase
  -> several visible construction substeps
  -> full phase completion
  -> new visual/capability state
```

Do not make each Phase a single bar that shows no geometry change until 100%.

Example conceptual progression:

- Phase 0: Blueprint / scattered parts.
- Phase 1: Foundation.
- Phase 2: Core / first restrained motion/emissive.
- later: signal/calibration structures.
- later: first stranger-world observation unlock.
- later: stabilized connection.
- much later: costly cross-world influence capability.

The exact number of phases remains open.

## 15.1 Build Charge pacing

Keep daily cap around 2 during prototype.

Instead of designing phase costs only as raw numbers, use **solo active days** and **four-player active days** as pacing targets.

Working example only:

- early major step: about 4–7 solo active days;
- middle step: about 1–2 solo active weeks;
- later capability step: multiple weeks solo;
- four active members accelerate naturally because their independent capped contributions add together.

Each major phase should contain smaller visible substeps so even slow solo progress produces scene feedback.

---

# 16. Critical spatial implications before Office final polish

Because economy/progression will place future objects into the current Office, the polish pass must reserve semantic space now.

## 16.1 Four personal desks

Each desk should have a standardized placement contract.

Recommended V1 reserved slot families per desk:

- `MugSlot`
- `PlantSlot`
- `DecorSlot`
- `PhotoMemorySlot`

Long-term reserved/optional slots:

- `ToyRareSlot`
- `DeskAccentSlot`
- optional `ShelfModuleSocket`

Do not visually fill these areas with permanent baked clutter during Office polish.

Keep keyboard/mouse/monitor/character-hand clearance separate from decoration sockets.

All purchased assets should obey the existing spatial interaction contract:

- explicit BottomContact / Root;
- allowed slot type;
- footprint bounds;
- height budget;
- preferred orientation;
- collision/clearance validation.

## 16.2 Atlas center

Preserve the central Atlas budget and a clearance ring around it.

Do not place final decorative clutter that would later conflict with:

- Phase growth;
- four Personal Modules;
- upper structure;
- observation miniature;
- future interaction anchors.

## 16.3 Wall

Reserve at least one intentional information-board zone.

Do not finish the wall as if every square meter is decorative-only.

Potential later roles:

- task/message board;
- progression/project view;
- memories/collection display.

## 16.4 Open edge A

Reserve character sitting/rest anchors and clearance.

Do not place furniture that destroys the future edge-sitting concept.

## 16.5 Open edge B

Reserve an interaction zone for the future “line into the void” mechanic.

Do not overdecorate this edge before its mechanic is decided.

## 16.6 Outer room boundary

Reserve a small number of future expansion attachment points conceptually.

Do **not** implement expansion yet.

The purpose now is simply to avoid finalizing geometry/clutter that makes later attachment impossible.

## 16.7 Shared upgrade sockets

Potential future shared-upgrade zones should be recognized before polish:

- Coffee Corner;
- wall/information area;
- selected safe floor/wall sockets;
- outer expansion sockets.

This does not mean all will become upgrade systems.

---

# 17. Asset-content planning rule

Economy design should inform asset production.

Every purchasable/placeable asset should carry metadata/contract information such as:

- item ID;
- category;
- compatible slot type;
- footprint class (S/M/L);
- world dimensions;
- BottomContact / GroundContact;
- orientation rule;
- animation state, if any;
- material/style family;
- performance budget.

This allows Agents to place items geometrically rather than visually guessing coordinates.

---

# 18. Inventory rules — recommended V1

Keep inventory simple.

- Permanent cosmetics/decor should normally be owned once and re-equipped/repositioned between compatible slots.
- Do not require inventory weight/capacity management in V1.
- Do not add durability.
- Do not add player-to-player item trading in V1.
- Consumables should be rare and purpose-specific rather than a large consumable economy.

Duplicates should only exist where they create real expression value; do not make duplicate ownership a default complexity.

---

# 19. Multiplayer fairness rules

For any shared progression:

1. Solo completion must remain possible.
2. Four active users may progress faster because four people contribute, not because the game multiplies their rewards.
3. A missing member cannot permanently gate core content.
4. Full participation may trigger Harmony/prestige cosmetics or memories, not basic progression access.
5. Personal Coins remain personal unless explicitly contributed to a named shared project.
6. Build Charge contribution is visible/shared but the resource balance originates from each player.
7. No competitive productivity leaderboard by default.

---

# 20. Stranger-world system relationship to the economy

The Ouroboros stranger-room connection is a **later capability unlock**, not an early economy faucet.

Current direction:

- Atlas construction must reach a sufficient stage before another world appears.
- first cross-world capability is observation only;
- observed room knows it is being observed, but not by whom;
- later influence on another world must have a meaningful cost.

Economy guardrail:

> Do not create a fourth “world influence currency” unless later design proves it absolutely necessary.

Prefer costs using existing systems plus opportunity cost/cooldown/item sacrifice when the influence mechanic is designed.

Exact influence cost is intentionally OPEN.

---

# 21. Technical economy architecture — later implementation direction

When multiplayer persistence is implemented, preserve these safety properties:

- server-authoritative reward calculation;
- client submits action/session evidence, not reward amount;
- immutable transaction ledger for Coins;
- unique event IDs for idempotency;
- retry returns the existing result rather than double-paying;
- atomic conditional spend so balance cannot go below zero;
- Build Charge daily cap and storage cap enforced server-side;
- Atlas contributions recorded idempotently;
- no client-direct balance mutation.

Likely conceptual data domains:

- player progression (XP/Level);
- Coin wallet + ledger;
- Build Charge balance/daily earning;
- catalog item definitions;
- inventory ownership;
- desk/room slot placements;
- Atlas phase/progress/contributions;
- optional shared-project contribution state.

Do not lock SQL schema before the gameplay model passes local playtesting.

---

# 22. Balance model and metrics

Before production tuning, build a simple spreadsheet or simulation that models at least three personas:

- Casual: ~1 valid Focus block on active days.
- Normal: ~2 valid blocks.
- Heavy: many blocks / long sessions.

For each persona simulate 30 / 90 / 180 active days.

Track:

- XP level reached;
- Coin income;
- Coin spend capacity;
- unspent Coin balance;
- Build Charge generated;
- Atlas phase timing;
- number of purchasable objects affordable;
- time-to-first-purchase;
- time-to-first-visible-desk-change;
- solo vs 2/3/4-member Atlas pacing.

Important health indicators after real playtests:

- median time to first purchase;
- % of active users who place at least one personal object;
- Coin earn/spend ratio;
- median wallet by cohort age;
- percentage of users whose wallet only grows and never gets spent;
- item purchase concentration (one dominant item may signal bad pricing/value);
- Atlas contribution frequency;
- days between visible Atlas changes;
- Level milestone timing;
- solo-office vs multi-member progression gap.

The economy should remain adjustable from centralized config/data rather than hard-coded throughout gameplay scripts.

---

# 23. Recommended implementation sequence later

This document is design-only now.

When implementation resumes, recommended economy rollout:

### E0 — Economy Simulation / Content Matrix

- finalize reward source/sink map;
- spreadsheet simulation;
- decide first item catalog;
- finalize Desk slot contracts and Office reserved zones.

### E1 — Local Personal Progression

- XP;
- Level 1–10;
- Coins;
- first permanent catalog;
- 4 Desk slot families;
- inventory + fixed placement;
- no Supabase dependency needed to prove feel.

### E2 — Local Atlas Economy

- Build Charge;
- Atlas contributions;
- phase/substep visible construction;
- local loop playtest.

### E3 — Shared Persistence

Only after E1/E2 feel correct:

- server-authoritative rewards;
- Supabase persistence;
- shared Atlas state;
- multi-account testing;
- transaction/idempotency safeguards.

### E4 — Long-term content

- more catalog tiers;
- plants/growth objects;
- optional shared room projects;
- collections/memories;
- later room expansion.

### E5 — Ouroboros connection

- fixed stranger adjacency;
- miniature room observation;
- observation-awareness signal;
- later costly influence after separate design research.

---

# 24. Current recommendations strong enough to guide Office polish

Even before exact economy numbers are locked, the following should guide scene polish now:

1. Keep XP + Coins + Build Charge as the three-resource architecture.
2. Do not add generic crafting materials in V1 merely because other cozy games have them.
3. Preserve four personal Desk customization zones with fixed semantic slots.
4. Preserve central Atlas growth volume and clearance.
5. Preserve one wall information/progression zone.
6. Preserve one open-edge rest zone.
7. Preserve the second edge for the future unknown/void interaction.
8. Avoid permanent clutter on future room-expansion attachment areas.
9. Purchasable objects should use deterministic Anchor/Socket placement contracts.
10. Most economic spending should create visible world or identity change.

These rules are strong enough to prevent the upcoming Office Final Polish from painting the project into a corner, while still leaving exact economy balance open.

---

# 25. Major open decisions

Still needs future discussion/testing:

- exact XP curve;
- exact Coin reward formula;
- exact diminishing-return curve;
- exact Build Charge phase costs;
- exact number/timing of Atlas phases;
- exact catalog size at launch;
- whether optional shared projects use direct personal-Coin contribution;
- whether Desk capacity upgrades cost Coins or are mainly Level unlocks;
- exact plant growth inputs;
- whether large room/platform expansions use Coins, Build Charge, milestone unlocks, or a combination;
- exact stranger-world influence cost/mechanic.

Do not lock these merely from this research document. They should be simulated/prototyped and then promoted into the canonical roadmap after user approval.
