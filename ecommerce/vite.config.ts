// vite.config.ts - versión corregida
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
    proxy: {
      '/api': 'https://a2d6d6344a19e42dda5e217bcbd1a685-1049325702.us-east-1.elb.amazonaws.com'
    }
  }
})