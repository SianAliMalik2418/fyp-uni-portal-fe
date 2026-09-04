import { useDeferredValue, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { UserAdd01Icon } from '@hugeicons/core-free-icons'
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
import { userAccountKeys, userAccountSearchQueryOptions } from '../api/user-accounts-queries'
import { AccountDirectoryFilters } from '../components/AccountDirectoryFilters'
import { AccountFormCard } from '../components/AccountFormCard'
import { AccountsCard } from '../components/AccountsCard'
import { DeleteUserAccountDialog } from '../components/DeleteUserAccountDialog'
import { ResetPasswordDialog } from '../components/ResetPasswordDialog'
import { UserAccountDetailsSheet } from '../components/UserAccountDetailsSheet'
import { StudentImportSheet } from '../components/StudentImportSheet'
import {
  createUserAccountSchema,
  type CreateUserAccountFormValues,
} from '../schemas/user-account.schemas'
import type { ProvisionedUserAccount, UserAccountListQuery } from '../types/user-account.types'
import {
  accountMatchesSection,
  accountSectionKind,
  accountToFormValues,
  cleanOptional,
  defaultAccountValues,
  defaultRoleForSection,
  identifierLabelForSection,
  roleOptionsForSection,
} from '../utils/account-sections'

const accountFormId = 'account-sheet-form'
const accountPageSize = 20

function initialAccountFilters(sectionId: string): Partial<UserAccountListQuery> {
  if (sectionId === 'students') return { role: 'student' }
  if (sectionId === 'teachers') return { role: 'teacher' }
  return {}
}

type UserAccountsPageProps = {
  sectionId: string
  title: string
}

export function UserAccountsPage({ sectionId, title }: UserAccountsPageProps) {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<Partial<UserAccountListQuery>>(() =>
    initialAccountFilters(sectionId)
  )
  const [page, setPage] = useState(1)
  const deferredSearch = useDeferredValue(filters.search)
  const accountQuery: UserAccountListQuery = {
    ...filters,
    ...(deferredSearch?.trim() ? { search: deferredSearch.trim() } : { search: undefined }),
    page,
    limit: accountPageSize,
  }
  const accountsQuery = useQuery(userAccountSearchQueryOptions(accountQuery))
  const departmentsQuery = useQuery(departmentsQueryOptions)
  const programsQuery = useQuery(programsQueryOptions)
  const batchesQuery = useQuery(batchesQueryOptions)
  const semestersQuery = useQuery(semestersQueryOptions)
  const sectionsQuery = useQuery(sectionsQueryOptions)
  const sectionRoleOptions = roleOptionsForSection(sectionId)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<ProvisionedUserAccount | null>(null)
  const [viewingAccount, setViewingAccount] = useState<ProvisionedUserAccount | null>(null)
  const [accountToDelete, setAccountToDelete] = useState<ProvisionedUserAccount | null>(null)
  const [accountToReset, setAccountToReset] = useState<ProvisionedUserAccount | null>(null)
  const [isImportOpen, setIsImportOpen] = useState(false)
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

  const visibleAccounts =
    accountsQuery.data?.users.filter((account) => accountMatchesSection(account, sectionId)) ?? []

  function submitAccount(values: CreateUserAccountFormValues) {
    const role = sectionRoleOptions.includes(values.role) ? values.role : fixedRole
    const payload = {
      ...values,
      role,
      email: values.email.trim().toLowerCase(),
      fullName: values.fullName.trim(),
      profilePictureUrl: cleanOptional(values.profilePictureUrl),
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
        <div className="flex flex-wrap gap-2">
          {sectionId === 'students' ? (
            <Button type="button" variant="outline" onClick={() => setIsImportOpen(true)}>
              Import CSV
            </Button>
          ) : null}
          <Button type="button" onClick={openCreateSheet}>
            <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} data-icon="inline-start" />
            Create account
          </Button>
        </div>
      </div>

      <AccountDirectoryFilters
        batches={batchesQuery.data?.batches ?? []}
        departments={departmentsQuery.data?.departments ?? []}
        kind={accountSectionKind(sectionId)}
        onChange={(field, value) => {
          setFilters((current) => ({ ...current, [field]: value }))
          setPage(1)
        }}
        onClear={() => {
          setFilters(initialAccountFilters(sectionId))
          setPage(1)
        }}
        programs={programsQuery.data?.programs ?? []}
        sections={sectionsQuery.data?.sections ?? []}
        semesters={semestersQuery.data?.semesters ?? []}
        values={filters}
      />

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

      {accountsQuery.data && accountsQuery.data.totalPages > 1 ? (
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-sm">
            Page {accountsQuery.data.page} of {accountsQuery.data.totalPages} ·{' '}
            {accountsQuery.data.total} accounts
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page === 1 || accountsQuery.isFetching}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= accountsQuery.data.totalPages || accountsQuery.isFetching}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

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
      <StudentImportSheet open={isImportOpen} onOpenChange={setIsImportOpen} />
    </div>
  )
}
