import type { Config } from "tailwindcss";

// Cor semântica: lê o canal RGB da variável do tema ativo (claro, escuro ou
// foco, definidos em app/globals.css) e aceita opacidade (bg-surface/60).
const semantica = (nome: string) => `rgb(var(--c-${nome}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primitivas: as cores do Paideia. Não mudam entre temas nem sem
        // instrução explícita do Daniel.
        paideia: {
          // Verde floresta/petróleo com corpo — sóbrio, mas com saturação
          // suficiente para não ficar sem vida nos tons de destaque (500-700).
          green: {
            950: "#0A1A14",
            900: "#11271F",
            800: "#164130",
            700: "#1C5940",
            600: "#287756",
            500: "#338E67",
          },
          // Dourado amadeirado com corpo — mais quente que um dourado apagado,
          // sem cair no amarelo-ouro vibrante.
          gold: {
            300: "#DCC48F",
            400: "#D1AC5C",
            500: "#B98C31",
            600: "#976F26",
            700: "#71541E",
          },
          cream: {
            50: "#FDF8EF",
            100: "#FAF1DF",
            200: "#F5E7CB",
            300: "#EFDCB3",
          },
          ink: "#241C10",
        },
        // Semânticas: o papel de cada cor, resolvido pelo tema ativo.
        canvas: semantica("canvas"), // fundo de leitura da página
        surface: semantica("surface"), // cartões, tabelas, campos
        sunken: semantica("sunken"), // áreas recuadas dentro de uma superfície
        muted: semantica("muted"), // selos neutros, trilhos, ícones de fundo
        rule: semantica("rule"), // bordas e filetes discretos
        "rule-strong": semantica("rule-strong"), // filetes de marcação (dourado)
        ink: semantica("ink"), // texto
        accent: semantica("accent"), // links e texto de destaque
        gold: semantica("gold"), // acento dourado decorativo
        "gold-ink": semantica("gold-ink"), // texto em dourado
        action: semantica("action"), // fundo da ação principal
        "action-hover": semantica("action-hover"),
        "on-action": semantica("on-action"), // texto sobre a ação principal
        focus: semantica("focus"), // anel de foco
      },
      fontFamily: {
        // EB Garamond: títulos e algarismos romanos. Hanken Grotesk: interface
        // e texto corrido. As variáveis vêm de next/font em app/layout.tsx.
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Escala por papel (ver DESIGN.md › Typography).
        display: ["clamp(2.25rem, 1.75rem + 2vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        titulo: ["clamp(1.75rem, 1.5rem + 1vw, 2.25rem)", { lineHeight: "1.12", letterSpacing: "-0.005em" }],
        subtitulo: ["1.375rem", { lineHeight: "1.25" }],
        leitura: ["1.125rem", { lineHeight: "1.7" }],
        corpo: ["1rem", { lineHeight: "1.6" }],
        interface: ["0.875rem", { lineHeight: "1.4" }],
        nota: ["0.8125rem", { lineHeight: "1.35" }],
        // Escala genérica herdada pelas telas atuais.
        lg: ["1.25rem", { lineHeight: "1.75rem" }],
        xl: ["1.5rem", { lineHeight: "2rem" }],
        "2xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "3xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "4xl": ["3rem", { lineHeight: "1" }],
      },
      maxWidth: {
        leitura: "var(--measure-reading)", // medida de leitura (~66 caracteres)
        pagina: "var(--measure-page)",
      },
      spacing: {
        gutter: "var(--gutter)",
        secao: "var(--space-section)",
      },
      borderWidth: {
        hair: "var(--rule-width)", // filete de 0,5px
      },
      boxShadow: {
        // Sombras mínimas: só um contato leve nos cartões e uma sombra de
        // sobreposição para gavetas e menus.
        card: "var(--shadow-1)",
        overlay: "var(--shadow-2)",
      },
      borderRadius: {
        // Raios discretos: arquitetura, não pílulas.
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
        lg: "4px",
        xl: "6px",
        "2xl": "8px",
        "3xl": "10px",
      },
      transitionDuration: {
        discreto: "var(--motion-subtle-duration)",
        assinatura: "var(--motion-signature-duration)",
      },
      transitionTimingFunction: {
        discreto: "var(--motion-subtle-ease)",
        assinatura: "var(--motion-signature-ease)",
      },
    },
  },
  plugins: [],
};
export default config;
