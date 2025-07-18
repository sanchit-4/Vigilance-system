import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://szerfvakezomcyqvxdvf.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZXJmdmFrZXpvbWN5cXZ4ZHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDEzMzYsImV4cCI6MjA2NzExNzMzNn0.HOb3ybZG0wCEgCHaekYr7QEdT0CCQUqA4vlgH6aqTHg')
  }
})