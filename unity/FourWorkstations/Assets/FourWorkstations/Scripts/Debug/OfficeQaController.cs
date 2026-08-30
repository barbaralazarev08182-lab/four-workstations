using FourWorkstations.Office;
using UnityEngine;
using UnityEngine.InputSystem;

namespace FourWorkstations.Debugging
{
    public sealed class OfficeQaController : MonoBehaviour
    {
        [SerializeField] private DayNightController dayNight;

        private void Update()
        {
            if (Keyboard.current != null && Keyboard.current.nKey.wasPressedThisFrame && dayNight != null)
            {
                dayNight.SetNight(!dayNight.IsNight);
                Debug.Log($"[OfficeQA] mode={(dayNight.IsNight ? "night" : "day")}");
            }
        }
    }
}
