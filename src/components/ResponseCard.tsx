import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModelResponse } from '@/types/evaluation'
import ReactMarkdown from 'react-markdown'

interface ResponseCardProps {
  response: ModelResponse
  variant: 'primary' | 'secondary'
}

export function ResponseCard({ response, variant }: ResponseCardProps) {
  return (
    <Card className={`h-full ${variant === 'primary' ? 'border-primary/20' : 'border-secondary/20'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          Model {variant === 'primary' ? 'A' : 'B'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto pr-2">
          <ReactMarkdown>
            {response.response || 'No response provided'}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}