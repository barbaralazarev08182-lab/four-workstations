# VQ2 Furniture Asset Direct Codex Handoff Workflow — 2026-09-05

User workflow preference:

- Furniture assets are handed directly to Codex as files.
- The user does not want to manually stage/rename/inspect them first.
- Codex should inspect the attached asset, determine file format/units, import it into the Unity candidate workspace, measure real bounds, normalize only if necessary, calculate 0.5 m grid occupancy, place it in the accepted interior baseline, and report the result for Human Visual Review.
- Do not guess furniture dimensions before measuring the actual asset.
- Do not stretch furniture merely to fill previous graybox footprints.
- Preserve real human scale and proportions.
- For each placed furniture asset report: actual dimensions, hard occupancy grid, use/clearance grid, orientation, and remaining circulation width.
- Download/import furniture one item at a time; do not bulk-ingest the shortlist.
- No commit, push, production promotion, repo-wide audit, or unrelated static checks unless separately authorized.
