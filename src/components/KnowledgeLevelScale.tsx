import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KnowledgeLevel, KNOWLEDGE_LEVEL_OPTIONS } from '@/types/evaluation'

interface KnowledgeLevelScaleProps {
  value: KnowledgeLevel | null
  onChange: (level: KnowledgeLevel) => void
}

export function KnowledgeLevelScale({ value, onChange }: KnowledgeLevelScaleProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Knowledge Self-Assessment</CardTitle>
          {value && (
            <Badge variant="outline" className="text-xs">
              Assessed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value || ''}
          onValueChange={(newValue) => onChange(newValue as KnowledgeLevel)}
          className="flex justify-between"
        >
          {KNOWLEDGE_LEVEL_OPTIONS.map((option) => (
            <div key={option.value} className="flex flex-col items-center space-y-2">
              <RadioGroupItem 
                value={option.value} 
                id={`knowledge-${option.value}`}
                className="flex-shrink-0 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
              />
              <Label 
                htmlFor={`knowledge-${option.value}`}
                className="text-sm font-medium cursor-pointer leading-relaxed text-center"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}