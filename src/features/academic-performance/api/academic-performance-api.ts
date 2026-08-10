import { apiClient } from '@/shared/api/http-client'
import type { AcademicPerformanceContext } from '../types/academic-performance.types'

export async function getAcademicPerformanceContext() {
  const { data } = await apiClient.get<AcademicPerformanceContext>('/academic-performance/context')
  return data
}
