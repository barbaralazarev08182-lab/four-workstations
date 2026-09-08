# VQ2 World Rule Families v0.1

> Date: 2026-08-25  
> Status: RESEARCH / PROPOSED — WORLD SYSTEM DESIGN, NOT IMPLEMENTATION AUTHORIZATION  
> Scope: small reusable rule families that generate many world phenomena without expanding player controls or adding many standalone minigames  
> Parent principles: `LOW VERB / HIGH DISCOVERY`, `Relationship Density`, persistent room history, curiosity-driven progression

---

# 0. Purpose

The project should not seek novelty by continuously adding:

- new input schemes;
- new minigames;
- new currencies;
- new UI panels;
- new isolated activity systems.

The preferred direction is:

> **A small number of understandable player verbs encounters a small number of consistent world rules whose combinations create many different outcomes.**

The player may learn the controls quickly while continuing to learn what the world can do for a long time.

This document therefore defines **seven proposed world-rule families**.

They are not physics simulation specifications.

They are design rules for deciding what kinds of objects, anomalies, growths, Atlas phenomena, repairs and room-history events should exist.

The world should feel internally consistent, but it should not simulate everything.

---

# 1. Research lesson — multiplicative design, not additive design

A useful reference is *The Legend of Zelda: Breath of the Wild*'s chemistry-engine design.

The important design lesson is not to copy fire/water/electricity.

The lesson is:

> **Simple universal state rules can create many situations when objects affect one another, instead of every situation requiring bespoke scripting.**

This is multiplicative design:

`few rules × many objects × different situations -> many outcomes`

rather than:

`new situation -> new custom system -> new tutorial -> new UI`

A second useful lesson comes from *Noita*:

> Simulation is not automatically valuable simply because it is deep.

Its developers described experiments where fully simulated collapsing buildings sounded interesting but often produced only piles of rubble.

Therefore Four Workstations should **not** attempt a universal matter simulator.

Rule families should exist only where they create:

- readable behavior;
- curiosity;
- memorable relationships;
- choices;
- visible room change;
- knowledge progression.

Ordinary things should remain ordinary most of the time.

---

# 2. Rule Family 1 — Local Belonging / Stability

Working concept:

> **Things can belong to a room to different degrees.**

A room is not merely a platform in empty space. It establishes a local stable reality.

Ordinary room objects are strongly integrated with that reality.

Recovered objects may initially be weakly integrated.

## 2.1 What this rule can generate

- a recovered object that floats very slightly at first;
- an object whose weight feels wrong when first brought inside;
- an object that slowly becomes physically normal after remaining in the room;
- something that behaves differently when taken near the open edge;
- a structure that cannot become fully usable until it is stabilized as part of the room;
- an expansion platform progressing from unstable frame to true room-space.

## 2.2 Existing content connected to this rule

- `Room-Adapted Object`
- `Heavy Hollow`
- `Boundary Sleeper`
- `Soft Anchor`
- room expansion / stabilization
- some anomalies near the open edge

## 2.3 Why this rule matters

It gives one coherent explanation for:

- why the room can feel safe;
- why the Outside feels different;
- why some recovered objects behave strangely;
- why expansion is more than buying floor area;
- why connection back to the room matters.

It also supports a strong long-term content pattern:

> **An object can have a “first-day state” and a “lived-here-for-weeks state” without needing a new gameplay verb.**

---

# 3. Rule Family 2 — Boundary Gradient

Working concept:

> **The room edge is not a binary line between safe and unsafe. It is a gradient where room rules become less dominant.**

The closer something is to the exposed boundary — or the further it is extended beyond that boundary — the more likely unusual behavior becomes.

## 3.1 What this rule can generate

- edge-specific growth forms;
- objects that only move, open or vibrate near the boundary;
- different salvage results at different effective “depths”;
- delayed falling / strange weight near the edge;
- boundary frost, bloom or residue;
- tools that become rigid or behave differently only near the edge;
- certain items that are stable in the center but unstable near the Outside.

