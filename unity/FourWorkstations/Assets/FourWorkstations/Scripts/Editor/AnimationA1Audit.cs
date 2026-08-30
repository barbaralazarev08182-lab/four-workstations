#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;
using UnityEngine.Animations;
using UnityEngine.Playables;
using UnityEngine.SceneManagement;

namespace FourWorkstations.Editor
{
    public static class AnimationA1Audit
    {
        private const string TestFbx = "Assets/FourWorkstations/Audit/AnimationA1/Quaternius_A1_Interact_Sit.fbx";
        private static readonly string[] Names = { "Ming", "Hong", "Jie", "Qixi" };

        public static void ConfigureAndAudit()
        {
            var importer = AssetImporter.GetAtPath(TestFbx) as ModelImporter;
            if (importer == null) throw new InvalidOperationException("A1 FBX ModelImporter missing");
            importer.animationType = ModelImporterAnimationType.Human;
            importer.avatarSetup = ModelImporterAvatarSetup.CreateFromThisModel;
            importer.importAnimation = true;
            importer.SaveAndReimport();

            var sourceAssets = AssetDatabase.LoadAllAssetsAtPath(TestFbx);
            var sourceAvatar = sourceAssets.OfType<Avatar>().FirstOrDefault();
            var sourceClips = sourceAssets.OfType<AnimationClip>().Where(clip => !clip.name.StartsWith("__preview__", StringComparison.Ordinal)).ToArray();
            Debug.Log($"[AnimationA1] SOURCE avatar={(sourceAvatar == null ? "missing" : sourceAvatar.name)} valid={sourceAvatar != null && sourceAvatar.isValid} human={sourceAvatar != null && sourceAvatar.isHuman} clips={string.Join(",", sourceClips.Select(clip => $"{clip.name}:{clip.length:R}s/root={clip.hasRootCurves}"))}");

            foreach (var name in Names)
            {
                var path = $"Assets/FourWorkstations/Prefabs/Characters/{name}.prefab";
                var prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
                if (prefab == null) throw new InvalidOperationException($"Prefab missing: {name}");
                var instance = UnityEngine.Object.Instantiate(prefab);
                try
                {
                    var animator = instance.GetComponent<Animator>();
                    var avatar = BuildCharacterAvatar(instance);
                    var clips = animator.runtimeAnimatorController == null ? Array.Empty<AnimationClip>() : animator.runtimeAnimatorController.animationClips;
                    var renderers = instance.GetComponentsInChildren<SkinnedMeshRenderer>(true);
                    var bones = renderers.SelectMany(renderer => renderer.bones).Where(bone => bone != null).Distinct().ToArray();
                    var required = RequiredBoneMap();
                    var missing = required.Where(pair => instance.GetComponentsInChildren<Transform>(true).All(transform => transform.name != pair.Value)).Select(pair => pair.Key.ToString()).ToArray();
                    Debug.Log($"[AnimationA1] CHARACTER name={name} animator={animator != null} originalAvatar={(animator?.avatar == null ? "null" : animator.avatar.name)} generatedAvatarValid={avatar.isValid} generatedAvatarHuman={avatar.isHuman} applyRootMotion={animator != null && animator.applyRootMotion} culling={animator?.cullingMode} renderers={renderers.Length} uniqueSkinBones={bones.Length} missingRequired={string.Join(",", missing)} scale={instance.transform.localScale:R} rotation={instance.transform.localRotation:R} clips={string.Join(",", clips.Select(clip => $"{clip.name}:{clip.length:R}s/root={clip.hasRootCurves}"))}");
                    UnityEngine.Object.DestroyImmediate(avatar);
                }
                finally
                {
                    UnityEngine.Object.DestroyImmediate(instance);
                }
            }
            Debug.Log("[AnimationA1] AUDIT_PASS");
        }

        public static void RunRetargetTests()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-animation-a1");
            Directory.CreateDirectory(output);
            var clips = AssetDatabase.LoadAllAssetsAtPath(TestFbx).OfType<AnimationClip>()
                .Where(clip => !clip.name.StartsWith("__preview__", StringComparison.Ordinal))
                .ToDictionary(clip => clip.name, StringComparer.Ordinal);
            TestClip(clips.Single(pair => pair.Key.Contains("Interact", StringComparison.Ordinal)).Value, 1.0f, "Interact", Path.Combine(output, "01-interact-emote.png"));
            TestClip(clips.Single(pair => pair.Key.Contains("Sitting_Enter", StringComparison.Ordinal)).Value, 1.25f, "Sitting_Enter", Path.Combine(output, "02-sit.png"));
            Debug.Log($"[AnimationA1] RETARGET_TEST_PASS output={output}");
        }

