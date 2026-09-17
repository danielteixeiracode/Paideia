-- Mapa dos Estudos — Os Três Trilhos.
-- Rode uma vez no SQL Editor do Supabase em bancos criados antes desta data.
-- Bancos novos já recebem tudo isto por supabase/schema.sql.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'status_trilho_etapa') then
    create type status_trilho_etapa as enum ('nao_iniciado', 'em_andamento', 'concluido');
  end if;
end $$;

create table if not exists progresso_trilho_etapa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  trilho_id text not null,
  etapa_id text not null,
  status status_trilho_etapa not null default 'nao_iniciado',
  atualizado_em timestamptz not null default now(),
  unique (user_id, etapa_id)
);

create index if not exists idx_progresso_trilho_etapa_user on progresso_trilho_etapa(user_id);

alter table progresso_trilho_etapa enable row level security;

drop policy if exists "progresso_trilho_etapa_all_own" on progresso_trilho_etapa;
create policy "progresso_trilho_etapa_all_own" on progresso_trilho_etapa for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "progresso_trilho_etapa_select_admin" on progresso_trilho_etapa;
create policy "progresso_trilho_etapa_select_admin" on progresso_trilho_etapa for select
  using (public.is_admin());

drop trigger if exists trg_progresso_trilho_etapa_upd on progresso_trilho_etapa;
create trigger trg_progresso_trilho_etapa_upd before update on progresso_trilho_etapa
  for each row execute procedure public.set_atualizado_em();
