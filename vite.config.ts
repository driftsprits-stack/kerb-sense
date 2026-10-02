import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// The site is a GitHub Pages project page, so every URL starts with the
// repository name. The game at public/play/ is copied as-is.
export default defineConfig({
  base: '/kerb-sense/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // Keep every image as a hashed file so the browser cache works (E22).
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        cookies: resolve(__dirname, 'cookies/index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
      output: {
        // three.js and the viewer live in their own lazy chunk.
        manualChunks: (id) => {
          if (/node_modules\/(three|@react-three|three-stdlib|meshoptimizer)\//.test(id)) return 'three';
          return undefined;
        },
      },
    },
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
