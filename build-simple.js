#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Building PromptHero Chrome Extension...");

// Create dist directory structure
const dirs = [
  "dist/popup",
  "dist/options",
  "dist/background",
  "dist/icons",
  "dist/lib",
  "dist/animations",
];
dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy HTML files
fs.copyFileSync("src/popup/index.html", "dist/popup/index.html");
fs.copyFileSync("src/options/index.html", "dist/options/index.html");

// Copy manifest
fs.copyFileSync("manifest.json", "dist/manifest.json");

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

// Build TypeScript files with tsc
console.log("Compiling TypeScript...");
try {
  execSync("npx tsc --outDir dist --project tsconfig.json", {
    stdio: "inherit",
  });
} catch (error) {
  console.error("TypeScript compilation failed:", error.message);
  process.exit(1);
}

// Manually bundle the background script with dependencies
console.log("Bundling background script...");
const backgroundScript = fs.readFileSync(
  "dist/background/background.js",
  "utf8"
);
const geminiScript = fs.readFileSync("dist/background/gemini.js", "utf8");
const schemaScript = fs.readFileSync("dist/lib/schema.js", "utf8");

// Create a bundled background script
const bundledBackground = `
// Bundled background script for PromptHero

// Simple validation functions (no external dependencies)
function validateScore(data) {
    if (typeof data !== 'object' || data === null) return false;
    if (typeof data.score !== 'number' || data.score < 0 || data.score > 100) return false;
    if (!Array.isArray(data.issues) || !Array.isArray(data.suggestions)) return false;
    if (data.issues.length > 8 || data.suggestions.length > 8) return false;
    return true;
}

function validateOptimize(data) {
    if (typeof data !== 'object' || data === null) return false;
    if (typeof data.improved_prompt !== 'string' || data.improved_prompt.length === 0) return false;
    if (!Array.isArray(data.checklist) || data.checklist.length > 12) return false;
    return true;
}

// Gemini API functions
const SCORER_SYSTEM = "You are a prompt quality judge. Return JSON only that passes this schema: { score: number 0..100, issues: string[], suggestions: string[] }. Scoring rubric: Clarity 25, Specificity 25, Constraints 20, Context 15, Output format 10, Token efficiency 5. Keep issues and suggestions short and actionable. No extra text.";
const SCORER_USER = (template) => \`Evaluate this prompt.
PROMPT
\${template}
Return JSON only.\`;

const OPTIMIZER_SYSTEM = "You are a prompt engineer. Rewrite the prompt to maximize task success while keeping the same goal. If the prompt is vague or brief, infer reasonable defaults and add missing context requests and constraints. Add clear step-by-step instructions. Specify the desired output format. Keep it concise and token-efficient. Return JSON only that passes: { improved_prompt: string, checklist: string[] }. Checklist lists what you improved. No extra text.";
const OPTIMIZER_USER = (template) => \`Rewrite this prompt.
PROMPT
\${template}
Return JSON only.\`;

async function getApiKey() {
    try {
        const result = await chrome.storage.local.get(['gemini_api_key']);
        return result.gemini_api_key || null;
    }
    catch (error) {
        console.error('Failed to get API key:', error);
        return null;
    }
}

async function ensureApiKeyOrThrow() {
    const apiKey = await getApiKey();
    if (!apiKey) {
        throw new Error('API key not found. Please configure your Gemini API key in the options page.');
    }
    return apiKey;
}

async function callGemini(system, user, opts) {
    const apiKey = await ensureApiKeyOrThrow();
    const body = {
        contents: [{
                role: "user",
                parts: [{ text: \`\${system}\\n\\n\${user}\` }]
            }],
        generationConfig: {
            temperature: opts?.temperature ?? 0.3,
            maxOutputTokens: opts?.maxTokens ?? 256
        }
    };
    const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=\${apiKey}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(\`Gemini API error: \${response.status} \${response.statusText}\`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        throw new Error('No response from Gemini API');
    }
    return text;
}

async function callJson(system, user, validator, opts) {
    let text;
    try {
        text = await callGemini(system, user, opts);
        const parsed = JSON.parse(text);
        if (!validator(parsed)) {
            throw new Error('Invalid response format');
        }
        return parsed;
    }
    catch (error) {
        // Retry once with stricter instruction
        const retrySystem = system + " Return VALID JSON only. No prose.";
        text = await callGemini(retrySystem, user, opts);
        const parsed = JSON.parse(text);
        if (!validator(parsed)) {
            throw new Error('Invalid response format after retry');
        }
        return parsed;
    }
}

async function scorePrompt(prompt) {
    return callJson(SCORER_SYSTEM, SCORER_USER(prompt), validateScore, { temperature: 0.1, maxTokens: 128 });
}

async function optimizePrompt(prompt) {
    return callJson(OPTIMIZER_SYSTEM, OPTIMIZER_USER(prompt), validateOptimize, { temperature: 0.5, maxTokens: 512 });
}

async function testApiKey() {
    const text = await callGemini("Return JSON only: { ok: true }", "Return {\\"ok\\":true}", { temperature: 0, maxTokens: 32 });
    const parsed = JSON.parse(text);
    if (typeof parsed.ok !== 'boolean') {
        throw new Error('Invalid test response');
    }
    return parsed;
}

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background script received message:', message);
    (async () => {
        try {
            switch (message.type) {
                case 'SCORE_PROMPT':
                    const data = await scorePrompt(message.prompt);
                    sendResponse({ ok: true, data });
                    break;
                case 'OPTIMIZE_PROMPT':
                    const optimizeData = await optimizePrompt(message.prompt);
                    sendResponse({ ok: true, data: optimizeData });
                    break;
                case 'TEST_API_KEY':
                    const testResult = await testApiKey();
                    sendResponse({ ok: true, data: testResult });
                    break;
                default:
                    sendResponse({ ok: false, error: 'Unknown message type' });
            }
        }
        catch (error) {
            console.error('Background script error:', error);
            sendResponse({
                ok: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    })();
    // Return true to keep async channel open
    return true;
});
`;

fs.writeFileSync("dist/background/background.js", bundledBackground);

// Clean up individual files
fs.unlinkSync("dist/background/gemini.js");
fs.unlinkSync("dist/lib/schema.js");

console.log("Build complete! Extension is ready in ./dist/");
console.log("Load the extension in Chrome by:");
console.log("1. Open Chrome and go to chrome://extensions/");
console.log("2. Enable Developer mode");
console.log('3. Click "Load unpacked" and select the ./dist folder');
