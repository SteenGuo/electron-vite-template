const { defineConfig } = require("vite");
const { join } = require("path");
const vue = require("@vitejs/plugin-vue");

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const ROOT = __dirname;
const resolve = (dir) => join(ROOT, dir);

const config = defineConfig({
  root: ROOT,
  base: "./",
  mode: process.env.MODE,
  server: {
    port: 8888,
    // proxy: {
    //   "/my-mock": {
    //     target: VITE_API_PROXY,
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/my-mock/, ""),
    //   },
    // },
  },
  build: {
    outDir: resolve("../../dist/renderer"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/common.scss";`,
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
});

module.exports = config;
