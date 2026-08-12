import type { CourseOffering } from '@/features/courses/types/course.types'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { courseOfferingLabel } from '../utils/academic-performance-labels'

export function CourseOfferingPicker({
  offerings,
  value,
  onChange,
}: {
  offerings: CourseOffering[]
  value: string
  onChange: (offeringId: string) => void
}) {
  const selectedOffering = offerings.find((offering) => offering.id === value)

  return (
    <div className="grid gap-2">
      <Label htmlFor="assessmentCourse">Course section</Label>
      <Select value={value} onValueChange={(nextValue) => nextValue && onChange(nextValue)}>
        <SelectTrigger id="assessmentCourse" className="w-full">
          <SelectValue>
            {selectedOffering ? courseOfferingLabel(selectedOffering) : 'Select course section'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent side="bottom" alignItemWithTrigger>
          {offerings.map((offering) => (
            <SelectItem key={offering.id} value={offering.id}>
              {courseOfferingLabel(offering)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
