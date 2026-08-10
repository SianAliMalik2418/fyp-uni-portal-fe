import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toast-manager'
import { createUserAccount } from '../api/user-accounts-api'
import { userAccountKeys, userAccountsQueryOptions } from '../api/user-accounts-queries'
import { AccountFormCard } from '../components/AccountFormCard'
import { AccountsCard } from '../components/AccountsCard'
import {
  createUserAccountSchema,
  type CreateUserAccountFormValues,
} from '../schemas/user-account.schemas'
import {
  accountMatchesSection,
  accountSectionKind,
  cleanOptional,
  defaultAccountValues,
  defaultRoleForSection,
  identifierLabelForSection,
  roleOptionsForSection,
} from '../utils/account-sections'

type UserAccountsPageProps = {
  sectionId: string
  title: string
}

export function UserAccountsPage({ sectionId, title }: UserAccountsPageProps) {
  const queryClient = useQueryClient()
  const accountsQuery = useQuery(userAccountsQueryOptions)
  const sectionRoleOptions = roleOptionsForSection(sectionId)
  const isStudentSection = sectionId === 'students'
  const isTeacherSection = sectionId === 'teachers'
  const sectionKind = accountSectionKind(sectionId)
  const form = useForm<CreateUserAccountFormValues>({
    resolver: zodResolver(createUserAccountSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: defaultAccountValues(sectionId),
  })
  const { reset } = form

  useEffect(() => {
    reset(defaultAccountValues(sectionId))
  }, [sectionId, reset])

  const createAccountMutation = useMutation({
    mutationFn: createUserAccount,
    onSuccess: async (response) => {
      toast.add({
        title: 'Temporary password issued',
        description: `${response.user.email}: ${response.temporaryPassword}`,
        type: 'success',
      })
      reset(defaultAccountValues(sectionId))
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

  function submitAccount(values: CreateUserAccountFormValues) {
    const role = sectionRoleOptions.includes(values.role)
      ? values.role
      : defaultRoleForSection(sectionId)

    createAccountMutation.mutate({
      ...values,
      role,
      email: values.email.trim().toLowerCase(),
      fullName: values.fullName.trim(),
      registrationNumber: isTeacherSection ? undefined : cleanOptional(values.registrationNumber),
      employeeId: isStudentSection ? undefined : cleanOptional(values.employeeId),
    })
  }

  const visibleAccounts =
    accountsQuery.data?.users.filter((account) => accountMatchesSection(account, sectionId)) ?? []
  const identifierColumnLabel = identifierLabelForSection(sectionId)
  const fixedRole = sectionRoleOptions[0] ?? defaultRoleForSection(sectionId)

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create portal accounts with temporary passwords and fixed roles.
          </p>
        </div>
        <Badge variant="outline">Admin only</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <AccountFormCard
          fixedRole={fixedRole}
          form={form}
          isCreating={createAccountMutation.isPending}
          onSubmit={submitAccount}
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
