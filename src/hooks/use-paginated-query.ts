import { useState } from 'react'
import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'

export function usePaginatedQuery<TData, TError = Error, TQueryKey extends QueryKey = QueryKey>(
  queryOptionsForPage: (page: number) => UseQueryOptions<TData, TError, TData, TQueryKey>
) {
  const [page, setPage] = useState(1)
  const query = useQuery(queryOptionsForPage(page))

  return { page, setPage, query }
}
