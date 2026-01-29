import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    tailwindcss({
      config: './tailwind.config.js'
    }),

    eslint({
      cache: false,
      include: [ 'src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx' ],
    }),

    checker({ typescript: true }),
  ],
})
