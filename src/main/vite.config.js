import { node } from "../../.electron-vendors.cache.json";
import { join } from "path";
import { builtinModules } from "module";

const ROOT = __dirname;
const resolve = dir => join(ROOT, dir);

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      "@": resolve("lib"),
    },
  },
  build: {
    sourcemap: "inline",
    target: `node${node}`,
    outDir: resolve("../../dist/main"),
    assetsDir: ".",
    minify: process.env.MODE !== "development",
    lib: {
      entry: "lib/index.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["electron", "electron-devtools-installer", ...builtinModules.flatMap(p => [p, `node:${p}`])],
      output: {
        entryFileNames: "[name].cjs",
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;
