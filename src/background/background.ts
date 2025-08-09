import { scorePrompt, optimizePrompt, testApiKey } from './gemini';

// Type definitions for messages
interface ScoreMessage {
  type: 'SCORE_PROMPT';
  prompt: string;
}

interface OptimizeMessage {
  type: 'OPTIMIZE_PROMPT';
  prompt: string;
}

interface TestKeyMessage {
  type: 'TEST_API_KEY';
}

type MessageType = ScoreMessage | OptimizeMessage | TestKeyMessage;

// Handle messages from popup and options page
chrome.runtime.onMessage.addListener((message: MessageType, sender, sendResponse) => {
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
    } catch (error) {
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