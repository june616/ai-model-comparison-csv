import { Evaluation } from '@/types/evaluation'

// Utility to build and trigger download of a single evaluation as CSV.
// Mirrors the column order used in AdminResultsPage for consistency.
export function downloadEvaluationCsv(evaluation: Evaluation) {
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
    question.ratings.correctness ?? '',
    question.ratings.comprehensiveness ?? '',
    question.ratings.actionability ?? '',
    question.knowledgeLevel ?? '',
    `"${(question.feedback ?? '').replace(/"/g, '""')}"`
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  // Use a sanitized version of the user name (fallback to userId if empty)
  const safeUserName = (evaluation.userName || evaluation.userId)
    .toString()
    .trim()
    .replace(/\s+/g, '-')           // spaces to dashes
    .replace(/[^a-zA-Z0-9-_]/g, '')  // remove unsafe filename chars
    .slice(0, 60)                    // keep filename reasonable length
  const fileName = `evaluation-${safeUserName}-${Date.now()}.csv`
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  // Fire-and-forget upload to Azure Function (Static Web App API)
  // No blocking of user download; failures only logged.
  console.log('[CSV_DOWNLOAD] generated', { evaluationId: evaluation.id, fileName })

  try {
    console.log('[CSV_UPLOAD] start', { fileName, bytes: csvContent.length })
    fetch('/api/upload-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv: csvContent, fileName, evaluationId: evaluation.id, userId: evaluation.userId })
    })
      .then(async r => {
        let body
        try { body = await r.json() } catch { body = {} }
        if (!r.ok || !body?.ok) {
          console.warn('[CSV_UPLOAD] failure', { status: r.status, body })
        } else {
          console.log('[CSV_UPLOAD] success', body)
        }
      })
      .catch(e => console.warn('[CSV_UPLOAD] network error', e))
  } catch (e) {
    console.warn('[CSV_UPLOAD] threw', e)
  }
}
