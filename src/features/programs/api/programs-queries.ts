import { queryOptions } from '@tanstack/react-query'
import { DEFAULT_TABLE_PAGE_SIZE, REFERENCE_LIST_LIMIT } from '@/shared/constants/pagination'
import { listPrograms } from './programs-api'

export const programKeys = {
  all: ['programs'] as const,
  lists: () => [...programKeys.all, 'list'] as const,
  listPage: (page: number) => [...programKeys.lists(), page] as const,
}

export const programsQueryOptions = queryOptions({
  queryKey: programKeys.lists(),
  queryFn: () => listPrograms({ page: 1, limit: REFERENCE_LIST_LIMIT }),
})

export const programsTableQueryOptions = (page: number) =>
  queryOptions({
    queryKey: programKeys.listPage(page),
    queryFn: () => listPrograms({ page, limit: DEFAULT_TABLE_PAGE_SIZE }),
  })
