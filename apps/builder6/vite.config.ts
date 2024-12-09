import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import externalGlobals from "rollup-plugin-external-globals";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    externalGlobals({
      react: "React",
      'react-dom': "ReactDOM",
    })
  ],
})
