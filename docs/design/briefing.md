# Briefing de design — Paideia

- Clássico de verdade, em formato de códice impresso: serifa de títulos estilo Garamond, algarismos romanos como marcadores de seção, filetes e réguas finas, o templo de 7 colunas em SVG como elemento central do Início.
- Não usar "eyebrow" (rótulo pequeno acima do título). O marcador de seção é algarismo romano com filete.
- Paleta fixa: verde esmeralda profundo, dourado luminoso e creme/pergaminho. O verde escuro domina as áreas de destaque e o creme serve de fundo de leitura. Nada de pastel chapado, nada de saturação infantil.
- Creme com serifa é escolha expressa do briefing: se alguma skill o considerar clichê, o briefing vence.
- Manter os ícones Lucide.
- Sistema moderno por baixo: tokens de design, modo escuro, modo foco para leitura, paleta de comandos (Ctrl+K), atalhos de teclado, transições suaves entre telas, carregamento sem tela em branco, resposta imediata ao clicar.
- Movimento: um único momento marcante (no templo, a coluna sobe e acende e os números contam) e o resto discreto. Respeitar prefers-reduced-motion.
- O Sócrates está presente em toda tela (botão fixo e gaveta).
- Next.js (App Router) + Tailwind + TypeScript. Funcionar bem no celular.
