import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/api/http-client'
import { listAuditLogs } from './audit-logs-api'

describe('audit log API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sends server-side filters and pagination', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: { auditLogs: [], page: 2, limit: 20, total: 0, totalPages: 0 },
    })
    const query = {
      module: 'fees' as const,
      action: 'updated' as const,
      actorRole: 'admin' as const,
      page: 2,
      limit: 20,
    }

    await listAuditLogs(query)

    expect(get).toHaveBeenCalledWith('/audit-logs', { params: query })
  })
})
