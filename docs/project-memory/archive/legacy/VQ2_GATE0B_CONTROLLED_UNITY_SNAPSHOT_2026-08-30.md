# Four Workstations / VQ2 — Gate 0B Controlled Unity Snapshot

> Date: 2026-08-30
> Status: IMPLEMENTATION GATE — AUTHORIZED PRE-GAMEPLAY REPOSITORY WORK
> Parent: `VQ2_IMPLEMENTATION_START_GATE_2026-08-30.md`, Issue #3 Gate 0 audit
> Purpose: turn the currently local-only authoritative Unity project into a safe, reviewable Git baseline before any VQ2 gameplay branch or gameplay change

---

# 0. Decision

Gate 0A found the correct local Unity source of truth, but also found that the entire Unity project is effectively untracked from Git.

Verified local state:

- repo root: `E:\Projects\four-workstations-unity`
- Unity project: `E:\Projects\four-workstations-unity\unity\FourWorkstations`
- current local branch: `feat/unity-migration`
- current HEAD: `ce29c0ae06513599b263eea2e38c0f0b50943ac8`
- current branch and `origin/main` point to the same commit
- tracked Unity files at HEAD: `0`
- modified tracked files: `.gitignore`
- untracked files: `742`
- production Office scene is the approved L1R Final Day state
- N1R Night is still a protected candidate, not production
- local `docs/UNITY_MIGRATION.md` is untracked and its lighting section is stale

Therefore:

> `ce29c0a` is only the parent of the future Unity snapshot. It is NOT a safe VQ2 gameplay base.

The next required artifact is one controlled local snapshot commit containing the authoritative Unity source and required recovery/tooling files while excluding caches, generated noise, disposable captures, and unsafe oversize binaries.

Do not begin VQ2 gameplay code before this commit exists and is verified.

---

# 1. Safety rules

During Gate 0B:

- DO NOT run `git add .` or `git add -A` from repo root.
- DO NOT run `git clean`, `git reset --hard`, destructive checkout, merge, rebase, pull, or force operations.
- DO NOT delete local candidate assets merely to make Git clean.
- DO NOT rewrite or regenerate production Office assets unless required to make the repository self-consistent.
- DO NOT modify gameplay behavior.
- DO NOT create `feat/vq2-first-hour-vertical-slice` yet.
- DO NOT push the snapshot before local verification is complete.

A local commit is authorized by this Gate once all preflight checks PASS.

---

# 2. Preflight A — large files and Git LFS

Before staging anything, inspect `.gitattributes`, Git LFS availability, and file sizes.

Required report:

1. print `.gitattributes` contents;
2. run `git lfs version` and report whether LFS is installed;
3. run `git lfs track` and report existing tracked patterns;
4. list every untracked candidate file >= 50 MiB;
5. separately list every file >= 95 MiB;
6. report total size of the proposed snapshot set before commit.

Hard stop:

> If any required file is >= 95 MiB and is not already safely handled by an existing, verified LFS policy, STOP before staging/committing it and report the exact file(s).

Do not invent a new broad LFS policy as a side effect of this Gate without reporting it first.

---

# 3. Preflight B — classify the 742 untracked files

Create a machine-readable classification with these buckets:

## INCLUDE — required source of truth

Expected categories:

- `.gitignore` tracked modification, after review;
- `.gitattributes`, only if its contents are intentional and safe;
- `docs/UNITY_MIGRATION.md`, updated to accurately record current production Day and candidate Night state;
- Blender/tooling scripts that are the reproducible source or validator for the current approved Unity assets;
- `unity/FourWorkstations/ProjectSettings/**` required by the project;
- `unity/FourWorkstations/Packages/manifest.json`;
- `unity/FourWorkstations/Packages/packages-lock.json`;
- vendored/local Animation Rigging package content only if the package manifest depends on that local package and a fresh clone would otherwise fail;
- production Unity `Assets/**` required to open and run the current Office project;
- current C# scripts;
- prefabs;
- production scenes;
- rendering/settings assets;
- tests that validate current production behavior;
- `.meta` files paired with every included Unity asset.

## INCLUDE — protected reference candidates

Keep only candidates that are currently protected project baselines or needed to reproduce/compare the approved state.

At minimum review and normally preserve:

- `Office_L1R_Final_High_Quality_Candidate.unity` and dependencies if it is the exact approved Day reference;
- `Office_N1R_Night_Refined_Candidate.unity` and the exact lighting/bake/settings dependencies needed to reproduce N1R;
- G1B/G1C authoritative manifest/reference files needed to establish current workstation geometry authority.

Do not automatically preserve every historical candidate scene/bake.

## EXCLUDE — generated/disposable

Expected exclusions include:

- `Library/`;
- `Temp/`;
- `Logs/`;
- `Obj/`;
- local build outputs;
- crash dumps;
- IDE caches;
- QA screenshots/captures that are not required project evidence;
- temporary render outputs;
- disposable bake intermediates;
- one-off diagnostic outputs that are reproducible and not referenced as authority;
- duplicate historical candidate scenes/bakes that have no protected baseline role.

If an excluded file is currently under `Assets/` and Unity requires it through GUID/reference dependencies, it is not disposable and must be reclassified.

---

# 4. Dependency integrity check

Before commit, validate that the proposed include set is self-contained enough for a clean clone.

Required checks:

