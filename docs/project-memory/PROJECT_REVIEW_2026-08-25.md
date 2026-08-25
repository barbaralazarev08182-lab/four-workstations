# Four Workstations — Holistic Project Review & Open-Risk Roadmap

> Status: LIVING / HOLISTIC REVIEW  
> Review date: 2026-08-25  
> Purpose: preserve the current whole-project judgement, unresolved risks, dependency order, and what can safely begin next. This is project memory for future ChatGPT planning, not a Codex execution checklist.

---

## 1. Executive view

Four Workstations has moved past the stage where its biggest problem is visual foundation. The Unity Office now has a strong Day production baseline, validated workstation geometry, fixed orientation/camera, and a Night candidate that has passed Human Visual Review. The next major risks are no longer “can the room look good?” but:

1. **Can the game loop make a physically small room feel deep over weeks/months?**
2. **Can the project adopt a clean Unity-native character ecosystem instead of continuing to patch the current non-standard rigs?**
3. **Can Unity reliably reuse the existing Supabase social/backend foundation, especially authentication, Realtime, Presence, reconnect, and Windows-build behavior?**
4. **Can Project Atlas produce enough visible shared-world transformation to justify repeated real-life Focus sessions?**
5. **Can locomotion and interaction become a stable general-purpose system without hand-authoring paths/positions for every action?**

The project should now optimize for **proof of the core product loop**, not for more broad polishing or feature accumulation.

---

## 2. Stable / protected foundations

### 2.1 Unity visual baseline

Current protected decisions:

- Unity 6 LTS / URP / Linear / Windows desktop
- approved orthographic Office camera
- whole-world Y=180° orientation repair
- 4x MSAA edge-quality baseline
- workstation geometry rebuilt from the current polished source rather than historical simplified R5 runtime topology
- long-lived architecture/table surfaces must remain artifact-free
- current four desks use the corrected `[wood, metal, dark]` material-slot order
- Day lighting has been promoted into production `Office.unity` and is FINAL/FROZEN
- Day lightmap receiver UV1 problems on permanent surfaces were corrected; UV1 overlap validation is now mandatory for baked receivers

These are baselines, not permanent prohibitions on future artistic change. Any future change must be a new candidate compared against the approved baseline.

### 2.2 Night lighting

Night N1R has Human Visual PASS:

- separate Night scene/settings/baked data from Day
- Non-Directional lightmap
- no weak realtime moon shadows that caused green/purple directional banding
- four warm desk-light pools preserved
- 256/256/256 bake
- clean low-light readability

Open item:

> N1R is not yet production-frozen until promoted into the actual runtime Night path and verified without visual drift.

This is a small cleanup task, not a design risk.

### 2.3 Product direction

Current high-confidence product fantasy:

> Four people work, study, and live in real life while jointly building a persistent miniature world that visibly changes because of those real-life actions and social traces.

Important principles:

- real-life behavior is gameplay input
- visible world growth is feedback
- one player must always be able to progress
- more players add parallelism, surprise, social richness, asynchronous traces, and optional Harmony rewards — not mandatory progression gates
- Office remains Home Base
- do not solve shallow gameplay by adding more maps
- absence is not punished
- no productivity leaderboard / KPI / punitive streak design

---

## 3. Current major uncertainties

### U1 — Current Unity source is not yet a remote source-of-truth

Severity: **HIGH / PROCESS RISK**

Current GitHub `main` is still primarily the historical Web project plus project-memory documentation. The active Unity worktree/branch and local `docs/UNITY_MIGRATION.md` are not represented on remote main.

Why this matters:

- future conversations can recover design history from Markdown but cannot inspect the actual latest Unity implementation
- local work is vulnerable to machine/worktree loss or drift
- project-memory may eventually disagree with implementation
- code review and reproducibility are weakened

Required future action:

> Once the user is ready to preserve the current Unity implementation, safely push/merge the Unity migration branch without overwriting the historical Web source or accidentally committing temporary candidate artifacts.

This requires explicit user authorization for commit/push; do not silently do it.

