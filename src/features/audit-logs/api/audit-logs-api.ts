import { apiClient } from '@/shared/api/http-client'
import type { AuditLogListQuery, AuditLogsResponse } from '../types/audit-log.types'

export async function listAuditLogs(query: AuditLogListQuery) {
  const { data } = await apiClient.get<AuditLogsResponse>('/audit-logs', { params: query })
  return data
}
