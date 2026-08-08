import { queryOptions } from '@tanstack/react-query'
import { listUserAccounts } from './user-accounts-api'

export const userAccountKeys = {
  all: ['user-accounts'] as const,
  lists: () => [...userAccountKeys.all, 'list'] as const,
}

export const userAccountsQueryOptions = queryOptions({
  queryKey: userAccountKeys.lists(),
  queryFn: listUserAccounts,
})
