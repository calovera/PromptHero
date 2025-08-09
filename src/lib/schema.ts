import { z } from "zod"

export const ScoreSchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(z.string()).max(8),
  suggestions: z.array(z.string()).max(8)
})
export type Score = z.infer<typeof ScoreSchema>

export const OptimizeSchema = z.object({
  improved_prompt: z.string().min(1),
  checklist: z.array(z.string()).max(12)
})
export type Optimize = z.infer<typeof OptimizeSchema>

export type HistoryEntry = {
  original: string
  originalScore?: Score
  improved?: string
  improvedScore?: Score
  timestamp: number
}