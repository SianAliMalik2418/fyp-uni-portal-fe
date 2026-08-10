import { Controller, type UseFormReturn } from 'react-hook-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { Program } from '@/features/programs/types/program.types'
import type { BatchFormValues } from '../schemas/academic-structure.schemas'
import { ProgramSelect } from './ProgramSelect'

type BatchFormProps = {
  form: UseFormReturn<BatchFormValues>
  formId: string
  onSubmit: (values: BatchFormValues) => void
  programs: Program[]
}

export function BatchForm({ form, formId, onSubmit, programs }: BatchFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form

  return (
    <form id={formId} className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="batchName" required>
            Batch name
          </FieldLabel>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="batchName"
                placeholder="Fall 2026"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'batchName-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="batchName-error" errors={[errors.name]} />
        </Field>

        <Field data-invalid={Boolean(errors.programId)}>
          <FieldLabel htmlFor="batchProgram" required>
            Program
          </FieldLabel>
          <Controller
            control={control}
            name="programId"
            render={({ field }) => (
              <ProgramSelect
                id="batchProgram"
                field={field}
                programs={programs}
                error={errors.programId}
              />
            )}
          />
          <FieldError id="batchProgram-error" errors={[errors.programId]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.startingYear)}>
            <FieldLabel htmlFor="batchStartingYear" required>
              Starting year
            </FieldLabel>
            <Controller
              control={control}
              name="startingYear"
              render={({ field }) => (
                <Input
                  id="batchStartingYear"
                  type="number"
                  placeholder="2026"
                  value={String(field.value)}
                  onBlur={field.onBlur}
                  onValueChange={(value) => field.onChange(Number(value))}
                  aria-invalid={Boolean(errors.startingYear)}
                  aria-describedby={errors.startingYear ? 'batchStartingYear-error' : undefined}
                  ref={field.ref}
                />
              )}
            />
            <FieldError id="batchStartingYear-error" errors={[errors.startingYear]} />
          </Field>
          <Field data-invalid={Boolean(errors.expectedGraduationYear)}>
            <FieldLabel htmlFor="batchGraduationYear" required>
              Graduation year
            </FieldLabel>
            <Controller
              control={control}
              name="expectedGraduationYear"
              render={({ field }) => (
                <Input
                  id="batchGraduationYear"
                  type="number"
                  placeholder="2030"
                  value={String(field.value)}
                  onBlur={field.onBlur}
                  onValueChange={(value) => field.onChange(Number(value))}
                  aria-invalid={Boolean(errors.expectedGraduationYear)}
                  aria-describedby={
                    errors.expectedGraduationYear ? 'batchGraduationYear-error' : undefined
                  }
                  ref={field.ref}
                />
              )}
            />
            <FieldError id="batchGraduationYear-error" errors={[errors.expectedGraduationYear]} />
          </Field>
        </div>

        <Field orientation="horizontal">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch id="batchIsActive" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <FieldContent>
            <FieldLabel htmlFor="batchIsActive">Active batch</FieldLabel>
          </FieldContent>
        </Field>

        {!programs.some((program) => program.isActive) ? (
          <Alert>
            <AlertTitle>No active programs</AlertTitle>
            <AlertDescription>Create or activate a program before adding a batch.</AlertDescription>
          </Alert>
        ) : null}
      </FieldGroup>
    </form>
  )
}
