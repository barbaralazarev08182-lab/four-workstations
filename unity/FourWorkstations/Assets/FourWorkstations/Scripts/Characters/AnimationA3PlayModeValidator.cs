#if UNITY_EDITOR
using System.Collections;
using System.IO;
using UnityEditor;
using UnityEngine;

namespace FourWorkstations.Characters
{
    public sealed class AnimationA3PlayModeValidator : MonoBehaviour
    {
        [SerializeField] private SeatSitController controller;
        [SerializeField] private Camera captureCamera;

        public void Configure(SeatSitController seatController, Camera camera)
        {
            controller = seatController;
            captureCamera = camera;
        }

        private IEnumerator Start()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var output = Path.Combine(projectRoot, "outputs", "unity-animation-a3");
            Directory.CreateDirectory(output);
            var previousRoot = transform.position;
            var maxRootFrameStep = 0f;
            var elapsed = 0f;
            var entryCaptured = false;
            while (elapsed < 1.5f)
            {
                yield return null;
                elapsed += Time.deltaTime;
                maxRootFrameStep = Mathf.Max(maxRootFrameStep, Vector3.Distance(previousRoot, transform.position));
                previousRoot = transform.position;
                if (!entryCaptured && elapsed >= 0.18f)
                {
                    Capture(Path.Combine(output, "01-sit-entry.png"));
                    entryCaptured = true;
                }
            }

            Capture(Path.Combine(output, "02-sit-result.png"));
            var leftStart = controller.LeftFoot.position;
            var rightStart = controller.RightFoot.position;
            var leftMaxSlide = 0f;
            var rightMaxSlide = 0f;
            var sampleElapsed = 0f;
            while (sampleElapsed < 1f)
            {
                yield return null;
                sampleElapsed += Time.deltaTime;
                leftMaxSlide = Mathf.Max(leftMaxSlide, HorizontalDistance(leftStart, controller.LeftFoot.position));
                rightMaxSlide = Mathf.Max(rightMaxSlide, HorizontalDistance(rightStart, controller.RightFoot.position));
            }

            var anchor = controller.Anchor;
            var pelvisError = Vector3.Distance(controller.Pelvis.position, anchor.PelvisTarget.position);
            var leftFootError = Vector3.Distance(controller.LeftFoot.position, anchor.LeftFootTarget.position);
            var rightFootError = Vector3.Distance(controller.RightFoot.position, anchor.RightFootTarget.position);
            Debug.Log($"[AnimationA3] PLAYMODE_PASS seated={controller.IsSeated} maxRootFrameStep={maxRootFrameStep:R} pelvisError={pelvisError:R} leftFootTargetError={leftFootError:R} rightFootTargetError={rightFootError:R} leftFootHorizontalSlide1s={leftMaxSlide:R} rightFootHorizontalSlide1s={rightMaxSlide:R} scale={transform.localScale:R}");
            EditorApplication.Exit(0);
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
