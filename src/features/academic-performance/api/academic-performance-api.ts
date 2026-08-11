import { apiClient } from '@/shared/api/http-client'
import type {
  AcademicPerformanceContext,
  AcademicPerformanceOfferingStudentsResponse,
  AcademicPerformanceOfferingsResponse,
} from '../types/academic-performance.types'

export async function getAcademicPerformanceContext() {
  const { data } = await apiClient.get<AcademicPerformanceContext>('/academic-performance/context')
  return data
}

export async function listAcademicPerformanceOfferings() {
  const { data } = await apiClient.get<AcademicPerformanceOfferingsResponse>(
    '/academic-performance/offerings'
  )
  return data
}

export async function listAcademicPerformanceOfferingStudents(offeringId: string) {
  const { data } = await apiClient.get<AcademicPerformanceOfferingStudentsResponse>(
    `/academic-performance/offerings/${offeringId}/students`
  )
  return data
}
