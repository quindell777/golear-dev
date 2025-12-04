import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/",
  server: {
    proxy: {
      // Qualquer requsição que comece com /api será redirecionada para o backend
      '/api': {
        target: 'https://api-vercel-1-krrk.onrender.com/', // Aponta para o backend online
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
