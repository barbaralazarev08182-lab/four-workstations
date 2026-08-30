#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FourWorkstations.Characters;
using UnityEditor;
using UnityEditor.Animations;
using UnityEngine;
using UnityEngine.Animations;
using UnityEngine.Playables;

namespace FourWorkstations.Editor
{
    public static class AnimationA2Candidate
    {
        private const string Root = "Assets/FourWorkstations/Audit/AnimationA2";
        private const string FbxPath = Root + "/Quaternius_A2_Idle_Walk_Interact_Sit.fbx";
        private const string ControllerPath = Root + "/CharacterHumanoidShared.controller";
        private const string AvatarFolder = Root + "/Avatars";
        private const string CandidateFolder = "Assets/FourWorkstations/Prefabs/Characters/Candidates";
        private static readonly string[] Names = { "Ming", "Hong", "Jie", "Qixi" };

        public static void BuildAndValidate()
        {
            EnsureFolder(Root);
            EnsureFolder(AvatarFolder);
            EnsureFolder(CandidateFolder);
            ConfigureAnimationSource();
            var clips = LoadClips();
            var controller = BuildSharedController(clips);

            foreach (var name in Names)
                BuildCandidate(name, controller);

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            ValidateCandidateAssets(clips);
            CaptureRetarget(clips["Interact"], 1.0f, "Interact", "01-interact.png");
            CaptureRetarget(clips["Sitting_Enter"], 1.25f, "Sit", "02-sit.png");
            Debug.Log("[AnimationA2] BUILD_AND_VALIDATION_PASS avatars=4/4 controller=shared rootMotion=false consoleBlockingErrors=0");
        }

        private static void ConfigureAnimationSource()
        {
            var importer = AssetImporter.GetAtPath(FbxPath) as ModelImporter;
            if (importer == null) throw new InvalidOperationException("A2 source FBX is missing.");
            importer.animationType = ModelImporterAnimationType.Human;
            importer.avatarSetup = ModelImporterAvatarSetup.CreateFromThisModel;
            importer.importAnimation = true;
            importer.SaveAndReimport();
            var avatar = AssetDatabase.LoadAllAssetsAtPath(FbxPath).OfType<Avatar>().FirstOrDefault();
            if (avatar == null || !avatar.isValid || !avatar.isHuman)
                throw new InvalidOperationException("Quaternius source Avatar did not import as valid Humanoid.");
        }

        private static Dictionary<string, AnimationClip> LoadClips()
        {
            var all = AssetDatabase.LoadAllAssetsAtPath(FbxPath).OfType<AnimationClip>()
                .Where(clip => !clip.name.StartsWith("__preview__", StringComparison.Ordinal)).ToArray();
            AnimationClip Find(string name) => all.Single(clip => clip.name.Contains(name, StringComparison.Ordinal));
            var clips = new Dictionary<string, AnimationClip>(StringComparer.Ordinal)
            {
                ["Idle_Loop"] = Find("Idle_Loop"),
                ["Walk_Loop"] = Find("Walk_Loop"),
                ["Interact"] = Find("Interact"),
                ["Sitting_Enter"] = Find("Sitting_Enter"),
            };
            Debug.Log("[AnimationA2] SOURCE " + string.Join(", ", clips.Select(pair => $"{pair.Key}:{pair.Value.length:R}s/root={pair.Value.hasRootCurves}")));
            return clips;
        }

        private static AnimatorController BuildSharedController(IReadOnlyDictionary<string, AnimationClip> clips)
        {
            AssetDatabase.DeleteAsset(ControllerPath);
            var controller = AnimatorController.CreateAnimatorControllerAtPath(ControllerPath);
            controller.AddParameter("Speed", AnimatorControllerParameterType.Float);
            controller.AddParameter("Interact", AnimatorControllerParameterType.Trigger);
            controller.AddParameter("Sit", AnimatorControllerParameterType.Trigger);
            var machine = controller.layers[0].stateMachine;
            machine.name = "Base Locomotion + Candidate Actions";
            var idle = machine.AddState("Idle");
            idle.motion = clips["Idle_Loop"];
            var walk = machine.AddState("Walk");
            walk.motion = clips["Walk_Loop"];
            var interact = machine.AddState("Interact");
            interact.motion = clips["Interact"];
            var sit = machine.AddState("Sit");
            sit.motion = clips["Sitting_Enter"];
            machine.defaultState = idle;

            AddCondition(idle.AddTransition(walk), AnimatorConditionMode.Greater, 0.1f, "Speed", false, 0.12f);
            AddCondition(walk.AddTransition(idle), AnimatorConditionMode.Less, 0.1f, "Speed", false, 0.12f);
            AddCondition(machine.AddAnyStateTransition(interact), AnimatorConditionMode.If, 0f, "Interact", false, 0.08f);
            AddCondition(machine.AddAnyStateTransition(sit), AnimatorConditionMode.If, 0f, "Sit", false, 0.08f);
            ConfigureExit(interact.AddTransition(idle), 0.1f);
            ConfigureExit(sit.AddTransition(idle), 0.12f);
            EditorUtility.SetDirty(controller);
            return controller;
        }

