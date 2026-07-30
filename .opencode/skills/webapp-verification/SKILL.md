---
name: webapp-verification
description: |
  Browser-based verification for four-workstations. Use after any user-visible
  change to confirm the app renders and behaves correctly.
---

# Webapp Verification

## Allowed URLs

The Playwright browser may **only** navigate to these origins:

- `http://localhost:3000`
- `https://four-workstations.vercel.app`

Any other URL is forbidden. Do not navigate to Supabase, docs sites, or any external service.

## Playwright MCP workflow

This project has `@playwright/mcp` configured in `opencode.json`. Use these tools for verification:

1. **Start** `pnpm dev` in the background if not already running.
2. **Navigate** to `http://localhost:3000` with `browser_navigate`.
3. **Snapshot** the page with `browser_snapshot` to read the rendered DOM and accessibility tree.
4. **Check console** with `browser_console_messages` — report every error and warning.
5. **Resize** to 1280×720 (desktop) then 390×844 (mobile) with `browser_resize`, taking a snapshot each time.

After every snapshot, confirm:
- The page rendered (no blank white screen, no unhandled error overlay).
- All expected UI elements are present in the snapshot.
- Console contains no new application errors (ignore THREE.Clock deprecation).

## Prohibited actions

- **Never** type credentials, click login, or submit any form.
- **Never** click business buttons that would create, update, or delete data.
- **Never** modify Supabase or any production database through the browser.
- **Never** run `browser_evaluate` or `browser_run_code` — snapshots only.

## Mandatory checks

- A successful `pnpm build` is **not** sufficient for user-visible changes. You must actually open the browser.
- Test on both:
  - Desktop viewport (≥ 1280 px width).
  - Mobile viewport (390 px width, e.g. iPhone 14).
- Check the browser console for:
  - Errors.
  - Warnings.
  - Network failures.
  - Hydration mismatches.

## State coverage

Test every reachable state:

- Not signed in.
- Signing in / authenticating.
- Signed in without an office.
- Signed in with an office.
- Loading / error / empty states.

## 3D-specific checks

For any 3D change, visually verify:

- Canvas renders without errors.
- All characters are visible and correctly positioned.
- Furniture and amenities are in place.
- Character labels are attached and readable.
- Walking paths do not clip through objects.
- Camera framing is correct.

## Realtime checks

For any Realtime change, verify with **two independent user sessions** (separate browsers or incognito windows).

## Credential safety

- **Never** write test account credentials into the repository.
- Store local test credentials only in `.env` files that are gitignored (see `.gitignore`).

## Verification report

After verification, state clearly:

- What was actually tested.
- What was **not** tested.
- Any remaining warnings or issues.

## Destructive testing

- **Never** perform destructive tests against real production data.
