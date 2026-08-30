# Four Workstations / VQ2 — Implementation Start Gate

> Date: 2026-08-30  
> Status: PRE-IMPLEMENTATION EXECUTION PLAN — READY FOR USER AUTHORIZATION  
> Scope: transition from product/world design into implementation without reopening macro design scope  
> Implementation authorization: **NOT YET IMPLIED BY THIS DOCUMENT**

---

# 0. Executive decision

The project should now stop expanding macro design and prepare to build a **local-first vertical slice that proves the First-Hour product promise**.

The implementation objective is **not** to build the whole roadmap in sequence.

The first playable proof should answer:

1. Is the room desirable to inhabit?
2. Does one unusual resident read well and interact reliably in the frozen Office camera?
3. Is the open-edge retrieval action satisfying and visually distinctive?
4. Can a recovered object persist physically in the room and later behave strangely?
5. Can a real Focus/Commit action create a visible persistent Atlas construction change?
6. Can Atlas give one restrained unexplained response that makes the player want to continue?
7. Does save/reload preserve the world exactly enough that the player trusts persistence?

If these answers are weak, deeper economy, multiplayer, Ouroboros, stranger-room observation, and cross-world influence should not be allowed to hide the problem.

Working implementation principle:

> **Prove the room + resident + edge + object + Focus + Atlas loop before building the wider game.**

---

# 1. Gate 0 — Establish the actual Unity source of truth

## Why this is first

Project review currently records a high process risk: the latest active Unity worktree is not fully represented on remote `main`.

Before Codex/Agents make meaningful implementation changes, they must be working from the actual latest Unity project, not from historical Web code or stale migration state.

## Required checks

On the user's real development machine / active worktree:

- identify the current Unity project root;
- record current branch / detached-head state;
- record current HEAD commit;
- run `git status` and classify tracked/untracked changes;
- identify which changes are deliberate production state vs temporary candidate/bake/output files;
- verify `ProjectVersion.txt`, render pipeline, package manifest, Office production scene, current Day/Night assets;
- confirm whether the current Unity source is already committed locally;
- do **not** merge/push/delete anything automatically.

## Gate 0 output

Create/update a short machine-readable handoff that states:

- Unity source path;
- active branch;
- HEAD SHA;
- dirty files summary;
- production Office scene path;
- production Day scene state;
- Night candidate/production state;
- known local-only files that must not be lost;
- safe next branch name for VQ2 implementation.

## PASS condition

A new Agent can answer:

> “Which exact Unity files are the current source of truth?”

without relying on screenshots, memory, or historical Web files.

---

# 2. Gate 1 — Freeze the implementation target before touching the scene

The first implementation slice should be much smaller than the total design bible.

## In scope for the first vertical slice

### Room

- current approved Office composition/camera/lighting baseline;
- two authored open edges preserved;
- central Atlas reservation;
- one edge rest/sitting reservation;
- one edge retrieval/salvage reservation;
- one wall area reserved for later anomaly/history proof;
- enough uncluttered circulation for one resident.

### Resident

- one low-detail non-human production-candidate body family;
- minimum viable rig;
- readable idle/walk;
- edge sit;
- reach/hold;
- pull/retrieval effort;
- Atlas install/inspect gesture;
- no final facial system or cosmetic library.

### First recovered content

Only a tiny curated proof set:

- 1–2 ordinary recovered objects;
- Returning Piece;
- optional Closed Seed if cheap enough;
- one Atlas-compatible construction component.

### Atlas

Only early states:

- Quiet Foundation;
- First Fit / installed component;
- first restrained Response.

No Spatial Echo is required for the first implementation slice.

### Focus

- one genuine Focus/Commit path;
- completion can contribute to the early Atlas change;
- visible world-state result;
- no deep economy balancing required.

### Persistence

Must save/reload at minimum:

- resident-independent room state;
- recovered object identity/state;
- placed object transform/slot;
- Atlas construction state;
- Returning Piece behavioral state if relevant;
- Focus-earned contribution already committed to world state.

## Explicitly out of scope

Do not build during the first vertical slice:

- full Coin shop/catalog;
- large XP progression;
- final Build Charge balance;
- full research system;
- farming/cultivation economy;
- many anomaly types;
- full crack/repair history chain;
- large placement freedom;
- room expansion;
- shared-room networking;
- stranger-room observation;
- Ouroboros topology;
- observation awareness;
- cross-world influence;
- lore/cosmology exposition.

---

# 3. Gate 2 — Spatial Reservation Audit before final scene polish

Do not visually fill the Office first and discover later that gameplay has no room.

Using the live Unity scene, numerically inspect:

- floor bounds;
- open-edge geometry;
- four workstation bounds;
- central circulation;
- Atlas feasible footprint/clearance;
- rest-edge seating anchors/clearance;
- retrieval-edge character/rig/line clearance;
- candidate wall anomaly/repair panel;
- future research reserve;
- routes between desk / Atlas / rest edge / retrieval edge.

Use the existing spatial contract:

`Inspect scene -> identify semantic target -> query geometry -> calculate -> validate -> Human Visual`

Do not solve placement by screenshot-based XYZ guessing.

## PASS condition

Produce one frozen-camera reference screenshot plus a semantic map marking:

- GREEN — safe permanent decoration;
- YELLOW — gameplay reserve / temporary content;
- RED — do not occupy.

No final new furniture should be added to reserved space after this Gate without explicit review.

---

# 4. Gate 3 — Creature bake-off, not final character production

Current strongest body-family candidates remain PEBBLE and SEED.

