import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["Source Serif 4", "Georgia", "serif"],
        mono: ["DM Mono", "ui-monospace", "monospace"],
        dm: ["DM Sans", "Inter", "sans-serif"],
      },
      colors: {
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
      },
    },
  },
  plugins: [],
};
export default config;
