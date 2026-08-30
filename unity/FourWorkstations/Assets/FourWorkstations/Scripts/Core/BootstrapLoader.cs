using UnityEngine;
using UnityEngine.SceneManagement;

namespace FourWorkstations.Core
{
    public sealed class BootstrapLoader : MonoBehaviour
    {
        [SerializeField] private string officeScene = "Office";

        private void Start()
        {
            if (SceneManager.GetActiveScene().name != officeScene)
            {
                SceneManager.LoadScene(officeScene);
            }
        }
    }
}
