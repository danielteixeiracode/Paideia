-- =========================================================================
-- PAIDEIA — schema completo (Supabase / Postgres)
-- =========================================================================
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------
create type papel_usuario as enum ('aluno', 'administrador');
create type tipo_ativo as enum ('livro', 'curso', 'exercicio', 'tratado', 'audio', 'interativo');
create type nivel_ativo as enum ('iniciante', 'intermediario', 'avancado');
create type status_carteira as enum ('planejado', 'em_andamento', 'concluido', 'pausado');
create type periodo_dia as enum ('matutino', 'vespertino', 'noturno');
create type status_atividade as enum ('pendente', 'em_andamento', 'concluida', 'atrasada');
create type modo_socrates as enum ('maieutico', 'exegese', 'exame');
create type remetente_msg as enum ('usuario', 'socrates');
create type tipo_notificacao as enum ('lembrete', 'atraso', 'conquista', 'sistema', 'socrates');

-- ---------------------------------------------------------------------
-- PERFIS (extensão de auth.users)
-- ---------------------------------------------------------------------
create table perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null,
  papel papel_usuario not null default 'aluno',
  avatar_url text,
  grau_atual text default 'Grau I: Iniciação',
  meta_diaria_min int not null default 60,
  meta_semanal_horas numeric(5,2) not null default 14,
  onboarding_concluido boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ESTRUTURA PEDAGÓGICA (gerida pelo administrador, leitura pública)
-- ---------------------------------------------------------------------
create table eixos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,                 -- ex: Trivium, Quadrivium, Filosofia Geral
  slug text not null unique,
  descricao text,
  cor text default '#153D29',
  icone text,
  ordem int not null default 0,
  ativo boolean not null default true
);

create table capacidades (
  id uuid primary key default gen_random_uuid(),
  eixo_id uuid not null references eixos(id) on delete cascade,
  nome text not null,
  descricao text,
  ordem int not null default 0,
  ativo boolean not null default true
);

create table ativos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  subtitulo text,
  autor text,
  tipo tipo_ativo not null default 'livro',
  eixo_id uuid references eixos(id) on delete set null,
  capacidade_id uuid references capacidades(id) on delete set null,
  descricao text,
  imagem_url text,
  duracao_estimada_horas numeric(6,2) default 0,
  nivel nivel_ativo default 'intermediario',
  idioma text default 'Português',
  citacao_destaque text,
  metadata jsonb not null default '{}'::jsonb,
  ordem int not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CONFIGURAÇÃO DO SÓCRATES (agente de IA) — administrador
-- ---------------------------------------------------------------------
create table config_socrates (
  id uuid primary key default gen_random_uuid(),
  nome text not null default 'Sócrates',
  system_prompt text not null,
  modelo text not null default 'claude-sonnet-5',
  temperatura numeric(3,2) not null default 0.7,
  max_tokens int not null default 1024,
  modos jsonb not null default '["maieutico","exegese","exame"]'::jsonb,
  ativo boolean not null default true,
  atualizado_por uuid references perfis(id) on delete set null,
  atualizado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- DADOS PESSOAIS DO ALUNO (RLS: apenas o próprio usuário + admin)
-- ---------------------------------------------------------------------
create table carteira_itens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  ativo_id uuid not null references ativos(id) on delete cascade,
  status status_carteira not null default 'planejado',
  progresso_percentual numeric(5,2) not null default 0,
  horas_investidas numeric(6,2) not null default 0,
  data_inicio date,
  data_conclusao date,
  nota int check (nota between 1 and 5),
  anotacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (user_id, ativo_id)
);

create table planejamento_semanal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  semana_inicio date not null,
  meta_horas_semanal numeric(5,2) not null default 14,
  modo_disciplinar_ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  unique (user_id, semana_inicio)
);

create table atividades_planejadas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  planejamento_id uuid references planejamento_semanal(id) on delete cascade,
  ativo_id uuid references ativos(id) on delete set null,
  carteira_item_id uuid references carteira_itens(id) on delete set null,
  eixo_id uuid references eixos(id) on delete set null,
  titulo text not null,
  descricao text,
  data date not null,
  periodo periodo_dia not null default 'matutino',
  hora_inicio time,
  duracao_min int not null default 30,
  prioritaria boolean not null default false,
  status status_atividade not null default 'pendente',
  concluida_em timestamptz,
  criado_em timestamptz not null default now()
);

