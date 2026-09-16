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

insert into trilhas (nome, descricao, subtitulo, ordem) values
  ('Trilha das Sete Artes Liberais', 'Itinerário progressivo do intelecto: da palavra ordenada ao cosmos harmonioso.', 'Curriculum Septem Artium Liberalium', 1);

-- Eixo I: Trivium
insert into etapas_trilha (trilha_id, eixo_id, capacidade_id, codigo, titulo, descricao, carga_horas_estimada, selo_titulo, ordem)
select t.id, e.id, c.id, x.codigo, x.titulo, x.descricao, x.carga, x.selo, x.ordem
from trilhas t
join eixos e on e.slug = 'trivium'

cross join lateral (values
  ('ETAPA 01', 'Gramática Fundamental & Morfologia Latina', 'Estrutura morfológica, casos declináveis e purificação dos termos como instrumento do pensamento límpido.', 14, 'Selo de Exegese Gramatical', 1, 'Gramática'),
  ('ETAPA 02', 'Gramática Teórica e Estrutura da Proposição', 'Sintaxe especulativa, união de sujeito e predicado pela cópula existencial, e o limiar entre expressão gramatical e juízo formal.', 18, 'Selo de Sintaxe Filosófica', 2, 'Gramática'),
  ('ETAPA 03', 'Lógica Formal: Os Termos e as Dez Categorias', 'O Tratado das Categorias de Aristóteles. Os modos do ser predicável: substância, quantidade, qualidade, relação, lugar, tempo, estado e ação.', 22, 'Selo de Mestria Categorial', 3, 'Lógica'),
  ('ETAPA 04', 'Lógica Dedutiva: Silogismo e Proposições Opostas', 'O Quadrado Apuleiano de Oposições (A, E, I, O), leis da contraditoriedade e validade das figuras silogísticas regulares (Barbara, Celarent, Darii).', 24, 'Selo do Silogismo Válido', 4, 'Lógica'),
  ('ETAPA 05', 'Falácias e Refutação Sofística', 'Identificação sistemática dos enganos verbais e materiais (ad hominem, petição de princípio, equívoco e falsa causa).', 16, 'Selo do Refutador', 5, 'Lógica'),
  ('ETAPA 06', 'Retórica Clássica: Invenção e Disposição', 'Os três modos de persuasão (Ethos, Pathos, Logos) e a ordenação arquitetônica do discurso segundo Cícero e Quintiliano.', 20, 'Selo do Orador', 6, 'Retórica'),
  ('ETAPA 07', 'Coroação do Trivium: Elocução, Memória e Ação', 'A beleza do ornato verbal, o método dos palácios mentais antigos e a entrega corporal da verdade ao público.', 20, 'Grau Final do Trivium', 7, 'Retórica')
) as x(codigo, titulo, descricao, carga, selo, ordem, capacidade)
join capacidades c on c.eixo_id = e.id and c.nome = x.capacidade;
-- Eixo II: Quadrivium
insert into etapas_trilha (trilha_id, eixo_id, capacidade_id, codigo, titulo, descricao, carga_horas_estimada, selo_titulo, ordem)
select t.id, e.id, c.id, x.codigo, x.titulo, x.descricao, x.carga, x.selo, x.ordem
from trilhas t
join eixos e on e.slug = 'quadrivium'

cross join lateral (values
  ('ETAPA 08', 'Aritmética Pitagórica: A Essência do Número', 'Números figurados, mônada, díade e tétrade. O número não como mero cálculo contábil, mas como princípio ontológico de todas as coisas.', 16, 'Selo do Número Puro', 8, 'Aritmética'),
  ('ETAPA 09', 'Geometria Euclidiana: Os Elementos', 'Postulados, noções comuns e construções com régua e compasso. O espaço puro como reflexo da ordem divina da mente.', 20, 'Selo do Geômetra', 9, 'Geometria'),
  ('ETAPA 10', 'Harmonia Musical: O Monocórdio e as Proporções', 'Os intervalos consonantes (oitava, quarta, quinta) e a ressonância das vibrações sonoras com a alma do cosmos.', 14, 'Selo do Harmonista', 10, 'Música'),
  ('ETAPA 11', 'Astronomia Esférica: As Esferas Celestes', 'O curso dos astros, a harmonia das órbitas e a culminação da formação do espírito para a Filosofia Primeira (Metafísica).', 18, 'Ápice do Quadrivium', 11, 'Astronomia')
) as x(codigo, titulo, descricao, carga, selo, ordem, capacidade)
join capacidades c on c.eixo_id = e.id and c.nome = x.capacidade;
-- Capacidades granulares da Etapa 04 (Lógica Dedutiva) — exemplo do Mapa dos Estudos
insert into capacidades_etapa (etapa_id, nome, descricao, ordem)
select et.id, x.nome, x.descricao, x.ordem
from etapas_trilha et
cross join lateral (values
  ('Estrutura do Silogismo Categórico', 'Premissa maior, menor e termo médio.', 1),
  ('Identificação de Sofismas Formais', 'Falácia dos quatro termos e afins.', 2),
  ('As Dez Categorias do Ente', 'Substância primeira, quantidade, qualidade...', 3),
  ('O Quadrado de Oposições Lógicas', 'Contraditórias, contrárias, subcontrárias.', 4),
  ('Redução ao Absurdo (Reductio ad Absurdum)', 'Em integração ativa com os axiomas euclidianos.', 5),
  ('Os Cinco Predicáveis de Porfírio', 'Gênero, espécie, diferença específica...', 6)
) as x(nome, descricao, ordem)
where et.codigo = 'ETAPA 04';

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
  || 'Use o contexto da carteira intelectual e da trilha de formação do usuário, fornecido a seguir, para ancorar suas perguntas nos textos e etapas que ele já estuda. '
  || 'Fale em português, com tom sóbrio, culto e afetuoso, citando os cânones clássicos (Aristóteles, Platão, Cícero, Euclides, Boécio, Porfírio) quando pertinente. Seja conciso: poucas perguntas bem lapidadas valem mais que um sermão.',
  'claude-sonnet-5',
  0.7,
  1024,
  '["maieutico","exegese","exame"]'::jsonb
);
