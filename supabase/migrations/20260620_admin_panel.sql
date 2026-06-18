create schema if not exists private;

create table if not exists public.admin_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null,
  status text not null default 'active',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_memberships_role_check check (role in ('admin', 'mentor', 'content_editor')),
  constraint admin_memberships_status_check check (status in ('active', 'suspended'))
);

create or replace function private.is_admin_member(required_roles text[] default array['admin']::text[])
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.admin_memberships
    where user_id = (select auth.uid())
      and status = 'active'
      and role = any(required_roles)
  );
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke execute on function private.is_admin_member(text[]) from public;
grant execute on function private.is_admin_member(text[]) to authenticated;

create table if not exists public.catalog_courses (
  id text primary key,
  title text not null,
  description text not null default '',
  track text not null default '',
  difficulty text not null default 'Beginner',
  cover_url text,
  tags jsonb not null default '[]'::jsonb,
  enrollment_settings jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_courses_difficulty_check check (difficulty in ('Beginner', 'Intermediate')),
  constraint catalog_courses_status_check check (status in ('draft', 'published', 'archived'))
);

create table if not exists public.catalog_lessons (
  id text primary key,
  course_id text not null references public.catalog_courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  cover_url text,
  duration text not null default '',
  video_label text not null default 'Video placeholder',
  video_url text,
  video_source_type text not null default 'external',
  assignment_title text not null default 'Lesson assignment',
  assignment_prompt text not null default '',
  assignment_accepts_files boolean not null default true,
  assignment_accepted_file_types jsonb not null default '[]'::jsonb,
  assignment_max_file_size_mb integer not null default 10,
  assignment_submit_label text not null default 'Submit assignment',
  assignment_rubric jsonb not null default '[]'::jsonb,
  assignment_management_config jsonb not null default '{}'::jsonb,
  mentor_lm_note_config jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_lessons_video_source_check check (video_source_type in ('youtube', 'telegram', 'file', 'external')),
  constraint catalog_lessons_status_check check (status in ('draft', 'published', 'archived')),
  constraint catalog_lessons_course_lesson_key unique (course_id, id)
);

create table if not exists public.catalog_materials (
  id text primary key,
  course_id text not null references public.catalog_courses(id) on delete cascade,
  lesson_id text not null references public.catalog_lessons(id) on delete cascade,
  title text not null,
  description text not null default '',
  kind text not null default 'document',
  url text not null default '',
  storage_path text,
  downloadable boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_materials_kind_check check (kind in ('document', 'download', 'link'))
);

create table if not exists public.catalog_quiz_questions (
  id text primary key,
  course_id text not null references public.catalog_courses(id) on delete cascade,
  lesson_id text not null references public.catalog_lessons(id) on delete cascade,
  prompt text not null,
  type text not null default 'radio',
  correct_answer text not null default '',
  accepted_answers jsonb not null default '[]'::jsonb,
  feedback_correct text not null default '',
  feedback_incorrect text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_quiz_questions_type_check check (type in ('radio', 'text'))
);

