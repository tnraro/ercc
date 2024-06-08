/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "/ercc/",
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./setupTest.ts"],
  }
})