## 3.2 Existing content connected to this rule

- `Boundary Sleeper`
- `Boundary Clamp`
- `Boundary Adapted Growth`
- `Edge Frost / Bloom`
- `Delayed Drop`
- salvage depth concept
- open-edge rest / retrieval spaces

## 3.3 Important constraint

“Deeper” should not need to mean only “more meters of rope.”

It may mean:

> **weaker relationship to the player's room and stronger exposure to non-room rules.**

This allows progression to unlock stranger categories of content without turning salvage into a simple distance stat.

---

# 4. Rule Family 3 — Affinity / Direction

Working concept:

> **Some things retain a relationship to something that is not represented by normal room geometry.**

That relationship can express itself as direction, orientation, pull, alignment or repeated structural preference.

This is not ordinary magnetism and should not be explained early.

## 4.1 What this rule can generate

- an object that slowly rotates back to one direction;
- several unrelated objects suddenly orienting the same way;
- a crack forming along a geometrically “wrong” direction;
- an Atlas component repeatedly turning toward an impossible heading;
- particles drifting toward an invisible relation;
- a device with no stable north/south orientation in normal space.

## 4.2 Existing content connected to this rule

- `Returning Piece`
- `Directionless Needle`
- `Hairline Direction Crack`
- `Follower`
- Atlas `Directional Response`
- `Synchronized Turning`

## 4.3 Why this rule is especially valuable

This creates delayed reinterpretation.

Example:

`Returning Piece` appears early and feels merely odd.

Later:

`Hairline Direction Crack` follows a similar alignment.

Much later:

Atlas also responds along that relation.

The player learns:

> “These were not three unrelated weird events.”

No new control scheme is required.

---

# 5. Rule Family 4 — Resonance / Shared Pattern

Working concept:

> **Things that share some hidden relationship can respond to the same pattern even when they look unrelated.**

The player should often notice the pattern before understanding the shared cause.

Possible pattern channels:

- rhythm;
- warmth;
- orientation;
- vibration;
- opening/closing;
- subtle light response;
- timing;
- repeated geometry.

## 5.1 What this rule can generate

- Atlas makes three beats; a shell opens three times;
- two unrelated fragments warm at the same moment;
- one old object reacts when a newly recovered object enters the room;
- a plant opens only when a certain Atlas state is present;
- a dormant object repeats a sound it encountered days ago;
- several clues share one geometric motif without explaining why.

## 5.2 Existing content connected to this rule

- `Listening Shell`
- `Paired Fragments`
- `Three-Beat Plate`
- `Three-Beat Atlas Signal`
- `Repeater`
- `Signal Bloom`
- `Mirror Spore`
- later `Observer Mark`

## 5.3 Design value

Resonance lets one old asset gain new meaning because another object exists.

This is one of the highest-leverage content rules in the project.

It supports the desired player reaction:

> **“Wait — I remember that thing.”**

rather than:

> “New collectible unlocked.”

---

# 6. Rule Family 5 — Contact Imprinting / Adaptation

Working concept:

> **Some unusual matter changes according to what it remains in contact with.**

This is broader than biology.

A material may learn, copy, harden, discolor, remember, imitate or specialize based on its environment.

## 6.1 What this rule can generate

- an object slowly adopting nearby color/material traits;
- growth that changes depending on the surface it occupies;
- repair material becoming permanently shaped by the wall crack it healed;
- a recovered object becoming more room-like over time;
- material preserving wear patterns from its previous use;
- a specimen becoming different if kept at the boundary rather than on a desk.

## 6.2 Existing content connected to this rule

- `Borrowed Color`
- `Contact Bloom`
- `Memory Washer`
- `Repair-Grown Material`
- `Room-Adapted Object`
- `Boundary Adapted Growth`
- `Porcelain Moss`

## 6.3 Why this is stronger than generic crafting

The player does not only convert:

