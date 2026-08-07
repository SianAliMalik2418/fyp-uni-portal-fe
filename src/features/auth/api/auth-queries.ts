import { queryOptions } from '@tanstack/react-query'
import { getCurrentUser } from './auth-api'

export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
}

export const currentUserQueryOptions = queryOptions({
  queryKey: authKeys.currentUser(),
  queryFn: getCurrentUser,
})
