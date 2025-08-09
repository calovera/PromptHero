import { GoogleGenAI } from '@google/genai';

export interface PromptScore {
  score: number; // 1-10 rating
  feedback: string;
  suggestions: string[];
}

export interface PromptOptimization {
  improvedPrompt: string;
  changes: string[];
  reasoning: string;
}

// Function for scoring prompts using Gemini
export async function scorePrompt(
  prompt: string, 
  apiKey: string
): Promise<PromptScore> {
  try {
    const genAI = new GoogleGenAI({ apiKey });
    
    const systemPrompt = `You are an expert AI prompt evaluator. Analyze the given prompt and provide:
1. A score from 1-10 based on clarity, specificity, and effectiveness
2. Detailed feedback explaining the score
3. Specific suggestions for improvement

Respond with JSON in this exact format:
{
  "score": number,
  "feedback": "detailed explanation of the score",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: { type: "number" },
            feedback: { type: "string" },
            suggestions: { type: "array", items: { type: "string" } }
          },
          required: ["score", "feedback", "suggestions"]
        }
      },
      contents: `Evaluate this prompt:\n\n${prompt}`
    });

    const result = JSON.parse(response.text || '{}');
    
    // Ensure score is within 1-10 range
    if (result.score < 1 || result.score > 10) {
      result.score = Math.max(1, Math.min(10, result.score));
    }
    
    return {
      score: Math.round(result.score),
      feedback: result.feedback || 'No feedback provided',
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : []
    };
  } catch (error) {
    console.error('Error scoring prompt:', error);
    throw new Error(`Failed to score prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function for optimizing prompts using Gemini
export async function optimizePrompt(
  prompt: string, 
  apiKey: string
): Promise<PromptOptimization> {
  try {
    const genAI = new GoogleGenAI({ apiKey });
    
    const systemPrompt = `You are an expert AI prompt optimizer. Take the given prompt and improve it to be more effective, clear, and specific. Provide:
1. An improved version of the prompt that maintains the original intent but is more effective
2. A list of specific changes you made
3. Reasoning explaining why these changes improve the prompt

Focus on:
- Adding specificity and clarity
- Improving structure and format
- Including relevant context
- Making instructions more actionable
- Ensuring the prompt will produce better AI responses

Respond with JSON in this exact format:
{
  "improvedPrompt": "the enhanced version of the prompt",
  "changes": ["change 1", "change 2", "change 3"],
  "reasoning": "explanation of why these changes improve the prompt"
}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            improvedPrompt: { type: "string" },
            changes: { type: "array", items: { type: "string" } },
            reasoning: { type: "string" }
          },
          required: ["improvedPrompt", "changes", "reasoning"]
        }
      },
      contents: `Optimize this prompt:\n\n${prompt}`
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      improvedPrompt: result.improvedPrompt || prompt,
      changes: Array.isArray(result.changes) ? result.changes : [],
      reasoning: result.reasoning || 'No reasoning provided'
    };
  } catch (error) {
    console.error('Error optimizing prompt:', error);
    throw new Error(`Failed to optimize prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function for testing API key validity
export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenAI({ apiKey });
    
    // Try a simple content generation request to test the API key
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello"
    });
    
    return !!response.text;
  } catch (error) {
    console.error('API key test failed:', error);
    return false;
  }
}
