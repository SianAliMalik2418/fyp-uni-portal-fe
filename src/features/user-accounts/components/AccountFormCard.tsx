import { UserAdd01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { UserRole } from '@/features/auth/types/auth.types'
import { roleLabels } from '@/shared/constants/user-roles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import type { CreateUserAccountFormValues } from '../schemas/user-account.schemas'
import type { AccountSectionKind } from '../utils/account-sections'

type AccountFormCardProps = {
  fixedRole: UserRole
  form: UseFormReturn<CreateUserAccountFormValues>
  isCreating: boolean
  onSubmit: (values: CreateUserAccountFormValues) => void
  sectionKind: AccountSectionKind
  sectionRoleOptions: UserRole[]
}

export function AccountFormCard({
  fixedRole,
  form,
  isCreating,
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
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          New users must change the temporary password on first login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                <NativeSelect
                  id="role"
                  className="w-full"
                  aria-invalid={Boolean(errors.role)}
                  {...register('role')}
                >
                  {sectionRoleOptions.map((role) => (
                    <NativeSelectOption key={role} value={role}>
                      {roleLabels[role]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
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
                  aria-describedby={
                    errors.registrationNumber ? 'registrationNumber-error' : undefined
                  }
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

          <Button type="submit" disabled={isCreating}>
            <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} data-icon="inline-start" />
            {isCreating ? 'Creating...' : 'Create account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