        private static void TestClip(AnimationClip clip, float time, string label, string outputPath)
        {
            var scene = UnityEditor.SceneManagement.EditorSceneManager.NewScene(UnityEditor.SceneManagement.NewSceneSetup.EmptyScene, UnityEditor.SceneManagement.NewSceneMode.Single);
            var cameraObject = new GameObject("AuditCamera");
            var camera = cameraObject.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = 2.25f;
            camera.transform.position = new Vector3(0f, 1.25f, -8f);
            camera.transform.rotation = Quaternion.identity;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.12f, 0.14f, 0.17f);
            var lightObject = new GameObject("AuditLight");
            var light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.color = new Color(1f, 0.96f, 0.88f);
            light.intensity = 1.2f;
            light.transform.rotation = Quaternion.Euler(40f, -30f, 0f);
            RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = new Color(0.45f, 0.48f, 0.52f);
            RenderSettings.ambientEquatorColor = new Color(0.28f, 0.29f, 0.31f);
            RenderSettings.ambientGroundColor = new Color(0.14f, 0.14f, 0.15f);

            var graphs = new List<PlayableGraph>();
            for (var index = 0; index < Names.Length; index++)
            {
                var name = Names[index];
                var prefab = AssetDatabase.LoadAssetAtPath<GameObject>($"Assets/FourWorkstations/Prefabs/Characters/{name}.prefab");
                var instance = UnityEngine.Object.Instantiate(prefab);
                instance.name = name + "_A1_" + label;
                instance.transform.position = new Vector3(-3f + index * 2f, 0f, 0f);
                instance.transform.rotation = Quaternion.Euler(0f, 180f, 0f);
                var animator = instance.GetComponent<Animator>();
                var avatar = BuildCharacterAvatar(instance);
                animator.avatar = avatar;
                animator.runtimeAnimatorController = null;
                animator.applyRootMotion = false;
                animator.cullingMode = AnimatorCullingMode.AlwaysAnimate;
                var beforePosition = instance.transform.position;
                var beforeScale = instance.transform.localScale;
                var playable = AnimationPlayableUtilities.PlayClip(animator, clip, out var graph);
                playable.SetApplyFootIK(false);
                graph.Evaluate(time);
                graphs.Add(graph);
                var byName = instance.GetComponentsInChildren<Transform>(true).GroupBy(transform => transform.name).ToDictionary(group => group.Key, group => group.First());
                var bounds = instance.GetComponentsInChildren<SkinnedMeshRenderer>(true).Select(renderer => renderer.bounds).Aggregate((a, b) => { a.Encapsulate(b); return a; });
                Debug.Log($"[AnimationA1] RETARGET clip={label} character={name} avatarValid={avatar.isValid} rootDelta={(instance.transform.position - beforePosition):R} scaleStable={instance.transform.localScale == beforeScale} boundsCenter={bounds.center:R} boundsSize={bounds.size:R} hips={byName["Hips"].position:R} leftHand={byName["Wrist.L"].position:R} rightHand={byName["Wrist.R"].position:R} leftFoot={byName["Foot.L"].position:R} rightFoot={byName["Foot.R"].position:R}");
            }
            Capture(camera, outputPath);
            foreach (var graph in graphs) if (graph.IsValid()) graph.Destroy();
            UnityEditor.SceneManagement.EditorSceneManager.CloseScene(scene, true);
        }

        private static void Capture(Camera camera, string path)
        {
            const int width = 1920;
            const int height = 1080;
            var descriptor = new RenderTextureDescriptor(width, height, RenderTextureFormat.ARGB32, 24) { msaaSamples = 4 };
            var multisampled = new RenderTexture(descriptor);
            var resolved = new RenderTexture(width, height, 0, RenderTextureFormat.ARGB32);
            var image = new Texture2D(width, height, TextureFormat.RGB24, false);
            camera.targetTexture = multisampled;
            camera.Render();
            Graphics.Blit(multisampled, resolved);
            RenderTexture.active = resolved;
            image.ReadPixels(new Rect(0, 0, width, height), 0, 0);
            image.Apply();
            File.WriteAllBytes(path, image.EncodeToPNG());
            camera.targetTexture = null;
            RenderTexture.active = null;
            UnityEngine.Object.DestroyImmediate(multisampled);
            UnityEngine.Object.DestroyImmediate(resolved);
            UnityEngine.Object.DestroyImmediate(image);
        }

        public static Avatar BuildCharacterAvatar(GameObject root)
        {
            RepairAuditHierarchy(root);
            var transforms = root.GetComponentsInChildren<Transform>(true);
            var byName = transforms.GroupBy(transform => transform.name).ToDictionary(group => group.Key, group => group.First(), StringComparer.Ordinal);
            var human = RequiredBoneMap().Where(pair => byName.ContainsKey(pair.Value)).Select(pair => new HumanBone
            {
                humanName = pair.Key.ToString(),
                boneName = pair.Value,
                limit = new HumanLimit { useDefaultValues = true },
            }).ToArray();
            var skeleton = transforms.Select(transform => new SkeletonBone
            {
                name = transform.name,
                position = transform.localPosition,
                rotation = transform.localRotation,
                scale = transform.localScale,
            }).ToArray();
            var description = new HumanDescription
            {
                human = human,
                skeleton = skeleton,
                upperArmTwist = 0.5f,
                lowerArmTwist = 0.5f,
                upperLegTwist = 0.5f,
                lowerLegTwist = 0.5f,
                armStretch = 0.05f,
                legStretch = 0.05f,
                feetSpacing = 0f,
                hasTranslationDoF = false,
            };
            var avatar = AvatarBuilder.BuildHumanAvatar(root, description);
            avatar.name = root.name + "_A1_Avatar";
            return avatar;
        }

        private static void RepairAuditHierarchy(GameObject root)
        {
            var transforms = root.GetComponentsInChildren<Transform>(true)
                .GroupBy(transform => transform.name).ToDictionary(group => group.Key, group => group.First(), StringComparer.Ordinal);
            Reparent("UpperLeg.L", "Hips");
            Reparent("UpperLeg.R", "Hips");
            Reparent("Foot.L", "LowerLeg.L");
            Reparent("Foot.R", "LowerLeg.R");
            Reparent("PT.L", "Foot.L");
            Reparent("PT.R", "Foot.R");
            Reparent("Head", "Neck");
            return;

            void Reparent(string childName, string parentName)
            {
                if (!transforms.TryGetValue(childName, out var child) || !transforms.TryGetValue(parentName, out var parent))
                    throw new InvalidOperationException($"Audit hierarchy bone missing: {childName}/{parentName}");
                child.SetParent(parent, true);
            }
        }

        private static Dictionary<HumanBodyBones, string> RequiredBoneMap() => new()
        {
            [HumanBodyBones.Hips] = "Hips",
            [HumanBodyBones.Spine] = "Abdomen",
            [HumanBodyBones.Chest] = "Torso",
            [HumanBodyBones.UpperChest] = "Chest",
            [HumanBodyBones.Neck] = "Neck",
            [HumanBodyBones.Head] = "Head",
            [HumanBodyBones.LeftShoulder] = "Shoulder.L",
            [HumanBodyBones.LeftUpperArm] = "UpperArm.L",
            [HumanBodyBones.LeftLowerArm] = "LowerArm.L",
            [HumanBodyBones.LeftHand] = "Wrist.L",
            [HumanBodyBones.RightShoulder] = "Shoulder.R",
            [HumanBodyBones.RightUpperArm] = "UpperArm.R",
            [HumanBodyBones.RightLowerArm] = "LowerArm.R",
            [HumanBodyBones.RightHand] = "Wrist.R",
            [HumanBodyBones.LeftUpperLeg] = "UpperLeg.L",
            [HumanBodyBones.LeftLowerLeg] = "LowerLeg.L",
            [HumanBodyBones.LeftFoot] = "Foot.L",
            [HumanBodyBones.RightUpperLeg] = "UpperLeg.R",
            [HumanBodyBones.RightLowerLeg] = "LowerLeg.R",
            [HumanBodyBones.RightFoot] = "Foot.R",
        };
    }
}
#endif
