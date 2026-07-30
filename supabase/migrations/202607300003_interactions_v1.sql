begin;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'interactions_sender_receiver_different'
      and conrelid = 'public.interactions'::regclass
  ) then
    alter table public.interactions
      add constraint interactions_sender_receiver_different
      check (sender_id <> receiver_id) not valid;
  end if;
end;
$$;

create index if not exists interactions_office_created_idx
  on public.interactions (office_id, created_at desc);

create or replace function public.send_interaction(
  p_office_id uuid,
  p_receiver_id uuid,
  p_interaction_type text,
  p_payload jsonb default '{}'::jsonb
)
returns setof public.interactions
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  normalized_type text := lower(trim(coalesce(p_interaction_type, '')));
  normalized_payload jsonb := coalesce(p_payload, '{}'::jsonb);
  reaction_key text;
  message_content text;
  inserted_interaction public.interactions%rowtype;
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if p_receiver_id is null or p_receiver_id = current_user_id then
    raise exception 'invalid_interaction_receiver' using errcode = '22023';
  end if;

  if normalized_type not in ('poke', 'send_coffee', 'reaction', 'short_message') then
    raise exception 'unsupported_interaction_type' using errcode = '22023';
  end if;

  if jsonb_typeof(normalized_payload) <> 'object' then
    raise exception 'invalid_interaction_payload' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.office_members sender
    where sender.office_id = p_office_id
      and sender.user_id = current_user_id
  ) then
    raise exception 'not_an_office_member' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.office_members receiver
    where receiver.office_id = p_office_id
      and receiver.user_id = p_receiver_id
  ) then
    raise exception 'receiver_not_in_office' using errcode = '42501';
  end if;

  if normalized_type = 'reaction' then
    reaction_key := lower(trim(coalesce(normalized_payload ->> 'reaction', '')));
    if reaction_key not in ('like', 'laugh', 'hug', 'fish', 'cheer') then
      raise exception 'invalid_reaction' using errcode = '22023';
    end if;
    normalized_payload := jsonb_build_object('reaction', reaction_key);
  elsif normalized_type = 'short_message' then
    message_content := trim(coalesce(normalized_payload ->> 'content', ''));
    if char_length(message_content) < 1 then
      raise exception 'empty_short_message' using errcode = '22023';
    end if;
    if char_length(message_content) > 60 then
      raise exception 'short_message_too_long' using errcode = '22001';
    end if;
    normalized_payload := jsonb_build_object('content', message_content);
  else
    normalized_payload := '{}'::jsonb;
  end if;

  insert into public.interactions (
    office_id,
    sender_id,
    receiver_id,
    interaction_type,
    payload
  ) values (
    p_office_id,
    current_user_id,
    p_receiver_id,
    normalized_type,
    normalized_payload
  )
  returning * into inserted_interaction;

  return next inserted_interaction;
end;
$$;

create or replace function public.mark_interaction_read(p_interaction_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  marked_at timestamptz;
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  update public.interactions
  set read_at = coalesce(read_at, clock_timestamp())
  where id = p_interaction_id
    and receiver_id = current_user_id
  returning read_at into marked_at;

  if marked_at is null then
    raise exception 'interaction_not_found_or_not_receiver' using errcode = '42501';
  end if;

  return marked_at;
end;
$$;

revoke all on function public.send_interaction(uuid, uuid, text, jsonb) from public, anon;
revoke all on function public.mark_interaction_read(uuid) from public, anon;
grant execute on function public.send_interaction(uuid, uuid, text, jsonb) to authenticated;
grant execute on function public.mark_interaction_read(uuid) to authenticated;

revoke insert, update on table public.interactions from authenticated;
grant select on table public.interactions to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'interactions'
  ) then
    alter publication supabase_realtime add table public.interactions;
  end if;
end;
$$;

commit;
