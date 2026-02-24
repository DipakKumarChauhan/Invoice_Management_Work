/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // IMPORTANT
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e"
      },
      borderRadius: {
        xl: "14px"
      }
    }
  },
  plugins: []
};