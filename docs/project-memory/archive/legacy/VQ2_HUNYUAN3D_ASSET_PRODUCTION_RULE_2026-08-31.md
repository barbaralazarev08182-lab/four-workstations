# Four Workstations / VQ2 — Hunyuan3D Asset Production Rule

> Date: 2026-08-31  
> Status: CURRENT USER-DIRECTED PRODUCTION RULE  
> Scope: division of responsibility for new 3D asset production  
> Implementation authorization: applies to current VQ2 production unless explicitly overridden later

---

# 1. Core rule

For new 3D assets that require actual geometry creation, the default project workflow is:

> **The user generates the model with Hunyuan3D. Codex/Agents do not replace Hunyuan3D by independently artistically designing/modeling the asset.**

This applies by default to:

- inhabitant / creature meshes;
- Atlas components and later Atlas physical stages;
- retrieved / recovered objects;
- strange world objects;
- research/cultivation devices;
- room expansion structures;
- future furniture or facilities when new geometry is required;
- other new authored 3D content unless an explicit exception is approved.

The goal is to keep visual asset authorship in the chosen generation pipeline while using Codex/Agents for deterministic technical production and Unity integration.

---

# 2. Responsibility split

## 2.1 ChatGPT / planning layer

Owns:

- product/world intent;
- art and interaction requirements;
- dimensional envelopes;
- silhouette requirements;
- camera-readability requirements;
- asset contracts;
- Hunyuan3D modeling briefs / prompt-ready specifications;
- acceptance criteria;
- cross-system dependency decisions;
- final review logic.

## 2.2 User + Hunyuan3D

Owns:

- actual generated 3D geometry;
- selecting/regenerating the visually preferred candidate;
- asset-level artistic iteration when the generated form is not acceptable.

Hunyuan3D output should be treated as the authored source candidate rather than as disposable greybox geometry created by Codex.

## 2.3 Codex / Agents / Blender / Unity tooling

After the user supplies a generated model, Codex/Agents may own:

- read-only preservation of original generated source;
- scale normalization;
- orientation normalization;
- pivot/origin correction;
- mesh cleanup;
- topology diagnostics;
- non-destructive optimization/decimation when justified;
- normal/tangent/UV validation;
- material-slot normalization;
- collider setup;
- LOD preparation if later required;
- rig/skeleton setup;
- skinning fixes;
- semantic anchors/sockets;
- Unity import settings;
- prefab construction;
- scene integration;
- automated geometry and interaction validation;
- fixed-camera QA captures;
- performance checks.

These operations must not silently redesign the asset's artistic identity.

---

# 3. Source pipeline

Preferred pipeline:

```text
World / gameplay requirement
        ↓
Asset Contract
        ↓
Hunyuan3D Modeling Brief
        ↓
User generates / selects model in Hunyuan3D
        ↓
Read-only Original
        ↓
Normalized Source
        ↓
Rigged / Optimized Source if required
        ↓
Unity Candidate
        ↓
Machine Validation
        ↓
Human Visual Review
        ↓
Approved Production Asset
```

Do not replace the `Hunyuan3D Modeling Brief -> User generates model` stages with autonomous Blender modeling merely because an Agent can create geometry programmatically.

---

# 4. Greybox exception

Codex may create primitive/editor-only geometry when its purpose is strictly engineering validation, for example:

- collision envelopes;
- semantic reservation volumes;
- Atlas footprint blocks;
- target-height markers;
- interaction reach markers;
- NavMesh/pathfinding blockers;
- temporary QA gizmos.

Such geometry must:

- be clearly marked as QA/greybox;
- not be mistaken for an art candidate;
- not become production art without explicit user approval;
- be removable without affecting authoritative game state.

This exception does **not** authorize Codex to create a stylized candidate creature, Atlas, retrieved object, or other visual asset instead of Hunyuan3D.

---

# 5. Creature-specific consequence

The PEBBLE vs SEED comparison is therefore split into two stages:

## Gate 2A — specification only

Codex prepares:

- equivalent Hunyuan3D modeling briefs;
- shared size/reach/rig constraints;
- neutral-pose requirements;
- asset-intake contract;
- later QA/test setup requirements.

Codex stops before generating creature meshes.

## Gate 2B — after user supplies Hunyuan3D candidates

Codex may then:

- normalize both models;
- rig them equivalently;
- add semantic contacts/sockets;
- integrate them into an isolated Office-camera test;
- run SitEdge / Carry / Pull / Atlas Reach / silhouette / readability tests;
- recommend the stronger body family based on evidence.

Final visual winner remains subject to human review.

---

# 6. Permanent guardrail

When a future task says or implies "make/model/create the 3D asset," first determine whether actual authored geometry is needed.

If yes, default to:

> **prepare the Hunyuan3D brief and engineering contract, then wait for the user-supplied Hunyuan3D model before integration.**

Do not silently substitute autonomous Codex modeling.