create table registros_estudo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  atividade_id uuid references atividades_planejadas(id) on delete set null,
  ativo_id uuid references ativos(id) on delete set null,
  eixo_id uuid references eixos(id) on delete set null,
  data date not null default current_date,
  duracao_min int not null default 0,
  anotacoes text,
  criado_em timestamptz not null default now()
);

create table constancia_diaria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  data date not null,
  estudou boolean not null default false,
  minutos_total int not null default 0,
  eixo_predominante_id uuid references eixos(id) on delete set null,
  unique (user_id, data)
);

create table conversas_socrates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  titulo text not null default 'Novo diálogo',
  modo modo_socrates not null default 'maieutico',
  tema_contexto text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table mensagens_socrates (
  id uuid primary key default gen_random_uuid(),
  conversa_id uuid not null references conversas_socrates(id) on delete cascade,
  user_id uuid not null references perfis(id) on delete cascade,
  remetente remetente_msg not null,
  conteudo text not null,
  metadata jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

create table notificacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  tipo tipo_notificacao not null default 'sistema',
  titulo text not null,
  corpo text,
  link text,
  lida boolean not null default false,
  criado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ÍNDICES
-- ---------------------------------------------------------------------
create index idx_carteira_itens_user on carteira_itens(user_id);
create index idx_atividades_user_data on atividades_planejadas(user_id, data);
create index idx_registros_estudo_user_data on registros_estudo(user_id, data);
create index idx_constancia_user_data on constancia_diaria(user_id, data);
create index idx_mensagens_conversa on mensagens_socrates(conversa_id, criado_em);
create index idx_notificacoes_user_lida on notificacoes(user_id, lida);
create index idx_ativos_eixo on ativos(eixo_id);

-- ---------------------------------------------------------------------
-- TRIGGER: cria perfil automaticamente ao registrar no auth.users
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfis (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)), new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at helper
create or replace function public.set_atualizado_em()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_carteira_itens_upd before update on carteira_itens
  for each row execute procedure public.set_atualizado_em();
create trigger trg_perfis_upd before update on perfis
  for each row execute procedure public.set_atualizado_em();
create trigger trg_conversas_upd before update on conversas_socrates
  for each row execute procedure public.set_atualizado_em();

-- ---------------------------------------------------------------------
-- HELPER: verifica se o usuário autenticado é administrador
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from perfis where id = auth.uid() and papel = 'administrador'
  );
$$ language sql security definer stable;

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table perfis enable row level security;
alter table eixos enable row level security;
alter table capacidades enable row level security;
alter table ativos enable row level security;
alter table config_socrates enable row level security;
alter table carteira_itens enable row level security;
alter table planejamento_semanal enable row level security;
alter table atividades_planejadas enable row level security;
alter table registros_estudo enable row level security;
alter table constancia_diaria enable row level security;
alter table conversas_socrates enable row level security;
alter table mensagens_socrates enable row level security;
alter table notificacoes enable row level security;

-- perfis: usuário vê e edita o próprio; admin vê todos
create policy "perfis_select_own_or_admin" on perfis for select
  using (id = auth.uid() or public.is_admin());
create policy "perfis_update_own" on perfis for update
  using (id = auth.uid()) with check (id = auth.uid());
create policy "perfis_update_admin" on perfis for update
  using (public.is_admin());

-- estrutura pedagógica: leitura pública (autenticados), escrita admin
create policy "eixos_select_auth" on eixos for select using (auth.role() = 'authenticated');
create policy "eixos_write_admin" on eixos for insert with check (public.is_admin());
create policy "eixos_update_admin" on eixos for update using (public.is_admin());
create policy "eixos_delete_admin" on eixos for delete using (public.is_admin());

