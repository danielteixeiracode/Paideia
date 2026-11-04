# CLAUDE.md — Paideia

Leia este arquivo antes de qualquer alteração. Ele substitui a versão anterior, que descrevia o conceito antigo (Trivium/Quadrivium como eixos, planejamento semanal, porcentagem por eixo).

Fonte da verdade: o CLAUDE.md manda na alma e no conceito; o docs/design/briefing.md e o DESIGN.md mandam no visual; o PRODUCT.md só resume o CLAUDE.md.

## Alma

Guiar a pessoa numa formação clássica de nível médio, com o mínimo de leitura e a máxima profundidade.

O fim da formação é o amor ordenado e a virtude. O app não existe para informar nem para acumular conteúdo, e sim para formar a pessoa. Toda decisão de produto deve ajudar a ordenar o amor, criar hábito e aprofundar, e não apenas medir ou acumular.

Princípios que mais pesam (do documento "Educação Integral nos Sete Períodos Clássicos", Instituto Alcuíno de York, Parte VIII):
- Formar, não informar: o espírito é lenha a acender, não vaso a encher.
- Ordenar os afetos antes dos argumentos.
- A virtude se adquire pelo hábito.
- Memória e imitação são as portas da invenção.
- O mestre conduz, mas quem aprende é o aluno.
- Receber a tradição e acomodá-la ao Brasil.
- O saber é uno: nenhum membro do app é uma ilha.

## Corpo: membros e ligações

As ligações entre os membros não formam uma sequência rígida: o aluno pode entrar por qualquer ponto, e o Sócrates está presente em todos eles. Ligações principais: a obra carrega funções pedagógicas; cada função se pratica em exercícios; os exercícios produzem frutos; tudo o que o aluno faz vai para o registro, de onde se deriva o progresso. Nada disso exige ordem fixa: o aluno pode, por exemplo, debater uma obra com o Sócrates antes de qualquer exercício, ou voltar à mesma obra por outra função. Não construir fluxos obrigatórios passo a passo (wizards, etapas bloqueadas) a partir dessas ligações.

- **Formação universal:** cerca de vinte obras, escolhidas pelo Daniel, principalmente pela função pedagógica. Um livro pode ter mais de uma função. Nunca sugerir, trocar ou inventar obras.
- **Funções pedagógicas** (as sete funções literárias do documento): 1. Memória e ouvido poético. 2. Imaginação épica e repertório de modelos humanos. 3. Raciocínio moral por casos concretos. 4. Identidade histórica e cívica. 5. Introspecção e exame interior. 6. Formação retórica. 7. Síntese crítica.
- **Épocas** (eixo do tempo, sempre em mente): I Roma Clássica; II Síntese Cristã Tardia; III Renascimento Carolíngio; IV Universidades Medievais; V Renascimento; VI Os Jesuítas em Portugal e no Brasil; VII Colégio Pedro II e o Império Brasileiro.
- **Exercícios e atividades:** pertencem à função, não à obra. Voltar à mesma obra por outra função é o caminho da profundidade.
- **Métodos de aprendizado:** ensinados dentro da plataforma (leitura, memorização, escrita, debate). Base: a tabela de métodos do documento (narração; memorização e recitação; preleção e repetição; imitação e composição graduada; pergunta socrática e seminário; questão disputada e debate; sabatina oral; caderno de observação). O método de leitura ainda precisa ser definido.
- **Carteira Intelectual:** organiza livros e aprendizados. O livro entra como semente; o fruto é o ativo.
- **Sócrates:** consciência geral do Paideia, além da aba própria de conversa. Guia, debate, media, acompanha o progresso e dá feedback de desenvolvimento. Está presente em todos os pontos do corpo, não apenas depois dos frutos. Pergunta mais do que responde e nunca faz o exercício pelo aluno.
- **Progresso e engajamento:** monitoramento de progresso, motivação e gamificação de estilo clássico (graus de iniciação), com feedback do Sócrates.
- **Mais adiante:** teste de leitura e compreensão; formação personalizada por objetivo.

