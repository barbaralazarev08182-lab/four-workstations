# VQ2 SunVisual Diameter + Codex Execution Economy Lock — 2026-09-05

## User-locked SunVisual size

- SunVisual physical diameter is locked to **0.50 m** for the current candidate implementation.
- Atlas Boundary radius remains **21.0 m**.
- SunVisual must remain inside the Atlas Boundary and visually run close to the inner surface.
- With a 0.25 m SunVisual radius and a small safety clearance, expected SunVisual center orbit radius is approximately **20.70–20.72 m**. Exact clearance may be chosen for numerical stability, but should remain visually negligible.
- Do not create alternate 0.42 / 0.58 m review variants unless the user later requests them.

## Existing SunVisual visual rules remain in force

- SunVisual is visually decoupled from room/daylight lighting.
- SunVisual should remain consistently bright and visually attractive through its orbit.
- Do not drive SunVisual color or visual emission from morning/noon/evening state.
- Surface animation quality is a primary visual goal: slow multi-scale solar activity, living surface motion, restrained corona, no generic lava-ball / magic-orb look.
- Room illumination, directional shadowing, daylight strength and any daylight color behavior belong to the separate lighting system.

## User workflow preference: Codex execution economy

For future Codex task prompts in this project, default to **direct implementation + targeted validation**, not broad process overhead.

Avoid routinely asking Codex for excessive:

- repository-wide audits,
- static-analysis sweeps unrelated to the changed feature,
- redundant state inventories,
- repeated hierarchy dumps,
- broad transform audits when transforms are outside task scope,
- repeated unchanged-baseline checks,
- verbose evidence bundles that do not improve the current Human Visual / Feel decision,
- defensive preflight/postflight checklists for low-risk candidate-only edits.

Prefer a compact validation set appropriate to the task, typically:

- Unity compile PASS,
- shader errors = 0 when shaders were touched,
- blocking runtime/editor errors = 0,
- direct PlayMode or visual verification of the feature that changed,
- explicit confirmation that protected/out-of-scope systems were not intentionally modified when that matters,
- no commit / push / production promotion unless separately authorized.

Additional audits or static checks should be requested only when the task has a concrete risk that makes them useful (for example migration, serialization, build failure, production promotion, broad refactor, performance regression, or destructive asset operations).

## Intent

Keep Codex iterations shorter and more execution-focused so candidate visual/gameplay work reaches Human Review faster, while preserving the essential compile/runtime/safety gates needed for reliable iteration.
