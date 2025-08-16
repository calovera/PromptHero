const express = require('express');
const { GoogleGenerativeAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Enable CORS and JSON parsing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Test API key endpoint
app.post('/api/test-key', async (req, res) => {
    try {
        const { apiKey } = req.body;
        
        if (!apiKey) {
            return res.json({ success: false, error: 'API key is required' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await model.generateContent('Test connection');
        const response = await result.response;
        
        if (response.text()) {
            res.json({ success: true, message: 'API key is valid and working!' });
        } else {
            res.json({ success: false, error: 'Invalid API response' });
        }
    } catch (error) {
        console.error('API key test error:', error);
        res.json({ success: false, error: error.message });
    }
});

// Score prompt endpoint
app.post('/api/score', async (req, res) => {
    try {
        const { prompt, apiKey } = req.body;
        
        if (!prompt || !apiKey) {
            return res.json({ error: 'Prompt and API key are required' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const scoringPrompt = `Analyze this AI prompt and provide a detailed score from 1-10 based on clarity, specificity, and effectiveness. Format your response as:

SCORE: [X]/10

ANALYSIS:
- [Specific feedback about what works well]
- [Areas for improvement]
- [Suggestions for enhancement]

Prompt to analyze: "${prompt}"`;

        const result = await model.generateContent(scoringPrompt);
        const response = await result.response;
        const feedback = response.text();
        
        // Extract score from response
        const scoreMatch = feedback.match(/SCORE:\s*(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        
        res.json({ 
            success: true, 
            score, 
            feedback: feedback 
        });
    } catch (error) {
        console.error('Score prompt error:', error);
        res.json({ error: error.message });
    }
});

// Optimize prompt endpoint with streaming
app.post('/api/optimize', (req, res) => {
    const { prompt, apiKey } = req.body;
    
    if (!prompt || !apiKey) {
        return res.status(400).json({ error: 'Prompt and API key are required' });
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    });

    async function streamOptimization() {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            
            const optimizationPrompt = `You are an expert AI prompt engineer. Analyze and improve the following prompt to make it more effective, specific, and likely to produce better AI responses.

Original prompt: "${prompt}"

Please provide:

1. **IMPROVED PROMPT:** [Provide the optimized version]

2. **WHAT WAS IMPROVED:** [Explain the specific changes made and why they improve the prompt]

Make sure the improved prompt is clear, specific, includes relevant context, and follows best practices for AI interaction.`;

            const result = await model.generateContentStream(optimizationPrompt);
            
            let fullResponse = '';
            
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                
                // Send chunk to client
                res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunkText })}\n\n`);
            }
            
            // Parse the final response to extract improved prompt and explanation
            const sections = fullResponse.split(/(?:IMPROVED PROMPT:|WHAT WAS IMPROVED:)/i);
            let optimizedPrompt = '';
            let explanation = '';
            
            if (sections.length >= 3) {
                optimizedPrompt = sections[1].trim();
                explanation = sections[2].trim();
            } else {
                // Fallback parsing
                const lines = fullResponse.split('\n');
                let currentSection = '';
                let promptLines = [];
                let explanationLines = [];
                
                for (const line of lines) {
                    if (line.toLowerCase().includes('improved prompt') || line.toLowerCase().includes('optimized prompt')) {
                        currentSection = 'prompt';
                        continue;
                    } else if (line.toLowerCase().includes('what was improved') || line.toLowerCase().includes('improvements')) {
                        currentSection = 'explanation';
                        continue;
                    }
                    
                    if (currentSection === 'prompt' && line.trim()) {
                        promptLines.push(line.trim());
                    } else if (currentSection === 'explanation' && line.trim()) {
                        explanationLines.push(line.trim());
                    }
                }
                
                optimizedPrompt = promptLines.join('\n').trim();
                explanation = explanationLines.join('\n').trim();
            }
            
            // Send final structured response
            res.write(`data: ${JSON.stringify({ 
                type: 'complete', 
                optimizedPrompt: optimizedPrompt || fullResponse,
                explanation: explanation || 'Optimization completed'
            })}\n\n`);
            
        } catch (error) {
            console.error('Optimization error:', error);
            res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        }
        
        res.end();
    }
    
    streamOptimization();
});

app.listen(port, '0.0.0.0', () => {
    console.log(`PromptHero Web Demo server running on port ${port}`);
    console.log('Open your browser to test the extension functionality');
});