---
name: Paideia
description: Formação clássica com o mínimo de leitura e a máxima profundidade.
colors:
  green-950: "#0A1A14"
  green-900: "#11271F"
  green-800: "#164130"
  green-700: "#1C5940"
  green-600: "#287756"
  green-500: "#338E67"
  gold-300: "#DCC48F"
  gold-400: "#D1AC5C"
  gold-500: "#B98C31"
  gold-600: "#976F26"
  gold-700: "#71541E"
  cream-50: "#FDF8EF"
  cream-100: "#FAF1DF"
  cream-200: "#F5E7CB"
  cream-300: "#EFDCB3"
  ink-primitive: "#241C10"
  canvas: "#FAF1DF"
  surface: "#FFFFFF"
  sunken: "#FDF8EF"
  muted: "#F5E7CB"
  rule: "#EFDCB3"
  rule-strong: "#B98C31"
  ink: "#241C10"
  ink-muted: "#6D6456"
  accent: "#164130"
  gold: "#B98C31"
  gold-ink: "#71541E"
  action: "#164130"
  action-hover: "#1C5940"
  on-action: "#DCC48F"
  focus: "#B98C31"
typography:
  display:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.75rem + 2vw, 3.25rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  titulo:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.005em"
  subtitulo:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.25
  romano:
    fontFamily: "EB Garamond, Georgia, serif"
    fontWeight: 500
    letterSpacing: "0.08em"
    fontFeature: "lnum"
  leitura:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  corpo:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  interface:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  nota:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  sm: "2px"
  DEFAULT: "3px"
  md: "4px"
  lg: "4px"
  xl: "6px"
  2xl: "8px"
  3xl: "10px"
  full: "9999px"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-5: "1.5rem"
  space-6: "2rem"
  space-7: "3rem"
  space-8: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.canvas}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "1.25rem"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  badge-neutral:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  badge-action:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.full}"
---

# Design System: Paideia

<!-- Estado: tokens (etapa 2) e componentes base (etapa 3) implementados, em tailwind.config.ts e app/globals.css. As telas ainda não foram redesenhadas: só passaram a usar os tokens semânticos, com a mesma aparência no modo claro. A direção completa está em docs/design/briefing.md, que vence onde este arquivo for omisso. Página de conferência: /design (só em desenvolvimento). -->

## Overview

**Creative North Star: "O Templo"**

O sistema é arquitetura: ordem, proporção e base firme. Como num códice impresso, a página tem uma medida estável, títulos em serifa de corte clássico, algarismos romanos marcando as seções e réguas finas organizando o espaço. O verde esmeralda profundo é a pedra que sustenta a estrutura (navegação, áreas de destaque), o creme é o pergaminho onde se lê, e o dourado é a luz, usada com parcimônia em ações, filetes e no templo do Início.

A ambição aparece como precisão e contenção, não como ornamento. Há um único momento marcante, o templo, em que as colunas sobem e acendem; todo o resto é quieto, imediato e consistente. Três modos compartilham a mesma arquitetura: claro (pergaminho), escuro (verde bem profundo com dourado como destaque) e foco (papel quente, texto escuro e nenhuma interface além do conteúdo).

**Key Characteristics:**
- Serifa EB Garamond para títulos e algarismos romanos; Hanken Grotesk para interface e texto corrido.
- Marcador de seção: algarismo romano seguido de filete de 0,5px. Nunca eyebrow.
- Verde escuro domina as áreas de destaque; creme é o fundo de leitura; dourado é acento.
- Raios discretos, sombras mínimas, bordas finas.
- Movimento em dois registros: discreto (180ms) e assinatura (1100ms, só no templo).
- Ícones Lucide.

## Colors

As primitivas são as cores do Paideia e não mudam; as semânticas dão a cada cor um papel e são resolvidas pelo tema ativo (`data-theme` no `<html>`). Os valores do frontmatter são os do modo claro.

### Primary
- **Verde Esmeralda Profundo** (green-900, green-950): a pedra. Barra do celular, botão do Sócrates, caixa do logo do login; no modo escuro, também fundo e superfície.
- **Verde Esmeralda** (green-800): ação principal e links no claro e no foco (`action`, `accent`).
- **Verde Esmeralda Claro** (green-700): hover da ação; bordas no modo escuro.

