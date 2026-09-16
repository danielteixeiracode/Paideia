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
          // Verdes mais vivos/saturados nos tons de destaque (500-700); 900/950
          // permanecem profundos e neutros para fundos e áreas de menor hierarquia.
          green: {
            950: "#0A2016",
            900: "#0F2E1F",
            800: "#0F5230",
            700: "#0E6B3D",
            600: "#159457",
            500: "#1FAE68",
          },
          // Dourados mais vibrantes nos tons de destaque (400-500), reservando
          // 700 para texto sóbrio sobre fundos claros.
          gold: {
            300: "#F0D584",
            400: "#EFC34A",
            500: "#E3A912",
            600: "#C08A0E",
            700: "#8F6B0E",
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
