/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'creche-green': '#4ade80',
        'creche-dark': '#22c55e',
        'creche-blue': '#3b82f6',
      }
    },
  },
  plugins: [],
}