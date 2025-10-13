import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://java:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
