import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/character-sheet/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost',
      },
    },
  },
})
