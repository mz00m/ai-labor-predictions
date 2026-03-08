import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          200: "#bce0ff",
          300: "#8ecdff",
          400: "#59b0ff",
          500: "#3b8eff",
          600: "#1b6af5",
          700: "#1555e1",
          800: "#1845b6",
          900: "#1a3d8f",
          950: "#152757",
        },
      },
    },
  },
  plugins: [],
};

export default config;
