import { Controller, type UseFormReturn } from 'react-hook-form'
import type { UserRole } from '@/features/auth/types/auth.types'
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
import type { CreateUserAccountFormValues } from '../schemas/user-account.schemas'
import type { AccountSectionKind } from '../utils/account-sections'

type AccountFormCardProps = {
  fixedRole: UserRole
  formId: string
  form: UseFormReturn<CreateUserAccountFormValues>
  onSubmit: (values: CreateUserAccountFormValues) => void
  sectionKind: AccountSectionKind
  sectionRoleOptions: UserRole[]
}

export function AccountFormCard({
  fixedRole,
  formId,
  form,
  onSubmit,
  sectionKind,
  sectionRoleOptions,
}: AccountFormCardProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = form
  const hasFixedRole = sectionRoleOptions.length === 1
  const showRegistrationNumber = sectionKind === 'students'
  const showEmployeeId = sectionKind === 'teachers'

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

        <Field data-invalid={Boolean(errors.role)}>
          {hasFixedRole ? (
            <FieldLabel htmlFor="role">Role</FieldLabel>
          ) : (
            <FieldLabel htmlFor="role" required>
              Account type
            </FieldLabel>
          )}
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
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value)
                    }
                  }}
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

        {showRegistrationNumber ? (
          <Field data-invalid={Boolean(errors.registrationNumber)}>
            <FieldLabel htmlFor="registrationNumber" required>
              Registration no.
            </FieldLabel>
            <Input
              id="registrationNumber"
              placeholder="REG-001"
              aria-invalid={Boolean(errors.registrationNumber)}
              aria-describedby={errors.registrationNumber ? 'registrationNumber-error' : undefined}
              {...register('registrationNumber')}
            />
            <FieldError id="registrationNumber-error" errors={[errors.registrationNumber]} />
          </Field>
        ) : null}

        {showEmployeeId ? (
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
