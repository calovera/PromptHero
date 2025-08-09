// Helper functions for popup
export async function scorePromptViaBg(text) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: 'SCORE_PROMPT', prompt: text }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            }
            else if (response.ok) {
                resolve(response.data);
            }
            else {
                reject(new Error(response.error));
            }
        });
    });
}
export async function optimizePromptViaBg(text) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: 'OPTIMIZE_PROMPT', prompt: text }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            }
            else if (response.ok) {
                resolve(response.data);
            }
            else {
                reject(new Error(response.error));
            }
        });
    });
}
export async function testApiKeyViaBg() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: 'TEST_API_KEY' }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            }
            else if (response.ok) {
                resolve(response.data);
            }
            else {
                reject(new Error(response.error));
            }
        });
    });
}
