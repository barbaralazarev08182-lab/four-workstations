# Supabase setup

This phase adds the database schema, RLS policies and `current_status` synchronization. Authentication and the create/join office screens are intentionally left for the next phase.

## Apply the migration

Run `supabase/migrations/202607290001_initial_office_realtime.sql` in a Supabase project through the SQL editor or the Supabase CLI migration workflow.

The migration creates:

- `profiles`
- `offices`
- `office_members`
- `current_status`
- `checkins`
- `interactions`
- `comments`
- atomic `create_office`, `join_office_by_code` and `set_current_status` RPC functions
- RLS policies for every public table
- the `current_status` Realtime publication entry

`set_current_status` is the only browser-accessible mutation path for status rows and check-in history. It uses the authenticated user ID, database time and a transaction-scoped advisory lock. Repeating the same status/message/mood returns the existing row without creating another check-in.

## Environment

Copy `.env.example` to `.env.local` and set only browser-safe public values:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Never put a service-role key in the browser environment.

Without both public values, the application remains in local demo mode and continues using the existing mock data and localStorage state.

## Realtime behavior

The browser subscribes only to `current_status` business-state changes filtered by `office_id`. Character coordinates are never sent over Realtime. Each client passes the received state into the existing `CharacterController`, which independently plays the same local path animation.

The synchronization hook:

- removes the previous channel before starting a new one;
- refetches the authoritative snapshot after subscribing and after reconnecting;
- ignores events whose `updated_at` is not newer than the latest accepted row;
- uses deterministic activity IDs to prevent duplicate feed entries;
- never writes remote office state back into the localStorage demo snapshot.