`Material A + Material B -> Recipe C`

Instead, the history of **where something stayed** can become part of the result.

This makes the room itself participate in content generation.

---

# 7. Rule Family 6 — Growth / Propagation

Working concept:

> **Some recovered matter can continue changing after the moment of discovery.**

Growth is not limited to conventional plants.

Possible forms include:

- opening;
- spreading;
- crystallizing;
- branching;
- hardening;
- reorganizing;
- forming fibers;
- producing repeated structures;
- becoming partly architectural.

## 7.1 What this rule can generate

- a closed seed opening after a condition is met;
- porcelain moss spreading across a repaired wall;
- thread matter organizing itself into a useful mat or bridge-like mesh;
- crystal geometry changing according to repeated Atlas exposure;
- living-looking matter becoming construction material;
- a growth becoming beautiful, useful, dangerous or all three depending on context.

## 7.2 Existing content connected to this rule

- `Closed Seed`
- `Porcelain Moss`
- `Thread Nest / Thread Colony`
- `Responsive Crystal`
- `Rootless Sprout`
- `Signal Bloom`
- `Repair-Grown Material`

## 7.3 Guardrail

Do not automatically turn growth into:

- watering meters;
- fertilizer tiers;
- crop yield optimization;
- hunger systems;
- conventional farming loops.

The project's value is:

> **“What will this become here?”**

not:

> “How many units per hour does this crop produce?”

---

# 8. Rule Family 7 — Conservation + Trace

Working concept:

> **Meaningful world change should leave something behind or require something to change somewhere else.**

This combines two important principles:

1. strong cross-boundary effects are not free;
2. meaningful local events should often leave visible history.

## 8.1 Conservation side

Observation can be comparatively easy because information crosses more easily.

Influence is harder.

A meaningful cross-node effect may require:

- loss or transformation of a local material;
- temporary Atlas instability;
- sacrificing a rare object;
- time / cooldown;
- giving up another possible use;
- a local world-state change.

Exact costs remain open.

## 8.2 Trace side

When meaningful events happen locally, prefer visible consequences over perfect reset.

Possible traces:

- wall repair patch;
- growth scar;
- salvage wear;
- replaced Atlas part kept nearby;
- expansion seam;
- failed experiment residue;
- reinforcement added after an incident;
- later cross-room trace.

## 8.3 Existing content connected to this rule

- `Wall Repair Patch`
- `Repair-Grown Material`
- `Edge Wear Mark`
- `Expansion Seam`
- `Replaced Atlas Part Display`
- `Failed Influence Test`
- future costly influence

## 8.4 Why these two ideas belong together

The world should resist “free magic.”

If something important happened, something should usually be different afterward.

That difference can be:

- a cost;
- a scar;
- a changed object;
- a delayed recovery;
- a new opportunity;
- a remembered architectural trace.

This gives the room continuity.

---

# 9. The seven-rule network

The proposed rule families are:

1. **Local Belonging / Stability**
2. **Boundary Gradient**
3. **Affinity / Direction**
4. **Resonance / Shared Pattern**
5. **Contact Imprinting / Adaptation**
6. **Growth / Propagation**
7. **Conservation + Trace**

The important design target is not each rule in isolation.

It is the combinations.

Examples:

## Example A — Porcelain Moss

`Growth`
+
`Contact Imprinting`
+
`Conservation + Trace`

Possible outcomes:

- grows normally on a tray;
- becomes edge-adapted near the Outside;
- fills a wall crack;
- hardens into a permanent repair scar;
- grows differently on a previously repaired surface.

Same basic object family, several meanings.

## Example B — Returning Piece

`Affinity / Direction`
+
`Boundary Gradient`
+
`Resonance`

Possible outcomes:

- turns slowly in room center;
- behaves more strongly at the edge;
- later aligns with Atlas;
- several related objects eventually orient together.

## Example C — Listening Shell

`Local Belonging`
+
`Resonance`
+
`Growth / slow state change`

