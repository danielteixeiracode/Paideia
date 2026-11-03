-- =========================================================================
-- PAIDEIA — dados estruturais iniciais
-- =========================================================================

insert into eixos (nome, slug, descricao, cor, icone, ordem) values
  ('Trivium', 'trivium', 'Gramática, Dialética e Retórica — o domínio do pensamento ordenado pela palavra.', '#153D29', 'languages', 1),
  ('Quadrivium', 'quadrivium', 'Aritmética, Geometria, Música e Astronomia — o número que decifra o cosmos.', '#28613F', 'compass', 2),
  ('Filosofia Geral', 'filosofia-geral', 'Diálogo socrático e mentoria filosófica contínua na busca das virtudes perenes.', '#8C6C16', 'brain', 3);

insert into capacidades (eixo_id, nome, descricao, ordem)
select id, c.nome, c.descricao, c.ordem from eixos, (values
  ('Gramática', 'Morfologia, sintaxe e estrutura da proposição.', 1),
  ('Lógica', 'Termos, categorias, silogismos e refutação de sofismas.', 2),
  ('Retórica', 'Invenção, disposição, elocução e ação oratória.', 3)
) as c(nome, descricao, ordem)
where eixos.slug = 'trivium';

insert into capacidades (eixo_id, nome, descricao, ordem)
select id, c.nome, c.descricao, c.ordem from eixos, (values
  ('Aritmética', 'O número em si: figurado, díade e tétrade pitagórica.', 1),
  ('Geometria', 'O número no espaço: postulados e construções euclidianas.', 2),
  ('Música', 'O número no tempo: monocórdio e proporções harmônicas.', 3),
  ('Astronomia', 'O número no espaço-tempo: as esferas celestes.', 4)
) as c(nome, descricao, ordem)
where eixos.slug = 'quadrivium';

-- Ativos exemplares da Biblioteca Clássica
insert into ativos (titulo, subtitulo, autor, tipo, eixo_id, descricao, duracao_estimada_horas, nivel, idioma, citacao_destaque, ordem)
select x.titulo, x.subtitulo, x.autor, x.tipo::tipo_ativo, e.id, x.descricao, x.duracao, x.nivel::nivel_ativo, x.idioma, x.citacao, x.ordem
from (values
  ('Ética a Nicômaco', 'Cânone Fundamental • Livros I a X', 'Aristóteles', 'livro', 'trivium', 'Investigação seminal sobre a Eudaimonia (felicidade suprema), a doutrina do justo meio e o cultivo das virtudes.', 48, 'intermediario', 'Português', null, 1),
  ('Os Elementos', 'Livros I-IV: Geometria Plana Euclidiana', 'Euclides de Alexandria', 'tratado', 'quadrivium', 'O padrão de ouro do raciocínio dedutivo e da demonstração axiomática. Postulados, definições e proposições.', 60, 'intermediario', 'Português', null, 2),
  ('A Arte da Retórica: Da Persuasão à Dialética', 'Curso com Tutor Socrático Integrado', 'Formação Guiada por Sócrates & Cícero', 'curso', 'trivium', 'Domine o Ethos, Pathos e Logos. Aprenda a estruturar discursos persuasivos alinhados estritamente ao cânone.', 24, 'iniciante', 'Português', null, 3),
  ('Fedro ou Da Beleza', 'Diálogo Maiêutico Integral', 'Platão de Atenas', 'livro', 'trivium', 'O célebre mito da carruagem alada, a natureza do delírio divino (mania), o amor como busca da verdade.', 12, 'intermediario', 'Português', null, 4),
  ('Compêndio de Silogismos & Falácias', 'Laboratório de Raciocínio Formal', 'Organon Aristotélico Aplicado', 'exercicio', 'trivium', 'Treinamento cirúrgico de dedução: modos válidos (Barbara, Celarent, Darii), identificação de sofismas da linguagem.', 30, 'avancado', 'Português', null, 5),
  ('O Monocórdio e a Razão Harmônica', 'Simulador Acústico & Numérico', 'Escola Pitagórica de Crotona', 'interativo', 'quadrivium', 'Experiencie como os números governam a beleza do cosmos. A divisão da corda vibra nas proporções.', 8, 'iniciante', 'Português', null, 6)
) as x(titulo, subtitulo, autor, tipo, eixo_slug, descricao, duracao, nivel, idioma, citacao, ordem)
join eixos e on e.slug = x.eixo_slug;

-- Configuração inicial do Sócrates
insert into config_socrates (nome, system_prompt, modelo, temperatura, max_tokens, modos) values (
  'Sócrates',
  'Você é Sócrates, mentor diático da Paideia — uma academia de formação clássica fundamentada no Trivium (Gramática, Lógica, Retórica) e no Quadrivium (Aritmética, Geometria, Música, Astronomia). '
  || 'Conduza o discípulo pelo método maiêutico: nunca entregue a resposta diretamente, mas guie por perguntas sucessivas que o levem a parir a própria verdade. '
  || 'Use o contexto da carteira intelectual do usuário, fornecido a seguir, para ancorar suas perguntas nos textos que ele já estuda. '
  || 'Fale em português, com tom sóbrio, culto e afetuoso, citando os cânones clássicos (Aristóteles, Platão, Cícero, Euclides, Boécio, Porfírio) quando pertinente. Seja conciso: poucas perguntas bem lapidadas valem mais que um sermão.',
  'claude-sonnet-5',
  0.7,
  1024,
  '["maieutico","exegese","exame"]'::jsonb
);
