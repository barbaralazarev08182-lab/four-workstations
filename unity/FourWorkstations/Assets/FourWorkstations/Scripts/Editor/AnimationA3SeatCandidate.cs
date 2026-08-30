#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FourWorkstations.Characters;
using UnityEditor;
using UnityEditor.Animations;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Animations;
using UnityEngine.Animations.Rigging;
using UnityEngine.Playables;
using UnityEngine.SceneManagement;

namespace FourWorkstations.Editor
{
    public static class AnimationA3SeatCandidate
    {
        private const string OfficeScene = "Assets/FourWorkstations/Scenes/Office/Office.unity";
        private const string CandidateScene = "Assets/FourWorkstations/Scenes/Candidates/AnimationA3Seat.unity";
        private const string MingCandidate = "Assets/FourWorkstations/Prefabs/Characters/Candidates/Ming_HumanoidCandidate.prefab";
        private const string AnimationFbx = "Assets/FourWorkstations/Audit/AnimationA2/Quaternius_A2_Idle_Walk_Interact_Sit.fbx";

        public static void BuildCandidateAndEnterPlayMode()
        {
            var scene = EditorSceneManager.OpenScene(OfficeScene, OpenSceneMode.Single);
            if (!EditorSceneManager.SaveScene(scene, CandidateScene, true))
                throw new InvalidOperationException("Could not create isolated A3 candidate scene.");

            foreach (var existingAnimator in UnityEngine.Object.FindObjectsByType<Animator>(FindObjectsInactive.Include, FindObjectsSortMode.None))
                existingAnimator.gameObject.SetActive(false);

            var chair = Find("D2_POLISHED_CHAIR_ROOT");
            var existingPelvisMarker = Find("D2_CHAIR_SEAT_ANCHOR");
            var desk = Find("MingDesk");
            var facingDirection = Vector3.ProjectOnPlane(desk.position - chair.position, Vector3.up).normalized;
            var facingRotation = Quaternion.LookRotation(facingDirection, Vector3.up);
            const float groundHeight = 0f;
            var physicalSeatHeight = chair.position.y;

            var contractRoot = NewAnchor("A3_SeatAnchorContract", chair, chair.position, facingRotation);
            var facing = NewAnchor("Facing", contractRoot, existingPelvisMarker.position, facingRotation);
            var pelvisPosition = new Vector3(existingPelvisMarker.position.x, physicalSeatHeight + 0.255f, existingPelvisMarker.position.z);
            var pelvisTarget = NewAnchor("PelvisTarget", contractRoot, pelvisPosition, facingRotation);

            var prefab = AssetDatabase.LoadAssetAtPath<GameObject>(MingCandidate);
            if (prefab == null) throw new InvalidOperationException("A2 Ming candidate is missing.");
            var character = (GameObject)PrefabUtility.InstantiatePrefab(prefab, scene);
            character.name = "Ming_A3_SeatCandidate";
            character.SetActive(true);
            character.transform.SetPositionAndRotation(Vector3.zero, facingRotation);

            var sit = AssetDatabase.LoadAllAssetsAtPath(AnimationFbx).OfType<AnimationClip>()
                .Single(clip => !clip.name.StartsWith("__preview__", StringComparison.Ordinal) && clip.name.Contains("Sitting_Enter", StringComparison.Ordinal));
            var animator = character.GetComponent<Animator>();
            var controller = AssetDatabase.LoadAssetAtPath<AnimatorController>("Assets/FourWorkstations/Audit/AnimationA2/CharacterHumanoidShared.controller");
            animator.runtimeAnimatorController = null;
            var playable = AnimationPlayableUtilities.PlayClip(animator, sit, out var graph);
            playable.SetApplyFootIK(false);
            graph.Evaluate(sit.length * 0.9f);
            var bones = character.GetComponentsInChildren<Transform>(true).GroupBy(item => item.name).ToDictionary(group => group.Key, group => group.First(), StringComparer.Ordinal);
            var hipsOffset = bones["Hips"].position - character.transform.position;
            var seatedRootPosition = pelvisTarget.position - hipsOffset;
            var leftFootUnrigged = bones["Foot.L"].position + seatedRootPosition;
            var rightFootUnrigged = bones["Foot.R"].position + seatedRootPosition;
            graph.Destroy();
            animator.Rebind();
            animator.runtimeAnimatorController = controller;

            var seatedRoot = NewAnchor("SeatedRoot", contractRoot, seatedRootPosition, facingRotation);
            var approachRoot = NewAnchor("ApproachRoot", contractRoot, new Vector3(seatedRootPosition.x, groundHeight, seatedRootPosition.z) + facingDirection * 0.32f, facingRotation);
            var side = Vector3.Cross(Vector3.up, facingDirection).normalized;
            var leftFootTarget = NewAnchor("LeftFootTarget", contractRoot, new Vector3(leftFootUnrigged.x, groundHeight + 0.035f, leftFootUnrigged.z), facingRotation);
            var rightFootTarget = NewAnchor("RightFootTarget", contractRoot, new Vector3(rightFootUnrigged.x, groundHeight + 0.035f, rightFootUnrigged.z), facingRotation);
            var leftHint = NewAnchor("LeftKneeHint", contractRoot, pelvisTarget.position + facingDirection * 0.42f - side * 0.18f + Vector3.down * 0.38f, facingRotation);
            var rightHint = NewAnchor("RightKneeHint", contractRoot, pelvisTarget.position + facingDirection * 0.42f + side * 0.18f + Vector3.down * 0.38f, facingRotation);

            var seatAnchor = chair.gameObject.AddComponent<SeatAnchor>();
            seatAnchor.Configure(approachRoot, seatedRoot, facing, physicalSeatHeight, pelvisTarget, leftFootTarget, rightFootTarget, leftHint, rightHint, groundHeight);
            character.transform.SetPositionAndRotation(approachRoot.position, approachRoot.rotation);

            var rigBuilder = character.AddComponent<RigBuilder>();
            var rigObject = new GameObject("A3_PelvisAndFeetRig");
            rigObject.transform.SetParent(character.transform, false);
            var rig = rigObject.AddComponent<Rig>();
            var pelvisConstraint = CreatePelvisConstraint(rigObject.transform, bones["Hips"], pelvisTarget);
            var leftIk = CreateFootIk(rigObject.transform, "LeftFootIK", bones["UpperLeg.L"], bones["LowerLeg.L"], bones["Foot.L"], leftFootTarget, leftHint);
            var rightIk = CreateFootIk(rigObject.transform, "RightFootIK", bones["UpperLeg.R"], bones["LowerLeg.R"], bones["Foot.R"], rightFootTarget, rightHint);
            rigBuilder.layers.Add(new RigLayer(rig));
            var sitController = character.AddComponent<SeatSitController>();
            sitController.Configure(seatAnchor, pelvisConstraint, leftIk, rightIk);

            var cameraObject = new GameObject("A3_SeatAuditCamera");
            var camera = cameraObject.AddComponent<Camera>();
            camera.fieldOfView = 36f;
            camera.transform.position = pelvisTarget.position + facingDirection * 4.2f - side * 2.6f + Vector3.up * 1.55f;
            camera.transform.LookAt(pelvisTarget.position + Vector3.up * 0.1f);
            foreach (var otherCamera in UnityEngine.Object.FindObjectsByType<Camera>(FindObjectsInactive.Include, FindObjectsSortMode.None))
                if (otherCamera != camera) otherCamera.enabled = false;

            var validator = character.AddComponent<AnimationA3PlayModeValidator>();
            validator.Configure(sitController, camera);
            EditorUtility.SetDirty(character);
            EditorUtility.SetDirty(chair.gameObject);
            if (!EditorSceneManager.SaveScene(scene, CandidateScene)) throw new InvalidOperationException("A3 candidate save failed.");
            Debug.Log($"[AnimationA3] CONTRACT approach={approachRoot.position:R} seatedRoot={seatedRoot.position:R} facing={facingDirection:R} seatHeight={physicalSeatHeight:R} pelvis={pelvisTarget.position:R} leftFoot={leftFootTarget.position:R} rightFoot={rightFootTarget.position:R} ground={groundHeight:R} entryDistance={Vector3.Distance(approachRoot.position, seatedRoot.position):R}");
            EditorApplication.delayCall += () => EditorApplication.isPlaying = true;
        }

