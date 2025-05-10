/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md}"],
  theme: {
    extend: {
      colors: {
        terminalBg: "#0d1117",
        terminalGreen: "#39ff14",
        terminalCyan: "#00ffff",
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
