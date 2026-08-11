import { queryOptions } from '@tanstack/react-query'
import { getOwnUserAccount, listUserAccounts } from './user-accounts-api'

export const userAccountKeys = {
  all: ['user-accounts'] as const,
  lists: () => [...userAccountKeys.all, 'list'] as const,
  own: () => [...userAccountKeys.all, 'me'] as const,
}

export const userAccountsQueryOptions = queryOptions({
  queryKey: userAccountKeys.lists(),
  queryFn: listUserAccounts,
})

export const ownUserAccountQueryOptions = queryOptions({
  queryKey: userAccountKeys.own(),
  queryFn: getOwnUserAccount,
})
