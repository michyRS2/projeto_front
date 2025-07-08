import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: '_redirects',
          dest: '.' // coloca na raiz da pasta dist
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
  },
  base: '/',
  server: {
    host: true
  }
});
