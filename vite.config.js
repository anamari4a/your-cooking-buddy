import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Ensure Vite binds to IPv4 localhost and a fixed port to avoid localhost resolution issues
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
