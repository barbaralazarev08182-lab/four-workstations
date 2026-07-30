begin;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  avatar_key text not null default 'ming' check (char_length(avatar_key) between 1 and 40),
  accent_color text not null default 'sage' check (accent_color in ('sage', 'terracotta', 'blue', 'violet')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offices (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  invite_code text not null unique check (invite_code ~ '^[A-Z0-9]{6,10}$'),
  owner_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.office_members (
  office_id uuid not null references public.offices(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  desk_key text not null check (desk_key in ('desk-a', 'desk-b', 'desk-c', 'desk-d')),
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (office_id, user_id),
  unique (office_id, desk_key)
);

create table if not exists public.current_status (
  office_id uuid not null,
  user_id uuid not null,
  status text not null check (status in (
    'clockedIn', 'working', 'studying', 'busy', 'meeting', 'eating', 'coffee',
    'resting', 'napping', 'restroom', 'slacking', 'outside', 'offWork', 'overtime'
  )),
  message text not null default '' check (char_length(message) <= 60),
  mood text not null default 'calm' check (mood in ('energized', 'calm', 'tired', 'happy', 'blank')),
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (office_id, user_id),
  foreign key (office_id, user_id) references public.office_members(office_id, user_id) on delete cascade
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  office_id uuid not null,
  user_id uuid not null,
  status text not null check (status in (
    'clockedIn', 'working', 'studying', 'busy', 'meeting', 'eating', 'coffee',
    'resting', 'napping', 'restroom', 'slacking', 'outside', 'offWork', 'overtime'
  )),
  message text not null default '' check (char_length(message) <= 60),
  mood text not null default 'calm' check (mood in ('energized', 'calm', 'tired', 'happy', 'blank')),
  started_at timestamptz not null,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key (office_id, user_id) references public.office_members(office_id, user_id) on delete cascade,
  unique (id, office_id),
  check (ended_at is null or ended_at >= started_at)
);

create unique index if not exists checkins_one_active_per_member
  on public.checkins (office_id, user_id)
  where ended_at is null;

create index if not exists checkins_office_created_idx
  on public.checkins (office_id, created_at desc);

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  office_id uuid not null,
  sender_id uuid not null,
  receiver_id uuid not null,
  interaction_type text not null check (interaction_type in (
    'reaction', 'send_coffee', 'poke', 'short_message', 'lunch_invite',
    'slack_invite', 'clock_out_reminder'
  )),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  foreign key (office_id, sender_id) references public.office_members(office_id, user_id) on delete cascade,
  foreign key (office_id, receiver_id) references public.office_members(office_id, user_id) on delete cascade,
  check (jsonb_typeof(payload) = 'object')
);

create index if not exists interactions_receiver_created_idx
  on public.interactions (office_id, receiver_id, created_at desc);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  office_id uuid not null references public.offices(id) on delete cascade,
  checkin_id uuid not null,
  sender_id uuid not null,
  content text not null check (char_length(content) between 1 and 60),
  created_at timestamptz not null default now(),
  foreign key (office_id, sender_id) references public.office_members(office_id, user_id) on delete cascade,
  foreign key (checkin_id, office_id) references public.checkins(id, office_id) on delete cascade
);

create or replace function public.protect_interaction_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.office_id is distinct from old.office_id
    or new.sender_id is distinct from old.sender_id
    or new.receiver_id is distinct from old.receiver_id
    or new.interaction_type is distinct from old.interaction_type
    or new.payload is distinct from old.payload
    or new.created_at is distinct from old.created_at then
    raise exception 'interaction_identity_is_immutable' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists interactions_protect_identity on public.interactions;
create trigger interactions_protect_identity
before update on public.interactions
for each row execute function public.protect_interaction_identity();

create index if not exists comments_checkin_created_idx
  on public.comments (checkin_id, created_at asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname, avatar_key, accent_color)
  values (
    new.id,
    left(coalesce(nullif(new.raw_user_meta_data ->> 'nickname', ''), split_part(coalesce(new.email, '新朋友'), '@', 1)), 24),
    coalesce(nullif(new.raw_user_meta_data ->> 'avatar_key', ''), 'ming'),
    case
      when new.raw_user_meta_data ->> 'accent_color' in ('sage', 'terracotta', 'blue', 'violet')
        then new.raw_user_meta_data ->> 'accent_color'
      else 'sage'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.is_office_member(target_office_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.office_members
    where office_id = target_office_id
      and user_id = (select auth.uid())
  );
$$;

create or replace function public.shares_office_with(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.office_members me
    join public.office_members them on them.office_id = me.office_id
    where me.user_id = (select auth.uid())
      and them.user_id = target_user_id
  );
$$;

create or replace function public.is_office_owner(target_office_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.offices
    where id = target_office_id
      and owner_id = (select auth.uid())
  );
$$;

revoke all on function public.is_office_member(uuid) from public, anon;
revoke all on function public.shares_office_with(uuid) from public, anon;
revoke all on function public.is_office_owner(uuid) from public, anon;
grant execute on function public.is_office_member(uuid) to authenticated;
grant execute on function public.shares_office_with(uuid) to authenticated;
grant execute on function public.is_office_owner(uuid) to authenticated;

create or replace function public.enforce_office_member_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  member_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.office_id::text, 0));
  select count(*) into member_count
  from public.office_members
  where office_id = new.office_id;

  if member_count >= 4 then
    raise exception 'office_is_full' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists office_members_limit_four on public.office_members;
