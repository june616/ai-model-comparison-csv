import { Question, User } from '@/types/evaluation'
import { SAMPLE_QUESTIONS, QUESTIONS_VERSION, QUESTIONS_LAST_UPDATED } from '@/data/questions'

/**
 * Get the questions assigned to a specific user
 */
export function getAssignedQuestions(user: User): Omit<Question, 'ratings' | 'knowledgeLevel'>[] {
  return SAMPLE_QUESTIONS.filter(question => user.assignedQuestions.includes(question.id))
}

/**
 * Initialize questions with empty ratings for a user
 */
export function initializeQuestionsForUser(user: User): Question[] {
  const assignedQuestions = getAssignedQuestions(user)
  
  return assignedQuestions.map(q => ({
    ...q,
    ratings: {
      correctness: null,
      comprehensiveness: null,
      actionability: null
    },
    knowledgeLevel: null,
    feedback: '',
    version: QUESTIONS_VERSION,
    lastUpdated: QUESTIONS_LAST_UPDATED
  }))
}

/**
 * Sync existing session questions with latest question data
 * Preserves user ratings and feedback while updating question content
 */
export function syncSessionQuestions(sessionQuestions: Question[], user: User): {
  questions: Question[]
  hasUpdates: boolean
  updatedQuestionIds: string[]
} {
  const latestQuestions = getAssignedQuestions(user)
  const updatedQuestionIds: string[] = []
  let hasUpdates = false

  const syncedQuestions = sessionQuestions.map(sessionQuestion => {
    // Find the latest version of this question
    const latestQuestion = latestQuestions.find(q => q.id === sessionQuestion.id)
    
    if (!latestQuestion) {
      // Question no longer exists, keep the session version
      return sessionQuestion
    }

    // Check if question content has been updated
    const questionNeedsUpdate = 
      sessionQuestion.version !== QUESTIONS_VERSION ||
      sessionQuestion.lastUpdated !== QUESTIONS_LAST_UPDATED ||
      sessionQuestion.query !== latestQuestion.query ||
      sessionQuestion.modelA.response !== latestQuestion.modelA.response ||
      sessionQuestion.modelB.response !== latestQuestion.modelB.response

    if (questionNeedsUpdate) {
      hasUpdates = true
      updatedQuestionIds.push(sessionQuestion.id)
      
      // Update question content while preserving user progress
      return {
        ...latestQuestion,
        ratings: sessionQuestion.ratings, // Preserve ratings
        knowledgeLevel: sessionQuestion.knowledgeLevel, // Preserve knowledge level
        feedback: sessionQuestion.feedback, // Preserve feedback
        version: QUESTIONS_VERSION,
        lastUpdated: QUESTIONS_LAST_UPDATED
      }
    }

    return sessionQuestion
  })

  return {
    questions: syncedQuestions,
    hasUpdates,
    updatedQuestionIds
  }
}

/**
 * Check if questions need syncing based on version
 */
export function shouldSyncQuestions(sessionQuestionsVersion?: string, lastSyncedAt?: string): boolean {
  if (!sessionQuestionsVersion || sessionQuestionsVersion !== QUESTIONS_VERSION) {
    return true
  }
  
  if (!lastSyncedAt || new Date(lastSyncedAt) < new Date(QUESTIONS_LAST_UPDATED)) {
    return true
  }
  
  return false
}