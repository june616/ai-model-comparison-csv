import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast, Toaster } from 'sonner'
import { HomePage } from '@/components/HomePage'
import { EvaluationPage } from '@/components/EvaluationPage'
import { AdminResultsPage } from '@/components/AdminResultsPage'
import { Evaluation, Question, User, UserSession } from '@/types/evaluation'
import { downloadEvaluationCsv } from '@/utils/export'
import { SAMPLE_USERS } from '@/data/users'
import { initializeQuestionsForUser } from '@/utils/questionAssignment'
import { QUESTIONS_VERSION } from '@/data/questions'

function App() {
  const [evaluations, setEvaluations] = useKV<Evaluation[]>('evaluations', [])
  const [sessions, setSessions] = useKV<UserSession[]>('user-sessions', [])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null)

  const handleUserSelect = (user: User) => {
    setCurrentUser(user)
    
    // Check if user has an existing session
    const existingSession = (sessions || []).find(
      session => session.userId === user.id && !session.isCompleted
    )
    
    if (existingSession) {
      // Resume existing session
      setCurrentSession(existingSession)
      setQuestions(existingSession.questions)
      toast.info(`Welcome back, ${user.name}!`, {
        description: `Resuming your evaluation from question ${existingSession.currentQuestionIndex + 1}`
      })
    } else {
      // Create new session
      const userQuestions = initializeQuestionsForUser(user)
      const newSession: UserSession = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        questions: userQuestions,
        currentQuestionIndex: 0,
        startedAt: new Date(),
        lastUpdated: new Date(),
        isCompleted: false,
        questionsVersion: QUESTIONS_VERSION,
        lastSyncedAt: new Date().toISOString()
      }
      
      setCurrentSession(newSession)
      setQuestions(userQuestions)
      
      // Save the new session
      setSessions(prev => [...(prev || []), newSession])
      
      toast.success(`Welcome, ${user.name}!`, {
        description: "Starting your evaluation session"
      })
    }
  }

  const handleBackToHome = () => {
    setCurrentUser(null)
    setQuestions([])
    setShowAdmin(false)
    setCurrentSession(null)
  }

  const handleShowAdmin = () => {
    setShowAdmin(true)
  }

  const updateSessionProgress = (updatedQuestions: Question[], currentIndex: number) => {
    if (!currentSession) return
    
    const updatedSession: UserSession = {
      ...currentSession,
      questions: updatedQuestions,
      currentQuestionIndex: currentIndex,
      lastUpdated: new Date()
    }
    
    setCurrentSession(updatedSession)
    
    // Update sessions in storage
    setSessions(prev => 
      (prev || []).map(session => 
        session.id === currentSession.id ? updatedSession : session
      )
    )
  }

  const handleSubmitEvaluation = () => {
    if (!currentUser || !currentSession) return
    
    const completedEvaluation: Evaluation = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      questions: questions,
      completedAt: new Date()
    }
    
    setEvaluations(prev => [...(prev || []), completedEvaluation])

    // Trigger immediate CSV download for the submitting user so they can send it externally.
    try {
      downloadEvaluationCsv(completedEvaluation)
    } catch (e) {
      // Non-fatal: continue flow even if download fails (e.g., popup blockers)
      // A toast will still inform the user of completion below.
      console.error('CSV download failed', e)
    }
    
    // Mark session as completed and closed
    const completedSession: UserSession = {
      ...currentSession,
      questions: questions,
      isCompleted: true,
      completedAt: new Date(),
      lastUpdated: new Date()
    }
    
    setSessions(prev => 
      (prev || []).map(session => 
        session.id === currentSession.id ? completedSession : session
      )
    )
    
    // Show success message
    toast.success("Evaluation completed and session closed!", {
      description: `Thank you, ${currentUser.name}, for completing the evaluation! The csv file has been downloaded.`
    })
    
    // Return to home page after submission and close session
    setCurrentUser(null)
    setQuestions([])
    setCurrentSession(null)
  }

  const handleDeleteEvaluation = (evaluationId: string) => {
    setEvaluations(prev => (prev || []).filter(evaluation => evaluation.id !== evaluationId))
    toast.success("Evaluation deleted successfully")
  }

  const handleDeleteAllEvaluations = () => {
    setEvaluations([])
    toast.success("All evaluations deleted successfully")
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => (prev || []).filter(session => session.id !== sessionId))
    toast.success("Session deleted successfully")
  }

  const handleDeleteAllSessions = () => {
    // Only delete open (incomplete) sessions, keep completed ones
    setSessions(prev => (prev || []).filter(session => session.isCompleted))
    toast.success("All open sessions deleted successfully")
  }

  // Show admin page if admin is selected
  if (showAdmin) {
    return (
      <>
        <AdminResultsPage 
          evaluations={evaluations || []}
          sessions={sessions || []}
          onBackToHome={handleBackToHome}
          onDeleteEvaluation={handleDeleteEvaluation}
          onDeleteAllEvaluations={handleDeleteAllEvaluations}
          onDeleteSession={handleDeleteSession}
          onDeleteAllSessions={handleDeleteAllSessions}
        />
        <Toaster />
      </>
    )
  }

  // Show home page if no user is selected
  if (!currentUser) {
    return (
      <>
        <HomePage 
          users={SAMPLE_USERS}
          sessions={sessions || []}
          onUserSelect={handleUserSelect}
          onAdminAccess={handleShowAdmin}
        />
        <Toaster />
      </>
    )
  }

  // Show evaluation page when user is selected
  return (
    <>
      <EvaluationPage 
        user={currentUser}
        questions={questions}
        currentSession={currentSession}
        onQuestionsUpdate={setQuestions}
        onSessionUpdate={updateSessionProgress}
        onSubmitEvaluation={handleSubmitEvaluation}
        onBackToHome={handleBackToHome}
      />
      <Toaster />
    </>
  )
}

export default App
