import { BgRequest, BgResponse } from '../lib/messages';
import { scorePrompt, optimizePrompt, testApiKey } from './gemini';

// Initialize background service worker
console.log('PromptHero background service worker initialized');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('PromptHero installed:', details.reason);
  
  if (details.reason === 'install') {
    // Set up default storage values
    chrome.storage.sync.set({
      promptHistory: [],
      settings: {
        maxHistoryItems: 50,
      }
    });
  }
});

// Handle messages from popup and options pages
chrome.runtime.onMessage.addListener((
  request: BgRequest,
  sender,
  sendResponse: (response: BgResponse) => void
) => {
  console.log('Background received message:', request);

  // Handle different message types
  switch (request.type) {
    case 'SCORE_PROMPT':
      handleScorePrompt(request.prompt).then(sendResponse);
      break;
      
    case 'OPTIMIZE_PROMPT':
      handleOptimizePrompt(request.prompt).then(sendResponse);
      break;
      
    case 'TEST_API_KEY':
      handleTestApiKey(request.apiKey).then(sendResponse);
      break;
      
    case 'GET_HISTORY':
      handleGetHistory().then(sendResponse);
      break;
      
    case 'CLEAR_HISTORY':
      handleClearHistory().then(sendResponse);
      break;
      
    case 'SAVE_TO_HISTORY':
      handleSaveToHistory(request.item).then(sendResponse);
      break;
      
    default:
      sendResponse({ 
        ok: false, 
        error: `Unknown message type: ${(request as any).type}` 
      });
  }

  // Return true to indicate we will respond asynchronously
  return true;
});

async function handleScorePrompt(prompt: string): Promise<BgResponse> {
  try {
    const apiKey = await getStoredApiKey();
    if (!apiKey) {
      return { ok: false, error: 'API key not configured. Please set up your Gemini API key in the options page.' };
    }
    
    const result = await scorePrompt(prompt, apiKey);
    
    // Save to history
    await saveToHistory({ 
      originalPrompt: prompt, 
      score: result.score, 
      type: 'score' 
    });
    
    return { 
      ok: true, 
      data: {
        score: result.score,
        feedback: result.feedback,
        suggestions: result.suggestions
      }
    };
    
  } catch (error) {
    console.error('Error scoring prompt:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to score prompt'
    };
  }
}

async function handleOptimizePrompt(prompt: string): Promise<BgResponse> {
  try {
    const apiKey = await getStoredApiKey();
    if (!apiKey) {
      return { ok: false, error: 'API key not configured. Please set up your Gemini API key in the options page.' };
    }
    
    const result = await optimizePrompt(prompt, apiKey);
    
    // Save to history
    await saveToHistory({ 
      originalPrompt: prompt, 
      improvedPrompt: result.improvedPrompt, 
      type: 'optimize' 
    });
    
    return { 
      ok: true, 
      data: {
        improvedPrompt: result.improvedPrompt,
        changes: result.changes,
        reasoning: result.reasoning
      }
    };
    
  } catch (error) {
    console.error('Error optimizing prompt:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to optimize prompt'
    };
  }
}

// Helper function to get stored API key (stub for now)
async function getStoredApiKey(): Promise<string | null> {
  try {
    const result = await chrome.storage.sync.get(['geminiApiKey']);
    return result.geminiApiKey || null;
  } catch (error) {
    console.error('Failed to get API key:', error);
    return null;
  }
}

// Handle API key testing
async function handleTestApiKey(apiKey: string): Promise<BgResponse> {
  try {
    const isValid = await testApiKey(apiKey);
    return { 
      ok: true, 
      data: { isValid } 
    };
  } catch (error) {
    console.error('Error testing API key:', error);
    return {
      ok: false,
      error: 'Failed to test API key'
    };
  }
}

// Handle getting history
async function handleGetHistory(): Promise<BgResponse> {
  try {
    const result = await chrome.storage.sync.get(['promptHistory']);
    const history = result.promptHistory || [];
    return { 
      ok: true, 
      data: { history } 
    };
  } catch (error) {
    console.error('Error getting history:', error);
    return {
      ok: false,
      error: 'Failed to get history'
    };
  }
}

// Handle clearing history
async function handleClearHistory(): Promise<BgResponse> {
  try {
    await chrome.storage.sync.set({ promptHistory: [] });
    return { ok: true, data: null };
  } catch (error) {
    console.error('Error clearing history:', error);
    return {
      ok: false,
      error: 'Failed to clear history'
    };
  }
}

// Handle saving to history
async function handleSaveToHistory(item: any): Promise<BgResponse> {
  try {
    await saveToHistory(item);
    return { ok: true, data: null };
  } catch (error) {
    console.error('Error saving to history:', error);
    return {
      ok: false,
      error: 'Failed to save to history'
    };
  }
}

// Helper function to save prompt history
async function saveToHistory(entry: any): Promise<void> {
  try {
    const result = await chrome.storage.sync.get(['promptHistory']);
    const history = result.promptHistory || [];
    
    // Add new entry with timestamp
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    // Keep only the latest 50 entries
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    
    await chrome.storage.sync.set({ promptHistory: updatedHistory });
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}