create policy "capacidades_select_auth" on capacidades for select using (auth.role() = 'authenticated');
create policy "capacidades_write_admin" on capacidades for insert with check (public.is_admin());
create policy "capacidades_update_admin" on capacidades for update using (public.is_admin());
create policy "capacidades_delete_admin" on capacidades for delete using (public.is_admin());

create policy "ativos_select_auth" on ativos for select using (auth.role() = 'authenticated');
create policy "ativos_write_admin" on ativos for insert with check (public.is_admin());
create policy "ativos_update_admin" on ativos for update using (public.is_admin());
create policy "ativos_delete_admin" on ativos for delete using (public.is_admin());

create policy "config_socrates_select_auth" on config_socrates for select using (auth.role() = 'authenticated');
create policy "config_socrates_write_admin" on config_socrates for insert with check (public.is_admin());
create policy "config_socrates_update_admin" on config_socrates for update using (public.is_admin());

-- dados pessoais: dono da linha + leitura admin
create policy "carteira_itens_all_own" on carteira_itens for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "carteira_itens_select_admin" on carteira_itens for select using (public.is_admin());

create policy "planejamento_semanal_all_own" on planejamento_semanal for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "planejamento_semanal_select_admin" on planejamento_semanal for select using (public.is_admin());

create policy "atividades_planejadas_all_own" on atividades_planejadas for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "atividades_planejadas_select_admin" on atividades_planejadas for select using (public.is_admin());

create policy "registros_estudo_all_own" on registros_estudo for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "registros_estudo_select_admin" on registros_estudo for select using (public.is_admin());

create policy "constancia_diaria_all_own" on constancia_diaria for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "constancia_diaria_select_admin" on constancia_diaria for select using (public.is_admin());

create policy "conversas_socrates_all_own" on conversas_socrates for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "conversas_socrates_select_admin" on conversas_socrates for select using (public.is_admin());

create policy "mensagens_socrates_all_own" on mensagens_socrates for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "mensagens_socrates_select_admin" on mensagens_socrates for select using (public.is_admin());

create policy "notificacoes_all_own" on notificacoes for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notificacoes_select_admin" on notificacoes for select using (public.is_admin());

-- =========================================================================
-- NOVO MODELO DO CORPO (supabase/migrations/2026-11-03-novo-modelo-corpo.sql)
-- Obra → Função pedagógica → Exercício → Fruto → Registro do aluno.
-- Épocas e funções pedagógicas são preenchidas pela própria migração.
-- =========================================================================

-- ---------------------------------------------------------------------
-- CONTEÚDO PEDAGÓGICO (gerido pelo administrador, leitura pública)
-- ---------------------------------------------------------------------
create table epocas (
  id uuid primary key default gen_random_uuid(),
  numero int not null unique,          -- I a VII
  nome text not null,
  descricao text
);

create table funcoes_pedagogicas (
  id uuid primary key default gen_random_uuid(),
  numero int not null unique,          -- 1 a 7
  nome text not null,
  o_que_forma text,
  descricao text
);