## O que é do Daniel e o que é direção de trabalho

Decidido pelo Daniel:
- A frase da alma; o fim (amor ordenado e virtude).
- Formação universal de ~20 obras, escolhida por ele, pela função pedagógica; um livro pode ter várias funções.
- Sete épocas sempre em mente; exercícios e atividades; métodos ensinados na plataforma.
- A Carteira permanece, como organização de livros e aprendizados, e ele gostou da ideia de "frutos".
- Sócrates como consciência geral, com investimento em custo de API aceito; integração profunda de forma gradual.
- O teste de leitura e compreensão virá, mas depois.
- As cores do Paideia não mudam.

Direção de trabalho (proposta, ainda não confirmada em detalhe; confirme com o Daniel antes de tratar como regra):
- Um livro sem exercício ainda não é ativo; o ativo é o fruto (o que o aluno consegue recitar, recontar, argumentar ou julgar).
- O progresso não é um campo preenchido nem uma porcentagem: é derivado do registro de eventos, por função (perfil de faculdades).
- Modelo de dados novo: funcoes_pedagogicas, obra_funcoes (N:N), exercicios (ligados à função), frutos (privados do aluno) e um registro de eventos (o que o aluno fez, quando, em qual obra, função e exercício).
- carteira_itens guarda só o estado da obra para o aluno, sem porcentagem.

## Estado do código

Modelo de dados em uso (supabase/migrations/2026-11-03-novo-modelo-corpo.sql, já aplicado): `epocas`, `funcoes_pedagogicas`, `obras`, `obra_funcoes`, `exercicios`, `carteira_obras` (estado da obra para o aluno, sem porcentagem), `frutos` e `registro_eventos` (só inserção; o progresso deriva dele). As telas do aluno leem `obras` e `carteira_obras`; `ativos` e `carteira_itens` são do modelo antigo.

Telas do aluno no padrão novo (DESIGN.md): Início, Obras, Funções, Épocas, Carteira, Sócrates, Configurações. Navegação no cabeçalho em faixa dupla (abas I a VI), barra inferior no celular, paleta de comandos (Ctrl K) e atalhos. Administração no padrão novo: visão geral, Obras e Exercícios (cadastro com validação, sem exclusão), Sócrates (configuração) e Usuários. Títulos das abas do navegador por rota ("Obras – Paideia").

O templo saiu do projeto (o desenho do Início e de Funções, a colunata, a coluna de progresso, a animação das colunas e o controle "uma vez por sessão"); não recriar. North Star do design: "O Códice". O progresso por função aparece como filete (`FileteProgresso`, `ProgressoFuncoes`), pela regra provisória de `lib/progresso-funcoes.ts` (eventos da função divididos pela meta de 10, limitado a 1). Nos cartões de obra, as funções aparecem em romanos (`RomanosFuncoes`).

Do modelo antigo, ainda no app e fora dos menus (decidir se ficam): Biblioteca (`ativos`, `eixos`, `carteira_itens`), /admin/eixos (`eixos`, `capacidades`) e /admin/ativos (`ativos`, `eixos`).

Não construir novas funcionalidades sobre: `eixos`, `capacidades`, `ativos`, `carteira_itens`, `atividades_planejadas`, `planejamento_semanal`, `registros_estudo`, porcentagem por eixo.

As abas Trilha de Formação e Mapa dos Estudos foram removidas do app; não recriar. O script que apaga as tabelas da trilha (`supabase/migrations/2026-11-03-remove-trilhas-e-mapa.sql`) já foi aplicado no banco real.

Os dados de supabase/seeds/exemplo-corpo.sql são de teste e não representam a seleção real de obras do Daniel. Os de supabase/seeds/exemplo-eventos.sql também são de teste.

