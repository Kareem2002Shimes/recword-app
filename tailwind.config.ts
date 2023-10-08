import { type Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
      },
    },

    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
  },

  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],

          primary: "rgb(14,165,233)",

          secondary: "#ef9fbc",

          accent: "rgb(15,23,42)",

          neutral: "#fff",

          "base-100": "#F8FAFC",

          info: "rgb(51,65,85)",

          success: "#36d399",

          warning: "#fbbd23",

          error: "#f87272",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],

          primary: "rgb(14,165,233)",

          secondary: "#ef9fbc",

          accent: "rgb(226,232,240)",

          neutral: "rgb(30 41 59 / 0.5)",

          "base-100": "rgb(15, 23 ,42)",

          info: "rgb(148,163,184)",

          success: "#36d399",

          warning: "#fbbd23",

          error: "#f87272",
        },
      },
    ],
  },
  darkMode: ["class", '[data-theme="dark"]'],
} satisfies Config;
