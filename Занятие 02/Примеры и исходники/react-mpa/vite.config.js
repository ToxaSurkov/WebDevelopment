import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
export default defineConfig({
  plugins: [react()],
  build: {
    // Vite собирает три самостоятельных HTML-документа.
    rollupOptions: { input: {
      catalog: resolve(import.meta.dirname, 'index.html'),
      stats: resolve(import.meta.dirname, 'stats.html'),
      about: resolve(import.meta.dirname, 'about.html')
    }}
  }
});
