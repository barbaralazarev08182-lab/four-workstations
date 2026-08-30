using UnityEngine;

namespace FourWorkstations.Characters
{
    public sealed class SeatAnchor : MonoBehaviour
    {
        [Header("Root contract")]
        [SerializeField] private Transform approachRoot;
        [SerializeField] private Transform seatedRoot;
        [SerializeField] private Transform facing;

        [Header("Body contract")]
        [SerializeField] private float seatHeight;
        [SerializeField] private Transform pelvisTarget;

        [Header("Feet contract")]
        [SerializeField] private Transform leftFootTarget;
        [SerializeField] private Transform rightFootTarget;
        [SerializeField] private Transform leftKneeHint;
        [SerializeField] private Transform rightKneeHint;
        [SerializeField] private float groundHeight;

        public Transform ApproachRoot => approachRoot;
        public Transform SeatedRoot => seatedRoot;
        public Transform Facing => facing;
        public float SeatHeight => seatHeight;
        public Transform PelvisTarget => pelvisTarget;
        public Transform LeftFootTarget => leftFootTarget;
        public Transform RightFootTarget => rightFootTarget;
        public Transform LeftKneeHint => leftKneeHint;
        public Transform RightKneeHint => rightKneeHint;
        public float GroundHeight => groundHeight;

        public void Configure(
            Transform approach,
            Transform root,
            Transform facingTransform,
            float physicalSeatHeight,
            Transform pelvis,
            Transform leftFoot,
            Transform rightFoot,
            Transform leftHint,
            Transform rightHint,
            float floorHeight)
        {
            approachRoot = approach;
            seatedRoot = root;
            facing = facingTransform;
            seatHeight = physicalSeatHeight;
            pelvisTarget = pelvis;
            leftFootTarget = leftFoot;
            rightFootTarget = rightFoot;
            leftKneeHint = leftHint;
            rightKneeHint = rightHint;
            groundHeight = floorHeight;
        }

        public bool IsValid => approachRoot != null && seatedRoot != null && facing != null && pelvisTarget != null &&
                               leftFootTarget != null && rightFootTarget != null && leftKneeHint != null && rightKneeHint != null;
    }
}
