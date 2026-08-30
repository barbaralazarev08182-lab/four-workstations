using UnityEngine;

namespace FourWorkstations.Data
{
    [CreateAssetMenu(menuName = "Four Workstations/Game Config", fileName = "GameConfig")]
    public sealed class GameConfig : ScriptableObject
    {
        [Header("Migration foundation only")]
        public int atlasPrototypePhase;
        public string statusDefinitionsSource = "Web client reference";
    }
}
