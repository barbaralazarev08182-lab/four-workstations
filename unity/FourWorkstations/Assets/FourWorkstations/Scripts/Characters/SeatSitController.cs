using System.Collections;
using UnityEngine;
using UnityEngine.Animations.Rigging;

namespace FourWorkstations.Characters
{
    [RequireComponent(typeof(Animator), typeof(RigBuilder))]
    public sealed class SeatSitController : MonoBehaviour
    {
        [SerializeField] private SeatAnchor anchor;
        [SerializeField] private MultiPositionConstraint pelvisConstraint;
        [SerializeField] private TwoBoneIKConstraint leftFootIk;
        [SerializeField] private TwoBoneIKConstraint rightFootIk;
        [SerializeField] private float entryDuration = 0.7f;
        [SerializeField] private float constraintBlendStart = 0.45f;

        private Animator animator;

        public SeatAnchor Anchor => anchor;
        public Transform LeftFoot => leftFootIk == null ? null : leftFootIk.data.tip;
        public Transform RightFoot => rightFootIk == null ? null : rightFootIk.data.tip;
        public Transform Pelvis => pelvisConstraint == null ? null : pelvisConstraint.data.constrainedObject;
        public bool IsSeated { get; private set; }

        public void Configure(SeatAnchor seatAnchor, MultiPositionConstraint pelvis, TwoBoneIKConstraint left, TwoBoneIKConstraint right)
        {
            anchor = seatAnchor;
            pelvisConstraint = pelvis;
            leftFootIk = left;
            rightFootIk = right;
        }

        private void Awake()
        {
            animator = GetComponent<Animator>();
            animator.applyRootMotion = false;
        }

        private IEnumerator Start()
        {
            if (anchor == null || !anchor.IsValid) throw new MissingReferenceException("SeatAnchor contract is incomplete.");
            if (Vector3.Distance(transform.position, anchor.ApproachRoot.position) > 0.01f)
                throw new UnityException("Character must be authored at ApproachRoot; runtime teleport is forbidden.");

            pelvisConstraint.weight = 0f;
            leftFootIk.weight = 0f;
            rightFootIk.weight = 0f;
            animator.Play("Sit", 0, 0f);
            animator.speed = 1f;

            var startPosition = transform.position;
            var startRotation = transform.rotation;
            var elapsed = 0f;
            while (elapsed < entryDuration)
            {
                elapsed += Mathf.Min(Time.deltaTime, 1f / 30f);
                var linear = Mathf.Clamp01(elapsed / entryDuration);
                var smooth = linear * linear * (3f - 2f * linear);
                transform.SetPositionAndRotation(
                    Vector3.Lerp(startPosition, anchor.SeatedRoot.position, smooth),
                    Quaternion.Slerp(startRotation, anchor.Facing.rotation, smooth));
                var constraintWeight = Mathf.InverseLerp(constraintBlendStart, 1f, linear);
                pelvisConstraint.weight = constraintWeight;
                leftFootIk.weight = constraintWeight;
                rightFootIk.weight = constraintWeight;
                var state = animator.GetCurrentAnimatorStateInfo(0);
                if (state.IsName("Sit") && state.normalizedTime >= 0.88f)
                    animator.speed = 0f;
                yield return null;
            }

            transform.SetPositionAndRotation(anchor.SeatedRoot.position, anchor.Facing.rotation);
            pelvisConstraint.weight = 1f;
            leftFootIk.weight = 1f;
            rightFootIk.weight = 1f;
            animator.speed = 0f;
            IsSeated = true;
        }
    }
}
