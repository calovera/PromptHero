// TypeScript definitions for messages passed between popup, options, and background pages
// Type guards for runtime type checking
export const isBgRequest = (data) => {
    if (typeof data !== 'object' || data === null)
        return false;
    const req = data;
    return typeof req.type === 'string' && ['SCORE_PROMPT', 'OPTIMIZE_PROMPT', 'TEST_API_KEY', 'GET_HISTORY', 'CLEAR_HISTORY', 'SAVE_TO_HISTORY'].includes(req.type);
};
export const isBgResponse = (data) => {
    if (typeof data !== 'object' || data === null)
        return false;
    const res = data;
    return typeof res.ok === 'boolean' && (res.ok === true ? 'data' in res : 'error' in res && typeof res.error === 'string');
};
// Helper function to send messages to background script
export const sendToBackground = async (request) => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(request, (response) => {
            if (chrome.runtime.lastError) {
                resolve({
                    ok: false,
                    error: chrome.runtime.lastError.message || 'Unknown error occurred'
                });
            }
            else {
                resolve(response);
            }
        });
    });
};
// Specific helper functions for common operations
export const scorePrompt = async (prompt) => {
    return sendToBackground({ type: 'SCORE_PROMPT', prompt });
};
export const optimizePrompt = async (prompt) => {
    return sendToBackground({ type: 'OPTIMIZE_PROMPT', prompt });
};
export const testApiKey = async (apiKey) => {
    return sendToBackground({ type: 'TEST_API_KEY', apiKey });
};
export const getHistory = async () => {
    return sendToBackground({ type: 'GET_HISTORY' });
};
export const clearHistory = async () => {
    return sendToBackground({ type: 'CLEAR_HISTORY' });
};
export const saveToHistory = async (item) => {
    return sendToBackground({ type: 'SAVE_TO_HISTORY', item });
};
