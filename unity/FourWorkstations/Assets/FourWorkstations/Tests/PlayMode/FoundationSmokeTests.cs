using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.TestTools;

namespace FourWorkstations.Tests
{
    public sealed class FoundationSmokeTests
    {
        [UnityTest]
        public IEnumerator OfficeSceneContainsMigrationBaseline()
        {
            SceneManager.LoadScene("Office");
            yield return null;
            var office = GameObject.Find("Office_R5_Final");
            Assert.IsNotNull(office);
            Assert.AreEqual(Vector3.one, office.transform.localScale);
            var worldRoot = GameObject.Find("OfficeWorldRoot");
            Assert.IsNotNull(worldRoot);
            Assert.That(Mathf.Abs(Mathf.DeltaAngle(worldRoot.transform.eulerAngles.y, 180f)), Is.LessThan(0.01f));
            foreach (var renderer in office.GetComponentsInChildren<Renderer>(true))
            {
                Assert.IsTrue(renderer.enabled, $"Office renderer disabled: {renderer.name}");
                Assert.IsFalse(renderer.forceRenderingOff, $"Office renderer force-disabled: {renderer.name}");
            }
            Assert.IsNotNull(GameObject.Find("OfficeCamera"));
            var atlas = GameObject.Find("AtlasAnchor");
            Assert.IsNotNull(atlas);
            Assert.That(Vector3.Distance(atlas.transform.position, new Vector3(0f, 0.02f, 0f)), Is.LessThan(0.001f));
            var characters = GameObject.FindGameObjectsWithTag("Player");
            Assert.AreEqual(4, characters.Length);
            foreach (var character in characters)
            {
                var animator = character.GetComponent<Animator>();
                Assert.IsNotNull(animator, $"{character.name} has no Animator.");
                var clipNames = animator.runtimeAnimatorController.animationClips;
                Assert.IsTrue(System.Array.Exists(clipNames, clip => clip.name.Contains("Idle")), $"{character.name} Idle missing.");
                Assert.IsTrue(System.Array.Exists(clipNames, clip => clip.name.Contains("Walk")), $"{character.name} Walk missing.");
                var spawn = GameObject.Find($"CharacterSpawn_{character.name}");
                Assert.IsNotNull(spawn, $"{character.name} spawn missing.");
                Assert.That(Vector3.Distance(character.transform.position, spawn.transform.position), Is.LessThan(0.001f));
            }
            Assert.IsNotNull(GameObject.Find("OfficeWaypoints"));
        }

        [UnityTest]
        public IEnumerator OfficeSceneMaintainsBaselineFrameRate()
        {
            SceneManager.LoadScene("Office");
            yield return null;
            const int sampleFrames = 180;
            var startedAt = Time.realtimeSinceStartup;
            for (var frame = 0; frame < sampleFrames; frame++)
            {
                yield return null;
            }

            var elapsed = Time.realtimeSinceStartup - startedAt;
            var fps = sampleFrames / elapsed;
            Debug.Log($"[UnityMigration] EDITOR_PLAYMODE_FPS={fps:F1}");
            Assert.Greater(fps, 30f, "Office baseline dropped below 30 FPS in PlayMode.");
        }
    }
}
