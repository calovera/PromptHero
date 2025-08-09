const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

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

// Optimize prompt endpoint with real streaming
app.post('/api/optimize', async (req, res) => {
    const { prompt, apiKey } = req.body;
    
    if (!prompt || !apiKey) {
        return res.status(400).json({ success: false, error: 'Prompt and API key are required' });
    }
    
    // Set headers for Server-Sent Events
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    
    try {
        const ai = new GoogleGenAI({ apiKey });
        
        const optimizePrompt = `Optimize this prompt to make it more effective, specific, and clear: "${prompt}"

Provide your response in this format:
IMPROVED PROMPT:
[your improved version here]

EXPLANATION:
[brief explanation of improvements]`;

        // Use streaming generation
        const streamingResult = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: optimizePrompt
        });

        let fullResponse = '';
        
        for await (const chunk of streamingResult) {
            if (chunk.text) {
                fullResponse += chunk.text;
                // Send each chunk to the client immediately
                res.write(`data: ${JSON.stringify({ 
                    type: 'chunk', 
                    text: chunk.text 
                })}\n\n`);
            }
        }
        
        // Parse improved prompt and explanation
        const sections = fullResponse.split(/IMPROVED PROMPT:|EXPLANATION:/i);
        let improvedPrompt = '';
        let explanation = '';
        
        if (sections.length >= 3) {
            improvedPrompt = sections[1].trim();
            explanation = sections[2].trim();
        } else {
            // Fallback parsing
            const lines = fullResponse.split('\n');
            const improvedIndex = lines.findIndex(line => 
                line.toLowerCase().includes('improved') && line.toLowerCase().includes('prompt')
            );
            const explanationIndex = lines.findIndex(line => 
                line.toLowerCase().includes('explanation')
            );
            
            if (improvedIndex !== -1) {
                if (explanationIndex !== -1) {
                    improvedPrompt = lines.slice(improvedIndex + 1, explanationIndex).join('\n').trim();
                    explanation = lines.slice(explanationIndex + 1).join('\n').trim();
                } else {
                    improvedPrompt = lines.slice(improvedIndex + 1).join('\n').trim();
                    explanation = 'Prompt has been optimized for better clarity and effectiveness.';
                }
            } else {
                improvedPrompt = fullResponse.split('\n')[0] || fullResponse;
                explanation = 'Prompt has been optimized for better results.';
            }
        }
        
        // Send final structured data
        res.write(`data: ${JSON.stringify({ 
            type: 'complete',
            optimizedPrompt: improvedPrompt,
            explanation: explanation
        })}\n\n`);
        
        res.end();
        
    } catch (error) {
        console.error('Optimize error:', error);
        res.write(`data: ${JSON.stringify({ 
            type: 'error',
            error: 'Failed to optimize prompt: ' + error.message 
        })}\n\n`);
        res.end();
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`PromptHero Web Demo server running on port ${PORT}`);
    console.log(`Open your browser to test the extension functionality`);
});