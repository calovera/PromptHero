#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import * as esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Building PromptHero Chrome Extension with esbuild...");

// Create dist directory structure
const dirs = [
  "dist/popup",
  "dist/options",
  "dist/background",
  "dist/icons",
  "dist/animations",
];
dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy static files
fs.copyFileSync("manifest.json", "dist/manifest.json");

// Copy and update popup HTML
let popupHtml = fs.readFileSync("src/popup/index.html", "utf8");
popupHtml = popupHtml.replace(/\.tsx/g, ".js");
// Add CSS link
popupHtml = popupHtml.replace(
  "</head>",
  '  <link rel="stylesheet" href="./index.css">\n</head>'
);
fs.writeFileSync("dist/popup/index.html", popupHtml);

// Copy and update options HTML
let optionsHtml = fs.readFileSync("src/options/index.html", "utf8");
optionsHtml = optionsHtml.replace(/\.tsx/g, ".js");
// Add CSS link
optionsHtml = optionsHtml.replace(
  "</head>",
  '  <link rel="stylesheet" href="./index.css">\n</head>'
);
fs.writeFileSync("dist/options/index.html", optionsHtml);

// Copy icons
const iconFiles = fs.readdirSync("public/icons");
iconFiles.forEach((file) => {
  if (file.endsWith(".png")) {
    fs.copyFileSync(`public/icons/${file}`, `dist/icons/${file}`);
  }
});

// Copy animations
const animationFiles = fs.readdirSync("src/animations");
animationFiles.forEach((file) => {
  if (file.endsWith(".json")) {
    fs.copyFileSync(`src/animations/${file}`, `dist/animations/${file}`);
  }
});

// Build popup with esbuild
console.log("Building popup...");
try {
  await esbuild.build({
    entryPoints: ["src/popup/index.tsx"],
    bundle: true,
    outfile: "dist/popup/index.js",
    format: "iife",
    platform: "browser",
    target: "es2020",
    minify: false,
    sourcemap: false,
    external: ["chrome"],
    loader: { ".css": "css" },
  });
  console.log("✅ Popup built successfully");
} catch (error) {
  console.error("❌ Popup build failed:", error);
  process.exit(1);
}

// Build options with esbuild
console.log("Building options...");
try {
  await esbuild.build({
    entryPoints: ["src/options/index.tsx"],
    bundle: true,
    outfile: "dist/options/index.js",
    format: "iife",
    platform: "browser",
    target: "es2020",
    minify: false,
    sourcemap: false,
    external: ["chrome"],
    loader: { ".css": "css" },
  });
  console.log("✅ Options built successfully");
} catch (error) {
  console.error("❌ Options build failed:", error);
  process.exit(1);
}

// Build background script with esbuild
console.log("Building background script...");
try {
  await esbuild.build({
    entryPoints: ["src/background/background.ts"],
    bundle: true,
    outfile: "dist/background/background.js",
    format: "esm",
    platform: "browser",
    target: "es2020",
    minify: false,
    sourcemap: false,
    external: ["chrome"],
  });
  console.log("✅ Background script built successfully");
} catch (error) {
  console.error("❌ Background script build failed:", error);
  process.exit(1);
}

console.log("Build complete! Extension is ready in ./dist/");
console.log("Load the extension in Chrome by:");
console.log("1. Open Chrome and go to chrome://extensions/");
console.log("2. Enable Developer mode");
console.log('3. Click "Load unpacked" and select the ./dist folder');
