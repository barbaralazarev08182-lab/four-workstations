# VQ2 Current Checkpoint & Recommended Next Stage — 2026-09-04

> Status: CURRENT CHECKPOINT / RECOMMENDED NEXT STAGE — NOT YET USER-LOCKED
>
> Purpose: separate what is actually implemented/validated in the current Unity direction from systems that are only designed or locked on paper, then identify the most dependency-efficient next production stage.

## 1. Current production reality

The project has recently advanced much faster in systems/narrative design than in local Unity implementation. The current physical Unity candidate should therefore not be treated as if Matter Bench, full R/P/S simulation, Chapter 1 gameplay, Outside universe presentation, or final Atlas daylight are already implemented.

### Unity / visual foundation already established

- `Office_Open20m_Candidate.unity` is the active 20 x 20 candidate scene.
- Open20m room geometry has Human Visual/Feel PASS.
- Build Grid visual/feel has Human PASS; accepted logical placement step remains 0.5m.
- Oak Wood Planks floor has Human Visual PASS.
- Production promotion remains not done.
- Latest user clarification: the historical two-wall L-shaped spatial relationship is still a useful architectural reference, but the walls have currently been removed and have not yet been rebuilt.
- Latest user clarification: the old four small characters have been removed and replaced by the newer user-authored player character.

### Player

- Updated player character is integrated.
- Humanoid retarget / idle / locomotion / jump / grounding / room relationship previously passed Human review.
- First-person prototype is authorized and exists as a direction.
- The prior Eye Pivot backward adjustment and head-shadow preservation remain a separate acceptance item unless newer local work has explicitly closed them.

### Retrieval hardware/runtime

- Retrieval Station visual/model Gate 3 is closed; high poly is accepted and should not be reopened without evidence.
- Retrieval Orb visual direction is established.
- Local Phase 1 tether/runtime foundation has existed with Stored -> Deploying -> Holding -> Retrieving -> Docking -> Stored, procedural/LineRenderer cable, slack/tension behavior, and no rigidbody-chain rope.
- This is not yet the full gameplay Retrieval loop: Echo targeting, intent-control UX, real Outside targets, boundary-cost simulation, physical recovered-object processing, etc. are still later work.

## 2. Design systems that are now locked on paper but not yet implemented

The following structural directions are user-accepted and authoritative, but should not be confused with completed Unity systems:

- `R = Refuge Reserve`, initial reference 100 but not a hard maximum.
- Ordinary sealed-room life does not permanently tax R.
- Persistent Retrieval cost comes mainly from Atlas-boundary opening/crossing.
- P and S are operating states, not wallet currencies.
- Retrieved objects first enter the room physically.
- Preserve / Strip / Reclaim / Research / Contain are the core handling choices.
- Current bulk material families: Structure / Polymer / Conductive / Bio-Volatile.
- Advanced capabilities require material + intact component + knowledge/blueprint rather than generic-material accumulation alone.
- Orb uses intent control, in-world Echo/radar assistance, state-readable warm luminous behavior, and optional long-range camera feed.
- Player remains the user-authored robot-like body, redefined as a Human Continuity Body rather than being replaced with a conventional biological human model.
- Eating, drinking, and sleep remain meaningful human behaviors without default hunger/thirst/battery survival-bar stacks.

## 3. Design work that remains proposal / not yet locked

- Exact Matter Reclamation & Fabrication Bench physical design, dimensions, layout, animation, and first-hour workflow.
- Exact R/P/S mathematical values, reserve thresholds, Atlas capacity, Retrieval cost coefficients.
- Exact Echo Disc visual design and control bindings.
- Exact first retrieved object.
- Exact first-hour ownership module choices.
- Exact Outside rendering implementation details.
- Exact Atlas artificial-sun orbit geometry and tuned lighting values.

## 4. Where the old active handoff had actually reached

The 2026-09-03 active handoff said the immediate next task was Oak-floor integration and Human Visual review. That task is now complete and Human Visual PASS.

The handoff's stated post-floor order was:

1. clean temporary Build Grid placeholder/test objects;
2. verify legacy baked-shadow state;
3. verify full 20 x 20 player movement bounds;
4. begin architect-style room planning: zones, circulation, screens/partitions, negative space;
5. only then progressively integrate medium furniture and living facilities;
6. large catalog/inventory/save/economy systems later.

