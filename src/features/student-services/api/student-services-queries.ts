import { queryOptions } from '@tanstack/react-query'
import { getStudentServiceContext } from './student-services-api'

export const studentServicesKeys = {
  all: ['student-services'] as const,
  context: () => [...studentServicesKeys.all, 'context'] as const,
}

export const studentServiceContextQueryOptions = queryOptions({
  queryKey: studentServicesKeys.context(),
  queryFn: getStudentServiceContext,
})
