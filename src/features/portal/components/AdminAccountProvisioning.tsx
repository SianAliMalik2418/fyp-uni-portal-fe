import { useEffect, type ComponentProps, type FormEvent, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserAdd01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useForm, type FieldErrors, type UseFormRegisterReturn } from 'react-hook-form'
import type { UserRole } from '@/features/auth/types/auth.types'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/components/ui/toast-manager'
import { createUserAccount } from '../api/user-accounts-api'
import { userAccountKeys, userAccountsQueryOptions } from '../api/user-accounts-queries'
import { roleLabels } from '../constants/portal-navigation'
import {
  createUserAccountSchema,
  type CreateUserAccountFormValues,
} from '../schemas/user-account.schemas'
import type { NavItem } from '../types/portal.types'
import type { ProvisionedUserAccount } from '../types/user-account.types'

const roleOptions: UserRole[] = ['student', 'teacher', 'hod', 'admin']

function roleOptionsForSection(sectionId: string): UserRole[] {
  if (sectionId === 'students') {
    return ['student']
  }

  if (sectionId === 'teachers') {
    return ['teacher', 'hod']
  }

  return roleOptions
}

function defaultRoleForSection(sectionId: string): UserRole {
  if (sectionId === 'teachers') {
    return 'teacher'
  }

  return 'student'
}

function accountMatchesSection(account: ProvisionedUserAccount, sectionId: string) {
  if (sectionId === 'students') {
    return account.role === 'student'
  }

  if (sectionId === 'teachers') {
    return account.role === 'teacher' || account.role === 'hod'
  }

  return true
}

