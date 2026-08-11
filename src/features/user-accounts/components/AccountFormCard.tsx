import { Controller, useWatch, type UseFormReturn } from 'react-hook-form'
import type {
  Batch,
  Section,
  Semester,
} from '@/features/academic-structure/types/academic-structure.types'
import type { UserRole } from '@/features/auth/types/auth.types'
import type { Department } from '@/features/departments/types/department.types'
import type { Program } from '@/features/programs/types/program.types'
import { roleLabels } from '@/shared/constants/user-roles'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { CreateUserAccountFormValues } from '../schemas/user-account.schemas'

const academicStatusLabels = {
  active: 'Active',
  frozen: 'Frozen',
  repeating: 'Repeating',
  dropped: 'Dropped',
  graduated: 'Graduated',
} as const

type AccountFormCardProps = {
  batches: Batch[]
  departments: Department[]
  fixedRole: UserRole
  formId: string
  form: UseFormReturn<CreateUserAccountFormValues>
  onSubmit: (values: CreateUserAccountFormValues) => void
  programs: Program[]
  sections: Section[]
  semesters: Semester[]
  sectionRoleOptions: UserRole[]
}

export function AccountFormCard({
  batches,
  departments,
  fixedRole,
  formId,
  form,
  onSubmit,
  programs,
  sections,
  semesters,
  sectionRoleOptions,
}: AccountFormCardProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = form
  const values = useWatch({ control })
  const selectedRole = values.role
  const selectedDepartmentId = values.departmentId
  const selectedProgramId = values.programId
  const selectedBatchId = values.batchId
  const selectedSemesterId = values.semesterId
  const hasFixedRole = sectionRoleOptions.length === 1
  const showStudentFields = selectedRole === 'student'
  const showStaffFields = selectedRole === 'teacher' || selectedRole === 'hod'
  const activeDepartments = departments.filter((department) => department.isActive)
  const programOptions = includeSelectedOption(
    programs
      .filter((program) => program.isActive && program.department.id === selectedDepartmentId)
      .map((program) => ({
        label: `${program.name} (${program.code})`,
        value: program.id,
      })),
    selectedProgramId,
    programs.map((program) => ({
      label: `${program.name} (${program.code})`,
      value: program.id,
    }))
  )
  const batchOptions = includeSelectedOption(
    batches
      .filter((batch) => batch.isActive && batch.program.id === selectedProgramId)
      .map((batch) => ({ label: batch.name, value: batch.id })),
    selectedBatchId,
    batches.map((batch) => ({ label: batch.name, value: batch.id }))
  )
  const filteredSemesters = semesters.filter((semester) => !semester.isClosed)
  const sectionOptions = includeSelectedOption(
    sections
      .filter(
        (section) =>
          section.isActive &&
          section.program.id === selectedProgramId &&
          section.batch.id === selectedBatchId &&
          section.semester.id === selectedSemesterId
      )
      .map((section) => ({
        label: section.name,
        value: section.id,
      })),
    values.sectionId,
    sections.map((section) => ({ label: section.name, value: section.id }))
  )
  const clearChildValue = (name: 'programId' | 'batchId' | 'sectionId') => {
    setValue(name, '', { shouldDirty: true })
  }

  return (
    <form id={formId} className="space-y-4 px-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.fullName)}>
          <FieldLabel htmlFor="fullName" required>
            Full name
          </FieldLabel>
          <Input
            id="fullName"
            placeholder="Ayesha Khan"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            {...register('fullName')}
          />
          <FieldError id="fullName-error" errors={[errors.fullName]} />
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="accountEmail" required>
            Email
          </FieldLabel>
          <Input
            id="accountEmail"
            type="email"
            autoComplete="email"
            placeholder="ayesha.khan@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'accountEmail-error' : undefined}
            {...register('email')}
          />
          <FieldError id="accountEmail-error" errors={[errors.email]} />
        </Field>

        <Field data-invalid={Boolean(errors.phoneNumber)}>
          <FieldLabel htmlFor="phoneNumber">Phone number</FieldLabel>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+92 300 1234567"
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
            {...register('phoneNumber')}
          />
          <FieldError id="phoneNumber-error" errors={[errors.phoneNumber]} />
        </Field>

        <Field data-invalid={Boolean(errors.role)}>
          <FieldLabel htmlFor="role" required>
            {hasFixedRole ? 'Role' : 'Account type'}
          </FieldLabel>
          {hasFixedRole ? (
            <>
              <input type="hidden" value={fixedRole} {...register('role')} />
              <Input id="role" value={roleLabels[fixedRole]} disabled aria-readonly="true" />
            </>
          ) : (
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? fixedRole)}
                >
                  <SelectTrigger
                    id="role"
                    className="w-full"
                    onBlur={field.onBlur}
                    aria-invalid={Boolean(errors.role)}
                    ref={field.ref}
                  >
                    <SelectValue>{roleLabels[field.value]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sectionRoleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
          <FieldError errors={[errors.role]} />
        </Field>

        {showStudentFields ? (
          <>
            <Field data-invalid={Boolean(errors.registrationNumber)}>
              <FieldLabel htmlFor="registrationNumber" required>
                Registration no.
              </FieldLabel>
              <Input
                id="registrationNumber"
                placeholder="REG-001"
                aria-invalid={Boolean(errors.registrationNumber)}
                aria-describedby={
                  errors.registrationNumber ? 'registrationNumber-error' : undefined
                }
                {...register('registrationNumber')}
              />
              <FieldError id="registrationNumber-error" errors={[errors.registrationNumber]} />
            </Field>

            <RelationshipSelect
              control={control}
              error={errors.departmentId}
              id="studentDepartment"
              label="Department"
              name="departmentId"
              options={activeDepartments.map((department) => ({
                label: `${department.name} (${department.code})`,
                value: department.id,
              }))}
              onValueChange={() => {
                clearChildValue('programId')
                clearChildValue('batchId')
                clearChildValue('sectionId')
              }}
              placeholder="Select department"
            />
            <RelationshipSelect
              control={control}
              disabledReason={
                !selectedDepartmentId
                  ? 'Select a department first.'
                  : programOptions.length === 0
                    ? 'No active programs are available for this department.'
                    : undefined
              }
              error={errors.programId}
              id="studentProgram"
              label="Program"
              name="programId"
              options={programOptions}
              onValueChange={() => {
                clearChildValue('batchId')
                clearChildValue('sectionId')
              }}
              placeholder="Select program"
            />
            <RelationshipSelect
              control={control}
              disabledReason={
                !selectedProgramId
                  ? 'Select a program first.'
                  : batchOptions.length === 0
                    ? 'No active batches are available for this program.'
                    : undefined
              }
              error={errors.batchId}
              id="studentBatch"
              label="Batch"
              name="batchId"
              options={batchOptions}
              onValueChange={() => {
                clearChildValue('sectionId')
              }}
              placeholder="Select batch"
            />
            <RelationshipSelect
              control={control}
              error={errors.semesterId}
              id="studentSemester"
              label="Semester"
              name="semesterId"
              options={filteredSemesters.map((semester) => ({
                label: `${semester.name} (${semester.academicYear})`,
                value: semester.id,
              }))}
              onValueChange={() => {
                clearChildValue('sectionId')
              }}
              placeholder="Select semester"
            />
            <RelationshipSelect
              control={control}
              disabledReason={sectionDisabledReason({
                hasBatch: Boolean(selectedBatchId),
                hasProgram: Boolean(selectedProgramId),
                hasSemester: Boolean(selectedSemesterId),
                optionCount: sectionOptions.length,
              })}
              error={errors.sectionId}
              id="studentSection"
              label="Section"
              name="sectionId"
              options={sectionOptions}
              placeholder="Select section"
            />
            <RelationshipSelect
              control={control}
              error={errors.academicStatus}
              id="academicStatus"
              label="Academic status"
              name="academicStatus"
              options={Object.entries(academicStatusLabels).map(([value, label]) => ({
                label,
                value,
              }))}
              placeholder="Select academic status"
            />
          </>
        ) : null}

        {showStaffFields ? (
          <>
            <Field data-invalid={Boolean(errors.employeeId)}>
              <FieldLabel htmlFor="employeeId" required>
                Employee ID
              </FieldLabel>
              <Input
                id="employeeId"
                placeholder="EMP-001"
                aria-invalid={Boolean(errors.employeeId)}
                aria-describedby={errors.employeeId ? 'employeeId-error' : undefined}
                {...register('employeeId')}
              />
              <FieldError id="employeeId-error" errors={[errors.employeeId]} />
            </Field>

            <RelationshipSelect
              control={control}
              error={errors.departmentId}
              id="staffDepartment"
              label="Department"
              name="departmentId"
              options={activeDepartments.map((department) => ({
                label: `${department.name} (${department.code})`,
                value: department.id,
              }))}
              placeholder="Select department"
            />

            {selectedRole === 'teacher' ? (
              <Field data-invalid={Boolean(errors.designation)}>
                <FieldLabel htmlFor="designation" required>
                  Designation
                </FieldLabel>
                <Input
                  id="designation"
                  placeholder="Lecturer"
                  aria-invalid={Boolean(errors.designation)}
                  aria-describedby={errors.designation ? 'designation-error' : undefined}
                  {...register('designation')}
                />
                <FieldError id="designation-error" errors={[errors.designation]} />
              </Field>
            ) : null}
          </>
        ) : null}

        <Field orientation="horizontal">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Checkbox
                id="isActive"
                checked={field.value}
                disabled={field.disabled}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldContent>
            <FieldLabel htmlFor="isActive">Active account</FieldLabel>
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  )
}

type RelationshipSelectProps = {
  control: UseFormReturn<CreateUserAccountFormValues>['control']
  disabledReason?: string
  error?: { message?: string }
  id: string
  label: string
  name: keyof CreateUserAccountFormValues
  onValueChange?: (value: string) => void
  options: Array<{ label: string; value: string }>
  placeholder: string
}

function RelationshipSelect({
  control,
  disabledReason,
  error,
  id,
  label,
  name,
  onValueChange,
  options,
  placeholder,
}: RelationshipSelectProps) {
  const isDisabled = Boolean(disabledReason)

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id} required>
        {label}
      </FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedOption = options.find((option) => option.value === field.value)

          return (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span
                    className="block"
                    tabIndex={isDisabled ? 0 : -1}
                    aria-label={isDisabled ? `${label} unavailable` : undefined}
                    aria-describedby={isDisabled ? `${id}-disabled-reason` : undefined}
                  />
                }
              >
                <Select
                  value={typeof field.value === 'string' ? field.value : ''}
                  disabled={isDisabled}
                  onValueChange={(value) => {
                    const nextValue = value ?? ''
                    field.onChange(nextValue)
                    onValueChange?.(nextValue)
                  }}
                >
                  <SelectTrigger
                    id={id}
                    className="w-full"
                    onBlur={field.onBlur}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                      error ? `${id}-error` : isDisabled ? `${id}-disabled-reason` : undefined
                    }
                    ref={field.ref}
                  >
                    <SelectValue>{selectedOption?.label ?? placeholder}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              {isDisabled ? (
                <TooltipContent id={`${id}-disabled-reason`} side="top">
                  {disabledReason}
                </TooltipContent>
              ) : null}
            </Tooltip>
          )
        }}
      />
      <FieldError id={`${id}-error`} errors={[error]} />
    </Field>
  )
}

function includeSelectedOption(
  options: Array<{ label: string; value: string }>,
  selectedValue: string | undefined,
  allOptions: Array<{ label: string; value: string }>
) {
  if (!selectedValue || options.some((option) => option.value === selectedValue)) {
    return options
  }

  const selectedOption = allOptions.find((option) => option.value === selectedValue)

  return selectedOption ? [selectedOption, ...options] : options
}

function sectionDisabledReason({
  hasBatch,
  hasProgram,
  hasSemester,
  optionCount,
}: {
  hasBatch: boolean
  hasProgram: boolean
  hasSemester: boolean
  optionCount: number
}) {
  if (!hasProgram) {
    return 'Select a program first.'
  }

  if (!hasBatch) {
    return 'Select a batch first.'
  }

  if (!hasSemester) {
    return 'Select a semester first.'
  }

  if (optionCount === 0) {
    return 'No active sections match this program, batch, and semester.'
  }

  return undefined
}
