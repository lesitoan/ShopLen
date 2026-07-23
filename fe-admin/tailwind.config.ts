import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/screens/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: "#111524",
          mid: "#14192B",
          deep: "#0F121F",
        },
        surface: {
          DEFAULT: "#1F2438",
          hover: "#282F48",
          active: "#2F3754",
          muted: "#171B2B",
        },
        primary: {
          DEFAULT: "#10B981",
          hover: "#059669",
          active: "#047857",
          light: "rgba(16, 185, 129, 0.15)",
          glow: "rgba(16, 185, 129, 0.3)",
        },
        secondary: {
          DEFAULT: "#34D399",
          hover: "#10B981",
        },
        border: {
          DEFAULT: "#2C3552",
          light: "#384366",
          subtle: "#21283E",
        },
        text: {
          primary: "#E2E8F0",
          secondary: "#94A3B8",
          muted: "#64748B",
          highlight: "#F8FAFC",
        },
        status: {
          success: "#34D399",
          warning: "#FBBF24",
          danger: "#F87171",
          info: "#60A5FA",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;