create table if not exists public.catalog_quiz_choices (
  id text primary key,
  question_id text not null references public.catalog_quiz_questions(id) on delete cascade,
  label text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_opportunities (
  id text primary key,
  title text not null,
  category text not null default '',
  direction text not null default '',
  format text not null default 'Online',
  deadline text not null default '',
  grades jsonb not null default '[]'::jsonb,
  location text not null default '',
  description text not null default '',
  requirements text not null default '',
  tags jsonb not null default '[]'::jsonb,
  apply_url text not null default '',
  event_date text,
  is_recurring boolean not null default false,
  posted_at text,
  source_language text,
  source_title text,
  source_description text,
  source_requirements text,
  translations jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_opportunities_format_check check (format in ('Online', 'Offline', 'Hybrid')),
  constraint catalog_opportunities_status_check check (status in ('draft', 'published', 'archived'))
);

alter table public.lesson_assignment_submissions
  add column if not exists review_status text not null default 'submitted',
  add column if not exists score numeric(5,2),
  add column if not exists feedback_text text,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lesson_assignment_submissions_review_status_check'
  ) then
    alter table public.lesson_assignment_submissions
      add constraint lesson_assignment_submissions_review_status_check
      check (review_status in ('submitted', 'reviewed', 'revision_requested'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'lesson_assignment_submissions_score_check'
  ) then
    alter table public.lesson_assignment_submissions
      add constraint lesson_assignment_submissions_score_check
      check (score is null or (score >= 0 and score <= 10));
  end if;
end $$;

create table if not exists public.assignment_review_events (
  id bigint generated by default as identity primary key,
  submission_id bigint not null references public.lesson_assignment_submissions(id) on delete cascade,
  actor_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  from_status text,
  to_status text,
  score numeric(5,2),
  feedback_text text,
  created_at timestamptz not null default now(),
  constraint assignment_review_events_type_check check (event_type in ('reviewed', 'revision_requested', 'commented'))
);

create index if not exists admin_memberships_role_status_idx
  on public.admin_memberships (role, status);
create index if not exists catalog_lessons_course_idx
  on public.catalog_lessons (course_id, sort_order);
create index if not exists catalog_materials_lesson_idx
  on public.catalog_materials (lesson_id, sort_order);
create index if not exists catalog_quiz_questions_lesson_idx
  on public.catalog_quiz_questions (lesson_id, sort_order);
create index if not exists catalog_quiz_choices_question_idx
  on public.catalog_quiz_choices (question_id, sort_order);
create index if not exists catalog_opportunities_status_idx
  on public.catalog_opportunities (status, sort_order);
create index if not exists lesson_assignment_submissions_review_idx
  on public.lesson_assignment_submissions (review_status, submitted_at desc);
create index if not exists assignment_review_events_submission_idx
  on public.assignment_review_events (submission_id, created_at desc);

alter table public.admin_memberships enable row level security;
alter table public.catalog_courses enable row level security;
alter table public.catalog_lessons enable row level security;
alter table public.catalog_materials enable row level security;
alter table public.catalog_quiz_questions enable row level security;
alter table public.catalog_quiz_choices enable row level security;
alter table public.catalog_opportunities enable row level security;
alter table public.assignment_review_events enable row level security;

drop policy if exists "Staff can read own membership or admins can read all" on public.admin_memberships;
create policy "Staff can read own membership or admins can read all"
  on public.admin_memberships
  for select
  to authenticated
  using (user_id = (select auth.uid()) or private.is_admin_member(array['admin']));

drop policy if exists "Admins can insert memberships" on public.admin_memberships;
create policy "Admins can insert memberships"
  on public.admin_memberships
  for insert
  to authenticated
  with check (private.is_admin_member(array['admin']));

drop policy if exists "Admins can update memberships" on public.admin_memberships;
create policy "Admins can update memberships"
  on public.admin_memberships
  for update
  to authenticated
  using (private.is_admin_member(array['admin']))
  with check (private.is_admin_member(array['admin']));

drop policy if exists "Staff can read student profiles" on public.profiles;
create policy "Staff can read student profiles"
  on public.profiles
  for select
  to authenticated
  using (private.is_admin_member(array['admin', 'mentor']));

drop policy if exists "Staff can read catalog courses" on public.catalog_courses;
create policy "Staff can read catalog courses"
  on public.catalog_courses for select to authenticated
  using (private.is_admin_member(array['admin', 'mentor', 'content_editor']));
drop policy if exists "Editors can insert catalog courses" on public.catalog_courses;
create policy "Editors can insert catalog courses"
  on public.catalog_courses for insert to authenticated
  with check (private.is_admin_member(array['admin', 'content_editor']));
drop policy if exists "Editors can update catalog courses" on public.catalog_courses;
create policy "Editors can update catalog courses"
  on public.catalog_courses for update to authenticated
  using (private.is_admin_member(array['admin', 'content_editor']))
  with check (private.is_admin_member(array['admin', 'content_editor']));

drop policy if exists "Staff can read catalog lessons" on public.catalog_lessons;
create policy "Staff can read catalog lessons"
  on public.catalog_lessons for select to authenticated
  using (private.is_admin_member(array['admin', 'mentor', 'content_editor']));
drop policy if exists "Editors can insert catalog lessons" on public.catalog_lessons;
create policy "Editors can insert catalog lessons"
  on public.catalog_lessons for insert to authenticated
  with check (private.is_admin_member(array['admin', 'content_editor']));
drop policy if exists "Editors can update catalog lessons" on public.catalog_lessons;
create policy "Editors can update catalog lessons"
  on public.catalog_lessons for update to authenticated
  using (private.is_admin_member(array['admin', 'content_editor']))
  with check (private.is_admin_member(array['admin', 'content_editor']));

drop policy if exists "Staff can read catalog materials" on public.catalog_materials;
create policy "Staff can read catalog materials"
  on public.catalog_materials for select to authenticated
  using (private.is_admin_member(array['admin', 'mentor', 'content_editor']));
drop policy if exists "Editors can insert catalog materials" on public.catalog_materials;
create policy "Editors can insert catalog materials"
  on public.catalog_materials for insert to authenticated
  with check (private.is_admin_member(array['admin', 'content_editor']));
drop policy if exists "Editors can update catalog materials" on public.catalog_materials;
create policy "Editors can update catalog materials"
  on public.catalog_materials for update to authenticated
  using (private.is_admin_member(array['admin', 'content_editor']))
  with check (private.is_admin_member(array['admin', 'content_editor']));

drop policy if exists "Staff can read catalog quiz questions" on public.catalog_quiz_questions;
create policy "Staff can read catalog quiz questions"
  on public.catalog_quiz_questions for select to authenticated
  using (private.is_admin_member(array['admin', 'mentor', 'content_editor']));
drop policy if exists "Editors can insert catalog quiz questions" on public.catalog_quiz_questions;
create policy "Editors can insert catalog quiz questions"
  on public.catalog_quiz_questions for insert to authenticated
  with check (private.is_admin_member(array['admin', 'content_editor']));
drop policy if exists "Editors can update catalog quiz questions" on public.catalog_quiz_questions;
create policy "Editors can update catalog quiz questions"
  on public.catalog_quiz_questions for update to authenticated
  using (private.is_admin_member(array['admin', 'content_editor']))
  with check (private.is_admin_member(array['admin', 'content_editor']));

drop policy if exists "Staff can read catalog quiz choices" on public.catalog_quiz_choices;
create policy "Staff can read catalog quiz choices"
  on public.catalog_quiz_choices for select to authenticated
  using (private.is_admin_member(array['admin', 'mentor', 'content_editor']));
drop policy if exists "Editors can insert catalog quiz choices" on public.catalog_quiz_choices;
create policy "Editors can insert catalog quiz choices"
  on public.catalog_quiz_choices for insert to authenticated
  with check (private.is_admin_member(array['admin', 'content_editor']));
drop policy if exists "Editors can update catalog quiz choices" on public.catalog_quiz_choices;
create policy "Editors can update catalog quiz choices"
  on public.catalog_quiz_choices for update to authenticated
  using (private.is_admin_member(array['admin', 'content_editor']))
  with check (private.is_admin_member(array['admin', 'content_editor']));

drop policy if exists "Staff can read catalog opportunities" on public.catalog_opportunities;
create policy "Staff can read catalog opportunities"
  on public.catalog_opportunities for select to authenticated
  using (private.is_admin_member(array['admin', 'mentor', 'content_editor']));
drop policy if exists "Editors can insert catalog opportunities" on public.catalog_opportunities;
create policy "Editors can insert catalog opportunities"
  on public.catalog_opportunities for insert to authenticated
  with check (private.is_admin_member(array['admin', 'content_editor']));
drop policy if exists "Editors can update catalog opportunities" on public.catalog_opportunities;
create policy "Editors can update catalog opportunities"
  on public.catalog_opportunities for update to authenticated
  using (private.is_admin_member(array['admin', 'content_editor']))
  with check (private.is_admin_member(array['admin', 'content_editor']));

drop policy if exists "Staff can read assignment submissions" on public.lesson_assignment_submissions;
create policy "Staff can read assignment submissions"
  on public.lesson_assignment_submissions
  for select
  to authenticated
  using (private.is_admin_member(array['admin', 'mentor']));

drop policy if exists "Staff can read assignment review events" on public.assignment_review_events;
create policy "Staff can read assignment review events"
  on public.assignment_review_events
  for select
  to authenticated
  using (private.is_admin_member(array['admin', 'mentor']));

drop policy if exists "Staff can insert assignment review events" on public.assignment_review_events;
create policy "Staff can insert assignment review events"
  on public.assignment_review_events
  for insert
  to authenticated
  with check (private.is_admin_member(array['admin', 'mentor']) and actor_id = (select auth.uid()));

drop policy if exists "Staff can read MentorLM lesson notes" on public.mentor_lm_lesson_notes;
create policy "Staff can read MentorLM lesson notes"
  on public.mentor_lm_lesson_notes
  for select
  to authenticated
  using (private.is_admin_member(array['admin', 'mentor']));

create or replace function public.review_assignment_submission(
  p_submission_id bigint,
  p_review_status text,
  p_score numeric default null,
  p_feedback_text text default null
)
returns public.lesson_assignment_submissions
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  actor uuid := auth.uid();
  before_status text;
  updated_row public.lesson_assignment_submissions;
begin
  if actor is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if not private.is_admin_member(array['admin', 'mentor']) then
    raise exception 'Admin or mentor access required' using errcode = '42501';
  end if;

  if p_review_status not in ('reviewed', 'revision_requested') then
    raise exception 'Invalid review status' using errcode = '22023';
  end if;

  select review_status
    into before_status
  from public.lesson_assignment_submissions
  where id = p_submission_id
  for update;

  if before_status is null then
    raise exception 'Submission not found' using errcode = 'P0002';
  end if;

  update public.lesson_assignment_submissions
  set
    review_status = p_review_status,
    score = p_score,
    feedback_text = nullif(btrim(coalesce(p_feedback_text, '')), ''),
    reviewed_by = actor,
    reviewed_at = now(),
    updated_at = now()
  where id = p_submission_id
  returning * into updated_row;

  insert into public.assignment_review_events (
    submission_id,
    actor_id,
    event_type,
    from_status,
    to_status,
    score,
    feedback_text
  )
  values (
    p_submission_id,
    actor,
    p_review_status,
    before_status,
    p_review_status,
    p_score,
    nullif(btrim(coalesce(p_feedback_text, '')), '')
  );

  return updated_row;
end;
$$;

revoke execute on function public.review_assignment_submission(bigint, text, numeric, text) from public;
grant execute on function public.review_assignment_submission(bigint, text, numeric, text) to authenticated;

drop trigger if exists admin_memberships_set_updated_at on public.admin_memberships;
create trigger admin_memberships_set_updated_at
  before update on public.admin_memberships
  for each row execute function public.set_updated_at();
drop trigger if exists catalog_courses_set_updated_at on public.catalog_courses;
create trigger catalog_courses_set_updated_at
  before update on public.catalog_courses
  for each row execute function public.set_updated_at();
drop trigger if exists catalog_lessons_set_updated_at on public.catalog_lessons;
create trigger catalog_lessons_set_updated_at
  before update on public.catalog_lessons
  for each row execute function public.set_updated_at();
drop trigger if exists catalog_materials_set_updated_at on public.catalog_materials;
create trigger catalog_materials_set_updated_at
  before update on public.catalog_materials
  for each row execute function public.set_updated_at();
drop trigger if exists catalog_quiz_questions_set_updated_at on public.catalog_quiz_questions;
create trigger catalog_quiz_questions_set_updated_at
  before update on public.catalog_quiz_questions
  for each row execute function public.set_updated_at();
drop trigger if exists catalog_quiz_choices_set_updated_at on public.catalog_quiz_choices;
create trigger catalog_quiz_choices_set_updated_at
  before update on public.catalog_quiz_choices
  for each row execute function public.set_updated_at();
drop trigger if exists catalog_opportunities_set_updated_at on public.catalog_opportunities;
create trigger catalog_opportunities_set_updated_at
  before update on public.catalog_opportunities
  for each row execute function public.set_updated_at();

revoke update on table public.lesson_assignment_submissions from authenticated;
grant select, insert, update on table public.admin_memberships to authenticated;
grant select, insert, update on table public.catalog_courses to authenticated;
grant select, insert, update on table public.catalog_lessons to authenticated;
grant select, insert, update on table public.catalog_materials to authenticated;
grant select, insert, update on table public.catalog_quiz_questions to authenticated;
grant select, insert, update on table public.catalog_quiz_choices to authenticated;
grant select, insert, update on table public.catalog_opportunities to authenticated;
grant select, insert on table public.assignment_review_events to authenticated;
grant select, insert on table public.lesson_assignment_submissions to authenticated;
grant update (answer, attachment_path, attachment_name, submitted_at, updated_at)
  on table public.lesson_assignment_submissions to authenticated;

grant usage, select on sequence public.assignment_review_events_id_seq to authenticated;

grant all on table public.admin_memberships to service_role;
grant all on table public.catalog_courses to service_role;
grant all on table public.catalog_lessons to service_role;
grant all on table public.catalog_materials to service_role;
grant all on table public.catalog_quiz_questions to service_role;
grant all on table public.catalog_quiz_choices to service_role;
grant all on table public.catalog_opportunities to service_role;
grant all on table public.assignment_review_events to service_role;
grant all on sequence public.assignment_review_events_id_seq to service_role;
