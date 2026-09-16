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
          green: {
            950: "#0A2016",
            900: "#0F2E1F",
            800: "#153D29",
            700: "#1C4B33",
            600: "#28613F",
            500: "#357850",
          },
          gold: {
            300: "#E8CE7A",
            400: "#DCB84A",
            500: "#C9A227",
            600: "#B08A1E",
            700: "#8C6C16",
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
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(36,28,16,0.06), 0 1px 12px rgba(36,28,16,0.04)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
