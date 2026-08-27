/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        panel: "#111A2B",
        gold: "#F0B429",
        coral: "#E85D4C",
        cream: "#FBF4E6",
      },
      fontFamily: {
        display: ["Almarai", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "serif"],
      },
    },
  },
  plugins: [],
};
