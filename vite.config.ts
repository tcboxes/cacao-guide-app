/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // FIX: The /// <reference types="node" /> directive was added at the top of this file to fix a TypeScript error on `process.cwd()`.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    plugins: [react()],
  }
})