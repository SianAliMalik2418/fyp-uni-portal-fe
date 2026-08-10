import { queryOptions } from '@tanstack/react-query'
import { getAcademicPerformanceContext } from './academic-performance-api'

export const academicPerformanceKeys = {
  all: ['academic-performance'] as const,
  context: () => [...academicPerformanceKeys.all, 'context'] as const,
}

export const academicPerformanceContextQueryOptions = queryOptions({
  queryKey: academicPerformanceKeys.context(),
  queryFn: getAcademicPerformanceContext,
})
