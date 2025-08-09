const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Test API key endpoint
app.post('/api/test-key', async (req, res) => {
    try {
        const { apiKey } = req.body;
        
        if (!apiKey) {
            return res.json({ success: false, error: 'API key is required' });
        }
        
        const ai = new GoogleGenAI({ apiKey });
        
        // Test with a simple request
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Say 'API test successful' if you can read this."
        });
        
        if (response.text) {
            res.json({ success: true, message: 'API key is valid' });
        } else {
            res.json({ success: false, error: 'Invalid response from API' });
        }
    } catch (error) {
        console.error('API key test error:', error);
        res.json({ 
            success: false, 
            error: error.message || 'Failed to validate API key'
        });
    }
});

// Score prompt endpoint
app.post('/api/score', async (req, res) => {
    try {
        const { prompt, apiKey } = req.body;
        
        if (!prompt || !apiKey) {
            return res.json({ success: false, error: 'Prompt and API key are required' });
        }
        
        const ai = new GoogleGenAI({ apiKey });
        
        const systemPrompt = `You are an expert prompt engineer. Analyze the given prompt and provide:
1. A score from 1-10 (where 10 is excellent)
2. Detailed feedback on clarity, specificity, and effectiveness

Consider these criteria:
- Clarity: Is the prompt clear and unambiguous?
- Specificity: Does it provide enough detail for good results?
- Context: Is there sufficient context provided?
- Structure: Is the prompt well-organized?
- Actionability: Can an AI easily understand what to do?

Respond with JSON in this format:
{
    "score": number,
    "feedback": "detailed explanation of the score and specific suggestions for improvement"
}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        score: { type: "number" },
                        feedback: { type: "string" }
                    },
                    required: ["score", "feedback"]
                }
            },
            contents: `Analyze this prompt: "${prompt}"`
        });
        
        const result = JSON.parse(response.text);
        res.json({
            success: true,
            score: result.score,
            feedback: result.feedback
        });
        
    } catch (error) {
        console.error('Score prompt error:', error);
        res.json({ 
            success: false, 
            error: error.message || 'Failed to score prompt'
        });
    }
});

// Optimize prompt endpoint
app.post('/api/optimize', async (req, res) => {
    try {
        const { prompt, apiKey } = req.body;
        
        if (!prompt || !apiKey) {
            return res.json({ success: false, error: 'Prompt and API key are required' });
        }
        
        const ai = new GoogleGenAI({ apiKey });
        
        const systemPrompt = `You are an expert prompt engineer. Take the given prompt and improve it significantly while maintaining the original intent.

Provide:
1. An optimized version that is more specific, clear, and effective
2. A detailed explanation of what changes were made and why

Focus on:
- Adding specific details and context
- Improving clarity and structure
- Making the prompt more actionable
- Providing examples when helpful
- Specifying desired output format when appropriate

Respond with JSON in this format:
{
    "optimizedPrompt": "the improved version of the prompt",
    "explanation": "detailed explanation of changes made and why they improve the prompt"
}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        optimizedPrompt: { type: "string" },
                        explanation: { type: "string" }
                    },
                    required: ["optimizedPrompt", "explanation"]
                }
            },
            contents: `Optimize this prompt: "${prompt}"`
        });
        
        const result = JSON.parse(response.text);
        res.json({
            success: true,
            optimizedPrompt: result.optimizedPrompt,
            explanation: result.explanation
        });
        
    } catch (error) {
        console.error('Optimize prompt error:', error);
        res.json({ 
            success: false, 
            error: error.message || 'Failed to optimize prompt'
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`PromptHero Web Demo server running on port ${PORT}`);
    console.log(`Open your browser to test the extension functionality`);
});