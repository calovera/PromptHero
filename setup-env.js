#!/usr/bin/env node

// Setup script to configure environment variables and prepare the extension for development
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔧 Setting up PromptHero development environment...\n");

// Load environment configuration
const envConfig = (await import("./env.config.js")).default;

// Set environment variables
process.env.GEMINI_API_KEY = envConfig.GEMINI_API_KEY;
process.env.SESSION_SECRET = envConfig.SESSION_SECRET;

console.log("✅ Environment variables configured:");
console.log(
  `   GEMINI_API_KEY: ${envConfig.GEMINI_API_KEY.substring(0, 20)}...`
);
console.log(
  `   SESSION_SECRET: ${envConfig.SESSION_SECRET.substring(0, 20)}...\n`
);

// Check if dist folder exists, if not build the extension
if (!fs.existsSync(path.join(__dirname, "dist"))) {
  console.log("📦 Building extension...");
  try {
    execSync("./build.sh", { stdio: "inherit" });
    console.log("✅ Build completed successfully\n");
  } catch (error) {
    console.error("❌ Build failed:", error.message);
    process.exit(1);
  }
}

// Run the development setup
console.log("🔑 Configuring API key for development...");
try {
  execSync("node setup-dev.js", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Development setup failed:", error.message);
  process.exit(1);
}

console.log("\n🎉 Setup complete! Your extension is ready for testing.");
console.log("\n📋 Next steps:");
console.log("1. Open Chrome and go to chrome://extensions/");
console.log('2. Enable "Developer mode" in the top right');
console.log('3. Click "Load unpacked" and select the ./dist folder');
console.log("4. The PromptHero extension should appear in your toolbar");
console.log("\n🧪 Try testing the prompt scoring and optimization features!");
