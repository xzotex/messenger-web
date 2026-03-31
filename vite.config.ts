import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 6000,
    host: '0.0.0.0',
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
})
