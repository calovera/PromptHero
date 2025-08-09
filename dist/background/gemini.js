import { z } from 'zod';
import { ScoreSchema, OptimizeSchema } from '../lib/schema';
// Strict prompt templates
const SCORER_SYSTEM = "You are a prompt quality judge. Return JSON only that passes this schema: { score: number 0..100, issues: string[], suggestions: string[] }. Scoring rubric: Clarity 25, Specificity 25, Constraints 20, Context 15, Output format 10, Token efficiency 5. Keep issues and suggestions short and actionable. No extra text.";
const SCORER_USER = (template) => `Evaluate this prompt.
PROMPT
${template}
Return JSON only.`;
const OPTIMIZER_SYSTEM = "You are a prompt engineer. Rewrite the prompt to maximize task success while keeping the same goal. If the prompt is vague or brief, infer reasonable defaults and add missing context requests and constraints. Add clear step-by-step instructions. Specify the desired output format. Keep it concise and token-efficient. Return JSON only that passes: { improved_prompt: string, checklist: string[] }. Checklist lists what you improved. No extra text.";
const OPTIMIZER_USER = (template) => `Rewrite this prompt.
PROMPT
${template}
Return JSON only.`;
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
                parts: [{ text: `${system}\n\n${user}` }]
            }],
        generationConfig: {
            temperature: opts?.temperature ?? 0.3,
            maxOutputTokens: opts?.maxTokens ?? 256
        }
    };
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        throw new Error('No response from Gemini API');
    }
    return text;
}
async function callJson(system, user, schema, opts) {
    let text;
    try {
        text = await callGemini(system, user, opts);
        const parsed = JSON.parse(text);
        return schema.parse(parsed);
    }
    catch (error) {
        // Retry once with stricter instruction
        const retrySystem = system + " Return VALID JSON only. No prose.";
        text = await callGemini(retrySystem, user, opts);
        const parsed = JSON.parse(text);
        return schema.parse(parsed);
    }
}
export async function scorePrompt(prompt) {
    return callJson(SCORER_SYSTEM, SCORER_USER(prompt), ScoreSchema, { temperature: 0.1, maxTokens: 128 });
}
export async function optimizePrompt(prompt) {
    return callJson(OPTIMIZER_SYSTEM, OPTIMIZER_USER(prompt), OptimizeSchema, { temperature: 0.5, maxTokens: 512 });
}
// Light test function for options
export async function testApiKey() {
    const result = await callJson("Return JSON only: { ok: true }", "Return {\"ok\":true}", z.object({ ok: z.boolean() }), { temperature: 0, maxTokens: 32 });
    return result;
}
