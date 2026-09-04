import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { AuditLogListQuery } from '../types/audit-log.types'
import { listAuditLogs } from './audit-logs-api'

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  list: (query: AuditLogListQuery) => [...auditLogKeys.all, 'list', query] as const,
}

export const auditLogsQueryOptions = (query: AuditLogListQuery) =>
  queryOptions({
    queryKey: auditLogKeys.list(query),
    queryFn: () => listAuditLogs(query),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
