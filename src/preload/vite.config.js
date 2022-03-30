import { join } from "path";
import { chrome } from "../../.electron-vendors.cache.json";
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
  build: {
    sourcemap: "inline",
    target: `chrome${chrome}`,
    outDir: resolve("../../dist/preload"),
    assetsDir: ".",
    minify: process.env.MODE !== "development",
    lib: {
      entry: "lib/index.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["electron", ...builtinModules.flatMap(p => [p, `node:${p}`])],
      output: {
        entryFileNames: "[name].cjs",
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;
