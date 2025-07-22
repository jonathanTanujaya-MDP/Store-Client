import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'react-hot-toast'],
          table: ['@tanstack/react-table']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    host: true,
    // Fix for React Router - fallback to index.html for all routes
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  preview: {
    port: 5173,
    host: true
  }
})
