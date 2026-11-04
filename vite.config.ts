import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 单文件产物是刻意保留的：README 约定导出一份静态 HTML，便于离线演示和 Pages 直接挂 dist。
// vite-plugin-singlefile 会打开 inlineDynamicImports，懒加载的图表分包仍会被塞回同一个 HTML，
// 所以体积靠按需引入 ECharts 和压缩背景图来降，而不是拆包。
// https://vite.dev/config/
export default defineConfig({
  base: "/gov-service-dashboard/",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
