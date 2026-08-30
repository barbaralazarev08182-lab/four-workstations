using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace FourWorkstations.Characters
{
    [DefaultExecutionOrder(-1000)]
    [RequireComponent(typeof(Animator))]
    public sealed class CharacterHumanoidAdapter : MonoBehaviour
    {
        private static readonly (string Child, string Parent)[] HierarchyRules =
        {
            ("UpperLeg.L", "Hips"),
            ("UpperLeg.R", "Hips"),
            ("Foot.L", "LowerLeg.L"),
            ("Foot.R", "LowerLeg.R"),
            ("PT.L", "Foot.L"),
            ("PT.R", "Foot.R"),
            ("Head", "Neck"),
        };

        private static readonly Dictionary<HumanBodyBones, string> HumanBoneMap = new()
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
            [HumanBodyBones.LeftThumbProximal] = "Thumb1.L",
            [HumanBodyBones.LeftThumbIntermediate] = "Thumb2.L",
            [HumanBodyBones.LeftThumbDistal] = "Thumb3.L",
            [HumanBodyBones.LeftIndexProximal] = "Index1.L",
            [HumanBodyBones.LeftIndexIntermediate] = "Index2.L",
            [HumanBodyBones.LeftIndexDistal] = "Index3.L",
            [HumanBodyBones.LeftMiddleProximal] = "Middle1.L",
            [HumanBodyBones.LeftMiddleIntermediate] = "Middle2.L",
            [HumanBodyBones.LeftMiddleDistal] = "Middle3.L",
            [HumanBodyBones.LeftRingProximal] = "Ring1.L",
            [HumanBodyBones.LeftRingIntermediate] = "Ring2.L",
            [HumanBodyBones.LeftRingDistal] = "Ring3.L",
            [HumanBodyBones.LeftLittleProximal] = "Pinky1.L",
            [HumanBodyBones.LeftLittleIntermediate] = "Pinky2.L",
            [HumanBodyBones.LeftLittleDistal] = "Pinky3.L",
            [HumanBodyBones.RightThumbProximal] = "Thumb1.R",
            [HumanBodyBones.RightThumbIntermediate] = "Thumb2.R",
            [HumanBodyBones.RightThumbDistal] = "Thumb3.R",
            [HumanBodyBones.RightIndexProximal] = "Index1.R",
            [HumanBodyBones.RightIndexIntermediate] = "Index2.R",
            [HumanBodyBones.RightIndexDistal] = "Index3.R",
            [HumanBodyBones.RightMiddleProximal] = "Middle1.R",
            [HumanBodyBones.RightMiddleIntermediate] = "Middle2.R",
            [HumanBodyBones.RightMiddleDistal] = "Middle3.R",
            [HumanBodyBones.RightRingProximal] = "Ring1.R",
            [HumanBodyBones.RightRingIntermediate] = "Ring2.R",
            [HumanBodyBones.RightRingDistal] = "Ring3.R",
            [HumanBodyBones.RightLittleProximal] = "Pinky1.R",
            [HumanBodyBones.RightLittleIntermediate] = "Pinky2.R",
            [HumanBodyBones.RightLittleDistal] = "Pinky3.R",
        };

        [SerializeField] private Avatar adaptedAvatar;

        public Avatar AdaptedAvatar => adaptedAvatar;
        public bool IsValid => adaptedAvatar != null && adaptedAvatar.isValid && adaptedAvatar.isHuman;

        private void Awake()
        {
            var animator = GetComponent<Animator>();
            animator.applyRootMotion = false;
            animator.cullingMode = AnimatorCullingMode.AlwaysAnimate;
            if (IsValid)
            {
                animator.avatar = adaptedAvatar;
            }
        }

        public Avatar BuildAdapterAvatar()
        {
            ApplyDeterministicHierarchy(gameObject);
            adaptedAvatar = BuildAvatar(gameObject);
            var animator = GetComponent<Animator>();
            animator.avatar = adaptedAvatar;
            animator.applyRootMotion = false;
            animator.cullingMode = AnimatorCullingMode.AlwaysAnimate;
            return adaptedAvatar;
        }

        public void AssignBuiltAvatar(Avatar avatar)
        {
            if (avatar == null || !avatar.isValid || !avatar.isHuman)
                throw new ArgumentException("Adapter requires a valid Humanoid Avatar.", nameof(avatar));
            adaptedAvatar = avatar;
            var animator = GetComponent<Animator>();
            animator.avatar = avatar;
            animator.applyRootMotion = false;
            animator.cullingMode = AnimatorCullingMode.AlwaysAnimate;
        }

        public static void ApplyDeterministicHierarchy(GameObject root)
        {
            var transforms = UniqueTransforms(root);
            foreach (var (childName, parentName) in HierarchyRules)
            {
                if (!transforms.TryGetValue(childName, out var child) || !transforms.TryGetValue(parentName, out var parent))
                    throw new InvalidOperationException($"Humanoid adapter bone missing: {childName}/{parentName}");
                if (child.parent != parent)
                    child.SetParent(parent, true);
            }
        }

        public static Avatar BuildAvatar(GameObject root)
        {
            var transforms = root.GetComponentsInChildren<Transform>(true);
            var byName = UniqueTransforms(root);
            var human = HumanBoneMap.Select(pair => new HumanBone
            {
                humanName = HumanName(pair.Key),
                boneName = byName.TryGetValue(pair.Value, out _) ? pair.Value : throw new InvalidOperationException($"Humanoid bone missing: {pair.Value}"),
                limit = new HumanLimit { useDefaultValues = true },
            }).ToArray();
            var skeleton = transforms.Select(transform => new SkeletonBone
            {
                name = transform.name,
                position = transform.localPosition,
                rotation = transform.localRotation,
                scale = transform.localScale,
            }).ToArray();
            var avatar = AvatarBuilder.BuildHumanAvatar(root, new HumanDescription
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
            });
            avatar.name = root.name + "_HumanoidAvatar";
            if (!avatar.isValid || !avatar.isHuman)
                throw new InvalidOperationException($"Humanoid Avatar build failed for {root.name}");
            return avatar;
        }

        private static string HumanName(HumanBodyBones bone)
        {
            var name = bone.ToString();
            var isFinger = name.Contains("Thumb", StringComparison.Ordinal) || name.Contains("Index", StringComparison.Ordinal) ||
                           name.Contains("Middle", StringComparison.Ordinal) || name.Contains("Ring", StringComparison.Ordinal) ||
                           name.Contains("Little", StringComparison.Ordinal);
            if (!isFinger) return name;
            return string.Concat(name.Select((character, index) => index > 0 && char.IsUpper(character) ? " " + character : character.ToString()));
        }

        private static Dictionary<string, Transform> UniqueTransforms(GameObject root) => root
            .GetComponentsInChildren<Transform>(true)
            .GroupBy(transform => transform.name, StringComparer.Ordinal)
            .ToDictionary(group => group.Key, group => group.First(), StringComparer.Ordinal);
    }
}
