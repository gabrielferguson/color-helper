import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import type { Plugin } from 'vite'

// Plugin to ensure correct MIME types for TypeScript files
const fixMimeTypePlugin = (): Plugin => {
  return {
    name: 'fix-mime-type',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.ts')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.ts')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        }
        next()
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    fixMimeTypePlugin(),
  ],
  base: './', // 这里更改打包相对绝对路径
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/mywebtools/api': {
        target: 'http://127.0.0.1:3000',
      }
    },
    host: '0.0.0.0',
  }
})
