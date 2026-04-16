import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      "2xs": ["10px", { lineHeight: "1.4" }],
      "xs": ["11px", { lineHeight: "1.45" }],
      "sm": ["12px", { lineHeight: "1.5" }],
      "base": ["13px", { lineHeight: "1.6" }],
      "md": ["14px", { lineHeight: "1.6" }],
      "lg": ["15px", { lineHeight: "1.6" }],
      "xl": ["16px", { lineHeight: "1.5" }],
      "2xl": ["18px", { lineHeight: "1.4" }],
      "3xl": ["22px", { lineHeight: "1.3" }],
      "4xl": ["28px", { lineHeight: "1.2" }],
      "5xl": ["36px", { lineHeight: "1.15" }],
      "6xl": ["44px", { lineHeight: "1.1" }],
      "7xl": ["56px", { lineHeight: "1.05" }],
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        dm: ["var(--font-dm)", "var(--font-inter)", "sans-serif"],
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
