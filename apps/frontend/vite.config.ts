import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import createExternal from 'vite-plugin-external';

export default defineConfig({
  plugins: [react(),
    createExternal({
      interop: 'auto',
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      }
    })],
  // base: '/frontend/',
  server: {
    port: 3000, // 指定你想要的启动端口
    host: true, // 如果想要在局域网中访问，可以设置为 true
  },
});
