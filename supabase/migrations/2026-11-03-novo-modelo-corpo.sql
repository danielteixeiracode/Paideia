-- =========================================================================
-- PAIDEIA — novo modelo de dados do corpo
-- Obra → Função pedagógica → Exercício → Fruto → Registro do aluno.
-- Só cria tabelas novas, ao lado das antigas; não altera nem apaga nada.
-- Rode uma vez no SQL Editor do Supabase. Pode ser rodado de novo sem efeito.
-- Depende de public.is_admin() e public.set_atualizado_em() (schema.sql).
-- =========================================================================

-- ---------------------------------------------------------------------
-- CONTEÚDO PEDAGÓGICO (todos leem, só o administrador edita)
-- ---------------------------------------------------------------------
create table if not exists epocas (
  id uuid primary key default gen_random_uuid(),
  numero int not null unique,          -- I a VII
  nome text not null,
  descricao text
);

create table if not exists funcoes_pedagogicas (
  id uuid primary key default gen_random_uuid(),
  numero int not null unique,          -- 1 a 7
  nome text not null,
  o_que_forma text,                    -- preenchido pelo Daniel
  descricao text
);

create table if not exists obras (
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

-- Uma obra pode ter várias funções; a nota explica por que ela serve àquela função.
create table if not exists obra_funcoes (
  obra_id uuid not null references obras(id) on delete cascade,
  funcao_id uuid not null references funcoes_pedagogicas(id) on delete cascade,
  nota text,
  primary key (obra_id, funcao_id)
);

-- O exercício pertence à função; a obra é opcional.
create table if not exists exercicios (
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
-- DADOS DO ALUNO (só o dono; o administrador lê)
-- ---------------------------------------------------------------------

-- Estado da obra na Carteira do aluno, sem porcentagem.
create table if not exists carteira_obras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfis(id) on delete cascade,
  obra_id uuid not null references obras(id) on delete cascade,
  estado text not null default 'semente',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (user_id, obra_id)
);

-- O que o aluno produz: o ativo da Carteira.
create table if not exists frutos (
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

-- Registro único do aluno: tudo o que ele fez. Só inserção; o progresso deriva daqui.
create table if not exists registro_eventos (
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

-- ---------------------------------------------------------------------
-- ÍNDICES
-- ---------------------------------------------------------------------
create index if not exists idx_obras_epoca on obras(epoca_id);
create index if not exists idx_obra_funcoes_funcao on obra_funcoes(funcao_id);
create index if not exists idx_exercicios_funcao on exercicios(funcao_id, ordem);
create index if not exists idx_exercicios_obra on exercicios(obra_id);
create index if not exists idx_carteira_obras_user on carteira_obras(user_id);
create index if not exists idx_frutos_user on frutos(user_id, criado_em);
create index if not exists idx_registro_eventos_user on registro_eventos(user_id, criado_em);

-- ---------------------------------------------------------------------
-- TRIGGERS de atualizado_em
-- ---------------------------------------------------------------------
drop trigger if exists trg_obras_upd on obras;
create trigger trg_obras_upd before update on obras
  for each row execute procedure public.set_atualizado_em();
drop trigger if exists trg_exercicios_upd on exercicios;
create trigger trg_exercicios_upd before update on exercicios
  for each row execute procedure public.set_atualizado_em();
drop trigger if exists trg_carteira_obras_upd on carteira_obras;
create trigger trg_carteira_obras_upd before update on carteira_obras
  for each row execute procedure public.set_atualizado_em();
drop trigger if exists trg_frutos_upd on frutos;
create trigger trg_frutos_upd before update on frutos
  for each row execute procedure public.set_atualizado_em();

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table epocas enable row level security;
alter table funcoes_pedagogicas enable row level security;
alter table obras enable row level security;
alter table obra_funcoes enable row level security;
alter table exercicios enable row level security;
alter table carteira_obras enable row level security;
alter table frutos enable row level security;
alter table registro_eventos enable row level security;

-- conteúdo pedagógico: leitura pública (autenticados), escrita admin
drop policy if exists "epocas_select_auth" on epocas;
create policy "epocas_select_auth" on epocas for select using (auth.role() = 'authenticated');
drop policy if exists "epocas_write_admin" on epocas;
create policy "epocas_write_admin" on epocas for insert with check (public.is_admin());
drop policy if exists "epocas_update_admin" on epocas;
create policy "epocas_update_admin" on epocas for update using (public.is_admin());
drop policy if exists "epocas_delete_admin" on epocas;
create policy "epocas_delete_admin" on epocas for delete using (public.is_admin());

drop policy if exists "funcoes_pedagogicas_select_auth" on funcoes_pedagogicas;
create policy "funcoes_pedagogicas_select_auth" on funcoes_pedagogicas for select using (auth.role() = 'authenticated');
drop policy if exists "funcoes_pedagogicas_write_admin" on funcoes_pedagogicas;
create policy "funcoes_pedagogicas_write_admin" on funcoes_pedagogicas for insert with check (public.is_admin());
drop policy if exists "funcoes_pedagogicas_update_admin" on funcoes_pedagogicas;
create policy "funcoes_pedagogicas_update_admin" on funcoes_pedagogicas for update using (public.is_admin());
drop policy if exists "funcoes_pedagogicas_delete_admin" on funcoes_pedagogicas;
create policy "funcoes_pedagogicas_delete_admin" on funcoes_pedagogicas for delete using (public.is_admin());

drop policy if exists "obras_select_auth" on obras;
create policy "obras_select_auth" on obras for select using (auth.role() = 'authenticated');
drop policy if exists "obras_write_admin" on obras;
create policy "obras_write_admin" on obras for insert with check (public.is_admin());
drop policy if exists "obras_update_admin" on obras;
create policy "obras_update_admin" on obras for update using (public.is_admin());
drop policy if exists "obras_delete_admin" on obras;
create policy "obras_delete_admin" on obras for delete using (public.is_admin());

drop policy if exists "obra_funcoes_select_auth" on obra_funcoes;
create policy "obra_funcoes_select_auth" on obra_funcoes for select using (auth.role() = 'authenticated');
drop policy if exists "obra_funcoes_write_admin" on obra_funcoes;
create policy "obra_funcoes_write_admin" on obra_funcoes for insert with check (public.is_admin());
drop policy if exists "obra_funcoes_update_admin" on obra_funcoes;
create policy "obra_funcoes_update_admin" on obra_funcoes for update using (public.is_admin());
drop policy if exists "obra_funcoes_delete_admin" on obra_funcoes;
create policy "obra_funcoes_delete_admin" on obra_funcoes for delete using (public.is_admin());

drop policy if exists "exercicios_select_auth" on exercicios;
create policy "exercicios_select_auth" on exercicios for select using (auth.role() = 'authenticated');
drop policy if exists "exercicios_write_admin" on exercicios;
create policy "exercicios_write_admin" on exercicios for insert with check (public.is_admin());
drop policy if exists "exercicios_update_admin" on exercicios;
create policy "exercicios_update_admin" on exercicios for update using (public.is_admin());
drop policy if exists "exercicios_delete_admin" on exercicios;
create policy "exercicios_delete_admin" on exercicios for delete using (public.is_admin());

-- dados do aluno: dono da linha + leitura admin
drop policy if exists "carteira_obras_all_own" on carteira_obras;
create policy "carteira_obras_all_own" on carteira_obras for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "carteira_obras_select_admin" on carteira_obras;
create policy "carteira_obras_select_admin" on carteira_obras for select using (public.is_admin());

drop policy if exists "frutos_all_own" on frutos;
create policy "frutos_all_own" on frutos for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "frutos_select_admin" on frutos;
create policy "frutos_select_admin" on frutos for select using (public.is_admin());

-- registro: o dono insere e lê; sem políticas de update/delete, ninguém altera.
drop policy if exists "registro_eventos_insert_own" on registro_eventos;
create policy "registro_eventos_insert_own" on registro_eventos for insert
  with check (user_id = auth.uid());
drop policy if exists "registro_eventos_select_own" on registro_eventos;
create policy "registro_eventos_select_own" on registro_eventos for select
  using (user_id = auth.uid());
drop policy if exists "registro_eventos_select_admin" on registro_eventos;
create policy "registro_eventos_select_admin" on registro_eventos for select using (public.is_admin());

-- =========================================================================
-- SEED: épocas e funções pedagógicas (nomes do CLAUDE.md)
-- =========================================================================
insert into epocas (numero, nome) values
  (1, 'Roma Clássica'),
  (2, 'Síntese Cristã Tardia'),
  (3, 'Renascimento Carolíngio'),
  (4, 'Universidades Medievais'),
  (5, 'Renascimento'),
  (6, 'Os Jesuítas em Portugal e no Brasil'),
  (7, 'Colégio Pedro II e o Império Brasileiro')
on conflict (numero) do nothing;

insert into funcoes_pedagogicas (numero, nome) values
  (1, 'Memória e ouvido poético'),
  (2, 'Imaginação épica e repertório de modelos humanos'),
  (3, 'Raciocínio moral por casos concretos'),
  (4, 'Identidade histórica e cívica'),
  (5, 'Introspecção e exame interior'),
  (6, 'Formação retórica'),
  (7, 'Síntese crítica')
on conflict (numero) do nothing;
