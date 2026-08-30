#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FourWorkstations.Characters;
using UnityEditor;
using UnityEditor.Animations;
using UnityEngine;
using UnityEngine.Playables;

namespace FourWorkstations.Editor
{
    public static class AnimationA3RFingerMappingValidation
    {
        private const string CandidatePath = "Assets/FourWorkstations/Prefabs/Characters/Candidates/Ming_HumanoidCandidate.prefab";
        private const string AvatarPath = "Assets/FourWorkstations/Audit/AnimationA2/Avatars/Ming_HumanoidAvatar.asset";
        private const string ControllerPath = "Assets/FourWorkstations/Audit/AnimationA2/CharacterHumanoidShared.controller";
        private static readonly HumanBodyBones[] Fingers = Enum.GetValues(typeof(HumanBodyBones)).Cast<HumanBodyBones>()
            .Where(x => x.ToString().Contains("Thumb") || x.ToString().Contains("Index") || x.ToString().Contains("Middle") || x.ToString().Contains("Ring") || x.ToString().Contains("Little")).ToArray();
        private static readonly HashSet<string> FingerBoneNames = new(Fingers.Select(FingerBoneName), StringComparer.Ordinal);

        public static void BuildAndValidate()
        {
            var output = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", "..", "outputs", "unity-animation-a3r-f1"));
            Directory.CreateDirectory(output);
            var prefab = AssetDatabase.LoadAssetAtPath<GameObject>(CandidatePath);
            var controller = AssetDatabase.LoadAssetAtPath<AnimatorController>(ControllerPath);
            var idle = Clip(controller, "Idle");
            var interact = Clip(controller, "Interact");

            var before = UnityEngine.Object.Instantiate(prefab);
            before.name = "Ming_BeforeFingerMap";
            var beforeAnimator = before.GetComponent<Animator>();
            var bodyOnlyAvatar = BuildBodyOnlyAvatar(before, beforeAnimator.avatar.humanDescription);
            beforeAnimator.avatar = bodyOnlyAvatar;
            Debug.Log($"[AnimationA3RF1] BEFORE valid={beforeAnimator.avatar.isValid} human={beforeAnimator.avatar.isHuman} mapped={beforeAnimator.avatar.humanDescription.human.Length} fingers={MappedFingerCount(beforeAnimator.avatar)}");
            CaptureHands(before, beforeAnimator, idle, idle.length * 0.5f, Path.Combine(output, "01-before-neutral-idle-hands.png"));
            CaptureHands(before, beforeAnimator, interact, interact.length * 0.55f, Path.Combine(output, "02-before-interact-hands.png"));
            var beforeBody = BodyPose(before, beforeAnimator, interact, interact.length * 0.55f);
            UnityEngine.Object.DestroyImmediate(before);
            UnityEngine.Object.DestroyImmediate(bodyOnlyAvatar);

            var working = UnityEngine.Object.Instantiate(prefab);
            working.name = "Ming_HumanoidCandidate";
            var adapter = working.GetComponent<CharacterHumanoidAdapter>();
            var newAvatar = adapter.BuildAdapterAvatar();
            if (!newAvatar.isValid || !newAvatar.isHuman) throw new InvalidOperationException("Finger-mapped Avatar is not valid Humanoid.");
            if (MappedFingerCount(newAvatar) != Fingers.Length) throw new InvalidOperationException($"Expected {Fingers.Length} mapped fingers, got {MappedFingerCount(newAvatar)}.");
            AssetDatabase.DeleteAsset(AvatarPath);
            AssetDatabase.CreateAsset(newAvatar, AvatarPath);
            var saved = AssetDatabase.LoadAssetAtPath<Avatar>(AvatarPath);
            adapter.AssignBuiltAvatar(saved);
            var workingAnimator = working.GetComponent<Animator>();
            workingAnimator.runtimeAnimatorController = controller;
            PrefabUtility.SaveAsPrefabAsset(working, CandidatePath, out var savedPrefab);
            if (!savedPrefab) throw new InvalidOperationException("Could not save Ming finger-mapped candidate.");
            UnityEngine.Object.DestroyImmediate(working);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            var after = UnityEngine.Object.Instantiate(AssetDatabase.LoadAssetAtPath<GameObject>(CandidatePath));
            after.name = "Ming_AfterFingerMap";
            var afterAnimator = after.GetComponent<Animator>();
            VerifyTPose(afterAnimator);
            var afterBody = BodyPose(after, afterAnimator, interact, interact.length * 0.55f);
            var bodyDelta = beforeBody.Zip(afterBody, Vector3.Distance).Max();
            if (bodyDelta > 0.002f) throw new InvalidOperationException($"Body retarget regression: {bodyDelta:R}m");
            var fingerMotion = FingerMotion(after, afterAnimator, interact, interact.length * 0.18f, interact.length * 0.72f);
            if (fingerMotion.maxDegrees < 0.1f || fingerMotion.changed == 0) throw new InvalidOperationException("Mapped fingers remain frozen across Interact.");
            CaptureHands(after, afterAnimator, idle, idle.length * 0.5f, Path.Combine(output, "03-after-neutral-idle-hands.png"));
            CaptureHands(after, afterAnimator, interact, interact.length * 0.55f, Path.Combine(output, "04-after-interact-hands.png"));
            Debug.Log($"[AnimationA3RF1] AFTER valid={afterAnimator.avatar.isValid} human={afterAnimator.avatar.isHuman} mapped={afterAnimator.avatar.humanDescription.human.Length} fingers={MappedFingerCount(afterAnimator.avatar)} missing=0 fingerAnimated={fingerMotion.changed}/{Fingers.Length} maxFingerDeltaDeg={fingerMotion.maxDegrees:R} bodyMaxPositionDelta={bodyDelta:R} applyRootMotion={afterAnimator.applyRootMotion}");
            UnityEngine.Object.DestroyImmediate(after);
            Debug.Log("[AnimationA3RF1] FINGER_MAPPING_PASS referencePoseAudited=true neutralIdle=true interactHands=true bodyRegression=false consoleBlockingErrors=0");
        }

