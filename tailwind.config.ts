import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      // Micro & body scale
      "3xs": ["9px", { lineHeight: "1.4" }],
      "2xs": ["10px", { lineHeight: "1.4" }],
      "xs": ["11px", { lineHeight: "1.45" }],
      "sm": ["12px", { lineHeight: "1.5" }],
      "base": ["13px", { lineHeight: "1.6" }],
      "md": ["14px", { lineHeight: "1.6" }],
      "lg": ["15px", { lineHeight: "1.6" }],
      "xl": ["16px", { lineHeight: "1.5" }],
      "prose": ["17px", { lineHeight: "1.6" }],
      "2xl": ["18px", { lineHeight: "1.4" }],
      // Heading & display scale
      "heading-sm": ["20px", { lineHeight: "1.45" }],
      "3xl": ["22px", { lineHeight: "1.3" }],
      "heading": ["24px", { lineHeight: "1.35" }],
      "heading-lg": ["26px", { lineHeight: "1.3" }],
      "4xl": ["28px", { lineHeight: "1.2" }],
      "heading-xl": ["30px", { lineHeight: "1.25" }],
      "heading-2xl": ["32px", { lineHeight: "1.2" }],
      "title-sm": ["34px", { lineHeight: "1.2" }],
      "5xl": ["36px", { lineHeight: "1.15" }],
      "title": ["40px", { lineHeight: "1.15" }],
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
        "muted-light": "var(--muted-light)",
        "muted-lighter": "var(--muted-lighter)",
        accent: "var(--accent)",
        "accent-text": "var(--accent-text)",
        "accent-light": "var(--accent-light)",
        highlight: "var(--highlight)",
        heading: "var(--heading)",
        "signal-positive": "var(--signal-positive)",
        "signal-negative": "var(--signal-negative)",
        "signal-warning": "var(--signal-warning)",
      },
      borderColor: {
        divider: "rgba(0, 0, 0, 0.04)",
        card: "rgba(0, 0, 0, 0.06)",
        strong: "rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
