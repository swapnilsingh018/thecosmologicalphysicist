-- Inner Observatory — run in the Supabase SQL editor for this project.
-- Run once before putting a publishable key in assets/portal-config.js.
-- This is an invite-only, read-only collaborator portal.
-- Never run this with credentials from a browser or commit a secret key.

create table if not exists public.research_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.research_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create index if not exists project_members_user_id_idx
  on public.project_members (user_id);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.research_projects(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 255),
  storage_path text not null unique,
  created_at timestamptz not null default now(),
  constraint project_file_folder_matches_project
    check (storage_path like (project_id::text || '/%'))
);

create index if not exists project_files_project_id_idx
  on public.project_files (project_id);

-- Authentication alone is not authorization. Row-Level Security enforces
-- membership independently of what the browser chooses to display.
alter table public.research_projects enable row level security;
alter table public.project_members enable row level security;
alter table public.project_files enable row level security;

revoke all on public.research_projects from public, anon, authenticated;
revoke all on public.project_members from public, anon, authenticated;
revoke all on public.project_files from public, anon, authenticated;
grant select on public.research_projects to authenticated;
grant select on public.project_members to authenticated;
grant select on public.project_files to authenticated;

drop policy if exists "inner_observatory_own_membership" on public.project_members;
create policy "inner_observatory_own_membership"
  on public.project_members for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "inner_observatory_assigned_projects" on public.research_projects;
create policy "inner_observatory_assigned_projects"
  on public.research_projects for select to authenticated
  using (
    exists (
      select 1 from public.project_members as membership
      where membership.project_id = research_projects.id
        and membership.user_id = (select auth.uid())
    )
  );

drop policy if exists "inner_observatory_assigned_files" on public.project_files;
create policy "inner_observatory_assigned_files"
  on public.project_files for select to authenticated
  using (
    exists (
      select 1 from public.project_members as membership
      where membership.project_id = project_files.project_id
        and membership.user_id = (select auth.uid())
    )
  );

-- Important: the bucket is PRIVATE. There are no browser upload policies.
insert into storage.buckets (id, name, public)
values ('inner-observatory', 'inner-observatory', false)
on conflict (id) do update set public = false;

-- A private object can be signed/read only if it is explicitly listed in
-- project_files and the current user belongs to that file's project.
drop policy if exists "inner_observatory_member_download" on storage.objects;
create policy "inner_observatory_member_download"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'inner-observatory'
    and exists (
      select 1 from public.project_files as file
      join public.project_members as membership
        on membership.project_id = file.project_id
      where file.storage_path = storage.objects.name
        and membership.user_id = (select auth.uid())
    )
  );

-- Project creation, membership grants, file registration and file uploads
-- are administrator-only operations through the Supabase Dashboard.
-- DO NOT create general authenticated INSERT/UPDATE/DELETE policies here.