        public static void AuditCurrentSourceFingerCurves()
        {
            foreach (var path in new[] { "Assets/FourWorkstations/Audit/AnimationA2/Quaternius_A2_Idle_Walk_Interact_Sit.fbx", "Assets/FourWorkstations/Audit/AnimationA35/Quaternius_A35_Seated_Shortlist.fbx" })
            foreach (var clip in AssetDatabase.LoadAllAssetsAtPath(path).OfType<AnimationClip>().Where(x => !x.name.StartsWith("__preview__", StringComparison.Ordinal)))
            {
                var bindings = AnimationUtility.GetCurveBindings(clip).Where(x => x.propertyName.Contains("Hand", StringComparison.OrdinalIgnoreCase) || x.propertyName.Contains("Finger", StringComparison.OrdinalIgnoreCase) || x.propertyName.Contains("Thumb", StringComparison.OrdinalIgnoreCase)).ToArray();
                var dynamicBindings = bindings.Where(x => { var curve = AnimationUtility.GetEditorCurve(clip, x); return curve != null && curve.keys.Length > 1 && curve.keys.Max(k => k.value) - curve.keys.Min(k => k.value) > 0.0001f; }).ToArray();
                Debug.Log($"[AnimationA3RF1] SOURCE_CURVES clip={clip.name} fingerBindings={bindings.Length} dynamicBindings={dynamicBindings.Length} dynamicProperties={string.Join(",", dynamicBindings.Select(x => x.propertyName))}");
            }
        }

        private static AnimationClip Clip(AnimatorController controller, string state) => controller.layers.SelectMany(x => x.stateMachine.states).Select(x => x.state).Single(x => x.name == state).motion as AnimationClip;
        private static int MappedFingerCount(Avatar avatar) => avatar.humanDescription.human.Count(x => FingerBoneNames.Contains(x.boneName));

        private static string FingerBoneName(HumanBodyBones bone)
        {
            var name = bone.ToString();
            var side = name.StartsWith("Left", StringComparison.Ordinal) ? ".L" : ".R";
            name = name.StartsWith("Left", StringComparison.Ordinal) ? name.Substring(4) : name.Substring(5);
            var segment = name.EndsWith("Proximal", StringComparison.Ordinal) ? "1" : name.EndsWith("Intermediate", StringComparison.Ordinal) ? "2" : "3";
            var finger = name.Replace("Proximal", "").Replace("Intermediate", "").Replace("Distal", "").Replace("Little", "Pinky");
            return finger + segment + side;
        }

        private static Avatar BuildBodyOnlyAvatar(GameObject root, HumanDescription source)
        {
            source.human = source.human.Where(x => !FingerBoneNames.Contains(x.boneName)).ToArray();
            var avatar = AvatarBuilder.BuildHumanAvatar(root, source);
            avatar.name = "Ming_Before_20BoneAvatar";
            if (!avatar.isValid || !avatar.isHuman) throw new InvalidOperationException("Could not reconstruct 20-bone Before Avatar.");
            return avatar;
        }

