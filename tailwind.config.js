/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#E3F2FD',
        'light-green': '#E8F5E8',
        'light-yellow': '#FFF9C4',
        'light-pink': '#FCE4EC',
        'light-orange': '#FFF3E0',
      }
    },
  },
  plugins: [],
}
