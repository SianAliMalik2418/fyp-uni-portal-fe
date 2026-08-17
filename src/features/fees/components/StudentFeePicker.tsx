import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProvisionedUserAccount } from '@/features/user-accounts/types/user-account.types'
import { getApiErrorMessage } from '@/shared/api/http-client'

export function StudentFeePicker({
  error,
  isError,
  isPending,
  onSelect,
  selectedStudentId,
  students,
}: {
  error: unknown
  isError: boolean
  isPending: boolean
  onSelect: (studentId: string) => void
  selectedStudentId: string
  students: ProvisionedUserAccount[]
}) {
  if (isPending) {
    return (
      <div className="grid gap-2" aria-busy="true">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Students unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(error, 'Unable to load student accounts')}
        </AlertDescription>
      </Alert>
    )
  }

  if (!students.length) {
    return <p className="text-muted-foreground py-6 text-center text-sm">No students found.</p>
  }

  return (
    <div className="grid max-h-96 gap-2 overflow-y-auto" aria-label="Student fee accounts">
      {students.map((student) => (
        <Button
          key={student.id}
          type="button"
          variant={student.id === selectedStudentId ? 'secondary' : 'outline'}
          className="h-auto justify-start px-3 py-2 text-left"
          aria-label={`Manage fee for ${student.fullName}`}
          onClick={() => onSelect(student.id)}
        >
          <span className="min-w-0">
            <span className="block truncate font-medium">{student.fullName}</span>
            <span className="text-muted-foreground block truncate text-xs">
              {student.registrationNumber ?? student.email}
            </span>
          </span>
        </Button>
      ))}
    </div>
  )
}
