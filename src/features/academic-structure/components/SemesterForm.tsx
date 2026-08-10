import { Controller, type UseFormReturn } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { SemesterFormValues } from '../schemas/academic-structure.schemas'
import { SemesterDateRangeField } from './SemesterDateRangeField'

type SemesterFormProps = {
  form: UseFormReturn<SemesterFormValues>
  formId: string
  onSubmit: (values: SemesterFormValues) => void
}

export function SemesterForm({ form, formId, onSubmit }: SemesterFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form

  return (
    <form id={formId} className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="semesterName" required>
            Semester name
          </FieldLabel>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="semesterName"
                placeholder="Fall Semester"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'semesterName-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="semesterName-error" errors={[errors.name]} />
        </Field>

        <Field data-invalid={Boolean(errors.academicYear)}>
          <FieldLabel htmlFor="semesterAcademicYear" required>
            Academic year
          </FieldLabel>
          <Controller
            control={control}
            name="academicYear"
            render={({ field }) => (
              <Input
                id="semesterAcademicYear"
                placeholder="2026-2027"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.academicYear)}
                aria-describedby={errors.academicYear ? 'semesterAcademicYear-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="semesterAcademicYear-error" errors={[errors.academicYear]} />
        </Field>

        <SemesterDateRangeField form={form} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field orientation="horizontal">
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  id="semesterIsActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <FieldContent>
              <FieldLabel htmlFor="semesterIsActive">Active semester</FieldLabel>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Controller
              control={control}
              name="isClosed"
              render={({ field }) => (
                <Switch
                  id="semesterIsClosed"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <FieldContent>
              <FieldLabel htmlFor="semesterIsClosed">Closed semester</FieldLabel>
            </FieldContent>
          </Field>
        </div>
      </FieldGroup>
    </form>
  )
}
