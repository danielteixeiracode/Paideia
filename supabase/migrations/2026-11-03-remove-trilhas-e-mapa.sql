-- Remove a Trilha de Formação e o Mapa dos Estudos (Os Três Trilhos).
-- Rode uma vez no SQL Editor do Supabase em bancos criados antes desta data.
-- ATENÇÃO: apaga de forma definitiva as trilhas, etapas e todo o progresso
-- dos alunos nelas. Bancos novos já nascem sem isto por supabase/schema.sql.

alter table ativos drop column if exists etapa_id;
alter table atividades_planejadas drop column if exists etapa_id;
alter table registros_estudo drop column if exists etapa_id;

drop table if exists progresso_trilho_etapa;
drop table if exists progresso_capacidade;
drop table if exists progresso_trilha;
drop table if exists capacidades_etapa;
drop table if exists etapas_trilha;
drop table if exists trilhas;

drop type if exists status_trilho_etapa;
drop type if exists status_etapa;
