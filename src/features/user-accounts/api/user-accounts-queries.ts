import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { UserAccountListQuery } from '../types/user-account.types'
import { getOwnUserAccount, listUserAccounts } from './user-accounts-api'

const defaultUserAccountQuery: UserAccountListQuery = { page: 1, limit: 50 }

export const userAccountKeys = {
  all: ['user-accounts'] as const,
  lists: () => [...userAccountKeys.all, 'list'] as const,
  list: (query: UserAccountListQuery) => [...userAccountKeys.lists(), query] as const,
  own: () => [...userAccountKeys.all, 'me'] as const,
}

export const userAccountsQueryOptions = queryOptions({
  queryKey: userAccountKeys.list(defaultUserAccountQuery),
  queryFn: () => listUserAccounts(defaultUserAccountQuery),
})

export const userAccountSearchQueryOptions = (query: UserAccountListQuery) =>
  queryOptions({
    queryKey: userAccountKeys.list(query),
    queryFn: () => listUserAccounts(query),
    placeholderData: keepPreviousData,
  })

export const ownUserAccountQueryOptions = queryOptions({
  queryKey: userAccountKeys.own(),
  queryFn: getOwnUserAccount,
})
