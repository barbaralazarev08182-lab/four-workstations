# VQ2 — Cascadeur Character Animation Authoring Contract

> Date: 2026-09-01
> Status: ACTIVE WORKFLOW DECISION
> Scope: character animation authoring handoff between the current Unity project and Cascadeur.

## 1. Authoring ownership

The user will personally author visible character animation in Cascadeur.

Codex may assist with technical preparation, export/import compatibility, file organization, skeleton inspection, bone mapping, validation, and bringing finished animation clips back into Unity.

Codex must not replace the user's character animation with independently authored final visible motion unless explicitly requested.

## 2. Preferred pipeline

Use the game-engine round-trip workflow:

Unity current production character -> clean animation-source FBX -> Cascadeur -> animation FBX -> Unity.

The Unity-exported character is the compatibility reference. Do not substitute a different source model merely because it is easier to rig.

## 3. First handoff task

Codex should inspect the local Unity project and identify the exact character prefab/model currently used in the authoritative runtime scene. Do not guess the character asset name or path from chat history.

Before export, report:

- source prefab/model path;
- mesh count and SkinnedMeshRenderer count;
- skeleton root and bone count;
- bind/default pose;
- avatar/import rig type if applicable;
- scale and axis orientation;
- materials/textures included or referenced;
- existing animation clips/controllers, if any;
- source file hash where practical.

## 4. Cascadeur handoff FBX contract

Create a separate, non-destructive animation-source FBX for Cascadeur.

Preserve:

- skinned mesh;
- deformation skeleton;
- skin weights;
- bind pose;
- bone names and hierarchy;
- character scale;
- coordinate orientation;
- a clean default A-pose or T-pose on frame 0 where possible.

Do not modify or overwrite the authoritative character source asset.

Avoid exporting unnecessary Unity scene objects, cameras, lights, room geometry, gameplay scripts, colliders, or unrelated props.

If the source includes non-deforming helper/control bones, prefer an export that preserves only the bones required for deformation and round-trip animation compatibility, unless removing helpers would break the imported Unity skeleton.

## 5. Cascadeur rig note

The imported FBX skeleton is not itself a Cascadeur control rig. After import, a Cascadeur rig must be created/configured before AutoPosing/AutoPhysics and the normal animation workflow can be used.

Codex should provide a bone-name mapping/report that makes Cascadeur Quick Rigging or manual rig setup easier, but the user remains the animation author.

## 6. Round-trip safety

When finished animation is exported from Cascadeur back to Unity:

- preserve the original Unity skeleton identity and bone names;
- prefer animation-only FBX import where possible after compatibility is established;
- verify root orientation, scale, foot contact, rotation offsets, and clip timing;
- do not replace the production model with the Cascadeur copy unless explicitly approved;
- keep source character, Cascadeur handoff model, Cascadeur project, and returned animation clips as separate assets.

## 7. Current Gate interaction

This animation-authoring workflow may be prepared independently from Retrieval gameplay. It must not alter the accepted Gate 3 room baseline, Atlas, Retrieval Station/Orb, or current source FBX assets unless a later explicit request changes scope.

## 8. Interaction constraint

Do not generate or edit images unless the user's current message explicitly contains the exact phrase `生成图片`.