### U2 — Character model ecosystem is unresolved

Severity: **HIGH / BLOCKS ADVANCED CHARACTER INTERACTION**

The current four production characters can Idle/Walk and their bodies can be forced through a Humanoid adapter, but the adapter path failed Human Visual Review once finger mapping exposed the non-standard reference pose.

Current custom-rig conclusions:

- production rig is not natively valid Unity Humanoid
- production Avatar is null
- adapter body mapping can become valid/human
- reference skeleton is idle-like rather than a clean T-pose
- full finger mapping exposes severe hand/finger deformation
- continuing to patch the current Humanoid seating pipeline is paused

Replacement research currently recommends a bake-off between:

1. **Quaternius Universal Base Characters** — first choice; CC0, explicit Humanoid rig, animation-friendly topology, same ecosystem as UAL
2. **Synty Sidekick FREE Starter** — explicit Unity Humanoid/Mecanim, highly modular, stronger Unity-first tooling, but art-direction fit is uncertain
3. Reallusion Character Creator / ActorCore — premium fallback if deeper production tooling becomes necessary

Open question:

> Which ecosystem passes clean T-pose/finger retargeting AND visually belongs in the Office at the frozen camera?

Cheap proof:

- one Quaternius male + one Synty Sidekick male
- direct Humanoid import without `CharacterHumanoidAdapter`
- hands/fingers, Idle, Walk, simple emote, neutral sit
- actual Office-camera side-by-side
- performance/material/bone counts

Do not replace all four characters before this bake-off.

### U3 — Locomotion/control architecture is not yet proven in Unity

Severity: **HIGH / CORE INTERACTION FOUNDATION**

The long-term intended control direction is click-to-move primary + contextual interaction (`E`/click), with optional WASD later if useful.

The old Web waypoint graph is useful as historical semantic knowledge but should not become the permanent Unity movement architecture.

Recommended Unity direction:

> **NavMesh owns free walking/pathfinding; semantic Anchors own interaction destinations.**

Use Unity AI Navigation (`com.unity.ai.navigation` 2.x) rather than hand-authoring every route.

Open questions:

- NavMesh bake/agent radius around the dense four-desk layout
- click target UX under an orthographic camera
- obstacle avoidance with four simultaneous characters
- deterministic arrival/facing at InteractionAnchors
- whether pathfinding can coexist cleanly with status-driven/business destinations
- whether optional WASD adds value or only complexity

A locomotion spike should happen after/alongside character replacement selection, but does not need seated interaction.

### U4 — Unity ↔ Supabase production architecture is not yet proven

Severity: **HIGH / MULTIPLAYER FOUNDATION**

The historical Web project already has useful Supabase foundations:

- profiles
- offices
- office_members / four fixed desk slots
- current_status
- checkins
- interactions/comments
- RLS
- create/join office RPCs
- server-authoritative status mutation
- Realtime synchronization patterns

However, moving the client to Unity changes the client/runtime assumptions.

Key uncertainty:

- the commonly used Supabase C# client is community-maintained rather than an officially supported first-party client
- Auth persistence, token refresh, Realtime reconnect, Presence semantics, and Windows standalone behavior need a real Unity spike

Recommended split:

- **persistent business state**: database/Postgres Changes (`current_status`, Atlas state, inventory, etc.)
- **ephemeral actual online presence**: Realtime Presence if the Unity client proves reliable; otherwise a deliberately designed heartbeat/last-seen fallback

Do not treat a persisted status such as `eating` as proof that a person is online now.

### U5 — Presence freshness / stale state remains a product problem

Severity: **HIGH / TRUST PROBLEM**

The VQ-2 roadmap already identifies impossible states such as a person apparently “eating for 600+ hours”.

Open design:

- what makes a status fresh today?
- what happens after crash/force-close?
- when does a character become offline/inactive?
- how should “current status” differ from “last known status/history”? 

Recommended direction:

