using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace FourWorkstations.Office
{
    public sealed class DayNightController : MonoBehaviour
    {
        [SerializeField] private Light sun;
        [SerializeField] private Light[] workstationLights;
        [SerializeField] private Volume globalVolume;
        [SerializeField] private Color daySky = new(0.62f, 0.65f, 0.67f);
        [SerializeField] private Color dayEquator = new(0.42f, 0.41f, 0.38f);
        [SerializeField] private Color dayGround = new(0.24f, 0.22f, 0.19f);
        [SerializeField] private Color nightSky = new(0.25f, 0.30f, 0.40f);
        [SerializeField] private Color nightEquator = new(0.14f, 0.17f, 0.24f);
        [SerializeField] private Color nightGround = new(0.06f, 0.08f, 0.12f);
        [SerializeField] private Color daySun = new(1f, 0.96f, 0.89f);
        [SerializeField] private Color nightSun = new(0.48f, 0.58f, 0.78f);
        [SerializeField] private float dayIntensity = 0.78f;
        [SerializeField] private float nightIntensity = 0.16f;

        public bool IsNight { get; private set; }

        public void SetNight(bool isNight)
        {
            IsNight = isNight;
            RenderSettings.ambientMode = AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = isNight ? nightSky : daySky;
            RenderSettings.ambientEquatorColor = isNight ? nightEquator : dayEquator;
            RenderSettings.ambientGroundColor = isNight ? nightGround : dayGround;
            DynamicGI.UpdateEnvironment();
            if (sun != null)
            {
                sun.color = isNight ? nightSun : daySun;
                sun.intensity = isNight ? nightIntensity : dayIntensity;
            }
            if (workstationLights != null)
            {
                foreach (var workstationLight in workstationLights)
                {
                    if (workstationLight != null) workstationLight.enabled = isNight;
                }
            }
            if (globalVolume != null && globalVolume.profile.TryGet(out ColorAdjustments color))
            {
                color.postExposure.value = isNight ? -0.05f : -0.35f;
                color.contrast.value = isNight ? 12f : 8f;
                color.saturation.value = isNight ? -8f : -6f;
                color.colorFilter.value = isNight
                    ? new Color(0.86f, 0.91f, 1f)
                    : new Color(1f, 0.985f, 0.96f);
            }
        }

        private void Awake()
        {
            SetNight(false);
        }
    }
}
