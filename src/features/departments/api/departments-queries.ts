import { queryOptions } from '@tanstack/react-query'
import { DEFAULT_TABLE_PAGE_SIZE, REFERENCE_LIST_LIMIT } from '@/shared/constants/pagination'
import { listDepartments } from './departments-api'

export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  listPage: (page: number) => [...departmentKeys.lists(), page] as const,
}

export const departmentsQueryOptions = queryOptions({
  queryKey: departmentKeys.lists(),
  queryFn: () => listDepartments({ page: 1, limit: REFERENCE_LIST_LIMIT }),
})

export const departmentsTableQueryOptions = (page: number) =>
  queryOptions({
    queryKey: departmentKeys.listPage(page),
    queryFn: () => listDepartments({ page, limit: DEFAULT_TABLE_PAGE_SIZE }),
  })