- every included `.unity`, `.prefab`, `.asset`, material, texture, animation, model, and script has its paired `.meta` where applicable;
- no production scene references a deliberately excluded GUID/file;
- `Packages/manifest.json` local/file dependencies exist inside the included repository set;
- no production scene depends on a candidate asset that is being omitted;
- no required asset exists only inside `Library` or another generated cache;
- `Office.unity` remains enabled in Build Settings/EditorBuildSettings;
- Bootstrap remains enabled;
- QA scene remains disabled, per current baseline;
- Day production scene SHA remains the audited value unless a metadata-only change legitimately changes the serialized scene;
- N1R remains candidate-only and is not accidentally promoted.

If dependency validation requires adding a file previously classified as disposable, include the dependency rather than breaking clone reproducibility.

---

# 5. Update `docs/UNITY_MIGRATION.md`

Before snapshot, update only the stale repository-state and lighting baseline sections so this local migration handoff matches reality.

It must explicitly record:

- Unity `6000.3.21f1`;
- current Unity project path relative to repo: `unity/FourWorkstations`;
- approved production Day = `Office.unity` matching `Office_L1R_Final_High_Quality_Candidate.unity` at Gate 0A audit time;
- audited Day scene SHA-256: `24C7844BF927FE00CF196970022388DE20DC12FC0AB56E972A8DA43B0B1FDD50`;
- production Day intensity `1.38`;
- production Day ambient values Sky `.49/.50/.50`, Equator `.33/.33/.32`, Ground `.16/.16/.155`;
- N1R remains candidate-only;
- N1R candidate path;
- audited N1R scene SHA-256: `C269EE62161D6EB32AF7DB30B3D0E9ED4CBB67DA0BB910C7B89A937A32161B39`;
- current G1B/G1C geometry authority and world-orientation rules remain unchanged;
- snapshot commit SHA is to be appended after commit creation.

Do not rewrite unrelated historical sections.

---

# 6. Staging rule

Stage by explicit allowlist/path groups, not by repository-wide add.

Before commit, capture:

- `git status --short`;
- `git diff --cached --stat`;
- staged file count;
- staged size estimate;
- list of staged files >= 50 MiB;
- list of intentionally remaining untracked files grouped by exclusion reason.

Review that no secret/config credential files are staged.

Specifically verify no real `.env`, Supabase service-role key, private token, Unity license file, machine credential, or local user-secret file is included.

---

# 7. Local validation before commit

Run the cheapest reliable project checks available without changing production state.

Minimum:

1. Unity project opens/imports from the current local project without blocking Console errors.
2. Production `Office.unity` opens.
3. Existing relevant EditMode/PlayMode smoke tests run if they are already part of the project.
4. Record blocking Console error count.
5. Verify Office production scene still visually points to the current approved assets/settings.
6. Verify current Day/Night classification is unchanged.

Do not rebake lighting or regenerate geometry merely for the snapshot if current assets already pass.

---

# 8. Snapshot commit

If all preflight and local checks PASS, create one local commit on `feat/unity-migration`.

Recommended commit message:

`chore(unity): snapshot authoritative migration baseline`

The commit should represent:

> the recoverable pre-VQ2 Unity authority, not new VQ2 gameplay.

After commit, append the resulting snapshot SHA to `docs/UNITY_MIGRATION.md`. If that requires a second tiny documentation commit, use:

`docs(unity): record migration snapshot sha`

Do not amend a large snapshot commit merely to hide the audit trail.

---

# 9. Post-commit verification

After the local snapshot commit(s):

- report final HEAD SHA;
- report `git status --short --branch`;
- confirm whether intentionally excluded untracked files remain;
- confirm tracked Unity file count is now > 0;
- verify `ProjectSettings/ProjectVersion.txt` is tracked;
- verify `Packages/manifest.json` and lockfile are tracked;
- verify production `Office.unity` is tracked;
- verify current production scripts/prefabs/assets are tracked;
- verify N1R protected candidate is tracked if required by the classification decision;
- show the first 20 and last 20 paths from `git show --name-only --format=` for the snapshot commit;
- report commit total file count and size summary.

Gate 0B PASS only if a fresh Agent can identify a single exact commit that contains the current recoverable Unity source of truth.

---

# 10. Push / branch boundary

Do NOT push or create the VQ2 gameplay branch as part of Gate 0B.

Return the verified local snapshot SHA first.

After planning review approves that SHA, the next operation will be:

1. publish/preserve the Unity migration baseline branch as appropriate;
2. create `feat/vq2-first-hour-vertical-slice` from the exact approved snapshot SHA;
3. begin Spatial Reservation Audit;
4. no economy/network/Ouroboros work yet.

---

# 11. PASS / FAIL

## PASS

- no required oversize/LFS problem;
- authoritative Unity project is committed locally;
- project is self-contained enough for recovery/clean-clone work;
- protected Day baseline remains production;
- N1R remains candidate;
- no credentials/caches/disposable noise are committed;
- exact snapshot SHA exists and is reported.

## FAIL / STOP

Stop before gameplay work if any of these occur:

- required file >= 95 MiB lacks safe LFS handling;
- staging unexpectedly includes credentials;
- production scene references omitted assets;
- local package dependencies are missing from snapshot;
- Unity fails to open/import due to the staged/excluded split;
- Office baseline changes unexpectedly;
- snapshot cannot be reproduced or clearly identified.
