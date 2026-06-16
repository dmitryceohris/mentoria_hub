create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  grade text not null default '',
  interests jsonb not null default '[]'::jsonb,
  academic_direction text not null default '',
  opportunity_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    name,
    email,
    grade,
    interests,
    academic_direction,
    opportunity_preferences
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'grade', ''),
    coalesce(new.raw_user_meta_data -> 'interests', '[]'::jsonb),
    coalesce(new.raw_user_meta_data ->> 'academic_direction', ''),
    coalesce(new.raw_user_meta_data -> 'opportunity_preferences', '{}'::jsonb)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