create trigger office_members_limit_four
before insert on public.office_members
for each row execute function public.enforce_office_member_limit();

create or replace function public.create_office(p_name text, p_desk_key text default 'desk-a')
returns table (office_id uuid, invite_code text, desk_key text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  new_office_id uuid;
  generated_code text;
  normalized_desk text := lower(trim(p_desk_key));
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if char_length(trim(p_name)) not between 1 and 40 then
    raise exception 'invalid_office_name' using errcode = '22023';
  end if;
  if normalized_desk not in ('desk-a', 'desk-b', 'desk-c', 'desk-d') then
    raise exception 'invalid_desk_key' using errcode = '22023';
  end if;

  loop
    generated_code := upper(substr(encode(extensions.gen_random_bytes(6), 'hex'), 1, 8));
    exit when not exists (select 1 from public.offices where offices.invite_code = generated_code);
  end loop;

  insert into public.offices (name, invite_code, owner_id)
  values (trim(p_name), generated_code, current_user_id)
  returning id into new_office_id;

  insert into public.office_members (office_id, user_id, desk_key, role)
  values (new_office_id, current_user_id, normalized_desk, 'owner');

  return query select new_office_id, generated_code, normalized_desk;
end;
$$;

create or replace function public.join_office_by_code(p_invite_code text, p_desk_key text default null)
returns table (office_id uuid, desk_key text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  target_office_id uuid;
  selected_desk text;
  normalized_code text := upper(trim(p_invite_code));
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select id into target_office_id
  from public.offices
  where invite_code = normalized_code
  for update;

  if target_office_id is null then
    raise exception 'invalid_invite_code' using errcode = 'P0001';
  end if;

  select office_members.desk_key into selected_desk
  from public.office_members
  where office_members.office_id = target_office_id
    and office_members.user_id = current_user_id;

  if selected_desk is not null then
    return query select target_office_id, selected_desk;
    return;
  end if;

  if (select count(*) from public.office_members where office_members.office_id = target_office_id) >= 4 then
    raise exception 'office_is_full' using errcode = 'P0001';
  end if;

  if p_desk_key is not null then
    selected_desk := lower(trim(p_desk_key));
    if selected_desk not in ('desk-a', 'desk-b', 'desk-c', 'desk-d') then
      raise exception 'invalid_desk_key' using errcode = '22023';
    end if;
    if exists (
      select 1 from public.office_members
      where office_members.office_id = target_office_id
        and office_members.desk_key = selected_desk
    ) then
      raise exception 'desk_is_taken' using errcode = 'P0001';
    end if;
  else
    select candidate into selected_desk
    from unnest(array['desk-a', 'desk-b', 'desk-c', 'desk-d']) as candidate
    where not exists (
      select 1 from public.office_members
      where office_members.office_id = target_office_id
        and office_members.desk_key = candidate
    )
    limit 1;
  end if;

  insert into public.office_members (office_id, user_id, desk_key, role)
  values (target_office_id, current_user_id, selected_desk, 'member');

  return query select target_office_id, selected_desk;
end;
$$;

create or replace function public.set_current_status(
  p_office_id uuid,
  p_status text,
  p_message text default '',
  p_mood text default 'calm'
)
returns setof public.current_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  changed_at timestamptz;
  previous_status public.current_status%rowtype;
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.office_members
    where office_id = p_office_id and user_id = current_user_id
  ) then
    raise exception 'not_an_office_member' using errcode = '42501';
  end if;
  if p_status not in (
    'clockedIn', 'working', 'studying', 'busy', 'meeting', 'eating', 'coffee',
    'resting', 'napping', 'restroom', 'slacking', 'outside', 'offWork', 'overtime'
  ) then
    raise exception 'invalid_status' using errcode = '22023';
  end if;
  if char_length(coalesce(p_message, '')) > 60 then
    raise exception 'message_too_long' using errcode = '22001';
  end if;
  if p_mood not in ('energized', 'calm', 'tired', 'happy', 'blank') then
    raise exception 'invalid_mood' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_office_id::text || ':' || current_user_id::text, 0));

  select * into previous_status
  from public.current_status
  where office_id = p_office_id and user_id = current_user_id
  for update;

  if found
    and previous_status.status = p_status
    and previous_status.message = coalesce(p_message, '')
    and previous_status.mood = p_mood then
    return next previous_status;
    return;
  end if;

  changed_at := clock_timestamp();

  update public.checkins
  set ended_at = changed_at
  where office_id = p_office_id
    and user_id = current_user_id
    and ended_at is null;

  insert into public.current_status (office_id, user_id, status, message, mood, started_at, updated_at)
  values (p_office_id, current_user_id, p_status, coalesce(p_message, ''), p_mood, changed_at, changed_at)
  on conflict (office_id, user_id) do update
  set status = excluded.status,
      message = excluded.message,
      mood = excluded.mood,
      started_at = excluded.started_at,
      updated_at = excluded.updated_at
  returning * into previous_status;

  insert into public.checkins (office_id, user_id, status, message, mood, started_at, created_at)
  values (p_office_id, current_user_id, p_status, coalesce(p_message, ''), p_mood, changed_at, changed_at);

  return next previous_status;