Implementation should not begin by fully producing four characters.

Build only enough to compare the two concepts in the actual Office camera.

## Required tests

For each candidate:

1. idle beside workstation;
2. walk through central route;
3. sit at open edge;
4. hold one recovered object;
5. pull retrieval line/tool;
6. reach/install Atlas component;
7. rest pose;
8. black-silhouette readability;
9. approximate 200 px presentation readability;
10. collision/contact reliability.

## Selection rule

Choose the body family that best combines:

- visual identity;
- world fit;
- interaction clarity;
- low rig/contact burden;
- robust animation reuse.

Do not choose based on close-up concept beauty alone.

## PASS condition

One body family is selected and its interaction anatomy is frozen enough to author reusable anchors/sockets.

---

# 5. Gate 4 — Interaction foundation

Before content multiplication, prove one resident can reliably move and interact with semantic anchors.

Target foundation:

- NavMesh/free movement owns locomotion;
- authored semantic Anchors own exact interaction destinations/facing/contact;
- character exposes GroundContact / BodySeatContact / HandSocket_L/R / CarryCenter;
- world objects expose Approach / Interaction / Grab / Attach / Seat / Pull anchors as appropriate.

First required interactions:

- move to edge;
- sit at edge;
- move to retrieval position;
- perform retrieve/pull;
- carry/place recovered object;
- move to Atlas;
- install/inspect component.

## PASS condition

No interaction requires repeated screenshot-only manual coordinate tuning.

---

# 6. Gate 5 — First-Hour local vertical slice

This is the first real product proof.

## Required experiential sequence

### A. Home

Player sees the warm room, resident, two open edges, quiet Atlas foundation.

### B. Edge

Player performs first retrieval and receives one ordinary-ish physical object.

### C. Wrongness

Player later encounters Returning Piece or equivalent subtle rule-breaking object.

### D. Real effort

Player completes one genuine Focus/Commit period.

### E. Visible transformation

That effort allows/completes one physical Atlas construction step.

### F. Response

Atlas performs one unexplained restrained response after the installation.

### G. Persistence

Quit/reload preserves the room, object, Atlas state, and prior contribution.

## Vertical-slice success reaction

The player should plausibly leave thinking:

> “I like this room; I can pull real things into it; something about those things is strange; my real work changed the room; and Atlas just did something I don't understand.”

Not:

> “I completed the tutorial and earned currency.”

---

# 7. Gate 6 — First persistent-history proof

Only after Gate 5 is satisfying, add one full history chain.

Preferred current candidate:

`intact wall -> Hairline Direction Crack -> inspect/leave/repair choice -> strange repair -> permanent Wall Repair Patch`

This Gate proves:

> `Before -> After -> History`

Persistence must survive save/reload and remain compatible with later relationships.

Do not add multiple anomaly families yet.

---

# 8. Gate 7 — Decide whether to proceed to shared/network systems

Only after the local vertical slice passes should the project spend serious effort on networking.

Then perform a narrow Unity/Supabase technical spike for:

- authentication persistence;
- token refresh;
- database state load/write;
- Realtime reconnect;
- Presence or fallback online model;
- Windows standalone behavior;
- two-client same-room persistence.

Do not implement the stranger-room chain at this point.

First prove the existing 1–4 shared-room foundation can be made trustworthy.

---

# 9. Revised near-term execution order

For the implementation start, use this order instead of mechanically following the older feature-by-feature roadmap:

0. **Actual Unity source-of-truth audit / safe work branch**
1. **Spatial Reservation Audit**
2. **PEBBLE vs SEED low-detail creature bake-off**
3. **Semantic interaction foundation**
4. **First-Hour local vertical slice: Edge + recovered object + Focus + Atlas First Fit/Response + persistence**
5. **First persistent-history chain**
6. **Human playtest / instrumentation / kill-or-continue review**
7. **Unity ↔ Supabase shared-room technical spike**
8. **Only then deepen economy / content ecology / Atlas Pattern and Spatial Echo**
9. **Stranger-room / Ouroboros remains later**

This order is optimized around proving the current product identity, not completing architectural subsystems in isolation.

---

# 10. First implementation branch recommendation

After Gate 0 establishes the correct local base, create a dedicated branch for the first proof rather than coding directly on `main`.

Suggested semantic name:

`feat/vq2-first-hour-vertical-slice`

If the source Unity migration itself still needs to be preserved first, snapshot that state separately before creating the vertical-slice branch.

Do not guess the base branch before inspecting the actual local worktree.

---

# 11. Evidence requirements for every Gate

Each Gate should produce:

- exact changed files;
- machine-verifiable checks where possible;
- before/after state;
- screenshot/video only as visual validation, not geometry source-of-truth;
- Human Visual PASS for visual/animation work;
- explicit known failures;
- no silent scope expansion;
- project-memory update only when a conclusion becomes stable.

For early product testing, add a lightweight structured event log rather than a large analytics platform.

Useful events:

- session start/end;
- Focus start/complete/cancel;
- retrieve start/complete;
- recovered object type;
- place/keep object;
- Atlas install;
- Atlas response;
- save/load;
- first return session.

---

# 12. Start/no-start boundary

This document means:

> **Design exploration is paused and the project is prepared to enter implementation.**

It does **not** mean that Agents should immediately modify Unity, push branches, replace characters, or build networking without a user start command.

When the user explicitly says to begin implementation, the first execution task should be:

> **Gate 0 — inspect and establish the actual local Unity source of truth, then return the exact safe base for the first implementation branch.**

No gameplay code should be changed before that Gate is complete.
