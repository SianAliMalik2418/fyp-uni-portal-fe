import { Controller, type UseFormReturn } from 'react-hook-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Switch } from '@/components/ui/switch'
import type { Program } from '@/features/programs/types/program.types'
import type { SectionFormValues } from '../schemas/academic-structure.schemas'
import type { Batch, Semester } from '../types/academic-structure.types'
import { ProgramSelect } from './ProgramSelect'

type SectionFormProps = {
  batches: Batch[]
  form: UseFormReturn<SectionFormValues>
  formId: string
  onSubmit: (values: SectionFormValues) => void
  programs: Program[]
  semesters: Semester[]
}

export function SectionForm({
  batches,
  form,
  formId,
  onSubmit,
  programs,
  semesters,
}: SectionFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = form
  const selectedProgramId = watch('programId')
  const matchingBatches = batches.filter(
    (batch) => batch.isActive && (!selectedProgramId || batch.program.id === selectedProgramId)
  )
  const availableSemesters = semesters.filter((semester) => !semester.isClosed)

  return (
    <form id={formId} className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="sectionName" required>
            Section name
          </FieldLabel>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="sectionName"
                placeholder="A"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'sectionName-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="sectionName-error" errors={[errors.name]} />
        </Field>

        <Field data-invalid={Boolean(errors.programId)}>
          <FieldLabel htmlFor="sectionProgram" required>
            Program
          </FieldLabel>
          <Controller
            control={control}
            name="programId"
            render={({ field }) => (
              <ProgramSelect
                id="sectionProgram"
                field={field}
                programs={programs}
                error={errors.programId}
              />
            )}
          />
          <FieldError id="sectionProgram-error" errors={[errors.programId]} />
        </Field>

        <Field data-invalid={Boolean(errors.batchId)}>
          <FieldLabel htmlFor="sectionBatch" required>
            Batch
          </FieldLabel>
          <Controller
            control={control}
            name="batchId"
            render={({ field }) => (
              <NativeSelect
                id="sectionBatch"
                className="w-full"
                value={field.value}
                disabled={!matchingBatches.length}
                onBlur={field.onBlur}
                onChange={field.onChange}
                aria-invalid={Boolean(errors.batchId)}
                aria-describedby={errors.batchId ? 'sectionBatch-error' : undefined}
                ref={field.ref}
              >
                <NativeSelectOption value="">Select batch</NativeSelectOption>
                {matchingBatches.map((batch) => (
                  <NativeSelectOption key={batch.id} value={batch.id}>
                    {batch.name} ({batch.startingYear})
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            )}
          />
          <FieldError id="sectionBatch-error" errors={[errors.batchId]} />
        </Field>

        <Field data-invalid={Boolean(errors.semesterId)}>
          <FieldLabel htmlFor="sectionSemester" required>
            Semester
          </FieldLabel>
          <Controller
            control={control}
            name="semesterId"
            render={({ field }) => (
              <NativeSelect
                id="sectionSemester"
                className="w-full"
                value={field.value}
                disabled={!availableSemesters.length}
                onBlur={field.onBlur}
                onChange={field.onChange}
                aria-invalid={Boolean(errors.semesterId)}
                aria-describedby={errors.semesterId ? 'sectionSemester-error' : undefined}
                ref={field.ref}
              >
                <NativeSelectOption value="">Select semester</NativeSelectOption>
                {availableSemesters.map((semester) => (
                  <NativeSelectOption key={semester.id} value={semester.id}>
                    {semester.name} ({semester.academicYear})
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            )}
          />
          <FieldError id="sectionSemester-error" errors={[errors.semesterId]} />
        </Field>

        <Field orientation="horizontal">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch id="sectionIsActive" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <FieldContent>
            <FieldLabel htmlFor="sectionIsActive">Active section</FieldLabel>
          </FieldContent>
        </Field>

        {!matchingBatches.length || !availableSemesters.length ? (
          <Alert>
            <AlertTitle>Section prerequisites missing</AlertTitle>
            <AlertDescription>
              Sections require an active matching batch and a semester that is not closed.
            </AlertDescription>
          </Alert>
        ) : null}
      </FieldGroup>
    </form>
  )
}
