/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        accent: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            a: {
              color: "#4f46e5",
              "&:hover": { color: "#4338ca" },
            },
            "pre code": {
              backgroundColor: "transparent",
            },
          },
        },
        invert: {
          css: {
            a: {
              color: "#818cf8",
              "&:hover": { color: "#a5b4fc" },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