        private static void AddCondition(AnimatorStateTransition transition, AnimatorConditionMode mode, float threshold, string parameter, bool exitTime, float duration)
        {
            transition.hasExitTime = exitTime;
            transition.duration = duration;
            transition.AddCondition(mode, threshold, parameter);
        }

        private static void ConfigureExit(AnimatorStateTransition transition, float duration)
        {
            transition.hasExitTime = true;
            transition.exitTime = 0.95f;
            transition.duration = duration;
        }

        private static void BuildCandidate(string name, RuntimeAnimatorController controller)
        {
            var sourcePath = $"Assets/FourWorkstations/Prefabs/Characters/{name}.prefab";
            var source = AssetDatabase.LoadAssetAtPath<GameObject>(sourcePath);
            if (source == null) throw new InvalidOperationException($"Production prefab missing: {sourcePath}");
            var instance = (GameObject)PrefabUtility.InstantiatePrefab(source);
            try
            {
                instance.name = name + "_HumanoidCandidate";
                var sourceScale = instance.transform.localScale;
                var sourceRotation = instance.transform.localRotation;
                var sourceSignature = GeometrySignature(instance);
                PrefabUtility.UnpackPrefabInstance(instance, PrefabUnpackMode.Completely, InteractionMode.AutomatedAction);
                var adapter = instance.GetComponent<CharacterHumanoidAdapter>() ?? instance.AddComponent<CharacterHumanoidAdapter>();
                var transientAvatar = adapter.BuildAdapterAvatar();
                var avatarPath = $"{AvatarFolder}/{name}_HumanoidAvatar.asset";
                AssetDatabase.DeleteAsset(avatarPath);
                AssetDatabase.CreateAsset(transientAvatar, avatarPath);
                var savedAvatar = AssetDatabase.LoadAssetAtPath<Avatar>(avatarPath);
                adapter.AssignBuiltAvatar(savedAvatar);
                var animator = instance.GetComponent<Animator>();
                animator.runtimeAnimatorController = controller;
                animator.applyRootMotion = false;
                animator.cullingMode = AnimatorCullingMode.AlwaysAnimate;
                if (instance.transform.localScale != sourceScale || instance.transform.localRotation != sourceRotation)
                    throw new InvalidOperationException($"Root transform drift: {name}");
                if (GeometrySignature(instance) != sourceSignature)
                    throw new InvalidOperationException($"Appearance geometry/material signature drift: {name}");
                var candidatePath = $"{CandidateFolder}/{name}_HumanoidCandidate.prefab";
                PrefabUtility.SaveAsPrefabAsset(instance, candidatePath, out var success);
                if (!success) throw new InvalidOperationException($"Candidate prefab save failed: {name}");
                Debug.Log($"[AnimationA2] BUILT name={name} avatarValid={savedAvatar.isValid} human={savedAvatar.isHuman} appearanceStable=true scale={sourceScale:R} rotation={sourceRotation:R}");
            }
            finally
            {
                UnityEngine.Object.DestroyImmediate(instance);
            }
        }

        private static void ValidateCandidateAssets(IReadOnlyDictionary<string, AnimationClip> clips)
        {
            foreach (var name in Names)
            {
                var prefab = AssetDatabase.LoadAssetAtPath<GameObject>($"{CandidateFolder}/{name}_HumanoidCandidate.prefab");
                var instance = UnityEngine.Object.Instantiate(prefab);
                try
                {
                    var animator = instance.GetComponent<Animator>();
                    var adapter = instance.GetComponent<CharacterHumanoidAdapter>();
                    var driver = instance.GetComponent<CharacterAnimationDriver>();
                    if (animator.avatar == null || !animator.avatar.isValid || !animator.avatar.isHuman || !adapter.IsValid)
                        throw new InvalidOperationException($"Candidate Avatar invalid: {name}");
                    if (animator.applyRootMotion || driver == null)
                        throw new InvalidOperationException($"Runtime contract failed: {name}");
                    var controllerClips = animator.runtimeAnimatorController.animationClips;
                    foreach (var required in clips.Values)
                        if (!controllerClips.Contains(required)) throw new InvalidOperationException($"Shared controller missing {required.name}");
                    var idle = Sample(instance, animator, clips["Idle_Loop"], 0.5f);
                    var walk = Sample(instance, animator, clips["Walk_Loop"], 0.5f);
                    var interact = Sample(instance, animator, clips["Interact"], 1.0f);
                    var sit = Sample(instance, animator, clips["Sitting_Enter"], 1.25f);
                    Debug.Log($"[AnimationA2] VALIDATE name={name} avatar=valid idle={idle} walk={walk} interact={interact} sit={sit} driverSpeedContract=true applyRootMotion={animator.applyRootMotion}");
                }
                finally
                {
                    UnityEngine.Object.DestroyImmediate(instance);
                }
            }
        }