function normalizeOptional(value?: string) {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

function identifierLabelForSection(sectionId: string) {
  if (sectionId === 'students') {
    return 'Registration no.'
  }

  if (sectionId === 'teachers') {
    return 'Employee ID'
  }

  return 'Identifier'
}

function identifierForAccount(account: ProvisionedUserAccount) {
  if (account.role === 'student') {
    return account.registrationNumber ?? '-'
  }

  if (account.role === 'teacher' || account.role === 'hod') {
    return account.employeeId ?? '-'
  }

  return account.registrationNumber ?? account.employeeId ?? '-'
}

type AccountSectionKind = 'students' | 'teachers' | 'all'

function accountSectionKind(sectionId: string): AccountSectionKind {
  if (sectionId === 'students' || sectionId === 'teachers') {
    return sectionId
  }

  return 'all'
}

function RequiredLabel({ children, ...props }: ComponentProps<typeof Label>) {
  return (
    <Label {...props}>
      {children}
      <span className="text-destructive -ml-1" aria-hidden="true">
        *
      </span>
    </Label>
  )
}

type AccountFormCardProps = {
  createPending: boolean
  employeeIdField: UseFormRegisterReturn<'employeeId'>
  errors: FieldErrors<CreateUserAccountFormValues>
  fixedRole: UserRole
  fullNameField: UseFormRegisterReturn<'fullName'>
  emailField: UseFormRegisterReturn<'email'>
  isActiveField: UseFormRegisterReturn<'isActive'>
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  registrationNumberField: UseFormRegisterReturn<'registrationNumber'>
  roleField: UseFormRegisterReturn<'role'>
  sectionKind: AccountSectionKind
  sectionRoleOptions: UserRole[]
}

function AccountFormCard({
  createPending,
  employeeIdField,
  errors,
  fixedRole,
  fullNameField,
  emailField,
  isActiveField,
  onSubmit,
  registrationNumberField,
  roleField,
  sectionKind,
  sectionRoleOptions,
}: AccountFormCardProps) {
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
        <form className="grid gap-4" noValidate onSubmit={onSubmit}>
          <div className="grid gap-2">
            <RequiredLabel htmlFor="fullName">Full name</RequiredLabel>
            <Input
              id="fullName"
              placeholder="Ayesha Khan"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              {...fullNameField}
            />
            {errors.fullName ? (
              <p id="fullName-error" className="text-destructive text-xs">
                {errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <RequiredLabel htmlFor="accountEmail">Email</RequiredLabel>
            <Input
              id="accountEmail"
              type="email"
              autoComplete="email"
              placeholder="ayesha.khan@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'accountEmail-error' : undefined}
              {...emailField}
            />
            {errors.email ? (
              <p id="accountEmail-error" className="text-destructive text-xs">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            {hasFixedRole ? (
              <Label htmlFor="role">Role</Label>
            ) : (
              <RequiredLabel htmlFor="role">Account type</RequiredLabel>
            )}
            {hasFixedRole ? (
              <>
                <input type="hidden" name="role" value={fixedRole} />
                <Input id="role" value={roleLabels[fixedRole]} disabled aria-readonly="true" />
              </>
            ) : (
              <NativeSelect id="role" className="w-full" {...roleField}>
                {sectionRoleOptions.map((role) => (
                  <NativeSelectOption key={role} value={role}>
                    {roleLabels[role]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            )}
          </div>

          {showRegistrationNumber ? (
            <div className="grid gap-2">
              <RequiredLabel htmlFor="registrationNumber">Registration no.</RequiredLabel>
              <Input
                id="registrationNumber"
                placeholder="REG-001"
                aria-invalid={Boolean(errors.registrationNumber)}
                aria-describedby={
                  errors.registrationNumber ? 'registrationNumber-error' : undefined
                }
                {...registrationNumberField}
              />
              {errors.registrationNumber ? (
                <p id="registrationNumber-error" className="text-destructive text-xs">
                  {errors.registrationNumber.message}
                </p>
              ) : null}
            </div>
          ) : null}

          {showEmployeeId ? (
            <div className="grid gap-2">
              <RequiredLabel htmlFor="employeeId">Employee ID</RequiredLabel>
              <Input
                id="employeeId"
                placeholder="EMP-001"
                aria-invalid={Boolean(errors.employeeId)}
                aria-describedby={errors.employeeId ? 'employeeId-error' : undefined}
                {...employeeIdField}
              />
              {errors.employeeId ? (
                <p id="employeeId-error" className="text-destructive text-xs">
                  {errors.employeeId.message}
                </p>
              ) : null}
            </div>
          ) : null}

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-primary size-4" {...isActiveField} />
            Active account
          </label>

          <Button type="submit" disabled={createPending}>
            <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} data-icon="inline-start" />
            {createPending ? 'Creating...' : 'Create account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

type AccountsCardProps = {
  accounts: ProvisionedUserAccount[]
  error: unknown
  identifierColumnLabel: string
  isError: boolean
  isPending: boolean
}

function AccountsCard({
  accounts,
  error,
  identifierColumnLabel,
  isError,
  isPending,
}: AccountsCardProps) {
  let content: ReactNode

  if (isPending) {
    content = <p className="text-muted-foreground text-sm">Loading accounts...</p>
  } else if (isError) {
    content = (
      <Alert variant="destructive">
        <AlertTitle>Accounts unavailable</AlertTitle>
        <AlertDescription>{getApiErrorMessage(error, 'Unable to load accounts')}</AlertDescription>
      </Alert>
    )
  } else if (accounts.length) {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>{identifierColumnLabel}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <span className="text-foreground block font-medium">{account.fullName}</span>
                <span className="text-muted-foreground block">{account.email}</span>
              </TableCell>
              <TableCell>{roleLabels[account.role]}</TableCell>
              <TableCell>
                <Badge variant={account.isActive ? 'outline' : 'destructive'}>
                  {account.accountStatus}
                </Badge>
              </TableCell>
              <TableCell>{identifierForAccount(account)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  } else {
    content = (
      <div className="bg-muted/30 grid min-h-40 place-items-center rounded-md border border-dashed px-4 text-center">
        <p className="text-muted-foreground text-sm">No accounts have been created yet.</p>
      </div>
    )
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Provisioned accounts</CardTitle>
        <CardDescription>Existing admin-created and seeded accounts for this area.</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}

export function AdminAccountProvisioning({ item }: { item: NavItem }) {
  const queryClient = useQueryClient()
  const accountsQuery = useQuery(userAccountsQueryOptions)
  const sectionRoleOptions = roleOptionsForSection(item.id)
  const isStudentSection = item.id === 'students'
  const isTeacherSection = item.id === 'teachers'
  const sectionKind = accountSectionKind(item.id)
  const {
    clearErrors,
    formState: { errors },
    register,
    reset,
    setError,
  } = useForm<CreateUserAccountFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      role: defaultRoleForSection(item.id),
      registrationNumber: '',
      employeeId: '',
      isActive: true,
    },
  })

  useEffect(() => {
    reset({
      fullName: '',
      email: '',
      role: defaultRoleForSection(item.id),
      registrationNumber: '',
      employeeId: '',
      isActive: true,
    })
  }, [item.id, reset])

  const createAccountMutation = useMutation({
    mutationFn: createUserAccount,
    onSuccess: async (response) => {
      toast.add({
        title: 'Temporary password issued',
        description: `${response.user.email}: ${response.temporaryPassword}`,
        type: 'success',
      })
      reset({
        fullName: '',
        email: '',
        role: defaultRoleForSection(item.id),
        registrationNumber: '',
        employeeId: '',
        isActive: true,
      })
      await queryClient.invalidateQueries({ queryKey: userAccountKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Account creation failed',
        description: getApiErrorMessage(error, 'Unable to create user account'),
        type: 'error',
        priority: 'high',
      })
    },
  })
  const visibleAccounts =
    accountsQuery.data?.users.filter((account) => accountMatchesSection(account, item.id)) ?? []
  const identifierColumnLabel = identifierLabelForSection(item.id)
  const fixedRole = sectionRoleOptions[0] ?? defaultRoleForSection(item.id)
  const fullNameField = register('fullName', {
    onChange: () => clearErrors('fullName'),
  })
  const emailField = register('email', {
    onChange: () => clearErrors('email'),
  })
  const roleField = register('role', {
    onChange: () => clearErrors(['role', 'employeeId', 'registrationNumber']),
  })
  const registrationNumberField = register('registrationNumber', {
    onChange: () => clearErrors('registrationNumber'),
  })
  const employeeIdField = register('employeeId', {
    onChange: () => clearErrors('employeeId'),
  })
  const isActiveField = register('isActive')

  function submitAccount(values: CreateUserAccountFormValues) {
    const role = sectionRoleOptions.includes(values.role)
      ? values.role
      : defaultRoleForSection(item.id)

    createAccountMutation.mutate({
      ...values,
      role,
      email: values.email.trim().toLowerCase(),
      fullName: values.fullName.trim(),
      registrationNumber: isTeacherSection
        ? undefined
        : normalizeOptional(values.registrationNumber),
      employeeId: isStudentSection ? undefined : normalizeOptional(values.employeeId),
    })
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      fullName: String(formData.get('fullName') ?? ''),
      email: String(formData.get('email') ?? ''),
      role: String(formData.get('role') ?? fixedRole),
      registrationNumber: String(formData.get('registrationNumber') ?? ''),
      employeeId: String(formData.get('employeeId') ?? ''),
      isActive: formData.get('isActive') === 'on',
    }
    const result = createUserAccountSchema.safeParse(payload)

    if (!result.success) {
      clearErrors()

      for (const issue of result.error.issues) {
        const fieldName = issue.path[0]

        if (
          fieldName === 'fullName' ||
          fieldName === 'email' ||
          fieldName === 'role' ||
          fieldName === 'registrationNumber' ||
          fieldName === 'employeeId' ||
          fieldName === 'isActive'
        ) {
          setError(fieldName, { message: issue.message })
        }
      }

      return
    }

    clearErrors()
    submitAccount(result.data)
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{item.label}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create portal accounts with temporary passwords and fixed roles.
          </p>
        </div>
        <Badge variant="outline">Admin only</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <AccountFormCard
          createPending={createAccountMutation.isPending}
          employeeIdField={employeeIdField}
          errors={errors}
          fixedRole={fixedRole}
          fullNameField={fullNameField}
          emailField={emailField}
          isActiveField={isActiveField}
          onSubmit={submitForm}
          registrationNumberField={registrationNumberField}
          roleField={roleField}
          sectionKind={sectionKind}
          sectionRoleOptions={sectionRoleOptions}
        />
        <AccountsCard
          accounts={visibleAccounts}
          error={accountsQuery.error}
          identifierColumnLabel={identifierColumnLabel}
          isError={accountsQuery.isError}
          isPending={accountsQuery.isPending}
        />
      </div>
    </div>
  )
}
