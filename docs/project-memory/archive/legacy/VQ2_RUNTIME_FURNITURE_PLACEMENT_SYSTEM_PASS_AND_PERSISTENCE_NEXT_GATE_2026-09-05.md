# VQ2 Runtime Furniture Placement System PASS + Persistence Next Gate

Date: 2026-09-05
Status: HUMAN/TECHNICAL WORKFLOW BASELINE CONFIRMED

## Runtime placement result

The current Furniture Candidate Catalog + runtime placement/build system has passed the representative PlayMode workflow.

PASS:
- Catalog access
- Selection of 8 registered furniture candidates
- Spawn / ghost preview
- Move
- 0.5m grid snap
- 90-degree rotate
- Confirm placement
- Re-select placed furniture
- Pick up
- Reposition
- Rotate again and re-place
- Compile PASS
- Blocking runtime errors: 0

## Blocker found and fixed

Two runtime components on the furniture prefabs were showing Missing Script because the script filenames did not match their MonoBehaviour class names.

Minimal fix completed:
- split into `FurnitureCandidateBuildable.cs`
- split into `PlacedFurnitureRecord.cs`
- rebuilt the 8 catalog prefabs

Post-fix PlayMode test: PASS; Missing Script count = 0.

## Next Gate

Before the user invests time manually furnishing the room in-game, verify placement persistence so their layout is not lost between play sessions.

Required next behavior:
- save placed furniture identity + transform/orientation
- reload and restore the same placed furniture layout
- preserve 0.5m snapped positions and 90-degree rotation state
- avoid duplicating furniture on repeated loads
- preserve existing build/placement interaction behavior

Do not broaden this into a general save-game system unless required. This is a focused furniture-layout persistence gate.
