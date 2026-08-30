#if UNITY_EDITOR
using System;
using System.Linq;
using FourWorkstations.Characters;
using UnityEditor;
using UnityEditor.Animations;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Animations.Rigging;
using UnityEngine.SceneManagement;

namespace FourWorkstations.Editor
{
    public static class AnimationA35SeatedCandidate
    {
        private const string SourceScene = "Assets/FourWorkstations/Scenes/Candidates/AnimationA3Seat.unity";
        private const string CandidateScene = "Assets/FourWorkstations/Scenes/Candidates/AnimationA35SeatedSelection.unity";
        private const string Fbx = "Assets/FourWorkstations/Audit/AnimationA35/Quaternius_A35_Seated_Shortlist.fbx";
        private const string ControllerPath = "Assets/FourWorkstations/Audit/AnimationA35/AnimationA35SeatedShortlist.controller";

        public static void BuildAndEnterPlayMode()
        {
            ConfigureImporter();
            var controller = BuildController();
            var scene = EditorSceneManager.OpenScene(SourceScene, OpenSceneMode.Single);
            var character = UnityEngine.Object.FindFirstObjectByType<SeatSitController>(FindObjectsInactive.Include).gameObject;
            var seatController = character.GetComponent<SeatSitController>();
            seatController.enabled = false;
            var oldValidator = character.GetComponent<AnimationA3PlayModeValidator>();
            if (oldValidator != null) UnityEngine.Object.DestroyImmediate(oldValidator);
            var anchor = seatController.Anchor;
            character.transform.SetPositionAndRotation(anchor.SeatedRoot.position, anchor.Facing.rotation);
            var animator = character.GetComponent<Animator>();
            animator.runtimeAnimatorController = controller;
            animator.applyRootMotion = false;
            var pelvis = character.GetComponentInChildren<MultiPositionConstraint>(true);
            var feet = character.GetComponentsInChildren<TwoBoneIKConstraint>(true);
            if (feet.Length != 2) throw new InvalidOperationException("Expected two existing A3 foot IK constraints.");
            pelvis.weight = 1f;
            feet[0].weight = 1f;
            feet[1].weight = 1f;
            var left = feet.Single(item => item.name.Contains("Left", StringComparison.Ordinal));
            var right = feet.Single(item => item.name.Contains("Right", StringComparison.Ordinal));
            var camera = UnityEngine.Object.FindObjectsByType<Camera>(FindObjectsInactive.Include, FindObjectsSortMode.None).Single(item => item.name == "A3_SeatAuditCamera");
            var validator = character.AddComponent<AnimationA35SeatedValidator>();
            validator.Configure(animator, anchor, camera, pelvis, left, right);
            if (!EditorSceneManager.SaveScene(scene, CandidateScene)) throw new InvalidOperationException("A3.5 candidate scene save failed.");
            Debug.Log("[AnimationA35] CANDIDATE sameSeatAnchor=D2 sameMing=true pelvisAndFootIKUnchanged=true");
            EditorApplication.delayCall += () => EditorApplication.isPlaying = true;
        }

        private static void ConfigureImporter()
        {
            var importer = AssetImporter.GetAtPath(Fbx) as ModelImporter;
            if (importer == null) throw new InvalidOperationException("A3.5 FBX importer missing.");
            importer.animationType = ModelImporterAnimationType.Human;
            importer.avatarSetup = ModelImporterAvatarSetup.CreateFromThisModel;
            importer.importAnimation = true;
            importer.SaveAndReimport();
            var clips = importer.defaultClipAnimations;
            foreach (var clip in clips)
                clip.loopTime = clip.name.Contains("Loop", StringComparison.Ordinal);
            importer.clipAnimations = clips;
            importer.SaveAndReimport();
            var avatar = AssetDatabase.LoadAllAssetsAtPath(Fbx).OfType<Avatar>().FirstOrDefault();
            if (avatar == null || !avatar.isValid || !avatar.isHuman) throw new InvalidOperationException("A3.5 source Avatar invalid.");
        }

        private static AnimatorController BuildController()
        {
            AssetDatabase.DeleteAsset(ControllerPath);
            var controller = AnimatorController.CreateAnimatorControllerAtPath(ControllerPath);
            var machine = controller.layers[0].stateMachine;
            var clips = AssetDatabase.LoadAllAssetsAtPath(Fbx).OfType<AnimationClip>()
                .Where(clip => !clip.name.StartsWith("__preview__", StringComparison.Ordinal)).ToArray();
            AddState("Enter", "Sitting_Enter");
            AddState("IdleLoop", "Sitting_Idle_Loop");
            AddState("TalkingLoop", "Sitting_Talking_Loop");
            return controller;

            void AddState(string stateName, string clipName)
            {
                var state = machine.AddState(stateName);
                state.motion = clips.Single(clip => clip.name.Contains(clipName, StringComparison.Ordinal));
                if (stateName == "Enter") machine.defaultState = state;
            }
        }
    }
}
#endif
