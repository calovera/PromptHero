// Chrome storage helpers with TypeScript support
// Default settings
export const DEFAULT_SETTINGS = {
    maxHistoryItems: 50,
    autoSave: true,
    theme: 'dark',
};
// Get single value from storage
export const getStorageValue = async (key) => {
    try {
        const result = await chrome.storage.sync.get([key]);
        return result[key];
    }
    catch (error) {
        console.error(`Failed to get storage value for key ${key}:`, error);
        return undefined;
    }
};
// Get multiple values from storage
export const getStorageValues = async (keys) => {
    try {
        const result = await chrome.storage.sync.get(keys);
        return result;
    }
    catch (error) {
        console.error('Failed to get storage values:', error);
        return {};
    }
};
// Set single value in storage
export const setStorageValue = async (key, value) => {
    try {
        await chrome.storage.sync.set({ [key]: value });
    }
    catch (error) {
        console.error(`Failed to set storage value for key ${key}:`, error);
        throw error;
    }
};
// Set multiple values in storage
export const setStorageValues = async (data) => {
    try {
        await chrome.storage.sync.set(data);
    }
    catch (error) {
        console.error('Failed to set storage values:', error);
        throw error;
    }
};
// Remove values from storage
export const removeStorageValues = async (keys) => {
    try {
        await chrome.storage.sync.remove(keys);
    }
    catch (error) {
        console.error('Failed to remove storage values:', error);
        throw error;
    }
};
// Clear all storage
export const clearStorage = async () => {
    try {
        await chrome.storage.sync.clear();
    }
    catch (error) {
        console.error('Failed to clear storage:', error);
        throw error;
    }
};
// API Key helpers
export const getApiKey = async () => {
    const apiKey = await getStorageValue('geminiApiKey');
    return apiKey || null;
};
export const setApiKey = async (apiKey) => {
    await setStorageValue('geminiApiKey', apiKey);
};
export const removeApiKey = async () => {
    await removeStorageValues(['geminiApiKey']);
};
// History helpers
export const getHistory = async () => {
    const history = await getStorageValue('promptHistory');
    return history || [];
};
export const addToHistory = async (item) => {
    const currentHistory = await getHistory();
    const settings = await getSettings();
    const newItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
    };
    const updatedHistory = [newItem, ...currentHistory].slice(0, settings.maxHistoryItems);
    await setStorageValue('promptHistory', updatedHistory);
};
export const clearHistory = async () => {
    await setStorageValue('promptHistory', []);
};
export const removeFromHistory = async (id) => {
    const currentHistory = await getHistory();
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    await setStorageValue('promptHistory', updatedHistory);
};
// Settings helpers
export const getSettings = async () => {
    const settings = await getStorageValue('settings');
    return { ...DEFAULT_SETTINGS, ...settings };
};
export const updateSettings = async (newSettings) => {
    const currentSettings = await getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await setStorageValue('settings', updatedSettings);
};
// Storage change listener
export const addStorageChangeListener = (callback) => {
    chrome.storage.onChanged.addListener(callback);
};
export const removeStorageChangeListener = (callback) => {
    chrome.storage.onChanged.removeListener(callback);
};
// Utility function to check storage quota
export const getStorageQuota = async () => {
    try {
        const usage = await chrome.storage.sync.getBytesInUse();
        return {
            used: usage,
            total: chrome.storage.sync.QUOTA_BYTES,
        };
    }
    catch (error) {
        console.error('Failed to get storage quota:', error);
        return { used: 0, total: 0 };
    }
};
