import { HistoryEntry, Score } from './schema'

export async function getKey(): Promise<string | null> {
  try {
    const result = await chrome.storage.local.get(['gemini_api_key'])
    return result.gemini_api_key || null
  } catch (error) {
    console.error('Failed to get API key:', error)
    return null
  }
}

export async function setKey(k: string): Promise<void> {
  try {
    await chrome.storage.local.set({ gemini_api_key: k })
  } catch (error) {
    console.error('Failed to set API key:', error)
    throw error
  }
}

export async function saveHistory(entry: HistoryEntry): Promise<void> {
  try {
    const result = await chrome.storage.local.get(['history'])
    const history: HistoryEntry[] = result.history || []
    
    // Add new entry at the beginning
    history.unshift(entry)
    
    // Keep only last 10 entries
    const trimmedHistory = history.slice(0, 10)
    
    await chrome.storage.local.set({ history: trimmedHistory })
  } catch (error) {
    console.error('Failed to save history:', error)
    throw error
  }
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const result = await chrome.storage.local.get(['history'])
    return result.history || []
  } catch (error) {
    console.error('Failed to load history:', error)
    return []
  }
}

export async function saveWorkingState(state: {
  prompt: string
  currentScore?: Score
  improved?: string
  improvedScore?: Score
}): Promise<void> {
  try {
    await chrome.storage.local.set({ workingState: state })
  } catch (error) {
    console.error('Failed to save working state:', error)
    throw error
  }
}

export async function loadWorkingState(): Promise<{
  prompt: string
  currentScore?: Score
  improved?: string
  improvedScore?: Score
} | null> {
  try {
    const result = await chrome.storage.local.get(['workingState'])
    return result.workingState || null
  } catch (error) {
    console.error('Failed to load working state:', error)
    return null
  }
}