- today/online is derived, not blindly persisted forever
- explicit Check-In establishes the day
- current business status is historical/persistent
- online presence is ephemeral
- stale current_status can remain in history but should not render as live presence

This can be designed before backend integration and then validated in the Supabase Unity spike.

### U6 — The core gameplay loop is still unproven

Severity: **CRITICAL / PRODUCT RISK**

The strongest design in the repository is the VQ-2 vertical slice:

`Check-In → Focus → XP/Coins/Build Charge → Atlas contribution → Phase change → visible Office transformation`

This is well specified on paper but has not been played in Unity.

The project must prove:

- Focus completion feels meaningful rather than like a timer with numbers
- Build Charge feels understandable and not like redundant currency
- Atlas contribution feels like participation rather than another progress bar
- Phase changes are visually obvious from the normal Office camera
- a solo player still wants to continue
- seeing another person's prior contribution adds value
- players want to come back tomorrow

This is the single most important product uncertainty.

### U7 — Atlas placement/style is not yet validated in the current Unity room

Severity: **HIGH / VISUAL + GAMEPLAY BLOCKER**

Canonical concept:

- central shared project between four desks
- small footprint, vertical growth
- phases visibly change silhouette
- warm metal / wood / off-white / brass / restrained emissive
- not cyberpunk, not a giant portal

Existing prototype budget from the older plan:

- base roughly up to 1.20m × 1.20m
- early physical body around 1.25m high
- total early visual height around 1.80m max

These are **greybox budgets only** and must be revalidated in the current Unity camera, current G1B desk geometry, and current Day/Night lighting.

Do not make final Blender Atlas art before placement/route/readability passes.

### U8 — Small-space replayability is still a design research problem

Severity: **CRITICAL / LONG-TERM RETENTION**

The Office is physically small. The correct goal is not to make traversal longer; it is to make the same space produce many meaningful states.

Working formula:

`Office × Time × People × Progress × Objects × Events`

What remains open:

- how many meaningful micro-actions are needed per day/week
- how solo play differs from 2/3/4-player play
- what asynchronous traces persist when others are offline
- how much daily variation is enough without becoming content-heavy
- which world changes are permanent vs temporary
- how often an event should occur before it feels repetitive
- how to keep the Office readable rather than cluttered as history accumulates

This needs focused design research and playtest prototypes, not immediate large-scale implementation.

### U9 — Economy values are only prototype values

Severity: **MEDIUM**

The newer canonical economy direction is:

- XP = progression
- Coins = spending/choice
- Build Charge = behavior-gated Atlas contribution resource

The older Work Tickets/public-fund economy is historical and should not override this.

Open:

- XP curve
- daily Coin target
- shop prices
- Build Charge rate/storage
- Atlas phase costs
- diminishing return curve
- catch-up behavior

Do not balance deeply before the local core loop is fun.

### U10 — Personal Desk progression is conceptually strong but untested

Severity: **MEDIUM / HIGH RETENTION POTENTIAL**

Current proposed approach is deliberately not free placement.

Fixed slots:

- Plant
- Mug
- Photo
- Toy
- Lamp
- Rare

Open questions:

- are changes visible enough at the frozen camera?
- do four desks remain visually distinct without clutter?
- which slots/items are emotionally desirable?
- should other players' gifts temporarily occupy dedicated Gift slots?
- how much ownership/customization is needed to make “my desk” meaningful?

First test should use only a few exaggerated/readable placeholder items, not the full shop catalog.

### U11 — New Unity performance budget is not yet formalized

Severity: **MEDIUM**

Old Web art-direction budgets such as a global 80k-triangle desktop limit are stale after the Unity migration and the accepted 50,176-triangle workstation geometry.

Need a Unity-specific budget based on real profiling:

- CPU main/thread frame time
- GPU frame time
- skinned mesh cost for four replacement characters
- shadow-caster cost Day/Night
- baked-lightmap memory
- draw calls / SRP batching
- Atlas/desk cosmetics growth
- target hardware class

The requirement remains desktop 60 FPS+, but budget decisions should come from Unity Profiler/Frame Debugger rather than inherited Web numbers.

