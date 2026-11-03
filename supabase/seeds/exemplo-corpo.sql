-- =========================================================================
-- PAIDEIA — dados de EXEMPLO para testar as telas do novo corpo.
-- Não são a seleção real de obras do Daniel.
--
-- Marcação: toda linha criada aqui usa um id fixo começando por e0000000-,
-- e as obras levam a descrição "Dado de exemplo para testar as telas."
-- Para apagar: supabase/seeds/exemplo-corpo-remover.sql.
-- Pode ser rodado mais de uma vez sem duplicar.
-- Requer a migração 2026-11-03-novo-modelo-corpo.sql (épocas e funções).
-- =========================================================================

-- Obras (publicadas), ligadas à época pelo número
insert into obras (id, titulo, autor, epoca_id, descricao, ordem, ativo)
select v.id::uuid, v.titulo, v.autor, e.id, 'Dado de exemplo para testar as telas.', v.ordem, true
from (values
  ('e0000000-0000-4000-8000-000000000001', 'A República', 'Platão', 1, 1),
  ('e0000000-0000-4000-8000-000000000002', 'Eneida', 'Virgílio', 1, 2),
  ('e0000000-0000-4000-8000-000000000003', 'Confissões', 'Santo Agostinho', 2, 3)
) as v(id, titulo, autor, epoca_numero, ordem)
join epocas e on e.numero = v.epoca_numero
on conflict (id) do nothing;

-- Vínculos obra ↔ função, com uma nota curta, ligados à função pelo número
insert into obra_funcoes (obra_id, funcao_id, nota)
select v.obra_id::uuid, f.id, v.nota
from (values
  ('e0000000-0000-4000-8000-000000000001', 5, 'A alegoria da caverna como exame do próprio olhar.'),
  ('e0000000-0000-4000-8000-000000000001', 3, 'A justiça discutida em casos concretos, como o anel de Giges.'),
  ('e0000000-0000-4000-8000-000000000002', 2, 'Eneias como modelo de piedade e de dever.'),
  ('e0000000-0000-4000-8000-000000000002', 4, 'A fundação de Roma como memória de um povo.'),
  ('e0000000-0000-4000-8000-000000000003', 5, 'O exame da própria vida, narrado em primeira pessoa.')
) as v(obra_id, funcao_numero, nota)
join funcoes_pedagogicas f on f.numero = v.funcao_numero
on conflict (obra_id, funcao_id) do nothing;

-- Um exercício geral (da função, sem obra) para as funções 2, 3, 4 e 5
insert into exercicios (id, funcao_id, obra_id, titulo, enunciado, metodo, ordem, ativo)
select v.id::uuid, f.id, null, v.titulo, v.enunciado, v.metodo, 1, true
from (values
  ('e0000000-0000-4000-8000-000000000101', 2, 'Recontar um herói',
   'Escolha um herói de uma obra lida e reconte, com suas palavras, um momento em que ele age por dever contra o próprio desejo. Diga o que esse gesto revela sobre ele.',
   'narração'),
  ('e0000000-0000-4000-8000-000000000102', 3, 'Julgar um caso',
   'Tome um caso apresentado na obra e diga se a ação foi justa. Sustente seu juízo com uma razão e responda a uma objeção.',
   'questão disputada e debate'),
  ('e0000000-0000-4000-8000-000000000103', 4, 'A fundação que nos forma',
   'Explique em poucas linhas como uma narrativa de fundação ajuda um povo a saber quem é. Relacione com a história do Brasil.',
   'imitação e composição graduada'),
  ('e0000000-0000-4000-8000-000000000104', 5, 'Exame do dia',
   'Escreva um parágrafo sobre um momento do seu dia em que agiu contra o que sabia ser certo, e o que o levou a isso.',
   'caderno de observação')
) as v(id, funcao_numero, titulo, enunciado, metodo)
join funcoes_pedagogicas f on f.numero = v.funcao_numero
on conflict (id) do nothing;
