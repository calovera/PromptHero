import { z } from "zod";
import { ScoreSchema, OptimizeSchema, Score, Optimize } from "../lib/schema";

// Strict prompt templates
const SCORER_SYSTEM =
  "You are a prompt quality judge. Return JSON only that passes this schema: { score: number 0..100, issues: string[], suggestions: string[] }. Scoring rubric: Clarity 25, Specificity 25, Constraints 20, Context 15, Output format 10, Token efficiency 5. Keep issues and suggestions short and actionable. No extra text.";

const SCORER_USER = (template: string) =>
  `Evaluate this prompt.
PROMPT
${template}
Return JSON only.`;

const OPTIMIZER_SYSTEM =
  "You are a prompt engineer. Rewrite the prompt to maximize task success while keeping the same goal. If the prompt is vague or brief, infer reasonable defaults and add missing context requests and constraints. Add clear step-by-step instructions. Keep it concise and token-efficient. Do NOT add any JSON format instructions or output format specifications to the improved prompt. Return JSON only that passes: { improved_prompt: string, checklist: string[] }. Checklist lists what you improved. No extra text.";

const OPTIMIZER_USER = (template: string) =>
  `Rewrite this prompt.
PROMPT
${template}
Return JSON only.`;

async function getApiKey(): Promise<string | null> {
  try {
    const result = await chrome.storage.local.get(["gemini_api_key"]);
    return result.gemini_api_key || null;
  } catch (error) {
    console.error("Failed to get API key:", error);
    return null;
  }
}

async function ensureApiKeyOrThrow(): Promise<string> {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error(
      "API key not found. Please configure your Gemini API key in the options page."
    );
  }
  return apiKey;
}

async function callGemini(
  system: string,
  user: string,
  opts?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const apiKey = await ensureApiKeyOrThrow();

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${system}\n\n${user}` }],
      },
    ],
    generationConfig: {
      temperature: opts?.temperature ?? 0.3,
      maxOutputTokens: opts?.maxTokens ?? 256,
    },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Gemini API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No response from Gemini API");
  }

  return text;
}

// Helper function to extract JSON from markdown-formatted responses
function extractJsonFromText(text: string): string {
  // Remove markdown code blocks
  text = text.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "");
  text = text.replace(/```\s*/gi, "").replace(/```\s*$/gi, "");

  // Trim whitespace
  text = text.trim();

  // If it starts with { and ends with }, it's likely JSON
  if (text.startsWith("{") && text.endsWith("}")) {
    return text;
  }

  // Try to find JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  // If no JSON found, return the original text
  return text;
}

async function callJson<T>(
  system: string,
  user: string,
  schema: z.ZodSchema<T>,
  opts?: { temperature?: number; maxTokens?: number }
): Promise<T> {
  let text: string;

  try {
    text = await callGemini(system, user, opts);
    const jsonText = extractJsonFromText(text);
    const parsed = JSON.parse(jsonText);
    return schema.parse(parsed);
  } catch (error) {
    // Retry once with stricter instruction
    const retrySystem =
      system + " Return VALID JSON only. No prose, no markdown formatting.";
    text = await callGemini(retrySystem, user, opts);
    const jsonText = extractJsonFromText(text);
    const parsed = JSON.parse(jsonText);
    return schema.parse(parsed);
  }
}

export async function scorePrompt(prompt: string): Promise<Score> {
  return callJson(SCORER_SYSTEM, SCORER_USER(prompt), ScoreSchema, {
    temperature: 0.1,
    maxTokens: 128,
  });
}

export async function optimizePrompt(prompt: string): Promise<Optimize> {
  return callJson(OPTIMIZER_SYSTEM, OPTIMIZER_USER(prompt), OptimizeSchema, {
    temperature: 0.5,
    maxTokens: 512,
  });
}

// Light test function for options
export async function testApiKey(): Promise<{ ok: boolean }> {
  const result = await callJson(
    "Return JSON only: { ok: true }",
    'Return {"ok":true}',
    z.object({ ok: z.boolean() }),
    { temperature: 0, maxTokens: 32 }
  );
  return result;
}
