/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F7F8FA",
        surface: "#FFFFFF",
        border: "#E4E7EC",
        ink: "#101828",
        muted: "#667085",
        accent: "#2F6FED",
        "accent-soft": "#EAF1FE",
        success: "#12B76A",
        warning: "#F79009",
        danger: "#F04438",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 12px 32px -18px rgba(16, 24, 40, 0.18)",
      },
    },
  },
  plugins: [],
};