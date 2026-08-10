import { Controller, type UseFormReturn } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { SemesterFormValues } from '../schemas/academic-structure.schemas'

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

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.startsAt)}>
            <FieldLabel htmlFor="semesterStartsAt">Start date</FieldLabel>
            <Controller
              control={control}
              name="startsAt"
              render={({ field }) => (
                <Input
                  id="semesterStartsAt"
                  type="date"
                  placeholder="2026-09-01"
                  value={field.value ?? ''}
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  aria-invalid={Boolean(errors.startsAt)}
                  aria-describedby={errors.startsAt ? 'semesterStartsAt-error' : undefined}
                  ref={field.ref}
                />
              )}
            />
            <FieldError id="semesterStartsAt-error" errors={[errors.startsAt]} />
          </Field>
          <Field data-invalid={Boolean(errors.endsAt)}>
            <FieldLabel htmlFor="semesterEndsAt">End date</FieldLabel>
            <Controller
              control={control}
              name="endsAt"
              render={({ field }) => (
                <Input
                  id="semesterEndsAt"
                  type="date"
                  placeholder="2027-01-15"
                  value={field.value ?? ''}
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  aria-invalid={Boolean(errors.endsAt)}
                  aria-describedby={errors.endsAt ? 'semesterEndsAt-error' : undefined}
                  ref={field.ref}
                />
              )}
            />
            <FieldError id="semesterEndsAt-error" errors={[errors.endsAt]} />
          </Field>
        </div>

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
