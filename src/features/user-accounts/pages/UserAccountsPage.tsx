import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { SearchIcon, UserAdd01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  batchesQueryOptions,
  sectionsQueryOptions,
  semestersQueryOptions,
} from '@/features/academic-structure/api/academic-structure-queries'
import { departmentsQueryOptions } from '@/features/departments/api/departments-queries'
import { programsQueryOptions } from '@/features/programs/api/programs-queries'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  createUserAccount,
  deleteUserAccount,
  resetUserAccountPassword,
  updateUserAccount,
} from '../api/user-accounts-api'
import { userAccountKeys, userAccountsQueryOptions } from '../api/user-accounts-queries'
import { AccountFormCard } from '../components/AccountFormCard'
import { AccountsCard } from '../components/AccountsCard'
import { DeleteUserAccountDialog } from '../components/DeleteUserAccountDialog'
import { ResetPasswordDialog } from '../components/ResetPasswordDialog'
import { UserAccountDetailsSheet } from '../components/UserAccountDetailsSheet'
import {
  createUserAccountSchema,
  type CreateUserAccountFormValues,
} from '../schemas/user-account.schemas'
import type { ProvisionedUserAccount } from '../types/user-account.types'
import {
  accountMatchesSection,
  accountToFormValues,
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
  const departmentsQuery = useQuery(departmentsQueryOptions)
  const programsQuery = useQuery(programsQueryOptions)
  const batchesQuery = useQuery(batchesQueryOptions)
  const semestersQuery = useQuery(semestersQueryOptions)
  const sectionsQuery = useQuery(sectionsQueryOptions)
  const sectionRoleOptions = roleOptionsForSection(sectionId)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<ProvisionedUserAccount | null>(null)
  const [viewingAccount, setViewingAccount] = useState<ProvisionedUserAccount | null>(null)
  const [accountToDelete, setAccountToDelete] = useState<ProvisionedUserAccount | null>(null)
  const [accountToReset, setAccountToReset] = useState<ProvisionedUserAccount | null>(null)
  const form = useForm<CreateUserAccountFormValues>({
    resolver: zodResolver(createUserAccountSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: defaultAccountValues(sectionId),
  })
  const { reset } = form
  const fixedRole = sectionRoleOptions[0] ?? defaultRoleForSection(sectionId)

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
      closeSheet()
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

  const updateAccountMutation = useMutation({
    mutationFn: updateUserAccount,
    onSuccess: async () => {
      toast.add({ title: 'Account updated', type: 'success' })
      closeSheet()
      await queryClient.invalidateQueries({ queryKey: userAccountKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Account update failed',
        description: getApiErrorMessage(error, 'Unable to update user account'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: async () => {
      toast.add({ title: 'Account deleted', type: 'success' })
      setAccountToDelete(null)
      await queryClient.invalidateQueries({ queryKey: userAccountKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Delete failed',
        description: getApiErrorMessage(error, 'Unable to delete user account'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: resetUserAccountPassword,
    onSuccess: async (response) => {
      toast.add({
        title: 'Temporary password issued',
        description: `${response.user.email}: ${response.temporaryPassword}`,
        type: 'success',
      })
      setAccountToReset(null)
      await queryClient.invalidateQueries({ queryKey: userAccountKeys.all })
    },
    onError: (error) => {
      toast.add({
        title: 'Password reset failed',
        description: getApiErrorMessage(error, 'Unable to reset password'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  const visibleAccounts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const sectionAccounts =
      accountsQuery.data?.users.filter((account) => accountMatchesSection(account, sectionId)) ?? []

    if (!normalizedSearch) {
      return sectionAccounts
    }

    return sectionAccounts.filter((account) =>
      [
        account.fullName,
        account.email,
        account.registrationNumber,
        account.employeeId,
        account.department?.name,
        account.department?.code,
        account.program?.name,
        account.program?.code,
        account.batch?.name,
        account.semester?.name,
        account.section?.name,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedSearch))
    )
  }, [accountsQuery.data?.users, searchTerm, sectionId])

  function submitAccount(values: CreateUserAccountFormValues) {
    const role = sectionRoleOptions.includes(values.role) ? values.role : fixedRole
    const payload = {
      ...values,
      role,
      email: values.email.trim().toLowerCase(),
      fullName: values.fullName.trim(),
      phoneNumber: cleanOptional(values.phoneNumber),
      registrationNumber: role === 'student' ? cleanOptional(values.registrationNumber) : undefined,
      employeeId:
        role === 'teacher' || role === 'hod' ? cleanOptional(values.employeeId) : undefined,
      departmentId: role === 'admin' ? undefined : cleanOptional(values.departmentId),
      programId: role === 'student' ? cleanOptional(values.programId) : undefined,
      batchId: role === 'student' ? cleanOptional(values.batchId) : undefined,
      semesterId: role === 'student' ? cleanOptional(values.semesterId) : undefined,
      sectionId: role === 'student' ? cleanOptional(values.sectionId) : undefined,
      academicStatus: role === 'student' ? values.academicStatus : undefined,
      designation: role === 'teacher' ? cleanOptional(values.designation) : undefined,
    }

    if (editingAccount) {
      updateAccountMutation.mutate({ userId: editingAccount.id, payload })
      return
    }

    createAccountMutation.mutate(payload)
  }

  function openCreateSheet() {
    reset(defaultAccountValues(sectionId))
    setEditingAccount(null)
    setIsSheetOpen(true)
  }

  function openEditSheet(account: ProvisionedUserAccount) {
    reset(accountToFormValues(account))
    setEditingAccount(account)
    setIsSheetOpen(true)
  }

  function closeSheet() {
    setIsSheetOpen(false)
    setEditingAccount(null)
    reset(defaultAccountValues(sectionId))
  }

  function confirmDelete() {
    if (accountToDelete) {
      deleteAccountMutation.mutate(accountToDelete.id)
    }
  }

  function confirmPasswordReset() {
    if (accountToReset) {
      resetPasswordMutation.mutate(accountToReset.id)
    }
  }

  const identifierColumnLabel = identifierLabelForSection(sectionId)
  const isSubmitting = createAccountMutation.isPending || updateAccountMutation.isPending
  const isReferencePending =
    departmentsQuery.isPending ||
    programsQuery.isPending ||
    batchesQuery.isPending ||
    semestersQuery.isPending ||
    sectionsQuery.isPending

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl leading-tight font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage role profiles, academic assignment, account status, and temporary passwords.
          </p>
        </div>
        <Button type="button" onClick={openCreateSheet}>
          <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} data-icon="inline-start" />
          Create account
        </Button>
      </div>

      <div className="relative max-w-md">
        <HugeiconsIcon
          icon={SearchIcon}
          strokeWidth={2}
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
        />
        <Input
          className="pl-8"
          placeholder={`Search ${title.toLowerCase()}`}
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
      </div>

      <AccountsCard
        accounts={visibleAccounts}
        error={accountsQuery.error}
        identifierColumnLabel={identifierColumnLabel}
        isError={accountsQuery.isError}
        isPending={accountsQuery.isPending}
        onDelete={setAccountToDelete}
        onEdit={openEditSheet}
        onResetPassword={setAccountToReset}
        onView={setViewingAccount}
      />

      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsSheetOpen(true)
            return
          }

          closeSheet()
        }}
      >
        <SheetContent className="flex w-full flex-col gap-0 space-y-0 sm:max-w-xl" side="right">
          <SheetHeader className="border-b pr-14">
            <SheetTitle>{editingAccount ? 'Edit account' : 'Create account'}</SheetTitle>
            <SheetDescription>
              New and reset accounts must change temporary passwords on first login.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-230px)] flex-1 grow py-4">
            <AccountFormCard
              batches={batchesQuery.data?.batches ?? []}
              departments={departmentsQuery.data?.departments ?? []}
              fixedRole={fixedRole}
              formId={accountFormId}
              form={form}
              onSubmit={submitAccount}
              programs={programsQuery.data?.programs ?? []}
              sections={sectionsQuery.data?.sections ?? []}
              semesters={semestersQuery.data?.semesters ?? []}
              sectionRoleOptions={sectionRoleOptions}
            />
          </ScrollArea>
          <SheetFooter className="border-t">
            <Button
              type="submit"
              form={accountFormId}
              disabled={isSubmitting || isReferencePending}
            >
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} data-icon="inline-start" />
              )}
              {editingAccount ? 'Save account' : 'Create account'}
            </Button>
            <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <UserAccountDetailsSheet
        account={viewingAccount}
        onOpenChange={() => setViewingAccount(null)}
      />
      <DeleteUserAccountDialog
        account={accountToDelete}
        isDeleting={deleteAccountMutation.isPending}
        onConfirm={confirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setAccountToDelete(null)
          }
        }}
      />
      <ResetPasswordDialog
        account={accountToReset}
        isResetting={resetPasswordMutation.isPending}
        onConfirm={confirmPasswordReset}
        onOpenChange={(open) => {
          if (!open) {
            setAccountToReset(null)
          }
        }}
      />
    </div>
  )
}
