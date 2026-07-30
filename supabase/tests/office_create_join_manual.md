# Office create/join verification

For the repeatable RPC smoke test, create a local `.env.office-test.local`
file (it is ignored by `.gitignore`) containing five confirmed test accounts:

```dotenv
OFFICE_TEST_A_EMAIL=
OFFICE_TEST_A_PASSWORD=
OFFICE_TEST_B_EMAIL=
OFFICE_TEST_B_PASSWORD=
OFFICE_TEST_C_EMAIL=
OFFICE_TEST_C_PASSWORD=
OFFICE_TEST_D_EMAIL=
OFFICE_TEST_D_PASSWORD=
OFFICE_TEST_E_EMAIL=
OFFICE_TEST_E_PASSWORD=
```

Run `pnpm test:office-rpc`. The script never prints credentials and uses only
the browser-safe publishable key from `.env.local`.

This checklist intentionally uses authenticated browser clients and the anon key.
It never uses a service-role key and does not delete existing users.

## Four-member flow

1. Open Chrome normal, Chrome Incognito, Edge normal, and Edge InPrivate.
2. Sign in with four distinct confirmed test accounts (A–D).
3. A creates an office, records the six-character code, and verifies `desk_1`.
4. B previews the code and joins `desk_2`.
5. C joins `desk_3`; D joins `desk_4`.
6. Refresh all four windows and confirm all nicknames and desks are restored.
7. Sign A out and back in; confirm the same office opens.

## Fifth member and information disclosure

1. Sign in as a fifth account E and preview the full office code.
2. Expect the RPC error `office_is_full`; no office row, owner id, member profile,
   status, or check-in data should be returned.
3. Preview `AAAAAA`; expect `invalid_invite_code` and no data payload.

## Concurrent desk claim

1. Create another office as A and leave `desk_2` available.
2. In B and C, preview the same office and select `desk_2`.
3. Submit both join forms at the same time.
4. Exactly one request must succeed. The other must return `desk_is_taken`.
5. Refresh the loser: they must remain outside the office and may select another desk.

## Authorization checks

Using the browser Supabase client with each account's normal session:

1. A second `create_office` or `join_office` call returns `already_in_office`.
2. A direct insert into `offices` returns a permission error, so `owner_id` cannot be forged.
3. A direct insert/update/delete on `office_members` returns a permission error.
4. An outsider's direct select from `offices`, `office_members`, `current_status`,
   `checkins`, and peer `profiles` returns no rows.
5. A member can read only their own office and can update only their own profile/status
   through the existing allowed paths.
