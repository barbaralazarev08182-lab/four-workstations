---
name: supabase-safe-ops
description: |
  Safe Supabase operations for four-workstations. Use for any database change:
  new tables, RPCs, migrations, RLS policies, Realtime, or data queries.
---

# Supabase Safe Operations

## Pre-work

1. Read `supabase/README.md` and **all** files in `supabase/migrations/` before any database change.
2. Understand the existing RPC functions and RLS policies.

## Migration rules

- **Never** modify an already-applied migration. All schema changes must go into a **new timestamped migration** file.
- **Never** run `db reset`, `db reset --linked`, or any command that clears production data.
- Production migrations must be **explicitly approved by me** before execution.

## Security rules

- Browsers may only use the **publishable / anon key**. Never reference the service_role key or database password in frontend code.
- User identity must always be determined by `auth.uid()` — never trust a caller-supplied user ID.
- RPC functions must never trust a browser-submitted sender user ID.
- Every new table or function must include a **row-level security (RLS) check**.
- After any change, verify that another user cannot read or modify data they shouldn't have access to.

## Realtime rules

- New tables enabled for Realtime must have the correct publication entry and proper subscription cleanup on the client side.
- Realtime subscriptions must filter by `office_id` and deduplicate by `updated_at` timestamp.

## Data integrity

- Every database write must consider duplicate submissions and concurrent access (use advisory locks or upsert patterns where appropriate).
- Never directly modify `auth.users` via SQL.

## Verification

After any database change:

```
pnpm test:office-rpc
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
