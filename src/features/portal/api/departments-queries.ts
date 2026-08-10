import { queryOptions } from '@tanstack/react-query'
import { listDepartments } from './departments-api'

export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
}

export const departmentsQueryOptions = queryOptions({
  queryKey: departmentKeys.lists(),
  queryFn: listDepartments,
})
