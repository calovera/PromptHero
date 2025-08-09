// TypeScript definitions for messages passed between popup, options, and background pages

export type BgRequest =
  | { type: 'SCORE_PROMPT'; prompt: string }
  | { type: 'OPTIMIZE_PROMPT'; prompt: string }
  | { type: 'TEST_API_KEY'; apiKey: string }
  | { type: 'GET_HISTORY' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SAVE_TO_HISTORY'; item: HistoryItemData };

export type BgResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// Specific response types for different requests
export interface ScoreResponse {
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface OptimizeResponse {
  improvedPrompt: string;
  changes: string[];
  reasoning: string;
}

export interface TestApiKeyResponse {
  isValid: boolean;
}

export interface HistoryItemData {
  id?: string;
  originalPrompt: string;
  improvedPrompt?: string;
  score?: number;
  timestamp?: Date;
  type: 'score' | 'optimize' | 'manual';
}

export interface GetHistoryResponse {
  history: HistoryItemData[];
}

// Type guards for runtime type checking
export const isBgRequest = (data: unknown): data is BgRequest => {
  if (typeof data !== 'object' || data === null) return false;
  const req = data as any;
  return typeof req.type === 'string' && ['SCORE_PROMPT', 'OPTIMIZE_PROMPT', 'TEST_API_KEY', 'GET_HISTORY', 'CLEAR_HISTORY', 'SAVE_TO_HISTORY'].includes(req.type);
};

export const isBgResponse = (data: unknown): data is BgResponse => {
  if (typeof data !== 'object' || data === null) return false;
  const res = data as any;
  return typeof res.ok === 'boolean' && (res.ok === true ? 'data' in res : 'error' in res && typeof res.error === 'string');
};

// Helper function to send messages to background script
export const sendToBackground = async <T>(request: BgRequest): Promise<BgResponse<T>> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(request, (response: BgResponse<T>) => {
      if (chrome.runtime.lastError) {
        resolve({
          ok: false,
          error: chrome.runtime.lastError.message || 'Unknown error occurred'
        });
      } else {
        resolve(response);
      }
    });
  });
};

// Specific helper functions for common operations
export const scorePrompt = async (prompt: string): Promise<BgResponse<ScoreResponse>> => {
  return sendToBackground<ScoreResponse>({ type: 'SCORE_PROMPT', prompt });
};

export const optimizePrompt = async (prompt: string): Promise<BgResponse<OptimizeResponse>> => {
  return sendToBackground<OptimizeResponse>({ type: 'OPTIMIZE_PROMPT', prompt });
};

export const testApiKey = async (apiKey: string): Promise<BgResponse<TestApiKeyResponse>> => {
  return sendToBackground<TestApiKeyResponse>({ type: 'TEST_API_KEY', apiKey });
};

export const getHistory = async (): Promise<BgResponse<GetHistoryResponse>> => {
  return sendToBackground<GetHistoryResponse>({ type: 'GET_HISTORY' });
};

export const clearHistory = async (): Promise<BgResponse<void>> => {
  return sendToBackground<void>({ type: 'CLEAR_HISTORY' });
};

export const saveToHistory = async (item: HistoryItemData): Promise<BgResponse<void>> => {
  return sendToBackground<void>({ type: 'SAVE_TO_HISTORY', item });
};
