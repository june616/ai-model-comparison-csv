import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rating, RATING_OPTIONS, METRICS } from '@/types/evaluation'

interface RatingScaleProps {
  metric: typeof METRICS[number]
  value: Rating | null
  onChange: (value: Rating) => void
}

export function RatingScale({ metric, value, onChange }: RatingScaleProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{metric.title}</CardTitle>
          {value && (
            <Badge variant="outline" className="text-xs">
              Rated
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value || ''}
          onValueChange={(newValue) => onChange(newValue as Rating)}
          className="flex justify-between"
        >
          {RATING_OPTIONS.map((option) => (
            <div key={option.value} className="flex flex-col items-center space-y-2">
              <RadioGroupItem 
                value={option.value} 
                id={`${metric.key}-${option.value}`}
                className="flex-shrink-0 border-2 border-gray-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10"
              />
              <Label 
                htmlFor={`${metric.key}-${option.value}`}
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