### Secondary
- **Dourado Luminoso** (gold-400, gold-500): acento decorativo (`gold`), filetes de marcação (`rule-strong`), anel de foco; no escuro, a ação principal.
- **Dourado Claro** (gold-300): texto sobre a ação verde; links e texto dourado no escuro.
- **Dourado Envelhecido** (gold-600, gold-700): texto em dourado sobre o claro (`gold-ink`); filetes e foco no modo foco.

### Neutral
- **Pergaminho** (cream-100): fundo de leitura (`canvas`) no claro.
- **Pergaminho Claro** (cream-50) e **Branco**: áreas recuadas (`sunken`) e superfícies (`surface`) no claro.
- **Pergaminho Médio** (cream-200, cream-300): selos e trilhos (`muted`), bordas (`rule`).
- **Tinta** (ink): texto principal.
- **Tinta Secundária** (ink-muted): texto secundário, ajuda, metadados, placeholder e estado desativado. Cor sólida por modo, sempre com contraste de 4,5:1 ou mais sobre canvas, surface, sunken e muted. Não usar opacidade solta sobre `ink` para texto secundário.

### Modos
- **Escuro:** canvas green-950, surface green-900, sunken entre os dois, muted green-800, rule green-700, ink cream-100, ink-muted rgb 164 166 152, accent e gold-ink gold-300, gold e action gold-400 com texto green-950, focus gold-400.
- **Foco:** canvas e surface no mesmo papel quente (rgb 247 236 213), sunken um tom abaixo, tinta mais funda (rgb 26 20 11), ink-muted rgb 107 100 87, filetes, gold e foco em gold-600; sem sombra de cartão.

### Named Rules
**A Regra dos 4,5.** Nenhum texto, inclusive o secundário, fica abaixo de 4,5:1 sobre a superfície em que está, em nenhum modo. Texto secundário usa `ink-muted`.

### Named Rules
**A Regra da Paleta Fixa.** Só as primitivas do Paideia e as derivações dos modos. Mudar a paleta exige instrução explícita do Daniel.

**A Regra do Papel, Não da Cor.** Telas usam cores semânticas (`bg-surface`, `text-ink`, `text-accent`, `bg-action`); primitivas `paideia-*` só nas áreas de pedra que não mudam com o tema e no templo.

## Typography

**Display Font:** EB Garamond (com Georgia, serif), variável, com itálico.
**Body Font:** Hanken Grotesk (com system-ui, sans-serif), variável.

**Character:** a serifa renascentista dá a voz de códice aos títulos e aos números; a grotesca sóbria carrega a interface e a leitura sem disputar com ela.

### Hierarchy
- **Display** (500, clamp 2.25–3.25rem, 1.05): abertura de página de destaque (`.t-display`).
- **Título** (500, clamp 1.75–2.25rem, 1.12): título de página (`.t-titulo`).
- **Subtítulo** (500, 1.375rem, 1.25): título de seção (`.t-subtitulo`).
- **Romano** (EB Garamond 500, espaçamento 0.08em, algarismos alinhados): marcadores de seção, épocas, numeração (`.t-romano`, `.marcador`).
- **Leitura** (400, 1.125rem, 1.7, medida de 66 caracteres): texto longo e modo foco (`.t-leitura`).
- **Corpo** (400, 1rem, 1.6): texto corrido (`.t-corpo`).
- **Interface** (500, 0.875rem, 1.4): botões, abas, rótulos de controle (`.t-interface`).
- **Nota** (400, 0.8125rem, 1.35, `ink-muted`): metadados e legendas (`.t-nota`).
- **Micro** (0.6875rem, 1.2): só os rótulos do menu do celular, sob o algarismo romano.

### Named Rules
**A Regra do Marcador Romano.** Toda seção se abre com algarismo romano e filete; nenhum rótulo pequeno acima do título.

**A Regra das Duas Vozes.** Serifa só para títulos e romanos; tudo o que se clica ou se lê em bloco é Hanken Grotesk.

## Layout

Escala de espaço de 4px (`--space-1` a `--space-8`: 4, 8, 12, 16, 24, 32, 48, 64px). Gutter de 16px no celular, 24px a partir de 640px e 32px a partir de 1024px; respiro entre seções de 32px, e 48px no desktop. Grade de 4 colunas no celular, 8 no tablet e 12 no desktop (`.grade`), com espaçamento igual ao gutter. Sem menu lateral: o conteúdo de toda tela autenticada fica centralizado no container `pagina` (72rem), com o gutter dos lados; o cabeçalho usa o mesmo container. Texto longo com medida de 66 caracteres.

