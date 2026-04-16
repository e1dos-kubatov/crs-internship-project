/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'cwd-blue': '#0369a1',
        'cwd-ink': '#0f172a',
        'cwd-clay': '#c2410c',
        'cwd-sand': '#fff7ed',
        'cwd-mint': '#059669',
      },
      letterSpacing: {
        tightest: '-.05em',
      }
    },
  },
  plugins: [],
}
