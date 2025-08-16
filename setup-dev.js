// Development setup script to configure the API key for testing
// This script will inject the GEMINI_API_KEY into the built extension for easy testing

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment configuration
const envConfig = (await import("./env.config.js")).default;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || envConfig.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY environment variable not found");
  console.log(
    "Please set the GEMINI_API_KEY environment variable and try again."
  );
  process.exit(1);
}

// Read the built background script
const backgroundPath = path.join(
  __dirname,
  "dist",
  "background",
  "background.js"
);

if (!fs.existsSync(backgroundPath)) {
  console.error("❌ Built extension not found. Please run ./build.sh first");
  process.exit(1);
}

let backgroundScript = fs.readFileSync(backgroundPath, "utf8");

// Replace the API key retrieval to use the environment variable for development
const replacementCode = `
// Development mode: Use environment API key
async function getStoredApiKey() {
  const devApiKey = "${GEMINI_API_KEY}";
  if (devApiKey) {
    console.log('🔑 Using development API key');
    return devApiKey;
  }
  
  try {
    const result = await chrome.storage.sync.get(['geminiApiKey']);
    return result.geminiApiKey || null;
  } catch (error) {
    console.error('Failed to get API key:', error);
    return null;
  }
}
`;

// Find the getStoredApiKey function and replace it
const functionRegex = /async function getStoredApiKey\(\)[^}]+\}[^}]*\}/s;
backgroundScript = backgroundScript.replace(
  functionRegex,
  replacementCode.trim()
);

// Write the modified script back
fs.writeFileSync(backgroundPath, backgroundScript);

console.log("✅ Development setup complete!");
console.log("🔑 API key configured for development mode");
console.log("🚀 Extension is ready for testing");
console.log("\nTo test the extension:");
console.log("1. Open Chrome and navigate to chrome://extensions/");
console.log('2. Enable "Developer mode" in the top right');
console.log('3. Click "Load unpacked" and select the ./dist folder');
console.log("4. The PromptHero extension should appear in your toolbar");
console.log("\n🧪 Try testing the prompt scoring and optimization features!");
