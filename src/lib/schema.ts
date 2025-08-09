import { z } from 'zod';

// Zod schemas for data validation
// These will be expanded in Part 2 when API integration is added

export const PromptSchema = z.object({
  text: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt is too long'),
  id: z.string().optional(),
  timestamp: z.date().optional(),
});

export const ApiKeySchema = z.object({
  key: z.string().min(1, 'API key is required').regex(
    /^AIza[0-9A-Za-z-_]{35}$/, 
    'Invalid Gemini API key format'
  ),
});

export const PromptScoreSchema = z.object({
  score: z.number().int().min(1).max(10),
  feedback: z.string(),
  suggestions: z.array(z.string()),
});

export const PromptOptimizationSchema = z.object({
  improvedPrompt: z.string().min(1),
  changes: z.array(z.string()),
  reasoning: z.string(),
});

export const HistoryItemSchema = z.object({
  id: z.string(),
  originalPrompt: z.string(),
  improvedPrompt: z.string().optional(),
  score: z.number().int().min(1).max(10).optional(),
  timestamp: z.date(),
  type: z.enum(['score', 'optimize', 'manual']),
});

export const StorageSchema = z.object({
  geminiApiKey: z.string().optional(),
  promptHistory: z.array(HistoryItemSchema).default([]),
  settings: z.object({
    maxHistoryItems: z.number().int().min(1).max(1000).default(50),
    autoSave: z.boolean().default(true),
  }).default(() => ({
    maxHistoryItems: 50,
    autoSave: true,
  })),
});

// Type exports for use throughout the application
export type Prompt = z.infer<typeof PromptSchema>;
export type ApiKey = z.infer<typeof ApiKeySchema>;
export type PromptScore = z.infer<typeof PromptScoreSchema>;
export type PromptOptimization = z.infer<typeof PromptOptimizationSchema>;
export type HistoryItem = z.infer<typeof HistoryItemSchema>;
export type Storage = z.infer<typeof StorageSchema>;

// Validation helper functions
export const validatePrompt = (data: unknown): Prompt => {
  return PromptSchema.parse(data);
};

export const validateApiKey = (data: unknown): ApiKey => {
  return ApiKeySchema.parse(data);
};

export const validatePromptScore = (data: unknown): PromptScore => {
  return PromptScoreSchema.parse(data);
};

export const validatePromptOptimization = (data: unknown): PromptOptimization => {
  return PromptOptimizationSchema.parse(data);
};

export const validateHistoryItem = (data: unknown): HistoryItem => {
  return HistoryItemSchema.parse(data);
};

export const validateStorage = (data: unknown): Partial<Storage> => {
  return StorageSchema.partial().parse(data);
};