create table obras (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  autor text,
  epoca_id uuid references epocas(id) on delete set null,
  descricao text,
  imagem_url text,
  ordem int not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table obra_funcoes (
  obra_id uuid not null references obras(id) on delete cascade,
  funcao_id uuid not null references funcoes_pedagogicas(id) on delete cascade,
  nota text,
  primary key (obra_id, funcao_id)
);

create table exercicios (
  id uuid primary key default gen_random_uuid(),
  funcao_id uuid not null references funcoes_pedagogicas(id) on delete restrict,
  obra_id uuid references obras(id) on delete set null,
  titulo text not null,
  enunciado text,
  metodo text,                         -- texto livre: narração, recitação, debate...
  ordem int not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- DADOS DO ALUNO (RLS: apenas o próprio usuário + admin)
-- ---------------------------------------------------------------------
create table carteira_obras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  obra_id uuid not null references obras(id) on delete cascade,
  estado text not null default 'semente',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (user_id, obra_id)
);

create table frutos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  exercicio_id uuid references exercicios(id) on delete set null,
  obra_id uuid references obras(id) on delete set null,
  funcao_id uuid references funcoes_pedagogicas(id) on delete set null,
  conversa_id uuid references conversas_socrates(id) on delete set null,
  tipo text not null,
  conteudo text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Só inserção: não há políticas de update/delete.
create table registro_eventos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  tipo text not null,
  obra_id uuid references obras(id) on delete set null,
  funcao_id uuid references funcoes_pedagogicas(id) on delete set null,
  exercicio_id uuid references exercicios(id) on delete set null,
  fruto_id uuid references frutos(id) on delete set null,
  conversa_id uuid references conversas_socrates(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

create index idx_obras_epoca on obras(epoca_id);
create index idx_obra_funcoes_funcao on obra_funcoes(funcao_id);
create index idx_exercicios_funcao on exercicios(funcao_id, ordem);
create index idx_exercicios_obra on exercicios(obra_id);
create index idx_carteira_obras_user on carteira_obras(user_id);
create index idx_frutos_user on frutos(user_id, criado_em);
create index idx_registro_eventos_user on registro_eventos(user_id, criado_em);

create trigger trg_obras_upd before update on obras
  for each row execute procedure public.set_atualizado_em();
create trigger trg_exercicios_upd before update on exercicios
  for each row execute procedure public.set_atualizado_em();
create trigger trg_carteira_obras_upd before update on carteira_obras
  for each row execute procedure public.set_atualizado_em();
create trigger trg_frutos_upd before update on frutos
  for each row execute procedure public.set_atualizado_em();

alter table epocas enable row level security;
alter table funcoes_pedagogicas enable row level security;
alter table obras enable row level security;
alter table obra_funcoes enable row level security;
alter table exercicios enable row level security;
alter table carteira_obras enable row level security;
alter table frutos enable row level security;
alter table registro_eventos enable row level security;

create policy "epocas_select_auth" on epocas for select using (auth.role() = 'authenticated');
create policy "epocas_write_admin" on epocas for insert with check (public.is_admin());
create policy "epocas_update_admin" on epocas for update using (public.is_admin());
create policy "epocas_delete_admin" on epocas for delete using (public.is_admin());

create policy "funcoes_pedagogicas_select_auth" on funcoes_pedagogicas for select using (auth.role() = 'authenticated');
create policy "funcoes_pedagogicas_write_admin" on funcoes_pedagogicas for insert with check (public.is_admin());
create policy "funcoes_pedagogicas_update_admin" on funcoes_pedagogicas for update using (public.is_admin());
create policy "funcoes_pedagogicas_delete_admin" on funcoes_pedagogicas for delete using (public.is_admin());

create policy "obras_select_auth" on obras for select using (auth.role() = 'authenticated');
create policy "obras_write_admin" on obras for insert with check (public.is_admin());
create policy "obras_update_admin" on obras for update using (public.is_admin());
create policy "obras_delete_admin" on obras for delete using (public.is_admin());

create policy "obra_funcoes_select_auth" on obra_funcoes for select using (auth.role() = 'authenticated');
create policy "obra_funcoes_write_admin" on obra_funcoes for insert with check (public.is_admin());
create policy "obra_funcoes_update_admin" on obra_funcoes for update using (public.is_admin());
create policy "obra_funcoes_delete_admin" on obra_funcoes for delete using (public.is_admin());

create policy "exercicios_select_auth" on exercicios for select using (auth.role() = 'authenticated');
create policy "exercicios_write_admin" on exercicios for insert with check (public.is_admin());
create policy "exercicios_update_admin" on exercicios for update using (public.is_admin());
create policy "exercicios_delete_admin" on exercicios for delete using (public.is_admin());

create policy "carteira_obras_all_own" on carteira_obras for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "carteira_obras_select_admin" on carteira_obras for select using (public.is_admin());

create policy "frutos_all_own" on frutos for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "frutos_select_admin" on frutos for select using (public.is_admin());

create policy "registro_eventos_insert_own" on registro_eventos for insert
  with check (user_id = auth.uid());
create policy "registro_eventos_select_own" on registro_eventos for select
  using (user_id = auth.uid());
create policy "registro_eventos_select_admin" on registro_eventos for select using (public.is_admin());