No modo foco, o cabeçalho, a barra do celular e o botão do Sócrates somem, e o conteúdo se centraliza na medida de leitura. A saída é um texto discreto no canto ("Sair do modo foco") e a tecla Esc.

## Elevation & Depth

Profundidade mínima: superfícies se separam do fundo pela cor e por bordas finas, não por sombra. Duas sombras existem, ambas quase imperceptíveis no claro e mais densas no escuro.

### Shadow Vocabulary
- **Contato** (`--shadow-1`: `0 1px 2px rgb(36 28 16 / 0.06)`): cartões. Some no modo foco.
- **Sobreposição** (`--shadow-2`: `0 16px 40px -20px rgb(36 28 16 / 0.35)`): gavetas, menus e diálogos.

### Named Rules
**A Regra da Base Firme.** Nada flutua sem motivo: a sombra é para o que se sobrepõe, não para o que repousa.

## Shapes

Raios discretos, de arquitetura: 2px a 10px (cartões 8px, botões 6px, campos 4px); pílula só em selos e no botão do Sócrates. Filete de 0,5px (`--rule-width`, `.filete`, `border-hair`) em dourado translúcido para marcar seções; bordas de 1px em `rule` para contornar superfícies. O templo é a forma-mãe: frontão triangular, colunas retas, base em degraus.

## Components

Componentes base em `components/ui/`, todos nos três modos, com foco visível, teclado e ARIA. Vitrine com todos os estados: `/design/componentes` (só em desenvolvimento). Em aparelhos de toque, o alvo mínimo é de 44px, e o hover só vale onde há mouse (`hoverOnlyWhenSupported`). As classes antigas `.btn-*`, `.card` e `.label-caps` e os componentes de `primitives.tsx` continuam até as telas serem migradas.

| Componente | Arquivo | Uso |
|---|---|---|
| `Botao`, `classesBotao` | `botao.tsx` | Variantes primário, secundário (contorno) e discreto (texto); tamanhos md e sm; estados hover, pressionado, foco, carregando (`aria-busy`) e desativado. `classesBotao` aplica o visual a um `Link`. |
| `CampoTexto`, `AreaTexto`, `Selecao` | `campo.tsx` | Rótulo, ajuda e erro ligados por `aria-describedby`; `aria-invalid` no erro; 16px no celular. |
| `Cartao`, `Painel` | `cartao.tsx` | Cartão: superfície contornada com sombra de contato. Painel: região plana aberta por filete. |
| `CabecalhoSecao` | `cabecalho-secao.tsx` | Marcador romano com filete e título (h2 ou h3), com descrição e ação opcionais. |
| `Selo`, `SeloEstadoObra`, `SeloGrau` | `selo.tsx` | Tons neutro, dourado, ação e contorno; estado da obra (só "semente" definido); grau de iniciação em romano (nomes dos graus em aberto). |
| `AvisoProvider`, `useAviso` | `aviso.tsx` | Aviso discreto no rodapé (neutro, sucesso, erro com ação opcional); pausa com mouse ou foco; erro usa `role="alert"`. O provedor está no layout raiz. |
| `Esqueleto`, `EsqueletoCartao`, `EsqueletoLista`, `EsqueletoGrade` | `esqueleto.tsx` | Carregamento no lugar do conteúdo, com `role="status"`. `app/(shell)/loading.tsx` usa a grade entre navegações. |
| `Gaveta`, `Dialogo` | `sobreposicao.tsx` | Foco preso, Esc fecha, clique no fundo fecha, rolagem da página travada, foco devolvido a quem abriu. Gaveta: lateral, tela cheia no celular. Diálogo: central (base no celular); `alerta` para confirmações. |
| `ColunaProgresso`, `ColunaSVG` | `coluna-progresso.tsx` | A coluna do templo como barra de progresso, sem número escrito; o leitor de tela ouve "vazia", "começando a encher", "mais da metade cheia" ou "cheia". `ColunaSVG` é a mesma coluna dentro de outro SVG (o templo a usa). |

### Buttons
- **Shape:** cantos discretos (6px).
- **Primary:** fundo `action`, texto `on-action`, semibold, 10px × 16px; verde com texto dourado no claro e no foco, dourado com texto verde no escuro.
- **Hover / Focus:** fundo `action-hover` em movimento discreto; anel de foco de 2px em `focus`, afastado 2px. Sem sombra.
- **Secondary:** fundo `surface`, borda `rule`, texto `ink`; hover em `canvas`.

