import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
          // Curva Ordem → Crise → Restauração do Mapa dos Estudos. Mesma
          // disciplina de saturação da paleta base: nada de cor pura de UI.
          fase: {
            ordem: { soft: "#DEE6ED", base: "#44637E", deep: "#2B4154" },
            crise: { soft: "#EFE0DC", base: "#914C3B", deep: "#633127" },
            restauracao: { soft: "#DAECE4", base: "#2A7E5B", deep: "#1B553F" },
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Títulos, números de destaque e labels sobem um degrau na escala.
        lg: ["1.25rem", { lineHeight: "1.75rem" }],
        xl: ["1.5rem", { lineHeight: "2rem" }],
        "2xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "3xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "4xl": ["3rem", { lineHeight: "1" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,16,8,0.06), 0 10px 30px -10px rgba(20,16,8,0.16)",
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.625rem",
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
