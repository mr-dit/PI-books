import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [PrimeVueResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/books-api': {
        target: 'http://188.120.243.137:8090',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    proxy: {
      '/books-api': {
        target: 'http://188.120.243.137:8090',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
