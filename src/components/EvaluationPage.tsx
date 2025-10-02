import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ResponseCard } from '@/components/ResponseCard'
import { RatingScale } from '@/components/RatingScale'
import { KnowledgeLevelScale } from '@/components/KnowledgeLevelScale'
import { Question, Rating, KnowledgeLevel, METRICS, User, UserSession } from '@/types/evaluation'
import { CaretLeft, CaretRight, Check, ArrowLeft } from '@phosphor-icons/react'
import ReactMarkdown from 'react-markdown'

interface EvaluationPageProps {
  user: User
  questions: Question[]
  currentSession: UserSession | null
  onQuestionsUpdate: (questions: Question[]) => void
  onSessionUpdate: (updatedQuestions: Question[], currentIndex: number) => void
  onSubmitEvaluation: () => void
  onBackToHome: () => void
}

export function EvaluationPage({ 
  user, 
  questions, 
  currentSession,
  onQuestionsUpdate, 
  onSessionUpdate,
  onSubmitEvaluation, 
  onBackToHome
}: EvaluationPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    currentSession?.currentQuestionIndex ?? 0
  )

  const currentQuestion = questions[currentQuestionIndex]
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const updateRating = (metric: keyof typeof currentQuestion.ratings, rating: Rating) => {
    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestionIndex 
        ? {
            ...q,
            ratings: {
              ...q.ratings,
              [metric]: rating
            }
          }
        : q
    )
    onQuestionsUpdate(updatedQuestions)
    onSessionUpdate(updatedQuestions, currentQuestionIndex)
  }

  const updateKnowledgeLevel = (level: KnowledgeLevel) => {
    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestionIndex
        ? { ...q, knowledgeLevel: level }
        : q
    )
    onQuestionsUpdate(updatedQuestions)
    onSessionUpdate(updatedQuestions, currentQuestionIndex)
  }

  const updateFeedback = (feedback: string) => {
    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestionIndex
        ? { ...q, feedback }
        : q
    )
    onQuestionsUpdate(updatedQuestions)
    onSessionUpdate(updatedQuestions, currentQuestionIndex)
  }

  const goToPreviousQuestion = () => {
    if (!isFirstQuestion) {
      const newIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(newIndex)
      onSessionUpdate(questions, newIndex)
    }
  }

  const goToNextQuestion = () => {
    if (!isLastQuestion) {
      const newIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(newIndex)
      onSessionUpdate(questions, newIndex)
    }
  }

  const currentQuestionCompleted = Object.values(currentQuestion.ratings).every(rating => rating !== null) && currentQuestion.knowledgeLevel !== null
  const allQuestionsCompleted = questions.every(q => 
    Object.values(q.ratings).every(rating => rating !== null) && q.knowledgeLevel !== null
  )



  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header with User Info */}
          <div className="flex items-center justify-between">
            <Button 
              onClick={onBackToHome}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Button>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Model Comparison Tool</h1>
              <p className="text-muted-foreground">
                Evaluating as <span className="font-medium text-foreground">{user.name}</span>
              </p>
              {currentSession && (
                <p className="text-sm text-muted-foreground">
                  Session started: {new Date(currentSession.startedAt).toLocaleDateString()} • 
                  Last saved: {new Date(currentSession.lastUpdated).toLocaleTimeString()}
                </p>
              )}

            </div>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>



          {/* Question Progress */}
          <div className="text-center">
            <Badge variant="outline" className="text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>

          {/* Query Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Query</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-y-auto text-base leading-relaxed prose prose-sm max-w-none">
                <ReactMarkdown>
                  {currentQuestion.query}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Response Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponseCard 
              response={currentQuestion.modelA} 
              variant="primary"
            />
            <ResponseCard 
              response={currentQuestion.modelB} 
              variant="secondary"
            />
          </div>

          {/* Knowledge Level Assessment */}
          <KnowledgeLevelScale
            value={currentQuestion.knowledgeLevel}
            onChange={updateKnowledgeLevel}
          />

          {/* Rating Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Rate the Responses</h2>
              <p className="text-muted-foreground mt-1">
                Evaluate both models on the following criteria
              </p>
            </div>

            <div className="space-y-6">
              {METRICS.map(metric => (
                <RatingScale
                  key={metric.key}
                  metric={metric}
                  value={currentQuestion.ratings[metric.key]}
                  onChange={(rating) => updateRating(metric.key, rating)}
                />
              ))}
            </div>
          </div>

          {/* Additional Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  id="feedback"
                  placeholder="Any additional comments, observations, or context you'd like to share about these responses..."
                  value={currentQuestion.feedback || ''}
                  onChange={(e) => updateFeedback(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation and Submit */}
          <div className="flex items-center justify-between">
            <Button 
              onClick={goToPreviousQuestion}
              disabled={isFirstQuestion}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CaretLeft size={16} />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button 
                onClick={onSubmitEvaluation}
                disabled={!allQuestionsCompleted}
                size="lg"
                className="flex items-center gap-2"
              >
                <Check size={16} />
                {allQuestionsCompleted ? 'Submit Evaluation' : 'Complete All Questions to Submit'}
              </Button>
            ) : (
              <Button 
                onClick={goToNextQuestion}
                disabled={!currentQuestionCompleted}
                className="flex items-center gap-2"
              >
                Next
                <CaretRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}