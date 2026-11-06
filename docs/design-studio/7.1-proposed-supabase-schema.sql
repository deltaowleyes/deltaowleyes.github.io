-- Website Design Studio 7.1 — proposed Supabase schema.
-- NOT DEPLOYED. Review and apply only after Supabase project configuration.
-- Auth is provided by Supabase Auth; GitHub Pages itself cannot authenticate users.
begin;
create extension if not exists pgcrypto;
create table if not exists public.design_studio_projects (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,80}$'),
 title text not null,
 owner_id uuid not null references auth.users(id) on delete restrict,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.design_studio_memberships (
 project_id uuid not null references public.design_studio_projects(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null check (role in ('owner','editor','viewer')),
 primary key(project_id,user_id)
);
create table if not exists public.design_studio_candidates (
 id uuid primary key default gen_random_uuid(),
 project_id uuid not null references public.design_studio_projects(id) on delete cascade,
 parent_candidate_id uuid references public.design_studio_candidates(id) on delete restrict,
 stage integer not null check (stage in (1,2)),
 ordinal integer not null check (ordinal between 1 and 6),
 title text not null,
 preview_path text not null check (preview_path like '/%'),
 created_at timestamptz not null default now(),
 unique(project_id,stage,parent_candidate_id,ordinal)
);
create table if not exists public.design_studio_decisions (
 project_id uuid primary key references public.design_studio_projects(id) on delete cascade,
 selected_direction_id uuid references public.design_studio_candidates(id) on delete set null,
 selected_refinement_id uuid references public.design_studio_candidates(id) on delete set null,
 approval_status text not null default 'draft' check (approval_status in ('draft','review','approved')),
 approved_at timestamptz,
 approved_by uuid references auth.users(id),
 updated_at timestamptz not null default now()
);
-- RLS is mandatory even if API keys are accidentally exposed.
alter table public.design_studio_projects enable row level security;
alter table public.design_studio_memberships enable row level security;
alter table public.design_studio_candidates enable row level security;
alter table public.design_studio_decisions enable row level security;
-- SECURITY DEFINER helper avoids recursive membership-policy evaluation.
create or replace function public.design_studio_can_access(p_project uuid, p_write boolean default false)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists (
   select 1 from public.design_studio_projects p
   where p.id=p_project and p.owner_id=(select auth.uid())
 ) or exists (
   select 1 from public.design_studio_memberships m
   where m.project_id=p_project and m.user_id=(select auth.uid())
   and (not p_write or m.role in ('owner','editor'))
 );
$$;
revoke all on function public.design_studio_can_access(uuid,boolean) from public;
grant execute on function public.design_studio_can_access(uuid,boolean) to authenticated;
create policy studio_projects_select on public.design_studio_projects for select to authenticated using (public.design_studio_can_access(id,false));
create policy studio_projects_insert on public.design_studio_projects for insert to authenticated with check (owner_id=(select auth.uid()));
create policy studio_projects_update on public.design_studio_projects for update to authenticated using (owner_id=(select auth.uid())) with check (owner_id=(select auth.uid()));
create policy studio_members_select on public.design_studio_memberships for select to authenticated using (public.design_studio_can_access(project_id,false));
create policy studio_members_write on public.design_studio_memberships for all to authenticated using (exists(select 1 from public.design_studio_projects p where p.id=project_id and p.owner_id=(select auth.uid()))) with check (exists(select 1 from public.design_studio_projects p where p.id=project_id and p.owner_id=(select auth.uid())));
create policy studio_candidates_select on public.design_studio_candidates for select to authenticated using (public.design_studio_can_access(project_id,false));
create policy studio_candidates_insert on public.design_studio_candidates for insert to authenticated with check (public.design_studio_can_access(project_id,true));
create policy studio_candidates_update on public.design_studio_candidates for update to authenticated using (public.design_studio_can_access(project_id,true)) with check (public.design_studio_can_access(project_id,true));
create policy studio_decisions_select on public.design_studio_decisions for select to authenticated using (public.design_studio_can_access(project_id,false));
create policy studio_decisions_insert on public.design_studio_decisions for insert to authenticated with check (public.design_studio_can_access(project_id,true) and (approval_status <> 'approved' or approved_by=(select auth.uid())));
create policy studio_decisions_update on public.design_studio_decisions for update to authenticated using (public.design_studio_can_access(project_id,true)) with check (public.design_studio_can_access(project_id,true) and (approval_status <> 'approved' or approved_by=(select auth.uid())));
commit;
-- BEFORE production: verify candidate project ownership and parent stage via triggers,
-- enforce project-specific approval roles, prevent client mutation of approved decisions,
-- audit every state transition, test RLS across two users/projects and service role.
-- Do NOT expose this schema as a completed secure portal before those tests.
