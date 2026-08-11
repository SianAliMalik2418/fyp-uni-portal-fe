import { Controller, useWatch, type UseFormReturn } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import type { Semester } from '@/features/academic-structure/types/academic-structure.types'
import type { Department } from '@/features/departments/types/department.types'
import type { Program } from '@/features/programs/types/program.types'
import type { CourseFormValues } from '../schemas/course.schemas'

type CourseFormCardProps = {
  departments: Department[]
  form: UseFormReturn<CourseFormValues>
  formId: string
  onSubmit: (values: CourseFormValues) => void
  programs: Program[]
  semesters: Semester[]
}

export function CourseFormCard({
  departments,
  form,
  formId,
  onSubmit,
  programs,
  semesters,
}: CourseFormCardProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = form
  const selectedDepartmentId = useWatch({ control, name: 'departmentId' })
  const selectedProgramId = useWatch({ control, name: 'programId' })
  const activeDepartments = departments.filter((department) => department.isActive)
  const programOptions = programs.filter(
    (program) =>
      program.isActive && (!selectedDepartmentId || program.department.id === selectedDepartmentId)
  )
  const semesterOptions = semesters.filter((semester) => !semester.isClosed)

  return (
    <form id={formId} className="space-y-4 px-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.code)}>
          <FieldLabel htmlFor="courseCode" required>
            Course code
          </FieldLabel>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                id="courseCode"
                placeholder="CS101"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.code)}
                aria-describedby={errors.code ? 'courseCode-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="courseCode-error" errors={[errors.code]} />
        </Field>

        <Field data-invalid={Boolean(errors.title)}>
          <FieldLabel htmlFor="courseTitle" required>
            Course title
          </FieldLabel>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                id="courseTitle"
                placeholder="Programming Fundamentals"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'courseTitle-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="courseTitle-error" errors={[errors.title]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.creditHours)}>
            <FieldLabel htmlFor="creditHours" required>
              Credit hours
            </FieldLabel>
            <Controller
              control={control}
              name="creditHours"
              render={({ field }) => (
                <Input
                  id="creditHours"
                  type="number"
                  min={1}
                  max={6}
                  placeholder="3"
                  value={String(field.value)}
                  onBlur={field.onBlur}
                  onValueChange={(value) => field.onChange(Number(value))}
                  aria-invalid={Boolean(errors.creditHours)}
                  aria-describedby={errors.creditHours ? 'creditHours-error' : undefined}
                  ref={field.ref}
                />
              )}
            />
            <FieldError id="creditHours-error" errors={[errors.creditHours]} />
          </Field>

          <Field data-invalid={Boolean(errors.departmentId)}>
            <FieldLabel htmlFor="courseDepartment" required>
              Department
            </FieldLabel>
            <Controller
              control={control}
              name="departmentId"
              render={({ field }) => {
                const selected = departments.find((department) => department.id === field.value)
                return (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      const nextDepartmentId = value ?? ''
                      field.onChange(nextDepartmentId)
                      setValue('programId', '', { shouldDirty: true, shouldValidate: true })
                      setValue('semesterId', '', { shouldDirty: true, shouldValidate: true })
                    }}
                  >
                    <SelectTrigger
                      id="courseDepartment"
                      className="w-full"
                      onBlur={field.onBlur}
                      aria-invalid={Boolean(errors.departmentId)}
                      aria-describedby={errors.departmentId ? 'courseDepartment-error' : undefined}
                      ref={field.ref}
                    >
                      <SelectValue>{selected?.name ?? 'Select department'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {activeDepartments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              }}
            />
            <FieldError id="courseDepartment-error" errors={[errors.departmentId]} />
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.programId)}>
          <FieldLabel htmlFor="courseProgram" required>
            Program
          </FieldLabel>
          <Controller
            control={control}
            name="programId"
            render={({ field }) => {
              const selected = programs.find((program) => program.id === field.value)
              return (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value ?? '')
                    setValue('semesterId', '', { shouldDirty: true, shouldValidate: true })
                  }}
                  disabled={!selectedDepartmentId || programOptions.length === 0}
                >
                  <SelectTrigger
                    id="courseProgram"
                    className="w-full"
                    onBlur={field.onBlur}
                    aria-invalid={Boolean(errors.programId)}
                    aria-describedby={errors.programId ? 'courseProgram-error' : undefined}
                    ref={field.ref}
                  >
                    <SelectValue>
                      {selected?.name ??
                        (selectedDepartmentId ? 'Select program' : 'Select department first')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {programOptions.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }}
          />
          <FieldError id="courseProgram-error" errors={[errors.programId]} />
        </Field>

        <Field data-invalid={Boolean(errors.semesterId)}>
          <FieldLabel htmlFor="courseSemester" required>
            Semester
          </FieldLabel>
          <Controller
            control={control}
            name="semesterId"
            render={({ field }) => {
              const selected = semesters.find((semester) => semester.id === field.value)
              return (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? '')}
                  disabled={!selectedProgramId}
                >
                  <SelectTrigger
                    id="courseSemester"
                    className="w-full"
                    onBlur={field.onBlur}
                    aria-invalid={Boolean(errors.semesterId)}
                    aria-describedby={errors.semesterId ? 'courseSemester-error' : undefined}
                    ref={field.ref}
                  >
                    <SelectValue>
                      {selected
                        ? `${selected.name} (${selected.academicYear})`
                        : selectedProgramId
                          ? 'Select semester'
                          : 'Select program first'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {semesterOptions.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name} ({semester.academicYear})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }}
          />
          <FieldError id="courseSemester-error" errors={[errors.semesterId]} />
        </Field>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor="courseDescription">Description</FieldLabel>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                id="courseDescription"
                placeholder="Short catalog description"
                value={field.value}
                onBlur={field.onBlur}
                onChange={field.onChange}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? 'courseDescription-error' : undefined}
                ref={field.ref}
              />
            )}
          />
          <FieldError id="courseDescription-error" errors={[errors.description]} />
        </Field>

        <Field orientation="horizontal">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                id="courseIsActive"
                checked={field.value}
                disabled={field.disabled}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldContent>
            <FieldLabel htmlFor="courseIsActive">Active course</FieldLabel>
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  )
}