        public static void AuditChairGeometry()
        {
            var scene = EditorSceneManager.OpenScene(OfficeScene, OpenSceneMode.Single);
            foreach (var transform in scene.GetRootGameObjects().SelectMany(root => root.GetComponentsInChildren<Transform>(true)))
            {
                if (!transform.name.Contains("Chair", StringComparison.OrdinalIgnoreCase) &&
                    !transform.name.Contains("Runtime_Chairs", StringComparison.OrdinalIgnoreCase) &&
                    !transform.name.Contains("MingDesk", StringComparison.OrdinalIgnoreCase)) continue;
                var renderers = transform.GetComponentsInChildren<Renderer>(true);
                var bounds = renderers.Length == 0 ? new Bounds(transform.position, Vector3.zero) : renderers.Select(renderer => renderer.bounds).Aggregate((a, b) => { a.Encapsulate(b); return a; });
                Debug.Log($"[AnimationA3] OBJECT path={Path(transform)} position={transform.position:R} rotation={transform.rotation.eulerAngles:R} scale={transform.lossyScale:R} renderers={renderers.Length} boundsCenter={bounds.center:R} boundsSize={bounds.size:R}");
            }
        }

        private static string Path(Transform transform)
        {
            var names = new System.Collections.Generic.List<string>();
            while (transform != null)
            {
                names.Add(transform.name);
                transform = transform.parent;
            }
            names.Reverse();
            return string.Join("/", names);
        }