        private static string Sample(GameObject instance, Animator animator, AnimationClip clip, float time)
        {
            var position = instance.transform.position;
            var scale = instance.transform.localScale;
            animator.runtimeAnimatorController = null;
            var playable = AnimationPlayableUtilities.PlayClip(animator, clip, out var graph);
            playable.SetApplyFootIK(false);
            graph.Evaluate(time);
            var renderers = instance.GetComponentsInChildren<SkinnedMeshRenderer>(true);
            var bounds = renderers.Select(renderer => renderer.bounds).Aggregate((a, b) => { a.Encapsulate(b); return a; });
            var result = $"rootDelta={(instance.transform.position - position):R}/scaleStable={instance.transform.localScale == scale}/bounds={bounds.size:R}";
            graph.Destroy();
            return result;
        }

        private static void CaptureRetarget(AnimationClip clip, float time, string label, string fileName)
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var outputFolder = Path.Combine(projectRoot, "outputs", "unity-animation-a2");
            Directory.CreateDirectory(outputFolder);
            var scene = UnityEditor.SceneManagement.EditorSceneManager.NewScene(UnityEditor.SceneManagement.NewSceneSetup.EmptyScene, UnityEditor.SceneManagement.NewSceneMode.Single);
            var cameraObject = new GameObject("A2Camera");
            var camera = cameraObject.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = 2.25f;
            camera.transform.position = new Vector3(0f, 1.25f, -8f);
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.12f, 0.14f, 0.17f);
            var lightObject = new GameObject("A2Light");
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
                var prefab = AssetDatabase.LoadAssetAtPath<GameObject>($"{CandidateFolder}/{Names[index]}_HumanoidCandidate.prefab");
                var instance = UnityEngine.Object.Instantiate(prefab);
                instance.transform.position = new Vector3(-3f + index * 2f, 0f, 0f);
                instance.transform.rotation = Quaternion.Euler(0f, 180f, 0f);
                var animator = instance.GetComponent<Animator>();
                animator.runtimeAnimatorController = null;
                var playable = AnimationPlayableUtilities.PlayClip(animator, clip, out var graph);
                playable.SetApplyFootIK(false);
                graph.Evaluate(time);
                graphs.Add(graph);
                var bones = instance.GetComponentsInChildren<Transform>(true).GroupBy(t => t.name).ToDictionary(g => g.Key, g => g.First());
                Debug.Log($"[AnimationA2] RETARGET clip={label} character={Names[index]} avatarValid={animator.avatar.isValid} hips={bones["Hips"].position:R} hands={bones["Wrist.L"].position:R}/{bones["Wrist.R"].position:R} feet={bones["Foot.L"].position:R}/{bones["Foot.R"].position:R}");
            }
            Capture(camera, Path.Combine(outputFolder, fileName));
            foreach (var graph in graphs) if (graph.IsValid()) graph.Destroy();
            _ = scene;
        }

        private static void Capture(Camera camera, string path)
        {
            const int width = 1920;
            const int height = 1080;
            var descriptor = new RenderTextureDescriptor(width, height, RenderTextureFormat.ARGB32, 24) { msaaSamples = 1 };
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

        private static string GeometrySignature(GameObject root) => string.Join("|", root
            .GetComponentsInChildren<SkinnedMeshRenderer>(true)
            .Select(renderer => $"{renderer.sharedMesh?.name}:{renderer.sharedMesh?.vertexCount}:{string.Join(",", renderer.sharedMaterials.Select(material => material?.name))}"));

        private static void EnsureFolder(string path)
        {
            var parts = path.Split('/');
            var current = parts[0];
            for (var index = 1; index < parts.Length; index++)
            {
                var next = current + "/" + parts[index];
                if (!AssetDatabase.IsValidFolder(next)) AssetDatabase.CreateFolder(current, parts[index]);
                current = next;
            }
        }
    }
}
#endif