### U12 — Night runtime promotion remains incomplete

Severity: **LOW / CLEANUP**

N1R visually passes but still needs production integration and no-drift verification.

Do this soon so the visual foundation does not remain half-candidate/half-production.

### U13 — Audio is absent but likely high leverage

Severity: **MEDIUM / HIGH VALUE**

The roadmap already identifies a restrained soundscape as potentially more valuable than further geometry polishing.

High-value examples:

- room/HVAC tone
- subtle keyboards
- coffee machine event sound
- arrival/door cue
- rain/window ambience
- Atlas mechanical hum/phase-up cue
- quieter night ambience

This should follow the first playable core loop rather than precede it, but should not be forgotten.

### U14 — Analytics / playtest instrumentation is not defined

Severity: **MEDIUM / NECESSARY FOR CORE-LOOP DECISIONS**

The vertical slice has Human Playtest success/kill criteria but no explicit event instrumentation plan.

At minimum, a local/QA prototype should log:

- Check-In
- Focus start/complete/cancel
- reward received
- Atlas open/inspect
- contribution
- phase transition
- time to first contribution
- return/session count
- interactions with other players/async traces

Do not build a large analytics platform. A simple local structured event log is enough for early playtests.

### U15 — Release/security multiplayer validation is still incomplete

Severity: **HIGH BEFORE REAL RELEASE, NOT BLOCKING LOCAL CORE LOOP**

Historical handoff still lists unfinished tests:

- four real accounts simultaneously online/moving
- fifth user rejected from full office
- same-desk race condition
- same-user multi-tab duplicate handling
- network disconnect / Realtime reconnect
- old-event replay prevention
- RLS attack tests
- member leave/desk vacancy
- ownership transfer
- isolated office deletion

Do not confuse an attractive local Unity prototype with production multiplayer readiness.

---

## 4. External product research — what the market suggests

The following are not project requirements; they are reference signals that help identify useful patterns.

### Spirit City: Lofi Sessions

Useful pattern:

- focus timer / to-do / habits + cozy ambient space + XP/customization
- “body doubling” and environmental companionship can make work feel less solitary

Warning:

- ambience/customization alone can eventually feel like “not enough game”

Four Workstations implication:

> Do not stop at a cozy office + timer + cosmetics. The persistent shared-world transformation must be substantially stronger than the productivity wrapper.

### Rusty's Retirement

Useful pattern:

- intentionally lives at the bottom/side of the desktop while the user does other tasks
- validates a game that accompanies work rather than demanding full attention

Implication:

> Desktop-companion mode is strategically promising, but only after the core loop proves itself.

### Virtual Cottage 2

Useful pattern:

- cozy focus/timer/habit systems + room customization + online multiplayer study

Implication:

> The category is real; Four Workstations needs a stronger differentiator than “focus together in a decorated room.” Shared persistent construction/history is the differentiator.

### Kind Words 2

Useful pattern:

- asynchronous low-pressure social interaction without follower/like competition

Implication:

> Sticky notes, gifts, memories, reactions, and traces should matter more than building a chat/leaderboard product.

### Pikmin Bloom

Useful pattern:

- real-world activity directly changes game state
- daily lookback turns mundane activity into memory

Implication:

> Daily Office Postcard / Lookback is likely high-value because it connects real behavior, shared history, and return motivation.

### Pokemon Sleep

Useful pattern:

- real-life behavior creates delayed morning discovery/anticipation rather than only immediate points

Implication:

> Focus completion should sometimes create a later reveal: Atlas part appears, desk changes, a memory is generated, a shared discovery arrives. Delayed anticipation can be more emotionally powerful than `+25 XP` alone.

---

## 5. Small-space design model to research further

A strong working structure for the Office is six layers:

1. **Ambient companionship** — subtle characters/world continue while the user works
2. **Micro interactions** — 10 seconds to ~2 minutes: coffee, note, reaction, inspect, collect
3. **Session actions** — real 5–60 minute Focus/Study/Break inputs
4. **Daily variation** — one or a few changing states/events, not a new map
5. **Long-term transformation** — Atlas, desk, plants, memories, collections
6. **Expansion areas** — only after the original Office proves the loop

