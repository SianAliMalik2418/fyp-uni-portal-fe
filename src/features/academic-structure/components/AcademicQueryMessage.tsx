import type { ReactNode } from 'react'
import { getApiErrorMessage } from '@/shared/api/http-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TableSkeleton } from '@/components/ui/table-skeleton'

type QueryState = {
  error: unknown
  isError: boolean
  isPending: boolean
}

type AcademicQueryMessageProps = {
  emptyIcon: ReactNode
  emptyText: string
  emptyTitle: string
  query: QueryState
  skeletonColumns: number
  title: string
}

export function AcademicQueryMessage({
  emptyIcon,
  emptyText,
  emptyTitle,
  query,
  skeletonColumns,
  title,
}: AcademicQueryMessageProps) {
  if (query.isPending) {
    return <TableSkeleton columns={skeletonColumns} />
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{title} unavailable</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(query.error, `Unable to load ${title}`)}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="bg-muted/30 grid min-h-44 place-items-center rounded-md border border-dashed px-4 text-center">
      <div className="grid justify-items-center gap-2">
        <div className="bg-background text-muted-foreground grid size-10 place-items-center rounded-md border">
          {emptyIcon}
        </div>
        <p className="text-foreground text-sm font-medium">{emptyTitle}</p>
        <p className="text-muted-foreground max-w-sm text-sm">{emptyText}</p>
      </div>
    </div>
  )
}
