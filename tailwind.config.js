/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        board: {
          blue: "#0052CC",
          bright: "#0065FF",
          navy: "#172B4D",
          subtle: "#5E6C84",
          bg: "#F4F5F7",
          hover: "#EBECF0",
          border: "#DFE1E6",
          green: "#00875A",
          greenBg: "#E3FCEF",
          blueBg: "#DEEBFF",
          orange: "#FFAB00",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(9, 30, 66, 0.15)",
        pop: "0 8px 24px rgba(9, 30, 66, 0.18)",
      },
    },
  },
  plugins: [],
};
