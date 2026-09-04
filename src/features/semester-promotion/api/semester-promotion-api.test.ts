import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/api/http-client'
import { getPromotionCandidates, promoteStudents } from './semester-promotion-api'

vi.mock('@/shared/api/http-client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

describe('semester promotion API', () => {
  beforeEach(() => vi.clearAllMocks())

  it('previews and submits the exact source, target, and exclusions', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { students: [] } })
    vi.mocked(apiClient.post).mockResolvedValue({ data: { promoted: [] } })
    const selection = { sourceSectionId: 'source', targetSectionId: 'target' }

    await getPromotionCandidates(selection)
    await promoteStudents({ ...selection, excludedStudentIds: ['student-2'] })

    expect(apiClient.get).toHaveBeenCalledWith('/users/promotions/candidates', {
      params: selection,
    })
    expect(apiClient.post).toHaveBeenCalledWith('/users/promotions', {
      ...selection,
      excludedStudentIds: ['student-2'],
    })
  })
})
