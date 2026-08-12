import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { FloppyDiskIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import {
  assessmentStructureSchema,
  type AssessmentStructureFormValues,
} from '../schemas/assessment-structure.schemas'
import type { AssessmentStructure } from '../types/academic-performance.types'

export function AssessmentStructureForm({
  structure,
  isSaving,
  onSave,
}: {
  structure: AssessmentStructure
  isSaving: boolean
  onSave: (values: AssessmentStructureFormValues) => void
}) {
  const form = useForm<AssessmentStructureFormValues>({
    resolver: zodResolver(assessmentStructureSchema),
    defaultValues: {
      categories: structure.categories.map(({ id, weightPercentage }) => ({
        id,
        weightPercentage,
      })),
    },
  })
  const categories = useWatch({ control: form.control, name: 'categories' })
  const total = categories.reduce(
    (sum, category) => sum + (Number(category.weightPercentage) || 0),
    0
  )
  const isValidTotal = Math.abs(total - 100) < 0.001

  return (
    <form noValidate className="grid gap-5" onSubmit={form.handleSubmit(onSave)}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {structure.categories.map((category, index) => {
          const error = form.formState.errors.categories?.[index]?.weightPercentage

          return (
            <div key={category.id} className="bg-muted/20 grid gap-2 rounded-md border p-4">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`categoryWeight-${category.id}`}>{category.label}</Label>
                <Badge variant="outline">%</Badge>
              </div>
              <input type="hidden" {...form.register(`categories.${index}.id`)} />
              <Input
                id={`categoryWeight-${category.id}`}
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                placeholder={`Weight for ${category.label}`}
                aria-invalid={Boolean(error)}
                {...form.register(`categories.${index}.weightPercentage`)}
              />
              {error ? <p className="text-destructive text-xs">{error.message}</p> : null}
            </div>
          )
        })}
      </div>

      <div className="grid gap-2 rounded-md border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Total weightage</p>
            <p className="text-muted-foreground text-xs">The total must equal exactly 100%.</p>
          </div>
          <Badge variant={isValidTotal ? 'outline' : 'destructive'}>{total}%</Badge>
        </div>
        <Progress value={Math.min(total, 100)} />
        {form.formState.errors.categories?.root ? (
          <p className="text-destructive text-xs">
            {form.formState.errors.categories.root.message}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving || !isValidTotal}>
          {isSaving ? (
            <Spinner />
          ) : (
            <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} data-icon="inline-start" />
          )}
          Save structure
        </Button>
      </div>
    </form>
  )
}
