import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getApiErrorMessage } from '@/shared/api/http-client'

export function DashboardQueryError({ error }: { error: unknown }) {
  return (
    <Alert variant="destructive">
      <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4" />
      <AlertTitle>Dashboard unavailable</AlertTitle>
      <AlertDescription>
        {getApiErrorMessage(error, 'Unable to load dashboard information.')}
      </AlertDescription>
    </Alert>
  )
}
