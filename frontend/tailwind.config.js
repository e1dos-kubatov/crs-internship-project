/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'cwd-blue': '#003366',
        'cwd-gray-dark': '#222222',
        'cwd-gray-light': '#333333',
      },
      letterSpacing: {
        tightest: '-.05em',
      }
    },
  },
  plugins: [],
}