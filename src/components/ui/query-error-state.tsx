import { useState } from 'react'
import {
  AlertCircleIcon,
  RefreshIcon,
  ServerStack01Icon,
  WifiDisconnected01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { queryClient } from '@/app/query-client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getApiErrorKind, getApiErrorMessage } from '@/shared/api/http-client'

type QueryErrorStateProps = {
  className?: string
  error: unknown
  onRetry?: () => unknown
  /** What failed to load, in lower case, for example "programs". */
  resource: string
}

const icons = {
  network: WifiDisconnected01Icon,
  server: ServerStack01Icon,
  'rate-limit': AlertCircleIcon,
  request: AlertCircleIcon,
}

function refetchFailedQueries() {
  return queryClient.refetchQueries({ predicate: (query) => query.state.status === 'error' })
}

export function QueryErrorState({ className, error, onRetry, resource }: QueryErrorStateProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  async function retry() {
    setIsRetrying(true)
    try {
      await (onRetry ? onRetry() : refetchFailedQueries())
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div
      role="alert"
      className={cn(
        'bg-muted/30 flex flex-col items-center gap-4 rounded-lg border border-dashed px-6 py-10 text-center',
        className
      )}
    >
      <div className="bg-background text-muted-foreground grid size-10 place-items-center rounded-lg border">
        <HugeiconsIcon icon={icons[getApiErrorKind(error)]} strokeWidth={2} className="size-5" />
      </div>
      <div className="grid max-w-md gap-1">
        <p className="text-foreground text-sm font-medium">We couldn&apos;t load {resource}</p>
        <p className="text-muted-foreground text-sm">
          {getApiErrorMessage(error, 'Something went wrong. Please try again.')}
        </p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={retry} disabled={isRetrying}>
        <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} data-icon="inline-start" />
        {isRetrying ? 'Trying again…' : 'Try again'}
      </Button>
    </div>
  )
}
