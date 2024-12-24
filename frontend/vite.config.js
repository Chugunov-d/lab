import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    tailwind: './tailwind.config.js',
  },
  server: {
    port: 3000,
  }
})
