import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test.setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    }
  },
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
