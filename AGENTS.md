# AGENTS.md

## Commands

```
pnpm dev                                    # start Next.js dev server
pnpm build                                  # production build
pnpm lint                                   # ESLint (flat config, Next.js rules)
tsc --noEmit                                # typecheck (no npm script; TS strict)
pnpm test:office-rpc                        # Supabase RPC smoke test (needs 5 real accounts)
```

## Package manager

pnpm **only**. The `packageManager` field in `package.json` pins `pnpm@11.9.0`. `.npmrc` sets `node-linker=hoisted`.

## Dual runtime mode

The app runs in one of two modes, automatically selected:

| Mode | Trigger | Data source |
|------|---------|-------------|
| **local** | `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` missing from `.env.local` | `lib/mock-data.ts` + `localStorage` key `four-workstations:office:v2` |
| **realtime** | Both Supabase env vars present | Supabase auth → Realtime channel ↔ `current_status` table via RPC `set_current_status` |

`.env.example` is the committed template. `.env.local` is gitignored — never commit it.

## Environment files

- `.env.example` — committed template (only `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- `.env.local` — gitignored; local dev credentials
- `.env.office-test.local` — gitignored; 5 test accounts (`OFFICE_TEST_A_EMAIL` … `OFFICE_TEST_E_PASSWORD`) for the RPC smoke test
- All `.env*` except `.env.example` are gitignored. Never commit secrets.

## Architecture

Single-page Next.js 16 app (App Router):

```
app/page.tsx
  └─ AppAuthGate (components/auth/)
       ├─ 未登录 → AuthPage
       ├─ 已登录, no office → OfficeOnboarding (create/join)
       └─ 已登录, in office → OfficeApp (components/OfficeApp.tsx)
                                ├─ OfficeScene (3D, components/office-3d/)
                                ├─ ActivityFeed
                                ├─ QuickActionDock
                                ├─ CheckInPanel / InteractionPanel
                                └─ RoomInfoPanel
```

Key directories:
- `lib/` — types, status definitions (`lib/status.ts`), mock data, Supabase client + DB types
- `hooks/` — custom hooks for auth session, Realtime sync, interactions, office management
- `components/office-3d/` — Three.js/R3F character controller, waypoints, scene
- `supabase/migrations/` — SQL migrations applied via Supabase CLI or SQL editor

Path alias: `@/*` → project root (see `tsconfig.json`).

## Database / Supabase

All browser-side mutations go through **RPC functions** (never direct table inserts/updates):

| RPC | Purpose |
|-----|---------|
| `create_office(p_name)` | Create new office; caller becomes owner at `desk_1` |
| `join_office(p_invite_code, p_desk_key)` | Join existing office |
| `preview_office_by_invite_code(p_invite_code)` | Preview before joining |
| `set_current_status(p_office_id, p_status, p_message, p_mood)` | Update own status (creates check-in) |
| `send_interaction(...)` / `mark_interaction_read(...)` | Peer interactions |
| `delete_my_office()` / `leave_office()` / `transfer_ownership(...)` | Membership management |

RLS is enforced: browsers cannot directly insert/update `offices`, `office_members`, or `interactions`. The smoke test (`scripts/office-rpc-smoke.mjs`) validates this — it attempts direct inserts and expects errors.

**Realtime**: Each client subscribes to `current_status` and `office_members` changes filtered by `office_id`. Character coordinates are never sent over Realtime — each client plays the same local path animation independently. Events are deduplicated by `updated_at` timestamp.

## Vendored 3D dependencies

Three.js, `@react-three/fiber`, and `@react-three/drei` are installed from local `.tgz` files in `work/deps/` (committed). Do not update these via npm — they are pinned to specific versions.

## Testing

- No unit/integration test suite. The only automated test is `scripts/office-rpc-smoke.mjs` which creates an office with 5 real accounts and runs the full RLS + concurrency scenario. Requires credentials in `.env.office-test.local`.
- QA page: `/qa` with `?animationDebug=1` query param for 3D character animation debugging.
- Release validation checklist: `PROJECT_HANDOFF.md`. QA records: `design-qa.md`.

## Conventions

- Chinese UI (zh-CN locale). Code identifiers are English.
- Tailwind CSS 4 with PostCSS plugin (`postcss.config.mjs`).
- ESLint flat config (`eslint.config.mjs`) uses `eslint-config-next` core-web-vitals + TypeScript rules.
- React Strict Mode enabled (`next.config.ts`).
- TypeScript `strict: true`, `skipLibCheck: true`, `moduleResolution: "bundler"`.
- `components/**/*` — React components only (no utility functions).
