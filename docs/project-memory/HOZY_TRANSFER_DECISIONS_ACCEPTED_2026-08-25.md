# Hozy Transfer Decisions — Accepted

> Date: 2026-08-25  
> Status: ACCEPTED PROJECT PRINCIPLES  
> Scope: interaction feel, spatial placement, content strategy, persistence, long-term product direction  
> Source: Hozy product analysis + direct user approval

---

# 1. Core decision

Four Workstations should learn from Hozy's strengths in **tactile interaction, spatial placement assistance, composition, materials, and visible before/after transformation**, but must not copy a content model that depends primarily on continually shipping new rooms and new furniture.

The project target is:

> **Hozy-like interaction satisfaction + Four Workstations' persistent systemic world.**

A small room should feel good to touch immediately and still continue producing meaningful change months later.

---

# 2. Accepted lessons to transfer directly

## 2.1 Every signature action must feel good before rewards are counted

For important verbs, completion logic alone is insufficient.

Priority signature verbs include:

- salvage / pull;
- Atlas installation;
- Atlas calibration / operation;
- pick up / inspect / place strange objects;
- build / repair.

These actions should combine several response channels where appropriate:

- motion timing;
- anticipation;
- resistance / easing;
- deformation or body lean;
- contact response;
- sound;
- small secondary motion;
- visible world-state change.

Rule:

> Do not replace tactile action design with `click -> wait -> reward popup` for the game's signature verbs.

## 2.2 Spatial editing should be semantically assisted

Players and Agents should not solve centimeter-level coordinates manually when the scene can solve them.

Future placeable objects should use machine-readable placement contracts such as:

- placement category;
- allowed surface types;
- footprint;
- BottomContact / GroundContact;
- wall-facing rule;
- valid socket types;
- collision/clearance requirements.

This should connect directly to `UNITY_SPATIAL_INTERACTION_CONTRACTS.md`.

Long-term goal:

> Player placement and Agent/Codex placement should reuse the same underlying world-object placement language.

Example:

```text
Item
  PlacementType = SURFACE_PROP
  BottomContact
  Footprint = S
  AllowedSurfaces = Desk / ResearchBench / DisplayShelf
```

The player chooses intent; the system resolves exact support height, orientation, collision and legality.

## 2.3 Use Progressive Freedom rather than instant total freedom

Do not choose between fully fixed slots and fully free 3D placement as a single permanent answer.

Recommended progression:

### Early

- fixed semantic Desk slots;
- strong safety and visual consistency;
- low placement complexity.

### Mid

- bounded free-placement surfaces;
- system-controlled height/contact/collision;
- player controls horizontal position and limited rotation.

### Later / expanded personal spaces

- broader placement freedom where camera, route, networking and persistence can support it.

Rule:

> Freedom should grow after the player understands the world and after the technical persistence contract is trustworthy.

## 2.4 Visible transformation is a primary reward channel

Strong progression should create a readable before/after difference in the world.

Examples:

- Atlas physically grows;
- edge equipment accumulates wear/repair history;
- room expansion progresses from anchor -> frame -> stabilized platform -> facility;
- cultivation changes stages;
- anomalies leave visible consequences;
- repaired or influenced areas visibly differ from their previous state.

Rule:

> If a major progression event changes only a number or menu state, ask whether the room itself should also change.

## 2.5 The open room edges are authored visual/gameplay surfaces

The two exposed floor edges must not look like arbitrary mesh cuts.

They should eventually expose intentional structure such as:

- floor layers / structural depth;
- attachment points;
- repair traces;
- salvage-rig anchors;
- expansion interfaces;
- later world-state reactions.

The edge itself is part of the game's visual identity and progression record.

---

# 3. Accepted lessons that require adaptation

## 3.1 Curated Sandbox -> Curated Systemic Sandbox

Hozy's curated item sets reduce choice overload. Four Workstations should preserve that clarity without becoming a finite decoration catalogue.

Use:

