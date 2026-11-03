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
  ink: "#241C10"
  surface-white: "#FFFFFF"
typography:
  display:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: "2.5rem"
  headline:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
  title:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  body:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  label:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  lg: "0.625rem"
  xl: "0.875rem"
  2xl: "1.125rem"
  3xl: "1.625rem"
  full: "9999px"
spacing:
  gutter-mobile: "1rem"
  gutter-tablet: "1.5rem"
  gutter-desktop: "2rem"
  card-padding: "1.25rem"
  grid-gap: "1.25rem"
  section-gap: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.green-800}"
    textColor: "{colors.gold-300}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.green-700}"
  button-secondary:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.cream-100}"
  card:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card-padding}"
  nav-item-active:
    backgroundColor: "{colors.gold-500}"
    textColor: "{colors.green-950}"
    rounded: "{rounded.lg}"
  badge-neutral:
    backgroundColor: "{colors.cream-200}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  badge-green:
    backgroundColor: "{colors.green-800}"
    textColor: "{colors.gold-300}"
    rounded: "{rounded.full}"
  input:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
---

# Design System: Paideia

<!-- Estado: sistema visual EM VIGOR antes do redesign (etapa 0), extraído de tailwind.config.ts e app/globals.css. A direção do redesign está em docs/design/briefing.md; onde os dois divergirem, o briefing vence, e este arquivo será refeito quando o novo sistema for implementado. -->

## Overview

**Creative North Star: [a definir com o Daniel na etapa 1 do redesign]**

O sistema atual é sóbrio e de alto contraste entre um verde floresta muito escuro e um dourado amadeirado, sobre fundo creme. As áreas de destaque e a navegação (sidebar, barra do celular, botão do Sócrates) são verde-escuras com texto dourado; a área de leitura é creme, com cartões brancos de cantos arredondados e sombra suave. Densidade média, uma coluna de conteúdo com grades de 2 a 3 cartões.

Este registro descreve o código como está. Pontos em que ele já diverge do briefing: os títulos usam a mesma família sem serifa do corpo (Libre Franklin), embora a classe se chame `font-serif`; quase todo título tem um rótulo em caixa alta acima dele (eyebrow), que o briefing proíbe; não há modo escuro, modo foco, filetes nem algarismos romanos como marcadores de seção.

**Key Characteristics:**
- Verde-escuro para estrutura e destaque, dourado para ação e acento, creme para leitura.
- Uma única família tipográfica (Libre Franklin) em todos os papéis.
- Cartões brancos arredondados com sombra suave como contêiner padrão.
- Ícones Lucide em traço fino.
- Um único momento de movimento: as colunas do templo sobem ao carregar o Início.

## Colors

Três famílias fixas: verde floresta com corpo, dourado amadeirado e creme quente, mais um quase-preto marrom para o texto.

### Primary
- **Verde Floresta Profundo** (green-900): fundo da sidebar, da barra de navegação do celular e do botão do Sócrates.
- **Verde Floresta** (green-800): botão primário, selo ativo, contorno do templo, links de texto.
- **Verde Floresta Claro** (green-700): hover do botão primário; cor dos rótulos em caixa alta.
- **Verde Musgo** (green-600, green-500): só no gradiente da barra de progresso.
- **Verde Quase Negro** (green-950): texto sobre o item ativo da navegação.

### Secondary
- **Dourado Amadeirado** (gold-500): item ativo da sidebar, anel de foco, borda do templo e do botão do Sócrates.
- **Dourado Claro** (gold-300, gold-400): texto dourado sobre verde; preenchimento das colunas do templo e frontão aceso.
- **Dourado Envelhecido** (gold-600, gold-700): texto de selo dourado; coluna destacada no templo.

### Neutral
- **Creme Pergaminho** (cream-100): fundo de toda a área autenticada e do login.
- **Creme Claro** (cream-50): fundos internos (itens de exercício, topo translúcido, pedra do templo).
- **Creme Médio** (cream-200, cream-300): selos neutros, bordas de cartões, campos e divisórias.
- **Tinta** (ink): todo o texto; tons secundários por transparência (60%, 50%).
- **Branco** (surface-white): fundo de cartões, tabelas, campos e botão secundário.

### Named Rules
**A Regra da Paleta Fixa.** Só estas cores. Mudar a paleta exige instrução explícita do Daniel (CLAUDE.md). Hoje os erros usam o vermelho padrão do Tailwind (red-50/600/700), fora da paleta.

## Typography

**Display Font:** Libre Franklin (com system-ui, sans-serif), pesos 600–800, com itálico.
**Body Font:** Libre Franklin (com system-ui, sans-serif), pesos 400–700.

