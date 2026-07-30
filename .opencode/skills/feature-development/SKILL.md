---
name: feature-development
description: |
  General feature development workflow for four-workstations. Use when adding
  pages, buttons, statuses, interactions, room/member/notification/stats
  features, or modifying user flows.
---

# Feature Development

## Before coding

1. State a short implementation plan before writing code.
2. In the plan, explicitly cover:
   - User action flow (step by step).
   - UI changes (which components are touched).
   - Client-side state changes.
   - Supabase data changes (tables, RPCs, Realtime events).
   - Realtime synchronization impact.
   - Permissions and failure modes.

## Development rules

- Prefer reusing existing components and hooks. Do not build from scratch when a close match already exists.
- Do not perform a broad refactoring for a small feature. Scope tightly.
- Every interactive element must handle **loading, empty, error, and disabled** states.
- For multi-user features, always consider what happens when two clients perform the same operation concurrently.

## Cross-skill loading

- If the feature touches the database, **always load the `supabase-safe-ops` skill** first.
- If the feature touches the UI, **always load the `webapp-verification` skill** before declaring work complete.

## Delivery

- Complete one verifiable feature at a time before starting the next.
- After implementation, list:
  - Files modified.
  - Test results (manual or automated).
  - Remaining risks.
- **Never** push, deploy, or modify production data without explicit confirmation.

## Verification

```
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