Contexto do Sócrates (implementado, era direção de trabalho): o Sócrates lê um resumo do aluno, não o histórico inteiro. `lib/socrates-contexto.ts` monta no servidor, pela sessão do próprio aluno (nunca a chave de serviço), um resumo curto: nome, obras da Carteira (título, autor, época e quantos frutos deram), até 5 frutos recentes (trecho de até 200 caracteres nos 3 últimos), eventos por função com a mais e a menos exercitada, os 10 últimos eventos em frases, a tela atual e a pergunta do Início. Limite de cerca de 1500 tokens (6000 caracteres): corta primeiro os trechos, depois os eventos mais antigos. Sem dados: "O aluno ainda não registrou nada." O prompt vai nesta ordem: prompt-base do admin, bloco fixo de orientações (`ORIENTACOES_RESUMO`) e o resumo. A API não lê mais `carteira_itens` nem `ativos`; o resumo nunca vai para o navegador.

Service worker (public/sw.js): guarda em cache só arquivos estáticos e a página offline (public/offline.html); páginas que exigem login e a API nunca vão para o cache.

Páginas especiais no padrão novo: 404, erro e erro global (`components/ui/pagina-especial.tsx`), com caminho de volta ao Início; /design e /design/componentes só existem em desenvolvimento. Auditoria final (etapa 7b) feita em 360/390/768/1280px nos três modos: sem rolagem horizontal, contraste ≥ 4,5:1, alvos de toque de 44px, teclado e foco conferidos, movimento reduzido sem animação. Chaves secretas só no servidor: `SUPABASE_SERVICE_ROLE_KEY` não é usada pelo app (só pelos testes e2e) e `ANTHROPIC_API_KEY` só em app/api/socrates. Type-check, lint e build de produção passam.

Conferir manualmente (dependem dos dados da conta): sementes e frutos na Carteira, o "Continuar" e a atividade do Início com eventos, e uma conversa do Sócrates com mensagens. A ficha de obra, os cartões e as edições do admin foram conferidos com os dados de exemplo.

Pendências técnicas:
- O app só roda localmente por enquanto; não há configuração de hospedagem.
- O prompt do Sócrates já vem na ordem certa para o cache (prompt-base primeiro), mas o cache de prompt não está ligado: o SDK em uso (@anthropic-ai/sdk 0.27) só o oferece pela API beta.

## Stack

- Next.js + Tailwind + TypeScript, PWA responsiva
- Supabase (auth, Postgres, RLS)
- Sócrates via API da Anthropic, chamada sempre pelo servidor (nunca expor a chave no navegador)
- Antes de publicar comercialmente, revisar os termos e os limites do plano de hospedagem

## Identidade visual

- Verde escuro e dourado, estética clássica e sóbria; mudanças de design passam pelos tokens (`tailwind.config.ts` e `globals.css`)
- Mudar paleta só com instrução explícita

## Convenções de código

- Nomes em português para conceitos do domínio (`Obra`, `Fruto`, `FuncaoPedagogica`) e em inglês para termos técnicos genéricos
- Estilização via Tailwind
- Simplicidade antes de otimização prematura

## Regras de trabalho

- Etapas pequenas: uma mudança por vez
- Fazer commit antes de qualquer mudança grande
- Não rodar build ou testes a cada alteração; só ao final
- Migrações de banco não apagam dados sem pedido explícito
- Em caso de dúvida sobre o conceito (função, fruto, progresso), perguntar em vez de inventar

## Em aberto (não decidir sozinho)

- Símbolo visual do ativo/fruto na Carteira
- Relação dos graus com as épocas ou com as faculdades
- Seleção das ~20 obras
- Método de leitura
- Forma da gamificação clássica
- Personalização por objetivo
- Parceria com o Instituto Alcuíno de York
- Vocabulário dos tipos de evento (exercicio_feito, dialogo_socratico, leitura, obra_guardada, obra_removida) é provisório.
