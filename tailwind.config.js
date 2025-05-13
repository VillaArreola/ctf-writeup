/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md}"],
  theme: {
    extend: {
      colors: {
        terminalBg: '#0d1117',
        terminalGreen: '#39ff14',
        terminalCyan: '#00ffff',
        terminalGray: '#1f2937',
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
      },
      typography: {
        invert: {
          css: {
            a: { color: '#22d3ee', '&:hover': { color: '#67e8f9' } },
            h1: { color: '#ffffff' },
            h2: { color: '#e0f2fe' },
            p: { color: '#cbd5e1' },
            strong: { color: '#fff' },
            code: { color: '#facc15' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
