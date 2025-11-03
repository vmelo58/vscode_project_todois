import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const rollupParseAstAlias = 'rollup/dist/shared/parseAst.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'rollup/dist/es/parseAst.js': rollupParseAstAlias,
      'rollup/dist/es/shared/parseAst.js': rollupParseAstAlias,
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
