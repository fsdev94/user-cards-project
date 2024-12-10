import { defineConfig } from 'vite';
import vitePluginString from 'vite-plugin-string';

export default defineConfig({
  plugins: [
    vitePluginString({
      include: '**/*.html',
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
});
