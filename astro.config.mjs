import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ctf.villaarreola.com',
  vite: {
    plugins: [tailwind()],
  },
});
