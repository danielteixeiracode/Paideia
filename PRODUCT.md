# Product

<!-- impeccable:product-schema 1 -->

<!-- Resumo do CLAUDE.md. O CLAUDE.md manda na alma e no conceito; em caso de divergência, ele vence e este arquivo deve ser corrigido. -->

## Platform

web

## Users

A pessoa em formação clássica de nível médio (no app, o papel "aluno"). Há também o papel "administrador", que cadastra o conteúdo pedagógico e configura o Sócrates.

## Product Purpose

Guiar a pessoa numa formação clássica de nível médio, com o mínimo de leitura e a máxima profundidade.

O fim da formação é o amor ordenado e a virtude. O app não existe para informar nem para acumular conteúdo, e sim para formar a pessoa. Toda decisão de produto deve ajudar a ordenar o amor, criar hábito e aprofundar, e não apenas medir ou acumular.

## Positioning

Uma formação universal de cerca de vinte obras, escolhidas pelo Daniel principalmente pela função pedagógica. Um livro pode ter mais de uma função, e voltar à mesma obra por outra função é o caminho da profundidade. Na Carteira Intelectual, o livro entra como semente; o fruto é o ativo.

## Operating Context

Membros do corpo do app e suas ligações, sem sequência rígida: o aluno pode entrar por qualquer ponto, e o Sócrates está presente em todos eles.

- **Obras:** a formação universal, cerca de vinte, escolhidas pelo Daniel principalmente pela função pedagógica. Uma obra pode ter várias funções.
- **Funções pedagógicas** (sete): 1. Memória e ouvido poético. 2. Imaginação épica e repertório de modelos humanos. 3. Raciocínio moral por casos concretos. 4. Identidade histórica e cívica. 5. Introspecção e exame interior. 6. Formação retórica. 7. Síntese crítica.
- **Épocas** (eixo do tempo): I Roma Clássica; II Síntese Cristã Tardia; III Renascimento Carolíngio; IV Universidades Medievais; V Renascimento; VI Os Jesuítas em Portugal e no Brasil; VII Colégio Pedro II e o Império Brasileiro.
- **Exercícios e atividades:** pertencem à função, não à obra. Voltar à mesma obra por outra função é o caminho da profundidade.
- **Métodos de aprendizado,** ensinados na plataforma: narração; memorização e recitação; preleção e repetição; imitação e composição graduada; pergunta socrática e seminário; questão disputada e debate; sabatina oral; caderno de observação.
- **Carteira Intelectual:** organiza livros e aprendizados. O livro entra como semente; o fruto é o ativo.
- **Sócrates:** consciência geral do Paideia, além da aba própria de conversa. Guia, debate, media, acompanha o progresso e dá feedback de desenvolvimento.
- **Registro do aluno:** tudo o que o aluno faz vai para o registro, de onde se deriva o progresso.

## Capabilities and Constraints

- App web responsivo (PWA), que futuramente também será aplicativo.
- Login com papéis aluno e administrador.
- O Sócrates é chamado sempre pelo servidor; a chave da API nunca é exposta no navegador.
- Não construir fluxos obrigatórios passo a passo (wizards, etapas bloqueadas) a partir das ligações entre os membros.
- Direção de trabalho ainda não confirmada em detalhe (confirmar com o Daniel antes de tratar como regra): o progresso não é campo preenchido nem porcentagem, e sim derivado do registro de eventos, por função; um livro sem exercício ainda não é ativo; o Sócrates lê um resumo do registro, não o histórico inteiro.
- Mais adiante: teste de leitura e compreensão; formação personalizada por objetivo.

**Em aberto (não decidir sozinho):** símbolo visual do ativo/fruto na Carteira; relação dos graus com as épocas ou com as faculdades; seleção das ~20 obras; método de leitura; forma da gamificação clássica (graus de iniciação); personalização por objetivo; parceria com o Instituto Alcuíno de York.

## Brand Commitments

- Nome: Paideia.
- As cores do Paideia não mudam.
- O Sócrates pergunta mais do que responde e nunca faz o exercício pelo aluno.

## Evidence on Hand

- Base conceitual: o documento "Educação Integral nos Sete Períodos Clássicos", do Instituto Alcuíno de York (Parte VIII, princípios; tabela de métodos).
- A seleção real de obras ainda não existe. Os dados de `supabase/seeds/exemplo-corpo.sql` são de teste e não representam a seleção do Daniel. Nunca sugerir, trocar ou inventar obras.

## Product Principles

- Formar, não informar: o espírito é lenha a acender, não vaso a encher.
- Ordenar os afetos antes dos argumentos.
- A virtude se adquire pelo hábito.
- Memória e imitação são as portas da invenção.
- O mestre conduz, mas quem aprende é o aluno.
- Receber a tradição e acomodá-la ao Brasil.
- O saber é uno: nenhum membro do app é uma ilha.
