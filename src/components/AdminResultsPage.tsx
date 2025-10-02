import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft, 
  Download, 
  Users, 
  FileText, 
  Trash, 
  TrashSimple 
} from '@phosphor-icons/react'
import { Evaluation, UserSession } from '@/types/evaluation'

interface AdminResultsPageProps {
  evaluations: Evaluation[]
  sessions: UserSession[]
  onBackToHome: () => void
  onDeleteEvaluation: (evaluationId: string) => void
  onDeleteAllEvaluations: () => void
  onDeleteSession: (sessionId: string) => void
  onDeleteAllSessions: () => void
}

export function AdminResultsPage({ 
  evaluations, 
  sessions,
  onBackToHome, 
  onDeleteEvaluation, 
  onDeleteAllEvaluations,
  onDeleteSession,
  onDeleteAllSessions
}: AdminResultsPageProps) {
  const [currentView, setCurrentView] = useState<'evaluations' | 'sessions'>('evaluations')

  // Calculate session statistics
  const activeSessions = sessions.filter(session => !session.isCompleted)
  const completedSessions = sessions.filter(session => session.isCompleted)

  const downloadResults = () => {
    // Use the existing CSV download function
    downloadCSV()
  }

  const downloadIndividualEvaluation = (evaluation: Evaluation) => {
    const headers = [
      'Evaluation ID',
      'User ID',
      'User Name',
      'Completed At',
      'Question ID',
      'Query',
      'Model A',
      'Model B',
      'Correctness Rating',
      'Comprehensiveness Rating',
      'Actionability Rating',
      'Knowledge Level',
      'Feedback'
    ]

    const rows = evaluation.questions.map(question => [
      evaluation.id,
      evaluation.userId,
      evaluation.userName,
      evaluation.completedAt ? new Date(evaluation.completedAt).toISOString() : '',
      question.id,
      `"${question.query.replace(/"/g, '""')}"`,
      question.modelA.model,
      question.modelB.model,
      question.ratings.correctness || '',
      question.ratings.comprehensiveness || '',
      question.ratings.actionability || '',
      question.knowledgeLevel || '',
      `"${(question.feedback || '').replace(/"/g, '""')}"`
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evaluation-${evaluation.userName.replace(/[^a-zA-Z0-9]/g, '-')}-${evaluation.id}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadCSV = () => {
    const headers = [
      'Evaluation ID',
      'User ID',
      'User Name',
      'Completed At',
      'Question ID',
      'Query',
      'Model A',
      'Model B',
      'Correctness Rating',
      'Comprehensiveness Rating',
      'Actionability Rating',
      'Knowledge Level',
      'Feedback'
    ]

    const rows = evaluations.flatMap(evaluation =>
      evaluation.questions.map(question => [
        evaluation.id,
        evaluation.userId,
        evaluation.userName,
        evaluation.completedAt ? new Date(evaluation.completedAt).toISOString() : '',
        question.id,
        `"${question.query.replace(/"/g, '""')}"`,
        question.modelA.model,
        question.modelB.model,
        question.ratings.correctness || '',
        question.ratings.comprehensiveness || '',
        question.ratings.actionability || '',
        question.knowledgeLevel || '',
        `"${(question.feedback || '').replace(/"/g, '""')}"`
      ])
    )

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evaluation-results-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadSessions = () => {
    const headers = [
      'Session ID',
      'User ID',
      'User Name',
      'Session Status',
      'Started At',
      'Last Updated',
      'Question ID',
      'Query',
      'Model A',
      'Model B',
      'Correctness Rating',
      'Comprehensiveness Rating',
      'Actionability Rating',
      'Knowledge Level',
      'Feedback'
    ]

    // Only include open (incomplete) sessions in the download
    const openSessions = sessions.filter(session => !session.isCompleted)
    const rows = openSessions.flatMap(session =>
      session.questions.map(question => [
        session.id,
        session.userId,
        `"${session.userName.replace(/"/g, '""')}"`,
        session.isCompleted ? 'Completed' : 'In Progress',
        new Date(session.startedAt).toISOString(),
        new Date(session.lastUpdated).toISOString(),
        question.id,
        `"${question.query.replace(/"/g, '""')}"`,
        question.modelA.model,
        question.modelB.model,
        question.ratings.correctness || '',
        question.ratings.comprehensiveness || '',
        question.ratings.actionability || '',
        question.knowledgeLevel || '',
        `"${(question.feedback || '').replace(/"/g, '""')}"`
      ])
    )

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `session-responses-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadIndividualSession = (session: UserSession) => {
    const headers = [
      'Session ID',
      'User ID', 
      'User Name',
      'Session Status',
      'Started At',
      'Last Updated',
      'Completed At',
      'Current Question Index',
      'Total Questions',
      'Progress %',
      'Question Number',
      'Question ID',
      'Query',
      'Model A',
      'Model A Response',
      'Model B',
      'Model B Response',
      'Correctness Rating',
      'Comprehensiveness Rating',
      'Actionability Rating',
      'Knowledge Level',
      'Feedback',
      'Is Answered'
    ]

    const rows = session.questions.map((question, index) => [
      session.id,
      session.userId,
      `"${session.userName.replace(/"/g, '""')}"`,
      session.isCompleted ? 'Completed' : 'In Progress',
      new Date(session.startedAt).toISOString(),
      new Date(session.lastUpdated).toISOString(),
      session.completedAt ? new Date(session.completedAt).toISOString() : '',
      session.currentQuestionIndex.toString(),
      session.questions.length.toString(),
      `${((session.currentQuestionIndex + 1) / session.questions.length * 100).toFixed(1)}%`,
      (index + 1).toString(),
      question.id,
      `"${question.query.replace(/"/g, '""')}"`,
      question.modelA.model,
      `"${question.modelA.response.replace(/"/g, '""')}"`,
      question.modelB.model,
      `"${question.modelB.response.replace(/"/g, '""')}"`,
      question.ratings.correctness || '',
      question.ratings.comprehensiveness || '',
      question.ratings.actionability || '',
      question.knowledgeLevel || '',
      `"${(question.feedback || '').replace(/"/g, '""')}"`,
      !!(question.ratings.correctness || question.ratings.comprehensiveness || question.ratings.actionability) ? 'Yes' : 'No'
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `session-${session.userName.replace(/[^a-zA-Z0-9]/g, '-')}-${session.id}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }





  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBackToHome}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Evaluation Results</h1>
              <p className="text-muted-foreground">
                View and download evaluation data
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={currentView === 'evaluations' ? onDeleteAllEvaluations : onDeleteAllSessions} 
              variant="destructive" 
              className="flex items-center gap-2"
              disabled={currentView === 'evaluations' ? evaluations.length === 0 : activeSessions.length === 0}
            >
              <TrashSimple size={16} />
              Delete All {currentView === 'evaluations' ? 'Evaluations' : 'Open Sessions'}
            </Button>
            {currentView === 'evaluations' ? (
              <Button onClick={downloadCSV} variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Download CSV
              </Button>
            ) : (
              <Button onClick={downloadSessions} variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Download Open Sessions CSV
              </Button>
            )}
          </div>
        </div>



        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={currentView === 'evaluations' ? 'default' : 'outline'}
            onClick={() => setCurrentView('evaluations')}
            className="flex items-center gap-2"
          >
            <FileText size={16} />
            Completed Evaluations ({evaluations.length})
          </Button>
          <Button
            variant={currentView === 'sessions' ? 'default' : 'outline'}
            onClick={() => setCurrentView('sessions')}
            className="flex items-center gap-2"
          >
            <Users size={16} />
            Open Sessions ({activeSessions.length})
          </Button>
        </div>

        {currentView === 'evaluations' ? (
          evaluations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No evaluations yet</h3>
                <p className="text-muted-foreground">
                  Evaluations will appear here once users complete them.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Completed Evaluations</CardTitle>
                <CardDescription>
                  View evaluation summary and download results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {evaluations.map((evaluation) => (
                      <div
                        key={evaluation.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{evaluation.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {evaluation.questions.length} questions • 
                            Completed {evaluation.completedAt ? new Date(evaluation.completedAt).toLocaleDateString() : 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              downloadIndividualEvaluation(evaluation)
                            }}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Download size={14} />
                            Download
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteEvaluation(evaluation.id)
                            }}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Trash size={14} />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )
        ) : (
          // Sessions view - only show open (incomplete) sessions
          activeSessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No open sessions</h3>
                <p className="text-muted-foreground">
                  Open user sessions will appear here when users start evaluations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Open User Sessions</CardTitle>
                <CardDescription>
                  Track active user progress and manage incomplete sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {activeSessions.map((session) => {
                      const progress = ((session.currentQuestionIndex + 1) / session.questions.length * 100).toFixed(0)
                      const answeredQuestions = session.questions.filter(q => 
                        q.ratings.correctness !== null || 
                        q.ratings.comprehensiveness !== null || 
                        q.ratings.actionability !== null
                      ).length
                      
                      return (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium">{session.userName}</p>
                              <Badge variant={session.isCompleted ? "default" : "secondary"}>
                                {session.isCompleted ? 'Completed' : 'In Progress'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Progress: {session.currentQuestionIndex + 1}/{session.questions.length} questions ({progress}%)
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                              Answered: {answeredQuestions}/{session.questions.length} questions
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Started: {new Date(session.startedAt).toLocaleDateString()} • 
                              {session.isCompleted && session.completedAt 
                                ? `Completed: ${new Date(session.completedAt).toLocaleDateString()}`
                                : `Last activity: ${new Date(session.lastUpdated).toLocaleDateString()}`
                              }
                            </p>
                            
                            {/* Progress bar */}
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadIndividualSession(session)
                              }}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Download size={14} />
                              Download
                            </Button>
                            <Button
                              onClick={() => onDeleteSession(session.id)}
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Trash size={14} />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  )
}