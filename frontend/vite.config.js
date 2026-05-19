import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      include: [
        'src/App.jsx',
        'src/config/**/*.js',
        'src/pages/LoginPage.jsx',
        'src/services/**/*.js',
        'src/utils/authStorage.js',
        'src/utils/protectedActions.js',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
})
