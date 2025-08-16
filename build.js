import { build } from "vite";
import { resolve } from "path";

async function buildExtension() {
  console.log("Building PromptHero Chrome Extension...");

  // Build popup
  await build({
    configFile: false,
    build: {
      outDir: "dist/popup",
      rollupOptions: {
        input: resolve("src/popup/index.html"),
        output: {
          entryFileNames: "index.js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [(await import("@vitejs/plugin-react")).default()],
  });

  // Build options
  await build({
    configFile: false,
    build: {
      outDir: "dist/options",
      rollupOptions: {
        input: resolve("src/options/index.html"),
        output: {
          entryFileNames: "index.js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [(await import("@vitejs/plugin-react")).default()],
  });

  // Build background script
  await build({
    configFile: false,
    build: {
      outDir: "dist/background",
      rollupOptions: {
        input: resolve("src/background/background.ts"),
        output: {
          entryFileNames: "background.js",
          format: "es",
        },
      },
    },
  });

  console.log("Build complete!");
}

buildExtension().catch(console.error);
