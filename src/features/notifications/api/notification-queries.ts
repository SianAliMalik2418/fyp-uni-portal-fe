import { queryOptions } from '@tanstack/react-query'
import { listNotifications } from './notifications-api'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
}

export const notificationsQueryOptions = queryOptions({
  queryKey: notificationKeys.list(),
  queryFn: listNotifications,
  staleTime: 30_000,
  refetchInterval: 60_000,
})
