using UnityEngine;

namespace FourWorkstations.Characters
{
    [RequireComponent(typeof(Animator))]
    public sealed class CharacterAnimationDriver : MonoBehaviour
    {
        private static readonly int SpeedId = Animator.StringToHash("Speed");
        private Animator animator;

        public float Speed
        {
            get => animator == null ? 0f : animator.GetFloat(SpeedId);
            set
            {
                if (animator != null)
                {
                    animator.SetFloat(SpeedId, Mathf.Max(0f, value));
                }
            }
        }

        private void Awake()
        {
            animator = GetComponent<Animator>();
        }
    }
}
