import { Controller, type UseFormReturn } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { DepartmentFormValues } from '../schemas/department.schemas'

type DepartmentFormCardProps = {
  formId: string
  form: UseFormReturn<DepartmentFormValues>
  onSubmit: (values: DepartmentFormValues) => void
}

export function DepartmentFormCard({ formId, form, onSubmit }: DepartmentFormCardProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form

  return (
    <form id={formId} className="space-y-4 px-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="departmentName" required>
            Department name
          </FieldLabel>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="departmentName"
                placeholder="Computer Science"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'departmentName-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="departmentName-error" errors={[errors.name]} />
        </Field>

        <Field data-invalid={Boolean(errors.code)}>
          <FieldLabel htmlFor="departmentCode" required>
            Department code
          </FieldLabel>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                id="departmentCode"
                placeholder="CS"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.code)}
                aria-describedby={errors.code ? 'departmentCode-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="departmentCode-error" errors={[errors.code]} />
        </Field>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor="departmentDescription">Description</FieldLabel>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                id="departmentDescription"
                placeholder="Short administrative description"
                value={field.value}
                onBlur={field.onBlur}
                onChange={field.onChange}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? 'departmentDescription-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="departmentDescription-error" errors={[errors.description]} />
        </Field>

        <Field orientation="horizontal">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                id="departmentIsActive"
                checked={field.value}
                disabled={field.disabled}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldContent>
            <FieldLabel htmlFor="departmentIsActive">Active department</FieldLabel>
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  )
}
