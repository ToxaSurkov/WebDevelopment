import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), svelte()],
  appType: 'mpa',
  server: {
    host: '127.0.0.1',
    port: 5176,
    strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
  build: {
    rollupOptions: {
      input: {
        react: resolve(import.meta.dirname, 'index.html'),
        svelte: resolve(import.meta.dirname, 'svelte.html'),
      },
    },
  },
});
