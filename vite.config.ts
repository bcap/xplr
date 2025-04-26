import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: true,
  },
  esbuild: {
    supported: {
      'top-level-await': true //browsers should be handle top-level-await features
    }
  }
});