end;
$$;

revoke all on function public.create_office(text, text) from public, anon;
revoke all on function public.join_office_by_code(text, text) from public, anon;
revoke all on function public.set_current_status(uuid, text, text, text) from public, anon;
grant execute on function public.create_office(text, text) to authenticated;
grant execute on function public.join_office_by_code(text, text) to authenticated;
grant execute on function public.set_current_status(uuid, text, text, text) to authenticated;

alter table public.profiles enable row level security;
alter table public.offices enable row level security;
alter table public.office_members enable row level security;
alter table public.current_status enable row level security;
alter table public.checkins enable row level security;
alter table public.interactions enable row level security;
alter table public.comments enable row level security;

drop policy if exists profiles_select_office_peers on public.profiles;
create policy profiles_select_office_peers on public.profiles
for select to authenticated
using (id = (select auth.uid()) or public.shares_office_with(id));

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
for insert to authenticated
with check (id = (select auth.uid()));

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists offices_select_members on public.offices;
create policy offices_select_members on public.offices
for select to authenticated
using (public.is_office_member(id) or owner_id = (select auth.uid()));

drop policy if exists offices_insert_owner on public.offices;
create policy offices_insert_owner on public.offices
for insert to authenticated
with check (owner_id = (select auth.uid()));

drop policy if exists offices_update_owner on public.offices;
create policy offices_update_owner on public.offices
for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

drop policy if exists offices_delete_owner on public.offices;
create policy offices_delete_owner on public.offices
for delete to authenticated
using (owner_id = (select auth.uid()));

drop policy if exists office_members_select_peers on public.office_members;
create policy office_members_select_peers on public.office_members
for select to authenticated
using (public.is_office_member(office_id));

drop policy if exists office_members_owner_bootstrap on public.office_members;
create policy office_members_owner_bootstrap on public.office_members
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and public.is_office_owner(office_id)
  and role = 'owner'
);

drop policy if exists current_status_select_members on public.current_status;
create policy current_status_select_members on public.current_status
for select to authenticated
using (public.is_office_member(office_id));

drop policy if exists checkins_select_members on public.checkins;
create policy checkins_select_members on public.checkins
for select to authenticated
using (public.is_office_member(office_id));

drop policy if exists interactions_select_members on public.interactions;
create policy interactions_select_members on public.interactions
for select to authenticated
using (public.is_office_member(office_id));

drop policy if exists interactions_insert_as_self on public.interactions;
create policy interactions_insert_as_self on public.interactions
for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and public.is_office_member(office_id)
  and exists (
    select 1 from public.office_members receiver
    where receiver.office_id = interactions.office_id
      and receiver.user_id = interactions.receiver_id
  )
);

drop policy if exists interactions_mark_received on public.interactions;
create policy interactions_mark_received on public.interactions
for update to authenticated
using (receiver_id = (select auth.uid()) and public.is_office_member(office_id))
with check (receiver_id = (select auth.uid()) and public.is_office_member(office_id));

drop policy if exists comments_select_members on public.comments;
create policy comments_select_members on public.comments
for select to authenticated
using (public.is_office_member(office_id));

drop policy if exists comments_insert_as_self on public.comments;
create policy comments_insert_as_self on public.comments
for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and public.is_office_member(office_id)
  and exists (
    select 1 from public.checkins target_checkin
    where target_checkin.id = comments.checkin_id
      and target_checkin.office_id = comments.office_id
  )
);

drop policy if exists comments_delete_self on public.comments;
create policy comments_delete_self on public.comments
for delete to authenticated
using (sender_id = (select auth.uid()) and public.is_office_member(office_id));

revoke all on table public.profiles, public.offices, public.office_members,
  public.current_status, public.checkins, public.interactions, public.comments from anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.offices to authenticated;
grant select, insert on table public.office_members to authenticated;
grant select on table public.current_status to authenticated;
grant select on table public.checkins to authenticated;
grant select, insert, update on table public.interactions to authenticated;
grant select, insert, delete on table public.comments to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'current_status'
  ) then
    alter publication supabase_realtime add table public.current_status;
  end if;
end;
$$;

commit;
