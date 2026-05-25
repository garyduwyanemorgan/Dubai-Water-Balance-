import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: "#e9e1d2",
          light: "#f4efe4",
          dark: "#d8ccb4",
        },
        deepblue: {
          DEFAULT: "#1c3d5a",
          light: "#2f5a7e",
          dark: "#122a40",
        },
        brackish: {
          DEFAULT: "#3f6b5e",
          light: "#56897a",
          dark: "#2c4d43",
        },
        amber: {
          DEFAULT: "#c8881f",
          light: "#e0a23a",
          dark: "#9c6912",
        },
        brine: {
          DEFAULT: "#9b3434",
          light: "#bb4646",
        },
        ink: "#1a1a17",
        muted: "#6b6a63",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        hydro: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