### Chips
- **Style:** selos em pílula de 11px semibold: neutro (`muted`), dourado (dourado translúcido com texto `gold-ink`), ação (`action` com `on-action`).

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** `surface` sobre `canvas`.
- **Shadow Strategy:** contato (ver Elevation & Depth).
- **Border:** 1px `rule` a 70%.
- **Internal Padding:** 1.25rem.

### Inputs / Fields
- **Style:** fundo `surface`, borda `rule`, cantos de 4px.
- **Focus:** anel de foco global em `focus`.

### Navigation
- **Cabeçalho, a "arquitrave"** (fixo ao rolar): sobre a superfície do tema (`surface`), não sobre a pedra verde. Não há menu lateral; o conteúdo ocupa a largura inteira, no container `pagina` (72rem). O título da tela não aparece no topo: a navegação já mostra onde o aluno está.
  - **Faixa de cima** (56px): marca "Paideia" (leva ao Início) à esquerda; à direita a busca ("Buscar ou ir para", com a dica Ctrl K, ainda sem função), o seletor dos três modos e o menu da conta (círculo com a inicial). O menu da conta tem Configurações, Sair e, só para o administrador, a seção Administração (Obras, Exercícios, Sócrates, Usuários). Fecha com Esc, clique fora ou ao navegar.
  - **Faixa de baixo** (a partir de 768px): a navegação centralizada, cada item com seu romano em `gold-ink` (I Início, II Obras, III Funções, IV Épocas, V Carteira, VI Sócrates); item ativo em `ink` semibold, com sublinhado dourado e `aria-current`. Entre um filete fino em cima (`.filete`) e um filete duplo embaixo (`.filete-duplo-baixo`, 3px double).
  - **Ao rolar:** ganha uma sombra de filete discreta (linha de `rule-strong` e sombra curta de tinta).
- **Celular** (abaixo de 768px): no topo ficam só a marca, a busca (apenas ícone) e a conta; o seletor de modo vai para dentro do menu da conta. A navegação desce para a barra inferior de pedra verde, com os mesmos seis romanos e rótulos `micro`, alvo de 56px, item ativo em dourado com traço no topo; respeita a área segura.
- **Modo foco:** cabeçalho, barra do celular e botão do Sócrates somem.

### Templo
Elemento central do Início e único momento de assinatura: SVG com frontão, arquitrave, 7 colunas (uma por função pedagógica) e estilóbato. A coluna se enche de dourado de baixo para cima; com todas cheias, o frontão se acende. Ao carregar, as colunas sobem em sequência (`--motion-signature-duration` 1100ms, `--motion-signature-ease`, intervalo `--motion-signature-stagger` 90ms).

### Sócrates
Botão circular fixo de pedra verde com borda dourada e gaveta lateral em `surface` com sombra de sobreposição; tela cheia no celular. Some no modo foco.

### Movimento
- **Discreto** (`--motion-subtle-duration` 180ms, `--motion-subtle-ease` `cubic-bezier(0.22, 1, 0.36, 1)`; utilitários `duration-discreto ease-discreto`): respostas a ações, como hover, abrir e confirmar.
- **Assinatura** (`--motion-signature-duration` 1100ms, `--motion-signature-ease` `cubic-bezier(0.16, 1, 0.3, 1)`): só no templo.
- **Movimento reduzido:** com `prefers-reduced-motion: reduce`, todas as durações caem para 0,01ms e o templo aparece montado.

## Do's and Don'ts

### Do:
- **Do** usar cores semânticas nas telas (`bg-canvas`, `bg-surface`, `text-ink`, `text-ink-muted`, `text-accent`, `bg-action`) e primitivas só na pedra fixa e no templo.
- **Do** montar telas novas com os componentes de `components/ui/`.
- **Do** abrir cada seção com o marcador romano e filete.
- **Do** usar EB Garamond só em títulos e algarismos romanos, e Hanken Grotesk no resto.
- **Do** manter o anel de foco visível em todo elemento interativo.
- **Do** usar ícones Lucide.
- **Do** respeitar `prefers-reduced-motion` em qualquer movimento.

### Don't:
- **Don't** usar eyebrow (rótulo pequeno acima do título). As telas atuais ainda usam `.label-caps`; ele sai no redesign de cada tela.
- **Don't** usar emoji ou caractere Unicode no lugar de ícone.
- **Don't** mudar a paleta sem instrução explícita do Daniel.
- **Don't** usar pastel chapado nem cores saturadas ou infantis.
- **Don't** criar um segundo momento de movimento marcante fora do templo.
