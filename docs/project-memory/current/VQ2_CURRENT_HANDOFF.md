# VQ2 Current Handoff

> Status: **ACTIVE**  
> Updated: 2026-09-08  
> Supersedes as default handoff: older dated Gate / Active Handoff files. Those remain historical references.

## Project identity

VQ2 is now a **first-person Persistent Mystery Room Game**.

Core fantasy:

> The player inhabits a small stable 3D Refuge preserved inside a high-dimensional Outside, uses Retrieval to touch the unknown, brings things home, and gradually understands the room, Atlas, the Outside, and the civilization preserving humans.

Core loop:

`Inhabit -> Retrieve -> Inspect -> Use/Place -> Observe -> Connect/Reinterpret`

Long-term design principle: **LOW VERB / HIGH DISCOVERY**. The room itself is the interface; logging in should make the player notice what changed in the world, not open a mission-list game.

Emotional line:

> 宇宙可能已经结束，但生活没有停止。

## Current technical context

- Unity: `6000.3.21f1`
- URP: `17.3.0`
- primary local candidate: `Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`
- production scenes must not be overwritten/promoted without explicit Human authorization.
- remote GitHub can lag the local Unity worktree; never claim remote state proves the live candidate.

## Current work state

### Outside / Universe — ACTIVE VISUAL PROBLEM

Current technical sky-lock solution has solved player-translation parallax for black-hole / nebula celestial layers.

Current verdict:

> **TECHNICAL SKY-LOCK PASS / HUMAN VISUAL FAIL**

Next visual problem is not parallax. It is **celestial scale, color, realism, and gravitational lensing**:

- black hole is currently too small / icon-like;
- it does not visibly bend the surrounding star field enough;
- nebula is far too small and too dark;
- astronomical distance must **not** be communicated by shrinking giant celestial structures;
- zero-parallax celestial anchoring should be preserved while visual scale is rebuilt.

See `VQ2_OUTSIDE_CURRENT.md`.

### Refuge architecture — PAUSED AFTER ROLLBACK

`Architectural Zoning Rework V1` received **HUMAN VISUAL / SPATIAL FAIL** and was rolled back.

Important distinction:

- the specific V1 wall geometry/layout is rejected;
- the broader Human idea of adding selected real walls, a better zoned Refuge, and a south viewing garden remains open for redesign.

Do not resume by repairing the failed V1 geometry. Redesign from the Human spatial intent when this area is reopened.

See `VQ2_REFUGE_CURRENT.md`.

### Lighting — DIAGNOSTIC PAUSED

`Golden Lighting Diagnostic V1` produced useful evidence but did not become a final visual baseline.

Current verdict:

> **PARTIAL SUCCESS / STRUCTURAL LIMIT IDENTIFIED**

Main concern: at noon the west wall becomes a large, flat gray field because the current sun-orbit geometry gives it little/no useful direct shaping light. Do not keep solving this with tiny intensity adjustments.

Lighting should be revisited after architecture is stable enough to judge the new shell. If indirect light / practical lights / new architecture cannot solve the west-wall composition, the old Sun-orbit lock may be formally reopened.

See `VQ2_LIGHTING_CURRENT.md`.

## Current protected truths

- 60 real minutes = 1 in-game day.
- Atlas stabilizes the Refuge's 3D domain; walls are not the ultimate physical boundary.
- Atlas Boundary V2 retains its prior Human Visual PASS unless explicitly reversed.
- SunVisual retains prior Human Visual PASS unless explicitly reversed.
- current Far Sky / Milky Way remains a recoverable accepted reference baseline even while Outside enrichment is reopened.
- furniture runtime placement + persistence baseline remains valid.
- Outside naturally contains no human ruins, abandoned human infrastructure, human records, or recovered human artifacts.
- retrieved Outside content should be Outside-native materials, biology, constructs, alien/high-dimensional technology, samples, signals, data carriers, etc.

## Collaboration rules

- Human subjective judgement controls visual/feel Gates.
- Codex should not promote candidates, push, or declare Human PASS unless explicitly authorized.
- Prefer direct code/files, batch/editor scripts, automated tests, and automated evidence over Computer Use.
- Only generate/edit images when the current Human message explicitly contains the exact phrase `生成图片`.

## Next-stage priority

The immediate active creative direction is the **Outside / Universe visual layer**, not the interior.

Do not automatically reopen interior layout or lighting while the Human is working on Outside unless explicitly requested.
