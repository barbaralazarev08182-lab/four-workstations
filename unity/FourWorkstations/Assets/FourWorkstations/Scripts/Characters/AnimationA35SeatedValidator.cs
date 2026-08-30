#if UNITY_EDITOR
using System.Collections;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;
using UnityEngine.Animations.Rigging;

namespace FourWorkstations.Characters
{
    public sealed class AnimationA35SeatedValidator : MonoBehaviour
    {
        [SerializeField] private Animator animator;
        [SerializeField] private SeatAnchor anchor;
        [SerializeField] private Camera captureCamera;
        [SerializeField] private MultiPositionConstraint pelvisConstraint;
        [SerializeField] private TwoBoneIKConstraint leftFootIk;
        [SerializeField] private TwoBoneIKConstraint rightFootIk;

        public void Configure(Animator targetAnimator, SeatAnchor seatAnchor, Camera camera, MultiPositionConstraint pelvis, TwoBoneIKConstraint left, TwoBoneIKConstraint right)
        {
            animator = targetAnimator;
            anchor = seatAnchor;
            captureCamera = camera;
            pelvisConstraint = pelvis;
            leftFootIk = left;
            rightFootIk = right;
        }

        private IEnumerator Start()
        {
            animator.applyRootMotion = false;
            pelvisConstraint.weight = 1f;
            leftFootIk.weight = 1f;
            rightFootIk.weight = 1f;
            yield return Evaluate("Enter", 0.86f, "01-sitting-enter-reference.png", false);
            yield return Evaluate("IdleLoop", 0.35f, "02-sitting-idle-loop.png", true);
            yield return Evaluate("TalkingLoop", 0.35f, "03-sitting-talking-loop.png", true);
            Debug.Log("[AnimationA35] VISUAL_SHORTLIST_PASS clips=Enter,IdleLoop,TalkingLoop sameSeatAnchor=true");
            EditorApplication.Exit(0);
        }

        private IEnumerator Evaluate(string state, float captureNormalizedTime, string fileName, bool measureLoop)
        {
            animator.speed = 1f;
            animator.Play(state, 0, 0f);
            yield return null;
            while (animator.GetCurrentAnimatorStateInfo(0).normalizedTime < captureNormalizedTime)
                yield return null;

            var output = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", "..", "outputs", "unity-animation-a35"));
            Directory.CreateDirectory(output);
            Capture(Path.Combine(output, fileName));

            var leftStart = leftFootIk.data.tip.position;
            var rightStart = rightFootIk.data.tip.position;
            var leftSlide = 0f;
            var rightSlide = 0f;
            if (measureLoop)
            {
                var startNormalized = animator.GetCurrentAnimatorStateInfo(0).normalizedTime;
                while (animator.GetCurrentAnimatorStateInfo(0).normalizedTime < startNormalized + 0.75f)
                {
                    yield return null;
                    leftSlide = Mathf.Max(leftSlide, HorizontalDistance(leftStart, leftFootIk.data.tip.position));
                    rightSlide = Mathf.Max(rightSlide, HorizontalDistance(rightStart, rightFootIk.data.tip.position));
                }
            }
            var hips = pelvisConstraint.data.constrainedObject;
            Debug.Log($"[AnimationA35] CLIP state={state} pelvisError={Vector3.Distance(hips.position, anchor.PelvisTarget.position):R} leftFootError={Vector3.Distance(leftFootIk.data.tip.position, anchor.LeftFootTarget.position):R} rightFootError={Vector3.Distance(rightFootIk.data.tip.position, anchor.RightFootTarget.position):R} leftSlide={leftSlide:R} rightSlide={rightSlide:R} root={transform.position:R} scale={transform.localScale:R}");
        }

        private static float HorizontalDistance(Vector3 a, Vector3 b) => Vector2.Distance(new Vector2(a.x, a.z), new Vector2(b.x, b.z));

        private void Capture(string path)
        {
            const int width = 1920;
            const int height = 1080;
            var target = new RenderTexture(width, height, 24, RenderTextureFormat.ARGB32);
            var image = new Texture2D(width, height, TextureFormat.RGB24, false);
            captureCamera.targetTexture = target;
            captureCamera.Render();
            RenderTexture.active = target;
            image.ReadPixels(new Rect(0, 0, width, height), 0, 0);
            image.Apply();
            File.WriteAllBytes(path, image.EncodeToPNG());
            captureCamera.targetTexture = null;
            RenderTexture.active = null;
            Destroy(target);
            Destroy(image);
        }
    }
}
#endif
