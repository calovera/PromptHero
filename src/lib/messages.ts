import { Score, Optimize } from './schema'

// Message types for communication between popup/options and background
export interface ScoreMessage {
  type: 'SCORE_PROMPT'
  prompt: string
}

export interface OptimizeMessage {
  type: 'OPTIMIZE_PROMPT'
  prompt: string
}

export interface TestKeyMessage {
  type: 'TEST_API_KEY'
}

export type BackgroundMessage = ScoreMessage | OptimizeMessage | TestKeyMessage

// Response types
export interface SuccessResponse<T> {
  ok: true
  data: T
}

export interface ErrorResponse {
  ok: false
  error: string
}

export type BackgroundResponse<T> = SuccessResponse<T> | ErrorResponse

// Helper functions for popup
export async function scorePromptViaBg(text: string): Promise<Score> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'SCORE_PROMPT', prompt: text } as ScoreMessage,
      (response: BackgroundResponse<Score>) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else if (response.ok) {
          resolve(response.data)
        } else {
          reject(new Error(response.error))
        }
      }
    )
  })
}

export async function optimizePromptViaBg(text: string): Promise<Optimize> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'OPTIMIZE_PROMPT', prompt: text } as OptimizeMessage,
      (response: BackgroundResponse<Optimize>) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else if (response.ok) {
          resolve(response.data)
        } else {
          reject(new Error(response.error))
        }
      }
    )
  })
}

export async function testApiKeyViaBg(): Promise<{ ok: boolean }> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'TEST_API_KEY' } as TestKeyMessage,
      (response: BackgroundResponse<{ ok: boolean }>) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else if (response.ok) {
          resolve(response.data)
        } else {
          reject(new Error(response.error))
        }
      }
    )
  })
}