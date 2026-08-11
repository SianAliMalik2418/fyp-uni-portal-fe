import { queryOptions } from '@tanstack/react-query'
import {
  getAcademicPerformanceContext,
  listAcademicPerformanceOfferingStudents,
  listAcademicPerformanceOfferings,
} from './academic-performance-api'

export const academicPerformanceKeys = {
  all: ['academic-performance'] as const,
  context: () => [...academicPerformanceKeys.all, 'context'] as const,
  offerings: () => [...academicPerformanceKeys.all, 'offerings'] as const,
  offeringStudents: (offeringId: string) =>
    [...academicPerformanceKeys.offerings(), offeringId, 'students'] as const,
}

export const academicPerformanceContextQueryOptions = queryOptions({
  queryKey: academicPerformanceKeys.context(),
  queryFn: getAcademicPerformanceContext,
})

export const academicPerformanceOfferingsQueryOptions = queryOptions({
  queryKey: academicPerformanceKeys.offerings(),
  queryFn: listAcademicPerformanceOfferings,
})

export const academicPerformanceOfferingStudentsQueryOptions = (offeringId: string) =>
  queryOptions({
    queryKey: academicPerformanceKeys.offeringStudents(offeringId),
    queryFn: () => listAcademicPerformanceOfferingStudents(offeringId),
    enabled: Boolean(offeringId),
  })
