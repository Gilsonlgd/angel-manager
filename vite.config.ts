import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
import path from "path";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "src/core"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: "node18",
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: {
        main: "src/main.ts",
        bin: "src/bin/index.ts",
      },
      name: "main",
      fileName: (format, entryName) => {
        if (entryName === "bin") {
          return `bin/index.js`;
        }
        return `main.${format}.js`;
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["fs", "path", "url", "commander", "esbuild"],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
        }),
      ],
      output: {
        format: "es",
      },
    },
  },
});
