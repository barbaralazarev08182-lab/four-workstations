# VQ2 Atlas Boundary + Outside V1 — Human Visual Review Needs Refinement

Date: 2026-09-04
Status: HUMAN VISUAL REVIEW — PARTIAL PASS / REFINEMENT REQUIRED

## Preserved technical direction

The implemented architecture remains correct and should be preserved:

- AtlasAnchor is the boundary center authority.
- Candidate radius remains 30 m for the next visual iteration; do not change radius yet.
- Player uses radial constraint rather than visible collider geometry.
- Orb is explicitly allowed to cross the boundary.
- Boundary logic and boundary rendering remain separated.
- Boundary renderer is normally disabled/invisible.
- Far Universe remains camera-level and must not alter global RenderSettings ambient/reflection.
- Retrieval Station, Atlas, interior V3 layout, lighting, and production remain unchanged.

## Human visual review

### 1. Normal invisible boundary
PASS.

In normal play the sphere is not visible. This is correct and should remain the default behavior.

### 2. Far Universe
NEEDS REFINEMENT.

Current sky reads too much like a nearly uniform dark navy backdrop. It is dark enough, but there is insufficient visible structure to reliably read as infinite deep space from the room.

Required direction:

- reduce the feeling of a single flat navy color;
- shift closer to near-black with only a subtle dark blue/teal bias;
- add a sparse but clearly readable star population with strong black negative space;
- use varied star brightness/size rather than uniform dots;
- keep most stars neutral white, with only very small warm/cool variation;
- add extremely subtle large-scale dust / unresolved structure so the background has depth without becoming a galaxy wallpaper;
- do not add bright colorful nebulae, dense Milky Way bands, purple-blue RGB space, or fantasy sky art.

The target is not "beautiful star wallpaper". The target is "black space with enough evidence of enormous depth".

### 3. Near3D
DIRECTION ACCEPTED, KEEP SUBTLE.

The near layer is not visually distracting, which is good. Do not increase it into a field of floating debris.

If parallax is currently too difficult to perceive, improve it only slightly through scale/placement contrast, not by dramatically increasing count. One or two slightly more legible dim silhouettes are preferable to many additional particles.

### 4. Boundary ripple
FAIL IN CURRENT VISUAL FORM.

The visible effect currently reads too much like a thick luminous ring / portal / torus floating in space. That is not the intended boundary language.

Required direction:

- the ripple must read as a disturbance travelling across an otherwise invisible spherical surface;
- use a much thinner ring / several faint concentric surface waves rather than one broad luminous donut;
- significantly reduce opacity and emissive brightness;
- favor refraction / subtle value distortion / fine ivory highlight over a glowing solid ring;
- localize it strongly to the contact point;
- fade quickly;
- never reveal a large portion of the full shell during a normal ripple.

The correct player reaction should be: "something invisible was touched here", not "a portal opened in front of me".

### 5. Debug sphere reveal
QA ONLY.

Debug reveal may remain visually stronger than the gameplay ripple, but it must clearly communicate spherical scale for review. If the current full reveal is difficult to read as a sphere, use Scene gizmo / wireframe / latitude-longitude debug lines rather than making the gameplay material brighter.

Do not allow debug appearance to influence the final gameplay visual language.

### 6. Radius
KEEP 30 m FOR NOW.

Do not change the 30 m radius yet. The current visual deficiencies are dominated by sky flatness and ripple presentation. Re-evaluate 30/35/40 m only after the Outside background and ripple are corrected.

## Next candidate scope

Only refine:

1. Far Universe shader/material parameters and star/dust structure.
2. Boundary ripple shader presentation.
3. Optional debug-only sphere readability.
4. Near3D only if needed for minimal parallax readability.

Do not modify:

- Atlas transform
- radius (remain 30 m for this iteration)
- Player constraint behavior
- Orb crossing behavior
- Retrieval Station transform/logic
- interior V3 architecture
- lighting
- camera position/FOV/Eye Pivot
- production assets/scenes

## Gate status

Technical architecture: PASS.
Normal invisible boundary: PASS.
Outside visual: OPEN.
Boundary ripple visual: FAIL / REFINEMENT REQUIRED.
Full Atlas Boundary + Outside Human Visual Gate: OPEN.
