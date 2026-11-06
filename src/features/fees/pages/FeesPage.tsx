import { useDeferredValue, useEffect, useState, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { SearchIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast-manager'
import type { PortalUser } from '@/features/auth/types/auth.types'
import { userAccountSearchQueryOptions } from '@/features/user-accounts/api/user-accounts-queries'
import type { ProvisionedUserAccount } from '@/features/user-accounts/types/user-account.types'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { saveStudentFee } from '../api/fees-api'
import { feeKeys, ownFeeQueryOptions, studentFeeQueryOptions } from '../api/fees-queries'
import { FeeForm } from '../components/FeeForm'
import { FeeInformationCard } from '../components/FeeInformationCard'
import { StudentFeePicker } from '../components/StudentFeePicker'
import { feeFormSchema, type FeeFormValues } from '../schemas/fee.schemas'
import { emptyFeeFormValues, feeFormToPayload, feeToFormValues } from '../utils/fee-formatters'

export function FeesPage({ user }: { user: PortalUser }) {
  return user.role === 'admin' ? <AdminFeesPage /> : <StudentFeesPage />
}

function StudentFeesPage() {
  const feeQuery = useQuery(ownFeeQueryOptions)

  return (
    <FeePageShell description="View your current semester balance and recorded payment information.">
      {feeQuery.isPending ? <FeePageSkeleton /> : null}
      {feeQuery.isError ? <FeeQueryError error={feeQuery.error} /> : null}
      {feeQuery.isSuccess && feeQuery.data.fee ? (
        <FeeInformationCard fee={feeQuery.data.fee} />
      ) : null}
      {feeQuery.isSuccess && !feeQuery.data.fee ? (
        <EmptyFeeState message="No fee information has been recorded for your current semester." />
      ) : null}
    </FeePageShell>
  )
}

function AdminFeesPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const search = useDeferredValue(searchTerm.trim())
  const accountsQuery = useQuery(
    userAccountSearchQueryOptions({
      role: 'student',
      search: search || undefined,
      page,
      limit: 50,
    })
  )
  const [selectedStudent, setSelectedStudent] = useState<ProvisionedUserAccount | null>(null)
  const selectedStudentId = selectedStudent?.id ?? ''
  const feeQuery = useQuery(studentFeeQueryOptions(selectedStudentId))
  const form = useForm<FeeFormValues>({
    resolver: zodResolver(feeFormSchema),
    defaultValues: emptyFeeFormValues(),
  })
  const { reset } = form

  useEffect(() => {
    if (feeQuery.isSuccess) {
      reset(feeToFormValues(feeQuery.data.fee))
    }
  }, [feeQuery.data, feeQuery.isSuccess, reset])

  const saveMutation = useMutation({
    mutationFn: saveStudentFee,
    onSuccess: async (response, variables) => {
      queryClient.setQueryData(feeKeys.student(variables.studentId), { fee: response.fee })
      await queryClient.invalidateQueries({
        queryKey: feeKeys.student(variables.studentId),
        refetchType: 'none',
      })
      toast.add({ title: 'Fee information saved', type: 'success' })
    },
    onError: (error) => {
      toast.add({
        title: 'Fee update failed',
        description: getApiErrorMessage(error, 'Unable to save fee information'),
        type: 'error',
        priority: 'high',
      })
    },
  })

  function submitFee(values: FeeFormValues) {
    if (!selectedStudentId) {
      return
    }

    saveMutation.mutate({ studentId: selectedStudentId, payload: feeFormToPayload(values) })
  }

  return (
    <FeePageShell description="Select a student and maintain their current semester fee record.">
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="bg-background self-start">
          <CardHeader className="border-b">
            <CardTitle>Students</CardTitle>
            <CardDescription>Search by name, registration number, or email.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <HugeiconsIcon
                icon={SearchIcon}
                strokeWidth={2}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
              />
              <Input
                className="pl-8"
                aria-label="Find student"
                placeholder="Find student"
                value={searchTerm}
                onValueChange={(value) => {
                  setSearchTerm(value)
                  setPage(1)
                }}
              />
            </div>
            <StudentFeePicker
              error={accountsQuery.error}
              isError={accountsQuery.isError}
              isPending={accountsQuery.isPending}
              onSelect={(studentId) => {
                const student = accountsQuery.data?.users.find(
                  (account) => account.id === studentId
                )
                if (student) setSelectedStudent(student)
              }}
              selectedStudentId={selectedStudentId}
              students={accountsQuery.data?.users ?? []}
            />
            {accountsQuery.data && accountsQuery.data.totalPages > 1 ? (
              <div className="mt-3 grid gap-2">
                <p className="text-muted-foreground text-sm">
                  Page {accountsQuery.data.page} of {accountsQuery.data.totalPages} ·{' '}
                  {accountsQuery.data.total} accounts
                </p>
                <div className="grid grid-cols-2 gap-2">
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
          </CardContent>
        </Card>

        {!selectedStudent ? (
          <EmptyFeeState message="Select a student to view or update fee information." />
        ) : feeQuery.isPending ? (
          <FeePageSkeleton />
        ) : feeQuery.isError ? (
          <FeeQueryError error={feeQuery.error} />
        ) : (
          <FeeForm
            form={form}
            isSubmitting={saveMutation.isPending}
            onSubmit={submitFee}
            student={selectedStudent}
          />
        )}
      </div>
    </FeePageShell>
  )
}

function FeePageShell({ children, description }: { children: ReactNode; description: string }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">Fees</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {children}
    </div>
  )
}

function FeePageSkeleton() {
  return (
    <div className="grid gap-3" aria-busy="true">
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-56 w-full" />
    </div>
  )
}

function FeeQueryError({ error }: { error: unknown }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Fee information unavailable</AlertTitle>
      <AlertDescription>
        {getApiErrorMessage(error, 'Unable to load fee information')}
      </AlertDescription>
    </Alert>
  )
}

function EmptyFeeState({ message }: { message: string }) {
  return (
    <Card className="bg-background">
      <CardContent className="grid min-h-48 place-items-center text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
      </CardContent>
    </Card>
  )
}
