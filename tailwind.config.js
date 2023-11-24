/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          primary: "#0ea5e9",
          secondary: "#22d3ee",
          accent: "#4f46e5",
          neutral: "#6b7280",
          "neutral-content": "#d1d5db",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          info: "#a5f3fc",
          success: "#22c55e",
          warning: "#facc15",
          error: "#dc2626",
        },
      },
      {
        dark: {
          primary: "#38bdf8",
          secondary: "#0284c7",
          accent: "#818cf8",
          neutral: "#9ca3af",
          "neutral-content": "#404040",
          "base-100": "#171717",
          "base-200": "#1f2937",
          info: "#009ee4",
          success: "#00b17d",
          warning: "#eac700",
          error: "#f1293c",
        },
      },
    ],
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // For the "layouts" directory
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require("daisyui"),
    plugin(({ addVariant }) => {
      addVariant("dark", '&[data-theme="dark"]');
    }),
  ],
};
