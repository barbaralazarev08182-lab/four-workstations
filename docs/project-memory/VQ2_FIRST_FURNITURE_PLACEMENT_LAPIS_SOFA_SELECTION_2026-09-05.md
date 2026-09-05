# VQ2 First Furniture Placement — Lapis Sofa Selection

Date: 2026-09-05

## Decision
The first real furniture replacement to attempt in the Living area is the user-shortlisted **Lapis Sofa by Amura** candidate.

Source page:
https://www.blenderkit.com/asset-gallery-detail/ca4ba7a1-3bd1-41db-b43e-2b5feb9b0f25/

Known source metadata:
- Free asset listing
- File size: 17.2 MiB
- Polygon count: 68,848
- High-end Italian designer sofa, modeled after Amura Lapis

## One-at-a-time asset workflow
Do not batch-download furniture.
Only download this sofa for the current step.

After download/import:
1. Measure the actual model bounds before placement.
2. Do not assume catalog/model dimensions if the source does not expose reliable real-world dimensions.
3. Normalize units only if the imported scale is clearly incorrect.
4. Do not stretch the sofa just to fill the old 4.5m graybox sofa footprint.
5. Convert the measured footprint into the project grid system:
   - visible grid: 1.0m
   - placement snap / occupancy planning unit: 0.5m
6. Report for Human Review:
   - actual W x D x H
   - hard occupancy in 0.5m cells
   - front use/interaction clearance
   - side/back clearance as needed
   - remaining circulation width
   - orientation and final candidate transform
7. Place only after those values are known.

## Living placement intent
The sofa remains a Living-area hero piece and should face the West/TV direction, but its exact transform must be derived from its real scale and the accepted Interior Architecture V3 circulation, not from the old graybox dimensions.

## Status
Selected as the first furniture candidate to download/import and measure. Not yet downloaded, imported, placed, committed, pushed, or promoted.
