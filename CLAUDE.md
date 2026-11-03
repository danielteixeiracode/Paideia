# CLAUDE.md — Paideia

Leia este arquivo antes de qualquer alteração. Ele substitui a versão anterior, que descrevia o conceito antigo (Trivium/Quadrivium como eixos, planejamento semanal, porcentagem por eixo).

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
- O Sócrates lê um resumo do registro, não o histórico inteiro.

## Estado do código (auditoria de 03/11/2026)

Manter: Next.js, Supabase, login, papéis (aluno/administrador), padrão de RLS, middleware, identidade visual, componentes de interface, Sócrates e sua tela de configuração (/admin/socrates), /admin/usuarios.

Adaptar: `ativos` → obras; Biblioteca → catálogo de obras; /admin/ativos → cadastro de obras; `carteira_itens` e `constancia_diaria` → base do registro; contexto do Sócrates → obras e frutos.

Refazer: eixos, capacidades, planejamento, atividades, registros de estudo e as telas /hoje, /planejamento e o painel /inicio.

Não construir novas funcionalidades sobre: `eixos`, `capacidades`, `atividades_planejadas`, `planejamento_semanal`, `registros_estudo`, porcentagem por eixo.

As abas Trilha de Formação e Mapa dos Estudos foram removidas do app; não recriar. O script que apaga as tabelas da trilha (`supabase/migrations/2026-11-03-remove-trilhas-e-mapa.sql`) já foi aplicado no banco real.

Os dados de supabase/seeds/exemplo-corpo.sql são de teste e não representam a seleção real de obras do Daniel.

Pendências técnicas:
- O service worker (sw.js) guarda em cache páginas que exigem login: corrigir antes de publicar.
- O app só roda localmente por enquanto; não há configuração de hospedagem.
- Textos do login, do manifest e da sidebar ainda falam de Trivium/Quadrivium.

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
