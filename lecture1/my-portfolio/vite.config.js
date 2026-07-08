import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Actions → '/my-first-website/' (GitHub Pages 서브경로)
  // Vercel / 로컬   → '/' (루트)
  base: process.env.GITHUB_ACTIONS ? '/my-first-website/' : '/',
})
