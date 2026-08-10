import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { UserAdd01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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

const accountFormId = 'account-sheet-form'

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
  const [isSheetOpen, setIsSheetOpen] = useState(false)
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
      setIsSheetOpen(false)
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

  function openCreateSheet() {
    reset(defaultAccountValues(sectionId))
    setIsSheetOpen(true)
  }

  function closeSheet() {
    setIsSheetOpen(false)
    reset(defaultAccountValues(sectionId))
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
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Admin only</Badge>
          <Button type="button" onClick={openCreateSheet}>
            <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} data-icon="inline-start" />
            Create account
          </Button>
        </div>
      </div>

      <AccountsCard
        accounts={visibleAccounts}
        error={accountsQuery.error}
        identifierColumnLabel={identifierColumnLabel}
        isError={accountsQuery.isError}
        isPending={accountsQuery.isPending}
      />

      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeSheet()
            return
          }

          setIsSheetOpen(true)
        }}
      >
        <SheetContent className="flex w-full flex-col gap-0 space-y-0 sm:max-w-xl" side="right">
          <SheetHeader className="border-b pr-14">
            <SheetTitle>Create account</SheetTitle>
            <SheetDescription>
              New users must change the temporary password on first login.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow py-4">
            <AccountFormCard
              fixedRole={fixedRole}
              formId={accountFormId}
              form={form}
              onSubmit={submitAccount}
              sectionKind={sectionKind}
              sectionRoleOptions={sectionRoleOptions}
            />
          </ScrollArea>
          <SheetFooter className="border-t">
            <Button type="submit" form={accountFormId} disabled={createAccountMutation.isPending}>
              {createAccountMutation.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} data-icon="inline-start" />
              )}
              Create account
            </Button>
            <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
