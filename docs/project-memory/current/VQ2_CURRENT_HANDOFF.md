# VQ2 Current Handoff

> Status: **ACTIVE**  
> Updated: 2026-09-08  
> Purpose: shortest current-state handoff. Read topic files only when needed.

## Project identity

VQ2 is a **first-person Persistent Mystery Room Game**.

Core fantasy:

> The player inhabits a small stable 3D Refuge preserved inside a high-dimensional Outside, uses Retrieval to touch the unknown, brings things home, and gradually understands the room, Atlas, the Outside, and the civilization preserving humans.

Core loop:

`Inhabit -> Retrieve -> Inspect -> Use/Place -> Observe -> Connect/Reinterpret`

Design principle: **LOW VERB / HIGH DISCOVERY**. The room is the main interface. Logging in should make the player notice what changed in the world rather than open a mission-list game.

Emotional line:

> 宇宙可能已经结束，但生活没有停止。

## Current technical context

- Unity: `6000.3.21f1`
- URP: `17.3.0`
- primary local candidate: `Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`
- 60 real minutes = 1 in-game day
- production scenes are not promoted/overwritten without explicit Human authorization
- remote GitHub can lag the local Unity worktree

## Current active problem — Outside / Universe

The current celestial sky architecture has solved player-translation parallax for black-hole and nebula layers.

Verdict:

> **TECHNICAL SKY-LOCK PASS / HUMAN VISUAL FAIL**

Preserve zero-parallax celestial anchoring. Rework visual scale and realism:

- black hole is too small and icon-like;
- surrounding space does not show enough visible gravitational lensing;
- nebula is far too small and too dark;
- astronomical distance must not be communicated by shrinking giant celestial structures;
- north-side nearby planet remains an important later/current Outside landmark direction.

See `VQ2_OUTSIDE_CURRENT.md`.

## Refuge architecture

`Architectural Zoning Rework V1` received **HUMAN VISUAL / SPATIAL FAIL** and was rolled back.

Reject the failed V1 geometry, not the broader intent. Selected real internal walls, stronger zoning, a better Northwest Experiment room, east Bar/Social area, southeast Retrieval area, southwest entry treatment, and south Garden/Viewing Court remain available for redesign.

Architecture is currently paused while Outside is the active creative focus.

See `VQ2_REFUGE_CURRENT.md`.

## Lighting

`Golden Lighting Diagnostic V1` produced useful evidence but is not a final baseline.

Verdict:

> **PARTIAL SUCCESS / STRUCTURAL LIMIT IDENTIFIED**

At/near noon the west wall becomes a large flat gray field because current solar geometry gives it little useful direct shaping. Do not solve this indefinitely with tiny intensity changes. Revisit after architecture is stable; formally reopen the daylight orbit if architecture + controlled bounce + practical lighting still cannot solve the wall.

See `VQ2_LIGHTING_CURRENT.md`.

## Protected current truths

- Atlas stabilizes a 3D Refuge domain larger than the visible architecture.
- Atlas Boundary V2 retains Human Visual PASS unless explicitly reopened.
- SunVisual still appearance retains Human Visual PASS unless explicitly reopened.
- current Far Sky / Milky Way remains the safe recoverable reference baseline while Outside enrichment is reopened.
- Build Grid foundation and furniture runtime placement/persistence remain accepted baselines.
- Outside naturally contains no human ruins, abandoned human infrastructure, human records, or ordinary human artifacts.
- Retrieval returns Outside-native matter, biology, constructs/technology, samples, signals, data carriers, or similar phenomena.
- Machine PASS never substitutes for Human Visual / Feel PASS.

## First-hour contract

The first hour must give control quickly, establish room ownership, reveal the Atlas boundary through physical evidence, complete the first real Retrieval loop before the distant war dominates, keep the player in control during the war event, and leave the Refuge visibly changed by the end of the hour.

See `VQ2_GAMEPLAY_CURRENT.md`.

## Collaboration / execution rules

- Human subjective judgement controls visual, spatial and feel Gates.
- Candidate-first; no production promotion without explicit Human authorization.
- Do not declare Human PASS yourself.
- Prefer targeted implementation, automated validation and focused evidence over broad repository audits or unnecessary Computer Use.
- Do not automatically reopen interior layout/lighting while the Human is focused on Outside.
