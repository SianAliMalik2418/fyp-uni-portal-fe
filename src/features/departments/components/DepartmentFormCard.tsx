import { Add01Icon, FloppyDiskIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { DepartmentFormValues } from '../schemas/department.schemas'
import type { Department } from '../types/department.types'

type DepartmentFormCardProps = {
  editingDepartment: Department | null
  form: UseFormReturn<DepartmentFormValues>
  isSaving: boolean
  onCancelEdit: () => void
  onSubmit: (values: DepartmentFormValues) => void
}

export function DepartmentFormCard({
  editingDepartment,
  form,
  isSaving,
  onCancelEdit,
  onSubmit,
}: DepartmentFormCardProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>{editingDepartment ? 'Edit department' : 'Add department'}</CardTitle>
        <CardDescription>
          Department codes are used by programs, batches, sections, and reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                    aria-describedby={
                      errors.description ? 'departmentDescription-error' : undefined
                    }
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

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isSaving}>
              <HugeiconsIcon
                icon={editingDepartment ? FloppyDiskIcon : Add01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              {isSaving ? 'Saving...' : editingDepartment ? 'Save changes' : 'Add department'}
            </Button>
            {editingDepartment ? (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
