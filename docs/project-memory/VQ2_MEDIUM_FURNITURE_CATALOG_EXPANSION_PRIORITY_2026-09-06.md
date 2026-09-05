# VQ2 Medium Furniture Catalog Expansion Priority — 2026-09-06

User decision:
- Current runtime catalog is too sparse and over-weighted toward chairs/sofas.
- Before doing final manual room layout, expand the catalog with more medium-size floor-standing furniture.
- Prioritize tables, storage, consoles, low cabinets, benches/ottomans and similar pieces over additional seating.
- Keep current runtime placement/persistence system frozen; new assets should register into the existing Furniture Candidate Catalog.
- Final placement and rotation remain user-authored in game.

Target next batch:
- Coffee tables / low tables: 3–4 additional distinct pieces
- Side / end tables: 3–4 additional pieces
- Console tables: 2 pieces
- Low cabinets / sideboards / credenzas: 2–3 pieces
- Small shelves / open storage: 1–2 pieces
- Bench / ottoman / low stool: 1–2 pieces

Selection rules:
- Italian Contemporary (~70%) + Nordic warmth (~30%)
- Real human scale; no non-uniform scaling
- Favor light oak, walnut, stone, glass, metal, rattan, wool / warm neutral materials
- Avoid generic office furniture, gamey props, fantasy/scifi styling, or more sofas unless specifically needed
- Use authenticated BlenderKit permissions; CAN_DOWNLOAD must be true and download HTTP must succeed
- If multiple same-name candidates exist, use thumbnail/contact-sheet visual comparison rather than stopping on name ambiguity
- No unrelated replacement assets unless the user explicitly accepts them

Workflow:
- Batch acquire and normalize the medium furniture assets
- Upright, floor contact, pivot, collider, actual W×D×H, 0.5m footprint
- Build prefab and register into existing Furniture Candidate Catalog
- Do not lock final position/rotation in scene
- Do not modify production assets, lighting, Atlas, Far Sky, Retrieval, or other frozen systems
- Compile + blocking runtime sanity only
- No commit/push/promotion unless explicitly authorized
