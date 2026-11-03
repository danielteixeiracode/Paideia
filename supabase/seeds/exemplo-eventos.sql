-- =========================================================================
-- PAIDEIA — eventos de EXEMPLO para ver o templo do Início se mexer.
-- Não são atividade real de ninguém.
--
-- TROQUE O E-MAIL: escreva em v_email (logo abaixo) o e-mail da sua conta.
--
-- Insere 20 eventos em registro_eventos para essa conta, espalhados de forma
-- desigual entre as sete funções (I: 6, II: 4, III: 3, IV: 0, V: 5, VI: 1,
-- VII: 1) ao longo dos últimos 18 dias. Quando as obras de exemplo
-- (exemplo-corpo.sql) existem, alguns eventos se ligam a elas.
-- Marcação: metadata = {"exemplo": "eventos"}. Rodar de novo substitui os
-- exemplos anteriores dessa conta, sem duplicar.
-- Para apagar: supabase/seeds/exemplo-eventos-remover.sql.
-- =========================================================================

do $$
declare
  v_email text := 'seu-email@exemplo.com'; -- TROQUE O E-MAIL
  v_user uuid;
begin
  select id into v_user from perfis where lower(email) = lower(v_email);
  if v_user is null then
    raise exception 'Nenhuma conta com o e-mail %. Troque o e-mail no topo do arquivo.', v_email;
  end if;

  delete from registro_eventos where user_id = v_user and metadata->>'exemplo' = 'eventos';

  insert into registro_eventos (user_id, tipo, funcao_id, obra_id, metadata, criado_em)
  select v_user, x.tipo, f.id, o.id, '{"exemplo": "eventos"}'::jsonb,
         now() - make_interval(days => x.dias, hours => x.horas)
  from (values
    -- I. Memória e ouvido poético (6)
    (1, 'leitura',           null::text,                             18, 3),
    (1, 'exercicio_feito',   null,                                   15, 2),
    (1, 'dialogo_socratico', null,                                   12, 5),
    (1, 'exercicio_feito',   null,                                    9, 1),
    (1, 'leitura',           null,                                    6, 4),
    (1, 'exercicio_feito',   null,                                    2, 2),
    -- II. Imaginação épica e repertório de modelos humanos (4) — Eneida
    (2, 'leitura',           'e0000000-0000-4000-8000-000000000002', 17, 6),
    (2, 'exercicio_feito',   'e0000000-0000-4000-8000-000000000002', 11, 3),
    (2, 'dialogo_socratico', 'e0000000-0000-4000-8000-000000000002',  7, 2),
    (2, 'exercicio_feito',   'e0000000-0000-4000-8000-000000000002',  1, 5),
    -- III. Raciocínio moral por casos concretos (3) — A República
    (3, 'leitura',           'e0000000-0000-4000-8000-000000000001', 14, 4),
    (3, 'exercicio_feito',   'e0000000-0000-4000-8000-000000000001',  8, 6),
    (3, 'dialogo_socratico', 'e0000000-0000-4000-8000-000000000001',  3, 1),
    -- IV. Identidade histórica e cívica (nenhum)
    -- V. Introspecção e exame interior (5) — Confissões
    (5, 'leitura',           'e0000000-0000-4000-8000-000000000003', 16, 2),
    (5, 'exercicio_feito',   'e0000000-0000-4000-8000-000000000003', 13, 4),
    (5, 'dialogo_socratico', 'e0000000-0000-4000-8000-000000000001', 10, 3),
    (5, 'exercicio_feito',   'e0000000-0000-4000-8000-000000000003',  4, 2),
    (5, 'leitura',           'e0000000-0000-4000-8000-000000000003',  0, 1),
    -- VI. Formação retórica (1)
    (6, 'exercicio_feito',   null,                                    5, 6),
    -- VII. Síntese crítica (1)
    (7, 'dialogo_socratico', null,                                    0, 5)
  ) as x(funcao_numero, tipo, obra_id, dias, horas)
  join funcoes_pedagogicas f on f.numero = x.funcao_numero
  left join obras o on o.id = x.obra_id::uuid;
end $$;
