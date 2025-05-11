/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md}"],
  theme: {
    extend: {
  colors: {
    terminalBg: '#0d1117',        // fondo casi negro
    terminalGreen: '#39ff14',     // verde fosforescente
    terminalCyan: '#00ffff',      // cyan brillante
    terminalGray: '#1f2937',      // gris oscuro para bordes/cajas
  },
  fontFamily: {
    mono: ['"Fira Code"', 'monospace'],
  },
}

  },
  plugins: [require('@tailwindcss/typography')],
};
