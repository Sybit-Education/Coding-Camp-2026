import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Oxlint from 'unplugin-oxlint/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Oxlint({
      path: 'src', // Scannt deinen src-Ordner
      watch: true, // Linter läuft live im Hintergrund mit
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // Wichtig für den Devcontainer!
    port: 5173
  }
})
