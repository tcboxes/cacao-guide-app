import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // FIX: The /// <reference types="node" /> directive was removed as it caused a "Cannot find type definition file" error.
  // `process` is cast to `any` to access `cwd()` to bypass TypeScript errors when full Node.js types are not available.
  const env = loadEnv(mode, (process as any).cwd(), '')
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    plugins: [react()],
  }
})