Therefore the project is now physically at the beginning of the architectural room-planning stage, even though later gameplay/economy systems have already been deeply designed in parallel.

## 5. Recommended next production stage

Recommended name:

`Open20m Home Spatial Foundation — Architecture Blockout Gate`

This should be the next actual Unity production stage before final Matter Bench modeling or full R/P/S gameplay implementation.

### Why this is the highest-dependency stage

The room architecture determines or constrains:

- where the two walls return and their exact usable lengths/heights;
- where the entrance/transfer door belongs;
- Power Hub wall placement;
- Matter Bench footprint and player working clearance;
- Retrieval Station sightline and safe operating space;
- Atlas visual dominance and circulation around it;
- Rest / Observe zones;
- future cat paths and domestic zones;
- furniture density and negative space;
- artificial-sun shadow composition;
- first-hour movement route;
- where the player naturally looks when the Chapter 1 distant war appears;
- whether future systems feel like a home or a set of disconnected machines.

Final-modeling major facilities before this blockout is accepted risks designing expensive assets around the wrong footprint, wall relationship, camera sightline, or player circulation.

## 6. Scope of the recommended Architecture Blockout Gate

Before artistic finalization:

- clear obsolete debug/placeholders that no longer serve testing;
- verify movement coverage of intended 20 x 20 usable area;
- verify legacy baked-shadow issue separately;
- quickly close or explicitly defer the first-person Eye Pivot/head-shadow item;
- rebuild the two-wall L-shaped architectural shell as simple blockout geometry first;
- establish wall height/length/open-side relationship;
- preserve the intended open two-side relationship to the Outside;
- reserve the entrance/door location;
- reserve spatial zones for Atlas, Retrieval, Matter Bench/workshop, Power Hub, rest/observe, ordinary domestic furniture, and future cat activity;
- use primitive/proxy furniture only where needed to judge scale, sightlines, circulation, and sunlight shadows;
- validate entirely from first-person human review.

Do not spend this Gate polishing final sci-fi details, Matter Bench machinery, full furniture catalog, war VFX, inventory, save/load, or economy UI.

## 7. Recommended sequence after the Architecture Blockout Gate

### Stage A — Visual Envelope

After the walls/zones pass:

- minimal SunVisual + Directional Light orbit prototype;
- lighting judged with walls and proxy furniture, not an empty floor;
- basic Outside / sky depth prototype;
- Atlas boundary visual test only where needed;
- Human Visual Gate for home-vs-cosmos mood.

### Stage B — Core Gameplay Vertical Slice

Then build one complete playable loop using proxies before final facility art:

`Echo detect -> Orb intent-control -> Atlas crossing -> one physical target -> retrieve -> physical room arrival -> inspect/process -> one build result`

Use a greybox Matter Bench first if necessary. Validate interaction ergonomics before committing to final Matter Bench geometry.

### Stage C — R/P/S First Simulation

Integrate the first simple debug mathematical model into that vertical slice:

- one boundary opening cost;
- one hold/crossing cost;
- one retrieved mass gain;
- fabrication reshapes internal matter without reducing R;
- one low-reserve conservation response;
- protected reserve floor / no-softlock behavior.

Do not tune a full economy before this loop is playable.

### Stage D — Chapter 1 Playable Slice

After the core loop works, compose the first 20–30 minute playable Chapter 1 slice, then extend toward the full first hour. Narrative beats should be fitted around proven player actions rather than implemented as long dialogue/cutscene sequences first.

### Stage E — Final major facility art

Once footprint and interaction ergonomics are proven:

- final Matter Bench modeling;
- Power Hub final asset;
- Echo display final design;
- additional domestic furniture and life systems;
- final Outside/war presentation passes.

## 8. Recommendation summary

Do not move directly from current discussion into final Matter Bench modeling.

The best next production move is to return to Unity and close the room's architectural/spatial foundation first. The project currently has enough systems theory to support that decision; additional high-level resource design has diminishing value until the player can physically inhabit a correctly structured 20 x 20 home.

This recommendation is not a USER LOCK until the user explicitly accepts it.
