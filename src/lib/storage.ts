// Chrome storage helpers with TypeScript support

export interface StorageData {
  geminiApiKey?: string;
  promptHistory?: HistoryItem[];
  settings?: UserSettings;
}

export interface HistoryItem {
  id: string;
  originalPrompt: string;
  improvedPrompt?: string;
  score?: number;
  timestamp: string; // ISO string
  type: 'score' | 'optimize' | 'manual';
}

export interface UserSettings {
  maxHistoryItems: number;
  autoSave: boolean;
  theme: 'light' | 'dark' | 'system';
}

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  maxHistoryItems: 50,
  autoSave: true,
  theme: 'dark',
};

// Get single value from storage
export const getStorageValue = async <K extends keyof StorageData>(
  key: K
): Promise<StorageData[K] | undefined> => {
  try {
    const result = await chrome.storage.sync.get([key]);
    return result[key];
  } catch (error) {
    console.error(`Failed to get storage value for key ${key}:`, error);
    return undefined;
  }
};

// Get multiple values from storage
export const getStorageValues = async <K extends keyof StorageData>(
  keys: K[]
): Promise<Pick<StorageData, K>> => {
  try {
    const result = await chrome.storage.sync.get(keys);
    return result as Pick<StorageData, K>;
  } catch (error) {
    console.error('Failed to get storage values:', error);
    return {} as Pick<StorageData, K>;
  }
};

// Set single value in storage
export const setStorageValue = async <K extends keyof StorageData>(
  key: K,
  value: StorageData[K]
): Promise<void> => {
  try {
    await chrome.storage.sync.set({ [key]: value });
  } catch (error) {
    console.error(`Failed to set storage value for key ${key}:`, error);
    throw error;
  }
};

// Set multiple values in storage
export const setStorageValues = async (data: Partial<StorageData>): Promise<void> => {
  try {
    await chrome.storage.sync.set(data);
  } catch (error) {
    console.error('Failed to set storage values:', error);
    throw error;
  }
};

// Remove values from storage
export const removeStorageValues = async (keys: (keyof StorageData)[]): Promise<void> => {
  try {
    await chrome.storage.sync.remove(keys);
  } catch (error) {
    console.error('Failed to remove storage values:', error);
    throw error;
  }
};

// Clear all storage
export const clearStorage = async (): Promise<void> => {
  try {
    await chrome.storage.sync.clear();
  } catch (error) {
    console.error('Failed to clear storage:', error);
    throw error;
  }
};

// API Key helpers
export const getApiKey = async (): Promise<string | null> => {
  const apiKey = await getStorageValue('geminiApiKey');
  return apiKey || null;
};

export const setApiKey = async (apiKey: string): Promise<void> => {
  await setStorageValue('geminiApiKey', apiKey);
};

export const removeApiKey = async (): Promise<void> => {
  await removeStorageValues(['geminiApiKey']);
};

// History helpers
export const getHistory = async (): Promise<HistoryItem[]> => {
  const history = await getStorageValue('promptHistory');
  return history || [];
};

export const addToHistory = async (item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<void> => {
  const currentHistory = await getHistory();
  const settings = await getSettings();
  
  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  
  const updatedHistory = [newItem, ...currentHistory].slice(0, settings.maxHistoryItems);
  await setStorageValue('promptHistory', updatedHistory);
};

export const clearHistory = async (): Promise<void> => {
  await setStorageValue('promptHistory', []);
};

export const removeFromHistory = async (id: string): Promise<void> => {
  const currentHistory = await getHistory();
  const updatedHistory = currentHistory.filter(item => item.id !== id);
  await setStorageValue('promptHistory', updatedHistory);
};

// Settings helpers
export const getSettings = async (): Promise<UserSettings> => {
  const settings = await getStorageValue('settings');
  return { ...DEFAULT_SETTINGS, ...settings };
};

export const updateSettings = async (newSettings: Partial<UserSettings>): Promise<void> => {
  const currentSettings = await getSettings();
  const updatedSettings = { ...currentSettings, ...newSettings };
  await setStorageValue('settings', updatedSettings);
};

// Storage change listener
export const addStorageChangeListener = (
  callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void
): void => {
  chrome.storage.onChanged.addListener(callback);
};

export const removeStorageChangeListener = (
  callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void
): void => {
  chrome.storage.onChanged.removeListener(callback);
};

// Utility function to check storage quota
export const getStorageQuota = async (): Promise<{ used: number; total: number }> => {
  try {
    const usage = await chrome.storage.sync.getBytesInUse();
    return {
      used: usage,
      total: chrome.storage.sync.QUOTA_BYTES,
    };
  } catch (error) {
    console.error('Failed to get storage quota:', error);
    return { used: 0, total: 0 };
  }
};
