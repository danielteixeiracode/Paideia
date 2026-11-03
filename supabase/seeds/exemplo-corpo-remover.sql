-- =========================================================================
-- PAIDEIA — remove os dados de EXEMPLO criados por exemplo-corpo.sql.
-- Apaga só as linhas com os ids fixos daquele arquivo (e0000000-...):
-- 3 obras, seus vínculos com funções e 4 exercícios. Nada mais é apagado.
--
-- Efeito nos dados de alunos que tenham usado o exemplo (regras do banco):
-- - se alguém guardou uma dessas obras, ela sai da Carteira dessa pessoa;
-- - frutos e eventos ligados a essas obras ou exercícios continuam existindo,
--   apenas sem a ligação com a obra ou o exercício apagado.
-- =========================================================================

delete from exercicios where id in (
  'e0000000-0000-4000-8000-000000000101',
  'e0000000-0000-4000-8000-000000000102',
  'e0000000-0000-4000-8000-000000000103',
  'e0000000-0000-4000-8000-000000000104'
);

delete from obra_funcoes where obra_id in (
  'e0000000-0000-4000-8000-000000000001',
  'e0000000-0000-4000-8000-000000000002',
  'e0000000-0000-4000-8000-000000000003'
);

delete from obras where id in (
  'e0000000-0000-4000-8000-000000000001',
  'e0000000-0000-4000-8000-000000000002',
  'e0000000-0000-4000-8000-000000000003'
);
