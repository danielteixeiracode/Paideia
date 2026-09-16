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
          // Verde fechado, quase petróleo/floresta — sóbrio e de baixa saturação
          // em toda a rampa, do fundo mais profundo (950) ao tom de maior destaque (500).
          green: {
            950: "#0C1815",
            900: "#142420",
            800: "#1D342D",
            700: "#2A473D",
            600: "#385C4F",
            500: "#487060",
          },
          // Dourado amadeirado/envelhecido (latão antigo), não amarelo-ouro vibrante.
          gold: {
            300: "#CDBB98",
            400: "#BA9F6D",
            500: "#A28149",
            600: "#816437",
            700: "#624B28",
          },
          cream: {
            50: "#FDF8EF",
            100: "#FAF1DF",
            200: "#F5E7CB",
            300: "#EFDCB3",
          },
          ink: "#241C10",
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
