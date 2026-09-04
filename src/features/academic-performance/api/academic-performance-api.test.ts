import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/api/http-client'
import {
  listAcademicPerformanceOfferings,
  listAttendanceShortages,
} from './academic-performance-api'

describe('academic performance search API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sends result offering filters to the backend', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { offerings: [] } })
    const query = {
      search: 'programming',
      programId: 'program-1',
      semesterId: 'semester-1',
      sectionId: 'section-1',
      resultStatus: 'pending' as const,
      limit: 50,
    }

    await listAcademicPerformanceOfferings(query)

    expect(get).toHaveBeenCalledWith('/academic-performance/offerings', { params: query })
  })

  it('sends attendance shortage filters and pagination to the backend', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: { shortages: [], page: 1, limit: 20, total: 0, totalPages: 0 },
    })
    const query = {
      studentSearch: 'ayesha',
      programId: 'program-1',
      page: 1,
      limit: 20,
    }

    await listAttendanceShortages(query)

    expect(get).toHaveBeenCalledWith('/attendance/shortages', { params: query })
  })
})
