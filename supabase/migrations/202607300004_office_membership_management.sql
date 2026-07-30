begin;

create or replace function public.get_my_office_info()
returns table (
  office_id uuid,
  office_name text,
  invite_code text,
  owner_id uuid,
  current_user_role text,
  current_user_desk_key text,
  member_count integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  return query
  select
    offices.id,
    offices.name,
    offices.invite_code,
    offices.owner_id,
    members.role,
    members.desk_key,
    (
      select count(*)::integer
      from public.office_members office_member_count
      where office_member_count.office_id = offices.id
    )
  from public.office_members members
  join public.offices offices on offices.id = members.office_id
  where members.user_id = current_user_id
  limit 1;

  if not found then
    raise exception 'not_an_office_member' using errcode = '42501';
  end if;
end;
$$;

create or replace function public.leave_office()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  target_office_id uuid;
  current_role text;
  office_owner_id uuid;
  current_member_count integer;
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select members.office_id, members.role
  into target_office_id, current_role
  from public.office_members members
  where members.user_id = current_user_id
  for update;

  if target_office_id is null then
    raise exception 'not_an_office_member' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_office_id::text, 0));

  select offices.owner_id
  into office_owner_id
  from public.offices offices
  where offices.id = target_office_id
  for update;

  select count(*)::integer
  into current_member_count
  from public.office_members members
  where members.office_id = target_office_id;

  if current_role = 'owner' or office_owner_id = current_user_id then
    if current_member_count > 1 then
      raise exception 'ownership_transfer_required' using errcode = '42501';
    end if;
    raise exception 'owner_must_delete_office' using errcode = '42501';
  end if;

  delete from public.current_status
  where current_status.office_id = target_office_id
    and current_status.user_id = current_user_id;

  delete from public.office_members
  where office_members.office_id = target_office_id
    and office_members.user_id = current_user_id;

  return true;
end;
$$;

create or replace function public.transfer_office_ownership(p_new_owner_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  target_office_id uuid;
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if p_new_owner_id is null or p_new_owner_id = current_user_id then
    raise exception 'invalid_new_owner' using errcode = '22023';
  end if;

  select offices.id
  into target_office_id
  from public.offices offices
  where offices.owner_id = current_user_id
  for update;

  if target_office_id is null then
    raise exception 'owner_permission_required' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_office_id::text, 0));

  perform 1
  from public.office_members members
  where members.office_id = target_office_id
    and members.user_id = p_new_owner_id
  for update;

  if not found then
    raise exception 'new_owner_not_in_office' using errcode = '42501';
  end if;

  update public.office_members
  set role = case
    when user_id = current_user_id then 'member'
    when user_id = p_new_owner_id then 'owner'
    else role
  end
  where office_id = target_office_id
    and user_id in (current_user_id, p_new_owner_id);

  update public.offices
  set owner_id = p_new_owner_id
  where id = target_office_id
    and owner_id = current_user_id;

  if not found then
    raise exception 'ownership_changed_concurrently' using errcode = '40001';
  end if;

  return true;
end;
$$;

create or replace function public.delete_my_office()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  target_office_id uuid;
  current_member_count integer;
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  select offices.id
  into target_office_id
  from public.offices offices
  where offices.owner_id = current_user_id
  for update;

  if target_office_id is null then
    raise exception 'owner_permission_required' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_office_id::text, 0));

  select count(*)::integer
  into current_member_count
  from public.office_members members
  where members.office_id = target_office_id;

  if current_member_count <> 1 then
    raise exception 'ownership_transfer_required' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.office_members members
    where members.office_id = target_office_id
      and members.user_id = current_user_id
      and members.role = 'owner'
  ) then
    raise exception 'owner_membership_required' using errcode = '42501';
  end if;

  delete from public.offices
  where offices.id = target_office_id
    and offices.owner_id = current_user_id;

  return true;
end;
$$;

revoke all on function public.get_my_office_info() from public, anon, authenticated;
revoke all on function public.leave_office() from public, anon, authenticated;
revoke all on function public.transfer_office_ownership(uuid) from public, anon, authenticated;
revoke all on function public.delete_my_office() from public, anon, authenticated;
grant execute on function public.get_my_office_info() to authenticated;
grant execute on function public.leave_office() to authenticated;
grant execute on function public.transfer_office_ownership(uuid) to authenticated;
grant execute on function public.delete_my_office() to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'office_members'
  ) then
    alter publication supabase_realtime add table public.office_members;
  end if;
end;
$$;

commit;
