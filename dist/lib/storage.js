export async function getKey() {
    try {
        const result = await chrome.storage.local.get(['gemini_api_key']);
        return result.gemini_api_key || null;
    }
    catch (error) {
        console.error('Failed to get API key:', error);
        return null;
    }
}
export async function setKey(k) {
    try {
        await chrome.storage.local.set({ gemini_api_key: k });
    }
    catch (error) {
        console.error('Failed to set API key:', error);
        throw error;
    }
}
export async function saveHistory(entry) {
    try {
        const result = await chrome.storage.local.get(['history']);
        const history = result.history || [];
        // Add new entry at the beginning
        history.unshift(entry);
        // Keep only last 10 entries
        const trimmedHistory = history.slice(0, 10);
        await chrome.storage.local.set({ history: trimmedHistory });
    }
    catch (error) {
        console.error('Failed to save history:', error);
        throw error;
    }
}
export async function loadHistory() {
    try {
        const result = await chrome.storage.local.get(['history']);
        return result.history || [];
    }
    catch (error) {
        console.error('Failed to load history:', error);
        return [];
    }
}
export async function saveWorkingState(state) {
    try {
        await chrome.storage.local.set({ workingState: state });
    }
    catch (error) {
        console.error('Failed to save working state:', error);
        throw error;
    }
}
export async function loadWorkingState() {
    try {
        const result = await chrome.storage.local.get(['workingState']);
        return result.workingState || null;
    }
    catch (error) {
        console.error('Failed to load working state:', error);
        return null;
    }
}
