# VQ2 Atlas Boundary Ripple Final Implementation — Awaiting Human Visual Review

Date: 2026-09-05
Status: TECHNICAL PASS / HUMAN VISUAL REVIEW PENDING

## Scope

Final visual refinement of the Atlas Boundary ripple in `Assets/FourWorkstations/Scenes/Candidates/Office_Open20m_Candidate.unity`.

## Current authoritative Atlas Boundary state

- Center authority: `AtlasAnchor`
- Center: `(0, 0.02, 0)`
- Radius: `21.0m`
- Visual/ripple sphere diameter: `42m`
- Player clearance: `0.35m`
- Player maximum legal radius: `20.65m`
- Orb remains allowed to cross the boundary (`constrainToBoundary=false`)

## Ripple implementation

Final candidate parameters:

- Duration: `0.72s`
- Local spherical cap: `11°`
- Bands: `3`
- Band width: `0.055°`
- Band spacing: `0.72°`
- Azimuthal breakup: `0.46`
- Contact core: `0.28°`
- Max opacity: `0.066`
- Emission: `0`
- Distortion: not added, to avoid changing the URP pipeline

Visual behavior now uses:

- incomplete spherical arcs rather than complete concentric circles
- low-frequency intensity variation around the contact region
- staggered fade timing between bands
- large invisible portions of each circumference
- local contact response only
- normal-state renderer hidden after fade

The core surface logic remains based on spherical angular distance and the 11° local cap.

## 21m radius synchronization verification

The previous 30m candidate radius has been superseded by the user-authorized 21m radius.

Verified synchronized systems:

- gameplay radius: `21.000m`
- visual/ripple sphere: `21m` radius
- debug wireframe: `21m`
- player constraint uses dynamic `radius - clearance`
- Orb exit/enter crossing still works
- ripple contact radius: `21.000m`

Measured spatial data:

- Retrieval Station distance from Atlas: `7.952036m`
- Station to boundary: `13.047960m`
- Orb distance from Atlas: `7.465596m`
- Orb to boundary: `13.534400m`

## Protected systems unchanged

No changes to:

- Far Sky / Milky Way Human-Visual-PASS parameters
- sky rotation 45°
- Interior Architecture V3
- Retrieval transforms or behavior
- Camera / FOV / Eye Pivot
- Lighting
- global environment / ambient / reflection
- production scene/assets

## Validation

- Compile: PASS
- Shader errors: 0
- PlayMode: PASS
- Blocking errors: 0
- Fade -> Boundary Renderer hidden: PASS
- No commit/push/promotion of the Unity candidate implementation

## Evidence available locally

- `A-front-contact.png`
- `B-oblique-45.png`
- `C-near-floor-open-edge.png`
- `D-ripple-mid.png`
- `E-near-disappear.png`
- `F-faded-normal.png`
- `G-scene-sphere-gizmo.png`
- `H-ripple-sequence-sheet.png`

under:

`E:/Projects/four-workstations-unity/outputs/boundary-ripple-final/`

Radius evidence under:

`E:/Projects/four-workstations-unity/outputs/boundary-radius-21/`

## Gate

Technical implementation is accepted as structurally correct.

Human Visual PASS is still pending because the final sequence must be visually judged for whether it reads as a local disturbance of an otherwise invisible spherical refuge boundary, rather than as a UI ring, portal, or shield effect.
