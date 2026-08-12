import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { assessmentFormSchema, type AssessmentFormValues } from '../schemas/assessment.schemas'
import type { AssessmentCategoryDefinition } from '../types/academic-performance.types'

export function AssessmentCreationForm({
  categories,
  disabled,
  isSubmitting,
  onSubmit,
}: {
  categories: AssessmentCategoryDefinition[]
  disabled: boolean
  isSubmitting: boolean
  onSubmit: (values: AssessmentFormValues, reset: () => void) => void
}) {
  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: { name: '', category: 'quiz', maximumMarks: 10 },
  })

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={form.handleSubmit((values) => onSubmit(values, () => form.reset()))}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="assessmentName">Assessment name</Label>
          <Input
            id="assessmentName"
            placeholder="e.g. Quiz 1"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register('name')}
          />
          {form.formState.errors.name ? (
            <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="assessmentCategory">Category</Label>
          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                <SelectTrigger id="assessmentCategory" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="bottom" alignItemWithTrigger>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label} ({category.weightPercentage}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="maximumMarks">Maximum marks</Label>
          <Input
            id="maximumMarks"
            type="number"
            min="1"
            max="1000"
            step="0.5"
            placeholder="e.g. 10"
            aria-invalid={Boolean(form.formState.errors.maximumMarks)}
            {...form.register('maximumMarks')}
          />
          {form.formState.errors.maximumMarks ? (
            <p className="text-destructive text-xs">{form.formState.errors.maximumMarks.message}</p>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={disabled || isSubmitting}>
          {isSubmitting ? (
            <Spinner />
          ) : (
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          )}
          Create assessment
        </Button>
      </div>
    </form>
  )
}
