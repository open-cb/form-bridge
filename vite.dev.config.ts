import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'example'),
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'example/index.html'),
        about: resolve(__dirname, 'example/about.html'),
      }
    }
  }
})
