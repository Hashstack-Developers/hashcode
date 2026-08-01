import type { Config } from "tailwindcss";

/**
 * Hashstack Developers design tokens.
 * Project uses Tailwind v4 (`@theme` in globals.css). This config
 * documents the named palette for tooling and future Tailwind v3-style refs.
 */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        cream: "#faf8f0",
        gold: "#ca8a04",
        background: "#000000",
        foreground: "#faf8f0",
        accent: "#ca8a04",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
