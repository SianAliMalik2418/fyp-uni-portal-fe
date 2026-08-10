import { Controller, type UseFormReturn } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { Department } from '@/features/departments/types/department.types'
import type { ProgramFormValues } from '../schemas/program.schemas'

type ProgramFormCardProps = {
  departments: Department[]
  formId: string
  form: UseFormReturn<ProgramFormValues>
  onSubmit: (values: ProgramFormValues) => void
}

export function ProgramFormCard({ departments, formId, form, onSubmit }: ProgramFormCardProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form
  const activeDepartments = departments.filter((department) => department.isActive)
  const selectedDepartmentId = form.watch('departmentId')
  const selectedDepartment = departments.find(
    (department) => department.id === selectedDepartmentId
  )

  return (
    <form id={formId} className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="programName" required>
            Program name
          </FieldLabel>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="programName"
                placeholder="BS Computer Science"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'programName-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="programName-error" errors={[errors.name]} />
        </Field>

        <Field data-invalid={Boolean(errors.code)}>
          <FieldLabel htmlFor="programCode" required>
            Program code
          </FieldLabel>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                id="programCode"
                placeholder="BSCS"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.code)}
                aria-describedby={errors.code ? 'programCode-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="programCode-error" errors={[errors.code]} />
        </Field>

        <Field data-invalid={Boolean(errors.departmentId)}>
          <FieldLabel htmlFor="programDepartment" required>
            Department
          </FieldLabel>
          <Controller
            control={control}
            name="departmentId"
            render={({ field }) => (
              <Select
                value={field.value}
                disabled={!activeDepartments.length}
                onValueChange={(value) => field.onChange(value ?? '')}
              >
                <SelectTrigger
                  id="programDepartment"
                  className="w-full"
                  onBlur={field.onBlur}
                  aria-invalid={Boolean(errors.departmentId)}
                  aria-describedby={errors.departmentId ? 'programDepartment-error' : undefined}
                  ref={field.ref}
                >
                  <SelectValue>
                    {selectedDepartment
                      ? `${selectedDepartment.name} (${selectedDepartment.code})`
                      : 'Select department'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {activeDepartments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError id="programDepartment-error" errors={[errors.departmentId]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.totalSemesters)}>
            <FieldLabel htmlFor="programTotalSemesters" required>
              Total semesters
            </FieldLabel>
            <Controller
              control={control}
              name="totalSemesters"
              render={({ field }) => (
                <Input
                  id="programTotalSemesters"
                  type="number"
                  min={1}
                  max={16}
                  placeholder="8"
                  value={String(field.value)}
                  onBlur={field.onBlur}
                  onValueChange={(value) => field.onChange(Number(value))}
                  aria-invalid={Boolean(errors.totalSemesters)}
                  aria-describedby={
                    errors.totalSemesters ? 'programTotalSemesters-error' : undefined
                  }
                  ref={field.ref}
                />
              )}
            />
            <FieldError id="programTotalSemesters-error" errors={[errors.totalSemesters]} />
          </Field>

          <Field data-invalid={Boolean(errors.duration) || Boolean(errors.durationUnit)}>
            <FieldLabel htmlFor="programDurationValue" required>
              Duration
            </FieldLabel>
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,108px)] gap-2">
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <Input
                    id="programDurationValue"
                    type="number"
                    min={1}
                    max={120}
                    placeholder="4"
                    value={field.value}
                    onBlur={field.onBlur}
                    onValueChange={(value) => field.onChange(Number(value))}
                    aria-invalid={Boolean(errors.duration)}
                    aria-describedby={
                      errors.duration || errors.durationUnit ? 'programDuration-error' : undefined
                    }
                    ref={field.ref}
                  />
                )}
              />
              <Controller
                control={control}
                name="durationUnit"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value ?? 'years')}
                  >
                    <SelectTrigger
                      id="programDurationUnit"
                      onBlur={field.onBlur}
                      aria-label="Duration unit"
                      aria-invalid={Boolean(errors.durationUnit)}
                      ref={field.ref}
                    >
                      <SelectValue>{field.value === 'months' ? 'Months' : 'Years'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="years">Years</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FieldError id="programDuration-error" errors={[errors.duration]} />
            <FieldError errors={[errors.durationUnit]} />
          </Field>
        </div>

        <Field orientation="horizontal">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                id="programIsActive"
                checked={field.value}
                disabled={field.disabled}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldContent>
            <FieldLabel htmlFor="programIsActive">Active program</FieldLabel>
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  )
}
