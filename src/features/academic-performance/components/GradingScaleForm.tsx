import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FloppyDiskIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { gradingScaleSchema, type GradingScaleFormValues } from '../schemas/grading-scale.schemas'
import type { GradingScale } from '../types/academic-performance.types'

export function GradingScaleForm({
  gradingScale,
  isSaving,
  onSave,
}: {
  gradingScale: GradingScale
  isSaving: boolean
  onSave: (values: GradingScaleFormValues) => void
}) {
  const form = useForm<GradingScaleFormValues>({
    resolver: zodResolver(gradingScaleSchema),
    defaultValues: { ranges: gradingScale.ranges },
  })
  const rangeError = form.formState.errors.ranges?.root?.message

  return (
    <form className="grid gap-5" noValidate onSubmit={form.handleSubmit(onSave)}>
      <div className="overflow-x-auto rounded-md border">
        <div className="grid min-w-184 grid-cols-[1fr_1fr_1fr_1fr] gap-3 border-b px-4 py-3 text-sm font-medium">
          <span>Minimum percentage</span>
          <span>Maximum percentage</span>
          <span>Letter grade</span>
          <span>Grade point</span>
        </div>
        {gradingScale.ranges.map((range, index) => (
          <div
            key={`${range.letterGrade}-${index}`}
            className="grid min-w-184 grid-cols-[1fr_1fr_1fr_1fr] gap-3 border-b p-4 last:border-b-0"
          >
            <div className="grid gap-1.5">
              <Label className="sr-only" htmlFor={`gradeMinimum-${index}`}>
                Minimum percentage for {range.letterGrade}
              </Label>
              <Input
                id={`gradeMinimum-${index}`}
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Minimum percentage"
                aria-invalid={Boolean(form.formState.errors.ranges?.[index]?.minimumPercentage)}
                {...form.register(`ranges.${index}.minimumPercentage`)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="sr-only" htmlFor={`gradeMaximum-${index}`}>
                Maximum percentage for {range.letterGrade}
              </Label>
              <Input
                id={`gradeMaximum-${index}`}
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Maximum percentage"
                aria-invalid={Boolean(form.formState.errors.ranges?.[index]?.maximumPercentage)}
                {...form.register(`ranges.${index}.maximumPercentage`)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="sr-only" htmlFor={`letterGrade-${index}`}>
                Letter grade {index + 1}
              </Label>
              <Input
                id={`letterGrade-${index}`}
                placeholder="Letter grade"
                aria-invalid={Boolean(form.formState.errors.ranges?.[index]?.letterGrade)}
                {...form.register(`ranges.${index}.letterGrade`)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="sr-only" htmlFor={`gradePoint-${index}`}>
                Grade point for {range.letterGrade}
              </Label>
              <Input
                id={`gradePoint-${index}`}
                type="number"
                min="0"
                max="4"
                step="0.01"
                placeholder="Grade point"
                aria-invalid={Boolean(form.formState.errors.ranges?.[index]?.gradePoint)}
                {...form.register(`ranges.${index}.gradePoint`)}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-destructive min-h-4 text-sm">{rangeError}</p>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <Spinner />
          ) : (
            <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} data-icon="inline-start" />
          )}
          Save grading scale
        </Button>
      </div>
    </form>
  )
}
