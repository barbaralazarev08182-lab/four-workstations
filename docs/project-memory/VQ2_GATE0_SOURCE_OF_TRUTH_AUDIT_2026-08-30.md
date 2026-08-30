# Four Workstations / VQ2 — Gate 0 Source-of-Truth Audit

> Date: 2026-08-30
> Status: EXECUTION STARTED — REMOTE AUDIT COMPLETE / LOCAL WORKTREE AUDIT REQUIRED
> Scope: establish the exact Unity source of truth before VQ2 gameplay implementation
> Authorization: user explicitly said **开始** on 2026-08-30

---

# 0. Gate decision

Implementation is now authorized, but **no Unity gameplay code should be changed until the local Unity worktree is reconciled**.

Current result:

> **REMOTE GATE 0: COMPLETE**  
> **LOCAL GATE 0: BLOCKED BY ENVIRONMENT ACCESS, NOT BY DESIGN**

The current ChatGPT execution environment can access the GitHub repository but cannot access the user's Windows filesystem at `E:\Projects\four-workstations-unity`.

Therefore it is unsafe to create the VQ2 implementation branch from any remote branch yet.

---

# 1. Verified remote facts

## 1.1 Remote `main`

Current remote `main` is the design/project-memory line and does not expose the active Unity project as a complete source tree.

Repository project memory records the Unity migration as local-first and warns that remote `main` is not the active Unity source of truth.

## 1.2 Expected local Unity worktree

Project memory records:

- worktree: `E:\Projects\four-workstations-unity`
- Unity project: `E:\Projects\four-workstations-unity\unity\FourWorkstations`
- previously observed local branch: `feat/unity-migration`
- Unity baseline: `6000.3.21f1`
- URP: `17.3.0`
- Cinemachine: `3.1.3`
- glTFast: `6.19.0`
- Windows x86_64
- Linear color
- New Input System

## 1.3 Remote branch check

A remote branch search for `unity` currently returns no matching branch.

Therefore the recorded `feat/unity-migration` branch is still not safely recoverable from GitHub by branch name.

## 1.4 Remote Unity project-file check

Repository code search did not find `ProjectVersion.txt` on the visible/default remote source.

The most recent visible VQ-1C visual-polish branch still exposes the historical Web/Blender source structure rather than a complete Unity project root.

Conclusion:

> Do not treat `main` or a VQ-1C branch as the base for new Unity gameplay work.

---

# 2. Known local-only production state that must be protected

Project memory records important Unity work that may exist only locally, including:

- production Day lighting baseline;
- Night N1R candidate / integration state;
- whole-world Y=180° orientation repair;
- approved orthographic camera;
- 4x MSAA baseline;
- Geometry G1B/G1C promoted workstation assets;
- `Assets/FourWorkstations/Art/Environment/Office_R5_Final.glb` changes;
- `Office_G1B_Atlas1.png` and associated baseline manifest;
- local `docs/UNITY_MIGRATION.md`;
- current Office production scene and baked-lighting data.

These must not be overwritten by checking out or branching from a stale remote tree.

---

# 3. Required local audit — exact commands

Run from Windows PowerShell on the development machine.

```powershell
Set-Location 'E:\Projects\four-workstations-unity'

Write-Host '=== REPO ==='
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git status --short --branch
git remote -v
git log -1 --oneline --decorate

Write-Host '=== CHANGED TRACKED FILES ==='
git diff --name-status
git diff --cached --name-status

Write-Host '=== UNTRACKED FILES ==='
git ls-files --others --exclude-standard

Write-Host '=== UNITY VERSION ==='
Get-Content '.\unity\FourWorkstations\ProjectSettings\ProjectVersion.txt'

Write-Host '=== UNITY PACKAGES ==='
Get-Content '.\unity\FourWorkstations\Packages\manifest.json'

Write-Host '=== UNITY SCENES ==='
Get-ChildItem '.\unity\FourWorkstations\Assets' -Recurse -Filter '*.unity' |
  Select-Object FullName

Write-Host '=== OFFICE CANDIDATES ==='
Get-ChildItem '.\unity\FourWorkstations\Assets' -Recurse |
  Where-Object { $_.Name -match 'Office|Day|Night' } |
  Select-Object FullName

Write-Host '=== LOCAL MIGRATION MEMORY ==='
if (Test-Path '.\docs\UNITY_MIGRATION.md') {
  Get-Item '.\docs\UNITY_MIGRATION.md' | Select-Object FullName, Length, LastWriteTime
} else {
  Write-Host 'docs/UNITY_MIGRATION.md NOT FOUND'
}
```

Do **not** run reset, clean, checkout, merge, rebase, pull, or push during this audit.

---

# 4. Local Gate 0 PASS criteria

Gate 0 passes only when all of the following are known from the real worktree:

1. exact repo root;
2. exact active branch;
3. exact HEAD SHA;
4. clean/dirty state;
5. list of modified tracked files;
6. list of untracked files;
7. Unity version and package baseline;
8. actual production Office scene path;
9. Day production state;
10. Night candidate/production state;
11. status of local `docs/UNITY_MIGRATION.md`;
12. whether current Unity state is already committed locally;
13. safe commit/base from which to create `feat/vq2-first-hour-vertical-slice`.

---

# 5. What happens immediately after Gate 0 passes

Once the local source is identified and preserved:

1. snapshot/commit local Unity production state if needed, without including disposable caches/outputs;
2. establish the safe base commit;
3. create `feat/vq2-first-hour-vertical-slice` from that exact base;
4. run the Spatial Reservation Audit on the live Office scene;
5. only then start PEBBLE/SEED bake-off and interaction work.

No economy, networking, Ouroboros, stranger-room observation, or broad new content should be implemented before the first-hour local slice is proven.

---

# 6. Current execution status

- Product design expansion: PAUSED
- Implementation authorization: YES
- Remote source audit: PASS
- Local worktree audit: REQUIRED
- Safe Unity base commit: UNKNOWN
- VQ2 gameplay branch creation: BLOCKED until local audit
- Unity gameplay modifications: NOT STARTED, intentionally

This is a source-integrity block, not a request to reopen design.