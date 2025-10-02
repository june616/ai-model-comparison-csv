export interface ModelResponse {
  id: string
  model: string
  response: string
}

export interface Question {
  id: string
  query: string
  modelA: ModelResponse
  modelB: ModelResponse
  ratings: {
    correctness: Rating | null
    comprehensiveness: Rating | null
    actionability: Rating | null
  }
  knowledgeLevel: KnowledgeLevel | null
  feedback?: string
  version?: string // Track when question content was last updated
  lastUpdated?: string // ISO timestamp of last content update
}

export interface Evaluation {
  id: string
  userId: string
  userName: string
  questions: Question[]
  completedAt?: Date | string // Can be Date when created or string when retrieved from storage
}

export interface UserSession {
  id: string
  userId: string
  userName: string
  questions: Question[]
  currentQuestionIndex: number
  startedAt: Date | string
  lastUpdated: Date | string
  isCompleted: boolean
  completedAt?: Date | string
  questionsVersion?: string // Track version of questions when session started
  lastSyncedAt?: string // Track when questions were last synced with latest version
}

export interface User {
  id: string
  name: string
  assignedQuestions: string[] // Array of question IDs assigned to this user
}

export type Rating = 
  | 'strongly-prefer-a'
  | 'somewhat-prefer-a' 
  | 'neutral'
  | 'somewhat-prefer-b'
  | 'strongly-prefer-b'

export type KnowledgeLevel = 
  | 'not-at-all'
  | 'not-very'
  | 'neutral'
  | 'somewhat'
  | 'very'

export const RATING_OPTIONS: { value: Rating; label: string; score: number }[] = [
  { value: 'strongly-prefer-a', label: 'Strongly prefer Model A', score: -2 },
  { value: 'somewhat-prefer-a', label: 'Somewhat prefer Model A', score: -1 },
  { value: 'neutral', label: 'Neutral', score: 0 },
  { value: 'somewhat-prefer-b', label: 'Somewhat prefer Model B', score: 1 },
  { value: 'strongly-prefer-b', label: 'Strongly prefer Model B', score: 2 },
]

export const KNOWLEDGE_LEVEL_OPTIONS: { value: KnowledgeLevel; label: string }[] = [
  { value: 'not-at-all', label: 'Not at all knowledgeable' },
  { value: 'not-very', label: 'Not very knowledgeable' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'somewhat', label: 'Somewhat knowledgeable' },
  { value: 'very', label: 'Very knowledgeable' },
]

export const METRICS = [
  {
    key: 'correctness' as const,
    title: 'Correct Information & Links'
  },
  {
    key: 'comprehensiveness' as const,
    title: 'Comprehensive & Detailed'
  },
  {
    key: 'actionability' as const,
    title: 'Actionable Responses'
  }
] as const