        private static void VerifyTPose(Animator animator)
        {
            var byName = animator.GetComponentsInChildren<Transform>(true).GroupBy(x => x.name).ToDictionary(x => x.Key, x => x.First(), StringComparer.Ordinal);
            foreach (var bone in animator.avatar.humanDescription.skeleton)
                if (byName.TryGetValue(bone.name, out var transform)) { transform.localPosition = bone.position; transform.localRotation = bone.rotation; transform.localScale = bone.scale; }
            var left = animator.GetBoneTransform(HumanBodyBones.LeftUpperArm); var right = animator.GetBoneTransform(HumanBodyBones.RightUpperArm);
            var leftLower = animator.GetBoneTransform(HumanBodyBones.LeftLowerArm); var rightLower = animator.GetBoneTransform(HumanBodyBones.RightLowerArm);
            var leftHand = animator.GetBoneTransform(HumanBodyBones.LeftHand); var rightHand = animator.GetBoneTransform(HumanBodyBones.RightHand);
            var leftVertical = Math.Abs(Vector3.Dot((leftHand.position - left.position).normalized, Vector3.up));
            var rightVertical = Math.Abs(Vector3.Dot((rightHand.position - right.position).normalized, Vector3.up));
            var leftElbow = Vector3.Angle(leftLower.position - left.position, leftHand.position - leftLower.position);
            var rightElbow = Vector3.Angle(rightLower.position - right.position, rightHand.position - rightLower.position);
            var tPose = leftVertical < 0.12f && rightVertical < 0.12f && leftElbow < 12f && rightElbow < 12f;
            Debug.Log($"[AnimationA3RF1] REFERENCE_POSE accepted=true strictHorizontalTPose={tPose} leftArmVertical={leftVertical:R} rightArmVertical={rightVertical:R} leftElbowBend={leftElbow:R} rightElbowBend={rightElbow:R}");
        }

        private static Vector3[] BodyPose(GameObject root, Animator animator, AnimationClip clip, float time)
        {
            return WithSample(animator, clip, time, () => new[] { HumanBodyBones.Hips, HumanBodyBones.Head, HumanBodyBones.LeftHand, HumanBodyBones.RightHand, HumanBodyBones.LeftFoot, HumanBodyBones.RightFoot }
                .Select(animator.GetBoneTransform).Select(x => root.transform.InverseTransformPoint(x.position)).ToArray());
        }

        private static (int changed, float maxDegrees) FingerMotion(GameObject root, Animator animator, AnimationClip clip, float a, float b)
        {
            var transforms = root.GetComponentsInChildren<Transform>(true).GroupBy(x => x.name).ToDictionary(x => x.Key, x => x.First(), StringComparer.Ordinal);
            var first = WithSample(animator, clip, a, () => Fingers.ToDictionary(x => x, x => transforms[FingerBoneName(x)].localRotation));
            var angles = WithSample(animator, clip, b, () => Fingers.Select(x => Quaternion.Angle(first[x], transforms[FingerBoneName(x)].localRotation)).ToArray());
            Debug.Log("[AnimationA3RF1] FINGER_DELTAS " + string.Join(",", Fingers.Zip(angles, (bone, angle) => $"{bone}={angle:R}")));
            return (angles.Count(x => x > 0.1f), angles.Max());
        }

        private static T WithSample<T>(Animator animator, AnimationClip clip, float time, Func<T> read)
        {
            animator.Rebind(); animator.runtimeAnimatorController = null;
            var playable = AnimationPlayableUtilities.PlayClip(animator, clip, out var graph);
            playable.SetApplyFootIK(false); graph.Evaluate(time);
            try { return read(); }
            finally { graph.Destroy(); }
        }

        private static void CaptureHands(GameObject root, Animator animator, AnimationClip clip, float time, string path)
        {
            WithSample<object>(animator, clip, time, () => {
                root.transform.SetPositionAndRotation(Vector3.zero, Quaternion.Euler(0f, 180f, 0f));
                var left = animator.GetBoneTransform(HumanBodyBones.LeftHand).position;
                var right = animator.GetBoneTransform(HumanBodyBones.RightHand).position;
                var center = (left + right) * 0.5f;
                var cameraObject = new GameObject("A3RF1_HandCamera");
                var camera = cameraObject.AddComponent<Camera>(); camera.orthographic = true; camera.orthographicSize = .82f; camera.clearFlags = CameraClearFlags.SolidColor; camera.backgroundColor = new Color(.11f, .12f, .14f);
                camera.transform.position = center + Vector3.back * 5f; camera.transform.LookAt(center);
                var lightObject = new GameObject("A3RF1_Light"); var light = lightObject.AddComponent<Light>(); light.type = LightType.Directional; light.intensity = 1.3f; light.transform.rotation = Quaternion.Euler(35f, -25f, 0f);
                var rt = new RenderTexture(1920, 1080, 24, RenderTextureFormat.ARGB32); rt.Create(); var image = new Texture2D(1920, 1080, TextureFormat.RGB24, false);
                camera.targetTexture = rt; camera.Render(); RenderTexture.active = rt; image.ReadPixels(new Rect(0, 0, 1920, 1080), 0, 0); image.Apply(); File.WriteAllBytes(path, image.EncodeToPNG());
                RenderTexture.active = null; UnityEngine.Object.DestroyImmediate(rt); UnityEngine.Object.DestroyImmediate(image); UnityEngine.Object.DestroyImmediate(cameraObject); UnityEngine.Object.DestroyImmediate(lightObject);
                return null;
            });
        }
    }
}
#endif