- curated object families;
- semantic compatibility;
- limited but meaningful choices;
- staged access to new object categories.

But connect objects to systems:

- research;
- cultivation;
- salvage;
- construction;
- memory/collection;
- Atlas;
- anomalies;
- later cross-world effects.

Objects should not exist only as decoration unless their role is intentionally cosmetic.

## 3.2 Small space is not a weakness if the space keeps changing

Do not solve depth primarily by creating a sequence of separate maps.

The preferred long-term model remains:

> One persistent room becomes denser, stranger, more capable and more personal over time.

Expansion can occur, but should extend the same persistent world rather than simply replacing it with unrelated levels.

---

# 4. Explicit anti-patterns — do not copy from a finite-content decorating model

## 4.1 Do not rely on endless furniture production for retention

Avoid a roadmap structurally equivalent to:

`new month -> new furniture pack -> new room -> new seasonal furniture -> repeat`

Cosmetics can exist, but they cannot be the primary source of long-term gameplay depth.

Prefer **system scaling** over **content scaling**.

Examples:

### One Salvage system can produce

- common parts;
- rare objects;
- unknown artifacts;
- seeds/organisms;
- Atlas-relevant components;
- danger;
- failure events;
- clues.

### One Cultivation system can produce

- growth;
- mutation;
- useful material;
- decorative outcomes;
- anomalies;
- research;
- Atlas inputs.

### One Atlas can support

- construction;
- signals;
- investigation;
- observation;
- incoming-observation awareness;
- later costly influence.

Rule:

> Build systems that generate many situations before building large quantities of one-use content.

## 4.2 Do not let decoration become the universal reward

Major rewards should include:

- new verbs;
- new capabilities;
- discoveries;
- world changes;
- persistent objects;
- new interaction surfaces;
- access to deeper risk;
- social/world-link possibilities.

Decoration is one reward family, not the endpoint of the economy.

---

# 5. Persistence is a hard prerequisite for placement freedom

Four Workstations is a persistent world, so placement correctness after save/load/network synchronization matters more than in a disposable level.

Before broad free placement is enabled, validate at least:

```text
Place
-> Save
-> Quit
-> Reload
-> transform/state identical

Second client/account view
-> same result

Move again
-> Save
-> Reload
-> still identical
```

Also validate:

- no object falling through support surface;
- no silent re-snapping to a different position;
- no duplicate placement state;
- no local/world transform mismatch;
- deterministic slot/surface ownership;
- idempotent persistence where network writes are involved.

Rule:

> Persistent world trust is more important than placement freedom.

---

# 6. Product identity principle

The eventual store-page fantasy should be understandable visually without a long explanation.

A strong overview image should communicate, in sequence:

1. four small unusual residents live together in a warm miniature room;
2. the room has two impossible open edges;
3. one resident may sit at an edge;
4. another may retrieve something from the Outside;
5. the center contains an evolving Atlas structure;
6. the room visibly has history and growth.

The product should not visually collapse back into `four desks + four computers + four office workers`.

---

# 7. Final accepted synthesis

> **Hozy shows how to make a small space satisfying to touch. Four Workstations must combine that level of tactile and spatial clarity with systems that allow the same room to remain meaningful for months or years.**

Working synthesis:

```text
TACTILE FEEL
+ SMART SPATIAL PLACEMENT
+ STRONG MATERIAL / LIGHT / COMPOSITION
+ VISIBLE BEFORE-AFTER CHANGE

              +

PERSISTENCE
+ SYSTEMIC DEPTH
+ DISCOVERY
+ RISK / CONSEQUENCE
+ ATLAS
+ WORLD MYSTERY
+ FIXED STRANGER LINK
+ SPATIAL EXPANSION

              =

A SMALL WORLD THAT FEELS GOOD NOW
AND KEEPS BECOMING SOMETHING NEW LATER
```

These principles are accepted design guidance. Exact mechanics, numbers, implementation details and content remain subject to later prototyping and approval.
