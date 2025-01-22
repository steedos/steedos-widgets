import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // base: '/frontend/',
  server: {
    port: 3000, // 指定你想要的启动端口
    host: true, // 如果想要在局域网中访问，可以设置为 true
  },
});
