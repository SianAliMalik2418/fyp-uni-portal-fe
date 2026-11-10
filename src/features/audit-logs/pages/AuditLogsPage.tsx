import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { auditLogsQueryOptions } from '../api/audit-log-queries'
import { AuditLogFilters } from '../components/AuditLogFilters'
import { AuditLogTable } from '../components/AuditLogTable'
import type {
  AuditAction,
  AuditActorRole,
  AuditLogListQuery,
  AuditModule,
} from '../types/audit-log.types'
import { QueryErrorState } from '@/components/ui/query-error-state'

const pageSize = 20

export function AuditLogsPage() {
  const [module, setModule] = useState<AuditModule>()
  const [action, setAction] = useState<AuditAction>()
  const [actorRole, setActorRole] = useState<AuditActorRole>()
  const [page, setPage] = useState(1)
  const query: AuditLogListQuery = {
    ...(module ? { module } : {}),
    ...(action ? { action } : {}),
    ...(actorRole ? { actorRole } : {}),
    page,
    limit: pageSize,
  }
  const auditLogsQuery = useQuery(auditLogsQueryOptions(query))

  function updateFilter<T>(setter: (value?: T) => void, value?: T) {
    setter(value)
    setPage(1)
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div>
        <h1 className="text-foreground text-2xl leading-tight font-semibold">Audit log</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Review administrative and academic changes across the portal.
        </p>
      </div>

      <AuditLogFilters
        action={action}
        actorRole={actorRole}
        module={module}
        onActionChange={(value) => updateFilter(setAction, value)}
        onActorRoleChange={(value) => updateFilter(setActorRole, value)}
        onModuleChange={(value) => updateFilter(setModule, value)}
      />

      {auditLogsQuery.isError ? (
        <QueryErrorState resource="audit log" error={auditLogsQuery.error} />
      ) : (
        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {auditLogsQuery.isPending ? (
              <TableSkeleton columns={6} />
            ) : auditLogsQuery.data.auditLogs.length > 0 ? (
              <AuditLogTable auditLogs={auditLogsQuery.data.auditLogs} />
            ) : (
              <div className="px-6 py-14 text-center">
                <p className="text-foreground font-medium">No audit activity found</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Try clearing a filter or check again after portal changes are made.
                </p>
              </div>
            )}
          </CardContent>
          {auditLogsQuery.data && auditLogsQuery.data.totalPages > 1 ? (
            <CardFooter className="flex-col items-stretch justify-between gap-3 border-t py-4 sm:flex-row sm:items-center">
              <p className="text-muted-foreground text-sm">
                Page {auditLogsQuery.data.page} of {auditLogsQuery.data.totalPages}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page === 1 || auditLogsQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={page >= auditLogsQuery.data.totalPages || auditLogsQuery.isFetching}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          ) : null}
        </Card>
      )}
    </div>
  )
}
