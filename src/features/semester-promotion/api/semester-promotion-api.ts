import { apiClient } from '@/shared/api/http-client'
import type {
  PromotionCandidatesResponse,
  PromotionRequest,
  PromotionResponse,
  PromotionSelection,
} from '../types/semester-promotion.types'

export async function getPromotionCandidates(selection: PromotionSelection) {
  const { data } = await apiClient.get<PromotionCandidatesResponse>(
    '/users/promotions/candidates',
    { params: selection }
  )
  return data
}

export async function promoteStudents(request: PromotionRequest) {
  const { data } = await apiClient.post<PromotionResponse>('/users/promotions', request)
  return data
}