The next design study should create a concrete matrix for 1/2/3/4 active players and asynchronous cases.

Questions to answer:

- What does a solo 20-minute session actually contain?
- What changes if one friend joins?
- What can an offline friend leave behind?
- What is visible the next morning?
- What creates a story without requiring custom dialogue or expensive animation?
- What repeats every day, what rotates weekly, and what is one-time progression?

---

## 6. What can safely start now

### P0 — Finish small visual cleanup

**Night production promotion**

Promote the already-approved N1R Night candidate into the real Night runtime path and verify no drift. No artistic retuning.

This should be a short closure task.

### P0 — Character Replacement R1 bake-off

Run Quaternius Universal Base vs Synty Sidekick FREE Starter on one representative character.

This resolves the current animation/interaction architecture uncertainty without touching production characters.

Do not resume the old adapter-first seating pipeline.

### P0 — Unity Project Atlas Greybox

This can start **in parallel with character replacement**, because Atlas placement/phase readability does not depend on final character hands.

Build Phase 0/1/2 only, with primitives and placeholder materials.

Required checks in the current Unity production camera:

- footprint / height
- four-desk composition
- Day and Night readability
- no permanent-surface regression
- route/clearance envelope reserved for future NavMesh
- clear silhouette difference between 0/1/2

Do not build final Atlas art or backend progress yet.

### P1 — Unity locomotion/navigation spike

After/alongside replacement-character selection:

- Unity AI Navigation / NavMesh
- click-to-move
- semantic destinations/InteractionAnchors
- arrival facing
- one player first, then four agents

Start with standing interactions only.

Do **not** block locomotion on sitting/typing.

### P1 — Supabase Unity S1 technical spike

Isolated technical validation, not full gameplay integration:

- login/session restore in Editor and Windows build
- list/create/join office
- read/write current status through safe RPC/API
- two Unity clients receive Realtime updates
- reconnect after network interruption
- evaluate Presence join/leave/sync semantics in the C# client
- document fallback if Presence behavior is insufficient

This spike can happen independently from Atlas art.

### P1 — Presence Freshness design lock

Before shared gameplay:

Define:

- online vs status/history
- Check-In freshness
- stale timeout / last_seen semantics
- crash recovery
- Daily reset/lookback behavior

Keep it simple and derived; do not add more primary statuses.

### P2 — Local Core Loop Vertical Slice

Only after Atlas greybox visually passes:

Use a development-shortened Focus timer and implement locally:

`Check-In → Focus → reward → Build Charge → Atlas contribution → Phase 0/1/2 change`

No Supabase persistence initially.

Add a tiny structured playtest event log.

Human playtest should answer whether the loop is fun/meaningful before economy/backend expansion.

### P3 — Shared Atlas integration

Only after local core loop PASS:

- persisted Atlas phase/progress
- Build Charge persistence
- Realtime shared contribution
- four Personal Module contribution flags
- optional Harmony event
- multi-account validation

### P4 — First Shop / Personal Desk

Only after core loop proves itself:

- 3–5 fixed-slot items first, not full catalog
- exaggerated size/readability at normal camera
- test whether players care about personal ownership
- then expand toward the documented 10-item first shop

### P5 — Memory / async social / soundscape

High-value, relatively low geometry/animation cost:

- physical coffee/gift trace
- sticky note/gift slot
- Daily/Weekly Office Postcard
- Memory Wall milestone
- restrained audio cues/ambience

These systems are especially valuable for making 1-player/offline periods still feel socially connected.

### P6 — Garden / Rooftop / Desktop Mode

Do not start until the Office core loop succeeds in playtest.

---

## 7. Recommended dependency map

