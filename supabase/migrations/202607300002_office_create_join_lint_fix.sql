begin;

create or replace function public.create_office(p_name text)
returns table (
  office_id uuid,
  office_name text,
  invite_code text,
  desk_key text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  normalized_name text := btrim(coalesce(p_name, ''));
  new_office_id uuid;
  generated_code text;
  random_bytes bytea;
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  changed_at timestamptz := clock_timestamp();
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if char_length(normalized_name) not between 2 and 30 then
    raise exception 'invalid_office_name' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('office-user:' || current_user_id::text, 0));

  if exists (
    select 1
    from public.office_members
    where user_id = current_user_id
  ) then
    raise exception 'already_in_office' using errcode = 'P0001';
  end if;

  for code_attempt in 1..20 loop
    random_bytes := extensions.gen_random_bytes(6);
    generated_code := '';
    for code_byte_index in 0..5 loop
      generated_code := generated_code || substr(
        alphabet,
        (get_byte(random_bytes, code_byte_index) % char_length(alphabet)) + 1,
        1
      );
    end loop;

    begin
      insert into public.offices (name, invite_code, owner_id)
      values (normalized_name, generated_code, current_user_id)
      returning id into new_office_id;
      exit;
    exception
      when unique_violation then
        new_office_id := null;
    end;
  end loop;

  if new_office_id is null then
    raise exception 'invite_code_generation_failed' using errcode = 'P0001';
  end if;

  insert into public.office_members (office_id, user_id, desk_key, role, joined_at)
  values (new_office_id, current_user_id, 'desk_1', 'owner', changed_at);

  insert into public.current_status (
    office_id,
    user_id,
    status,
    message,
    mood,
    started_at,
    updated_at
  )
  values (
    new_office_id,
    current_user_id,
    'offWork',
    '还没到工位',
    'calm',
    changed_at,
    changed_at
  )
  on conflict on constraint current_status_pkey do nothing;

  return query
  select new_office_id, normalized_name, generated_code, 'desk_1'::text;
end;
$$;

create or replace function public.join_office(p_invite_code text, p_desk_key text)
returns table (
  office_id uuid,
  office_name text,
  invite_code text,
  desk_key text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  normalized_code text := upper(regexp_replace(coalesce(p_invite_code, ''), '\s+', '', 'g'));
  normalized_desk text := lower(btrim(coalesce(p_desk_key, '')));
  target_office_id uuid;
  target_office_name text;
  member_count integer;
  changed_at timestamptz := clock_timestamp();
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if normalized_code !~ '^[A-HJ-NP-Z2-9]{6}$' then
    raise exception 'invalid_invite_code' using errcode = 'P0001';
  end if;

  if normalized_desk not in ('desk_1', 'desk_2', 'desk_3', 'desk_4') then
    raise exception 'invalid_desk_key' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('office-user:' || current_user_id::text, 0));

  if exists (
    select 1
    from public.office_members
    where user_id = current_user_id
  ) then
    raise exception 'already_in_office' using errcode = 'P0001';
  end if;

  select offices.id, offices.name
  into target_office_id, target_office_name
  from public.offices
  where offices.invite_code = normalized_code
  for update;

  if target_office_id is null then
    raise exception 'invalid_invite_code' using errcode = 'P0001';
  end if;

  perform 1
  from public.office_members
  where office_members.office_id = target_office_id
  for update;

  select count(*)::integer
  into member_count
  from public.office_members
  where office_members.office_id = target_office_id;

  if member_count >= 4 then
    raise exception 'office_is_full' using errcode = 'P0001';
  end if;

  if exists (
    select 1
    from public.office_members
    where office_members.office_id = target_office_id
      and office_members.desk_key = normalized_desk
  ) then
    raise exception 'desk_is_taken' using errcode = 'P0001';
  end if;

  begin
    insert into public.office_members (office_id, user_id, desk_key, role, joined_at)
    values (target_office_id, current_user_id, normalized_desk, 'member', changed_at);
  exception
    when unique_violation then
      if exists (
        select 1
        from public.office_members
        where office_members.office_id = target_office_id
          and office_members.desk_key = normalized_desk
      ) then
        raise exception 'desk_is_taken' using errcode = 'P0001';
      end if;
      raise exception 'already_in_office' using errcode = 'P0001';
  end;

  insert into public.current_status (
    office_id,
    user_id,
    status,
    message,
    mood,
    started_at,
    updated_at
  )
  values (
    target_office_id,
    current_user_id,
    'offWork',
    '还没到工位',
    'calm',
    changed_at,
    changed_at
  )
  on conflict on constraint current_status_pkey do nothing;

  return query
  select target_office_id, target_office_name, normalized_code, normalized_desk;
end;
$$;

revoke all on function public.create_office(text) from public, anon, authenticated;
revoke all on function public.join_office(text, text) from public, anon, authenticated;
grant execute on function public.create_office(text) to authenticated;
grant execute on function public.join_office(text, text) to authenticated;

commit;
