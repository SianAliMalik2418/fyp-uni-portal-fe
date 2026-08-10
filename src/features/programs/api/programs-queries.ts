import { queryOptions } from '@tanstack/react-query'
import { listPrograms } from './programs-api'

export const programKeys = {
  all: ['programs'] as const,
  lists: () => [...programKeys.all, 'list'] as const,
}

export const programsQueryOptions = queryOptions({
  queryKey: programKeys.lists(),
  queryFn: listPrograms,
})