        private static Transform Find(string name) => UnityEngine.Object.FindObjectsByType<Transform>(FindObjectsInactive.Include, FindObjectsSortMode.None)
            .Single(transform => transform.name == name);

        private static Transform NewAnchor(string name, Transform parent, Vector3 position, Quaternion rotation)
        {
            var anchor = new GameObject(name).transform;
            anchor.SetParent(parent, true);
            anchor.SetPositionAndRotation(position, rotation);
            return anchor;
        }

        private static MultiPositionConstraint CreatePelvisConstraint(Transform parent, Transform hips, Transform target)
        {
            var component = new GameObject("PelvisAlignment").AddComponent<MultiPositionConstraint>();
            component.transform.SetParent(parent, false);
            var sources = new WeightedTransformArray(1);
            sources[0] = new WeightedTransform(target, 1f);
            component.data = new MultiPositionConstraintData
            {
                constrainedObject = hips,
                sourceObjects = sources,
                maintainOffset = false,
                offset = Vector3.zero,
                constrainedXAxis = true,
                constrainedYAxis = true,
                constrainedZAxis = true,
            };
            component.weight = 0f;
            return component;
        }

        private static TwoBoneIKConstraint CreateFootIk(Transform parent, string name, Transform upperLeg, Transform lowerLeg, Transform foot, Transform target, Transform hint)
        {
            var component = new GameObject(name).AddComponent<TwoBoneIKConstraint>();
            component.transform.SetParent(parent, false);
            component.data = new TwoBoneIKConstraintData
            {
                root = upperLeg,
                mid = lowerLeg,
                tip = foot,
                target = target,
                hint = hint,
                targetPositionWeight = 1f,
                targetRotationWeight = 0f,
                hintWeight = 0.65f,
                maintainTargetPositionOffset = false,
                maintainTargetRotationOffset = true,
            };
            component.weight = 0f;
            return component;
        }
    }
}
#endif
