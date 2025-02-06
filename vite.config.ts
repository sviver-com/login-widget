import { defineConfig } from 'vite';

export default defineConfig({
  base: '/widget',
  server: {
    host: true,
    allowedHosts: true,
    port: 4700,
    strictPort: true,
  },
  build: {
    minify: true,
    lib: {
      entry: 'src/Index.ts',
      formats: ['es'],
      fileName: 'widget',
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