```text
Visual Foundation
  Day FINAL/FROZEN
  Night N1R PASS -> promote/close
           |
           +-----------------------+
                                   |
Character Replacement R1          Atlas Phase 0-2 Greybox
Quaternius vs Synty               placement/readability
           |                       |
           v                       v
Unity-native character winner     Atlas Visual PASS
           |                       |
           +----> NavMesh / Interaction Anchors
                                   |
                                   v
                       Local Core Loop Vertical Slice
                       Check-In -> Focus -> Rewards
                       -> Contribution -> Phase Change
                                   |
                              Human Playtest
                                   |
                 +-----------------+-----------------+
                 |                                   |
          Supabase shared Atlas              First Shop / Desk
          + Presence truth                   visual ownership
                 |
                 v
      Async social traces / Memory / Sound
                 |
                 v
        Garden / Rooftop / Desktop Mode
```

Supabase Unity S1 can be researched in parallel as a technical spike, but do not let backend integration delay the local core-loop proof.

---

## 8. Things that should NOT start now

- repairing the current custom Humanoid finger/reference-pose pipeline further
- A4 cross-avatar seating on current rigs
- large animation-pack integration
- typing/drinking/hand IK before a replacement character ecosystem is selected
- free furniture placement
- full 30-level progression
- full economy balancing
- complete Shop catalog
- pet AI / final cat system
- large second map
- Rooftop implementation
- combat/RPG systems
- leaderboard/streak mechanics
- Desktop companion engineering
- deep final art for Atlas before greybox PASS
- broad refactor of Day/geometry/camera

---

## 9. Documentation contradictions that future planning must resolve carefully

Several older files contain correct historical context but stale implementation direction:

- `ECONOMY_DESIGN.md` still describes Work Tickets/public fund; newer VQ-2 documents supersede this with XP/Coins/Build Charge.
- `WORLD_DESIGN.md` contains Web-era coordinates, SceneManager concepts, older future maps, and old status-to-waypoint assumptions. Use it as historical zone/interactable reference, not Unity coordinate authority.
- `ART_DIRECTION.md` contains old Web performance budgets; visual language remains useful, but numerical performance limits require a Unity-specific rewrite.
- VQ1C files freeze standing-only Web character runtime and close seated-character work. This protects historical Web; it does not prohibit a clean future Unity-native replacement-character interaction system. Current custom-rig Humanoid seating work is paused for a different reason: Human Visual failure.

When conflicts occur, prioritize:

1. latest explicit user decision + latest Human Visual result
2. current project-memory documents
3. current Unity migration documentation/implementation when available
4. VQ2 roadmap/vertical slice for gameplay
5. VQ1C freeze docs as historical Web reference
6. older generic world/economy docs

---

## 10. Recommended immediate sequence

The next development period should not be “one giant next feature”. Use three bounded tracks, with only one active Codex implementation task per track at a time:

### Track A — Close foundations

1. promote N1R Night to production runtime and verify exact/no-material drift
2. safely preserve the Unity migration branch in GitHub when user authorizes commit/push

### Track B — Resolve character foundation

1. R1 Quaternius vs Synty bake-off
2. pick one ecosystem
3. only then re-open seated/contact/animation actions on the clean rig

### Track C — Prove the game

1. Atlas Phase 0–2 Unity greybox
2. Human Visual PASS
3. local Focus→Reward→BuildCharge→Atlas phase-change vertical slice
4. Human Playtest
5. only then Supabase/shared Atlas + Shop/Desk expansion

If limited to one substantive next task, choose:

> **Project Atlas Phase 0–2 Unity Greybox**

Reason: character replacement can be researched in parallel, but Atlas greybox attacks the largest remaining product risk — whether the tiny Office can visibly grow in a way that makes the real-life-driven core loop compelling.

---

## 11. Core project judgement

The project should stop asking “what feature can we add next?” and ask:

> **What is the cheapest experiment that can prove or kill the central fantasy?**

The central fantasy is not the Office renderer, the timer, the character animation library, or the database.

It is:

> “I did something real; our little shared world changed; my friends can see/continue that change; tomorrow I want to come back.”

Everything in the next vertical slice should serve that sentence.
