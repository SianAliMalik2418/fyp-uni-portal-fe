import { queryOptions } from '@tanstack/react-query'
import type { AnnouncementStatus } from '../types/announcement.types'
import { listAnnouncements } from './announcements-api'

export const announcementKeys = {
  all: ['announcements'] as const,
  list: (status: AnnouncementStatus, page: number) =>
    [...announcementKeys.all, 'list', status, page] as const,
}

export const announcementsQueryOptions = (status: AnnouncementStatus, page = 1) =>
  queryOptions({
    queryKey: announcementKeys.list(status, page),
    queryFn: () => listAnnouncements({ status, page }),
    staleTime: 30_000,
  })
