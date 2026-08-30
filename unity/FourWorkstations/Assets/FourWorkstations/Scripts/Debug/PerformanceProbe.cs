using UnityEngine;

namespace FourWorkstations.Debugging
{
    public sealed class PerformanceProbe : MonoBehaviour
    {
        private float elapsed;
        private int frames;

        private void Update()
        {
            elapsed += Time.unscaledDeltaTime;
            frames++;
            if (elapsed >= 5f)
            {
                Debug.Log($"[Performance] FPS={frames / elapsed:F1}");
                elapsed = 0f;
                frames = 0;
            }
        }
    }
}