Possible outcomes:

- initially inert;
- becomes stable after staying in the room;
- opens during a three-beat signal;
- later becomes a naturally readable indicator of incoming Atlas activity.

## Example D — Atlas influence

`Resonance`
+
`Conservation`
+
`Trace`

Possible outcome:

- Atlas establishes a strong connection;
- something local is transformed/consumed/destabilized;
- another room receives a subtle effect;
- both sides may retain some physical evidence that something crossed the relationship.

---

# 10. How the ten core world seeds map onto the rules

| Core seed | Stability | Boundary | Affinity | Resonance | Imprint | Growth | Trace/Cost |
|---|---:|---:|---:|---:|---:|---:|---:|
| Returning Piece |  | ✓ | ✓ | ✓ |  |  |  |
| Closed Seed | ✓ |  |  |  | ✓ | ✓ |  |
| Porcelain Moss | ✓ | ✓ |  |  | ✓ | ✓ | ✓ |
| Indexed Joint | ✓ |  | ✓? |  |  |  | ✓ |
| Listening Shell | ✓ | ✓? |  | ✓ |  | ✓? |  |
| Hairline Direction Crack |  | ✓ | ✓ |  | ✓? |  | ✓ |
| Wall Repair Patch | ✓ |  |  |  | ✓ | ✓? | ✓ |
| Three-Beat Atlas Signal |  |  |  | ✓ |  |  |  |
| Paired Fragments | ✓ |  |  | ✓ |  |  |  |
| Miniature Floor Fragment | ✓ |  |  | ✓? | ✓? |  |  |

`?` means useful possibility, not approved behavior.

This table shows the intended architecture:

> The core seeds are not ten bespoke systems. They are ten expressions of a smaller shared rule language.

---

# 11. Complexity guardrail — ordinary remains important

If every object:

- moves by itself;
- glows;
- sings;
- grows;
- points somewhere;
- reacts to Atlas;

then nothing is strange.

Recommended content balance:

- many recovered things should be understandable, useful or simply beautiful;
- some should have one subtle anomaly;
- fewer should participate in multiple deep rules;
- very few should create major world revelations.

The room's familiar baseline is what makes impossible behavior noticeable.

The same applies to events:

> Do not fire anomalies constantly just because the system supports them.

Quiet time is part of the design.

---

# 12. Player-facing complexity target

The player should not need to memorize the seven rule names.

They should learn them through intuition.

Possible player beliefs over time:

- “Stuff from outside sometimes needs time to settle.”
- “Things near the edge act weirder.”
- “Some objects always seem to face the same way.”
- “When Atlas makes that rhythm, some old objects react.”
- “Where I keep something changes what it becomes.”
- “Some things keep growing after I stop touching them.”
- “Big changes always leave something behind.”

That is enough.

Do not turn these into seven upgrade trees or seven status bars.

---

# 13. Content-design test for future ideas

When proposing a new recovered object, anomaly, growth or Atlas phenomenon, ask:

1. Which existing world rule does it express?
2. Can it combine with at least one other rule later?
3. Can the player understand the first behavior without a tutorial paragraph?
4. Can the same asset/state family create more than one situation?
5. Can it remain relevant later rather than becoming quest trash?
6. Can it change the meaning of something the player already knows?
7. Does it preserve mechanical simplicity?

If the idea requires a unique new minigame but expresses no reusable world rule, its value should be questioned.

---

# 14. Current conclusion

The project does not need dozens of independent gameplay systems to feel deep.

The stronger direction is:

> **A warm, mostly understandable room governed by a few consistent impossible rules.**

The resident learns simple actions quickly.

The player spends much longer learning:

- what belongs here;
- what changes at the boundary;
- what things are connected;
- what reacts together;
- what remembers contact;
- what grows;
- what every meaningful change leaves behind.

This gives Four Workstations a route toward systemic novelty without becoming mechanically complicated.

No Unity implementation is authorized by this document.