**Character:** uma única grotesca humanista em todos os papéis; a hierarquia vem de tamanho e peso, não de contraste entre famílias.

### Hierarchy
- **Display** (600, 1.875rem no celular e 2.25rem a partir de 640px, linha 2.25–2.5rem): título da página.
- **Headline** (600, 1.5rem, linha 2rem): título de destaque em cartões.
- **Title** (600, 1.25rem, linha 1.75rem): título de seção e de cartão.
- **Body** (400, 0.875rem, linha 1.25rem): texto corrido e descrições.
- **Label** (600, 12px, espaçamento 0.1em, CAIXA ALTA, verde-700): rótulo acima de títulos (`.label-caps`, componente `Eyebrow`).

## Layout

Sidebar fixa de 16rem à esquerda a partir de 1024px; abaixo disso, barra de navegação inferior fixa e topo com busca. Conteúdo numa coluna com margens de 1rem (celular), 1.5rem (tablet) e 2rem (desktop), e respiro inferior de 6rem no celular por causa da barra. Seções separadas por 1.5rem; grades de cartões com espaçamento de 1.25rem, em 1 coluna no celular e 2 ou 3 colunas a partir de 640px e 1024px.

## Elevation & Depth

Profundidade por sombra suave sob cartões brancos sobre o creme, sem camadas tonais.

### Shadow Vocabulary
- **Sombra de cartão** (`box-shadow: 0 1px 2px rgba(20,16,8,0.06), 0 10px 30px -10px rgba(20,16,8,0.16)`): cartões, tabelas, menus e o botão do Sócrates.
- **Sombra de botão** (sombra pequena padrão do Tailwind, maior no hover): botões primário e secundário.

## Shapes

Cantos arredondados em toda parte: cartões (1.125rem), botões (0.875rem), campos e itens de navegação (0.625rem), selos e o botão do Sócrates em pílula/círculo. Bordas finas de 1px em creme-300. O templo é a única forma não arredondada: frontão triangular e colunas retas.

## Components

### Buttons
- **Shape:** cantos arredondados (0.875rem).
- **Primary:** fundo verde-800, texto dourado-300, semibold, 10px × 16px.
- **Hover / Focus:** fundo verde-700 e sombra maior; foco com contorno dourado-500 de 2px, afastado 2px.
- **Secondary:** fundo branco, borda creme-300, texto tinta; hover em creme-100.

### Chips
- **Style:** selos em pílula, 11px semibold: neutro (creme-200), dourado (dourado translúcido), verde (verde-800 com texto dourado) e vermelho para alerta.

### Cards / Containers
- **Corner Style:** 1.125rem.
- **Background:** branco sobre o creme da página.
- **Shadow Strategy:** sombra de cartão (ver Elevation & Depth).
- **Border:** 1px creme-300 a 70%.
- **Internal Padding:** 1.25rem.

### Inputs / Fields
- **Style:** fundo branco, borda creme-300, cantos de 0.625rem, texto 0.875rem.
- **Focus:** borda dourado-500.

### Navigation
- **Sidebar:** fundo verde-900, itens em creme a 80%; item ativo com fundo dourado-500 e texto verde-950; seção Admin separada por filete e rótulo em caixa alta.
- **Celular:** barra inferior verde-900 com ícone e rótulo de 10px; ativo em dourado-400; respeita a área segura do aparelho.

### Templo
Elemento central do Início: SVG com frontão, arquitrave, 7 colunas (uma por função pedagógica, numeradas 1 a 7) e estilóbato. A coluna se enche de dourado de baixo para cima; com todas cheias, o frontão se acende em dourado. Ao carregar, as colunas sobem uma após a outra (0.9s, atraso de 80ms entre colunas); com movimento reduzido, o templo aparece já montado.

### Sócrates
Botão circular fixo (verde-900, borda dourada) no canto inferior direito, e gaveta lateral branca de até 28rem, que ocupa a tela toda no celular.

## Do's and Don'ts

### Do:
- **Do** usar apenas as cores de `tailwind.config.ts`, pelos nomes `paideia-*`.
- **Do** manter o verde-escuro nas áreas de destaque e o creme como fundo de leitura.
- **Do** usar ícones Lucide.
- **Do** manter o foco visível dourado (2px, afastado 2px) em todo elemento interativo.
- **Do** respeitar `prefers-reduced-motion` em qualquer movimento.

### Don't:
- **Don't** mudar a paleta sem instrução explícita do Daniel.
- **Don't** usar eyebrow (rótulo pequeno acima do título) em telas novas; o briefing o proíbe, embora o código atual ainda o use.
- **Don't** usar pastel chapado nem cores saturadas ou infantis.
